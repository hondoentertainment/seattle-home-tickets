function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden>
      {filled ? (
        <path
          fill="currentColor"
          d="M6 3.25h12A1.75 1.75 0 0 1 19.75 5v16.2a.75.75 0 0 1-1.12.65L12 17.7l-6.63 4.15A.75.75 0 0 1 4.25 21.2V5A1.75 1.75 0 0 1 6 3.25Z"
        />
      ) : (
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          d="M6.4 4.1h11.2A1.1 1.1 0 0 1 18.7 5.2v15.1L12 16.3l-6.7 4V5.2A1.1 1.1 0 0 1 6.4 4.1Z"
        />
      )}
    </svg>
  );
}

export function SaveToggle({
  saved,
  onToggle,
  matchup,
}: {
  saved: boolean;
  onToggle: () => void;
  matchup: string;
}) {
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
      <BookmarkIcon filled={saved} />
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
