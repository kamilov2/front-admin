"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { AnalyticsFilters } from "@/components/analytics-filters";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  Brain,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const kpiData = [
  {
    title: "Всего прохождений",
    value: "24,567",
    trend: { value: 12.5, direction: "up" as const },
    icon: <FileCheck className="w-6 h-6" />,
  },
  {
    title: "Уникальных пользователей",
    value: "8,342",
    trend: { value: 8.2, direction: "up" as const },
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: "Средний балл",
    value: "72.4%",
    trend: { value: -2.3, direction: "down" as const },
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    title: "Средняя длительность",
    value: "12:34",
    trend: { value: 5.1, direction: "up" as const },
    icon: <Clock className="w-6 h-6" />,
  },
  {
    title: "% завершённых",
    value: "86.7%",
    trend: { value: 3.4, direction: "up" as const },
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    title: "Запусков ИИ",
    value: "1,234",
    trend: { value: 18.9, direction: "up" as const },
    icon: <Brain className="w-6 h-6" />,
  },
];

const dailyData = [
  { date: "17 Ноя", web: 120, ios: 80, android: 95 },
  { date: "18 Ноя", web: 140, ios: 95, android: 110 },
  { date: "19 Ноя", web: 180, ios: 120, android: 140 },
  { date: "20 Ноя", web: 160, ios: 110, android: 125 },
  { date: "21 Ноя", web: 200, ios: 140, android: 160 },
  { date: "22 Ноя", web: 150, ios: 100, android: 120 },
  { date: "23 Ноя", web: 130, ios: 85, android: 100 },
];

const categoryData = [
  { name: "Математика", value: 35, color: "#2563EB" },
  { name: "Физика", value: 25, color: "#38BDF8" },
  { name: "История", value: 20, color: "#60A5FA" },
  { name: "Биология", value: 12, color: "#93C5FD" },
  { name: "Химия", value: 8, color: "#DBEAFE" },
];

const topTests = [
  { name: "ЕНТ Математика 2025", platform: "🌐 Web", attempts: 1234, avgScore: 75, completion: 89 },
  { name: "Физика 11 класс", platform: "📱 iOS", attempts: 987, avgScore: 68, completion: 82 },
  { name: "История Казахстана", platform: "🤖 Android", attempts: 856, avgScore: 71, completion: 85 },
  { name: "Биология ЕНТ", platform: "🌐 Web", attempts: 743, avgScore: 79, completion: 91 },
  { name: "Химия базовый", platform: "📱 iOS", attempts: 621, avgScore: 65, completion: 78 },
];

export default function AnalyticsOverviewPage() {
  const [period, setPeriod] = useState("7days");
  const [platform, setPlatform] = useState("all");

  return (
    <>
      <AdminHeader title="Аналитика — Overview">
        <AnalyticsFilters
          period={period}
          onPeriodChange={setPeriod}
          platform={platform}
          onPlatformChange={setPlatform}
        />
      </AdminHeader>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Прохождения тестов по дням</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B1120",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="web" stroke="#2563EB" strokeWidth={2} name="Web" />
                <Line type="monotone" dataKey="ios" stroke="#38BDF8" strokeWidth={2} name="iOS" />
                <Line type="monotone" dataKey="android" stroke="#60A5FA" strokeWidth={2} name="Android" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Распределение попыток по категориям</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1120",
                      border: "1px solid #1e293b",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Топ-5 тестов по популярности</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-sm font-medium text-muted pb-3">Тест</th>
                      <th className="text-left text-sm font-medium text-muted pb-3">Платформа</th>
                      <th className="text-right text-sm font-medium text-muted pb-3">Попыток</th>
                      <th className="text-right text-sm font-medium text-muted pb-3">Ср. балл</th>
                      <th className="text-right text-sm font-medium text-muted pb-3">% завершения</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTests.map((test, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                        <td className="py-3 text-sm text-foreground">{test.name}</td>
                        <td className="py-3 text-sm text-muted">{test.platform}</td>
                        <td className="py-3 text-sm text-foreground text-right">{test.attempts}</td>
                        <td className="py-3 text-sm text-foreground text-right">{test.avgScore}%</td>
                        <td className="py-3 text-sm text-right">
                          <span className="text-green-500 font-medium">{test.completion}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
