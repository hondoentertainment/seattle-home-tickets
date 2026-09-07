export const MIN_QTY = 1;
export const MAX_QTY = 19;
export const DEFAULT_QTY = 2;

export function clampQty(value: unknown): number {
  const n = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n)) return DEFAULT_QTY;
  return Math.min(MAX_QTY, Math.max(MIN_QTY, Math.round(n)));
}

export function estimateForQty(eachUsd: number, qty: number): number {
  return eachUsd * clampQty(qty);
}

export function qtyNoun(qty: number): string {
  return clampQty(qty) === 1 ? "ticket" : "tickets";
}

export function qtyEstimateLabel(qty: number): string {
  const n = clampQty(qty);
  return `for ${n} ${qtyNoun(n)}`;
}

export const QTY_OPTIONS = Array.from({ length: MAX_QTY - MIN_QTY + 1 }, (_, i) => i + MIN_QTY);
