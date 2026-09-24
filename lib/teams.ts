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
  { team: "Seattle Torrent", initials: "SEA", short: "Torrent", bg: "#0B3D2E", fg: "#F5E6C8", ring: "#FFFFFF" },
];

const COLLEGE_COLORS: Record<string, Pick<TeamMark, "initials" | "short" | "bg" | "fg" | "ring">> = {
  "Washington Huskies": { initials: "UW", short: "Huskies", bg: "#4B2E83", fg: "#B7A57A", ring: "#FFFFFF" },
  "Seattle U Redhawks": { initials: "SU", short: "Redhawks", bg: "#AA0000", fg: "#FFFFFF", ring: "#000000" },
  "Seattle Pacific Falcons": { initials: "SPU", short: "Falcons", bg: "#4A1C2F", fg: "#C4A35A", ring: "#FFFFFF" },
};

const SCHOOL_COLORS: Record<string, Pick<TeamMark, "initials" | "short" | "bg" | "fg" | "ring">> = {
  "O'Dea Fighting Irish": { initials: "OD", short: "O'Dea", bg: "#1B4F72", fg: "#F5F5F5", ring: "#C4A35A" },
  "Ballard Beavers": { initials: "BA", short: "Ballard", bg: "#1A1A1A", fg: "#F5C400", ring: "#FFFFFF" },
  "Roosevelt Roughriders": { initials: "RR", short: "Roosevelt", bg: "#1A3A6B", fg: "#F5C400", ring: "#FFFFFF" },
  "Rainier Beach Vikings": { initials: "RB", short: "Rainier Beach", bg: "#1B4F72", fg: "#F5F5F5", ring: "#C4A35A" },
  "Eastside Catholic Crusaders": { initials: "EC", short: "Eastside Catholic", bg: "#1A1A1A", fg: "#F5C400", ring: "#FFFFFF" },
  "Bellevue Wolverines": { initials: "BW", short: "Bellevue", bg: "#7A1F2B", fg: "#F5F5F5", ring: "#C4A35A" },
};

const SCHOOL_SPORT_LABEL: Record<string, string> = {
  "NCAA Football": "Football",
  "NCAA Men's Basketball": "Men's basketball",
  "NCAA Women's Basketball": "Women's basketball",
  "NCAA Volleyball": "Volleyball",
  "NCAA Men's Soccer": "Men's soccer",
  "NCAA Women's Soccer": "Women's soccer",
  "HS Football": "Football",
  "HS Men's Basketball": "Men's basketball",
  "HS Women's Basketball": "Women's basketball",
  Exhibition: "Exhibition",
  Touring: "Touring",
  PWHL: "PWHL",
};

export function sportTileLabel(sport: string): string {
  return SCHOOL_SPORT_LABEL[sport] ?? sport;
}

export function isCollegeTeam(team: string): boolean {
  return team in COLLEGE_COLORS;
}

export function isSchoolTeam(team: string): boolean {
  return team in COLLEGE_COLORS || team in SCHOOL_COLORS;
}

export function teamKey(card: TeamMark): string {
  return card.sport ? `${card.team}::${card.sport}` : card.team;
}

function schoolColors(team: string): Pick<TeamMark, "initials" | "short" | "bg" | "fg" | "ring"> | undefined {
  return COLLEGE_COLORS[team] ?? SCHOOL_COLORS[team];
}

function staticProMark(team: string): Omit<TeamMark, "gameCount"> | undefined {
  return PRO_MARKS.find((mark) => mark.team === team);
}

let cardsCache: TeamMark[] | null = null;

export function teamCards(): TeamMark[] {
  if (cardsCache) return cardsCache;
  const cards: TeamMark[] = [];
  for (const mark of PRO_MARKS) {
    const gameCount = catalog.games.filter((game) => game.team === mark.team).length;
    if (gameCount) cards.push({ ...mark, gameCount });
  }
  const schoolPairs = new Map<string, TeamMark>();
  for (const game of catalog.games) {
    const colors = schoolColors(game.team);
    if (!colors) continue;
    const key = `${game.team}::${game.sport}`;
    if (schoolPairs.has(key)) continue;
    schoolPairs.set(key, {
      ...colors,
      team: game.team,
      sport: game.sport,
      gameCount: catalog.games.filter((row) => row.team === game.team && row.sport === game.sport).length,
    });
  }
  cards.push(
    ...[...schoolPairs.values()].sort(
      (a, b) => a.team.localeCompare(b.team) || (a.sport ?? "").localeCompare(b.sport ?? ""),
    ),
  );
  cardsCache = cards;
  return cards;
}

export function teamHref(card: TeamMark): string {
  const params = new URLSearchParams();
  params.set("teams", card.team);
  if (card.sport) params.set("sports", card.sport);
  return `/?${params.toString()}`;
}

const SKIP_WORDS = new Set(["fc", "the", "of", "and", "at"]);

function initialsFromName(name: string): string {
  if (name.startsWith("Los Angeles")) return "LA";
  if (name.startsWith("New York")) return "NY";
  if (name.startsWith("San Francisco")) return "SF";
  if (name.startsWith("Kansas City")) return "KC";
  const words = name
    .replace(/'/g, "")
    .split(/\s+/)
    .filter((word) => word && !SKIP_WORDS.has(word.toLowerCase()));
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, Math.min(3, words[0].length)).toUpperCase();
  if (words.length === 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function hashBg(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 28% 20%)`;
}

/** Visual monogram for a home club or opponent. Does not invent catalog rows. */
export function displayMark(name: string, sport?: string): TeamMark {
  const known = markFor(name, sport);
  if (known) return known;
  return {
    team: name,
    sport,
    initials: initialsFromName(name),
    short: name.replace(/^(Seattle|Washington)\s+/, ""),
    bg: hashBg(name),
    fg: "#e8f4ef",
    ring: "#1d3d34",
    gameCount: 0,
  };
}

export function markFor(team: string, sport?: string): TeamMark | undefined {
  const cards = teamCards();
  if (sport) {
    const hit =
      cards.find((card) => card.team === team && card.sport === sport) ??
      cards.find((card) => card.team === team);
    if (hit) return hit;
  } else {
    const hit = cards.find((card) => card.team === team && !card.sport) ?? cards.find((card) => card.team === team);
    if (hit) return hit;
  }
  const pro = staticProMark(team);
  if (pro) return { ...pro, sport, gameCount: 0 };
  const colors = schoolColors(team);
  if (colors) return { ...colors, team, sport, gameCount: 0 };
  return undefined;
}
