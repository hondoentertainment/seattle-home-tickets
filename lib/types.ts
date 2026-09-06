export type Gender = "men" | "women" | "open";

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
  gender: Gender;
  specialTags: string[];
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

export type VenueProfile = {
  name: string;
  address: string;
  neighborhood: string;
  indoor: boolean;
  transit: string;
  parking: string;
  rideshare: string;
  traffic: string;
  officialTickets: string;
};

export type TicketLink = {
  label: string;
  href: string;
  kind: "official" | "marketplace";
  qtyApplied?: boolean;
};

export type WeatherBlurb = {
  kind: "forecast" | "climatology";
  label: string;
  detail: string;
};
