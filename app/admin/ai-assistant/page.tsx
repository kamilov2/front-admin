"use client";

import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/ui/kpi-card";
import {
  Brain,
  MessageSquare,
  Zap,
  DollarSign,
  TrendingUp,
  Settings,
  Save,
  RotateCcw,
  Activity,
  Clock,
} from "lucide-react";

const kpiData = [
  {
    title: "Всего запросов к ИИ",
    value: "12,456",
    trend: { value: 18.5, direction: "up" as const },
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    title: "Запросов сегодня",
    value: "234",
    trend: { value: 12.3, direction: "up" as const },
    icon: <Activity className="w-6 h-6" />,
  },
  {
    title: "Средняя скорость ответа",
    value: "1.8s",
    trend: { value: -5.2, direction: "down" as const },
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: "Расходы за месяц",
    value: "$234.50",
    trend: { value: 8.7, direction: "up" as const },
    icon: <DollarSign className="w-6 h-6" />,
  },
];

const usageStats = [
  { label: "Объяснение ошибок", count: 5234, percentage: 42 },
  { label: "Помощь с вопросами", count: 3456, percentage: 28 },
  { label: "Рекомендации тестов", count: 2345, percentage: 19 },
  { label: "Общие вопросы", count: 1421, percentage: 11 },
];

export default function AIAssistantPage() {
  return (
    <>
      <AdminHeader title="ИИ-Ассистент">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Сбросить настройки
          </Button>
          <Button size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            Сохранить изменения
          </Button>
        </div>
      </AdminHeader>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Основные настройки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Модель GPT
                  </label>
                  <select className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue">
                    <option value="gpt-4o">GPT-4o (Recommended)</option>
                    <option value="gpt-4o-mini">GPT-4o Mini (Faster, Cheaper)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Budget)</option>
                  </select>
                  <p className="text-xs text-muted mt-1">
                    Выбор модели влияет на качество ответов и стоимость
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Температура (Temperature)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      defaultValue="0.7"
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-foreground w-12 text-right">
                      0.7
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    Контролирует креативность ответов (0 = точный, 2 = творческий)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Максимум токенов
                  </label>
                  <input
                    type="number"
                    defaultValue="2000"
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue"
                  />
                  <p className="text-xs text-muted mt-1">
                    Максимальная длина ответа (больше = дороже)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Системный промпт
                  </label>
                  <textarea
                    rows={6}
                    defaultValue="Ты профессиональный учитель, который помогает студентам разбираться с ошибками в тестах. Объясняй просто и понятно, используя примеры. Будь дружелюбным и мотивирующим."
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
                  />
                  <p className="text-xs text-muted mt-1">
                    Инструкция для ИИ о том, как он должен себя вести
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Фильтрация контента</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Блокировать неуместный контент
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Фильтровать ответы с нецензурной лексикой
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Требовать подтверждения администратора
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Модерировать ответы перед отправкой пользователю
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Сохранять историю диалогов
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Записывать все запросы и ответы для аналитики
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Использование по типам</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {usageStats.map((stat, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">{stat.label}</span>
                      <span className="text-sm font-semibold text-foreground">
                        {stat.count}
                      </span>
                    </div>
                    <div className="w-full bg-card rounded-full h-2">
                      <div
                        className="bg-accent-blue h-2 rounded-full transition-all"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted mt-1">{stat.percentage}% от общего</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Производительность</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Средняя скорость</p>
                    <p className="text-2xl font-bold text-foreground">1.8s</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Успешность</p>
                    <p className="text-2xl font-bold text-foreground">98.7%</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Uptime</p>
                    <p className="text-2xl font-bold text-foreground">99.9%</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-accent-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Ключ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      OpenAI API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        defaultValue="sk-proj-...xyzABC"
                        className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      />
                      <Button variant="outline" size="sm">
                        Показать
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-xs text-green-400 flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      Ключ активен и работает корректно
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
