import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm


def generate_spk_pdf(project, umkm_user, profile_umkm, mhs_user, profile_mhs, proposal=None) -> io.BytesIO:
    """
    Menghasilkan Surat Perjanjian Kerja (SPK) Digital Resmi Makarya berformat PDF.
    Dilengkapi klausul perlindungan garansi Escrow, batas revisi 2x, dan stempel verifikasi.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=1.8 * cm,
        leftMargin=1.8 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
    )

    styles = getSampleStyleSheet()
    
    # Custom Typography Styles
    title_style = ParagraphStyle(
        "SPKTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=18,
        alignment=1, # Center
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=3,
    )
    
    subtitle_style = ParagraphStyle(
        "SPKSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        alignment=1,
        textColor=colors.HexColor("#4338CA"),
        spaceAfter=12,
    )

    body_style = ParagraphStyle(
        "SPKBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#1E293B"),
    )

    body_bold = ParagraphStyle(
        "SPKBodyBold",
        parent=body_style,
        fontName="Helvetica-Bold",
    )

    clause_title = ParagraphStyle(
        "SPKClauseTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=6,
        spaceAfter=2,
    )

    clause_body = ParagraphStyle(
        "SPKClauseBody",
        parent=body_style,
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#334155"),
    )

    elements = []

    # 1. KOP SURAT RESMI
    kop_data = [
        [
            Paragraph("<b>MAKARYA DIGITAL ESCROW PLATFORM</b><br/><font size=7 color='#64748B'>Sistem Kolaborasi Terproteksi Usaha Mikro &amp; Talenta Mahasiswa Indonesia</font>", body_style),
            Paragraph(f"<font size=7 color='#64748B'>No. SPK: <b>SPK/MKR/{datetime.now().year}/{str(project.id)[:8].upper()}</b><br/>Tanggal: <b>{datetime.now().strftime('%d %B %Y')}</b></font>", ParagraphStyle("RightKop", parent=body_style, alignment=2)),
        ]
    ]
    kop_table = Table(kop_data, colWidths=[10 * cm, 7.4 * cm])
    kop_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    elements.append(kop_table)
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4338CA"), spaceAfter=10, spaceBefore=4))

    # 2. JUDUL DOKUMEN
    elements.append(Paragraph("SURAT PERJANJIAN KERJA SAMA (SPK) DIGITAL", title_style))
    elements.append(Paragraph("PERLINDUNGAN GARANSI ESCROW &amp; INTEGRITAS HASIL KERJA", subtitle_style))
    
    # Pengantar
    intro_text = (
        f"Pada hari ini, <b>{datetime.now().strftime('%A, %d %B %Y')}</b>, telah dibuat dan disepakati perjanjian kerja sama "
        f"pelaksanaan proyek mikro-freelance melalui platform <b>Makarya</b> oleh dan antara pihak-pihak di bawah ini:"
    )
    elements.append(Paragraph(intro_text, body_style))
    elements.append(Spacer(1, 8))

    # 3. IDENTITAS PARA PIHAK
    umkm_name = umkm_user.nama_lengkap if umkm_user else "Pemberi Kerja"
    umkm_biz = getattr(profile_umkm, "nama_bisnis", None) or "Usaha Mandiri UMKM"
    mhs_name = mhs_user.nama_lengkap if mhs_user else "Pelaksana Kerja"
    mhs_univ = getattr(profile_mhs, "asal_univ", None) or "Perguruan Tinggi Terverifikasi"
    mhs_jurusan = getattr(profile_mhs, "jurusan", None) or "Program Studi Terkait"

    pihak_data = [
        [
            Paragraph("<b>PIHAK I (PEMBERI KERJA / KLIEN UMKM)</b>", clause_title),
            Paragraph("<b>PIHAK II (PELAKSANA / MAHASISWA)</b>", clause_title),
        ],
        [
            Paragraph(
                f"Nama: <b>{umkm_name}</b><br/>"
                f"Usaha: <b>{umkm_biz}</b><br/>"
                f"Email: {getattr(umkm_user, 'email', '-')}<br/>"
                f"Peran: Pemilik Proyek &amp; Penyetor Dana Escrow",
                body_style,
            ),
            Paragraph(
                f"Nama: <b>{mhs_name}</b><br/>"
                f"Kampus: <b>{mhs_univ}</b><br/>"
                f"Jurusan: {mhs_jurusan}<br/>"
                f"Peran: Pelaksana Mandiri / Anggota Tim",
                body_style,
            ),
        ],
    ]
    pihak_table = Table(pihak_data, colWidths=[8.7 * cm, 8.7 * cm])
    pihak_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
        ("BACKGROUND", (0, 1), (-1, 1), colors.HexColor("#F8FAFC")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ]))
    elements.append(pihak_table)
    elements.append(Spacer(1, 10))

    # 4. RINCIAN SPESIFIKASI PROYEK
    budget_val = float(project.budget) if project.budget else 0
    formatted_budget = f"Rp {budget_val:,.0f}".replace(",", ".")
    estimasi_hari = getattr(proposal, "estimasi_hari", None) or getattr(project, "deadline_days", 14) or 14

    proj_data = [
        [Paragraph("<b>Judul Proyek:</b>", body_bold), Paragraph(str(project.judul), body_style)],
        [Paragraph("<b>Kategori Bidang:</b>", body_bold), Paragraph(str(project.kategori), body_style)],
        [Paragraph("<b>Nilai Kontrak Escrow:</b>", body_bold), Paragraph(f"<b>{formatted_budget}</b> (Telah terkunci aman di Rekening Penampung Escrow Makarya)", body_style)],
        [Paragraph("<b>Tenggat Waktu:</b>", body_bold), Paragraph(f"{estimasi_hari} Hari Kalender sejak status proyek aktif", body_style)],
    ]
    proj_table = Table(proj_data, colWidths=[4.2 * cm, 13.2 * cm])
    proj_table.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F8FAFC")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(proj_table)
    elements.append(Spacer(1, 10))

    # 5. PASAL-PASAL KESEPAKATAN KERJA
    elements.append(Paragraph("PASAL 1: RUANG LINGKUP &amp; PELAKSANAAN KERJA", clause_title))
    elements.append(Paragraph(
        "PIHAK II berkewajiban menyelesaikan deliverable proyek sesuai deskripsi brief resmi di platform Makarya "
        "dengan standar profesional dan menyerahkan berkas hasil kerja sebelum tenggat waktu yang telah disepakati.",
        clause_body,
    ))

    elements.append(Paragraph("PASAL 2: GARANSI PEMBAYARAN ESCROW (REKBER AMAN)", clause_title))
    elements.append(Paragraph(
        "PIHAK I telah menyetorkan dan mengunci 100% dana honor proyek ke sistem Escrow Makarya. "
        "Dana hanya akan dicairkan ke saldo aktif PIHAK II setelah PIHAK I memberikan persetujuan (Approve) hasil kerja, "
        "atau melalui keputusan penyelesaian sengketa resmi oleh Administrator.",
        clause_body,
    ))

    elements.append(Paragraph("PASAL 3: BATASAN REVISI KARYA (ANTI-EKSPLOITASI)", clause_title))
    elements.append(Paragraph(
        "PIHAK I memiliki hak pengajuan revisi <b>maksimal sebanyak 2 (dua) kali</b> dengan catatan perbaikan yang jelas. "
        "Permintaan revisi di luar batas atau perubahan konsep di luar brief awal tidak diwajibkan bagi PIHAK II.",
        clause_body,
    ))

    elements.append(Paragraph("PASAL 4: HAK KEKAYAAN INTELEKTUAL (HAKI) &amp; KERAHASIAAN", clause_title))
    elements.append(Paragraph(
        "Seluruh hak cipta hasil karya final yang telah dibayarkan lunas beralih sepenuhnya menjadi milik PIHAK I untuk kepentingan usaha komersial. "
        "PIHAK II tetap berhak menampilkan karya tersebut sebagai portofolio akademik dengan mencantumkan keterangan kolaborasi resmi.",
        clause_body,
    ))
    elements.append(Spacer(1, 12))

    # 6. TANDA TANGAN & PENGESAHAN ELEKTRONIK
    sig_data = [
        [
            Paragraph(f"<b>Pemberi Kerja (PIHAK I)</b><br/><br/><br/><br/><b>{umkm_name}</b><br/><font size=6.5 color='#64748B'>{umkm_biz}</font>", ParagraphStyle("Sig1", parent=body_style, alignment=1)),
            Paragraph(
                "<font size=7 color='#059669'><b>[ TERVERIFIKASI SISTEM MAKARYA ]</b></font><br/>"
                "<font size=6.5 color='#64748B'>Kunci Digital SHA-256:<br/>"
                f"<b>{str(project.id).replace('-', '')[:24].upper()}</b><br/>"
                "Garansi Perlindungan Escrow 100%</font>",
                ParagraphStyle("SigStamp", parent=body_style, alignment=1),
            ),
            Paragraph(f"<b>Pelaksana Kerja (PIHAK II)</b><br/><br/><br/><br/><b>{mhs_name}</b><br/><font size=6.5 color='#64748B'>{mhs_univ}</font>", ParagraphStyle("Sig2", parent=body_style, alignment=1)),
        ]
    ]
    sig_table = Table(sig_data, colWidths=[5.8 * cm, 5.8 * cm, 5.8 * cm])
    sig_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("BOX", (1, 0), (1, 0), 0.5, colors.HexColor("#A7F3D0")),
        ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#ECFDF5")),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    
    elements.append(KeepTogether([sig_table]))

    # Build Document
    doc.build(elements)
    buffer.seek(0)
    return buffer

