export type Game = {
  id: string;
  date: string;
  day: string;
  team: string;
  sport: string;
  opponent: string;
  venue: string;
  timePt: string;
  tv: string;
  estPriceEachUsd: number;
  estPricePairUsd: number;
  priceNotes: string;
  source: string;
  season: string;
};

export type GamesCatalog = {
  asOf: string;
  timezone: string;
  scope: string;
  priceDisclaimer: string;
  sources: string[];
  omissions: string[];
  games: Game[];
};
