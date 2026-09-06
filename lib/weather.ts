import type { WeatherBlurb } from "@/lib/types";

const SEATTLE = { lat: 47.6062, lon: -122.3321 };

const CLIMATE: Record<string, { high: number; low: number; rain: string }> = {
  "01": { high: 47, low: 37, rain: "often wet" },
  "02": { high: 50, low: 38, rain: "frequently wet" },
  "03": { high: 54, low: 40, rain: "showers common" },
  "04": { high: 58, low: 43, rain: "mixed showers" },
  "05": { high: 65, low: 48, rain: "drying out" },
  "06": { high: 70, low: 53, rain: "usually mild" },
  "07": { high: 76, low: 56, rain: "typically dry" },
  "08": { high: 76, low: 57, rain: "typically dry" },
  "09": { high: 70, low: 52, rain: "early-fall showers possible" },
  "10": { high: 60, low: 46, rain: "rainy season starting" },
  "11": { high: 51, low: 40, rain: "often rainy" },
  "12": { high: 46, low: 37, rain: "dark and wet" },
};

type DailyForecast = {
  dates: string[];
  highs: number[];
  lows: number[];
  precip: number[];
  wind: number[];
};

let forecastPromise: Promise<DailyForecast | null> | null = null;

async function loadForecast(): Promise<DailyForecast | null> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(SEATTLE.lat));
  url.searchParams.set("longitude", String(SEATTLE.lon));
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
  );
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("timezone", "America/Los_Angeles");
  url.searchParams.set("forecast_days", "16");
  const response = await fetch(url.toString());
  if (!response.ok) return null;
  const json = (await response.json()) as {
    daily?: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_probability_max: number[];
      wind_speed_10m_max: number[];
    };
  };
  if (!json.daily) return null;
  return {
    dates: json.daily.time,
    highs: json.daily.temperature_2m_max,
    lows: json.daily.temperature_2m_min,
    precip: json.daily.precipitation_probability_max,
    wind: json.daily.wind_speed_10m_max,
  };
}

export function getForecast(): Promise<DailyForecast | null> {
  forecastPromise ??= loadForecast().catch(() => null);
  return forecastPromise;
}

export function climatologyFor(iso: string): WeatherBlurb {
  const month = iso.slice(5, 7);
  const climate = CLIMATE[month] ?? CLIMATE["09"];
  const monthName = new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  return {
    kind: "climatology",
    label: `Typical ${monthName} in Seattle (not a live forecast)`,
    detail: `Highs near ${climate.high}°F / lows near ${climate.low}°F · ${climate.rain}.`,
  };
}

export function weatherForDate(iso: string, forecast: DailyForecast | null): WeatherBlurb {
  if (forecast) {
    const index = forecast.dates.indexOf(iso);
    if (index >= 0) {
      const high = Math.round(forecast.highs[index]);
      const low = Math.round(forecast.lows[index]);
      const precip = forecast.precip[index];
      const wind = Math.round(forecast.wind[index]);
      return {
        kind: "forecast",
        label: "Open-Meteo forecast for Seattle",
        detail: `High ${high}°F / low ${low}°F · ${precip}% chance of precip · wind to ${wind} mph.`,
      };
    }
  }
  return climatologyFor(iso);
}
