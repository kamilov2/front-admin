"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  GripVertical,
  CheckCircle,
  Circle,
  Type,
  List,
  ListChecks,
  X,
} from "lucide-react";

export type QuestionType = "single" | "multiple" | "text";

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  answers: Answer[];
  correctAnswer?: string; // For text type
  points: number;
}

interface QuestionEditorProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}

export function QuestionEditor({ questions, onChange }: QuestionEditorProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(
    questions.length > 0 ? questions[0].id : null
  );

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      question: "",
      answers: type === "text" ? [] : [
        { id: `a_${Date.now()}_1`, text: "", isCorrect: false },
        { id: `a_${Date.now()}_2`, text: "", isCorrect: false },
      ],
      correctAnswer: type === "text" ? "" : undefined,
      points: 1,
    };
    const updated = [...questions, newQuestion];
    onChange(updated);
    setExpandedQuestion(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, ...updates } : q
    );
    onChange(updated);
  };

  const deleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    onChange(updated);
    if (expandedQuestion === id && updated.length > 0) {
      setExpandedQuestion(updated[0].id);
    }
  };

  const addAnswer = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const newAnswer: Answer = {
      id: `a_${Date.now()}`,
      text: "",
      isCorrect: false,
    };

    updateQuestion(questionId, {
      answers: [...question.answers, newAnswer],
    });
  };

  const updateAnswer = (
    questionId: string,
    answerId: string,
    updates: Partial<Answer>
  ) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const updatedAnswers = question.answers.map((a) =>
      a.id === answerId ? { ...a, ...updates } : a
    );

    // For single choice, only one answer can be correct
    if (question.type === "single" && updates.isCorrect) {
      updatedAnswers.forEach((a) => {
        if (a.id !== answerId) a.isCorrect = false;
      });
    }

    updateQuestion(questionId, { answers: updatedAnswers });
  };

  const deleteAnswer = (questionId: string, answerId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    updateQuestion(questionId, {
      answers: question.answers.filter((a) => a.id !== answerId),
    });
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    const updated = [...questions];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case "single":
        return <Circle className="w-4 h-4" />;
      case "multiple":
        return <ListChecks className="w-4 h-4" />;
      case "text":
        return <Type className="w-4 h-4" />;
    }
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case "single":
        return "Одиночный выбор";
      case "multiple":
        return "Множественный выбор";
      case "text":
        return "Текстовый ответ";
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Question Buttons */}
      <div className="flex gap-2 p-4 bg-card border border-border rounded-lg">
        <Button
          type="button"
          variant="outline"
          onClick={() => addQuestion("single")}
          className="gap-2 flex-1"
        >
          <Circle className="w-4 h-4" />
          Одиночный выбор
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => addQuestion("multiple")}
          className="gap-2 flex-1"
        >
          <ListChecks className="w-4 h-4" />
          Множественный выбор
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => addQuestion("text")}
          className="gap-2 flex-1"
        >
          <Type className="w-4 h-4" />
          Текстовый ответ
        </Button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="p-8 text-center bg-card border border-border rounded-lg">
          <List className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="text-muted">
            Нет вопросов. Добавьте первый вопрос используя кнопки выше.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => {
            const isExpanded = expandedQuestion === question.id;
            const correctCount = question.answers.filter((a) => a.isCorrect).length;

            return (
              <div
                key={question.id}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                {/* Question Header */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-card/50 transition-colors"
                  onClick={() =>
                    setExpandedQuestion(isExpanded ? null : question.id)
                  }
                >
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveQuestion(index, "up");
                      }}
                      disabled={index === 0}
                    >
                      <GripVertical className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveQuestion(index, "down");
                      }}
                      disabled={index === questions.length - 1}
                    >
                      <GripVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1 bg-accent-blue/10 border border-accent-blue/20 rounded-full">
                    {getQuestionTypeIcon(question.type)}
                    <span className="text-xs font-medium text-accent-blue">
                      {getQuestionTypeLabel(question.type)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {question.question || `Вопрос ${index + 1}`}
                    </p>
                    <p className="text-xs text-muted">
                      {question.type === "text"
                        ? "Свободный ответ"
                        : `${question.answers.length} вариантов • ${correctCount} правильных`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">
                      {question.points} {question.points === 1 ? "балл" : "баллов"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuestion(question.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Question Body */}
                {isExpanded && (
                  <div className="p-4 pt-0 space-y-4 border-t border-border">
                    {/* Question Text */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Текст вопроса *
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(question.id, { question: e.target.value })
                        }
                        placeholder="Введите текст вопроса..."
                        rows={3}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground placeholder:text-muted resize-none"
                      />
                    </div>

                    {/* Points */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Баллы за вопрос
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            points: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                        className="w-24 px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground"
                      />
                    </div>

                    {/* Answers (for single/multiple choice) */}
                    {question.type !== "text" && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-foreground">
                            Варианты ответов
                            {question.type === "multiple" && (
                              <span className="ml-2 text-xs text-accent-blue">
                                (можно выбрать несколько правильных)
                              </span>
                            )}
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addAnswer(question.id)}
                            className="gap-2"
                          >
                            <Plus className="w-3 h-3" />
                            Добавить вариант
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {question.answers.map((answer) => (
                            <div
                              key={answer.id}
                              className="flex items-center gap-2 p-2 bg-background border border-border rounded-lg"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateAnswer(question.id, answer.id, {
                                    isCorrect: !answer.isCorrect,
                                  })
                                }
                                className={`h-8 w-8 p-0 ${
                                  answer.isCorrect
                                    ? "text-green-400"
                                    : "text-muted"
                                }`}
                                title={
                                  answer.isCorrect
                                    ? "Правильный ответ"
                                    : "Отметить как правильный"
                                }
                              >
                                {answer.isCorrect ? (
                                  <CheckCircle className="w-5 h-5" />
                                ) : (
                                  <Circle className="w-5 h-5" />
                                )}
                              </Button>

                              <input
                                type="text"
                                value={answer.text}
                                onChange={(e) =>
                                  updateAnswer(question.id, answer.id, {
                                    text: e.target.value,
                                  })
                                }
                                placeholder="Введите вариант ответа..."
                                className="flex-1 px-3 py-2 bg-card border border-border rounded outline-none focus:border-accent-blue transition-colors text-foreground placeholder:text-muted"
                              />

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  deleteAnswer(question.id, answer.id)
                                }
                                disabled={question.answers.length <= 2}
                                className="text-red-400 hover:text-red-300"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Text Answer */}
                    {question.type === "text" && (
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Правильный ответ (для проверки)
                        </label>
                        <input
                          type="text"
                          value={question.correctAnswer || ""}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              correctAnswer: e.target.value,
                            })
                          }
                          placeholder="Введите правильный ответ (необязательно)..."
                          className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground placeholder:text-muted"
                        />
                        <p className="text-xs text-muted mt-1">
                          Оставьте пустым, если проверка будет вручную
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {questions.length > 0 && (
        <div className="p-4 bg-accent-blue/10 border border-accent-blue/20 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">
              Всего вопросов: {questions.length}
            </span>
            <span className="text-muted">
              Общий балл:{" "}
              {questions.reduce((sum, q) => sum + q.points, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
