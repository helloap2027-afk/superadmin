"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  Building2,
  Users,
  ShieldCheck,
  Tag,
  Inbox,
  CreditCard,
  Settings,
  LogOut,
  Search,
  Bell,
  HelpCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X
} from "lucide-react";
import { toast } from "@/components/Toast";
import { DesktopFooter } from "@/components/DesktopFooter";

const API_BASE = "http://localhost:4000/api/v1";

export default function MerchantDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [completion, setCompletion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showToastBanner, setShowToastBanner] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/merchant/profile`);
        const json = await res.json();
        if (json?.success && json.data) {
          setProfile(json.data);
          const comp = json.data.completion;
          setCompletion(comp);

          // If profile is incomplete, display the requested Profile Completion Toast!
          if (comp?.showReminder) {
            const dismissedRecently = sessionStorage.getItem("hello_merchant_toast_dismissed");
            if (!dismissedRecently) {
              setShowToastBanner(true);
              toast.brand("Complete Your Merchant Profile: Add your personal details, business info, and verification documents.", {
                id: "toast_merchant_profile_completion",
                title: "Complete Your Merchant Profile",
                duration: 6000,
              });
            }
          }
        }
      } catch (err) {
        console.error("Dashboard profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleDismissBanner = () => {
    setShowToastBanner(false);
    sessionStorage.setItem("hello_merchant_toast_dismissed", "true");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 select-none group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-orange-500 text-white flex items-center justify-center font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tight text-slate-900">
                HELLO<span className="text-[#FF6B35]">-Hi</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-1">
                Merchant Partner Dashboard
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/vendor/profile"
              className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Merchant Profile &amp; KYC</span>
            </Link>
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-[#0076D7] transition hidden sm:inline"
            >
              Exit to Customer
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        
        {/* PROFILE COMPLETION TOAST / BANNER */}
        {showToastBanner && completion && (
          <div className="bg-gradient-to-r from-[#0B1220] via-slate-900 to-[#0A2540] border border-blue-500/30 text-white p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            
            <div className="flex items-start gap-3.5 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B35] to-orange-400 text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white tracking-tight">
                    Complete Your Merchant Profile
                  </h4>
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {completion.percentage}% Complete
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  Add your personal details, business information, and verification documents to complete your profile and build customer trust.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={handleDismissBanner}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition"
              >
                Later
              </button>
              <Link
                href="/vendor/profile"
                className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20 hover:scale-105"
              >
                <span>Update Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Live Quotes</span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-black text-slate-900">14</h2>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">+4 today</span>
            </div>
            <p className="text-[11px] text-slate-500">15-minute speed dispatched customer requests</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Verified Listing</span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-black text-slate-900">
                {profile?.business?.name || "Free Listing"}
              </h2>
              {profile?.business?.isVerified ? (
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Active
                </span>
              ) : (
                <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> In Review
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {profile?.business?.categoryName || "Local Services"} • {profile?.business?.cityName || "Hyderabad"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Rating &amp; Trust</span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-black text-slate-900">4.9 ★</h2>
              <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">Top Ranked</span>
            </div>
            <p className="text-[11px] text-slate-500">Customer feedback and verified reviews</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-2xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">KYC Verification</span>
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-black text-slate-900">
                {completion?.isVerified ? "Verified" : completion?.kycStatus || "Pending"}
              </h2>
              <Link
                href="/vendor/profile"
                className="text-xs text-[#0076D7] font-bold hover:underline flex items-center gap-1"
              >
                Manage →
              </Link>
            </div>
            <p className="text-[11px] text-slate-500">Statutory business registration dossier</p>
          </div>
        </div>

        {/* SECTION: My Businesses */}
        <div id="businesses" className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">My Registered Businesses</h3>
                <p className="text-[11px] text-slate-500">Manage outlets, business hours, and discoverability settings</p>
              </div>
            </div>
            <Link
              href="/vendor/profile"
              className="text-xs font-bold text-[#0076D7] hover:underline flex items-center gap-1"
            >
              <span>Edit Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-slate-900">
                  {profile?.business?.name || "SparkleSmart Electricals & AC Services"}
                </h4>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active Verified Listing
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {profile?.business?.categoryName || "Electrical & AC Repair"} • {profile?.business?.cityName || "Hyderabad"}, {profile?.business?.localityName || "Hitec City"}
              </p>
              <p className="text-[11px] text-slate-400">
                Contact: {profile?.personal?.phoneNumber || "+91 98480 12345"}
              </p>
            </div>
            <Link
              href="/vendor/profile#kyc"
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition shadow-2xs"
            >
              KYC Dossier
            </Link>
          </div>
        </div>

        {/* SECTION: Enquiries & Leads */}
        <div id="leads" className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center font-bold">
                <Inbox className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Enquiries &amp; Customer Speed Leads</h3>
                <p className="text-[11px] text-slate-500">Real-time quote dispatches requiring your response within 15 minutes</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ● Live Radar Active
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900">AC Deep Cleaning (Split 1.5T)</span>
                  <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    Awaiting Callback
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Customer: +91 98480 •••45 • Hitec City, Hyderabad
                </p>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Dispatched 12 mins ago • SLA 15 mins
                </div>
              </div>
              <button 
                type="button"
                onClick={() => toast.success("Connecting secure virtual call to customer...", { title: "Call Dispatch" })}
                className="px-4 py-2 bg-[#0076D7] hover:bg-[#005FAE] text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Call Customer
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0076D7] flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Merchant Profile Management</h3>
              <p className="text-xs text-slate-500">
                Update owner identity, shop address, GST/MSME proof, and FSSAI/Drug category licenses.
              </p>
            </div>
          </div>
          <Link
            href="/vendor/profile"
            className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs shrink-0"
          >
            <span>Open Merchant Profile</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      <DesktopFooter />
    </div>
  );
}

