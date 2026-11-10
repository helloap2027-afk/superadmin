"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Store,
  Users,
  CreditCard,
  TrendingUp,
  Megaphone,
  Wallet,
  ShieldCheck,
  Zap,
  X,
  Ticket,
  BarChart3,
  ArrowRight,
  Flame,
} from "lucide-react";
import { DesktopHeader } from "@/components/DesktopHeader";
import { SupportTicketModal } from "@/components/help/SupportTicketModal";

const API_BASE = "http://localhost:4000/api/v1";

// ─── Static Partner Help Topics (matches your design) ──────────────────────
const PARTNER_HELP_TOPICS = [
  {
    id: "registration",
    icon: FileText,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    title: "Business Registration & Verification",
    description: "Register your business, complete KYC, and get verified",
    slug: "business-registration",
  },
  {
    id: "listing",
    icon: Store,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    title: "Listing & Profile Management",
    description: "Add, update, and manage your business listing",
    slug: "listing-profile",
  },
  {
    id: "enquiries",
    icon: Users,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    title: "Enquiries & Leads",
    description: "Receive, track, and manage customer enquiries",
    slug: "enquiries-leads",
  },
  {
    id: "plans",
    icon: CreditCard,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    title: "Plans & Subscriptions",
    description: "View, purchase, renew, and upgrade your plan",
    slug: "plans-subscriptions",
  },
  {
    id: "wallet",
    icon: Wallet,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    title: "Wallet & Settlements",
    description: "Check earnings, transaction history, and settle payments",
    slug: "wallet-settlements",
  },
  {
    id: "ads",
    icon: Megaphone,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
    title: "Advertisements & Offers",
    description: "Promote your business with ads, campaigns, and coupons",
    slug: "advertisements-offers",
  },
  {
    id: "performance",
    icon: BarChart3,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    title: "Performance & Reports",
    description: "Track leads, bookings, views, and business growth",
    slug: "performance-reports",
  },
  {
    id: "team",
    icon: Users,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    title: "Team & Access Management",
    description: "Add staff, manage roles, and control access",
    slug: "team-access",
  },
];

// ─── Popular Partner Articles ───────────────────────────────────────────────
const POPULAR_PARTNER_ARTICLES = [
  { id: 1, title: "How to register and verify my business on HELLO-Hi?", slug: "register-verify-business" },
  { id: 2, title: "How to add or update my business listing?", slug: "add-update-listing" },
  { id: 3, title: "How to receive and manage leads?", slug: "receive-manage-leads" },
  { id: 4, title: "How to purchase or renew a subscription plan?", slug: "purchase-renew-plan" },
  { id: 5, title: "How to add team members and manage access?", slug: "add-team-members" },
];

// ─── Trust Badges ───────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: ShieldCheck, color: "text-green-600", label: "Secure & Trusted", sub: "Your business data is safe" },
  { icon: Zap, color: "text-yellow-500", label: "Quick Response", sub: "Get help when you need it" },
  { icon: Phone, color: "text-blue-600", label: "24×7 Partner Support", sub: "Dedicated support for partners" },
  { icon: TrendingUp, color: "text-purple-600", label: "Grow Your Business", sub: "Tips, guides, and best practices" },
];

export default function VendorSupportPage() {
  const router = useRouter();

  // ─── Header State ────────────────────────────────────────────────────────
  const [selectedCity, setSelectedCity] = useState<"Hyderabad" | "Vijayawada" | "Guntur">("Hyderabad");
  const [selectedLocality, setSelectedLocality] = useState<string | null>("Hitec City");
  const [headerSearch, setHeaderSearch] = useState("");

  // ─── Auth State ──────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);

  // ─── Search State ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // ─── Support Ticket Modal ────────────────────────────────────────────────
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // ─── API Data ────────────────────────────────────────────────────────────
  const [popularArticles, setPopularArticles] = useState<any[]>([]);
  const [supportChannels, setSupportChannels] = useState<any[]>([]);

  // ─── Session Sync ────────────────────────────────────────────────────────
  const syncSession = () => {
    if (typeof window === "undefined") return;
    try {
      const token = localStorage.getItem("hello_access_token");
      const userStr = localStorage.getItem("hello_user");
      if (token && userStr) {
        const u = JSON.parse(userStr);
        setIsLoggedIn(true);
        setSessionUser(u);
      } else {
        setIsLoggedIn(false);
        setSessionUser(null);
      }
    } catch {
      setIsLoggedIn(false);
      setSessionUser(null);
    }
  };

  useEffect(() => {
    syncSession();
    window.addEventListener("hello_auth_changed", syncSession);
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener("hello_auth_changed", syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  // ─── Fetch API Data ──────────────────────────────────────────────────────
  useEffect(() => {
    // Fetch overview for BUSINESS_PARTNER
    fetch(`${API_BASE}/help-center/overview?audience=BUSINESS_PARTNER`, {
      headers: { "x-active-role": "MERCHANT" },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          if (json.data.popularArticles?.length) setPopularArticles(json.data.popularArticles);
          if (json.data.supportChannels?.length) setSupportChannels(json.data.supportChannels);
        }
      })
      .catch(() => {});
  }, []);

  // ─── Live Search ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsSearching(true);
      fetch(`${API_BASE}/help-center/search?q=${encodeURIComponent(searchQuery.trim())}&audience=BUSINESS_PARTNER`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data) {
            setSearchResults(json.data);
            setShowSearchDropdown(true);
          }
        })
        .catch(() => {})
        .finally(() => setIsSearching(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ─── Close Search Dropdown on Outside Click ───────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Derived Values ──────────────────────────────────────────────────────
  const userFirstName = sessionUser?.fullName
    ? sessionUser.fullName.split(" ")[0]
    : "there";

  const partnerBusinessName =
    sessionUser?.businessName ||
    sessionUser?.businesses?.[0]?.name ||
    sessionUser?.ownedBusinesses?.[0]?.name ||
    "Vinod Mobile Hub";

  const callChannel = supportChannels.find((c) => c.channelType === "CALL")?.value || "+91 80 4710 0727";
  const whatsappChannel = supportChannels.find((c) => c.channelType === "WHATSAPP")?.value || "+91 80 4710 0727";
  const emailChannel =
    supportChannels.find((c) => c.channelType === "EMAIL" && c.audience === "BUSINESS_PARTNER")?.value ||
    "partner@hello-hi.in";

  // Use API articles if available, else fall back to static
  const displayArticles = popularArticles.length > 0 ? popularArticles.slice(0, 5) : POPULAR_PARTNER_ARTICLES;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <DesktopHeader
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        selectedLocality={selectedLocality}
        onSelectLocality={setSelectedLocality}
        selectedCategory={null}
        onSelectCategory={() => {}}
        searchQuery={headerSearch}
        onSearchChange={setHeaderSearch}
        onOpenAddBusiness={() => router.push("/login?mode=register&role=PARTNER")}
        onOpenLogin={() => router.push("/login")}
        isLoggedIn={isLoggedIn}
        userName={isLoggedIn ? partnerBusinessName : undefined}
      />

      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">

        {/* ══════════════════════════════════════════════════════════════════
            HERO BANNER — Business Partner Help Center
        ══════════════════════════════════════════════════════════════════ */}
        <div className="relative bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-blue-100 rounded-3xl overflow-hidden shadow-sm">

          {/* Background decorative circles */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-100/40 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-sky-100/50 rounded-full pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between px-8 sm:px-12 py-8 sm:py-10 gap-6">

            {/* Left illustration — Business Person */}
            <div className="hidden lg:flex flex-col items-center justify-end shrink-0 w-44">
              <div className="relative">
                {/* Person silhouette */}
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-100 to-sky-200 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 120 120" className="w-28 h-28" fill="none">
                    {/* Head */}
                    <circle cx="60" cy="32" r="18" fill="#FBBF24" />
                    {/* Hair */}
                    <ellipse cx="60" cy="18" rx="18" ry="8" fill="#1E3A5F" />
                    {/* Body - apron/uniform */}
                    <rect x="34" y="52" width="52" height="48" rx="8" fill="#1E3A5F" />
                    {/* White collar */}
                    <rect x="52" y="52" width="16" height="8" rx="2" fill="white" />
                    {/* HELLO-Hi badge */}
                    <rect x="40" y="64" width="28" height="12" rx="3" fill="#0076D7" />
                    <text x="54" y="74" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">HELLO-Hi</text>
                    {/* Arms */}
                    <rect x="18" y="54" width="16" height="36" rx="6" fill="#1E3A5F" />
                    <rect x="86" y="54" width="16" height="36" rx="6" fill="#1E3A5F" />
                    {/* Hands */}
                    <circle cx="26" cy="93" r="8" fill="#FBBF24" />
                    <circle cx="94" cy="93" r="8" fill="#FBBF24" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Center — Main Content */}
            <div className="flex-1 text-center space-y-4 max-w-2xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-1.5 shadow-sm">
                <Store className="w-4 h-4 text-[#0076D7]" />
                <span className="text-xs font-bold text-[#0076D7] tracking-wide">Help Center – Business Partner</span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {isLoggedIn ? (
                  <>Hi {userFirstName}! How can we <span className="text-[#0076D7]">help you?</span></>
                ) : (
                  <>How can we <span className="text-[#0076D7]">help you?</span></>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Find guides, policies, and support for your business on HELLO-Hi.
              </p>

              {/* Search Bar */}
              <div ref={searchContainerRef} className="relative max-w-xl mx-auto pt-1">
                <div className="flex items-center bg-white border border-slate-200 rounded-full p-1.5 pl-5 shadow-md focus-within:border-[#0076D7] focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                    placeholder="Search for business help topics, registration, leads, plans, and more..."
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  {isSearching && (
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2" />
                  )}
                  <button
                    onClick={() => { if (searchQuery.trim().length >= 2) setShowSearchDropdown(true); }}
                    className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-sm transition shrink-0"
                  >
                    Search
                  </button>
                </div>

                {/* Autocomplete Dropdown */}
                {showSearchDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-left max-h-80 overflow-y-auto">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>Results ({searchResults.length})</span>
                      <button onClick={() => setShowSearchDropdown(false)}><X className="w-3.5 h-3.5" /></button>
                    </div>
                    {searchResults.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No guides found for &quot;{searchQuery}&quot;. Try registration, wallet, or leads.
                      </div>
                    ) : (
                      searchResults.map((result: any) => (
                        <Link
                          key={result.id}
                          href={`/help-center/articles/${result.slug}`}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 border-b border-slate-50 last:border-0 transition group"
                          onClick={() => setShowSearchDropdown(false)}
                        >
                          <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0 group-hover:text-[#0076D7]" />
                          <div>
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-[#0076D7] line-clamp-2">
                              {result.title}
                            </p>
                            {result.categoryName && (
                              <p className="text-[10px] text-slate-400 mt-0.5">{result.categoryName}</p>
                            )}
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right illustration — HELLO-Hi store */}
            <div className="hidden lg:flex flex-col items-center justify-center shrink-0 w-44">
              <div className="relative">
                {/* Store illustration */}
                <div className="w-36 h-36 bg-white rounded-2xl shadow-xl border border-blue-100 flex flex-col items-center justify-center overflow-hidden">
                  {/* Awning */}
                  <div className="w-full h-10 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <div className="text-white font-black text-xs tracking-tight">HELLO-Hi</div>
                  </div>
                  {/* Awning stripes */}
                  <div className="absolute top-0 left-0 right-0 h-10 flex">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`flex-1 ${i % 2 === 0 ? "bg-blue-600" : "bg-white/20"}`} />
                    ))}
                  </div>
                  {/* Store body */}
                  <div className="flex-1 w-full bg-blue-50 flex flex-col items-center justify-center gap-1 px-2 pb-2">
                    {/* Door */}
                    <div className="w-8 h-10 bg-white border-2 border-blue-200 rounded-t-lg flex items-center justify-center">
                      <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    </div>
                    {/* OPEN sign */}
                    <div className="bg-white border border-green-300 rounded px-1.5 py-0.5 text-[8px] font-bold text-green-600">
                      OPEN
                    </div>
                  </div>
                  {/* Growth arrow */}
                  <div className="absolute top-12 right-2 flex flex-col items-center">
                    <div className="w-12 h-8 relative">
                      <svg viewBox="0 0 48 32" fill="none" className="w-full h-full">
                        <polyline points="4,28 16,18 28,22 44,6" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="38,4 44,6 42,12" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            HELP TOPICS GRID — 8 Cards (2 rows × 4 cols)
        ══════════════════════════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-[#0076D7]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Business Partner Help Topics</h2>
              <p className="text-xs text-slate-500">Get the right support to register, manage, and grow your business on HELLO-Hi.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PARTNER_HELP_TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link
                  key={topic.id}
                  href={`/help-center/articles?category=${topic.slug}&audience=BUSINESS_PARTNER`}
                  className="group bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all duration-200 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 ${topic.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${topic.iconColor}`} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0076D7] transition-colors mt-0.5 shrink-0" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#0076D7] transition-colors leading-snug mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{topic.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            POPULAR ARTICLES + NEED MORE HELP (Side by Side)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Popular Partner Articles */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Flame className="w-5 h-5 text-orange-500" />
              <div>
                <h2 className="text-base font-black text-slate-900">Popular Partner Articles</h2>
                <p className="text-xs text-slate-500">Most viewed guides by business partners.</p>
              </div>
            </div>

            <div className="space-y-1">
              {displayArticles.map((article: any) => (
                <Link
                  key={article.id || article.slug}
                  href={`/help-center/articles/${article.slug}`}
                  className="flex items-center justify-between gap-3 py-3 px-2 rounded-xl hover:bg-blue-50 group transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-slate-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                      <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0076D7]" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 group-hover:text-[#0076D7] leading-snug transition-colors line-clamp-2">
                      {article.title}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0076D7] shrink-0 transition-colors" />
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link
                href="/help-center/articles?audience=BUSINESS_PARTNER"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0076D7] hover:text-[#005FAE] transition-colors"
              >
                View All Partner Articles
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Need More Help */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-base font-black text-slate-900">Need More Help?</h2>
                <p className="text-xs text-slate-500 mt-1">Our business partner support team is here for you 24×7.</p>
              </div>
              {/* Support agent illustration */}
              <div className="shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md relative">
                {/* Chat bubble */}
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow">
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                </div>
                <svg viewBox="0 0 80 80" className="w-14 h-14" fill="none">
                  {/* Head */}
                  <circle cx="40" cy="24" r="13" fill="#FBBF24" />
                  {/* Hair */}
                  <ellipse cx="40" cy="13" rx="13" ry="6" fill="#6D28D9" />
                  {/* Body */}
                  <rect x="22" y="38" width="36" height="30" rx="6" fill="#1E40AF" />
                  {/* Collar */}
                  <rect x="34" y="38" width="12" height="6" rx="2" fill="white" />
                  {/* Headset */}
                  <path d="M27 22 Q27 10 40 10 Q53 10 53 22" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <rect x="24" y="22" width="4" height="7" rx="2" fill="#374151" />
                  <rect x="52" y="22" width="4" height="7" rx="2" fill="#374151" />
                  {/* Arms */}
                  <rect x="10" y="40" width="12" height="24" rx="5" fill="#1E40AF" />
                  <rect x="58" y="40" width="12" height="24" rx="5" fill="#1E40AF" />
                </svg>
              </div>
            </div>

            {/* Contact Channels */}
            <div className="grid grid-cols-2 gap-3 flex-1 mt-2">

              {/* Call */}
              <a
                href={`tel:${callChannel.replace(/\s/g, "")}`}
                className="flex flex-col items-center gap-2 bg-green-50 hover:bg-green-100 border border-green-100 rounded-2xl p-4 transition group"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-800">Call Us</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{callChannel}</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${whatsappChannel.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 bg-green-50 hover:bg-green-100 border border-green-100 rounded-2xl p-4 transition group"
              >
                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-800">Chat on WhatsApp</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{whatsappChannel}</p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${emailChannel}`}
                className="flex flex-col items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-2xl p-4 transition group"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-800">Email Support</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{emailChannel}</p>
                </div>
              </a>

              {/* Raise a Ticket */}
              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="flex flex-col items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl p-4 transition group"
              >
                <div className="w-10 h-10 bg-[#0076D7] rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-[#0076D7]">Raise a Support Ticket</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">We'll respond within 2 hrs</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            TRUST BADGES — Bottom strip
        ══════════════════════════════════════════════════════════════════ */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="flex flex-col items-center text-center gap-2 px-6 py-5">
                  <Icon className={`w-7 h-7 ${badge.color}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{badge.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{badge.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* ── SUPPORT TICKET MODAL ─────────────────────────────────────────── */}
      {isTicketModalOpen && (
        <SupportTicketModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          audience="BUSINESS_PARTNER"
          defaultCategory="Business Partner Support"
        />
      )}

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-100 mt-6 py-6">
        <div className="max-w-[1360px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-bold text-[#0076D7]">
            <Store className="w-4 h-4" />
            HELLO-Hi Business Partner Support
          </div>
          <div className="flex items-center gap-6">
            <Link href="/help-center" className="hover:text-[#0076D7] transition-colors">Customer Help</Link>
            <Link href="/vendor/dashboard" className="hover:text-[#0076D7] transition-colors">Dashboard</Link>
            <Link href="/vendor/profile" className="hover:text-[#0076D7] transition-colors">My Profile</Link>
            <span>© 2025 HELLO-Hi. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
