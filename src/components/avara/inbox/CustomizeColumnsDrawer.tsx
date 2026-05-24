import * as React from "react";
import { cn } from "@/lib/utils";
import {
  COLUMNS,
  COLUMN_MAP,
  type ColumnId,
  type TrackerView,
  CUSTOM_FIELD_DEFS,
  type CustomFieldId,
  loadInterpretations,
  saveInterpretations,
  type FieldInterpretation,
} from "@/lib/mock/trackerColumns";
import { X, GripVertical, Eye, EyeOff, Plus, Sparkles, Check, Pencil, Ban, BookmarkPlus, Info } from "lucide-react";

type Tab = "columns" | "understanding";

export function CustomizeColumnsDrawer({
  open,
  onClose,
  view,
  onChange,
  onSaveAs,
}: {
  open: boolean;
  onClose: () => void;
  view: TrackerView;
  onChange: (v: TrackerView) => void;
  onSaveAs: () => void;
}) {
  const [tab, setTab] = React.useState<Tab>("columns");
  const [interp, setInterp] = React.useState<Record<CustomFieldId, FieldInterpretation>>(() => loadInterpretations());
  const [editingId, setEditingId] = React.useState<CustomFieldId | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const [newFieldName, setNewFieldName] = React.useState("");
  const [extraFields, setExtraFields] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (open) setInterp(loadInterpretations());
  }, [open]);

  if (!open) return null;

  const visibleSet = new Set(view.visible);

  const toggleVisible = (id: ColumnId) => {
    const next = visibleSet.has(id)
      ? view.visible.filter((x) => x !== id)
      : [...view.visible, id];
    onChange({ ...view, visible: next });
  };

  // Native HTML5 reorder
  const dragId = React.useRef<ColumnId | null>(null);
  const onDragStart = (id: ColumnId) => (e: React.DragEvent) => {
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (overId: ColumnId) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragId.current;
    if (!from || from === overId) return;
    const order = [...view.order];
    const fromIdx = order.indexOf(from);
    const toIdx = order.indexOf(overId);
    if (fromIdx < 0 || toIdx < 0) return;
    order.splice(fromIdx, 1);
    order.splice(toIdx, 0, from);
    onChange({ ...view, order });
    dragId.current = null;
  };

  const updateInterp = (id: CustomFieldId, patch: Partial<FieldInterpretation>) => {
    const next = { ...interp, [id]: { ...interp[id], ...patch } };
    setInterp(next);
    saveInterpretations(next);
  };

  const addCustomField = () => {
    const name = newFieldName.trim();
    if (!name) return;
    setExtraFields((s) => [...s, name]);
    setNewFieldName("");
  };

  const ordered = view.order.map((id) => COLUMN_MAP[id]).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-[460px] bg-[var(--background)] border-l hairline shadow-panel flex flex-col animate-fade-in">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b hairline">
          <div className="flex items-center gap-2">
            <div className="min-w-0">
              <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Tracker
              </div>
              <h2 className="text-[15px] font-semibold tracking-tight">Customize columns</h2>
            </div>
            <button
              onClick={onClose}
              className="ml-auto h-8 w-8 grid place-items-center rounded-md border hairline text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 inline-flex rounded-lg border hairline bg-[var(--surface-2)]/50 p-0.5">
            <TabBtn active={tab === "columns"} onClick={() => setTab("columns")}>Columns</TabBtn>
            <TabBtn active={tab === "understanding"} onClick={() => setTab("understanding")}>
              <Sparkles className="h-3 w-3" /> Avara field understanding
            </TabBtn>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === "columns" ? (
            <>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
                Drag to reorder. Toggle visibility. Imported and manual custom fields appear at the bottom.
              </p>

              <ul className="rounded-lg border hairline bg-[var(--surface-1)] divide-y hairline">
                {ordered.map((c) => {
                  const visible = visibleSet.has(c.id);
                  return (
                    <li
                      key={c.id}
                      draggable
                      onDragStart={onDragStart(c.id)}
                      onDragOver={onDragOver}
                      onDrop={onDrop(c.id)}
                      className="flex items-center gap-2 px-3 py-2 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-[13px] truncate flex-1">{c.label}</span>
                      {c.group === "custom" && (
                        <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground border hairline rounded px-1.5 py-0.5">
                          Custom
                        </span>
                      )}
                      <button
                        onClick={() => toggleVisible(c.id)}
                        className={cn(
                          "h-7 w-7 grid place-items-center rounded-md border hairline transition",
                          visible
                            ? "bg-foreground text-background border-transparent"
                            : "bg-[var(--surface-1)] text-muted-foreground hover:text-foreground",
                        )}
                        aria-label={visible ? "Hide column" : "Show column"}
                      >
                        {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </button>
                    </li>
                  );
                })}
                {extraFields.map((name) => (
                  <li key={name} className="flex items-center gap-2 px-3 py-2 text-muted-foreground">
                    <GripVertical className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-[13px] truncate flex-1">{name}</span>
                    <span className="text-[10px] uppercase tracking-[0.12em] border hairline rounded px-1.5 py-0.5">
                      Pending sync
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-lg border hairline bg-[var(--surface-1)] p-3">
                <div className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
                  Create custom field
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="e.g. Architect contact"
                    className="flex-1 h-8 rounded-md border hairline bg-[var(--background)] px-2.5 text-[12.5px] outline-none focus:border-foreground/30"
                  />
                  <button
                    onClick={addCustomField}
                    className="h-8 px-3 rounded-md bg-foreground text-background text-[12px] inline-flex items-center gap-1 hover:opacity-90"
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
                <p className="mt-2 text-[11.5px] text-muted-foreground leading-relaxed">
                  Avara will suggest a meaning for new fields in the Field understanding tab. Nothing changes
                  in your scoring until you approve it.
                </p>
              </div>
            </>
          ) : (
            <FieldUnderstanding
              interp={interp}
              onUpdate={updateInterp}
              editingId={editingId}
              setEditingId={setEditingId}
              editValue={editValue}
              setEditValue={setEditValue}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t hairline px-5 py-3 flex items-center gap-2 bg-[var(--surface-1)]/60">
          <button
            onClick={onSaveAs}
            className="flex-1 h-9 rounded-md border hairline bg-[var(--surface-1)] text-[12.5px] inline-flex items-center justify-center gap-1.5 hover:bg-[var(--surface-2)]"
          >
            <BookmarkPlus className="h-3.5 w-3.5" /> Save as studio view
          </button>
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-md bg-foreground text-background text-[12.5px] hover:opacity-90"
          >
            Done
          </button>
        </div>
      </aside>
    </div>
  );

  function FieldUnderstanding({
    interp,
    onUpdate,
    editingId,
    setEditingId,
    editValue,
    setEditValue,
  }: {
    interp: Record<CustomFieldId, FieldInterpretation>;
    onUpdate: (id: CustomFieldId, patch: Partial<FieldInterpretation>) => void;
    editingId: CustomFieldId | null;
    setEditingId: (id: CustomFieldId | null) => void;
    editValue: string;
    setEditValue: (v: string) => void;
  }) {
    return (
      <div>
        <div className="flex items-start gap-2 rounded-lg border hairline bg-[var(--surface-1)] p-3 mb-4">
          <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Avara will not change scoring, prioritization, or recommendations based on a custom field
            until you approve its interpretation.
          </p>
        </div>

        <ul className="space-y-2">
          {CUSTOM_FIELD_DEFS.map((f) => {
            const i = interp[f.id];
            const editing = editingId === f.id;
            const stateLabel = {
              pending: "Pending owner review",
              approved: "Approved",
              ignored: "Ignored",
              edited: "Edited by owner",
            }[i.state];
            const stateClass = {
              pending: "text-muted-foreground border-hairline bg-[var(--surface-2)]/40",
              approved: "text-[var(--success)] border-[var(--success)]/30 bg-[var(--success)]/10",
              ignored: "text-muted-foreground border-hairline bg-[var(--surface-2)]/40",
              edited: "text-purple border-purple/30 bg-purple-soft",
            }[i.state];

            return (
              <li key={f.id} className="rounded-lg border hairline bg-[var(--surface-1)] p-3">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-medium">{f.label}</span>
                      <span className={cn("text-[10px] uppercase tracking-[0.12em] border rounded px-1.5 py-0.5", stateClass)}>
                        {stateLabel}
                      </span>
                    </div>
                    {!editing ? (
                      <div className="mt-1 text-[12px] text-muted-foreground">
                        <span className="text-foreground/85">{f.label}</span>
                        <span className="mx-1.5 text-muted-foreground">→</span>
                        <span className="text-foreground/85">{i.meaning}</span>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 h-8 rounded-md border hairline bg-[var(--background)] px-2.5 text-[12.5px] outline-none focus:border-foreground/30"
                          placeholder="What does this field mean?"
                        />
                        <button
                          onClick={() => {
                            onUpdate(f.id, { state: "edited", meaning: editValue || i.meaning });
                            setEditingId(null);
                          }}
                          className="h-8 px-2.5 rounded-md bg-foreground text-background text-[11.5px]"
                        >
                          Save
                        </button>
                      </div>
                    )}
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Example values: {f.example}
                    </div>
                  </div>
                </div>

                {!editing && (
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <Action
                      Icon={Check}
                      label="Approve"
                      active={i.state === "approved"}
                      onClick={() => onUpdate(f.id, { state: "approved" })}
                    />
                    <Action
                      Icon={Pencil}
                      label="Edit"
                      onClick={() => {
                        setEditingId(f.id);
                        setEditValue(i.meaning);
                      }}
                    />
                    <Action
                      Icon={Ban}
                      label="Ignore"
                      active={i.state === "ignored"}
                      onClick={() => onUpdate(f.id, { state: "ignored" })}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-7 px-2.5 rounded-md text-[12px] inline-flex items-center gap-1.5 transition",
        active ? "bg-[var(--surface-1)] text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Action({
  Icon, label, onClick, active,
}: { Icon: any; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-7 px-2.5 rounded-md text-[11.5px] inline-flex items-center gap-1.5 border transition",
        active
          ? "bg-foreground text-background border-transparent"
          : "bg-[var(--surface-1)] text-muted-foreground border-[var(--hairline)] hover:text-foreground",
      )}
    >
      <Icon className="h-3 w-3" /> {label}
    </button>
  );
}
