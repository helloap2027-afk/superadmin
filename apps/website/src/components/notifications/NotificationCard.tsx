"use client";

import React from "react";
import { 
  FileText, MessageSquare, Tag, ShieldCheck, Star, 
  Store, Building2, Bell, CheckCircle2, ChevronRight,
  ExternalLink, Phone, ArrowRight, Trash2, Calendar, Clock
} from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  recipient: string;
  is_read: number;
  related_entity: string | null;
  related_id: string | null;
  created_at: string;
  read_at: string | null;
}

interface NotificationCardProps {
  item: NotificationItem;
  activeRole: "customer" | "merchant" | "all";
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationCard({ item, activeRole, onMarkAsRead, onDelete }: NotificationCardProps) {
  const isUnread = item.is_read === 0;

  // Resolve visual metadata by notification type
  const getTypeMeta = (type: string) => {
    switch (type) {
      case "LEAD_RECEIVED":
        return {
          icon: MessageSquare,
          accentColor: "text-[#FF6B35] bg-orange-50 border-orange-200",
          tagText: "Buyer Lead",
          tagBg: "bg-orange-100 text-orange-800",
        };
      case "QUOTE_RECEIVED":
        return {
          icon: Tag,
          accentColor: "text-[#0076D7] bg-blue-50 border-blue-200",
          tagText: "15-Min Fast Quote",
          tagBg: "bg-blue-100 text-blue-800",
        };
      case "OFFER_ALERT":
      case "SPECIAL_OFFER":
        return {
          icon: Tag,
          accentColor: "text-amber-600 bg-amber-50 border-amber-200",
          tagText: "Exclusive Deal",
          tagBg: "bg-amber-100 text-amber-800",
        };
      case "KYC_VERIFICATION":
        return {
          icon: ShieldCheck,
          accentColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
          tagText: "KYC Verified",
          tagBg: "bg-emerald-100 text-emerald-800",
        };
      case "REVIEW_RECEIVED":
        return {
          icon: Star,
          accentColor: "text-yellow-600 bg-yellow-50 border-yellow-200",
          tagText: "Customer Review",
          tagBg: "bg-yellow-100 text-yellow-800",
        };
      case "SUBSCRIPTION_UPDATE":
        return {
          icon: Building2,
          accentColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
          tagText: "Plan Update",
          tagBg: "bg-indigo-100 text-indigo-800",
        };
      default:
        return {
          icon: Bell,
          accentColor: "text-slate-600 bg-slate-100 border-slate-200",
          tagText: "System Alert",
          tagBg: "bg-slate-100 text-slate-800",
        };
    }
  };

  const meta = getTypeMeta(item.type);
  const IconComp = meta.icon;

  // Format relative time
  const getRelativeTime = (isoString: string) => {
    try {
      const now = new Date();
      const past = new Date(isoString);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} mins ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      return past.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-2xs hover:shadow-xs ${
        isUnread ? "border-blue-200 bg-blue-50/20" : "border-slate-200/90"
      }`}
    >
      {/* Left: Icon & Notification Content */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <div
          className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105 ${meta.accentColor}`}
        >
          <IconComp className="w-5 h-5" />
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-[#0076D7] shrink-0 animate-pulse" />
            )}
            <h3
              className={`text-sm truncate leading-snug ${
                isUnread ? "font-black text-slate-900" : "font-bold text-slate-800"
              }`}
            >
              {item.title}
            </h3>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${meta.tagBg}`}
            >
              {meta.tagText}
            </span>

            {/* In dual 'all' view, render audience badge */}
            {activeRole === "all" && (
              <span
                className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                  item.recipient.toUpperCase().includes("MERCHANT") || item.type.includes("LEAD") || item.type.includes("KYC")
                    ? "bg-orange-50 text-[#FF6B35] border border-orange-200"
                    : "bg-blue-50 text-[#0076D7] border border-blue-200"
                }`}
              >
                {item.recipient.toUpperCase().includes("MERCHANT") || item.type.includes("LEAD") || item.type.includes("KYC")
                  ? "Business Partner"
                  : "Customer"}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {item.message}
          </p>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium pt-0.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {getRelativeTime(item.created_at)}
            </span>
            <span>•</span>
            <span className="font-semibold text-slate-500">
              {item.recipient || "Direct Channel"}
            </span>
            {item.read_at && (
              <>
                <span>•</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Read
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
        <div className="flex items-center gap-1.5">
          {/* Contextual Action CTAs */}
          {item.type === "LEAD_RECEIVED" && (
            <a
              href="tel:+919848012345"
              className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-200 transition flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>Call Lead</span>
            </a>
          )}

          {item.type === "QUOTE_RECEIVED" && (
            <a
              href="/"
              className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-lg border border-blue-200 transition flex items-center gap-1"
            >
              <span>View Quote</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          )}

          {item.type === "KYC_VERIFICATION" && (
            <a
              href="/vendor/manage-business"
              className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-200 transition flex items-center gap-1"
            >
              <span>View KYC</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Mark read button */}
          {isUnread ? (
            <button
              onClick={() => onMarkAsRead(item.id)}
              className="p-1.5 text-slate-400 hover:text-[#0076D7] hover:bg-blue-50 rounded-lg transition"
              title="Mark as read"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] text-slate-300 font-medium px-1">Done</span>
          )}

          {/* Delete button */}
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Delete notification"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

