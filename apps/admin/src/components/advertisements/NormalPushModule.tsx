"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileCode,
  Edit3,
  Sliders,
  Sparkles,
  Send,
  Eye,
  CheckSquare,
  MapPin,
  Calendar,
  Smartphone
} from "lucide-react";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/StateComponents";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { UnifiedPreviewModal } from "@/components/shared/UnifiedPreviewModal";

interface PushTemplateItem {
  id: string;
  event_type: string;
  name: string;
  title_template: string;
  body_template: string;
  destination_url: string;
  status: "ACTIVE" | "INACTIVE";
}

interface NormalPushLogItem {
  id: string;
  notification_ref: string;
  event_type: string;
  recipient_type: string;
  recipient_id: string;
  recipient_phone: string;
  title: string;
  message: string;
  destination_url: string;
  delivery_status: string;
  created_at: string;
  sent_at: string;
}

export function NormalPushModule() {
  const [activeTab, setActiveTab] = useState<"logs" | "templates">("logs");

  // Tab 1: Logs state
  const [logs, setLogs] = useState<NormalPushLogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("ALL");
  const [recipientTypeFilter, setRecipientTypeFilter] = useState("ALL");
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [previewLog, setPreviewLog] = useState<NormalPushLogItem | null>(null);

  // Tab 2: Templates state
  const [templates, setTemplates] = useState<PushTemplateItem[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PushTemplateItem | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<PushTemplateItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Normal Push Logs (Customer / Business)
  const fetchLogs = useCallback(async () => {
    try {
      setLoadingLogs(true);
      setLogsError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search.trim()) params.append("search", search.trim());
      if (eventTypeFilter !== "ALL") params.append("eventType", eventTypeFilter);
      if (recipientTypeFilter !== "ALL") params.append("recipientType", recipientTypeFilter);

      const res = await fetch(`http://localhost:4000/api/v1/admin/normal-push-logs?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setLogs(json.data || []);
        if (json.pagination) {
          setTotalRecords(json.pagination.totalRecords || 0);
          setTotalPages(json.pagination.totalPages || 1);
        }
      }
    } catch (e: any) {
      setLogsError(e?.message || "Failed to load normal push logs");
    } finally {
      setLoadingLogs(false);
    }
  }, [page, pageSize, search, eventTypeFilter, recipientTypeFilter]);

  // Fetch Automated Event Templates
  const fetchTemplates = useCallback(async () => {
    try {
      setLoadingTemplates(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/push-templates");
      const json = await res.json();
      if (json.success) {
        setTemplates(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs();
    } else {
      fetchTemplates();
    }
  }, [activeTab, fetchLogs, fetchTemplates]);

  const handleOpenEdit = (t: PushTemplateItem) => {
    setEditingTemplate(t);
    setEditTitle(t.title_template);
    setEditBody(t.body_template);
    setEditStatus(t.status);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    try {
      setIsSaving(true);
      const res = await fetch(`http://localhost:4000/api/v1/admin/push-templates/${editingTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleTemplate: editTitle,
          bodyTemplate: editBody,
          status: editStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setEditingTemplate(null);
        fetchTemplates();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toggle Switch */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "logs"
              ? "bg-[#0076D7] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Customer & Business Delivery Logs</span>
        </button>

        <button
          onClick={() => setActiveTab("templates")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "templates"
              ? "bg-[#0076D7] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Automated Event Templates</span>
        </button>
      </div>

      {activeTab === "logs" ? (
        /* TAB 1: CUSTOMER & BUSINESS DELIVERY LOGS */
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reference, recipient phone, message..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7] font-medium"
              />
            </div>

            <select
              value={eventTypeFilter}
              onChange={(e) => {
                setEventTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold"
            >
              <option value="ALL">All Event Types</option>
              <option value="NEW_ENQUIRY_RECEIVED">New Enquiry</option>
              <option value="BUSINESS_LISTING_APPROVED">Listing Approved</option>
              <option value="REFERRAL_REWARD_GRANTED">Referral Reward</option>
              <option value="BUSINESS_VERIFICATION_COMPLETED">KYC Verified</option>
              <option value="ACCOUNT_STATUS_CHANGED">Security Alert</option>
            </select>

            <select
              value={recipientTypeFilter}
              onChange={(e) => {
                setRecipientTypeFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold"
            >
              <option value="ALL">All Recipients</option>
              <option value="BUSINESS">Business / Store</option>
              <option value="MERCHANT">Merchant Vendor</option>
              <option value="CUSTOMER">Consumer</option>
            </select>

            <button
              onClick={fetchLogs}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${loadingLogs ? "animate-spin text-[#0076D7]" : ""}`} />
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            {loadingLogs ? (
              <div className="p-6">
                <TableSkeleton rows={5} columns={6} />
              </div>
            ) : logsError ? (
              <div className="p-8 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <p className="text-sm font-semibold text-rose-600">{logsError}</p>
                <button
                  onClick={fetchLogs}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
                >
                  Try Again
                </button>
              </div>
            ) : logs.length === 0 ? (
              <div className="p-12">
                <EmptyState
                  title="No transactional push logs found"
                  description="When platform events occur for customers and merchants, their push delivery attempts are recorded here."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Reference & Event</th>
                      <th className="px-4 py-3.5">Recipient</th>
                      <th className="px-4 py-3.5">Title & Message Preview</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Dispatched At</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-xs text-slate-900">{log.notification_ref}</div>
                          <div className="text-[10px] font-semibold text-[#0076D7] mt-0.5">{log.event_type}</div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 font-bold text-slate-800">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-extrabold">
                              {log.recipient_type}
                            </span>
                            <span>{log.recipient_phone}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{log.recipient_id}</div>
                        </td>

                        <td className="px-4 py-4 max-w-[340px]">
                          <div className="font-semibold text-slate-900 truncate">{log.title}</div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">{log.message}</div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {log.delivery_status}
                          </span>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                          {new Date(log.sent_at).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setPreviewLog(log)}
                            className="p-1.5 text-slate-500 hover:text-[#0076D7] rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Preview Notification Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-4 border-t border-slate-100">
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPage(1);
                }}
                totalRecords={totalRecords}
              />
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: AUTOMATED EVENT TEMPLATES */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">System Event Push Templates</h3>
              <p className="text-xs text-slate-500">
                Triggered automatically upon platform events (referrals, KYC verification, enquiry dispatch)
              </p>
            </div>
            <button
              onClick={fetchTemplates}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              title="Refresh Templates"
            >
              <RefreshCw className={`w-4 h-4 ${loadingTemplates ? "animate-spin text-[#0076D7]" : ""}`} />
            </button>
          </div>

          {loadingTemplates ? (
            <div className="p-6">
              <TableSkeleton rows={5} columns={6} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Trigger Event</th>
                    <th className="px-4 py-3.5">Template Name</th>
                    <th className="px-4 py-3.5">Title & Message Pattern</th>
                    <th className="px-4 py-3.5">Deep-Link Destination</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {templates.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-[11px] text-[#0076D7] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {t.event_type}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap font-bold text-slate-900">
                        {t.name}
                      </td>

                      <td className="px-4 py-4 max-w-[340px]">
                        <div className="font-semibold text-slate-800">{t.title_template}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{t.body_template}</div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        /{t.destination_url}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            t.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewTemplate(t)}
                            className="p-1.5 text-slate-500 hover:text-[#0076D7] rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Preview Template"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 text-slate-600 hover:text-[#0076D7] rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Template"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* EDIT TEMPLATE MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Edit Event Push Template</h3>
                <p className="text-xs font-mono text-[#0076D7]">{editingTemplate.event_type}</p>
              </div>
              <button onClick={() => setEditingTemplate(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title Template</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Body Template <span className="text-slate-400 font-normal">(use placeholders like {"{{city}}"})</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Template Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UNIFIED REALISTIC PREVIEW MODAL */}
      <UnifiedPreviewModal
        isOpen={!!previewLog || !!previewTemplate}
        onClose={() => {
          setPreviewLog(null);
          setPreviewTemplate(null);
        }}
        title={previewLog?.title || previewTemplate?.name || "Push Notification Preview"}
        type="NORMAL_PUSH"
        data={previewLog || previewTemplate}
      />
    </div>
  );
}
