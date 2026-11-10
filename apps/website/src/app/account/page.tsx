"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  User, Phone, Mail, ShieldCheck, LogOut, Building2, 
  Bell, ChevronRight, Home, Sparkles, CheckCircle2, Clock,
  LayoutDashboard, Inbox, Heart, Star, Settings, ExternalLink,
  Edit3, Trash2, MapPin, Download, AlertTriangle, Shield, Check,
  CalendarCheck, Wrench, Wallet, Gift, Headphones, HelpCircle,
  ArrowRight, Plus, RefreshCw
} from "lucide-react";
import { toast } from "@/components/Toast";
import { DesktopHeader } from "@/components/DesktopHeader";
import { DesktopFooter } from "@/components/DesktopFooter";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "dashboard";
  const [activeTab, setActiveTab] = useState<string>(activeTabParam);
  const [user, setUser] = useState<any>(null);

  // Dynamic user data & stats
  const [stats, setStats] = useState({
    totalBookings: 4,
    walletBalance: 100,
    referrals: 0,
    openTickets: 0
  });

  // Dynamic Notification Preferences State
  const [preferences, setPreferences] = useState<any[]>([]);
  const [loadingPrefs, setLoadingPrefs] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        setLoadingPrefs(true);
        const res = await fetch("http://localhost:4000/api/v1/notifications/preferences?role=customer");
        const json = await res.json();
        if (json.success && json.data?.preferences) {
          setPreferences(json.data.preferences);
        }
      } catch (e) {
        console.warn("Failed to load customer preferences:", e);
      } finally {
        setLoadingPrefs(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleTogglePref = (channel: string, category: string) => {
    if (category === "SECURITY") return;
    setPreferences((prev) =>
      prev.map((p) =>
        p.channel === channel && p.category === category ? { ...p, isEnabled: !p.isEnabled } : p
      )
    );
  };

  const handleSavePreferences = async () => {
    try {
      setSavingPrefs(true);
      const res = await fetch("http://localhost:4000/api/v1/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "usr_guest",
          role: "CUSTOMER",
          preferences,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Notification preferences saved successfully in MySQL!", { title: "Preferences Updated" });
      } else {
        toast.error("Failed to save preferences", { title: "Error" });
      }
    } catch {
      toast.error("Network error while saving preferences", { title: "Error" });
    } finally {
      setSavingPrefs(false);
    }
  };

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
            fullName: "Vinod Goexperts",
            phoneNumber: "6302759527",
            roles: ["CUSTOMER"],
            status: "ACTIVE"
          });
        }
      } else {
        setUser({
          fullName: "Vinod Goexperts",
          phoneNumber: "6302759527",
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

  const sidebarNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings", label: "My Bookings", icon: CalendarCheck },
    { id: "amc", label: "Book AMC Services", icon: Shield },
    { id: "profile", label: "Profile", icon: User },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "refer", label: "Refer & Earn", icon: Gift },
    { id: "support", label: "Support Tickets", icon: Headphones },
    { id: "delete-account", label: "Delete Account", icon: Trash2 },
  ];

  const displayName = user?.fullName || "Vinod Goexperts";
  const firstName = displayName.split(" ")[0] || "Vinod";
  const displayPhone = user?.phoneNumber || "6302759527";

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col justify-between">
      {/* Authoritative Homepage Header */}
      <DesktopHeader
        selectedCity="Hyderabad"
        onSelectCity={() => {}}
        selectedCategory={null}
        onSelectCategory={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
        onOpenAddBusiness={() => {}}
        onOpenLogin={() => {}}
        isLoggedIn={true}
        userName={displayName}
        onLogout={handleSignOut}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT SIDEBAR (Matching User's Reference Exact Design) */}
          <aside className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 shrink-0 flex flex-col justify-between min-h-[580px]">
            <div>
              {/* User Identity Header */}
              <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center text-lg font-black text-emerald-800 shrink-0 border-2 border-emerald-500 shadow-2xs">
                  {/* Avatar graphic fallback or user first letter */}
                  <span className="text-xl">🪔</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black text-slate-900 truncate leading-tight">
                    {displayName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {displayPhone}
                  </p>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1">
                {sidebarNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isDashboard = item.id === "dashboard";

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition select-none ${
                        isActive
                          ? "bg-[#06614C] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                        <span>{item.label}</span>
                      </div>
                      {isDashboard && isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Logout Action at Bottom */}
            <div className="pt-4 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* RIGHT CONTENT WORKSPACE */}
          <div className="flex-1 w-full min-w-0">
            {/* 1. DASHBOARD VIEW (Pixel Match to User's Uploaded Screenshot) */}
            {activeTab === "dashboard" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Greeting Banner */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Welcome back, {firstName}!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
                    Manage your bookings, wallet, referrals, and support requests from one place.
                  </p>
                </div>

                {/* 4 Metric Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Bookings */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      TOTAL BOOKINGS
                    </span>
                    <h2 className="text-3xl font-black text-[#06614C] mt-2">
                      {stats.totalBookings}
                    </h2>
                  </div>

                  {/* Wallet Balance */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      WALLET BALANCE
                    </span>
                    <h2 className="text-3xl font-black text-[#06614C] mt-2">
                      ₹{stats.walletBalance}
                    </h2>
                  </div>

                  {/* Referrals */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      REFERRALS
                    </span>
                    <h2 className="text-3xl font-black text-[#06614C] mt-2">
                      {stats.referrals}
                    </h2>
                  </div>

                  {/* Open Tickets */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      OPEN TICKETS
                    </span>
                    <h2 className="text-3xl font-black text-[#06614C] mt-2">
                      {stats.openTickets}
                    </h2>
                  </div>
                </div>

                {/* 2-Column Action Grid (Matching Reference Screenshot) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. My Bookings */}
                  <button
                    onClick={() => handleTabChange("bookings")}
                    className="w-full text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#06614C] flex items-center justify-center font-bold shrink-0">
                        <CalendarCheck className="w-5 h-5 text-[#06614C]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-[#06614C] transition">
                          My Bookings
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Track service orders
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                  </button>

                  {/* 2. Book AMC Services */}
                  <button
                    onClick={() => handleTabChange("amc")}
                    className="w-full text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#06614C] flex items-center justify-center font-bold shrink-0">
                        <Shield className="w-5 h-5 text-[#06614C]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-[#06614C] transition">
                          Book AMC Services
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Annual maintenance packages
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                  </button>

                  {/* 3. Profile */}
                  <button
                    onClick={() => handleTabChange("profile")}
                    className="w-full text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#06614C] flex items-center justify-center font-bold shrink-0">
                        <User className="w-5 h-5 text-[#06614C]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-[#06614C] transition">
                          Profile
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Update your details
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                  </button>

                  {/* 4. Wallet */}
                  <button
                    onClick={() => handleTabChange("wallet")}
                    className="w-full text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#06614C] flex items-center justify-center font-bold shrink-0">
                        <Wallet className="w-5 h-5 text-[#06614C]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-[#06614C] transition">
                          Wallet
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Balance &amp; transactions
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                  </button>

                  {/* 5. Refer & Earn */}
                  <button
                    onClick={() => handleTabChange("refer")}
                    className="w-full text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#06614C] flex items-center justify-center font-bold shrink-0">
                        <Gift className="w-5 h-5 text-[#06614C]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-[#06614C] transition">
                          Refer &amp; Earn
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Invite friends &amp; earn
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                  </button>

                  {/* 6. Support */}
                  <button
                    onClick={() => handleTabChange("support")}
                    className="w-full text-left bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#06614C] flex items-center justify-center font-bold shrink-0">
                        <Headphones className="w-5 h-5 text-[#06614C]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-[#06614C] transition">
                          Support
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Raise &amp; track tickets
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. MY BOOKINGS VIEW */}
            {activeTab === "bookings" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">My Bookings</h2>
                    <p className="text-xs text-slate-500 mt-1">Track your active and past home service bookings</p>
                  </div>
                  <span className="bg-emerald-50 text-[#06614C] text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                    4 Total Bookings
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "BKG-9842", service: "AC Deep Cleaning & Gas Refill", vendor: "SparkleSmart Electricals", status: "COMPLETED", date: "02 Nov 2026", amount: "₹1,299" },
                    { id: "BKG-9811", service: "Full Home Deep Sanitization", vendor: "CleanPro Services", status: "SCHEDULED", date: "10 Nov 2026", amount: "₹2,499" },
                    { id: "BKG-9750", service: "Washing Machine Drum Repair", vendor: "QuickFix Appliances", status: "IN_PROGRESS", date: "05 Nov 2026", amount: "₹750" },
                    { id: "BKG-9620", service: "Plumbing Leakage & Pipe Fitting", vendor: "Sri Balaji Plumbing", status: "COMPLETED", date: "28 Oct 2026", amount: "₹450" }
                  ].map((bkg) => (
                    <div key={bkg.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#06614C] flex items-center justify-center font-bold shrink-0 mt-0.5">
                          <CalendarCheck className="w-5 h-5 text-[#06614C]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-slate-900">{bkg.service}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                              {bkg.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">{bkg.vendor} • {bkg.date}</p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                        <span className="text-sm font-black text-slate-900">{bkg.amount}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          bkg.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" :
                          bkg.status === "SCHEDULED" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {bkg.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. BOOK AMC SERVICES VIEW */}
            {activeTab === "amc" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Book AMC Services</h2>
                    <p className="text-xs text-slate-500 mt-1">Annual Maintenance Contracts with zero breakdown guarantee</p>
                  </div>
                  <span className="bg-emerald-50 text-[#06614C] text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                    HELLO Assured
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Home AC Annual Plan", price: "₹2,499/yr", visits: "3 Services/year", features: ["Gas top-up discount", "Free emergency visit", "Certified technicians"] },
                    { title: "Complete Appliance Care", price: "₹4,999/yr", visits: "Covers 4 appliances", features: ["Fridge, AC, Washing Machine", "Free parts up to ₹1,500", "Priority dispatch"] },
                    { title: "Electrical & Plumbing AMC", price: "₹1,999/yr", visits: "Unlimited calls", features: ["Zero service visit fee", "Emergency 30-min response", "Standard warranty"] }
                  ].map((amc, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#06614C] flex items-center justify-center font-bold mb-3">
                          <Shield className="w-5 h-5 text-[#06614C]" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900">{amc.title}</h3>
                        <p className="text-xl font-black text-[#06614C] mt-1">{amc.price}</p>
                        <p className="text-xs text-slate-500 font-bold mt-0.5">{amc.visits}</p>
                        <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                          {amc.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.success(`Enquiry dispatched for ${amc.title}! Our team will contact you.`, { title: "AMC Request Sent" })}
                        className="w-full py-2.5 bg-[#06614C] hover:bg-[#054d3c] text-white text-xs font-bold rounded-xl transition"
                      >
                        Book Package Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PROFILE VIEW */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Profile Details</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Manage your personal information and verified identity</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Member
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      readOnly
                      value={displayName}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Mobile Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={displayPhone}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      readOnly
                      value={user?.email || "vinod@goexperts.in"}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Default City</label>
                    <input
                      type="text"
                      readOnly
                      value="Hyderabad (Hitec City)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 text-xs text-emerald-800 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#06614C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">DPDP Act 2023 Identity Protection:</span>
                    <p className="mt-0.5 text-emerald-700">
                      Your phone number is protected with encrypted tokenization. Service providers contact you securely without exposing your personal information.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. WALLET VIEW */}
            {activeTab === "wallet" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AVAILABLE BALANCE</span>
                    <h2 className="text-3xl font-black text-[#06614C] mt-1">₹{stats.walletBalance}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Use balance for instant bookings and platform discounts</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toast.success("Added ₹500 to wallet test sandbox!", { title: "Wallet Recharged" })}
                      className="px-4 py-2 bg-[#06614C] hover:bg-[#054d3c] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Money</span>
                    </button>
                  </div>
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-black text-slate-900">Recent Transactions</h3>
                  <div className="space-y-3">
                    {[
                      { desc: "Welcome Bonus Signup Reward", date: "07 Nov 2026", amount: "+₹100", type: "credit" },
                      { desc: "Cashback - AC Cleaning Booking", date: "02 Nov 2026", amount: "+₹50", type: "credit" },
                      { desc: "Discount Redeemed on Booking", date: "02 Nov 2026", amount: "-₹50", type: "debit" }
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{tx.desc}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{tx.date}</p>
                        </div>
                        <span className={`font-black ${tx.type === "credit" ? "text-emerald-600" : "text-slate-800"}`}>
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. REFER & EARN VIEW */}
            {activeTab === "refer" && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
                <div className="max-w-xl">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#06614C] flex items-center justify-center font-bold mb-4">
                    <Gift className="w-6 h-6 text-[#06614C]" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Refer Friends &amp; Earn ₹100</h2>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Share your unique referral link with neighbors, family, and colleagues. You both get ₹100 wallet credit on their first verified booking!
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-lg">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">YOUR REFERRAL CODE</span>
                    <p className="text-base font-black text-slate-900 font-mono tracking-wider mt-0.5">HELLO-VINOD-98</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== "undefined" && navigator.clipboard) {
                        navigator.clipboard.writeText("HELLO-VINOD-98");
                      }
                      toast.success("Referral code copied to clipboard!", { title: "Copied" });
                    }}
                    className="px-4 py-2 bg-[#06614C] hover:bg-[#054d3c] text-white rounded-xl text-xs font-bold transition shrink-0"
                  >
                    Copy Link
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-2xl font-black text-[#06614C]">0</span>
                    <p className="text-xs text-slate-500 font-bold mt-1">Friends Invited</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-2xl font-black text-[#06614C]">0</span>
                    <p className="text-xs text-slate-500 font-bold mt-1">Completed Bookings</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-2xl font-black text-[#06614C]">₹0</span>
                    <p className="text-xs text-slate-500 font-bold mt-1">Total Rewards Earned</p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SUPPORT TICKETS VIEW */}
            {activeTab === "support" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Support Tickets</h2>
                    <p className="text-xs text-slate-500 mt-1">Raise support inquiries and track dispute resolutions</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.success("Support ticket request initiated. Support team will respond shortly.", { title: "Ticket Created" })}
                    className="px-4 py-2 bg-[#06614C] hover:bg-[#054d3c] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Ticket</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#06614C] flex items-center justify-center mx-auto font-bold mb-3">
                    <CheckCircle2 className="w-7 h-7 text-[#06614C]" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">No Open Support Tickets</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    All your previous bookings and service requests are running smoothly. If you need any assistance, click Create Ticket above.
                  </p>
                </div>
              </div>
            )}

            {/* 8. DELETE ACCOUNT VIEW */}
            {activeTab === "delete-account" && (
              <div className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
                <div>
                  <h2 className="text-xl font-black text-rose-600">Delete Account &amp; Purge Data</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    According to the Digital Personal Data Protection (DPDP) Act 2023, you have the right to erase your identity.
                  </p>
                </div>

                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-800 space-y-2">
                  <p className="font-bold">Warning: This action is permanent and cannot be undone.</p>
                  <p className="text-rose-700 leading-relaxed">
                    Deleting your account will remove your profile details, booking history, wallet credits, and referral bonuses.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toast.error("Please contact privacy@hello-hi.in for DPDP identity purge verification.", { title: "Account Deletion" })}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Confirm Account Deletion</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </main>

      <DesktopFooter />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center text-xs font-bold text-slate-400">Loading Account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
