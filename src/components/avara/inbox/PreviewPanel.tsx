import { Link } from "@tanstack/react-router";
import type { Lead } from "@/lib/mock/data";
import { formatMoney } from "@/lib/mock/data";
import { RiskPill, SourceBadge, MissingChip } from "@/components/avara/Bits";
import { projectBriefFor, recommendedActionFor, whyItMattersFor } from "@/lib/mock/inboxGroups";
import { ArrowUpRight, X, MapPin, Calendar, Wallet, Layers, Sparkles } from "lucide-react";

export function PreviewPanel({ lead, onClose }: { lead: Lead | null; onClose?: () => void }) {
  if (!lead) {
    return (
      <div className="h-full grid place-items-center text-center px-8">
        <div className="max-w-[260px]">
          <div className="mx-auto h-10 w-10 rounded-full border hairline grid place-items-center text-muted-foreground mb-3">
            <Layers className="h-4 w-4" />
          </div>
          <div className="text-[13.5px] font-medium">Select a request</div>
          <p className="mt-1.5 text-[12.5px] text-muted-foreground leading-relaxed">
            Pick an inquiry from the list to see the project brief, what's missing, and the recommended next step.
          </p>
        </div>
      </div>
    );
  }

  const brief = projectBriefFor(lead);

  const Row = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
        <div className="text-[13px] mt-0.5">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b hairline">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] font-semibold tracking-tight truncate">{lead.name}</span>
            <RiskPill risk={lead.risk} />
          </div>
          <div className="mt-1 text-[13px] text-foreground/80">{lead.project}</div>
          <div className="mt-1 text-[11.5px] text-muted-foreground">
            {lead.classification} · via <SourceBadge source={lead.source} />
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-md border hairline text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <section>
          <h3 className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground mb-2">Project brief</h3>
          <div className="rounded-lg border hairline bg-[var(--surface-1)] px-3.5 divide-y hairline">
            <Row icon={Layers} label="Scope" value={brief.scope} />
            <Row icon={MapPin} label="Location" value={brief.location} />
            <Row icon={Calendar} label="Timing" value={brief.timing} />
            <Row icon={Wallet} label="Estimated value" value={`${formatMoney(lead.value, lead.currency)} · ${brief.budget}`} />
          </div>
        </section>

        <section className="mt-5">
          <h3 className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground mb-2">Their inquiry</h3>
          <p className="text-[13px] leading-relaxed text-foreground/90">“{lead.inquiry}”</p>
        </section>

        {lead.missing.length > 0 && (
          <section className="mt-5">
            <h3 className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground mb-2">Still missing</h3>
            <div className="flex flex-wrap gap-1.5">
              {lead.missing.map((m) => <MissingChip key={m} label={m} />)}
            </div>
          </section>
        )}

        <section className="mt-5 rounded-lg border hairline bg-[var(--surface-2)]/40 p-3.5">
          <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground mb-1.5">
            <Sparkles className="h-3 w-3" /> Why it matters
          </div>
          <p className="text-[12.5px] leading-relaxed text-foreground/85">{whyItMattersFor(lead)}</p>
        </section>
      </div>

      <div className="border-t hairline px-5 py-3 flex items-center gap-2 bg-[var(--surface-1)]/60">
        <button className="flex-1 h-9 rounded-md bg-foreground text-background text-[12.5px] font-medium hover:opacity-90 transition">
          {recommendedActionFor(lead)}
        </button>
        <Link
          to="/leads/$leadId"
          params={{ leadId: lead.id }}
          className="h-9 px-3 rounded-md border hairline bg-[var(--surface-1)] text-[12.5px] inline-flex items-center gap-1 hover:bg-[var(--surface-2)]"
        >
          Open full lead <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
