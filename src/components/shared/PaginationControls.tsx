"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function PaginationControls({
  page,
  pageSize,
  totalRecords,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = "",
}: PaginationControlsProps) {
  if (totalRecords === 0) return null;

  const startIdx = Math.min((page - 1) * pageSize + 1, totalRecords);
  const endIdx = Math.min(page * pageSize, totalRecords);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 py-3 px-4 bg-white border-t border-slate-200 rounded-b-2xl ${className}`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="flex items-center gap-3">
        <span>
          Showing <span className="font-semibold text-slate-900">{startIdx}</span> to{" "}
          <span className="font-semibold text-slate-900">{endIdx}</span> of{" "}
          <span className="font-semibold text-slate-900">{totalRecords.toLocaleString("en-IN")}</span> records
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
            <span className="text-[11px] text-slate-400">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#0076D7]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => hasPreviousPage && onPageChange(page - 1)}
          disabled={!hasPreviousPage}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
            hasPreviousPage
              ? "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer shadow-2xs"
              : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <span className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 rounded-lg border border-slate-200">
          {page} / {Math.max(1, totalPages)}
        </span>

        <button
          type="button"
          onClick={() => hasNextPage && onPageChange(page + 1)}
          disabled={!hasNextPage}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
            hasNextPage
              ? "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 cursor-pointer shadow-2xs"
              : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
          }`}
          title="Next Page"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
