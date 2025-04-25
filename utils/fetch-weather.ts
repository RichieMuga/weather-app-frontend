import type { City, WeatherData } from "@/types/weather-types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchWeatherFromApi(city: City): Promise<WeatherData> {
  const url = `${BASE_URL}/weather?city=${encodeURIComponent(city.name)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const errorData = await response.text().catch(() => "");
    throw new Error(errorData || `API returned ${response.status}`);
  }

  return response.json();
}
