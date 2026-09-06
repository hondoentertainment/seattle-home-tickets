/** Shared field metrics so search, select, tickets, and filters stay aligned. */
export const FIELD_ROW = "flex min-w-0 items-stretch gap-2";

export const FIELD_SHELL =
  "box-border min-h-11 rounded-xl border border-card-border px-3.5 py-0 text-sm leading-5 outline-none ring-accent/40 focus:ring-2";

export const FIELD_INPUT = `${FIELD_SHELL} min-w-0 w-full appearance-none bg-card text-foreground placeholder:text-muted`;

export const FIELD_ACTION = `${FIELD_SHELL} inline-flex shrink-0 items-center justify-center border-[1.5px] border-accent bg-transparent font-semibold text-accent hover:bg-accent/10`;

export const FIELD_TRIGGER = `${FIELD_SHELL} flex w-full min-w-0 items-center justify-between bg-card text-left text-foreground hover:border-accent/40`;

export const FIELD_CHIP =
  "inline-flex min-h-11 min-w-0 items-center justify-center rounded-full border px-2 text-xs font-medium leading-5 sm:px-3";

export const FIELD_LIST =
  "absolute z-40 mt-1 max-h-[min(18rem,45dvh)] w-full overflow-auto rounded-xl border border-card-border bg-card py-1 shadow-lg shadow-black/40";
