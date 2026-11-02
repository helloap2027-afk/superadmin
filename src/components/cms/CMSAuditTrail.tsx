"use client";

import React from "react";
import { ShieldCheck, UserCheck, Calendar } from "lucide-react";

export interface AuditLogEntry {
  id: string;
  pageSlug: string;
  language: string;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  performedBy: string;
  performedByRole: string;
  details: string;
  timestamp: string;
}

interface CMSAuditTrailProps {
  logs: AuditLogEntry[];
}

export function CMSAuditTrail({ logs }: CMSAuditTrailProps) {
  const formatTimestamp = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
    } catch {
      return ts;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "PUBLISH":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "UNPUBLISH":
      case "ARCHIVE":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "SUBMIT_REVIEW":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "RESTORE_REVISION":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Administrative Audit Log ({logs.length})
          </h4>
          <p className="text-[11px] text-slate-500">
            Immutable server-side records for governance, publishing trails, and compliance.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tamper-Resistant</span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
          No audit log actions recorded yet for this page.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Status Transition</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-slate-400" />
                        <span>{log.performedBy}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({log.performedByRole})
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[11px]">
                      {log.previousStatus && log.newStatus ? (
                        <span>
                          <span className="text-slate-500">{log.previousStatus}</span>
                          {" → "}
                          <span className="font-bold text-slate-900">
                            {log.newStatus}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-xs truncate">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
