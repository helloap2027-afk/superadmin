"use client";

import React from "react";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export function TableSkeleton({
  rows = 5,
  columns = 6,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <div
      className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs animate-pulse"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {showHeader && (
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="h-3.5 bg-slate-200 rounded-md"
              style={{ width: `${Math.max(12, 100 / columns - 4)}%` }}
            />
          ))}
        </div>
      )}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-6 py-4 flex items-center gap-4">
            {Array.from({ length: columns }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-slate-100 rounded-md"
                style={{
                  width: `${c === 0 ? 18 : c === 1 ? 24 : Math.max(10, 80 / columns)}%`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 4 }: CardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 bg-slate-200 rounded-md w-28" />
            <div className="w-8 h-8 rounded-xl bg-slate-100" />
          </div>
          <div className="h-7 bg-slate-200 rounded-md w-24" />
          <div className="h-2.5 bg-slate-100 rounded-md w-36" />
        </div>
      ))}
    </div>
  );
}

interface NotificationSkeletonProps {
  count?: number;
}

export function NotificationSkeleton({ count = 5 }: NotificationSkeletonProps) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-200 rounded-md w-48" />
              <div className="h-3 bg-slate-100 rounded-md w-16" />
            </div>
            <div className="h-3 bg-slate-100 rounded-md w-full" />
            <div className="h-3 bg-slate-100 rounded-md w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
