"use client";

import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileSpreadsheet,
  FileText,
  File,
  Calendar,
  BarChart3,
  Users,
  FileCheck,
  TrendingUp,
  Clock,
} from "lucide-react";

const reportTypes = [
  {
    id: 1,
    title: "Полный отчёт по аналитике",
    description: "Включает все метрики, графики и статистику за выбранный период",
    icon: BarChart3,
    formats: ["PDF", "Excel", "CSV"],
    lastGenerated: "2 часа назад",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Отчёт по пользователям",
    description: "Активность, прогресс и статистика пользователей",
    icon: Users,
    formats: ["Excel", "CSV"],
    lastGenerated: "5 часов назад",
    size: "1.2 MB",
  },
  {
    id: 3,
    title: "Отчёт по тестам",
    description: "Статистика прохождений, результаты и сложность вопросов",
    icon: FileCheck,
    formats: ["PDF", "Excel"],
    lastGenerated: "1 день назад",
    size: "3.1 MB",
  },
  {
    id: 4,
    title: "Финансовый отчёт",
    description: "Доходы, расходы и финансовые показатели",
    icon: TrendingUp,
    formats: ["Excel", "PDF"],
    lastGenerated: "3 дня назад",
    size: "890 KB",
  },
];

const quickReports = [
  { title: "Дневной отчёт", period: "Сегодня", icon: Calendar },
  { title: "Недельный отчёт", period: "7 дней", icon: Calendar },
  { title: "Месячный отчёт", period: "30 дней", icon: Calendar },
  { title: "Квартальный отчёт", period: "90 дней", icon: Calendar },
];

const scheduledReports = [
  {
    id: 1,
    name: "Еженедельный отчёт по аналитике",
    schedule: "Каждый понедельник в 09:00",
    recipients: "admin@megamozg.kz, analytics@megamozg.kz",
    format: "PDF",
    status: "active",
  },
  {
    id: 2,
    name: "Месячный отчёт по пользователям",
    schedule: "1-го числа каждого месяца в 10:00",
    recipients: "team@megamozg.kz",
    format: "Excel",
    status: "active",
  },
  {
    id: 3,
    name: "Квартальный финансовый отчёт",
    schedule: "Первый день квартала в 12:00",
    recipients: "finance@megamozg.kz",
    format: "PDF + Excel",
    status: "paused",
  },
];

export default function ReportsPage() {
  const getFormatIcon = (format: string) => {
    if (format === "PDF") return <FileText className="w-4 h-4" />;
    if (format === "Excel") return <FileSpreadsheet className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <>
      <AdminHeader title="Отчёты и экспорт">
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Настроить период
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Создать новый отчёт
          </Button>
        </div>
      </AdminHeader>

      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Быстрые отчёты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickReports.map((report, index) => {
              const Icon = report.icon;
              return (
                <Card
                  key={index}
                  className="hover:border-accent-blue/50 transition-colors cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-accent-blue/10 flex items-center justify-center group-hover:bg-accent-blue/20 transition-colors">
                        <Icon className="w-6 h-6 text-accent-blue" />
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {report.title}
                    </h3>
                    <p className="text-sm text-muted">{report.period}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Доступные отчёты</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <Card key={report.id} className="hover:border-accent-blue/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-foreground mb-1">
                          {report.title}
                        </h3>
                        <p className="text-sm text-muted mb-3">{report.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          {report.formats.map((format) => (
                            <span
                              key={format}
                              className="px-2 py-1 rounded bg-card border border-border text-xs font-medium text-foreground flex items-center gap-1"
                            >
                              {getFormatIcon(format)}
                              {format}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {report.lastGenerated}
                            </span>
                            <span>{report.size}</span>
                          </div>
                          <Button size="sm" className="gap-2">
                            <Download className="w-3 h-3" />
                            Скачать
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Запланированные отчёты</CardTitle>
            <Button variant="outline" size="sm">Добавить расписание</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-lg border border-border hover:border-accent-blue/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-sm font-semibold text-foreground">{report.name}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {report.status === "active" ? "Активен" : "Приостановлен"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs text-muted">
                        <div>
                          <span className="block mb-1 text-foreground font-medium">Расписание</span>
                          {report.schedule}
                        </div>
                        <div>
                          <span className="block mb-1 text-foreground font-medium">Получатели</span>
                          {report.recipients}
                        </div>
                        <div>
                          <span className="block mb-1 text-foreground font-medium">Формат</span>
                          {report.format}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Изменить</Button>
                      <Button variant="ghost" size="sm">
                        {report.status === "active" ? "Остановить" : "Запустить"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
