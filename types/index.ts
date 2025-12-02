export type Platform = "web" | "ios" | "android" | "all";

export type TimePeriod = "today" | "7days" | "30days" | "90days" | "custom";

export type Language = "ru" | "kz";

export interface KPICard {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  icon?: React.ReactNode;
}

export interface AnalyticsFilters {
  period: TimePeriod;
  platform: Platform;
  language?: Language;
  category?: string;
  from?: Date;
  to?: Date;
}

export interface ChartDataPoint {
  date: string;
  web?: number;
  ios?: number;
  android?: number;
  total?: number;
  [key: string]: string | number | undefined;
}

export interface TestAnalytics {
  id: string;
  name: string;
  category: string;
  attempts: number;
  avgScore: number;
  completionRate: number;
  avgDuration: number;
  platforms: {
    web: number;
    ios: number;
    android: number;
  };
}

export interface CategoryAnalytics {
  name: string;
  attempts: number;
  percentage: number;
  color: string;
}

export interface FunnelStep {
  name: string;
  value: number;
  percentage: number;
}
