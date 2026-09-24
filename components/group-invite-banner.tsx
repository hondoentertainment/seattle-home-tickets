"use client";

export function GroupInviteBanner({
  count,
  alreadySaved,
  onAdd,
}: {
  count: number;
  alreadySaved: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="rounded-2xl border border-accent/40 bg-accent/10 p-3 sm:flex sm:items-center sm:justify-between sm:gap-3 sm:p-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">
          Group list · {count} {count === 1 ? "game" : "games"}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted">
          Shared via link. This is a shortlist, not RSVP. Add it to your Saved to keep it
          after you close the tab.
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        disabled={alreadySaved}
        className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-background disabled:opacity-60 sm:mt-0"
      >
        {alreadySaved ? "Already in Saved" : "Add to my Saved"}
      </button>
    </div>
  );
}
