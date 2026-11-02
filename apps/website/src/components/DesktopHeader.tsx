"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, MapPin, ChevronDown, Plus, User, Sparkles, Navigation, X, 
  ShieldCheck, Mic, Camera, LocateFixed, Zap, Bell, Target, Store, Compass
} from "lucide-react";
import { AP_EXPLORE_CATEGORIES } from "../data/exploreData";

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
}: DesktopHeaderProps) {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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
    setTimeout(() => {
      setGpsDetecting(false);
      if (onDetectLiveGps) onDetectLiveGps();
      alert(`📍 GPS Location Verified: Connected to ${selectedCity} Hyperlocal Gateway!`);
    }, 600);
  };

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-slate-200/90 shadow-2xs overflow-hidden w-full max-w-full">
      
      {/* 1. TOP MAIN WHITE NAVBAR (Matching Screenshot) */}
      <div className="max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3">
        
        {/* Left: Brand Logo + Location Selector + Detect GPS */}
        <div className="flex items-center gap-3">
          
          {/* Brand Logo: Hello-Hi with Pin Badge */}
          <div 
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
          </div>

          {/* City & Locality Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition text-left"
            >
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shrink-0" />
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-bold text-slate-900">{selectedCity}</span>
                <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                  {selectedLocality || "Hitec City"} <ChevronDown className="w-2.5 h-2.5" />
                </span>
              </div>
            </button>

            {showCityDropdown && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 overflow-hidden">
                <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Select Active Hub</span>
                  <span className="text-emerald-500 font-bold">Live</span>
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
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition ${
                      selectedCity === city
                        ? "bg-[#0076D7] text-white"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <ShieldCheck className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detect Live GPS Button */}
          <button
            onClick={handleGpsClick}
            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#0076D7] bg-blue-50/70 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition shrink-0"
          >
            <Compass className={`w-3.5 h-3.5 text-[#0076D7] ${gpsDetecting ? "animate-spin" : ""}`} />
            <span>Detect</span>
          </button>
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
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-72 overflow-y-auto">
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
          
          <button 
            onClick={() => {
              onSelectCategory(null);
              onSearchChange("");
            }}
            className="text-xs font-bold text-slate-700 hover:text-[#0076D7] transition hidden xl:block"
          >
            Home
          </button>

          <button 
            className="text-xs font-bold text-[#0076D7] bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg transition"
          >
            Explore
          </button>

          <button 
            onClick={onOpenFastDeals}
            className="text-xs font-bold text-slate-700 hover:text-[#FF6B35] transition hidden xl:flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span>Best Deals</span>
          </button>

          <button 
            onClick={() => alert("🏬 B2B Wholesale Mart: Verified bulk industrial and IT suppliers in Hyderabad")}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 transition hidden xl:flex items-center gap-1"
          >
            <Store className="w-3.5 h-3.5 text-slate-500" />
            <span>B2B Mart</span>
          </button>

          {/* FREE - Business Listing Pill Button */}
          <button
            onClick={onOpenAddBusiness}
            className="border border-[#FF6B35] text-[#FF6B35] bg-orange-50/60 hover:bg-orange-100 px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 shadow-2xs"
          >
            <span className="bg-[#FF6B35] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">FREE</span>
            <span>+ Business Listing</span>
          </button>

          {/* Notification Bell with Badge */}
          <button 
            onClick={() => alert("🔔 Notifications: 1 New fast quote received in Hitec City!")}
            className="relative p-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              1
            </span>
          </button>

          {/* User Profile Pill Button (SparkleSmart Ele... ▾) */}
          <button
            onClick={onOpenLogin}
            className="bg-[#0F172A] hover:bg-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
            <span className="max-w-[120px] truncate">{userName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

      </div>

      {/* 2. CATEGORIES NAVIGATION RIBBON (Exact 14 Categories from Screenshot) */}
      <div className="bg-white border-t border-slate-200/90 px-2 sm:px-3 lg:px-4 py-1.5 overflow-x-hidden no-scrollbar scrollbar-none shadow-2xs">
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
