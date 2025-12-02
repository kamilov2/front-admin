"use client";

import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Plus,
  FolderTree,
  Edit,
  Trash2,
  Calculator,
  Atom,
  Scroll,
  Dna,
  Beaker,
  Globe as GlobeIcon,
  X,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

interface Category {
  id: number;
  name: string;
  icon: string;
  testsCount: number;
  color: string;
  description?: string;
}

const iconMap: Record<string, any> = {
  calculator: Calculator,
  atom: Atom,
  scroll: Scroll,
  dna: Dna,
  beaker: Beaker,
  globe: GlobeIcon,
};

const initialCategories: Category[] = [
  {
    id: 1,
    name: "Математика",
    icon: "calculator",
    testsCount: 15,
    color: "#2563EB",
    description: "Алгебра, геометрия, математический анализ",
  },
  {
    id: 2,
    name: "Физика",
    icon: "atom",
    testsCount: 12,
    color: "#38BDF8",
    description: "Механика, электродинамика, оптика",
  },
  {
    id: 3,
    name: "История",
    icon: "scroll",
    testsCount: 10,
    color: "#60A5FA",
    description: "История Казахстана и всемирная история",
  },
  {
    id: 4,
    name: "Биология",
    icon: "dna",
    testsCount: 8,
    color: "#93C5FD",
    description: "Ботаника, зоология, анатомия",
  },
  {
    id: 5,
    name: "Химия",
    icon: "beaker",
    testsCount: 7,
    color: "#DBEAFE",
    description: "Органическая и неорганическая химия",
  },
  {
    id: 6,
    name: "География",
    icon: "globe",
    testsCount: 6,
    color: "#3B82F6",
    description: "Физическая и экономическая география",
  },
];

const availableIcons = [
  { value: "calculator", label: "Калькулятор", Icon: Calculator },
  { value: "atom", label: "Атом", Icon: Atom },
  { value: "scroll", label: "Свиток", Icon: Scroll },
  { value: "dna", label: "ДНК", Icon: Dna },
  { value: "beaker", label: "Колба", Icon: Beaker },
  { value: "globe", label: "Глобус", Icon: GlobeIcon },
];

const availableColors = [
  "#2563EB",
  "#38BDF8",
  "#60A5FA",
  "#93C5FD",
  "#DBEAFE",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [editorName, setEditorName] = useState("");
  const [editorIcon, setEditorIcon] = useState("calculator");
  const [editorColor, setEditorColor] = useState("#2563EB");
  const [editorDescription, setEditorDescription] = useState("");

  const openEditor = (category?: Category) => {
    if (category) {
      setCurrentCategory(category);
      setEditorName(category.name);
      setEditorIcon(category.icon);
      setEditorColor(category.color);
      setEditorDescription(category.description || "");
    } else {
      setCurrentCategory(null);
      setEditorName("");
      setEditorIcon("calculator");
      setEditorColor("#2563EB");
      setEditorDescription("");
    }
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setCurrentCategory(null);
  };

  const saveCategory = () => {
    if (currentCategory) {
      setCategories(
        categories.map((c) =>
          c.id === currentCategory.id
            ? {
                ...c,
                name: editorName,
                icon: editorIcon,
                color: editorColor,
                description: editorDescription,
              }
            : c
        )
      );
    } else {
      const newCategory: Category = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        name: editorName,
        icon: editorIcon,
        color: editorColor,
        testsCount: 0,
        description: editorDescription,
      };
      setCategories([...categories, newCategory]);
    }
    closeEditor();
  };

  const deleteCategory = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
    setIsDeleteModalOpen(false);
  };

  const openDeleteModal = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteModalOpen(true);
  };

  const getCategoryIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || FolderTree;
    return IconComponent;
  };

  return (
    <>
      <AdminHeader title="Категории">
        <Button className="gap-2" onClick={() => openEditor()}>
          <Plus className="w-4 h-4" />
          Создать категорию
        </Button>
      </AdminHeader>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category.icon);
            return (
              <Card
                key={category.id}
                className="hover:border-accent-blue/50 transition-all hover:shadow-lg hover:shadow-accent-blue/10"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: category.color }} />
                    </div>
                    <FolderTree className="w-5 h-5 text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{category.name}</h3>
                  {category.description && (
                    <p className="text-xs text-muted mb-3">{category.description}</p>
                  )}
                  <p className="text-sm text-muted mb-4">{category.testsCount} тестов</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditor(category)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Изменить
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-red-400 hover:text-red-300"
                      onClick={() => openDeleteModal(category)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        title={currentCategory ? "Редактировать категорию" : "Новая категория"}
        size="md"
      >
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Название категории *
              </label>
              <input
                type="text"
                placeholder="Введите название категории"
                value={editorName}
                onChange={(e) => setEditorName(e.target.value)}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground placeholder:text-muted"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Иконка</label>
              <div className="grid grid-cols-6 gap-2">
                {availableIcons.map(({ value, Icon }) => (
                  <button
                    key={value}
                    onClick={() => setEditorIcon(value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      editorIcon === value
                        ? "border-accent-blue bg-accent-blue/10"
                        : "border-border hover:border-accent-blue/50"
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto" style={{ color: editorColor }} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Цвет</label>
              <div className="grid grid-cols-10 gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditorColor(color)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      editorColor === color ? "border-foreground scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Описание</label>
              <textarea
                placeholder="Краткое описание категории..."
                value={editorDescription}
                onChange={(e) => setEditorDescription(e.target.value)}
                rows={3}
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
              onClick={saveCategory}
              className="gap-2 bg-gradient-to-r from-accent-blue to-accent-cyan"
            >
              <CheckCircle className="w-4 h-4" />
              Сохранить
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Удалить категорию?"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-muted">
            Вы уверены, что хотите удалить категорию{" "}
            <span className="font-semibold text-foreground">"{currentCategory?.name}"</span>? Все
            тесты в этой категории ({currentCategory?.testsCount}) будут перемещены в "Без
            категории". Это действие нельзя отменить.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="outline"
              onClick={() => currentCategory && deleteCategory(currentCategory.id)}
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
