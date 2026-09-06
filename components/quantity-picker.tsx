import { QTY_OPTIONS, qtyNoun } from "@/lib/quantity";

export function QuantityPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (qty: number) => void;
}) {
  return (
    <label className="flex shrink-0 items-center gap-2 rounded-xl border border-card-border bg-background px-3 py-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">Tickets</span>
      <select
        value={value}
        aria-label="Number of tickets"
        onChange={(event) => onChange(Number(event.target.value))}
        className="bg-transparent text-sm font-semibold text-foreground outline-none"
      >
        {QTY_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n} {qtyNoun(n)}
          </option>
        ))}
      </select>
    </label>
  );
}
