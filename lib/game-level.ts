import type { Game } from "@/lib/types";

export type GameLevel = "pro" | "college" | "hs";

export const LEVEL_LABELS: Record<GameLevel, string> = {
  pro: "Pro",
  college: "College",
  hs: "HS",
};

export const DISCOVERY_TAGS = ["Rivalry", "Homecoming"] as const;
export type DiscoveryTag = (typeof DISCOVERY_TAGS)[number];

export function gameLevel(game: Pick<Game, "sport">): GameLevel | null {
  if (game.sport.startsWith("HS ")) return "hs";
  if (game.sport.startsWith("NCAA ")) return "college";
  if (game.sport === "Exhibition" || game.sport === "Touring" || game.sport === "PWHL") {
    return null;
  }
  return "pro";
}

export function isDiscoveryTag(value: string): value is DiscoveryTag {
  return (DISCOVERY_TAGS as readonly string[]).includes(value);
}
