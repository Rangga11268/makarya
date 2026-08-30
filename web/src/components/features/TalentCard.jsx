import React from "react";
import { StarRating } from "../ui/StarRating";
import { Badge } from "../ui/Badge";
import { GraduationCap, CheckCircle2 } from "lucide-react";

export function TalentCard({ name, prodi, rating = 5.0, totalJobs = 0, skills = [], avatarUrl }) {
  return (
    <div className="bg-surface rounded-card border border-border p-5 flex flex-col justify-between hover:border-dark-800/40 hover:shadow-sm transition-all duration-200">
      <div>
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="w-12 h-12 rounded-full bg-dark-900 text-lime font-serif text-lg font-bold flex items-center justify-center shrink-0 border border-dark-900">
            {name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-dark-900 truncate font-sans">{name}</h4>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted mt-0.5 truncate">
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{prodi}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between py-2.5 px-3 bg-canvas rounded-xl border border-border mb-3.5">
          <StarRating rating={rating} size="xs" />
          <span className="text-[11px] font-semibold text-dark-900">
            {totalJobs} Proyek Selesai
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-soft border border-border text-dark-900"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}