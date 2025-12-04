"use client";

import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { BilingualQuestionEditor, Question } from "@/components/bilingual-question-editor";
import { translateText } from "@/lib/translator";
import {
  Plus,
  Search,
  FileText,
  Edit,
  Trash2,
  Copy,
  X,
  Save,
  CheckCircle,
  Eye,
  Award,
} from "lucide-react";
import { useState } from "react";

interface Test {
  id: number;
  name: string;
  category: string;
  questions: number;
  status: "published" | "draft";
  language: string;
  description?: string;
  questionsData?: Question[];
  totalPoints?: number;
}

const initialTests: Test[] = [
  {
    id: 1,
    name: "ЕНТ Математика 2025",
    category: "Математика",
    questions: 3,
    status: "published",
    language: "RU/KZ",
    description: "Полный тест по математике для подготовки к ЕНТ 2025",
    totalPoints: 5,
    questionsData: [
      {
        id: "q1",
        type: "single",
        question_ru: "Чему равно 2 + 2?",
        question_kz: "2 + 2 нешеге тең?",
        answers: [
          { id: "a1", text_ru: "3", text_kz: "3", isCorrect: false },
          { id: "a2", text_ru: "4", text_kz: "4", isCorrect: true },
          { id: "a3", text_ru: "5", text_kz: "5", isCorrect: false },
          { id: "a4", text_ru: "6", text_kz: "6", isCorrect: false },
        ],
        points: 1,
      },
      {
        id: "q2",
        type: "multiple",
        question_ru: "Какие из чисел являются простыми?",
        question_kz: "Қай сандар жай сандар?",
        answers: [
          { id: "a1", text_ru: "2", text_kz: "2", isCorrect: true },
          { id: "a2", text_ru: "3", text_kz: "3", isCorrect: true },
          { id: "a3", text_ru: "4", text_kz: "4", isCorrect: false },
          { id: "a4", text_ru: "5", text_kz: "5", isCorrect: true },
        ],
        points: 2,
      },
      {
        id: "q3",
        type: "text",
        question_ru: "Сколько будет 15 * 3?",
        question_kz: "15 * 3 нешеге тең?",
        answers: [],
        correctAnswer_ru: "45",
        correctAnswer_kz: "45",
        points: 2,
      },
    ],
  },
  {
    id: 2,
    name: "Физика 11 класс",
    category: "Физика",
    questions: 20,
    status: "draft",
    language: "RU",
    description: "Тест по физике для 11 класса",
    totalPoints: 25,
  },
  {
    id: 3,
    name: "История Казахстана",
    category: "История",
    questions: 30,
    status: "published",
    language: "RU/KZ",
    description: "История Казахстана с древних времен",
    totalPoints: 40,
  },
];

const categories = [
  "Математика",
  "Физика",
  "История",
  "Биология",
  "Химия",
  "География",
  "Английский язык",
  "Русский язык",
  "Казахский язык",
];

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [editorName, setEditorName] = useState("");
  const [editorCategory, setEditorCategory] = useState("");
  const [editorDescription, setEditorDescription] = useState("");
  const [editorQuestions, setEditorQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editorStep, setEditorStep] = useState<"info" | "questions">("info");
  const [isTranslating, setIsTranslating] = useState(false);

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditor = (test?: Test) => {
    if (test) {
      setCurrentTest(test);
      setEditorName(test.name);
      setEditorCategory(test.category);
      setEditorDescription(test.description || "");
      setEditorQuestions(test.questionsData || []);
    } else {
      setCurrentTest(null);
      setEditorName("");
      setEditorCategory("");
      setEditorDescription("");
      setEditorQuestions([]);
    }
    setEditorStep("info");
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setCurrentTest(null);
    setEditorStep("info");
  };

  const handleNextStep = () => {
    if (!editorName.trim() || !editorCategory) {
      alert("Пожалуйста, заполните название и категорию");
      return;
    }
    setEditorStep("questions");
  };

  // Автоматическое определение языка теста на основе заполненных полей
  const detectTestLanguage = (questions: Question[]): string => {
    let hasRu = false;
    let hasKz = false;

    questions.forEach(q => {
      if (q.question_ru?.trim()) hasRu = true;
      if (q.question_kz?.trim()) hasKz = true;
    });

    if (hasRu && hasKz) return "RU/KZ";
    if (hasRu) return "RU";
    if (hasKz) return "KZ";
    return "RU/KZ"; // по умолчанию
  };

  const saveTest = async (publish: boolean) => {
    if (editorQuestions.length === 0) {
      alert("Пожалуйста, добавьте хотя бы один вопрос");
      return;
    }

    setIsTranslating(true);

    try {
      // Автоматически переводим весь тест перед сохранением
      const translatedQuestions = await Promise.all(
        editorQuestions.map(async (question) => {
          const translatedQuestion = { ...question };

          // Определяем, какой язык заполнен
          const isRuFilled = question.question_ru?.trim();
          const isKzFilled = question.question_kz?.trim();

          // Если заполнен только русский - переводим на казахский
          if (isRuFilled && !isKzFilled) {
            // Переводим вопрос
            translatedQuestion.question_kz = await translateText(question.question_ru, "ru", "kz");

            // Переводим правильный ответ
            if (question.correctAnswer_ru && !question.correctAnswer_kz) {
              translatedQuestion.correctAnswer_kz = await translateText(question.correctAnswer_ru, "ru", "kz");
            }

            // Переводим варианты ответов
            if (question.answers) {
              translatedQuestion.answers = await Promise.all(
                question.answers.map(async (answer) => {
                  if (answer.text_ru && !answer.text_kz) {
                    return {
                      ...answer,
                      text_kz: await translateText(answer.text_ru, "ru", "kz"),
                    };
                  }
                  return answer;
                })
              );
            }
          }

          // Если заполнен только казахский - переводим на русский
          if (isKzFilled && !isRuFilled) {
            // Переводим вопрос
            translatedQuestion.question_ru = await translateText(question.question_kz, "kz", "ru");

            // Переводим правильный ответ
            if (question.correctAnswer_kz && !question.correctAnswer_ru) {
              translatedQuestion.correctAnswer_ru = await translateText(question.correctAnswer_kz, "kz", "ru");
            }

            // Переводим варианты ответов
            if (question.answers) {
              translatedQuestion.answers = await Promise.all(
                question.answers.map(async (answer) => {
                  if (answer.text_kz && !answer.text_ru) {
                    return {
                      ...answer,
                      text_ru: await translateText(answer.text_kz, "kz", "ru"),
                    };
                  }
                  return answer;
                })
              );
            }
          }

          return translatedQuestion;
        })
      );

      setIsTranslating(false);

      // Проверяем, что все вопросы имеют обе версии
      const allQuestionsHaveBothLanguages = translatedQuestions.every(q => 
        q.question_ru?.trim() && q.question_kz?.trim()
      );

      if (!allQuestionsHaveBothLanguages) {
        alert("Ошибка перевода. Пожалуйста, проверьте все вопросы.");
        return;
      }

      const totalPoints = translatedQuestions.reduce((sum, q) => sum + q.points, 0);

      // Автоматически определяем язык теста
      const detectedLanguage = detectTestLanguage(translatedQuestions);

      const testData = {
        name: editorName,
        category: editorCategory,
        questions: translatedQuestions.length,
        language: detectedLanguage,
        description: editorDescription,
        questionsData: translatedQuestions, // ✅ Всегда отправляем обе версии (RU и KZ)
        totalPoints,
        status: (publish ? "published" : "draft") as "published" | "draft",
      };

      if (currentTest) {
        setTests(
          tests.map((t) =>
            t.id === currentTest.id
              ? {
                  ...t,
                  ...testData,
                }
              : t
          )
        );
      } else {
        const newTest: Test = {
          id: Math.max(...tests.map((t) => t.id)) + 1,
          ...testData,
        };
        setTests([newTest, ...tests]);
      }

      // Send to API - отправляем полный тест с обеими языковыми версиями
      try {
        const response = await fetch("/api/tests", {
          method: currentTest ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(currentTest && { id: currentTest.id }),
            ...testData, // Содержит questionsData с RU и KZ версиями
          }),
        });

        if (response.ok) {
          console.log("Test saved successfully with both languages");
        } else {
          throw new Error("Failed to save test");
        }
      } catch (error) {
        console.error("Error saving test:", error);
        alert("Ошибка при сохранении теста");
        return;
      }

      closeEditor();
    } catch (error) {
      console.error("Translation error:", error);
      setIsTranslating(false);
      alert("Ошибка при переводе теста. Попробуйте еще раз.");
    }
  };

  const deleteTest = (id: number) => {
    setTests(tests.filter((t) => t.id !== id));
    setIsDeleteModalOpen(false);
  };

  const openDeleteModal = (test: Test) => {
    setCurrentTest(test);
    setIsDeleteModalOpen(true);
  };

  const duplicateTest = (test: Test) => {
    const newTest: Test = {
      ...test,
      id: Math.max(...tests.map((t) => t.id)) + 1,
      name: `${test.name} (копия)`,
      status: "draft",
    };
    setTests([newTest, ...tests]);
  };

  return (
    <>
      <AdminHeader title="Тесты">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Поиск теста..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
          </div>
          <Button className="gap-2" onClick={() => openEditor()}>
            <Plus className="w-4 h-4" />
            Создать тест
          </Button>
        </div>
      </AdminHeader>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Все тесты ({filteredTests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-sm font-medium text-muted pb-3">
                      ID
                    </th>
                    <th className="text-left text-sm font-medium text-muted pb-3">
                      Название
                    </th>
                    <th className="text-left text-sm font-medium text-muted pb-3">
                      Категория
                    </th>
                    <th className="text-right text-sm font-medium text-muted pb-3">
                      Вопросов
                    </th>
                    <th className="text-right text-sm font-medium text-muted pb-3">
                      Баллов
                    </th>
                    <th className="text-left text-sm font-medium text-muted pb-3">
                      Язык
                    </th>
                    <th className="text-left text-sm font-medium text-muted pb-3">
                      Статус
                    </th>
                    <th className="text-center text-sm font-medium text-muted pb-3">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map((test) => (
                    <tr
                      key={test.id}
                      className="border-b border-border/50 hover:bg-card/50 transition-colors"
                    >
                      <td className="py-3 text-sm text-muted">#{test.id}</td>
                      <td className="py-3 text-sm text-foreground font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-accent-blue" />
                          {test.name}
                        </div>
                      </td>
                      <td className="py-3 text-sm text-muted">
                        {test.category}
                      </td>
                      <td className="py-3 text-sm text-foreground text-right">
                        {test.questions}
                      </td>
                      <td className="py-3 text-sm text-foreground text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Award className="w-3 h-3 text-accent-cyan" />
                          {test.totalPoints || "-"}
                        </div>
                      </td>
                      <td className="py-3 text-sm text-muted">
                        {test.language}
                      </td>
                      <td className="py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                            test.status === "published"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {test.status === "published" ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Опубликован
                            </>
                          ) : (
                            <>
                              <Edit className="w-3 h-3" />
                              Черновик
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => openEditor(test)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Изменить
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => duplicateTest(test)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Копировать
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-red-400 hover:text-red-300"
                            onClick={() => openDeleteModal(test)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Удалить
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        title={
          editorStep === "info"
            ? currentTest
              ? "Редактировать тест"
              : "Новый тест"
            : "Вопросы теста"
        }
        size={editorStep === "questions" ? "full" : "lg"}
      >
        {editorStep === "info" ? (
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Название теста *
                </label>
                <input
                  type="text"
                  placeholder="Введите название теста"
                  value={editorName}
                  onChange={(e) => setEditorName(e.target.value)}
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground placeholder:text-muted"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Категория *
                </label>
                <select
                  value={editorCategory}
                  onChange={(e) => setEditorCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Описание
                </label>
                <textarea
                  placeholder="Краткое описание теста..."
                  value={editorDescription}
                  onChange={(e) => setEditorDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground placeholder:text-muted resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={closeEditor} className="gap-2">
                <X className="w-4 h-4" />
                Отмена
              </Button>
              <Button
                onClick={handleNextStep}
                className="gap-2 bg-gradient-to-r from-accent-blue to-accent-cyan"
              >
                <Edit className="w-4 h-4" />
                Добавить вопросы
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-8rem)]">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-border bg-card/50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{editorName}</h3>
                  <p className="text-sm text-muted">
                    {editorCategory} • Двуязычный тест (RU/KZ)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditorStep("info")}
                    className="gap-2"
                    disabled={isTranslating}
                  >
                    <Eye className="w-4 h-4" />
                    Информация
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveTest(false)}
                    className="gap-2"
                    disabled={isTranslating}
                  >
                    <Save className="w-4 h-4" />
                    {isTranslating ? "Перевод..." : "Сохранить черновик"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => saveTest(true)}
                    className="gap-2 bg-gradient-to-r from-accent-blue to-accent-cyan"
                    disabled={isTranslating}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isTranslating ? "Перевод..." : "Опубликовать"}
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <BilingualQuestionEditor
                  questions={editorQuestions}
                  onChange={setEditorQuestions}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Удалить тест?"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-muted">
            Вы уверены, что хотите удалить тест{" "}
            <span className="font-semibold text-foreground">
              "{currentTest?.name}"
            </span>
            ? Все связанные вопросы также будут удалены. Это действие нельзя
            отменить.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Отмена
            </Button>
            <Button
              variant="outline"
              onClick={() => currentTest && deleteTest(currentTest.id)}
              className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
