import json
from uuid import UUID
from typing import List, Dict, Tuple
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    WebSocket,
    WebSocketDisconnect,
    Query,
)
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db, SessionLocal
from app.core.security import decode_token
from app.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.proposal import Proposal
from app.models.chat import ChatMessage
from app.schemas.chat import ChatMessageCreate, ChatMessageResponse

router = APIRouter(prefix="/chat", tags=["Realtime Collaboration Chat"])


# ============================================================================
# 1. WEBSOCKET CONNECTION MANAGER (ROOM ISOLATION)
# ============================================================================
class ConnectionManager:
    def __init__(self):
        # Format: { "project_id_str": [WebSocket, WebSocket, ...] }
        self.active_rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_rooms:
            self.active_rooms[room_id] = []
        self.active_rooms[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_rooms:
            if websocket in self.active_rooms[room_id]:
                self.active_rooms[room_id].remove(websocket)
            if not self.active_rooms[room_id]:
                del self.active_rooms[room_id]

    async def broadcast(self, room_id: str, message: dict):
        if room_id in self.active_rooms:
            dead_connections = []
            for connection in self.active_rooms[room_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    dead_connections.append(connection)

            # Bersihkan koneksi yang terputus tanpa raise error
            for dead in dead_connections:
                if dead in self.active_rooms.get(room_id, []):
                    self.active_rooms[room_id].remove(dead)


manager = ConnectionManager()


# ============================================================================
# 2. HELPER: SENDER PROFILE RESOLVER & ACCESS AUTHORIZATION
# ============================================================================
def resolve_sender_display(user: User) -> Tuple[str, str]:
    """Mendapatkan nama tampilan dan role pengguna untuk bubble chat."""
    if not user:
        return ("Pengguna", "USER")

    role_str = user.role.value if hasattr(user.role, "value") else str(user.role)

    # Cek profil mahasiswa
    if hasattr(user, "profile_mhs") and user.profile_mhs and user.profile_mhs.nama_lengkap:
        return (user.profile_mhs.nama_lengkap, role_str)

    # Cek profil UMKM
    if hasattr(user, "profile_umkm") and user.profile_umkm and user.profile_umkm.nama_usaha:
        return (user.profile_umkm.nama_usaha, role_str)

    # Fallback ke prefix email
    name_fallback = user.email.split("@")[0] if user.email else "Pengguna"
    return (name_fallback, role_str)


def verify_project_participation(project_id: UUID, user: User, db: Session) -> Project:
    """
    Memastikan hanya Pemilik Proyek (UMKM) atau Mahasiswa Pelamar/Pekerja (atau Admin)
    yang diizinkan masuk ke ruang obrolan proyek.
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyek tidak ditemukan.",
        )

    # 1. Klien pemilik proyek (UMKM)
    if project.umkm_id == user.id:
        return project

    # 2. Mahasiswa yang melamar atau diterima di proyek ini
    proposal = (
        db.query(Proposal)
        .filter(
            Proposal.project_id == project_id,
            Proposal.mhs_id == user.id,
        )
        .first()
    )
    if proposal:
        return project

    # 3. Seluruh pengguna aktif (mahasiswa yang ingin berdiskusi pra-lamaran/tanya brief)
    if user and user.is_active:
        return project

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Anda tidak memiliki akses ke ruang obrolan proyek ini.",
    )


# ============================================================================
# 3. REST ENDPOINT: GET CHAT HISTORY
# ============================================================================
@router.get("/project/{project_id}/messages", response_model=List[ChatMessageResponse])
def get_chat_messages(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mengambil riwayat percakapan chat proyek dan menandai pesan lawan bicara sudah dibaca.
    """
    verify_project_participation(project_id, current_user, db)

    # Ambil pesan terurut dari yang terlama ke terbaru
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.project_id == project_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

    # Otomatis tandai pesan masuk yang belum dibaca sebagai sudah dibaca
    unread_messages = [
        m for m in messages if not m.is_read and m.sender_id != current_user.id
    ]
    if unread_messages:
        for m in unread_messages:
            m.is_read = True
        db.commit()

    # Format response dengan nama dan role pengirim
    response_list = []
    for m in messages:
        sender_name, sender_role = resolve_sender_display(m.sender)

        response_list.append(
            ChatMessageResponse(
                id=m.id,
                project_id=m.project_id,
                sender_id=m.sender_id,
                sender_name=sender_name,
                sender_role=sender_role,
                message=m.message,
                attachment_url=m.attachment_url,
                attachment_type=m.attachment_type,
                is_read=m.is_read,
                created_at=m.created_at,
            )
        )

    return response_list


# ============================================================================
# 4. REST ENDPOINT: SEND MESSAGE (HTTP FALLBACK)
# ============================================================================
@router.post("/project/{project_id}/messages", response_model=ChatMessageResponse)
async def send_chat_message(
    project_id: UUID,
    body: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Kirim pesan chat melalui REST API (juga membroadcast ke WebSocket aktif).
    """
    verify_project_participation(project_id, current_user, db)

    msg_content = body.message or (body.attachment_url and "Lampiran tautan berkas")
    if not msg_content and not body.attachment_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pesan atau lampiran tidak boleh kosong.",
        )

    new_msg = ChatMessage(
        project_id=project_id,
        sender_id=current_user.id,
        message=msg_content or "Lampiran tautan berkas",
        attachment_url=body.attachment_url,
        attachment_type=body.attachment_type,
        is_read=False,
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    sender_name, sender_role = resolve_sender_display(current_user)

    msg_response = ChatMessageResponse(
        id=new_msg.id,
        project_id=new_msg.project_id,
        sender_id=new_msg.sender_id,
        sender_name=sender_name,
        sender_role=sender_role,
        message=new_msg.message,
        attachment_url=new_msg.attachment_url,
        attachment_type=new_msg.attachment_type,
        is_read=new_msg.is_read,
        created_at=new_msg.created_at,
    )

    # Broadcast instan ke siapapun yang sedang online di room proyek ini
    broadcast_payload = json.loads(msg_response.model_dump_json())
    await manager.broadcast(str(project_id), broadcast_payload)

    return msg_response


# ============================================================================
# 5. REST ENDPOINT: MARK MESSAGES AS READ
# ============================================================================
@router.patch("/project/{project_id}/read")
def mark_messages_as_read(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Menandai semua pesan yang belum dibaca dari lawan bicara sebagai sudah dibaca."""
    verify_project_participation(project_id, current_user, db)

    unread_messages = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.project_id == project_id,
            ChatMessage.sender_id != current_user.id,
            ChatMessage.is_read == False,
        )
        .all()
    )

    for m in unread_messages:
        m.is_read = True

    db.commit()
    return {"status": "success", "marked_read_count": len(unread_messages)}


# ============================================================================
# 6. WEBSOCKET ENDPOINT: REAL-TIME COLLABORATION SOCKET
# ============================================================================
@router.websocket("/ws/project/{project_id}")
async def websocket_chat_endpoint(
    websocket: WebSocket,
    project_id: UUID,
    token: str = Query(..., description="JWT Access Token"),
):
    """
    WebSocket Endpoint untuk chat realtime:
    ws://localhost:8000/v1/chat/ws/project/{project_id}?token={JWT_TOKEN}
    """
    # 1. Verifikasi Token Autentikasi JWT
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    user_id = payload.get("sub")
    db: Session = SessionLocal()

    try:
        current_user = db.query(User).filter(User.id == user_id).first()
        if not current_user or not current_user.is_active:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        # 2. Verifikasi Hak Akses Proyek
        try:
            verify_project_participation(project_id, current_user, db)
        except HTTPException:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        room_id = str(project_id)
        await manager.connect(websocket, room_id)

        # 3. Loop penerimaan & broadcast pesan realtime
        while True:
            data_text = await websocket.receive_text()
            try:
                data_json = json.loads(data_text)
                msg_text = str(data_json.get("message") or "").strip()
                att_url = data_json.get("attachment_url")
                att_type = data_json.get("attachment_type")

                if not msg_text and not att_url:
                    continue

                if att_type:
                    att_type = str(att_type).strip().upper()

                final_msg = msg_text or "Lampiran tautan berkas"

                # Simpan pesan ke database
                new_msg = ChatMessage(
                    project_id=project_id,
                    sender_id=current_user.id,
                    message=final_msg,
                    attachment_url=att_url,
                    attachment_type=att_type,
                    is_read=False,
                )
                db.add(new_msg)
                db.commit()
                db.refresh(new_msg)

                sender_name, sender_role = resolve_sender_display(current_user)

                broadcast_data = {
                    "id": str(new_msg.id),
                    "project_id": str(new_msg.project_id),
                    "sender_id": str(new_msg.sender_id),
                    "sender_name": sender_name,
                    "sender_role": sender_role,
                    "message": new_msg.message,
                    "attachment_url": new_msg.attachment_url,
                    "attachment_type": new_msg.attachment_type,
                    "is_read": new_msg.is_read,
                    "created_at": new_msg.created_at.isoformat(),
                }

                # Broadcast ke seluruh peserta yang sedang membuka chat room ini
                await manager.broadcast(room_id, broadcast_data)

            except json.JSONDecodeError:
                pass

    except WebSocketDisconnect:
        manager.disconnect(websocket, str(project_id))
    except Exception as e:
        manager.disconnect(websocket, str(project_id))
    finally:
        db.close()
