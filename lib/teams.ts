import { catalog } from "@/lib/catalog";

export type TeamMark = {
  team: string;
  sport?: string;
  initials: string;
  short: string;
  bg: string;
  fg: string;
  ring: string;
  gameCount: number;
};

const PRO_MARKS: Omit<TeamMark, "gameCount">[] = [
  { team: "Seattle Mariners", initials: "SEA", short: "Mariners", bg: "#0C2C56", fg: "#C4CED4", ring: "#005C5C" },
  { team: "Seattle Seahawks", initials: "SEA", short: "Seahawks", bg: "#002244", fg: "#69BE28", ring: "#A5ACAF" },
  { team: "Seattle Kraken", initials: "SEA", short: "Kraken", bg: "#001628", fg: "#99D9D9", ring: "#355464" },
  { team: "Seattle Sounders FC", initials: "SFC", short: "Sounders", bg: "#5D9732", fg: "#FFFFFF", ring: "#005596" },
  { team: "Seattle Reign FC", initials: "RFC", short: "Reign", bg: "#002F6C", fg: "#C8102E", ring: "#FFFFFF" },
  { team: "Seattle Storm", initials: "ST", short: "Storm", bg: "#2D5A27", fg: "#FDB927", ring: "#FFFFFF" },
];

const COLLEGE_COLORS: Record<string, Pick<TeamMark, "initials" | "short" | "bg" | "fg" | "ring">> = {
  "Washington Huskies": { initials: "UW", short: "Huskies", bg: "#4B2E83", fg: "#B7A57A", ring: "#FFFFFF" },
  "Seattle U Redhawks": { initials: "SU", short: "Redhawks", bg: "#AA0000", fg: "#FFFFFF", ring: "#000000" },
  "Seattle Pacific Falcons": { initials: "SPU", short: "Falcons", bg: "#4A1C2F", fg: "#C4A35A", ring: "#FFFFFF" },
};

const COLLEGE_SPORT_LABEL: Record<string, string> = {
  "NCAA Football": "Football",
  "NCAA Men's Basketball": "Men's basketball",
  "NCAA Women's Basketball": "Women's basketball",
  "NCAA Volleyball": "Volleyball",
  "NCAA Men's Soccer": "Men's soccer",
  "NCAA Women's Soccer": "Women's soccer",
};

export function sportTileLabel(sport: string): string {
  return COLLEGE_SPORT_LABEL[sport] ?? sport;
}

export function isCollegeTeam(team: string): boolean {
  return team in COLLEGE_COLORS;
}

export function teamKey(card: TeamMark): string {
  return card.sport ? `${card.team}::${card.sport}` : card.team;
}

export function teamCards(): TeamMark[] {
  const cards: TeamMark[] = [];
  for (const mark of PRO_MARKS) {
    const gameCount = catalog.games.filter((game) => game.team === mark.team).length;
    if (gameCount) cards.push({ ...mark, gameCount });
  }
  const collegePairs = new Map<string, TeamMark>();
  for (const game of catalog.games) {
    const colors = COLLEGE_COLORS[game.team];
    if (!colors) continue;
    const key = `${game.team}::${game.sport}`;
    if (collegePairs.has(key)) continue;
    collegePairs.set(key, {
      ...colors,
      team: game.team,
      sport: game.sport,
      gameCount: catalog.games.filter((row) => row.team === game.team && row.sport === game.sport).length,
    });
  }
  cards.push(
    ...[...collegePairs.values()].sort(
      (a, b) => a.team.localeCompare(b.team) || (a.sport ?? "").localeCompare(b.sport ?? ""),
    ),
  );
  return cards;
}

export function teamHref(card: TeamMark): string {
  const params = new URLSearchParams();
  params.set("teams", card.team);
  if (card.sport) params.set("sports", card.sport);
  return `/?${params.toString()}`;
}
