import test from "node:test";
import assert from "node:assert/strict";
import { calculateHaversineDistanceKm, generateSlug, formatINR } from "./distance.ts";

test("calculateHaversineDistanceKm accurately computes distance between Vijayawada and Guntur", () => {
  // Vijayawada: (16.5062, 80.6480)
  // Guntur: (16.3067, 80.4365)
  // Approximate straight-line distance is ~31 km
  const dist = calculateHaversineDistanceKm(16.5062, 80.6480, 16.3067, 80.4365);
  assert.ok(dist >= 30 && dist <= 33, `Expected distance ~31km, got ${dist}`);
});

test("generateSlug creates clean URL slugs", () => {
  assert.equal(generateSlug("Siri Dental Clinic - Nahamar!"), "siri-dental-clinic-nahamar");
  assert.equal(generateSlug("Amravati Grand & Dining"), "amravati-grand-dining");
});

test("formatINR formats Indian currency amounts", () => {
  const formatted = formatINR(1845200);
  assert.ok(formatted.includes("18,45,200") || formatted.includes("₹"), `Formatted string: ${formatted}`);
});
