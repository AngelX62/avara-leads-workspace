import { cn } from "@/lib/utils";
import type { Source, Risk, Classification } from "@/lib/mock/data";
import { Instagram, MessageCircle, Globe, Mail, Users, FileSpreadsheet } from "lucide-react";

const sourceMeta: Record<Source, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  Instagram: { icon: Instagram, label: "Instagram" },
  WhatsApp: { icon: MessageCircle, label: "WhatsApp" },
  Website: { icon: Globe, label: "Website" },
  Email: { icon: Mail, label: "Email" },
  Referral: { icon: Users, label: "Referral" },
  Spreadsheet: { icon: FileSpreadsheet, label: "Spreadsheet" },
};

export function SourceBadge({ source, className }: { source: Source; className?: string }) {
  const M = sourceMeta[source];
  const Icon = M.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border hairline bg-[var(--surface-2)]/60 px-2 py-0.5 text-[11px] text-muted-foreground",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {M.label}
    </span>
  );
}

export function RiskPill({ risk }: { risk: Risk }) {
  const map = {
    hot: { label: "Hot", cls: "bg-coral-soft text-coral border-coral/30" },
    cooling: { label: "Cooling", cls: "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30" },
    cold: { label: "Going cold", cls: "bg-[var(--surface-2)] text-muted-foreground border-hairline" },
    recovered: { label: "Recovered", cls: "bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30" },
  } as const;
  const m = map[risk];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium", m.cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
}

export function ClassificationChip({ c }: { c: Classification }) {
  return (
    <span className="inline-flex items-center rounded-md border hairline bg-[var(--surface-2)]/40 px-2 py-0.5 text-[11px] text-muted-foreground">
      {c}
    </span>
  );
}

export function MissingChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-coral/30 bg-coral-soft px-1.5 py-0.5 text-[10.5px] text-coral">
      <span className="h-1 w-1 rounded-full bg-coral" />
      {label}
    </span>
  );
}

export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[88px]">
      <div className="h-1 flex-1 rounded-full bg-[var(--surface-2)] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${score}%`,
            background:
              score >= 80
                ? "linear-gradient(90deg, var(--purple), var(--coral))"
                : score >= 65
                ? "var(--purple)"
                : "var(--muted-foreground)",
          }}
        />
      </div>
      <span className="text-[11px] tabular-nums text-muted-foreground w-6 text-right">{score}</span>
    </div>
  );
}
