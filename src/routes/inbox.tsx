import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/avara/Shell";
import { leads as ALL_LEADS } from "@/lib/mock/data";
import { formatMoney } from "@/lib/mock/data";
import { SummaryStrip } from "@/components/avara/inbox/SummaryStrip";
import { FilterPills, type PillKey } from "@/components/avara/inbox/FilterPills";
import { RequestGroup } from "@/components/avara/inbox/RequestGroup";
import { PreviewPanel } from "@/components/avara/inbox/PreviewPanel";
import { ViewToggle, type InboxView } from "@/components/avara/inbox/ViewToggle";
import { MapPanel } from "@/components/avara/inbox/MapPanel";
import { GROUP_META, GROUP_ORDER, groupForLead, type GroupKey } from "@/lib/mock/inboxGroups";

const eur = (v: number, c: "EUR" | "GBP" | "AED") => (c === "GBP" ? v * 1.17 : c === "AED" ? v * 0.25 : v);

function pillMatches(key: PillKey, group: GroupKey): boolean {
  if (key === "all") return true;
  if (key === "needs-reply") return group === "needs-reply";
  if (key === "missing-info") return group === "missing-info";
  if (key === "high-potential") return group === "high-value";
  if (key === "fresh") return group === "fresh";
  return true;
}

function InboxPage() {
  const [pill, setPill] = React.useState<PillKey>("all");
  const [query, setQuery] = React.useState("");
  const [view, setView] = React.useState<InboxView>("list");
  const [selectedId, setSelectedId] = React.useState<string | null>("l-001");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_LEADS.filter((l) => {
      const g = groupForLead(l);
      if (!pillMatches(pill, g)) return false;
      if (q && !`${l.name} ${l.project} ${l.location}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [pill, query]);

  const counts = React.useMemo(() => {
    const c: Partial<Record<PillKey, number>> = { all: ALL_LEADS.length };
    let needsReply = 0, missing = 0, high = 0, fresh = 0, atRisk = 0;
    for (const l of ALL_LEADS) {
      const g = groupForLead(l);
      if (g === "needs-reply") needsReply++;
      if (g === "missing-info") missing++;
      if (g === "high-value") high++;
      if (g === "fresh") fresh++;
      if (l.risk === "cooling" || l.risk === "cold") atRisk += eur(l.value, l.currency);
    }
    c["needs-reply"] = needsReply;
    c["missing-info"] = missing;
    c["high-potential"] = high;
    c["fresh"] = fresh;
    return {
      pillCounts: c,
      summary: {
        total: ALL_LEADS.length,
        needsReply,
        missingInfo: missing,
        atRiskValue: formatMoney(Math.round(atRisk), "EUR"),
      },
    };
  }, []);

  const grouped = React.useMemo(() => {
    const map = new Map<GroupKey, typeof filtered>();
    for (const l of filtered) {
      const g = groupForLead(l);
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(l);
    }
    return map;
  }, [filtered]);

  const selectedLead = React.useMemo(
    () => ALL_LEADS.find((l) => l.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <Shell title="Project requests" subtitle="Inquiries">
      <SummaryStrip {...counts.summary} />
      <div className="flex items-center justify-between gap-3 px-6 pt-3">
        <div className="text-[12px] text-muted-foreground hidden md:block">
          Review and decide which projects deserve your time today.
        </div>
        <ViewToggle value={view} onChange={setView} />
      </div>
      <FilterPills active={pill} onChange={setPill} query={query} onQuery={setQuery} counts={counts.pillCounts} />

      {view === "list" ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] gap-6 px-6 py-6">
          <div className="min-w-0">
            {filtered.length === 0 ? (
              <div className="rounded-xl border hairline bg-[var(--surface-1)] p-10 text-center text-[13px] text-muted-foreground">
                No requests match these filters.
              </div>
            ) : (
              GROUP_ORDER.map((key) => (
                <RequestGroup
                  key={key}
                  label={GROUP_META[key].label}
                  hint={GROUP_META[key].hint}
                  leads={grouped.get(key) ?? []}
                  selectedId={selectedId}
                  onSelect={(id) => setSelectedId(id)}
                />
              ))
            )}
          </div>

          {/* Desktop sticky preview */}
          <aside className="hidden lg:block">
            <div className="sticky top-[7.5rem] h-[calc(100vh-8.5rem)] rounded-xl border hairline bg-[var(--surface-1)] overflow-hidden">
              <PreviewPanel lead={selectedLead} />
            </div>
          </aside>

          {/* Mobile drawer */}
          {selectedLead && (
            <div className="lg:hidden fixed inset-0 z-40">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedId(null)} />
              <div className="absolute inset-x-0 bottom-0 max-h-[88vh] rounded-t-2xl border-t hairline bg-[var(--background)] overflow-hidden animate-fade-in">
                <PreviewPanel lead={selectedLead} onClose={() => setSelectedId(null)} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="px-6 py-6 h-[calc(100vh-12rem)]">
          <div className="h-full rounded-xl border hairline bg-[var(--surface-1)] overflow-hidden">
            <MapPanel
              leads={filtered}
              allLeads={ALL_LEADS}
              selectedId={selectedId}
              onSelect={setSelectedId}
              region="All"
            />
          </div>
        </div>
      )}
    </Shell>
  );
}

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Project requests · Avara" },
      { name: "description", content: "Review and decide which inquiries deserve your studio's time today." },
    ],
  }),
  component: InboxPage,
});
