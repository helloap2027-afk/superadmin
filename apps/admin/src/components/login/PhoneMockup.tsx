"use client";

import React from "react";
import {
  Search,
  MapPin,
  Utensils,
  ShieldAlert,
  Home,
  Building,
  GraduationCap,
  Car,
  Smartphone,
  MoreHorizontal,
  ChevronDown
} from "lucide-react";

export function PhoneMockup() {
  return (
    <div className="relative select-none pointer-events-none transform transition-transform duration-500 hover:rotate-0 rotate-[3deg] drop-shadow-2xl">
      {/* Outer Phone Hardware Chassis (Titanium Matte) */}
      <div className="w-[250px] lg:w-[270px] xl:w-[295px] 2xl:w-[315px] h-[500px] lg:h-[530px] xl:h-[570px] 2xl:h-[610px] max-h-[78vh] bg-[#1E293B] rounded-[42px] sm:rounded-[48px] p-2.5 sm:p-3 shadow-2xl ring-1 ring-white/30 border-4 border-[#334155] relative flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-3.5 sm:h-4 bg-black rounded-full z-40 flex items-center justify-center">
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#1E293B] mr-2"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40"></div>
        </div>

        {/* Screen Bezel & Display Area */}
        <div className="flex-1 bg-white rounded-[38px] overflow-hidden flex flex-col relative text-slate-800 font-sans">
          
          {/* Status Bar */}
          <div className="pt-3 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-800 z-30">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              {/* Signal Bars */}
              <div className="flex items-end gap-0.5 h-2.5">
                <span className="w-0.5 h-1 bg-slate-800 rounded-xs"></span>
                <span className="w-0.5 h-1.5 bg-slate-800 rounded-xs"></span>
                <span className="w-0.5 h-2 bg-slate-800 rounded-xs"></span>
                <span className="w-0.5 h-2.5 bg-slate-800 rounded-xs"></span>
              </div>
              {/* Battery */}
              <div className="w-4 h-2.5 border border-slate-800 rounded-xs p-0.5 flex items-center">
                <div className="w-2.5 h-full bg-slate-800 rounded-2xs"></div>
              </div>
            </div>
          </div>

          {/* App Header (Brand Logo + Hyderabad Location) */}
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-baseline font-black tracking-tight text-xl leading-none">
              <span className="text-[#0076D7]">Hell</span>
              <span className="text-[#FF6B35]">o</span>
              <span className="text-[7px] text-[#0076D7] ml-0.5 relative -top-1.5 font-bold">TM</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
              <MapPin className="w-3 h-3 text-[#0076D7]" />
              <span>Hyderabad</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="px-4 py-1.5">
            <div className="relative bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-3 pr-8 flex items-center">
              <span className="text-[10px] text-slate-400 truncate">
                Search for services, shops, products...
              </span>
              <Search className="w-3.5 h-3.5 text-[#0076D7] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* 8 Categories Grid (2x4) */}
          <div className="px-4 pt-3 pb-2">
            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Category 1: Restaurants */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shadow-2xs">
                  <Utensils className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-semibold text-slate-700 leading-tight">Restaurants</span>
              </div>

              {/* Category 2: Doctors */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-semibold text-slate-700 leading-tight">Doctors</span>
              </div>

              {/* Category 3: Home Services */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-2xs">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-semibold text-slate-700 leading-tight">Home Services</span>
              </div>

              {/* Category 4: Real Estate */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shadow-2xs">
                  <Building className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-semibold text-slate-700 leading-tight">Real Estate</span>
              </div>

              {/* Category 5: Education */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-semibold text-slate-700 leading-tight">Education</span>
              </div>

              {/* Category 6: Automotive */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-2xs">
                  <Car className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-semibold text-slate-700 leading-tight">Automotive</span>
              </div>

              {/* Category 7: Electronics */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-semibold text-slate-700 leading-tight">Electronics</span>
              </div>

              {/* Category 8: More */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-semibold text-slate-700 leading-tight">More</span>
              </div>
            </div>
          </div>

          {/* Featured Near You Section */}
          <div className="px-4 pt-1 flex-1 flex flex-col justify-between pb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Featured Near You</span>
              <span className="text-[10px] font-semibold text-[#0076D7] hover:underline">See All</span>
            </div>

            {/* 2 Featured Discovery Cards */}
            <div className="grid grid-cols-2 gap-2 flex-1">
              {/* Card 1: Restaurants */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
                <div className="h-16 bg-gradient-to-br from-amber-600 to-amber-900 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&auto=format&fit=crop&q=70"
                    alt="Restaurants"
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                <div className="p-2">
                  <span className="text-[10px] font-bold text-slate-900 block truncate">Restaurants</span>
                  <span className="text-[8px] font-medium text-slate-500">1200+ Listings</span>
                </div>
              </div>

              {/* Card 2: Home Services */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
                <div className="h-16 bg-gradient-to-br from-blue-700 to-slate-900 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=70"
                    alt="Home Services"
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                <div className="p-2">
                  <span className="text-[10px] font-bold text-slate-900 block truncate">Home Services</span>
                  <span className="text-[8px] font-medium text-slate-500">800+ Listings</span>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Bottom Home Bar */}
          <div className="pb-1.5 flex justify-center">
            <div className="w-24 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
