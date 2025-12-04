"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link2,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Undo,
  Redo,
  Strikethrough,
  Quote,
  Minus,
  MoreHorizontal,
  Highlighter,
  Palette,
  Table as TableIcon,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef } from "react";

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Начните писать...",
  className = "",
  onImageUpload,
}: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false, // Disable default code block
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-background/50 border border-border rounded-lg p-4 font-mono text-sm",
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent-blue hover:text-accent-cyan underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border border-border",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-border bg-background/50 font-bold p-2",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border p-2",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[600px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Введите URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt("Введите URL изображения:");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor) return;

      const file = event.target.files?.[0];
      if (!file) return;

      // If onImageUpload callback is provided, use it
      if (onImageUpload) {
        try {
          const url = await onImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          console.error("Image upload failed:", error);
          alert("Не удалось загрузить изображение");
        }
      } else {
        // Otherwise, use FileReader for local preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          editor.chain().focus().setImage({ src: url }).run();
        };
        reader.readAsDataURL(file);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [editor, onImageUpload]
  );

  const setTextColor = useCallback(() => {
    if (!editor) return;

    const color = window.prompt("Введите цвет (hex, rgb, или название):", "#3b82f6");
    if (color) {
      editor.chain().focus().setColor(color).run();
    }
  }, [editor]);

  const setHighlight = useCallback(() => {
    if (!editor) return;

    const color = window.prompt("Введите цвет выделения:", "#fbbf24");
    if (color) {
      editor.chain().focus().setHighlight({ color }).run();
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border border-border rounded-lg overflow-hidden bg-card ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-background/50">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Жирный (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Курсив (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Подчеркивание (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Зачеркнутый"
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Код (Ctrl+E)"
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>

        {/* Color & Highlight */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setTextColor}
            title="Цвет текста"
          >
            <Palette className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setHighlight}
            className={editor.isActive("highlight") ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Выделение"
          >
            <Highlighter className="w-4 h-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Заголовок 1"
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Заголовок 2"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive("heading", { level: 3 }) ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Заголовок 3"
          >
            <Heading3 className="w-4 h-4" />
          </Button>
        </div>

        {/* Lists & Quote */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Маркированный список"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Нумерованный список"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Цитата"
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={editor.isActive({ textAlign: "left" }) ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Выравнивание по левому краю"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={editor.isActive({ textAlign: "center" }) ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Выравнивание по центру"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={editor.isActive({ textAlign: "right" }) ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Выравнивание по правому краю"
          >
            <AlignRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Link, Image & Table */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={editor.isActive("link") ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Вставить ссылку"
          >
            <Link2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
            title="Вставить изображение (URL)"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            title="Загрузить изображение"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertTable}
            className={editor.isActive("table") ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Вставить таблицу"
          >
            <TableIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Code Block & Horizontal Rule */}
        <div className="flex items-center gap-1 pr-2 border-r border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive("codeBlock") ? "bg-accent-blue/20 text-accent-blue" : ""}
            title="Блок кода"
          >
            <Code className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Горизонтальная линия"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Отменить (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Повторить (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        {/* Clear Formatting */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            title="Очистить форматирование"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
