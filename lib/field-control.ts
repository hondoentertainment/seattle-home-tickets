/** Shared 44px field metrics so search, select, tickets, and filters align. */
export const FIELD_SHELL =
  "h-11 rounded-xl border border-card-border px-3.5 py-0 text-sm leading-5 outline-none ring-accent/40 focus:ring-2";

export const FIELD_INPUT = `${FIELD_SHELL} min-w-0 w-full appearance-none bg-card text-foreground placeholder:text-muted`;

export const FIELD_ACTION = `${FIELD_SHELL} inline-flex w-[88px] shrink-0 items-center justify-center border-[1.5px] border-accent bg-transparent font-semibold text-accent hover:bg-accent/10`;

export const FIELD_TRIGGER = `${FIELD_SHELL} flex w-full items-center justify-between bg-card text-left text-foreground hover:border-accent/40`;
