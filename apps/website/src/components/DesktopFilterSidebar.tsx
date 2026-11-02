"use client";

import React from "react";
import { 
  Filter, CheckCircle2, Star, Clock, MapPin, RotateCcw, 
  Tag, Shield, Sparkles
} from "lucide-react";
import { AP_LOCALITIES_MAP } from "../data/exploreData";

export interface DesktopFilterSidebarProps {
  selectedCity: "Hyderabad" | "Vijayawada" | "Guntur";
  selectedCategory: string | null;
  onSelectCategory: (catSlug: string | null) => void;
  selectedLocality: string | null;
  onSelectLocality: (locality: string | null) => void;
  verifiedOnly: boolean;
  onToggleVerifiedOnly: () => void;
  openNowOnly: boolean;
  onToggleOpenNowOnly: () => void;
  dealsOnly?: boolean;
  onToggleDealsOnly?: () => void;
  minRating: number | null;
  onSelectMinRating: (rating: number | null) => void;
  sortBy?: "popular" | "rating" | "distance";
  onSelectSortBy?: (sort: "popular" | "rating" | "distance") => void;
  budgetTier?: "budget" | "mid" | "premium" | null;
  onSelectBudgetTier?: (tier: "budget" | "mid" | "premium" | null) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export function DesktopFilterSidebar({
  selectedCity,
  selectedCategory,
  onSelectCategory,
  selectedLocality = "Hitec City",
  onSelectLocality,
  verifiedOnly,
  onToggleVerifiedOnly,
  openNowOnly,
  onToggleOpenNowOnly,
  dealsOnly = false,
  onToggleDealsOnly,
  minRating,
  onSelectMinRating,
  onResetFilters,
  totalResults,
}: DesktopFilterSidebarProps) {
  const localities = AP_LOCALITIES_MAP[selectedCity] || [
    "Hitec City", "Banjara Hills", "Jubilee Hills", "Gachibowli", 
    "Madhapur", "Kondapur", "Kukatpally", "Secunderabad", "Begumpet"
  ];

  const isAllListings = !verifiedOnly && !openNowOnly && !dealsOnly && !minRating;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-5 sticky top-28">
      
      {/* 1. Header: Filters + Results Count + Reset All */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-black text-slate-900">Filters</h3>
          <p className="text-[11px] text-slate-400 font-medium">{totalResults} verified results</p>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-bold text-[#0076D7] hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* 2. VERIFICATION & STATUS */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 block">
          VERIFICATION & STATUS
        </span>
        <div className="space-y-1.5 pt-0.5">
          
          {/* All Listings */}
          <button
            onClick={onResetFilters}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
              isAllListings
                ? "bg-blue-50 text-[#0076D7] border-blue-200 shadow-2xs"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            }`}
          >
            <span>All Listings</span>
            {isAllListings && <span className="text-xs text-[#0076D7]">●</span>}
          </button>

          {/* Verified Only */}
          <button
            onClick={onToggleVerifiedOnly}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              verifiedOnly
                ? "bg-blue-50 text-[#0076D7] border-blue-200 shadow-2xs"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#0076D7]" />
            <span>Verified Only</span>
          </button>

          {/* 4.8+ Top Rated */}
          <button
            onClick={() => onSelectMinRating(minRating === 4.8 ? null : 4.8)}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              minRating === 4.8
                ? "bg-blue-50 text-[#0076D7] border-blue-200 shadow-2xs"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>4.8+ Top Rated</span>
          </button>

          {/* Open Now */}
          <button
            onClick={onToggleOpenNowOnly}
            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              openNowOnly
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Open Now</span>
          </button>

          {/* Deals & Offers */}
          {onToggleDealsOnly && (
            <button
              onClick={onToggleDealsOnly}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                dealsOnly
                  ? "bg-orange-50 text-[#FF6B35] border-orange-200 shadow-2xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>Deals & Offers</span>
            </button>
          )}

        </div>
      </div>

      {/* 3. LOCALITIES IN HYDERABAD */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 block">
          LOCALITIES IN {selectedCity.toUpperCase()}
        </span>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {localities.map((loc) => {
            const isSelected = selectedLocality?.toLowerCase() === loc.toLowerCase();
            return (
              <button
                key={loc}
                onClick={() => onSelectLocality(isSelected ? null : loc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1 ${
                  isSelected
                    ? "bg-[#0076D7] border-[#0076D7] text-white shadow-2xs font-bold"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                {isSelected && <MapPin className="w-3 h-3 text-white" />}
                <span>{loc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. COMMERCIAL CATEGORIES */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 block">
          COMMERCIAL CATEGORIES
        </span>
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition border ${
            selectedCategory === null
              ? "bg-blue-50 text-[#0076D7] border-blue-200"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>🌟</span>
          <span>All Categories</span>
        </button>
      </div>

    </div>
  );
}
