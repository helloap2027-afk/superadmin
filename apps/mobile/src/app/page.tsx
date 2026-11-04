"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Search,
  Mic,
  Camera,
  Bell,
  Home,
  MessageSquare,
  PlusCircle,
  User,
  Star,
  CheckCircle2,
  Phone,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Building2,
  Briefcase,
  Users,
  CheckCircle,
  X,
  Send,
  Loader2,
  Clock,
  ShieldCheck,
  Compass,
  FileText,
  Upload,
  AlertTriangle,
  AlertCircle,
  Trash2,
  ExternalLink,
  Store,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "@/components/Toast";

const API_BASE = "http://localhost:4000/api/v1";

interface MobileCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  badge?: string;
  bgColor: string;
  textColor: string;
}

// All 14 Categories matching the website exactly
const ALL_14_SERVICES: MobileCategory[] = [
  { id: "restaurants", name: "Restaurants", slug: "restaurants", icon: "🍽️", bgColor: "bg-orange-50", textColor: "text-orange-600" },
  { id: "hotels", name: "Hotels", slug: "hotels", icon: "🏨", bgColor: "bg-blue-50", textColor: "text-blue-600" },
  { id: "beauty-spa", name: "Beauty Spa", slug: "beauty-spa", icon: "💆‍♀️", bgColor: "bg-pink-50", textColor: "text-pink-600" },
  { id: "home-decor", name: "Home Decor", slug: "home-decor", icon: "🛋️", bgColor: "bg-amber-50", textColor: "text-amber-600" },
  { id: "ask-astro", name: "Ask Astro", slug: "ask-astro", icon: "🔮", bgColor: "bg-purple-50", textColor: "text-purple-600" },
  { id: "wedding-planning", name: "Wedding Planning", slug: "wedding-planning", icon: "💍", bgColor: "bg-rose-50", textColor: "text-rose-600" },
  { id: "education", name: "Education", slug: "education", icon: "🎓", bgColor: "bg-indigo-50", textColor: "text-indigo-600" },
  { id: "rent-hire", name: "Rent & Hire", slug: "rent-hire", icon: "🔑", bgColor: "bg-yellow-50", textColor: "text-yellow-600" },
  { id: "hospitals", name: "Hospitals", slug: "hospitals", icon: "🏥", bgColor: "bg-red-50", textColor: "text-red-600" },
  { id: "contractors", name: "Contractors", slug: "contractors", icon: "👷", bgColor: "bg-amber-50", textColor: "text-amber-700" },
  { id: "pet-shops", name: "Pet Shops", slug: "pet-shops", icon: "🐾", bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
  { id: "pg-hostels", name: "PG/Hostels", slug: "pg-hostels", icon: "🛏️", bgColor: "bg-cyan-50", textColor: "text-cyan-600" },
  { id: "estate-agent", name: "Estate Agent", slug: "estate-agent", icon: "🏢", bgColor: "bg-slate-50", textColor: "text-slate-700" },
  { id: "dentists", name: "Dentists", slug: "dentists", icon: "🦷", bgColor: "bg-teal-50", textColor: "text-teal-600" },
];

interface MobileBusiness {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryLabel: string;
  rating: number;
  reviewsCount: number;
  statusText: string;
  isOpen: boolean;
  locality: string;
  cityName: string;
  workingHours: string;
  phone: string;
  whatsapp: string;
  icon: string;
  specialty?: string;
}

const DEFAULT_BUSINESSES: MobileBusiness[] = [
  {
    id: "biz-amnesia-hyd",
    name: "Amnesia Sky Bar & Lakeview Rooftop",
    slug: "amnesia-sky-bar",
    categorySlug: "restaurants",
    categoryLabel: "Restaurants & Dining",
    rating: 4.8,
    reviewsCount: 980,
    statusText: "Open Now",
    isOpen: true,
    locality: "Hitec City",
    cityName: "Hyderabad",
    workingHours: "12:00 PM - 01:00 AM",
    phone: "+919848012345",
    whatsapp: "+919848012345",
    icon: "🍽️",
    specialty: "Continental, Pan-Asian, Cocktails & Sunset View"
  },
  {
    id: "biz-sparkle-hyd",
    name: "SparkleSmart Electrical Solutions & Automation",
    slug: "sparklesmart-electrical",
    categorySlug: "contractors",
    categoryLabel: "Contractors & Electrical",
    rating: 4.8,
    reviewsCount: 340,
    statusText: "Open Now",
    isOpen: true,
    locality: "Hitec City",
    cityName: "Hyderabad",
    workingHours: "24/7 Emergency Service",
    phone: "+919848023456",
    whatsapp: "+919848023456",
    icon: "👷",
    specialty: "Smart Home Touch WiFi Switch Setup • ₹499"
  },
  {
    id: "biz-novotel-vja",
    name: "Novotel Varun Hotel & Suites",
    slug: "novotel-varun-hotel",
    categorySlug: "hotels",
    categoryLabel: "Hotels & Stays",
    rating: 4.9,
    reviewsCount: 342,
    statusText: "Open Now",
    isOpen: true,
    locality: "Benz Circle",
    cityName: "Vijayawada",
    workingHours: "24 Hours Check-in",
    phone: "+918666688888",
    whatsapp: "+918666688888",
    icon: "🏨",
    specialty: "5-Star Business Luxury • Rooftop Infinity Pool"
  },
  {
    id: "biz-lotus-spa",
    name: "Lotus Ayurvedic Spa & Bridal Studio",
    slug: "lotus-spa-bridal",
    categorySlug: "beauty-spa",
    categoryLabel: "Beauty Spa & Salons",
    rating: 4.8,
    reviewsCount: 112,
    statusText: "Open Now",
    isOpen: true,
    locality: "Moghalrajpuram",
    cityName: "Vijayawada",
    workingHours: "09:30 AM - 08:30 PM",
    phone: "+919848044444",
    whatsapp: "+919848044444",
    icon: "💆‍♀️",
    specialty: "Ayurvedic Potli Massage & HD Bridal Makeover"
  },
  {
    id: "biz-urban-decor",
    name: "Urban Living Modular Kitchens",
    slug: "urban-living-decor",
    categorySlug: "home-decor",
    categoryLabel: "Home Decor & Interior",
    rating: 4.8,
    reviewsCount: 78,
    statusText: "Open Now",
    isOpen: true,
    locality: "MG Road",
    cityName: "Vijayawada",
    workingHours: "10:00 AM - 08:30 PM",
    phone: "+919848055555",
    whatsapp: "+919848055555",
    icon: "🛋️",
    specialty: "German Modular Kitchens & 3D Interior Design"
  },
  {
    id: "biz-gayatri-astro",
    name: "Sri Gayatri Vedic Jyothishya & Vastu",
    slug: "gayatri-astro",
    categorySlug: "ask-astro",
    categoryLabel: "Ask Astro & Vastu",
    rating: 4.9,
    reviewsCount: 185,
    statusText: "Open Now",
    isOpen: true,
    locality: "Brodipet",
    cityName: "Guntur",
    workingHours: "08:00 AM - 08:00 PM",
    phone: "+919848066666",
    whatsapp: "+919848066666",
    icon: "🔮",
    specialty: "Vedic Kundali Matching & Residential Vastu"
  },
  {
    id: "biz-siddhi-weddings",
    name: "Siddhi Vinayaka Kalyana Mandapam",
    slug: "siddhi-weddings",
    categorySlug: "wedding-planning",
    categoryLabel: "Wedding Planning & Halls",
    rating: 4.8,
    reviewsCount: 94,
    statusText: "Open Now",
    isOpen: true,
    locality: "Kanuru",
    cityName: "Vijayawada",
    workingHours: "24 Hours Event Booking",
    phone: "+919848077777",
    whatsapp: "+919848077777",
    icon: "💍",
    specialty: "Central AC 1200 Capacity Convention Center"
  },
  {
    id: "biz-narayana-academy",
    name: "Sri Chaitanya & Narayana NEET Academy",
    slug: "narayana-academy",
    categorySlug: "education",
    categoryLabel: "Education & Coaching",
    rating: 4.7,
    reviewsCount: 210,
    statusText: "Open Now",
    isOpen: true,
    locality: "Benz Circle",
    cityName: "Vijayawada",
    workingHours: "08:00 AM - 07:00 PM",
    phone: "+919848088888",
    whatsapp: "+919848088888",
    icon: "🎓",
    specialty: "IIT-JEE / NEET Long Term Coaching"
  },
  {
    id: "biz-balaji-rentals",
    name: "Balaji Self-Drive Cars & Tours",
    slug: "balaji-rentals",
    categorySlug: "rent-hire",
    categoryLabel: "Rent & Hire",
    rating: 4.7,
    reviewsCount: 64,
    statusText: "Open Now",
    isOpen: true,
    locality: "Arundelpet",
    cityName: "Guntur",
    workingHours: "24 Hours Availability",
    phone: "+919848099999",
    whatsapp: "+919848099999",
    icon: "🔑",
    specialty: "Self-Drive SUVs & Tempo Travellers"
  },
  {
    id: "biz-apollo-vja",
    name: "Apollo Speciality Hospital & Trauma Care",
    slug: "apollo-hospital",
    categorySlug: "hospitals",
    categoryLabel: "Hospitals & Emergency",
    rating: 4.9,
    reviewsCount: 420,
    statusText: "Open 24/7",
    isOpen: true,
    locality: "Governorpet",
    cityName: "Vijayawada",
    workingHours: "24/7 Emergency Casualty",
    phone: "+918662555555",
    whatsapp: "+918662555555",
    icon: "🏥",
    specialty: "24/7 Cardiac Emergency & Critical Care ICU"
  },
  {
    id: "biz-paws-tails",
    name: "Paws & Tails Pet Clinic & Spa",
    slug: "paws-tails-pet",
    categorySlug: "pet-shops",
    categoryLabel: "Pet Shops & Vet",
    rating: 4.8,
    reviewsCount: 88,
    statusText: "Open Now",
    isOpen: true,
    locality: "Benz Circle",
    cityName: "Vijayawada",
    workingHours: "10:00 AM - 08:30 PM",
    phone: "+919848011223",
    whatsapp: "+919848011223",
    icon: "🐾",
    specialty: "Pet Grooming, Food & Verified Doctor Vaccinations"
  },
  {
    id: "biz-sai-pg",
    name: "Sri Sai Executive Women's & Men's PG",
    slug: "sai-pg-hostel",
    categorySlug: "pg-hostels",
    categoryLabel: "PG / Hostels",
    rating: 4.8,
    reviewsCount: 104,
    statusText: "Open Now",
    isOpen: true,
    locality: "Near IT Park",
    cityName: "Vijayawada",
    workingHours: "24/7 Gated Security",
    phone: "+919848022334",
    whatsapp: "+919848022334",
    icon: "🛏️",
    specialty: "Deluxe AC Rooms, Homely Food & 200 Mbps Wi-Fi"
  },
  {
    id: "biz-prime-estate",
    name: "Amaravati Prime Properties & Open Plots",
    slug: "prime-estate",
    categorySlug: "estate-agent",
    categoryLabel: "Estate Agent & Plots",
    rating: 4.8,
    reviewsCount: 96,
    statusText: "Open Now",
    isOpen: true,
    locality: "Lakshmipuram",
    cityName: "Guntur",
    workingHours: "09:00 AM - 07:30 PM",
    phone: "+919848033445",
    whatsapp: "+919848033445",
    icon: "🏢",
    specialty: "CRDA Approved Gated Layouts & 3BHK Resale Flats"
  },
  {
    id: "biz-siri-dental",
    name: "Siri Dental Clinic & Laser Center",
    slug: "siri-dental-clinic",
    categorySlug: "dentists",
    categoryLabel: "Dentists & Clinics",
    rating: 4.8,
    reviewsCount: 132,
    statusText: "Open Now",
    isOpen: true,
    locality: "Nahamar",
    cityName: "Vijayawada",
    workingHours: "09:00 AM - 09:00 PM",
    phone: "+919848033333",
    whatsapp: "+919848033333",
    icon: "🦷",
    specialty: "Invisible Aligners & Single-Sitting Root Canal"
  },
  {
    id: "biz-amravati",
    name: "Amravati Grand Restaurant",
    slug: "amravati-grand-restaurant",
    categorySlug: "restaurants",
    categoryLabel: "Restaurants & Dining",
    rating: 4.8,
    reviewsCount: 124,
    statusText: "Open Now",
    isOpen: true,
    locality: "Nahamar",
    cityName: "Vijayawada",
    workingHours: "10:30 AM - 11:00 PM",
    phone: "+919848011111",
    whatsapp: "+919848011111",
    icon: "🍽️",
    specialty: "Claypot Andhra Biryani & Family Fine Dining"
  },
  {
    id: "biz-srinivasa-packers",
    name: "Srinivasa Packers & Movers",
    slug: "srinivasa-packers-movers",
    categorySlug: "contractors",
    categoryLabel: "Packers & Movers",
    rating: 4.8,
    reviewsCount: 89,
    statusText: "Open Now",
    isOpen: true,
    locality: "Brodipet",
    cityName: "Guntur",
    workingHours: "08:00 AM - 10:00 PM",
    phone: "+919848022222",
    whatsapp: "+919848022222",
    icon: "🚚",
    specialty: "Doorstep Packaging & Interstate Household Relocation"
  }
];

export default function MobileAppSimulator() {
  const [mode, setMode] = useState<"customer" | "vendor">("customer");
  const [selectedCity, setSelectedCity] = useState<"Hyderabad" | "Vijayawada" | "Guntur">("Hyderabad");
  const [selectedLocality, setSelectedLocality] = useState("Hitec City");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<"Home" | "Services" | "Enquiries" | "Notifications" | "Profile">("Home");
  const [businesses, setBusinesses] = useState<MobileBusiness[]>(DEFAULT_BUSINESSES);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // Enquiry state
  const [enquiryModalBiz, setEnquiryModalBiz] = useState<MobileBusiness | null>(null);
  const [enquirySuccessRef, setEnquirySuccessRef] = useState<string | null>(null);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+91 98480 77777");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Auth & Database State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  // authStep: "role" = role selection, "phone" = OTP form, "otp" = verify
  const [authStep, setAuthStep] = useState<"role" | "phone" | "otp">("role");
  // authRole: selected account type
  const [authRole, setAuthRole] = useState<"CUSTOMER" | "PARTNER" | null>(null);
  const [authPhone, setAuthPhone] = useState("");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authLang, setAuthLang] = useState("English");
  const [authOtp, setAuthOtp] = useState("");
  const [authChallengeId, setAuthChallengeId] = useState("");
  const [authDevOtp, setAuthDevOtp] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showRawDbJson, setShowRawDbJson] = useState(false);

  // Vendor Profile & KYC Workflow States
  const [vendorView, setVendorView] = useState<"dashboard" | "profile">("dashboard");
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [vendorCompletion, setVendorCompletion] = useState<any>(null);
  const [vendorToastDismissed, setVendorToastDismissed] = useState(false);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorSaving, setVendorSaving] = useState(false);
  const [vendorKycReqs, setVendorKycReqs] = useState<any>(null);
  const [vendorActiveSection, setVendorActiveSection] = useState<string>("all");

  // Form edit states
  const [vOwnerName, setVOwnerName] = useState("");
  const [vOwnerEmail, setVOwnerEmail] = useState("");
  const [vOwnerLanguage, setVOwnerLanguage] = useState("English");
  const [vOwnerIdType, setVOwnerIdType] = useState("");
  const [vOwnerIdNumber, setVOwnerIdNumber] = useState("");
  const [vOwnerIdFileBase64, setVOwnerIdFileBase64] = useState<string | null>(null);
  const [vOwnerIdFileName, setVOwnerIdFileName] = useState("");
  const [vOwnerIdFileUrl, setVOwnerIdFileUrl] = useState("");
  const [vBizName, setVBizName] = useState("");
  const [vBizLegalName, setVBizLegalName] = useState("");
  const [vBizType, setVBizType] = useState("Sole Proprietor");
  const [vBizCategory, setVBizCategory] = useState("restaurants");
  const [vBizDescription, setVBizDescription] = useState("");
  const [vBizPhone, setVBizPhone] = useState("");
  const [vBizWhatsapp, setVBizWhatsapp] = useState("");
  const [vBizLogoUrl, setVBizLogoUrl] = useState("");
  const [vBizCoverImageUrl, setVBizCoverImageUrl] = useState("");
  const [vBizCity, setVBizCity] = useState("Hyderabad");
  const [vBizLocality, setVBizLocality] = useState("Hitec City");
  const [vBizAddress, setVBizAddress] = useState("");
  const [vBizPincode, setVBizPincode] = useState("500081");
  const [vProofType, setVProofType] = useState("GST Registration Certificate");
  const [vDocNumber, setVDocNumber] = useState("");
  const [vDocNoAvailable, setVDocNoAvailable] = useState(false);
  const [vDocFileBase64, setVDocFileBase64] = useState<string | null>(null);
  const [vDocFileName, setVDocFileName] = useState("");
  const [vLicenseFileBase64, setVLicenseFileBase64] = useState<string | null>(null);
  const [vLicenseFileName, setVLicenseFileName] = useState("");
  const [vLicenseNumber, setVLicenseNumber] = useState("");

  // Dynamic Categories from Database
  const [categories, setCategories] = useState<MobileCategory[]>(ALL_14_SERVICES);

  // Load categories directly from Database
  useEffect(() => {
    async function loadDbCategories() {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCategories(json.data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            icon: getCategoryIcon(c.slug),
            bgColor: "bg-blue-50",
            textColor: "text-blue-600"
          })));
        }
      } catch (err) {
        console.log("Categories DB fetch notice:", err);
      }
    }
    loadDbCategories();
  }, []);

  // Load user session on mount — uses unified hello_access_token
  useEffect(() => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
    if (savedToken) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setCurrentUser(json.data);
            // Restore active role from localStorage preference
            const savedRole = localStorage.getItem("hello_active_role");
            const roles: string[] = Array.isArray(json.data.roles) ? json.data.roles : [];
            const hasMerchant = roles.includes("VENDOR_OWNER") || roles.includes("VENDOR_STAFF");
            if (savedRole === "MERCHANT" && hasMerchant) {
              setMode("vendor");
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  // Dynamic Notifications from Database
  const [mobileNotifs, setMobileNotifs] = useState<any[]>([]);
  const [mobileNotifRole, setMobileNotifRole] = useState<"customer" | "merchant">(mode === "vendor" ? "merchant" : "customer");
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [loadingNotifs, setLoadingNotifs] = useState<boolean>(false);

  const fetchMobileNotifications = useCallback(async () => {
    try {
      setLoadingNotifs(true);
      const res = await fetch(`${API_BASE}/notifications?role=${mobileNotifRole}&pageSize=20`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setMobileNotifs(json.data);
      }
      const countRes = await fetch(`${API_BASE}/notifications/counts`);
      const countJson = await countRes.json();
      if (countJson.success && countJson.data) {
        setUnreadNotifCount(countJson.data.totalUnread || 0);
      }
    } catch (err) {
      console.warn("Mobile notifications fetch warning:", err);
    } finally {
      setLoadingNotifs(false);
    }
  }, [mobileNotifRole]);

  useEffect(() => {
    fetchMobileNotifications();
  }, [fetchMobileNotifications, activeTab]);

  const handleMobileMarkAsRead = async (id: string) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, { method: "POST" });
      setMobileNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)));
      setUnreadNotifCount((c) => Math.max(0, c - 1));
    } catch {}
  };

  const getMobileAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
    const userStr = typeof window !== "undefined" ? localStorage.getItem("hello_user") : null;
    let uid = "";
    if (userStr) {
      try { uid = JSON.parse(userStr).id || ""; } catch {}
    }
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = "Bearer " + token;
    if (uid) headers["x-user-id"] = uid;
    return headers;
  };

  // Vendor Profile & KYC Workflow Methods
  const fetchVendorProfile = useCallback(async () => {
    try {
      setVendorLoading(true);
      const headers = getMobileAuthHeaders();
      const res = await fetch(`${API_BASE}/merchant/profile`, { headers });
      const json = await res.json();
      if (json?.success && json.data) {
        setVendorProfile(json.data);
        const comp = json.data.completion;
        setVendorCompletion(comp);
        if (json.data.user) {
          setVOwnerName(json.data.user.fullName || "");
          setVOwnerEmail(json.data.user.email || "");
          setVOwnerLanguage(json.data.user.preferredLanguage || "English");
          setVOwnerIdType(json.data.user.identityProofType || "");
          setVOwnerIdNumber(json.data.user.identityProofNumber || "");
          setVOwnerIdFileUrl(json.data.user.identityProofFileUrl || "");
        }
        if (json.data.business) {
          const b = json.data.business;
          setVBizName(b.name || "");
          setVBizLegalName(b.legalName || "");
          setVBizType(b.businessType || "Sole Proprietor");
          setVBizCategory(b.categorySlug || "restaurants");
          setVBizDescription(b.description || "");
          setVBizPhone(b.primaryPhone || "");
          setVBizWhatsapp(b.whatsappNumber || "");
          setVBizLogoUrl(b.logoUrl || "");
          setVBizCoverImageUrl(b.coverImageUrl || "");
          setVBizCity(b.cityName || "Hyderabad");
          setVBizLocality(b.localityName || "Hitec City");
          setVBizAddress(b.addressLine1 || "");
          setVBizPincode(b.pincode || "500081");
        }
        const reqRes = await fetch(`${API_BASE}/kyc/requirements?category=${json.data.business?.categorySlug || "restaurants"}`).then((r) => r.json()).catch(() => null);
        if (reqRes?.success && reqRes.data) {
          setVendorKycReqs(reqRes.data);
        }
      }
    } catch (err) {
      console.warn("Mobile vendor profile fetch warning:", err);
    } finally {
      setVendorLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode === "vendor") {
      fetchVendorProfile();
    }
  }, [mode, fetchVendorProfile]);

  const handleMobileSavePersonal = async () => {
    if (!vOwnerName || vOwnerName.trim().length < 2) {
      alert("Please enter full legal name (minimum 2 characters).");
      return;
    }
    setVendorSaving(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("hello_access_token") : null;
      const userStr = typeof window !== "undefined" ? localStorage.getItem("hello_user") : null;
      let uid = "";
      if (userStr) {
        try { uid = JSON.parse(userStr).id || ""; } catch {}
      }
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = "Bearer " + token;
      if (uid) headers["x-user-id"] = uid;

      const res = await fetch(`${API_BASE}/merchant/profile`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          fullName: vOwnerName.trim(),
          email: vOwnerEmail.trim(),
          preferredLanguage: vOwnerLanguage,
          identityProofType: vOwnerIdType,
          identityProofNumber: vOwnerIdNumber.trim(),
          identityProofDataUri: vOwnerIdFileBase64 || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert("Personal details & ID proof saved successfully!");
        setVOwnerIdFileBase64(null);
        setVOwnerIdFileName("");
        fetchVendorProfile();
      }
    } catch {
      alert("Failed to save personal details.");
    } finally {
      setVendorSaving(false);
    }
  };

  const handleMobileSaveBusiness = async () => {
    if (!vBizName || vBizName.trim().length < 2) {
      alert("Business Name is required.");
      return;
    }
    setVendorSaving(true);
    try {
      const res = await fetch(`${API_BASE}/merchant/businesses/${vendorProfile?.business?.id || "biz_primary"}`, {
        method: "PATCH",
        headers: getMobileAuthHeaders(),
        body: JSON.stringify({
          name: vBizName.trim(),
          legalName: vBizLegalName.trim(),
          businessType: vBizType,
          categorySlug: vBizCategory,
          description: vBizDescription.trim(),
          primaryPhone: vBizPhone,
          whatsappNumber: vBizWhatsapp,
          logoUrl: vBizLogoUrl,
          coverImageUrl: vBizCoverImageUrl,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert("Business profile updated!");
        fetchVendorProfile();
      }
    } catch {
      alert("Failed to save business.");
    } finally {
      setVendorSaving(false);
    }
  };

  const handleMobileSaveAddress = async () => {
    setVendorSaving(true);
    try {
      const res = await fetch(`${API_BASE}/merchant/businesses/${vendorProfile?.business?.id || "biz_primary"}`, {
        method: "PATCH",
        headers: getMobileAuthHeaders(),
        body: JSON.stringify({
          cityName: vBizCity,
          localityName: vBizLocality,
          addressLine1: vBizAddress,
          pincode: vBizPincode,
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert("Business address saved!");
        fetchVendorProfile();
      }
    } catch {
      alert("Failed to save address.");
    } finally {
      setVendorSaving(false);
    }
  };

  const handleMobileUploadDoc = async (isLicense = false) => {
    setVendorSaving(true);
    try {
      const body = isLicense
        ? {
            documentCategory: "CATEGORY_LICENSE",
            documentType: vendorKycReqs?.categoryLicenses?.[0]?.name || "Statutory License",
            documentNumber: vLicenseNumber,
            fileDataUri: vLicenseFileBase64,
            fileName: vLicenseFileName || "license.pdf",
          }
        : {
            documentCategory: "BUSINESS_PROOF",
            documentType: vProofType,
            documentNumber: vDocNumber,
            hasNoDocument: vDocNoAvailable,
            fileDataUri: vDocFileBase64,
            fileName: vDocFileName || "business_proof.pdf",
          };

      const res = await fetch(`${API_BASE}/merchant/businesses/${vendorProfile?.business?.id || "biz_primary"}/documents`, {
        method: "POST",
        headers: getMobileAuthHeaders(),
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        alert(isLicense ? "Category License uploaded!" : vDocNoAvailable ? "Declaration saved!" : "Document uploaded!");
        setVDocFileBase64(null);
        setVDocFileName("");
        setVLicenseFileBase64(null);
        setVLicenseFileName("");
        fetchVendorProfile();
      }
    } catch {
      alert("Failed to upload document.");
    } finally {
      setVendorSaving(false);
    }
  };

  const handleMobileSubmitKyc = async () => {
    setVendorSaving(true);
    try {
      const res = await fetch(`${API_BASE}/merchant/businesses/${vendorProfile?.business?.id || "biz_primary"}/kyc/submit`, {
        method: "POST",
        headers: getMobileAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        alert("KYC Package submitted! Super Admin has been notified for verification.");
        fetchVendorProfile();
      }
    } catch {
      alert("Failed to submit KYC.");
    } finally {
      setVendorSaving(false);
    }
  };

  const handleMobileDeleteDoc = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    setVendorSaving(true);
    try {
      const res = await fetch(`${API_BASE}/merchant/businesses/${vendorProfile?.business?.id || "biz_primary"}/documents/${docId}`, {
        method: "DELETE",
        headers: getMobileAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        alert("Document removed.");
        fetchVendorProfile();
      }
    } catch {
      alert("Failed to delete document.");
    } finally {
      setVendorSaving(false);
    }
  };

  const handleDocFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isLicense = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please choose a smaller document.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isLicense) {
        setVLicenseFileBase64(reader.result as string);
        setVLicenseFileName(file.name);
      } else {
        setVDocFileBase64(reader.result as string);
        setVDocFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMobileOtp = async () => {
    const cleanPhone = authPhone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setAuthError("Please enter a valid 10-digit Indian phone number.");
      return;
    }
    if (authTab === "register" && !authName.trim()) {
      setAuthError("Please enter your Full Name to register.");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const fullPhone = `+91${cleanPhone}`;
      const isPartner = authRole === "PARTNER";

      // ─── Step A: Check User & Role Status Before Sending OTP ───────────
      try {
        const checkRes = await fetch(`${API_BASE}/auth/check-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: fullPhone }),
        });
        const checkJson = await checkRes.json();

        if (checkRes.ok && checkJson.success && checkJson.data) {
          const uStatus = checkJson.data;

          if (authTab === "register") {
            if (uStatus.exists) {
              if (isPartner && uStatus.hasPartnerRole) {
                toast.warning(`Already this account was registered with Business Partner role. Please switch to Sign In.`);
                setAuthLoading(false);
                return;
              } else if (!isPartner && uStatus.hasCustomerRole) {
                toast.warning(`Already this account was registered with Customer role. Please switch to Sign In.`);
                setAuthLoading(false);
                return;
              }
            }
          } else {
            // Login Mode
            if (!uStatus.exists) {
              toast.warning(`First you register the account before logging in.`);
              setAuthTab("register");
              setAuthError(null);
              setAuthLoading(false);
              return;
            } else if (isPartner && !uStatus.hasPartnerRole) {
              toast.warning(`This account is not registered as a Business Partner. First you register the Business Partner account.`);
              setAuthTab("register");
              setAuthRole("PARTNER");
              setAuthError(null);
              setAuthLoading(false);
              return;
            } else if (!isPartner && !uStatus.hasCustomerRole) {
              toast.warning(`This account is not registered as a Customer. First you register the Customer account.`);
              setAuthTab("register");
              setAuthRole("CUSTOMER");
              setAuthError(null);
              setAuthLoading(false);
              return;
            }
          }
        }
      } catch (checkErr) {
        console.warn("Mobile check-user fallback:", checkErr);
      }

      // ─── Step B: Request OTP ───────────────────────────────────────────
      const res = await fetch(`${API_BASE}/auth/otp/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: fullPhone,
          purpose: authTab === "register" ? "REGISTRATION" : "LOGIN",
          role: isPartner ? "PARTNER" : "CUSTOMER"
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to dispatch OTP code.");

      setAuthChallengeId(json.data.challengeId);
      if (json.data.devOtp) {
        setAuthDevOtp(json.data.devOtp);
      }
      setAuthStep("otp");
    } catch (err: any) {
      setAuthError(err.message || "Connection error to API engine.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (authOtp.length !== 6) {
      setAuthError("Please enter the complete 6-digit code.");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: authChallengeId,
          otp: authOtp,
          deviceInfo: "HELLO Mobile Web Simulator (Port 3002)"
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Invalid or expired OTP.");

      const token = json.data.accessToken;
      if (typeof window !== "undefined") {
        localStorage.setItem("hello_access_token", token);
        localStorage.setItem("hello_mobile_token", token);
      }

      // If registered, persist profile updates to database
      if (authTab === "register" && authName.trim()) {
        try {
          await fetch(`${API_BASE}/users/me`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              fullName: authName.trim(),
              email: authEmail.trim() || undefined,
              preferredLanguage: authLang
            })
          });
        } catch {}
      }

      // Query database for fresh user entity
      const profileRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileJson = await profileRes.json();
      const freshUser = profileJson?.data?.user || json.data.user;

      const isPartner = authRole === "PARTNER";
      if (typeof window !== "undefined") {
        localStorage.setItem("hello_user", JSON.stringify(freshUser));
        localStorage.setItem("hello_active_role", isPartner ? "MERCHANT" : "CUSTOMER");
        window.dispatchEvent(new Event("hello_auth_changed"));
      }

      setCurrentUser(freshUser);
      setAuthModalOpen(false);
      setAuthStep("phone");
      setAuthOtp("");
      setAuthPhone("");
      setAuthName("");

      if (isPartner) {
        setMode("vendor");
        setActiveTab("Home");
      } else {
        setActiveTab("Profile");
      }
    } catch (err: any) {
      setAuthError(err.message || "Verification failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleMobileSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hello_mobile_token");
    }
    setCurrentUser(null);
  };

  // My Enquiries history
  const [myEnquiries, setMyEnquiries] = useState<any[]>([
    {
      referenceNo: "ENQ-2026-HYD-9812",
      businessName: "Amnesia Sky Bar & Lakeview",
      status: "CONFIRMED",
      date: "Just now",
      message: "Rooftop sunset table reservation for 4 people."
    },
    {
      referenceNo: "ENQ-2026-VJA-2977",
      businessName: "Siri Dental Clinic",
      status: "UNDER REVIEW",
      date: "Today, 10:15 AM",
      message: "Interested in invisible aligners consultation."
    }
  ]);

  // Map category helper
  const getCategoryIcon = (catSlug?: string) => {
    if (!catSlug) return "🏢";
    const s = catSlug.toLowerCase();
    if (s.includes("rest") || s.includes("food") || s.includes("dining")) return "🍽️";
    if (s.includes("hotel") || s.includes("stay")) return "🏨";
    if (s.includes("spa") || s.includes("beauty") || s.includes("salon")) return "💆‍♀️";
    if (s.includes("decor") || s.includes("interior") || s.includes("kitchen")) return "🛋️";
    if (s.includes("astro") || s.includes("vastu")) return "🔮";
    if (s.includes("wed") || s.includes("kalyan") || s.includes("hall")) return "💍";
    if (s.includes("edu") || s.includes("school") || s.includes("coaching")) return "🎓";
    if (s.includes("rent") || s.includes("hire") || s.includes("car")) return "🔑";
    if (s.includes("hosp") || s.includes("clinic") || s.includes("doctor")) return "🏥";
    if (s.includes("contract") || s.includes("electric") || s.includes("plumb") || s.includes("mover")) return "👷";
    if (s.includes("pet") || s.includes("vet")) return "🐾";
    if (s.includes("pg") || s.includes("hostel")) return "🛏️";
    if (s.includes("estate") || s.includes("plot") || s.includes("prop")) return "🏢";
    if (s.includes("dent")) return "🦷";
    return "🏢";
  };

  // Fetch from live REST API
  useEffect(() => {
    async function fetchFromApi() {
      try {
        setIsLoadingApi(true);
        const citySlug = selectedCity.toLowerCase();
        let catParam = "";
        if (selectedCategory && selectedCategory !== "All") {
          catParam = selectedCategory;
        }

        const url = new URL(`${API_BASE}/search/businesses`);
        url.searchParams.set("city", citySlug);
        if (catParam) url.searchParams.set("category", catParam);
        if (searchQuery.trim()) url.searchParams.set("q", searchQuery.trim());

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("API offline");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: MobileBusiness[] = json.data.map((b: any) => {
            const catSlug = b.primaryCategory?.slug || "";
            return {
              id: b.id,
              name: b.name,
              slug: b.slug,
              categorySlug: catSlug,
              categoryLabel: b.primaryCategory?.name || "Local Verified Business",
              rating: b.averageRating || 4.8,
              reviewsCount: b.totalReviews || 45,
              statusText: b.isOpenNow ? "Open Now" : "Live Service",
              isOpen: b.isOpenNow ?? true,
              locality: b.location?.localityName || selectedLocality,
              cityName: b.location?.cityName || selectedCity,
              workingHours: b.workingHoursSummary || "09:00 AM - 09:30 PM",
              phone: b.contacts?.callNumber || "+91 98480 12345",
              whatsapp: b.contacts?.whatsappNumber || b.contacts?.callNumber || "+91 98480 12345",
              icon: getCategoryIcon(catSlug),
              specialty: b.status || "Verified & Inspected Local Provider"
            };
          });
          setBusinesses(mapped);
        } else {
          // Filter fallback by city & category
          const filtered = DEFAULT_BUSINESSES.filter((b) => {
            const matchesCity = b.cityName.toLowerCase() === selectedCity.toLowerCase();
            const matchesCat = selectedCategory === "All" || b.categorySlug === selectedCategory;
            const matchesQ = !searchQuery.trim() || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCity && matchesCat && matchesQ;
          });
          setBusinesses(filtered.length > 0 ? filtered : DEFAULT_BUSINESSES.slice(0, 6));
        }
      } catch {
        const filtered = DEFAULT_BUSINESSES.filter((b) => {
          const matchesCity = b.cityName.toLowerCase() === selectedCity.toLowerCase();
          const matchesCat = selectedCategory === "All" || b.categorySlug === selectedCategory;
          return matchesCity && matchesCat;
        });
        setBusinesses(filtered.length > 0 ? filtered : DEFAULT_BUSINESSES.slice(0, 6));
      } finally {
        setIsLoadingApi(false);
      }
    }

    fetchFromApi();
  }, [selectedCity, selectedCategory, searchQuery]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryModalBiz) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: enquiryModalBiz.id,
          customerName: currentUser?.fullName || "Mobile User",
          customerPhone: customerPhone,
          message: enquiryMessage || `Instant mobile quote request for ${enquiryModalBiz.name}`,
          priority: "HIGH"
        })
      });

      const json = await res.json();
      if (json.success && json.data?.referenceNo) {
        const ref = json.data.referenceNo;
        setEnquirySuccessRef(ref);
        setMyEnquiries([
          {
            referenceNo: ref,
            businessName: enquiryModalBiz.name,
            status: "DISPATCHED",
            date: "Just now",
            message: enquiryMessage || "Consultation and rate inquiry."
          },
          ...myEnquiries
        ]);
      } else {
        const fallbackRef = `MOB-ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
        setEnquirySuccessRef(fallbackRef);
      }
    } catch {
      const fallbackRef = `MOB-ENQ-${Math.floor(1000 + Math.random() * 9000)}`;
      setEnquirySuccessRef(fallbackRef);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-2 sm:p-6 text-slate-800 overflow-x-hidden">
      
      {/* Top Banner Indicator */}
      <div className="mb-3 text-center">
        <div className="inline-flex items-center gap-2 bg-[#131E32] text-slate-200 px-4 py-1.5 rounded-full text-xs font-semibold border border-[#24324D] shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>HELLO Mobile (All 14 Services • Dual Customer ⇄ Vendor)</span>
        </div>
      </div>

      {/* Simulated Smartphone Frame (iPhone 15 Pro) */}
      <div className="w-full max-w-[390px] h-[830px] bg-white rounded-[50px] shadow-2xl border-[10px] border-[#1F2937] overflow-hidden flex flex-col relative ring-1 ring-white/10">
        
        {/* Dynamic Island / Top Notch */}
        <div className="bg-white pt-2.5 pb-1 px-7 flex items-center justify-between shrink-0 select-none z-30">
          <span className="text-[11px] font-bold text-slate-800 tracking-tight">09:41</span>
          <div className="w-24 h-4 bg-black rounded-full mx-auto"></div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-800">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-slate-700 rounded-sm p-0.5">
              <div className="h-full bg-slate-800 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Scrollable Mobile Body Content (Zero Horizontal Scrollbar) */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pb-24 no-scrollbar">
          
          {activeTab === "Services" ? (
            /* ================= ALL 14 SERVICES EXPLORE GRID ================= */
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-black text-slate-900">All 14 Services</h3>
                  <p className="text-[10px] text-slate-500">Commercial & Local Categories in {selectedCity}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setActiveTab("Home");
                  }}
                  className="text-[10px] font-bold text-[#0076D7] bg-blue-50 px-2.5 py-1 rounded-full hover:bg-blue-100"
                >
                  View All Directory
                </button>
              </div>

              {/* Categories Responsive Grid (Direct from DB) */}
              <div className="grid grid-cols-2 gap-2.5">
                {categories.map((srv) => {
                  const isSelected = selectedCategory === srv.slug;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setSelectedCategory(srv.slug);
                        setActiveTab("Home");
                      }}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? "bg-blue-50 border-[#0076D7] shadow-sm ring-2 ring-[#0076D7]"
                          : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${srv.bgColor} flex items-center justify-center text-lg shrink-0 shadow-2xs`}>
                        {srv.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">{srv.name}</span>
                        <span className="text-[9px] text-slate-400 font-medium">Verified Services</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeTab === "Enquiries" ? (
            /* ================= MY ENQUIRIES TAB ================= */
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-black text-slate-900">My Live Enquiries</h3>
                  <p className="text-[10px] text-slate-500">Dispatched quotes & vendor replies</p>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-[#0076D7] px-2 py-0.5 rounded-full">
                  {myEnquiries.length} Active
                </span>
              </div>

              {myEnquiries.map((enq, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#0076D7]">{enq.referenceNo}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                      ● {enq.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{enq.businessName}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">"{enq.message}"</p>
                  <div className="text-[9px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>Sent: {enq.date}</span>
                    <span className="text-[#0076D7] font-semibold">Live Vendor Notified</span>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === "Notifications" ? (
            /* ================= DYNAMIC ALERTS TAB (DB CONNECTED) ================= */
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Notifications & Alerts</h3>
                  <p className="text-[10px] text-slate-400">Direct from MySQL hello_db</p>
                </div>
                <button
                  onClick={() => fetchMobileNotifications()}
                  className="text-[10px] font-bold text-[#0076D7] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200"
                >
                  Refresh
                </button>
              </div>

              {/* Role Switcher Pill */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setMobileNotifRole("customer")}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    mobileNotifRole === "customer"
                      ? "bg-white text-[#0076D7] shadow-2xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Customer Alerts
                </button>
                <button
                  onClick={() => setMobileNotifRole("merchant")}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    mobileNotifRole === "merchant"
                      ? "bg-white text-[#FF6B35] shadow-2xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Merchant Leads
                </button>
              </div>

              {loadingNotifs ? (
                <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#0076D7]" />
                  <span>Loading alerts from DB...</span>
                </div>
              ) : mobileNotifs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No {mobileNotifRole} notifications</p>
                  <p className="text-[10px] text-slate-400">All caught up! New quotes and leads appear in real-time.</p>
                </div>
              ) : (
                mobileNotifs.map((item) => {
                  const isUnread = item.is_read === 0;
                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl border p-3 shadow-2xs space-y-1.5 transition ${
                        isUnread ? "border-blue-200 bg-blue-50/20" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isUnread ? "bg-[#0076D7] animate-pulse" : "bg-slate-300"
                            }`}
                          />
                          <span className={`text-xs truncate ${isUnread ? "font-black text-slate-900" : "font-bold text-slate-700"}`}>
                            {item.title}
                          </span>
                        </div>
                        {isUnread && (
                          <button
                            onClick={() => handleMobileMarkAsRead(item.id)}
                            className="text-[9px] text-[#0076D7] hover:underline shrink-0 font-bold"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{item.message}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[9px] text-slate-400">
                        <span className="capitalize">{item.type?.replace(/_/g, " ").toLowerCase()}</span>
                        {item.type === "LEAD_RECEIVED" && (
                          <a
                            href="tel:+919848012345"
                            className="text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded"
                          >
                            <Phone className="w-2.5 h-2.5" /> Call Lead
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : activeTab === "Profile" ? (
            /* ================= PROFILE TAB (LIVE DB IDENTITY) ================= */
            <div className="p-4 space-y-4">
              {currentUser ? (
                <>
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center space-y-2 shadow-xs">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0076D7] to-sky-400 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md">
                      {currentUser?.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{currentUser.fullName}</h4>
                      <p className="text-[11px] text-slate-500">{currentUser.phoneNumber} {currentUser.email ? `• ${currentUser.email}` : ""}</p>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified in SQLite Database
                    </div>
                  </div>

                  {/* Real Database Fields Grid */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2.5 text-xs shadow-xs">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Database Record Attributes</h5>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 block font-bold">USER ID</span>
                        <span className="font-mono text-slate-800 font-bold truncate block">{currentUser.id}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 block font-bold">STATUS</span>
                        <span className="text-emerald-600 font-bold block">{currentUser.status}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 block font-bold">LANGUAGE</span>
                        <span className="text-slate-800 font-bold block">{currentUser.preferredLanguage || "English"}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[9px] text-slate-400 block font-bold">ROLES</span>
                        <span className="text-[#0076D7] font-bold block">{Array.isArray(currentUser.roles) ? currentUser.roles.join(", ") : "CUSTOMER"}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setShowRawDbJson(!showRawDbJson)}
                        className="text-[11px] font-bold text-[#0076D7] hover:underline"
                      >
                        {showRawDbJson ? "▼ Hide SQL Table Entity" : "▶ View Raw Database SQL Entity"}
                      </button>
                      {showRawDbJson && (
                        <pre className="mt-2 p-2.5 bg-slate-900 rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto leading-relaxed border border-slate-800">
                          {JSON.stringify(currentUser, null, 2)}
                        </pre>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={handleMobileSignOut}
                        className="text-xs font-bold text-red-600 hover:text-red-700"
                      >
                        Sign Out Session
                      </button>
                      <button
                        onClick={() => setMode("vendor")}
                        className="text-xs font-bold text-[#FF6B35] hover:underline"
                      >
                        Switch to Vendor Mode →
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Unauthenticated View */
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center space-y-3 shadow-xs">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0076D7] flex items-center justify-center mx-auto text-xl font-bold border border-blue-100">
                      <User className="w-7 h-7 text-[#0076D7]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Sign In or Register</h4>
                      <p className="text-[11px] text-slate-500">Access verified enquiries, your registered database identity, and vendor controls.</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => { setAuthTab("login"); setAuthStep("role"); setAuthRole(null); setAuthModalOpen(true); }}
                        className="flex-1 bg-[#0076D7] hover:bg-[#005FAE] text-white py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Login</span>
                      </button>
                      <button
                        onClick={() => { setAuthTab("register"); setAuthStep("role"); setAuthRole(null); setAuthModalOpen(true); }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold transition border border-slate-200 flex items-center justify-center gap-1.5"
                      >
                        <span>Register</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50/60 rounded-2xl border border-blue-100 p-3.5 text-xs text-blue-900 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-blue-800">
                      <ShieldCheck className="w-4 h-4 text-[#0076D7]" />
                      Real Database Persistence
                    </span>
                    <p className="text-[11px] text-blue-700/90 leading-relaxed">
                      Registration stores relational records directly in SQLite / MariaDB (`users` & `otp_challenges` tables) with rate limits and cryptographic hashing.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : mode === "customer" ? (
            /* ================= CUSTOMER MODE VIEW ================= */
            <div className="space-y-3.5">
              
              {/* Header: City Selector + GPS Detect + Bell */}
              <div className="px-4 pt-2 flex items-center justify-between relative z-30">
                <div className="relative z-50">
                  <button
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition text-left"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
                    <span className="text-xs font-bold text-slate-900">{selectedCity}</span>
                    <span className="text-[10px] text-slate-500 font-medium">({selectedLocality})</span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </button>

                  {/* City Dropdown Menu */}
                  {showCityDropdown && (
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
                      {/* GPS Auto-Detect in Mobile Dropdown */}
                      <button
                        onClick={() => {
                          setSelectedCity("Hyderabad");
                          setSelectedLocality("Hitec City");
                          setShowCityDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#0076D7] text-xs font-bold border-b border-slate-100 flex items-center gap-2 transition"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#0076D7]" />
                        <span>Auto-Detect Location (GPS)</span>
                      </button>

                      <div className="px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        Or Select City Hub
                      </div>
                      {(["Hyderabad", "Vijayawada", "Guntur"] as const).map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setSelectedLocality(city === "Hyderabad" ? "Hitec City" : city === "Vijayawada" ? "Nahamar" : "Brodipet");
                            setShowCityDropdown(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition ${
                            selectedCity === city
                              ? "bg-[#0076D7] text-white"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span>{city}</span>
                          <span className="text-[10px] opacity-80">
                            {city === "Hyderabad" ? "Hitec City" : city === "Vijayawada" ? "Nahamar" : "Brodipet"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {currentUser ? (
                    <button
                      onClick={() => setActiveTab("Profile")}
                      className="flex items-center gap-1.5 bg-[#0F172A] hover:bg-slate-800 text-white px-2.5 py-1.5 rounded-full text-[11px] font-bold shadow-xs transition"
                      title="View Profile"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="max-w-[75px] truncate">{currentUser.fullName?.split(" ")[0] || "Profile"}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { setAuthTab("login"); setAuthStep("role"); setAuthRole(null); setAuthModalOpen(true); }}
                      className="bg-[#0076D7] hover:bg-[#005FAE] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs transition hover:shadow-md"
                      title="Login or Register"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Login</span>
                    </button>
                  )}

                  <div 
                    onClick={() => setActiveTab("Notifications")}
                    className="relative p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                    title="View Dynamic Alerts"
                  >
                    <Bell className="w-4 h-4 text-slate-700" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 px-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Pill Input with Mic & Camera */}
              <div className="px-4">
                <div className="bg-white rounded-full border border-slate-200 px-3.5 py-2 flex items-center gap-2 shadow-2xs focus-within:border-[#0076D7]">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Biryani, Dental, Hotels, Spa..."
                    className="flex-1 text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                  <Mic 
                    onClick={() => setSearchQuery("Amnesia Sky Bar")}
                    className="w-4 h-4 text-slate-400 shrink-0 cursor-pointer hover:text-[#0076D7]" 
                  />
                  <Camera 
                    onClick={() => alert("📷 Visual QR / Storefront scanner activated")}
                    className="w-4 h-4 text-slate-400 shrink-0 cursor-pointer hover:text-[#0076D7]" 
                  />
                </div>
              </div>

              {/* Wordmark Brand Strip */}
              <div className="text-center pt-0.5">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-black tracking-tight text-[#0076D7]">Hello</span>
                  <span className="text-2xl font-black tracking-tight text-[#FF6B35]">-Hi</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 -mt-0.5">
                  Search Local. Connect Instant. 6.2 Crore+ Verified
                </p>
              </div>

              {/* 1. HORIZONTAL ALL 14 CATEGORIES CAROUSEL (Zero Scrollbar) */}
              <div className="px-3">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none py-1">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap text-[11px] font-bold border transition shrink-0 ${
                      selectedCategory === "All"
                        ? "bg-[#0076D7] text-white border-[#0076D7] shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    🌟 All
                  </button>

                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(isSelected ? "All" : cat.slug)}
                        className={`px-3 py-1.5 rounded-full whitespace-nowrap text-[11px] font-semibold border flex items-center gap-1 transition shrink-0 ${
                          isSelected
                            ? "bg-[#0076D7] text-white border-[#0076D7] shadow-xs font-bold"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Promo Banner Carousel (Zero Scrollbar) */}
              <div className="px-4 flex gap-2.5 overflow-x-auto no-scrollbar scrollbar-none pt-0.5">
                <div className="min-w-[220px] bg-gradient-to-r from-[#0B1220] to-[#1E293B] text-white p-3 rounded-2xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">Festival Deals</span>
                    <h4 className="text-xs font-black leading-tight mt-0.5">UP TO 50% OFF</h4>
                    <p className="text-[9px] text-slate-300">Verified {selectedCity} Vendors</p>
                  </div>
                  <span className="text-2xl">🎉</span>
                </div>

                <div 
                  onClick={() => setMode("vendor")}
                  className="min-w-[190px] bg-gradient-to-r from-[#0076D7] to-[#005FAE] text-white p-3 rounded-2xl shadow-xs flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-200">Free Business Listing</span>
                    <h4 className="text-xs font-black leading-tight mt-0.5">Claim Business</h4>
                    <p className="text-[9px] text-blue-100 font-bold">100% Free Setup 🚀</p>
                  </div>
                  <span className="text-2xl">🏢</span>
                </div>
              </div>

              {/* 2. ALL 14 SERVICES COMPACT EXPLORE GRID */}
              <div className="px-4 pt-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900">Explore All Services</h3>
                  <button 
                    onClick={() => setActiveTab("Services")}
                    className="text-[11px] font-bold text-[#0076D7] hover:underline"
                  >
                    View All (14) →
                  </button>
                </div>

                {/* 4-Column Grid of All Categories (Direct from DB) */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {categories.map((srv) => {
                    const isSelected = selectedCategory === srv.slug;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedCategory(isSelected ? "All" : srv.slug)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition select-none ${
                          isSelected
                            ? "bg-blue-50 border-[#0076D7] ring-2 ring-[#0076D7]"
                            : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl ${srv.bgColor} flex items-center justify-center text-base shadow-2xs`}>
                          {srv.icon}
                        </div>
                        <span className="text-[9px] font-bold text-slate-800 leading-tight line-clamp-1">{srv.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. VERIFIED DIRECTORY LISTING */}
              <div className="px-4 pt-1 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-slate-900">
                      {selectedCategory === "All" ? "Verified Directory" : `${selectedCategory} in ${selectedCity}`}
                    </h3>
                    <span className="bg-[#EBF5FF] text-[#0076D7] text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> {businesses.length} Ready
                    </span>
                  </div>
                  {selectedCategory !== "All" && (
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="text-[10px] text-slate-400 font-semibold hover:text-slate-700"
                    >
                      Clear Filter ✕
                    </button>
                  )}
                </div>

                {/* Loading state */}
                {isLoadingApi && (
                  <div className="text-center py-4 text-xs text-slate-400 flex items-center justify-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0076D7]" />
                    <span>Updating verified providers...</span>
                  </div>
                )}

                {/* Businesses Cards */}
                {businesses.map((biz) => (
                  <div key={biz.id} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-slate-900 truncate">{biz.name}</h4>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0076D7] shrink-0" />
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-[10px]">
                          <span className="text-amber-500 font-bold">★ {biz.rating}</span>
                          <span className="text-slate-400">({biz.reviewsCount} reviews)</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-medium truncate">{biz.locality}, {biz.cityName}</span>
                        </div>
                        {biz.specialty && (
                          <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                            {biz.specialty}
                          </div>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg shrink-0">
                        {biz.icon}
                      </div>
                    </div>

                    {/* Action Buttons: Enquire, Call, WhatsApp */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setEnquiryModalBiz(biz);
                          setEnquirySuccessRef(null);
                        }}
                        className="bg-[#FF6B35] hover:bg-[#E5531E] text-white py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <span>Enquire</span>
                      </button>

                      <a
                        href={`tel:${biz.phone}`}
                        className="border border-slate-200 hover:bg-slate-50 text-slate-700 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-[#0076D7]" />
                        <span>Call</span>
                      </a>

                      <a
                        href={`https://wa.me/${biz.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-slate-200 hover:bg-slate-50 text-slate-700 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3 text-[#16A34A]" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}

              </div>

              {/* Vendor Switch Drawer */}
              <div className="px-4 pt-1">
                <div className="bg-gradient-to-r from-[#FF6B35] to-[#E5531E] text-white p-3 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-orange-100">Vendor Mode</span>
                    <h5 className="text-[11px] font-black leading-tight">Are you a Business Owner?</h5>
                  </div>
                  <button
                    onClick={() => setMode("vendor")}
                    className="bg-white text-[#FF6B35] hover:bg-orange-50 px-3 py-1 rounded-full text-[10px] font-bold shadow-2xs transition"
                  >
                    Open Console
                  </button>
                </div>
              </div>

            </div>
          ) : vendorView === "dashboard" ? (
            /* ================= VENDOR DASHBOARD VIEW ================= */
            <div className="space-y-4 p-4 pb-16">
              
              {/* Vendor Workspace Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#FF6B35] tracking-wider">Vendor Workspace</span>
                  <h3 className="text-base font-black text-slate-900">
                    {vendorProfile?.business?.name || "SparkleSmart Solutions"}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {vendorProfile?.business?.localityName || "Hitec City"}, {vendorProfile?.business?.cityName || "Hyderabad"}
                  </p>
                </div>
                <button
                  onClick={() => setMode("customer")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-slate-300 transition"
                >
                  Exit to Customer
                </button>
              </div>

              {/* 1. DASHBOARD PROFILE COMPLETION TOAST / REMINDER CARD */}
              {!vendorToastDismissed && (vendorCompletion?.showReminder || (vendorCompletion?.percentage !== undefined && vendorCompletion.percentage < 100)) && (
                <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-4 rounded-2xl shadow-lg border border-orange-400/40 animate-in fade-in slide-in-from-top-3">
                  <button
                    onClick={() => setVendorToastDismissed(true)}
                    className="absolute top-2.5 right-2.5 text-white/80 hover:text-white p-1 rounded-full hover:bg-black/10 transition"
                    title="Dismiss reminder"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-1 pr-4">
                      <h4 className="text-xs font-black tracking-tight leading-snug">
                        Complete Your Merchant Profile
                      </h4>
                      <p className="text-[11px] text-white/90 leading-tight">
                        Add your personal details, business information, and verification documents to complete your profile and build customer trust.
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar & Stat */}
                  <div className="mt-3 pt-2.5 border-t border-white/20 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span>Profile Strength</span>
                      <span>{vendorCompletion?.percentage ?? 35}% Completed</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(10, vendorCompletion?.percentage ?? 35)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setVendorView("profile")}
                      className="flex-1 bg-white hover:bg-orange-50 text-[#FF6B35] px-3 py-2 rounded-xl text-xs font-black shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <span>Update Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setVendorToastDismissed(true)}
                      className="bg-black/20 hover:bg-black/30 text-white px-3 py-2 rounded-xl text-xs font-bold transition"
                    >
                      Later
                    </button>
                  </div>
                </div>
              )}

              {/* Live Metric Cards (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-500">Live Quotes</span>
                  <div className="text-xl font-black text-[#0076D7] mt-0.5">32</div>
                  <span className="text-[9px] text-emerald-600 font-bold">↑ 12 new today</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-500">Profile Views</span>
                  <div className="text-xl font-black text-[#FF6B35] mt-0.5">2,840</div>
                  <span className="text-[9px] text-emerald-600 font-bold">↑ 22% this week</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-500">Calls Received</span>
                  <div className="text-xl font-black text-slate-900 mt-0.5">142</div>
                  <span className="text-[9px] text-slate-400">Direct tap-to-call</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs">
                  <span className="text-[10px] font-semibold text-slate-500">Rating</span>
                  <div className="text-xl font-black text-amber-500 mt-0.5">4.8 ★</div>
                  <span className="text-[9px] text-slate-400">340 verified reviews</span>
                </div>
              </div>

              {/* Quick Actions List */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 mb-2">Business Management</h4>
                
                <div 
                  onClick={() => setVendorView("profile")}
                  className="flex items-center justify-between py-2 border-b border-slate-100 cursor-pointer hover:bg-slate-50 -mx-1 px-1 rounded-lg transition"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#FF6B35]" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Merchant Profile & KYC</span>
                      <span className="text-[10px] text-slate-400">Personal, Business, Address, Licenses</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-orange-100 text-[#FF6B35] px-2 py-0.5 rounded-full flex items-center gap-1">
                    {vendorCompletion?.percentage ?? 35}% →
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100 cursor-pointer hover:bg-slate-50 -mx-1 px-1 rounded-lg transition">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#0076D7]" />
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block">Enquiry Inbox (32 Leads)</span>
                      <span className="text-[10px] text-slate-400">Customer quote requests</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0076D7]">View →</span>
                </div>

                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-slate-50 -mx-1 px-1 rounded-lg transition">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block">Staff Members (4 Active)</span>
                      <span className="text-[10px] text-slate-400">Manage operator permissions</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">→</span>
                </div>
              </div>

              {/* Business Status Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2 shadow-2xs text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Verification Status:</span>
                  {vendorProfile?.business?.isVerified ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Approved & Verified
                    </span>
                  ) : vendorProfile?.business?.status === "PENDING" ? (
                    <span className="text-sky-600 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> KYC Under Review
                    </span>
                  ) : vendorProfile?.business?.status === "REJECTED" ? (
                    <span className="text-red-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Action Required
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Pending KYC Submission
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Today's Hours:</span>
                  <span className="font-semibold text-slate-800">09:00 AM - 09:00 PM</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subscription:</span>
                  <span className="text-[#0076D7] font-bold">Hello Super Plus Tier</span>
                </div>
              </div>

            </div>
          ) : (
            /* ================= VENDOR PROFILE & KYC VIEW (7 SECTIONS) ================= */
            <div className="space-y-4 p-4 pb-20">
              
              {/* Profile Top Navigation Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setVendorView("dashboard")}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-full border border-slate-300 shadow-2xs transition"
                >
                  <span>← Back to Dashboard</span>
                </button>
                <button
                  onClick={() => fetchVendorProfile()}
                  disabled={vendorLoading}
                  className="text-[10px] font-bold text-[#0076D7] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 transition"
                >
                  {vendorLoading ? "Refreshing..." : "↻ Refresh"}
                </button>
              </div>

              {/* 1. PROFILE OVERVIEW & VERIFICATION BADGE */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#FF6B35] tracking-wider">Merchant Profile & KYC</span>
                    <h3 className="text-base font-black text-slate-900">
                      {vBizName || vendorProfile?.business?.name || "Merchant Business"}
                    </h3>
                  </div>
                  <div>
                    {vendorProfile?.business?.isVerified ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : vendorProfile?.business?.status === "PENDING" ? (
                      <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> UNDER REVIEW
                      </span>
                    ) : vendorProfile?.business?.status === "REJECTED" ? (
                      <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> REJECTED
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> NOT SUBMITTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Overall Completion</span>
                    <span className="text-[#FF6B35]">{vendorCompletion?.percentage ?? 35}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#FF6B35] to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(10, vendorCompletion?.percentage ?? 35)}%` }}
                    />
                  </div>
                </div>

                {/* Rejection / Resubmission Notice if remarks present */}
                {vendorProfile?.business?.adminRemarks && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-red-800 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>Super Admin Feedback:</span>
                    </div>
                    <p className="text-red-700 text-[11px] leading-tight">
                      {vendorProfile.business.adminRemarks}
                    </p>
                  </div>
                )}
              </div>

              {/* Section Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none py-1">
                {[
                  { id: "all", label: "All" },
                  { id: "personal", label: "1. Personal" },
                  { id: "business", label: "2. Business" },
                  { id: "address", label: "3. Address" },
                  { id: "proof", label: "4. Proof" },
                  { id: "licenses", label: "5. Licenses" },
                  { id: "dossier", label: "6. Dossier" },
                ].map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setVendorActiveSection(sec.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition ${
                      vendorActiveSection === sec.id
                        ? "bg-[#0076D7] text-white shadow-2xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>

              {/* 2. PERSONAL DETAILS SECTION */}
              {(vendorActiveSection === "all" || vendorActiveSection === "personal") && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#0076D7]" />
                      <span>1. Personal Information</span>
                    </h4>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Step 1
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Full Name (Authorized Signatory) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={vOwnerName}
                        onChange={(e) => setVOwnerName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Registered Mobile Number (OTP Verified)
                      </label>
                      <input
                        type="text"
                        value={vendorProfile?.user?.phoneNumber || "+91 98480 12345"}
                        disabled
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={vOwnerEmail}
                        onChange={(e) => setVOwnerEmail(e.target.value)}
                        placeholder="merchant@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Preferred Communication Language
                      </label>
                      <select
                        value={vOwnerLanguage}
                        onChange={(e) => setVOwnerLanguage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      >
                        <option value="English">English</option>
                        <option value="Telugu">Telugu (తెలుగు)</option>
                        <option value="Hindi">Hindi (हिन्दी)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Identity Proof (Voluntary)
                      </label>
                      <select
                        value={vOwnerIdType}
                        onChange={(e) => {
                          setVOwnerIdType(e.target.value);
                          if (!e.target.value) {
                            setVOwnerIdFileBase64(null);
                            setVOwnerIdFileName("");
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      >
                        <option value="">Select ID Type (Optional)</option>
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Passport">Passport</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Voter ID">Voter ID</option>
                      </select>
                    </div>

                    {/* DYNAMIC UPLOAD FIELD: Appears when Voluntary ID is chosen */}
                    {vOwnerIdType && (
                      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-800">
                            Upload {vOwnerIdType}
                          </span>
                          {vOwnerIdFileUrl && (
                            <a
                              href={vOwnerIdFileUrl.startsWith("http") ? vOwnerIdFileUrl : `http://localhost:4000${vOwnerIdFileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-[#0076D7] hover:underline flex items-center gap-0.5"
                            >
                              View Current Doc <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>

                        {/* Current Document Live Preview */}
                        {(vOwnerIdFileBase64 || vOwnerIdFileUrl) && (
                          <div className="space-y-1">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                              {vOwnerIdType} Preview
                            </span>
                            <div className="w-full h-28 rounded-xl bg-white border border-blue-100 overflow-hidden flex items-center justify-center p-1.5 shadow-2xs relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={
                                  vOwnerIdFileBase64 ||
                                  (vOwnerIdFileUrl?.startsWith("http") ? vOwnerIdFileUrl : `http://localhost:4000${vOwnerIdFileUrl}`)
                                }
                                alt="ID Proof Preview"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                            {vOwnerIdType} Number (Optional)
                          </label>
                          <input
                            type="text"
                            value={vOwnerIdNumber}
                            onChange={(e) => setVOwnerIdNumber(e.target.value)}
                            placeholder={`Enter ${vOwnerIdType} Number`}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#0076D7]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                            Upload Document File (PDF / Image)
                          </label>
                          <div className="relative border border-dashed border-blue-300 rounded-xl p-2 text-center bg-white cursor-pointer hover:border-[#0076D7] transition">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 5 * 1024 * 1024) {
                                  alert("File exceeds 5MB limit. Please upload a smaller file.");
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setVOwnerIdFileBase64(reader.result as string);
                                  setVOwnerIdFileName(file.name);
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <span className="text-[11px] text-slate-600 truncate block">
                              {vOwnerIdFileName ? vOwnerIdFileName : vOwnerIdFileUrl ? "Change Document File" : `Choose ${vOwnerIdType} File`}
                            </span>
                          </div>
                          {vOwnerIdFileBase64 && (
                            <button
                              type="button"
                              onClick={() => { setVOwnerIdFileBase64(null); setVOwnerIdFileName(""); }}
                              className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold mt-1 flex items-center gap-1"
                            >
                              <X className="w-3 h-3" /> Remove selected document
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleMobileSavePersonal}
                      disabled={vendorSaving}
                      className="w-full bg-[#0076D7] hover:bg-[#005FAE] text-white py-2 rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                    >
                      {vendorSaving ? "Saving..." : "Save Personal Details"}
                    </button>
                  </div>
                </div>
              )}

              {/* 3. BUSINESS DETAILS SECTION */}
              {(vendorActiveSection === "all" || vendorActiveSection === "business") && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#FF6B35]" />
                      <span>2. Business Details</span>
                    </h4>
                    <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                      Step 2
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Business / Shop Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={vBizName}
                        onChange={(e) => setVBizName(e.target.value)}
                        placeholder="e.g. SparkleSmart Solutions"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Legal Business Name (As on Certificate)
                      </label>
                      <input
                        type="text"
                        value={vBizLegalName}
                        onChange={(e) => setVBizLegalName(e.target.value)}
                        placeholder="e.g. SparkleSmart Solutions Private Limited"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Business Type
                      </label>
                      <select
                        value={vBizType}
                        onChange={(e) => setVBizType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      >
                        <option value="Sole Proprietor">Sole Proprietor</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Private Limited Company">Private Limited Company</option>
                        <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                        <option value="Public Limited Company">Public Limited Company</option>
                        <option value="Trust / Society / NGO">Trust / Society / NGO</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Primary Business Category
                      </label>
                      <select
                        value={vBizCategory}
                        onChange={(e) => setVBizCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Description / Services Offered
                      </label>
                      <textarea
                        rows={2}
                        value={vBizDescription}
                        onChange={(e) => setVBizDescription(e.target.value)}
                        placeholder="Describe your products, specialty, or services..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">
                          Primary Phone
                        </label>
                        <input
                          type="tel"
                          value={vBizPhone}
                          onChange={(e) => setVBizPhone(e.target.value)}
                          placeholder="Phone"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">
                          WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={vBizWhatsapp}
                          onChange={(e) => setVBizWhatsapp(e.target.value)}
                          placeholder="WhatsApp"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Business Logo & Cover Banner Upload with Live Previews */}
                    <div className="border-t border-slate-100 pt-3 space-y-3">
                      <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#FF6B35]" />
                        Business Logo &amp; Cover Banner
                      </span>

                      {/* LOGO */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                          LOGO <span className="text-slate-400 font-normal normal-case">(Square · max 2MB)</span>
                        </label>
                        <label className="border-2 border-dashed border-slate-300 hover:border-[#FF6B35] rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition text-center relative overflow-hidden">
                          {vBizLogoUrl ? (
                            <div className="flex flex-col items-center justify-center w-full space-y-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={vBizLogoUrl.startsWith("http") || vBizLogoUrl.startsWith("data:") ? vBizLogoUrl : `http://localhost:4000${vBizLogoUrl}`}
                                alt="Business logo"
                                className="max-h-24 object-contain rounded-lg border border-slate-200 shadow-2xs"
                              />
                              <span className="text-[9px] text-[#0076D7] font-bold">Tap to change logo</span>
                            </div>
                          ) : (
                            <>
                              <Camera className="w-5 h-5 text-slate-400 mb-0.5" />
                              <span className="text-[11px] font-bold text-slate-700">Upload Logo</span>
                              <span className="text-[9px] text-slate-400">PNG, JPG (Square)</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 2 * 1024 * 1024) {
                                alert("Logo image exceeds 2MB limit.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setVBizLogoUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                        {vBizLogoUrl && (
                          <button
                            type="button"
                            onClick={() => setVBizLogoUrl("")}
                            className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Remove logo
                          </button>
                        )}
                      </div>

                      {/* COVER BANNER */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                          COVER BANNER <span className="text-slate-400 font-normal normal-case">(16:9 · max 5MB)</span>
                        </label>
                        <label className="border-2 border-dashed border-slate-300 hover:border-[#FF6B35] rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition text-center relative overflow-hidden">
                          {vBizCoverImageUrl ? (
                            <div className="flex flex-col items-center justify-center w-full space-y-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={vBizCoverImageUrl.startsWith("http") || vBizCoverImageUrl.startsWith("data:") ? vBizCoverImageUrl : `http://localhost:4000${vBizCoverImageUrl}`}
                                alt="Business cover banner"
                                className="max-h-24 w-full object-cover rounded-lg border border-slate-200 shadow-2xs"
                              />
                              <span className="text-[9px] text-[#0076D7] font-bold">Tap to change banner</span>
                            </div>
                          ) : (
                            <>
                              <ImageIcon className="w-5 h-5 text-slate-400 mb-0.5" />
                              <span className="text-[11px] font-bold text-slate-700">Upload Cover Banner</span>
                              <span className="text-[9px] text-slate-400">PNG, JPG, WebP (16:9)</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                alert("Cover banner image exceeds 5MB limit.");
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setVBizCoverImageUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                        {vBizCoverImageUrl && (
                          <button
                            type="button"
                            onClick={() => setVBizCoverImageUrl("")}
                            className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Remove banner
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleMobileSaveBusiness}
                      disabled={vendorSaving}
                      className="w-full bg-[#FF6B35] hover:bg-[#E5531E] text-white py-2 rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                    >
                      {vendorSaving ? "Saving..." : "Save Business Details"}
                    </button>
                  </div>
                </div>
              )}

              {/* 4. BUSINESS ADDRESS SECTION */}
              {(vendorActiveSection === "all" || vendorActiveSection === "address") && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>3. Business Address</span>
                    </h4>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Step 3
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Door / Building / Street Address
                      </label>
                      <input
                        type="text"
                        value={vBizAddress}
                        onChange={(e) => setVBizAddress(e.target.value)}
                        placeholder="Plot 42, Silicon Valley Avenue"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">City Hub</label>
                        <select
                          value={vBizCity}
                          onChange={(e) => setVBizCity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none"
                        >
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Vijayawada">Vijayawada</option>
                          <option value="Guntur">Guntur</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">Locality</label>
                        <input
                          type="text"
                          value={vBizLocality}
                          onChange={(e) => setVBizLocality(e.target.value)}
                          placeholder="Hitec City"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={vBizPincode}
                        onChange={(e) => setVBizPincode(e.target.value)}
                        placeholder="500081"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={handleMobileSaveAddress}
                      disabled={vendorSaving}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                    >
                      {vendorSaving ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                </div>
              )}

              {/* 5. BUSINESS REGISTRATION PROOF SECTION */}
              {(vendorActiveSection === "all" || vendorActiveSection === "proof") && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      <span>4. Business Registration Proof</span>
                    </h4>
                    <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      Step 4
                    </span>
                  </div>

                  {/* Show already uploaded current document preview if available */}
                  {(() => {
                    const currentDoc = vendorProfile?.business?.documents?.find(
                      (d: any) => d.documentCategory === "BUSINESS_PROOF" || (!d.documentCategory && !d.documentType?.includes("License"))
                    );
                    if (!currentDoc) return null;
                    const previewUrl = currentDoc.fileUrl
                      ? currentDoc.fileUrl.startsWith("http")
                        ? currentDoc.fileUrl
                        : `${API_BASE.replace('/api/v1', '')}${currentDoc.fileUrl}`
                      : null;
                    return (
                      <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                            Current Uploaded Proof
                          </span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                            currentDoc.status === "VERIFIED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-sky-100 text-sky-800"
                          }`}>
                            {currentDoc.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-700">
                          <span className="font-bold">{currentDoc.documentType}</span>
                          {currentDoc.documentNumber && (
                            <span className="font-mono text-slate-500 block text-[10px]">
                              ID: {currentDoc.documentNumber}
                            </span>
                          )}
                        </div>
                        {previewUrl && (
                          <div className="w-full h-32 rounded-xl bg-white border border-purple-100 overflow-hidden flex items-center justify-center p-1.5 shadow-2xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previewUrl}
                              alt="Current proof preview"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Select Registration Proof Type
                      </label>
                      <select
                        value={vProofType}
                        onChange={(e) => {
                          setVProofType(e.target.value);
                          if (e.target.value === "I Don't Have a Business Registration Document") {
                            setVDocNoAvailable(true);
                          } else {
                            setVDocNoAvailable(false);
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0076D7]"
                      >
                        <option value="GST Registration Certificate">GST Registration Certificate (GSTIN)</option>
                        <option value="Udyam / MSME Registration Certificate">Udyam / MSME Registration Certificate</option>
                        <option value="Shop & Establishment Registration Certificate">Shop & Establishment Certificate</option>
                        <option value="Municipal Trade License">Municipal Trade License</option>
                        <option value="Certificate of Incorporation">Certificate of Incorporation (ROC)</option>
                        <option value="Partnership Deed">Partnership Deed</option>
                        <option value="Other Government Proof">Other Government Proof</option>
                        <option value="I Don't Have a Business Registration Document">I Don't Have a Business Registration Document</option>
                      </select>
                    </div>

                    {vDocNoAvailable ? (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1">
                        <span className="font-bold flex items-center gap-1 text-blue-800">
                          <CheckCircle className="w-3.5 h-3.5 text-[#0076D7]" />
                          Unregistered Sole Proprietor Declaration
                        </span>
                        <p className="text-[10px] text-blue-700 leading-tight">
                          You can list and operate without a formal commercial document. Verification will be done using your personal identity proof and physical shop location.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Document Number / ID
                          </label>
                          <input
                            type="text"
                            value={vDocNumber}
                            onChange={(e) => setVDocNumber(e.target.value)}
                            placeholder="e.g. 36AAACG1234F1Z5 or UDYAM-TS-02-12345"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Upload Certificate (PDF, PNG, JPG - max 5MB)
                          </label>
                          <label className="border-2 border-dashed border-slate-300 hover:border-[#0076D7] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition text-center relative overflow-hidden">
                            {vDocFileBase64 ? (
                              <div className="flex flex-col items-center justify-center w-full space-y-1.5">
                                {vDocFileBase64.startsWith("data:image/") ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={vDocFileBase64}
                                    alt="Registration document preview"
                                    className="max-h-28 object-contain rounded-lg border border-slate-200"
                                  />
                                ) : (
                                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 font-bold text-xs">
                                    <FileText className="w-4 h-4 text-purple-600" />
                                    <span>{vDocFileName || "Document selected"}</span>
                                  </div>
                                )}
                                <span className="text-[10px] font-bold text-slate-700">{vDocFileName}</span>
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">Ready to upload</span>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                                <span className="text-[11px] font-bold text-slate-700">Tap to browse file</span>
                                <span className="text-[9px] text-slate-400">PDF, PNG, or JPG</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleDocFileSelect(e, false)}
                              className="hidden"
                            />
                          </label>
                          {vDocFileBase64 && (
                            <button
                              type="button"
                              onClick={() => { setVDocFileBase64(null); setVDocFileName(""); }}
                              className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold mt-1 flex items-center gap-1"
                            >
                              <X className="w-3 h-3" /> Remove selected document
                            </button>
                          )}
                        </div>
                      </>
                    )}

                    <button
                      onClick={() => handleMobileUploadDoc(false)}
                      disabled={vendorSaving}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                    >
                      {vendorSaving ? "Saving..." : vDocNoAvailable ? "Save Declaration" : "Upload Document"}
                    </button>
                  </div>
                </div>
              )}

              {/* 6. CATEGORY-SPECIFIC ADDITIONAL LICENSES */}
              {(vendorActiveSection === "all" || vendorActiveSection === "licenses") && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span>5. Category-Specific Additional Licenses</span>
                    </h4>
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      Step 5
                    </span>
                  </div>

                  {/* Show already uploaded category license preview if available */}
                  {(() => {
                    const currentLic = vendorProfile?.business?.documents?.find(
                      (d: any) => d.documentCategory === "CATEGORY_LICENSE" || d.documentType?.includes("License")
                    );
                    if (!currentLic) return null;
                    const previewUrl = currentLic.fileUrl
                      ? currentLic.fileUrl.startsWith("http")
                        ? currentLic.fileUrl
                        : `${API_BASE.replace('/api/v1', '')}${currentLic.fileUrl}`
                      : null;
                    return (
                      <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                            Current Uploaded Statutory License
                          </span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                            currentLic.status === "VERIFIED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-sky-100 text-sky-800"
                          }`}>
                            {currentLic.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-700">
                          <span className="font-bold">{currentLic.documentType}</span>
                          {currentLic.documentNumber && (
                            <span className="font-mono text-slate-500 block text-[10px]">
                              License: {currentLic.documentNumber}
                            </span>
                          )}
                        </div>
                        {previewUrl && (
                          <div className="w-full h-32 rounded-xl bg-white border border-amber-100 overflow-hidden flex items-center justify-center p-1.5 shadow-2xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previewUrl}
                              alt="Current license preview"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                      <span className="font-bold">Statutory Requirement: </span>
                      {vBizCategory === "restaurants" || vBizCategory.includes("food")
                        ? "FSSAI 14-digit registration or state license is required for food safety."
                        : vBizCategory.includes("pharmacy") || vBizCategory.includes("chem")
                        ? "Form 20/21 retail drug license from State Drug Controller is required."
                        : vBizCategory.includes("doctor") || vBizCategory.includes("hospital")
                        ? "Medical Council / Clinical Establishment license is required."
                        : "Trade or professional contractor license recommended for customer trust."}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        License Number
                      </label>
                      <input
                        type="text"
                        value={vLicenseNumber}
                        onChange={(e) => setVLicenseNumber(e.target.value)}
                        placeholder="e.g. 13621014000123"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Upload License Document
                      </label>
                      <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition text-center relative overflow-hidden">
                        {vLicenseFileBase64 ? (
                          <div className="flex flex-col items-center justify-center w-full space-y-1.5">
                            {vLicenseFileBase64.startsWith("data:image/") ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={vLicenseFileBase64}
                                alt="License document preview"
                                className="max-h-28 object-contain rounded-lg border border-slate-200"
                              />
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-bold text-xs">
                                <FileText className="w-4 h-4 text-amber-600" />
                                <span>{vLicenseFileName || "License file selected"}</span>
                              </div>
                            )}
                            <span className="text-[10px] font-bold text-slate-700">{vLicenseFileName}</span>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">Ready to upload</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-slate-400 mb-1" />
                            <span className="text-[11px] font-bold text-slate-700">Tap to browse license</span>
                            <span className="text-[9px] text-slate-400">PDF, PNG, or JPG</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => handleDocFileSelect(e, true)}
                          className="hidden"
                        />
                      </label>
                      {vLicenseFileBase64 && (
                        <button
                          type="button"
                          onClick={() => { setVLicenseFileBase64(null); setVLicenseFileName(""); }}
                          className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold mt-1 flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Remove selected license
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleMobileUploadDoc(true)}
                      disabled={vendorSaving}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50"
                    >
                      {vendorSaving ? "Uploading..." : "Upload Category License"}
                    </button>
                  </div>
                </div>
              )}

              {/* 7. UPLOADED DOCUMENTS DOSSIER & SUBMISSION */}
              {(vendorActiveSection === "all" || vendorActiveSection === "dossier") && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>6. KYC Dossier & Verification Submission</span>
                    </h4>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Final Step
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Uploaded Verification Documents ({vendorProfile?.business?.documents?.length || 0}):
                    </span>

                    {vendorProfile?.business?.documents && vendorProfile.business.documents.length > 0 ? (
                      <div className="space-y-2">
                        {vendorProfile.business.documents.map((doc: any) => (
                          <div
                            key={doc.id}
                            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-800 truncate block text-xs">
                                  {doc.documentType}
                                </span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                                  doc.status === "VERIFIED"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : doc.status === "REJECTED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-sky-100 text-sky-800"
                                }`}>
                                  {doc.status}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono block">
                                {doc.documentNumber ? `ID: ${doc.documentNumber}` : "Self-declared sole proprietor"}
                              </span>
                            </div>
                            <button
                              onClick={() => handleMobileDeleteDoc(doc.id)}
                              className="text-slate-400 hover:text-red-500 p-1"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs">
                        No documents uploaded yet. Upload your proof and licenses above.
                      </div>
                    )}

                    {/* Submit KYC Dossier CTA Button */}
                    <div className="pt-2">
                      <button
                        onClick={handleMobileSubmitKyc}
                        disabled={vendorSaving}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{vendorSaving ? "Submitting Dossier..." : "Submit KYC Package for Super Admin Approval"}</span>
                      </button>
                      <p className="text-[10px] text-slate-400 text-center mt-1.5">
                        Once submitted, your verification status changes to Under Review and the Super Admin team inspects your business within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Mobile Bottom Navigation Bar (5 Icons: Home, Services, Add/Switch, Alerts, Profile) */}
        <nav className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-200 py-2 px-4 flex items-center justify-between z-30 shadow-lg select-none">
          <button 
            onClick={() => {
              setMode("customer");
              setActiveTab("Home");
            }}
            className={`flex flex-col items-center gap-0.5 ${(activeTab === "Home" && mode === "customer") ? "text-[#0076D7]" : "text-slate-400"}`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px] font-bold">Home</span>
          </button>

          <button 
            onClick={() => {
              setMode("customer");
              setActiveTab("Services");
            }}
            className={`flex flex-col items-center gap-0.5 ${(activeTab === "Services" && mode === "customer") ? "text-[#0076D7]" : "text-slate-400"}`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[9px] font-medium">Services</span>
          </button>

          <button 
            onClick={() => {
              if (mode === "customer") {
                setMode("vendor");
                setVendorView("dashboard");
              } else {
                setMode("customer");
                setActiveTab("Home");
              }
            }}
            className="flex flex-col items-center -mt-5"
          >
            <div className="w-10 h-10 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow-md ring-4 ring-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[8px] font-bold text-[#FF6B35] mt-0.5">{mode === "customer" ? "Vendor" : "Customer"}</span>
          </button>

          <button 
            onClick={() => {
              setMode("customer");
              setActiveTab("Enquiries");
            }}
            className={`flex flex-col items-center gap-0.5 ${(activeTab === "Enquiries" && mode === "customer") ? "text-[#0076D7]" : "text-slate-400"}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[9px] font-medium">Enquiries</span>
          </button>

          <button 
            onClick={() => {
              setMode("vendor");
              setVendorView("dashboard");
            }}
            className={`flex flex-col items-center gap-0.5 ${(mode === "vendor" && vendorView === "dashboard") ? "text-[#FF6B35] font-bold" : "text-slate-400"}`}
          >
            <User className="w-4 h-4" />
            <span className="text-[9px] font-medium">Profile & KYC</span>
          </button>
        </nav>

        {/* In-App Instant Enquiry Bottom Sheet */}
        {enquiryModalBiz && (
          <div className="absolute inset-0 bg-black/60 z-40 flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-5 space-y-3 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#FF6B35] uppercase">Instant 15-Min Quote</span>
                  <h4 className="text-xs font-bold text-slate-900">{enquiryModalBiz.name}</h4>
                  <p className="text-[10px] text-slate-400">{enquiryModalBiz.locality}, {enquiryModalBiz.cityName}</p>
                </div>
                <button onClick={() => setEnquiryModalBiz(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {enquirySuccessRef ? (
                <div className="text-center py-4 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h5 className="text-xs font-bold text-slate-900">Enquiry Dispatched Instantly!</h5>
                  <p className="text-[11px] text-slate-500">Reference: <span className="font-mono font-bold text-[#0076D7]">{enquirySuccessRef}</span></p>
                  <p className="text-[10px] text-slate-400">Added to your My Enquiries tab with real-time notification</p>
                  <button
                    onClick={() => setEnquiryModalBiz(null)}
                    className="w-full bg-[#0076D7] text-white py-2 rounded-lg text-xs font-bold mt-2 shadow-xs"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-2.5">
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Need table booking for 4 people / AC repair quote..."
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-[#0076D7]"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Your Phone Number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="flex-1 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-[#0076D7]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FF6B35] hover:bg-[#E5531E] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-75 transition"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Get Instant Quote</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* In-App Authentication & Registration Modal */}
        {authModalOpen && (
          <div className="absolute inset-0 bg-black/70 z-50 flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {authStep === "role"
                      ? authTab === "register"
                        ? "How would you like to join HELLO?"
                        : "How would you like to sign in?"
                      : `${authRole === "PARTNER" ? "Business Partner" : "Customer"} ${
                          authTab === "register" ? "Registration" : "Sign In"
                        }`}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Your HELLO account is protected with secure mobile verification.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAuthModalOpen(false);
                    setAuthStep("role");
                    setAuthRole(null);
                    setAuthError(null);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dual Toggle Pill (Sign In / Register Account) */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => {
                    setAuthTab("login");
                    setAuthError(null);
                  }}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition ${
                    authTab === "login" ? "bg-white text-[#0076D7] shadow-xs" : "text-slate-500"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthTab("register");
                    setAuthError(null);
                  }}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition ${
                    authTab === "register" ? "bg-white text-[#0076D7] shadow-xs" : "text-slate-500"
                  }`}
                >
                  Register Account
                </button>
              </div>

              {authError && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-[11px] border border-red-200">
                  {authError}
                </div>
              )}

              {/* ─── STEP 1: ROLE SELECTION (CUSTOMER VS PARTNER) ─── */}
              {authStep === "role" && (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-600 font-semibold">
                    {authTab === "register"
                      ? "Select how you would like to join HELLO:"
                      : "Choose your account experience to continue:"}
                  </p>

                  {/* Customer Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthRole("CUSTOMER");
                      setAuthStep("phone");
                      setAuthError(null);
                    }}
                    className="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-[#0076D7] bg-white hover:bg-blue-50/40 transition flex items-start gap-3 shadow-2xs group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0076D7] flex items-center justify-center shrink-0 group-hover:bg-[#0076D7] group-hover:text-white transition">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-slate-900">Customer</h5>
                        <span className="text-[10px] font-bold text-[#0076D7]">
                          {authTab === "register" ? "Join as Customer →" : "Continue →"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        Discover nearby businesses, services, and offers.
                      </p>
                    </div>
                  </button>

                  {/* Business Partner Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthRole("PARTNER");
                      setAuthStep("phone");
                      setAuthError(null);
                    }}
                    className="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-[#FF6B35] bg-white hover:bg-orange-50/40 transition flex items-start gap-3 shadow-2xs group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center shrink-0 group-hover:bg-[#FF6B35] group-hover:text-white transition">
                      <Store className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-slate-900">Business Partner</h5>
                        <span className="text-[10px] font-bold text-[#FF6B35]">
                          {authTab === "register" ? "Join as Partner →" : "Continue →"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        List your business, manage enquiries, and connect with customers.
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* ─── STEP 2: PHONE & PROFILE FORM ─── */}
              {authStep === "phone" && (
                <div className="space-y-3">
                  {/* Account Type Header & Change button */}
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      {authRole === "PARTNER" ? (
                        <Store className="w-3.5 h-3.5 text-[#FF6B35]" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-[#0076D7]" />
                      )}
                      <span className={`text-[11px] font-bold ${authRole === "PARTNER" ? "text-[#FF6B35]" : "text-[#0076D7]"}`}>
                        {authRole === "PARTNER" ? "Business Partner" : "Customer"} {authTab === "register" ? "Registration" : "Sign In"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthStep("role");
                        setAuthError(null);
                      }}
                      className="text-[10px] text-slate-500 hover:text-slate-800 underline font-semibold"
                    >
                      Change Account Type
                    </button>
                  </div>

                  {authTab === "register" && (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block mb-1">
                          {authRole === "PARTNER" ? "Partner / Owner Full Name *" : "Full Name *"}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Ramesh Kumar"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0076D7]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-700 block mb-1">Email (Optional)</label>
                        <input
                          type="email"
                          placeholder="e.g. ramesh@example.com"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0076D7]"
                        />
                      </div>
                    </>
                  )}

                  {/* Phone Input Box matching screenshot */}
                  <div className="flex items-center rounded-xl border border-slate-300 focus-within:border-[#0070E0] focus-within:ring-2 focus-within:ring-blue-100 bg-white transition px-3 py-2.5 shadow-2xs">
                    <span className="text-xs text-slate-700 font-bold select-none pr-2">
                      +91
                    </span>
                    <span className="text-slate-300 select-none pr-2">|</span>
                    <input
                      type="tel"
                      placeholder="Enter Mobile Number"
                      maxLength={10}
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ""))}
                      className="flex-1 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                    />
                  </div>

                  {/* Checkbox: I Agree to Terms and Conditions */}
                  <div className="flex flex-col items-center justify-center text-center space-y-0.5 select-none pt-0.5">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700 font-medium">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-3 h-3 rounded text-[#0070E0] accent-[#0070E0] cursor-pointer"
                      />
                      <span>I Agree to Terms and Conditions</span>
                    </label>
                    <span className="text-[10px] text-slate-500 underline cursor-pointer">
                      T&amp;C&apos;s Privacy Policy
                    </span>
                  </div>

                  {/* Action Button: Login with OTP / Register with OTP */}
                  <button
                    onClick={handleSendMobileOtp}
                    disabled={authLoading || authPhone.length < 10}
                    className={`w-full ${
                      authRole === "PARTNER"
                        ? "bg-[#FF6B35] hover:bg-[#E5531E]"
                        : "bg-[#0070E0] hover:bg-[#005bb5]"
                    } disabled:bg-slate-300 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs`}
                  >
                    {authLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>
                        {authRole === "PARTNER"
                          ? authTab === "register"
                            ? "Register as Partner with OTP"
                            : "Partner Login with OTP"
                          : authTab === "register"
                          ? "Register as Customer with OTP"
                          : "Customer Login with OTP"}
                      </span>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative my-2 flex items-center justify-center">
                    <div className="border-t border-slate-200 w-full absolute" />
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2.5 py-0.5 rounded-full relative z-10 font-medium">
                      {authTab === "register" ? "Or Register Using" : "Or Login Using"}
                    </span>
                  </div>

                  {/* Google Button — Disabled */}
                  <button
                    type="button"
                    disabled
                    title="Google Sign-In is coming soon. Please use Mobile OTP."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 cursor-not-allowed opacity-75 shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0 grayscale opacity-60" viewBox="0 0 24 24">
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
                    <span>Google (Coming Soon)</span>
                  </button>
                </div>
              )}

              {/* ─── STEP 3: OTP VERIFICATION ─── */}
              {authStep === "otp" && (
                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${authRole === "PARTNER" ? "text-[#FF6B35]" : "text-[#0076D7]"}`}>
                      {authRole === "PARTNER" ? "Business Partner" : "Customer"} Verification
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Enter the 6-digit code dispatched to <span className="font-bold text-slate-800">+91 {authPhone}</span>
                    </p>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    value={authOtp}
                    onChange={(e) => setAuthOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full border-2 border-[#0076D7] rounded-xl px-4 py-2.5 text-center text-lg font-mono font-bold tracking-widest focus:outline-none"
                    autoFocus
                  />

                  <button
                    onClick={handleVerifyMobileOtp}
                    disabled={authLoading || authOtp.length !== 6}
                    className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:bg-slate-300 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    {authLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Verify OTP &amp; Continue</span>}
                  </button>

                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <button
                      onClick={() => setAuthStep("phone")}
                      className="text-slate-500 hover:text-slate-800 font-semibold underline"
                    >
                      Change Phone Number
                    </button>
                    <button
                      onClick={() => {
                        setAuthStep("role");
                        setAuthRole(null);
                      }}
                      className="text-slate-500 hover:text-slate-800 font-semibold underline"
                    >
                      Change Account Type
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
