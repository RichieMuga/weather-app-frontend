"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cityDatabase } from "@/lib/city-database";

interface City {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onCitySelect?: (city: City) => void;
  className?: string;
}

export default function SearchBar({
  onCitySelect,
  className = "",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fallback to client-side search when API fails
  const useFallbackSearch = useCallback((query: string) => {
    const filteredCities = cityDatabase
      .filter(
        (city) =>
          city.name.toLowerCase().includes(query.toLowerCase()) ||
          (city.region &&
            city.region.toLowerCase().includes(query.toLowerCase())) ||
          city.country.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 10); // Limit to 10 results

    setSuggestions(filteredCities);
    setShowSuggestions(filteredCities.length > 0);
    setUseFallback(true);
  }, []);

  // Handle clicks outside the suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search query changes
  useEffect(() => {
    let fallback = false; // Define fallback here

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      // Don't reference the callback function in the dependency array
      setIsLoading(true);
      setError(null);

      const fetchData = async () => {
        try {
          // Use the exact API endpoint format provided
          const url = `http://127.0.0.1:8000/cities/search?query=${encodeURIComponent(searchQuery)}`;
          console.log(`Fetching from: ${url}`);

          const response = await fetch(url, {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          });

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }

          const data = await response.json();
          console.log("API Response:", data);

          // Handle the API response
          if (Array.isArray(data) && data.length > 0) {
            setSuggestions(data);
            setShowSuggestions(true);
            setUseFallback(false);
          } else if (
            typeof data === "object" &&
            data !== null &&
            "name" in data
          ) {
            // Single city object
            setSuggestions([data as City]);
            setShowSuggestions(true);
            setUseFallback(false);
          } else {
            // Empty or invalid response, use fallback
            console.log("Invalid or empty API response, using fallback");
            fallback = true;
          }
        } catch (err) {
          console.error("Error fetching city suggestions:", err);
          setError("API error, using fallback data");
          fallback = true;
        } finally {
          setIsLoading(false);
          if (fallback) {
            // Use the client-side filtering directly here
            useFallbackSearch(searchQuery);
          }
        }
      };

      fetchData();
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, useFallbackSearch]);

  const handleCitySelect = (city: City) => {
    if (onCitySelect) {
      onCitySelect(city);
    }
    setSearchQuery(city.name);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className} text-black`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search city..."
          className="pl-10 pr-10 py-2 w-full border-blue-300 focus-visible:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />

        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-10 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
            onClick={clearSearch}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}

        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
        )}
      </div>

      {/* Custom suggestions dropdown with high z-index */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute mt-1 w-full bg-white rounded-md border border-blue-200 shadow-lg z-[1000] max-h-[300px] overflow-auto"
        >
          <div className="p-2 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">
              {useFallback ? "Fallback Suggestions" : "Suggestions"}
            </h3>
          </div>
          <div>
            {suggestions.map((city, index) => (
              <div
                key={`${city.name}-${city.lat}-${city.lon}-${index}`}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => handleCitySelect(city)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{city.name}</span>
                  <span className="text-xs text-gray-500">
                    {city.region ? `${city.region}, ` : ""}
                    {city.country}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {useFallback && !error && (
        <p className="text-xs text-amber-500 mt-1">
          Using fallback data (API issue)
        </p>
      )}
    </div>
  );
}
