import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  CloudDrizzle,
  CloudHail,
  CloudSun,
  CloudMoon,
  Moon,
} from "lucide-react";

type WeatherCondition =
  | "sunny"
  | "clear"
  | "cloudy"
  | "overcast"
  | "rainy"
  | "drizzle"
  | "snowy"
  | "foggy"
  | "thunderstorm"
  | "hail"
  | "partly-cloudy-day"
  | "partly-cloudy-night"
  | "clear-night";

interface WeatherIconProps {
  condition: string;
  className?: string;
}

export default function WeatherIcon({
  condition,
  className = "",
}: WeatherIconProps) {
  const iconClass = `${className} flex items-center justify-center`;

  switch (condition.toLowerCase()) {
    case "sunny":
    case "clear":
      return <Sun className={iconClass} />;
    case "cloudy":
    case "overcast":
      return <Cloud className={iconClass} />;
    case "rainy":
      return <CloudRain className={iconClass} />;
    case "drizzle":
      return <CloudDrizzle className={iconClass} />;
    case "snowy":
      return <CloudSnow className={iconClass} />;
    case "foggy":
      return <CloudFog className={iconClass} />;
    case "thunderstorm":
      return <CloudLightning className={iconClass} />;
    case "hail":
      return <CloudHail className={iconClass} />;
    case "partly-cloudy-day":
      return <CloudSun className={iconClass} />;
    case "partly-cloudy-night":
      return <CloudMoon className={iconClass} />;
    case "clear-night":
      return <Moon className={iconClass} />;
    default:
      return <Sun className={iconClass} />;
  }
}
