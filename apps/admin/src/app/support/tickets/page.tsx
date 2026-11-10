"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminNavbar } from "@/components/navigation/AdminNavbar";
import { AdminSidebar } from "@/components/navigation/AdminSidebar";
import {
  Headphones,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw
} from "lucide-react";

export default function AllTicketsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") || "ALL";

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const [tickets, setTickets] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [audienceFilter, setAudienceFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTickets = async (pageToLoad: number = page) => {
    setLoading(true);
    try {
      const url = new URL("http://localhost:4000/api/v1/support-tickets/admin/tickets");
      url.searchParams.set("page", pageToLoad.toString());
      url.searchParams.set("limit", limit.toString());

      if (statusFilter !== "ALL") url.searchParams.set("status", statusFilter);
      if (priorityFilter !== "ALL") url.searchParams.set("priority", priorityFilter);
      if (audienceFilter !== "ALL") url.searchParams.set("audience", audienceFilter);
      if (searchQuery.trim()) url.searchParams.set("search", searchQuery.trim());

      const res = await fetch(url.toString());
      const data = await res.json();

      setTickets(data?.data || []);
      setTotal(data?.total || 0);
      setTotalPages(data?.totalPages || 1);
      setPage(data?.page || 1);
    } catch (err) {
      console.error("Error loading tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(1);
  }, [statusFilter, priorityFilter, audienceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTickets(1);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <AdminSidebar
        activeTab="Support Management"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar
          onToggleSidebar={handleToggleSidebar}
          searchQuery=""
          onSearchChange={() => {}}
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                All Support Tickets
              </h1>
              <p className="text-xs text-slate-500">
                Server-side filtered and paginated case queue ({total} total tickets registered in database).
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ticket #, customer name, email, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="OPEN">OPEN</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="WAITING_FOR_CUSTOMER">WAITING_FOR_CUSTOMER</option>
                  <option value="ESCALATED">ESCALATED</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="REOPENED">REOPENED</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="URGENT">URGENT</option>
                  <option value="HIGH">HIGH</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="LOW">LOW</option>
                </select>

                {/* Audience Filter */}
                <select
                  value={audienceFilter}
                  onChange={(e) => setAudienceFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Audiences</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="BUSINESS_PARTNER">Business Partner</option>
                  <option value="GUEST">Guest</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Tickets Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading tickets from database...</div>
            ) : tickets.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">No support tickets matched your filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">Ticket ID</th>
                      <th className="px-4 py-3">Requester</th>
                      <th className="px-4 py-3">Audience</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Subject &amp; Category</th>
                      <th className="px-4 py-3">Assigned To</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-4 py-3 font-mono font-bold text-blue-600">{t.ticket_number}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{t.userName || "Guest"}</p>
                          <p className="text-[10px] text-slate-400">{t.userPhone || t.userEmail || ""}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.audience === "BUSINESS_PARTNER" ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-700"
                          }`}>
                            {t.audience === "BUSINESS_PARTNER" ? "Partner" : "Customer"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{t.department || "General"}</td>
                        <td className="px-4 py-3 max-w-[240px]">
                          <p className="font-medium text-slate-900 truncate">{t.subject}</p>
                          <p className="text-[10px] text-slate-400">{t.category}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-slate-600 font-medium">
                            {t.assigned_agent_name || <span className="text-amber-500 italic">Unassigned</span>}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.priority === "URGENT"
                              ? "bg-rose-100 text-rose-700"
                              : t.priority === "HIGH"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.status === "RESOLVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : t.status === "WAITING_FOR_CUSTOMER"
                              ? "bg-amber-100 text-amber-800"
                              : t.status === "ESCALATED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(t.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/support/tickets/${t.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-[11px] font-bold transition"
                          >
                            <span>Open</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Strip */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing page {page} of {totalPages} ({total} tickets)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => fetchTickets(page - 1)}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => fetchTickets(page + 1)}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
