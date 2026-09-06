import type { Game, TicketLink, VenueProfile } from "@/lib/types";

const TEAM_TICKET_HUBS: Record<string, string> = {
  "Seattle Mariners": "https://www.mlb.com/mariners/tickets",
  "Seattle Seahawks": "https://www.seahawks.com/tickets/",
  "Seattle Kraken": "https://www.nhl.com/kraken/tickets",
  "Seattle Sounders FC": "https://www.soundersfc.com/tickets",
  "Seattle Reign FC": "https://www.reignfc.com/tickets/single-match-tickets",
  "Seattle Storm": "https://storm.wnba.com/tickets",
  "Washington Huskies": "https://gohuskies.com/tickets",
  "Seattle U Redhawks": "https://goseattleu.com/tickets",
  "Seattle Pacific Falcons":
    "https://spufalcons.com/sports/2026/8/6/spu-athletics-ticket-page.aspx",
};

function searchQuery(game: Game): string {
  const pretty = new Date(`${game.date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${game.team} vs ${game.opponent} ${pretty}`;
}

export function ticketLinks(game: Game, venue?: VenueProfile): TicketLink[] {
  const q = encodeURIComponent(searchQuery(game));
  const official = TEAM_TICKET_HUBS[game.team] ?? venue?.officialTickets;
  const links: TicketLink[] = [];
  if (official) {
    links.push({ label: "Official tickets", href: official, kind: "official" });
  }
  if (venue?.officialTickets && venue.officialTickets !== official) {
    links.push({ label: `${venue.name} box office`, href: venue.officialTickets, kind: "official" });
  }
  links.push(
    { label: "Ticketmaster", href: `https://www.ticketmaster.com/search?q=${q}`, kind: "marketplace" },
    { label: "StubHub", href: `https://www.stubhub.com/secure/search?q=${q}`, kind: "marketplace" },
    { label: "SeatGeek", href: `https://seatgeek.com/search?search=${q}`, kind: "marketplace" },
    { label: "TickPick", href: `https://www.tickpick.com/search?q=${q}`, kind: "marketplace" },
    { label: "Vivid Seats", href: `https://www.vividseats.com/search?searchTerm=${q}`, kind: "marketplace" },
  );
  return links;
}

export function ticketSummaryLine(game: Game): string {
  return ticketLinks(game)
    .slice(0, 3)
    .map((link) => `${link.label}: ${link.href}`)
    .join(" · ");
}
