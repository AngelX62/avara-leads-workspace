import type { Lead } from "./data";

// ---------------- Custom fields (mocked) ----------------
// In a real app these come from the studio's import / manual creation.
// Here we hand-author a few examples per lead to feel realistic.

export type CustomFieldId =
  | "mortgageStatus"
  | "siteVisitNeeded"
  | "planningConstraints"
  | "decisionMaker"
  | "referralPartner";

export type CustomFieldDef = {
  id: CustomFieldId;
  label: string;
  // Suggested semantic meaning Avara proposes (owner must approve)
  suggestion: string;
  example: string;
};

export const CUSTOM_FIELD_DEFS: CustomFieldDef[] = [
  {
    id: "mortgageStatus",
    label: "Mortgage status",
    suggestion: "Financing readiness",
    example: "Pre-approved / Pending / Cash",
  },
  {
    id: "siteVisitNeeded",
    label: "Site visit needed",
    suggestion: "Consultation readiness",
    example: "Yes / No",
  },
  {
    id: "planningConstraints",
    label: "Planning constraints",
    suggestion: "Feasibility blocker",
    example: "Conservation area, AONB…",
  },
  {
    id: "decisionMaker",
    label: "Decision maker",
    suggestion: "Proposal readiness",
    example: "Identified owner / Unknown",
  },
  {
    id: "referralPartner",
    label: "Referral partner",
    suggestion: "Relationship source",
    example: "Architect, broker, alumna…",
  },
];

const CUSTOM_VALUES: Record<string, Partial<Record<CustomFieldId, string>>> = {
  "l-001": { siteVisitNeeded: "Yes", decisionMaker: "Identified" },
  "l-002": { planningConstraints: "Permit in motion", decisionMaker: "Identified", referralPartner: "Ana Mendes" },
  "l-003": { mortgageStatus: "Pending" },
  "l-004": { decisionMaker: "Unknown", siteVisitNeeded: "Yes" },
  "l-005": { siteVisitNeeded: "Yes", decisionMaker: "Identified" },
  "l-006": { planningConstraints: "AONB" },
  "l-007": { mortgageStatus: "Cash", decisionMaker: "Identified" },
  "l-008": { siteVisitNeeded: "Yes" },
  "l-009": { referralPartner: "Sofia A.", decisionMaker: "Identified" },
  "l-010": { siteVisitNeeded: "Yes", planningConstraints: "Coastal setback" },
  "l-011": { decisionMaker: "Unknown" },
  "l-012": { mortgageStatus: "Cash" },
};

export function getCustomValue(leadId: string, field: CustomFieldId): string | null {
  return CUSTOM_VALUES[leadId]?.[field] ?? null;
}

// ---------------- Columns ----------------

export type ColumnId =
  | "client"
  | "project"
  | "type"
  | "location"
  | "source"
  | "status"
  | "value"
  | "timeline"
  | "missing"
  | "lastContact"
  | "nextAction"
  | "followUpDue"
  | CustomFieldId;

export type ColumnDef = {
  id: ColumnId;
  label: string;
  group: "core" | "custom";
  width?: string;
  align?: "left" | "right";
  defaultVisible?: boolean;
};

export const COLUMNS: ColumnDef[] = [
  { id: "client", label: "Client", group: "core", width: "200px", defaultVisible: true },
  { id: "project", label: "Inquiry / project", group: "core", width: "260px", defaultVisible: true },
  { id: "type", label: "Type", group: "core", width: "120px", defaultVisible: true },
  { id: "location", label: "Location", group: "core", width: "150px", defaultVisible: true },
  { id: "source", label: "Source", group: "core", width: "120px", defaultVisible: true },
  { id: "status", label: "Status", group: "core", width: "120px", defaultVisible: true },
  { id: "value", label: "Value", group: "core", width: "110px", align: "right", defaultVisible: true },
  { id: "timeline", label: "Timeline", group: "core", width: "130px", defaultVisible: true },
  { id: "missing", label: "Missing info", group: "core", width: "200px", defaultVisible: true },
  { id: "lastContact", label: "Last contact", group: "core", width: "120px", defaultVisible: true },
  { id: "nextAction", label: "Next action", group: "core", width: "220px", defaultVisible: true },
  { id: "followUpDue", label: "Follow-up due", group: "core", width: "130px", defaultVisible: true },
  ...CUSTOM_FIELD_DEFS.map<ColumnDef>((f) => ({
    id: f.id,
    label: f.label,
    group: "custom",
    width: "150px",
    defaultVisible: false,
  })),
];

export const COLUMN_MAP: Record<ColumnId, ColumnDef> = Object.fromEntries(
  COLUMNS.map((c) => [c.id, c]),
) as Record<ColumnId, ColumnDef>;

// ---------------- View persistence ----------------

export type TrackerView = {
  id: string;
  name: string;
  order: ColumnId[];
  visible: ColumnId[];
};

const DEFAULT_ORDER: ColumnId[] = COLUMNS.map((c) => c.id);
const DEFAULT_VISIBLE: ColumnId[] = COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id);

export const DEFAULT_VIEW: TrackerView = {
  id: "default",
  name: "Default",
  order: DEFAULT_ORDER,
  visible: DEFAULT_VISIBLE,
};

const VIEW_KEY = "avara.tracker.view";
const SAVED_KEY = "avara.tracker.savedViews";
const INTERP_KEY = "avara.fields.interpretations";

export function loadView(): TrackerView {
  if (typeof window === "undefined") return DEFAULT_VIEW;
  try {
    const raw = window.localStorage.getItem(VIEW_KEY);
    if (!raw) return DEFAULT_VIEW;
    const v = JSON.parse(raw) as TrackerView;
    // Heal: append any new columns we don't know about
    const known = new Set(v.order);
    const extras = DEFAULT_ORDER.filter((id) => !known.has(id));
    return { ...v, order: [...v.order.filter((id) => COLUMN_MAP[id]), ...extras] };
  } catch {
    return DEFAULT_VIEW;
  }
}

export function saveView(v: TrackerView) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VIEW_KEY, JSON.stringify(v));
}

export function loadSavedViews(): TrackerView[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveSavedViews(views: TrackerView[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(views));
}

// ---------------- Field interpretation state ----------------

export type InterpretationState = "pending" | "approved" | "ignored" | "edited";

export type FieldInterpretation = {
  state: InterpretationState;
  meaning: string;
};

export function loadInterpretations(): Record<CustomFieldId, FieldInterpretation> {
  const base = Object.fromEntries(
    CUSTOM_FIELD_DEFS.map((f) => [f.id, { state: "pending" as const, meaning: f.suggestion }]),
  ) as Record<CustomFieldId, FieldInterpretation>;
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(INTERP_KEY);
    if (!raw) return base;
    return { ...base, ...JSON.parse(raw) };
  } catch {
    return base;
  }
}

export function saveInterpretations(map: Record<CustomFieldId, FieldInterpretation>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INTERP_KEY, JSON.stringify(map));
}

// ---------------- Derived per-lead fields ----------------

export function statusForLead(l: Lead): { label: string; tone: "hot" | "warm" | "cool" | "cold" | "won" } {
  if (l.risk === "hot") return { label: "Active", tone: "hot" };
  if (l.risk === "cooling") return { label: "Needs reply", tone: "warm" };
  if (l.risk === "cold") return { label: "Going cold", tone: "cold" };
  return { label: "Recovered", tone: "won" };
}

export function timelineForLead(l: Lead): string {
  if (l.missing.includes("Timeline")) return "Not stated";
  if (l.risk === "hot") return "Within 30 days";
  if (l.risk === "cooling") return "This quarter";
  return "Flexible";
}

export function followUpDueForLead(l: Lead): { label: string; overdue: boolean } {
  if (l.risk === "cold") return { label: "Overdue", overdue: true };
  if (l.risk === "cooling") return { label: "Today", overdue: true };
  if (l.risk === "hot") return { label: "In 2 days", overdue: false };
  return { label: "This week", overdue: false };
}
