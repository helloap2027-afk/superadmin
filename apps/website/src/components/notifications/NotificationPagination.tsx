"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NotificationPaginationProps {
  page: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (newPage: number) => void;
}

export function NotificationPagination({
  page,
  totalPages,
  totalRecords,
  onPageChange,
}: NotificationPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600 shadow-2xs">
      <div>
        Showing page <span className="font-bold text-slate-900">{page}</span> of{" "}
        <span className="font-bold text-slate-900">{totalPages}</span> (
        <span className="font-bold text-[#0076D7]">{totalRecords}</span> total notifications)
      </div>

      <div className="flex items-center gap-1.5">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 shadow-2xs"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <div className="px-2 text-slate-400 font-bold">
          {page} / {totalPages}
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 shadow-2xs"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

