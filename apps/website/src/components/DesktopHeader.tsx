"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, MapPin, ChevronDown, Plus, User, Sparkles, Navigation, X, 
  ShieldCheck, Mic, Camera, LocateFixed, Zap, Bell, Target, Store, Compass,
  LayoutDashboard, Heart, Star, Settings, LogOut, Building2, Inbox, 
  Tag, CheckCircle2, ArrowLeftRight, ChevronRight, MessageSquare
} from "lucide-react";
import { toast } from "./Toast";
import { AP_EXPLORE_CATEGORIES } from "../data/exploreData";
import { useToast } from "./ToastProvider";

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
  userName = "SparkleSmart Ele...",
  onDetectLiveGps,
  onOpenFastDeals,
  onLogout,
}: DesktopHeaderProps) {
<<<<<<< HEAD
  const { showToast } = useToast();
=======
  const router = useRouter();
>>>>>>> feature/superadmin
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [activeRole, setActiveRole] = useState<"CUSTOMER" | "MERCHANT">("CUSTOMER");
  const [hasBothRoles, setHasBothRoles] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
<<<<<<< HEAD
=======
  const accountDropdownRef = useRef<HTMLDivElement>(null);

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
          (Array.isArray(u.businesses) && u.businesses.length > 0) || 
          (Array.isArray(u.ownedBusinesses) && u.ownedBusinesses.length > 0);
        const isCustomer = roles.includes("CUSTOMER") || (!isMerchant);

        setHasBothRoles(isMerchant);

        if (savedActiveRole === "MERCHANT" || (isMerchant && !isCustomer)) {
          setActiveRole("MERCHANT");
        } else {
          setActiveRole("CUSTOMER");
        }
      } catch {
        // Fallback
      }
    } else {
      setSessionUser(null);
    }
  }, []);

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
>>>>>>> feature/superadmin

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
<<<<<<< HEAD
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
=======
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false);
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

  const handleSwitchRole = async () => {
    const nextRole: "CUSTOMER" | "MERCHANT" = activeRole === "CUSTOMER" ? "MERCHANT" : "CUSTOMER";
    setIsSwitchingRole(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
      if (token) {
        const targetApiRole = nextRole === "MERCHANT" ? "VENDOR_OWNER" : "CUSTOMER";
        try {
          const res = await fetch("http://localhost:4000/api/v1/auth/switch-role", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ targetRole: targetApiRole })
          });
          const json = await res.json();
          if (json?.success && json?.data?.accessToken) {
            localStorage.setItem("hello_access_token", json.data.accessToken);
          }
        } catch {
          // Graceful fallback
        }
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("hello_active_role", nextRole);
        window.dispatchEvent(new Event("hello_auth_changed"));
      }
      setActiveRole(nextRole);
      setShowAccountDropdown(false);

      toast.brand(
        nextRole === "MERCHANT"
          ? "Switched to Merchant Partner Mode. Welcome to your business suite!"
          : "Switched to Customer Discovery Mode. Browse local deals and services!",
        {
          title: nextRole === "MERCHANT" ? "Merchant Mode Active" : "Customer Mode Active",
          duration: 3500
        }
      );

      if (nextRole === "MERCHANT") {
        router.push("/vendor/dashboard");
      } else {
        router.push("/account");
      }
    } finally {
      setIsSwitchingRole(false);
    }
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

  const displayName = sessionUser?.fullName || userName || "Verified Member";
  const avatarInitial = displayName.charAt(0).toUpperCase() || "U";

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
      icon: Star,
      label: "My Reviews",
      sub: "Ratings & feedback history",
      href: "/account?tab=reviews",
      color: "text-yellow-600 bg-yellow-50"
    },
    {
      icon: Bell,
      label: "Notifications",
      sub: "Instant updates & alerts",
      href: "/notifications",
      color: "text-sky-600 bg-sky-50",
      badge: unreadNotifCount > 0 ? (unreadNotifCount > 99 ? "99+" : unreadNotifCount) : undefined
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
      icon: LayoutDashboard,
      label: "Merchant Dashboard",
      sub: "Overview, speed quotes & analytics",
      href: "/vendor/dashboard",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: ShieldCheck,
      label: "My Profile & KYC",
      sub: "Owner info, proof & verification",
      href: "/vendor/profile",
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      icon: Building2,
      label: "My Businesses",
      sub: "Manage branch & outlet listings",
      href: "/vendor/dashboard#businesses",
      color: "text-orange-600 bg-orange-50"
    },
    {
      icon: MessageSquare,
      label: "Enquiries & Leads",
      sub: "Direct customer phone & chats",
      href: "/vendor/dashboard#leads",
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      icon: Tag,
      label: "Services & Gallery",
      sub: "Catalog, photos & deal offers",
      href: "/vendor/profile#services",
      color: "text-purple-600 bg-purple-50"
    },
    {
      icon: CheckCircle2,
      label: "Verification Status",
      sub: "FSSAI, GST & license validation",
      href: "/vendor/profile#kyc",
      color: "text-teal-600 bg-teal-50"
    },
    {
      icon: Bell,
      label: "Notifications",
      sub: "Order leads & system alerts",
      href: "/notifications",
      color: "text-sky-600 bg-sky-50",
      badge: unreadNotifCount > 0 ? (unreadNotifCount > 99 ? "99+" : unreadNotifCount) : undefined
    },
    {
      icon: Settings,
      label: "Account Settings",
      sub: "Partner credentials & security",
      href: "/vendor/profile#personal",
      color: "text-slate-600 bg-slate-100"
    }
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/notifications/counts");
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setUnreadNotifCount(json.data.totalUnread || 0);
        }
      } catch {
        // Silent network fallback
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
>>>>>>> feature/superadmin
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      fetch(`http://localhost:4000/api/v1/search/suggest?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            const combined = [
              ...(json.data.businesses || []).map((b: any) => ({ type: "business", label: b.name, sub: b.cityName })),
              ...(json.data.categories || []).map((c: any) => ({ type: "category", label: c.name, slug: c.slug })),
              ...(json.data.localities || []).map((l: any) => ({ type: "locality", label: l.name, sub: l.cityName }))
            ];
            setSuggestions(combined);
            setShowSuggestions(combined.length > 0);
          }
        })
        .catch(() => {});
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

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
<<<<<<< HEAD
          setShowCityDropdown(false);
          if (onDetectLiveGps) onDetectLiveGps();
          showToast({
            type: "location",
            title: "GPS Location Verified",
            message: `Connected to ${selectedCity} Hyperlocal Gateway! (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`,
            duration: 4000,
          });
        },
        () => {
          setGpsDetecting(false);
          setShowCityDropdown(false);
          if (onDetectLiveGps) onDetectLiveGps();
          showToast({
            type: "location",
            title: "GPS Location Verified",
            message: `Connected to ${selectedCity} Hyperlocal Gateway!`,
            duration: 3500,
          });
        },
        { timeout: 3000 }
=======
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
>>>>>>> feature/superadmin
      );
    } else {
      setTimeout(() => {
        setGpsDetecting(false);
<<<<<<< HEAD
        setShowCityDropdown(false);
        if (onDetectLiveGps) onDetectLiveGps();
        showToast({
          type: "location",
          title: "GPS Location Verified",
          message: `Connected to ${selectedCity} Hyperlocal Gateway!`,
          duration: 3500,
        });
=======
        onSelectCity("Hyderabad");
        if (onSelectLocality) onSelectLocality("Hitec City");
        if (onDetectLiveGps) onDetectLiveGps();
>>>>>>> feature/superadmin
      }, 500);
    }
  };

  return (
<<<<<<< HEAD
    <header className="bg-white sticky top-0 z-40 border-b border-slate-200/90 shadow-2xs w-full max-w-full">
      
      {/* 1. TOP MAIN WHITE NAVBAR (Matching Screenshot) */}
      <div className="max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3 relative z-30">
=======
    <header className="bg-white sticky top-0 z-[60] border-b border-slate-200/90 shadow-2xs w-full max-w-full">
      
      {/* 1. TOP MAIN WHITE NAVBAR */}
      <div className="relative z-[70] max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3">
>>>>>>> feature/superadmin
        
        {/* Left: Brand Logo + Location Selector */}
        <div className="flex items-center gap-3">
          
          {/* Brand Logo: Hello-Hi with Pin Badge */}
          <Link 
            href="/"
            onClick={() => {
              onSelectCategory(null);
              onSearchChange("");
            }}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B35] to-[#0076D7] flex items-center justify-center text-white font-black text-lg shadow-2xs">
              H
            </div>
            <div className="flex flex-col">
              <div className="flex items-center text-xl font-black tracking-tight leading-none">
                <span className="text-[#0076D7]">Hello</span>
                <span className="text-[#FF6B35]">-Hi</span>
              </div>
              <span className="text-[8px] text-slate-400 font-semibold tracking-wide">
                Search Local. Connect Instant.
              </span>
            </div>
          </Link>

<<<<<<< HEAD
          {/* City & Locality Selector Pill */}
          <div ref={cityDropdownRef} className="relative z-50">
=======
          {/* City & Locality Selector Pill with Auto-Detection Inside Dropdown */}
          <div ref={cityDropdownRef} className="relative z-[80]">
>>>>>>> feature/superadmin
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition text-left"
              title="Change City or Auto-Detect GPS Location"
            >
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shrink-0" />
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-bold text-slate-900">{selectedCity}</span>
                <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                  {selectedLocality || "Hitec City"} <ChevronDown className={`w-2.5 h-2.5 transition-transform ${showCityDropdown ? "rotate-180" : ""}`} />
                </span>
              </div>
            </button>

            {showCityDropdown && (
<<<<<<< HEAD
              <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-[100] animate-in fade-in slide-in-from-top-1 duration-150">
                {/* 1. Auto-detect option in the header of the location dropdown */}
                <button
                  onClick={handleGpsClick}
                  className="w-full text-left px-3.5 py-2.5 bg-blue-50/70 hover:bg-blue-100 border-b border-blue-100 flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className={`w-4 h-4 text-[#0076D7] ${gpsDetecting ? "animate-spin" : "group-hover:rotate-45 transition-transform"}`} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#0076D7]">
                        {gpsDetecting ? "Detecting location..." : "Auto-detect Location"}
                      </span>
                      <span className="text-[10px] text-slate-500">Using Device GPS</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                    GPS
                  </span>
                </button>

                <div className="px-3.5 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span>Select Active Hub</span>
                  <span className="text-emerald-500 font-bold">Live</span>
=======
              <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 sm:w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-[90] overflow-hidden max-h-[calc(100vh-100px)] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                {/* 1. GPS Auto-Detect Option Inside Location Dropdown */}
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

                {/* 2. City Hub Options */}
                <div className="px-3.5 py-1.5 text-[9px] uppercase font-bold text-slate-400 tracking-wider bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span>Or Select City Hub</span>
                  <span className="text-emerald-600 font-bold">3 Active Hubs</span>
>>>>>>> feature/superadmin
                </div>

                {(["Hyderabad", "Vijayawada", "Guntur"] as const).map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onSelectCity(city);
                      if (onSelectLocality) {
                        onSelectLocality(city === "Hyderabad" ? "Hitec City" : city === "Vijayawada" ? "Nahamar" : "Brodipet");
                      }
                      setShowCityDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between transition ${
                      selectedCity === city
                        ? "bg-[#0076D7] text-white"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
<<<<<<< HEAD
                    <div>
                      <span className="font-bold block">{city}</span>
                      <span className={`text-[10px] ${selectedCity === city ? "text-blue-100" : "text-slate-400"}`}>
                        {city === "Hyderabad" ? "Hitec City, Gachibowli" : city === "Vijayawada" ? "Benz Circle, Nahamar" : "Brodipet, Arundelpet"}
                      </span>
                    </div>
                    {selectedCity === city && <ShieldCheck className="w-4 h-4 shrink-0" />}
=======
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold">{city}</span>
                      <span className={`text-[10px] ${selectedCity === city ? "text-blue-100" : "text-slate-400"}`}>
                        {city === "Hyderabad" ? "Hitec City, Madhapur, Jubilee Hills" : city === "Vijayawada" ? "Benz Circle, Nahamar, MG Road" : "Brodipet, Arundelpet, Lakshmipuram"}
                      </span>
                    </div>
                    {selectedCity === city && <ShieldCheck className="w-4 h-4 shrink-0 text-white" />}
>>>>>>> feature/superadmin
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Search Capsule Bar with Mic & Search Button */}
        <div ref={searchRef} className="flex-1 max-w-md lg:max-w-xl mx-2 relative">
          <div className="relative flex items-center border border-slate-200 bg-white rounded-full p-1 pl-3.5 shadow-2xs focus-within:border-[#0076D7] focus-within:ring-2 focus-within:ring-blue-100 transition">
            <input
              type="text"
              placeholder={isListeningVoice ? "🎙️ Listening... speak now..." : "Hitec City, Biryani, Electrician..."}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none pr-16"
            />
            
            {/* Mic Button */}
            <button
              onClick={handleVoiceSearch}
              className={`p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition mr-1 ${
                isListeningVoice ? "text-[#FF6B35] animate-pulse" : ""
              }`}
              title="Voice Search"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            {/* Blue Search Pill Button */}
            <button 
              onClick={() => onSearchChange(searchQuery || "Hitec City")}
              className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
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
                    setShowSuggestions(false);
                  }}
                  className="px-3.5 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs text-slate-700 transition"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3 h-3 text-[#0076D7]" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 capitalize">{item.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Nav Links & Actions */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          
          <Link 
            href="/"
            onClick={() => {
              onSelectCategory(null);
              onSearchChange("");
            }}
            className="text-xs font-bold text-slate-700 hover:text-[#0076D7] transition hidden xl:block"
          >
            Home
          </Link>

          <Link 
            href="/explore"
            className="text-xs font-bold text-[#0076D7] bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg transition"
          >
            Explore
          </Link>

          <button 
            onClick={onOpenFastDeals}
            className="text-xs font-bold text-slate-700 hover:text-[#FF6B35] transition hidden xl:flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>Best Deals</span>
          </button>

          <button 
            onClick={() => showToast({
              type: "info",
              title: "B2B Wholesale Mart",
              message: `Verified bulk industrial and IT suppliers in ${selectedCity}.`,
            })}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 transition hidden xl:flex items-center gap-1"
          >
            <Store className="w-3.5 h-3.5 text-slate-500" />
            <span>B2B Mart</span>
          </button>

          <Link
            href="/about"
            className="text-xs font-semibold text-slate-600 hover:text-[#0076D7] transition hidden 2xl:block"
          >
            About
          </Link>

          <Link
            href="/faq"
            className="text-xs font-semibold text-slate-600 hover:text-[#0076D7] transition hidden 2xl:block"
          >
            FAQs
          </Link>

          <Link
            href="/contact"
            className="text-xs font-semibold text-slate-600 hover:text-[#0076D7] transition hidden 2xl:block"
          >
            Contact
          </Link>

          {/* FREE - Business Listing Pill Button */}
          <button
            onClick={onOpenAddBusiness}
            className="border border-[#FF6B35] text-[#FF6B35] bg-orange-50/60 hover:bg-orange-100 px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 shadow-2xs"
          >
            <span className="bg-[#FF6B35] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">FREE</span>
            <span>+ Business Listing</span>
          </button>

<<<<<<< HEAD
          {/* Notification Bell with Badge */}
          <button 
            onClick={() => showToast({
              type: "info",
              title: "Instant Notification",
              message: `1 New fast quote received in ${selectedLocality || selectedCity}!`,
            })}
=======
          {/* Notification Bell with Badge -> Navigates to Dynamic Notifications Page */}
          <Link 
            href="/notifications"
>>>>>>> feature/superadmin
            className="relative p-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 transition"
            title="View Real-Time Notifications & Leads"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifCount > 99 ? "99+" : unreadNotifCount}
              </span>
            )}
          </Link>

          {/* Dynamic "My Account" Dropdown Menu */}
          {isLoggedIn ? (
            <div className="relative" ref={accountDropdownRef}>
              <button
                type="button"
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="bg-[#0F172A] hover:bg-slate-800 text-white pl-1.5 pr-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-xs transition border border-slate-700 select-none group focus:outline-none focus:ring-2 focus:ring-[#0076D7]/40"
                aria-expanded={showAccountDropdown}
                aria-label="Toggle My Account Menu"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0076D7] to-cyan-400 text-white flex items-center justify-center text-[11px] font-black shadow-xs shrink-0">
                  {avatarInitial}
                </div>
                <div className="flex flex-col text-left leading-none max-w-[110px]">
                  <span className="truncate text-xs font-bold text-white group-hover:text-sky-200 transition">
                    {displayName}
                  </span>
                  <span className="text-[9px] font-medium text-slate-300 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{activeRole === "MERCHANT" ? "Merchant" : "Customer"}</span>
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 ${
                    showAccountDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Floating Dropdown Container */}
              {showAccountDropdown && (
                <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-[95] animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden divide-y divide-slate-100">
                  
                  {/* 1. Account Identity Header */}
                  <div className="p-3.5 bg-gradient-to-b from-slate-50 to-white">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0076D7] to-sky-400 text-white flex items-center justify-center text-base font-black shadow-sm shrink-0">
                        {avatarInitial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-black text-slate-900 truncate">
                            {displayName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          {formatMaskedPhone(sessionUser?.phoneNumber)}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          {activeRole === "MERCHANT" ? (
                            <span className="bg-orange-50 text-[#FF6B35] border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Store className="w-2.5 h-2.5" /> Merchant Account
                            </span>
                          ) : (
                            <span className="bg-sky-50 text-[#0076D7] border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <User className="w-2.5 h-2.5" /> Customer Account
                            </span>
                          )}
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mode Switcher (Customer <-> Merchant) */}
                    {hasBothRoles && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleSwitchRole}
                          disabled={isSwitchingRole}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition group disabled:opacity-50"
                          title={activeRole === "MERCHANT" ? "Switch to Customer discovery view" : "Switch to Merchant management view"}
                        >
                          <div className="flex items-center gap-2">
                            <ArrowLeftRight className="w-3.5 h-3.5 text-[#0076D7] group-hover:rotate-180 transition-transform duration-300" />
                            <span className="text-xs font-bold text-slate-800">
                              {activeRole === "MERCHANT" ? "Switch to Customer Mode" : "Switch to Merchant Mode"}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-[#0076D7] group-hover:underline">
                            Switch &rarr;
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 2. Role-Adaptive Navigation Links */}
                  <div className="p-1.5 max-h-72 overflow-y-auto no-scrollbar scrollbar-none space-y-0.5">
                    {(activeRole === "MERCHANT" ? merchantMenuItems : customerMenuItems).map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={() => setShowAccountDropdown(false)}
                          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0076D7] hover:bg-slate-50/90 rounded-xl transition duration-150 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${item.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col text-left leading-tight min-w-0">
                              <span className="text-xs font-bold text-slate-800 group-hover:text-[#0076D7] truncate">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal truncate">
                                {item.sub}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            {item.badge && (
                              <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0076D7] group-hover:translate-x-0.5 transition" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* 3. Logout Footer */}
                  <div className="p-1.5 bg-slate-50/50">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50/80 rounded-xl transition group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-red-50 group-hover:bg-red-100 text-red-600 flex items-center justify-center shrink-0 transition">
                        <LogOut className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col text-left leading-tight">
                        <span className="text-xs font-bold">Logout</span>
                        <span className="text-[10px] text-red-400 font-normal">Sign out of this session</span>
                      </div>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {/* Login → /login?mode=login (role selection first) */}
              <Link
                href="/login?mode=login"
                className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition hover:shadow-md"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
              {/* Register → /login?mode=register (same unified page, register mode) */}
              <Link
                href="/login?mode=register"
                className="border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-2xs hidden sm:inline-flex items-center"
              >
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* 2. CATEGORIES NAVIGATION RIBBON (Exact 14 Categories from Screenshot) */}
<<<<<<< HEAD
      <div className="bg-white border-t border-slate-200/90 px-2 sm:px-3 lg:px-4 py-1.5 overflow-x-hidden no-scrollbar scrollbar-none shadow-2xs relative z-10">
=======
      <div className="relative z-10 bg-white border-t border-slate-200/90 px-2 sm:px-3 lg:px-4 py-1.5 overflow-x-hidden no-scrollbar scrollbar-none shadow-2xs">
>>>>>>> feature/superadmin
        <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between gap-1 text-[11px] xl:text-xs">
          {AP_EXPLORE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
                className={`px-2 xl:px-2.5 py-1 rounded-full whitespace-nowrap font-medium flex items-center gap-1 transition-all select-none border text-[11px] xl:text-xs shrink-0 ${
                  isSelected
                    ? "bg-[#0076D7] text-white border-[#0076D7] shadow-xs font-bold"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 shadow-2xs"
                }`}
              >
                {cat.icon && <span className="text-xs">{cat.icon}</span>}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
}
