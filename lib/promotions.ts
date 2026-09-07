import promotionsJson from "@/data/promotions.json";

export type PromoCategory = "giveaway" | "theme" | "kids" | "ticket-offer" | "college-theme";

export type PromoCoverage = {
  team: string;
  status: "published" | "partial" | "unpublished";
  note: string;
};

export type Promotion = {
  id: string;
  date: string;
  team: string;
  opponent: string;
  sport: string;
  venue: string;
  title: string;
  description: string;
  category: PromoCategory;
  quantityNote: string | null;
  gameId: string;
  source: string;
  sourceUrl: string;
  complete: boolean;
};

export type PromotionsCatalog = {
  asOf: string;
  timezone: string;
  disclaimer: string;
  coverage: PromoCoverage[];
  promotions: Promotion[];
};

export const promotionsCatalog = promotionsJson as PromotionsCatalog;

export const promoTeams = [...new Set(promotionsCatalog.coverage.map((row) => row.team))];

export function promoHref(promo: Promotion): string {
  const params = new URLSearchParams();
  params.set("teams", promo.team);
  params.set("from", promo.date);
  params.set("to", promo.date);
  return `/?${params.toString()}`;
}

export const CATEGORY_LABELS: Record<PromoCategory, string> = {
  giveaway: "Giveaway",
  theme: "Theme night",
  kids: "Kids / family",
  "ticket-offer": "Ticket offer",
  "college-theme": "College theme",
};
