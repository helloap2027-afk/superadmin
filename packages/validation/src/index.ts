/**
 * Indian Mobile Number Validator (E.164 +91 followed by 10 digits starting with 6-9)
 */
export function isValidIndianPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/\s+/g, "");
  // Supports +91XXXXXXXXXX or 91XXXXXXXXXX or 10-digit XXXXXXXXXX
  const regex = /^(?:\+91|91)?[6-9]\d{9}$/;
  return regex.test(cleaned);
}

/**
 * Normalizes phone number into canonical E.164 (+91XXXXXXXXXX) format
 */
export function normalizeIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  return phone;
}

/**
 * 6-Digit SMS OTP validator
 */
export function isValidOtp(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

/**
 * Indian PIN Code validator (6 digits)
 */
export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

/**
 * Latitude & Longitude bounds check for India
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= 6.0 && lat <= 38.0 && lng >= 68.0 && lng <= 98.0;
}
