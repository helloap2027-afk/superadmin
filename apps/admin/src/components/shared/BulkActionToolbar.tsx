"use client";

import React from "react";
import { Trash2, X, CheckSquare, AlertTriangle } from "lucide-react";

interface BulkActionToolbarProps {
  selectedCount: number;
  totalVisibleCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  entityName?: string;
  isProcessing?: boolean;
}

export function BulkActionToolbar({
  selectedCount,
  totalVisibleCount,
  onClearSelection,
  onBulkDelete,
  entityName = "records",
  isProcessing = false,
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 bg-[#0B1220] text-white rounded-xl shadow-lg border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-150"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0076D7] text-white text-xs font-bold">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{selectedCount} selected</span>
        </div>
        <span className="text-xs text-slate-300 hidden sm:inline">
          {selectedCount === totalVisibleCount
            ? `All ${selectedCount} visible ${entityName} selected on this page`
            : `${selectedCount} of ${totalVisibleCount} visible ${entityName}`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClearSelection}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>

        <button
          type="button"
          onClick={onBulkDelete}
          disabled={isProcessing}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{isProcessing ? "Processing..." : "Delete Selected"}</span>
        </button>
      </div>
    </div>
  );
}

