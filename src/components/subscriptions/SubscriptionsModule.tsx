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
} from "lucide-react";
import { SearchInput } from "@/components/shared/SearchInput";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { TableSkeleton, CardSkeleton } from "@/components/shared/Skeletons";
import { EmptyState, ErrorState, StatusBadge } from "@/components/shared/StateComponents";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_interval: string;
  features: string[];
  status: string;
}

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
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [summary, setSummary] = useState<SubscriptionSummary>({
    totalSubscribers: 0,
    activeCount: 0,
    expiredCount: 0,
    monthlyRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Server-side controls
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

  // Detail Modal
  const [selectedSub, setSelectedSub] = useState<SubscriptionItem | null>(null);

  // Plan Edit / Create / Delete state
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [deleteConfirmPlan, setDeleteConfirmPlan] = useState<SubscriptionPlan | null>(null);
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  // Plan form fields
  const [planForm, setPlanForm] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    currency: "INR",
    billing_interval: "MONTHLY",
    featuresText: "",
    status: "ACTIVE",
  });

  const handleOpenCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm({
      id: "plan_" + Date.now(),
      name: "",
      description: "",
      price: 999,
      currency: "INR",
      billing_interval: "MONTHLY",
      featuresText: "Verified Merchant Trust Badge\n25 Instant Leads / mo\nDirect WhatsApp Enquiry Button",
      status: "ACTIVE",
    });
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    const featuresList = Array.isArray(plan.features) ? plan.features.join("\n") : "";
    setPlanForm({
      id: plan.id,
      name: plan.name,
      description: plan.description || "",
      price: plan.price,
      currency: plan.currency || "INR",
      billing_interval: plan.billing_interval || "MONTHLY",
      featuresText: featuresList,
      status: plan.status || "ACTIVE",
    });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      alert("Plan name is required");
      return;
    }

    const featuresArray = planForm.featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      name: planForm.name.trim(),
      description: planForm.description.trim(),
      price: Number(planForm.price) || 0,
      currency: planForm.currency,
      billing_interval: planForm.billing_interval,
      features: featuresArray,
      status: planForm.status,
    };

    try {
      setIsSavingPlan(true);
      const url = editingPlan
        ? `http://localhost:4000/api/v1/admin/subscriptions/plans/${editingPlan.id}`
        : "http://localhost:4000/api/v1/admin/subscriptions/plans";
      const method = editingPlan ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setFeedbackToast(json.message || "Plan saved successfully!");
        setIsPlanModalOpen(false);
        await fetchPlans();
        setTimeout(() => setFeedbackToast(null), 5000);
      } else {
        alert(json.message || "Failed to save plan");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!deleteConfirmPlan) return;
    try {
      setIsSavingPlan(true);
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
      setIsSavingPlan(false);
    }
  };

  // Multi-select and Delete state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmSub, setDeleteConfirmSub] = useState<SubscriptionItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

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

  const handleDeleteSingle = async () => {
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

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected subscription record(s)? This action cannot be undone.`)) {
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
        setFeedbackToast(json.message || `${selectedIds.length} subscription records deleted!`);
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
      // Ignore background plans failure
    }
  }, []);

  // 2. Fetch Subscribers
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
  }, [fetchPlans]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Handlers
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlanFilter(e.target.value);
    setPage(1);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "DESC" ? "ASC" : "DESC");
    } else {
      setSortBy(field);
      setSortOrder("DESC");
    }
    setPage(1);
  };

  return (
    <div
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B1220] tracking-tight">
            Subscriptions &amp; Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage merchant subscription tiers, active billing contracts, and renewal states.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            fetchPlans();
            fetchSubscriptions();
          }}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 shadow-2xs transition"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 2. KPI Summary Cards */}
      {loading && subscriptions.length === 0 ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Subscriptions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Subscribers
              </span>
              <div className="text-2xl font-black text-emerald-700 mt-1.5">
                {summary.activeCount}
              </div>
              <span className="text-[11px] font-medium text-slate-400 mt-1 block">
                Out of {summary.totalSubscribers} total
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          {/* Monthly Run-rate */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Monthly Recurring (MRR)
              </span>
              <div className="text-2xl font-black text-[#0B1220] mt-1.5">
                ₹{summary.monthlyRevenue.toLocaleString("en-IN")}
              </div>
              <span className="text-[11px] font-medium text-emerald-600 mt-1 block">
                Live contracted billing
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0076D7] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Expired / Overdue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Expired / Overdue
              </span>
              <div className="text-2xl font-black text-rose-700 mt-1.5">
                {summary.expiredCount}
              </div>
              <span className="text-[11px] font-medium text-slate-400 mt-1 block">
                Pending renewal notice
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          {/* Total Plans */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Active Plan Tiers
              </span>
              <div className="text-2xl font-black text-[#0B1220] mt-1.5">
                {plans.length}
              </div>
              <span className="text-[11px] font-medium text-slate-400 mt-1 block">
                Configured tiers
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Subscription Plan Tiers Cards */}
      {plans.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              Merchant Tier Catalog
            </h2>
            <span className="text-xs text-slate-400">Fixed rate cards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                      <StatusBadge status={p.status} />
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-400">/{p.billing_interval.toLowerCase()}</span>
                    </div>

                    {/* Features list */}
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
                        setPage(1);
                      }}
                      className="text-[#0076D7] font-semibold hover:underline"
                    >
                      Filter Subscribers &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Search and Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search subscriber name, email, phone, or plan..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={planFilter}
              onChange={handlePlanChange}
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

      {/* 5. Subscribers Table Section */}
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
                  <th className="py-3.5 px-4">Subscriber</th>
                  <th className="py-3.5 px-4">Plan</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer select-none hover:text-[#0076D7]"
                    onClick={() => toggleSort("amount")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Amount</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Status</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer select-none hover:text-[#0076D7]"
                    onClick={() => toggleSort("expiry_date")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Expiry Date</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Auto Renew</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {subscriptions.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedSub(s)}
                    className="hover:bg-slate-50/70 transition cursor-pointer group"
                  >
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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

      {/* 6. Subscriber Detail Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-[#0B1220]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
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

            {/* Modal Body */}
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
                  <p className="font-semibold text-slate-800 text-[13px] mt-0.5">{selectedSub.subscriber_name}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Contact Phone</span>
                  <p className="font-semibold text-slate-800 text-[13px] mt-0.5">{selectedSub.subscriber_phone}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Email</span>
                  <p className="font-semibold text-slate-800 text-[13px] mt-0.5">{selectedSub.subscriber_email}</p>
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

            {/* Modal Footer */}
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
