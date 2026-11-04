"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Quote,
  Code,
  Undo2,
  Redo2,
  Maximize2,
  Minimize2,
  ChevronDown
} from "lucide-react";

interface CMSContentEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export function CMSContentEditor({ value, onChange }: CMSContentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [formatBlock, setFormatBlock] = useState("p");
  const [isFormatMenuOpen, setIsFormatMenuOpen] = useState(false);

  // Sync initial content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInsertLink = () => {
    const url = prompt("Enter hyperlink URL (e.g. https://hello-hi.in/about):");
    if (url) {
      exec("createLink", url);
    }
  };

  const handleInsertImage = () => {
    const url = prompt("Enter image source URL:");
    if (url) {
      exec("insertImage", url);
    }
  };

  const handleInsertTable = () => {
    const tableHtml = `
      <table class="border-collapse border border-slate-300 my-3 w-full text-xs">
        <thead>
          <tr class="bg-slate-100">
            <th class="border border-slate-300 p-2 text-left font-bold">Item</th>
            <th class="border border-slate-300 p-2 text-left font-bold">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-300 p-2">Parameter 1</td>
            <td class="border border-slate-300 p-2">Standard specification</td>
          </tr>
          <tr>
            <td class="border border-slate-300 p-2">Parameter 2</td>
            <td class="border border-slate-300 p-2">Regulatory compliance</td>
          </tr>
        </tbody>
      </table><p><br></p>
    `;
    exec("insertHTML", tableHtml);
  };

  const setBlockType = (tag: string) => {
    setFormatBlock(tag);
    setIsFormatMenuOpen(false);
    exec("formatBlock", `<${tag}>`);
  };

  return (
    <div
      className={`border border-slate-200 rounded-xl bg-white shadow-xs transition ${
        isFullscreen ? "fixed inset-4 z-50 flex flex-col shadow-2xl" : "flex flex-col"
      }`}
    >
      {/* Editor Formatting Toolbar (Matches Reference Design) */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 rounded-t-xl text-slate-600 text-xs select-none">
        {/* Paragraph / Heading Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsFormatMenuOpen(!isFormatMenuOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-slate-200 transition font-medium text-xs text-slate-700 bg-white border border-slate-200 shadow-xs"
          >
            <span>
              {formatBlock === "h1"
                ? "Heading 1"
                : formatBlock === "h2"
                ? "Heading 2"
                : formatBlock === "h3"
                ? "Heading 3"
                : "Paragraph"}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isFormatMenuOpen && (
            <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30">
              <button
                type="button"
                onClick={() => setBlockType("p")}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 block font-normal"
              >
                Paragraph
              </button>
              <button
                type="button"
                onClick={() => setBlockType("h1")}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 block font-black text-sm"
              >
                Heading 1
              </button>
              <button
                type="button"
                onClick={() => setBlockType("h2")}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 block font-bold text-xs"
              >
                Heading 2
              </button>
              <button
                type="button"
                onClick={() => setBlockType("h3")}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 block font-semibold text-xs text-slate-700"
              >
                Heading 3
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-slate-300 mx-1" />

        {/* Basic Styles */}
        <button
          type="button"
          onClick={() => exec("bold")}
          title="Bold (Ctrl+B)"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <Bold className="w-3.5 h-3.5 font-bold" />
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          title="Italic (Ctrl+I)"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          title="Underline (Ctrl+U)"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          title="Bullet List"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          title="Numbered List"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-300 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => exec("justifyLeft")}
          title="Align Left"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("justifyCenter")}
          title="Align Center"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("justifyRight")}
          title="Align Right"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-300 mx-1" />

        {/* Media & Embeds */}
        <button
          type="button"
          onClick={handleInsertLink}
          title="Insert Hyperlink"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleInsertImage}
          title="Insert Image"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <ImageIcon className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleInsertTable}
          title="Insert Table"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <TableIcon className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<blockquote>")}
          title="Quote"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<pre>")}
          title="Code Block"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-300 mx-1" />

        {/* History & Fullscreen */}
        <button
          type="button"
          onClick={() => exec("undo")}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("redo")}
          title="Redo (Ctrl+Y)"
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition ml-auto"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={`p-5 focus:outline-none overflow-y-auto text-slate-800 text-xs sm:text-sm leading-relaxed prose prose-slate max-w-none ${
          isFullscreen ? "flex-1" : "min-h-[360px]"
        }`}
        style={{
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      />
    </div>
  );
}
