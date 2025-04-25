import { Card, CardContent } from "@/components/ui/card";
import WeatherIcon from "@/components/weather-icon";

interface ForecastCardProps {
  time: string;
  temperature: number;
  condition: string;
}

export default function ForecastCard({
  time,
  temperature,
  condition,
}: ForecastCardProps) {
  return (
    <Card className="text-center border-blue-200 hover:border-blue-300 transition-colors">
      <CardContent className="p-6">
        <div className="text-sm text-blue-600">{time}</div>
        <div className="my-4 flex justify-center">
          <div className="w-12 h-12 flex items-center justify-center text-blue-500">
            <WeatherIcon condition={condition} className="w-full h-full" />
          </div>
        </div>
        <div className="text-lg font-medium text-blue-800">{temperature}°</div>
      </CardContent>
    </Card>
  );
}
