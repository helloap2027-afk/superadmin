export interface StateItem {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

export interface CityItem {
  id: string;
  districtId: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  totalBusinesses?: number;
}

export interface LocalityItem {
  id: string;
  cityId: string;
  name: string;
  slug: string;
  pincode?: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export interface ReverseGeocodeResult {
  city: CityItem;
  locality?: LocalityItem;
  distanceMeters: number;
}
