import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/avara/Shell";
import { leads as ALL_LEADS, formatMoney } from "@/lib/mock/data";
import { regionFor } from "@/lib/mock/geo";
import { FilterStrip, defaultFilters, type InboxFilters } from "@/components/avara/inbox/FilterStrip";
import { MapPanel } from "@/components/avara/inbox/MapPanel";
import { Queue } from "@/components/avara/inbox/Queue";

function InboxPage() {
  const [filters, setFilters] = React.useState<InboxFilters>(defaultFilters);
  const [selectedId, setSelectedId] = React.useState<string | null>("l-001");

  const filtered = React.useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return ALL_LEADS.filter((l) => {
      if (filters.classification !== "All" && l.classification !== filters.classification) return false;
      if (filters.risk !== "All" && l.risk !== filters.risk) return false;
      if (filters.missingOnly && l.missing.length === 0) return false;
      if (filters.region !== "All" && regionFor(l.location) !== filters.region) return false;
      if (q && !(`${l.name} ${l.project} ${l.location}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [filters]);

  const counts = React.useMemo(() => {
    const cooling = filtered.filter((l) => l.risk === "cooling" || l.risk === "cold").length;
    // crude EUR-equiv at risk
    const eur = (v: number, c: string) => (c === "GBP" ? v * 1.17 : c === "AED" ? v * 0.25 : v);
    const atRisk = filtered
      .filter((l) => l.risk === "cooling" || l.risk === "cold")
      .reduce((s, l) => s + eur(l.value, l.currency), 0);
    return { total: filtered.length, cooling, atRiskValue: formatMoney(Math.round(atRisk), "EUR") };
  }, [filtered]);

  return (
    <Shell title="Lead inbox" subtitle="Spatial triage">
      <FilterStrip filters={filters} onChange={setFilters} counts={counts} />
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-4 p-4 lg:p-6 h-[calc(100vh-7.25rem)]">
        <div className="min-h-[420px] h-full">
          <MapPanel
            leads={filtered}
            allLeads={ALL_LEADS}
            selectedId={selectedId}
            onSelect={setSelectedId}
            region={filters.region}
          />
        </div>
        <div className="min-h-[420px] h-full rounded-2xl border hairline bg-[var(--surface-1)]/80 overflow-hidden">
          <Queue leads={filtered} selectedId={selectedId} onSelect={(id) => setSelectedId(id === selectedId ? null : id)} />
        </div>
      </div>
    </Shell>
  );
}

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [
    { title: "Lead inbox · Avara" },
    { name: "description", content: "Spatial triage of every inquiry across your active markets." },
  ] }),
  component: InboxPage,
});
