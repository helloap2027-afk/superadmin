"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Mic,
  Bell,
  ChevronRight,
  User,
  Store,
  Calendar,
  Wallet,
  CreditCard,
  Tag,
  RotateCcw,
  Smartphone,
  ShieldCheck,
  Building2,
  FileCheck2,
  Users2,
  Sparkles,
  PieChart,
  Lock,
  ArrowRight,
  Phone,
  MessageSquare,
  Mail,
  HelpCircle,
  FileText,
  CheckCircle2,
  X
} from "lucide-react";

interface MobileHelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  mode: "customer" | "vendor";
}

const API_BASE = "http://localhost:4000/api/v1";

export function MobileHelpCenterModal({
  isOpen,
  onClose,
  currentUser,
  mode
}: MobileHelpCenterProps) {
  // Determine role: GUEST vs CUSTOMER vs BUSINESS_PARTNER
  const isGuest = !currentUser;
  const isBusinessPartner = !isGuest && mode === "vendor";
  const isCustomer = !isGuest && mode === "customer";

  // Navigation within Help Center: null = home, string = article slug
  const [activeArticleSlug, setActiveArticleSlug] = useState<string | null>(null);
  const [activeArticle, setActiveArticle] = useState<any | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Dynamic Help Categories and Articles from DB
  const [categories, setCategories] = useState<any[]>([]);
  const [popularArticles, setPopularArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Guest role filter: null = all/both, "CUSTOMER", "BUSINESS_PARTNER"
  const [guestFilter, setGuestFilter] = useState<"ALL" | "CUSTOMER" | "BUSINESS_PARTNER">("ALL");

  // Mobile Ticket Creation & List View States
  const [viewTab, setViewTab] = useState<"HELP" | "NEW_TICKET" | "MY_TICKETS">("HELP");
  const [ticketCategory, setTicketCategory] = useState("General Support");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [ticketPriority, setTicketPriority] = useState<"LOW" | "NORMAL" | "HIGH" | "URGENT">("NORMAL");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccessRef, setTicketSuccessRef] = useState<string | null>(null);
  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [loadingUserTickets, setLoadingUserTickets] = useState(false);

  const fetchMobileUserTickets = async () => {
    if (!currentUser?.id) return;
    setLoadingUserTickets(true);
    try {
      const headers = {
        "x-user-id": currentUser.id,
        "x-user-role": mode === "vendor" ? "BUSINESS_PARTNER" : "CUSTOMER",
      };
      const res = await fetch(`${API_BASE}/support-tickets/my-tickets`, { headers });
      const data = await res.json();
      setUserTickets(Array.isArray(data?.data) ? data.data : []);
    } catch {
      // ignore
    } finally {
      setLoadingUserTickets(false);
    }
  };

  const handleMobileCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;

    setIsSubmittingTicket(true);
    try {
      const headers: any = { "Content-Type": "application/json" };
      if (currentUser?.id) {
        headers["x-user-id"] = currentUser.id;
        headers["x-user-role"] = mode === "vendor" ? "BUSINESS_PARTNER" : "CUSTOMER";
        headers["x-user-name"] = currentUser.fullName || "Mobile User";
      }

      let res = await fetch(`${API_BASE}/support-tickets`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          category: ticketCategory,
          subject: ticketSubject.trim(),
          description: ticketDesc.trim(),
          priority: ticketPriority,
          source: "MOBILE",
        }),
      });

      if (!res.ok) {
        res = await fetch(`${API_BASE}/help-center/tickets`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            category: ticketCategory,
            subject: ticketSubject.trim(),
            description: ticketDesc.trim(),
            priority: ticketPriority,
          }),
        });
      }

      const data = await res.json();
      const ticketRef = data?.ticket?.ticketNumber || data?.data?.ticketNumber;
      if (data?.success && ticketRef) {
        setTicketSuccessRef(ticketRef);
        setTicketSubject("");
        setTicketDesc("");
      }
    } catch {
      // ignore
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const currentAudience = isGuest
    ? (guestFilter === "ALL" ? "GUEST" : guestFilter)
    : (isBusinessPartner ? "BUSINESS_PARTNER" : "CUSTOMER");

  // Fetch dynamic categories and popular articles
  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);

    const aud = isGuest ? (guestFilter === "ALL" ? "GUEST" : guestFilter) : (isBusinessPartner ? "BUSINESS_PARTNER" : "CUSTOMER");

    Promise.all([
      fetch(`${API_BASE}/help-center/categories?audience=${aud}`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_BASE}/help-center/articles/popular?audience=${aud}&limit=6`).then(r => r.json()).catch(() => ({ data: [] }))
    ]).then(([catsRes, artsRes]) => {
      const catsList = Array.isArray(catsRes?.data) ? catsRes.data : Array.isArray(catsRes) ? catsRes : [];
      const artsList = Array.isArray(artsRes?.data) ? artsRes.data : Array.isArray(artsRes) ? artsRes : [];
      setCategories(catsList);
      setPopularArticles(artsList);
      setIsLoading(false);
    });
  }, [isOpen, isGuest, isBusinessPartner, isCustomer, guestFilter]);

  // Live Search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      const aud = isGuest ? "ALL" : (isBusinessPartner ? "BUSINESS_PARTNER" : "CUSTOMER");
      fetch(`${API_BASE}/help-center/search?q=${encodeURIComponent(searchQuery.trim())}&audience=${aud}`)
        .then(r => r.json())
        .then(data => {
          setSearchResults(data.articles || []);
          setIsSearching(false);
        })
        .catch(() => {
          setSearchResults([]);
          setIsSearching(false);
        });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, isGuest, isBusinessPartner]);

  // Load article detail if selected
  useEffect(() => {
    if (!activeArticleSlug) {
      setActiveArticle(null);
      return;
    }

    setArticleLoading(true);
    fetch(`${API_BASE}/help-center/articles/${activeArticleSlug}`)
      .then(r => r.json())
      .then(data => {
        setActiveArticle(data.article || null);
        setArticleLoading(false);
      })
      .catch(() => {
        setActiveArticle(null);
        setArticleLoading(false);
      });
  }, [activeArticleSlug]);

  if (!isOpen) return null;

  // Icon resolver
  const renderTopicIcon = (iconName: string, colorScheme?: string) => {
    switch (iconName) {
      case "User":
        return <User className="w-5 h-5 text-blue-600" />;
      case "Calendar":
        return <Calendar className="w-5 h-5 text-emerald-600" />;
      case "Wallet":
        return <Wallet className="w-5 h-5 text-emerald-600" />;
      case "CreditCard":
        return <CreditCard className="w-5 h-5 text-purple-600" />;
      case "Tag":
        return <Tag className="w-5 h-5 text-rose-500" />;
      case "RotateCcw":
        return <RotateCcw className="w-5 h-5 text-amber-600" />;
      case "Smartphone":
        return <Smartphone className="w-5 h-5 text-sky-600" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5 text-indigo-600" />;
      case "Building2":
        return <Building2 className="w-5 h-5 text-amber-600" />;
      case "Store":
        return <Store className="w-5 h-5 text-emerald-600" />;
      case "Users2":
        return <Users2 className="w-5 h-5 text-orange-600" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-rose-500" />;
      case "PieChart":
        return <PieChart className="w-5 h-5 text-indigo-600" />;
      default:
        return <HelpCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const displayName = currentUser?.fullName?.split(" ")[0] || (isBusinessPartner ? "Vinod" : "Ramesh");
  const avatarLetter = (currentUser?.fullName?.charAt(0) || (isBusinessPartner ? "V" : "R")).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col font-sans max-w-md mx-auto shadow-2xl overflow-hidden animate-in fade-in duration-200">
      
      {/* =========================================================================
          TOP MOBILE STATUS & APP BAR
          ========================================================================= */}
      <div className="bg-white border-b border-slate-100 px-4 pt-3 pb-2.5 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => {
            if (activeArticleSlug) {
              setActiveArticleSlug(null);
            } else {
              onClose();
            }
          }}
          className="p-1 rounded-full text-slate-700 hover:bg-slate-100 transition active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#0076D7] to-[#FF6B35] text-white font-black text-xs flex items-center justify-center shadow-xs">
            H
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-[#0076D7] tracking-tight leading-none">
              HELLO<span className="text-[#FF6B35]">-Hi</span>
            </span>
            <span className="text-[7px] text-slate-400 font-semibold tracking-wider uppercase">
              Help Center
            </span>
          </div>
        </div>

        {/* Right Action: Notification Bell or User Avatar */}
        <div className="flex items-center gap-2">
          <div className="relative p-1 text-slate-700">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white"></span>
          </div>

          {!isGuest && (
            <div
              className={`w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-xs ${
                isBusinessPartner
                  ? "bg-gradient-to-tr from-emerald-500 to-teal-600"
                  : "bg-gradient-to-tr from-emerald-500 to-green-600"
              }`}
            >
              {avatarLetter}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          BODY SCROLL AREA
          ========================================================================= */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

        {/* If viewing a single Article Detail */}
        {activeArticleSlug ? (
          <div className="space-y-4">
            <button
              onClick={() => setActiveArticleSlug(null)}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Help Center
            </button>

            {articleLoading ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-xs text-slate-500">Loading guide...</p>
              </div>
            ) : activeArticle ? (
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                  {activeArticle.category_name || "Help Guide"}
                </span>
                <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                  {activeArticle.title}
                </h2>
                <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed pt-2 border-t border-slate-100">
                  {activeArticle.content}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
                <p className="text-xs text-slate-500">Article could not be loaded.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* =========================================================================
                1. HERO SECTION (Guest vs Customer vs Business Partner)
                ========================================================================= */}
            {isGuest ? (
              /* GUEST HERO: Exact Reference Image 3 Left Mockup */
              <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50/50 rounded-2xl p-4 border border-blue-100 shadow-xs relative overflow-hidden">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/70 text-blue-700 mb-1">
                  Help Center
                </span>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                  How can we <span className="text-blue-600">help you</span> today?
                </h1>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
                  Find answers, guides, and support for all HELLO-Hi services.
                </p>

                {/* Search Bar with Mic */}
                <div className="relative mt-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search help articles, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Mic className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-blue-600" />
                </div>
              </div>
            ) : isCustomer ? (
              /* CUSTOMER HERO: Exact Reference Image 3 Center Mockup */
              <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100/40 rounded-2xl p-4 border border-blue-100 shadow-xs relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 mb-1">
                  <User className="w-3 h-3" /> Help Center – Customer
                </div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                  Hi {displayName}! How can we <span className="text-blue-600">help you?</span>
                </h1>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
                  Get help with your bookings, payments, account, and more.
                </p>

                {/* Search Bar */}
                <div className="relative mt-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search for customer help topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Mic className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-blue-600" />
                </div>
              </div>
            ) : (
              /* BUSINESS PARTNER HERO: Exact Reference Image 3 Right Mockup */
              <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-sky-50 rounded-2xl p-4 border border-amber-200/70 shadow-xs relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 mb-1">
                  <Store className="w-3 h-3" /> Help Center – Business Partner
                </div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                  Hi {displayName}! How can we <span className="text-[#0076D7]">help you?</span>
                </h1>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
                  Get support for your business registration, listings, leads, plans, and growth.
                </p>

                {/* Search Bar */}
                <div className="relative mt-3">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search for business help topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Mic className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-blue-600" />
                </div>
              </div>
            )}

            {/* Live Search Results Dropdown Overlay */}
            {searchQuery.trim().length >= 2 && (
              <div className="bg-white rounded-2xl border border-blue-200 shadow-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>Search Results ({searchResults.length})</span>
                  {isSearching && <span className="text-blue-600 animate-pulse">Searching...</span>}
                </div>
                {searchResults.length === 0 && !isSearching ? (
                  <p className="text-xs text-slate-400 py-2 text-center">No articles found matching "{searchQuery}"</p>
                ) : (
                  searchResults.slice(0, 5).map((res) => (
                    <button
                      key={res.id}
                      onClick={() => {
                        setActiveArticleSlug(res.slug);
                        setSearchQuery("");
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-blue-50/50 flex items-center justify-between group transition"
                    >
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">{res.title}</p>
                        <p className="text-[10px] text-slate-400">{res.category_name || "Guide"}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                    </button>
                  ))
                )}
              </div>
            )}

            {/* =========================================================================
                2. GUEST: CHOOSE YOUR HELP ROLE CARDS (Exact Left Mockup)
                ========================================================================= */}
            {isGuest && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Choose Your Help
                </h3>
                
                {/* Customer Role Card */}
                <div
                  onClick={() => setGuestFilter(guestFilter === "CUSTOMER" ? "ALL" : "CUSTOMER")}
                  className={`bg-white rounded-2xl p-3.5 border transition cursor-pointer flex items-center justify-between shadow-2xs ${
                    guestFilter === "CUSTOMER"
                      ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20"
                      : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">I'm a Customer</h4>
                      <p className="text-[10px] text-slate-500">
                        Help with bookings, payments, account, and more.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${guestFilter === "CUSTOMER" ? "rotate-90 text-blue-600" : ""}`} />
                </div>

                {/* Business Partner Role Card */}
                <div
                  onClick={() => setGuestFilter(guestFilter === "BUSINESS_PARTNER" ? "ALL" : "BUSINESS_PARTNER")}
                  className={`bg-white rounded-2xl p-3.5 border transition cursor-pointer flex items-center justify-between shadow-2xs ${
                    guestFilter === "BUSINESS_PARTNER"
                      ? "border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/20"
                      : "border-slate-200 hover:border-orange-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">I'm a Business Partner</h4>
                      <p className="text-[10px] text-slate-500">
                        Help with registration, listing, leads, plans, and business tools.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${guestFilter === "BUSINESS_PARTNER" ? "rotate-90 text-orange-600" : ""}`} />
                </div>
              </div>
            )}

            {/* =========================================================================
                3. CATEGORY TOPICS GRID (Exact 2x4 Grid on Customer & Partner Mockups)
                ========================================================================= */}
            {(!isGuest || guestFilter !== "ALL") && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-black text-slate-900">
                  {isBusinessPartner || guestFilter === "BUSINESS_PARTNER"
                    ? "Business Partner Help Topics"
                    : "Customer Help Topics"}
                </h3>

                {isLoading ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          // Quick search by category title
                          setSearchQuery(cat.title || cat.name);
                        }}
                        className="bg-white rounded-2xl p-3 border border-slate-200 hover:border-blue-300 hover:shadow-xs transition cursor-pointer flex flex-col items-center text-center justify-center space-y-1.5 min-h-[88px]"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                          {renderTopicIcon(cat.icon || "HelpCircle")}
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 leading-tight">
                          {cat.title || cat.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                4. POPULAR ARTICLES (Exact 3-item list on all 3 mockups)
                ========================================================================= */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 text-sm">🔥</span>
                <h3 className="text-xs font-black text-slate-900">
                  {isBusinessPartner ? "Popular Partner Articles" : "Popular Articles"}
                </h3>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
                {popularArticles.slice(0, 3).map((art) => (
                  <button
                    key={art.id}
                    onClick={() => setActiveArticleSlug(art.slug)}
                    className="w-full p-3 text-left flex items-center justify-between hover:bg-slate-50 transition group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-blue-600" />
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                        {art.title}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>

              {/* View All Articles Link */}
              <div className="text-center pt-1">
                <button
                  onClick={() => setSearchQuery("a")}
                  className="text-xs font-bold text-[#0076D7] hover:underline inline-flex items-center gap-1"
                >
                  {isBusinessPartner
                    ? "View All Partner Articles →"
                    : isCustomer
                    ? "View All Customer Articles →"
                    : "View All Articles →"}
                </button>
              </div>
            </div>

            {/* =========================================================================
                5. SUPPORT CONTACT QUICK ACTIONS
                ========================================================================= */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2.5 shadow-2xs">
              <h4 className="text-xs font-black text-slate-900">Need Immediate Help?</h4>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:+918047100727"
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-slate-700"
                >
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium">Call Us</p>
                    <p className="text-[11px] font-bold truncate">24x7 Support</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/918047100727"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 flex items-center gap-2 text-slate-700"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium">WhatsApp</p>
                    <p className="text-[11px] font-bold truncate">Chat Support</p>
                  </div>
                </a>
              </div>

              <button
                onClick={() => setViewTab("NEW_TICKET")}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Raise a Support Ticket</span>
              </button>
            </div>
          </>
        )}

        {/* =========================================================================
            6. SUB-VIEW: RAISE A SUPPORT TICKET
            ========================================================================= */}
        {viewTab === "NEW_TICKET" && (
          <div className="space-y-4 animate-in fade-in">
            <button
              onClick={() => { setViewTab("HELP"); setTicketSuccessRef(null); }}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Help Center
            </button>

            {ticketSuccessRef ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-emerald-200 shadow-2xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black text-slate-900">Support Ticket Created</h3>
                <p className="text-xs font-mono font-bold text-blue-600">{ticketSuccessRef}</p>
                <p className="text-[11px] text-slate-500">
                  Your ticket has been recorded in the central database. Our support desk has been dispatched.
                </p>
                <button
                  onClick={() => { setViewTab("HELP"); setTicketSuccessRef(null); }}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Return to Help Topics
                </button>
              </div>
            ) : (
              <form onSubmit={handleMobileCreateTicket} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3 text-xs">
                <h3 className="text-xs font-black text-slate-900">Submit a Support Inquiry</h3>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Issue Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="General Support">General Support</option>
                    <option value="Booking & Service Enquiries">Booking &amp; Service Enquiries</option>
                    <option value="Payments & Wallet">Payments &amp; Wallet</option>
                    <option value="Business Registration & KYC">Business Registration &amp; KYC</option>
                    <option value="Listing & Profile Management">Listing &amp; Profile Management</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Short summary of the issue..."
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide relevant details, booking IDs, or error messages..."
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {isSubmittingTicket ? "Submitting..." : "Submit Case"}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
