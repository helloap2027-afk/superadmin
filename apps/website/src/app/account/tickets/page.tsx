"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DesktopHeader } from "@/components/DesktopHeader";
import {
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  HelpCircle,
  FileText
} from "lucide-react";
import { SupportTicketModal } from "@/components/help/SupportTicketModal";

export default function MyTicketsPage() {
  const router = useRouter();

  const [role, setRole] = useState<"GUEST" | "CUSTOMER" | "BUSINESS_PARTNER">("CUSTOMER");
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<"CUSTOMER" | "MERCHANT">("CUSTOMER");
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("hello_access_token") || localStorage.getItem("access_token");
      const savedRole = (localStorage.getItem("hello_active_role") || "CUSTOMER") as "CUSTOMER" | "MERCHANT";
      const userStr = localStorage.getItem("hello_user");

      if (token) {
        if (savedRole === "MERCHANT") {
          setRole("BUSINESS_PARTNER");
          setActiveRole("MERCHANT");
        } else {
          setRole("CUSTOMER");
          setActiveRole("CUSTOMER");
        }
      } else {
        setRole("GUEST");
      }

      if (userStr) {
        try {
          setSessionUser(JSON.parse(userStr));
        } catch {}
      }
    } catch {}
  }, []);

  const fetchMyTickets = async () => {
    if (!sessionUser?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const headers = {
        "x-user-id": sessionUser.id,
        "x-user-role": activeRole === "MERCHANT" ? "BUSINESS_PARTNER" : "CUSTOMER",
      };
      const res = await fetch(`http://localhost:4000/api/v1/support-tickets/my-tickets`, { headers });
      const data = await res.json();
      setTickets(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, [sessionUser, activeRole]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <DesktopHeader
        selectedCity="Hyderabad"
        onSelectCity={() => {}}
        selectedLocality="Hitec City"
        onSelectLocality={() => {}}
        selectedCategory={null}
        onSelectCategory={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
        onOpenAddBusiness={() => {}}
        onOpenLogin={() => {}}
        isLoggedIn={role !== "GUEST"}
        userName={sessionUser?.fullName || "User"}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500">
          <Link href="/help-center" className="hover:text-blue-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-4 h-4" /> Help Center
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">My Support Tickets</span>
        </div>

        {/* Header Strip */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              My Support Cases
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track open inquiries, response timelines, and converse directly with support specialists.
            </p>
          </div>

          <button
            onClick={() => setTicketModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise New Ticket</span>
          </button>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/90 text-xs text-slate-400">
            Loading your support cases...
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Support Tickets Raised</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You currently have no active or historical support cases. If you require assistance, click the button below.
            </p>
            <button
              onClick={() => setTicketModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
            >
              <PlusCircle className="w-4 h-4" /> Raise a Support Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <Link
                key={t.id}
                href={`/account/tickets/${t.id}`}
                className="block bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600">{t.ticket_number}</span>
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
                      <span className="text-[10px] text-slate-400 font-medium">
                        {t.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {t.subject}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                  </div>

                  <div className="flex items-center gap-3 sm:self-center">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">
                        {new Date(t.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </p>
                      <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                        View Thread <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SupportTicketModal
        isOpen={ticketModalOpen}
        onClose={() => {
          setTicketModalOpen(false);
          fetchMyTickets();
        }}
        audience={role}
        defaultCategory="General Support"
      />
    </div>
  );
}

