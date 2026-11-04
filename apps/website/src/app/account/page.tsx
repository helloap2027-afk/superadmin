"use client";

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
