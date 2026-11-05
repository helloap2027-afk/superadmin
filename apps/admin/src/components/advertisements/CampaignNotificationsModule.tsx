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
  CheckSquare,
  Tag,
  Edit2,
  FolderPlus,
  Check,
  X,
  Layers,
  ArrowRight
} from "lucide-react";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/StateComponents";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { BulkActionToolbar } from "@/components/shared/BulkActionToolbar";
import { UnifiedPreviewModal } from "@/components/shared/UnifiedPreviewModal";
import { GlobalPushSettingsModal } from "@/components/advertisements/GlobalPushSettingsModal";
import { Sliders } from "lucide-react";

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

interface CampaignCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  campaigns_count?: number;
}

export function CampaignNotificationsModule() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic Categories State
  const [categories, setCategories] = useState<CampaignCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isGlobalPushSettingsOpen, setIsGlobalPushSettingsOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatColor, setNewCatColor] = useState("#0076D7");
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [categoryActionFeedback, setCategoryActionFeedback] = useState<string | null>(null);

  // Category Edit state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatDesc, setEditCatDesc] = useState("");
  const [editCatColor, setEditCatColor] = useState("#0076D7");

  // Query params
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cityFilter, setCityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Meta
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Selection & Bulk State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Modal / Preview state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditCampaignOpen, setIsEditCampaignOpen] = useState(false);
  const [editingCampaignItem, setEditingCampaignItem] = useState<CampaignItem | null>(null);
  const [previewItem, setPreviewItem] = useState<CampaignItem | null>(null);

  // Campaign Create/Edit Form state
  const [formName, setFormName] = useState("");
  const [formAdTitle, setFormAdTitle] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formCategory, setFormCategory] = useState("General");
  const [formPriority, setFormPriority] = useState("NORMAL");
  const [formAudience, setFormAudience] = useState("ALL");
  const [formCity, setFormCity] = useState("Vijayawada");
  const [formScheduledAt, setFormScheduledAt] = useState("");
  const [formStatus, setFormStatus] = useState("DRAFT");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Categories dynamically from backend
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/campaign-categories");
      if (!res.ok) throw new Error("Failed to load categories");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
        // Only set default if user hasn't typed/selected anything yet
        setFormCategory((prev) => {
          if (!prev || prev === "General") {
            return json.data[0]?.name || "General";
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Error fetching campaign categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Accessibility: Handle Escape key to close top-most active modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isCategoryModalOpen) {
          setIsCategoryModalOpen(false);
        } else if (isGlobalPushSettingsOpen) {
          setIsGlobalPushSettingsOpen(false);
        } else if (isEditCampaignOpen) {
          setIsEditCampaignOpen(false);
        } else if (isCreateOpen) {
          setIsCreateOpen(false);
        } else if (previewItem) {
          setPreviewItem(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCategoryModalOpen, isGlobalPushSettingsOpen, isEditCampaignOpen, isCreateOpen, previewItem]);

  // 2. Fetch Campaigns
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
        let fetchedList: CampaignItem[] = json.data || [];
        if (categoryFilter !== "ALL") {
          fetchedList = fetchedList.filter((c) => c.category === categoryFilter);
        }
        setCampaigns(fetchedList);
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
  }, [page, pageSize, search, statusFilter, cityFilter, categoryFilter]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Category Management Handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      setIsSavingCategory(true);
      setCategoryActionFeedback(null);
      const res = await fetch("http://localhost:4000/api/v1/admin/campaign-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          description: newCatDesc.trim(),
          color: newCatColor,
        }),
      });
      const json = await res.json();
      if (json.success) {
        const createdName = newCatName.trim();
        setFormCategory(createdName);
        setNewCatName("");
        setNewCatDesc("");
        await Promise.all([fetchCategories(), fetchCampaigns()]);
        setIsCategoryModalOpen(false);
      } else {
        alert(json.message || "Failed to create category");
      }
    } catch (err: any) {
      alert(err.message || "Network error creating category");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleStartEditCategory = (cat: CampaignCategory) => {
    setEditingCategoryId(cat.id);
    setEditCatName(cat.name);
    setEditCatDesc(cat.description || "");
    setEditCatColor(cat.color || "#0076D7");
  };

  const handleSaveEditCategory = async (id: string) => {
    if (!editCatName.trim()) return;

    try {
      setIsSavingCategory(true);
      setCategoryActionFeedback(null);
      const res = await fetch(`http://localhost:4000/api/v1/admin/campaign-categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editCatName.trim(),
          description: editCatDesc.trim(),
          color: editCatColor,
        }),
      });
      const json = await res.json();
      if (json.success) {
        const count = json.data?.affectedCampaignsCount ?? 0;
        setEditingCategoryId(null);
        await Promise.all([fetchCategories(), fetchCampaigns()]);
        setIsCategoryModalOpen(false);
      } else {
        alert(json.message || "Failed to update category");
      }
    } catch (err: any) {
      alert(err.message || "Network error updating category");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (cat: CampaignCategory) => {
    const attachedCount = (cat as any).campaigns_count || 0;
    const confirmMsg = attachedCount > 0
      ? `Delete category "${cat.name}"?\n\nWarning: There are ${attachedCount} active/scheduled campaign(s) linked to this category. They will be safely reassigned to "General" to prevent broken notifications or data loss.\n\nProceed with deletion?`
      : `Delete category "${cat.name}"? No campaigns are currently using this category.`;
      
    if (!window.confirm(confirmMsg)) return;

    try {
      setIsSavingCategory(true);
      const res = await fetch(`http://localhost:4000/api/v1/admin/campaign-categories/${cat.id}?fallback=General`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        const reassignedCount = json.reassignedCampaignsCount ?? 0;
        if (reassignedCount > 0) {
          alert(`Category "${cat.name}" deleted. ${reassignedCount} campaign(s) safely reassigned to "General".`);
        }
        await Promise.all([fetchCategories(), fetchCampaigns()]);
        setIsCategoryModalOpen(false);
      } else {
        alert(json.message || "Failed to delete category");
      }
    } catch (err: any) {
      alert(err.message || "Network error deleting category");
    } finally {
      setIsSavingCategory(false);
    }
  };

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
        fetchCategories();
      } else {
        alert(json.message || "Could not save campaign");
      }
    } catch (err: any) {
      alert(err?.message || "Error creating campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEditCampaign = (cmp: CampaignItem) => {
    setEditingCampaignItem(cmp);
    setFormName(cmp.name);
    setFormAdTitle(cmp.ad_title || cmp.name);
    setFormTitle(cmp.notification_title);
    setFormBody(cmp.notification_body);
    setFormCategory(cmp.category || (categories[0]?.name ?? "General"));
    setFormPriority(cmp.priority || "NORMAL");
    setFormAudience(cmp.target_audience || "ALL");
    setFormCity(cmp.target_city || "Vijayawada");
    setFormScheduledAt(cmp.scheduled_at ? cmp.scheduled_at.slice(0, 16) : "");
    setFormStatus(cmp.status || "DRAFT");
    setIsEditCampaignOpen(true);
  };

  const handleUpdateCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaignItem) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`http://localhost:4000/api/v1/admin/campaigns/${editingCampaignItem.id}`, {
        method: "PUT",
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
        setIsEditCampaignOpen(false);
        setEditingCampaignItem(null);
        fetchCampaigns();
        fetchCategories();
      } else {
        alert(json.message || "Could not update campaign");
      }
    } catch (err: any) {
      alert(err?.message || "Error updating campaign");
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
        fetchCategories();
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
      fetchCategories();
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

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Manage Categories Button */}
          <button
            onClick={() => setIsGlobalPushSettingsOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
            title="Configure Global Push Notification branding, logo, sound, quiet hours, and kill switch"
          >
            <Sliders className="w-4 h-4 text-[#0076D7]" />
            <span>Global Push Settings</span>
          </button>
          <button
            onClick={() => {
              setCategoryActionFeedback(null);
              setIsCategoryModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
            title="Manage dynamic categories & auto-reflect on existing campaigns"
          >
            <Tag className="w-4 h-4 text-[#0076D7]" />
            <span>Manage Categories ({categories.length})</span>
          </button>

          {/* New Campaign Button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0076D7] hover:bg-[#0062b3] text-white font-bold text-sm shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Categories Badge Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 whitespace-nowrap mr-1">Categories:</span>
        <button
          onClick={() => {
            setCategoryFilter("ALL");
            setPage(1);
          }}
          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
            categoryFilter === "ALL"
              ? "bg-[#0076D7] text-white border-[#0076D7]"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
        >
          All ({totalRecords})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setCategoryFilter(cat.name);
              setPage(1);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
              categoryFilter === cat.name
                ? "bg-[#0B1220] text-white border-[#0B1220]"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: cat.color || "#0076D7" }}
            />
            <span>{cat.name}</span>
            {cat.campaigns_count !== undefined && (
              <span className="text-[10px] opacity-70 ml-0.5">({cat.campaigns_count})</span>
            )}
          </button>
        ))}
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
            placeholder="Search campaigns, titles, categories..."
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
          onClick={() => {
            fetchCampaigns();
            fetchCategories();
          }}
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
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-700"
            >
              Retry
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns found"
            description="Create a promotional campaign or adjust search and filter criteria."
            actionLabel="New Campaign"
            onAction={() => setIsCreateOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0076D7] border-slate-300 focus:ring-[#0076D7] cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3.5">Campaign & Category</th>
                  <th className="px-4 py-3.5">Notification Title & Copy</th>
                  <th className="px-4 py-3.5">Target City</th>
                  <th className="px-4 py-3.5">Recipients</th>
                  <th className="px-4 py-3.5">Schedule</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((cmp) => {
                  const isSelected = selectedIds.includes(cmp.id);
                  const statusColors: Record<string, string> = {
                    DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
                    SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
                    QUEUED: "bg-amber-50 text-amber-700 border-amber-200",
                    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
                  };

                  // Find category meta if present
                  const matchedCategory = categories.find((cat) => cat.name === cmp.category);

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
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                            style={{
                              borderColor: matchedCategory ? `${matchedCategory.color}30` : "#E2E8F0",
                              backgroundColor: matchedCategory ? `${matchedCategory.color}10` : "#F8FAFC",
                              color: matchedCategory?.color || "#475569",
                            }}
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {cmp.category}
                          </span>
                          <span className="text-[10px] text-slate-400">• {cmp.id}</span>
                        </div>
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
                            onClick={() => handleStartEditCampaign(cmp)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
                            title="Edit Campaign"
                          >
                            <Edit2 className="w-4 h-4" />
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

      {/* DYNAMIC CATEGORY MANAGEMENT MODAL */}
      {isCategoryModalOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCategoryModalOpen(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0076D7]">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="category-modal-title" className="font-extrabold text-slate-900 text-lg">Manage Campaign Categories</h3>
                  <p className="text-xs text-slate-500">
                    Create, edit, or delete categories. Updates auto-reflect across all existing campaigns.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Notification Feedback Toast */}
            {categoryActionFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{categoryActionFeedback}</span>
              </div>
            )}

            {/* Create New Category Form */}
            <form onSubmit={handleCreateCategory} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4 text-[#0076D7]" />
                <span>Add New Campaign Category</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Category Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Festive Offers"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Brief description..."
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>

                <div className="md:col-span-1 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Badge Color</label>
                    <div className="flex items-center gap-2 bg-white border border-slate-300 px-2 py-1 rounded-xl">
                      <input
                        type="color"
                        value={newCatColor}
                        onChange={(e) => setNewCatColor(e.target.value)}
                        className="w-6 h-6 border-0 rounded cursor-pointer p-0 bg-transparent"
                      />
                      <span className="text-xs font-mono text-slate-700 uppercase">{newCatColor}</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSavingCategory || !newCatName.trim()}
                    className="px-4 py-2 bg-[#0076D7] hover:bg-[#0062b3] text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 cursor-pointer h-[34px] flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </form>

            {/* List Existing Categories with Inline Edit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span>Existing Categories ({categories.length})</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Editing a category auto-renames all attached campaigns
                </span>
              </div>

              {categoriesLoading ? (
                <div className="py-6 text-center text-xs text-slate-400">Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  No categories found. Add your first category above.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {categories.map((cat) => {
                    const isEditing = editingCategoryId === cat.id;

                    return (
                      <div
                        key={cat.id}
                        className={`p-3 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition ${
                          isEditing ? "bg-blue-50/50" : "bg-white hover:bg-slate-50/60"
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={editCatName}
                              onChange={(e) => setEditCatName(e.target.value)}
                              className="px-2.5 py-1.5 bg-white border border-[#0076D7] rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                              placeholder="Category name"
                            />
                            <input
                              type="text"
                              value={editCatDesc}
                              onChange={(e) => setEditCatDesc(e.target.value)}
                              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none"
                              placeholder="Description"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={editCatColor}
                                onChange={(e) => setEditCatColor(e.target.value)}
                                className="w-7 h-7 border-0 rounded cursor-pointer p-0 bg-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEditCategory(cat.id)}
                                disabled={isSavingCategory}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Save & Cascade</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCategoryId(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <span
                                className="w-3.5 h-3.5 rounded-full shrink-0"
                                style={{ backgroundColor: cat.color || "#0076D7" }}
                              />
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                  <span>{cat.name}</span>
                                  <span className="text-[10px] font-mono text-slate-400">({cat.slug})</span>
                                  <span className="px-2 py-0.2 bg-slate-100 text-slate-600 font-semibold rounded-full text-[10px]">
                                    {cat.campaigns_count || 0} active campaigns
                                  </span>
                                </div>
                                {cat.description && (
                                  <div className="text-[11px] text-slate-500 mt-0.5">{cat.description}</div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-auto">
                              <button
                                onClick={() => handleStartEditCategory(cat)}
                                className="px-2.5 py-1 text-slate-600 hover:text-[#0076D7] hover:bg-blue-50 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition"
                                title="Edit category name (auto-reflects on all campaigns)"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleDeleteCategory(cat)}
                                className="px-2.5 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition"
                                title="Delete category (safely reassigns campaigns to General)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
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
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg cursor-pointer"
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="text-[11px] text-[#0076D7] hover:underline font-bold"
                    >
                      + Add New
                    </button>
                  </div>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    {categories.length === 0 && <option value="General">General</option>}
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
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Creating..." : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CAMPAIGN MODAL */}
      {isEditCampaignOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Edit Campaign Push Notification</h3>
                <p className="text-xs text-slate-500">Update campaign details, schedule, or category assignment</p>
              </div>
              <button
                onClick={() => setIsEditCampaignOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCampaignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Campaign Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="text-[11px] text-[#0076D7] hover:underline font-bold"
                    >
                      + Manage
                    </button>
                  </div>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    {categories.length === 0 && <option value="General">General</option>}
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
                    onChange={(e) => setFormScheduledAt(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditCampaignOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0076D7] hover:bg-[#0062b3] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UNIFIED REALISTIC PREVIEW MODAL */}
      <GlobalPushSettingsModal isOpen={isGlobalPushSettingsOpen} onClose={() => setIsGlobalPushSettingsOpen(false)} />
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
