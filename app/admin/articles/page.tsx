"use client";

import { AdminHeader } from "@/components/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TipTapEditor } from "@/components/tiptap-editor";
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
  Sparkles,
  Globe,
  Code,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  titleKz?: string;
  category: string;
  author: string;
  date: string;
  status: "published" | "draft";
  views: number;
  comments: number;
  content?: string;
  contentKz?: string;
  featured: boolean;
  language: "ru" | "kz";
}

const initialArticles: Article[] = [
  {
    id: 1,
    title: "Как эффективно подготовиться к ЕНТ 2025",
    titleKz: "ҰБТ 2025-ке тиімді дайындалу жолдары",
    category: "Образование",
    author: "Айгерим Нурланова",
    date: "2025-11-20",
    status: "published",
    views: 12453,
    comments: 87,
    content: "Подробное руководство по подготовке к ЕНТ...",
    contentKz: "ҰБТ-ге дайындалу бойынша толық нұсқаулық...",
    featured: true,
    language: "ru",
  },
  {
    id: 2,
    title: "10 советов для успешной сдачи экзаменов",
    titleKz: "Емтихандарды сәтті тапсыру үшін 10 кеңес",
    category: "Советы",
    author: "Алексей Иванов",
    date: "2025-11-18",
    status: "published",
    views: 8921,
    comments: 56,
    content: "Эффективные стратегии подготовки...",
    contentKz: "Дайындықтың тиімді стратегиялары...",
    featured: false,
    language: "ru",
  },
  {
    id: 3,
    title: "Новые изменения в системе тестирования",
    titleKz: "Тестілеу жүйесіндегі жаңа өзгерістер",
    category: "Новости",
    author: "Мария Смирнова",
    date: "2025-11-15",
    status: "draft",
    views: 0,
    comments: 0,
    content: "В 2025 году вводятся новые правила...",
    contentKz: "2025 жылы жаңа ережелер енгізіледі...",
    featured: false,
    language: "ru",
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
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate word count and character count
  const wordCount = editorContent
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const charCount = editorContent.replace(/<[^>]*>/g, "").length;

  // Auto-save functionality
  useEffect(() => {
    if (!isEditorOpen || !editorTitle.trim()) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => {
        setLastSaved(new Date());
        setIsSaving(false);
      }, 500);
    }, 3000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editorTitle, editorContent, editorCategory, isEditorOpen]);

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
    setLastSaved(null);
    setIsSaving(false);
    setUploadedImages([]);
    setIsEditorOpen(true);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    // Simulate image upload - in real app, upload to cloud storage
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setUploadedImages((prev) => [...prev, url]);
        resolve(url);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  // Auto-translate function using translation API
  const translateText = async (text: string, targetLang: "ru" | "kz"): Promise<string> => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLang: targetLang === 'kz' ? 'kk' : 'ru' // Google uses 'kk' for Kazakh
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback: return original text if translation fails
      return `[Автоперевод] ${text}`;
    }
  };

  // Detect language of text
  const detectLanguage = (text: string): "ru" | "kz" => {
    // Simple detection: check for Cyrillic Kazakh characters
    const kazakhChars = /[ӘәІіҢңҒғҮүҰұҚқӨөҺһ]/;
    return kazakhChars.test(text) ? "kz" : "ru";
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setCurrentArticle(null);
  };

  const saveArticle = async (publish: boolean) => {
    if (!editorTitle.trim() || !editorContent.trim()) {
      alert("Пожалуйста, заполните заголовок и содержание статьи");
      return;
    }

    setIsTranslating(true);

    try {
      // Detect original language
      const detectedLang = detectLanguage(editorTitle + editorContent);

      // Translate title and content
      const translatedTitle = await translateText(editorTitle, detectedLang === "ru" ? "kz" : "ru");
      const translatedContent = await translateText(editorContent, detectedLang === "ru" ? "kz" : "ru");

      const articleData: Partial<Article> = {
        title: detectedLang === "ru" ? editorTitle : translatedTitle,
        titleKz: detectedLang === "kz" ? editorTitle : translatedTitle,
        content: detectedLang === "ru" ? editorContent : translatedContent,
        contentKz: detectedLang === "kz" ? editorContent : translatedContent,
        category: editorCategory,
        status: (publish ? "published" : "draft") as "published" | "draft",
        language: detectedLang,
      };

      if (currentArticle) {
        setArticles(
          articles.map((a) =>
            a.id === currentArticle.id
              ? ({
                  ...a,
                  ...articleData,
                } as Article)
              : a
          )
        );
      } else {
        const newArticle: Article = {
          id: Math.max(...articles.map((a) => a.id)) + 1,
          title: articleData.title!,
          titleKz: articleData.titleKz,
          content: articleData.content,
          contentKz: articleData.contentKz,
          category: articleData.category!,
          author: "Айгерим Нурланова",
          date: new Date().toISOString().split("T")[0],
          status: articleData.status!,
          views: 0,
          comments: 0,
          featured: false,
          language: articleData.language!,
        };
        setArticles([newArticle, ...articles]);
      }

      // Send to API with both languages
      try {
        const response = await fetch('/api/articles', {
          method: currentArticle ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...(currentArticle && { id: currentArticle.id }),
            ...articleData,
            author: "Айгерим Нурланова",
            date: new Date().toISOString().split("T")[0],
          }),
        });

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const result = await response.json();
        console.log('Article saved to API:', result);
      } catch (apiError) {
        console.error('API error:', apiError);
        // Continue even if API fails (for demo purposes)
      }

      closeEditor();
    } catch (error) {
      console.error("Translation error:", error);
      alert("Ошибка при переводе статьи. Попробуйте еще раз.");
    } finally {
      setIsTranslating(false);
    }
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
        <div className="p-6 space-y-6 h-[calc(100vh-8rem)] flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
            <div className="lg:col-span-2 space-y-4 flex flex-col">
              <div>
                <input
                  type="text"
                  placeholder="Введите заголовок статьи..."
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  className="w-full text-2xl font-bold bg-transparent border-b border-border pb-2 outline-none text-foreground placeholder:text-muted"
                />
              </div>

              <Card className="border border-border flex-1 flex flex-col">
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Edit className="w-4 h-4 text-accent-blue" />
                        <span className="text-sm font-medium text-foreground">Редактор</span>
                      </div>
                      {editorTitle && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md border border-border">
                          <Globe className="w-3 h-3 text-muted" />
                          <span className="text-xs font-medium text-muted">
                            {detectLanguage(editorTitle + editorContent) === "ru" ? "Русский" : "Қазақша"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted flex items-center gap-2">
                        {isSaving ? (
                          <span className="flex items-center gap-1 text-yellow-400">
                            <Save className="w-3 h-3 animate-pulse" />
                            Сохранение...
                          </span>
                        ) : lastSaved ? (
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle className="w-3 h-3" />
                            Сохранено {lastSaved.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        ) : null}
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        ИИ помощник
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1 overflow-hidden">
                  <TipTapEditor
                    content={editorContent}
                    onChange={setEditorContent}
                    placeholder="Начните писать вашу статью..."
                    onImageUpload={handleImageUpload}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-accent-blue" />
                    Автоматический перевод
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="p-3 bg-accent-blue/10 border border-accent-blue/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-accent-blue mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-muted">
                          <p className="font-medium text-foreground mb-1">Умный перевод включен</p>
                          <p>Статья автоматически переводится на оба языка (RU/KZ) при сохранении</p>
                        </div>
                      </div>
                    </div>
                    {isTranslating && (
                      <div className="flex items-center gap-2 text-xs text-yellow-400 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <Globe className="w-4 h-4 animate-pulse" />
                        <span>Выполняется перевод...</span>
                      </div>
                    )}
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

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-xs text-muted flex items-center gap-3">
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>
                  <span className="text-foreground font-semibold">{wordCount}</span> {wordCount === 1 ? 'слово' : wordCount < 5 ? 'слова' : 'слов'}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Code className="w-3 h-3" />
                <span>
                  <span className="text-foreground font-semibold">{charCount}</span> символов
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                <span>
                  <span className="text-foreground font-semibold">{uploadedImages.length}</span> {uploadedImages.length === 1 ? 'изображение' : uploadedImages.length < 5 ? 'изображения' : 'изображений'}
                </span>
              </div>
              {editorCategory && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span className="text-accent-blue font-medium">{editorCategory}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={closeEditor}
                className="gap-2"
                disabled={isTranslating}
              >
                <X className="w-4 h-4" />
                Отмена
              </Button>
              <Button
                variant="outline"
                onClick={() => saveArticle(false)}
                className="gap-2"
                disabled={isTranslating}
              >
                {isTranslating ? (
                  <>
                    <Globe className="w-4 h-4 animate-pulse" />
                    Перевод...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Сохранить черновик
                  </>
                )}
              </Button>
              <Button
                onClick={() => saveArticle(true)}
                className="gap-2 bg-gradient-to-r from-accent-blue to-accent-cyan"
                disabled={isTranslating}
              >
                {isTranslating ? (
                  <>
                    <Globe className="w-4 h-4 animate-pulse" />
                    Перевод и публикация...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Опубликовать
                  </>
                )}
              </Button>
            </div>
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
