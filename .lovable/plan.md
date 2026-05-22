# Avara — Phase 2: Lead Inbox + Avara Work Mode

Building on the finished Today page. Visual prototype only — no backend, all mock data. Two distinct, opinionated surfaces.

## Lead Inbox (`/inbox`) — Map + Queue

A spatial inbox. Leads exist somewhere in the world, so the inbox treats geography as a first-class axis. Left = a stylized map of the studio's active markets. Right = a tight, prioritized queue. Selecting a pin filters the queue; selecting a queue row pulses the pin. No card stack, no kanban.

### Layout (desktop)

```text
+--------------------------------------------------+
| Filter strip: search · class · risk · missing    |
+-----------------------+--------------------------+
|                       | Queue                    |
|   Map panel           | -----------------------  |
|   - dark base         | LISBON · 4 leads         |
|   - hairline borders  |  > Sofia A.     hot      |
|   - lead pins sized   |    Ana & Tom\u00e1s  hot      |
|     by value, tinted  |    Helena V.    hot      |
|     by risk           |    Eduardo P.   cold     |
|   - hovered pin       | LONDON · 4 leads         |
|     shows mini tag    |  > Camille R.   cooling  |
|   - city labels       |    Yuki T.      cooling  |
|                       |    Devon C.     cold     |
|                       | DUBAI · 2 leads          |
|                       | PORTO/ALGARVE · 2 leads  |
|                       | COTSWOLDS · 1 lead       |
|                       | MILAN · 1 lead           |
+-----------------------+--------------------------+
| Footer: Recovery summary (counts + at-risk \u20ac)    |
+--------------------------------------------------+
```

### Map panel

- Custom dark stylized map (SVG, not Mapbox). Continents drawn as soft hairline shapes over the graphite surface — Europe centered, Middle East visible to the right. No labels except the cities Avara cares about.
- Each lead = a pin at its city. Pin radius scales with deal value (log scale). Pin fill uses risk color: coral (cold), amber (cooling), mint (hot), purple (recovered). Pin has a faint pulse if "needs review today".
- Cities with multiple leads cluster into a single ring with a count.
- Hover a pin → tooltip with name + project + value. Click → selects that lead (highlights row in queue, opens right-rail detail in queue panel).
- Lasso-free; selection is pin-driven or row-driven.
- A small "Region" toggle in the corner: All · Europe · UK · Middle East — animates pan/zoom of the SVG viewBox.

### Queue panel

- Grouped by city (matches map). City header shows count + total pipeline value + at-risk slice.
- Each row is intentionally typographic, not a card: lead name (medium weight), project + source (muted small), risk dot, value (right-aligned, tabular numerals), missing-info chips inline. Hover = hairline left bar in risk color. Selected = coral hairline + soft surface.
- Selected row expands inline (accordion) into a compact detail strip: inquiry excerpt (2 lines), missing chips with "Ask" buttons, "Open lead detail" link → `/leads/$leadId`.
- Filter strip is sticky and drives both map pins and queue rows.

### Footer strip

A single horizontal band: "12 leads in queue · 5 going cold · \u20ac184k at risk this week" with restrained coral on the at-risk number.

### Interactions (local state only)

- Filter strip mutates a single derived list; both map + queue read from it.
- Row click ↔ pin highlight (bidirectional).
- Region toggle animates SVG viewBox via CSS transition.
- "Missing info only" toggle dims pins without missing info.

## Avara Work Mode (`/work`) — Takeover Canvas

OpenAI-agent-mode feel, but inside Avara. The shell stays. The right ~70% of the page becomes a dark canvas — Avara's sandbox — where it visibly renders what it's doing at full size. The left ~30% is a slim conversation column. No inline preview cards in chat; the canvas IS the preview.

### Layout

```text
+--------------------------------------------------+
| Header: Avara \u00b7 status copy \u00b7 progress hairline   |
+----------------+---------------------------------+
| Chat column    | Sandbox canvas                  |
| (slim, ~320px) | (deep graphite, hairline frame) |
|                |                                 |
| - prompt chips | [Avara renders the current      |
|   on empty     |  action at full size here:      |
| - user msg     |  a draft composer, a filtered   |
| - Avara msg    |  inbox slice, a lead detail,    |
|   (text only)  |  a briefing summary, etc.]      |
| - step ticks   |                                 |
|   ("Reading    | Top of canvas: breadcrumb       |
|    Camille's   |  "Avara > Drafting follow-up    |
|    inquiry\u2026")  |   for Camille Roux"             |
|                | Bottom: ghost cursor + step     |
| Composer       |  indicator + "Approve / Edit /  |
| pinned bottom  |  Discard" action bar            |
+----------------+---------------------------------+
```

### The sandbox canvas

- Visually distinct from the rest of the app: deeper background (`--surface-0` shifted darker), hairline inner frame, faint grid texture, subtle vignette. Reads as "Avara's workspace, not your live app."
- Renders one focused stage at a time using shared primitives. Stages:
  1. **Drafting** — large composer mock with recipient header, channel pill, draft text appearing token-by-token (scripted typewriter), tone selector, send button (disabled, visual).
  2. **Triaging inbox** — a small version of the Inbox map+queue showing only the leads Avara is considering, with pins lighting up one by one as it "reads" them.
  3. **Opening a lead** — Lead Detail mini view (header, score ring, missing chips, inquiry) materializing in place.
  4. **Briefing** — the Today decision summary + revenue-at-risk instrument rendered standalone.
- A breadcrumb at the top of the canvas reads "Avara › {action} › {target}". Updates as steps progress.
- A ghost cursor element traces small movements between regions of the active stage during steps (CSS translate transitions), reinforcing the "Avara is working" feel without being literal screen-recording.
- Bottom action bar (pinned inside canvas): "Approve", "Edit", "Discard" — visual only, but Approve triggers a check-mark sweep animation and the step list marks Done.

### Transitions

- Stage swap: outgoing stage scales to 0.98 + fades, incoming scales from 1.02 + fades, hairline frame pulses. ~280ms.
- Token-by-token text via scripted `setTimeout` chunks.
- Step ticks in the chat column animate in (opacity + translate-y, 60ms stagger).
- Progress hairline under header animates while Avara is "thinking".
- Ghost cursor uses ease-in-out 350ms transitions between target rects.

### Chat column

- Compact bubbles, text only. User bubble right-aligned, Avara left-aligned with a tiny coral dot for presence.
- Between Avara's reply chunks: an inline **step list** (not a preview): "1. Reading Camille's last reply · 2. Pulling tone from past messages · 3. Drafting follow-up". Each item gets a check as that step "completes" on the canvas.
- Prompt chips on empty state: "Draft a follow-up to Camille Roux", "Find leads going cold in London", "Open Henrik Lindqvist", "Summarize today".
- Composer is pinned at the bottom of the column with the coral focus ring.

### Scripted intents (mock state machine)

Each recognized intent runs a sequence: chat reply chunks + step list + canvas stage transitions, on scripted timers. Recognized substrings:

- "draft" / "follow up" → stage = Drafting, target = first matched lead (or Camille by default)
- "cold" / "at risk" / "going cold" → stage = Triaging inbox, filtered to cooling/cold
- "open" / "show" + lead name → stage = Opening a lead
- "summary" / "today" / "brief" → stage = Briefing
- fallback → chat-only reply, canvas shows idle "Avara is ready" state with a soft animated orb-free presence (just a hairline pulse).

### Idle canvas

When no task is running, the canvas shows: "Avara is ready" centered, a thin animated progress underline, and four large prompt suggestion tiles (same as chat chips but bigger). Picking one fires the intent.

## Shared work in this pass

- `src/components/avara/inbox/MapPanel.tsx` — stylized SVG world map with Europe + ME, pin rendering, hover/select behavior.
- `src/components/avara/inbox/Queue.tsx` — grouped, typographic queue with inline expand.
- `src/components/avara/inbox/FilterStrip.tsx` — filter pills, single source of truth for derived list.
- `src/components/avara/ScoreRing.tsx` — reused in Work Mode "Opening a lead" stage and Lead Detail.
- `src/components/avara/work/Canvas.tsx` — frame, breadcrumb, ghost cursor, action bar, stage swap transitions.
- `src/components/avara/work/stages/Drafting.tsx`, `TriagingInbox.tsx`, `OpeningLead.tsx`, `Briefing.tsx`, `Idle.tsx`.
- `src/components/avara/work/ChatColumn.tsx` + `Composer.tsx` + `StepList.tsx`.
- `src/lib/mock/workmodeIntents.ts` — intent matcher returning `{ chatChunks[], steps[], stage, target }`.
- Extend `leads` with `coords: { lat, lng }` for the map (mock values, mapped to SVG coordinates).

## Bugs to fix while here

- Verify `__root.tsx` still renders `<Outlet />`.
- Confirm all new route files have unique `head()` metadata (title, description).
- Audit `src/styles.css` for any missing tokens used by the new components (add `--mint`, `--amber` if needed for risk pin colors).

## Routes touched

- `src/routes/inbox.tsx` — replace stub with Map + Queue
- `src/routes/work.tsx` — replace stub with Takeover Canvas
- No changes to `/`, `/leads/$leadId`, `/import`

## Out of scope

Real AI, real maps (Mapbox/Leaflet), persistence, backend, auth. Import page stays as a stub.
