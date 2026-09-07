"use client";

export function PickTeamsPrompt({
  onChoose,
  onSkip,
}: {
  onChoose: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
      <p className="text-sm font-semibold text-foreground">Pick your teams</p>
      <p className="mt-1 text-xs leading-5 text-muted">
        Home can show just your clubs. Starts with Seattle’s big teams + Huskies.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onChoose}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-accent px-3 text-sm font-semibold text-background"
        >
          Choose teams
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex min-h-11 items-center justify-center rounded-xl px-3 text-sm font-semibold text-muted hover:text-foreground"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
