import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/avara/Shell";
import { Panel, PanelHeader } from "@/components/avara/Panel";
import { ArrowLeft } from "lucide-react";

function ComingSoon({ name, blurb }: { name: string; blurb: string }) {
  return (
    <div className="px-6 lg:px-8 py-10 max-w-[1100px] mx-auto">
      <Panel tone="glass" className="grain">
        <div className="p-10 relative">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Coming next
          </div>
          <h2 className="text-[26px] font-semibold tracking-tight mt-1">{name}</h2>
          <p className="mt-2 text-[14px] text-muted-foreground max-w-prose">{blurb}</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-md border hairline px-3 py-2 text-[12.5px] hover:bg-[var(--surface-2)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Today's review
          </Link>
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple/20 blur-3xl" />
        </div>
      </Panel>
    </div>
  );
}

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [{ title: "Lead inbox · Avara" }] }),
  component: () => (
    <Shell title="Lead inbox" subtitle="Triage">
      <ComingSoon
        name="Lead inbox"
        blurb="A visual triage surface for every inquiry — grouped by recovery risk, filterable by source and classification, with missing-information indicators and next actions surfaced inline."
      />
    </Shell>
  ),
});
