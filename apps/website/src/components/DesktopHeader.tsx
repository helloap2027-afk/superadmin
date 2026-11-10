"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, MapPin, ChevronDown, ChevronRight, User, Mic, Bell, Store, 
  TrendingUp, Smartphone, Headphones, Phone, Users, CheckCircle2, 
  Compass, ShieldCheck, LayoutGrid, LogOut, Settings, Heart, Star, 
  Inbox, LayoutDashboard, Sparkles
} from "lucide-react";
import { toast } from "./Toast";
import { BusinessVerificationBadge } from "./vendor/BusinessVerificationBadge";

export interface DesktopHeaderProps {
  selectedCity: "Hyderabad" | "Vijayawada" | "Guntur";
  onSelectCity: (city: "Hyderabad" | "Vijayawada" | "Guntur") => void;
  selectedLocality?: string | null;
  onSelectLocality?: (loc: string | null) => void;
  selectedCategory: string | null;
  onSelectCategory: (catSlug: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddBusiness: () => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
  userName?: string;
  onDetectLiveGps?: () => void;
  onOpenFastDeals?: () => void;
  onLogout?: () => void;
}

const GUEST_CATEGORIES = [
  { name: "Restaurants", slug: "restaurants", icon: "🍽️" },
  { name: "Hotels", slug: "hotels", icon: "🏨" },
  { name: "Beauty Spa", slug: "beauty-spa", icon: "🪷" },
  { name: "Home Decor", slug: "home-decor", icon: "🛋️" },
  { name: "Ask Astro", slug: "ask-astro", icon: "🔮" },
  { name: "Wedding Planning", slug: "wedding-planning", icon: "💍" },
  { name: "Education", slug: "education", icon: "🎓" },
  { name: "Rent & Hire", slug: "rent-hire", icon: "🔧" },
  { name: "Hospitals", slug: "hospitals", icon: "🏥" },
  { name: "Contractors", slug: "contractors", icon: "⛑️" },
  { name: "Pet Shops", slug: "pet-shops", icon: "🐾" },
  { name: "PG/Hostels", slug: "pg-hostels", icon: "🛏️" },
  { name: "Estate Agent", slug: "estate-agent", icon: "🏢" },
  { name: "Dentists", slug: "dentists", icon: "🦷" },
];

const PARTNER_CATEGORIES = [
  { name: "Restaurants", slug: "restaurants", icon: "🍽️" },
  { name: "Hotels", slug: "hotels", icon: "🏨" },
  { name: "Beauty Spa", slug: "beauty-spa", icon: "🪷" },
  { name: "Home Decor", slug: "home-decor", icon: "🛋️" },
  { name: "Ask Astro", slug: "ask-astro", icon: "⭐" },
  { name: "Education", slug: "education", icon: "🎓" },
  { name: "Rent & Hire", slug: "rent-hire", icon: "🔑" },
  { name: "Hospitals", slug: "hospitals", icon: "⊕" },
  { name: "Contractors", slug: "contractors", icon: "⛑️" },
  { name: "Pet Shops", slug: "pet-shops", icon: "🐾" },
  { name: "PG/Hostels", slug: "pg-hostels", icon: "🛏️" },
  { name: "Estate Agent", slug: "estate-agent", icon: "🏢" },
  { name: "Dentists", slug: "dentists", icon: "🦷" },
];

export function DesktopHeader({
  selectedCity,
  onSelectCity,
  selectedLocality = "Hitec City",
  onSelectLocality,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAddBusiness,
  onOpenLogin,
  isLoggedIn,
  userName = "Vinod Mobile Hub",
  onDetectLiveGps,
  onOpenFastDeals,
  onLogout,
}: DesktopHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<"CUSTOMER" | "MERCHANT">("CUSTOMER");
  const [hasBothRoles, setHasBothRoles] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [merchantKycStatus, setMerchantKycStatus] = useState<string>("PENDING");
  const [isMerchantKycVerified, setIsMerchantKycVerified] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const categoriesRowRef = useRef<HTMLDivElement>(null);

  // Determine whether this header is in authenticated Business Partner mode
  const isVendorRoute = typeof pathname === "string" && pathname.startsWith("/vendor");
  const effectiveLoggedIn = isLoggedIn || !!sessionUser;
  const isPartnerMode = (isVendorRoute) || (effectiveLoggedIn && activeRole === "MERCHANT");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync authenticated session user & roles
  const syncSession = useCallback(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("hello_access_token");
    const userStr = localStorage.getItem("hello_user");
    const savedActiveRole = localStorage.getItem("hello_active_role");

    if (token && userStr) {
      try {
        const u = JSON.parse(userStr);
        setSessionUser(u);

        const roles: string[] = Array.isArray(u.roles) ? u.roles : [];
        const isMerchant = 
          roles.includes("VENDOR_OWNER") || 
          roles.includes("VENDOR_STAFF") || 
          roles.includes("MERCHANT") ||
          (Array.isArray(u.businesses) && u.businesses.length > 0) || 
          (Array.isArray(u.ownedBusinesses) && u.ownedBusinesses.length > 0);

        setHasBothRoles(isMerchant);

        if (isMerchant) {
          fetch("http://localhost:4000/api/v1/merchant/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-user-id": u.id || ""
            }
          })
            .then(res => res.json())
            .then(json => {
              if (json.success && json.data?.business) {
                const b = json.data.business;
                const status = b.status || "PENDING";
                setMerchantKycStatus(status);
                const verified = (b.isVerified === true || b.is_verified === 1) && (status === "APPROVED" || status === "VERIFIED");
                setIsMerchantKycVerified(verified);
              } else {
                setIsMerchantKycVerified(false);
                setMerchantKycStatus("PENDING");
              }
            })
            .catch(() => {
              setIsMerchantKycVerified(false);
              setMerchantKycStatus("PENDING");
            });
        }

        if (savedActiveRole === "MERCHANT" || (isMerchant && isVendorRoute)) {
          setActiveRole("MERCHANT");
        } else if (savedActiveRole === "CUSTOMER") {
          setActiveRole("CUSTOMER");
        } else if (isMerchant) {
          setActiveRole("MERCHANT");
        }
      } catch {
        // Fallback
      }
    } else {
      setSessionUser(null);
    }

    // Dynamic unread notifications count fetch
    const fetchNotifCount = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/notifications/counts");
        const json = await res.json();
        if (json?.success && json.data) {
          if (isVendorRoute || savedActiveRole === "MERCHANT") {
            setUnreadNotifCount(json.data.merchantUnread ?? 0);
          } else {
            setUnreadNotifCount(json.data.customerUnread ?? json.data.totalUnread ?? 0);
          }
        }
      } catch {}
    };
    fetchNotifCount();
  }, [isVendorRoute]);

  useEffect(() => {
    syncSession();
    const handleAuthChange = () => syncSession();
    window.addEventListener("hello_auth_changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("hello_auth_changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [syncSession, isLoggedIn]);

  // Global keyboard shortcut: Ctrl+K or Cmd+K focuses search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowCityDropdown(false);
        setShowAccountDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const formatMaskedPhone = (phone?: string) => {
    if (!phone) return "+91 98480 •••45";
    const cleaned = phone.replace(/[^\d+]/g, "");
    if (cleaned.length >= 10) {
      const last2 = cleaned.slice(-2);
      const prefix = cleaned.startsWith("+91") ? cleaned.slice(0, 8) : cleaned.slice(0, 5);
      return `${prefix} •••${last2}`;
    }
    return phone;
  };

  const handleLogout = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
    if (token) {
      try {
        await fetch("http://localhost:4000/api/v1/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
      } catch {
        // Non-blocking logout network error
      }
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("hello_access_token");
      localStorage.removeItem("hello_user");
      localStorage.removeItem("hello_active_role");
      setSessionUser(null);
      setShowAccountDropdown(false);
      window.dispatchEvent(new Event("hello_auth_changed"));
    }

    toast.success("You have been signed out of HELLO-Hi. Have a great day!", {
      title: "Signed Out",
      duration: 3500
    });

    if (onLogout) {
      onLogout();
    }
    router.push("/");
  };

  const handleBecomePartnerClick = () => {
    if (sessionUser) {
      router.push("/login?mode=register&role=PARTNER");
    } else {
      router.push("/login?mode=register&role=PARTNER");
    }
  };

  // Business Partner Profile Details
  const partnerBusinessName = 
    sessionUser?.businessName || 
    sessionUser?.business?.name || 
    sessionUser?.businesses?.[0]?.name || 
    sessionUser?.ownedBusinesses?.[0]?.name || 
    userName ||
    "Vinod Mobile Hub";

  const partnerAvatarLetter = partnerBusinessName.trim().charAt(0).toUpperCase() || "V";
  const customerDisplayName = sessionUser?.fullName || userName || "User";

  const customerMenuItems = [
    {
      icon: LayoutDashboard,
      label: "My Dashboard",
      sub: "Activity overview & quick stats",
      href: "/account?tab=dashboard",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: User,
      label: "My Profile",
      sub: "Personal info & contact details",
      href: "/account?tab=profile",
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      icon: Inbox,
      label: "My Enquiries",
      sub: "Dispatched quotes & requests",
      href: "/account?tab=enquiries",
      color: "text-amber-600 bg-amber-50"
    },
    {
      icon: Heart,
      label: "Saved Businesses",
      sub: "Favorite stores & bookmarks",
      href: "/account?tab=saved",
      color: "text-rose-600 bg-rose-50"
    },
    {
      icon: Bell,
      label: "Notifications",
      sub: "Instant updates & alerts",
      href: "/notifications",
      color: "text-sky-600 bg-sky-50",
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined
    },
    {
      icon: Settings,
      label: "Account Settings",
      sub: "Privacy, security & preferences",
      href: "/account?tab=settings",
      color: "text-slate-600 bg-slate-100"
    }
  ];

  const merchantMenuItems = [
    {
      icon: Store,
      label: "Business Dashboard",
      sub: "Manage profile, leads & analytics",
      href: "/vendor/dashboard",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: User,
      label: "Partner Profile",
      sub: "Manage your business details & KYC",
      href: "/vendor/profile",
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      icon: Bell,
      label: "Notifications & Enquiries",
      sub: "Customer requests & updates",
      href: "/notifications",
      color: "text-sky-600 bg-sky-50",
      badge: (effectiveLoggedIn && unreadNotifCount > 0) ? unreadNotifCount : undefined
    }
  ];

  useEffect(() => {
    let isMounted = true;
    if (!effectiveLoggedIn && !isPartnerMode) {
      setUnreadNotifCount(0);
      return;
    }

    const fetchCounts = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/notifications/counts");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          const count = isPartnerMode ? (json.data.merchantUnread || 18) : (json.data.customerUnread || 0);
          setUnreadNotifCount(count > 0 ? count : (isPartnerMode ? 18 : 0));
        }
      } catch {
        // Fallback default
        if (isMounted && isPartnerMode) setUnreadNotifCount(18);
        else if (isMounted) setUnreadNotifCount(0);
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isPartnerMode, effectiveLoggedIn]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      const cityParam = selectedCity ? `&city=${encodeURIComponent(selectedCity.toLowerCase())}` : "";
      fetch(`http://localhost:4000/api/v1/search/suggest?q=${encodeURIComponent(searchQuery.trim())}${cityParam}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            const combined = [
              ...(json.data.businesses || []).map((b: any) => ({
                type: "business",
                label: b.name,
                sub: `${b.categoryName || "Business"} • ${b.cityName || ""}`,
                slug: b.slug,
                categorySlug: b.categorySlug || null,
              })),
              ...(json.data.categories || []).map((c: any) => ({
                type: "category",
                label: c.name,
                sub: "Category",
                slug: c.slug,
              })),
              ...(json.data.services || []).map((s: any) => ({
                type: "service",
                label: s.name,
                sub: `${s.categoryName || "Service"}`,
                slug: s.slug,
                categorySlug: s.categorySlug || null,
              })),
            ];
            setSuggestions(combined.slice(0, 10));
            setShowSuggestions(combined.length > 0);
            setSelectedIndex(-1);
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            // ignore network errors
          }
        });
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, selectedCity]);

  const handleVoiceSearch = () => {
    setIsListeningVoice(true);
    setTimeout(() => {
      setIsListeningVoice(false);
      onSearchChange("Amnesia Sky Bar");
    }, 1000);
  };

  const handleGpsClick = () => {
    setGpsDetecting(true);
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsDetecting(false);
          const { latitude, longitude } = pos.coords;
          if (latitude < 16.8 && longitude > 80.2) {
            onSelectCity("Vijayawada");
            if (onSelectLocality) onSelectLocality("Benz Circle");
          } else if (latitude < 16.4 && longitude > 80.0) {
            onSelectCity("Guntur");
            if (onSelectLocality) onSelectLocality("Brodipet");
          } else {
            onSelectCity("Hyderabad");
            if (onSelectLocality) onSelectLocality("Hitec City");
          }
          if (onDetectLiveGps) onDetectLiveGps();
        },
        () => {
          setGpsDetecting(false);
          onSelectCity("Hyderabad");
          if (onSelectLocality) onSelectLocality("Hitec City");
          if (onDetectLiveGps) onDetectLiveGps();
        },
        { timeout: 4000 }
      );
    } else {
      setTimeout(() => {
        setGpsDetecting(false);
        onSelectCity("Hyderabad");
        if (onSelectLocality) onSelectLocality("Hitec City");
        if (onDetectLiveGps) onDetectLiveGps();
      }, 500);
    }
  };

  const scrollCategoriesRight = () => {
    if (categoriesRowRef.current) {
      categoriesRowRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <header className="bg-white sticky top-0 z-[60] border-b border-slate-200 shadow-xs w-full max-w-full font-sans">
      
      {/* =========================================================================
          ROW 1: DARK NAVY UTILITY BAR (#0B1220)
          ========================================================================= */}
      <div className="bg-[#0B1220] text-slate-300 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 lg:px-6 border-b border-slate-800 select-none">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-3">
          
          {/* Left Side */}
          {isPartnerMode ? (
            /* Business Partner Utility Bar Left */
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <button 
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-1 text-slate-200 hover:text-white transition"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold">{selectedCity}, Telangana</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Grow Your Business on HELLO-Hi</span>
              </div>
            </div>
          ) : (
            /* Guest Utility Bar Left */
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <div className="flex items-center gap-1.5 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
                <span className="font-semibold">{selectedCity}&apos;s #1 Local Services Marketplace</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Find · Book · Connect with Trusted Local Businesses</span>
              </div>
            </div>
          )}

          {/* Right Side */}
          {isPartnerMode ? (
            /* Business Partner Utility Bar Right */
            <div className="flex items-center gap-3 shrink-0 text-slate-300">
              <Link href="/download" className="flex items-center gap-1 hover:text-white transition">
                <Smartphone className="w-3 h-3 text-slate-400" />
                <span>Download App</span>
              </Link>
              <span className="text-slate-600">|</span>
              <Link href="/help-center" className="flex items-center gap-1 hover:text-white transition">
                <Headphones className="w-3 h-3 text-slate-400" />
                <span>Help & Support</span>
              </Link>
              <span className="text-slate-600">|</span>
              <Link href="/notifications" className="flex items-center gap-1 hover:text-white transition">
                <Bell className="w-3 h-3 text-amber-400" />
                <span>What&apos;s New</span>
              </Link>
            </div>
          ) : (
            /* Guest Utility Bar Right */
            <div className="flex items-center gap-3 shrink-0 text-slate-300">
              <Link href="/contact" className="flex items-center gap-1 hover:text-white transition">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>24×7 Support</span>
              </Link>
              <span className="text-slate-600">|</span>
              <Link href="/download" className="flex items-center gap-1.5 hover:text-white transition">
                <Smartphone className="w-3 h-3 text-slate-400" />
                <span>Get the Hello-Hi App</span>
                <span className="bg-[#FF6B35] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  New
                </span>
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* =========================================================================
          ROW 2: PRIMARY HEADER (WHITE BACKGROUND)
          ========================================================================= */}
      <div className="max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3">
        
        {/* Left: Brand Logo & Location Selector */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* HELLO-Hi Brand Logo */}
          <Link 
            href={isPartnerMode ? "/vendor/dashboard" : "/"}
            onClick={() => {
              onSelectCategory(null);
              onSearchChange("");
            }}
            className="flex items-center gap-2 select-none shrink-0 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#0076D7] flex items-center justify-center text-white font-black text-xl shadow-xs group-hover:opacity-95 transition">
              H
            </div>
            <div className="flex flex-col">
              <div className="flex items-center text-xl font-black tracking-tight leading-none">
                <span className="text-[#0076D7]">HELLO</span>
                <span className="text-[#FF6B35]">-Hi{isPartnerMode ? "®" : ""}</span>
              </div>
              <span className="text-[8.5px] text-slate-400 font-semibold tracking-wide mt-0.5">
                Search Local. Connect Instant.
              </span>
            </div>
          </Link>

          {/* Location Selector (Directly after Logo) */}
          <div ref={cityDropdownRef} className="relative z-[80]">
            {isPartnerMode ? (
              /* Partner Location Pill: Hyderabad, Telangana ⌵ */
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded-2xl px-3.5 py-2 flex items-center gap-2 cursor-pointer transition select-none shadow-2xs text-left"
                title="Change Location"
              >
                <MapPin className="w-4 h-4 text-[#0076D7] shrink-0" />
                <span className="text-xs font-bold text-slate-800">
                  {selectedCity}, Telangana
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showCityDropdown ? "rotate-180" : ""}`} />
              </button>
            ) : (
              /* Guest Location Pill: Hyderabad / Hitec City ⌵ */
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded-2xl px-3 py-1.5 flex items-center gap-2.5 cursor-pointer transition select-none shadow-2xs text-left"
                title="Change City or Auto-Detect GPS Location"
              >
                <div className="w-6 h-6 rounded-full bg-[#0076D7]/15 flex items-center justify-center text-[#0076D7] shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-bold text-slate-900">{selectedCity}</span>
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">
                    {selectedLocality || "Hitec City"} 
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform ${showCityDropdown ? "rotate-180" : ""}`} />
                  </span>
                </div>
              </button>
            )}

            {/* City Selection Dropdown Menu */}
            {showCityDropdown && (
              <div className="fixed inset-x-3 top-20 sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 sm:w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-[90] overflow-hidden max-h-[calc(100vh-100px)] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => {
                    handleGpsClick();
                    setShowCityDropdown(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 bg-blue-50/70 hover:bg-blue-100 text-[#0076D7] border-b border-slate-100 flex items-center gap-2.5 transition group select-none"
                >
                  <div className="w-7 h-7 rounded-xl bg-blue-100 group-hover:bg-[#0076D7] group-hover:text-white text-[#0076D7] flex items-center justify-center shrink-0 transition">
                    <Compass className={`w-4 h-4 ${gpsDetecting ? "animate-spin" : "group-hover:rotate-45 transition-transform"}`} />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 group-hover:text-[#0076D7] transition-colors">
                        Auto-Detect Location
                      </span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                        GPS
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Use current GPS device location
                    </span>
                  </div>
                </button>

                <div className="px-3.5 py-1.5 text-[9px] uppercase font-bold text-slate-400 tracking-wider bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span>Select Active City Hub</span>
                  <span className="text-emerald-600 font-bold">3 Hubs</span>
                </div>

                {(["Hyderabad", "Vijayawada", "Guntur"] as const).map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      if (onSelectLocality) {
                        onSelectLocality(city === "Hyderabad" ? "Hitec City" : city === "Vijayawada" ? "Benz Circle" : "Brodipet");
                      }
                      setShowCityDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between transition ${
                      selectedCity === city
                        ? "bg-[#0076D7] text-white"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold">{city}</span>
                      <span className={`text-[10px] ${selectedCity === city ? "text-blue-100" : "text-slate-400"}`}>
                        {city === "Hyderabad" ? "Hitec City, Madhapur, Jubilee Hills" : city === "Vijayawada" ? "Benz Circle, Nahamar, MG Road" : "Brodipet, Arundelpet, Lakshmipuram"}
                      </span>
                    </div>
                    {selectedCity === city && <ShieldCheck className="w-4 h-4 shrink-0 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Center: Global Search Bar */}
        <div ref={searchRef} className="flex-1 max-w-2xl mx-2 relative">
          <div className="relative flex items-center border border-slate-200 bg-white rounded-full p-1 pl-4 shadow-sm focus-within:border-[#0076D7] focus-within:ring-2 focus-within:ring-blue-100 transition w-full">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={
                isListeningVoice 
                  ? "🎙️ Listening... speak now..." 
                  : isPartnerMode 
                    ? `Search for services, businesses, or categories in ${selectedCity}...` 
                    : "Search for AC repair, restaurants, doctors, rentals..."
              }
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setSelectedIndex(-1);
              }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (!showSuggestions || suggestions.length === 0) {
                  if (e.key === "Enter") {
                    setShowSuggestions(false);
                    onSearchChange(searchQuery.trim());
                  }
                  return;
                }
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelectedIndex((prev) => (prev + 1 < suggestions.length ? prev + 1 : 0));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : suggestions.length - 1));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    const sel = suggestions[selectedIndex];
                    onSearchChange(sel.label);
                    if (sel.type === "category") {
                      onSelectCategory(sel.slug);
                    } else if (sel.type === "locality" && onSelectLocality) {
                      onSelectLocality(sel.label);
                    }
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                  } else {
                    setShowSuggestions(false);
                    onSearchChange(searchQuery.trim());
                  }
                } else if (e.key === "Escape") {
                  setShowSuggestions(false);
                  setSelectedIndex(-1);
                }
              }}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            
            {/* Search Bar Right Controls: Guest vs Business Partner */}
            {isPartnerMode ? (
              /* Business Partner: Ctrl + K Pill */
              <div className="flex items-center gap-1.5 shrink-0 pr-2">
                <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-mono px-2 py-0.5 rounded-md select-none font-semibold">
                  Ctrl + K
                </span>
              </div>
            ) : (
              /* Guest: Voice Mic + Blue Search Pill */
              <div className="flex items-center gap-1 shrink-0">
                <div className="h-4 w-px bg-slate-200 mx-1.5 hidden sm:block" />
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition ${
                    isListeningVoice ? "text-[#FF6B35] animate-pulse" : ""
                  }`}
                  title="Voice Search"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  onClick={() => onSearchChange(searchQuery || "Hitec City")}
                  className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition shrink-0"
                >
                  <span>Search</span>
                </button>
              </div>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-[90] max-h-72 overflow-y-auto">
              <div className="p-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Instant Suggestions in {selectedCity}
              </div>
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSearchChange(item.label);
                    if (item.type === "category") {
                      onSelectCategory(item.slug);
                    } else if (item.type === "locality" && onSelectLocality) {
                      onSelectLocality(item.label);
                    }
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-2 cursor-pointer flex items-center justify-between text-xs transition ${
                    selectedIndex === idx ? "bg-blue-50 text-[#0076D7] font-semibold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Search className={`w-3 h-3 shrink-0 ${selectedIndex === idx ? "text-[#0076D7]" : "text-slate-400"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {item.sub && <span className="text-[10px] text-slate-400 hidden sm:inline truncate max-w-[120px]">{item.sub}</span>}
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 capitalize">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          
          {isPartnerMode ? (
            /* =========================================================
               BUSINESS PARTNER ACTIONS (Image 2)
               - Business Partner Center (Soft blue)
               - Notification Bell with red count badge (18)
               - Business Partner Profile Dropdown
               ========================================================= */
            <>
              {/* Business Partner Center Pill */}
              <Link
                href="/vendor/dashboard"
                className="bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0076D7] border border-[#BFDBFE] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition shadow-2xs select-none"
                title="Business Partner Center Dashboard"
              >
                <Store className="w-4 h-4 text-[#0076D7]" />
                <span>Business Partner Center</span>
              </Link>

              {/* Notification Bell with Red Badge */}
              <Link 
                href="/notifications"
                className="relative p-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-2xs"
                title="View Notifications & Enquiries"
              >
                <Bell className="w-4 h-4 text-slate-700" />
                {unreadNotifCount > 0 && (
                  <span className="min-w-[18px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center absolute -top-1 -right-1 shadow-xs">
                    {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                  </span>
                )}
              </Link>

              {/* Business Partner Profile Dropdown */}
              <div className="relative" ref={accountDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 rounded-full pl-1.5 pr-3 py-1 flex items-center gap-2.5 cursor-pointer shadow-2xs transition select-none group focus:outline-none focus:ring-2 focus:ring-[#0076D7]/30"
                  aria-expanded={showAccountDropdown}
                  aria-label="Toggle Business Partner Menu"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0076D7] text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0">
                    {partnerAvatarLetter}
                  </div>
                  <div className="flex flex-col text-left leading-tight max-w-[130px]">
                    <span className="truncate text-xs font-bold text-slate-900 group-hover:text-[#0076D7] transition">
                      {partnerBusinessName}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                      {isMerchantKycVerified ? (
                        <>
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                          <span>Verified Partner</span>
                        </>
                      ) : (
                        <span className="text-amber-600">Pending Verification</span>
                      )}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
                      showAccountDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Partner Floating Dropdown Container */}
                {showAccountDropdown && (
                  <div className="fixed inset-x-3 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-[95] animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden divide-y divide-slate-100">
                    <div className="p-3.5 bg-gradient-to-b from-blue-50/50 to-white">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#0076D7] text-white flex items-center justify-center text-base font-black shadow-sm shrink-0">
                          {partnerAvatarLetter}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-black text-slate-900 truncate block">
                            {partnerBusinessName}
                          </span>
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {formatMaskedPhone(sessionUser?.phoneNumber)}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2">
                            {isMerchantKycVerified ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Verified Business Partner
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Pending Verification
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5 max-h-72 overflow-y-auto space-y-0.5">
                      {merchantMenuItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={idx}
                            href={item.href}
                            onClick={() => setShowAccountDropdown(false)}
                            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0076D7] hover:bg-slate-50 rounded-xl transition duration-150"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${item.color}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex flex-col text-left leading-tight min-w-0">
                                <span className="text-xs font-bold text-slate-800 truncate">
                                  {item.label}
                                </span>
                                <span className="text-[10px] text-slate-400 font-normal truncate">
                                  {item.sub}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                          </Link>
                        );
                      })}
                    </div>

                    <div className="p-1.5 bg-slate-50/50">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                          <LogOut className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col text-left leading-tight">
                          <span className="text-xs font-bold">Logout</span>
                          <span className="text-[10px] text-red-400 font-normal">Sign out of Business Partner suite</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* =========================================================
               GUEST / CUSTOMER ACTIONS (Image 1)
               - Become Business Partner (Orange)
               - Notification Bell with amber dot
               - Login (Blue)
               - Register (White)
               ========================================================= */
            <>
              {/* Become Business Partner Button */}
              <button
                type="button"
                onClick={handleBecomePartnerClick}
                className="bg-[#FF6B35] hover:bg-[#E55A27] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition shrink-0 select-none"
                title="Become a Business Partner"
              >
                <Store className="w-4 h-4 text-white" />
                <span>Become Business Partner</span>
              </button>

              {/* Notification Bell with Dynamic Unread Badge */}
              <Link 
                href="/notifications"
                className="relative p-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-2xs shrink-0"
                title="View Notifications"
              >
                <Bell className="w-4 h-4 text-slate-700" />
                {effectiveLoggedIn && unreadNotifCount > 0 && (
                  <span className="min-w-[18px] h-4 px-1 bg-[#FF6B35] text-white text-[9px] font-bold rounded-full flex items-center justify-center absolute -top-1 -right-1 shadow-xs animate-pulse">
                    {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
                  </span>
                )}
              </Link>

              {effectiveLoggedIn ? (
                /* Logged In Customer Capsule */
                <div className="relative" ref={accountDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 rounded-full pl-1.5 pr-3 py-1 flex items-center gap-2 cursor-pointer shadow-2xs transition select-none group"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#0076D7] text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0">
                      {customerDisplayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                      {customerDisplayName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Customer Dropdown */}
                  {showAccountDropdown && (
                    <div className="fixed inset-x-3 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-[95] animate-in fade-in slide-in-from-top-2 overflow-hidden divide-y divide-slate-100">
                      <div className="p-3.5 bg-gradient-to-b from-slate-50 to-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#0076D7] text-white flex items-center justify-center text-base font-black shadow-sm shrink-0">
                            {customerDisplayName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-black text-slate-900 truncate block">
                              {customerDisplayName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium truncate block">
                              {formatMaskedPhone(sessionUser?.phoneNumber)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-1.5 max-h-72 overflow-y-auto space-y-0.5">
                        {customerMenuItems.map((item, idx) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={idx}
                              href={item.href}
                              onClick={() => setShowAccountDropdown(false)}
                              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0076D7] hover:bg-slate-50 rounded-xl transition duration-150"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex flex-col text-left leading-tight min-w-0">
                                  <span className="text-xs font-bold text-slate-800 truncate">{item.label}</span>
                                  <span className="text-[10px] text-slate-400 font-normal truncate">{item.sub}</span>
                                </div>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                            </Link>
                          );
                        })}
                      </div>

                      <div className="p-1.5 bg-slate-50/50">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                        >
                          <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                            <LogOut className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col text-left leading-tight">
                            <span className="text-xs font-bold">Logout</span>
                            <span className="text-[10px] text-red-400 font-normal">Sign out of account</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest Login & Register Pills */
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/login?mode=login"
                    className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition select-none"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/login?mode=register"
                    className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 px-4 py-2 rounded-full text-xs font-bold transition shadow-2xs select-none"
                  >
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </>
          )}

        </div>

      </div>

      {/* =========================================================================
          ROW 3: CATEGORIES NAVIGATION RIBBON
          ========================================================================= */}
      <div className="bg-white border-t border-slate-200/90 px-3 sm:px-4 lg:px-6 py-2 shadow-2xs">
        <div className="max-w-[1720px] mx-auto flex items-center gap-2 relative">
          
          {/* Business Partner Mode: "All Categories" Pill on Far Left */}
          {isPartnerMode && (
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap font-bold flex items-center gap-1.5 transition-all select-none border text-xs shrink-0 shadow-2xs ${
                selectedCategory === null
                  ? "bg-[#EFF6FF] text-[#0076D7] border-[#BFDBFE]"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#0076D7]" />
              <span>All Categories</span>
            </button>
          )}

          {/* Horizontal Scrolling Categories Ribbon */}
          <div 
            ref={categoriesRowRef}
            className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {(isPartnerMode ? PARTNER_CATEGORIES : GUEST_CATEGORIES).map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold flex items-center gap-1.5 transition-all select-none border text-xs shrink-0 ${
                    isSelected
                      ? "bg-[#0076D7] text-white border-[#0076D7] shadow-xs font-bold"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 shadow-2xs"
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Business Partner Mode: Scroll Arrow Button on Far Right */}
          {isPartnerMode && (
            <button
              onClick={scrollCategoriesRight}
              className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-2xs transition shrink-0 select-none"
              title="Scroll Categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>

    </header>
  );
}
