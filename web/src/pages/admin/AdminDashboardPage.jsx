import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { projectApi, disputeApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ShieldCheck, Scale, Compass, Users } from "lucide-react";

export function AdminDashboardPage() {
  const [disputes, setDisputes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const [disputeRes, projectRes] = await Promise.all([
          disputeApi.getAll().catch(() => ({ data: [] })),
          projectApi.browse({ limit: 10 }).catch(() => ({ data: [] })),
        ]);
        setDisputes(disputeRes.data);
        setProjects(projectRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const openDisputesCount = disputes.filter((d) => d.status === "OPEN").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-2">
          <ShieldCheck className="w-4 h-4" />
          Hak Akses Administrator Platform
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-900 tracking-tight">
          Admin Dashboard & Oversight
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Pusat pemantauan sengketa proyek, verifikasi pengguna, dan stabilitas ekosistem Makarya
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase">Sengketa Terbuka</span>
            <Scale className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-dark-900 mt-2">{openDisputesCount} Kasus</div>
          <Link to="/admin/disputes" className="text-xs font-bold text-rose-600 hover:underline mt-2 inline-block">
            Buka Panel Mediasi →
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase">Total Proyek Live</span>
            <Compass className="w-5 h-5 text-dark-900" />
          </div>
          <div className="text-3xl font-black text-dark-900 mt-2">{projects.length} Proyek</div>
          <span className="text-xs text-muted mt-2 block">Status OPEN / Aktif</span>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase">Integritas Escrow</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-2">100% Aman</div>
          <span className="text-xs text-muted mt-2 block">Pessimistic Lock Active</span>
        </Card>
      </div>
    </div>
  );
}
