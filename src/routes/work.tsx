import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/avara/Shell";
import { Composer, ActionStatusRow, type Mode } from "@/components/avara/work/Composer";
import { AgentOverlay, type OverlayState } from "@/components/avara/work/AgentOverlay";
import { matchIntent, SUGGESTIONS, type AgentAction } from "@/lib/mock/workmodeIntents";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "avara"; text: string; action?: { id: string; title: string; state: "working" | "complete" } };

function renderMd(text: string) {
  // tiny markdown: **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>,
  );
}

function WorkPage() {
  const [mode, setMode] = React.useState<Mode>("agent");
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [overlayOpen, setOverlayOpen] = React.useState(false);
  const [overlayState, setOverlayState] = React.useState<OverlayState>("idle");
  const [overlayStep, setOverlayStep] = React.useState(0);
  const [currentAction, setCurrentAction] = React.useState<AgentAction | null>(null);
  const [currentActionMsgId, setCurrentActionMsgId] = React.useState<string | null>(null);

  const scrollerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const runAction = React.useCallback((action: AgentAction, msgId: string) => {
    setCurrentAction(action);
    setCurrentActionMsgId(msgId);
    setOverlayState("working");
    setOverlayStep(0);
    setOverlayOpen(true);

    const totalSteps = action.steps.length;
    let i = 0;
    const tick = () => {
      i++;
      if (i >= totalSteps) {
        setOverlayStep(totalSteps - 1);
        setTimeout(() => {
          setOverlayState("complete");
        }, 400);
        return;
      }
      setOverlayStep(i);
      setTimeout(tick, 900 + Math.random() * 500);
    };
    setTimeout(tick, 900);
  }, []);

  const send = (override?: string) => {
    const text = (override ?? input).trim();
    if (!text) return;
    const userId = "u-" + Date.now();
    const userMsg: Msg = { id: userId, role: "user", text };
    const result = matchIntent(text, mode);
    setInput("");

    if (result.kind === "text") {
      const aiId = "a-" + Date.now();
      setMessages((m) => [...m, userMsg, { id: aiId, role: "avara", text: result.reply }]);
      return;
    }
    // action
    const aiId = "a-" + Date.now();
    setMessages((m) => [
      ...m,
      userMsg,
      { id: aiId, role: "avara", text: result.action.chatReply, action: { id: aiId, title: result.action.title, state: "working" } },
    ]);
    runAction(result.action, aiId);
  };

  // when overlay state becomes complete, update message
  React.useEffect(() => {
    if (overlayState === "complete" && currentActionMsgId && currentAction) {
      setMessages((ms) =>
        ms.map((m) =>
          m.id === currentActionMsgId && m.role === "avara"
            ? { ...m, text: currentAction.completedReply, action: { id: m.id, title: currentAction.title, state: "complete" } }
            : m,
        ),
      );
    }
  }, [overlayState, currentActionMsgId, currentAction]);

  const handleApprove = () => {
    setOverlayState("complete");
    setTimeout(() => setOverlayOpen(false), 700);
  };

  const reopen = (msgId: string) => {
    if (msgId === currentActionMsgId) setOverlayOpen(true);
  };

  const empty = messages.length === 0;

  return (
    <Shell title="Avara work mode" subtitle="Conversation">
      <div className="relative flex flex-col h-[calc(100vh-3.5rem)]">
        {/* transcript */}
        <div ref={scrollerRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[760px] px-6 py-10">
            {empty ? (
              <EmptyState onPick={(s) => send(s)} />
            ) : (
              <div className="space-y-6">
                {messages.map((m) => (
                  <MessageView key={m.id} msg={m} onReopen={() => reopen(m.id)} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* composer */}
        <div className="border-t hairline bg-[var(--background)]/85 backdrop-blur-xl">
          <div className="mx-auto max-w-[760px] px-6 py-4">
            <Composer
              mode={mode}
              onModeChange={setMode}
              value={input}
              onChange={setInput}
              onSend={() => send()}
            />
            {empty && (
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border hairline bg-[var(--surface-2)]/40 px-3 py-1.5 text-[12px] text-muted-foreground hover:text-foreground hover:bg-[var(--surface-2)] transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AgentOverlay
        open={overlayOpen}
        action={currentAction}
        state={overlayState}
        stepIndex={overlayStep}
        onClose={() => setOverlayOpen(false)}
        onApprove={handleApprove}
      />
    </Shell>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="pt-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-purple/40 to-coral/40 grid place-items-center relative">
        <Sparkles className="h-5 w-5" />
        <span className="absolute inset-0 rounded-2xl ring-1 ring-coral/30 animate-pulse" />
      </div>
      <h2 className="mt-4 text-[20px] font-semibold tracking-tight">Avara is ready</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Ask anything about your leads, or switch to <span className="text-purple">Agent</span> mode and let Avara take action.
      </p>
    </div>
  );
}

function MessageView({ msg, onReopen }: { msg: Msg; onReopen: () => void }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-[var(--surface-2)] border hairline px-4 py-2.5 text-[13.5px] leading-relaxed">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="mt-1 h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-purple/60 to-coral/60 grid place-items-center">
        <span className="h-1.5 w-1.5 rounded-full bg-coral animate-pulse" />
      </div>
      <div className="min-w-0 max-w-[88%]">
        <div className={cn("rounded-2xl rounded-tl-md px-4 py-2.5 text-[13.5px] leading-relaxed bg-[var(--surface-1)] border hairline")}>
          {renderMd(msg.text)}
        </div>
        {msg.action && (
          <ActionStatusRow state={msg.action.state} title={msg.action.title} onReopen={onReopen} />
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/work")({
  head: () => ({ meta: [
    { title: "Work mode · Avara" },
    { name: "description", content: "Ask Avara, or let it take action on your leads." },
  ] }),
  component: WorkPage,
});
