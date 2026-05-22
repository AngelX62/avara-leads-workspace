import * as React from "react";
import type { Lead } from "@/lib/mock/data";
import { cityFor } from "@/lib/mock/geo";
import { cn } from "@/lib/utils";

// Stylized Europe + ME hairline silhouette. Hand-tuned, not geographic.
const CONTINENT_PATH =
  // Iberia + Western Europe + Scandinavia + Italy + Balkans + Eastern Europe blob
  "M 250 240 C 260 200 300 170 350 160 C 400 152 430 150 470 158 C 500 130 540 110 580 110 C 610 112 630 130 632 160 C 660 170 690 180 700 210 C 740 215 770 240 768 270 C 800 285 815 310 800 340 C 780 360 740 365 700 358 C 690 380 650 388 610 380 C 600 410 560 420 520 412 C 500 440 460 448 420 438 C 400 460 360 462 330 446 C 300 460 270 452 258 420 C 230 410 215 380 222 350 C 205 330 205 300 222 280 C 230 260 240 250 250 240 Z";
const UK_PATH =
  "M 370 175 C 360 165 358 200 372 215 C 386 228 410 224 408 205 C 406 188 388 178 370 175 Z";
const ARABIA_PATH =
  "M 720 360 C 750 350 790 358 820 380 C 845 400 850 440 830 470 C 805 495 760 498 730 478 C 705 458 700 405 720 360 Z";

const RISK_COLOR: Record<Lead["risk"], string> = {
  hot: "var(--success)",
  cooling: "var(--warning)",
  cold: "var(--coral)",
  recovered: "var(--purple)",
};

type Cluster = {
  key: string;
  x: number;
  y: number;
  label: string;
  leads: Lead[];
};

function cluster(leads: Lead[]): Cluster[] {
  const map = new Map<string, Cluster>();
  for (const l of leads) {
    const c = cityFor(l.location);
    const k = l.location;
    if (!map.has(k)) map.set(k, { key: k, x: c.x, y: c.y, label: c.label, leads: [] });
    map.get(k)!.leads.push(l);
  }
  return Array.from(map.values());
}

function dominantRisk(leads: Lead[]): Lead["risk"] {
  const order: Lead["risk"][] = ["cold", "cooling", "hot", "recovered"];
  for (const r of order) if (leads.some((l) => l.risk === r)) return r;
  return "hot";
}

function valueSum(leads: Lead[]) {
  return leads.reduce((s, l) => s + l.value, 0);
}

export function MapPanel({
  leads,
  allLeads,
  selectedId,
  onSelect,
  region,
}: {
  leads: Lead[]; // filtered (visible)
  allLeads: Lead[]; // unfiltered (for ghost pins)
  selectedId?: string | null;
  onSelect: (id: string) => void;
  region: "All" | "EU" | "UK" | "ME";
}) {
  const [hover, setHover] = React.useState<string | null>(null);
  const visible = cluster(leads);
  const ghosts = cluster(allLeads).filter((c) => !visible.find((v) => v.key === c.key));

  const viewBox =
    region === "UK"
      ? "300 140 200 130"
      : region === "ME"
      ? "680 340 200 180"
      : region === "EU"
      ? "240 130 470 270"
      : "200 80 700 460";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border hairline bg-[var(--surface-1)]">
      {/* atmosphere */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-purple/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-coral/10 blur-3xl" />

      {/* grid */}
      <svg
        viewBox="0 0 1000 600"
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="1000" height="600" fill="url(#grid)" />
      </svg>

      {/* Map */}
      <svg
        viewBox={viewBox}
        className="absolute inset-0 h-full w-full transition-[viewBox] duration-700"
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          <path d={CONTINENT_PATH} fill="color-mix(in oklab, var(--foreground) 4%, transparent)" stroke="var(--hairline)" strokeWidth="0.8" />
          <path d={UK_PATH} fill="color-mix(in oklab, var(--foreground) 4%, transparent)" stroke="var(--hairline)" strokeWidth="0.8" />
          <path d={ARABIA_PATH} fill="color-mix(in oklab, var(--foreground) 4%, transparent)" stroke="var(--hairline)" strokeWidth="0.8" />
        </g>

        {/* ghost pins for filtered-out leads */}
        {ghosts.map((c) => (
          <circle key={"g-" + c.key} cx={c.x} cy={c.y} r={3.5} fill="currentColor" className="text-muted-foreground" opacity={0.18} />
        ))}

        {/* clusters */}
        {visible.map((c) => {
          const v = valueSum(c.leads);
          const r = Math.max(8, Math.min(22, 6 + Math.log10(v) * 3.2));
          const risk = dominantRisk(c.leads);
          const color = RISK_COLOR[risk];
          const isSel = c.leads.some((l) => l.id === selectedId);
          const isHover = hover === c.key;
          return (
            <g key={c.key}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHover(c.key)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect(c.leads[0].id)}
            >
              {/* pulse */}
              {risk !== "recovered" && (
                <circle cx={c.x} cy={c.y} r={r + 6} fill={color} opacity={0.12}>
                  <animate attributeName="r" values={`${r + 4};${r + 12};${r + 4}`} dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.18;0;0.18" dur="3s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={c.x} cy={c.y} r={r} fill={color} opacity={0.22} />
              <circle cx={c.x} cy={c.y} r={r * 0.55} fill={color} />
              {c.leads.length > 1 && (
                <text x={c.x} y={c.y + 3.2} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--background)">
                  {c.leads.length}
                </text>
              )}
              {(isHover || isSel) && (
                <g pointerEvents="none">
                  <rect
                    x={c.x + r + 6}
                    y={c.y - 16}
                    rx={5}
                    ry={5}
                    width={Math.max(80, c.label.length * 6.5 + 40)}
                    height={28}
                    fill="var(--surface-1)"
                    stroke="var(--hairline)"
                  />
                  <text x={c.x + r + 14} y={c.y - 5} fontSize="9.5" fontWeight="600" fill="var(--foreground)">
                    {c.label.toUpperCase()}
                  </text>
                  <text x={c.x + r + 14} y={c.y + 6} fontSize="8.5" fill="var(--muted-foreground)">
                    {c.leads.length} lead{c.leads.length > 1 ? "s" : ""}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* legend */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-lg border hairline bg-[var(--surface-1)]/80 backdrop-blur-md px-3 py-2 text-[10.5px] text-muted-foreground">
        <span className="uppercase tracking-[0.16em]">Risk</span>
        {(["hot", "cooling", "cold", "recovered"] as const).map((r) => (
          <span key={r} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: RISK_COLOR[r] }} />
            <span className="capitalize">{r}</span>
          </span>
        ))}
        <span className="ml-auto">Pin size = deal value</span>
      </div>
    </div>
  );
}
