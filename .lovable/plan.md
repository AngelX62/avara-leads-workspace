## Inquiries workspace rework

Rename **Inbox → Inquiries** and turn the page into a three-view workspace: **Review**, **Tracker**, **Areas**. Keep the calm lo-fi premium style (hairline borders, restrained type, soft surfaces, no glow/AI decoration).

### 1. Navigation rename

- `src/components/avara/Shell.tsx`: nav item `Inbox` → `Inquiries` (route stays `/inbox` to avoid a routing churn; only the label changes).
- Page header: subtitle `INQUIRIES`, title `Project requests` (already close — just align).

### 2. View switcher

Replace the existing `ViewToggle` (List/Location) with a 3-way switcher: **Review · Tracker · Areas**. Compact segmented control, sits where the toggle is today. Default = Review. State lifted in `src/routes/inbox.tsx`.

### 3. Review view (existing, light polish)

- Reuse current SummaryStrip + FilterPills + RequestGroup + PreviewPanel layout.
- Relabel any "List" copy → "Review". No structural change.

### 4. Tracker view (new)

A premium owner-grade lead table — not a spreadsheet clone.

Layout:
- Toolbar row: search, status filter, "Customize columns" button, "Saved views" dropdown (Default, + saved per studio).
- Table: hairline rows, generous row height, sticky first column (Client), sticky header, subtle zebra via `--surface-1/2`. Cells use real typography (name in medium weight, secondary meta in muted) — not raw grid lines.
- Inline affordances: status as a soft pill, missing-info as small chips, value right-aligned with currency, follow-up due rendered with relative time + risk dot.
- Row click → opens the same PreviewPanel drawer used in Review (consistency).

Default columns: client, inquiry/project, type, location, source, status, value, timeline, missing info, last contact, next action, follow-up due.

Configurable behavior (client-side state, persisted to `localStorage` under `avara.tracker.view`):
- show/hide
- reorder (drag handle in the drawer)
- preserve & display custom fields imported via Import or added manually
- saved views per studio (named layouts)

New files:
- `src/components/avara/inbox/Tracker.tsx` — table shell
- `src/components/avara/inbox/TrackerRow.tsx` — row renderer with typed cell formatters
- `src/components/avara/inbox/CustomizeColumnsDrawer.tsx` — column visibility + order + create custom field + save view
- `src/components/avara/inbox/AvaraFieldUnderstanding.tsx` — secondary panel inside the drawer
- `src/lib/mock/trackerColumns.ts` — column definitions, default order, custom-field type, view persistence

Custom field interpretation panel (inside Customize Columns drawer, secondary tab "Avara field understanding"):
- List each custom field with a *suggested meaning* chip (e.g. "Mortgage status → financing readiness").
- Per-row controls: **Approve / Edit / Ignore**.
- Status badge: `Pending owner review` until approved.
- Copy near header: "Avara will not change scoring or recommendations until you approve an interpretation."

Suggested-meaning data is mocked in `src/lib/mock/fieldSuggestions.ts` with a small dictionary keyed by common field labels.

### 5. Areas view (replaces Location)

Grounded 3-column layout, no glowing blob map.

Layout:
```text
┌──────────────┬────────────────────────┬──────────────────┐
│ Ranked areas │  Area board (center)   │ Selected detail  │
│  list        │  Calm location grid    │  (right rail)    │
└──────────────┴────────────────────────┴──────────────────┘
```

- **Left — Ranked areas list**: each row = city/area with count, total value, "needs reply" count, "missing budget" count. Sort by value-at-risk by default; sort toggles (Value / Needs reply / Fresh).
- **Center — Area board**: a calm grid of area cards (not a map). Each card shows: area name, region tag, inquiry count, value, status dots, an "Avara note" line ("Notting Hill and Mayfair are high-value but both need reply today"). Card uses hairline border + subtle hover. A small "Outside preferred service area" tag when applicable.
- **Right — Selected area detail**: list of inquiries in that area (reuses RequestCard in a denser variant), plus area summary stats and a "This week" recommendation block.

New files:
- `src/components/avara/inbox/AreasView.tsx`
- `src/components/avara/inbox/AreaCard.tsx`
- `src/components/avara/inbox/AreaDetail.tsx`
- `src/lib/mock/areas.ts` — aggregation helpers (group leads by `location`, compute value-at-risk, needs-reply, missing-budget, Avara note)

Old `MapPanel` is retired from the Inquiries page (file kept for now, just unused).

### 6. Route wiring

`src/routes/inbox.tsx`:
- `view` state: `"review" | "tracker" | "areas"`
- Renders SummaryStrip + view switcher always
- FilterPills shown for Review + Tracker
- Swaps body per view; PreviewPanel drawer shared across Review and Tracker

### Technical notes

- All persistence is `localStorage` (no schema work). Keys: `avara.tracker.view`, `avara.tracker.savedViews`, `avara.fields.interpretations`.
- No new deps. Drag-reorder uses native HTML5 drag handlers on the column list (lightweight, no dnd-kit).
- Tokens only — no raw hex. Pills/dots reuse existing risk/source helpers.
- Tracker is virtualization-free for now (mock dataset is small); built so a future swap to `@tanstack/react-virtual` is trivial.

### Out of scope

- Real backend / Lovable Cloud integration for saved views or custom fields (mock + localStorage).
- Real maps. Areas view is intentionally non-cartographic.
- Renaming the `/inbox` route path (label-only rename to avoid breaking links).
