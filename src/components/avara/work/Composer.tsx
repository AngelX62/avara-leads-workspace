import * as React from "react";
import { Send, Sparkles, MessageSquare, ArrowUp, Loader2, Check, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export type Mode = "ask" | "agent";

export function Composer({
  mode, onModeChange, value, onChange, onSend, disabled,
}: {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(160, el.scrollHeight) + "px";
  }, [value]);

  return (
    <div className="w-full">
      {mode === "agent" && (
        <div className="mb-2 flex items-center gap-2 text-[11px] text-purple">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-soft border border-purple/30 px-2 py-0.5">
            <Sparkles className="h-3 w-3" />
            Agent mode — Avara can take actions on your leads
          </span>
        </div>
      )}
      <div
        className={cn(
          "relative rounded-2xl border bg-[var(--surface-1)] transition-shadow",
          mode === "agent"
            ? "border-purple/40 shadow-[0_0_0_4px_color-mix(in_oklab,var(--purple)_10%,transparent)] focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--purple)_18%,transparent)]"
            : "hairline focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--coral)_14%,transparent)]",
        )}
      >
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (value.trim() && !disabled) onSend();
            }
          }}
          placeholder={mode === "agent" ? "Ask Avara to draft, triage, open a lead…" : "Ask Avara anything about your leads…"}
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[14px] outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-2 px-2 pb-2">
          <div className="inline-flex rounded-lg border hairline bg-[var(--surface-2)]/50 p-0.5">
            <button
              onClick={() => onModeChange("ask")}
              className={cn(
                "h-7 px-2.5 rounded-md text-[12px] inline-flex items-center gap-1.5 transition",
                mode === "ask" ? "bg-[var(--surface-1)] text-foreground" : "text-muted-foreground",
              )}
            >
              <MessageSquare className="h-3 w-3" /> Ask
            </button>
            <button
              onClick={() => onModeChange("agent")}
              className={cn(
                "h-7 px-2.5 rounded-md text-[12px] inline-flex items-center gap-1.5 transition",
                mode === "agent" ? "bg-purple/15 text-purple" : "text-muted-foreground",
              )}
            >
              <Sparkles className="h-3 w-3" /> Agent
            </button>
          </div>
          <span className="ml-auto text-[10.5px] text-muted-foreground hidden sm:inline">
            Enter to send · Shift+Enter for newline
          </span>
          <button
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className={cn(
              "h-8 w-8 grid place-items-center rounded-lg transition",
              !value.trim() || disabled
                ? "bg-[var(--surface-2)] text-muted-foreground cursor-not-allowed"
                : mode === "agent"
                  ? "bg-purple text-[var(--background)] hover:opacity-90"
                  : "bg-coral text-[var(--background)] hover:opacity-90",
            )}
            aria-label="Send"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ActionStatusRow({
  state, title, onReopen,
}: { state: "working" | "complete"; title: string; onReopen: () => void }) {
  return (
    <button
      onClick={onReopen}
      className="mt-2 inline-flex items-center gap-2 rounded-lg border hairline bg-[var(--surface-2)]/50 px-2.5 py-1.5 text-[11.5px] hover:bg-[var(--surface-2)] transition"
    >
      {state === "working" ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin text-coral" />
          <span className="text-muted-foreground">{title}</span>
          <span className="text-foreground inline-flex items-center gap-1"><Eye className="h-3 w-3" /> view</span>
        </>
      ) : (
        <>
          <span className="grid place-items-center h-3.5 w-3.5 rounded-full bg-[var(--success)]">
            <Check className="h-2.5 w-2.5 text-[var(--background)]" />
          </span>
          <span className="text-muted-foreground">{title} · Approved</span>
        </>
      )}
    </button>
  );
}
