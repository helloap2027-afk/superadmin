export interface Business {
  id: string;
  name: string;
  pinNumber: number;
  category: "Moving" | "Dental" | "Dining" | "Home Services";
  categoryLabel: string;
  rating: number;
  reviewsCount: number;
  statusText: "Live Now" | "Open now";
  isOpen: boolean;
  address: string;
  locality: string;
  city: "Vijayawada" | "Guntur";
  workingHours: string;
  phone: string;
  whatsapp: string;
  isVerified: boolean;
  coords: {
    lat: number;
    lng: number;
  };
}

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: "biz-1",
    name: "Siri Dental Clinic",
    pinNumber: 1,
    category: "Dental",
    categoryLabel: "Healthcare & Dental",
    rating: 4.8,
    reviewsCount: 128,
    statusText: "Live Now",
    isOpen: true,
    address: "Exact Address, Nahamar, Vijayawada, AP",
    locality: "Nahamar",
    city: "Vijayawada",
    workingHours: "- 10:00:00 PM",
    phone: "+919848123456",
    whatsapp: "+919848123456",
    isVerified: true,
    coords: { lat: 16.5120, lng: 80.6515 }
  },
  {
    id: "biz-2",
    name: "Fernat Dental Business",
    pinNumber: 2,
    category: "Dental",
    categoryLabel: "Healthcare & Dental",
    rating: 4.8,
    reviewsCount: 120,
    statusText: "Open now",
    isOpen: true,
    address: "Exact Address, Nahamar, Vijayawada, AP",
    locality: "Nahamar",
    city: "Vijayawada",
    workingHours: "- 12:00:00 PM",
    phone: "+919848234567",
    whatsapp: "+919848234567",
    isVerified: true,
    coords: { lat: 16.5090, lng: 80.6480 }
  },
  {
    id: "biz-3",
    name: "Amravati Grand Restaurant",
    pinNumber: 3,
    category: "Dining",
    categoryLabel: "Food & Dining",
    rating: 4.8,
    reviewsCount: 120,
    statusText: "Live Now",
    isOpen: true,
    address: "Benz Circle, MG Road, Vijayawada, AP",
    locality: "Benz Circle",
    city: "Vijayawada",
    workingHours: "- 11:00:00 PM",
    phone: "+919848345678",
    whatsapp: "+919848345678",
    isVerified: true,
    coords: { lat: 16.5015, lng: 80.6430 }
  },
  {
    id: "biz-4",
    name: "Srinivasa Packers & Movers",
    pinNumber: 4,
    category: "Moving",
    categoryLabel: "Home Services",
    rating: 4.9,
    reviewsCount: 94,
    statusText: "Open now",
    isOpen: true,
    address: "Brodipet 4th Line, Guntur, AP",
    locality: "Brodipet",
    city: "Guntur",
    workingHours: "- 09:00:00 PM",
    phone: "+919848456789",
    whatsapp: "+919848456789",
    isVerified: true,
    coords: { lat: 16.3067, lng: 80.4365 }
  }
];

