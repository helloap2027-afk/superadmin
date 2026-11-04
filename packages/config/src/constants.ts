export const APP_CONFIG = {
  name: "HELLO",
  tagline: "Discover Local. Connect Instantly.",
  domain: "https://hello-hi.in",
  apiDomain: "https://api.hello-hi.in",
  adminDomain: "https://admin.hello-hi.in",
  defaultLocale: "en",
  supportedLocales: ["en", "te"], // English and Telugu
  defaultCity: "Vijayawada",
  pilotCities: ["Vijayawada", "Guntur"],
  currency: {
    code: "INR",
    symbol: "₹"
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },
  auth: {
    otpLength: 6,
    otpTtlSeconds: 300, // 5 minutes
    otpCooldownSeconds: 45,
    maxOtpAttempts: 3,
    accessTokenTtlMinutes: 15,
    refreshTokenTtlDays: 30
  },
  rateLimits: {
    otpSend: {
      maxRequests: 3,
      windowMinutes: 15
    },
    search: {
      maxRequests: 120,
      windowMinutes: 1
    }
  }
} as const;

export type AppConfig = typeof APP_CONFIG;

