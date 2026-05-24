import * as React from "react";
import type { Lead } from "@/lib/mock/data";
import { formatMoney } from "@/lib/mock/data";
import { SourceBadge, MissingChip } from "@/components/avara/Bits";
import { cn } from "@/lib/utils";
import {
  COLUMN_MAP,
  type ColumnId,
  type TrackerView,
  loadView,
  saveView,
  loadSavedViews,
  saveSavedViews,
  DEFAULT_VIEW,
  statusForLead,
  timelineForLead,
  followUpDueForLead,
  getCustomValue,
  CUSTOM_FIELD_DEFS,
  type CustomFieldId,
} from "@/lib/mock/trackerColumns";
import { Settings2, ChevronDown, BookmarkPlus, Check } from "lucide-react";
import { CustomizeColumnsDrawer } from "./CustomizeColumnsDrawer";

function StatusPill({ lead }: { lead: Lead }) {
  const s = statusForLead(lead);
  const tone = {
    hot: "bg-coral-soft text-coral",
    warm: "bg-[var(--warning)]/15 text-[var(--warning)]",
    cool: "bg-[var(--surface-2)] text-muted-foreground",
    cold: "bg-[var(--surface-2)] text-muted-foreground",
    won: "bg-[var(--success)]/15 text-[var(--success)]",
  }[s.tone];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium", tone)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

function FollowUp({ lead }: { lead: Lead }) {
  const f = followUpDueForLead(lead);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12px] tabular-nums",
        f.overdue ? "text-coral" : "text-foreground/85",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", f.overdue ? "bg-coral" : "bg-[var(--success)]")} />
      {f.label}
    </span>
  );
}

function renderCell(col: ColumnId, lead: Lead): React.ReactNode {
  switch (col) {
    case "client":
      return (
        <div className="min-w-0">
          <div className="text-[13px] font-medium truncate">{lead.name}</div>
          <div className="text-[11px] text-muted-foreground truncate">{lead.classification}</div>
        </div>
      );
    case "project":
      return <span className="text-[12.5px] truncate block max-w-[260px]">{lead.project}</span>;
    case "type":
      return <span className="text-[12px] text-muted-foreground">{lead.classification}</span>;
    case "location":
      return <span className="text-[12px] text-foreground/85">{lead.location}</span>;
    case "source":
      return <SourceBadge source={lead.source} />;
    case "status":
      return <StatusPill lead={lead} />;
    case "value":
      return <span className="text-[12.5px] font-medium tabular-nums">{formatMoney(lead.value, lead.currency)}</span>;
    case "timeline":
      return <span className="text-[12px] text-foreground/85">{timelineForLead(lead)}</span>;
    case "missing":
      return lead.missing.length === 0 ? (
        <span className="text-[11.5px] text-muted-foreground">—</span>
      ) : (
        <div className="flex flex-wrap gap-1">
          {lead.missing.slice(0, 3).map((m) => <MissingChip key={m} label={m} />)}
        </div>
      );
    case "lastContact":
      return <span className="text-[12px] text-muted-foreground tabular-nums">{lead.lastTouch}</span>;
    case "nextAction":
      return <span className="text-[12px] text-foreground/85 truncate block max-w-[220px]">{lead.nextAction}</span>;
    case "followUpDue":
      return <FollowUp lead={lead} />;
    default: {
      const v = getCustomValue(lead.id, col as CustomFieldId);
      return v ? (
        <span className="text-[12px] text-foreground/85">{v}</span>
      ) : (
        <span className="text-[11.5px] text-muted-foreground">—</span>
      );
    }
  }
}

export function Tracker({
  leads,
  selectedId,
  onSelect,
}: {
  leads: Lead[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [view, setView] = React.useState<TrackerView>(DEFAULT_VIEW);
  const [savedViews, setSavedViews] = React.useState<TrackerView[]>([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [viewsOpen, setViewsOpen] = React.useState(false);

  React.useEffect(() => {
    setView(loadView());
    setSavedViews(loadSavedViews());
  }, []);

  const visibleCols: ColumnId[] = React.useMemo(
    () => view.order.filter((id) => view.visible.includes(id) && COLUMN_MAP[id]),
    [view],
  );

  const updateView = (next: TrackerView) => {
    setView(next);
    saveView(next);
  };

  const handleSaveAs = () => {
    const name = window.prompt("Name this view");
    if (!name) return;
    const next: TrackerView = { id: `v-${Date.now()}`, name, order: view.order, visible: view.visible };
    const list = [...savedViews, next];
    setSavedViews(list);
    saveSavedViews(list);
  };

  const applySaved = (v: TrackerView) => {
    updateView(v);
    setViewsOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        <div className="text-[12px] text-muted-foreground">
          {leads.length} {leads.length === 1 ? "record" : "records"}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setViewsOpen((v) => !v)}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border hairline bg-[var(--surface-1)] text-[12.5px] hover:bg-[var(--surface-2)]"
            >
              {view.name}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {viewsOpen && (
              <div
                className="absolute right-0 top-9 z-30 w-56 rounded-lg border hairline bg-[var(--surface-1)] shadow-panel p-1"
                onMouseLeave={() => setViewsOpen(false)}
              >
                <button
                  onClick={() => applySaved(DEFAULT_VIEW)}
                  className="w-full text-left px-2.5 py-1.5 text-[12.5px] rounded hover:bg-[var(--surface-2)] flex items-center justify-between"
                >
                  Default
                  {view.id === "default" && <Check className="h-3 w-3" />}
                </button>
                {savedViews.length > 0 && <div className="my-1 h-px bg-[var(--hairline)]" />}
                {savedViews.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => applySaved(v)}
                    className="w-full text-left px-2.5 py-1.5 text-[12.5px] rounded hover:bg-[var(--surface-2)] flex items-center justify-between"
                  >
                    <span className="truncate">{v.name}</span>
                    {view.id === v.id && <Check className="h-3 w-3" />}
                  </button>
                ))}
                <div className="my-1 h-px bg-[var(--hairline)]" />
                <button
                  onClick={handleSaveAs}
                  className="w-full text-left px-2.5 py-1.5 text-[12.5px] rounded hover:bg-[var(--surface-2)] flex items-center gap-1.5 text-muted-foreground"
                >
                  <BookmarkPlus className="h-3 w-3" /> Save current layout
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md border hairline bg-[var(--surface-1)] text-[12.5px] hover:bg-[var(--surface-2)]"
          >
            <Settings2 className="h-3.5 w-3.5" /> Customize columns
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border hairline bg-[var(--surface-1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                {visibleCols.map((id, i) => {
                  const c = COLUMN_MAP[id];
                  return (
                    <th
                      key={id}
                      className={cn(
                        "px-3 h-10 text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground font-medium bg-[var(--surface-2)]/40 border-b hairline whitespace-nowrap",
                        c.align === "right" && "text-right",
                        i === 0 && "sticky left-0 z-10 bg-[var(--surface-2)]/80 backdrop-blur",
                      )}
                      style={{ width: c.width, minWidth: c.width }}
                    >
                      {c.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, rowIdx) => {
                const sel = lead.id === selectedId;
                return (
                  <tr
                    key={lead.id}
                    onClick={() => onSelect(lead.id)}
                    className={cn(
                      "cursor-pointer group transition",
                      sel ? "bg-[var(--accent)]/40" : "hover:bg-[var(--surface-2)]/40",
                    )}
                  >
                    {visibleCols.map((id, i) => {
                      const c = COLUMN_MAP[id];
                      return (
                        <td
                          key={id}
                          className={cn(
                            "px-3 py-3 align-middle border-b hairline",
                            c.align === "right" && "text-right",
                            i === 0 && cn(
                              "sticky left-0 z-[1] bg-[var(--surface-1)] group-hover:bg-[var(--surface-2)]/40",
                              sel && "bg-[var(--accent)]/40",
                            ),
                            rowIdx === leads.length - 1 && "border-b-0",
                          )}
                          style={{ width: c.width, minWidth: c.width }}
                        >
                          {renderCell(id, lead)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {leads.length === 0 && (
                <tr>
                  <td
                    colSpan={visibleCols.length}
                    className="px-6 py-12 text-center text-[13px] text-muted-foreground"
                  >
                    No records match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomizeColumnsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        view={view}
        onChange={updateView}
        onSaveAs={handleSaveAs}
      />
    </div>
  );
}

// re-export to satisfy bundler
export { CUSTOM_FIELD_DEFS };
