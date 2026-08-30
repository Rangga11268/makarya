import React from "react";
import { Inbox } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";

export function EmptyState({
  icon: Icon = Inbox,
  title = "Tidak ada data",
  description = "Belum ada informasi yang tersedia saat ini.",
  actionLabel,
  onAction,
}) {
  return (
    <Card className="text-center py-12 sm:py-16 px-6 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-canvas border border-border flex items-center justify-center mx-auto mb-3 text-muted">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-bold text-dark-900 font-sans">{title}</h3>
      <p className="text-xs text-muted mt-1 mb-5 leading-relaxed font-sans">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}