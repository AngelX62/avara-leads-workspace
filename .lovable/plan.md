# Avara — Phase 2: Lead Inbox + Avara Work Mode

Visual prototype only. Mock data. Two surfaces, each opinionated.

## Lead Inbox (`/inbox`) — Map + Queue

A spatial inbox. Left = stylized SVG map of active markets. Right = tight prioritized queue. Pin ↔ row are bidirectional.

### Layout (desktop)

```text
+--------------------------------------------------+
| Filter strip: search · class · risk · missing    |
+-----------------------+--------------------------+
| Map panel             | Queue (grouped by city)  |
|  - dark base, hairline|  LISBON · 4 · €92k        |
|  - pins sized by value|   Sofia A.    hot   €38k  |
|  - tinted by risk     |   Ana & T.    hot   €24k  |
|  - clusters per city  |  LONDON · 4 · €71k        |
|  - hover tag, click   |   Camille R.  cool  €18k  |
|    selects + scrolls  |  DUBAI · 2                |
+-----------------------+--------------------------+
| Footer: 12 in queue · 5 cooling · €184k at risk  |
+--------------------------------------------------+
```

### Map panel
- Custom dark SVG (no Mapbox). Europe + ME, hairline continent outlines, only Avara cities labeled.
- Pin radius = log(deal value). Fill = risk color (coral cold, amber cooling, mint hot, purple recovered). Faint pulse if "needs review today".
- Multi-lead cities cluster into one ring with count.
- Region toggle (All · EU · UK · ME) animates viewBox pan/zoom.

### Queue panel
- Grouped by city; header shows count + pipeline + at-risk slice.
- Rows are typographic, not cards: name, project + source muted, risk dot, value tabular right-aligned, inline missing-info chips. Hover = hairline left bar in risk color.
- Selected row expands inline: inquiry excerpt, missing chips with "Ask" buttons, link to `/leads/$leadId`.

### Interactions (local state)
- Filters drive both map + queue.
- Pin ↔ row bidirectional selection.
- "Missing info only" dims pins without missing info.

## Avara Work Mode (`/work`) — Single chat + Agent overlay

One centered chat panel. Full-width, focused. A mode toggle in the composer switches between **Ask** (text-only replies) and **Agent** (Avara can take actions on your lead data). When in Agent mode and a prompt triggers an action, a **small-medium overlay** rises over the chat showing what Avara is doing. The chat itself stays clean — no split, no inline preview cards.

### Layout

```text
+--------------------------------------------------+
|             Avara · Work mode                    |
|         "Ask, or let Avara take action."         |
+--------------------------------------------------+
|                                                  |
|     [centered chat transcript, max ~760px]       |
|                                                  |
|     User: Draft a follow-up to Camille           |
|     Avara: On it — drafting now.                 |
|       └─ "Action running" inline status chip     |
|          (click to reopen overlay)               |
|                                                  |
+--------------------------------------------------+
|  [composer]  [Ask | Agent toggle]  [Send]        |
+--------------------------------------------------+
```

### The chat panel
- Centered column on a calm graphite surface. Hairline frame, generous vertical rhythm.
- Empty state: a soft Avara presence (no orb/mascot — just a hairline pulse and one line "Avara is ready"), and 4 prompt suggestion tiles below the composer ("Draft a follow-up to Camille Roux", "Find leads going cold in London", "Open Henrik Lindqvist", "Summarize today").
- Messages: text-only bubbles. User right-aligned, Avara left-aligned with a small coral presence dot. Markdown rendered for Avara's replies.
- When Avara starts an action (Agent mode only), its message includes a small status row underneath: spinning hairline + "Drafting follow-up for Camille Roux · view". Clicking "view" re-opens the overlay. After completion, the row collapses to "Draft ready · Approved" with a check.

### The composer
- Large rounded input with coral focus ring.
- To the right of the input: a segmented **Ask / Agent** toggle. Agent state is visually distinct (subtle purple tint on the ring + a tiny "agent" pill above the input that reads "Agent mode — Avara can take actions").
- Send button (coral fill in Agent, neutral in Ask).
- Below the composer when empty: prompt suggestion tiles.

### The agent overlay (the key piece)

When a prompt in Agent mode is recognized as an action intent, a **small-medium centered overlay** animates in over the chat. Not a full-screen takeover, not an inline card. Roughly 720×520 max, rounded, hairline-framed, deeper-than-background fill, soft outer shadow, faint grid texture. Backdrop dims and blurs the chat behind.

Structure of the overlay:

```text
+----------------------------------------------+
|  Avara is working                       [×]  |
|  Drafting follow-up · Camille Roux           |
|  ─── thin progress hairline ───              |
+----------------------------------------------+
|  Steps (left, 1/3)   |  Stage (right, 2/3)   |
|  • Reading last reply|  [live render of      |
|  • Pulling tone      |   the action: draft   |
|  • Drafting message  |   composer, filtered  |
|  ✓ Done              |   inbox slice, lead   |
|                      |   detail, briefing]   |
+----------------------------------------------+
|  [ Discard ]   [ Edit ]   [ Approve ]        |
+----------------------------------------------+
```

- **Animation in**: backdrop fades, overlay scales from 0.96 + fades up. ~240ms ease-out.
- **Animation out**: scales to 0.98 + fades. On approve, a check-mark sweep plays before close.
- Closing the overlay does NOT cancel the action — it minimizes to the inline status chip in the chat. Reopen via the chip.
- Esc closes; click outside closes.
- The stage area renders one of four scripted views, reusing primitives:
  1. **Drafting** — recipient header, channel pill, draft text typewriter-revealed, tone selector, disabled send.
  2. **Triaging** — compact map+queue showing only the considered leads; pins light up sequentially.
  3. **Opening a lead** — mini Lead Detail (header, score ring, missing chips, inquiry excerpt) materializing.
  4. **Briefing** — Today decision summary + revenue-at-risk instrument.
- Step list ticks as the canvas progresses (scripted setTimeout sequence, 800–1400ms per step).
- Action bar: Discard / Edit / Approve are visual only. Approve sweeps a check, marks the chat message "Approved", closes the overlay after ~500ms.

### Ask vs Agent behavior

- **Ask mode**: Avara replies in text only. No overlay, ever. Suggestions still appear but they're informational ("Here's how I'd approach Camille…").
- **Agent mode**: action intents open the overlay; non-action prompts still get a text-only reply with no overlay.

### Scripted intent matcher (mock state machine)

Substring match → `{ stage, target, steps[], chatReply }`:
- "draft" / "follow up" → Drafting
- "cold" / "going cold" / "at risk" → Triaging
- "open" / "show" + lead name → Opening a lead
- "summary" / "today" / "brief" → Briefing
- fallback (Agent mode) → text reply, no overlay

## Shared components

- `src/components/avara/inbox/MapPanel.tsx` — stylized SVG map, pins, clusters, region toggle.
- `src/components/avara/inbox/Queue.tsx` — grouped typographic queue with inline expand.
- `src/components/avara/inbox/FilterStrip.tsx` — single source of truth for derived list.
- `src/components/avara/work/ChatPanel.tsx` — centered transcript, empty state, suggestion tiles.
- `src/components/avara/work/Composer.tsx` — input + Ask/Agent toggle + send.
- `src/components/avara/work/AgentOverlay.tsx` — modal frame, backdrop, animations, action bar, step list.
- `src/components/avara/work/stages/{Drafting,Triaging,OpeningLead,Briefing}.tsx`.
- `src/components/avara/ScoreRing.tsx` — reused in Opening Lead stage.
- `src/lib/mock/workmodeIntents.ts` — intent matcher.
- Extend `leads` mock with `coords` for map pin placement.

## Bugs/polish while here

- Verify `__root.tsx` still renders `<Outlet />`.
- Unique `head()` per route.
- Add missing tokens to `src/styles.css` if needed (`--mint`, `--amber` for risk colors).

## Routes touched

- `src/routes/inbox.tsx` — Map + Queue
- `src/routes/work.tsx` — Chat + Agent overlay

## Out of scope

Real AI, real maps, persistence, backend, auth. Import page stays a stub.
