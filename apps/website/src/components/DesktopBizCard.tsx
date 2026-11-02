"use client";

import React from "react";
import { 
  CheckCircle2, Star, Clock, Phone, MessageSquare, Send, MapPin, 
  Heart, Navigation, Tag
} from "lucide-react";

export interface BusinessItemCard {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  coverImageUrl?: string;
  isVerified: boolean;
  isOpenNow: boolean;
  workingHoursSummary?: string;
  averageRating: number;
  totalReviews: number;
  totalEnquiries: number;
  dealOffer?: string;
  priceForTwoOrConsultation?: string;
  yearsInBusiness?: number;
  primaryCategory?: {
    id: string;
    name: string;
    slug: string;
  };
  location: {
    addressLine1: string;
    landmark?: string;
    localityName: string;
    cityName: string;
    pincode: string;
    distanceKm?: number;
    latitude: number;
    longitude: number;
  };
  contacts: {
    callNumber: string;
    whatsappNumber?: string;
  };
  featuredSpecialty?: {
    name: string;
    rate: string;
  };
}

export interface DesktopBizCardProps {
  biz: BusinessItemCard;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenEnquiry: (biz: BusinessItemCard) => void;
  onViewDetail?: (biz: BusinessItemCard) => void;
}

export function DesktopBizCard({
  biz,
  isFavorite,
  onToggleFavorite,
  onOpenEnquiry,
  onViewDetail,
}: DesktopBizCardProps) {
  const cleanPhone = (biz.contacts.whatsappNumber || biz.contacts.callNumber).replace(/\D/g, "");

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${biz.name}, ${biz.location.localityName}, ${biz.location.cityName}`
  )}`;

  const hasImage = Boolean(biz.coverImageUrl);
  const isAmnesia = biz.slug?.includes("amnesia") || biz.name?.toLowerCase().includes("amnesia");
  const isSparkle = biz.slug?.includes("sparklesmart") || biz.name?.toLowerCase().includes("sparklesmart");

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between group">
      
      <div>
        {/* Card Top Image if available or for Amnesia */}
        {(hasImage || isAmnesia) && (
          <div 
            onClick={() => onViewDetail && onViewDetail(biz)}
            className="relative h-44 w-full bg-slate-900 overflow-hidden cursor-pointer"
          >
            <img
              src={biz.coverImageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"}
              alt={biz.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Badges on Image */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
              <div className="flex flex-col gap-1.5 items-start">
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                  ✓ Hellow Verified
                </span>
                {(biz.dealOffer || isAmnesia) && (
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-xs">
                    {biz.dealOffer || "1+1 on Craft Cocktails & Sunset Lake Seating"}
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(biz.id);
                }}
                className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition shadow"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
              </button>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-4 space-y-2.5">
          
          {/* Header Row: Title & Top Right Heart (if no image) */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 
                onClick={() => onViewDetail && onViewDetail(biz)}
                className="text-sm font-black text-slate-900 hover:text-[#0076D7] cursor-pointer transition leading-snug line-clamp-1"
              >
                {biz.name}
              </h3>
              
              {/* Verified Tag if no top image */}
              {!hasImage && !isAmnesia && (
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Verified</span>
                </div>
              )}
            </div>

            {(!hasImage && !isAmnesia) && (
              <button
                onClick={() => onToggleFavorite(biz.id)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            )}
          </div>

          {/* Location & Distance */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">
              {biz.location.localityName || "Hitec City"}, {biz.location.cityName || "Hyderabad"}
            </span>
            <span className="text-[#0076D7] font-bold shrink-0">• 0.5 km away</span>
          </div>

          {/* Ratings & Open status */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="bg-emerald-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              ★ {biz.averageRating ? biz.averageRating.toFixed(1) : "4.8"}
            </span>
            <span className="text-slate-500 text-[11px]">
              ({biz.totalReviews || 340} Ratings)
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Open Now</span>
            </span>
            {(isAmnesia || biz.priceForTwoOrConsultation) && (
              <span className="text-slate-400 text-[11px]">
                • {biz.priceForTwoOrConsultation || "₹2,200 for two"}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {biz.description || "Govt. licensed residential and high-rise IT corridor wiring experts. 24/7 emergency response in Hitec City."}
          </p>

          {/* Featured Specialty Box (like SparkleSmart) */}
          {(isSparkle || biz.featuredSpecialty) && (
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div className="truncate pr-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                  FEATURED SPECIALTY & RATE
                </span>
                <span className="text-[11px] font-bold text-slate-800 truncate block">
                  {biz.featuredSpecialty?.name || "Smart Home Touch WiFi Switch Setup ..."}
                </span>
              </div>
              <span className="text-xs font-black text-[#0076D7] bg-white border border-blue-200 px-2 py-0.5 rounded-lg shrink-0">
                {biz.featuredSpecialty?.rate || "₹499"}
              </span>
            </div>
          )}

          {/* Cuisine Tags for Amnesia */}
          {isAmnesia && (
            <div className="text-[11px] font-medium text-slate-500 truncate pt-0.5">
              Continental, Pan-Asian, Cocktails & Lake View
            </div>
          )}

        </div>
      </div>

      {/* 4 SOLID ACTION BUTTONS BAR (Call, WhatsApp, Directions, Enquire) */}
      <div className="p-3 pt-0 grid grid-cols-4 gap-1.5 border-t border-slate-100">
        
        {/* 1. Call */}
        <a
          href={`tel:${biz.contacts.callNumber}`}
          className="bg-[#0076D7] hover:bg-[#005FAE] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition"
        >
          <Phone className="w-3 h-3 text-white" />
          <span>Call</span>
        </a>

        {/* 2. WhatsApp */}
        <a
          href={`https://wa.me/${cleanPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#10B981] hover:bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition"
        >
          <MessageSquare className="w-3 h-3 text-white" />
          <span>WhatsApp</span>
        </a>

        {/* 3. Directions */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0F172A] hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition"
        >
          <Navigation className="w-3 h-3 text-white" />
          <span className="hidden sm:inline">Directions</span>
          <span className="sm:hidden">Map</span>
        </a>

        {/* 4. Enquire */}
        <button
          onClick={() => onOpenEnquiry(biz)}
          className="bg-[#FF6B35] hover:bg-[#E5531E] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs transition"
        >
          <Send className="w-3 h-3 text-white" />
          <span>Enquire</span>
        </button>

      </div>

    </div>
  );
}
