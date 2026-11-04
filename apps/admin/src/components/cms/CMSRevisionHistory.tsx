"use client";

import React, { useState } from "react";
import { History, RotateCcw, Eye, X } from "lucide-react";

export interface RevisionItem {
  id: string;
  revisionNumber: number;
  title: string;
  shortDescription: string;
  content: string;
  status: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  changeSummary: string;
  createdBy: string;
  createdAt: string;
}

interface CMSRevisionHistoryProps {
  revisions: RevisionItem[];
  onRestore: (revisionId: string) => void;
  isLoading?: boolean;
}

export function CMSRevisionHistory({
  revisions,
  onRestore,
  isLoading,
}: CMSRevisionHistoryProps) {
  const [selectedRevision, setSelectedRevision] = useState<RevisionItem | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Revision Timeline ({revisions.length})
        </h4>
        <span className="text-[11px] text-slate-400">Chronological Snapshots</span>
      </div>

      {revisions.length === 0 ? (
        <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
          No revision history recorded yet.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {revisions.map((rev) => {
            const isPublished = rev.status === "PUBLISHED";
            const isDraft = rev.status === "DRAFT";

            return (
              <div key={rev.id} className="relative group">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-white shadow-xs ${
                    isPublished
                      ? "bg-emerald-500 ring-2 ring-emerald-200"
                      : isDraft
                      ? "bg-slate-400"
                      : "bg-[#0076D7]"
                  }`}
                />

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs group-hover:border-[#0076D7]/40 transition space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        Revision #{rev.revisionNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isPublished
                            ? "bg-emerald-50 text-emerald-700"
                            : isDraft
                            ? "bg-slate-100 text-slate-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {rev.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedRevision(rev)}
                        title="View Snapshot"
                        className="p-1 rounded text-slate-400 hover:text-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => {
                          if (
                            confirm(
                              `Restore Revision #${rev.revisionNumber} into a new draft? This will safely preserve your current content in the revision history.`
                            )
                          ) {
                            onRestore(rev.id);
                          }
                        }}
                        title="Restore to Draft"
                        className="p-1 rounded text-slate-400 hover:text-[#0076D7]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium">
                    {rev.changeSummary || "Draft update"}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>by {rev.createdBy || "Super Admin"}</span>
                    <span>{formatDate(rev.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Snapshot Preview Modal */}
      {selectedRevision && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#FF6B35]" />
                <h3 className="text-sm font-bold text-white">
                  Revision #{selectedRevision.revisionNumber} Snapshot
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRevision(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Title
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {selectedRevision.title}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Short Description
                </span>
                <p className="text-xs text-slate-600">
                  {selectedRevision.shortDescription || "None"}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Content HTML
                </span>
                <div
                  className="prose prose-slate max-w-none p-3.5 bg-slate-50 border border-slate-200 rounded-xl max-h-60 overflow-y-auto text-xs"
                  dangerouslySetInnerHTML={{ __html: selectedRevision.content }}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRevision(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const revId = selectedRevision.id;
                  setSelectedRevision(null);
                  onRestore(revId);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0076D7] hover:bg-blue-600 text-white shadow-xs"
              >
                Restore This Revision to Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
