import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import {
  ClipboardCheck,
  Award,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
  Sparkles,
  RotateCcw,
  Info,
} from "lucide-react";

const SUS_QUESTIONS = [
  {
    id: 1,
    text: "Saya merasa ingin sering menggunakan sistem Makarya ini untuk mencari atau mengelola proyek.",
    type: "positive",
  },
  {
    id: 2,
    text: "Saya merasa sistem Makarya ini terlalu rumit atau sulit dipahami.",
    type: "negative",
  },
  {
    id: 3,
    text: "Saya merasa sistem Makarya ini mudah dan praktis digunakan.",
    type: "positive",
  },
  {
    id: 4,
    text: "Saya merasa membutuhkan panduan atau bantuan orang lain untuk bisa menggunakan sistem ini.",
    type: "negative",
  },
  {
    id: 5,
    text: "Saya merasa fitur-fitur di dalam sistem ini tersusun dan bekerja sama dengan sangat baik.",
    type: "positive",
  },
  {
    id: 6,
    text: "Saya merasa ada hal-hal yang tidak konsisten atau membingungkan di sistem ini.",
    type: "negative",
  },
  {
    id: 7,
    text: "Saya yakin kebanyakan orang akan bisa mempelajari sistem ini dengan cepat.",
    type: "positive",
  },
  {
    id: 8,
    text: "Saya merasa alur penggunaan sistem ini membingungkan.",
    type: "negative",
  },
  {
    id: 9,
    text: "Saya merasa percaya diri dan nyaman saat bernavigasi di sistem ini.",
    type: "positive",
  },
  {
    id: 10,
    text: "Saya harus banyak belajar terlebih dahulu sebelum bisa lancar menggunakan sistem ini.",
    type: "negative",
  },
];

export function SystemUsabilityScaleModal({
  isOpen,
  onClose,
  currentUserRole = "Pengguna",
  currentUserName = "Responden Pengujian",
}) {
  const [answers, setAnswers] = useState({
    1: 4,
    2: 2,
    3: 5,
    4: 1,
    5: 5,
    6: 1,
    7: 5,
    8: 1,
    9: 5,
    10: 1,
  });

  const [isCalculated, setIsCalculated] = useState(false);

  // SUS Scoring Calculation Formula (John Brooke, 1986)
  const calculateSUS = () => {
    let oddSum = 0; // Question 1, 3, 5, 7, 9: (score - 1)
    let evenSum = 0; // Question 2, 4, 6, 8, 10: (5 - score)

    for (let i = 1; i <= 10; i++) {
      const val = answers[i] || 3;
      if (i % 2 === 1) {
        oddSum += val - 1;
      } else {
        evenSum += 5 - val;
      }
    }

    const totalRaw = oddSum + evenSum;
    const finalScore = totalRaw * 2.5;

    let grade = "C";
    let adjective = "Cukup Baik";
    let acceptability = "Cukup Diterima";
    let colorClass = "text-amber-700 bg-amber-50 border-amber-200";

    if (finalScore >= 80.3) {
      grade = "A";
      adjective = "Sangat Baik (Mudah Digunakan)";
      acceptability = "Sangat Memuaskan";
      colorClass = "text-emerald-700 bg-emerald-50 border-emerald-300";
    } else if (finalScore >= 68) {
      grade = "B";
      adjective = "Baik (Di Atas Rata-rata)";
      acceptability = "Layak & Nyaman Digunakan";
      colorClass = "text-blue-700 bg-blue-50 border-blue-300";
    } else if (finalScore >= 51) {
      grade = "C";
      adjective = "Cukup (Bisa Digunakan)";
      acceptability = "Cukup Diterima";
      colorClass = "text-amber-700 bg-amber-50 border-amber-300";
    } else {
      grade = "F";
      adjective = "Perlu Banyak Perbaikan";
      acceptability = "Belum Memuaskan";
      colorClass = "text-rose-700 bg-rose-50 border-rose-300";
    }

    return {
      finalScore: finalScore.toFixed(1),
      grade,
      adjective,
      acceptability,
      colorClass,
    };
  };

  const result = calculateSUS();

  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const resetForm = () => {
    setAnswers({
      1: 3,
      2: 3,
      3: 3,
      4: 3,
      5: 3,
      6: 3,
      7: 3,
      8: 3,
      9: 3,
      10: 3,
    });
    setIsCalculated(false);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Penilaian Kemudahan Aplikasi (Evaluasi SUS)"
    >
      <div className="space-y-5 font-sans">
        {/* Banner Info Sederhana */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3 text-xs">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">
              Evaluasi Kemudahan Sistem
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Bantu kami menyempurnakan platform Makarya dengan memberikan penilaian pada 10 pertanyaan di bawah ini (pilihan 1: Sangat Tidak Setuju s/d 5: Sangat Setuju).
            </p>
          </div>
        </div>

        {/* Form Pertanyaan */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {SUS_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs"
            >
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 font-mono font-bold text-slate-700 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  {q.id}
                </span>
                <p className="font-medium text-slate-800 leading-snug flex-1">
                  {q.text}
                </p>
              </div>

              {/* Likert Scale 1-5 Radios */}
              <div className="flex items-center justify-between gap-1 pt-1.5 px-2 border-t border-slate-200/60 text-[11px]">
                <span className="text-[10px] text-slate-400 font-medium">
                  Tidak Setuju (1)
                </span>
                <div className="flex items-center gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelect(q.id, val)}
                      className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                        answers[q.id] === val
                          ? "bg-brand-indigo text-white shadow-xs scale-105"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  Sangat Setuju (5)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Score Summary Card */}
        <div
          className={`p-4 border rounded-2xl space-y-3 ${result.colorClass}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Hasil Skor Penilaian
              </span>
            </div>
            <span className="text-2xl font-black font-sans tracking-tight">
              {result.finalScore} / 100
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-current/15">
            <div>
              <span className="text-[10px] opacity-75 uppercase tracking-wide block">
                Peringkat
              </span>
              <span className="font-bold text-sm">
                Grade {result.grade} ({result.adjective})
              </span>
            </div>
            <div>
              <span className="text-[10px] opacity-75 uppercase tracking-wide block">
                Keterangan
              </span>
              <span className="font-semibold">{result.acceptability}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetForm}
            className="flex items-center gap-1.5 text-slate-600 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Atur Ulang
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            Selesai & Simpan
          </Button>
        </div>
      </div>
    </Modal>
  );
}
