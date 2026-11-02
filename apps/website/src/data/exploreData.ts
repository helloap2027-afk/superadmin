export interface CuratedCollection {
  id: string;
  title: string;
  placesCount: number;
  image: string;
  badge?: string;
  categorySlug: string;
}

export interface ExploreCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
  heroTitle: string;
  heroSubtitle: string;
  collections: CuratedCollection[];
}

export const AP_EXPLORE_CATEGORIES: ExploreCategory[] = [
  {
    id: "cat-restaurants",
    name: "Restaurants",
    slug: "restaurants",
    icon: "🍽️",
    count: 38,
    heroTitle: "Top Verified Restaurants & Food Establishments",
    heroSubtitle: "Explore authentic Andhra bhojanam, claypot biryanis, family fine dining, cafes, and multicuisine restaurants.",
    collections: [
      {
        id: "col-rest-1",
        title: "Royal Andhra Claypot Biryani",
        placesCount: 12,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
        badge: "MUST TRY",
        categorySlug: "restaurants"
      },
      {
        id: "col-rest-2",
        title: "Authentic Veg Thali & Meals",
        placesCount: 9,
        image: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=500&auto=format&fit=crop&q=80",
        badge: "FAMILY FAVORITE",
        categorySlug: "restaurants"
      },
      {
        id: "col-rest-3",
        title: "Late Night Cafes & Fast Food",
        placesCount: 8,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80",
        badge: "OPEN TILL 2 AM",
        categorySlug: "restaurants"
      }
    ]
  },
  {
    id: "cat-hotels",
    name: "Hotels",
    slug: "hotels",
    icon: "🏨",
    count: 26,
    heroTitle: "Luxury & Budget Hotels, Suites & Lodges",
    heroSubtitle: "Book verified 3-star, 4-star, business suites, and AC lodges near railway stations, airports, and city centers.",
    collections: [
      {
        id: "col-hot-1",
        title: "Luxury Business Suites & 4-Star Stays",
        placesCount: 8,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=80",
        badge: "PREMIUM",
        categorySlug: "hotels"
      },
      {
        id: "col-hot-2",
        title: "Budget AC Lodges near Station",
        placesCount: 11,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=80",
        badge: "BEST VALUE",
        categorySlug: "hotels"
      }
    ]
  },
  {
    id: "cat-beauty-spa",
    name: "Beauty Spa",
    slug: "beauty-spa",
    icon: "💆‍♀️",
    count: 31,
    heroTitle: "Salons, Luxury Spas & Wellness Retreats",
    heroSubtitle: "Certified bridal makeovers, Swedish massages, skin brightening treatments, hair spas, and beauty parlours.",
    collections: [
      {
        id: "col-spa-1",
        title: "Bridal Makeup & Premium Styling",
        placesCount: 14,
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80",
        badge: "BRIDAL CHOICE",
        categorySlug: "beauty-spa"
      },
      {
        id: "col-spa-2",
        title: "Ayurvedic & Aromatherapy Massage Spas",
        placesCount: 10,
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80",
        badge: "REJUVENATING",
        categorySlug: "beauty-spa"
      }
    ]
  },
  {
    id: "cat-home-decor",
    name: "Home Decor",
    slug: "home-decor",
    icon: "🛋️",
    count: 22,
    heroTitle: "Interior Designers, Modular Kitchens & Furnishings",
    heroSubtitle: "Custom furniture showrooms, false ceiling contractors, wallpaper, curtains, lighting, and modular wardrobes.",
    collections: [
      {
        id: "col-decor-1",
        title: "Modular Kitchen & Wardrobe Experts",
        placesCount: 9,
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop&q=80",
        badge: "FACTORY FINISH",
        categorySlug: "home-decor"
      },
      {
        id: "col-decor-2",
        title: "Designer Curtains, Sofa & Wallpapers",
        placesCount: 8,
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80",
        badge: "ELEGANT",
        categorySlug: "home-decor"
      }
    ]
  },
  {
    id: "cat-ask-astro",
    name: "Ask Astro",
    slug: "ask-astro",
    icon: "🔮",
    count: 19,
    heroTitle: "Vedic Astrologers, Vastu Consultants & Numerologists",
    heroSubtitle: "Consult experienced Jyothishya scholars for horoscope matching, Vastu dosha remedies, gemology, and muhurtham dates.",
    collections: [
      {
        id: "col-astro-1",
        title: "Traditional Vedic Kundali Matching",
        placesCount: 11,
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=80",
        badge: "VEDIC SCHOLARS",
        categorySlug: "ask-astro"
      },
      {
        id: "col-astro-2",
        title: "Residential & Commercial Vastu Experts",
        placesCount: 7,
        image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=500&auto=format&fit=crop&q=80",
        badge: "EXPERIENCED",
        categorySlug: "ask-astro"
      }
    ]
  },
  {
    id: "cat-wedding-planning",
    name: "Wedding Planning",
    slug: "wedding-planning",
    icon: "💍",
    count: 28,
    heroTitle: "Wedding Planners, Kalyana Mandapams & Caterers",
    heroSubtitle: "End-to-end wedding management: convention halls, stage flower decor, wedding photographers, band, and royal catering.",
    collections: [
      {
        id: "col-wed-1",
        title: "AC Kalyana Mandapams & Banquet Halls",
        placesCount: 13,
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=80",
        badge: "GRAND BANQUETS",
        categorySlug: "wedding-planning"
      },
      {
        id: "col-wed-2",
        title: "Destination Decor & Event Planners",
        placesCount: 9,
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&auto=format&fit=crop&q=80",
        badge: "CUSTOM THEMES",
        categorySlug: "wedding-planning"
      }
    ]
  },
  {
    id: "cat-education",
    name: "Education",
    slug: "education",
    icon: "🎓",
    count: 42,
    heroTitle: "Schools, Coaching Institutes, IIT-JEE & Tutoring",
    heroSubtitle: "Top CBSE/ICSE schools, NEET/IIT coaching academies, overseas education consultants, and skill academies.",
    collections: [
      {
        id: "col-edu-1",
        title: "Top IIT-JEE & NEET Coaching Centers",
        placesCount: 16,
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80",
        badge: "TOP RANKS",
        categorySlug: "education"
      },
      {
        id: "col-edu-2",
        title: "Study Abroad & IELTS Visa Consultants",
        placesCount: 12,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80",
        badge: "GLOBAL ADMISSION",
        categorySlug: "education"
      }
    ]
  },
  {
    id: "cat-rent-hire",
    name: "Rent & Hire",
    slug: "rent-hire",
    icon: "🔑",
    count: 27,
    heroTitle: "Equipment Rentals, Self-Drive Cars & Event Hire",
    heroSubtitle: "Rent self-drive cars, tempo travellers, audio-visual sound systems, generator sets, and industrial machinery.",
    collections: [
      {
        id: "col-rent-1",
        title: "Self-Drive Cars & Outstation Suvs",
        placesCount: 11,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=80",
        badge: "ZERO DEPOSIT",
        categorySlug: "rent-hire"
      },
      {
        id: "col-rent-2",
        title: "Event Sound, Lighting & Generators",
        placesCount: 9,
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
        badge: "24/7 SUPPORT",
        categorySlug: "rent-hire"
      }
    ]
  },
  {
    id: "cat-hospitals",
    name: "Hospitals",
    slug: "hospitals",
    icon: "🏥",
    count: 36,
    heroTitle: "Multispeciality Hospitals & Emergency Trauma Centers",
    heroSubtitle: "24/7 emergency casualty, cardiology, orthopedic surgery, oncology, ICU, and maternity hospitals.",
    collections: [
      {
        id: "col-hosp-1",
        title: "24/7 Emergency & Critical Care Hospitals",
        placesCount: 15,
        image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format&fit=crop&q=80",
        badge: "24/7 CASUALTY",
        categorySlug: "hospitals"
      },
      {
        id: "col-hosp-2",
        title: "Specialized Maternity & Pediatric Hospitals",
        placesCount: 12,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=80",
        badge: "SPECIALIZED",
        categorySlug: "hospitals"
      }
    ]
  },
  {
    id: "cat-contractors",
    name: "Contractors",
    slug: "contractors",
    icon: "👷",
    count: 33,
    heroTitle: "Civil Building Contractors & Construction Services",
    heroSubtitle: "Licensed civil contractors, waterproofing, electrical works, structural steel, borewells, and painting works.",
    collections: [
      {
        id: "col-cont-1",
        title: "Turnkey Residential Building Contractors",
        placesCount: 14,
        image: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=500&auto=format&fit=crop&q=80",
        badge: "QUALITY BUILD",
        categorySlug: "contractors"
      },
      {
        id: "col-cont-2",
        title: "Waterproofing & Structural Repair Experts",
        placesCount: 9,
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80",
        badge: "10-YR WARRANTY",
        categorySlug: "contractors"
      }
    ]
  },
  {
    id: "cat-pet-shops",
    name: "Pet Shops",
    slug: "pet-shops",
    icon: "🐾",
    count: 17,
    heroTitle: "Pet Shops, Veterinary Clinics & Pet Grooming",
    heroSubtitle: "Premium dog/cat food, pet accessories, veterinary vaccination clinics, pet hostel boarding, and spa grooming.",
    collections: [
      {
        id: "col-pet-1",
        title: "Pet Grooming & Spa Centers",
        placesCount: 8,
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80",
        badge: "PET FRIENDLY",
        categorySlug: "pet-shops"
      },
      {
        id: "col-pet-2",
        title: "Verified Veterinary Clinics & Vaccination",
        placesCount: 9,
        image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=80",
        badge: "DOCTOR CERTIFIED",
        categorySlug: "pet-shops"
      }
    ]
  },
  {
    id: "cat-pg-hostels",
    name: "PG/Hostels",
    slug: "pg-hostels",
    icon: "🛏️",
    count: 29,
    heroTitle: "Men's, Women's & Working Professional PGs",
    heroSubtitle: "Verified paying guest accommodations with hygienic South Indian food, high-speed Wi-Fi, AC rooms, and 24/7 security.",
    collections: [
      {
        id: "col-pg-1",
        title: "Working Women's Deluxe AC Hostels",
        placesCount: 14,
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&auto=format&fit=crop&q=80",
        badge: "24/7 CCTV & SECURITY",
        categorySlug: "pg-hostels"
      },
      {
        id: "col-pg-2",
        title: "Executive Men's PGs near Tech & Colleges",
        placesCount: 15,
        image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=500&auto=format&fit=crop&q=80",
        badge: "HOMELY FOOD",
        categorySlug: "pg-hostels"
      }
    ]
  },
  {
    id: "cat-estate-agent",
    name: "Estate Agent",
    slug: "estate-agent",
    icon: "🏢",
    count: 35,
    heroTitle: "Real Estate Brokers, Commercial & Residential Agents",
    heroSubtitle: "Find 2BHK/3BHK apartments, commercial office spaces, CRDA approved open plots, and rental properties with zero brokerage hassle.",
    collections: [
      {
        id: "col-estate-1",
        title: "Gated Community 2BHK/3BHK Flats for Sale",
        placesCount: 18,
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&auto=format&fit=crop&q=80",
        badge: "RERA APPROVED",
        categorySlug: "estate-agent"
      },
      {
        id: "col-estate-2",
        title: "Prime Commercial Showrooms for Lease",
        placesCount: 11,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80",
        badge: "HIGH ROI",
        categorySlug: "estate-agent"
      }
    ]
  },
  {
    id: "cat-dentists",
    name: "Dentists",
    slug: "dentists",
    icon: "🦷",
    count: 24,
    heroTitle: "Certified Dentists & Laser Dental Clinics",
    heroSubtitle: "Expert orthodontists, single-sitting root canal treatments, invisible aligners, teeth whitening, and pediatric dentistry.",
    collections: [
      {
        id: "col-dent-1",
        title: "Painless Laser Root Canals",
        placesCount: 11,
        image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&auto=format&fit=crop&q=80",
        badge: "TOP RATED",
        categorySlug: "dentists"
      },
      {
        id: "col-dent-2",
        title: "Clear Invisible Aligners & Braces",
        placesCount: 9,
        image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&auto=format&fit=crop&q=80",
        badge: "COSMETIC",
        categorySlug: "dentists"
      }
    ]
  }
];

export const AP_LOCALITIES_MAP: Record<string, string[]> = {
  Hyderabad: [
    "Hitec City",
    "Banjara Hills",
    "Jubilee Hills",
    "Gachibowli",
    "Madhapur",
    "Kondapur",
    "Kukatpally",
    "Secunderabad",
    "Begumpet"
  ],
  Vijayawada: [
    "Nahamar",
    "Benz Circle",
    "One Town",
    "Governorpet",
    "Patamata",
    "Moghalrajpuram",
    "Bhavanipuram",
    "Gollapudi"
  ],
  Guntur: [
    "Brodipet",
    "Arundelpet",
    "Lakshmipuram",
    "Kothapet",
    "Vidyanagar",
    "Pattabhipuram",
    "Nallapadu"
  ]
};

export const TRENDING_AP_SEARCHES = [
  "Late Night Biryani",
  "24/7 AC Jet Cleaning",
  "Luxury Hair Spa Rd 36",
  "Packers & Movers",
  "Commercial Office Space",
  "Biryani near Benz Circle",
  "Painless Laser Dentists Nahamar"
];

export const TRENDING_LOCAL_TOPICS: Record<string, Array<{ tag: string; desc: string }>> = {
  Hyderabad: [
    { tag: "Late Night Biryani", desc: "Open till 3 AM at Banjara Hills" },
    { tag: "24/7 AC Jet Cleaning", desc: "Doorstep technicians in 45m" },
    { tag: "Luxury Hair Spa Rd 36", desc: "Jubilee Hills boutique salons" },
    { tag: "Packers & Movers", desc: "Free transit insurance ₹10,000" },
    { tag: "Commercial Office Space", desc: "Plug & play IT parks Hitec City" }
  ],
  Vijayawada: [
    { tag: "Biryani near Benz Circle", desc: "Claypot dum biryani spots" },
    { tag: "Painless Laser Dentists", desc: "Nahamar & MG Road clinics" },
    { tag: "3-Star Hotels near Station", desc: "Instant AC room check-in" },
    { tag: "Bridal Makeup Salons", desc: "Top wedding makeover artists" },
    { tag: "24/7 Multi-Speciality", desc: "Emergency trauma & casualty" }
  ],
  Guntur: [
    { tag: "Working Women's AC PG", desc: "Homely food Brodipet & Arundelpet" },
    { tag: "Gated Community Flats", desc: "CRDA approved 2BHK/3BHK flats" },
    { tag: "Household Packers & Movers", desc: "Zero damage shifting guarantee" },
    { tag: "Modular Kitchen Contractors", desc: "Factory finish wardrobe experts" },
    { tag: "Top IIT/NEET Academies", desc: "Experienced faculty batch admissions" }
  ]
};
