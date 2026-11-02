/**
 * HELLO Database Seeder
 * Populates initial states, pilot cities (Vijayawada, Guntur), and root categories
 */

export const INITIAL_SEEDS = {
  states: [
    { id: "state-ap", name: "Andhra Pradesh", code: "AP" }
  ],
  districts: [
    { id: "dist-krishna", stateId: "state-ap", name: "Krishna" },
    { id: "dist-guntur", stateId: "state-ap", name: "Guntur" }
  ],
  cities: [
    { id: "city-vijayawada", districtId: "dist-krishna", name: "Vijayawada", slug: "vijayawada", latitude: 16.5062, longitude: 80.6480 },
    { id: "city-guntur", districtId: "dist-guntur", name: "Guntur", slug: "guntur", latitude: 16.3067, longitude: 80.4365 }
  ],
  localities: [
    { id: "loc-nahamar", cityId: "city-vijayawada", name: "Nahamar", slug: "nahamar", pincode: "520008", latitude: 16.5120, longitude: 80.6515 },
    { id: "loc-benz-circle", cityId: "city-vijayawada", name: "Benz Circle", slug: "benz-circle", pincode: "520010", latitude: 16.5015, longitude: 80.6430 },
    { id: "loc-brodipet", cityId: "city-guntur", name: "Brodipet", slug: "brodipet", pincode: "522002", latitude: 16.3050, longitude: 80.4380 }
  ],
  categories: [
    { id: "cat-food", name: "Restaurants & Food", slug: "restaurants-food", sortOrder: 1 },
    { id: "cat-health", name: "Doctors & Clinics", slug: "doctors-clinics", sortOrder: 2 },
    { id: "cat-moving", name: "Packers & Movers", slug: "packers-movers", sortOrder: 3 },
    { id: "cat-home", name: "Home Services", slug: "home-services", sortOrder: 4 },
    { id: "cat-retail", name: "Shops & Retail", slug: "shops-retail", sortOrder: 5 },
    { id: "cat-education", name: "Education", slug: "education", sortOrder: 6 },
    { id: "cat-wellness", name: "Beauty & Wellness", slug: "beauty-wellness", sortOrder: 7 },
    { id: "cat-auto", name: "Automotive", slug: "automotive", sortOrder: 8 },
    { id: "cat-realestate", name: "Real Estate", slug: "real-estate", sortOrder: 9 },
    { id: "cat-professional", name: "Professional Services", slug: "professional-services", sortOrder: 10 }
  ],
  subscriptionPlans: [
    { id: "plan-free", name: "FREE", priceInrCents: 0, billingCycleDays: 30 },
    { id: "plan-plus", name: "HELLO_PLUS", priceInrCents: 29900, billingCycleDays: 30 }, // ₹299
    { id: "plan-pro", name: "HELLO_PRO", priceInrCents: 69900, billingCycleDays: 30 }    // ₹699
  ]
};

console.log("HELLO Seed data definitions prepared for Andhra Pradesh pilot release.");

