"use client";

import React, { useState, useEffect } from "react";
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface DeliveryLog {
  id: string;
  email_ref?: string;
  recipient_email: string;
  recipient_masked?: string;
  sender_email: string;
  subject: string;
  template_key?: string;
  campaign_id?: string;
  provider: string;
  delivery_status?: string;
  status?: string;
  error_message?: string;
  retry_count?: number;
  attempt_count?: number;
  created_at: string;
}

export function EmailLogsModule() {
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  // Selection & Delete State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`http://localhost:4000/api/v1/admin/email/logs?${params.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLogs(json.data);
        if (json.pagination) {
          setTotalRecords(json.pagination.totalRecords || 0);
          setTotalPages(json.pagination.totalPages || 1);
        }
      }
    } catch (err) {
      console.error("Failed to load logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  // Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(logs.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleDeleteOne = async (id: string) => {
    if (!window.confirm("Permanently delete this email delivery log record?")) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`http://localhost:4000/api/v1/admin/email/logs/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        fetchLogs();
      } else {
        alert(json.message || "Failed to delete log");
      }
    } catch (err) {
      alert("Error deleting delivery log record");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const msg = `Are you sure you want to permanently delete ${selectedIds.length} selected delivery log record(s)?`;
    if (!window.confirm(msg)) return;

    try {
      setIsDeleting(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/email/logs/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedIds([]);
        fetchLogs();
      } else {
        alert(json.message || "Failed to bulk delete logs");
      }
    } catch (err) {
      alert("Error deleting selected delivery logs");
    } finally {
      setIsDeleting(false);
    }
  };

  const isAllSelected = logs.length > 0 && selectedIds.length === logs.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0076D7] uppercase tracking-wider">
            <Inbox className="w-4 h-4" />
            <span>Audit & Observability</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight mt-1">
            Email Delivery Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time transmission logs across all transactional, system notifications, and marketing broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={() => {
              setSelectedIds([]);
              fetchLogs();
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0076D7]" />
            <span>Refresh Logs</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by recipient email or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0076D7]"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0076D7]"
          >
            <option value="ALL">All Delivery Statuses</option>
            <option value="ACCEPTED">Accepted by Provider</option>
            <option value="DELIVERED">Delivered</option>
            <option value="PENDING">Queued / Pending</option>
            <option value="BOUNCED">Bounced</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Querying delivery audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No delivery logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0076D7] border-slate-300 focus:ring-0 cursor-pointer"
                      title="Select all logs on this page"
                    />
                  </th>
                  <th className="px-5 py-3.5">Recipient</th>
                  <th className="px-5 py-3.5">Subject</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Provider</th>
                  <th className="px-5 py-3.5">Attempts</th>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                  const statusVal = log.delivery_status || log.status || "ACCEPTED";
                  const attemptsVal = log.retry_count ?? log.attempt_count ?? 1;
                  const isSelected = selectedIds.includes(log.id);

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-50/70 transition ${isSelected ? "bg-blue-50/40" : ""}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(log.id, e.target.checked)}
                          className="w-4 h-4 rounded text-[#0076D7] border-slate-300 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-xs">{log.recipient_email}</div>
                        <div className="text-[10px] text-slate-400 font-mono">id: {log.id}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800 text-xs line-clamp-1">{log.subject}</div>
                        {log.error_message && (
                          <div className="text-[10px] text-rose-500 mt-0.5 line-clamp-1">
                            {log.error_message}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                            statusVal === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : statusVal === "ACCEPTED"
                              ? "bg-blue-50 text-[#0076D7] border border-blue-200"
                              : statusVal === "FAILED" || statusVal === "BOUNCED"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {statusVal === "DELIVERED" ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : statusVal === "FAILED" || statusVal === "BOUNCED" ? (
                            <XCircle className="w-3 h-3 text-rose-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-blue-500" />
                          )}
                          <span>{statusVal}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-[11px] text-slate-600 uppercase">
                        {log.provider}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700">{attemptsVal}</td>
                      <td className="px-5 py-4 text-slate-500 text-[11px]">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDeleteOne(log.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete delivery log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{logs.length}</strong> of{" "}
            <strong className="text-slate-800">{totalRecords}</strong> logs
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
