import * as React from "react";
import { X, Check, Loader2 } from "lucide-react";
import type { AgentAction } from "@/lib/mock/workmodeIntents";
import { DraftingStage, TriagingStage, OpeningLeadStage, BriefingStage } from "./stages";
import { cn } from "@/lib/utils";

export type OverlayState = "idle" | "working" | "complete";

export function AgentOverlay({
  open, action, state, onClose, onApprove, stepIndex,
}: {
  open: boolean;
  action: AgentAction | null;
  state: OverlayState;
  stepIndex: number;
  onClose: () => void;
  onApprove: () => void;
}) {
  // Esc to close
  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!action) return null;

  const Stage =
    action.stage === "drafting" ? <DraftingStage leadId={action.target?.leadId} active={state === "working"} /> :
    action.stage === "triaging" ? <TriagingStage active={state === "working"} /> :
    action.stage === "openingLead" ? <OpeningLeadStage leadId={action.target?.leadId} active={state === "working"} /> :
    <BriefingStage />;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-[var(--background)]/70 backdrop-blur-md" />

      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-[760px] h-[540px] rounded-2xl border hairline shadow-panel overflow-hidden",
          "bg-[var(--surface-1)] grain transition-all duration-300",
          open ? "scale-100 translate-y-0 opacity-100" : "scale-[0.96] translate-y-2 opacity-0",
        )}
      >
        {/* atmosphere */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-coral/12 blur-3xl" />

        {/* header */}
        <div className="relative flex items-start gap-3 px-5 pt-4 pb-3 border-b hairline">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className={cn("absolute inset-0 rounded-full", state === "working" ? "bg-coral animate-ping" : "bg-[var(--success)]")} />
                <span className={cn("relative h-2 w-2 rounded-full", state === "working" ? "bg-coral" : "bg-[var(--success)]")} />
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {state === "working" ? "Avara is working" : state === "complete" ? "Action ready" : "Avara is ready"}
              </span>
            </div>
            <div className="mt-1 text-[15px] font-semibold tracking-tight">{action.title}</div>
            <div className="text-[12px] text-muted-foreground">{action.subtitle}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-auto h-8 w-8 grid place-items-center rounded-lg hover:bg-[var(--surface-2)]"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* progress hairline */}
        <div className="relative h-[2px] bg-[var(--hairline)] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple to-coral transition-all duration-500"
            style={{
              width:
                state === "complete"
                  ? "100%"
                  : `${Math.min(100, Math.round(((stepIndex + (state === "working" ? 0.5 : 0)) / action.steps.length) * 100))}%`,
            }}
          />
        </div>

        {/* body */}
        <div className="relative grid grid-cols-[200px_1fr] h-[calc(540px-105px-56px)]">
          {/* step list */}
          <aside className="border-r hairline bg-[var(--surface-2)]/30 px-4 py-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Steps</div>
            <ol className="space-y-2.5">
              {action.steps.map((s, i) => {
                const done = state === "complete" || i < stepIndex;
                const active = state === "working" && i === stepIndex;
                return (
                  <li key={s} className="flex items-start gap-2 text-[12px]">
                    <span className="mt-[3px] grid place-items-center h-3.5 w-3.5 rounded-full border hairline shrink-0"
                      style={{
                        background: done ? "var(--success)" : active ? "var(--coral)" : "transparent",
                        borderColor: done || active ? "transparent" : undefined,
                      }}
                    >
                      {done && <Check className="h-2.5 w-2.5 text-[var(--background)]" />}
                      {active && <Loader2 className="h-2.5 w-2.5 text-[var(--background)] animate-spin" />}
                    </span>
                    <span className={cn(done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground")}>
                      {s}
                    </span>
                  </li>
                );
              })}
            </ol>
          </aside>

          {/* stage */}
          <section className="relative overflow-hidden">
            <div
              key={action.stage + (action.target?.leadId ?? "")}
              className="h-full animate-fade-in"
            >
              {Stage}
            </div>
          </section>
        </div>

        {/* action bar */}
        <div className="relative flex items-center gap-2 border-t hairline px-5 h-14 bg-[var(--surface-1)]">
          <span className="text-[11px] text-muted-foreground">
            {state === "working" ? "Avara is preparing this for you." : "Review and approve when you're ready."}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-9 px-3 rounded-lg border hairline bg-[var(--surface-2)]/40 text-[12.5px] hover:bg-[var(--surface-2)]"
            >
              Discard
            </button>
            <button
              className="h-9 px-3 rounded-lg border hairline bg-[var(--surface-2)]/40 text-[12.5px] hover:bg-[var(--surface-2)]"
              disabled={state === "working"}
            >
              Edit
            </button>
            <button
              onClick={onApprove}
              disabled={state === "working"}
              className={cn(
                "h-9 px-4 rounded-lg text-[12.5px] font-medium transition",
                state === "working"
                  ? "bg-[var(--surface-2)] text-muted-foreground cursor-not-allowed"
                  : "bg-coral text-[var(--background)] hover:opacity-90",
              )}
            >
              {state === "complete" ? "Approved" : "Approve"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
