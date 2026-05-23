import type { Lead } from "@/lib/mock/data";
import { RequestCard } from "./RequestCard";

export function RequestGroup({
  label, hint, leads, selectedId, onSelect,
}: {
  label: string;
  hint: string;
  leads: Lead[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (leads.length === 0) return null;
  return (
    <section className="mb-8">
      <div className="flex items-baseline gap-3 mb-3 px-1">
        <h2 className="text-[13px] font-semibold tracking-tight">{label}</h2>
        <span className="text-[11.5px] text-muted-foreground tabular-nums">{leads.length}</span>
        <span className="text-[11.5px] text-muted-foreground hidden md:inline truncate">· {hint}</span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {leads.map((l) => (
          <RequestCard
            key={l.id}
            lead={l}
            selected={l.id === selectedId}
            onSelect={() => onSelect(l.id)}
          />
        ))}
      </div>
    </section>
  );
}
