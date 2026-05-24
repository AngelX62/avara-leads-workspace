import type { Lead } from "./data";

export type AreaSummary = {
  key: string; // e.g. "London, UK"
  city: string;
  region: string; // "UK" | "PT" | "IT" | "AE"
  preferred: boolean;
  leads: Lead[];
  count: number;
  totalValueEUR: number;
  needsReply: number;
  missingBudget: number;
  fresh: number;
  avaraNote: string;
};

const PREFERRED = new Set([
  "Lisbon, PT",
  "Porto, PT",
  "Algarve, PT",
  "Comporta, PT",
  "London, UK",
  "Cotswolds, UK",
  "Milan, IT",
]);

function toEUR(value: number, currency: Lead["currency"]) {
  return currency === "GBP" ? value * 1.17 : currency === "AED" ? value * 0.25 : value;
}

function regionOf(location: string): string {
  const tail = location.split(",").pop()?.trim() ?? "";
  return tail || "—";
}

function noteFor(s: Omit<AreaSummary, "avaraNote">): string {
  const hotNames = s.leads
    .filter((l) => l.risk === "hot" || l.risk === "cooling")
    .slice(0, 2)
    .map((l) => l.project.split("—").pop()?.trim() || l.name);
  if (s.needsReply >= 2 && hotNames.length >= 2) {
    return `${hotNames[0]} and ${hotNames[1]} are high-value but both need a reply today.`;
  }
  if (s.needsReply >= 1 && hotNames[0]) {
    return `${hotNames[0]} is cooling — a personal note today protects this pipeline.`;
  }
  if (s.missingBudget >= 1) {
    return `One short message unlocks accurate proposals here.`;
  }
  if (s.fresh >= 1) {
    return `Fresh momentum in ${s.city} — worth a thoughtful first reply.`;
  }
  return `Calm in ${s.city} this week. Park it for tomorrow.`;
}

export function summarizeAreas(leads: Lead[]): AreaSummary[] {
  const groups = new Map<string, Lead[]>();
  for (const l of leads) {
    if (!groups.has(l.location)) groups.set(l.location, []);
    groups.get(l.location)!.push(l);
  }
  const out: AreaSummary[] = [];
  for (const [key, list] of groups) {
    const city = key.split(",")[0].trim();
    const region = regionOf(key);
    const totalValueEUR = list.reduce((acc, l) => acc + toEUR(l.value, l.currency), 0);
    const needsReply = list.filter((l) => l.risk === "cooling" || l.risk === "cold").length;
    const missingBudget = list.filter((l) => l.missing.includes("Budget range")).length;
    const fresh = list.filter((l) => l.risk === "hot").length;
    const partial = {
      key, city, region,
      preferred: PREFERRED.has(key),
      leads: list,
      count: list.length,
      totalValueEUR,
      needsReply,
      missingBudget,
      fresh,
    };
    out.push({ ...partial, avaraNote: noteFor(partial) });
  }
  out.sort((a, b) => b.totalValueEUR - a.totalValueEUR);
  return out;
}

export type AreaSort = "value" | "needsReply" | "fresh";
export function sortAreas(areas: AreaSummary[], sort: AreaSort): AreaSummary[] {
  const copy = [...areas];
  if (sort === "value") copy.sort((a, b) => b.totalValueEUR - a.totalValueEUR);
  if (sort === "needsReply") copy.sort((a, b) => b.needsReply - a.needsReply || b.totalValueEUR - a.totalValueEUR);
  if (sort === "fresh") copy.sort((a, b) => b.fresh - a.fresh || b.totalValueEUR - a.totalValueEUR);
  return copy;
}
