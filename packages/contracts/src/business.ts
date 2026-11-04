export interface BusinessSummary {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coverImageUrl?: string;
  isVerified: boolean;
  isOpenNow: boolean;
  workingHoursSummary?: string;
  averageRating: number;
  totalReviews: number;
  primaryCategory: {
    id: string;
    name: string;
    slug: string;
  };
  location: {
    addressLine1: string;
    localityName: string;
    cityName: string;
    pincode: string;
    distanceKm?: number;
    latitude: number;
    longitude: number;
  };
  contacts: {
    callNumber: string;
    whatsappNumber?: string;
  };
}

export interface BusinessRegistrationRequest {
  name: string;
  legalName?: string;
  primaryPhone: string;
  whatsappNumber?: string;
  cityId: string;
  localityId?: string;
  addressLine1: string;
  pincode: string;
  latitude: number;
  longitude: number;
  categoryId: string;
  description?: string;
}
