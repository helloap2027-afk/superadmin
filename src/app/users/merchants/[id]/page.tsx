"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Store, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Edit3, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Navigation, 
  RefreshCw, 
  AlertCircle,
  ShieldCheck,
  Building2,
  Trash2
} from "lucide-react";
import { AdminLayout, PageHeader } from "@/components/shared";

interface MerchantDetailData {
  id: string;
  name: string;
  legal_name?: string;
  slug?: string;
  description?: string;
  primary_phone: string;
  whatsapp_number?: string;
  support_email?: string;
  status: string;
  is_verified: number;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  city_id?: string;
  city_name?: string;
  locality_id?: string;
  locality_name?: string;
  address?: string;
  landmark?: string;
  pincode?: string;
  category_id?: string;
  category_name?: string;
  opens_at?: string;
  closes_at?: string;
  created_at?: string;
  updated_at?: string;
}

const API_BASE = "http://localhost:4000/api/v1";

export default function MerchantViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<MerchantDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMerchant = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/admin/merchants/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setError(json.message || "Failed to load merchant record");
      }
    } catch (err: any) {
      setError(err?.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchMerchant();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete merchant "${data?.name}" (${id})? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/merchants/${id}/delete`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        router.push("/users/merchants");
      } else {
        alert(json.message || "Delete failed");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  return (
    <AdminLayout activeTab="Users">
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <Link
            href="/users/merchants"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Merchants Directory
          </Link>

          {data && (
            <div className="flex items-center gap-2">
              <Link
                href={`/users/merchants/${id}/edit`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Merchant
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Fetching merchant profile from MySQL database...</p>
          </div>
        ) : error || !data ? (
          <div className="bg-white rounded-2xl p-8 border border-red-200 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Merchant Not Found</h3>
            <p className="text-xs text-slate-500">{error || "Unable to locate this merchant record in the database."}</p>
            <Link
              href="/users/merchants"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl"
            >
              Return to Merchants
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0 border border-blue-100">
                  <Store className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900">{data.name}</h1>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                        data.status === "APPROVED"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : "text-amber-700 bg-amber-50 border-amber-200"
                      }`}
                    >
                      {data.status === "APPROVED" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {data.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Legal Name: <span className="font-semibold text-slate-700">{data.legal_name || "N/A"}</span> • ID: <span className="font-mono text-slate-400">{data.id}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 font-semibold text-xs px-3 py-1.5 rounded-xl border ${
                    data.is_verified === 1
                      ? "text-blue-700 bg-blue-50 border-blue-200"
                      : "text-amber-700 bg-amber-50 border-amber-200"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {data.is_verified === 1 ? "KYC Verified Partner" : "Pending Verification"}
                </span>
              </div>
            </div>

            {/* Complete 12 Fields Profile Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Merchant Storefront &amp; Registration Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* 1. Business Name */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Business Name</span>
                    <div className="text-xs font-bold text-slate-900">{data.name}</div>
                  </div>

                  {/* 2. Legal / Entity Name */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Legal / Entity Name</span>
                    <div className="text-xs font-semibold text-slate-800">{data.legal_name || "N/A"}</div>
                  </div>

                  {/* 3. Category */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Business Category</span>
                    <div className="text-xs font-bold text-blue-700">{data.category_name || "General Services"}</div>
                  </div>

                  {/* 4. Pilot City */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Pilot City</span>
                    <div className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {data.city_name || "Hyderabad"}
                    </div>
                  </div>

                  {/* 5. Locality */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Locality</span>
                    <div className="text-xs font-medium text-slate-800">{data.locality_name || "N/A"}</div>
                  </div>

                  {/* 6. Landmark */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Landmark</span>
                    <div className="text-xs font-medium text-slate-800">{data.landmark || "N/A"}</div>
                  </div>

                  {/* 7. Pincode */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Pincode</span>
                    <div className="text-xs font-mono font-medium text-slate-800">{data.pincode || "500081"}</div>
                  </div>

                  {/* 8. Contact Phone */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Contact Phone</span>
                    <div className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {data.primary_phone}
                    </div>
                  </div>

                  {/* 9. WhatsApp Number */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">WhatsApp Number</span>
                    <div className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" /> {data.whatsapp_number || data.primary_phone}
                    </div>
                  </div>

                  {/* 10. Working Hours */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Working Hours</span>
                    <div className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {data.opens_at || "09:00 AM"} – {data.closes_at || "09:30 PM"}
                    </div>
                  </div>

                  {/* 11. GSTIN / Trade License */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">GSTIN / Trade License</span>
                    <div className="text-xs font-mono text-slate-800">
                      {data.description?.includes("Trade License") || data.description?.includes("GSTIN:")
                        ? data.description
                        : "36AAAAA0000A1Z5"}
                    </div>
                  </div>

                  {/* 12. Street Address */}
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 md:col-span-2 lg:col-span-2">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Street Address</span>
                    <div className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {data.address || "Street location not specified"}
                    </div>
                  </div>

                </div>
              </div>

              {/* Ownership & Administrative Info */}
              <div className="pt-4 border-t border-slate-100">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Account Ownership &amp; System Metadata
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Registered Owner</span>
                    <div className="text-xs font-semibold text-slate-900">{data.owner_name}</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Support Email</span>
                    <div className="text-xs font-medium text-slate-800 flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {data.support_email || "N/A"}
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Registered On</span>
                    <div className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {data.created_at ? new Date(data.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

