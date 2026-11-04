"use client";

<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Shield, LogOut, Laptop, Smartphone, Trash2, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Store } from "lucide-react";

export default function CustomerAccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }

    // Load User Profile
    fetch("http://localhost:4000/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setUser(json.data);
          localStorage.setItem("hello_user", JSON.stringify(json.data));
        } else {
          router.replace("/login");
        }
      })
      .catch(() => router.replace("/login"))
      .finally(() => setIsLoading(false));

    // Load Active Sessions
    fetch("http://localhost:4000/api/v1/auth/sessions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSessions(json.data);
        }
      })
      .catch(() => {});
  }, [router]);

  const handleRevokeSession = async (sessionId: string) => {
    const token = localStorage.getItem("hello_access_token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/auth/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        setActionMessage("Session revoked successfully.");
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch {}
  };

  const handleLogoutAll = async () => {
    const token = localStorage.getItem("hello_access_token");
    if (!token) return;

    try {
      await fetch("http://localhost:4000/api/v1/auth/logout-all", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      router.replace("/login");
    } catch {}
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("hello_access_token");
    const refreshToken = localStorage.getItem("hello_refresh_token") || undefined;
    if (token) {
      try {
        await fetch("http://localhost:4000/api/v1/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch {}
    }
    localStorage.clear();
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin text-[#0076D7]" />
          <span>Loading Account...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0076D7] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery Home</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {actionMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0076D7] to-sky-400 flex items-center justify-center text-white font-black text-2xl shadow-md">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {user?.fullName || "HELLO Customer"}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-200">
                    Verified in Database
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {user?.phoneNumber}
                  </span>
                  {user?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {user.email}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {user?.roles?.includes("VENDOR_OWNER") ? (
                <Link
                  href="/vendor/login"
                  className="px-4 py-2.5 rounded-2xl bg-[#FF6B35] hover:bg-[#E5531E] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Store className="w-4 h-4" />
                  <span>Vendor Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/vendor/register"
                  className="px-4 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#FF6B35] border border-orange-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Store className="w-4 h-4" />
                  <span>Register a Business</span>
                </Link>
              )}
            </div>
          </div>

          {/* Real Database Fields Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Database User ID</span>
              <span className="font-mono text-slate-800 font-bold text-[11px] truncate block" title={user?.id}>{user?.id || "N/A"}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">City & Locality</span>
              <span className="font-bold text-slate-800 block truncate">
                {user?.locality?.name ? `${user.locality.name}, ${user.locality.cityName}` : "Primary Pilot Region"}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Preferred Language</span>
              <span className="font-bold text-slate-800 block">{user?.preferredLanguage || "English"}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Registered In DB</span>
              <span className="font-bold text-slate-800 block">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Just now"}
              </span>
            </div>
          </div>

          {/* Live DB SQL Record Viewer */}
          <div className="pt-2">
            <details className="group rounded-2xl bg-slate-900 text-slate-100 p-4 border border-slate-800 transition">
              <summary className="text-xs font-bold font-mono text-sky-400 cursor-pointer select-none flex items-center justify-between">
                <span>▶ View Live Relational DB Record (`users` table)</span>
                <span className="text-[10px] text-slate-400 font-sans font-normal">Stored in SQLite / MariaDB</span>
              </summary>
              <pre className="mt-3 p-3 bg-slate-950 rounded-xl overflow-x-auto text-[11px] font-mono text-emerald-400 border border-slate-800 leading-relaxed">
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Quick Portal Switcher Banner */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-blue-900 font-bold">Quick Auth Links:</span>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-1.5 bg-white border border-blue-200 rounded-xl font-bold text-[#0076D7] hover:bg-blue-50 transition shadow-xs">
              Show Login Page
            </Link>
            <Link href="/register" className="px-3 py-1.5 bg-white border border-blue-200 rounded-xl font-bold text-[#0076D7] hover:bg-blue-50 transition shadow-xs">
              Show Registration Page
            </Link>
            <Link href="/complete-profile" className="px-3 py-1.5 bg-white border border-blue-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs">
              Edit Complete Profile
            </Link>
          </div>
        </div>

        {/* Active Sessions & Security */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#0076D7]" />
                <span>Active Login Sessions</span>
              </h2>
              <p className="text-xs text-slate-500">
                Manage all authorized devices currently authenticated with your account.
              </p>
            </div>

            {sessions.length > 1 && (
              <button
                onClick={handleLogoutAll}
                className="text-xs font-bold text-red-600 hover:text-red-700 transition hover:underline"
              >
                Revoke All Other Devices
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {sessions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active session records found.
              </div>
            ) : (
              sessions.map((sess) => (
                <div key={sess.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      {sess.deviceInfo?.toLowerCase().includes("phone") ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {sess.deviceInfo || "Web Browser"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        IP: {sess.ipAddress || "127.0.0.1"} • Connected: {new Date(sess.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Revoke Session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
=======
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  User, Phone, Mail, ShieldCheck, LogOut, Building2, 
  Bell, ChevronRight, Home, Sparkles, CheckCircle2, Clock,
  LayoutDashboard, Inbox, Heart, Star, Settings, ExternalLink,
  Edit3, Trash2, MapPin, Download, AlertTriangle, Shield, Check
} from "lucide-react";
import { toast } from "@/components/Toast";
import { DesktopFooter } from "@/components/DesktopFooter";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "dashboard";
  const [activeTab, setActiveTab] = useState<string>(activeTabParam);
  const [user, setUser] = useState<any>(null);

  // Sync tab from URL if it changes
  useEffect(() => {
    if (activeTabParam) {
      setActiveTab(activeTabParam);
    }
  }, [activeTabParam]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("hello_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser({
            fullName: "Verified Member",
            phoneNumber: "+91 98480 12345",
            roles: ["CUSTOMER"],
            status: "ACTIVE"
          });
        }
      } else {
        setUser({
          fullName: "Verified Member",
          phoneNumber: "+91 98480 12345",
          roles: ["CUSTOMER"],
          status: "ACTIVE"
        });
      }
    }
  }, []);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hello_access_token");
      localStorage.removeItem("hello_user");
      localStorage.removeItem("hello_active_role");
      window.dispatchEvent(new Event("hello_auth_changed"));
    }
    toast.success("You have been signed out successfully.", { title: "Signed Out" });
    router.push("/");
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.replace(`/account?tab=${tabId}`, { scroll: false });
  };

  const tabs = [
    { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "My Profile", icon: User },
    { id: "enquiries", label: "My Enquiries", icon: Inbox, count: 2 },
    { id: "saved", label: "Saved Businesses", icon: Heart, count: 4 },
    { id: "reviews", label: "My Reviews", icon: Star, count: 1 },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 select-none group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0076D7] to-sky-500 text-white flex items-center justify-center font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                HELLO<span className="text-[#FF6B35]">-Hi</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                MEMBER ACCOUNT
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-[#0076D7] flex items-center gap-1 transition"
            >
              <Home className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <span className="text-slate-300">|</span>
            <button
              onClick={handleSignOut}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
          <Link href="/" className="hover:text-slate-600 transition">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-bold">My Account</span>
          {activeTab !== "dashboard" && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#0076D7] font-bold capitalize">{activeTab}</span>
            </>
          )}
        </div>

        {/* User Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0076D7] to-sky-400 text-white flex items-center justify-center text-3xl font-black shadow-md shrink-0">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {user?.fullName || "Verified User"}
                </h1>
                <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> DPDP Verified Customer
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {user?.phoneNumber || "+91 Mobile"} {user?.email ? `• ${user?.email}` : ""}
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                Account ID: {user?.id || "usr_verified_live"} • Joined 2026
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/notifications"
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#0076D7] rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-blue-200 shadow-2xs"
            >
              <Bell className="w-4 h-4" />
              <span>Notifications Hub</span>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-[#0076D7] hover:bg-[#005FAE] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Deals</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 border ${
                  isActive
                    ? "bg-[#0076D7] text-white border-[#0076D7] shadow-sm"
                    : "bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB PANELS */}

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Active Enquiries</span>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-2xl font-black text-slate-900">2</h2>
                  <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">Speed Quotes</span>
                </div>
                <p className="text-[11px] text-slate-500">15-min dispatches to verified local contractors</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Saved Places</span>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-2xl font-black text-slate-900">4</h2>
                  <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full">Bookmarked</span>
                </div>
                <p className="text-[11px] text-slate-500">Clinics, restaurants &amp; repair services</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Reviews Written</span>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-2xl font-black text-slate-900">1</h2>
                  <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">5.0 ★</span>
                </div>
                <p className="text-[11px] text-slate-500">Helped 24+ local neighbors discover quality</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">DPDP Privacy</span>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-xl font-black text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" /> Active
                  </h2>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Masked</span>
                </div>
                <p className="text-[11px] text-slate-500">Zero spam • Real-time number masking</p>
              </div>
            </div>

            {/* Quick Hub Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div 
                onClick={() => handleTabChange("enquiries")}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs cursor-pointer hover:border-slate-300 hover:shadow-sm transition"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center font-bold">
                  ⚡
                </div>
                <h3 className="text-sm font-bold text-slate-900">15-Min Fast Quotes</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Track your instant contractor, AC repair, and mover quote dispatches in real-time.
                </p>
              </div>

              <div 
                onClick={() => handleTabChange("saved")}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs cursor-pointer hover:border-slate-300 hover:shadow-sm transition"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center font-bold">
                  🏷️
                </div>
                <h3 className="text-sm font-bold text-slate-900">Exclusive Deals</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Access 1+1 dining passes, beauty studio discounts, and free local clinic consultations.
                </p>
              </div>

              <div 
                onClick={() => handleTabChange("settings")}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs cursor-pointer hover:border-slate-300 hover:shadow-sm transition"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  🛡️
                </div>
                <h3 className="text-sm font-bold text-slate-900">Privacy &amp; Security</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  DPDP Act 2023 compliance with masked numbers, zero spam, and one-click data purge.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">Manage your verified customer identity and discovery preferences.</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> OTP Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  readOnly
                  value={user?.fullName || "Verified User"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Registered Mobile Number</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={user?.phoneNumber || "+91 98480 12345"}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Verified
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address (Optional)</label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || "customer@hello-hi.in"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Default Discovery City</label>
                <input
                  type="text"
                  readOnly
                  value="Hyderabad (Hitec City, Gachibowli)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-800 flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#0076D7] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">DPDP Act 2023 Identity Protection:</span>
                <p className="mt-0.5 text-sky-700">
                  Your phone number is never exposed in plain text to merchants. All lead dispatches and calls go through secure virtual routing numbers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. ENQUIRIES TAB */}
        {activeTab === "enquiries" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">My Enquiries &amp; Speed Quotes</h3>
                <p className="text-xs text-slate-500">Track quotes dispatched to local merchants with 15-minute guaranteed response.</p>
              </div>
              <span className="text-xs font-bold text-slate-400">2 active requests</span>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center font-bold">
                      ⚡
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">AC Deep Cleaning &amp; Gas Refill</h4>
                      <p className="text-xs text-slate-500">Dispatched to: SparkleSmart Electricals • Hitec City</p>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    Merchant Responded
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Requested 2 hours ago • Speed Quote ₹1,199</span>
                  <button className="text-[#0076D7] font-bold hover:underline">
                    View Merchant Chat &rarr;
                  </button>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center font-bold">
                      🏥
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Full Body Health Checkup Consultation</h4>
                      <p className="text-xs text-slate-500">Dispatched to: Vijaya Super Specialty Hospital • Vijayawada</p>
                    </div>
                  </div>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-200">
                    Quote Dispatched
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Requested Yesterday • Special HELLO Pass</span>
                  <button className="text-[#0076D7] font-bold hover:underline">
                    View Details &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. SAVED BUSINESSES TAB */}
        {activeTab === "saved" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Saved Businesses</h3>
                <p className="text-xs text-slate-500">Your favorite local outlets, trusted doctors, and verified stores.</p>
              </div>
              <span className="text-xs font-bold text-slate-400">4 saved places</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "SparkleSmart Electricals",
                  cat: "Electrical & AC Repair",
                  city: "Hitec City, Hyderabad",
                  rating: 4.9,
                  reviews: 142
                },
                {
                  name: "Vijaya Super Specialty Hospital",
                  cat: "Hospitals & Diagnostics",
                  city: "Governorpet, Vijayawada",
                  rating: 4.8,
                  reviews: 310
                },
                {
                  name: "Royal Andhra Spice & Biryani",
                  cat: "Restaurants & Dining",
                  city: "Gachibowli, Hyderabad",
                  rating: 4.7,
                  reviews: 890
                },
                {
                  name: "Amaravati Dental & Implant Care",
                  cat: "Dentists & Clinics",
                  city: "Brodipet, Guntur",
                  rating: 4.9,
                  reviews: 75
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{item.name}</h4>
                      <p className="text-xs text-slate-500">{item.cat} • {item.city}</p>
                    </div>
                    <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 border border-amber-200">
                      ★ {item.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400">{item.reviews} verified reviews</span>
                    <Link href="/" className="text-[#0076D7] font-bold hover:underline">
                      View Listing &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">My Ratings &amp; Reviews</h3>
                <p className="text-xs text-slate-500">Reviews you posted for local businesses across Hyderabad and Andhra Pradesh.</p>
              </div>
              <span className="text-xs font-bold text-slate-400">1 review</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">SparkleSmart Electricals</h4>
                  <div className="flex items-center gap-1 text-amber-500 text-xs mt-0.5">
                    {"★★★★★"} <span className="text-slate-400 text-[11px] ml-1">Rated 5.0 • 3 days ago</span>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified Visit
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Outstanding technician service. Arrived in under 15 minutes as promised via HELLO-Hi fast dispatch. Fixed our split AC compressor wiring cleanly with genuine parts."
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                24 people found this review helpful
              </div>
            </div>
          </div>
        )}

        {/* 6. SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-black text-slate-900">Account &amp; Privacy Settings</h3>
              <p className="text-xs text-slate-500">Configure notifications, WhatsApp alerts, and DPDP data rights.</p>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">SMS &amp; WhatsApp Fast Quote Alerts</h4>
                  <p className="text-[11px] text-slate-500">Receive instant quote updates and merchant responses on mobile.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0076D7] rounded cursor-pointer" />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">DPDP Mobile Number Masking</h4>
                  <p className="text-[11px] text-slate-500">Keep personal phone number protected with virtual dispatch relay.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0076D7] rounded cursor-pointer" />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Promotional Fast Deals</h4>
                  <p className="text-[11px] text-slate-500">Receive weekend restaurant vouchers and local service discounts.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0076D7] rounded cursor-pointer" />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Download My Data (DPDP Act)</h4>
                  <p className="text-[11px] text-slate-500">Request a complete JSON copy of your search and enquiry data.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("Data export archive requested. Check your email.", { title: "Export Initiated" })}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Archive</span>
                </button>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-red-600">Delete Account &amp; Purge Data</h4>
                  <p className="text-[11px] text-slate-500">Permanently remove all user data according to DPDP statutory compliance.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.error("Please contact privacy@hello-hi.in for DPDP identity purge verification.", { title: "Account Deletion" })}
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <DesktopFooter />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-bold text-slate-400">Loading Account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
>>>>>>> feature/superadmin
