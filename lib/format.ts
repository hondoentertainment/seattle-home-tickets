const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const longDate = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatUsd(value: number): string {
  return money.format(value);
}

export function formatGameDate(iso: string): string {
  return longDate.format(new Date(`${iso}T12:00:00Z`));
}

export function parseIsoDate(iso: string): number {
  return Date.parse(`${iso}T12:00:00Z`);
}
