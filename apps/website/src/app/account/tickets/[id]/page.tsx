"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DesktopHeader } from "@/components/DesktopHeader";
import {
  ArrowLeft,
  ChevronRight,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User,
  ShieldCheck,
  HelpCircle
} from "lucide-react";

export default function UserTicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const ticketId = params.id;

  const [role, setRole] = useState<"GUEST" | "CUSTOMER" | "BUSINESS_PARTNER">("CUSTOMER");
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<"CUSTOMER" | "MERCHANT">("CUSTOMER");

  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [showReopenModal, setShowReopenModal] = useState(false);

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

  const fetchTicketDetails = async () => {
    try {
      const headers: any = {};
      if (sessionUser?.id) {
        headers["x-user-id"] = sessionUser.id;
        headers["x-user-role"] = activeRole === "MERCHANT" ? "BUSINESS_PARTNER" : "CUSTOMER";
      }

      const res = await fetch(`http://localhost:4000/api/v1/support-tickets/${ticketId}`, { headers });
      if (!res.ok) throw new Error("Ticket not found");
      const data = await res.json();
      setTicket(data.ticket);
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId, sessionUser]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSending || !sessionUser) return;

    setIsSending(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/support-tickets/${ticketId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": sessionUser.id,
          "x-user-role": activeRole === "MERCHANT" ? "BUSINESS_PARTNER" : "CUSTOMER",
          "x-user-name": sessionUser.fullName || "User",
        },
        body: JSON.stringify({
          message: replyText.trim(),
        }),
      });

      if (res.ok) {
        setReplyText("");
        fetchTicketDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleReopenSubmit = async () => {
    if (!sessionUser) return;

    try {
      await fetch(`http://localhost:4000/api/v1/support-tickets/${ticketId}/reopen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": sessionUser.id,
          "x-user-role": activeRole === "MERCHANT" ? "BUSINESS_PARTNER" : "CUSTOMER",
          "x-user-name": sessionUser.fullName || "User",
        },
        body: JSON.stringify({
          reason: reopenReason.trim() || "User indicated issue remains unresolved.",
        }),
      });
      setShowReopenModal(false);
      fetchTicketDetails();
    } catch (err) {
      console.error(err);
    }
  };

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

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500">
          <Link href="/account/tickets" className="hover:text-blue-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-4 h-4" /> My Tickets
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">{ticket?.ticket_number || "Case Thread"}</span>
        </div>

        {loading || !ticket ? (
          <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-400 border border-slate-200/90">
            Loading case details...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">{ticket.ticket_number}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ticket.status === "RESOLVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : ticket.status === "WAITING_FOR_CUSTOMER"
                        ? "bg-amber-100 text-amber-800"
                        : ticket.status === "ESCALATED"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {ticket.category}
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-black text-slate-900">{ticket.subject}</h1>
                </div>

                {/* Reopen Button if Resolved */}
                {ticket.status === "RESOLVED" && (
                  <button
                    onClick={() => setShowReopenModal(true)}
                    className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold transition flex items-center gap-1 self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Issue Unresolved? Reopen</span>
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex flex-wrap gap-4">
                <span>Submitted: {new Date(ticket.created_at).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                {ticket.assigned_agent_name && <span>Assigned Specialist: {ticket.assigned_agent_name}</span>}
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Messages &amp; Case Updates</span>
                </span>
              </div>

              <div className="p-5 space-y-4">
                {messages.map((m) => {
                  const isStaff = m.sender_role === "SUPER_ADMIN" || m.sender_role === "SUPPORT_AGENT";

                  return (
                    <div
                      key={m.id}
                      className={`p-4 rounded-2xl border ${
                        isStaff
                          ? "bg-blue-50/70 border-blue-200 ml-4 sm:ml-8"
                          : "bg-white border-slate-200 mr-4 sm:mr-8"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{m.sender_name}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            isStaff ? "bg-blue-200 text-blue-900" : "bg-slate-100 text-slate-700"
                          }`}>
                            {isStaff ? "HELLO-Hi Support Specialist" : "You"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{m.message}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reply Input */}
            {ticket.status !== "CLOSED" && (
              <form onSubmit={handleSendReply} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900">Reply to Support Team</h3>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Provide additional details or answer specialist questions..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSending || !replyText.trim()}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? "Sending..." : "Send Follow-up Message"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Modal: Reopen */}
            {showReopenModal && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                  <h3 className="text-base font-black text-slate-900">Reopen Support Ticket</h3>
                  <p className="text-xs text-slate-500">
                    If your issue remains unresolved, please explain what further assistance is needed.
                  </p>
                  <textarea
                    rows={3}
                    value={reopenReason}
                    onChange={(e) => setReopenReason(e.target.value)}
                    placeholder="Describe why you are reopening this case..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowReopenModal(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReopenSubmit}
                      disabled={!reopenReason.trim()}
                      className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                      Reopen Ticket
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

