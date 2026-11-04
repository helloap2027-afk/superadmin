"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Store, 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  Save, 
  CheckCircle2 
} from "lucide-react";
import { AdminLayout } from "@/components/shared";

const API_BASE = "http://localhost:4000/api/v1";

export default function MerchantEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Lookups
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);

  // 12 Form Fields matching your registration screen
  const [form, setForm] = useState({
    businessName: "",
    legalEntityName: "",
    categoryId: "",
    pilotCityId: "",
    locality: "",
    landmark: "",
    pincode: "",
    contactPhone: "",
    whatsappNumber: "",
    opensAt: "09:00 AM",
    closesAt: "09:30 PM",
    gstinOrTradeLicense: "",
    streetAddress: "",
    status: "APPROVED",
    isVerified: true,
  });

  useEffect(() => {
    // 1. Fetch categories
    fetch(`${API_BASE}/categories`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) setCategories(json.data);
      })
      .catch(() => {});

    // 2. Fetch cities
    fetch(`${API_BASE}/locations/cities`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) setCities(json.data);
      })
      .catch(() => {});

    // 3. Fetch current merchant data
    if (id) {
      setLoading(true);
      fetch(`${API_BASE}/admin/merchants/${id}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data) {
            const d = json.data;
            setForm({
              businessName: d.name || "",
              legalEntityName: d.legal_name || "",
              categoryId: d.category_id || "",
              pilotCityId: d.city_id || "",
              locality: d.locality_name || "",
              landmark: d.landmark || "",
              pincode: d.pincode || "",
              contactPhone: d.primary_phone || "",
              whatsappNumber: d.whatsapp_number || d.primary_phone || "",
              opensAt: d.opens_at || "09:00 AM",
              closesAt: d.closes_at || "09:30 PM",
              gstinOrTradeLicense: d.description?.includes("GSTIN:")
                ? d.description.split("GSTIN:")[1]?.trim()
                : "36AAAAA0000A1Z5",
              streetAddress: d.address || "",
              status: d.status || "APPROVED",
              isVerified: d.is_verified === 1,
            });
          } else {
            setError(json.message || "Could not load merchant details");
          }
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg(null);
      setError(null);

      const res = await fetch(`${API_BASE}/admin/merchants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.businessName,
          legal_name: form.legalEntityName,
          categoryId: form.categoryId,
          cityId: form.pilotCityId,
          locality: form.locality,
          landmark: form.landmark,
          pincode: form.pincode,
          primary_phone: form.contactPhone,
          whatsapp_number: form.whatsappNumber,
          address: form.streetAddress,
          opens_at: form.opensAt,
          closes_at: form.closesAt,
          description: form.gstinOrTradeLicense
            ? `Trade License / GSTIN: ${form.gstinOrTradeLicense}`
            : undefined,
          status: form.status,
          is_verified: form.isVerified,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg("Merchant listing updated successfully in MySQL database!");
        setTimeout(() => {
          router.push(`/users/merchants/${id}`);
        }, 1200);
      } else {
        setError(json.message || "Failed to update merchant");
      }
    } catch (err: any) {
      setError(err?.message || "Error saving merchant");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout activeTab="Users">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href={`/users/merchants/${id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel &amp; Back to Merchant View
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading merchant profile form...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Edit Merchant Listing</h1>
                  <p className="text-xs text-slate-500">Update business information and physical store location</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/users/merchants/${id}`}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? "Saving..." : "Save Listing"}
                </button>
              </div>
            </div>

            {/* Success Banner */}
            {successMsg && (
              <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields Container */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 text-xs">
              
              {/* Row 1: Business Name & Legal / Entity Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Andhra Biryani"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Legal / Entity Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Foods LLP"
                    value={form.legalEntityName}
                    onChange={(e) => setForm({ ...form, legalEntityName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 2: Category & Pilot City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Pilot City <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={form.pilotCityId}
                    onChange={(e) => setForm({ ...form, pilotCityId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Locality, Landmark, Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Locality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Hitec City"
                    value={form.locality}
                    onChange={(e) => setForm({ ...form, locality: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Landmark</label>
                  <input
                    type="text"
                    placeholder="Near Cyber Gateway"
                    value={form.landmark}
                    onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Pincode</label>
                  <input
                    type="text"
                    placeholder="500081"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 4: Contact Phone & WhatsApp */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98480 22334"
                    value={form.contactPhone}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="+91 98480 22334"
                    value={form.whatsappNumber}
                    onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 5: Working Hours & GSTIN / Trade License */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Working Hours (Opens - Closes)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="09:00 AM"
                      value={form.opensAt}
                      onChange={(e) => setForm({ ...form, opensAt: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="09:30 PM"
                      value={form.closesAt}
                      onChange={(e) => setForm({ ...form, closesAt: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">GSTIN / Trade License</label>
                  <input
                    type="text"
                    placeholder="36AAAAA0000A1Z5"
                    value={form.gstinOrTradeLicense}
                    onChange={(e) => setForm({ ...form, gstinOrTradeLicense: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 6: Street Address */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Street Address</label>
                <input
                  type="text"
                  placeholder="Cyber Towers Lane, Hitec City"
                  value={form.streetAddress}
                  onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Row 7: Status & Verification Badge */}
              <div className="p-4 bg-slate-50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Listing Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-4">
                  <input
                    type="checkbox"
                    id="form_is_verified"
                    checked={form.isVerified}
                    onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
                    className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="form_is_verified" className="font-semibold text-slate-700 cursor-pointer text-xs">
                    Verified Merchant (KYC Green Badge)
                  </label>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3">
              <Link
                href={`/users/merchants/${id}`}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving Changes..." : "Save Listing"}
              </button>
            </div>

          </form>
        )}

      </div>
    </AdminLayout>
  );
}

