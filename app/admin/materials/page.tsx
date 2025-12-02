"use client";

import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Plus,
  BookOpen,
  FileText,
  Video,
  Image as ImageIcon,
  Download,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  TrendingUp,
  X,
  Save,
  CheckCircle,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Code,
  Heading1,
  Heading2,
  Sparkles,
  Upload,
  File,
} from "lucide-react";
import { useState } from "react";

interface Material {
  id: number;
  title: string;
  subject: string;
  type: "text" | "video" | "pdf" | "image";
  author: string;
  date: string;
  views: number;
  downloads: number;
  content?: string;
  description?: string;
  forRole: "student" | "teacher" | "both";
}

const initialMaterials: Material[] = [
  {
    id: 1,
    title: "Алгебра: Квадратные уравнения",
    subject: "Математика",
    type: "text",
    author: "Айгерим Нурланова",
    date: "2025-11-20",
    views: 1245,
    downloads: 342,
    content: "Подробная теория и примеры решения квадратных уравнений...",
    description: "Полное руководство по решению квадратных уравнений с примерами",
    forRole: "student",
  },
  {
    id: 2,
    title: "Законы Ньютона - Видеоурок",
    subject: "Физика",
    type: "video",
    author: "Алексей Иванов",
    date: "2025-11-18",
    views: 2341,
    downloads: 0,
    description: "Видеоурок о трёх законах Ньютона с примерами",
    forRole: "student",
  },
  {
    id: 3,
    title: "История Казахстана - Конспект",
    subject: "История",
    type: "pdf",
    author: "Мария Смирнова",
    date: "2025-11-15",
    views: 892,
    downloads: 245,
    description: "Полный конспект по истории Казахстана для подготовки к ЕНТ",
    forRole: "both",
  },
  {
    id: 4,
    title: "Методика преподавания математики",
    subject: "Математика",
    type: "pdf",
    author: "Данияр Касымов",
    date: "2025-11-12",
    views: 567,
    downloads: 123,
    description: "Современные методики преподавания математики в школе",
    forRole: "teacher",
  },
];

const subjects = [
  "Математика",
  "Физика",
  "История",
  "Биология",
  "Химия",
  "География",
  "Русский язык",
  "Казахский язык",
  "Английский язык",
  "Информатика",
];

const materialTypes = [
  { value: "text", label: "Текст", icon: FileText },
  { value: "video", label: "Видео", icon: Video },
  { value: "pdf", label: "PDF", icon: File },
  { value: "image", label: "Изображение", icon: ImageIcon },
];

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorSubject, setEditorSubject] = useState("");
  const [editorType, setEditorType] = useState<"text" | "video" | "pdf" | "image">("text");
  const [editorContent, setEditorContent] = useState("");
  const [editorDescription, setEditorDescription] = useState("");
  const [editorForRole, setEditorForRole] = useState<"student" | "teacher" | "both">("student");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || material.subject === selectedSubject;
    const matchesRole =
      selectedRole === "all" || material.forRole === selectedRole || material.forRole === "both";
    return matchesSearch && matchesSubject && matchesRole;
  });

  const openEditor = (material?: Material) => {
    if (material) {
      setCurrentMaterial(material);
      setEditorTitle(material.title);
      setEditorSubject(material.subject);
      setEditorType(material.type);
      setEditorContent(material.content || "");
      setEditorDescription(material.description || "");
      setEditorForRole(material.forRole);
    } else {
      setCurrentMaterial(null);
      setEditorTitle("");
      setEditorSubject("");
      setEditorType("text");
      setEditorContent("");
      setEditorDescription("");
      setEditorForRole("student");
    }
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setCurrentMaterial(null);
  };

  const saveMaterial = () => {
    if (currentMaterial) {
      setMaterials(
        materials.map((m) =>
          m.id === currentMaterial.id
            ? {
                ...m,
                title: editorTitle,
                subject: editorSubject,
                type: editorType,
                content: editorContent,
                description: editorDescription,
                forRole: editorForRole,
              }
            : m
        )
      );
    } else {
      const newMaterial: Material = {
        id: Math.max(...materials.map((m) => m.id)) + 1,
        title: editorTitle,
        subject: editorSubject,
        type: editorType,
        author: "Айгерим Нурланова",
        date: new Date().toISOString().split("T")[0],
        views: 0,
        downloads: 0,
        content: editorContent,
        description: editorDescription,
        forRole: editorForRole,
      };
      setMaterials([newMaterial, ...materials]);
    }
    closeEditor();
  };

  const deleteMaterial = (id: number) => {
    setMaterials(materials.filter((m) => m.id !== id));
    setIsDeleteModalOpen(false);
  };

  const openDeleteModal = (material: Material) => {
    setCurrentMaterial(material);
    setIsDeleteModalOpen(true);
  };

  const getTypeIcon = (type: string) => {
    const typeObj = materialTypes.find((t) => t.value === type);
    return typeObj ? typeObj.icon : FileText;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      text: "#2563EB",
      video: "#EF4444",
      pdf: "#F59E0B",
      image: "#10B981",
    };
    return colors[type as keyof typeof colors] || "#2563EB";
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      student: "Для студентов",
      teacher: "Для учителей",
      both: "Для всех",
    };
    return labels[role as keyof typeof labels] || "Для всех";
  };

  const stats = [
    {
      title: "Всего материалов",
      value: materials.length.toString(),
      icon: <BookOpen className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Для студентов",
      value: materials.filter((m) => m.forRole === "student" || m.forRole === "both").length.toString(),
      icon: <User className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Для учителей",
      value: materials.filter((m) => m.forRole === "teacher" || m.forRole === "both").length.toString(),
      icon: <User className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Всего просмотров",
      value: materials.reduce((sum, m) => sum + m.views, 0).toLocaleString(),
      icon: <Eye className="w-5 h-5" />,
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <>
      <AdminHeader title="Учебные материалы">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Фильтры
          </Button>
          <Button size="sm" className="gap-2" onClick={() => openEditor()}>
            <Plus className="w-4 h-4" />
            Добавить материал
          </Button>
        </div>
      </AdminHeader>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden group hover:shadow-lg hover:shadow-accent-blue/10 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Поиск материалов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
              </div>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue"
              >
                <option value="all">Все предметы</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue"
              >
                <option value="all">Для всех</option>
                <option value="student">Для студентов</option>
                <option value="teacher">Для учителей</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Материалы ({filteredMaterials.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredMaterials.map((material) => {
                const TypeIcon = getTypeIcon(material.type);
                return (
                  <div key={material.id} className="p-4 hover:bg-card/50 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${getTypeColor(material.type)}20` }}
                      >
                        <TypeIcon className="w-8 h-8" style={{ color: getTypeColor(material.type) }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-foreground group-hover:text-accent-blue transition-colors mb-1">
                              {material.title}
                            </h3>
                            {material.description && (
                              <p className="text-sm text-muted mb-2">{material.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-muted">
                              <span className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {material.subject}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {material.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {material.date}
                              </span>
                            </div>
                          </div>
                          <span
                            className="px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                            style={{
                              backgroundColor: `${getTypeColor(material.type)}20`,
                              color: getTypeColor(material.type),
                            }}
                          >
                            {getRoleLabel(material.forRole)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {material.views.toLocaleString()}
                            </span>
                            {material.downloads > 0 && (
                              <span className="flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                {material.downloads}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={() => openEditor(material)}
                            >
                              <Edit className="w-3 h-3" />
                              Редактировать
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1 text-red-400 hover:text-red-300"
                              onClick={() => openDeleteModal(material)}
                            >
                              <Trash2 className="w-3 h-3" />
                              Удалить
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        title={currentMaterial ? "Редактировать материал" : "Новый материал"}
        size="xl"
      >
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Название материала *
                </label>
                <input
                  type="text"
                  placeholder="Введите название материала"
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground placeholder:text-muted"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Описание</label>
                <textarea
                  placeholder="Краткое описание материала..."
                  value={editorDescription}
                  onChange={(e) => setEditorDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground placeholder:text-muted resize-none"
                />
              </div>

              {editorType === "text" && (
                <div className="flex flex-wrap gap-2 p-3 bg-card rounded-lg border border-border">
                  <button
                    className="p-2 rounded hover:bg-background transition-colors"
                    title="Жирный"
                  >
                    <Bold className="w-4 h-4 text-muted hover:text-accent-blue" />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-background transition-colors"
                    title="Курсив"
                  >
                    <Italic className="w-4 h-4 text-muted hover:text-accent-blue" />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-background transition-colors"
                    title="Подчёркнутый"
                  >
                    <Underline className="w-4 h-4 text-muted hover:text-accent-blue" />
                  </button>
                  <div className="w-px h-6 bg-border"></div>
                  <button
                    className="p-2 rounded hover:bg-background transition-colors"
                    title="Заголовок 1"
                  >
                    <Heading1 className="w-4 h-4 text-muted hover:text-accent-blue" />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-background transition-colors"
                    title="Заголовок 2"
                  >
                    <Heading2 className="w-4 h-4 text-muted hover:text-accent-blue" />
                  </button>
                  <div className="w-px h-6 bg-border"></div>
                  <button
                    className="p-2 rounded hover:bg-background transition-colors"
                    title="Список"
                  >
                    <List className="w-4 h-4 text-muted hover:text-accent-blue" />
                  </button>
                  <button
                    className="p-2 rounded hover:bg-background transition-colors"
                    title="Нумерованный список"
                  >
                    <ListOrdered className="w-4 h-4 text-muted hover:text-accent-blue" />
                  </button>
                  <div className="w-px h-6 bg-border"></div>
                  <button
                    className="p-2 rounded hover:bg-background transition-colors"
                    title="Ссылка"
                  >
                    <Link2 className="w-4 h-4 text-muted hover:text-accent-blue" />
                  </button>
                  <button className="p-2 rounded hover:bg-background transition-colors" title="Код">
                    <Code className="w-4 h-4 text-muted hover:text-accent-blue" />
                  </button>
                  <div className="ml-auto">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      ИИ помощник
                    </Button>
                  </div>
                </div>
              )}

              {editorType === "text" ? (
                <textarea
                  placeholder="Начните писать содержимое материала..."
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="w-full h-[350px] p-4 bg-card border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground placeholder:text-muted resize-none"
                />
              ) : (
                <div className="w-full h-[350px] border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-accent-blue/50 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-muted mx-auto mb-3" />
                    <p className="text-sm text-foreground mb-1">Нажмите для загрузки файла</p>
                    <p className="text-xs text-muted">
                      {editorType === "video" && "Поддерживается: MP4, AVI, MOV"}
                      {editorType === "pdf" && "Поддерживается: PDF"}
                      {editorType === "image" && "Поддерживается: JPG, PNG, GIF"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Предмет
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <select
                    value={editorSubject}
                    onChange={(e) => setEditorSubject(e.target.value)}
                    className="w-full px-4 py-2 bg-card border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground"
                  >
                    <option value="">Выберите предмет</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Тип материала
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {materialTypes.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setEditorType(value as any)}
                      className={`w-full px-4 py-3 rounded-lg text-sm text-left transition-all flex items-center gap-3 ${
                        editorType === value
                          ? "bg-accent-blue text-white"
                          : "bg-card hover:bg-background text-foreground border border-border"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Для кого
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <button
                    onClick={() => setEditorForRole("student")}
                    className={`w-full px-4 py-2 rounded-lg text-sm text-left transition-all ${
                      editorForRole === "student"
                        ? "bg-accent-blue text-white"
                        : "bg-card hover:bg-background text-foreground border border-border"
                    }`}
                  >
                    Для студентов
                  </button>
                  <button
                    onClick={() => setEditorForRole("teacher")}
                    className={`w-full px-4 py-2 rounded-lg text-sm text-left transition-all ${
                      editorForRole === "teacher"
                        ? "bg-accent-blue text-white"
                        : "bg-card hover:bg-background text-foreground border border-border"
                    }`}
                  >
                    Для учителей
                  </button>
                  <button
                    onClick={() => setEditorForRole("both")}
                    className={`w-full px-4 py-2 rounded-lg text-sm text-left transition-all ${
                      editorForRole === "both"
                        ? "bg-accent-blue text-white"
                        : "bg-card hover:bg-background text-foreground border border-border"
                    }`}
                  >
                    Для всех
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={closeEditor} className="gap-2">
              <X className="w-4 h-4" />
              Отмена
            </Button>
            <Button
              onClick={saveMaterial}
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
        title="Удалить материал?"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-muted">
            Вы уверены, что хотите удалить материал{" "}
            <span className="font-semibold text-foreground">"{currentMaterial?.title}"</span>?
            Это действие нельзя отменить.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="outline"
              onClick={() => currentMaterial && deleteMaterial(currentMaterial.id)}
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
