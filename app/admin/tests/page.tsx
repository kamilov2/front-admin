"use client";

import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Plus,
  Search,
  FileText,
  Edit,
  Trash2,
  Copy,
  Globe,
  X,
  Save,
  CheckCircle,
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
}

const initialTests: Test[] = [
  {
    id: 1,
    name: "ЕНТ Математика 2025",
    category: "Математика",
    questions: 25,
    status: "published",
    language: "RU/KZ",
    description: "Полный тест по математике для подготовки к ЕНТ 2025",
  },
  {
    id: 2,
    name: "Физика 11 класс",
    category: "Физика",
    questions: 20,
    status: "draft",
    language: "RU",
    description: "Тест по физике для 11 класса",
  },
  {
    id: 3,
    name: "История Казахстана",
    category: "История",
    questions: 30,
    status: "published",
    language: "RU/KZ",
    description: "История Казахстана с древних времен",
  },
  {
    id: 4,
    name: "Биология ЕНТ",
    category: "Биология",
    questions: 25,
    status: "published",
    language: "RU/KZ",
    description: "Биология для подготовки к ЕНТ",
  },
];

const categories = ["Математика", "Физика", "История", "Биология", "Химия", "География"];

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [editorName, setEditorName] = useState("");
  const [editorCategory, setEditorCategory] = useState("");
  const [editorQuestions, setEditorQuestions] = useState("");
  const [editorLanguage, setEditorLanguage] = useState("RU");
  const [editorDescription, setEditorDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditor = (test?: Test) => {
    if (test) {
      setCurrentTest(test);
      setEditorName(test.name);
      setEditorCategory(test.category);
      setEditorQuestions(test.questions.toString());
      setEditorLanguage(test.language);
      setEditorDescription(test.description || "");
    } else {
      setCurrentTest(null);
      setEditorName("");
      setEditorCategory("");
      setEditorQuestions("");
      setEditorLanguage("RU");
      setEditorDescription("");
    }
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setCurrentTest(null);
  };

  const saveTest = (publish: boolean) => {
    if (currentTest) {
      setTests(
        tests.map((t) =>
          t.id === currentTest.id
            ? {
                ...t,
                name: editorName,
                category: editorCategory,
                questions: parseInt(editorQuestions) || 0,
                language: editorLanguage,
                description: editorDescription,
                status: publish ? "published" : "draft",
              }
            : t
        )
      );
    } else {
      const newTest: Test = {
        id: Math.max(...tests.map((t) => t.id)) + 1,
        name: editorName,
        category: editorCategory,
        questions: parseInt(editorQuestions) || 0,
        language: editorLanguage,
        description: editorDescription,
        status: publish ? "published" : "draft",
      };
      setTests([newTest, ...tests]);
    }
    closeEditor();
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
                    <th className="text-left text-sm font-medium text-muted pb-3">ID</th>
                    <th className="text-left text-sm font-medium text-muted pb-3">Название</th>
                    <th className="text-left text-sm font-medium text-muted pb-3">Категория</th>
                    <th className="text-right text-sm font-medium text-muted pb-3">Вопросов</th>
                    <th className="text-left text-sm font-medium text-muted pb-3">Язык</th>
                    <th className="text-left text-sm font-medium text-muted pb-3">Статус</th>
                    <th className="text-center text-sm font-medium text-muted pb-3">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map((test) => (
                    <tr key={test.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                      <td className="py-3 text-sm text-muted">#{test.id}</td>
                      <td className="py-3 text-sm text-foreground font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-accent-blue" />
                          {test.name}
                        </div>
                      </td>
                      <td className="py-3 text-sm text-muted">{test.category}</td>
                      <td className="py-3 text-sm text-foreground text-right">{test.questions}</td>
                      <td className="py-3 text-sm text-muted">{test.language}</td>
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
        title={currentTest ? "Редактировать тест" : "Новый тест"}
        size="lg"
      >
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

            <div className="grid grid-cols-2 gap-4">
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
                  Количество вопросов *
                </label>
                <input
                  type="number"
                  placeholder="25"
                  value={editorQuestions}
                  onChange={(e) => setEditorQuestions(e.target.value)}
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground placeholder:text-muted"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Язык теста
              </label>
              <div className="flex gap-2">
                <Button
                  variant={editorLanguage === "RU" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditorLanguage("RU")}
                >
                  RU
                </Button>
                <Button
                  variant={editorLanguage === "KZ" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditorLanguage("KZ")}
                >
                  KZ
                </Button>
                <Button
                  variant={editorLanguage === "RU/KZ" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditorLanguage("RU/KZ")}
                >
                  RU/KZ
                </Button>
              </div>
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
            <Button variant="outline" onClick={() => saveTest(false)} className="gap-2">
              <Save className="w-4 h-4" />
              Сохранить черновик
            </Button>
            <Button
              onClick={() => saveTest(true)}
              className="gap-2 bg-gradient-to-r from-accent-blue to-accent-cyan"
            >
              <CheckCircle className="w-4 h-4" />
              Опубликовать
            </Button>
          </div>
        </div>
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
            <span className="font-semibold text-foreground">"{currentTest?.name}"</span>?
            Все связанные вопросы также будут удалены. Это действие нельзя отменить.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
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
