export interface City {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  text: string;
  icon: string;
}

export interface CurrentWeather {
  temp_c: number;
  temp_f: number;
  condition: WeatherCondition;
  humidity: number;
  wind_kph: number;
  feels_like: number;
  pressure: number;
}

export interface DailyForecast {
  date: string;
  temp: {
    max: number;
    min: number;
  };
  condition: WeatherCondition;
}

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: CurrentWeather;
  forecast: {
    daily: DailyForecast[];
  };
}
