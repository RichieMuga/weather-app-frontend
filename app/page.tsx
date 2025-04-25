"use client";

import { useState } from "react";
import { Thermometer, AlertTriangle } from "lucide-react";

import WeatherIcon from "@/components/weather-icon";
import ForecastCard from "@/components/forecast-card";
import InfoCard from "@/components/info-card";
import SearchBar from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types
import type { City, WeatherData } from "@/types/weather-types";
import { mockWeatherData } from "@/constants/mock-weather";

// 🔧 Helper Functions
import { formatDate } from "@/utils/date";
import { fetchWeatherFromApi } from "@/utils/fetch-weather";

export default function WeatherApp() {
  const [temperatureUnit, setTemperatureUnit] = useState<"C" | "F">("C");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData>(mockWeatherData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState<boolean>(true);

  // Toggle between °C and °F
  const toggleTemperatureUnit = () =>
    setTemperatureUnit((prev) => (prev === "C" ? "F" : "C"));

  // Called when a city is selected from search
  const handleCitySelect = async (city: City) => {
    setSelectedCity(city);
    await fetchWeather(city);
  };

  // Fetch weather data from API or use fallback
  const fetchWeather = async (city?: City) => {
    if (!city) {
      setWeatherData(mockWeatherData);
      setUsingMockData(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherFromApi(city);
      setWeatherData(data);
      setUsingMockData(false);
    } catch (err) {
      console.error(err);
      setError(
        `Failed to load weather data: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
      setUsingMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white py-10 mx-auto p-6 max-w-6xl">
      {/* ERROR ALERT */}
      {error && (
        <Alert className="mb-6 border-red-300 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
            <Button
              variant="outline"
              size="sm"
              className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => fetchWeather(selectedCity || undefined)}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* USING MOCK DATA ALERT */}
      {usingMockData && !error && (
        <Alert className="mb-6 border-amber-300 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            {selectedCity ? "Unable to fetch data for this city. " : ""}
            Displaying sample data for Nairobi. Kindly enter city and press
            enter. For example london
            {selectedCity && (
              <Button
                variant="outline"
                size="sm"
                className="ml-4 border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={() => fetchWeather(selectedCity)}
              >
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* LOADING SPINNER */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="text-blue-800 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <div>Loading weather data...</div>
          </div>
        </div>
      )}

      {/* MAIN UI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: CURRENT WEATHER */}
        <div className="border rounded-lg p-6 flex flex-col items-center justify-center bg-blue-800 text-white">
          <div className="w-32 h-32 text-white flex items-center justify-center">
            <WeatherIcon
              condition={weatherData.current.condition.icon}
              className="w-full h-full"
            />
          </div>
          <div className="mt-4 text-4xl font-bold">
            {temperatureUnit === "C"
              ? Math.round(weatherData.current.temp_c)
              : Math.round(weatherData.current.temp_f)}{" "}
            °{temperatureUnit}
          </div>
          <div className="mt-2 text-xl">
            {weatherData.current.condition.text}
          </div>
          <div className="mt-6 text-sm text-blue-200">
            {formatDate(new Date().toISOString())}
          </div>
          <div className="text-sm text-blue-200">
            {weatherData.location.name}, {weatherData.location.country}
          </div>
        </div>

        {/* RIGHT: FORECAST + INFO */}
        <div className="md:col-span-2 space-y-6">
          {/* SEARCH BAR */}
          <div className="flex items-center gap-2">
            <SearchBar onCitySelect={handleCitySelect} className="flex-1" />
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 text-blue-800 hover:bg-blue-50 hover:text-blue-900 flex-shrink-0"
              onClick={toggleTemperatureUnit}
            >
              <Thermometer className="h-4 w-4" />
              <span className="sr-only">Toggle temperature unit</span>
              <span className="ml-1 text-xs font-bold">{temperatureUnit}°</span>
            </Button>
          </div>

          {/* FORECAST */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {weatherData.forecast.daily.map((forecast, index) => (
              <ForecastCard
                key={index}
                time={formatDate(forecast.date)}
                temperature={
                  temperatureUnit === "C"
                    ? Math.round(forecast.temp.max)
                    : Math.round((forecast.temp.max * 9) / 5 + 32)
                }
                condition={forecast.condition.icon}
              />
            ))}
          </div>

          {/* INFO CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              title="Wind Status"
              value={`${weatherData.current.wind_kph} km/h`}
              icon="wind"
            />
            <InfoCard
              title="Humidity"
              value={`${weatherData.current.humidity}%`}
              icon="droplets"
              humidityValue={weatherData.current.humidity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
