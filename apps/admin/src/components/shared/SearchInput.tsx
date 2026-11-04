"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 350,
  className = "",
}: SearchInputProps) {
  const [innerVal, setInnerVal] = useState(value);

  // Sync internal state with external value changes
  useEffect(() => {
    setInnerVal(value);
  }, [value]);

  // Debounced callback
  useEffect(() => {
    const handler = setTimeout(() => {
      if (innerVal !== value) {
        onChange(innerVal.trim());
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [innerVal, debounceMs, onChange, value]);

  const handleClear = () => {
    setInnerVal("");
    onChange("");
  };

  return (
    <div className={`relative flex items-center ${className}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none shrink-0" />
      <input
        type="text"
        value={innerVal}
        onChange={(e) => setInnerVal(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 bg-white border border-slate-200 rounded-xl pl-10 pr-9 text-xs sm:text-sm text-[#0B1220] placeholder-slate-400 focus:outline-none focus:border-[#0076D7] focus:ring-2 focus:ring-[#0076D7]/15 transition font-normal shadow-2xs"
      />
      {innerVal && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
