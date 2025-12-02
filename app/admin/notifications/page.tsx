"use client";

import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  BellRing,
  Check,
  X,
  Send,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  FileText,
  Settings,
  Clock,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "success",
    title: "Новая регистрация пользователя",
    message: "Пользователь Айгерим Нурланова успешно зарегистрировалась",
    time: "5 минут назад",
    read: false,
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "warning",
    title: "Высокая нагрузка на сервер",
    message: "Обнаружена повышенная активность. Рекомендуется проверить логи",
    time: "15 минут назад",
    read: false,
    icon: AlertCircle,
  },
  {
    id: 3,
    type: "info",
    title: "Новый тест опубликован",
    message: "Тест 'Математика ЕНТ 2025' был успешно опубликован",
    time: "1 час назад",
    read: false,
    icon: FileText,
  },
  {
    id: 4,
    type: "success",
    title: "Отчёт сформирован",
    message: "Недельный отчёт по аналитике готов к скачиванию",
    time: "2 часа назад",
    read: true,
    icon: TrendingUp,
  },
  {
    id: 5,
    type: "info",
    title: "Обновление системы",
    message: "Запланировано обновление системы на 23:00 сегодня",
    time: "3 часа назад",
    read: true,
    icon: Settings,
  },
];

const notificationTemplates = [
  {
    id: 1,
    name: "Новый тест доступен",
    description: "Уведомление о публикации нового теста",
    recipients: "Все пользователи",
    enabled: true,
  },
  {
    id: 2,
    name: "Результаты теста",
    description: "Отправка результатов после прохождения теста",
    recipients: "Пользователь",
    enabled: true,
  },
  {
    id: 3,
    name: "Еженедельная сводка",
    description: "Еженедельная статистика пользователя",
    recipients: "Активные пользователи",
    enabled: false,
  },
  {
    id: 4,
    name: "Системные обновления",
    description: "Уведомления об обновлениях и обслуживании",
    recipients: "Все пользователи",
    enabled: true,
  },
];

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <>
      <AdminHeader title="Уведомления">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-accent-blue/10 border border-accent-blue/30 rounded-lg">
            <BellRing className="w-4 h-4 text-accent-blue" />
            <span className="text-sm font-medium text-accent-blue">
              {unreadCount} непрочитанных
            </span>
          </div>
          <Button variant="outline" size="sm">
            <Check className="w-4 h-4 mr-2" />
            Отметить все прочитанными
          </Button>
          <Button size="sm" className="gap-2">
            <Send className="w-4 h-4" />
            Создать уведомление
          </Button>
        </div>
      </AdminHeader>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-semibold text-foreground mb-4">Последние уведомления</h2>
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "hover:border-accent-blue/50 transition-colors cursor-pointer",
                    !notification.read && "border-l-4 border-l-accent-blue"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center border",
                          getTypeColor(notification.type)
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-sm font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-accent-blue"></span>
                            )}
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted mb-2">{notification.message}</p>
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <Clock className="w-3 h-3" />
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Шаблоны уведомлений</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notificationTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-3 rounded-lg border border-border hover:border-accent-blue/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-1">
                          {template.name}
                        </h4>
                        <p className="text-xs text-muted mb-2">{template.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted">
                          <Users className="w-3 h-3" />
                          {template.recipients}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked={template.enabled}
                        />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-blue"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted">Отправлено сегодня</span>
                    <span className="text-sm font-semibold text-foreground">245</span>
                  </div>
                  <div className="w-full bg-card rounded-full h-2">
                    <div className="bg-accent-blue h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted">Прочитано</span>
                    <span className="text-sm font-semibold text-foreground">189</span>
                  </div>
                  <div className="w-full bg-card rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted">Кликабельность</span>
                    <span className="text-sm font-semibold text-foreground">45%</span>
                  </div>
                  <div className="w-full bg-card rounded-full h-2">
                    <div className="bg-accent-cyan h-2 rounded-full" style={{ width: "45%" }}></div>
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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
