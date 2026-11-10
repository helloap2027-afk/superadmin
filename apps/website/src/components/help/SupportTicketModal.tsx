"use client";

import React, { useState } from "react";
import { X, Ticket, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { toast } from "../Toast";

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  audience: "CUSTOMER" | "BUSINESS_PARTNER" | "GUEST";
  defaultCategory?: string;
}

export function SupportTicketModal({
  isOpen,
  onClose,
  audience,
  defaultCategory = "General Support"
}: SupportTicketModalProps) {
  const [category, setCategory] = useState(defaultCategory);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "NORMAL" | "HIGH" | "URGENT">("NORMAL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error("Please fill in both subject and description.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
      const userStr = typeof window !== "undefined" ? localStorage.getItem("hello_user") : null;
      let userId = "usr_guest";
      let activeRole = audience === "BUSINESS_PARTNER" ? "MERCHANT" : "CUSTOMER";

      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          userId = u.id || userId;
        } catch {}
      }

      // Try /support-tickets first (the comprehensive support ticket engine), with fallback to /help-center/tickets
      let res = await fetch("http://localhost:4000/api/v1/support-tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "x-user-id": userId,
          "x-user-role": activeRole === "MERCHANT" ? "BUSINESS_PARTNER" : "CUSTOMER",
          "x-active-role": activeRole,
        },
        body: JSON.stringify({
          category,
          subject: subject.trim(),
          description: description.trim(),
          priority,
          source: "WEB",
        }),
      });

      if (!res.ok) {
        // Fallback to /help-center/tickets
        res = await fetch("http://localhost:4000/api/v1/help-center/tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "x-user-id": userId,
            "x-active-role": activeRole,
          },
          body: JSON.stringify({
            category,
            subject: subject.trim(),
            description: description.trim(),
            priority,
          }),
        });
      }

      const json = await res.json();
      const ticketInfo = json.data || (json.ticket ? { ticketNumber: json.ticket.ticketNumber, id: json.ticket.id, ...json.ticket } : null);
      if (json.success && ticketInfo) {
        setTicketResult(ticketInfo);
        toast.success(`Support Ticket ${ticketInfo.ticketNumber || ""} created!`);
      } else {
        toast.error(json?.message || "Failed to submit support ticket. Please try again.");
      }
    } catch {
      toast.error("Network error while submitting support ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setTicketResult(null);
    setSubject("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {ticketResult ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Ticket Submitted</span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Ticket Reference: {ticketResult.ticketNumber}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2">
                Our 24×7 customer care specialists have logged your ticket and will contact you via email or phone within 2 hours.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="w-full bg-[#0076D7] hover:bg-[#005FAE] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Ticket Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0076D7] flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Raise a Support Ticket
                </h2>
                <p className="text-[11px] text-slate-400">
                  {audience === "BUSINESS_PARTNER" ? "Dedicated Partner Resolution Desk" : "Customer Priority Assistance"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#0076D7]"
              >
                {audience === "BUSINESS_PARTNER" ? (
                  <>
                    <option value="Business Registration & Verification">Business Registration &amp; Verification</option>
                    <option value="Listing & Profile Management">Listing &amp; Profile Management</option>
                    <option value="Enquiries & Leads">Enquiries &amp; Leads</option>
                    <option value="Plans & Subscriptions">Plans &amp; Subscriptions</option>
                    <option value="Wallet & Settlements">Wallet &amp; Settlements</option>
                    <option value="Advertisements & Offers">Advertisements &amp; Offers</option>
                    <option value="General Partner Support">General Partner Support</option>
                  </>
                ) : (
                  <>
                    <option value="Booking & Service Enquiries">Booking &amp; Service Enquiries</option>
                    <option value="Payments & Wallet">Payments &amp; Wallet</option>
                    <option value="Account & Profile">Account &amp; Profile</option>
                    <option value="Cancellations & Refunds">Cancellations &amp; Refunds</option>
                    <option value="Plans & Subscriptions">Plans &amp; Subscriptions</option>
                    <option value="App & Website Support">App &amp; Website Support</option>
                    <option value="General Customer Support">General Customer Support</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your query or issue..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what happened, steps taken, and any relevant booking or transaction IDs..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#0076D7]"
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal (Standard)</option>
                  <option value="HIGH">High (Urgent Attention)</option>
                  <option value="URGENT">Urgent (Service Blocked)</option>
                </select>
              </div>
              <div className="flex items-center text-[10px] text-slate-400 leading-tight pt-5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 mr-1 shrink-0" />
                <span>Response SLA: Within 2 hours for active users.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0076D7] hover:bg-[#005FAE] disabled:opacity-50 text-white px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Submit Ticket"}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

