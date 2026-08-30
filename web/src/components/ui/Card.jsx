import React from "react";
import { cn } from "../../utils/cn";

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "bg-surface rounded-card border border-border p-5 md:p-6 transition-all duration-200",
        hover && "hover:border-dark-800/40 hover:shadow-sm cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
