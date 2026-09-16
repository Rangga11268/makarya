import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import {
  GraduationCap,
  Award,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
  Sparkles,
  RotateCcw,
} from "lucide-react";

const SUS_QUESTIONS = [
  {
    id: 1,
    text: "Saya merasa akan sering menggunakan sistem Makarya ini dalam berkolaborasi proyek.",
    type: "positive",
  },
  {
    id: 2,
    text: "Saya merasa sistem Makarya ini terlalu rumit untuk digunakan.",
    type: "negative",
  },
  {
    id: 3,
    text: "Saya merasa sistem Makarya ini mudah dan intuitif untuk digunakan.",
    type: "positive",
  },
  {
    id: 4,
    text: "Saya merasa membutuhkan bantuan tenaga ahli/teknis untuk dapat menggunakan sistem ini.",
    type: "negative",
  },
  {
    id: 5,
    text: "Saya merasa berbagai fungsi dan fitur pada sistem ini terintegrasi dengan sangat baik.",
    type: "positive",
  },
  {
    id: 6,
    text: "Saya merasa ada terlalu banyak ketidakkonsistenan pada sistem ini.",
    type: "negative",
  },
  {
    id: 7,
    text: "Saya merasa sebagian besar orang akan dapat mempelajari sistem ini dengan sangat cepat.",
    type: "positive",
  },
  {
    id: 8,
    text: "Saya merasa sistem ini sangat membingungkan ketika digunakan.",
    type: "negative",
  },
  {
    id: 9,
    text: "Saya merasa sangat percaya diri saat bernavigasi dan menggunakan sistem ini.",
    type: "positive",
  },
  {
    id: 10,
    text: "Saya harus mempelajari banyak hal terlebih dahulu sebelum dapat menggunakan sistem ini secara mandiri.",
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
    let adjective = "OK";
    let acceptability = "Marginal";
    let colorClass = "text-amber-600 bg-amber-50 border-amber-200";

    if (finalScore >= 80.3) {
      grade = "A";
      adjective = "Excellent / Best Imaginable";
      acceptability = "Acceptable (Sangat Layak)";
      colorClass = "text-emerald-700 bg-emerald-50 border-emerald-300";
    } else if (finalScore >= 68) {
      grade = "B";
      adjective = "Good";
      acceptability = "Acceptable (Layak Digunakan)";
      colorClass = "text-blue-700 bg-blue-50 border-blue-300";
    } else if (finalScore >= 51) {
      grade = "C";
      adjective = "OK";
      acceptability = "Marginal (Cukup)";
      colorClass = "text-amber-700 bg-amber-50 border-amber-300";
    } else {
      grade = "F";
      adjective = "Poor / Awful";
      acceptability = "Not Acceptable (Perlu Perbaikan)";
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
      title="Instrumen Pengujian SUS (System Usability Scale) - Skripsi"
    >
      <div className="space-y-5 font-sans">
        {/* Banner Info Skripsi */}
        <div className="p-3.5 bg-brand-indigo-light/25 border border-brand-indigo/20 rounded-2xl flex items-start gap-3 text-xs">
          <GraduationCap className="w-5 h-5 text-brand-indigo shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">
              Evaluasi Kualitas Perangkat Lunak (ISO 9241-11)
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Kuesioner standar SUS terdiri dari 10 pertanyaan Likert untuk
              mengukur tingkat kebergunaan (usability) platform Makarya. Skor di
              atas 68.0 menunjukkan sistem di atas rata-rata industri (*above
              average*).
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
                  Sangat Tidak Setuju (1)
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
        <div className={`p-4 border rounded-2xl space-y-3 ${result.colorClass}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Hasil Kalkulasi SUS Score
              </span>
            </div>
            <span className="text-2xl font-black font-sans tracking-tight">
              {result.finalScore} / 100
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-current/20 text-xs">
            <div>
              <span className="text-[10px] opacity-75 block">Grade Letter</span>
              <span className="font-black text-sm">Grade {result.grade}</span>
            </div>
            <div>
              <span className="text-[10px] opacity-75 block">Adjective</span>
              <span className="font-bold text-xs truncate block">
                {result.adjective}
              </span>
            </div>
            <div>
              <span className="text-[10px] opacity-75 block">Acceptability</span>
              <span className="font-bold text-xs truncate block">
                {result.acceptability}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <Button
            variant="outline"
            size="sm"
            onClick={resetForm}
            className="text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs font-semibold"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              Cetak / Simpan PDF
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={onClose}
              className="text-xs font-bold shadow-brand"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Tutup & Simpan
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
