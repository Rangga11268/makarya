import React, { useState } from "react";
import { StarRating } from "../ui/StarRating";
import { GraduationCap, CheckCircle2 } from "lucide-react";

export function TalentCard({ name, prodi, rating = 5.0, totalJobs = 0, skills = [], avatarUrl }) {
  const [imgError, setImgError] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : "M";

  return (
    <div className="bg-surface rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-brand-indigo/30 hover:shadow-xs transition-all duration-200 group">
      <div>
        <div className="flex items-start gap-3.5 mb-3.5">
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={name}
              onError={() => setImgError(true)}
              className="w-12 h-12 rounded-full object-cover shrink-0 border border-border group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-cyan to-brand-indigo text-white font-serif text-lg font-bold flex items-center justify-center shrink-0 shadow-xs select-none">
              {initial}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-dark-900 truncate font-sans">{name}</h4>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted mt-0.5 truncate font-sans">
              <GraduationCap className="w-3.5 h-3.5 shrink-0 text-brand-indigo" />
              <span className="truncate">{prodi}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between py-2.5 px-3 bg-canvas rounded-xl border border-border mb-3.5">
          <StarRating rating={rating} size="xs" />
          <span className="text-[11px] font-semibold text-dark-900 font-sans">
            {totalJobs} Proyek Selesai
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-indigo-light text-brand-indigo border border-brand-indigo/10 font-sans"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}