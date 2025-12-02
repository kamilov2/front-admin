"use client";

import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, HelpCircle } from "lucide-react";

const questions = [
  { id: 1, text: "Чему равна производная функции f(x) = x²?", test: "ЕНТ Математика 2025", type: "Один ответ", difficulty: "Легкий" },
  { id: 2, text: "Второй закон Ньютона формулируется как:", test: "Физика 11 класс", type: "Один ответ", difficulty: "Средний" },
  { id: 3, text: "В каком году образовалось Казахское ханство?", test: "История Казахстана", type: "Один ответ", difficulty: "Средний" },
  { id: 4, text: "Какие органеллы отвечают за фотосинтез?", test: "Биология ЕНТ", type: "Несколько ответов", difficulty: "Сложный" },
];

export default function QuestionsPage() {
  return (
    <>
      <AdminHeader title="Вопросы">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Поиск вопроса..."
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Создать вопрос
          </Button>
        </div>
      </AdminHeader>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Все вопросы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="p-4 rounded-lg border border-border hover:border-accent-blue/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-accent-blue/10">
                      <HelpCircle className="w-5 h-5 text-accent-blue" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">
                        {question.text}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted">
                        <span>Тест: {question.test}</span>
                        <span>•</span>
                        <span>Тип: {question.type}</span>
                        <span>•</span>
                        <span
                          className={`px-2 py-1 rounded-full ${
                            question.difficulty === "Легкий"
                              ? "bg-green-500/20 text-green-400"
                              : question.difficulty === "Средний"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {question.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Изменить</Button>
                      <Button variant="ghost" size="sm">Удалить</Button>
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
