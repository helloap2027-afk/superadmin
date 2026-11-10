"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronRight,
  User,
  Store,
  Phone,
  Mail,
  MessageSquare,
  Ticket,
  ShieldCheck,
  Zap,
  BookOpen,
  Award,
  FileText,
  ArrowRight,
  X,
  Lock,
  Headphones,
  Compass,
} from "lucide-react";
import { DesktopHeader } from "@/components/DesktopHeader";
import {
  CustomerHeroGraphic,
  MerchantHeroGraphic,
  CalendarHeroGraphic,
  StorefrontHeroGraphic,
  SupportRepGraphic,
} from "@/components/help/HelpIllustrations";
import { HelpCategoryIcon } from "@/components/help/HelpCategoryIcon";
import { SupportTicketModal } from "@/components/help/SupportTicketModal";

const API_BASE = "http://localhost:4000/api/v1";

export default function HelpCenterPage() {
  const router = useRouter();

  // City & Header State
  const [selectedCity, setSelectedCity] = useState<"Hyderabad" | "Vijayawada" | "Guntur">("Hyderabad");
  const [selectedLocality, setSelectedLocality] = useState<string | null>("Hitec City");
  const [headerSearch, setHeaderSearch] = useState<string>("");

  // Authenticated State & Active Role
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<"CUSTOMER" | "MERCHANT">("CUSTOMER");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  // Guest Role Exploration Filter: "CUSTOMER" | "BUSINESS_PARTNER" | null
  const [guestActiveSection, setGuestActiveSection] = useState<"CUSTOMER" | "BUSINESS_PARTNER" | null>(null);

  // Help Search & Suggestions
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic API Data
  const [overviewData, setOverviewData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Resolve Target Audience Mode:
  // 1. Not Logged In -> "GUEST"
  // 2. Logged In as Merchant -> "BUSINESS_PARTNER"
  // 3. Logged In as Customer -> "CUSTOMER"
  const currentAudience: "GUEST" | "CUSTOMER" | "BUSINESS_PARTNER" = !isLoggedIn
    ? "GUEST"
    : activeRole === "MERCHANT"
      ? "BUSINESS_PARTNER"
      : "CUSTOMER";

  // Sync authenticated user session
  const syncSession = () => {
    if (typeof window === "undefined") return;
    try {
      const token = localStorage.getItem("hello_access_token");
      const userStr = localStorage.getItem("hello_user");
      const savedRole = localStorage.getItem("hello_active_role");

      if (token && userStr) {
        const u = JSON.parse(userStr);
        setIsLoggedIn(true);
        setSessionUser(u);

        const roles: string[] = Array.isArray(u.roles) ? u.roles : [];
        const isMerchant =
          roles.includes("VENDOR_OWNER") ||
          roles.includes("VENDOR_STAFF") ||
          roles.includes("MERCHANT") ||
          (Array.isArray(u.businesses) && u.businesses.length > 0) ||
          (Array.isArray(u.ownedBusinesses) && u.ownedBusinesses.length > 0);

        if (savedRole === "MERCHANT" || (isMerchant && savedRole !== "CUSTOMER")) {
          setActiveRole("MERCHANT");
        } else {
          setActiveRole("CUSTOMER");
        }
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
    const handleAuthChange = () => syncSession();
    window.addEventListener("hello_auth_changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("hello_auth_changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Fetch role-appropriate Overview from Backend API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const audienceParam = currentAudience === "BUSINESS_PARTNER" ? "BUSINESS_PARTNER" : (currentAudience === "CUSTOMER" ? "CUSTOMER" : "GUEST");

    fetch(`${API_BASE}/help-center/overview?audience=${audienceParam}`, {
      headers: {
        "x-active-role": activeRole === "MERCHANT" ? "MERCHANT" : "CUSTOMER",
        ...(sessionUser?.id ? { "x-user-id": sessionUser.id } : {}),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && json.data) {
          setOverviewData(json.data);
        }
      })
      .catch(() => { })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentAudience, activeRole, sessionUser]);

  // Live Help Search against Real Database
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      const audParam = currentAudience === "GUEST" ? "ALL" : currentAudience;
      fetch(`${API_BASE}/help-center/search?q=${encodeURIComponent(searchQuery.trim())}&audience=${audParam}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setSearchResults(json.data);
            setShowSearchDropdown(true);
          }
        })
        .catch(() => { })
        .finally(() => setIsSearching(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, currentAudience]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Greeting & Display Name Resolution
  const userFirstName = sessionUser?.fullName
    ? sessionUser.fullName.split(" ")[0]
    : currentAudience === "BUSINESS_PARTNER"
      ? "Vinod"
      : "Ramesh";

  const partnerBusinessName =
    sessionUser?.businessName ||
    sessionUser?.businesses?.[0]?.name ||
    sessionUser?.ownedBusinesses?.[0]?.name ||
    "Vinod Mobile Hub";

  // Data Filtering
  const categoriesList: any[] = overviewData?.categories || [];
  const popularArticlesList: any[] = overviewData?.popularArticles || [];
  const supportChannelsList: any[] = overviewData?.supportChannels || [];

  const customerCategories = categoriesList.filter((c) => c.audience === "CUSTOMER");
  const partnerCategories = categoriesList.filter((c) => c.audience === "BUSINESS_PARTNER");

  // Phone, WhatsApp, and Email Channel Values from Database
  const callChannel = supportChannelsList.find((c) => c.channelType === "CALL")?.value || "+91 80 4710 0727";
  const whatsappChannel = supportChannelsList.find((c) => c.channelType === "WHATSAPP")?.value || "+91 80 4710 0727";
  const emailChannel =
    currentAudience === "BUSINESS_PARTNER"
      ? supportChannelsList.find((c) => c.channelType === "EMAIL" && c.audience === "BUSINESS_PARTNER")?.value || "partner@hello-hi.in"
      : supportChannelsList.find((c) => c.channelType === "EMAIL" && c.audience !== "BUSINESS_PARTNER")?.value || "support@hello-hi.in";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">

      {/* 1. OFFICIAL HELLO-HI HEADER (Guest vs Customer vs Business Partner) */}
      <DesktopHeader
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        selectedLocality={selectedLocality}
        onSelectLocality={setSelectedLocality}
        selectedCategory={null}
        onSelectCategory={() => { }}
        searchQuery={headerSearch}
        onSearchChange={setHeaderSearch}
        onOpenAddBusiness={() => router.push("/login?mode=register&role=PARTNER")}
        onOpenLogin={() => router.push("/login")}
        isLoggedIn={isLoggedIn}
        userName={currentAudience === "BUSINESS_PARTNER" ? partnerBusinessName : sessionUser?.fullName || "User"}
      />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">

        {/* =========================================================================
            2. HERO BANNERS (Exact Three Approved Designs)
            ========================================================================= */}

        {/* DESIGN A: GUEST HERO */}
        {currentAudience === "GUEST" && (
          <div className="bg-gradient-to-r from-blue-50/90 via-sky-50 to-blue-50/70 border border-blue-100 rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xs">
            {/* Left Graphic: Customer with Phone */}
            <div className="hidden lg:block absolute left-4 bottom-0 pointer-events-none">
              <CustomerHeroGraphic className="w-56 h-56" />
            </div>

            {/* Right Graphic: Merchant Partner */}
            <div className="hidden lg:block absolute right-4 bottom-0 pointer-events-none">
              <MerchantHeroGraphic className="w-56 h-56" />
            </div>

            {/* Central Content */}
            <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
              <span className="inline-block bg-blue-100 text-[#0076D7] font-extrabold text-xs px-4 py-1.5 rounded-full shadow-2xs">
                Help Center
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                How can we <span className="text-[#0076D7]">help you</span> today?
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
                Find answers, step-by-step guides, and support for all HELLO-Hi services.
              </p>

              {/* Big Search Input */}
              <div ref={searchContainerRef} className="relative max-w-xl mx-auto pt-2">
                <div className="flex items-center bg-white border border-slate-200 rounded-full p-1.5 pl-5 shadow-md focus-within:border-[#0076D7] focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                    placeholder="Search for topics like booking, registration, listing, payments..."
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (searchQuery.trim().length >= 2) setShowSearchDropdown(true);
                    }}
                    className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-xs transition shrink-0"
                  >
                    Search
                  </button>
                </div>

                {/* Autocomplete Results Dropdown */}
                {showSearchDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-left max-h-80 overflow-y-auto">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>Search Results ({searchResults.length})</span>
                      <button onClick={() => setShowSearchDropdown(false)}><X className="w-3.5 h-3.5" /></button>
                    </div>
                    {searchResults.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No guides found for &quot;{searchQuery}&quot;. Try booking, wallet, or registration.
                      </div>
                    ) : (
                      searchResults.map((item) => (
                        <Link
                          key={item.id}
                          href={`/help-center/articles/${item.slug}`}
                          className="p-3.5 hover:bg-slate-50 border-b border-slate-100 flex items-center justify-between transition block group"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#0076D7] block">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal truncate block max-w-md">
                              {item.summary}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0076D7] shrink-0 ml-2">
                            {item.categoryTitle}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Popular Query Chips */}
              <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2 text-xs">
                <span className="font-bold text-slate-500 text-[11px]">Popular:</span>
                {[
                  "Account & Login",
                  "Booking Help",
                  "Business Registration",
                  "Payments & Wallet",
                  "Plans & Subscriptions",
                ].map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(tag)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-[11px] font-medium shadow-2xs transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DESIGN B: CUSTOMER HERO (Logged In) */}
        {currentAudience === "CUSTOMER" && (
          <div className="bg-gradient-to-r from-blue-50/90 via-sky-50 to-blue-50/70 border border-blue-100 rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xs">
            {/* Left Graphic: Customer Visual */}
            <div className="hidden lg:block absolute left-6 bottom-0 pointer-events-none">
              <CustomerHeroGraphic className="w-56 h-56" />
            </div>

            {/* Right Graphic: Calendar 3D */}
            <div className="hidden lg:block absolute right-6 bottom-0 pointer-events-none">
              <CalendarHeroGraphic className="w-56 h-56" />
            </div>

            <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
              <span className="inline-block bg-blue-100 text-[#0076D7] font-extrabold text-xs px-4 py-1.5 rounded-full shadow-2xs">
                👤 Help Center – Customer
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Hi {userFirstName}! How can we <span className="text-[#0076D7]">help you?</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
                Find answers, guides, and support for your bookings, payments, and more.
              </p>

              {/* Search Bar */}
              <div ref={searchContainerRef} className="relative max-w-xl mx-auto pt-2">
                <div className="flex items-center bg-white border border-slate-200 rounded-full p-1.5 pl-5 shadow-md focus-within:border-[#0076D7] focus-within:ring-2 focus-within:ring-blue-100 transition">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
                    placeholder="Search for help articles, booking issues, payments, refunds..."
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (searchQuery.trim().length >= 2) setShowSearchDropdown(true);
                    }}
                    className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-xs transition shrink-0"
                  >
                    Search
                  </button>
                </div>

                {showSearchDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-left max-h-80 overflow-y-auto">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>Customer Guides ({searchResults.length})</span>
                      <button onClick={() => setShowSearchDropdown(false)}><X className="w-3.5 h-3.5" /></button>
                    </div>
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/help-center/articles/${item.slug}`}
                        className="p-3.5 hover:bg-slate-50 border-b border-slate-100 flex items-center justify-between transition block group"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 group-hover:text-[#0076D7] block">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal truncate block max-w-md">
                            {item.summary}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0076D7] shrink-0 ml-2">
                          {item.categoryTitle}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DESIGN C: BUSINESS PARTNER HERO (Logged In) */}
        {currentAudience === "BUSINESS_PARTNER" && (
          <div className="bg-gradient-to-r from-blue-50/90 via-sky-50 to-blue-50/70 border border-blue-100 rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xs">
            {/* Left Graphic: Merchant in Apron */}
            <div className="hidden lg:block absolute left-6 bottom-0 pointer-events-none">
              <MerchantHeroGraphic className="w-56 h-56" />
            </div>

            {/* Right Graphic: 3D Storefront */}
            <div className="hidden lg:block absolute right-6 bottom-0 pointer-events-none">
              <StorefrontHeroGraphic className="w-56 h-56" />
            </div>

            <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
              <span className="inline-block bg-blue-100 text-[#0076D7] font-extrabold text-xs px-4 py-1.5 rounded-full shadow-2xs">
                🏪 Help Center – Business Partner
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Hi {userFirstName}! How can we <span className="text-[#0076D7]">help you?</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
                Find guides, policies, and support for your business on HELLO-Hi.
              </p>

              {/* Search Bar */}
              <div ref={searchContainerRef} className="relative max-w-xl mx-auto pt-2">
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
                  <button
                    onClick={() => {
                      if (searchQuery.trim().length >= 2) setShowSearchDropdown(true);
                    }}
                    className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-xs transition shrink-0"
                  >
                    Search
                  </button>
                </div>

                {showSearchDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-left max-h-80 overflow-y-auto">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>Business Partner Guides ({searchResults.length})</span>
                      <button onClick={() => setShowSearchDropdown(false)}><X className="w-3.5 h-3.5" /></button>
                    </div>
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/help-center/articles/${item.slug}`}
                        className="p-3.5 hover:bg-slate-50 border-b border-slate-100 flex items-center justify-between transition block group"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 group-hover:text-[#0076D7] block">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal truncate block max-w-md">
                            {item.summary}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-[#FF6B35] shrink-0 ml-2">
                          {item.categoryTitle}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. TOPIC SECTIONS (Exact Approved Layouts)
            ========================================================================= */}

        {/* 3.1 GUEST MODE: ROLE CARDS & SIDE-BY-SIDE PANELS */}
        {currentAudience === "GUEST" && (
          <div className="space-y-10">

            {/* Get Help by Your Role */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 text-center tracking-tight">
                Get Help by Your Role
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* I'm a Customer Card */}
                <div
                  onClick={() => setGuestActiveSection("CUSTOMER")}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${guestActiveSection === "CUSTOMER"
                      ? "bg-blue-50/70 border-[#0076D7] shadow-sm ring-1 ring-[#0076D7]"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0076D7] flex items-center justify-center shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-[#0076D7] transition">
                        I&apos;m a <span className="text-[#0076D7]">Customer</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Help with booking services, payments, offers, and more.
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#0076D7] text-white flex items-center justify-center shrink-0 group-hover:translate-x-1 transition">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* I'm a Business Partner Card */}
                <div
                  onClick={() => setGuestActiveSection("BUSINESS_PARTNER")}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${guestActiveSection === "BUSINESS_PARTNER"
                      ? "bg-orange-50/70 border-[#FF6B35] shadow-sm ring-1 ring-[#FF6B35]"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF6B35] flex items-center justify-center shrink-0">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-[#FF6B35] transition">
                        I&apos;m a <span className="text-[#FF6B35]">Business Partner</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Help with registration, listings, leads, plans, and business growth.
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shrink-0 group-hover:translate-x-1 transition">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Side-by-Side Topics Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Left Column: Customer Help Topics */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Customer Help Topics
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Find help for booking, payments, account, and using HELLO-Hi services.
                    </p>
                  </div>
                </div>

                {/* 2x4 Grid of Customer Topics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {customerCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/help-center?category=${cat.slug}&audience=CUSTOMER`}
                      className="p-3.5 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-200 rounded-2xl flex flex-col items-center justify-center text-center transition group shadow-2xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-2 shadow-2xs group-hover:scale-105 transition">
                        <HelpCategoryIcon name={cat.icon || cat.title} className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#0076D7] transition leading-tight">
                        {cat.title}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => setGuestActiveSection("CUSTOMER")}
                    className="text-xs font-bold text-[#0076D7] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All Customer Help</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Business Partner Help Topics */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Business Partner Help Topics
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Get support for business registration, listings, leads, and growth.
                    </p>
                  </div>
                </div>

                {/* 2x4 Grid of Partner Topics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {partnerCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/help-center?category=${cat.slug}&audience=BUSINESS_PARTNER`}
                      className="p-3.5 bg-slate-50 hover:bg-orange-50/60 border border-slate-200/80 hover:border-orange-200 rounded-2xl flex flex-col items-center justify-center text-center transition group shadow-2xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-2 shadow-2xs group-hover:scale-105 transition">
                        <HelpCategoryIcon name={cat.icon || cat.title} className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#FF6B35] transition leading-tight">
                        {cat.title}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => setGuestActiveSection("BUSINESS_PARTNER")}
                    className="text-xs font-bold text-[#FF6B35] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All Business Partner Help</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 3.2 CUSTOMER MODE: 8 DETAILED TOPIC CARDS WITH SUBTITLES */}
        {currentAudience === "CUSTOMER" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Customer Help Topics
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Get quick help with your bookings, payments, account, and using HELLO-Hi services.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {customerCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/help-center?category=${cat.slug}`}
                  className="p-4 bg-white hover:bg-slate-50/80 border border-slate-200 rounded-2xl flex items-start justify-between transition group shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition">
                      <HelpCategoryIcon name={cat.icon || cat.title} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0076D7] transition leading-snug">
                        {cat.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-normal leading-tight mt-1">
                        {cat.subtitle || "Browse guides and answers"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0076D7] group-hover:translate-x-0.5 transition shrink-0 ml-1 mt-1" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 3.3 BUSINESS PARTNER MODE: 8 DETAILED TOPIC CARDS WITH SUBTITLES */}
        {currentAudience === "BUSINESS_PARTNER" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Business Partner Help Topics
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Get the right support to register, manage, and grow your business on HELLO-Hi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {partnerCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/help-center?category=${cat.slug}`}
                  className="p-4 bg-white hover:bg-slate-50/80 border border-slate-200 rounded-2xl flex items-start justify-between transition group shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-orange-50 transition">
                      <HelpCategoryIcon name={cat.icon || cat.title} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#FF6B35] transition leading-snug">
                        {cat.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-normal leading-tight mt-1">
                        {cat.subtitle || "Browse partner guides and solutions"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF6B35] group-hover:translate-x-0.5 transition shrink-0 ml-1 mt-1" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            4. POPULAR ARTICLES & NEED MORE HELP SECTION
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (5 Cols): Popular Articles */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                <span>🔥</span>
                <span>
                  {currentAudience === "BUSINESS_PARTNER"
                    ? "Popular Partner Articles"
                    : currentAudience === "CUSTOMER"
                      ? "Popular Customer Articles"
                      : "Popular Help Articles"}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentAudience === "BUSINESS_PARTNER"
                  ? "Most viewed guides by business partners."
                  : currentAudience === "CUSTOMER"
                    ? "Most viewed help guides by our customers."
                    : "Most viewed guides by our users."}
              </p>
            </div>

            <div className="space-y-2.5">
              {popularArticlesList.slice(0, 5).map((art) => (
                <Link
                  key={art.id}
                  href={`/help-center/articles/${art.slug}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-[#0076D7] shrink-0" />
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#0076D7] truncate">
                      {art.title}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0076D7] group-hover:translate-x-0.5 transition shrink-0" />
                </Link>
              ))}
            </div>

            <div className="pt-2 text-center">
              <Link
                href={`/help-center/articles`}
                className="text-xs font-bold text-[#0076D7] hover:underline inline-flex items-center gap-1"
              >
                <span>
                  {currentAudience === "BUSINESS_PARTNER"
                    ? "View All Partner Articles"
                    : currentAudience === "CUSTOMER"
                      ? "View All Customer Articles"
                      : "View All Articles"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column (7 Cols): Need More Help Panel */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs relative overflow-hidden">

            {/* Header + Support Rep Illustration */}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-50 text-[#0076D7] rounded-lg">
                    <Headphones className="w-4 h-4" />
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    {currentAudience === "CUSTOMER" ? "Still Need Help?" : "Need More Help?"}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {currentAudience === "BUSINESS_PARTNER"
                    ? "Our business partner support team is here for you 24×7."
                    : "Our support team is here for you 24×7."}
                </p>
              </div>

              <div className="shrink-0 hidden sm:block">
                <SupportRepGraphic className="w-24 h-24" />
              </div>
            </div>

            {/* 4 Support Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* Call Us */}
              <a
                href={`tel:${callChannel.replace(/\s+/g, "")}`}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Call Us</span>
                  <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition">
                    {callChannel}
                  </span>
                </div>
              </a>

              {/* Chat on WhatsApp */}
              <a
                href={`https://wa.me/${whatsappChannel.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Chat on WhatsApp</span>
                  <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition">
                    {whatsappChannel}
                  </span>
                </div>
              </a>

              {/* Email Support */}
              <a
                href={`mailto:${emailChannel}`}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Email Support</span>
                  <span className="text-xs font-black text-slate-900 group-hover:text-[#0076D7] transition">
                    {emailChannel}
                  </span>
                </div>
              </a>

              {/* Raise a Support Ticket */}
              <button
                type="button"
                onClick={() => setIsTicketModalOpen(true)}
                className="p-3.5 rounded-2xl border border-[#0076D7] bg-white hover:bg-blue-50/50 text-[#0076D7] transition flex items-center justify-center gap-2 font-bold text-xs shadow-2xs group"
              >
                <Ticket className="w-5 h-5 text-[#0076D7]" />
                <span>Raise a Support Ticket</span>
              </button>

            </div>

          </div>

        </div>

        {/* =========================================================================
            5. TRUST & ASSISTANCE STRIP (Exact Approved 5 Items)
            ========================================================================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-slate-100">

            {/* 1. Secure & Trusted */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Secure &amp; Trusted</h4>
                <p className="text-[10px] text-slate-400">
                  {currentAudience === "BUSINESS_PARTNER" ? "Your business data is safe" : "Your data is safe with us"}
                </p>
              </div>
            </div>

            {/* 2. Quick Response */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Quick Response</h4>
                <p className="text-[10px] text-slate-400">Get help when you need it</p>
              </div>
            </div>

            {/* 3. 24×7 Support */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {currentAudience === "BUSINESS_PARTNER" ? "24×7 Partner Support" : "24×7 Support"}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {currentAudience === "BUSINESS_PARTNER" ? "Dedicated support for partners" : "Always here for you"}
                </p>
              </div>
            </div>

            {/* 4. Step-by-Step Guides */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {currentAudience === "BUSINESS_PARTNER" ? "Grow Your Business" : "Step-by-Step Guides"}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {currentAudience === "BUSINESS_PARTNER" ? "Tips, guides, and best practices" : "Easy to follow instructions"}
                </p>
              </div>
            </div>

            {/* 5. Customer & Partner Support */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Customer &amp; Partner</h4>
                <p className="text-[10px] text-slate-400">Support for everyone</p>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* 6. SUPPORT TICKET MODAL */}
      <SupportTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        audience={currentAudience}
      />

      {/* 7. WEBSITE FOOTER */}
      <footer className="bg-[#0B1220] text-slate-400 text-xs py-8 mt-12 border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-base">HELLO-Hi</span>
            <span>© 2026 HELLO-Hi Technologies India Pvt Ltd. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/terms-and-conditions" className="hover:text-white transition">Terms &amp; Conditions</Link>
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/help-center" className="text-white hover:underline transition">Help Center</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
