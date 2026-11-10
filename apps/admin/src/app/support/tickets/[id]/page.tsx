"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/navigation/AdminNavbar";
import { AdminSidebar } from "@/components/navigation/AdminSidebar";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  User,
  ShieldCheck,
  Building2,
  FileText,
  Lock,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  CornerDownRight,
  Sparkles
} from "lucide-react";

export default function TicketWorkspacePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const ticketId = params.id;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [cannedResponses, setCannedResponses] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Composer Form
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Action Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resSummary, setResSummary] = useState("");
  const [resCategory, setResCategory] = useState("Issue Resolved");

  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateReason, setEscalateReason] = useState("");

  const fetchTicketDetails = async () => {
    try {
      const headers = {
        "x-user-id": "admin-1",
        "x-user-role": "SUPER_ADMIN",
        "x-user-name": "Super Admin Specialist"
      };

      const [detRes, canRes, agRes, deptRes] = await Promise.all([
        fetch(`http://localhost:4000/api/v1/support-tickets/${ticketId}`, { headers }),
        fetch(`http://localhost:4000/api/v1/support-tickets/admin/canned-responses`),
        fetch(`http://localhost:4000/api/v1/support-tickets/admin/agents`),
        fetch(`http://localhost:4000/api/v1/support-tickets/admin/departments`),
      ]);

      const det = await detRes.json();
      const can = await canRes.json();
      const ag = await agRes.json();
      const dep = await deptRes.json();

      setTicket(det.ticket);
      setMessages(det.messages || []);
      setAuditLogs(det.auditLogs || []);
      setCannedResponses(Array.isArray(can) ? can : []);
      setAgents(Array.isArray(ag) ? ag : []);
      setDepartments(Array.isArray(dep) ? dep : []);
    } catch (err) {
      console.error("Error loading ticket workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/support-tickets/${ticketId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "admin-1",
          "x-user-role": "SUPER_ADMIN",
          "x-user-name": "Super Admin Specialist"
        },
        body: JSON.stringify({
          message: replyText.trim(),
          isInternalNote,
        }),
      });

      if (res.ok) {
        setReplyText("");
        fetchTicketDetails();
      }
    } catch (err) {
      console.error("Error sending reply:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleAssignSubmit = async () => {
    const ag = agents.find(a => a.id === selectedAgentId);
    if (!ag) return;

    try {
      await fetch(`http://localhost:4000/api/v1/support-tickets/admin/tickets/${ticketId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "admin-1",
          "x-user-role": "SUPER_ADMIN",
          "x-user-name": "Super Admin Specialist"
        },
        body: JSON.stringify({
          agentId: ag.id,
          agentName: ag.name,
          department: selectedDept || undefined,
        }),
      });
      setShowAssignModal(false);
      fetchTicketDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveSubmit = async () => {
    if (!resSummary.trim()) return;

    try {
      await fetch(`http://localhost:4000/api/v1/support-tickets/admin/tickets/${ticketId}/resolve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "admin-1",
          "x-user-role": "SUPER_ADMIN",
          "x-user-name": "Super Admin Specialist"
        },
        body: JSON.stringify({
          resolutionCategory: resCategory,
          resolutionSummary: resSummary.trim(),
        }),
      });
      setShowResolveModal(false);
      fetchTicketDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEscalateSubmit = async () => {
    try {
      await fetch(`http://localhost:4000/api/v1/support-tickets/admin/tickets/${ticketId}/escalate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "admin-1",
          "x-user-role": "SUPER_ADMIN",
          "x-user-name": "Super Admin Specialist"
        },
        body: JSON.stringify({
          reason: escalateReason.trim() || "Immediate supervisor intervention requested.",
        }),
      });
      setShowEscalateModal(false);
      fetchTicketDetails();
    } catch (err) {
      console.error(err);
    }
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

        {loading || !ticket ? (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
            Loading case workspace...
          </div>
        ) : (
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Top Navigation & Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Link
                  href="/support/tickets"
                  className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">{ticket.ticket_number}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ticket.status === "RESOLVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : ticket.status === "ESCALATED"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      Priority: {ticket.priority}
                    </span>
                  </div>
                  <h1 className="text-xl font-black text-slate-900 mt-1">{ticket.subject}</h1>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                >
                  {ticket.assigned_agent_name ? "Reassign" : "Assign Ticket"}
                </button>

                <button
                  onClick={() => setShowEscalateModal(true)}
                  className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-100 transition shadow-xs"
                >
                  Escalate
                </button>

                <button
                  onClick={() => setShowResolveModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Resolve Case
                </button>
              </div>
            </div>

            {/* Main Content Workspace: Left Thread (8 cols), Right Meta (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Thread & Composer */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Conversation Thread */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span>Audit Conversation Timeline ({messages.length} entries)</span>
                    </span>
                    <span className="text-[11px] text-slate-400">Chronological • Real Database Records</span>
                  </div>

                  <div className="p-5 space-y-4">
                    {messages.map((m) => {
                      const isInternal = !!m.is_internal_note;
                      const isAdmin = m.sender_role === "SUPER_ADMIN" || m.sender_role === "SUPPORT_AGENT";

                      return (
                        <div
                          key={m.id}
                          className={`p-4 rounded-2xl border ${
                            isInternal
                              ? "bg-amber-50/80 border-amber-200 text-amber-900"
                              : isAdmin
                              ? "bg-blue-50/60 border-blue-200 text-slate-800"
                              : "bg-white border-slate-200 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{m.sender_name}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isInternal
                                  ? "bg-amber-200 text-amber-900"
                                  : isAdmin
                                  ? "bg-blue-200 text-blue-900"
                                  : "bg-slate-100 text-slate-700"
                              }`}>
                                {isInternal ? "INTERNAL NOTE" : m.sender_role}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {new Date(m.created_at).toLocaleString("en-IN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>

                          <p className="text-xs leading-relaxed whitespace-pre-line">{m.message}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reply & Internal Note Composer */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsInternalNote(false)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          !isInternalNote
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Public Reply to Requester
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsInternalNote(true)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          isInternalNote
                            ? "bg-amber-500 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        <span>Staff Internal Note (Admin Only)</span>
                      </button>
                    </div>

                    {/* Canned Responses Dropdown */}
                    {cannedResponses.length > 0 && (
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            setReplyText(val.replace("{{user_name}}", ticket.userName || "Customer").replace("{{ticket_subject}}", ticket.subject));
                          }
                        }}
                        className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-600 bg-slate-50"
                      >
                        <option value="">Insert Canned Template...</option>
                        {cannedResponses.map((c) => (
                          <option key={c.id} value={c.body_text}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <form onSubmit={handleSendReply} className="space-y-3">
                    <textarea
                      rows={4}
                      placeholder={
                        isInternalNote
                          ? "Add internal investigation findings, payment gateway hashes, or notes visible ONLY to support staff..."
                          : "Type your official response to the customer or business partner..."
                      }
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3.5 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        {isInternalNote
                          ? "🔒 Hidden from requester. Only visible in Super Admin."
                          : "✉️ Will trigger in-app notification & transactional email update."}
                      </span>
                      <button
                        type="submit"
                        disabled={isSending || !replyText.trim()}
                        className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                          isInternalNote
                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSending ? "Posting..." : isInternalNote ? "Save Internal Note" : "Send Reply"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Sidebar: Meta & Audit */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Requester Profile */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Requester Profile</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center">
                      {ticket.userName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{ticket.userName || "Guest Requester"}</h4>
                      <p className="text-xs text-slate-500">{ticket.userPhone || "No Phone"}</p>
                      <p className="text-xs text-slate-500">{ticket.userEmail || "No Email"}</p>
                    </div>
                  </div>

                  {ticket.businessName && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Linked Business</span>
                      <p className="text-xs font-semibold text-slate-800">{ticket.businessName}</p>
                    </div>
                  )}
                </div>

                {/* Case Parameters */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3 text-xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Case Metadata</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Department:</span>
                      <span className="font-bold text-slate-800">{ticket.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned Agent:</span>
                      <span className="font-bold text-slate-800">
                        {ticket.assigned_agent_name || <span className="text-amber-500 italic">Unassigned</span>}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Channel Source:</span>
                      <span className="font-bold text-slate-800">{ticket.source || "WEBSITE"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Resolution SLA:</span>
                      <span className="font-mono text-slate-800">
                        {new Date(ticket.resolution_due_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Audit Accountability Logs */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Audit Trail</h3>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="text-[11px] p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{log.action}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(log.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-0.5">{log.reason || "State transition"}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Actor: {log.actor_name} ({log.actor_role})</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal: Assign Ticket */}
            {showAssignModal && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
                  <h3 className="text-base font-black text-slate-900">Assign Support Case</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Select Support Agent</label>
                      <select
                        value={selectedAgentId}
                        onChange={(e) => setSelectedAgentId(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="">Choose Agent...</option>
                        {agents.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.name} ({ag.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Assign Department</label>
                      <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="">Keep current ({ticket.department})</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignSubmit}
                      disabled={!selectedAgentId}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                      Confirm Assignment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Resolve Case */}
            {showResolveModal && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
                  <h3 className="text-base font-black text-slate-900">Resolve Support Ticket</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Resolution Category</label>
                      <select
                        value={resCategory}
                        onChange={(e) => setResCategory(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="Issue Resolved">Issue Resolved</option>
                        <option value="Information Provided">Information Provided</option>
                        <option value="Payment Adjusted">Payment / Ledger Adjusted</option>
                        <option value="Account Verified">Account / KYC Verified</option>
                        <option value="Bug Patched">Bug / System Patched</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Resolution Summary Note (Required)</label>
                      <textarea
                        rows={3}
                        value={resSummary}
                        onChange={(e) => setResSummary(e.target.value)}
                        placeholder="Detail the investigation outcome and root cause resolution..."
                        className="w-full p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowResolveModal(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleResolveSubmit}
                      disabled={!resSummary.trim()}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                      Confirm &amp; Resolve
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Escalate */}
            {showEscalateModal && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
                  <h3 className="text-base font-black text-slate-900">Escalate Case to Supervisor</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Reason for Escalation</label>
                      <textarea
                        rows={3}
                        value={escalateReason}
                        onChange={(e) => setEscalateReason(e.target.value)}
                        placeholder="State why this ticket requires immediate higher-tier intervention..."
                        className="w-full p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowEscalateModal(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEscalateSubmit}
                      className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
                    >
                      Escalate Case
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
