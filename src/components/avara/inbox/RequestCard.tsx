import type { Lead } from "@/lib/mock/data";
import { formatMoney } from "@/lib/mock/data";
import { SourceBadge, MissingChip, RiskPill } from "@/components/avara/Bits";
import { recommendedActionFor } from "@/lib/mock/inboxGroups";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin, Clock } from "lucide-react";

export function RequestCard({
  lead, selected, onSelect,
}: { lead: Lead; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "group w-full text-left rounded-xl border bg-[var(--surface-1)] p-4 transition",
        "hover:border-[var(--foreground)]/15 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]",
        selected
          ? "border-[var(--foreground)]/25 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]"
          : "border-[var(--hairline)]",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-medium tracking-tight truncate">{lead.name}</span>
            <RiskPill risk={lead.risk} />
          </div>
          <div className="mt-0.5 text-[13px] text-foreground/80 truncate">{lead.project}</div>
          <div className="mt-1.5 flex items-center gap-3 text-[11.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{lead.location}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{lead.lastTouch}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[13.5px] tabular-nums font-medium">{formatMoney(lead.value, lead.currency)}</div>
          <div className="text-[10.5px] text-muted-foreground uppercase tracking-wider mt-0.5">{lead.classification}</div>
        </div>
      </div>

      <p className="mt-3 text-[12.5px] text-muted-foreground leading-relaxed line-clamp-2">
        “{lead.inquiry}”
      </p>

      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <SourceBadge source={lead.source} />
        {lead.missing.slice(0, 3).map((m) => <MissingChip key={m} label={m} />)}
      </div>

      <div className="mt-3 pt-3 border-t hairline flex items-center justify-between gap-3">
        <span className="text-[12px] text-foreground/80 truncate">
          <span className="text-muted-foreground">Next: </span>{recommendedActionFor(lead)}
        </span>
        <span className="text-[11.5px] text-muted-foreground inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          Open <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </button>
  );
}
