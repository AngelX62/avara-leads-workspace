import { leads, preparedActions } from "./data";

export type Stage = "drafting" | "triaging" | "openingLead" | "briefing";

export type AgentAction = {
  stage: Stage;
  title: string;
  subtitle: string;
  steps: string[];
  target?: { leadId?: string };
  chatReply: string; // markdown-light
  completedReply: string;
};

export type IntentResult =
  | { kind: "action"; action: AgentAction }
  | { kind: "text"; reply: string };

function findLeadByName(prompt: string) {
  const lower = prompt.toLowerCase();
  return leads.find((l) => lower.includes(l.name.toLowerCase().split(" ")[0]));
}

export function matchIntent(prompt: string, mode: "ask" | "agent"): IntentResult {
  const p = prompt.toLowerCase().trim();

  // ASK mode → text only
  if (mode === "ask") {
    if (p.includes("camille")) {
      return {
        kind: "text",
        reply:
          "Camille's been quiet 6 days after a high-intent IG inquiry on a Notting Hill kitchen rebuild. I'd lead with a short, specific note — reference an open-plan project, offer two times, and ask budget range last. Want me to draft it?",
      };
    }
    if (p.includes("cold") || p.includes("risk")) {
      return {
        kind: "text",
        reply:
          "Four leads are cooling or cold today: Camille Roux, Priya Kapoor, Marco & Lia, and Eduardo Pereira. Combined revenue at risk is ~€184k. The Bianchi refurb is closest to going dark.",
      };
    }
    return {
      kind: "text",
      reply:
        "Happy to help. In Ask mode I'll think out loud, but I won't take action on your inbox. Flip to Agent if you want me to draft, triage, or open a lead.",
    };
  }

  // AGENT mode
  if (p.includes("draft") || p.includes("follow up") || p.includes("follow-up") || p.includes("reply")) {
    const lead = findLeadByName(prompt) ?? leads.find((l) => l.id === "l-001")!;
    const pa = preparedActions.find((a) => a.leadId === lead.id);
    return {
      kind: "action",
      action: {
        stage: "drafting",
        title: "Drafting follow-up",
        subtitle: `${lead.name} · ${lead.project}`,
        steps: [
          "Reading last conversation",
          "Pulling studio tone",
          "Drafting message",
          "Checking length & CTA",
        ],
        target: { leadId: lead.id },
        chatReply: `On it — drafting a follow-up to **${lead.name}** in your studio voice.`,
        completedReply: `Draft ready for **${lead.name}**. Approved & queued in your outbox.`,
      },
    };
  }

  if (p.includes("cold") || p.includes("at risk") || p.includes("going cold") || p.includes("triage")) {
    return {
      kind: "action",
      action: {
        stage: "triaging",
        title: "Triaging leads going cold",
        subtitle: "Scanning the last 14 days",
        steps: [
          "Scanning 12 active leads",
          "Scoring recovery odds",
          "Ranking by revenue risk",
          "Preparing recovery actions",
        ],
        chatReply: "Scanning your inbox for cooling leads now.",
        completedReply: "Found **4 cooling leads** worth **~€184k**. Recovery actions queued.",
      },
    };
  }

  if (p.includes("open") || p.includes("show") || p.includes("pull up")) {
    const lead = findLeadByName(prompt) ?? leads.find((l) => l.id === "l-002")!;
    return {
      kind: "action",
      action: {
        stage: "openingLead",
        title: "Opening lead",
        subtitle: `${lead.name} · ${lead.location}`,
        steps: ["Locating lead", "Loading history", "Computing score", "Surfacing missing info"],
        target: { leadId: lead.id },
        chatReply: `Pulling up **${lead.name}** now.`,
        completedReply: `**${lead.name}** is open. Score ${lead.id ? "computed" : ""}.`,
      },
    };
  }

  if (p.includes("summary") || p.includes("today") || p.includes("brief")) {
    return {
      kind: "action",
      action: {
        stage: "briefing",
        title: "Preparing today's briefing",
        subtitle: "Decisions waiting on you",
        steps: [
          "Aggregating new inquiries",
          "Computing revenue at risk",
          "Selecting top 3 priorities",
          "Composing briefing",
        ],
        chatReply: "Putting together today's briefing.",
        completedReply: "Briefing ready. 3 priorities, ~€184k at risk.",
      },
    };
  }

  return {
    kind: "text",
    reply:
      "I can help, but I'm not sure what action to take yet. Try “draft a follow-up to Camille”, “find leads going cold”, “open Henrik”, or “summarize today”.",
  };
}

export const SUGGESTIONS = [
  "Draft a follow-up to Camille Roux",
  "Find leads going cold in London",
  "Open Henrik Lindqvist",
  "Summarize today",
];
