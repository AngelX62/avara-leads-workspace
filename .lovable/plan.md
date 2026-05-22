# Avara — Phase 2: Lead Inbox + Avara Work Mode

Building on the finished Today page, this pass adds two new full pages: the visual Lead Inbox and the conversational Avara Work Mode. Both use the existing shell, tokens, and mock data. Visual prototype only — no backend.

## Lead Inbox (`/inbox`)

Not a flat table. A visual triage surface that feels like sorting a stack of cards.

### Layout

```text
+----------- sticky filter bar -------------+ select rail +
| search · source · class · risk · missing  |             |
+-------------------------------------------+             |
| Needs review today  (3)                   |  Selected   |
|  [rich lead row]                          |  preview    |
|  [rich lead row]                          |  panel:     |
|  [rich lead row]                          |  summary,   |
| Cooling  (4)                              |  inquiry    |
|  [rich lead row] ...                      |  excerpt,   |
| New this week  (3)                        |  missing,   |
|  [rich lead row] ...                      |  jump to    |
| Recovered  (2)                            |  detail     |
|  [rich lead row] ...                      |             |
+-------------------------------------------+-------------+
```

### Rich lead row (not a table cell)

Each row is a horizontal mini-card with: avatar/initials block tinted by classification, name + project + location, source badge, score bar with numeric value, missing-info chips, recovery-risk pill, value pill, "Review" button. Hovered = subtle lift + hairline glow. Selected = coral hairline + raised surface.

### Filter bar

Sticky just under the top bar. Pill toggles for source, classification (Interior / Architecture / Real Estate), recovery risk (Hot / Cooling / Cold / Recovered), and a "Missing info only" switch. Search filters by name/project. All wired to local React state filtering the existing `leads` array.

### Right rail (selected lead)

When a row is clicked it stays selected and the right rail shows: name, project, source, score ring, risk pill, inquiry excerpt (2 lines), missing-info chips with "Ask" buttons (visual only), next action, and a "Open lead detail" link that routes to `/leads/$leadId`.

### Empty state

If filters exclude everything, show a calm empty panel with the active filters as removable chips.

### Interactions (local state only)

- Click row → selects it, fills right rail
- Approve action chip on right rail → row gets a green hairline + "Prepared" badge
- Toggle "Missing info only" → list animates filter

## Avara Work Mode (`/work`)

A text-led command surface where the owner asks Avara to do something. Avara replies in chat, and when it performs an action it pulls up an **action preview** — a small inline panel that shows what's happening in the rest of the app (e.g. opening a lead, drafting a reply, filtering inbox).

### Layout

```text
+---------------------------------------------------+
| Header: Avara · status copy · thin progress line  |
+--------------------------+------------------------+
| Conversation transcript  | Context rail           |
| - prompt chips on empty  | - active studio        |
| - user bubble            | - leads in scope       |
| - Avara response (md)    | - recent prepared work |
| - inline ActionPreview   | - tips                 |
| - typing/working state   |                        |
+--------------------------+------------------------+
| Composer: large input · example chips · send      |
+---------------------------------------------------+
```

### Conversation behavior (mocked)

State machine drives a scripted reply per known intent. Recognized intents (substring match on prompt):

- "follow up" / "draft" → ActionPreview: drafted-message card with lead avatar + draft text
- "cold" / "at risk" → ActionPreview: filtered Inbox snippet (3 cooling/cold rows)
- "show" / "open" + lead name → ActionPreview: Lead Detail mini-card (header + score + missing)
- "summary" / "today" → ActionPreview: Today briefing snippet (revenue at risk + 3 priorities)
- fallback → text-only Avara reply

### ActionPreview component

Inline rounded panel inside the chat. Header has a small "Avara is opening …" label, a target chip (e.g. "Lead inbox › Cooling"), and an action row ("Open in app" → routes to that page, "Dismiss"). Body renders a compact, real-looking slice of the destination view using shared primitives — not a screenshot, the actual components rendered small.

### Transitions

- New message: framer-motion-style enter via Tailwind + `transition-all` (opacity + translate-y), staggered 60ms.
- ActionPreview: scales in from 0.96 with hairline shimmer, then content fades in.
- Working state: thin progress line under header animates indefinitely while "thinking" (800–1400ms scripted delay before reply).
- Composer focus ring uses the coral accent.

### Prompt chips (empty state)

- "Draft a follow-up to Camille Roux"
- "Show me leads going cold"
- "Open Henrik Lindqvist"
- "Summarize today"

### Context rail

Static-feeling helper: studio chip, leads-in-scope count, "Last prepared" list (links to existing leads), and a small "What Avara can do" list. Restrained purple accent for the Avara presence.

## Shared work in this pass

- Add `src/components/avara/LeadRow.tsx` and `src/components/avara/ScoreRing.tsx` (used by Inbox + ActionPreview).
- Add `src/components/avara/work/ActionPreview.tsx` with variants: `draft`, `inbox`, `leadCard`, `briefing`.
- Add `src/components/avara/work/MessageBubble.tsx` and `Composer.tsx`.
- Extend mock data with a small `workmodeIntents.ts` mapping prompt → scripted reply + preview config.
- Fix any bugs surfaced while wiring (e.g. confirm `Outlet` integrity, ensure no missing imports, head metadata per route).

## Routes touched

- `src/routes/inbox.tsx` — replace stub with full Inbox page
- `src/routes/work.tsx` — replace stub with full Work Mode
- No changes to `/`, `/leads/$leadId`, `/import` beyond minor shared-component reuse

## Out of scope

Real AI calls, persistence, backend, auth. All replies are scripted from a mock intent map. Import page stays as a stub for now.
