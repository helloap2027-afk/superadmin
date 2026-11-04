"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ShieldCheck,
  CheckCircle,
  Users,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Eye,
  Edit2,
  Plus,
  AlertTriangle,
  Trash2,
  CheckSquare,
  X,
  RefreshCw,
  ArrowUpDown,
  Check,
  Layers,
  Sparkles,
  SlidersHorizontal,
  History,
  LayoutGrid,
  List,
} from "lucide-react";
import { SearchInput } from "@/components/shared/SearchInput";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { TableSkeleton, CardSkeleton } from "@/components/shared/Skeletons";
import { EmptyState, ErrorState, StatusBadge } from "@/components/shared/StateComponents";
import { PlanWizardModal } from "./PlanWizardModal";
import { BenefitsLibraryModal } from "./BenefitsLibraryModal";
import { PlanComparisonView } from "./PlanComparisonView";
import { PlanVersionHistoryModal } from "./PlanVersionHistoryModal";
import { PlanCustomerPreviewModal } from "./PlanCustomerPreviewModal";
import {
  SubscriptionPlan,
  BenefitDefinition,
  BackendCapability,
} from "./types";

interface SubscriptionItem {
  id: string;
  subscriber_name: string;
  subscriber_email: string;
  subscriber_phone: string;
  plan_id: string;
  plan_name: string;
  status: string;
  amount: number;
  currency: string;
  start_date: string;
  expiry_date: string;
  auto_renew: number;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

interface SubscriptionSummary {
  totalSubscribers: number;
  activeCount: number;
  expiredCount: number;
  monthlyRevenue: number;
}

export function SubscriptionsModule() {
  // Navigation / Tabs within Subscriptions
  const [activeTab, setActiveTab] = useState<"plans" | "benefits" | "compare" | "subscribers">("plans");
  const [plansViewMode, setPlansViewMode] = useState<"cards" | "table">("cards");

  // Core Data
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [benefits, setBenefits] = useState<BenefitDefinition[]>([]);
  const [capabilities, setCapabilities] = useState<BackendCapability[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [summary, setSummary] = useState<SubscriptionSummary>({
    totalSubscribers: 0,
    activeCount: 0,
    expiredCount: 0,
    monthlyRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server-side controls for subscribers
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC");

  // Modals & Drawers
  const [selectedSub, setSelectedSub] = useState<SubscriptionItem | null>(null);
  const [wizardPlan, setWizardPlan] = useState<SubscriptionPlan | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [historyPlan, setHistoryPlan] = useState<SubscriptionPlan | null>(null);
  const [previewPlan, setPreviewPlan] = useState<SubscriptionPlan | null>(null);

  // Multi-select & Safe delete for subscribers
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmSub, setDeleteConfirmSub] = useState<SubscriptionItem | null>(null);
  const [deleteConfirmPlan, setDeleteConfirmPlan] = useState<SubscriptionPlan | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const activeRequestId = useRef(0);

  // 1. Fetch Subscription Plans
  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/admin/subscriptions/plans");
      const json = await res.json();
      if (json.success) {
        setPlans(json.data || []);
      }
    } catch {
      // Keep UI functional
    }
  }, []);

  // 2. Fetch Benefits Library
  const fetchBenefits = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/admin/subscriptions/benefits");
      const json = await res.json();
      if (json.success) {
        setBenefits(json.data || []);
      }
    } catch {
      // Keep UI functional
    }
  }, []);

  // 3. Fetch Capabilities
  const fetchCapabilities = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/admin/subscriptions/capabilities");
      const json = await res.json();
      if (json.success) {
        setCapabilities(json.data || []);
      }
    } catch {
      // Keep UI functional
    }
  }, []);

  // 4. Fetch Subscribers Table
  const fetchSubscriptions = useCallback(async () => {
    const reqId = ++activeRequestId.current;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search: search.trim(),
        status: statusFilter,
        planId: planFilter,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`http://localhost:4000/api/v1/admin/subscriptions?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      if (reqId === activeRequestId.current) {
        if (json.success) {
          setSubscriptions(json.data || []);
          if (json.pagination) {
            setTotalPages(json.pagination.totalPages || 1);
            setTotalRecords(json.pagination.totalRecords || 0);
            setHasNextPage(Boolean(json.pagination.hasNextPage));
            setHasPreviousPage(Boolean(json.pagination.hasPreviousPage));
          }
          if (json.summary) {
            setSummary(json.summary);
          }
        } else {
          throw new Error(json.message || "Failed to retrieve subscriptions");
        }
      }
    } catch (err: any) {
      if (reqId === activeRequestId.current) {
        setError(err.message || "Failed to communicate with subscription service");
      }
    } finally {
      if (reqId === activeRequestId.current) {
        setLoading(false);
      }
    }
  }, [page, pageSize, search, statusFilter, planFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchPlans();
    fetchBenefits();
    fetchCapabilities();
  }, [fetchPlans, fetchBenefits, fetchCapabilities]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Handlers
  const handleOpenCreatePlan = () => {
    setWizardPlan(null);
    setIsWizardOpen(true);
  };

  const handleOpenEditPlan = (plan: SubscriptionPlan) => {
    setWizardPlan(plan);
    setIsWizardOpen(true);
  };

  const handleDeletePlan = async () => {
    if (!deleteConfirmPlan) return;
    try {
      setIsDeleting(true);
      const res = await fetch(
        `http://localhost:4000/api/v1/admin/subscriptions/plans/${deleteConfirmPlan.id}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (json.success) {
        setFeedbackToast(json.message || "Plan deleted successfully!");
        setDeleteConfirmPlan(null);
        await fetchPlans();
        setTimeout(() => setFeedbackToast(null), 5000);
      } else {
        alert(json.message || "Delete plan failed");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === subscriptions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(subscriptions.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSingleSub = async () => {
    if (!deleteConfirmSub) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`http://localhost:4000/api/v1/admin/subscriptions/${deleteConfirmSub.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setFeedbackToast(json.message || "Subscription record deleted successfully!");
        setDeleteConfirmSub(null);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteConfirmSub.id));
        await fetchSubscriptions();
        setTimeout(() => setFeedbackToast(null), 5000);
      } else {
        alert(json.message || "Delete failed");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDeleteSubs = async () => {
    if (selectedIds.length === 0) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.length} selected subscriber record(s)? Historical invoices and audits will be safely detached.`
      )
    ) {
      return;
    }
    try {
      setIsDeleting(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/subscriptions/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedbackToast(json.message || `${selectedIds.length} subscriber records deleted!`);
        setSelectedIds([]);
        await fetchSubscriptions();
        setTimeout(() => setFeedbackToast(null), 5000);
      } else {
        alert(json.message || "Bulk delete failed");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1220] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B1220] tracking-tight">
            Subscription Plans &amp; Benefits
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage subscription pricing, benefits library, eligibility, and publishing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              fetchPlans();
              fetchBenefits();
              fetchCapabilities();
              fetchSubscriptions();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 shadow-2xs transition"
            title="Refresh All"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreatePlan}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0076D7] hover:bg-blue-700 rounded-xl transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* 2. Top-level Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("plans")}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === "plans"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Plans Catalog ({plans.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("benefits")}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === "benefits"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Benefits Library ({benefits.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("compare")}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === "compare"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Compare Plans</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("subscribers")}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === "subscribers"
              ? "border-[#0076D7] text-[#0076D7]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Subscribers ({summary.totalSubscribers})</span>
        </button>
      </div>

      {/* 3. Real KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Plans
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1.5">{plans.length}</div>
            <span className="text-[11px] font-medium text-slate-400 mt-1 block">
              {plans.filter((p) => p.status === "ACTIVE").length} Active ·{" "}
              {plans.filter((p) => p.status !== "ACTIVE").length} Draft/Archived
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0076D7] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Subscribers
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1.5">{summary.activeCount}</div>
            <span className="text-[11px] font-medium text-slate-400 mt-1 block">
              {summary.totalSubscribers} total registered
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Recurring Revenue (MRR)
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1.5">
              ₹{summary.monthlyRevenue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] font-medium text-emerald-600 mt-1 block">
              Real contracted billing
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Reusable Benefits
            </span>
            <div className="text-2xl font-black text-purple-700 mt-1.5">{benefits.length}</div>
            <span className="text-[11px] font-medium text-slate-400 mt-1 block">
              {benefits.filter((b) => b.enforcement_status === "ENFORCED").length} Enforced ·{" "}
              {benefits.filter((b) => b.enforcement_status === "UNVERIFIED").length} Unverified
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. TAB 1: Plans Catalog View */}
      {activeTab === "plans" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Configured Merchant Tiers
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic benefits, pricing tiers, and active subscription bindings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setPlansViewMode("cards")}
                  className={`p-1.5 rounded-lg transition ${
                    plansViewMode === "cards"
                      ? "bg-white text-[#0076D7] shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Card View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPlansViewMode("table")}
                  className={`p-1.5 rounded-lg transition ${
                    plansViewMode === "table"
                      ? "bg-white text-[#0076D7] shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Card View */}
          {plansViewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((p) => {
                const isPopular = p.id === "plan_growth";
                return (
                  <div
                    key={p.id}
                    className={`bg-white rounded-2xl p-5 border relative shadow-2xs flex flex-col justify-between ${
                      isPopular ? "border-[#0076D7] ring-1 ring-[#0076D7]/20" : "border-slate-200"
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-2.5 right-4 bg-[#0076D7] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        Popular
                      </span>
                    )}

                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                          <div className="mt-1">
                            <StatusBadge status={p.status} />
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setPreviewPlan(p)}
                            className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Live Customer Preview (Web & Mobile)"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditPlan(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200"
                            title="Edit Plan in Wizard"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setHistoryPlan(p)}
                            className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            title="Version History"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmPlan(p)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Safe Delete Plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{p.description}</p>

                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-slate-400">/{p.billing_interval.toLowerCase()}</span>
                      </div>

                      {/* Features */}
                      {Array.isArray(p.features) && (
                        <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                          {p.features.map((f, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">{p.id}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPlanFilter(p.id);
                          setActiveTab("subscribers");
                          setPage(1);
                        }}
                        className="text-[#0076D7] font-semibold hover:underline"
                      >
                        Subscribers &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Plan Name &amp; Code</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Billing Cycle</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Features Count</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {plans.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">{p.id}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                          ₹{p.price.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4 font-medium">{p.billing_interval}</td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-600">
                          {p.features?.length || 0} benefits
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setPreviewPlan(p)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                              title="Customer Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditPlan(p)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setHistoryPlan(p)}
                              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                              title="Version History"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmPlan(p)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Plan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 2: Benefits Library View */}
      {activeTab === "benefits" && (
        <BenefitsLibraryModal
          benefits={benefits}
          capabilities={capabilities}
          onRefresh={fetchBenefits}
          onSuccess={(msg) => {
            setFeedbackToast(msg);
            setTimeout(() => setFeedbackToast(null), 5000);
          }}
        />
      )}

      {/* 6. TAB 3: Plan Comparison Matrix */}
      {activeTab === "compare" && (
        <PlanComparisonView plans={plans} benefitsLibrary={benefits} />
      )}

      {/* 7. TAB 4: Active Subscribers Table */}
      {activeTab === "subscribers" && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex-1 max-w-md">
              <SearchInput
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
                placeholder="Search subscriber name, email, phone, or plan..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={planFilter}
                  onChange={(e) => {
                    setPlanFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Plans</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedIds.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900">
                  {selectedIds.length} of {subscriptions.length} record(s) selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white rounded-xl transition"
                >
                  Deselect All
                </button>
                <button
                  type="button"
                  onClick={handleBulkDeleteSubs}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting ? "Deleting..." : `Delete Selected (${selectedIds.length})`}</span>
                </button>
              </div>
            </div>
          )}

          {/* Subscribers Table */}
          {error ? (
            <ErrorState
              title="Unable to load subscriber records"
              message={error}
              onRetry={() => fetchSubscriptions()}
            />
          ) : loading && subscriptions.length === 0 ? (
            <TableSkeleton rows={6} columns={7} />
          ) : subscriptions.length === 0 ? (
            <EmptyState
              isSearch={Boolean(search || statusFilter !== "ALL" || planFilter !== "ALL")}
              onClearSearch={() => {
                setSearch("");
                setStatusFilter("ALL");
                setPlanFilter("ALL");
                setPage(1);
              }}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 pl-4 pr-2 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            subscriptions.length > 0 && selectedIds.length === subscriptions.length
                          }
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-slate-300 text-[#0076D7] focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-3.5 px-4">Subscriber</th>
                      <th className="py-3.5 px-4">Plan</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Expiry Date</th>
                      <th className="py-3.5 px-4">Auto Renew</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                    {subscriptions.map((s) => {
                      const isChecked = selectedIds.includes(s.id);
                      return (
                        <tr
                          key={s.id}
                          onClick={() => setSelectedSub(s)}
                          className={`hover:bg-slate-50/70 transition cursor-pointer group ${
                            isChecked ? "bg-blue-50/40" : ""
                          }`}
                        >
                          <td
                            className="py-3.5 pl-4 pr-2 w-10 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => toggleSelectOne(s.id, e as any)}
                              className="w-4 h-4 rounded border-slate-300 text-[#0076D7] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{s.subscriber_name}</div>
                            <div className="text-[11px] text-slate-400">{s.subscriber_email}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800">{s.plan_name}</span>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                            ₹{s.amount.toLocaleString("en-IN")}
                          </td>

                          <td className="py-3.5 px-4">
                            <StatusBadge status={s.status} />
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            {new Date(s.expiry_date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                                s.auto_renew
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {s.auto_renew ? "Yes" : "No"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSub(s);
                                }}
                                className="p-1.5 text-slate-400 hover:text-[#0076D7] hover:bg-blue-50 rounded-lg transition"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirmSub(s);
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete Subscriber"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <PaginationControls
                page={page}
                pageSize={pageSize}
                totalRecords={totalRecords}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                onPageChange={(p) => setPage(p)}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setPage(1);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Plan Wizard Modal */}
      {isWizardOpen && (
        <PlanWizardModal
          initialPlan={wizardPlan}
          benefitsLibrary={benefits}
          onClose={() => setIsWizardOpen(false)}
          onSuccess={(msg) => {
            setFeedbackToast(msg);
            fetchPlans();
            setTimeout(() => setFeedbackToast(null), 5000);
          }}
        />
      )}

      {/* Version History Modal */}
      {historyPlan && (
        <PlanVersionHistoryModal
          planId={historyPlan.id}
          planName={historyPlan.name}
          onClose={() => setHistoryPlan(null)}
        />
      )}

      {/* Customer Preview Modal (Web & Mobile) */}
      {previewPlan && (
        <PlanCustomerPreviewModal
          plan={previewPlan}
          benefitsLibrary={benefits}
          onClose={() => setPreviewPlan(null)}
        />
      )}

      {/* Delete Confirmation for Plan */}
      {deleteConfirmPlan && (
        <div className="fixed inset-0 z-50 bg-[#0B1220]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Subscription Plan?</h3>
              <p className="text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete <strong>{deleteConfirmPlan.name}</strong> (
                {deleteConfirmPlan.id})?
              </p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
              <strong>Active Subscriber Guard:</strong> The backend will reject deletion if this plan has active merchants attached.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmPlan(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePlan}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 font-bold text-white rounded-xl transition shadow-xs"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation for Subscriber */}
      {deleteConfirmSub && (
        <div className="fixed inset-0 z-50 bg-[#0B1220]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Subscriber Record?</h3>
              <p className="text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to remove <strong>{deleteConfirmSub.subscriber_name}</strong> (
                {deleteConfirmSub.id})?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmSub(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSingleSub}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 font-bold text-white rounded-xl transition shadow-xs"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscriber Detail Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-[#0B1220]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Subscription Overview</h3>
                  <p className="text-[11px] font-mono text-slate-400">{selectedSub.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {selectedSub.plan_name}
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    ₹{selectedSub.amount.toLocaleString("en-IN")}
                  </div>
                </div>
                <StatusBadge status={selectedSub.status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-medium">Subscriber Name</span>
                  <p className="font-semibold text-slate-800 text-[13px] mt-0.5">
                    {selectedSub.subscriber_name}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Contact Phone</span>
                  <p className="font-semibold text-slate-800 text-[13px] mt-0.5">
                    {selectedSub.subscriber_phone}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Email</span>
                  <p className="font-semibold text-slate-800 text-[13px] mt-0.5">
                    {selectedSub.subscriber_email}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Payment Status</span>
                  <div className="mt-0.5">
                    <StatusBadge status={selectedSub.payment_status} />
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Start Date</span>
                  <p className="text-slate-700 text-[11px] mt-0.5">
                    {new Date(selectedSub.start_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Expiry / Renewal</span>
                  <p className="text-slate-700 text-[11px] mt-0.5">
                    {new Date(selectedSub.expiry_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
