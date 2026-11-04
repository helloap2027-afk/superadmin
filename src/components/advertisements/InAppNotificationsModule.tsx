"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  BellRing,
  Plus,
  Search,
  Trash2,
  Calendar,
  AlertCircle,
  RefreshCw,
  Sparkles,
  MapPin,
  CheckCircle,
  Eye,
  Edit3,
  CheckSquare
} from "lucide-react";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/StateComponents";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { BulkActionToolbar } from "@/components/shared/BulkActionToolbar";
import { UnifiedPreviewModal } from "@/components/shared/UnifiedPreviewModal";

interface InAppItem {
  id: string;
  title: string;
  message: string;
  category: string;
  target_audience: string;
  target_city: string;
  priority: string;
  status: string;
  read_count: number;
  created_at: string;
}

export function InAppNotificationsModule() {
  const [items, setItems] = useState<InAppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Selection & Bulk State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InAppItem | null>(null);
  const [previewItem, setPreviewItem] = useState<InAppItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formCategory, setFormCategory] = useState("ANNOUNCEMENT");
  const [formCity, setFormCity] = useState("All");
  const [formPriority, setFormPriority] = useState("NORMAL");

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`http://localhost:4000/api/v1/admin/in-app-notifications?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setItems(json.data || []);
        if (json.pagination) {
          setTotalRecords(json.pagination.totalRecords || 0);
          setTotalPages(json.pagination.totalPages || 1);
        }
      } else {
        throw new Error(json.message || "Failed to load in-app notifications");
      }
    } catch (err: any) {
      setError(err?.message || "Error loading announcements");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, statusFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(items.map((i) => i.id));
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
    const confirmMsg = `Are you sure you want to delete ${selectedIds.length} selected in-app announcement(s)?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setIsProcessingBulk(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/in-app-notifications/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const json = await res.json();
      if (json.success) {
        setSelectedIds([]);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const handleOpenEdit = (item: InAppItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormMessage(item.message);
    setFormCategory(item.category);
    setFormCity(item.target_city);
    setFormPriority(item.priority);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently remove this in-app announcement?")) return;
    try {
      await fetch(`http://localhost:4000/api/v1/admin/in-app-notifications/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const isEdit = !!editingItem;
      const url = isEdit
        ? `http://localhost:4000/api/v1/admin/in-app-notifications/${editingItem.id}`
        : "http://localhost:4000/api/v1/admin/in-app-notifications";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-admin-user": "Super Admin" },
        body: JSON.stringify({
          title: formTitle,
          message: formMessage,
          category: formCategory,
          targetCity: formCity,
          priority: formPriority,
          status: editingItem ? editingItem.status : "PUBLISHED",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsCreateOpen(false);
        setEditingItem(null);
        setFormTitle("");
        setFormMessage("");
        fetchItems();
      } else {
        alert(json.message || "Could not save notification");
      }
    } catch (err: any) {
      alert(err?.message || "Error saving notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0076D7] uppercase tracking-wider">
            <BellRing className="w-4 h-4" />
            <span>Mobile App Inbox Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight mt-1">
            In-App Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Publish persistent updates and service announcements directly to mobile user inboxes.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setFormTitle("");
            setFormMessage("");
            setIsCreateOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0076D7] hover:bg-[#0062b3] text-white font-bold text-sm shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New In-App Message</span>
        </button>
      </div>

      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={selectedIds.length}
        totalVisibleCount={items.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkDelete={handleBulkDelete}
        entityName="notifications"
        isProcessing={isProcessingBulk}
      />

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search in-app announcements..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7] font-medium"
          />
        </div>

        <button
          onClick={fetchItems}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#0076D7]" : ""}`} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={4} columns={7} />
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <button
              onClick={fetchItems}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
            >
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12">
            <EmptyState
              title="No in-app announcements found"
              description="Publish messages that will appear in the customer app inbox feed."
              actionLabel="Create In-App Message"
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
                  <th className="px-5 py-3.5">Announcement Title</th>
                  <th className="px-4 py-3.5">Message Content</th>
                  <th className="px-4 py-3.5">City & Category</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Published Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {items.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr key={item.id} className={`transition ${isSelected ? "bg-blue-50/40" : "hover:bg-slate-50/60"}`}>
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                          className="w-4 h-4 rounded text-[#0076D7] border-slate-300 focus:ring-[#0076D7] cursor-pointer"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.id}</div>
                      </td>

                      <td className="px-4 py-4 max-w-[320px]">
                        <div className="text-slate-700 line-clamp-2">{item.message}</div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.target_city}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.category}</div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                        {new Date(item.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewItem(item)}
                            className="p-1.5 text-slate-500 hover:text-[#0076D7] rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Preview Mobile Inbox View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Announcement"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Announcement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* CREATE / EDIT MODAL */}
      {(isCreateOpen || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {editingItem ? "Edit In-App Message" : "New In-App Message"}
                </h3>
                <p className="text-xs text-slate-500">Broadcasts to customer mobile app inbox</p>
              </div>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingItem(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Emergency Electrician Services Available"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0076D7] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message Body <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter user announcement content..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
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
                    <option value="All">All Cities</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Guntur">Guntur</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="ANNOUNCEMENT">Announcement</option>
                    <option value="CATEGORY_LAUNCH">Category Launch</option>
                    <option value="SECURITY_NOTICE">Security Notice</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingItem ? "Update Message" : "Publish to App Inbox"}
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
        title={previewItem?.title || "In-App Announcement Preview"}
        type="IN_APP"
        data={previewItem}
      />
    </div>
  );
}
