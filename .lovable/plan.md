# Avara by Avitus Leads — High-fidelity UI Prototype

A visual-only prototype of Avara, the owner-facing lead intelligence and opportunity recovery workspace. No backend, no auth — realistic mock data only. Dark graphite default with a light porcelain option, restrained coral + purple accents, soft glass panels, and expressive instrument-style charts.

## Scope and priority

Build in two phases. Phase 1 ships a finished Today page; other pages exist only as navigable stubs. Phase 2 fills them in.

**Phase 1 (this pass): Today / Avara Briefing — finished.**
- Full shell (nav rail, top bar, theme toggle, studio switcher) so Today sits in real context.
- Every Today section polished: decision summary, revenue risk instrument, recovery priorities, prepared actions, priority leads, Avara insight, compact instruments row.
- Realistic mock data, working hover/active states, approve/skip interactions on prepared actions (local state only), responsive down to ~1024px.
- Other routes (`/inbox`, `/leads/$leadId`, `/import`, `/work`) exist as minimal placeholder pages with the shared shell and a "Coming next" panel — just enough so nav links work and the Today page never dead-ends.

**Phase 2 (later passes):** Lead Inbox → Lead Detail → Import → Avara Work Mode, in that order.

## Routes

- `/` Today / Avara Briefing (primary focus)
- `/inbox` Lead Inbox (visual triage)
- `/leads/$leadId` Lead Detail (single-lead workspace)
- `/import` CSV cleanup workflow
- `/work` Avara Work Mode (text-led AI surface)

## Shared shell

- Slim left rail: Avara wordmark, nav (Today, Inbox, Leads, Import, Work), profile chip at bottom.
- Top bar per page: page title, contextual filters, search, theme toggle (dark/light), studio switcher.
- Global tokens in `src/styles.css` (oklch): graphite/obsidian surfaces, porcelain light surfaces, coral accent (human urgency), purple accent (intelligence), glass panel utility, soft elevation shadows, gradient utilities.
- Reusable primitives: `GlassPanel`, `StatPill`, `RiskBar`, `PriorityDot`, `SourceBadge`, `MissingFieldChip`, `InstrumentChart`, `SectionHeader`, `EmptyState`.

## Page 1 — Today / Avara Briefing

Layout (12-col, asymmetric — not a wall of equal cards):

```text
+--------------------------------------------------+
| Today's review — greeting + date + studio        |
| Decision summary (1 wide hero panel, text-led)   |
+----------------------+---------------------------+
| Revenue risk         | Recovery priorities (list)|
| (instrument chart +  | 3-5 leads going cold,     |
| at-risk € total)     | with reason + CTA         |
+----------------------+---------------------------+
| Prepared actions (carousel of approval cards)    |
+----------------------+---------------------------+
| Priority leads       | Avara insight (text panel)|
| (compact rich rows)  | narrative observations    |
+----------------------+---------------------------+
| Compact instruments row: response time, source mix, qualification rate |
+--------------------------------------------------+
```

Key behaviors:
- Decision summary is a short prose block ("3 leads need review before they go cold. €84k in revenue at risk this week.") with inline action chips.
- Revenue risk chart: area/line instrument showing projected vs at-risk pipeline, coral fill for risk band.
- Prepared actions: each card shows lead, drafted message preview, why, Approve / Edit / Skip.
- Priority leads: dense rows with source, score, missing-info chips, "Review" button → Lead Detail.
- Avara insight: text-only panel, restrained purple accent, bullet observations.

## Page 2 — Lead Inbox

Visual triage, not a flat table.

- Sticky filter bar: source, classification (Interior / Architecture / Real Estate), recovery risk (Hot / Cooling / Cold), missing info toggle, search.
- Left: stacked group headers (Needs review today, Cooling, New this week, Recovered). Each group is a list of rich lead rows, not table rows: avatar/initials block, name + project type, source badge, score bar, missing-info chips, next action label, open button.
- Right rail: selected-lead mini preview (summary + jump to detail).

## Page 3 — Lead Detail

Single-lead workspace, two-column with right rail.

- Header: name, project, source, score ring, recovery-risk pill, status, primary action ("Send prepared follow-up").
- Left column: Raw inquiry (verbatim message), Extracted fields grid, Score breakdown (criteria with weight bars), Missing information (chips with "Ask" buttons), Opportunity recovery reason ("Review before this lead goes cold — last reply 6 days ago").
- Right rail: Prepared follow-up (editable draft, tone selector, Approve/Send), Next best question, Notes & reminders timeline.

## Page 4 — Import

Stepper: Upload → Preview → Map → Review → Done.

- Upload: dropzone with sample-file link.
- Preview table: first 20 rows, detected delimiter and encoding.
- Mapping: source columns ↔ Avara fields with confidence pills, unmapped highlighted.
- Review: rows needing attention grouped by reason (duplicate, missing email/phone, low-quality, conflicting), inline fix.
- Done summary: imported / skipped / flagged counts + jump to Inbox.

## Page 5 — Avara Work Mode

Text-led AI work surface. No mascot, no orb.

- Top: large command input ("Ask Avara to prepare something…") with example chips.
- Center: task timeline — each task is a collapsible row with status (Thinking, Drafting, Ready), step list, evidence references.
- Right drawer: prepared output preview (draft email, lead summary, etc.) with Approve / Edit / Discard.
- Avara presence = wordmark + status copy + progress bar only.

## Mock data

`src/lib/mock/` — leads (~30 across interior design, architecture, real estate), sources (Instagram, WhatsApp, Referral, Website, Email, Spreadsheet), prepared actions, insights, import sample rows, work-mode tasks. Realistic names, project types ("Kitchen remodel — Notting Hill", "3-bed new build — Porto", "Off-plan 2-bed — Dubai Marina"), euro/GBP/AED values.

## Technical notes

- TanStack Start route files: `src/routes/index.tsx`, `inbox.tsx`, `leads.$leadId.tsx`, `import.tsx`, `work.tsx`, plus a layout `_app.tsx` with the shell (or wrap in `__root.tsx` — keep `<Outlet />`).
- Theme toggle via `class="dark"` on `<html>`, persisted to `localStorage`. Default dark.
- Charts via Recharts using shadcn `ChartContainer`; styled as instruments (thin strokes, gradient fills, minimal axes).
- All colors via semantic tokens defined in `src/styles.css` (oklch). Add: `--accent-coral`, `--accent-purple`, `--surface-glass`, `--surface-raised`, `--gradient-risk`, `--gradient-intel`, `--shadow-panel`.
- Components in `src/components/avara/` (shell, panels, charts, lead row, prepared action card, etc.).
- No Supabase, no server functions, no auth.

## Out of scope

Real backend, persistence, auth, email sending, file parsing, mobile-first redesign (desktop-first, responsive down to tablet).
