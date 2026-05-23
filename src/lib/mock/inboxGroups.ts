import type { Lead } from "./data";

export type GroupKey = "needs-reply" | "missing-info" | "high-value" | "fresh" | "later";

export const GROUP_META: Record<GroupKey, { label: string; hint: string }> = {
  "needs-reply": { label: "Needs reply today", hint: "Cooling or going cold — respond before momentum fades" },
  "missing-info": { label: "Missing key details", hint: "One quick question unlocks the proposal" },
  "high-value": { label: "High potential", hint: "Largest pipeline — protect these conversations" },
  fresh: { label: "Fresh inquiries", hint: "New this week, still warm" },
  later: { label: "Lower priority", hint: "Worth a look when you have time" },
};

export function groupForLead(l: Lead): GroupKey {
  if (l.risk === "cooling" || l.risk === "cold") return "needs-reply";
  if (l.missing.length >= 2) return "missing-info";
  const eur = l.currency === "GBP" ? l.value * 1.17 : l.currency === "AED" ? l.value * 0.25 : l.value;
  if (eur >= 200_000) return "high-value";
  if (l.risk === "hot") return "fresh";
  return "later";
}

export const GROUP_ORDER: GroupKey[] = ["needs-reply", "missing-info", "high-value", "fresh", "later"];

export function recommendedActionFor(l: Lead): string {
  if (l.missing.length >= 2) return `Ask for ${l.missing[0].toLowerCase()} & ${l.missing[1].toLowerCase()}`;
  if (l.missing.length === 1) return `Ask for ${l.missing[0].toLowerCase()}`;
  if (l.risk === "cooling" || l.risk === "cold") return "Send a warm follow-up";
  if (l.risk === "hot") return l.nextAction;
  return l.nextAction;
}

export function projectBriefFor(l: Lead): { scope: string; location: string; timing: string; budget: string } {
  return {
    scope: l.project,
    location: l.location,
    timing: l.missing.includes("Timeline") ? "Not stated yet" : "Within the next quarter",
    budget: l.missing.includes("Budget range") ? "Not stated yet" : `~${currencySymbol(l.currency)}${Math.round(l.value / 1000)}k`,
  };
}

function currencySymbol(c: Lead["currency"]) {
  return c === "EUR" ? "€" : c === "GBP" ? "£" : "AED ";
}

export function whyItMattersFor(l: Lead): string {
  if (l.risk === "cold") return "This inquiry has been quiet for over a week. A single, personal note now often revives 1 in 3.";
  if (l.risk === "cooling") return "Response time is the strongest predictor of winning this brief. A reply today keeps it warm.";
  if (l.missing.length >= 2) return "You can't quote accurately without these answers. One short message clears the blockers.";
  if (l.risk === "hot") return "All signals are green — this is the moment to move the conversation forward.";
  return "Worth a glance, but not urgent. Park it on tomorrow's list if needed.";
}
