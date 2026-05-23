import { List, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type InboxView = "list" | "map";

export function ViewToggle({ value, onChange }: { value: InboxView; onChange: (v: InboxView) => void }) {
  const Btn = ({ v, label, Icon }: { v: InboxView; label: string; Icon: any }) => {
    const sel = value === v;
    return (
      <button
        onClick={() => onChange(v)}
        className={cn(
          "h-7 px-2.5 rounded-md text-[12px] inline-flex items-center gap-1.5 transition",
          sel ? "bg-[var(--surface-1)] text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </button>
    );
  };
  return (
    <div className="inline-flex rounded-lg border hairline bg-[var(--surface-2)]/50 p-0.5">
      <Btn v="list" label="List" Icon={List} />
      <Btn v="map" label="Location" Icon={MapIcon} />
    </div>
  );
}
