"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { AnalyticsFilters } from "@/components/analytics-filters";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock, CheckCircle, Brain } from "lucide-react";

const kpiData = [
  {
    title: "Тестов на сессию",
    value: "2.84",
    trend: { value: 7.2, direction: "up" as const },
    icon: <Target className="w-6 h-6" />,
  },
  {
    title: "Средняя длительность сессии",
    value: "19:47",
    trend: { value: 5.8, direction: "up" as const },
    icon: <Clock className="w-6 h-6" />,
  },
  {
    title: "% дошедших до результата",
    value: "84.3%",
    trend: { value: 3.1, direction: "up" as const },
    icon: <CheckCircle className="w-6 h-6" />,
  },
  {
    title: "% открывших ИИ-объяснения",
    value: "41.7%",
    trend: { value: 12.5, direction: "up" as const },
    icon: <Brain className="w-6 h-6" />,
  },
];

const funnelData = [
  {
    step: 1,
    name: "Зашёл на сайт/в приложение",
    value: 10000,
    percentage: 100,
    color: "#2563EB",
  },
  {
    step: 2,
    name: "Открыл страницу теста",
    value: 7800,
    percentage: 78,
    color: "#3B82F6",
  },
  {
    step: 3,
    name: "Начал тест",
    value: 6500,
    percentage: 65,
    color: "#60A5FA",
  },
  {
    step: 4,
    name: "Завершил тест",
    value: 5480,
    percentage: 54.8,
    color: "#93C5FD",
  },
  {
    step: 5,
    name: "Открыл разбор + ИИ",
    value: 2285,
    percentage: 22.85,
    color: "#DBEAFE",
  },
];

export default function AnalyticsUsersPage() {
  const [period, setPeriod] = useState("7days");
  const [platform, setPlatform] = useState("all");

  return (
    <>
      <AdminHeader title="Аналитика — Пользователи">
        <AnalyticsFilters
          period={period}
          onPeriodChange={setPeriod}
          platform={platform}
          onPlatformChange={setPlatform}
        />
      </AdminHeader>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Воронка пользовательского пути</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-w-4xl mx-auto py-8">
              {funnelData.map((step, index) => {
                const dropoff = index > 0 ? funnelData[index - 1].value - step.value : 0;
                const dropoffPercent = index > 0 ? ((dropoff / funnelData[index - 1].value) * 100).toFixed(1) : 0;

                return (
                  <div key={step.step} className="relative">
                    <div className="relative">
                      <div
                        className="mx-auto rounded-lg transition-all duration-300 hover:opacity-90"
                        style={{
                          width: `${step.percentage}%`,
                          backgroundColor: step.color,
                          height: "80px",
                        }}
                      >
                        <div className="flex items-center justify-between h-full px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                              {step.step}
                            </div>
                            <div>
                              <p className="text-white font-semibold text-base">
                                {step.name}
                              </p>
                              <p className="text-white/80 text-sm mt-1">
                                {step.value.toLocaleString()} пользователей
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold text-2xl">
                              {step.percentage}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {index > 0 && dropoff > 0 && (
                        <div className="absolute -top-6 right-0 text-sm">
                          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-medium">
                            ↓ {dropoffPercent}% отвалилось ({dropoff.toLocaleString()})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border">
                <p className="text-sm text-muted mb-1">Общая конверсия</p>
                <p className="text-2xl font-bold text-foreground">
                  {((funnelData[4].value / funnelData[0].value) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-muted mt-1">
                  От входа до ИИ-разбора
                </p>
              </div>

              <div className="p-4 rounded-lg bg-card border border-border">
                <p className="text-sm text-muted mb-1">Конверсия в тест</p>
                <p className="text-2xl font-bold text-foreground">
                  {((funnelData[2].value / funnelData[0].value) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-muted mt-1">
                  От входа до начала теста
                </p>
              </div>

              <div className="p-4 rounded-lg bg-card border border-border">
                <p className="text-sm text-muted mb-1">Завершаемость теста</p>
                <p className="text-2xl font-bold text-foreground">
                  {((funnelData[3].value / funnelData[2].value) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-muted mt-1">
                  Из начавших тест
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ключевые инсайты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="font-medium text-foreground">
                    Высокая конверсия в начало теста
                  </p>
                  <p className="text-sm text-muted mt-1">
                    83% пользователей, открывших страницу теста, начинают его проходить. Это отличный показатель вовлечённости.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                <div>
                  <p className="font-medium text-foreground">
                    Возможность улучшения на этапе завершения
                  </p>
                  <p className="text-sm text-muted mt-1">
                    15% пользователей не доходят до конца теста. Рекомендуется провести анализ причин: сложность, длительность или технические проблемы.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="font-medium text-foreground">
                    Растущий интерес к ИИ-объяснениям
                  </p>
                  <p className="text-sm text-muted mt-1">
                    41.7% пользователей используют ИИ-разбор ошибок, что на 12.5% больше предыдущего периода. Функция набирает популярность.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
