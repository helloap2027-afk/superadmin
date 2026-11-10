"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DesktopHeader } from "@/components/DesktopHeader";

interface BusinessPartnerHeaderProps {
  activeNav?: string;
}

export function BusinessPartnerHeader({ activeNav = "My Business" }: BusinessPartnerHeaderProps) {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<"Hyderabad" | "Vijayawada" | "Guntur">("Hyderabad");
  const [selectedLocality, setSelectedLocality] = useState<string | null>("Hitec City");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("hello_access_token");
        const storedUser = localStorage.getItem("hello_user");
        if (token && storedUser) {
          const parsed = JSON.parse(storedUser);
          setIsLoggedIn(true);
          setUserName(parsed.fullName || parsed.name || "User");
        }
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleCitySelect = (city: "Hyderabad" | "Vijayawada" | "Guntur") => {
    setSelectedCity(city);
    router.push(`/?city=${encodeURIComponent(city)}`);
  };

  const handleCategorySelect = (slug: string | null) => {
    setSelectedCategory(slug);
    if (slug) {
      router.push(`/?city=${encodeURIComponent(selectedCity)}&category=${encodeURIComponent(slug)}`);
    } else {
      router.push(`/?city=${encodeURIComponent(selectedCity)}`);
    }
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length > 1) {
      router.push(`/?city=${encodeURIComponent(selectedCity)}&q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <DesktopHeader
      selectedCity={selectedCity}
      onSelectCity={handleCitySelect}
      selectedLocality={selectedLocality}
      onSelectLocality={setSelectedLocality}
      selectedCategory={selectedCategory}
      onSelectCategory={handleCategorySelect}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onOpenAddBusiness={() => router.push("/register")}
      onOpenLogin={() => router.push("/login")}
      isLoggedIn={isLoggedIn}
      userName={userName}
      onDetectLiveGps={() => {
        router.push("/?city=Hyderabad");
      }}
      onOpenFastDeals={() => {
        router.push(`/?city=${encodeURIComponent(selectedCity)}`);
      }}
    />
  );
}
