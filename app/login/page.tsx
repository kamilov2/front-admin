"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Простая валидация
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      setIsLoading(false);
      return;
    }

    if (email.length < 3) {
      setError("Введите корректный email");
      setIsLoading(false);
      return;
    }

    if (password.length < 4) {
      setError("Пароль должен содержать минимум 4 символа");
      setIsLoading(false);
      return;
    }

    // Имитация запроса к API
    setTimeout(() => {
      // Для демо принимаем любой email/пароль
      setSuccess("Вход выполнен успешно!");
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1000);
    }, 1500);
  };

  const handleDemoLogin = () => {
    setEmail("admin@megamozg.kz");
    setPassword("demo1234");
    setError("");
    setTimeout(() => {
      setSuccess("Демо-данные загружены! Нажмите 'Войти'");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card-background to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md relative z-10 shadow-2xl shadow-black/20 border-border/50">
        <CardContent className="p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-cyan mb-4 shadow-lg shadow-accent-blue/30">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Megamozg.kz</h1>
            <p className="text-muted text-sm">Панель администратора</p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="text"
                  placeholder="admin@megamozg.kz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-lg outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all text-foreground placeholder:text-muted"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-card border border-border rounded-lg outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all text-foreground placeholder:text-muted"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full py-6 text-base font-semibold bg-gradient-to-r from-accent-blue to-accent-cyan hover:shadow-lg hover:shadow-accent-blue/30 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Вход...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Войти
                </>
              )}
            </Button>
          </form>

          {/* Demo Login Button */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted">или</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4 py-3 gap-2 hover:bg-accent-blue/5 hover:border-accent-blue/50 transition-all"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <Sparkles className="w-4 h-4" />
              Демо-вход (для теста)
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted">
              © 2025 Megamozg.kz. Все права защищены.
            </p>
            <p className="text-xs text-muted mt-1">
              Панель администратора v1.0.0
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-8 text-xs text-muted z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>Безопасный вход</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>Шифрование данных</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span>24/7 Поддержка</span>
        </div>
      </div>
    </div>
  );
}
