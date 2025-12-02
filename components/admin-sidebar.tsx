"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  HelpCircle,
  BarChart3,
  Settings,
  Bell,
  Download,
  Shield,
  Brain,
  Activity,
  ChevronDown,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Аналитика",
    href: "/admin/analytics",
    icon: BarChart3,
    submenu: [
      { title: "Overview", href: "/admin/analytics/overview", icon: Activity },
      { title: "Платформы", href: "/admin/analytics/platforms", icon: Shield },
      { title: "Тесты", href: "/admin/analytics/tests", icon: FileText },
    ],
  },
  {
    title: "Тесты",
    href: "/admin/tests",
    icon: FileText,
  },
  {
    title: "Категории",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Вопросы",
    href: "/admin/questions",
    icon: HelpCircle,
  },
  {
    title: "Статьи",
    href: "/admin/articles",
    icon: BookOpen,
  },
  {
    title: "Учебные материалы",
    href: "/admin/materials",
    icon: GraduationCap,
  },
  {
    title: "ИИ-Ассистент",
    href: "/admin/ai-assistant",
    icon: Brain,
  },
  {
    title: "Отчёты",
    href: "/admin/reports",
    icon: Download,
  },
  {
    title: "Уведомления",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Настройки",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["/admin/analytics"]);

  const toggleMenu = (href: string) => {
    setExpandedMenus((prev) =>
      prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]
    );
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/admin/dashboard">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Megamozg</h1>
              <p className="text-xs text-muted">Admin Panel</p>
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const isExpanded = expandedMenus.includes(item.href);

          return (
            <div key={item.href}>
              <Link
                href={item.submenu ? "#" : item.href}
                onClick={(e) => {
                  if (item.submenu) {
                    e.preventDefault();
                    toggleMenu(item.href);
                  }
                }}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all",
                  "hover:bg-card hover:text-foreground group",
                  isActive
                    ? "bg-accent-blue text-white shadow-lg shadow-accent-blue/20"
                    : "text-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.title}</span>
                </div>
                {item.submenu && (
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isExpanded ? "rotate-180" : ""
                    )}
                  />
                )}
              </Link>

              {item.submenu && isExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.submenu.map((subItem) => {
                    const SubIcon = subItem.icon || Activity;
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors",
                          "hover:bg-card hover:text-foreground",
                          isSubActive
                            ? "bg-card text-accent-cyan font-medium border-l-2 border-accent-cyan"
                            : "text-muted"
                        )}
                      >
                        <SubIcon className="w-4 h-4" />
                        {subItem.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted text-center space-y-1">
          <p className="font-semibold text-foreground">© 2025 Megamozg.kz</p>
          <p className="text-[10px]">Admin Panel v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
