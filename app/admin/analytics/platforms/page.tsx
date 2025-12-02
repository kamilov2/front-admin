"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { AnalyticsFilters } from "@/components/analytics-filters";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PlayCircle, Target, Clock, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const platformTabs = [
  { id: "web", label: "Web", icon: "🌐" },
  { id: "ios", label: "iOS", icon: "📱" },
  { id: "android", label: "Android", icon: "🤖" },
];

const platformData = {
  web: {
    kpis: [
      { title: "Активных пользователей (DAU)", value: "4,521", trend: { value: 15.3, direction: "up" as const }, icon: <Users className="w-6 h-6" /> },
      { title: "Запусков тестов", value: "12,345", trend: { value: 8.7, direction: "up" as const }, icon: <PlayCircle className="w-6 h-6" /> },
      { title: "Тестов на пользователя", value: "2.73", trend: { value: -2.1, direction: "down" as const }, icon: <Target className="w-6 h-6" /> },
      { title: "Средняя длительность сессии", value: "18:42", trend: { value: 5.8, direction: "up" as const }, icon: <Clock className="w-6 h-6" /> },
      { title: "Средний балл", value: "74.2%", trend: { value: 3.2, direction: "up" as const }, icon: <TrendingUp className="w-6 h-6" /> },
    ],
    activityData: [
      { date: "17 Ноя", sessions: 450, users: 420, tests: 890 },
      { date: "18 Ноя", sessions: 520, users: 480, tests: 1020 },
      { date: "19 Ноя", sessions: 680, users: 620, tests: 1340 },
      { date: "20 Ноя", sessions: 590, users: 540, tests: 1180 },
      { date: "21 Ноя", sessions: 720, users: 680, tests: 1480 },
      { date: "22 Ноя", sessions: 580, users: 520, tests: 1160 },
      { date: "23 Ноя", sessions: 490, users: 450, tests: 980 },
    ],
    hourlyData: [
      { hour: "0", value: 45 }, { hour: "1", value: 32 }, { hour: "2", value: 18 },
      { hour: "3", value: 12 }, { hour: "4", value: 8 }, { hour: "5", value: 15 },
      { hour: "6", value: 42 }, { hour: "7", value: 89 }, { hour: "8", value: 156 },
      { hour: "9", value: 234 }, { hour: "10", value: 298 }, { hour: "11", value: 312 },
      { hour: "12", value: 280 }, { hour: "13", value: 265 }, { hour: "14", value: 290 },
      { hour: "15", value: 315 }, { hour: "16", value: 340 }, { hour: "17", value: 380 },
      { hour: "18", value: 420 }, { hour: "19", value: 395 }, { hour: "20", value: 340 },
      { hour: "21", value: 275 }, { hour: "22", value: 198 }, { hour: "23", value: 102 },
    ],
    topTests: [
      { name: "ЕНТ Математика 2025", attempts: 856, avgScore: 76, completion: 91, avgTime: "14:23" },
      { name: "Физика базовый", attempts: 734, avgScore: 69, completion: 85, avgTime: "12:45" },
      { name: "История Казахстана", attempts: 621, avgScore: 72, completion: 88, avgTime: "11:30" },
      { name: "Биология ЕНТ", attempts: 543, avgScore: 80, completion: 93, avgTime: "13:12" },
      { name: "Химия 11 класс", attempts: 487, avgScore: 65, completion: 79, avgTime: "15:08" },
    ],
  },
  ios: {
    kpis: [
      { title: "Активных пользователей (DAU)", value: "2,134", trend: { value: 12.8, direction: "up" as const }, icon: <Users className="w-6 h-6" /> },
      { title: "Запусков тестов", value: "6,782", trend: { value: 10.2, direction: "up" as const }, icon: <PlayCircle className="w-6 h-6" /> },
      { title: "Тестов на пользователя", value: "3.18", trend: { value: 4.5, direction: "up" as const }, icon: <Target className="w-6 h-6" /> },
      { title: "Средняя длительность сессии", value: "22:15", trend: { value: 7.3, direction: "up" as const }, icon: <Clock className="w-6 h-6" /> },
      { title: "Средний балл", value: "71.8%", trend: { value: 1.9, direction: "up" as const }, icon: <TrendingUp className="w-6 h-6" /> },
    ],
    activityData: [
      { date: "17 Ноя", sessions: 280, users: 260, tests: 650 },
      { date: "18 Ноя", sessions: 320, users: 295, tests: 740 },
      { date: "19 Ноя", sessions: 410, users: 380, tests: 920 },
      { date: "20 Ноя", sessions: 360, users: 330, tests: 810 },
      { date: "21 Ноя", sessions: 450, users: 420, tests: 1050 },
      { date: "22 Ноя", sessions: 340, users: 310, tests: 780 },
      { date: "23 Ноя", sessions: 290, users: 270, tests: 680 },
    ],
    hourlyData: [
      { hour: "0", value: 28 }, { hour: "1", value: 19 }, { hour: "2", value: 11 },
      { hour: "3", value: 7 }, { hour: "4", value: 5 }, { hour: "5", value: 9 },
      { hour: "6", value: 25 }, { hour: "7", value: 54 }, { hour: "8", value: 98 },
      { hour: "9", value: 145 }, { hour: "10", value: 187 }, { hour: "11", value: 195 },
      { hour: "12", value: 175 }, { hour: "13", value: 165 }, { hour: "14", value: 180 },
      { hour: "15", value: 198 }, { hour: "16", value: 215 }, { hour: "17", value: 240 },
      { hour: "18", value: 265 }, { hour: "19", value: 248 }, { hour: "20", value: 215 },
      { hour: "21", value: 172 }, { hour: "22", value: 124 }, { hour: "23", value: 64 },
    ],
    topTests: [
      { name: "Математика ЕНТ", attempts: 512, avgScore: 73, completion: 89, avgTime: "13:45" },
      { name: "Физика 11 класс", attempts: 487, avgScore: 68, completion: 82, avgTime: "12:18" },
      { name: "История базовый", attempts: 398, avgScore: 71, completion: 86, avgTime: "10:52" },
      { name: "Биология ЕНТ", attempts: 356, avgScore: 77, completion: 91, avgTime: "12:34" },
      { name: "Химия базовый", attempts: 321, avgScore: 64, completion: 78, avgTime: "14:22" },
    ],
  },
  android: {
    kpis: [
      { title: "Активных пользователей (DAU)", value: "1,687", trend: { value: 9.4, direction: "up" as const }, icon: <Users className="w-6 h-6" /> },
      { title: "Запусков тестов", value: "5,440", trend: { value: 6.8, direction: "up" as const }, icon: <PlayCircle className="w-6 h-6" /> },
      { title: "Тестов на пользователя", value: "3.23", trend: { value: 3.7, direction: "up" as const }, icon: <Target className="w-6 h-6" /> },
      { title: "Средняя длительность сессии", value: "20:38", trend: { value: 4.2, direction: "up" as const }, icon: <Clock className="w-6 h-6" /> },
      { title: "Средний балл", value: "70.5%", trend: { value: 2.1, direction: "up" as const }, icon: <TrendingUp className="w-6 h-6" /> },
    ],
    activityData: [
      { date: "17 Ноя", sessions: 220, users: 210, tests: 520 },
      { date: "18 Ноя", sessions: 250, users: 235, tests: 590 },
      { date: "19 Ноя", sessions: 330, users: 310, tests: 740 },
      { date: "20 Ноя", sessions: 280, users: 260, tests: 650 },
      { date: "21 Ноя", sessions: 360, users: 340, tests: 840 },
      { date: "22 Ноя", sessions: 270, users: 250, tests: 620 },
      { date: "23 Ноя", sessions: 230, users: 215, tests: 540 },
    ],
    hourlyData: [
      { hour: "0", value: 22 }, { hour: "1", value: 15 }, { hour: "2", value: 9 },
      { hour: "3", value: 5 }, { hour: "4", value: 4 }, { hour: "5", value: 7 },
      { hour: "6", value: 20 }, { hour: "7", value: 43 }, { hour: "8", value: 78 },
      { hour: "9", value: 115 }, { hour: "10", value: 148 }, { hour: "11", value: 155 },
      { hour: "12", value: 140 }, { hour: "13", value: 132 }, { hour: "14", value: 143 },
      { hour: "15", value: 158 }, { hour: "16", value: 171 }, { hour: "17", value: 191 },
      { hour: "18", value: 211 }, { hour: "19", value: 197 }, { hour: "20", value: 171 },
      { hour: "21", value: 137 }, { hour: "22", value: 99 }, { hour: "23", value: 51 },
    ],
    topTests: [
      { name: "ЕНТ Математика", attempts: 421, avgScore: 71, completion: 87, avgTime: "13:28" },
      { name: "Физика базовый", attempts: 389, avgScore: 67, completion: 81, avgTime: "11:54" },
      { name: "История ЕНТ", attempts: 318, avgScore: 69, completion: 84, avgTime: "10:37" },
      { name: "Биология 11", attempts: 284, avgScore: 75, completion: 89, avgTime: "12:15" },
      { name: "Химия базовый", attempts: 256, avgScore: 63, completion: 76, avgTime: "13:45" },
    ],
  },
};

export default function AnalyticsPlatformsPage() {
  const [period, setPeriod] = useState("7days");
  const [selectedPlatform, setSelectedPlatform] = useState<"web" | "ios" | "android">("web");
  const [metric, setMetric] = useState<"sessions" | "users" | "tests">("sessions");

  const currentData = platformData[selectedPlatform];

  const metricLabels = {
    sessions: "Сессии",
    users: "Уникальные пользователи",
    tests: "Прохождения тестов",
  };

  return (
    <>
      <AdminHeader title="Аналитика — Платформы">
        <AnalyticsFilters period={period} onPeriodChange={setPeriod} />
      </AdminHeader>

      <div className="p-6 space-y-6">
        <div className="flex gap-2">
          {platformTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={selectedPlatform === tab.id ? "default" : "outline"}
              onClick={() => setSelectedPlatform(tab.id as "web" | "ios" | "android")}
              className="gap-2"
            >
              <span>{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {currentData.kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Активность пользователей</CardTitle>
            <div className="flex gap-2">
              {(Object.keys(metricLabels) as Array<keyof typeof metricLabels>).map((m) => (
                <Button
                  key={m}
                  variant={metric === m ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMetric(m)}
                >
                  {metricLabels[m]}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={currentData.activityData}>
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
                <Line
                  type="monotone"
                  dataKey={metric}
                  stroke="#2563EB"
                  strokeWidth={3}
                  name={metricLabels[metric]}
                  dot={{ fill: "#2563EB", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Топ-часов активности</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentData.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1120",
                      border: "1px solid #1e293b",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Топ тестов по платформе</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left font-medium text-muted pb-3">Тест</th>
                      <th className="text-right font-medium text-muted pb-3">Попыток</th>
                      <th className="text-right font-medium text-muted pb-3">Балл</th>
                      <th className="text-right font-medium text-muted pb-3">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.topTests.map((test, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                        <td className="py-3 text-foreground">{test.name}</td>
                        <td className="py-3 text-foreground text-right">{test.attempts}</td>
                        <td className="py-3 text-foreground text-right">{test.avgScore}%</td>
                        <td className="py-3 text-right">
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
