import test from "node:test";
import assert from "node:assert/strict";
import { isValidIndianPhone, normalizeIndianPhone, isValidOtp, isValidPincode, isValidCoordinates } from "./index.ts";

test("isValidIndianPhone correctly validates Indian mobile numbers", () => {
  assert.equal(isValidIndianPhone("+919848012345"), true);
  assert.equal(isValidIndianPhone("9848012345"), true);
  assert.equal(isValidIndianPhone("+91 98480 12345"), true);
  assert.equal(isValidIndianPhone("1234567890"), false); // Invalid starting digit
  assert.equal(isValidIndianPhone("+14155552671"), false); // Non-Indian country code
});

test("normalizeIndianPhone produces canonical +91 format", () => {
  assert.equal(normalizeIndianPhone("9848012345"), "+919848012345");
  assert.equal(normalizeIndianPhone("+91 98480 12345"), "+919848012345");
});

test("isValidOtp enforces 6-digit numeric standard", () => {
  assert.equal(isValidOtp("582914"), true);
  assert.equal(isValidOtp("12345"), false);
  assert.equal(isValidOtp("abcdef"), false);
});

test("isValidPincode enforces 6-digit Indian PIN format", () => {
  assert.equal(isValidPincode("520001"), true);
  assert.equal(isValidPincode("012345"), false); // Cannot start with 0
});

test("isValidCoordinates checks boundaries within India", () => {
  assert.equal(isValidCoordinates(16.5062, 80.6480), true); // Vijayawada
  assert.equal(isValidCoordinates(51.5074, -0.1278), false); // London (Out of bounds)
});
