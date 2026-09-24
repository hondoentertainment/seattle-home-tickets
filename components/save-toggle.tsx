import { IconHeart } from "@/components/ui-icons";

export function SaveToggle({
  saved,
  onToggle,
  matchup,
  variant = "button",
}: {
  saved: boolean;
  onToggle: () => void;
  matchup: string;
  variant?: "button" | "heart";
}) {
  const heart = (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${matchup} from Saved` : `Save ${matchup} to Saved`}
      onClick={onToggle}
      className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full ${
        saved ? "text-gold" : "text-muted hover:text-foreground"
      }`}
    >
      <IconHeart filled={saved} />
    </button>
  );

  if (variant === "heart") return heart;

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${matchup} from Saved` : `Save ${matchup} to Saved`}
      onClick={onToggle}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-semibold leading-5 transition ${
        saved
          ? "border-gold bg-gold/15 text-gold"
          : "border-card-border bg-card text-muted hover:border-accent/50 hover:text-foreground"
      }`}
    >
      <IconHeart filled={saved} className="size-4" />
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
