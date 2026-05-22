import * as React from "react";
import type { Stage } from "@/lib/mock/workmodeIntents";
import { getLead, preparedActions, formatMoney, leads } from "@/lib/mock/data";
import { cityFor } from "@/lib/mock/geo";
import { MissingChip, RiskPill, SourceBadge } from "@/components/avara/Bits";
import { MapPin, AlertTriangle, Sparkles } from "lucide-react";

function useTypewriter(text: string, active: boolean, speed = 14) {
  const [out, setOut] = React.useState("");
  React.useEffect(() => {
    if (!active) { setOut(text); return; }
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return out;
}

export function DraftingStage({ leadId, active }: { leadId?: string; active: boolean }) {
  const lead = getLead(leadId ?? "l-001")!;
  const pa = preparedActions.find((a) => a.leadId === lead.id) ?? preparedActions[0];
  const typed = useTypewriter(pa.draft, active, 12);
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 border-b hairline px-5 py-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple/70 to-coral/70 grid place-items-center text-[11px] font-semibold">
          {lead.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-medium truncate">To {lead.name}</div>
          <div className="text-[11px] text-muted-foreground truncate">{lead.project}</div>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-md border hairline bg-[var(--surface-2)] px-2 py-0.5 text-[11px] text-muted-foreground">
          <SourceBadge source={lead.source} />
        </span>
      </div>
      <div className="flex-1 px-5 py-4 overflow-auto">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Channel</div>
        <div className="text-[12.5px] mb-3">{pa.channel}</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Why now</div>
        <div className="text-[12.5px] text-muted-foreground mb-4">{pa.why}</div>
        <div className="rounded-xl border hairline bg-[var(--surface-2)]/50 p-4">
          <div className="text-[13px] leading-relaxed whitespace-pre-wrap">
            {typed}
            {active && typed.length < pa.draft.length && (
              <span className="inline-block w-[6px] h-[14px] -mb-0.5 ml-0.5 bg-coral animate-pulse" />
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {["Warm", "Direct", "Playful"].map((t, i) => (
            <button key={t}
              className={`rounded-md border hairline px-2.5 py-1 text-[11.5px] ${i === 0 ? "bg-coral-soft text-coral border-coral/40" : "bg-[var(--surface-2)]/40 text-muted-foreground"}`}>
              {t}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-muted-foreground">~ {pa.draft.split(" ").length} words</span>
        </div>
      </div>
    </div>
  );
}

export function TriagingStage({ active }: { active: boolean }) {
  const cooling = leads.filter((l) => l.risk === "cooling" || l.risk === "cold");
  const [revealed, setRevealed] = React.useState(0);
  React.useEffect(() => {
    if (!active) { setRevealed(cooling.length); return; }
    setRevealed(0);
    const id = setInterval(() => setRevealed((r) => (r >= cooling.length ? r : r + 1)), 350);
    return () => clearInterval(id);
  }, [active, cooling.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 border-b hairline px-5 py-3">
        <AlertTriangle className="h-3.5 w-3.5 text-[var(--warning)]" />
        <div className="text-[12.5px] font-medium">Cooling & cold leads</div>
        <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">{cooling.length} found</span>
      </div>
      <div className="flex-1 overflow-auto divide-y divide-[var(--hairline)]">
        {cooling.map((l, i) => {
          const shown = i < revealed;
          return (
            <div key={l.id} className={`flex items-center gap-3 px-5 py-3 transition-all duration-300 ${shown ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.risk === "cold" ? "var(--coral)" : "var(--warning)" }} />
              <div className="min-w-0">
                <div className="text-[13px] font-medium truncate">{l.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{l.project} · {cityFor(l.location).label}</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <RiskPill risk={l.risk} />
                <span className="text-[12px] tabular-nums">{formatMoney(l.value, l.currency)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function OpeningLeadStage({ leadId, active }: { leadId?: string; active: boolean }) {
  const lead = getLead(leadId ?? "l-002")!;
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b hairline">
        <div className="flex items-start gap-4">
          <div className="relative">
            <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="var(--hairline)" strokeWidth="4" />
              <circle
                cx="32" cy="32" r="26" fill="none"
                stroke="url(#g1)" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${(active ? 0 : lead.score / 100) * 163.36} 163.36`}
                style={{ transition: "stroke-dasharray 900ms ease-out" }}
              />
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--purple)" />
                  <stop offset="100%" stopColor="var(--coral)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 grid place-items-center text-[14px] font-semibold tabular-nums">{lead.score}</div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[16px] font-semibold tracking-tight">{lead.name}</div>
            <div className="text-[12px] text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> {lead.location}
            </div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <RiskPill risk={lead.risk} />
              <SourceBadge source={lead.source} />
              <span className="text-[11.5px] text-muted-foreground tabular-nums">{formatMoney(lead.value, lead.currency)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Inquiry</div>
          <p className="text-[12.5px] text-muted-foreground leading-relaxed">“{lead.inquiry}”</p>
        </div>
        {lead.missing.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">Missing</div>
            <div className="flex gap-1.5 flex-wrap">
              {lead.missing.map((m) => <MissingChip key={m} label={m} />)}
            </div>
          </div>
        )}
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Prepared next action</div>
          <div className="text-[12.5px]">{lead.nextAction}</div>
        </div>
      </div>
    </div>
  );
}

export function BriefingStage() {
  const cooling = leads.filter((l) => l.risk === "cooling" || l.risk === "cold");
  const top = cooling.slice(0, 3);
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 border-b hairline px-5 py-3">
        <Sparkles className="h-3.5 w-3.5 text-coral" />
        <div className="text-[12.5px] font-medium">Today's briefing</div>
      </div>
      <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Metric label="New today" value="3" tone="neutral" />
          <Metric label="At risk" value="€184k" tone="coral" />
          <Metric label="Priorities" value="3" tone="purple" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Recovery priorities</div>
          <div className="rounded-xl border hairline divide-y divide-[var(--hairline)]">
            {top.map((l) => (
              <div key={l.id} className="flex items-center gap-3 px-3 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.risk === "cold" ? "var(--coral)" : "var(--warning)" }} />
                <div className="min-w-0">
                  <div className="text-[12.5px] font-medium truncate">{l.name}</div>
                  <div className="text-[10.5px] text-muted-foreground truncate">{l.nextAction}</div>
                </div>
                <span className="ml-auto text-[11.5px] tabular-nums">{formatMoney(l.value, l.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "neutral" | "coral" | "purple" }) {
  return (
    <div className="rounded-xl border hairline bg-[var(--surface-2)]/40 p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div
        className="mt-1 text-[20px] font-semibold tabular-nums tracking-tight"
        style={{ color: tone === "coral" ? "var(--coral)" : tone === "purple" ? "var(--purple)" : undefined }}
      >
        {value}
      </div>
    </div>
  );
}
