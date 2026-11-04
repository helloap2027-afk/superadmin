"use client";

import React, { useState, useEffect } from "react";
import { History, Shield, CheckCircle2, Clock, ArrowRight, User } from "lucide-react";
import { PlanVersion } from "./types";

interface VersionHistoryProps {
  planId: string;
  planName: string;
}

export function PlanVersionHistoryModal({
  planId,
  planName,
  onClose,
}: {
  planId: string;
  planName: string;
  onClose: () => void;
}) {
  const [versions, setVersions] = useState<PlanVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/v1/admin/subscriptions/plans/${planId}/details`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.versions) {
          setVersions(json.data.versions);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [planId]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Version History &amp; Audit</h3>
              <p className="text-[11px] text-slate-500 font-medium">{planName} ({planId})</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {loading ? (
            <div className="py-8 text-center text-slate-400">Loading version snapshots...</div>
          ) : versions.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              No historical versions recorded yet for this tier.
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((v) => {
                let parsedFeatures: string[] = [];
                try {
                  parsedFeatures = typeof v.features_snapshot === "string"
                    ? JSON.parse(v.features_snapshot)
                    : v.features_snapshot || [];
                } catch {
                  parsedFeatures = [];
                }

                return (
                  <div
                    key={v.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                          v{v.version_number}.0
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{v.name}</span>
                      </div>
                      <div className="text-sm font-black text-slate-900">
                        ₹{v.price.toLocaleString("en-IN")}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">
                          /{v.billing_interval?.toLowerCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {new Date(v.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>Published by {v.published_by}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                      "{v.change_summary || "Published production version"}"
                    </p>

                    {parsedFeatures.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Features in this release:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {parsedFeatures.map((f, idx) => (
                            <li key={idx} className="flex items-center gap-1.5 text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0076D7]" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
