"use client";

import React, { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, HelpCircle } from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface CMSFAQEditorProps {
  items: FAQItem[];
  onChange: (items: FAQItem[]) => void;
}

export function CMSFAQEditor({ items, onChange }: CMSFAQEditorProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      order: items.length + 1,
    };

    onChange([...items, newItem]);
    setNewQuestion("");
    setNewAnswer("");
    setIsAdding(false);
  };

  const handleUpdate = (id: string, field: "question" | "answer", val: string) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this FAQ item?")) {
      const filtered = items.filter((item) => item.id !== id);
      // Re-index orders
      const reindexed = filtered.map((it, idx) => ({ ...it, order: idx + 1 }));
      onChange(reindexed);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Re-index
    const reindexed = updated.map((it, idx) => ({ ...it, order: idx + 1 }));
    onChange(reindexed);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            FAQ Questions & Answers ({items.length})
          </h4>
          <p className="text-[11px] text-slate-500">
            Reorder or edit user-facing questions to guide local shoppers and vendors.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0076D7] hover:bg-blue-600 text-white transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add FAQ Question</span>
        </button>
      </div>

      {/* Add New FAQ Form */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3"
        >
          <h5 className="text-xs font-bold text-blue-900">New FAQ Entry</h5>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Question *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. How does Hello-Hi verify local merchants?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Answer *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide a concise, helpful answer..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-600 hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0076D7] text-white hover:bg-blue-600 shadow-xs"
            >
              Save Entry
            </button>
          </div>
        </form>
      )}

      {/* FAQ Items List */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No FAQ entries added yet</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Click &quot;Add FAQ Question&quot; above to create your first question and answer pair.
            </p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => handleUpdate(item.id, "question", e.target.value)}
                    className="font-bold text-xs text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-[#0076D7] focus:outline-none px-1 py-0.5 w-full max-w-lg"
                  />
                </div>

                {/* Actions: Move Up / Down / Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                    title="Move Up"
                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    title="Move Down"
                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    title="Delete Question"
                    className="p-1 rounded text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <textarea
                  rows={2}
                  value={item.answer}
                  onChange={(e) => handleUpdate(item.id, "answer", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-[#0076D7]"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
