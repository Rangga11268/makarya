import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../theme/fonts";
import { ProposalCard } from "../../../components/features/ProposalCard";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import {
  Users,
  Calendar,
  Briefcase,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  ShieldCheck,
} from "lucide-react-native";

export function ApplicantReviewBoardView({
  project,
  proposals = [],
  onAcceptProposal,
  onRejectProposal,
  actionLoading = false,
  selectedProposalToAccept,
}) {
  const [isBriefExpanded, setIsBriefExpanded] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Project Snapshot Header Card */}
      <View style={styles.projectHeaderCard}>
        <View style={styles.headerTopRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {project.kategori || "UMKM DIGITAL"}
            </Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusPillText}>Tahap Seleksi Pelamar</Text>
          </View>
        </View>

        <Text style={styles.projectTitle}>{project.judul}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Calendar size={13} color="#64748B" />
            <Text style={styles.metaItemText}>
              Tenggat: {formatDate(project.deadline)}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <Text style={styles.budgetValue}>
            Pagu {formatCurrency(project.budget_max)}
          </Text>
        </View>

        {/* Collapsible Brief Toggle (Doesn't eat screen space) */}
        <TouchableOpacity
          style={styles.briefToggleBtn}
          onPress={() => setIsBriefExpanded(!isBriefExpanded)}
          activeOpacity={0.7}
        >
          <FileText size={14} color="#2563EB" />
          <Text style={styles.briefToggleText}>
            {isBriefExpanded
              ? "Sembunyikan Rincian Brief"
              : "Lihat Rincian Brief Proyek"}
          </Text>
          {isBriefExpanded ? (
            <ChevronUp size={16} color="#2563EB" />
          ) : (
            <ChevronDown size={16} color="#2563EB" />
          )}
        </TouchableOpacity>

        {isBriefExpanded && (
          <View style={styles.briefContentBox}>
            <Text style={styles.briefBodyText}>{project.deskripsi_raw}</Text>
            {Array.isArray(project.deliverables) &&
              project.deliverables.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.deliverableMiniTitle}>
                    Luaran Deliverable:
                  </Text>
                  {project.deliverables.map((d, i) => (
                    <Text key={i} style={styles.deliverableItemText}>
                      • {d}
                    </Text>
                  ))}
                </View>
              )}
          </View>
        )}
      </View>

      {/* 2. Applicant Section Header (Flat, no card-ception) */}
      <View style={styles.applicantHeaderRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Users size={15} color="#2563EB" />
          <Text style={styles.applicantCountTitle}>
            {proposals.length} Proposal Mahasiswa Masuk
          </Text>
        </View>
        <Text style={styles.applicantCountSub}>
          Tinjau portofolio, nilai tawaran, dan setujui 1 mahasiswa untuk
          memulai kontrak kerja.
        </Text>
      </View>

      {/* 3. Candidate Stack (Daftar Proposal) */}
      <View style={styles.proposalListWrap}>
        {proposals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Users size={36} color="#94A3B8" />
            <Text style={styles.emptyTitle}>Belum Ada Proposal Masuk</Text>
            <Text style={styles.emptySub}>
              Proyek Anda sedang aktif ditayangkan di katalog eksplorasi
              mahasiswa. Begitu mahasiswa mengajukan penawaran, daftar kandidat
              akan muncul di sini.
            </Text>
          </View>
        ) : (
          proposals.map((prop) => (
            <ProposalCard
              key={prop.id}
              proposal={prop}
              projectSlots={project.slots}
              isMultiSlot={
                Boolean(project.slots && project.slots.length > 1) ||
                project.tipe_kolaborasi === "TIM"
              }
              onAccept={() => onAcceptProposal(prop)}
              onReject={() => onRejectProposal(prop.id)}
              loadingAccept={
                actionLoading && selectedProposalToAccept?.id === prop.id
              }
              loadingReject={actionLoading}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  projectHeaderCard: {
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.94)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    backgroundColor: "rgba(15, 23, 42, 0.04)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: 0.4,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563EB",
  },
  statusPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#2563EB",
    fontWeight: "700",
  },
  projectTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 10,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaItemText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#64748B",
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
  },
  budgetValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0F172A",
    marginLeft: "auto",
  },
  briefToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(37, 99, 235, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 12,
    gap: 6,
  },
  briefToggleText: {
    flex: 1,
    fontFamily: FONTS.displayBold,
    fontSize: 11.5,
    color: "#2563EB",
    fontWeight: "700",
  },
  briefContentBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  briefBodyText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
  },
  deliverableMiniTitle: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 11,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4,
  },
  deliverableItemText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    marginLeft: 4,
  },
  applicantHeaderRow: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  applicantCountTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  applicantCountSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 15,
  },
  proposalListWrap: {
    gap: 8,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
  },
  emptyTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 10,
  },
  emptySub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 17,
  },
});
