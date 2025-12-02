"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { AnalyticsFilters } from "@/components/analytics-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/ui/kpi-card";
import { Search, TrendingUp, Users, CheckCircle, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const testsData = [
  {
    id: "1",
    name: "ЕНТ Математика 2025",
    category: "Математика",
    attempts: 2456,
    platformBreakdown: { web: 1234, ios: 756, android: 466 },
    avgScore: 75,
    completion: 89,
    avgDuration: "14:23",
    difficulty: "Средний",
  },
  {
    id: "2",
    name: "Физика 11 класс",
    category: "Физика",
    attempts: 1987,
    platformBreakdown: { web: 987, ios: 623, android: 377 },
    avgScore: 68,
    completion: 82,
    avgDuration: "12:45",
    difficulty: "Сложный",
  },
  {
    id: "3",
    name: "История Казахстана",
    category: "История",
    attempts: 1756,
    platformBreakdown: { web: 856, ios: 534, android: 366 },
    avgScore: 72,
    completion: 85,
    avgDuration: "11:30",
    difficulty: "Легкий",
  },
  {
    id: "4",
    name: "Биология ЕНТ",
    category: "Биология",
    attempts: 1543,
    platformBreakdown: { web: 743, ios: 487, android: 313 },
    avgScore: 79,
    completion: 91,
    avgDuration: "13:12",
    difficulty: "Средний",
  },
  {
    id: "5",
    name: "Химия базовый",
    category: "Химия",
    attempts: 1324,
    platformBreakdown: { web: 621, ios: 412, android: 291 },
    avgScore: 65,
    completion: 78,
    avgDuration: "15:08",
    difficulty: "Сложный",
  },
];

const selectedTestDailyData = [
  { date: "17 Ноя", attempts: 120 },
  { date: "18 Ноя", attempts: 145 },
  { date: "19 Ноя", attempts: 189 },
  { date: "20 Ноя", attempts: 167 },
  { date: "21 Ноя", attempts: 203 },
  { date: "22 Ноя", attempts: 156 },
  { date: "23 Ноя", attempts: 134 },
];

const questionAccuracy = [
  { question: "1", accuracy: 85 },
  { question: "2", accuracy: 78 },
  { question: "3", accuracy: 92 },
  { question: "4", accuracy: 45 },
  { question: "5", accuracy: 67 },
  { question: "6", accuracy: 73 },
  { question: "7", accuracy: 88 },
  { question: "8", accuracy: 91 },
  { question: "9", accuracy: 52 },
  { question: "10", accuracy: 76 },
];

export default function AnalyticsTestsPage() {
  const [period, setPeriod] = useState("7days");
  const [platform, setPlatform] = useState("all");
  const [selectedTest, setSelectedTest] = useState(testsData[0]);

  const totalAttempts = selectedTest.platformBreakdown.web + selectedTest.platformBreakdown.ios + selectedTest.platformBreakdown.android;
  const uniqueUsers = Math.floor(totalAttempts * 0.68);
  const hardestQuestion = questionAccuracy.reduce((min, q) => q.accuracy < min.accuracy ? q : min);

  return (
    <>
      <AdminHeader title="Аналитика — Тесты">
        <AnalyticsFilters
          period={period}
          onPeriodChange={setPeriod}
          platform={platform}
          onPlatformChange={setPlatform}
          showLanguage={true}
          showCategory={true}
        />
      </AdminHeader>

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Все тесты</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    placeholder="Поиск теста..."
                    className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-sm font-medium text-muted pb-3">Название теста</th>
                    <th className="text-left text-sm font-medium text-muted pb-3">Категория</th>
                    <th className="text-right text-sm font-medium text-muted pb-3">Попыток</th>
                    <th className="text-right text-sm font-medium text-muted pb-3">Web/iOS/Android</th>
                    <th className="text-right text-sm font-medium text-muted pb-3">Ср. балл</th>
                    <th className="text-right text-sm font-medium text-muted pb-3">% завершения</th>
                    <th className="text-center text-sm font-medium text-muted pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {testsData.map((test) => (
                    <tr
                      key={test.id}
                      className={`border-b border-border/50 hover:bg-card/50 transition-colors cursor-pointer ${
                        selectedTest.id === test.id ? "bg-card" : ""
                      }`}
                      onClick={() => setSelectedTest(test)}
                    >
                      <td className="py-3 text-sm text-foreground">{test.name}</td>
                      <td className="py-3 text-sm text-muted">{test.category}</td>
                      <td className="py-3 text-sm text-foreground text-right font-medium">{test.attempts}</td>
                      <td className="py-3 text-sm text-muted text-right">
                        {test.platformBreakdown.web}/{test.platformBreakdown.ios}/{test.platformBreakdown.android}
                      </td>
                      <td className="py-3 text-sm text-foreground text-right">{test.avgScore}%</td>
                      <td className="py-3 text-sm text-right">
                        <span className="text-green-500 font-medium">{test.completion}%</span>
                      </td>
                      <td className="py-3 text-center">
                        <Button variant="ghost" size="sm">Детали</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            Детали теста: {selectedTest.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Попыток за период"
              value={selectedTest.attempts}
              icon={<TrendingUp className="w-6 h-6" />}
              trend={{ value: 12.3, direction: "up" }}
            />
            <KPICard
              title="Уникальных пользователей"
              value={uniqueUsers}
              icon={<Users className="w-6 h-6" />}
              trend={{ value: 8.7, direction: "up" }}
            />
            <KPICard
              title="Средний балл"
              value={`${selectedTest.avgScore}%`}
              icon={<CheckCircle className="w-6 h-6" />}
              trend={{ value: -1.2, direction: "down" }}
            />
            <KPICard
              title="Самый сложный вопрос"
              value={`#${hardestQuestion.question} (${hardestQuestion.accuracy}%)`}
              icon={<Clock className="w-6 h-6" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Прохождения по дням</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={selectedTestDailyData}>
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
                    <Line
                      type="monotone"
                      dataKey="attempts"
                      stroke="#2563EB"
                      strokeWidth={3}
                      name="Попытки"
                      dot={{ fill: "#2563EB", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>% правильных ответов по вопросам</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={questionAccuracy}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="question" stroke="#9CA3AF" label={{ value: "Вопрос", position: "insideBottom", offset: -5 }} />
                    <YAxis stroke="#9CA3AF" label={{ value: "% правильных", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B1120",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="accuracy"
                      fill="#2563EB"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
