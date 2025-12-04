"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { translateWithDebounce } from "@/lib/translator";
import {
  Plus,
  Trash2,
  GripVertical,
  CheckCircle,
  Circle,
  Type,
  ListChecks,
  Image as ImageIcon,
  Upload,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export type QuestionType = "single" | "multiple" | "text";

export interface Answer {
  id: string;
  text_ru: string;
  text_kz: string;
  isCorrect: boolean;
  image?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question_ru: string;
  question_kz: string;
  question_image?: string;
  answers: Answer[];
  correctAnswer_ru?: string;
  correctAnswer_kz?: string;
  points: number;
}

interface BilingualQuestionEditorProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}

export function BilingualQuestionEditor({
  questions,
  onChange,
}: BilingualQuestionEditorProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(
    questions.length > 0 ? questions[0].id : null
  );
  const [autoTranslate, setAutoTranslate] = useState<boolean>(true);
  const [translating, setTranslating] = useState<Set<string>>(new Set());
  const questionImageInputRef = useRef<HTMLInputElement>(null);
  const answerImageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImageFor, setUploadingImageFor] = useState<{
    questionId: string;
    answerId?: string;
  } | null>(null);

  // Автоматический перевод вопроса
  const autoTranslateQuestion = useCallback(
    (questionId: string, text: string, from: "ru" | "kz", to: "ru" | "kz") => {
      if (!autoTranslate || !text.trim()) return;

      const translationKey = `question-${questionId}-${from}-${to}`;
      setTranslating((prev) => new Set(prev).add(translationKey));

      translateWithDebounce(
        text,
        from,
        to,
        (translated) => {
          updateQuestion(questionId, 
            to === "ru" 
              ? { question_ru: translated } 
              : { question_kz: translated }
          );
          setTranslating((prev) => {
            const newSet = new Set(prev);
            newSet.delete(translationKey);
            return newSet;
          });
        },
        1500 // Задержка 1.5 секунд
      );
    },
    [autoTranslate]
  );

  // Автоматический перевод ответа
  const autoTranslateAnswer = useCallback(
    (
      questionId: string,
      answerId: string,
      text: string,
      from: "ru" | "kz",
      to: "ru" | "kz"
    ) => {
      if (!autoTranslate || !text.trim()) return;

      const translationKey = `answer-${questionId}-${answerId}-${from}-${to}`;
      setTranslating((prev) => new Set(prev).add(translationKey));

      translateWithDebounce(
        text,
        from,
        to,
        (translated) => {
          updateAnswer(questionId, answerId,
            to === "ru"
              ? { text_ru: translated }
              : { text_kz: translated }
          );
          setTranslating((prev) => {
            const newSet = new Set(prev);
            newSet.delete(translationKey);
            return newSet;
          });
        },
        1500
      );
    },
    [autoTranslate]
  );

  // Автоматический перевод правильного ответа (для текстового типа)
  const autoTranslateCorrectAnswer = useCallback(
    (questionId: string, text: string, from: "ru" | "kz", to: "ru" | "kz") => {
      if (!autoTranslate || !text.trim()) return;

      const translationKey = `correct-${questionId}-${from}-${to}`;
      setTranslating((prev) => new Set(prev).add(translationKey));

      translateWithDebounce(
        text,
        from,
        to,
        (translated) => {
          updateQuestion(questionId,
            to === "ru"
              ? { correctAnswer_ru: translated }
              : { correctAnswer_kz: translated }
          );
          setTranslating((prev) => {
            const newSet = new Set(prev);
            newSet.delete(translationKey);
            return newSet;
          });
        },
        1500
      );
    },
    [autoTranslate]
  );

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      question_ru: "",
      question_kz: "",
      answers:
        type === "text"
          ? []
          : [
              {
                id: `a_${Date.now()}_1`,
                text_ru: "",
                text_kz: "",
                isCorrect: false,
              },
              {
                id: `a_${Date.now()}_2`,
                text_ru: "",
                text_kz: "",
                isCorrect: false,
              },
            ],
      correctAnswer_ru: type === "text" ? "" : undefined,
      correctAnswer_kz: type === "text" ? "" : undefined,
      points: 1,
    };
    const updated = [...questions, newQuestion];
    onChange(updated);
    setExpandedQuestion(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    const updated = questions.map((q) => (q.id === id ? { ...q, ...updates } : q));
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
      text_ru: "",
      text_kz: "",
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

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: string,
    answerId?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите файл изображения");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;

      if (answerId) {
        updateAnswer(questionId, answerId, { image: imageUrl });
      } else {
        updateQuestion(questionId, { question_image: imageUrl });
      }

      setUploadingImageFor(null);
    };
    reader.readAsDataURL(file);

    if (questionImageInputRef.current) {
      questionImageInputRef.current.value = "";
    }
    if (answerImageInputRef.current) {
      answerImageInputRef.current.value = "";
    }
  };

  const removeImage = (questionId: string, answerId?: string) => {
    if (answerId) {
      updateAnswer(questionId, answerId, { image: undefined });
    } else {
      updateQuestion(questionId, { question_image: undefined });
    }
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
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addQuestion("single")}
          className="gap-2"
        >
          <Circle className="w-4 h-4" />
          Одиночный выбор
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addQuestion("multiple")}
          className="gap-2"
        >
          <ListChecks className="w-4 h-4" />
          Множественный выбор
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addQuestion("text")}
          className="gap-2"
        >
          <Type className="w-4 h-4" />
          Текстовый ответ
        </Button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent-blue/10 flex items-center justify-center">
              <Plus className="w-8 h-8 text-accent-blue" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">
                Нет вопросов
              </p>
              <p className="text-sm text-muted">
                Добавьте первый вопрос, используя кнопки выше
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => {
            const isExpanded = expandedQuestion === question.id;

            return (
              <Card
                key={question.id}
                className={`transition-all ${
                  isExpanded ? "ring-2 ring-accent-blue" : ""
                }`}
              >
                {/* Question Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-card/50 transition-colors"
                  onClick={() =>
                    setExpandedQuestion(isExpanded ? null : question.id)
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 mt-1">
                      <GripVertical className="w-4 h-4 text-muted cursor-grab" />
                      <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-accent-blue">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getQuestionTypeIcon(question.type)}
                        <span className="text-xs text-muted">
                          {getQuestionTypeLabel(question.type)}
                        </span>
                        <span className="text-xs text-muted">•</span>
                        <span className="text-xs text-accent-blue">
                          {question.points}{" "}
                          {question.points === 1 ? "балл" : "балла"}
                        </span>
                      </div>
                      <p className="text-sm text-foreground font-medium truncate">
                        {question.question_ru || question.question_kz || "Введите вопрос..."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestion(index, "up");
                        }}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestion(index, "down");
                        }}
                        disabled={index === questions.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm("Вы уверены, что хотите удалить этот вопрос?")
                          ) {
                            deleteQuestion(question.id);
                          }
                        }}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Question Content (Expanded) */}
                {isExpanded && (
                  <div className="border-t border-border p-4 space-y-4">
                    {/* Question Text */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-foreground">
                        Текст вопроса
                      </label>

                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted">RU</span>
                          </div>
                          <textarea
                            value={question.question_ru}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              updateQuestion(question.id, {
                                question_ru: newValue,
                              });
                              // Автоперевод на казахский
                              if (autoTranslate) {
                                autoTranslateQuestion(question.id, newValue, "ru", "kz");
                              }
                            }}
                            placeholder="Введите вопрос на русском..."
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
                            rows={2}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted">KZ</span>
                          </div>
                          <textarea
                            value={question.question_kz}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              updateQuestion(question.id, {
                                question_kz: newValue,
                              });
                              // Автоперевод на русский
                              if (autoTranslate) {
                                autoTranslateQuestion(question.id, newValue, "kz", "ru");
                              }
                            }}
                            placeholder="Қазақ тілінде сұрақты енгізіңіз..."
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Question Image */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Изображение к вопросу (опционально)
                      </label>
                      {question.question_image ? (
                        <div className="relative inline-block">
                          <img
                            src={question.question_image}
                            alt="Question"
                            className="max-w-xs rounded-lg border border-border"
                          />
                          <button
                            onClick={() => removeImage(question.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input
                            ref={questionImageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(e, question.id)
                            }
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              questionImageInputRef.current?.click()
                            }
                            className="gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Загрузить изображение
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Points */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Количество баллов
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            points: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-24 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      />
                    </div>

                    {/* Answers or Correct Answer */}
                    {question.type === "text" ? (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-foreground">
                          Правильный ответ
                        </label>
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted">RU</span>
                            </div>
                            <input
                              type="text"
                              value={question.correctAnswer_ru || ""}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                updateQuestion(question.id, {
                                  correctAnswer_ru: newValue,
                                });
                                // Автоперевод на казахский
                                if (autoTranslate) {
                                  autoTranslateCorrectAnswer(question.id, newValue, "ru", "kz");
                                }
                              }}
                              placeholder="Правильный ответ на русском..."
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted">KZ</span>
                            </div>
                            <input
                              type="text"
                              value={question.correctAnswer_kz || ""}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                updateQuestion(question.id, {
                                  correctAnswer_kz: newValue,
                                });
                                // Автоперевод на русский
                                if (autoTranslate) {
                                  autoTranslateCorrectAnswer(question.id, newValue, "kz", "ru");
                                }
                              }}
                              placeholder="Дұрыс жауап қазақ тілінде..."
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-foreground">
                            Варианты ответов
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addAnswer(question.id)}
                            className="gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Добавить вариант
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {question.answers.map((answer, answerIndex) => (
                            <div
                              key={answer.id}
                              className="flex gap-2 items-start p-3 bg-background/50 rounded-lg border border-border"
                            >
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs text-muted w-6 text-center">
                                  {answerIndex + 1}
                                </span>
                                <button
                                  onClick={() =>
                                    updateAnswer(question.id, answer.id, {
                                      isCorrect: !answer.isCorrect,
                                    })
                                  }
                                  className={`flex-shrink-0 transition-colors ${
                                    answer.isCorrect
                                      ? "text-green-400"
                                      : "text-muted hover:text-foreground"
                                  }`}
                                >
                                  {question.type === "single" ? (
                                    answer.isCorrect ? (
                                      <CheckCircle className="w-5 h-5" />
                                    ) : (
                                      <Circle className="w-5 h-5" />
                                    )
                                  ) : (
                                    <CheckCircle
                                      className={`w-5 h-5 ${
                                        answer.isCorrect ? "fill-current" : ""
                                      }`}
                                    />
                                  )}
                                </button>
                              </div>

                              <div className="flex-1 space-y-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs text-muted">
                                      RU
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    value={answer.text_ru}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      updateAnswer(question.id, answer.id, {
                                        text_ru: newValue,
                                      });
                                      // Автоперевод на казахский
                                      if (autoTranslate) {
                                        autoTranslateAnswer(
                                          question.id,
                                          answer.id,
                                          newValue,
                                          "ru",
                                          "kz"
                                        );
                                      }
                                    }}
                                    placeholder="Вариант ответа..."
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs text-muted">
                                      KZ
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    value={answer.text_kz}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      updateAnswer(question.id, answer.id, {
                                        text_kz: newValue,
                                      });
                                      // Автоперевод на русский
                                      if (autoTranslate) {
                                        autoTranslateAnswer(
                                          question.id,
                                          answer.id,
                                          newValue,
                                          "kz",
                                          "ru"
                                        );
                                      }
                                    }}
                                    placeholder="Жауап нұсқасы..."
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue"
                                  />
                                </div>

                                {/* Answer Image */}
                                {answer.image ? (
                                  <div className="relative inline-block">
                                    <img
                                      src={answer.image}
                                      alt="Answer"
                                      className="max-w-[200px] rounded-lg border border-border"
                                    />
                                    <button
                                      onClick={() =>
                                        removeImage(question.id, answer.id)
                                      }
                                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <input
                                      ref={answerImageInputRef}
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleImageUpload(
                                          e,
                                          question.id,
                                          answer.id
                                        )
                                      }
                                      className="hidden"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        answerImageInputRef.current?.click()
                                      }
                                      className="gap-2 h-8 text-xs"
                                    >
                                      <ImageIcon className="w-3 h-3" />
                                      Добавить изображение
                                    </Button>
                                  </div>
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  deleteAnswer(question.id, answer.id)
                                }
                                className="mt-2 h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                disabled={question.answers.length <= 2}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
