"use client";

import { AdminHeader } from "@/components/admin-header";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  Brain,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUp,
  ArrowDown,
  Activity,
  Calendar,
  Download,
  AlertCircle,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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

const platformStats = [
  { platform: "Web", users: 4521, tests: 12345, percentage: 52 },
  { platform: "iOS", users: 2134, tests: 6782, percentage: 28 },
  { platform: "Android", users: 1687, tests: 5440, percentage: 20 },
];

const categoryData = [
  { name: "Математика", value: 35, color: "#2563EB", tests: 245 },
  { name: "Физика", value: 25, color: "#38BDF8", tests: 176 },
  { name: "История", value: 20, color: "#60A5FA", tests: 140 },
  { name: "Биология", value: 12, color: "#93C5FD", tests: 84 },
  { name: "Химия", value: 8, color: "#DBEAFE", tests: 56 },
];

const topTests = [
  { name: "ЕНТ Математика 2025", platform: "web", attempts: 1234, avgScore: 75, completion: 89, trend: 12 },
  { name: "Физика 11 класс", platform: "ios", attempts: 987, avgScore: 68, completion: 82, trend: -3 },
  { name: "История Казахстана", platform: "android", attempts: 856, avgScore: 71, completion: 85, trend: 8 },
  { name: "Биология ЕНТ", platform: "web", attempts: 743, avgScore: 79, completion: 91, trend: 15 },
  { name: "Химия базовый", platform: "ios", attempts: 621, avgScore: 65, completion: 78, trend: -5 },
];

const recentActivity = [
  { action: "Новый тест создан", user: "Алексей И.", time: "5 мин назад", type: "success" },
  { action: "Пользователь зарегистрирован", user: "Айгерим Н.", time: "15 мин назад", type: "info" },
  { action: "Отчёт сформирован", user: "Система", time: "30 мин назад", type: "success" },
  { action: "Высокая нагрузка на сервер", user: "Система", time: "1 час назад", type: "warning" },
];

const performanceData = [
  { metric: "Точность", value: 85 },
  { metric: "Скорость", value: 92 },
  { metric: "Качество", value: 78 },
  { metric: "Вовлечённость", value: 88 },
  { metric: "Удержание", value: 76 },
];

const hourlyActivity = [
  { hour: "00:00", value: 45 }, { hour: "03:00", value: 12 }, { hour: "06:00", value: 42 },
  { hour: "09:00", value: 234 }, { hour: "12:00", value: 280 }, { hour: "15:00", value: 315 },
  { hour: "18:00", value: 420 }, { hour: "21:00", value: 275 }, { hour: "23:00", value: 102 },
];

export default function DashboardPage() {
  const getPlatformIcon = (platform: string) => {
    if (platform === "web") return <Monitor className="w-4 h-4" />;
    if (platform === "ios") return <Smartphone className="w-4 h-4" />;
    return <Tablet className="w-4 h-4" />;
  };

  return (
    <>
      <AdminHeader title="Dashboard">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            Последние 7 дней
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Экспорт отчёта
          </Button>
        </div>
      </AdminHeader>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiData.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Активность пользователей</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">День</Button>
                <Button variant="default" size="sm">Неделя</Button>
                <Button variant="outline" size="sm">Месяц</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="colorWeb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorIOS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAndroid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <Area type="monotone" dataKey="web" stroke="#2563EB" fillOpacity={1} fill="url(#colorWeb)" strokeWidth={2} />
                  <Area type="monotone" dataKey="ios" stroke="#38BDF8" fillOpacity={1} fill="url(#colorIOS)" strokeWidth={2} />
                  <Area type="monotone" dataKey="android" stroke="#60A5FA" fillOpacity={1} fill="url(#colorAndroid)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Распределение по платформам</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="percentage"
                    label={({ payload, percent }) => `${payload.platform} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  >
                    <Cell fill="#2563EB" />
                    <Cell fill="#38BDF8" />
                    <Cell fill="#60A5FA" />
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика по платформам</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {platformStats.map((platform, index) => (
                <div key={index} className="p-4 rounded-lg border border-border hover:border-accent-blue/50 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
                        {getPlatformIcon(platform.platform.toLowerCase())}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{platform.platform}</p>
                        <p className="text-xs text-muted">{platform.users.toLocaleString()} пользователей</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{platform.tests.toLocaleString()}</p>
                      <p className="text-xs text-muted">тестов</p>
                    </div>
                  </div>
                  <div className="w-full bg-card rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-accent-blue to-accent-cyan h-2 rounded-full transition-all group-hover:shadow-lg group-hover:shadow-accent-blue/30"
                      style={{ width: `${platform.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Показатели производительности</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={performanceData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" />
                  <PolarRadiusAxis stroke="#9CA3AF" />
                  <Radar name="Производительность" dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.3} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1120",
                      border: "1px solid #1e293b",
                      borderRadius: "8px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Популярные категории</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryData.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Star className="w-4 h-4" style={{ color: category.color }} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted">{category.tests} тестов</span>
                      <span className="text-sm font-semibold text-foreground">{category.value}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-card rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${category.value}%`,
                        backgroundColor: category.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Топ-5 тестов по популярности</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topTests.map((test, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-border hover:border-accent-blue/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{test.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getPlatformIcon(test.platform)}
                          <span className="text-xs text-muted capitalize">{test.platform}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {test.trend > 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${test.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(test.trend)}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted">Попыток</p>
                      <p className="text-sm font-semibold text-foreground">{test.attempts}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Балл</p>
                      <p className="text-sm font-semibold text-foreground">{test.avgScore}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Завершено</p>
                      <p className="text-sm font-semibold text-green-400">{test.completion}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Активность по часам</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={hourlyActivity}>
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
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Последняя активность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-card transition-colors">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.type === "success"
                        ? "bg-green-500/20 text-green-400"
                        : activity.type === "warning"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {activity.type === "warning" ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted mt-1">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
