"use client";

import React, { useState, useEffect } from "react";
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
  Compass
} from "lucide-react";

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
  const [customerName, setCustomerName] = useState("Vikram");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          customerName: customerName || "Mobile User",
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

              {/* 14 Categories Responsive Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {ALL_14_SERVICES.map((srv) => {
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
            /* ================= ALERTS TAB ================= */
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-black text-slate-900">Notifications & Alerts</h3>
                <span className="text-[10px] text-slate-400">Today</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                  <span className="text-xs font-bold text-slate-900">Special Hitec City Offer</span>
                </div>
                <p className="text-[11px] text-slate-600">Get 1+1 on Craft Cocktails at Amnesia Sky Bar this Friday!</p>
                <span className="text-[9px] text-slate-400 block pt-1">12 mins ago</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-900">KYC Verified Update</span>
                </div>
                <p className="text-[11px] text-slate-600">Your registered mobile number is verified with DPDP Act 2023 compliance.</p>
                <span className="text-[9px] text-slate-400 block pt-1">2 hours ago</span>
              </div>
            </div>
          ) : activeTab === "Profile" ? (
            /* ================= PROFILE TAB ================= */
            <div className="p-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center space-y-2 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0076D7] to-[#FF6B35] text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md">
                  V
                </div>
                <h4 className="text-sm font-black text-slate-900">Vikram (Customer)</h4>
                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> +91 98480 77777 (Verified)
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-3 text-xs shadow-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Active City</span>
                  <span className="font-bold text-slate-900">{selectedCity} ({selectedLocality})</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Account Role</span>
                  <span className="font-bold text-[#0076D7]">Customer Mode</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Available Services</span>
                  <span className="font-bold text-slate-800">14 Categories</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-600">Business Management</span>
                  <button 
                    onClick={() => setMode("vendor")}
                    className="text-[#FF6B35] font-bold hover:underline"
                  >
                    Switch to Vendor Mode →
                  </button>
                </div>
              </div>
            </div>
          ) : mode === "customer" ? (
            /* ================= CUSTOMER MODE VIEW ================= */
            <div className="space-y-3.5">
              
              {/* Header: City Selector + GPS Detect + Bell */}
              <div className="px-4 pt-2 flex items-center justify-between relative">
                <div className="relative">
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
                    <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
                      <div className="px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        Select City Hub
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

                <div 
                  onClick={() => setActiveTab("Notifications")}
                  className="relative p-1.5 rounded-full bg-slate-100 cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-slate-700" />
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    1
                  </span>
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

                  {ALL_14_SERVICES.map((cat) => {
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

                {/* 4-Column Grid of 8 Featured from the 14 */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {ALL_14_SERVICES.slice(0, 8).map((srv) => {
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
          ) : (
            /* ================= VENDOR MODE VIEW ================= */
            <div className="space-y-4 p-4">
              
              {/* Vendor Workspace Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#FF6B35] tracking-wider">Vendor Workspace</span>
                  <h3 className="text-base font-black text-slate-900">SparkleSmart Solutions</h3>
                  <p className="text-[10px] text-slate-500">Hitec City, Hyderabad</p>
                </div>
                <button
                  onClick={() => setMode("customer")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1.5 rounded-full border border-slate-300"
                >
                  Exit to Customer
                </button>
              </div>

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
                
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#0076D7]" />
                    <span className="text-xs font-semibold text-slate-700">Enquiry Inbox (32 Leads)</span>
                  </div>
                  <span className="text-xs font-bold text-[#0076D7]">View →</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-700">Edit Business Profile & Media</span>
                  </div>
                  <span className="text-xs text-slate-400">→</span>
                </div>

                <div className="flex items-center justify-between py-1.5 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-slate-700">Staff Members (4 Active)</span>
                  </div>
                  <span className="text-xs text-slate-400">→</span>
                </div>
              </div>

              {/* Business Status Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2 shadow-2xs text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Verification Badge:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Approved & Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Today's Hours:</span>
                  <span className="font-semibold text-slate-800">24/7 Emergency Service</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subscription:</span>
                  <span className="text-[#0076D7] font-bold">Hello Super Plus Tier</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Mobile Bottom Navigation Bar (5 Icons: Home, Services, Add/Switch, Alerts, Profile) */}
        <nav className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-200 py-2 px-4 flex items-center justify-between z-30 shadow-lg select-none">
          <button 
            onClick={() => setActiveTab("Home")}
            className={`flex flex-col items-center gap-0.5 ${activeTab === "Home" ? "text-[#0076D7]" : "text-slate-400"}`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px] font-bold">Home</span>
          </button>

          <button 
            onClick={() => setActiveTab("Services")}
            className={`flex flex-col items-center gap-0.5 ${activeTab === "Services" ? "text-[#0076D7]" : "text-slate-400"}`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[9px] font-medium">Services</span>
          </button>

          <button 
            onClick={() => setMode(mode === "customer" ? "vendor" : "customer")}
            className="flex flex-col items-center -mt-5"
          >
            <div className="w-10 h-10 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow-md ring-4 ring-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[8px] font-bold text-[#FF6B35] mt-0.5">{mode === "customer" ? "Vendor" : "Customer"}</span>
          </button>

          <button 
            onClick={() => setActiveTab("Enquiries")}
            className={`flex flex-col items-center gap-0.5 ${activeTab === "Enquiries" ? "text-[#0076D7]" : "text-slate-400"}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[9px] font-medium">Enquiries</span>
          </button>

          <button 
            onClick={() => setActiveTab("Profile")}
            className={`flex flex-col items-center gap-0.5 ${activeTab === "Profile" ? "text-[#0076D7]" : "text-slate-400"}`}
          >
            <User className="w-4 h-4" />
            <span className="text-[9px] font-medium">Profile</span>
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

      </div>
    </div>
  );
}
