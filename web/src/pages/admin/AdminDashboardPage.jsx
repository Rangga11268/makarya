import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { projectApi, disputeApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { Pagination } from "../../components/ui/Pagination";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { 
  ShieldCheck, 
  Scale, 
  Compass, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowUpRight, 
  Layers, 
  FileText, 
  GraduationCap, 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  Lock,
  PieChart,
  Activity,
  UserCheck,
  Building2,
  Clock,
  Eye
  Eye,
  RotateCcw
} from "lucide-react";

export function AdminDashboardPage() {
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [disputes, setDisputes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [mediationNote, setMediationNote] = useState("");
  const [mediationSubmitting, setMediationSubmitting] = useState(false);

  // Escrow Tab State
  const [escrowSearch, setEscrowSearch] = useState("");
  const [escrowStatus, setEscrowStatus] = useState("ALL");
  const [escrowPage, setEscrowPage] = useState(1);
  const escrowPerPage = 5;

  // KYC Tab State
  const [kycSearch, setKycSearch] = useState("");
  const [kycStatus, setKycStatus] = useState("ALL");
  const [kycProdi, setKycProdi] = useState("ALL");
  const [kycPage, setKycPage] = useState(1);
  const kycPerPage = 5;

  // Projects Moderation Tab State
  const [projSearch, setProjSearch] = useState("");
  const [projCategory, setProjCategory] = useState("ALL");
  const [projStatus, setProjStatus] = useState("ALL");
  const [projPage, setProjPage] = useState(1);
  const projPerPage = 6;

  const [students, setStudents] = useState([
    { id: "1", name: "Darell Rangga Putra", email: "darell@ubsi.ac.id", nim: "12219999", prodi: "Sistem Informasi", campus: "UBSI Kaliabang", status: "VERIFIED", joinedAt: "2026-08-20" },
    { id: "2", name: "Adelia Putri", email: "adelia@ubsi.ac.id", nim: "12218888", prodi: "DKV", campus: "UBSI Fatmawati", status: "VERIFIED", joinedAt: "2026-08-22" },
    { id: "3", name: "Bima Arya", email: "bima@ubsi.ac.id", nim: "12217777", prodi: "Teknologi Informasi", campus: "UBSI Margonda", status: "PENDING", joinedAt: "2026-08-28" },
    { id: "4", name: "Siti Rahma", email: "siti.rahma@ubsi.ac.id", nim: "12216666", prodi: "Ilmu Komunikasi", campus: "UBSI Cengkareng", status: "PENDING", joinedAt: "2026-08-29" },
    { id: "5", name: "Fajar Pratama", email: "fajar@ui.ac.id", nim: "22061234", prodi: "Ilmu Komputer", campus: "Universitas Indonesia", status: "VERIFIED", joinedAt: "2026-08-15" },
    { id: "6", name: "Reza Rahardian", email: "reza@ubsi.ac.id", nim: "12215555", prodi: "Rekayasa Perangkat Lunak", campus: "UBSI Kaliabang", status: "VERIFIED", joinedAt: "2026-08-10" },
    { id: "7", name: "Nadia Safitri", email: "nadia@ubsi.ac.id", nim: "12214444", prodi: "Akuntansi", campus: "UBSI Kramat 98", status: "PENDING", joinedAt: "2026-08-30" },
    { id: "8", name: "Deni Kurniawan", email: "deni@ubsi.ac.id", nim: "12213333", prodi: "Manajemen Bisnis", campus: "UBSI BSD", status: "VERIFIED", joinedAt: "2026-08-18" },
  ]);

  const [payouts, setPayouts] = useState([
    { id: "PO-881", mhsName: "Darell Rangga Putra", bank: "BCA (8720192831)", amount: 650000, fee: 32500, net: 617500, date: "2026-08-29", status: "PENDING" },
    { id: "PO-882", mhsName: "Adelia Putri", bank: "Bank Mandiri (157000982716)", amount: 400000, fee: 20000, net: 380000, date: "2026-08-30", status: "PENDING" },
    { id: "PO-880", mhsName: "Fajar Pratama", bank: "GoPay / 081298761234", amount: 1200000, fee: 60000, net: 1140000, date: "2026-08-27", status: "COMPLETED" },
    { id: "PO-879", mhsName: "Reza Rahardian", bank: "BCA (8720334411)", amount: 800000, fee: 40000, net: 760000, date: "2026-08-25", status: "COMPLETED" },
    { id: "PO-878", mhsName: "Deni Kurniawan", bank: "BNI (0239182390)", amount: 500000, fee: 25000, net: 475000, date: "2026-08-24", status: "COMPLETED" },
  ]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [disputeRes, projectRes] = await Promise.all([
        disputeApi.getAll().catch(() => ({ data: [] })),
        projectApi.browse({ limit: 20 }).catch(() => ({ data: [] })),
      ]);
      setDisputes(disputeRes.data);
      setProjects(projectRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerifyStudent = (id) => {
    setStudents(students.map((s) => (s.id === id ? { ...s, status: "VERIFIED" } : s)));
    addToast("Identitas mahasiswa berhasil diverifikasi dan diberi lencana resmi.", "success");
  };

  const handleRejectStudent = (id) => {
    setStudents(students.map((s) => (s.id === id ? { ...s, status: "REJECTED" } : s)));
    addToast("Pengajuan verifikasi mahasiswa ditolak.", "warning");
  };

  const handleApprovePayout = (id) => {
    setPayouts(payouts.map((p) => (p.id === id ? { ...p, status: "COMPLETED" } : p)));
    addToast(`Pencairan dana ${id} berhasil diproses dan dilepaskan ke rekening bank.`, "success");
  };

  const handleResolveDispute = async (keputusan) => {
    if (!selectedDispute) return;
    try {
      setMediationSubmitting(true);
      await disputeApi.resolve(selectedDispute.id, {
        keputusan,
        catatan_admin: mediationNote || "Sengketa diselesaikan melalui mediasi resmi administrator Makarya.",
      });
      addToast(`Sengketa berhasil diselesaikan dengan putusan: ${keputusan}`, "success");
      setSelectedDispute(null);
      setMediationNote("");
      loadAdminData();
    } catch (err) {
      addToast("Gagal memproses putusan sengketa.", "error");
    } finally {
      setMediationSubmitting(false);
    }
  };

  const totalVolumeGmv = projects.reduce((acc, p) => acc + (parseFloat(p.budget_max) || 0), 0) + 2450000;
  const totalEscrowHolding = 3850000;
  const platformRevenue = totalVolumeGmv * 0.05;
  const openDisputes = disputes.filter((d) => d.status === "OPEN");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-dark-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-border">
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-brand-indigo/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold border border-white/10">
              <ShieldCheck className="w-4 h-4" />
              Makarya Operations & Oversight Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-tight font-normal text-white">
              Pusat Kendali & Pengawasan Administrator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl">
              Audit kliring keuangan escrow, mediasi sengketa mahasiswa-UMKM, verifikasi kampus, dan analitik performa ekosistem.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block">Sistem Escrow</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Pessimistic Lock Active
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAdminData}
              className="text-xs bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Activity className="w-3.5 h-3.5 mr-1.5" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border text-xs font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all shrink-0 ${
            activeTab === "overview" ? "bg-dark-900 text-white shadow-xs" : "text-muted hover:text-dark-900 hover:bg-surface"
          }`}
        >
          <PieChart className="w-4 h-4" />
          Ikhtisar & KPI Kampus
        </button>

        <button
          onClick={() => setActiveTab("escrow")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all shrink-0 ${
            activeTab === "escrow" ? "bg-dark-900 text-white shadow-xs" : "text-muted hover:text-dark-900 hover:bg-surface"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Kliring Escrow & Pencairan
          {payouts.filter((p) => p.status === "PENDING").length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("disputes")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all shrink-0 ${
            activeTab === "disputes" ? "bg-dark-900 text-white shadow-xs" : "text-muted hover:text-dark-900 hover:bg-surface"
          }`}
        >
          <Scale className="w-4 h-4" />
          Pusat Mediasi Sengketa
          {openDisputes.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px]">
              {openDisputes.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("kyc")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all shrink-0 ${
            activeTab === "kyc" ? "bg-dark-900 text-white shadow-xs" : "text-muted hover:text-dark-900 hover:bg-surface"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Verifikasi Mahasiswa
          {students.filter((s) => s.status === "PENDING").length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-brand-indigo text-white text-[10px]">
              {students.filter((s) => s.status === "PENDING").length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all shrink-0 ${
            activeTab === "projects" ? "bg-dark-900 text-white shadow-xs" : "text-muted hover:text-dark-900 hover:bg-surface"
          }`}
        >
          <Layers className="w-4 h-4" />
          Moderasi Proyek ({projects.length})
        </button>
      </div>

      {/* TAB 1: IKHTISAR & KPI KAMPUS */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted font-bold uppercase">
                <span>Total GMV Transaksi</span>
                <TrendingUp className="w-4 h-4 text-brand-indigo" />
              </div>
              <div className="text-2xl font-black text-dark-900 font-sans">
                {formatCurrency(totalVolumeGmv)}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% bulan ini
              </span>
            </Card>

            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted font-bold uppercase">
                <span>Dana Terkunci di Escrow</span>
                <Lock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-dark-900 font-sans">
                {formatCurrency(totalEscrowHolding)}
              </div>
              <span className="text-[11px] text-muted">Aman di rekening penampung</span>
            </Card>

            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted font-bold uppercase">
                <span>Pendapatan Fee Platform (5%)</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-800 font-sans">
                {formatCurrency(platformRevenue)}
              </div>
              <span className="text-[11px] text-muted">Akumulasi komisi berhasil</span>
            </Card>

            <Card className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted font-bold uppercase">
                <span>Tingkat Sukses Proyek</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-dark-900 font-sans">
                98.2%
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">Toleransi sengketa &lt; 2%</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-dark-900">Persebaran Talenta per Program Studi (UBSI)</h3>
                <GraduationCap className="w-4 h-4 text-brand-indigo" />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Sistem Informasi (Web, POS, Data)</span>
                    <span className="text-brand-indigo font-bold">42% (28 Mahasiswa)</span>
                  </div>
                  <div className="w-full h-2 bg-canvas rounded-full overflow-hidden border border-border">
                    <div className="h-full bg-brand-indigo rounded-full" style={{ width: "42%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Desain Komunikasi Visual (DKV)</span>
                    <span className="text-brand-cyan font-bold">30% (20 Mahasiswa)</span>
                  </div>
                  <div className="w-full h-2 bg-canvas rounded-full overflow-hidden border border-border">
                    <div className="h-full bg-brand-cyan rounded-full" style={{ width: "30%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Teknologi Informasi (Fullstack & UI/UX)</span>
                    <span className="text-amber-600 font-bold">18% (12 Mahasiswa)</span>
                  </div>
                  <div className="w-full h-2 bg-canvas rounded-full overflow-hidden border border-border">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "18%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Ilmu Komunikasi (Copywriting & Social Media)</span>
                    <span className="text-emerald-700 font-bold">10% (7 Mahasiswa)</span>
                  </div>
                  <div className="w-full h-2 bg-canvas rounded-full overflow-hidden border border-border">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-dark-900">Distribusi Kategori Kebutuhan UMKM</h3>
                <PieChart className="w-4 h-4 text-brand-indigo" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-canvas rounded-2xl border border-border space-y-1">
                  <span className="text-muted block text-[11px]">Desain Grafis & Logo</span>
                  <span className="text-base font-bold text-dark-900 block">34%</span>
                  <span className="text-[10px] text-muted">Kebutuhan paling tinggi</span>
                </div>
                <div className="p-3.5 bg-canvas rounded-2xl border border-border space-y-1">
                  <span className="text-muted block text-[11px]">Web & Coding POS</span>
                  <span className="text-base font-bold text-dark-900 block">26%</span>
                  <span className="text-[10px] text-muted">Nilai proyek terbesar</span>
                </div>
                <div className="p-3.5 bg-canvas rounded-2xl border border-border space-y-1">
                  <span className="text-muted block text-[11px]">Video Reels / TikTok</span>
                  <span className="text-base font-bold text-dark-900 block">20%</span>
                  <span className="text-[10px] text-muted">Pertumbuhan tercepat</span>
                </div>
                <div className="p-3.5 bg-canvas rounded-2xl border border-border space-y-1">
                  <span className="text-muted block text-[11px]">Copywriting & Admin Excel</span>
                  <span className="text-base font-bold text-dark-900 block">20%</span>
                  <span className="text-[10px] text-muted">Proyek mikro cepat</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: KLIRING ESCROW */}
      {activeTab === "escrow" && (
        <div className="space-y-6 animate-in fade-in">
          <SectionHeader
            badgeText="Financial Clearinghouse"
            title="Persetujuan Pencairan Dana (*Payout Queue*)"
            subtitle="Tinjau dan setujui penarikan honor mahasiswa setelah proyek diselesaikan dan disetujui klien UMKM."
          />

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-canvas border-b border-border text-dark-900 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">ID Transaksi</th>
                    <th className="py-3.5 px-4">Nama Mahasiswa</th>
                    <th className="py-3.5 px-4">Tujuan Rekening Bank / E-Wallet</th>
                    <th className="py-3.5 px-4">Total Bruto</th>
                    <th className="py-3.5 px-4">Fee Platform (5%)</th>
                    <th className="py-3.5 px-4">Net Cair</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payouts.map((po) => (
                    <tr key={po.id} className="hover:bg-canvas/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-dark-900">{po.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-dark-900">{po.mhsName}</td>
                      <td className="py-3.5 px-4 text-muted">{po.bank}</td>
                      <td className="py-3.5 px-4 font-semibold text-dark-900">{formatCurrency(po.amount)}</td>
                      <td className="py-3.5 px-4 text-rose-600 font-medium">-{formatCurrency(po.fee)}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800">{formatCurrency(po.net)}</td>
                      <td className="py-3.5 px-4">
                        {po.status === "COMPLETED" ? (
                          <Badge variant="success" className="text-[10px]">Telah Ditransfer</Badge>
                        ) : (
                          <Badge variant="warning" className="text-[10px]">Menunggu Approval</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {po.status === "PENDING" ? (
                          <Button
                            variant="brand"
                            size="sm"
                            onClick={() => handleApprovePayout(po.id)}
                            className="text-[11px] font-bold py-1 px-3 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Approve & Release
                          </Button>
                        ) : (
                          <span className="text-[11px] text-muted font-medium">Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
              {[
                { id: "ALL", label: "Semua Status" },
                { id: "PENDING", label: "Menunggu Approval" },
                { id: "COMPLETED", label: "Telah Ditransfer" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setEscrowStatus(tab.id);
                    setEscrowPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                    escrowStatus === tab.id
                      ? "bg-dark-900 text-white shadow-xs"
                      : "text-muted hover:text-dark-900 hover:bg-canvas"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari ID transaksi / nama / rekening..."
                value={escrowSearch}
                onChange={(e) => {
                  setEscrowSearch(e.target.value);
                  setEscrowPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-canvas border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo font-sans"
              />
            </div>
          </div>

          {(() => {
            const filteredPayouts = payouts.filter((po) => {
              const matchStatus = escrowStatus === "ALL" || po.status === escrowStatus;
              const searchLower = escrowSearch.trim().toLowerCase();
              const matchSearch =
                !searchLower ||
                po.id.toLowerCase().includes(searchLower) ||
                po.mhsName.toLowerCase().includes(searchLower) ||
                po.bank.toLowerCase().includes(searchLower);
              return matchStatus && matchSearch;
            });

            const totalEscrowPages = Math.ceil(filteredPayouts.length / escrowPerPage) || 1;
            const paginatedPayouts = filteredPayouts.slice(
              (escrowPage - 1) * escrowPerPage,
              escrowPage * escrowPerPage
            );

            return (
              <Card className="p-0 overflow-hidden rounded-2xl border border-border shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-canvas border-b border-border text-dark-900 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">ID Transaksi</th>
                        <th className="py-3.5 px-4">Nama Mahasiswa</th>
                        <th className="py-3.5 px-4">Tujuan Rekening Bank / E-Wallet</th>
                        <th className="py-3.5 px-4">Total Bruto</th>
                        <th className="py-3.5 px-4">Fee Platform (5%)</th>
                        <th className="py-3.5 px-4">Net Cair</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Aksi Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginatedPayouts.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="py-10 text-center text-muted">
                            Tidak ada data pencairan yang sesuai dengan filter pencarian.
                          </td>
                        </tr>
                      ) : (
                        paginatedPayouts.map((po) => (
                          <tr key={po.id} className="hover:bg-canvas/50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-dark-900">{po.id}</td>
                            <td className="py-3.5 px-4 font-semibold text-dark-900">{po.mhsName}</td>
                            <td className="py-3.5 px-4 text-muted">{po.bank}</td>
                            <td className="py-3.5 px-4 font-semibold text-dark-900">{formatCurrency(po.amount)}</td>
                            <td className="py-3.5 px-4 text-rose-600 font-medium">-{formatCurrency(po.fee)}</td>
                            <td className="py-3.5 px-4 font-bold text-emerald-800">{formatCurrency(po.net)}</td>
                            <td className="py-3.5 px-4">
                              {po.status === "COMPLETED" ? (
                                <Badge variant="success" className="text-[10px]">Telah Ditransfer</Badge>
                              ) : (
                                <Badge variant="warning" className="text-[10px]">Menunggu Approval</Badge>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {po.status === "PENDING" ? (
                                <Button
                                  variant="brand"
                                  size="sm"
                                  onClick={() => handleApprovePayout(po.id)}
                                  className="text-[11px] font-bold py-1 px-3 shadow-xs"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                  Approve & Release
                                </Button>
                              ) : (
                                <span className="text-[11px] text-muted font-medium">Selesai</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredPayouts.length > 0 && (
                  <div className="p-4 bg-surface border-t border-border">
                    <Pagination
                      currentPage={escrowPage}
                      totalPages={totalEscrowPages}
                      totalItems={filteredPayouts.length}
                      itemsPerPage={escrowPerPage}
                      onPageChange={(p) => setEscrowPage(p)}
                    />
                  </div>
                )}
              </Card>
            );
          })()}
        </div>
      )}

      {/* TAB 3: PUSAT MEDIASI SENGKETA */}
      {activeTab === "disputes" && (
        <div className="space-y-6 animate-in fade-in">
          <SectionHeader
            badgeText="Pusat Keadilan Ekosistem"
            title="Pusat Mediasi Sengketa Proyek"
            subtitle="Tinjau kasus kebuntuan deliverable antara UMKM dan Mahasiswa secara adil berdasarkan bukti brief dan karya yang diserahkan."
          />

          {disputes.length === 0 ? (
            <Card className="p-12 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-dark-900">Ekosistem 100% Kondusif</h4>
              <p className="text-xs text-muted max-w-md mx-auto">
                Tidak ada sengketa proyek yang sedang terbuka saat ini. Seluruh transaksi berjalan harmonis.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {disputes.map((d) => (
                <Card key={d.id} className="p-6 border-rose-200 bg-rose-50/20 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-rose-600" />
                      <h4 className="text-sm font-bold text-dark-900">Kasus Sengketa #{d.id.substring(0, 8)}</h4>
                      <Badge variant={d.status === "OPEN" ? "danger" : "success"} className="text-[10px]">
                        Status: {d.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted">Diajukan: {formatDate(d.created_at)}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-canvas rounded-xl border border-border space-y-1">
                      <span className="text-[10px] text-muted uppercase font-bold">Pihak Pelapor</span>
                      <span className="font-bold text-dark-900 block">{d.pelapor_role}</span>
                      <p className="text-muted leading-relaxed italic">"{d.alasan}"</p>
                    </div>

                    <div className="p-3 bg-canvas rounded-xl border border-border space-y-1">
                      <span className="text-[10px] text-muted uppercase font-bold">Dana Terkunci</span>
                      <span className="text-base font-bold text-rose-700 block font-sans">
                        {formatCurrency(d.nominal_dispute || 500000)}
                      </span>
                      <span className="text-[10px] text-muted">Tertahan di Rekening Penampung Escrow</span>
                    </div>
                  </div>

                  {d.status === "OPEN" && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                      <Button
                        variant="brand"
                        size="sm"
                        onClick={() => setSelectedDispute(d)}
                        className="text-xs font-bold shadow-brand"
                      >
                        <Scale className="w-3.5 h-3.5 mr-1" />
                        Buka Sidang Mediasi & Beri Putusan
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: VERIFIKASI MAHASISWA */}
      {activeTab === "kyc" && (
        <div className="space-y-6 animate-in fade-in">
          <SectionHeader
            badgeText="Integritas Akademik"
            title="Verifikasi Identitas Mahasiswa Kampus"
            subtitle="Validasi kepemilikan email institusi (.ac.id), Nomor Induk Mahasiswa (NIM), dan Program Studi aktif."
          />

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-canvas border-b border-border text-dark-900 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Nama Mahasiswa</th>
                    <th className="py-3.5 px-4">Email Kampus (.ac.id)</th>
                    <th className="py-3.5 px-4">NIM</th>
                    <th className="py-3.5 px-4">Program Studi</th>
                    <th className="py-3.5 px-4">Kampus</th>
                    <th className="py-3.5 px-4">Status Akun</th>
                    <th className="py-3.5 px-4 text-right">Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((mhs) => (
                    <tr key={mhs.id} className="hover:bg-canvas/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-dark-900">{mhs.name}</td>
                      <td className="py-3.5 px-4 font-mono text-brand-indigo font-medium">{mhs.email}</td>
                      <td className="py-3.5 px-4 font-mono text-muted">{mhs.nim}</td>
                      <td className="py-3.5 px-4 text-dark-900 font-semibold">{mhs.prodi}</td>
                      <td className="py-3.5 px-4 text-muted">{mhs.campus}</td>
                      <td className="py-3.5 px-4">
                        {mhs.status === "VERIFIED" ? (
                          <Badge variant="success" className="text-[10px]">Terverifikasi</Badge>
                        ) : (
                          mhs.status === "REJECTED" ? (
                            <Badge variant="danger" className="text-[10px]">Ditolak</Badge>
                          ) : (
                            <Badge variant="warning" className="text-[10px]">Menunggu Validasi</Badge>
                          )
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {mhs.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="brand"
                              size="sm"
                              onClick={() => handleVerifyStudent(mhs.id)}
                              className="text-[10px] font-bold py-1 px-2.5"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Verifikasi
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectStudent(mhs.id)}
                              className="text-[10px] font-bold py-1 px-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                            >
                              Tolak
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted">Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
              {[
                { id: "ALL", label: "Semua Status" },
                { id: "PENDING", label: "Menunggu Validasi" },
                { id: "VERIFIED", label: "Terverifikasi" },
                { id: "REJECTED", label: "Ditolak" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setKycStatus(tab.id);
                    setKycPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                    kycStatus === tab.id
                      ? "bg-dark-900 text-white shadow-xs"
                      : "text-muted hover:text-dark-900 hover:bg-canvas"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama / email / NIM / prodi..."
                value={kycSearch}
                onChange={(e) => {
                  setKycSearch(e.target.value);
                  setKycPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-canvas border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo font-sans"
              />
            </div>
          </div>

          {(() => {
            const filteredStudents = students.filter((mhs) => {
              const matchStatus = kycStatus === "ALL" || mhs.status === kycStatus;
              const searchLower = kycSearch.trim().toLowerCase();
              const matchSearch =
                !searchLower ||
                mhs.name.toLowerCase().includes(searchLower) ||
                mhs.email.toLowerCase().includes(searchLower) ||
                mhs.nim.toLowerCase().includes(searchLower) ||
                mhs.prodi.toLowerCase().includes(searchLower) ||
                mhs.campus.toLowerCase().includes(searchLower);
              return matchStatus && matchSearch;
            });

            const totalKycPages = Math.ceil(filteredStudents.length / kycPerPage) || 1;
            const paginatedStudents = filteredStudents.slice(
              (kycPage - 1) * kycPerPage,
              kycPage * kycPerPage
            );

            return (
              <Card className="p-0 overflow-hidden rounded-2xl border border-border shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-canvas border-b border-border text-dark-900 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Nama Mahasiswa</th>
                        <th className="py-3.5 px-4">Email Kampus (.ac.id)</th>
                        <th className="py-3.5 px-4">NIM</th>
                        <th className="py-3.5 px-4">Program Studi</th>
                        <th className="py-3.5 px-4">Kampus</th>
                        <th className="py-3.5 px-4">Status Akun</th>
                        <th className="py-3.5 px-4 text-right">Verifikasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginatedStudents.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-10 text-center text-muted">
                            Tidak ada data mahasiswa yang sesuai dengan filter pencarian.
                          </td>
                        </tr>
                      ) : (
                        paginatedStudents.map((mhs) => (
                          <tr key={mhs.id} className="hover:bg-canvas/50 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-dark-900">{mhs.name}</td>
                            <td className="py-3.5 px-4 font-mono text-brand-indigo font-medium">{mhs.email}</td>
                            <td className="py-3.5 px-4 font-mono text-muted">{mhs.nim}</td>
                            <td className="py-3.5 px-4 text-dark-900 font-semibold">{mhs.prodi}</td>
                            <td className="py-3.5 px-4 text-muted">{mhs.campus}</td>
                            <td className="py-3.5 px-4">
                              {mhs.status === "VERIFIED" ? (
                                <Badge variant="success" className="text-[10px]">Terverifikasi</Badge>
                              ) : (
                                mhs.status === "REJECTED" ? (
                                  <Badge variant="danger" className="text-[10px]">Ditolak</Badge>
                                ) : (
                                  <Badge variant="warning" className="text-[10px]">Menunggu Validasi</Badge>
                                )
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {mhs.status === "PENDING" ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <Button
                                    variant="brand"
                                    size="sm"
                                    onClick={() => handleVerifyStudent(mhs.id)}
                                    className="text-[10px] font-bold py-1 px-2.5"
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Verifikasi
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRejectStudent(mhs.id)}
                                    className="text-[10px] font-bold py-1 px-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                                  >
                                    Tolak
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-muted">Selesai</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredStudents.length > 0 && (
                  <div className="p-4 bg-surface border-t border-border">
                    <Pagination
                      currentPage={kycPage}
                      totalPages={totalKycPages}
                      totalItems={filteredStudents.length}
                      itemsPerPage={kycPerPage}
                      onPageChange={(p) => setKycPage(p)}
                    />
                  </div>
                )}
              </Card>
            );
          })()}
        </div>
      )}

      {/* TAB 5: MODERASI PROYEK */}
      {activeTab === "projects" && (
        <div className="space-y-6 animate-in fade-in">
          <SectionHeader
            badgeText="Quality Control"
            title="Pengawasan & Moderasi Proyek Terbit"
            subtitle="Audit kepatuhan batas pagu anggaran (Maks Rp 2 Juta) dan kesesuaian deskripsi etis proyek."
          />

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-canvas border-b border-border text-dark-900 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Judul Kebutuhan</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4">Maks Budget</th>
                    <th className="py-3.5 px-4">Tenggat Waktu</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-canvas/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-dark-900 max-w-xs truncate">{proj.judul}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="brand" className="text-[10px]">{proj.kategori}</Badge>
                      </td>
                      <td className="py-3.5 px-4 font-bold font-sans text-dark-900">{formatCurrency(proj.budget_max)}</td>
                      <td className="py-3.5 px-4 text-muted">{proj.deadline}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="success" className="text-[10px]">{proj.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link to={`/projects/${proj.id}`}>
                          <Button variant="outline" size="sm" className="text-[11px] py-1 px-3">
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Inspeksi Proyek
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
              {[
                { id: "ALL", label: "Semua Kategori" },
                { id: "DESIGN", label: "Desain Grafis" },
                { id: "UIUX", label: "UI/UX" },
                { id: "PEMROGRAMAN", label: "Web Coding" },
                { id: "VIDEO", label: "Video" },
                { id: "COPYWRITING", label: "Copywriting" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setProjCategory(tab.id);
                    setProjPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                    projCategory === tab.id
                      ? "bg-dark-900 text-white shadow-xs"
                      : "text-muted hover:text-dark-900 hover:bg-canvas"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari judul / deskripsi proyek..."
                value={projSearch}
                onChange={(e) => {
                  setProjSearch(e.target.value);
                  setProjPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-canvas border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo font-sans"
              />
            </div>
          </div>

          {(() => {
            const filteredProjects = projects.filter((proj) => {
              const matchCategory = projCategory === "ALL" || proj.kategori === projCategory;
              const matchStatus = projStatus === "ALL" || proj.status === projStatus;
              const searchLower = projSearch.trim().toLowerCase();
              const matchSearch =
                !searchLower ||
                proj.judul.toLowerCase().includes(searchLower) ||
                (proj.deskripsi_raw || "").toLowerCase().includes(searchLower);
              return matchCategory && matchStatus && matchSearch;
            });

            const totalProjPages = Math.ceil(filteredProjects.length / projPerPage) || 1;
            const paginatedProjects = filteredProjects.slice(
              (projPage - 1) * projPerPage,
              projPage * projPerPage
            );

            return (
              <Card className="p-0 overflow-hidden rounded-2xl border border-border shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-canvas border-b border-border text-dark-900 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Judul Kebutuhan</th>
                        <th className="py-3.5 px-4">Kategori</th>
                        <th className="py-3.5 px-4">Maks Budget</th>
                        <th className="py-3.5 px-4">Tenggat Waktu</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginatedProjects.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-10 text-center text-muted">
                            Tidak ada proyek yang sesuai dengan filter pencarian.
                          </td>
                        </tr>
                      ) : (
                        paginatedProjects.map((proj) => (
                          <tr key={proj.id} className="hover:bg-canvas/50 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-dark-900 max-w-xs truncate">{proj.judul}</td>
                            <td className="py-3.5 px-4">
                              <Badge variant="brand" className="text-[10px]">{proj.kategori}</Badge>
                            </td>
                            <td className="py-3.5 px-4 font-bold font-sans text-dark-900">{formatCurrency(proj.budget_max)}</td>
                            <td className="py-3.5 px-4 text-muted">{proj.deadline}</td>
                            <td className="py-3.5 px-4">
                              <Badge variant="success" className="text-[10px]">{proj.status}</Badge>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <Link to={`/projects/${proj.id}`}>
                                <Button variant="outline" size="sm" className="text-[11px] py-1 px-3">
                                  <Eye className="w-3.5 h-3.5 mr-1" />
                                  Inspeksi Proyek
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredProjects.length > 0 && (
                  <div className="p-4 bg-surface border-t border-border">
                    <Pagination
                      currentPage={projPage}
                      totalPages={totalProjPages}
                      totalItems={filteredProjects.length}
                      itemsPerPage={projPerPage}
                      onPageChange={(p) => setProjPage(p)}
                    />
                  </div>
                )}
              </Card>
            );
          })()}
        </div>
      )}

      {/* MODAL SIDANG MEDIASI SENGKETA */}
      {selectedDispute && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDispute(null)}
          title={`Sidang Mediasi Sengketa #${selectedDispute.id.substring(0, 8)}`}
        >
          <div className="space-y-5 text-xs text-dark-900 text-left">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
              <span className="font-bold text-rose-900 block">Klaim Pelapor ({selectedDispute.pelapor_role}):</span>
              <p className="text-rose-800 leading-relaxed italic">"{selectedDispute.alasan}"</p>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-dark-900 uppercase tracking-wider text-[11px]">
                Catatan & Pertimbangan Resmi Administrator:
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan alasan putusan resmi berdasarkan evaluasi deliverable..."
                value={mediationNote}
                onChange={(e) => setMediationNote(e.target.value)}
                className="w-full p-3 text-xs bg-canvas border border-border rounded-xl focus:outline-none focus:border-brand-indigo text-dark-900"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <span className="block font-bold text-dark-900 text-xs">Pilih Putusan Mediasi Admin:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleResolveDispute("RELEASE_TO_MHS")}
                  disabled={mediationSubmitting}
                  className="p-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-left font-bold transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="block text-xs">Cairkan ke MHS</span>
                  <span className="text-[10px] text-emerald-700 font-normal">Deliverable sesuai</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolveDispute("REFUND_UMKM")}
                  disabled={mediationSubmitting}
                  className="p-3 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-900 text-left font-bold transition-all"
                >
                  <XCircle className="w-4 h-4 text-rose-600 mb-1" />
                  <span className="block text-xs">Refund ke UMKM</span>
                  <span className="text-[10px] text-rose-700 font-normal">Mhs wanprestasi</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolveDispute("SPLIT_50_50")}
                  disabled={mediationSubmitting}
                  className="p-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-left font-bold transition-all"
                >
                  <Scale className="w-4 h-4 text-amber-600 mb-1" />
                  <span className="block text-xs">Split 50 : 50</span>
                  <span className="text-[10px] text-amber-700 font-normal">Kompromi adil</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
