import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/avara/Shell";
import { Panel, PanelHeader } from "@/components/avara/Panel";
import {
  SourceBadge,
  RiskPill,
  MissingChip,
  ClassificationChip,
  ScoreBar,
} from "@/components/avara/Bits";
import { getLead, formatMoney } from "@/lib/mock/data";
import { ArrowLeft, Clock, Send } from "lucide-react";

export const Route = createFileRoute("/leads/$leadId")({
  head: ({ params }) => ({
    meta: [{ title: `Lead · ${params.leadId} · Avara` }],
  }),
  component: LeadDetail,
  notFoundComponent: () => <Shell title="Lead not found"><div className="p-6">No lead with that id.</div></Shell>,
});

function LeadDetail() {
  const { leadId } = Route.useParams();
  const lead = getLead(leadId);

  if (!lead) {
    return (
      <Shell title="Lead not found" subtitle="Lead detail">
        <div className="p-6 text-muted-foreground">
          <Link to="/" className="underline">Back to Today's review</Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title={lead.name} subtitle="Lead detail">
      <div className="px-6 lg:px-8 py-6 max-w-[1480px] mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
        </div>

        <Panel tone="glass" className="grain">
          <div className="relative p-6 flex items-start gap-5 flex-wrap">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-coral/40 to-purple/40 grid place-items-center text-[16px] font-semibold">
              {lead.name.split(" ").map((p) => p[0]).slice(0,2).join("")}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[22px] font-semibold tracking-tight">{lead.name}</h2>
                <RiskPill risk={lead.risk} />
                <ClassificationChip c={lead.classification} />
                <SourceBadge source={lead.source} />
              </div>
              <div className="text-[13px] text-muted-foreground mt-1">
                {lead.project} · {lead.location}
              </div>
              <div className="text-[11.5px] text-muted-foreground mt-1 inline-flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Last touch {lead.lastTouch}
              </div>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Estimated value</div>
                <div className="text-[24px] font-semibold tabular-nums">{formatMoney(lead.value, lead.currency)}</div>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-coral text-white px-4 py-2.5 text-[13px] font-medium hover:opacity-90">
                <Send className="h-3.5 w-3.5" /> Send prepared follow-up
              </button>
            </div>
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />
          </div>
        </Panel>

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-8 space-y-5">
            <Panel tone="raised">
              <PanelHeader hint="Raw inquiry" title={`From ${lead.source}`} />
              <div className="px-5 pb-5">
                <p className="text-[14px] leading-relaxed text-foreground/90 border-l-2 border-purple/40 pl-4 italic">
                  "{lead.inquiry}"
                </p>
              </div>
            </Panel>

            <Panel tone="raised">
              <PanelHeader hint="Extracted fields" title="What Avara understood" />
              <div className="px-5 pb-5 grid grid-cols-2 md:grid-cols-3 gap-3 text-[12.5px]">
                {[
                  ["Project type", lead.classification],
                  ["Location", lead.location],
                  ["Estimated value", formatMoney(lead.value, lead.currency)],
                  ["Score", `${lead.score} / 100`],
                  ["Source", lead.source],
                  ["Next action", lead.nextAction],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border hairline bg-[var(--surface-2)]/40 p-3">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{k}</div>
                    <div className="text-foreground mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel tone="raised">
              <PanelHeader hint="Score breakdown" title={`${lead.score} / 100`} />
              <div className="px-5 pb-5 space-y-3">
                {[
                  ["Intent clarity", Math.min(100, lead.score + 5)],
                  ["Budget signal", lead.missing.includes("Budget range") ? 30 : 80],
                  ["Timeline signal", lead.missing.includes("Timeline") ? 25 : 75],
                  ["Source quality", lead.source === "Referral" ? 92 : 70],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="tabular-nums">{v}</span>
                    </div>
                    <ScoreBar score={v as number} />
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-5">
            {lead.missing.length > 0 && (
              <Panel tone="glass">
                <PanelHeader hint="Missing information" title="Ask these to unlock pricing" />
                <div className="px-5 pb-5 flex flex-wrap gap-1.5">
                  {lead.missing.map((m) => (
                    <MissingChip key={m} label={m} />
                  ))}
                </div>
              </Panel>
            )}

            <Panel tone="raised">
              <PanelHeader hint="Opportunity recovery" title="Why this matters" />
              <div className="px-5 pb-5 text-[13px] leading-snug text-foreground/90">
                Review before this lead goes cold — last reply {lead.lastTouch}. A short, specific
                follow-up has been prepared.
              </div>
            </Panel>

            <Panel tone="raised">
              <PanelHeader hint="Prepared follow-up" title="Editable draft" />
              <div className="px-5 pb-4">
                <textarea
                  defaultValue={`Hi ${lead.name.split(" ")[0]} — circling back on ${lead.project}. Happy to share recent comparable work and rough budget ranges before we hop on a call. Does later this week suit you?`}
                  className="w-full min-h-[120px] rounded-lg border hairline bg-[var(--surface-2)]/40 p-3 text-[13px] outline-none focus:ring-1 focus:ring-coral"
                />
                <div className="mt-3 flex items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-md bg-coral text-white px-3 py-1.5 text-[12px] font-medium hover:opacity-90">
                    <Send className="h-3 w-3" /> Approve & send
                  </button>
                  <button className="rounded-md border hairline px-3 py-1.5 text-[12px] hover:bg-[var(--surface-2)]">
                    Save draft
                  </button>
                </div>
              </div>
            </Panel>

            <Panel tone="raised">
              <PanelHeader hint="Notes & reminders" title="Internal" />
              <div className="px-5 pb-5 space-y-2 text-[12.5px]">
                <div className="rounded-lg border hairline bg-[var(--surface-2)]/40 p-3">
                  <div className="text-muted-foreground text-[11px]">3 days ago · Ana</div>
                  Spoke briefly — wants to start scope conversation after the kitchen reno of friends finishes.
                </div>
                <button className="text-[12px] text-muted-foreground hover:text-foreground">
                  + Add note
                </button>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </Shell>
  );
}
