"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  MessageSquare,
  TrendingUp,
  Wallet,
  CreditCard,
  Users,
  Clock,
  FileText,
  LogOut,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export interface PartnerPortalSidebarProps {
  activeKey?:
    | "dashboard"
    | "my-business"
    | "leads"
    | "performance"
    | "wallet"
    | "subscription"
    | "documents"
    | "profile";
}

const API_BASE = "http://localhost:4000/api/v1";

export function PartnerPortalSidebar({ activeKey = "my-business" }: PartnerPortalSidebarProps) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState<string>("Vinod Tech Mobile Hub");
  const [partnerInitial, setPartnerInitial] = useState<string>("V");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [kycStatus, setKycStatus] = useState<string>("PENDING");
  const [unreadLeads, setUnreadLeads] = useState<number>(32);

  useEffect(() => {
    let isMounted = true;
    const fetchPartnerInfo = async () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("hello_access_token");
      const userStr = localStorage.getItem("hello_user");
      let uid = "";
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          uid = u.id || "";
          if (u.fullName) {
            setPartnerInitial(u.fullName.charAt(0).toUpperCase());
          }
        } catch {}
      }

      // 1. Fetch live merchant profile
      try {
        const res = await fetch(`${API_BASE}/merchant/profile`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(uid ? { "x-user-id": uid } : {}),
          },
        });
        const json = await res.json();
        if (isMounted && json?.success && json.data) {
          const b = json.data.business;
          if (b?.name) {
            setBusinessName(b.name);
            setPartnerInitial(b.name.charAt(0).toUpperCase());
          }
          const status = b?.status || "PENDING";
          const verified = (b?.isVerified === true || b?.is_verified === 1) && (status === "APPROVED" || status === "VERIFIED");
          setIsVerified(verified);
          setKycStatus(status);
        }
      } catch {}

      // 2. Fetch live lead/enquiry count for the badge
      try {
        const countsRes = await fetch(`${API_BASE}/notifications/counts`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(uid ? { "x-user-id": uid } : {}),
          },
        });
        const countsJson = await countsRes.json();
        if (isMounted && countsJson?.success && countsJson.data) {
          const leads = countsJson.data.leads || countsJson.data.enquiries || 32;
          setUnreadLeads(leads);
        }
      } catch {}
    };

    fetchPartnerInfo();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("hello_access_token");
    try {
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {}
    localStorage.removeItem("hello_access_token");
    localStorage.removeItem("hello_user");
    localStorage.removeItem("hello_active_role");
    window.dispatchEvent(new Event("hello_auth_changed"));
    router.push("/");
  };

  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/vendor/dashboard",
    },
    {
      key: "my-business",
      label: "My Business",
      icon: Store,
      href: "/vendor/dashboard",
    },
    {
      key: "leads",
      label: "Enquiries & Leads",
      icon: MessageSquare,
      href: "/vendor/dashboard#leads",
      badge: unreadLeads,
    },
    {
      key: "performance",
      label: "Performance",
      icon: TrendingUp,
      href: "/vendor/dashboard#performance",
    },
    {
      key: "wallet",
      label: "Wallet",
      icon: Wallet,
      href: "/vendor/wallet",
    },
    {
      key: "subscription",
      label: "Subscription",
      icon: CreditCard,
      href: "/plans?role=business",
    },
    {
      key: "documents",
      label: "Documents",
      icon: FileText,
      href: "/vendor/profile",
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4 select-none sticky top-24 self-start">
      {/* ── Partner Profile Badge Card ── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0076D7] to-[#00A3FF] text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
          {partnerInitial}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-900 truncate" title={businessName}>
            {businessName}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 inline-flex items-center gap-1">
              <Store className="w-2.5 h-2.5 text-amber-600" />
              Business Partner
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-bold">
            {isVerified ? (
              <span className="text-emerald-600 fill-emerald-100 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100 text-emerald-600" />
                <span>Verified Partner</span>
              </span>
            ) : (
              <span className="text-amber-600 fill-amber-100 inline-flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 fill-amber-100 text-amber-600" />
                <span>Pending Verification</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Navigation Links ── */}
      <nav className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm flex flex-col gap-1 text-xs font-bold text-slate-600">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition duration-150 ${
                isActive
                  ? "bg-orange-50 text-[#FF6B35] border-l-4 border-[#FF6B35] font-black"
                  : "hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition ${
                    isActive ? "text-[#FF6B35]" : "text-slate-500"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-[#FF6B35] text-white shrink-0 ml-1">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-2 border-t border-slate-100" />

        {/* ── Logout Button ── */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-bold transition duration-150 text-left"
        >
          <LogOut className="w-4 h-4 text-red-500 shrink-0" />
          <span className="truncate">Logout</span>
        </button>
      </nav>
    </aside>
  );
}
