"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Send,
  Copy,
  Trash2,
  XCircle,
  Eye,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  MapPin,
  Users,
  CheckSquare
} from "lucide-react";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/StateComponents";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { BulkActionToolbar } from "@/components/shared/BulkActionToolbar";
import { UnifiedPreviewModal } from "@/components/shared/UnifiedPreviewModal";

interface CampaignItem {
  id: string;
  name: string;
  ad_title: string;
  notification_title: string;
  notification_body: string;
  category: string;
  priority: string;
  target_audience: string;
  target_city: string;
  scheduled_at: string | null;
  status: string;
  target_count: number;
  eligible_count: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
}

export function CampaignNotificationsModule() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Query params
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cityFilter, setCityFilter] = useState("All");

  // Meta
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Selection & Bulk State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Modal / Preview state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<CampaignItem | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formAdTitle, setFormAdTitle] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formCategory, setFormCategory] = useState("Electronics");
  const [formPriority, setFormPriority] = useState("NORMAL");
  const [formAudience, setFormAudience] = useState("ALL");
  const [formCity, setFormCity] = useState("Vijayawada");
  const [formScheduledAt, setFormScheduledAt] = useState("");
  const [formStatus, setFormStatus] = useState("DRAFT");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (cityFilter !== "All") params.append("city", cityFilter);

      const res = await fetch(`http://localhost:4000/api/v1/admin/campaigns?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setCampaigns(json.data || []);
        if (json.pagination) {
          setTotalRecords(json.pagination.totalRecords || 0);
          setTotalPages(json.pagination.totalPages || 1);
        }
      } else {
        throw new Error(json.message || "Failed to load campaigns");
      }
    } catch (err: any) {
      setError(err?.message || "Error loading campaigns");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter, cityFilter]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(campaigns.map((c) => c.id));
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

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmMsg = `Are you sure you want to delete ${selectedIds.length} selected campaign(s)? Only draft or cancelled campaigns will be removed; active or completed campaigns will be preserved.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setIsProcessingBulk(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/campaigns/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedIds([]);
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-user": "Super Admin" },
        body: JSON.stringify({
          name: formName,
          adTitle: formAdTitle || formName,
          notificationTitle: formTitle,
          notificationBody: formBody,
          category: formCategory,
          priority: formPriority,
          targetAudience: formAudience,
          targetCity: formCity,
          scheduledAt: formScheduledAt || null,
          status: formStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsCreateOpen(false);
        setFormName("");
        setFormAdTitle("");
        setFormTitle("");
        setFormBody("");
        fetchCampaigns();
      } else {
        alert(json.message || "Could not save campaign");
      }
    } catch (err: any) {
      alert(err?.message || "Error creating campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/admin/campaigns/${id}/duplicate`, {
        method: "POST",
        headers: { "x-admin-user": "Super Admin" },
      });
      const json = await res.json();
      if (json.success) {
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this un-dispatched draft campaign?")) return;
    try {
      await fetch(`http://localhost:4000/api/v1/admin/campaigns/${id}`, { method: "DELETE" });
      fetchCampaigns();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Cancel scheduled broadcast for this campaign?")) return;
    try {
      await fetch(`http://localhost:4000/api/v1/admin/campaigns/${id}/cancel`, { method: "POST" });
      fetchCampaigns();
    } catch (err) {
      console.error(err);
    }
  };

  const isAllSelected = campaigns.length > 0 && selectedIds.length === campaigns.length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0076D7] uppercase tracking-wider">
            <Megaphone className="w-4 h-4" />
            <span>Promotional Push Broadcasts</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight mt-1">
            Campaign Push Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Build, schedule, and preview promotional marketing alerts for Andhra Pradesh users.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0076D7] hover:bg-[#0062b3] text-white font-bold text-sm shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={selectedIds.length}
        totalVisibleCount={campaigns.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkDelete={handleBulkDelete}
        entityName="campaigns"
        isProcessing={isProcessingBulk}
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns, titles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7] font-medium"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#0076D7]"
        >
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* City Filter */}
        <select
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#0076D7]"
        >
          <option value="All">All Cities</option>
          <option value="Vijayawada">Vijayawada</option>
          <option value="Guntur">Guntur</option>
          <option value="Visakhapatnam">Visakhapatnam</option>
        </select>

        <button
          onClick={fetchCampaigns}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#0076D7]" : ""}`} />
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} columns={8} />
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <button
              onClick={fetchCampaigns}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
            >
              Try Again
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-12">
            <EmptyState
              title="No promotional campaigns found"
              description="Create a promotional campaign push notification targeting your customers or businesses."
              actionLabel="Create First Campaign"
              onAction={() => setIsCreateOpen(true)}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0076D7] border-slate-300 focus:ring-[#0076D7] cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3.5">Campaign Name</th>
                  <th className="px-4 py-3.5">Notification Title & Body</th>
                  <th className="px-4 py-3.5">Target & City</th>
                  <th className="px-4 py-3.5">Recipients</th>
                  <th className="px-4 py-3.5">Scheduled / Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {campaigns.map((cmp) => {
                  const isSelected = selectedIds.includes(cmp.id);
                  const statusColors: Record<string, string> = {
                    DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
                    SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
                    QUEUED: "bg-amber-50 text-amber-700 border-amber-200",
                    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
                  };

                  return (
                    <tr key={cmp.id} className={`transition ${isSelected ? "bg-blue-50/40" : "hover:bg-slate-50/60"}`}>
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(cmp.id, e.target.checked)}
                          className="w-4 h-4 rounded text-[#0076D7] border-slate-300 focus:ring-[#0076D7] cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900">{cmp.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{cmp.id} • {cmp.category}</div>
                      </td>

                      <td className="px-4 py-4 max-w-[280px]">
                        <div className="font-semibold text-slate-900 truncate">{cmp.notification_title}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">{cmp.notification_body}</div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{cmp.target_city}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{cmp.target_audience}</div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <Users className="w-3 h-3 text-slate-400" />
                          <span>{cmp.eligible_count} users</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[11px] text-slate-700 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>
                            {cmp.scheduled_at
                              ? new Date(cmp.scheduled_at).toLocaleDateString("en-IN", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Immediate / Draft"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            statusColors[cmp.status] || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {cmp.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPreviewItem(cmp)}
                            className="p-1.5 text-slate-500 hover:text-[#0076D7] rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Preview Notification"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(cmp.id)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Duplicate Campaign"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {cmp.status === "SCHEDULED" && (
                            <button
                              onClick={() => handleCancel(cmp.id)}
                              className="p-1.5 text-amber-600 hover:text-amber-800 rounded-lg hover:bg-amber-50 transition cursor-pointer"
                              title="Cancel Schedule"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {(cmp.status === "DRAFT" || cmp.status === "CANCELLED") && (
                            <button
                              onClick={() => handleDelete(cmp.id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Delete Draft"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Create Promotional Campaign</h3>
                <p className="text-xs text-slate-500">Configure notification broadcast for Andhra Pradesh users</p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Campaign Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sankranti Home Services Fest"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target City</label>
                  <select
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Guntur">Guntur</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                    <option value="All">All Cities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Home Services">Home Services</option>
                    <option value="Health & Medical">Health & Medical</option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notification Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 30% Off on Home Deep Cleaning!"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notification Message Body <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Brief broadcast message seen by customers on device lockscreen..."
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Schedule Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formScheduledAt}
                    onChange={(e) => {
                      setFormScheduledAt(e.target.value);
                      if (e.target.value) setFormStatus("SCHEDULED");
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="DRAFT">Save as Draft</option>
                    <option value="SCHEDULED">Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UNIFIED REALISTIC PREVIEW MODAL */}
      <UnifiedPreviewModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        title={previewItem?.name || "Campaign Preview"}
        type="CAMPAIGN"
        data={previewItem}
      />
    </div>
  );
}
