"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  subtextColor?: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export function MetricCard({
  label,
  value,
  subtext,
  subtextColor = "text-slate-400",
  icon: Icon,
  iconBg = "bg-blue-50",
  iconColor = "text-[#0076D7]",
}: MetricCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between transition hover:shadow-xs">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          {label}
        </span>
        <div className="text-2xl font-black text-[#0B1220] tracking-tight">
          {value}
        </div>
        {subtext && (
          <span className={`text-[11px] font-medium block ${subtextColor}`}>
            {subtext}
          </span>
        )}
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  badge,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-black text-[#0B1220] tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export interface DataTableProps<T> {
  columns: {
    header: string;
    accessorKey?: keyof T;
    className?: string;
    cell?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({ columns, data, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`p-4 font-semibold ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-slate-50/80 transition">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`p-4 ${col.className || ""}`}>
                    {col.cell ? col.cell(item) : String((item as any)[col.accessorKey as any] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

