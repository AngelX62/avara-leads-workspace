export function SummaryStrip({
  total, needsReply, missingInfo, atRiskValue,
}: { total: number; needsReply: number; missingInfo: number; atRiskValue: string }) {
  const Item = ({ label, value, tone }: { label: string; value: string | number; tone?: "warn" | "coral" }) => (
    <div className="flex items-baseline gap-2">
      <span
        className={
          "text-[15px] font-medium tabular-nums " +
          (tone === "warn" ? "text-[var(--warning)]" : tone === "coral" ? "text-coral" : "text-foreground")
        }
      >
        {value}
      </span>
      <span className="text-[11.5px] text-muted-foreground">{label}</span>
    </div>
  );
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3 border-b hairline bg-[var(--background)]/60">
      <Item label="open requests" value={total} />
      <span className="h-3 w-px bg-[var(--hairline)] hidden sm:block" />
      <Item label="need a reply today" value={needsReply} tone="warn" />
      <span className="h-3 w-px bg-[var(--hairline)] hidden sm:block" />
      <Item label="missing key details" value={missingInfo} />
      <span className="h-3 w-px bg-[var(--hairline)] hidden sm:block" />
      <Item label="estimated value at risk" value={atRiskValue} tone="coral" />
    </div>
  );
}
