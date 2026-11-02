"use client";

import React from "react";

interface HelloLogoProps {
  variant?: "dark" | "light"; // "dark" = Blue text on light bg (or blue/orange on dark); "light" = White text on blue bg
  size?: "sm" | "md" | "lg" | "xl";
  showTm?: boolean;
  className?: string;
}

export function HelloLogo({
  variant = "dark",
  size = "md",
  showTm = true,
  className = "",
}: HelloLogoProps) {
  const isLight = variant === "light";

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
    xl: "text-6xl",
  }[size];

  const tmSizeClasses = {
    sm: "text-[9px] -top-2 ml-0.5",
    md: "text-[11px] -top-3 ml-1",
    lg: "text-xs -top-4 ml-1",
    xl: "text-sm -top-5 ml-1.5",
  }[size];

  return (
    <div
      className={`inline-flex items-baseline font-black tracking-tight select-none ${sizeClasses} ${className}`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <span className={isLight ? "text-white" : "text-[#0076D7]"}>
        Hell
      </span>
      <span className="text-[#FF6B35]">
        o
      </span>
      {showTm && (
        <span
          className={`relative font-semibold uppercase tracking-wider ${tmSizeClasses} ${
            isLight ? "text-white/80" : "text-[#0076D7]/80"
          }`}
        >
          TM
        </span>
      )}
    </div>
  );
}
