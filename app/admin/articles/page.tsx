"use client";

import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Plus,
  FileText,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
  User,
  Tag,
  TrendingUp,
  CheckCircle,
  Image as ImageIcon,
  MessageSquare,
  BookOpen,
  Save,
  X,
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
  Globe,
} from "lucide-react";
import { useState } from "react";

const stats = [
  {
    title: "Всего статей",
    value: "342",
    change: "+12",
    icon: <FileText className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Опубликовано",
    value: "298",
    change: "+8",
    icon: <CheckCircle className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Черновики",
    value: "44",
    change: "+4",
    icon: <Edit className="w-5 h-5" />,
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Просмотры",
    value: "145.2K",
    change: "+2.4K",
    icon: <Eye className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
  },
];

interface Article {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  status: "published" | "draft";
  views: number;
  comments: number;
  content?: string;
  featured: boolean;
}

const initialArticles: Article[] = [
  {
    id: 1,
    title: "Как эффективно подготовиться к ЕНТ 2025",
    category: "Образование",
    author: "Айгерим Нурланова",
    date: "2025-11-20",
    status: "published",
    views: 12453,
    comments: 87,
    content: "Подробное руководство по подготовке к ЕНТ...",
    featured: true,
  },
  {
    id: 2,
    title: "10 советов для успешной сдачи экзаменов",
    category: "Советы",
    author: "Алексей Иванов",
    date: "2025-11-18",
    status: "published",
    views: 8921,
    comments: 56,
    content: "Эффективные стратегии подготовки...",
    featured: false,
  },
  {
    id: 3,
    title: "Новые изменения в системе тестирования",
    category: "Новости",
    author: "Мария Смирнова",
    date: "2025-11-15",
    status: "draft",
    views: 0,
    comments: 0,
    content: "В 2025 году вводятся новые правила...",
    featured: false,
  },
];

const categories = ["Образование", "Советы", "Новости", "Психология", "Методики", "Технологии"];
const tags = ["ЕНТ", "Экзамены", "Подготовка", "Мотивация", "Обучение", "Тесты"];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorCategory, setEditorCategory] = useState("");
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [editorLanguage, setEditorLanguage] = useState("ru");

  const filteredArticles = articles.filter((article) => {
    if (selectedStatus === "all") return true;
    return article.status === selectedStatus;
  });

  const openEditor = (article?: Article) => {
    if (article) {
      setCurrentArticle(article);
      setEditorTitle(article.title);
      setEditorContent(article.content || "");
      setEditorCategory(article.category);
      setEditorTags([]);
    } else {
      setCurrentArticle(null);
      setEditorTitle("");
      setEditorContent("");
      setEditorCategory("");
      setEditorTags([]);
    }
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setCurrentArticle(null);
  };

  const saveArticle = (publish: boolean) => {
    if (currentArticle) {
      setArticles(
        articles.map((a) =>
          a.id === currentArticle.id
            ? {
                ...a,
                title: editorTitle,
                content: editorContent,
                category: editorCategory,
                status: publish ? "published" : "draft",
              }
            : a
        )
      );
    } else {
      const newArticle: Article = {
        id: Math.max(...articles.map((a) => a.id)) + 1,
        title: editorTitle,
        content: editorContent,
        category: editorCategory,
        author: "Айгерим Нурланова",
        date: new Date().toISOString().split("T")[0],
        status: publish ? "published" : "draft",
        views: 0,
        comments: 0,
        featured: false,
      };
      setArticles([newArticle, ...articles]);
    }
    closeEditor();
  };

  const deleteArticle = (id: number) => {
    setArticles(articles.filter((a) => a.id !== id));
    setIsDeleteModalOpen(false);
  };

  const openDeleteModal = (article: Article) => {
    setCurrentArticle(article);
    setIsDeleteModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    if (status === "published") {
      return (
        <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-400 bg-green-500/10 rounded-full">
          <CheckCircle className="w-3 h-3" />
          Опубликовано
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-400 bg-yellow-500/10 rounded-full">
        <Edit className="w-3 h-3" />
        Черновик
      </span>
    );
  };

  const toggleTag = (tag: string) => {
    if (editorTags.includes(tag)) {
      setEditorTags(editorTags.filter((t) => t !== tag));
    } else {
      setEditorTags([...editorTags, tag]);
    }
  };

  return (
    <>
      <AdminHeader title="Статьи">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Фильтры
          </Button>
          <Button size="sm" className="gap-2" onClick={() => openEditor()}>
            <Plus className="w-4 h-4" />
            Новая статья
          </Button>
        </div>
      </AdminHeader>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg hover:shadow-accent-blue/10 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Список статей ({filteredArticles.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={selectedStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus("all")}
                >
                  Все
                </Button>
                <Button
                  variant={selectedStatus === "published" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus("published")}
                >
                  Опубликованные
                </Button>
                <Button
                  variant={selectedStatus === "draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus("draft")}
                >
                  Черновики
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredArticles.map((article) => (
                <div key={article.id} className="p-4 hover:bg-card/50 transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-8 h-8 text-white/50" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-foreground group-hover:text-accent-blue transition-colors">
                              {article.title}
                            </h3>
                            {article.featured && (
                              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-yellow-400 bg-yellow-500/10 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                Популярное
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted">
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {article.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {article.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {article.date}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(article.status)}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {article.comments}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1"
                            onClick={() => openEditor(article)}
                          >
                            <Edit className="w-3 h-3" />
                            Редактировать
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 text-red-400 hover:text-red-300"
                            onClick={() => openDeleteModal(article)}
                          >
                            <Trash2 className="w-3 h-3" />
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        title={currentArticle ? "Редактировать статью" : "Новая статья"}
        size="xl"
      >
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Введите заголовок статьи..."
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  className="w-full text-2xl font-bold bg-transparent border-b border-border pb-2 outline-none text-foreground placeholder:text-muted"
                />
              </div>

              <div className="flex flex-wrap gap-2 p-3 bg-card rounded-lg border border-border">
                <button className="p-2 rounded hover:bg-background transition-colors" title="Жирный">
                  <Bold className="w-4 h-4 text-muted hover:text-accent-blue" />
                </button>
                <button className="p-2 rounded hover:bg-background transition-colors" title="Курсив">
                  <Italic className="w-4 h-4 text-muted hover:text-accent-blue" />
                </button>
                <button className="p-2 rounded hover:bg-background transition-colors" title="Подчёркнутый">
                  <Underline className="w-4 h-4 text-muted hover:text-accent-blue" />
                </button>
                <div className="w-px h-6 bg-border"></div>
                <button className="p-2 rounded hover:bg-background transition-colors" title="Заголовок 1">
                  <Heading1 className="w-4 h-4 text-muted hover:text-accent-blue" />
                </button>
                <button className="p-2 rounded hover:bg-background transition-colors" title="Заголовок 2">
                  <Heading2 className="w-4 h-4 text-muted hover:text-accent-blue" />
                </button>
                <div className="w-px h-6 bg-border"></div>
                <button className="p-2 rounded hover:bg-background transition-colors" title="Список">
                  <List className="w-4 h-4 text-muted hover:text-accent-blue" />
                </button>
                <button className="p-2 rounded hover:bg-background transition-colors" title="Нумерованный список">
                  <ListOrdered className="w-4 h-4 text-muted hover:text-accent-blue" />
                </button>
                <div className="w-px h-6 bg-border"></div>
                <button className="p-2 rounded hover:bg-background transition-colors" title="Ссылка">
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

              <textarea
                placeholder="Начните писать вашу статью..."
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="w-full h-[400px] p-4 bg-card border border-border rounded-lg outline-none focus:border-accent-blue transition-colors text-foreground placeholder:text-muted resize-none"
              />
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Язык
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      variant={editorLanguage === "ru" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditorLanguage("ru")}
                    >
                      RU
                    </Button>
                    <Button
                      variant={editorLanguage === "kz" ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditorLanguage("kz")}
                    >
                      KZ
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Категория
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setEditorCategory(category)}
                      className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-all ${
                        editorCategory === category
                          ? "bg-accent-blue text-white"
                          : "bg-card hover:bg-background text-foreground border border-border"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Теги
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          editorTags.includes(tag)
                            ? "bg-accent-blue text-white"
                            : "bg-card hover:bg-background text-muted border border-border"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={closeEditor} className="gap-2">
              <X className="w-4 h-4" />
              Отмена
            </Button>
            <Button variant="outline" onClick={() => saveArticle(false)} className="gap-2">
              <Save className="w-4 h-4" />
              Сохранить черновик
            </Button>
            <Button onClick={() => saveArticle(true)} className="gap-2 bg-gradient-to-r from-accent-blue to-accent-cyan">
              <CheckCircle className="w-4 h-4" />
              Опубликовать
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Удалить статью?"
        size="sm"
      >
        <div className="p-6 space-y-4">
          <p className="text-muted">
            Вы уверены, что хотите удалить статью{" "}
            <span className="font-semibold text-foreground">"{currentArticle?.title}"</span>?
            Это действие нельзя отменить.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="outline"
              onClick={() => currentArticle && deleteArticle(currentArticle.id)}
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
