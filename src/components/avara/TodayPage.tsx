import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Pencil,
  X,
  Sparkles,
  TrendingDown,
  Clock,
} from "lucide-react";
import { Panel, PanelHeader } from "@/components/avara/Panel";
import {
  SourceBadge,
  RiskPill,
  MissingChip,
  ScoreBar,
  ClassificationChip,
} from "@/components/avara/Bits";
import {
  leads,
  preparedActions,
  insights,
  revenueRiskSeries,
  responseTimeSeries,
  sourceMix,
  qualificationSeries,
  formatMoney,
  getLead,
} from "@/lib/mock/data";
import { cn } from "@/lib/utils";

export function TodayPage() {
  const recoveryPriorities = leads
    .filter((l) => l.risk === "cooling" || l.risk === "cold")
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const priorityLeads = leads
    .filter((l) => l.risk === "hot" || l.risk === "cooling")
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const totalRisk = leads
    .filter((l) => l.risk === "cooling" || l.risk === "cold")
    .reduce((acc, l) => acc + (l.currency === "EUR" ? l.value : l.currency === "GBP" ? l.value * 1.17 : l.value * 0.25), 0);

  return (
    <div className="px-6 lg:px-8 py-6 space-y-6 max-w-[1480px] mx-auto">
      <Greeting />

      <DecisionSummary atRiskEur={Math.round(totalRisk)} />

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-7">
          <RevenueRiskPanel />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <RecoveryPriorities items={recoveryPriorities} />
        </div>
      </div>

      <PreparedActions />

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-7">
          <PriorityLeadsPanel items={priorityLeads} />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <AvaraInsightPanel />
        </div>
      </div>

      <InstrumentsRow />

      <footer className="pt-2 pb-8 text-[11px] text-muted-foreground flex items-center justify-between">
        <div>Avara · prepared {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
          All inboxes synced
        </div>
      </footer>
    </div>
  );
}

function Greeting() {
  const now = new Date();
  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const hour = now.getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Today's review
        </div>
        <h2 className="text-[28px] md:text-[32px] font-semibold tracking-tight leading-tight">
          {greet}, Ana.
        </h2>
        <div className="text-[13px] text-muted-foreground">{date} · Mendes & Co.</div>
      </div>
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full border hairline bg-[var(--surface-2)]/40 px-2.5 py-1">
          <Sparkles className="h-3 w-3 text-purple" />
          Avara prepared 4 actions
        </span>
      </div>
    </div>
  );
}

function DecisionSummary({ atRiskEur }: { atRiskEur: number }) {
  return (
    <Panel tone="glass" className="grain">
      <div className="relative grid grid-cols-12 gap-6 p-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
            Decision summary
          </div>
          <p className="text-[20px] md:text-[22px] leading-[1.35] tracking-tight">
            <span className="text-foreground">3 leads need review</span>{" "}
            <span className="text-muted-foreground">before they go cold this week.</span>{" "}
            <span className="text-coral">{formatMoney(atRiskEur, "EUR")}</span>{" "}
            <span className="text-muted-foreground">of pipeline is at risk, mostly from </span>
            <span className="text-foreground">Porto referrals</span>
            <span className="text-muted-foreground"> and the </span>
            <span className="text-foreground">Brera refurb</span>
            <span className="text-muted-foreground">. Avara has drafted </span>
            <span className="text-purple">4 follow-ups</span>
            <span className="text-muted-foreground"> ready for your approval.</span>
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <ChipAction label="Review prepared actions" tone="coral" />
            <ChipAction label="Open recovery list" />
            <ChipAction label="Skim today's new leads" />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Needs review" value="3" accent="coral" />
            <Stat label="At risk" value={formatMoney(atRiskEur, "EUR")} />
            <Stat label="Prepared" value="4" accent="purple" />
          </div>
          <div className="mt-3 rounded-xl border hairline bg-[var(--surface-2)]/40 p-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-1">
              First action
            </div>
            <div className="text-[13px] leading-snug">
              Send prepared reply to <span className="font-medium">Camille Roux</span> — Notting
              Hill kitchen has been quiet 6 days.
            </div>
          </div>
        </div>

        {/* gradient ornament */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple/20 blur-3xl" />
      </div>
    </Panel>
  );
}

function ChipAction({ label, tone }: { label: string; tone?: "coral" | "purple" }) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] transition",
        tone === "coral"
          ? "bg-coral text-white border-coral hover:opacity-90"
          : "bg-[var(--surface-2)]/60 hairline hover:bg-[var(--surface-2)]",
      )}
    >
      {label}
      <ArrowRight className="h-3 w-3" />
    </button>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: "coral" | "purple" }) {
  return (
    <div className="rounded-xl border hairline bg-[var(--surface-2)]/40 p-3">
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div
        className={cn(
          "text-[22px] font-semibold tracking-tight tabular-nums",
          accent === "coral" && "text-coral",
          accent === "purple" && "text-purple",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function RevenueRiskPanel() {
  return (
    <Panel tone="raised" className="h-full">
      <PanelHeader
        hint="Revenue risk"
        title="Pipeline vs at-risk · last 14 days"
        right={
          <span className="inline-flex items-center gap-1.5 text-[11.5px] text-coral">
            <TrendingDown className="h-3 w-3" />
            +12% at risk vs last week
          </span>
        }
      />
      <div className="px-2 pb-2 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueRiskSeries} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="gPipeline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--purple)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--purple)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--coral)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--coral)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--hairline)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
            <YAxis
              tickFormatter={(v) => `€${v}k`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              width={42}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(v: number, name) => [`€${v}k`, name === "pipeline" ? "Pipeline" : "At risk"]}
              labelStyle={{ color: "var(--muted-foreground)" }}
            />
            <Area type="monotone" dataKey="pipeline" stroke="var(--purple)" strokeWidth={1.6} fill="url(#gPipeline)" />
            <Area type="monotone" dataKey="atRisk" stroke="var(--coral)" strokeWidth={1.6} fill="url(#gRisk)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 border-t hairline">
        <Foot label="Active pipeline" value="€332k" />
        <Foot label="At risk" value="€84k" accent="coral" />
        <Foot label="Recovered (30d)" value="€41k" accent="success" />
      </div>
    </Panel>
  );
}

function Foot({ label, value, accent }: { label: string; value: string; accent?: "coral" | "success" }) {
  return (
    <div className="px-5 py-3 border-r hairline last:border-r-0">
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div
        className={cn(
          "text-[16px] font-semibold tabular-nums",
          accent === "coral" && "text-coral",
          accent === "success" && "text-[var(--success)]",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function RecoveryPriorities({ items }: { items: typeof leads }) {
  return (
    <Panel tone="raised" className="h-full">
      <PanelHeader
        hint="Recovery priorities"
        title="Review before these go cold"
        right={<Link to="/inbox" className="text-[12px] text-muted-foreground hover:text-foreground">All recovery →</Link>}
      />
      <ul className="divide-y divide-[var(--hairline)]">
        {items.map((l) => (
          <li key={l.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-[var(--surface-2)]/40">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-coral/30 to-purple/30 grid place-items-center text-[12px] font-semibold">
              {l.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="text-[13.5px] font-medium truncate">{l.name}</div>
                <RiskPill risk={l.risk} />
              </div>
              <div className="text-[12px] text-muted-foreground truncate">{l.project}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Last touch {l.lastTouch}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-semibold tabular-nums">
                {formatMoney(l.value, l.currency)}
              </div>
              <Link
                to="/leads/$leadId"
                params={{ leadId: l.id }}
                className="mt-1 inline-flex items-center gap-1 text-[11.5px] text-coral hover:underline"
              >
                Review <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function PreparedActions() {
  const [state, setState] = React.useState<Record<string, "pending" | "approved" | "skipped">>(
    Object.fromEntries(preparedActions.map((a) => [a.id, "pending"])),
  );
  return (
    <Panel tone="default">
      <PanelHeader
        hint="Prepared actions"
        title="Drafted by Avara · ready for your approval"
        right={
          <span className="text-[11.5px] text-muted-foreground">
            {Object.values(state).filter((s) => s === "pending").length} pending ·{" "}
            {Object.values(state).filter((s) => s === "approved").length} approved
          </span>
        }
      />
      <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {preparedActions.map((a) => {
          const lead = getLead(a.leadId)!;
          const s = state[a.id];
          return (
            <div
              key={a.id}
              className={cn(
                "relative rounded-xl border hairline bg-[var(--surface-2)]/40 p-4 flex flex-col",
                s === "approved" && "border-[var(--success)]/40 bg-[var(--success)]/5",
                s === "skipped" && "opacity-50",
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] uppercase tracking-[0.16em] text-purple font-medium">
                  {a.kind}
                </span>
                <span className="text-[11px] text-muted-foreground">· {a.channel}</span>
                {s === "approved" && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-[var(--success)]">
                    <Check className="h-3 w-3" /> Approved
                  </span>
                )}
              </div>
              <div className="text-[13.5px] font-medium truncate">{lead.name}</div>
              <div className="text-[11.5px] text-muted-foreground truncate mb-2">{lead.project}</div>
              <p className="text-[12.5px] leading-snug text-foreground/90 line-clamp-4 border-l-2 border-purple/40 pl-3 italic">
                "{a.draft}"
              </p>
              <div className="mt-3 text-[11px] text-muted-foreground">
                <span className="text-foreground/80">Why:</span> {a.why}
              </div>
              <div className="mt-3 pt-3 border-t hairline flex items-center gap-1.5">
                <button
                  onClick={() => setState((p) => ({ ...p, [a.id]: "approved" }))}
                  className="inline-flex items-center gap-1 rounded-md bg-coral text-white px-2.5 py-1.5 text-[11.5px] font-medium hover:opacity-90"
                >
                  <Check className="h-3 w-3" /> Approve
                </button>
                <button className="inline-flex items-center gap-1 rounded-md border hairline px-2.5 py-1.5 text-[11.5px] hover:bg-[var(--surface-2)]">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => setState((p) => ({ ...p, [a.id]: "skipped" }))}
                  className="ml-auto rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-[var(--surface-2)]"
                  aria-label="Skip"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function PriorityLeadsPanel({ items }: { items: typeof leads }) {
  return (
    <Panel tone="raised" className="h-full">
      <PanelHeader
        hint="Priority leads"
        title="Highest-intent inquiries right now"
        right={<Link to="/inbox" className="text-[12px] text-muted-foreground hover:text-foreground">Open inbox →</Link>}
      />
      <div className="px-2 pb-2">
        <div className="grid grid-cols-[1.6fr_1fr_auto_auto_auto] text-[10px] uppercase tracking-[0.16em] text-muted-foreground px-3 py-2">
          <div>Lead</div>
          <div>Source · Class</div>
          <div className="px-2">Score</div>
          <div className="px-2">Value</div>
          <div className="text-right pr-2">Action</div>
        </div>
        <ul>
          {items.map((l) => (
            <li
              key={l.id}
              className="grid grid-cols-[1.6fr_1fr_auto_auto_auto] items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-[var(--surface-2)]/50"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                  <span className="text-[13px] font-medium truncate">{l.name}</span>
                </div>
                <div className="text-[11.5px] text-muted-foreground truncate pl-3.5">{l.project}</div>
                {l.missing.length > 0 && (
                  <div className="pl-3.5 mt-1 flex flex-wrap gap-1">
                    {l.missing.map((m) => (
                      <MissingChip key={m} label={m} />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <SourceBadge source={l.source} />
                <ClassificationChip c={l.classification} />
              </div>
              <div className="px-2">
                <ScoreBar score={l.score} />
              </div>
              <div className="px-2 text-[12.5px] font-semibold tabular-nums">
                {formatMoney(l.value, l.currency)}
              </div>
              <div className="text-right pr-1">
                <Link
                  to="/leads/$leadId"
                  params={{ leadId: l.id }}
                  className="inline-flex items-center gap-1 rounded-md border hairline px-2 py-1 text-[11.5px] hover:bg-[var(--surface-2)]"
                >
                  Open <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

function AvaraInsightPanel() {
  return (
    <Panel tone="glass" className="h-full">
      <PanelHeader
        hint="Avara insight"
        title="What changed this week"
        right={<span className="text-[11px] text-purple inline-flex items-center gap-1"><Sparkles className="h-3 w-3" /> Updated 12 min ago</span>}
      />
      <ul className="px-5 pb-5 space-y-3">
        {insights.map((i) => (
          <li key={i.id} className="flex gap-3 text-[13px] leading-snug">
            <span
              className={cn(
                "mt-1.5 h-1.5 w-1.5 rounded-full shrink-0",
                i.tone === "good" && "bg-[var(--success)]",
                i.tone === "warn" && "bg-coral",
                i.tone === "neutral" && "bg-purple",
              )}
            />
            <span className="text-foreground/90">{i.text}</span>
          </li>
        ))}
      </ul>
      <div className="px-5 pb-5">
        <div className="rounded-xl border hairline bg-[var(--surface-2)]/40 p-4">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">
            Suggested focus
          </div>
          <div className="text-[13.5px] leading-snug">
            Spend the first 30 minutes on <span className="text-coral font-medium">Porto referrals</span> — three are high-value and getting cool.
          </div>
          <Link
            to="/inbox"
            className="mt-3 inline-flex items-center gap-1 text-[12px] text-purple hover:underline"
          >
            Open that group <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </Panel>
  );
}

function InstrumentsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Panel tone="raised">
        <PanelHeader hint="Response time" title="Median, last 7 days" right={<span className="text-[11.5px] text-[var(--success)]">↓ 28%</span>} />
        <div className="px-2 pb-3 h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseTimeSeries} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <XAxis dataKey="d" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--hairline)", borderRadius: 10, fontSize: 12 }}
                formatter={(v: number) => [`${v} min`, "Median reply"]}
              />
              <Line type="monotone" dataKey="v" stroke="var(--coral)" strokeWidth={1.8} dot={{ r: 2.5, fill: "var(--coral)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="px-5 pb-4 text-[20px] font-semibold tabular-nums">
          17 <span className="text-[12px] text-muted-foreground font-normal">min median</span>
        </div>
      </Panel>

      <Panel tone="raised">
        <PanelHeader hint="Source mix" title="Where leads came from" />
        <div className="px-5 pb-4 space-y-2">
          {sourceMix.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="text-[12px] w-20 shrink-0 text-muted-foreground">{s.name}</div>
              <div className="flex-1 h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${s.value * 2}%`,
                    background:
                      s.name === "Instagram" || s.name === "Referral"
                        ? "linear-gradient(90deg, var(--purple), var(--coral))"
                        : "var(--purple)",
                  }}
                />
              </div>
              <div className="text-[12px] tabular-nums w-8 text-right">{s.value}%</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel tone="raised">
        <PanelHeader hint="Qualification rate" title="Last 7 weeks" right={<span className="text-[11.5px] text-[var(--success)]">↑ 11pp</span>} />
        <div className="px-2 pb-3 h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qualificationSeries} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
              <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--hairline)", borderRadius: 10, fontSize: 12 }}
                formatter={(v: number) => [`${v}%`, "Qualified"]}
              />
              <Bar dataKey="v" radius={[4, 4, 0, 0]} fill="var(--purple)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="px-5 pb-4 text-[20px] font-semibold tabular-nums">
          68% <span className="text-[12px] text-muted-foreground font-normal">qualified</span>
        </div>
      </Panel>
    </div>
  );
}
