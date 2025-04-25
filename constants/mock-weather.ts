import type { WeatherData } from "@/types/weather-types";

export const mockWeatherData: WeatherData = {
  location: {
    name: "Nairobi",
    country: "KE",
    lat: -1.30326415,
    lon: 36.826384099341595,
  },
  current: {
    temp_c: 17.21,
    temp_f: 63,
    condition: {
      text: "Light rain",
      icon: "rainy",
    },
    humidity: 90,
    wind_kph: 14,
    feels_like: 17.34,
    pressure: 1015,
  },
  forecast: {
    daily: [
      {
        date: "2025-04-24",
        temp: { max: 17.92, min: 16.19 },
        condition: { text: "Light rain", icon: "rainy" },
      },
      {
        date: "2025-04-25",
        temp: { max: 16.63, min: 15.56 },
        condition: { text: "Light rain", icon: "rainy" },
      },
      {
        date: "2025-04-26",
        temp: { max: 15.07, min: 15.07 },
        condition: { text: "Clear sky", icon: "sunny" },
      },
    ],
  },
};
