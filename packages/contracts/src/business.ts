export interface BusinessSummary {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  isVerified: boolean;
  isFeatured?: boolean;
  isOpenNow: boolean;
  workingHoursSummary?: string;
  averageRating: number;
  totalReviews: number;
  totalEnquiries?: number;
  primaryCategory: {
    id: string;
    name: string;
    slug: string;
  };
  location: {
    addressLine1: string;
    landmark?: string;
    localityName: string;
    localitySlug?: string;
    cityName: string;
    citySlug?: string;
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

export interface SearchBusinessQueryParams {
  q?: string;
  city?: string;
  locality?: string;
  category?: string;
  minRating?: number;
  verifiedOnly?: boolean;
  openNow?: boolean;
  hasOffers?: boolean;
  dealsOnly?: boolean;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  sortBy?: "relevance" | "rating" | "distance" | "highest_rated" | "most_reviewed" | "newest" | "name_asc";
  page?: number;
  limit?: number;
}

export interface SearchBusinessPaginationMeta {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface SearchBusinessesResponse {
  success: boolean;
  data: BusinessSummary[];
  meta: SearchBusinessPaginationMeta;
  appliedFilters?: Record<string, any>;
}

export interface SearchSuggestionItem {
  id: string;
  name: string;
  slug: string;
  type?: "business" | "category" | "service" | "locality";
  categoryName?: string;
  cityName?: string;
  citySlug?: string;
  iconName?: string;
}

export interface SearchSuggestionsResponse {
  success: boolean;
  data: {
    businesses: SearchSuggestionItem[];
    categories: SearchSuggestionItem[];
    services: SearchSuggestionItem[];
    localities: SearchSuggestionItem[];
  };
}
