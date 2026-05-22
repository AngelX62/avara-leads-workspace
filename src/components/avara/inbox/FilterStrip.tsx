import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Classification, Risk } from "@/lib/mock/data";

export type InboxFilters = {
  q: string;
  classification: Classification | "All";
  risk: Risk | "All";
  missingOnly: boolean;
  region: "All" | "EU" | "UK" | "ME";
};

export const defaultFilters: InboxFilters = {
  q: "",
  classification: "All",
  risk: "All",
  missingOnly: false,
  region: "All",
};

function Seg<T extends string>({
  value, options, onChange,
}: { value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-lg border hairline bg-[var(--surface-2)]/40 p-0.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "px-2.5 h-7 text-[12px] rounded-md transition",
            value === o
              ? "bg-[var(--surface-1)] text-foreground shadow-[0_1px_0_0_color-mix(in_oklab,var(--foreground)_8%,transparent)_inset]"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function FilterStrip({
  filters, onChange, counts,
}: {
  filters: InboxFilters;
  onChange: (f: InboxFilters) => void;
  counts: { total: number; cooling: number; atRiskValue: string };
}) {
  const set = <K extends keyof InboxFilters>(k: K, v: InboxFilters[K]) =>
    onChange({ ...filters, [k]: v });

  return (
    <div className="sticky top-14 z-20 border-b hairline bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-2 px-6 py-3">
        <div className="flex items-center gap-2 rounded-lg border hairline bg-[var(--surface-2)]/50 px-3 h-9 w-[280px]">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={filters.q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search name, project, city…"
            className="bg-transparent text-[13px] outline-none flex-1 placeholder:text-muted-foreground"
          />
          {filters.q && (
            <button onClick={() => set("q", "")} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Seg
          value={filters.classification}
          options={["All", "Interior", "Architecture", "Real Estate"] as const}
          onChange={(v) => set("classification", v as InboxFilters["classification"])}
        />
        <Seg
          value={filters.risk}
          options={["All", "hot", "cooling", "cold", "recovered"] as const}
          onChange={(v) => set("risk", v as InboxFilters["risk"])}
        />
        <Seg
          value={filters.region}
          options={["All", "EU", "UK", "ME"] as const}
          onChange={(v) => set("region", v as InboxFilters["region"])}
        />

        <button
          onClick={() => set("missingOnly", !filters.missingOnly)}
          className={cn(
            "h-9 px-3 rounded-lg border hairline text-[12px] transition",
            filters.missingOnly
              ? "bg-coral-soft text-coral border-coral/40"
              : "bg-[var(--surface-2)]/40 text-muted-foreground hover:text-foreground",
          )}
        >
          Missing info only
        </button>

        <div className="ml-auto flex items-center gap-4 text-[11.5px] text-muted-foreground">
          <span><span className="text-foreground tabular-nums">{counts.total}</span> in queue</span>
          <span className="h-3 w-px bg-[var(--hairline)]" />
          <span><span className="text-[var(--warning)] tabular-nums">{counts.cooling}</span> cooling</span>
          <span className="h-3 w-px bg-[var(--hairline)]" />
          <span><span className="text-coral tabular-nums">{counts.atRiskValue}</span> at risk</span>
        </div>
      </div>
    </div>
  );
}
