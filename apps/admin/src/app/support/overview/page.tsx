"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/navigation/AdminNavbar";
import { AdminSidebar } from "@/components/navigation/AdminSidebar";
import {
  Headphones,
  Inbox,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Filter,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export default function SupportOverviewPage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const [overview, setOverview] = useState<any>({
    totalTickets: 0,
    openTickets: 0,
    assignedTickets: 0,
    inProgressTickets: 0,
    waitingForUser: 0,
    escalatedTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    unassignedTickets: 0,
    overdueSla: 0,
  });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ovRes, tktRes] = await Promise.all([
          fetch("http://localhost:4000/api/v1/support-tickets/admin/overview"),
          fetch("http://localhost:4000/api/v1/support-tickets/admin/tickets?limit=5"),
        ]);
        const ovData = await ovRes.json();
        const tktData = await tktRes.json();

        setOverview(ovData);
        setRecentTickets(tktData?.data || []);
      } catch (err) {
        console.error("Error fetching support data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Support Desk &amp; Case Management
                  </h1>
                  <p className="text-xs text-slate-500">
                    Live operational telemetry, SLA monitoring, and queue management.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/support/tickets"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <span>View All Tickets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Open Tickets */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Open Tickets</span>
                <Inbox className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">{overview.openTickets}</div>
              <p className="text-[10px] text-slate-400 mt-1">Awaiting triage &amp; initial reply</p>
            </div>

            {/* Unassigned Queue */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Unassigned</span>
                <Users className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600">{overview.unassignedTickets}</div>
              <p className="text-[10px] text-slate-400 mt-1">Pending agent assignment</p>
            </div>

            {/* Escalated / Urgent */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Escalated</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-rose-600">{overview.escalatedTickets}</div>
              <p className="text-[10px] text-slate-400 mt-1">Supervisor review required</p>
            </div>

            {/* Resolved */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Resolved</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600">{overview.resolvedTickets}</div>
              <p className="text-[10px] text-slate-400 mt-1">Successfully addressed</p>
            </div>
          </div>

          {/* Secondary Telemetry Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Waiting on Customer</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                  {overview.waitingForUser}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Staff have replied and are awaiting customer feedback or requested documentation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">In Progress</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                  {overview.inProgressTickets}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Active investigations underway across technical, KYC, and wallet support units.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Overdue SLA</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  overview.overdueSla > 0 ? "bg-rose-100 text-rose-700 animate-pulse" : "bg-emerald-50 text-emerald-700"
                }`}>
                  {overview.overdueSla} Cases
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tickets exceeding guaranteed first response or resolution targets.
              </p>
            </div>
          </div>

          {/* Live Recent Tickets Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Recent Support Queue</h3>
                <p className="text-[11px] text-slate-400">Latest tickets registered across customer and partner channels</p>
              </div>
              <Link
                href="/support/tickets"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                <span>Full Desk View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading live support records...</div>
            ) : recentTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No support tickets registered yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3">Ticket ID</th>
                      <th className="px-4 py-3">Requester</th>
                      <th className="px-4 py-3">Audience</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-4 py-3 font-mono font-bold text-blue-600">{t.ticket_number}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{t.userName || "Guest User"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.audience === "BUSINESS_PARTNER" ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-700"
                          }`}>
                            {t.audience === "BUSINESS_PARTNER" ? "Business Partner" : "Customer"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{t.category}</td>
                        <td className="px-4 py-3 text-slate-800 font-medium max-w-[220px] truncate">{t.subject}</td>
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
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/support/tickets/${t.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-[11px] font-bold transition"
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
          </div>
        </main>
      </div>
    </div>
  );
}
