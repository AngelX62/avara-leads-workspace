import * as React from "react";
import { Link } from "@tanstack/react-router";
import type { Lead } from "@/lib/mock/data";
import { formatMoney } from "@/lib/mock/data";
import { cityFor } from "@/lib/mock/geo";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { MissingChip, SourceBadge } from "@/components/avara/Bits";

const RISK_COLOR: Record<Lead["risk"], string> = {
  hot: "var(--success)",
  cooling: "var(--warning)",
  cold: "var(--coral)",
  recovered: "var(--purple)",
};

function Group({
  label, leads, selectedId, onSelect,
}: { label: string; leads: Lead[]; selectedId: string | null; onSelect: (id: string) => void }) {
  const sum = leads.reduce((s, l) => s + l.value, 0);
  const currency = leads[0]?.currency ?? "EUR";
  const cooling = leads.filter((l) => l.risk === "cooling" || l.risk === "cold").length;
  return (
    <div className="border-b hairline last:border-b-0">
      <div className="sticky top-0 z-10 flex items-baseline gap-3 px-5 py-2.5 bg-[var(--surface-1)]/85 backdrop-blur-md border-b hairline">
        <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold">{label}</span>
        <span className="text-[11px] text-muted-foreground tabular-nums">{leads.length}</span>
        <span className="h-3 w-px bg-[var(--hairline)]" />
        <span className="text-[11px] text-muted-foreground tabular-nums">{formatMoney(sum, currency)} pipeline</span>
        {cooling > 0 && (
          <span className="ml-auto text-[11px] text-[var(--warning)] tabular-nums">{cooling} at risk</span>
        )}
      </div>
      <ul>
        {leads.map((l) => {
          const sel = l.id === selectedId;
          return (
            <li key={l.id}>
              <button
                onClick={() => onSelect(l.id)}
                className={cn(
                  "group w-full text-left flex items-center gap-3 pl-5 pr-4 py-3 transition relative",
                  "hover:bg-[var(--surface-2)]/40",
                  sel && "bg-[var(--surface-2)]/60",
                )}
              >
                <span
                  className="absolute left-0 top-0 bottom-0 w-[2px] transition-all"
                  style={{
                    background: RISK_COLOR[l.risk],
                    opacity: sel ? 1 : 0,
                    transform: sel ? "scaleY(1)" : "scaleY(0.4)",
                  }}
                />
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ background: RISK_COLOR[l.risk] }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13.5px] font-medium truncate">{l.name}</span>
                    <span className="text-[11.5px] text-muted-foreground truncate">· {l.project}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <SourceBadge source={l.source} />
                    {l.missing.slice(0, 2).map((m) => <MissingChip key={m} label={m} />)}
                    {l.missing.length > 2 && (
                      <span className="text-[10.5px] text-muted-foreground">+{l.missing.length - 2}</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[12.5px] tabular-nums font-medium">{formatMoney(l.value, l.currency)}</div>
                  <div className="text-[10.5px] text-muted-foreground">{l.lastTouch}</div>
                </div>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", sel && "rotate-180")} />
              </button>
              {sel && (
                <div className="px-5 pb-4 pt-1 border-b hairline bg-[var(--surface-2)]/30 animate-fade-in">
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed max-w-prose">
                    “{l.inquiry}”
                  </p>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {l.missing.length === 0 ? (
                      <span className="text-[11px] text-[var(--success)]">All fields captured</span>
                    ) : (
                      l.missing.map((m) => (
                        <button
                          key={m}
                          className="rounded-md border border-coral/30 bg-coral-soft px-2 py-1 text-[11px] text-coral hover:bg-coral/20"
                        >
                          Ask for {m.toLowerCase()}
                        </button>
                      ))
                    )}
                    <Link
                      to="/leads/$leadId"
                      params={{ leadId: l.id }}
                      className="ml-auto inline-flex items-center gap-1 rounded-md border hairline bg-[var(--surface-1)] px-2.5 py-1 text-[11.5px] hover:bg-[var(--surface-2)]"
                    >
                      Open lead <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Queue({
  leads, selectedId, onSelect,
}: { leads: Lead[]; selectedId: string | null; onSelect: (id: string) => void }) {
  const grouped = React.useMemo(() => {
    const map = new Map<string, Lead[]>();
    for (const l of leads) {
      const k = cityFor(l.location).label;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(l);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [leads]);

  if (leads.length === 0) {
    return (
      <div className="h-full grid place-items-center text-center px-6">
        <div>
          <div className="text-[13px] text-muted-foreground">No leads match these filters.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {grouped.map(([city, ls]) => (
        <Group key={city} label={city} leads={ls} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}
