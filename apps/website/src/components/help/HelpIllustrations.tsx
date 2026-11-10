"use client";

import React from "react";

export function CustomerHeroGraphic({ className = "w-44 h-44" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute w-36 h-36 rounded-full bg-blue-100/70 -z-10 blur-md" />
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Decorative Circles */}
        <circle cx="100" cy="100" r="80" fill="#EFF6FF" />
        <circle cx="160" cy="40" r="14" fill="#0076D7" opacity="0.12" />
        <circle cx="35" cy="150" r="10" fill="#FF6B35" opacity="0.12" />

        {/* Customer Avatar & Phone */}
        <g transform="translate(45, 20)">
          {/* Hair Back */}
          <ellipse cx="55" cy="55" rx="36" ry="40" fill="#1E293B" />
          
          {/* Shoulders / Torso */}
          <path d="M15 145 C15 105, 30 92, 55 92 C80 92, 95 105, 95 145 Z" fill="#93C5FD" />
          <path d="M28 145 C28 115, 38 100, 55 100 C72 100, 82 115, 82 145 Z" fill="#60A5FA" />

          {/* Neck & Face */}
          <rect x="47" y="72" width="16" height="20" rx="6" fill="#FBCFE8" />
          <ellipse cx="55" cy="52" rx="24" ry="28" fill="#FDE047" opacity="0.35" />
          <ellipse cx="55" cy="52" rx="22" ry="26" fill="#FED7AA" />

          {/* Hair Front */}
          <path d="M33 46 C35 30, 75 30, 77 46 C77 34, 68 24, 55 24 C42 24, 33 34, 33 46 Z" fill="#0F172A" />

          {/* Eyes & Smile */}
          <circle cx="47" cy="50" r="2.5" fill="#0F172A" />
          <circle cx="63" cy="50" r="2.5" fill="#0F172A" />
          <path d="M49 60 Q55 67 61 60" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Hand Holding Smartphone */}
          <g transform="translate(62, 75)">
            <rect x="0" y="0" width="34" height="60" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="2" />
            <rect x="3" y="5" width="28" height="50" rx="5" fill="#0076D7" />
            <rect x="11" y="8" width="12" height="12" rx="3" fill="#FFFFFF" />
            <text x="17" y="17" textAnchor="middle" fill="#0076D7" fontSize="8" fontWeight="bold">H</text>
            <circle cx="17" cy="35" r="7" fill="#FFFFFF" opacity="0.25" />
            {/* Hand Fingers */}
            <path d="M-4 35 C-4 28, 2 28, 4 35 L4 52 C2 56, -4 56, -4 52 Z" fill="#FED7AA" />
          </g>

          {/* Floating Help Speech Bubble */}
          <g transform="translate(-15, 10)">
            <rect x="0" y="0" width="32" height="26" rx="8" fill="#0076D7" />
            <path d="M12 26 L16 32 L20 26 Z" fill="#0076D7" />
            <text x="16" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900">?</text>
          </g>
        </g>
      </svg>
    </div>
  );
}

export function MerchantHeroGraphic({ className = "w-44 h-44" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Soft Glow */}
      <div className="absolute w-36 h-36 rounded-full bg-orange-100/70 -z-10 blur-md" />
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        <circle cx="100" cy="100" r="80" fill="#FFF7ED" />
        <circle cx="40" cy="40" r="14" fill="#FF6B35" opacity="0.12" />

        {/* Partner / Merchant Figure */}
        <g transform="translate(45, 20)">
          {/* Hair Back */}
          <ellipse cx="55" cy="50" rx="30" ry="32" fill="#0F172A" />

          {/* Shoulders / Shirt */}
          <path d="M10 145 C10 102, 28 88, 55 88 C82 88, 100 102, 100 145 Z" fill="#1E3A8A" />

          {/* Apron */}
          <path d="M26 145 L32 104 L78 104 L84 145 Z" fill="#0F172A" />
          <path d="M40 88 L40 104 M70 88 L70 104" stroke="#F59E0B" strokeWidth="3" />
          
          {/* Badge on Apron */}
          <rect x="42" y="112" width="26" height="8" rx="2" fill="#FF6B35" />
          <text x="55" y="118" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontWeight="bold">HELLO-Hi</text>
          <text x="55" y="125" textAnchor="middle" fill="#94A3B8" fontSize="4">Business Partner</text>

          {/* Neck & Face */}
          <rect x="47" y="68" width="16" height="22" rx="6" fill="#FBCFE8" />
          <ellipse cx="55" cy="50" rx="22" ry="26" fill="#FED7AA" />

          {/* Beard / Mustache */}
          <path d="M43 56 Q55 64 67 56 Q55 70 43 56 Z" fill="#1E293B" />

          {/* Eyes & Friendly Expression */}
          <circle cx="47" cy="46" r="2.5" fill="#0F172A" />
          <circle cx="63" cy="46" r="2.5" fill="#0F172A" />

          {/* Folded Arms */}
          <path d="M14 140 C20 120, 90 120, 96 140 Z" fill="#1E293B" opacity="0.95" />
          <ellipse cx="55" cy="138" rx="26" ry="7" fill="#FED7AA" />

          {/* Floating Store Icon */}
          <g transform="translate(85, 12)">
            <circle cx="16" cy="16" r="16" fill="#FF6B35" />
            <path d="M10 14 L22 14 L20 22 L12 22 Z" fill="#FFFFFF" />
            <path d="M9 14 L16 9 L23 14 Z" fill="#FDE047" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function CalendarHeroGraphic({ className = "w-44 h-44" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        {/* Soft Background Cloud */}
        <circle cx="100" cy="100" r="75" fill="#EFF6FF" />

        {/* 3D Calendar Body */}
        <g transform="translate(40, 40)">
          {/* Shadow */}
          <rect x="8" y="12" width="104" height="96" rx="16" fill="#CBD5E1" opacity="0.5" />
          
          {/* Main White Page */}
          <rect x="0" y="0" width="104" height="96" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          
          {/* Red Header Bar */}
          <path d="M0 16 C0 7.16 7.16 0 16 0 L88 0 C96.84 0 104 7.16 104 16 L104 26 L0 26 Z" fill="#EF4444" />
          
          {/* Binder Rings */}
          <rect x="22" y="-6" width="6" height="12" rx="3" fill="#64748B" />
          <rect x="50" y="-6" width="6" height="12" rx="3" fill="#64748B" />
          <rect x="76" y="-6" width="6" height="12" rx="3" fill="#64748B" />

          {/* Calendar Grid Lines */}
          <circle cx="28" cy="46" r="5" fill="#E2E8F0" />
          <circle cx="52" cy="46" r="5" fill="#E2E8F0" />
          <circle cx="76" cy="46" r="5" fill="#E2E8F0" />
          <circle cx="28" cy="68" r="5" fill="#E2E8F0" />

          {/* Green Checkmark Badge on 15th */}
          <circle cx="56" cy="68" r="18" fill="#10B981" />
          <path d="M48 68 L53 73 L64 62" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Floating Blue Speech Bubble */}
        <g transform="translate(130, 25)">
          <circle cx="20" cy="20" r="20" fill="#0076D7" />
          <text x="20" y="27" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="bold">?</text>
        </g>
      </svg>
    </div>
  );
}

export function StorefrontHeroGraphic({ className = "w-44 h-44" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        <circle cx="100" cy="100" r="75" fill="#F0FDF4" />

        {/* Storefront */}
        <g transform="translate(35, 45)">
          {/* Base Wall */}
          <rect x="15" y="32" width="100" height="72" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          
          {/* Awning Stripes */}
          <g>
            <path d="M5 16 L125 16 L120 34 L10 34 Z" fill="#0076D7" />
            <path d="M25 16 L45 16 L40 34 L20 34 Z" fill="#FFFFFF" />
            <path d="M65 16 L85 16 L80 34 L60 34 Z" fill="#FFFFFF" />
            <path d="M105 16 L125 16 L120 34 L100 34 Z" fill="#FFFFFF" />
          </g>

          {/* Roof Sign: HELLO-Hi */}
          <rect x="25" y="2" width="80" height="16" rx="4" fill="#FFFFFF" stroke="#0076D7" strokeWidth="1.5" />
          <text x="65" y="13" textAnchor="middle" fill="#0076D7" fontSize="8" fontWeight="black">HELLO<tspan fill="#FF6B35">-Hi</tspan></text>

          {/* Window & Door */}
          <rect x="25" y="44" width="34" height="40" rx="4" fill="#EFF6FF" stroke="#93C5FD" />
          <rect x="71" y="44" width="34" height="60" rx="4" fill="#F8FAFC" stroke="#94A3B8" />

          {/* "OPEN" Sign */}
          <rect x="30" y="52" width="24" height="14" rx="3" fill="#0076D7" />
          <text x="42" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="black">OPEN</text>

          {/* Green Growth Arrow */}
          <g transform="translate(108, -5)">
            <circle cx="16" cy="16" r="16" fill="#10B981" />
            <path d="M11 21 L21 11 M21 11 H13 M21 11 V19" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function SupportRepGraphic({ className = "w-36 h-36" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Circular Ambient Background */}
        <circle cx="80" cy="80" r="65" fill="#EFF6FF" />

        {/* Headset Support Rep */}
        <g transform="translate(30, 20)">
          {/* Hair */}
          <ellipse cx="50" cy="40" rx="26" ry="28" fill="#0F172A" />

          {/* Body with Hello-Hi Shirt */}
          <path d="M15 115 C15 82, 30 70, 50 70 C70 70, 85 82, 85 115 Z" fill="#0076D7" />
          
          {/* Neck & Face */}
          <rect x="44" y="54" width="12" height="18" rx="4" fill="#FED7AA" />
          <ellipse cx="50" cy="42" rx="18" ry="20" fill="#FED7AA" />

          {/* Hair Front */}
          <path d="M34 38 C35 24, 65 24, 66 38 C66 28, 58 20, 50 20 C42 20, 34 28, 34 38 Z" fill="#0F172A" />

          {/* Eyes & Smile */}
          <circle cx="43" cy="40" r="2" fill="#0F172A" />
          <circle cx="57" cy="40" r="2" fill="#0F172A" />
          <path d="M45 48 Q50 54 55 48" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Headset Band & Earpiece */}
          <path d="M30 40 C30 18, 70 18, 70 40" stroke="#334155" strokeWidth="3" fill="none" />
          <circle cx="31" cy="40" r="4.5" fill="#0F172A" />
          <path d="M31 42 Q36 54 44 52" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="44" cy="52" r="2" fill="#0076D7" />

          {/* Laptop */}
          <g transform="translate(18, 90)">
            <path d="M0 25 L64 25 L58 10 L6 10 Z" fill="#94A3B8" />
            <path d="M-6 25 L70 25 L66 28 L-2 28 Z" fill="#64748B" />
            <circle cx="32" cy="18" r="3" fill="#FFFFFF" />
          </g>

          {/* Floating Chat Bubble */}
          <g transform="translate(68, 5)">
            <rect x="0" y="0" width="28" height="20" rx="6" fill="#0076D7" />
            <circle cx="8" cy="10" r="2" fill="#FFFFFF" />
            <circle cx="14" cy="10" r="2" fill="#FFFFFF" />
            <circle cx="20" cy="10" r="2" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
    </div>
  );
}

