import json
from datetime import datetime
from uuid import UUID
from typing import List, Dict, Tuple, Optional
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
from app.models.user import User, UserRole
from app.models.project import Project, ProjectSlot, ProjectStatus
from app.models.proposal import Proposal, ProposalStatus
from app.models.wallet import Wallet, LedgerLog, TransactionType
from app.models.escrow import Escrow, EscrowStatus
from app.models.chat import ChatMessage
from app.models.notification import Notification, NotificationType
from app.schemas.chat import (
    ChatMessageCreate,
    ChatMessageResponse,
    ConversationItemResponse,
    GroupMemberItem,
)
from pydantic import BaseModel

class OfferRespondRequest(BaseModel):
    action: str  # "ACCEPT" | "REJECT"

router = APIRouter(prefix="/chat", tags=["Realtime Collaboration Chat"])


# ============================================================================
# 1. WEBSOCKET CONNECTION MANAGER (ROOM ISOLATION & USER PRESENCE)
# ============================================================================
class ConnectionManager:
    def __init__(self):
        # Format: { "room_id_str": { "user_id_str": [WebSocket, ...] } }
        self.active_rooms: Dict[str, Dict[str, List[WebSocket]]] = {}
        # Global user sockets: { "user_id_str": [WebSocket, ...] }
        self.active_users: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str, user_id: str):
        await websocket.accept()
        # 1. Register to room
        if room_id not in self.active_rooms:
            self.active_rooms[room_id] = {}
        if user_id not in self.active_rooms[room_id]:
            self.active_rooms[room_id][user_id] = []
        self.active_rooms[room_id][user_id].append(websocket)

        # 2. Register to global user sockets
        if user_id not in self.active_users:
            self.active_users[user_id] = []
        self.active_users[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str, user_id: str):
        # 1. Unregister from room
        if room_id in self.active_rooms and user_id in self.active_rooms[room_id]:
            if websocket in self.active_rooms[room_id][user_id]:
                self.active_rooms[room_id][user_id].remove(websocket)
            if not self.active_rooms[room_id][user_id]:
                del self.active_rooms[room_id][user_id]
            if not self.active_rooms[room_id]:
                del self.active_rooms[room_id]

        # 2. Unregister from global user sockets
        if user_id in self.active_users:
            if websocket in self.active_users[user_id]:
                self.active_users[user_id].remove(websocket)
            if not self.active_users[user_id]:
                del self.active_users[user_id]

    async def connect_user(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_users:
            self.active_users[user_id] = []
        self.active_users[user_id].append(websocket)

    def disconnect_user(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_users:
            if websocket in self.active_users[user_id]:
                self.active_users[user_id].remove(websocket)
            if not self.active_users[user_id]:
                del self.active_users[user_id]

    def is_user_online(self, user_id: str) -> bool:
        return bool(self.active_users.get(str(user_id)))

    def get_online_users_in_room(self, room_id: str) -> List[str]:
        if room_id in self.active_rooms:
            return list(self.active_rooms[room_id].keys())
        return []

    async def broadcast(self, room_id: str, message: dict):
        """Broadcast pesan ke seluruh websocket di ruang proyek tertentu."""
        if room_id in self.active_rooms:
            dead_connections = []
            for uid, sockets in list(self.active_rooms[room_id].items()):
                for ws in sockets:
                    try:
                        await ws.send_json(message)
                    except Exception:
                        dead_connections.append((uid, ws))

            for uid, dead in dead_connections:
                if room_id in self.active_rooms and uid in self.active_rooms[room_id]:
                    if dead in self.active_rooms[room_id][uid]:
                        self.active_rooms[room_id][uid].remove(dead)

    async def send_to_user(self, user_id: str, message: dict):
        """Kirim pesan langsung ke seluruh socket milik user tertentu (misal untuk sidebar / inbox realtime)."""
        uid_str = str(user_id)
        if uid_str in self.active_users:
            dead = []
            for ws in list(self.active_users[uid_str]):
                try:
                    await ws.send_json(message)
                except Exception:
                    dead.append(ws)
            for d in dead:
                if uid_str in self.active_users and d in self.active_users[uid_str]:
                    self.active_users[uid_str].remove(d)


manager = ConnectionManager()


# ============================================================================
# 2. HELPER: SENDER PROFILE RESOLVER & ACCESS AUTHORIZATION
# ============================================================================
def resolve_sender_display(user: User) -> Tuple[str, str, Optional[str]]:
    """Mendapatkan nama tampilan, role, dan foto profil pengguna untuk bubble chat."""
    if not user:
        return ("Pengguna", "USER", None)

    role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
    photo_url = None

    # Cek profil mahasiswa
    if hasattr(user, "profile_mhs") and user.profile_mhs:
        photo_url = user.profile_mhs.url_foto
        if user.profile_mhs.nama_lengkap:
            name = user.profile_mhs.nama_lengkap.strip()
            if name and name.lower() != "string":
                return (name, role_str, photo_url)

    # Cek profil UMKM
    if hasattr(user, "profile_umkm") and user.profile_umkm:
        photo_url = user.profile_umkm.url_foto_usaha
        if user.profile_umkm.nama_usaha:
            name = user.profile_umkm.nama_usaha.strip()
            if name and name.lower() != "string":
                return (name, role_str, photo_url)

    # Fallback ke username atau prefix email yang bersih
    if hasattr(user, "username") and user.username and user.username.lower() != "string":
        return (user.username.strip(), role_str, photo_url)

    if user.email and not user.email.startswith("user@example"):
        name_fallback = user.email.split("@")[0].replace(".", " ").title()
        return (name_fallback, role_str, photo_url)

    return ("Klien UMKM" if role_str == "UMKM" else "Mahasiswa", role_str, photo_url)


def resolve_user_sub_display(user: User) -> Optional[str]:
    """Mendapatkan teks deskriptif sub-baris pengguna (prodi/usaha) selalu bertipe string aman serialisasi."""
    if not user:
        return None
    if hasattr(user, "profile_mhs") and user.profile_mhs:
        prodi_obj = getattr(user.profile_mhs, "prodi", None)
        if prodi_obj:
            return getattr(prodi_obj, "nama_prodi", str(prodi_obj))
        return "Mahasiswa"
    elif hasattr(user, "profile_umkm") and user.profile_umkm:
        return user.profile_umkm.nama_usaha or "Klien UMKM"
    return None


def resolve_project_member_role(user: User, project: Optional[Project]) -> str:
    """Mendapatkan label peran spesifik anggota dalam konteks proyek (e.g. Project Owner, UI/UX Designer, Frontend Dev)."""
    if not user:
        return "Pengguna"
    if not project:
        role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
        return "Project Owner" if role_str.upper() == "UMKM" else "Mahasiswa"

    if project.umkm_id == user.id:
        return "Project Owner"

    # Cek apakah user mengisi salah satu slot posisi tim proyek
    if project.slots:
        for slot in project.slots:
            if slot.accepted_mhs_id == user.id:
                return slot.nama_peran or "Pelaksana Proyek"

    # Fallback ke nama program studi atau label umum
    if hasattr(user, "profile_mhs") and user.profile_mhs and user.profile_mhs.prodi:
        prodi_obj = user.profile_mhs.prodi
        prodi_name = getattr(prodi_obj, "nama_prodi", str(prodi_obj))
        if prodi_name:
            return prodi_name

    role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
    return "Project Owner" if role_str.upper() == "UMKM" else "Pelaksana Proyek"


def get_project_members_list(project: Project, db: Session, manager_inst) -> List[dict]:
    """Mengumpulkan seluruh anggota resmi proyek (Klien Owner + Seluruh Mahasiswa Pelaksana yang Diterima)."""
    members = []
    seen_ids = set()

    # 1. Klien / Project Owner
    if project.umkm_id:
        seen_ids.add(str(project.umkm_id))
        owner_user = db.query(User).filter(User.id == project.umkm_id).first()
        if owner_user:
            owner_name, owner_role, owner_photo = resolve_sender_display(owner_user)
            members.append({
                "user_id": project.umkm_id,
                "nama_lengkap": owner_name,
                "role_label": "Project Owner",
                "url_foto": owner_photo,
                "is_online": manager_inst.is_user_online(str(project.umkm_id)),
                "is_owner": True,
            })

    # 2. Mahasiswa pelaksana dari slots
    if project.slots:
        for slot in project.slots:
            if slot.accepted_mhs_id and str(slot.accepted_mhs_id) not in seen_ids:
                seen_ids.add(str(slot.accepted_mhs_id))
                mhs_user = db.query(User).filter(User.id == slot.accepted_mhs_id).first()
                if mhs_user:
                    m_name, m_role, m_photo = resolve_sender_display(mhs_user)
                    members.append({
                        "user_id": slot.accepted_mhs_id,
                        "nama_lengkap": m_name,
                        "role_label": slot.nama_peran or "Pelaksana Proyek",
                        "url_foto": m_photo,
                        "is_online": manager_inst.is_user_online(str(slot.accepted_mhs_id)),
                        "is_owner": False,
                    })

    # 3. Mahasiswa dari proposal yang ACCEPTED
    accepted_proposals = (
        db.query(Proposal)
        .filter(
            Proposal.project_id == project.id,
            Proposal.status == ProposalStatus.ACCEPTED,
        )
        .all()
    )
    for prop in accepted_proposals:
        if prop.mhs_id and str(prop.mhs_id) not in seen_ids:
            seen_ids.add(str(prop.mhs_id))
            mhs_user = db.query(User).filter(User.id == prop.mhs_id).first()
            if mhs_user:
                m_name, m_role, m_photo = resolve_sender_display(mhs_user)
                role_label = prop.slot.nama_peran if prop.slot else (project.kategori or "Pelaksana Proyek")
                members.append({
                    "user_id": prop.mhs_id,
                    "nama_lengkap": m_name,
                    "role_label": role_label,
                    "url_foto": m_photo,
                    "is_online": manager_inst.is_user_online(str(prop.mhs_id)),
                    "is_owner": False,
                })

    return members


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


def create_chat_notification(
    db: Session,
    project_id: UUID,
    sender: User,
    sender_name: str,
    message_text: str,
    recipient_id: Optional[UUID] = None,
):
    """Membuat notifikasi sistem untuk lawan bicara ketika ada pesan chat masuk."""
    try:
        target_user_ids = []
        if recipient_id and recipient_id != sender.id:
            target_user_ids.append(recipient_id)
        else:
            project = db.query(Project).filter(Project.id == project_id).first()
            if project:
                if project.umkm_id and project.umkm_id != sender.id:
                    target_user_ids.append(project.umkm_id)
                proposals = db.query(Proposal).filter(Proposal.project_id == project_id).all()
                for p in proposals:
                    if p.mhs_id and p.mhs_id != sender.id and p.mhs_id not in target_user_ids:
                        target_user_ids.append(p.mhs_id)

        clean_preview = (message_text[:80] + "...") if len(message_text) > 80 else message_text
        for uid in target_user_ids:
            notif = Notification(
                user_id=uid,
                judul=f"Pesan Baru dari {sender_name}",
                pesan=clean_preview or "Mengirimkan pesan kolaborasi baru",
                tipe=NotificationType.SYSTEM,
                url_referensi=f"/chat?project={project_id}",
            )
            db.add(notif)
        db.commit()
    except Exception:
        pass


# ============================================================================
# 3. REST ENDPOINT: GET USER CONVERSATIONS (INBOX)
# ============================================================================
@router.get("/conversations", response_model=List[ConversationItemResponse])
def get_user_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mengambil daftar seluruh percakapan aktif pengguna (inbox chat),
    mencakup Grup Obrolan Proyek resmi (Project Group Chat) dan Percakapan Langsung (1-on-1).
    """
    conversations_map: Dict[str, dict] = {}
    user_role_str = current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role)

    # -------------------------------------------------------------------------
    # A. DAFTAR GRUP OBROLAN PROYEK RESMI (PROJECT WORKROOM GROUP CHAT)
    # -------------------------------------------------------------------------
    participating_projects = []

    if user_role_str.upper() == "UMKM":
        participating_projects = (
            db.query(Project)
            .filter(Project.umkm_id == current_user.id)
            .order_by(Project.created_at.desc())
            .all()
        )
    else:
        # Mahasiswa: cari proyek tempat mahasiswa diterima di slot atau proposalnya diterima
        accepted_slots = (
            db.query(ProjectSlot)
            .filter(ProjectSlot.accepted_mhs_id == current_user.id)
            .all()
        )
        for s in accepted_slots:
            if s.project and s.project not in participating_projects:
                participating_projects.append(s.project)

        accepted_props = (
            db.query(Proposal)
            .filter(
                Proposal.mhs_id == current_user.id,
                Proposal.status == ProposalStatus.ACCEPTED,
            )
            .all()
        )
        for p in accepted_props:
            if p.project and p.project not in participating_projects:
                participating_projects.append(p.project)

    for proj in participating_projects:
        group_key = f"group_{proj.id}"
        members = get_project_members_list(proj, db, manager)

        # Ambil pesan terakhir grup (pesan umum proyek tanpa recipient_id)
        last_grp_msg = (
            db.query(ChatMessage)
            .filter(
                ChatMessage.project_id == proj.id,
                ChatMessage.recipient_id.is_(None),
            )
            .order_by(ChatMessage.created_at.desc())
            .first()
        )

        unread_grp_count = (
            db.query(ChatMessage)
            .filter(
                ChatMessage.project_id == proj.id,
                ChatMessage.recipient_id.is_(None),
                ChatMessage.sender_id != current_user.id,
                ChatMessage.is_read == False,
            )
            .count()
        )

        other_online = any(
            m["is_online"] for m in members if str(m["user_id"]) != str(current_user.id)
        )

        is_done = str(proj.status).upper() in ["DONE", "SELESAI", "CLOSED"]
        status_sub = " • Arsip Selesai" if is_done else ""

        conversations_map[group_key] = {
            "id": group_key,
            "partner_id": None,
            "partner_name": f"Grup: {proj.judul}",
            "partner_role": "GROUP",
            "partner_photo": None,
            "partner_sub": f"{len(members)} Anggota Proyek{status_sub}",
            "project_id": proj.id,
            "project_title": proj.judul,
            "project_status": proj.status,
            "last_message": last_grp_msg.message if last_grp_msg else "Ruang obrolan tim proyek telah siap.",
            "last_message_time": last_grp_msg.created_at if last_grp_msg else proj.created_at,
            "unread_count": unread_grp_count,
            "is_online": other_online,
            "is_group": True,
            "member_count": len(members),
            "members": members,
        }

    # -------------------------------------------------------------------------
    # B. DAFTAR PERCAKAPAN LANGSUNG (1-ON-1 DIRECT CHATS)
    # -------------------------------------------------------------------------
    user_messages = (
        db.query(ChatMessage)
        .filter(
            or_(
                ChatMessage.sender_id == current_user.id,
                ChatMessage.recipient_id == current_user.id,
            ),
            ChatMessage.recipient_id.isnot(None),
        )
        .order_by(ChatMessage.created_at.desc())
        .all()
    )

    for m in user_messages:
        partner_id = m.recipient_id if m.sender_id == current_user.id else m.sender_id
        if not partner_id or partner_id == current_user.id:
            continue

        conv_key = f"{partner_id}_{m.project_id}"
        if conv_key not in conversations_map:
            partner_user = db.query(User).filter(User.id == partner_id).first()
            if not partner_user:
                continue

            partner_name, partner_role, partner_photo = resolve_sender_display(partner_user)
            partner_sub = resolve_user_sub_display(partner_user)

            project_title = m.project.judul if m.project else None
            project_status = m.project.status if m.project else None

            unread_count = (
                db.query(ChatMessage)
                .filter(
                    ChatMessage.project_id == m.project_id,
                    ChatMessage.sender_id == partner_id,
                    ChatMessage.recipient_id == current_user.id,
                    ChatMessage.is_read == False,
                )
                .count()
            )

            is_online = manager.is_user_online(str(partner_id))

            conversations_map[conv_key] = {
                "id": conv_key,
                "partner_id": partner_id,
                "partner_name": partner_name,
                "partner_role": partner_role,
                "partner_photo": partner_photo,
                "partner_sub": partner_sub,
                "project_id": m.project_id,
                "project_title": project_title,
                "project_status": project_status,
                "last_message": m.message,
                "last_message_time": m.created_at,
                "unread_count": unread_count,
                "is_online": is_online,
                "is_group": False,
                "member_count": 1,
                "members": None,
            }

    # -------------------------------------------------------------------------
    # C. PARTNER DARI SLOT TERISI / PROPOSAL AKTIF
    # -------------------------------------------------------------------------
    if user_role_str.upper() == "UMKM":
        my_projects = db.query(Project).filter(Project.umkm_id == current_user.id).all()
        for proj in my_projects:
            for slot in proj.slots:
                if slot.accepted_mhs_id and slot.accepted_mhs_id != current_user.id:
                    conv_key = f"{slot.accepted_mhs_id}_{proj.id}"
                    if conv_key not in conversations_map:
                        mhs_user = db.query(User).filter(User.id == slot.accepted_mhs_id).first()
                        if mhs_user:
                            p_name, p_role, p_photo = resolve_sender_display(mhs_user)
                            p_sub = slot.nama_peran or resolve_user_sub_display(mhs_user)
                            conversations_map[conv_key] = {
                                "id": conv_key,
                                "partner_id": slot.accepted_mhs_id,
                                "partner_name": p_name,
                                "partner_role": p_role,
                                "partner_photo": p_photo,
                                "partner_sub": f"Pelaksana ({p_sub})",
                                "project_id": proj.id,
                                "project_title": proj.judul,
                                "project_status": proj.status,
                                "last_message": "Ruang kolaborasi telah siap.",
                                "last_message_time": slot.created_at,
                                "unread_count": 0,
                                "is_online": manager.is_user_online(str(slot.accepted_mhs_id)),
                                "is_group": False,
                                "member_count": 1,
                                "members": None,
                            }
        # Pelamar proposal yang masuk
        my_proposals = db.query(Proposal).join(Project, Proposal.project_id == Project.id).filter(Project.umkm_id == current_user.id).all()
        for prop in my_proposals:
            if prop.mhs_id and prop.mhs_id != current_user.id:
                conv_key = f"{prop.mhs_id}_{prop.project_id}"
                if conv_key not in conversations_map:
                    mhs_user = db.query(User).filter(User.id == prop.mhs_id).first()
                    if mhs_user:
                        p_name, p_role, p_photo = resolve_sender_display(mhs_user)
                        p_sub = resolve_user_sub_display(mhs_user)
                        conversations_map[conv_key] = {
                            "id": conv_key,
                            "partner_id": prop.mhs_id,
                            "partner_name": p_name,
                            "partner_role": p_role,
                            "partner_photo": p_photo,
                            "partner_sub": p_sub,
                            "project_id": prop.project_id,
                            "project_title": prop.project.judul if prop.project else "Proyek",
                            "project_status": prop.project.status if prop.project else "OPEN",
                            "last_message": f"Proposal: {prop.cover_letter[:60]}..." if prop.cover_letter else "Diskusi kolaborasi proyek.",
                            "last_message_time": prop.created_at,
                            "unread_count": 0,
                            "is_online": manager.is_user_online(str(prop.mhs_id)),
                            "is_group": False,
                            "member_count": 1,
                            "members": None,
                        }
    else:
        # Mahasiswa: rekan tim & klien proyek
        accepted_slots = db.query(ProjectSlot).filter(ProjectSlot.accepted_mhs_id == current_user.id).all()
        for s in accepted_slots:
            proj = s.project
            if not proj:
                continue

            # Klien UMKM
            if proj.umkm_id and proj.umkm_id != current_user.id:
                conv_key = f"{proj.umkm_id}_{proj.id}"
                if conv_key not in conversations_map:
                    klien_user = db.query(User).filter(User.id == proj.umkm_id).first()
                    if klien_user:
                        k_name, k_role, k_photo = resolve_sender_display(klien_user)
                        k_sub = resolve_user_sub_display(klien_user)
                        conversations_map[conv_key] = {
                            "id": conv_key,
                            "partner_id": proj.umkm_id,
                            "partner_name": k_name,
                            "partner_role": k_role,
                            "partner_photo": k_photo,
                            "partner_sub": k_sub,
                            "project_id": proj.id,
                            "project_title": proj.judul,
                            "project_status": proj.status,
                            "last_message": "Ruang kolaborasi telah siap.",
                            "last_message_time": s.created_at,
                            "unread_count": 0,
                            "is_online": manager.is_user_online(str(proj.umkm_id)),
                            "is_group": False,
                            "member_count": 1,
                            "members": None,
                        }

            # Rekan sesama tim
            for other_slot in proj.slots:
                if other_slot.accepted_mhs_id and other_slot.accepted_mhs_id != current_user.id:
                    peer_key = f"{other_slot.accepted_mhs_id}_{proj.id}"
                    if peer_key not in conversations_map:
                        peer_user = db.query(User).filter(User.id == other_slot.accepted_mhs_id).first()
                        if peer_user:
                            peer_name, peer_role, peer_photo = resolve_sender_display(peer_user)
                            peer_sub = other_slot.nama_peran or "Rekan Tim"
                            conversations_map[peer_key] = {
                                "id": peer_key,
                                "partner_id": other_slot.accepted_mhs_id,
                                "partner_name": peer_name,
                                "partner_role": peer_role,
                                "partner_photo": peer_photo,
                                "partner_sub": f"Rekan Tim ({peer_sub})",
                                "project_id": proj.id,
                                "project_title": proj.judul,
                                "project_status": proj.status,
                                "last_message": f"Kolaborasi satu tim di proyek {proj.judul}",
                                "last_message_time": other_slot.created_at,
                                "unread_count": 0,
                                "is_online": manager.is_user_online(str(other_slot.accepted_mhs_id)),
                                "is_group": False,
                                "member_count": 1,
                                "members": None,
                            }

    # -------------------------------------------------------------------------
    # D. FALLBACK UNTUK DEMO JIKA BENAR-BENAR KOSONG
    # -------------------------------------------------------------------------
    if not conversations_map:
        if user_role_str.upper() == "UMKM":
            bima_user = db.query(User).filter(User.email.ilike("%bima%")).first()
            if not bima_user:
                bima_user = db.query(User).filter(User.role == UserRole.MHS).first()
            if bima_user:
                sample_proj = db.query(Project).filter(Project.umkm_id == current_user.id).first()
                if not sample_proj:
                    sample_proj = db.query(Project).filter(Project.status == ProjectStatus.OPEN).first()
                p_name, p_role, p_photo = resolve_sender_display(bima_user)
                p_sub = resolve_user_sub_display(bima_user)
                proj_id = sample_proj.id if sample_proj else None
                proj_title = sample_proj.judul if sample_proj else "Konsultasi Kebutuhan Usaha"
                proj_status = sample_proj.status if sample_proj else "OPEN"
                conv_key = f"{bima_user.id}_{proj_id}"
                conversations_map[conv_key] = {
                    "id": conv_key,
                    "partner_id": bima_user.id,
                    "partner_name": p_name,
                    "partner_role": p_role,
                    "partner_photo": p_photo,
                    "partner_sub": p_sub,
                    "project_id": proj_id,
                    "project_title": proj_title,
                    "project_status": proj_status,
                    "last_message": "Halo! Ruang konsultasi dan penawaran proyek telah aktif.",
                    "last_message_time": datetime.now(),
                    "unread_count": 0,
                    "is_online": True,
                    "is_group": False,
                    "member_count": 1,
                    "members": None,
                }
        else:
            umkm_user = db.query(User).filter(User.role == UserRole.UMKM).first()
            if umkm_user:
                sample_proj = db.query(Project).filter(Project.umkm_id == umkm_user.id).first()
                u_name, u_role, u_photo = resolve_sender_display(umkm_user)
                u_sub = resolve_user_sub_display(umkm_user)
                proj_id = sample_proj.id if sample_proj else None
                proj_title = sample_proj.judul if sample_proj else "Diskusi Kolaborasi"
                proj_status = sample_proj.status if sample_proj else "OPEN"
                conv_key = f"{umkm_user.id}_{proj_id}"
                conversations_map[conv_key] = {
                    "id": conv_key,
                    "partner_id": umkm_user.id,
                    "partner_name": u_name,
                    "partner_role": u_role,
                    "partner_photo": u_photo,
                    "partner_sub": u_sub,
                    "project_id": proj_id,
                    "project_title": proj_title,
                    "project_status": proj_status,
                    "last_message": "Selamat datang di ruang kolaborasi resmi Makarya.",
                    "last_message_time": datetime.now(),
                    "unread_count": 0,
                    "is_online": True,
                    "is_group": False,
                    "member_count": 1,
                    "members": None,
                }

    result = list(conversations_map.values())
    result.sort(key=lambda c: c["last_message_time"] or datetime.min, reverse=True)
    return result


# ============================================================================
# 4. REST ENDPOINT: GET CHAT HISTORY
# ============================================================================
@router.get("/project/{project_id}/messages", response_model=List[ChatMessageResponse])
def get_chat_messages(
    project_id: UUID,
    partner_id: Optional[UUID] = Query(None, description="Filter pesan spesifik dengan lawan bicara tertentu (kosongkan untuk obrolan grup proyek)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mengambil riwayat percakapan chat proyek.
    Jika partner_id diberikan: mengambil percakapan personal (1-on-1).
    Jika partner_id kosong: mengambil percakapan grup proyek (recipient_id is None).
    """
    project = verify_project_participation(project_id, current_user, db)

    query = db.query(ChatMessage).filter(ChatMessage.project_id == project_id)

    if partner_id:
        query = query.filter(
            or_(
                (ChatMessage.sender_id == current_user.id) & (ChatMessage.recipient_id == partner_id),
                (ChatMessage.sender_id == partner_id) & (ChatMessage.recipient_id == current_user.id),
            )
        )
    else:
        # Obrolan Grup Proyek
        query = query.filter(ChatMessage.recipient_id.is_(None))

    messages = query.order_by(ChatMessage.created_at.asc()).all()

    # Otomatis tandai pesan masuk yang belum dibaca sebagai sudah dibaca
    unread_messages = [
        m for m in messages if not m.is_read and m.sender_id != current_user.id
    ]
    if unread_messages:
        for m in unread_messages:
            m.is_read = True
        db.commit()

        read_payload = {
            "type": "READ_RECEIPT",
            "project_id": str(project_id),
            "reader_id": str(current_user.id),
            "partner_id": str(partner_id) if partner_id else None,
            "read_at": datetime.now().isoformat(),
        }
        import asyncio
        asyncio.create_task(manager.broadcast(str(project_id), read_payload))
        if partner_id:
            asyncio.create_task(manager.send_to_user(str(partner_id), read_payload))

    response_list = []
    for m in messages:
        sender_name, sender_role, sender_photo = resolve_sender_display(m.sender)
        sender_role_label = resolve_project_member_role(m.sender, project)

        response_list.append(
            ChatMessageResponse(
                id=m.id,
                project_id=m.project_id,
                sender_id=m.sender_id,
                recipient_id=m.recipient_id,
                sender_name=sender_name,
                sender_role=sender_role,
                sender_photo=sender_photo,
                sender_role_label=sender_role_label,
                message=m.message,
                attachment_url=m.attachment_url,
                attachment_type=m.attachment_type,
                is_read=m.is_read,
                created_at=m.created_at,
            )
        )

    return response_list



@router.get("/projects/{project_id}/roster", response_model=List[GroupMemberItem])
def get_project_chat_roster(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mengambil daftar seluruh anggota resmi proyek (Owner UMKM + Mahasiswa Pelaksana),
    beserta foto profil, role pengerjaan, dan status online terkini.
    """
    project = verify_project_participation(project_id, current_user, db)
    return get_project_members_list(project, db, manager)


# ============================================================================
# 5. REST ENDPOINT: SEND MESSAGE (HTTP FALLBACK)
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
    project = verify_project_participation(project_id, current_user, db)

    # Validasi jika proyek sudah selesai / diarsipkan (read-only workroom)
    if str(project.status).upper() in ["DONE", "SELESAI", "CLOSED", "CANCELLED"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Proyek ini telah selesai/diarsipkan secara resmi. Ruang obrolan berstatus hanya-baca (read-only).",
        )

    msg_content = body.message or (body.attachment_url and "Lampiran tautan berkas")
    if not msg_content and not body.attachment_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pesan atau lampiran tidak boleh kosong.",
        )

    new_msg = ChatMessage(
        project_id=project_id,
        sender_id=current_user.id,
        recipient_id=body.recipient_id,
        message=msg_content or "Lampiran tautan berkas",
        attachment_url=body.attachment_url,
        attachment_type=body.attachment_type,
        is_read=False,
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    sender_name, sender_role, sender_photo = resolve_sender_display(current_user)
    sender_role_label = resolve_project_member_role(current_user, project)

    msg_response = ChatMessageResponse(
        id=new_msg.id,
        project_id=new_msg.project_id,
        sender_id=new_msg.sender_id,
        recipient_id=new_msg.recipient_id,
        sender_name=sender_name,
        sender_role=sender_role,
        sender_photo=sender_photo,
        sender_role_label=sender_role_label,
        message=new_msg.message,
        attachment_url=new_msg.attachment_url,
        attachment_type=new_msg.attachment_type,
        is_read=new_msg.is_read,
        created_at=new_msg.created_at,
    )

    broadcast_payload = json.loads(msg_response.model_dump_json())
    broadcast_payload["type"] = "CHAT_MESSAGE"
    await manager.broadcast(str(project_id), broadcast_payload)

    if body.recipient_id:
        await manager.send_to_user(str(body.recipient_id), broadcast_payload)
    else:
        # Kirim ke seluruh anggota proyek jika pesan grup
        members = get_project_members_list(project, db, manager)
        for mem in members:
            await manager.send_to_user(str(mem["user_id"]), broadcast_payload)
    await manager.send_to_user(str(current_user.id), broadcast_payload)

    create_chat_notification(
        db=db,
        project_id=project_id,
        sender=current_user,
        sender_name=sender_name,
        message_text=new_msg.message,
        recipient_id=body.recipient_id,
    )

    return msg_response


# ============================================================================
# 5. REST ENDPOINT: MARK MESSAGES AS READ
# ============================================================================
@router.patch("/project/{project_id}/read")
async def mark_messages_as_read(
    project_id: UUID,
    partner_id: Optional[UUID] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Menandai semua pesan yang belum dibaca dari lawan bicara sebagai sudah dibaca."""
    verify_project_participation(project_id, current_user, db)

    query = db.query(ChatMessage).filter(
        ChatMessage.project_id == project_id,
        ChatMessage.sender_id != current_user.id,
        ChatMessage.is_read == False,
    )
    if partner_id:
        query = query.filter(ChatMessage.sender_id == partner_id)

    unread_messages = query.all()
    for m in unread_messages:
        m.is_read = True

    db.commit()

    # Broadcast read receipt realtime
    read_payload = {
        "type": "READ_RECEIPT",
        "project_id": str(project_id),
        "reader_id": str(current_user.id),
        "partner_id": str(partner_id) if partner_id else None,
        "read_at": datetime.now().isoformat(),
    }
    await manager.broadcast(str(project_id), read_payload)
    if partner_id:
        await manager.send_to_user(str(partner_id), read_payload)

    return {"status": "success", "marked_read_count": len(unread_messages)}


# ============================================================================
# 5B. REST ENDPOINT: RESPOND TO PROJECT OFFER (ACCEPT / REJECT)
# ============================================================================
@router.post("/offer/{message_id}/respond")
async def respond_to_project_offer(
    message_id: UUID,
    payload: OfferRespondRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mahasiswa menerima atau menolak tawaran proyek langsung dari bubble chat.
    """
    action = payload.action.upper()
    if action not in ["ACCEPT", "REJECT"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Aksi harus 'ACCEPT' atau 'REJECT'.",
        )

    # 1. Cari pesan tawaran
    msg = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if not msg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pesan tawaran tidak ditemukan.",
        )

    # Ambil proyek terkait
    project = db.query(Project).filter(Project.id == msg.project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Proyek tidak ditemukan.",
        )

    # Pastikan current_user adalah mahasiswa penerima atau mitra
    mhs_name, _, _ = resolve_sender_display(current_user)

    # Parse attachment data JSON jika ada
    offer_meta = {}
    if msg.attachment_url:
        try:
            offer_meta = json.loads(msg.attachment_url)
        except Exception:
            offer_meta = {"projectId": str(msg.project_id)}

    if action == "ACCEPT":
        # Cek apakah sudah ada proposal
        proposal = (
            db.query(Proposal)
            .filter(Proposal.project_id == project.id, Proposal.mhs_id == current_user.id)
            .first()
        )
        if not proposal:
            proposal = Proposal(
                project_id=project.id,
                mhs_id=current_user.id,
                harga_tawar=project.budget_max,
                cover_letter="Tawaran proyek langsung diterima via obrolan kolaborasi.",
                estimasi_hari=14,
                status=ProposalStatus.ACCEPTED,
            )
            db.add(proposal)
            db.flush()
        else:
            proposal.status = ProposalStatus.ACCEPTED

        # Kunci Escrow jika UMKM memiliki saldo aktif cukup
        umkm_wallet = db.query(Wallet).filter(Wallet.user_id == project.umkm_id).with_for_update().first()
        if umkm_wallet and umkm_wallet.saldo_aktif >= proposal.harga_tawar:
            umkm_wallet.saldo_aktif -= proposal.harga_tawar
            umkm_wallet.saldo_escrow += proposal.harga_tawar

            ledger_entry = LedgerLog(
                wallet_id=umkm_wallet.id,
                project_id=project.id,
                tipe=TransactionType.HOLD,
                nominal=proposal.harga_tawar,
                keterangan=f"Escrow hold untuk proyek {project.judul} diterima oleh {mhs_name}",
            )
            db.add(ledger_entry)

            escrow = Escrow(
                project_id=project.id,
                proposal_id=proposal.id,
                client_id=project.umkm_id,
                talent_id=current_user.id,
                amount_total=proposal.harga_tawar,
                platform_fee=0.00,
                amount_talent=proposal.harga_tawar,
                status=EscrowStatus.HELD,
            )
            db.add(escrow)

        # Ubah status proyek menjadi IN_PROGRESS
        project.status = ProjectStatus.IN_PROGRESS

        # Jika proyek memiliki slots, isi slot yang dipilih atau slot OPEN pertama
        slot_id = offer_meta.get("slotId")
        slot_assigned = False
        if slot_id:
            try:
                target_slot = db.query(ProjectSlot).filter(ProjectSlot.id == UUID(str(slot_id))).first()
                if target_slot:
                    target_slot.accepted_mhs_id = current_user.id
                    target_slot.status = "IN_PROGRESS"
                    slot_assigned = True
            except Exception:
                pass

        if not slot_assigned:
            open_slot = db.query(ProjectSlot).filter(ProjectSlot.project_id == project.id, ProjectSlot.status == "OPEN").first()
            if open_slot:
                open_slot.accepted_mhs_id = current_user.id
                open_slot.status = "IN_PROGRESS"

        offer_meta["status"] = "ACCEPTED"
        offer_meta["responded_at"] = datetime.now().isoformat()
        msg.attachment_url = json.dumps(offer_meta)

        # Catat pesan sistem konfirmasi
        confirm_msg = ChatMessage(
            project_id=project.id,
            sender_id=current_user.id,
            recipient_id=msg.sender_id,
            message=f"✓ Tawaran proyek \"{project.judul}\" telah diterima resmi oleh {mhs_name}. Status proyek kini aktif (IN_PROGRESS)!",
            attachment_type=None,
            attachment_url=None,
        )
        db.add(confirm_msg)
        db.commit()
        db.refresh(msg)
        db.refresh(confirm_msg)

        # Broadcast via WebSocket
        room_id = str(project.id)
        broadcast_payload = {
            "type": "OFFER_STATUS_UPDATE",
            "message_id": str(msg.id),
            "status": "ACCEPTED",
            "project_id": str(project.id),
            "system_message": confirm_msg.message,
        }
        await manager.broadcast(room_id, broadcast_payload)

        return {
            "status": "SUCCESS",
            "message": f"Tawaran proyek '{project.judul}' berhasil diterima.",
            "offer_status": "ACCEPTED",
            "project_status": project.status.value,
        }

    else:  # REJECT
        offer_meta["status"] = "REJECTED"
        offer_meta["responded_at"] = datetime.now().isoformat()
        msg.attachment_url = json.dumps(offer_meta)

        reject_msg = ChatMessage(
            project_id=project.id,
            sender_id=current_user.id,
            recipient_id=msg.sender_id,
            message=f"✕ Tawaran proyek \"{project.judul}\" ditolak oleh {mhs_name}.",
            attachment_type=None,
            attachment_url=None,
        )
        db.add(reject_msg)
        db.commit()
        db.refresh(msg)
        db.refresh(reject_msg)

        room_id = str(project.id)
        broadcast_payload = {
            "type": "OFFER_STATUS_UPDATE",
            "message_id": str(msg.id),
            "status": "REJECTED",
            "project_id": str(project.id),
            "system_message": reject_msg.message,
        }
        await manager.broadcast(room_id, broadcast_payload)

        return {
            "status": "SUCCESS",
            "message": f"Tawaran proyek '{project.judul}' ditolak.",
            "offer_status": "REJECTED",
            "project_status": project.status.value,
        }


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
        user_id_str = str(current_user.id)
        await manager.connect(websocket, room_id, user_id_str)

        # Kirim status kehadiran awal ke user yang baru terhubung
        online_users = manager.get_online_users_in_room(room_id)
        await websocket.send_json({
            "type": "ROOM_PRESENCE",
            "project_id": room_id,
            "online_users": online_users,
        })

        # Broadcast status kehadiran ONLINE ke seluruh peserta di room
        await manager.broadcast(room_id, {
            "type": "USER_PRESENCE",
            "project_id": room_id,
            "user_id": user_id_str,
            "status": "ONLINE",
            "online_users": online_users,
        })

        # 3. Loop penerimaan & broadcast pesan realtime
        while True:
            data_text = await websocket.receive_text()
            try:
                data_json = json.loads(data_text)
                msg_type = data_json.get("type", "CHAT_MESSAGE")

                # A. Penandaan Baca Realtime (MARK_READ)
                if msg_type == "MARK_READ":
                    partner_raw = data_json.get("partner_id")
                    query = db.query(ChatMessage).filter(
                        ChatMessage.project_id == project_id,
                        ChatMessage.sender_id != current_user.id,
                        ChatMessage.is_read == False,
                    )
                    if partner_raw:
                        try:
                            query = query.filter(ChatMessage.sender_id == UUID(str(partner_raw)))
                        except Exception:
                            pass
                    unread_to_mark = query.all()
                    for u in unread_to_mark:
                        u.is_read = True
                    if unread_to_mark:
                        db.commit()

                    read_event = {
                        "type": "READ_RECEIPT",
                        "project_id": room_id,
                        "reader_id": user_id_str,
                        "partner_id": str(partner_raw) if partner_raw else None,
                        "read_at": datetime.now().isoformat(),
                    }
                    await manager.broadcast(room_id, read_event)
                    if partner_raw:
                        await manager.send_to_user(str(partner_raw), read_event)
                    continue

                # B. Pesan Chat Biasa (CHAT_MESSAGE)
                msg_text = str(data_json.get("message") or "").strip()
                att_url = data_json.get("attachment_url")
                att_type = data_json.get("attachment_type")
                recip_id_raw = data_json.get("recipient_id")
                recip_id = None
                if recip_id_raw:
                    try:
                        recip_id = UUID(str(recip_id_raw))
                    except (ValueError, TypeError):
                        recip_id = None

                if not msg_text and not att_url:
                    continue

                if att_type:
                    att_type = str(att_type).strip().upper()

                proj_obj = db.query(Project).filter(Project.id == project_id).first()
                if proj_obj and str(proj_obj.status).upper() in ["DONE", "SELESAI", "CLOSED", "CANCELLED"]:
                    await websocket.send_json({
                        "type": "ERROR",
                        "message": "Proyek ini telah selesai/diarsipkan. Obrolan dalam mode hanya-baca (read-only)."
                    })
                    continue

                final_msg = msg_text or "Lampiran tautan berkas"

                # Simpan pesan ke database
                new_msg = ChatMessage(
                    project_id=project_id,
                    sender_id=current_user.id,
                    recipient_id=recip_id,
                    message=final_msg,
                    attachment_url=att_url,
                    attachment_type=att_type,
                    is_read=False,
                )
                db.add(new_msg)
                db.commit()
                db.refresh(new_msg)

                sender_name, sender_role, sender_photo = resolve_sender_display(current_user)
                sender_role_label = resolve_project_member_role(current_user, proj_obj)

                broadcast_data = {
                    "type": "CHAT_MESSAGE",
                    "id": str(new_msg.id),
                    "project_id": str(new_msg.project_id),
                    "sender_id": str(new_msg.sender_id),
                    "recipient_id": str(new_msg.recipient_id) if new_msg.recipient_id else None,
                    "sender_name": sender_name,
                    "sender_role": sender_role,
                    "sender_photo": sender_photo,
                    "sender_role_label": sender_role_label,
                    "message": new_msg.message,
                    "attachment_url": new_msg.attachment_url,
                    "attachment_type": new_msg.attachment_type,
                    "is_read": new_msg.is_read,
                    "created_at": new_msg.created_at.isoformat(),
                }

                # Broadcast ke seluruh peserta yang sedang membuka chat room ini
                await manager.broadcast(room_id, broadcast_data)

                # Kirim juga ke socket pengguna penerima / seluruh anggota grup (untuk live inbox & update sidebar)
                if recip_id:
                    await manager.send_to_user(str(recip_id), broadcast_data)
                elif proj_obj:
                    members = get_project_members_list(proj_obj, db, manager)
                    for mem in members:
                        await manager.send_to_user(str(mem["user_id"]), broadcast_data)
                await manager.send_to_user(user_id_str, broadcast_data)

                # Simpan notifikasi ke database untuk lawan bicara
                create_chat_notification(
                    db=db,
                    project_id=project_id,
                    sender=current_user,
                    sender_name=sender_name,
                    message_text=new_msg.message,
                    recipient_id=recip_id,
                )

            except json.JSONDecodeError:
                pass

    except WebSocketDisconnect:
        manager.disconnect(websocket, str(project_id), str(current_user.id))
        remaining = manager.get_online_users_in_room(str(project_id))
        is_still_online = manager.is_user_online(str(current_user.id))
        await manager.broadcast(str(project_id), {
            "type": "USER_PRESENCE",
            "project_id": str(project_id),
            "user_id": str(current_user.id),
            "status": "ONLINE" if is_still_online else "OFFLINE",
            "online_users": remaining,
        })
    except Exception as e:
        manager.disconnect(websocket, str(project_id), str(current_user.id))
    finally:
        db.close()


# ============================================================================
# 7. WEBSOCKET ENDPOINT: GLOBAL USER SOCKET (LIVE SIDEBAR & INBOX)
# ============================================================================
@router.websocket("/ws/user")
async def websocket_user_global_endpoint(
    websocket: WebSocket,
    token: str = Query(..., description="JWT Access Token"),
):
    """
    WebSocket Endpoint tingkat pengguna untuk live update sidebar percakapan dan status global:
    ws://localhost:8000/v1/chat/ws/user?token={JWT_TOKEN}
    """
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

        user_id_str = str(current_user.id)
        await manager.connect_user(websocket, user_id_str)

        await websocket.send_json({
            "type": "USER_CONNECTED",
            "user_id": user_id_str,
            "connected_at": datetime.now().isoformat(),
        })

        while True:
            data_text = await websocket.receive_text()
            try:
                data_json = json.loads(data_text)
                if data_json.get("type") == "PING":
                    await websocket.send_json({"type": "PONG"})
            except Exception:
                pass

    except WebSocketDisconnect:
        manager.disconnect_user(websocket, str(current_user.id))
    except Exception:
        manager.disconnect_user(websocket, str(current_user.id))
    finally:
        db.close()
