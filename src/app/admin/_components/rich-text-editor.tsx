"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Eye, 
  Code,
  Heading1,
  Heading2
} from "lucide-react";
import { clsx } from "clsx";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder, 
  minHeight = "200px" 
}: RichTextEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const insertText = (before: string, after: string = "") => {
    const textarea = document.getElementById("rt-editor") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newValue = 
      value.substring(0, start) + 
      before + 
      selectedText + 
      after + 
      value.substring(end);
    
    onChange(newValue);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: () => insertText("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertText("_", "_") },
    { icon: Heading1, label: "H1", action: () => insertText("# ", "") },
    { icon: Heading2, label: "H2", action: () => insertText("## ", "") },
    { icon: List, label: "Bullet List", action: () => insertText("- ", "") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertText("1. ", "") },
    { icon: LinkIcon, label: "Link", action: () => insertText("[", "](url)") },
    { icon: Code, label: "Code", action: () => insertText("`", "`") },
  ];

  return (
    <div className="border border-border-DEFAULT rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
      {/* Toolbar */}
      <div className="bg-surface-subtle border-b border-border-DEFAULT p-2 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((btn, i) => (
            <button
              key={i}
              type="button"
              onClick={btn.action}
              className="p-1.5 hover:bg-white rounded-md transition-colors text-text-muted hover:text-primary-500"
              title={btn.label}
              disabled={mode === "preview"}
            >
              <btn.icon size={18} />
            </button>
          ))}
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={clsx(
              "flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all",
              mode === "edit" ? "bg-white text-primary-600 shadow-sm" : "text-text-muted hover:text-text-main"
            )}
          >
            <Code size={16} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={clsx(
              "flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all",
              mode === "preview" ? "bg-white text-primary-600 shadow-sm" : "text-text-muted hover:text-text-main"
            )}
          >
            <Eye size={16} />
            Preview
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative flex-1" style={{ minHeight }}>
        {mode === "edit" ? (
          <textarea
            id="rt-editor"
            className="w-full h-full min-h-[inherit] p-4 focus:outline-none resize-y text-text-main font-mono text-sm leading-relaxed"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <div className="p-4 prose prose-sm max-w-none prose-headings:text-text-main prose-p:text-text-main prose-strong:text-text-main prose-ul:list-disc prose-ol:list-decimal overflow-auto h-full min-h-[inherit]">
            <ReactMarkdown>
              {value || "_Nothing to preview_"}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
