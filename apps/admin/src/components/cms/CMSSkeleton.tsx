"use client";

import React from "react";

export function CMSSkeleton() {
  return (
    <div
      className="flex-1 p-6 space-y-6 animate-pulse"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Top Header Breadcrumb + Actions Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-2">
          <div className="h-4 w-48 bg-slate-200 rounded"></div>
          <div className="h-8 w-72 bg-slate-200 rounded"></div>
          <div className="h-4 w-96 bg-slate-100 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-28 bg-slate-200 rounded-lg"></div>
          <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
          <div className="h-9 w-28 bg-slate-300 rounded-lg"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-4 border-b border-slate-200 pb-2">
        <div className="h-6 w-24 bg-slate-200 rounded"></div>
        <div className="h-6 w-20 bg-slate-100 rounded"></div>
        <div className="h-6 w-20 bg-slate-100 rounded"></div>
        <div className="h-6 w-20 bg-slate-100 rounded"></div>
      </div>

      {/* Main Grid: Left Editor + Right Status Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Skeleton */}
        <div className="lg:col-span-2 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-4 w-20 bg-slate-200 rounded"></div>
              <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-20 bg-slate-200 rounded"></div>
              <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-slate-200 rounded"></div>
            <div className="h-20 w-full bg-slate-100 rounded-xl"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="h-11 w-full bg-slate-200 rounded-t-xl"></div>
            <div className="h-72 w-full bg-slate-100 rounded-b-xl"></div>
          </div>
        </div>

        {/* Right Sidebar Cards Skeleton */}
        <div className="space-y-5">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
            <div className="h-5 w-32 bg-slate-200 rounded"></div>
            <div className="h-4 w-44 bg-slate-100 rounded"></div>
            <div className="h-10 w-full bg-slate-100 rounded-lg"></div>
            <div className="h-4 w-36 bg-slate-100 rounded"></div>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
            <div className="h-5 w-28 bg-slate-200 rounded"></div>
            <div className="h-10 w-full bg-slate-100 rounded-lg"></div>
            <div className="h-16 w-full bg-slate-100 rounded-lg"></div>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
            <div className="h-5 w-32 bg-slate-200 rounded"></div>
            <div className="h-12 w-full bg-slate-100 rounded-lg"></div>
            <div className="h-12 w-full bg-slate-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
