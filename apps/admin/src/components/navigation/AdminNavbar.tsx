"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  MapPin,
  ChevronDown,
  User,
  Settings as SettingsIcon,
  LogOut,
  Check
} from "lucide-react";
import { useAdminProfile } from "@/context/AdminProfileContext";

export interface AdminNavbarProps {
  onToggleSidebar: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  unreadNotifications?: number;
  selectedLocation?: string;
  onSelectLocation?: (location: string) => void;
  adminName?: string;
  adminRole?: string;
  onSelectTab?: (tab: string) => void;
}

export function AdminNavbar({
  onToggleSidebar,
  searchQuery = "",
  onSearchChange,
  unreadNotifications: initialUnread,
  selectedLocation = "Hyderabad",
  onSelectLocation,
  adminName = "Admin User",
  adminRole = "Super Admin",
  onSelectTab,
}: AdminNavbarProps) {
  const router = useRouter();
  const { profile, logout } = useAdminProfile();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState(selectedLocation);
  const [imgError, setImgError] = useState(false);
  const [navNotifs, setNavNotifs] = useState<any[]>([]);
  const [liveUnreadCount, setLiveUnreadCount] = useState<number>(initialUnread ?? 0);

  // Dynamically fetch live unread notifications count from backend
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/v1/notifications/counts");
        const json = await res.json();
        if (json?.success && json.data) {
          setLiveUnreadCount(json.data.adminUnread ?? json.data.totalUnread ?? 0);
        }
      } catch {}
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadNotifications = liveUnreadCount;

  useEffect(() => {
    if (isNotificationsOpen) {
      fetch("http://localhost:4000/api/v1/admin/notifications?pageSize=4")
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.data)) {
            setNavNotifs(d.data);
          }
        })
        .catch(() => {});
    }
  }, [isNotificationsOpen]);

  const displayName = profile?.fullName || adminName || "Admin User";
  const displayRole = profile?.role || adminRole || "Super Admin";
  const displayEmail = profile?.email || "admin@hello-hi.in";
  const avatarUrl = profile?.avatarUrl;

  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const getInitials = (name?: string) => {
    if (!name) return "AU";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const locationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const availableCities = [
    "Hyderabad",
    "Vijayawada",
    "Visakhapatnam",
    "Guntur",
    "Tirupati",
    "Bengaluru",
    "All Regions"
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: string) => {
    setCurrentCity(city);
    if (onSelectLocation) onSelectLocation(city);
    setIsLocationOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hello_admin_session");
    }
    router.push("/login");
  };

  return (
    <header
      className="h-[76px] bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0 select-none"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* =========================================================================
          LEFT: HAMBURGER TOGGLE + GLOBAL SEARCH BAR
         ========================================================================= */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {/* Hamburger Sidebar Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 text-[#0B1220] hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          title="Toggle Navigation"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-[22px] h-[22px]" />
        </button>

        {/* Global Search Field with "Ctrl + K" badge */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search here... (listings, users, enquiries, etc.)"
              className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-20 text-xs sm:text-sm text-[#0B1220] placeholder-[#94A3B8] focus:outline-none focus:border-[#0076D7] focus:ring-2 focus:ring-[#0076D7]/10 transition font-normal"
            />
            {/* Shortcut Badge */}
            <div className="absolute right-2.5 flex items-center">
              <span className="bg-white border border-[#E2E8F0] text-[11px] font-medium text-[#94A3B8] px-2 py-0.5 rounded-md shadow-2xs">
                Ctrl + K
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT: NOTIFICATION + LOCATION + USER PROFILE
         ========================================================================= */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        
        {/* 1. Notification Control */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#0B1220] transition-colors relative"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[#0B1220]" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs border-2 border-white">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B1220]">Live Notifications</span>
                {unreadNotifications > 0 && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await fetch("http://localhost:4000/api/v1/admin/notifications/mark-all-read", { method: "POST" });
                        if (onSelectTab) onSelectTab("Notifications");
                      } catch {}
                    }}
                    className="text-[11px] font-medium text-[#0076D7] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 text-xs">
                {(!Array.isArray(navNotifs) || navNotifs.length === 0) ? (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    No recent notifications in database
                  </div>
                ) : (
                  navNotifs.map((n) => {
                    let dateStr = "Recent";
                    try {
                      if (n.created_at) {
                        dateStr = new Date(n.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        });
                      }
                    } catch {}
                    return (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (onSelectTab) onSelectTab("Notifications");
                        setIsNotificationsOpen(false);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-800 truncate pr-2">{n.title}</p>
                        {n.is_read === 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0076D7] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {dateStr}
                      </span>
                    </div>
                  );})
                )}
              </div>
              <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectTab) onSelectTab("Notifications");
                    setIsNotificationsOpen(false);
                  }}
                  className="text-xs font-semibold text-[#0076D7] hover:underline"
                >
                  View All Notifications &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Location Selector */}
        <div className="relative" ref={locationRef}>
          <button
            type="button"
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors text-xs sm:text-sm font-medium text-[#0B1220]"
          >
            <MapPin className="w-4 h-4 text-[#0076D7] shrink-0" />
            <span className="font-semibold">{currentCity}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          </button>

          {/* Location Dropdown */}
          {isLocationOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select City
              </div>
              {availableCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="w-full text-left px-3 py-2 text-xs flex items-center justify-between text-slate-700 hover:bg-blue-50 hover:text-[#0076D7] transition"
                >
                  <span className={city === currentCity ? "font-bold text-[#0076D7]" : ""}>
                    {city}
                  </span>
                  {city === currentCity && <Check className="w-3.5 h-3.5 text-[#0076D7]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. Administrator Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 pl-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            {/* 40px Circular Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0076D7] to-[#1689ED] p-0.5 shadow-xs shrink-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {avatarUrl && !imgError ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="font-bold text-xs text-[#0076D7]">
                    {getInitials(displayName)}
                  </span>
                )}
              </div>
            </div>

            {/* User Title & Role */}
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs sm:text-sm font-semibold text-[#0B1220] leading-tight">
                {displayName}
              </span>
              <span className="text-[11px] text-[#64748B] font-normal leading-tight">
                {displayRole}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block shrink-0" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-[#0B1220] truncate">{displayName}</p>
                <p className="text-[11px] text-[#64748B] truncate">{displayEmail}</p>
              </div>

              <div className="py-1 text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onSelectTab) {
                      onSelectTab("Profile");
                    } else {
                      router.push("/profile");
                    }
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2.5 transition"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile Overview</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    setIsProfileOpen(false);
                    await logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
