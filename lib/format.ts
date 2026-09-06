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

const shortDate = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatGameDate(iso: string): string {
  return longDate.format(new Date(`${iso}T12:00:00Z`));
}

export function formatGameDateShort(iso: string): string {
  return shortDate.format(new Date(`${iso}T12:00:00Z`));
}

export function parseIsoDate(iso: string): number {
  return Date.parse(`${iso}T12:00:00Z`);
}

const SPECIAL_TAG_LABELS: Record<string, string> = {
  Christmas: "🎄 Christmas",
  "Holiday Classic": "Holiday Classic",
  "New Year's": "New Year's",
  "Thanksgiving week": "Thanksgiving week",
  "Labor Day weekend": "Labor Day weekend",
  "Apple Cup": "Apple Cup",
  Homecoming: "Homecoming",
  "MLK Day": "MLK Day",
  "Presidents Day": "Presidents Day",
  "Decision Day": "Decision Day",
  Rivalry: "Rivalry",
};

export function formatSpecialTag(tag: string): string {
  return SPECIAL_TAG_LABELS[tag] ?? tag;
}
