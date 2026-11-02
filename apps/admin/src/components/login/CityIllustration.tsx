"use client";

import React from "react";

export function CityIllustration() {
  return (
    <div className="absolute right-0 bottom-0 w-[520px] max-w-full h-[280px] pointer-events-none select-none overflow-hidden z-10 opacity-85">
      <svg
        viewBox="0 0 520 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover object-bottom"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="skylineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E88E5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0D47A1" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="skylineGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#29B6F6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0288D1" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="treeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1B5E20" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="fadeMask" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0076D7" stopOpacity="0" />
            <stop offset="70%" stopColor="#0076D7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0056B8" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Distant Skyscrapers */}
        <g opacity="0.45">
          <rect x="20" y="80" width="35" height="150" fill="url(#skylineGrad1)" rx="2" />
          <rect x="65" y="50" width="45" height="180" fill="url(#skylineGrad1)" rx="3" />
          <polygon points="87,30 65,50 110,50" fill="url(#skylineGrad1)" />
          <rect x="120" y="90" width="40" height="140" fill="url(#skylineGrad1)" rx="2" />
          <rect x="170" y="40" width="55" height="190" fill="url(#skylineGrad1)" rx="3" />
          <polygon points="197,15 170,40 225,40" fill="url(#skylineGrad1)" />
          <rect x="235" y="70" width="50" height="160" fill="url(#skylineGrad1)" rx="2" />
          <rect x="295" y="100" width="45" height="130" fill="url(#skylineGrad1)" rx="2" />
          <rect x="350" y="45" width="60" height="185" fill="url(#skylineGrad1)" rx="3" />
          <polygon points="380,20 350,45 410,45" fill="url(#skylineGrad1)" />
          <rect x="420" y="85" width="45" height="145" fill="url(#skylineGrad1)" rx="2" />
          <rect x="475" y="60" width="40" height="170" fill="url(#skylineGrad1)" rx="2" />
        </g>

        {/* Midground High-Rises */}
        <g opacity="0.65">
          <rect x="50" y="110" width="40" height="140" fill="url(#skylineGrad2)" rx="2" />
          <rect x="100" y="85" width="48" height="165" fill="url(#skylineGrad2)" rx="3" />
          <rect x="155" y="120" width="38" height="130" fill="url(#skylineGrad2)" rx="2" />
          <rect x="200" y="95" width="52" height="155" fill="url(#skylineGrad2)" rx="3" />
          <rect x="260" y="115" width="46" height="135" fill="url(#skylineGrad2)" rx="2" />
          <rect x="315" y="80" width="56" height="170" fill="url(#skylineGrad2)" rx="4" />
          <polygon points="343,55 315,80 371,80" fill="url(#skylineGrad2)" />
          <rect x="380" y="105" width="50" height="145" fill="url(#skylineGrad2)" rx="2" />
          <rect x="440" y="125" width="44" height="125" fill="url(#skylineGrad2)" rx="2" />
        </g>

        {/* Windows and Lighting Details */}
        <g opacity="0.5" fill="#E1F5FE">
          <circle cx="70" cy="130" r="1.5" />
          <circle cx="78" cy="130" r="1.5" />
          <circle cx="70" cy="145" r="1.5" />
          <circle cx="78" cy="145" r="1.5" />
          <circle cx="120" cy="110" r="1.5" />
          <circle cx="128" cy="110" r="1.5" />
          <circle cx="120" cy="125" r="1.5" />
          <circle cx="128" cy="125" r="1.5" />
          <circle cx="220" cy="120" r="1.5" />
          <circle cx="230" cy="120" r="1.5" />
          <circle cx="220" cy="135" r="1.5" />
          <circle cx="230" cy="135" r="1.5" />
          <circle cx="335" cy="105" r="1.5" />
          <circle cx="345" cy="105" r="1.5" />
          <circle cx="335" cy="120" r="1.5" />
          <circle cx="345" cy="120" r="1.5" />
          <circle cx="400" cy="130" r="1.5" />
          <circle cx="410" cy="130" r="1.5" />
        </g>

        {/* Foreground Modern Buildings & Residential Terraces */}
        <rect x="180" y="190" width="90" height="70" fill="#E2E8F0" rx="3" />
        <rect x="190" y="200" width="20" height="25" fill="#90CAF9" rx="1" />
        <rect x="215" y="200" width="20" height="25" fill="#90CAF9" rx="1" />
        <rect x="240" y="200" width="20" height="25" fill="#90CAF9" rx="1" />
        <rect x="280" y="180" width="110" height="80" fill="#CBD5E1" rx="3" />
        <rect x="295" y="192" width="24" height="20" fill="#64B5F6" rx="1" />
        <rect x="325" y="192" width="24" height="20" fill="#64B5F6" rx="1" />
        <rect x="355" y="192" width="24" height="20" fill="#64B5F6" rx="1" />

        {/* Lush Green Trees and Landscape */}
        <g fill="url(#treeGrad)">
          <circle cx="90" cy="245" r="28" />
          <circle cx="125" cy="240" r="32" />
          <circle cx="160" cy="248" r="26" />
          <circle cx="210" cy="255" r="24" />
          <circle cx="260" cy="250" r="28" />
          <circle cx="310" cy="245" r="30" />
          <circle cx="355" cy="240" r="34" />
          <circle cx="400" cy="246" r="30" />
          <circle cx="445" cy="242" r="32" />
          <circle cx="485" cy="248" r="28" />
          <circle cx="515" cy="252" r="25" />
        </g>

        {/* Ambient Foreground Green Hills */}
        <path
          d="M0 260 Q 150 240, 300 255 T 520 250 L 520 280 L 0 280 Z"
          fill="#1B5E20"
          opacity="0.9"
        />

        {/* Soft Blue Atmospheric Gradient Fade */}
        <rect x="0" y="0" width="520" height="280" fill="url(#fadeMask)" />
      </svg>
    </div>
  );
}
