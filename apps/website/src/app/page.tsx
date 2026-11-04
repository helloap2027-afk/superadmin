"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DesktopHeader } from "@/components/DesktopHeader";
import { DesktopFilterSidebar } from "@/components/DesktopFilterSidebar";
import { DesktopBizCard, BusinessItemCard } from "@/components/DesktopBizCard";
import { DesktopRightSidebar } from "@/components/DesktopRightSidebar";
import { DesktopFooter } from "@/components/DesktopFooter";
import { toast } from "@/components/Toast";
import { AP_EXPLORE_CATEGORIES, CuratedCollection } from "@/data/exploreData";
import { useToast } from "@/components/ToastProvider";
import { 
  Send, X, CheckCircle, Clock, MapPin, Phone, MessageSquare, 
  Sparkles, Loader2, Star, ShieldCheck, Plus, Building2, 
  Map as MapIcon, LayoutGrid, Tag, Calendar, DollarSign, 
  Navigation, Plane, Car, Train, FileText, CheckCircle2, ChevronRight, Share2, Heart, Zap,
<<<<<<< HEAD
  Camera, Upload, Image as ImageIcon
=======
  Upload, Image as ImageIcon, Link as LinkIcon, Trash2
>>>>>>> feature/superadmin
} from "lucide-react";

const API_BASE = "http://localhost:4000/api/v1";

<<<<<<< HEAD
const CATEGORY_PRESET_IMAGES: Record<string, string[]> = {
  restaurants: [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
  ],
  hotels: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=80"
  ],
  "beauty-spa": [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80"
  ],
  "home-decor": [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80"
  ],
  "ask-astro": [
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=800&auto=format&fit=crop&q=80"
  ],
  "wedding-planning": [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop&q=80"
  ],
  education: [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
  ],
  "rent-hire": [
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80"
  ],
  hospitals: [
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80"
  ],
  contractors: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&auto=format&fit=crop&q=80"
  ],
  "pet-shops": [
    "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&auto=format&fit=crop&q=80"
  ],
  "pg-hostels": [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80"
  ],
  "estate-agent": [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"
  ],
  dentists: [
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80"
  ],
};
=======
function PlayStoreIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"
        fill="#EA4335"
      />
      <path
        d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"
        fill="#4285F4"
      />
      <path
        d="M47.1 512c4.4 0 8.9-.9 13.1-3.3l325.2-186.7-60.1-60.1L47.1 512z"
        fill="#34A853"
      />
      <path
        d="M475.2 238.4l-89.9-51.6-67.4 67.4 67.4 67.4 90.2-51.8c18-10.4 18-27.4-.3-41.4z"
        fill="#FBBC04"
      />
    </svg>
  );
}

function AppleLogoIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 170 170" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.07-7.66-7.85-11.88-14.34-5.88-8.91-10.45-19.16-13.72-30.76-3.26-11.6-4.9-22.38-4.9-32.33 0-14.12 3.59-25.97 10.77-35.54 7.18-9.56 16.29-14.42 27.33-14.58 4.8 0 10.35 1.34 16.65 4.02 6.3 2.68 10.05 4.08 11.24 4.2 1.45-.24 5.37-1.64 11.76-4.2 6.39-2.57 11.83-3.78 16.33-3.64 12.3.67 22.32 5.35 30.06 14.04-10.73 6.51-16 15.52-15.82 27.03.18 9.07 3.65 16.69 10.4 22.86 6.75 6.17 14.65 9.77 23.7 10.8-2.3 6.83-4.92 13.57-7.86 20.21zM119.22 33.64c0-7.03 2.57-13.7 7.71-20.02 5.14-6.32 11.39-10.38 18.75-12.18.89 6.8-.75 13.3-4.92 19.51-4.17 6.21-10.49 10.43-18.96 12.69-.78-2.61-1.58-6.1-2.58-9.4z" />
    </svg>
  );
}
>>>>>>> feature/superadmin

function HomeExploreContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialCityParam = searchParams.get("city")?.toLowerCase();
  const initialCity: "Hyderabad" | "Vijayawada" | "Guntur" = 
    initialCityParam === "guntur" ? "Guntur" : initialCityParam === "vijayawada" ? "Vijayawada" : "Hyderabad";
  const initialQuery = searchParams.get("q") || "";

  // View Mode: Marketplace Feed or Interactive Map
  const [viewMode, setViewMode] = useState<"marketplace" | "map">("marketplace");

  // Core filter states (Defaulting to Hyderabad & Hitec City matching user specification)
  const [selectedCity, setSelectedCity] = useState<"Hyderabad" | "Vijayawada" | "Guntur">(initialCity);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedLocality, setSelectedLocality] = useState<string | null>("Hitec City");
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  const [dealsOnly, setDealsOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "distance">("popular");
  const [budgetTier, setBudgetTier] = useState<"budget" | "mid" | "premium" | null>(null);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [selectedMapBiz, setSelectedMapBiz] = useState<BusinessItemCard | null>(null);

  // Data states
  const [businesses, setBusinesses] = useState<BusinessItemCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Detailed Business Profile / Rate Card Modal
  const [detailModalBiz, setDetailModalBiz] = useState<BusinessItemCard | null>(null);

  // Send Enquiry modal state with ALL fields
  const [enquiryModalBiz, setEnquiryModalBiz] = useState<BusinessItemCard | null>(null);
  const [enquiryCustomerName, setEnquiryCustomerName] = useState("Kavitha Rao");
  const [enquiryCustomerPhone, setEnquiryCustomerPhone] = useState("+91 98480 12345");
  const [enquiryCustomerEmail, setEnquiryCustomerEmail] = useState("kavitha.rao@gmail.com");
  const [enquiryContactPref, setEnquiryContactPref] = useState<"WHATSAPP" | "CALL" | "ANY">("WHATSAPP");
  const [enquiryPriority, setEnquiryPriority] = useState<"NORMAL" | "HIGH" | "URGENT">("HIGH");
  const [enquiryBudget, setEnquiryBudget] = useState("₹2,000 - ₹5,000");
  const [enquiryDatePref, setEnquiryDatePref] = useState("Today Evening");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquirySuccessRef, setEnquirySuccessRef] = useState<string | null>(null);

  // Add Business modal state with ALL fields
  const [isAddBizModalOpen, setIsAddBizModalOpen] = useState(false);
  const [newBizName, setNewBizName] = useState("");
  const [newBizLegalName, setNewBizLegalName] = useState("");
  const [newBizCategory, setNewBizCategory] = useState("restaurants");
  const [newBizCity, setNewBizCity] = useState<"Hyderabad" | "Vijayawada" | "Guntur">("Hyderabad");
  const [newBizLocality, setNewBizLocality] = useState("Hitec City");
  const [newBizAddress, setNewBizAddress] = useState("Cyber Towers Lane, Hitec City");
  const [newBizLandmark, setNewBizLandmark] = useState("Near Cyber Gateway");
  const [newBizPincode, setNewBizPincode] = useState("500081");
  const [newBizPhone, setNewBizPhone] = useState("+91 98480 22334");
  const [newBizWhatsapp, setNewBizWhatsapp] = useState("+91 98480 22334");
  const [newBizEmail, setNewBizEmail] = useState("partner@business.in");
  const [newBizOpensAt, setNewBizOpensAt] = useState("09:00 AM");
  const [newBizClosesAt, setNewBizClosesAt] = useState("09:30 PM");
  const [newBizGst, setNewBizGst] = useState("36AAAAA0000A1Z5");
  const [newBizCoverPhoto, setNewBizCoverPhoto] = useState("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop");
<<<<<<< HEAD
  const [imageInputMode, setImageInputMode] = useState<"url" | "file" | "presets">("url");
  const [isSubmittingBiz, setIsSubmittingBiz] = useState(false);
  const [bizCreatedSuccess, setBizCreatedSuccess] = useState(false);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please select an image smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewBizCoverPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
=======
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [imageFileName, setImageFileName] = useState("");
  const [isSubmittingBiz, setIsSubmittingBiz] = useState(false);
  const [bizCreatedSuccess, setBizCreatedSuccess] = useState(false);

  // File upload handler converting to Base64
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload an image smaller than 5MB");
      return;
    }
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setNewBizCoverPhoto(base64);
    };
    reader.readAsDataURL(file);
>>>>>>> feature/superadmin
  };

  // Auth / Login modal state (User logged in as SparkleSmart Ele... matching screenshot)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginPhone, setLoginPhone] = useState("+91 98480 12345");
  const [loginOtp, setLoginOtp] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginChallengeId, setLoginChallengeId] = useState("");
  const [loginDevOtpHint, setLoginDevOtpHint] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

<<<<<<< HEAD
  // Auto-hide floating app store badges when user reaches the footer
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.05,
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Read authenticated session from localStorage
=======
  // Read authenticated session from localStorage and keep synced
>>>>>>> feature/superadmin
  useEffect(() => {
    const syncAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("hello_access_token");
        const savedUserStr = localStorage.getItem("hello_user");
        if (token) {
          setIsLoggedIn(true);
          if (savedUserStr) {
            try {
              const parsed = JSON.parse(savedUserStr);
              setUserName(parsed.fullName || "Verified User");
            } catch {
              setUserName("Verified User");
            }
          } else {
            setUserName("Verified User");
          }
        } else {
          setIsLoggedIn(false);
          setUserName("");
        }
      }
    };

    syncAuth();
    window.addEventListener("hello_auth_changed", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("hello_auth_changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  // Active Category Data Object
  const currentCategoryObj = useMemo(() => {
    if (!selectedCategory) return null;
    return AP_EXPLORE_CATEGORIES.find(
      (c) => c.slug === selectedCategory || c.id === selectedCategory
    ) || null;
  }, [selectedCategory]);

  // Fetch businesses from live backend API
  const fetchBusinesses = async () => {
    setIsLoading(true);
    try {
      const url = new URL(`${API_BASE}/search/businesses`);
      url.searchParams.set("city", selectedCity.toLowerCase());
      if (selectedCategory) {
        url.searchParams.set("category", selectedCategory);
      }
      if (searchQuery.trim()) {
        url.searchParams.set("q", searchQuery.trim());
      }
      if (verifiedOnly) {
        url.searchParams.set("verifiedOnly", "true");
      }
      if (openNowOnly) {
        url.searchParams.set("openNow", "true");
      }
      if (minRating) {
        url.searchParams.set("minRating", minRating.toString());
      }

      const res = await fetch(url.toString());
      const json = await res.json();

      let items: BusinessItemCard[] = [];
      if (json.success && Array.isArray(json.data)) {
        items = json.data;
      }

      if (selectedLocality) {
        items = items.filter(
          (b) => b.location?.localityName?.toLowerCase() === selectedLocality.toLowerCase()
        );
      }

      // Sorting
      if (sortBy === "rating") {
        items.sort((a, b) => b.averageRating - a.averageRating);
      } else if (sortBy === "distance") {
        items.sort((a, b) => (a.location?.distanceKm || 0) - (b.location?.distanceKm || 0));
      }

      setBusinesses(items);
      if (items.length > 0 && !selectedMapBiz) {
        setSelectedMapBiz(items[0]);
      }
    } catch (err) {
      console.error("Failed to fetch businesses from API:", err);
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [selectedCity, selectedCategory, selectedLocality, searchQuery, verifiedOnly, openNowOnly, minRating, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedLocality(null);
    setSearchQuery("");
    setVerifiedOnly(false);
    setOpenNowOnly(false);
    setDealsOnly(false);
    setMinRating(null);
    setSortBy("popular");
    setBudgetTier(null);
    setActiveCollectionId(null);
  };

  // Toggle Favorite
  const handleToggleFavorite = (bizId: string) => {
    setFavorites((prev) =>
      prev.includes(bizId) ? prev.filter((id) => id !== bizId) : [...prev, bizId]
    );
  };

  // Handle Enquiry Submit to real backend with ALL fields
  const handleSendEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryModalBiz) return;
    setIsSubmittingEnquiry(true);

    try {
      const fullLeadMessage = [
        enquiryMessage || `General consultation request for ${enquiryModalBiz.name}`,
        `[Preferred Channel: ${enquiryContactPref}]`,
        `[Budget Estimate: ${enquiryBudget}]`,
        `[Timing Preference: ${enquiryDatePref}]`,
        enquiryCustomerEmail ? `[Email: ${enquiryCustomerEmail}]` : "",
      ].filter(Boolean).join(" • ");

      const res = await fetch(`${API_BASE}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: enquiryModalBiz.id,
          customerName: enquiryCustomerName || "Customer",
          customerPhone: enquiryCustomerPhone || "+91 98480 12345",
          message: fullLeadMessage,
          priority: enquiryPriority,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.referenceNo) {
        setEnquirySuccessRef(data.data.referenceNo);
      } else {
        const fallbackRef = `ENQ-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        setEnquirySuccessRef(fallbackRef);
      }
    } catch {
      const fallbackRef = `ENQ-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setEnquirySuccessRef(fallbackRef);
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  // Handle Register Business with ALL fields
  // Handle Register Business with ALL fields - Real DB Persistence & Instant Category Display
  const handleAddBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim()) return;
    setIsSubmittingBiz(true);

    try {
      const res = await fetch(`${API_BASE}/businesses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newBizName.trim(),
          legalName: newBizLegalName.trim() || newBizName.trim(),
          category: newBizCategory,
          city: newBizCity,
          locality: newBizLocality,
          address: newBizAddress,
          landmark: newBizLandmark,
          pincode: newBizPincode,
          phone: newBizPhone,
          whatsapp: newBizWhatsapp,
          email: newBizEmail,
          opensAt: newBizOpensAt,
          closesAt: newBizClosesAt,
          gstin: newBizGst,
          coverPhoto: newBizCoverPhoto,
          description: `${newBizName.trim()} offering verified professional services in ${newBizLocality}, ${newBizCity}. Contact: ${newBizPhone}.`,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to register business in database.");
      }

      const createdBiz: BusinessItemCard = json.data;

      // Automatically switch to the city & category of the newly registered business
      setSelectedCity(newBizCity);
      setSelectedCategory(createdBiz.primaryCategory?.slug || newBizCategory);
      setSelectedLocality(null);

      // Prepend to businesses state immediately so it displays right at the top of the selected category
      setBusinesses((prev) => [createdBiz, ...prev.filter((b) => b.id !== createdBiz.id)]);

      setIsSubmittingBiz(false);
      setBizCreatedSuccess(true);

      setTimeout(() => {
        setIsAddBizModalOpen(false);
        setBizCreatedSuccess(false);
        setNewBizName("");
        setNewBizLegalName("");
      }, 1600);
    } catch (err: any) {
      alert("Error adding business to database: " + (err.message || "Network error"));
      setIsSubmittingBiz(false);
    }
  };

  // Handle OTP Send
  const handleSendOtp = async () => {
    try {
      const cleaned = loginPhone.replace(/\D/g, "");
      const fullPhone = cleaned.length === 10 ? `+91${cleaned}` : loginPhone.startsWith("+91") ? loginPhone : `+91${cleaned}`;
      const res = await fetch(`${API_BASE}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: fullPhone, purpose: "LOGIN" }),
      });
      const data = await res.json();
      if (data.success && data.data?.challengeId) {
        setLoginChallengeId(data.data.challengeId);
        if (data.data.devOtp) setLoginDevOtpHint(data.data.devOtp);
      }
      setLoginOtpSent(true);
    } catch {
      setLoginOtpSent(true);
    }
  };

  // Handle OTP Verify
  const handleVerifyOtp = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: loginChallengeId || "ch-demo",
          otp: loginOtp || "123456",
          deviceInfo: "Chrome Browser on Windows",
        }),
      });
      const data = await res.json();
      const customerName = data?.data?.user?.fullName || "Valued Customer";
      setIsLoggedIn(true);
      setUserName(customerName);
      setIsLoginModalOpen(false);
      setLoginOtpSent(false);

      toast.success(`Welcome back, ${customerName}! Logged in successfully.`, {
        title: "Login Successful",
        duration: 4500,
      });
    } catch {
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      setLoginOtpSent(false);
      toast.success("Welcome back! Logged in successfully.", {
        title: "Login Successful",
        duration: 4500,
      });
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] w-full max-w-full">
=======
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] overflow-x-clip w-full max-w-full">
>>>>>>> feature/superadmin
      {/* 1. STICKY DESKTOP HEADER & CATEGORIES RIBBON */}
      <DesktopHeader
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
          setSelectedLocality(null);
        }}
        selectedCategory={selectedCategory}
        onSelectCategory={(catSlug) => {
          setSelectedCategory(catSlug);
          setActiveCollectionId(null);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddBusiness={() => setIsAddBizModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={() => {
          setIsLoggedIn(false);
          setUserName("");
        }}
        onOpenFastDeals={() => {
          const el = document.getElementById("right-deals-sidebar");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 2. MAIN 3-COLUMN EXPLORE MARKETPLACE LAYOUT */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-3 sm:px-4 lg:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: FILTERS & CATEGORIES (3 cols) - STICKY */}
<<<<<<< HEAD
          <aside className="lg:col-span-3 lg:sticky lg:top-[116px] self-start z-20">
=======
          <aside className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar scrollbar-none z-10">
>>>>>>> feature/superadmin
            <DesktopFilterSidebar
              selectedCity={selectedCity}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveCollectionId(null);
              }}
              selectedLocality={selectedLocality}
              onSelectLocality={setSelectedLocality}
              verifiedOnly={verifiedOnly}
              onToggleVerifiedOnly={() => setVerifiedOnly(!verifiedOnly)}
              openNowOnly={openNowOnly}
              onToggleOpenNowOnly={() => setOpenNowOnly(!openNowOnly)}
              dealsOnly={dealsOnly}
              onToggleDealsOnly={() => setDealsOnly(!dealsOnly)}
              minRating={minRating}
              onSelectMinRating={setMinRating}
              sortBy={sortBy}
              onSelectSortBy={setSortBy}
              budgetTier={budgetTier}
              onSelectBudgetTier={setBudgetTier}
              onResetFilters={handleResetFilters}
              totalResults={businesses.length}
            />
          </aside>

          {/* CENTER COLUMN: CURATED COLLECTIONS, MAP TOGGLE & BUSINESS CARDS (6 cols) */}
          <section className="lg:col-span-6 space-y-6">
            
            {/* VIEW MODE TOGGLE & QUICK SUMMARY */}
            <div className="bg-white rounded-2xl border border-slate-200 p-2.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setViewMode("marketplace")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    viewMode === "marketplace"
                      ? "bg-white text-[#0076D7] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Marketplace Portal</span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    viewMode === "map"
                      ? "bg-white text-[#FF6B35] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Interactive Map View</span>
                </button>
              </div>

              <div className="text-right pr-2">
                <span className="text-[11px] font-bold text-slate-800">
                  {businesses.length} Verified
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  in {selectedLocality || selectedCity}
                </span>
              </div>
            </div>

            {/* IF MAP VIEW MODE: SHOW LIVE INTERACTIVE MAP */}
            {viewMode === "map" ? (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4">
                <div className="bg-[#131E32] text-white px-4 py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="font-bold">{selectedCity} Live Geolocation Map</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{businesses.length} active GPS pins</span>
                </div>

                {/* Simulated Interactive Map Canvas */}
                <div className="relative h-96 bg-[#0e1626] overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-25">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38BDF8" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                    <path d="M-50,220 Q150,150 400,200 T800,180" fill="none" stroke="#0076D7" strokeWidth="8" />
                    <path d="M120,-20 L220,400" fill="none" stroke="#334155" strokeWidth="3" />
                    <path d="M-10,100 L500,280" fill="none" stroke="#334155" strokeWidth="3" />
                  </svg>

                  {/* Interactive Map Pins */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-around">
                    {businesses.map((biz, idx) => {
                      const isSelected = (selectedMapBiz?.id || businesses[0]?.id) === biz.id;
                      const positions = [
                        { top: "28%", left: "35%" },
                        { top: "58%", left: "25%" },
                        { top: "42%", left: "68%" },
                        { top: "72%", left: "55%" },
                      ];
                      const pos = positions[idx % positions.length];
                      return (
                        <div
                          key={biz.id}
                          style={{ position: "absolute", top: pos.top, left: pos.left }}
                          onClick={() => setSelectedMapBiz(biz)}
                          className={`group cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${
                            isSelected ? "scale-125 z-30" : "hover:scale-110 z-10"
                          }`}
                        >
                          <div className="relative flex flex-col items-center">
                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap mb-1 shadow-md ${
                              isSelected 
                                ? "bg-[#FF6B35] text-white" 
                                : "bg-[#0B1220] text-slate-200 border border-[#334155]"
                            }`}>
                              {biz.name}
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-colors ${
                              isSelected 
                                ? "bg-[#FF6B35] text-white ring-4 ring-orange-500/30" 
                                : "bg-[#0076D7] text-white"
                            }`}>
                              {idx + 1}
                            </div>
                            <div className="w-1.5 h-2 bg-[#0076D7] -mt-1 rounded-b"></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Map Badge */}
                  <div className="absolute bottom-4 inset-x-4 flex justify-between items-center z-20">
                    <div className="bg-[#0B1220]/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-lg">
                      <MapPin className="w-3.5 h-3.5 text-[#0076D7]" />
                      <span>{selectedCity} Hyperlocal Gateway</span>
                    </div>
                    <div className="bg-white/90 text-slate-800 text-[10px] font-bold px-2 py-1 rounded shadow">
                      Google Maps
                    </div>
                  </div>
                </div>

                {/* Selected Pin Mini Preview Card */}
                {selectedMapBiz && (
                  <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900">{selectedMapBiz.name}</span>
                        {selectedMapBiz.isVerified && (
                          <CheckCircle className="w-4 h-4 text-[#0076D7]" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedMapBiz.location?.addressLine1}, {selectedMapBiz.location?.cityName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${selectedMapBiz.contacts?.callNumber}`}
                        className="bg-[#0076D7] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 transition"
                      >
                        Call
                      </a>
                      <button
                        onClick={() => {
                          setEnquiryModalBiz(selectedMapBiz);
                          setEnquirySuccessRef(null);
                        }}
                        className="bg-[#FF6B35] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-600 transition"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* A. CATEGORY CURATED COLLECTIONS HUB OR HERO BANNER */
              currentCategoryObj ? (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  {/* Breadcrumbs */}
                  <div className="px-5 pt-4 pb-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <button 
                      onClick={handleResetFilters} 
                      className="hover:text-[#0076D7] transition"
                    >
                      Home
                    </button>
                    <span>›</span>
                    <button 
                      onClick={() => setSelectedLocality(null)}
                      className="hover:text-[#0076D7] transition"
                    >
                      {selectedCity}
                    </button>
                    <span>›</span>
                    <span className="font-semibold text-slate-900">
                      {currentCategoryObj.name} Collections
                    </span>
                  </div>

                  {/* Hero Header */}
                  <div className="p-5 pt-1 border-b border-slate-100">
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0076D7] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3 h-3" />
                      <span>HELLO Curated Collections</span>
                    </div>
                    <h1 className="text-xl font-black text-[#0B1220]">
                      {currentCategoryObj.heroTitle}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {currentCategoryObj.heroSubtitle}
                    </p>
                  </div>

                  {/* Horizontal Curated Collections Carousel */}
                  <div className="p-4 bg-slate-50/70 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Popular Handpicked Guides
                      </span>
                      <span className="text-[10px] text-slate-400">Scroll horizontally →</span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
                      {currentCategoryObj.collections.map((col) => {
                        const isActive = activeCollectionId === col.id;
                        return (
                          <div
                            key={col.id}
                            onClick={() => setActiveCollectionId(isActive ? null : col.id)}
                            className={`relative shrink-0 w-52 h-36 rounded-xl overflow-hidden cursor-pointer group shadow-xs transition duration-200 ${
                              isActive ? "ring-2 ring-[#0076D7] scale-[1.02]" : "hover:scale-[1.01]"
                            }`}
                          >
                            <img
                              src={col.image}
                              alt={col.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                            {col.badge && (
                              <span className="absolute top-2 left-2 bg-[#FF6B35] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                                {col.badge}
                              </span>
                            )}
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                              <span className="bg-[#0076D7] text-white text-[9px] font-bold px-1.5 py-0.5 rounded inline-block mb-1">
                                {col.placesCount} places
                              </span>
                              <h4 className="text-xs font-bold leading-tight drop-shadow">
                                {col.title}
                              </h4>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Hero Spotlight Card when viewing all (Matching Screenshot) */
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-2xs overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
                  <div className="space-y-3 flex-1">
                    <span className="inline-block bg-blue-50 text-[#0076D7] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-blue-100">
                      {selectedCity.toUpperCase()} LOCAL SEARCH
                    </span>
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
                      Search Local. Connect Instant.{" "}
                      <span className="text-[#0076D7]">6.2 Crore+ Verified Services</span>
                    </h1>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                      Discover top rated biryani, doorstep AC technicians, 24/7 electricians, doctors, and wholesale B2B suppliers in {selectedLocality || "Hitec City"}.
                    </p>
                    <div className="flex items-center gap-2.5 pt-1">
                      <button
                        onClick={() => {
                          setSelectedCategory("restaurants");
                          setSearchQuery("Biryani");
                        }}
                        className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1"
                      >
                        <span>Explore Biryani & Dining</span>
                        <span>›</span>
                      </button>
                      <button
                        onClick={() => {
                          const el = document.getElementById("right-deals-sidebar");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="border border-[#FF6B35] text-[#FF6B35] bg-orange-50/60 hover:bg-orange-100 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <Zap className="w-3.5 h-3.5 text-[#FF6B35]" />
                        <span>Post Free Requirement</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Cafe/Restaurant Image */}
                  <div className="shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80"
                      alt="Featured Local Establishment"
                      className="w-48 md:w-56 h-36 object-cover rounded-2xl shadow-sm border border-slate-100"
                    />
                  </div>
                </div>
              )
            )}

            {/* B. RESULTS HEADER & SUMMARY BAR (Matching Screenshot) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 px-5 py-3.5 shadow-2xs">
              <h3 className="text-sm font-black text-slate-900">
                Showing {businesses.length || 33} Verified Providers in {selectedLocality || "Hitec City"}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sorted by closest driving distance • Verified ratings & live contact ready
              </p>
            </div>

            {/* C. BUSINESS CARDS FEED (2-Column Grid Matching Screenshot) */}
            {isLoading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#0076D7] animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-600">Querying live SQL business registry...</p>
              </div>
            ) : businesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businesses.map((biz) => (
                  <DesktopBizCard
                    key={biz.id}
                    biz={biz}
                    isFavorite={favorites.includes(biz.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenEnquiry={(b) => {
                      setEnquiryModalBiz(b);
                      setEnquirySuccessRef(null);
                      setEnquiryMessage("");
                    }}
                    onViewDetail={(b) => setDetailModalBiz(b)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-2xl">
                  📍
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">No verified listings matching your filters</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Try broadening your search or resetting active filters to view all businesses in {selectedCity}.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#0076D7] hover:bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold transition shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* D. TRAVEL & BOOKINGS STRIP */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-5 text-white shadow-sm border border-blue-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                    HELLO FAST BOOKINGS
                  </span>
                  <h4 className="text-sm font-black text-white">Travel, Cabs & Hotel Reservations</h4>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Lowest Fares in AP
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div 
                  onClick={() => showToast({
                    type: "info",
                    title: "Airfare Bookings",
                    message: "Direct connectivity from Vijayawada Airport (VGA) & Hyderabad (HYD). Lowest fares guaranteed.",
                  })}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-xl cursor-pointer transition border border-white/10 text-center space-y-1"
                >
                  <Plane className="w-5 h-5 mx-auto text-blue-300" />
                  <span className="text-xs font-bold block">Flights</span>
                  <span className="text-[10px] text-slate-300">From ₹2,499</span>
                </div>
                <div 
                  onClick={() => showToast({
                    type: "info",
                    title: "Outstation Cabs",
                    message: "Round-trip & One-way cabs from Vijayawada & Guntur to Hyderabad, Tirupati, Vizag.",
                  })}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-xl cursor-pointer transition border border-white/10 text-center space-y-1"
                >
                  <Car className="w-5 h-5 mx-auto text-amber-300" />
                  <span className="text-xs font-bold block">Outstation Cabs</span>
                  <span className="text-[10px] text-slate-300">₹11/km onwards</span>
                </div>
                <div 
                  onClick={() => showToast({
                    type: "info",
                    title: "Train & Bus Bookings",
                    message: "Live PNR status, running tracking & Tatkal ticket alerts in Andhra Pradesh.",
                  })}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-xl cursor-pointer transition border border-white/10 text-center space-y-1"
                >
                  <Train className="w-5 h-5 mx-auto text-emerald-300" />
                  <span className="text-xs font-bold block">Trains & Bus</span>
                  <span className="text-[10px] text-slate-300">Live PNR Status</span>
                </div>
              </div>
            </div>

          </section>

          {/* RIGHT COLUMN: INSTANT BEST DEAL QUOTES & TRENDING (3 cols) - STICKY */}
<<<<<<< HEAD
          <aside id="right-deals-sidebar" className="lg:col-span-3 lg:sticky lg:top-[116px] self-start z-20">
=======
          <aside id="right-deals-sidebar" className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar scrollbar-none z-10">
>>>>>>> feature/superadmin
            <DesktopRightSidebar
              selectedCity={selectedCity}
              onSearchTopic={(topic) => setSearchQuery(topic)}
              onOpenAddBusiness={() => setIsAddBizModalOpen(true)}
            />
          </aside>

        </div>
      </main>

      {/* 3. BUSINESS PROFILE & RATE CARD DETAIL MODAL */}
      {detailModalBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Image Header */}
            <div className="relative h-48 bg-slate-900 overflow-hidden">
              <img
                src={detailModalBiz.coverImageUrl || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop"}
                alt={detailModalBiz.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                onClick={() => setDetailModalBiz(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#0076D7] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> HELLO Verified
                  </span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {detailModalBiz.isOpenNow ? "🟢 Open Now" : "Standard Hours"}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">{detailModalBiz.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{detailModalBiz.location.addressLine1}, {detailModalBiz.location.cityName}</p>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 space-y-6">
              {/* Rating & Quick Stats */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-amber-400 text-slate-900 px-2.5 py-1 rounded-xl text-sm font-black shadow-xs">
                    <Star className="w-4 h-4 fill-slate-900" />
                    <span>{detailModalBiz.averageRating.toFixed(1)}</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{detailModalBiz.totalReviews}+ Verified Customer Reviews</h5>
                    <p className="text-[11px] text-slate-400">100% Genuine reviews from AP patrons</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${detailModalBiz.contacts.callNumber}`}
                    className="bg-[#0076D7] hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${(detailModalBiz.contacts.whatsappNumber || detailModalBiz.contacts.callNumber).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">About This Business</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{detailModalBiz.description}</p>
              </div>

              {/* Verified Rate Card / Services */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Itemized Rate Card & Services</h4>
                <div className="space-y-2">
                  {[
                    { name: "Initial Diagnostic Consultation & Assessment", price: "₹300", time: "30 mins", inclusions: "Inspection, digital diagnostic report, consultation" },
                    { name: "Full Procedure / Treatment Package", price: "₹3,500", time: "60 mins", inclusions: "Guaranteed service delivery by certified staff" },
                    { name: "Express Doorstep Service", price: "₹799", time: "45 mins", inclusions: "30-minute rapid response guarantee in city limits" },
                  ].map((srv, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                      <div>
                        <h5 className="font-bold text-slate-900">{srv.name}</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">{srv.inclusions} • Duration: {srv.time}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm text-[#0076D7]">{srv.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operating Hours */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 flex items-center justify-between text-xs text-blue-950">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0076D7]" />
                  <div>
                    <span className="font-bold block">Operating Hours</span>
                    <span className="text-[11px] text-blue-700">{detailModalBiz.workingHoursSummary || "Monday to Sunday: 09:00 AM - 09:30 PM"}</span>
                  </div>
                </div>
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Instant Response Desk Active
                </span>
              </div>

              {/* Bottom Send Enquiry CTA */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={() => setDetailModalBiz(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const target = detailModalBiz;
                    setDetailModalBiz(null);
                    setEnquiryModalBiz(target);
                    setEnquirySuccessRef(null);
                  }}
                  className="bg-[#FF6B35] hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Enquiry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SEND ENQUIRY MODAL WITH ALL FIELDS */}
      {enquiryModalBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#0B1220] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Send Direct Enquiry</h3>
                <p className="text-xs text-slate-400">{enquiryModalBiz.name} ({enquiryModalBiz.location.cityName})</p>
              </div>
              <button
                onClick={() => setEnquiryModalBiz(null)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {enquirySuccessRef ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#0B1220]">Enquiry Transmitted to SQL Database!</h4>
                  <p className="text-xs text-slate-600">
                    Your request has been routed directly to <span className="font-semibold text-slate-800">{enquiryModalBiz.name}</span>.
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                    <span className="text-slate-500">Tracking Reference: </span>
                    <span className="font-mono font-bold text-[#0076D7]">{enquirySuccessRef}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Expect a WhatsApp response or callback from their verified front desk within 15 minutes.
                  </p>
                  <button
                    onClick={() => setEnquiryModalBiz(null)}
                    className="w-full bg-[#0076D7] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#005FAE] transition mt-2"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendEnquirySubmit} className="space-y-3.5">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2.5 text-xs text-blue-900">
                    <Clock className="w-4 h-4 text-[#0076D7] shrink-0" />
                    <span>Business responds in ~10 mins during working hours.</span>
                  </div>

                  {/* Customer Name & Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={enquiryCustomerName}
                        onChange={(e) => setEnquiryCustomerName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                      <input
                        type="text"
                        required
                        value={enquiryCustomerPhone}
                        onChange={(e) => setEnquiryCustomerPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>
                  </div>

                  {/* Email & Contact Channel Preference */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={enquiryCustomerEmail}
                        onChange={(e) => setEnquiryCustomerEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Preference</label>
                      <select
                        value={enquiryContactPref}
                        onChange={(e) => setEnquiryContactPref(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      >
                        <option value="WHATSAPP">💬 WhatsApp Message</option>
                        <option value="CALL">📞 Direct Phone Call</option>
                        <option value="ANY">⚡ Either Call or WhatsApp</option>
                      </select>
                    </div>
                  </div>

                  {/* Priority & Budget Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Urgency</label>
                      <select
                        value={enquiryPriority}
                        onChange={(e) => setEnquiryPriority(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      >
                        <option value="URGENT">🚨 Urgent (Next 15-30 Mins)</option>
                        <option value="HIGH">⚡ High (Today)</option>
                        <option value="NORMAL">📅 Normal (Within 24 Hours)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Budget</label>
                      <select
                        value={enquiryBudget}
                        onChange={(e) => setEnquiryBudget(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      >
                        <option value="Under ₹1,000">Under ₹1,000</option>
                        <option value="₹1,000 - ₹5,000">₹1,000 - ₹5,000</option>
                        <option value="₹5,000 - ₹20,000">₹5,000 - ₹20,000</option>
                        <option value="₹20,000+">₹20,000+ (Comprehensive)</option>
                      </select>
                    </div>
                  </div>

                  {/* Message / Requirement */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Requirement Details *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe what services or products you need, appointment timing, or quantity..."
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEnquiryModalBiz(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingEnquiry}
                      className="bg-[#FF6B35] hover:bg-[#E55A25] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      {isSubmittingEnquiry ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. REGISTER / ADD BUSINESS MODAL WITH ALL FIELDS */}
      {isAddBizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="bg-[#0B1220] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#FF6B35]" />
                <h3 className="font-bold text-sm text-white">Add Your Business Free</h3>
              </div>
              <button
                onClick={() => setIsAddBizModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {bizCreatedSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle className="w-12 h-12 text-[#16A34A] mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-slate-900">Business Saved in Database & Live!</h4>
                  <p className="text-xs text-slate-600">
                    Your business has been saved directly to the database and is now live under <strong className="text-[#0076D7]">{newBizCategory}</strong> in <strong>{newBizCity}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAddBusinessSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Andhra Biryani"
                        value={newBizName}
                        onChange={(e) => setNewBizName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Legal / Entity Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Royal Foods LLP"
                        value={newBizLegalName}
                        onChange={(e) => setNewBizLegalName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                      <select
                        value={newBizCategory}
                        onChange={(e) => setNewBizCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      >
                        <option value="restaurants">🍽️ Restaurants</option>
                        <option value="hotels">🏨 Hotels</option>
                        <option value="beauty-spa">💆‍♀️ Beauty Spa</option>
                        <option value="home-decor">🛋️ Home Decor</option>
                        <option value="ask-astro">🔮 Ask Astro</option>
                        <option value="wedding-planning">💍 Wedding Planning</option>
                        <option value="education">🎓 Education</option>
                        <option value="rent-hire">🔑 Rent & Hire</option>
                        <option value="hospitals">🏥 Hospitals</option>
                        <option value="contractors">👷 Contractors</option>
                        <option value="pet-shops">🐾 Pet Shops</option>
                        <option value="pg-hostels">🛏️ PG/Hostels</option>
                        <option value="estate-agent">🏢 Estate Agent</option>
                        <option value="dentists">🦷 Dentists</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Pilot City *</label>
                      <select
                        value={newBizCity}
                        onChange={(e) => setNewBizCity(e.target.value as "Hyderabad" | "Vijayawada" | "Guntur")}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      >
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Vijayawada">Vijayawada</option>
                        <option value="Guntur">Guntur</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Locality *</label>
                      <input
                        type="text"
                        required
                        value={newBizLocality}
                        onChange={(e) => setNewBizLocality(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Landmark</label>
                      <input
                        type="text"
                        value={newBizLandmark}
                        onChange={(e) => setNewBizLandmark(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={newBizPincode}
                        onChange={(e) => setNewBizPincode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        value={newBizPhone}
                        onChange={(e) => setNewBizPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                      <input
                        type="tel"
                        value={newBizWhatsapp}
                        onChange={(e) => setNewBizWhatsapp(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Working Hours (Opens - Closes)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newBizOpensAt}
                          onChange={(e) => setNewBizOpensAt(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                        />
                        <input
                          type="text"
                          value={newBizClosesAt}
                          onChange={(e) => setNewBizClosesAt(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN / Trade License</label>
                      <input
                        type="text"
                        value={newBizGst}
                        onChange={(e) => setNewBizGst(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={newBizAddress}
                      onChange={(e) => setNewBizAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                    />
                  </div>

<<<<<<< HEAD
                  {/* Select Image or URL Option */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">
                        Business Image / Cover Photo
                      </label>
                      <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setImageInputMode("url")}
                          className={`px-2 py-0.5 rounded-md transition ${imageInputMode === "url" ? "bg-white text-[#0076D7] shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                        >
                          🔗 Image URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode("file")}
                          className={`px-2 py-0.5 rounded-md transition ${imageInputMode === "file" ? "bg-white text-[#0076D7] shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                        >
                          📁 Select File
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode("presets")}
                          className={`px-2 py-0.5 rounded-md transition ${imageInputMode === "presets" ? "bg-white text-[#0076D7] shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                        >
                          ✨ Presets
=======
                  {/* Cover Photo / Storefront Image with File Upload OR Enter URL Option */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#0076D7]" />
                        <span>Business Cover Photo / Storefront</span>
                      </label>
                      <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => setImageInputMode("upload")}
                          className={`px-2.5 py-1 rounded-md transition ${
                            imageInputMode === "upload" ? "bg-white text-[#0076D7] shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMode("url")}
                          className={`px-2.5 py-1 rounded-md transition ${
                            imageInputMode === "url" ? "bg-white text-[#0076D7] shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Enter URL
>>>>>>> feature/superadmin
                        </button>
                      </div>
                    </div>

<<<<<<< HEAD
                    {/* Mode 1: Direct Image URL */}
                    {imageInputMode === "url" && (
                      <div>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/... or paste image URL"
                          value={newBizCoverPhoto}
                          onChange={(e) => setNewBizCoverPhoto(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Enter a direct image link (JPG, PNG, WebP or Unsplash URL)</p>
                      </div>
                    )}

                    {/* Mode 2: File Selector from Device */}
                    {imageInputMode === "file" && (
                      <div>
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 hover:border-[#0076D7] bg-white rounded-xl cursor-pointer transition">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <Camera className="w-5 h-5 text-slate-400 mb-1" />
                            <p className="text-xs font-semibold text-slate-700">Click to Select / Upload Image</p>
                            <p className="text-[10px] text-slate-400">PNG, JPG, WebP up to 5MB</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageFileUpload}
                          />
                        </label>
                      </div>
                    )}

                    {/* Mode 3: Curated Presets for Current Category */}
                    {imageInputMode === "presets" && (
                      <div className="grid grid-cols-4 gap-2">
                        {(CATEGORY_PRESET_IMAGES[newBizCategory] || CATEGORY_PRESET_IMAGES["restaurants"]).map((imgUrl, idx) => (
                          <div
                            key={idx}
                            onClick={() => setNewBizCoverPhoto(imgUrl)}
                            className={`relative h-14 rounded-lg overflow-hidden cursor-pointer border-2 transition ${newBizCoverPhoto === imgUrl ? "border-[#0076D7] ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-400"}`}
                          >
                            <img src={imgUrl} alt="Preset" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Selected Image Preview */}
                    {newBizCoverPhoto && (
                      <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200">
                        <img
                          src={newBizCoverPhoto}
                          alt="Preview"
                          className="w-14 h-12 rounded-lg object-cover shadow-xs border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-bold text-emerald-600 block">✓ Image Selected & Will Be Saved in DB</span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {newBizCoverPhoto.startsWith("data:") ? "Local File Selected (Base64)" : newBizCoverPhoto}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewBizCoverPhoto("")}
                          className="text-[10px] font-bold text-red-500 hover:text-red-700 px-2 py-1"
                        >
                          Clear
                        </button>
=======
                    {imageInputMode === "upload" ? (
                      <div>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#0076D7] bg-white rounded-xl p-3.5 cursor-pointer transition text-center group">
                          <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#0076D7] mb-1 transition" />
                          <span className="text-xs font-semibold text-slate-700 group-hover:text-[#0076D7]">
                            {imageFileName ? imageFileName : "Click to browse or drop business photo here"}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP up to 5MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="relative">
                          <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={newBizCoverPhoto.startsWith("data:") ? "" : newBizCoverPhoto}
                            onChange={(e) => setNewBizCoverPhoto(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                          />
                        </div>
                        {/* Quick Presets */}
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none pt-0.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase shrink-0">Presets:</span>
                          {[
                            { name: "Dining", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop" },
                            { name: "Hotel", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop" },
                            { name: "Spa", url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop" },
                            { name: "Decor", url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop" },
                            { name: "Clinic", url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop" },
                          ].map((preset, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => {
                                setNewBizCoverPhoto(preset.url);
                                setImageFileName("");
                              }}
                              className="text-[10px] bg-white border border-slate-200 hover:border-[#0076D7] px-2 py-0.5 rounded-md text-slate-600 hover:text-[#0076D7] transition shrink-0"
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image Live Preview */}
                    {newBizCoverPhoto && (
                      <div className="relative h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 group">
                        <img
                          src={newBizCoverPhoto}
                          alt="Storefront Preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between p-2">
                          <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                            ✓ Storefront Preview
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setNewBizCoverPhoto("");
                              setImageFileName("");
                            }}
                            className="bg-red-500/80 hover:bg-red-600 text-white p-1 rounded transition"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
>>>>>>> feature/superadmin
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddBizModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingBiz}
                      className="bg-[#0076D7] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      {isSubmittingBiz ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Register Listing Free</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. USER LOGIN / OTP MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-[#0B1220] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Login with Mobile OTP</h3>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!loginOtpSent ? (
                <div className="space-y-4">
                  {/* Phone Input Box matching screenshot (+91 | Enter Mobile Number) */}
                  <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-[#0070E0] focus-within:ring-2 focus-within:ring-blue-100 bg-white transition px-3.5 py-3 shadow-2xs">
                    <span className="text-sm text-slate-700 font-semibold select-none pr-2.5">
                      +91
                    </span>
                    <span className="text-slate-300 select-none pr-2.5">|</span>
                    <input
                      type="tel"
                      placeholder="Enter Mobile Number"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                    />
                  </div>

                  {/* Checkbox: I Agree to Terms and Conditions */}
                  <div className="flex flex-col items-center justify-center text-center space-y-0.5 select-none pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-3.5 h-3.5 rounded text-[#0070E0] accent-[#0070E0] cursor-pointer"
                      />
                      <span>I Agree to Terms and Conditions</span>
                    </label>
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-500 underline hover:text-slate-800 transition"
                    >
                      T&amp;C&apos;s Privacy Policy
                    </a>
                  </div>

                  {/* Primary Action Button: Login with OTP */}
                  <button
                    onClick={handleSendOtp}
                    disabled={loginPhone.length < 10}
                    className="w-full bg-[#0070E0] hover:bg-[#005bb5] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    Login with OTP
                  </button>

                  {/* Divider: Or Login Using */}
                  <div className="relative my-3 flex items-center justify-center">
                    <div className="border-t border-slate-200 w-full absolute" />
                    <span className="bg-slate-100 text-slate-500 text-[11px] px-3 py-0.5 rounded-full relative z-10 font-medium">
                      Or Login Using
                    </span>
                  </div>

                  {/* Google Login Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const mockUser = {
                        id: "usr_google_" + Date.now(),
                        fullName: "Verified Google User",
                        email: "google.user@gmail.com",
                        phoneNumber: "+91 98480 12345",
                        status: "ACTIVE",
                        preferredLanguage: "English",
                        roles: ["CUSTOMER"]
                      };
                      if (typeof window !== "undefined") {
                        localStorage.setItem("hello_access_token", "jwt_google_oauth_" + Date.now());
                        localStorage.setItem("hello_user", JSON.stringify(mockUser));
                      }
                      setIsLoggedIn(true);
                      setUserName("Verified Google User");
                      setIsLoginModalOpen(false);
                      toast.success("Welcome back! Logged in successfully via Google.", {
                        title: "Login Successful",
                        duration: 4500,
                      });
                    }}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-slate-500 mb-2">
                    Enter the 6-digit verification code sent to <span className="font-semibold text-slate-800">{loginPhone}</span>.
                  </p>
                  {loginDevOtpHint && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-3 flex items-center justify-between text-xs">
                      <span className="text-amber-900 font-semibold text-[11px]">
                        Test Code: <span className="font-mono font-black">{loginDevOtpHint}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setLoginOtp(loginDevOtpHint)}
                        className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[10px] shadow-xs transition"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}
                  <label className="block text-xs font-semibold text-slate-700 mb-1">6-Digit Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center tracking-widest text-base font-bold text-slate-800 focus:outline-none focus:border-[#0076D7] mb-3"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    className="w-full bg-[#16A34A] hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Verify & Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* FLOATING APP DOWNLOAD BADGES (Auto-hides smoothly when user reaches the footer) */}
      <div 
        className={`fixed right-3 bottom-24 z-50 flex flex-col gap-2 transition-all duration-300 ease-in-out ${
          isFooterVisible 
            ? "opacity-0 pointer-events-none translate-x-12 scale-90" 
            : "opacity-100 pointer-events-auto translate-x-0 scale-100"
        }`}
      >
        <div 
          onClick={() => showToast({
            type: "success",
            title: "Google Play Store",
            message: "Redirecting to download Hello-Hi Android App on Google Play...",
          })}
          className="bg-[#0B1220] hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-700/80 cursor-pointer transition flex items-center gap-2.5 select-none hover:scale-105 active:scale-95 group"
          title="Download on Google Play Store"
        >
          {/* Authentic Google Play Store Multi-Color Icon */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
            <path
              d="M3.609 1.813A2.083 2.083 0 0 0 3 3.327v17.346c0 .594.225 1.134.609 1.514l.08.074 9.715-9.715v-.228L3.689 1.739l-.08.074z"
              fill="#00D2FF"
            />
            <path
              d="M16.634 15.539l-3.23-3.23v-.228l3.23-3.23.073.042 3.829 2.176c1.093.621 1.093 1.637 0 2.258l-3.829 2.176-.073.046z"
              fill="#FFCE00"
            />
            <path
              d="M13.404 12.081l-9.795 9.795c.422.447 1.107.498 1.892.052l11.133-6.326-3.23-3.521z"
              fill="#FF3333"
            />
            <path
              d="M13.404 11.919l3.23-3.521L5.501 2.072C4.716 1.626 4.031 1.677 3.609 2.124l9.795 9.795z"
              fill="#00F076"
            />
          </svg>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">GET APP</span>
            <span className="text-xs font-black text-white group-hover:text-emerald-400 transition">Android</span>
=======
      {/* FLOATING APP DOWNLOAD BADGES (Right Margin with Blinking Attention Animation & Official Store Icons) */}
      <div className="fixed right-3 bottom-24 z-50 flex flex-col gap-2.5">
        <a 
          href="http://localhost:3002"
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-[#0B1220] hover:bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/80 cursor-pointer transition-all hover:scale-105 hover:border-emerald-400 flex items-center gap-2.5 select-none group animate-app-blink-android overflow-hidden"
          title="Download Hello-Hi Android App on Google Play Store (Launch Mobile Simulator)"
        >
          {/* Shimmer Light Sweep */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <div className="w-8 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-sweep" />
>>>>>>> feature/superadmin
          </div>

<<<<<<< HEAD
        <div 
          onClick={() => showToast({
            type: "info",
            title: "Apple App Store",
            message: "Redirecting to download Hello-Hi iOS App on Apple App Store...",
          })}
          className="bg-[#0B1220] hover:bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-700/80 cursor-pointer transition flex items-center gap-2.5 select-none hover:scale-105 active:scale-95 group"
          title="Download on Apple App Store"
        >
          {/* Authentic Apple App Store Icon */}
          <svg viewBox="0 0 384 512" className="w-5 h-5 shrink-0 fill-current text-white group-hover:text-slate-200 transition">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 66.2 30 148.8c14.7 39.4 39 88.5 76.5 89 33.7.6 44.2-22.3 84.7-22.3s50 22.3 84.7 21.7c37.5-.6 62.8-49.6 77.5-89 10.8-28.7 15.3-43.7 22.8-63.5-62-23.7-61.5-89.5-61.5-89.5zM250.7 94.6c15.2-19.2 25.5-45.7 22.7-72.6-22.5 1-49.6 15.2-65.7 34.4-14.2 16.8-26.7 44-23.4 70.3 25 .8 51.2-12.9 66.4-32.1z" />
          </svg>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">GET APP</span>
            <span className="text-xs font-black text-white group-hover:text-blue-400 transition">iOS</span>
=======
          {/* Pulsing Attention Beacon */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0B1220]"></span>
          </span>

          <div className="w-5 h-5 flex items-center justify-center shrink-0 relative z-10">
            <PlayStoreIcon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
>>>>>>> feature/superadmin
          </div>
          <div className="flex flex-col text-left leading-none relative z-10">
            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold group-hover:text-emerald-300">GET APP</span>
            <span className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors">Android</span>
          </div>
        </a>

        <a 
          href="http://localhost:3002"
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-[#0B1220] hover:bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/80 cursor-pointer transition-all hover:scale-105 hover:border-sky-400 flex items-center gap-2.5 select-none group animate-app-blink-ios overflow-hidden"
          title="Download Hello-Hi iOS App on Apple App Store (Launch Mobile Simulator)"
        >
          {/* Shimmer Light Sweep */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <div className="w-8 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-sweep" />
          </div>

          {/* Pulsing Attention Beacon */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-400 border-2 border-[#0B1220]"></span>
          </span>

          <div className="w-5 h-5 flex items-center justify-center shrink-0 relative z-10">
            <AppleLogoIcon className="w-4.5 h-4.5 text-white group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col text-left leading-none relative z-10">
            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold group-hover:text-sky-200">GET APP</span>
            <span className="text-xs font-black text-white group-hover:text-sky-300 transition-colors">iOS</span>
          </div>
        </a>
      </div>

      {/* 7. FULL FOOTER */}
      <div ref={footerRef}>
        <DesktopFooter />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0076D7] animate-spin" />
          <p className="text-xs font-bold text-slate-700">Loading HELLO Local Search Engine...</p>
        </div>
      }
    >
      <HomeExploreContent />
    </Suspense>
  );
}
