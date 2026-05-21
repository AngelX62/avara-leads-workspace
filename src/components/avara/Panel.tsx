import * as React from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: "default" | "glass" | "raised" }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border hairline overflow-hidden",
        tone === "glass" && "glass shadow-panel",
        tone === "raised" && "bg-[var(--surface-1)] shadow-panel",
        tone === "default" && "bg-[var(--surface-1)]/80",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  hint,
  right,
  className,
}: {
  title: React.ReactNode;
  hint?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3 px-5 pt-4 pb-3", className)}>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {hint}
        </div>
        <div className="text-[14px] font-semibold tracking-tight">{title}</div>
      </div>
      {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
    </div>
  );
}
