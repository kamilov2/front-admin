"use client";

import { Bell, Search, User } from "lucide-react";
import { Button } from "./ui/button";

interface AdminHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function AdminHeader({ title, children }: AdminHeaderProps) {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {children && (
        <div className="px-6 pb-4">
          {children}
        </div>
      )}
    </header>
  );
}
