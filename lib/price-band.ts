import { formatUsd } from "@/lib/format";
import { estimateForQty } from "@/lib/quantity";

export type PriceBandId = "value" | "mid" | "premium";

export const PRICE_BAND_LABELS: Record<PriceBandId, string> = {
  value: "Under $40 each",
  mid: "$40–80 each",
  premium: "$80+ each",
};

export function priceBandId(eachUsd: number): PriceBandId {
  if (eachUsd < 40) return "value";
  if (eachUsd < 80) return "mid";
  return "premium";
}

/** Unofficial mid-tier spread around the seed estimate — not live listings. */
export function estimateSpread(eachUsd: number): { low: number; high: number } {
  const low = Math.max(8, Math.round(eachUsd * 0.75));
  const high = Math.round(eachUsd * 1.35);
  return { low, high };
}

export function estimateSpreadLabel(eachUsd: number, qty: number): string {
  const { low, high } = estimateSpread(eachUsd);
  return `${formatUsd(estimateForQty(low, qty))}–${formatUsd(estimateForQty(high, qty))}`;
}
