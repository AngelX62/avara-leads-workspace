import { Layers, Table2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export type InquiriesView = "review" | "tracker" | "areas";

const OPTIONS: { v: InquiriesView; label: string; Icon: any; hint: string }[] = [
  { v: "review", label: "Review", Icon: Layers, hint: "Decide what needs attention" },
  { v: "tracker", label: "Tracker", Icon: Table2, hint: "Manage every record" },
  { v: "areas", label: "Areas", Icon: MapPin, hint: "Opportunity by location" },
];

export function ViewSwitcher({
  value,
  onChange,
}: {
  value: InquiriesView;
  onChange: (v: InquiriesView) => void;
}) {
  return (
    <div
      role="tablist"
      className="inline-flex items-center rounded-lg border hairline bg-[var(--surface-2)]/50 p-0.5"
    >
      {OPTIONS.map(({ v, label, Icon }) => {
        const sel = value === v;
        return (
          <button
            key={v}
            role="tab"
            aria-selected={sel}
            onClick={() => onChange(v)}
            className={cn(
              "h-8 px-3 rounded-md text-[12.5px] inline-flex items-center gap-1.5 transition",
              sel
                ? "bg-[var(--surface-1)] text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
