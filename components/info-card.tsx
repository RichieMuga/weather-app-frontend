// components/InfoCard.tsx
import { Droplets, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface InfoCardProps {
  title: string;
  value: string;
  icon: "wind" | "droplets";
  humidityValue?: number;
}

export default function InfoCard({
  title,
  value,
  icon,
  humidityValue = 0,
}: InfoCardProps) {
  const showProgressBar = icon === "droplets";
  const progressValue = showProgressBar ? humidityValue : 0;

  return (
    <Card className="border-blue-200 hover:border-blue-300 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-blue-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-800">{value}</div>
          <div className="rounded-full border border-blue-200 p-2 text-blue-500 flex items-center justify-center">
            {icon === "wind" && <Wind className="h-4 w-4" />}
            {icon === "droplets" && <Droplets className="h-4 w-4" />}
          </div>
        </div>

        {showProgressBar && (
          <div className="mt-4">
            <Progress
              value={progressValue}
              className="h-2"
              style={{ backgroundColor: "#dbeafe" }}
            >
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progressValue}%` }}
              />
            </Progress>
            <div className="flex justify-between mt-1 text-xs text-blue-600">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
