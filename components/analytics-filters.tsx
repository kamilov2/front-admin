"use client";

import { Button } from "./ui/button";
import { Calendar, Globe, Monitor, Smartphone, Tablet } from "lucide-react";

interface AnalyticsFiltersProps {
  period?: string;
  onPeriodChange?: (period: string) => void;
  platform?: string;
  onPlatformChange?: (platform: string) => void;
  showLanguage?: boolean;
  showCategory?: boolean;
}

const periods = [
  { label: "Сегодня", value: "today" },
  { label: "7 дней", value: "7days" },
  { label: "30 дней", value: "30days" },
  { label: "90 дней", value: "90days" },
  { label: "Custom", value: "custom" },
];

const platforms = [
  { label: "Все", value: "all", icon: Monitor },
  { label: "Web", value: "web", icon: Monitor },
  { label: "iOS", value: "ios", icon: Smartphone },
  { label: "Android", value: "android", icon: Tablet },
];

export function AnalyticsFilters({
  period = "7days",
  onPeriodChange,
  platform = "all",
  onPlatformChange,
  showLanguage = true,
  showCategory = false,
}: AnalyticsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-muted" />
        <div className="flex gap-1">
          {periods.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? "default" : "outline"}
              size="sm"
              onClick={() => onPeriodChange?.(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {platforms.map((p) => {
            const Icon = p.icon;
            return (
              <Button
                key={p.value}
                variant={platform === p.value ? "default" : "outline"}
                size="sm"
                onClick={() => onPlatformChange?.(p.value)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {p.label}
              </Button>
            );
          })}
        </div>
      </div>

      {showLanguage && (
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-muted" />
          <div className="flex gap-1">
            <Button variant="outline" size="sm">
              RU
            </Button>
            <Button variant="outline" size="sm">
              KZ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
