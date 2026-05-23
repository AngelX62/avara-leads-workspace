import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type PillKey = "all" | "needs-reply" | "high-potential" | "missing-info" | "fresh";

const PILLS: { key: PillKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "needs-reply", label: "Needs reply" },
  { key: "high-potential", label: "High potential" },
  { key: "missing-info", label: "Missing info" },
  { key: "fresh", label: "Fresh this week" },
];

export function FilterPills({
  active, onChange, query, onQuery, counts,
}: {
  active: PillKey;
  onChange: (k: PillKey) => void;
  query: string;
  onQuery: (q: string) => void;
  counts: Partial<Record<PillKey, number>>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b hairline bg-[var(--background)]/40">
      <div className="flex flex-wrap items-center gap-1.5">
        {PILLS.map((p) => {
          const sel = active === p.key;
          const c = counts[p.key];
          return (
            <button
              key={p.key}
              onClick={() => onChange(p.key)}
              className={cn(
                "h-8 px-3 rounded-full text-[12.5px] transition inline-flex items-center gap-2 border",
                sel
                  ? "bg-foreground text-background border-transparent"
                  : "bg-[var(--surface-1)] text-muted-foreground border-[var(--hairline)] hover:text-foreground",
              )}
            >
              {p.label}
              {typeof c === "number" && (
                <span className={cn("text-[10.5px] tabular-nums", sel ? "opacity-70" : "opacity-60")}>{c}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-2 rounded-full border hairline bg-[var(--surface-1)] px-3 h-8 w-full sm:w-[260px]">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search by name, project, city…"
          className="bg-transparent text-[12.5px] outline-none flex-1 placeholder:text-muted-foreground"
        />
        {query && (
          <button onClick={() => onQuery("")} className="text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
