export type Source = "Instagram" | "WhatsApp" | "Referral" | "Website" | "Email" | "Spreadsheet";
export type Classification = "Interior" | "Architecture" | "Real Estate";
export type Risk = "hot" | "cooling" | "cold" | "recovered";

export type Lead = {
  id: string;
  name: string;
  project: string;
  location: string;
  source: Source;
  classification: Classification;
  score: number; // 0-100
  value: number; // EUR
  currency: "EUR" | "GBP" | "AED";
  risk: Risk;
  lastTouch: string; // human
  missing: string[];
  nextAction: string;
  inquiry: string;
};

export const leads: Lead[] = [
  {
    id: "l-001",
    name: "Camille Roux",
    project: "Kitchen remodel — Notting Hill",
    location: "London, UK",
    source: "Instagram",
    classification: "Interior",
    score: 86,
    value: 42000,
    currency: "GBP",
    risk: "cooling",
    lastTouch: "6 days ago",
    missing: ["Budget range", "Timeline"],
    nextAction: "Send prepared follow-up",
    inquiry:
      "Hi! Saw your Marylebone project on IG — we just bought a townhouse in Notting Hill and the kitchen is a 1990s nightmare. Looking to gut and rebuild, open plan into the garden if possible. When could we chat?",
  },
  {
    id: "l-002",
    name: "Henrik Lindqvist",
    project: "3-bed new build — Porto",
    location: "Porto, PT",
    source: "Referral",
    classification: "Architecture",
    score: 92,
    value: 380000,
    currency: "EUR",
    risk: "hot",
    lastTouch: "2 hours ago",
    missing: [],
    nextAction: "Confirm site visit",
    inquiry:
      "Referred by Ana Mendes. We have a 600m² plot in Foz and want a contemporary 3-bed family home, indoor-outdoor living. Planning permission in motion. Need an architect on board by month-end.",
  },
  {
    id: "l-003",
    name: "Priya Kapoor",
    project: "Off-plan 2-bed — Dubai Marina",
    location: "Dubai, AE",
    source: "WhatsApp",
    classification: "Real Estate",
    score: 74,
    value: 1850000,
    currency: "AED",
    risk: "cooling",
    lastTouch: "4 days ago",
    missing: ["Mortgage status"],
    nextAction: "Ask about financing",
    inquiry:
      "Interested in the Emaar Beachfront tower you posted about. Looking at a 2-bed with sea view, end of year handover. Can you share floor plans and payment plan?",
  },
  {
    id: "l-004",
    name: "Marco & Lia Bianchi",
    project: "Whole-home refurb — Milan",
    location: "Milan, IT",
    source: "Website",
    classification: "Interior",
    score: 68,
    value: 95000,
    currency: "EUR",
    risk: "cold",
    lastTouch: "11 days ago",
    missing: ["Phone", "Decision maker"],
    nextAction: "Review before this lead goes cold",
    inquiry:
      "Hello, we recently bought a 140m² apartment in Brera. We'd like to redo everything — kitchen, bathrooms, flooring. Modern but warm. Could we get a quote?",
  },
  {
    id: "l-005",
    name: "Sofia Almeida",
    project: "Boutique hotel lobby — Lisbon",
    location: "Lisbon, PT",
    source: "Email",
    classification: "Interior",
    score: 81,
    value: 120000,
    currency: "EUR",
    risk: "hot",
    lastTouch: "Today",
    missing: ["Site dimensions"],
    nextAction: "Request floor plan",
    inquiry:
      "We're opening a 22-room boutique hotel in Príncipe Real and need a designer for the lobby, bar and breakfast room. Opening planned for spring next year.",
  },
  {
    id: "l-006",
    name: "James Whitford",
    project: "Garden studio — Cotswolds",
    location: "Cotswolds, UK",
    source: "Referral",
    classification: "Architecture",
    score: 70,
    value: 65000,
    currency: "GBP",
    risk: "cooling",
    lastTouch: "5 days ago",
    missing: ["Planning constraints"],
    nextAction: "Send prepared follow-up",
    inquiry:
      "Looking for a small architecture practice to design a 30m² garden studio / writing room. AONB so planning may be tricky.",
  },
  {
    id: "l-007",
    name: "Noor Al-Sabah",
    project: "Penthouse staging — Downtown Dubai",
    location: "Dubai, AE",
    source: "Instagram",
    classification: "Real Estate",
    score: 78,
    value: 9200000,
    currency: "AED",
    risk: "hot",
    lastTouch: "Yesterday",
    missing: [],
    nextAction: "Schedule viewing",
    inquiry:
      "I want to view the Burj Vista penthouse you have listed. Cash buyer, looking to close within 6 weeks.",
  },
  {
    id: "l-008",
    name: "Eduardo Pereira",
    project: "Restaurant interior — Comporta",
    location: "Comporta, PT",
    source: "Website",
    classification: "Interior",
    score: 64,
    value: 88000,
    currency: "EUR",
    risk: "cold",
    lastTouch: "14 days ago",
    missing: ["Budget range", "Timeline"],
    nextAction: "Review before this lead goes cold",
    inquiry:
      "Opening a seafood restaurant near the beach. Looking for someone with hospitality experience. Casual coastal vibe.",
  },
  {
    id: "l-009",
    name: "Ana & Tomás Ferreira",
    project: "Loft conversion — Lisbon",
    location: "Lisbon, PT",
    source: "WhatsApp",
    classification: "Architecture",
    score: 83,
    value: 72000,
    currency: "EUR",
    risk: "hot",
    lastTouch: "3 hours ago",
    missing: [],
    nextAction: "Send proposal",
    inquiry:
      "Converting the attic of our pombalino into a master suite. Need drawings + permits. Recommended by Sofia A.",
  },
  {
    id: "l-010",
    name: "Helena Voss",
    project: "Family villa — Algarve",
    location: "Algarve, PT",
    source: "Referral",
    classification: "Architecture",
    score: 89,
    value: 540000,
    currency: "EUR",
    risk: "hot",
    lastTouch: "Today",
    missing: ["Plot survey"],
    nextAction: "Request survey",
    inquiry:
      "We've bought 2,400m² of land near Lagos and want a 4-bed family villa with pool, very low energy use.",
  },
  {
    id: "l-011",
    name: "Devon Carter",
    project: "Co-working interior — Shoreditch",
    location: "London, UK",
    source: "Email",
    classification: "Interior",
    score: 60,
    value: 140000,
    currency: "GBP",
    risk: "cold",
    lastTouch: "18 days ago",
    missing: ["Phone", "Square footage"],
    nextAction: "Review before this lead goes cold",
    inquiry: "Need help designing a 600sqm co-working space. Budget tight, vibe industrial-soft.",
  },
  {
    id: "l-012",
    name: "Yuki Tanaka",
    project: "Pied-à-terre — Mayfair",
    location: "London, UK",
    source: "Instagram",
    classification: "Interior",
    score: 77,
    value: 58000,
    currency: "GBP",
    risk: "cooling",
    lastTouch: "7 days ago",
    missing: ["Move-in date"],
    nextAction: "Send prepared follow-up",
    inquiry: "Small 1-bed apartment, need full furnishing & styling. Visit London 6x/year.",
  },
];

export type PreparedAction = {
  id: string;
  leadId: string;
  kind: "Follow-up" | "Question" | "Proposal" | "Reminder";
  why: string;
  channel: "Email" | "WhatsApp" | "Instagram DM";
  draft: string;
};

export const preparedActions: PreparedAction[] = [
  {
    id: "a-1",
    leadId: "l-001",
    kind: "Follow-up",
    why: "No reply in 6 days. High-intent IG inquiry with clear scope.",
    channel: "Instagram DM",
    draft:
      "Hi Camille — circling back on the Notting Hill kitchen. If helpful, I can share two recent open-plan rebuilds and rough budget ranges before we book a call. Does Thursday or Friday morning suit you?",
  },
  {
    id: "a-2",
    leadId: "l-003",
    kind: "Question",
    why: "Missing mortgage status blocks proposal. Asking unlocks pricing.",
    channel: "WhatsApp",
    draft:
      "Hi Priya — to send you the right payment plan for the Beachfront 2-bed, could you let me know if you're financing or paying cash? I can have options to you the same day.",
  },
  {
    id: "a-3",
    leadId: "l-004",
    kind: "Reminder",
    why: "Goes cold in 3 days. Decision maker not yet identified.",
    channel: "Email",
    draft:
      "Hi Marco & Lia — wanted to make sure your Brera refurb didn't fall through the cracks. Are both of you the right people for scheduling, or is there someone else I should loop in?",
  },
  {
    id: "a-4",
    leadId: "l-006",
    kind: "Follow-up",
    why: "Cotswolds AONB — early reassurance on planning lifts conversion.",
    channel: "Email",
    draft:
      "Hi James — we've completed three garden studios in AONB sites recently. Happy to share planning notes before our chat so you have a realistic read. Free Tuesday afternoon?",
  },
];

export type Insight = { id: string; text: string; tone: "neutral" | "good" | "warn" };
export const insights: Insight[] = [
  { id: "i1", text: "Instagram leads convert 2.3× higher than website leads this month — worth doubling the IG response window.", tone: "good" },
  { id: "i2", text: "Four leads from Porto referrals are uncontacted past 48h. Henrik (Foz villa) is the largest by value.", tone: "warn" },
  { id: "i3", text: "Missing-budget is the single biggest reason inquiries stall at qualification.", tone: "neutral" },
];

// Revenue risk over the last 14 days
export const revenueRiskSeries = [
  { d: "Mon", pipeline: 180, atRisk: 42 },
  { d: "Tue", pipeline: 195, atRisk: 48 },
  { d: "Wed", pipeline: 210, atRisk: 55 },
  { d: "Thu", pipeline: 205, atRisk: 61 },
  { d: "Fri", pipeline: 230, atRisk: 58 },
  { d: "Sat", pipeline: 240, atRisk: 64 },
  { d: "Sun", pipeline: 248, atRisk: 70 },
  { d: "Mon", pipeline: 260, atRisk: 76 },
  { d: "Tue", pipeline: 272, atRisk: 81 },
  { d: "Wed", pipeline: 285, atRisk: 84 },
  { d: "Thu", pipeline: 292, atRisk: 88 },
  { d: "Fri", pipeline: 305, atRisk: 92 },
  { d: "Sat", pipeline: 318, atRisk: 86 },
  { d: "Sun", pipeline: 332, atRisk: 84 },
];

export const responseTimeSeries = [
  { d: "M", v: 38 }, { d: "T", v: 32 }, { d: "W", v: 41 }, { d: "T", v: 27 },
  { d: "F", v: 22 }, { d: "S", v: 19 }, { d: "S", v: 17 },
];

export const sourceMix = [
  { name: "Instagram", value: 34 },
  { name: "Referral", value: 26 },
  { name: "WhatsApp", value: 18 },
  { name: "Website", value: 14 },
  { name: "Email", value: 8 },
];

export const qualificationSeries = [
  { d: "W1", v: 42 }, { d: "W2", v: 48 }, { d: "W3", v: 51 }, { d: "W4", v: 58 },
  { d: "W5", v: 55 }, { d: "W6", v: 63 }, { d: "W7", v: 68 },
];

export function formatMoney(value: number, currency: "EUR" | "GBP" | "AED") {
  const symbols = { EUR: "€", GBP: "£", AED: "AED " };
  if (value >= 1_000_000) return `${symbols[currency]}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1000) return `${symbols[currency]}${Math.round(value / 1000)}k`;
  return `${symbols[currency]}${value}`;
}

export function getLead(id: string) {
  return leads.find((l) => l.id === id);
}
