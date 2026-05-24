import * as React from "react";
import type { Lead } from "@/lib/mock/data";
import { formatMoney } from "@/lib/mock/data";
import { summarizeAreas, sortAreas, type AreaSort, type AreaSummary } from "@/lib/mock/areas";
import { RiskPill, SourceBadge } from "@/components/avara/Bits";
import { cn } from "@/lib/utils";
import { MapPin, ArrowUpRight, Sparkles, ChevronRight } from "lucide-react";

export function AreasView({
  leads,
  onSelectLead,
}: {
  leads: Lead[];
  onSelectLead: (id: string) => void;
}) {
  const [sort, setSort] = React.useState<AreaSort>("value");
  const areas = React.useMemo(() => sortAreas(summarizeAreas(leads), sort), [leads, sort]);
  const [selectedKey, setSelectedKey] = React.useState<string | null>(areas[0]?.key ?? null);

  React.useEffect(() => {
    if (areas.length && !areas.find((a) => a.key === selectedKey)) {
      setSelectedKey(areas[0].key);
    }
  }, [areas, selectedKey]);

  const selected = areas.find((a) => a.key === selectedKey) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_360px] gap-4">
      {/* Left: ranked list */}
      <aside className="rounded-xl border hairline bg-[var(--surface-1)] overflow-hidden">
        <div className="px-3 py-2.5 border-b hairline flex items-center gap-2">
          <span className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">Sort</span>
          <div className="ml-auto inline-flex rounded-md border hairline bg-[var(--surface-2)]/50 p-0.5">
            <SortBtn active={sort === "value"} onClick={() => setSort("value")}>Value</SortBtn>
            <SortBtn active={sort === "needsReply"} onClick={() => setSort("needsReply")}>Reply</SortBtn>
            <SortBtn active={sort === "fresh"} onClick={() => setSort("fresh")}>Fresh</SortBtn>
          </div>
        </div>
        <ul className="divide-y hairline max-h-[calc(100vh-18rem)] overflow-y-auto">
          {areas.map((a) => {
            const sel = a.key === selectedKey;
            return (
              <li key={a.key}>
                <button
                  onClick={() => setSelectedKey(a.key)}
                  className={cn(
                    "w-full text-left px-3 py-3 transition flex items-start gap-2",
                    sel ? "bg-[var(--accent)]/40" : "hover:bg-[var(--surface-2)]/40",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-medium truncate">{a.city}</span>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{a.region}</span>
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-muted-foreground tabular-nums">
                      {a.count} inquiries · €{Math.round(a.totalValueEUR / 1000)}k
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px]">
                      {a.needsReply > 0 && <span className="text-coral">{a.needsReply} need reply</span>}
                      {a.fresh > 0 && <span className="text-[var(--success)]">{a.fresh} fresh</span>}
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mt-1" />
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Center: area board */}
      <section className="rounded-xl border hairline bg-[var(--surface-1)] p-4">
        <div className="flex items-baseline gap-3 mb-3 px-1">
          <h2 className="text-[13px] font-semibold tracking-tight">All areas</h2>
          <span className="text-[11.5px] text-muted-foreground">
            Where your inquiries are coming from this week
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {areas.map((a) => (
            <AreaCard
              key={a.key}
              area={a}
              selected={a.key === selectedKey}
              onSelect={() => setSelectedKey(a.key)}
            />
          ))}
        </div>
      </section>

      {/* Right: detail */}
      <aside className="rounded-xl border hairline bg-[var(--surface-1)] overflow-hidden">
        {selected ? (
          <AreaDetail area={selected} onSelectLead={onSelectLead} />
        ) : (
          <div className="h-full grid place-items-center text-[13px] text-muted-foreground">
            Select an area
          </div>
        )}
      </aside>
    </div>
  );
}

function SortBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-6 px-2 rounded text-[11px] transition",
        active ? "bg-[var(--surface-1)] text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function AreaCard({
  area, selected, onSelect,
}: { area: AreaSummary; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "text-left rounded-xl border bg-[var(--surface-1)] p-3.5 transition",
        "hover:border-[var(--foreground)]/15 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]",
        selected
          ? "border-[var(--foreground)]/25 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]"
          : "border-[var(--hairline)]",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[13.5px] font-medium tracking-tight">{area.city}</span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{area.region}</span>
            {!area.preferred && (
              <span className="text-[10px] uppercase tracking-[0.12em] border border-coral/30 bg-coral-soft text-coral rounded px-1.5 py-0.5">
                Outside service area
              </span>
            )}
          </div>
          <div className="mt-1.5 text-[11.5px] text-muted-foreground tabular-nums">
            {area.count} inquiries · €{Math.round(area.totalValueEUR / 1000)}k value
            {area.needsReply > 0 && <> · <span className="text-coral">{area.needsReply} need reply</span></>}
            {area.missingBudget > 0 && <> · {area.missingBudget} missing budget</>}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {area.leads.slice(0, 6).map((l) => (
          <span
            key={l.id}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              l.risk === "hot" && "bg-[var(--success)]",
              l.risk === "cooling" && "bg-[var(--warning)]",
              l.risk === "cold" && "bg-coral",
              l.risk === "recovered" && "bg-purple",
            )}
            title={l.name}
          />
        ))}
      </div>

      <div className="mt-3 pt-3 border-t hairline flex items-start gap-2">
        <Sparkles className="h-3 w-3 text-purple mt-0.5 shrink-0" />
        <p className="text-[12px] text-foreground/85 leading-relaxed">{area.avaraNote}</p>
      </div>
    </button>
  );
}

function AreaDetail({
  area, onSelectLead,
}: { area: AreaSummary; onSelectLead: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-5 pt-5 pb-3 border-b hairline">
        <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">Selected area</div>
        <h2 className="text-[15px] font-semibold tracking-tight mt-0.5">{area.city}</h2>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Stat label="Inquiries" value={String(area.count)} />
          <Stat label="Value" value={`€${Math.round(area.totalValueEUR / 1000)}k`} />
          <Stat label="Need reply" value={String(area.needsReply)} tone={area.needsReply > 0 ? "warn" : undefined} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="rounded-lg border hairline bg-[var(--surface-2)]/40 p-3 mb-4">
          <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground mb-1">
            <Sparkles className="h-3 w-3 text-purple" /> This week
          </div>
          <p className="text-[12.5px] text-foreground/85 leading-relaxed">{area.avaraNote}</p>
        </div>

        <h3 className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground mb-2">Inquiries</h3>
        <ul className="space-y-2">
          {area.leads.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => onSelectLead(l.id)}
                className="w-full text-left rounded-lg border hairline bg-[var(--surface-1)] p-3 hover:border-[var(--foreground)]/15 transition group"
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12.5px] font-medium truncate">{l.name}</span>
                      <RiskPill risk={l.risk} />
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-muted-foreground truncate">{l.project}</div>
                    <div className="mt-1.5"><SourceBadge source={l.source} /></div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[12.5px] font-medium tabular-nums">{formatMoney(l.value, l.currency)}</div>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground inline-block opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "warn" }) {
  return (
    <div className="rounded-lg border hairline bg-[var(--surface-1)] px-2.5 py-2">
      <div className={cn("text-[14px] font-medium tabular-nums", tone === "warn" && "text-coral")}>{value}</div>
      <div className="text-[10.5px] text-muted-foreground uppercase tracking-[0.12em] mt-0.5">{label}</div>
    </div>
  );
}
