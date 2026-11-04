"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  UserCheck, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  AlertCircle 
} from "lucide-react";
import { AdminLayout } from "@/components/shared";

const API_BASE = "http://localhost:4000/api/v1";

export default function CustomerViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${API_BASE}/admin/customers/${id}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success && json.data) {
            setData(json.data);
          } else {
            setError(json.message || "Customer not found");
          }
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete customer "${data?.full_name || id}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/customers/${id}/delete`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        router.push("/users/customers");
      } else {
        alert(json.message || "Delete failed");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  return (
    <AdminLayout activeTab="Users">
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/users/customers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Customers Directory
          </Link>

          {data && (
            <div className="flex items-center gap-2">
              <Link
                href={`/users/customers/${id}/edit`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Customer
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
            <p className="text-xs text-slate-500 font-medium">Fetching customer profile from MySQL...</p>
          </div>
        ) : error || !data ? (
          <div className="bg-white rounded-2xl p-8 border border-red-200 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Customer Not Found</h3>
            <p className="text-xs text-slate-500">{error || "Unable to find customer in database."}</p>
            <Link
              href="/users/customers"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl"
            >
              Return to Customers
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0 border border-blue-100">
                  {(data.name || data.full_name) ? (data.name || data.full_name).charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900">{(data.name || data.full_name) || "Customer Account"}</h1>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                        data.status === "ACTIVE"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : "text-amber-700 bg-amber-50 border-amber-200"
                      }`}
                    >
                      {data.status === "ACTIVE" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {data.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">{data.id}</p>
                </div>
              </div>
            </div>

            {/* Profile Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Personal &amp; Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Full Name</span>
                  <div className="font-bold text-slate-900 text-sm">{(data.name || data.full_name) || "N/A"}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Phone Number</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {(data.phone || data.phone_number)}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Email Address</span>
                  <div className="font-medium text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {data.email || "No email linked"}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Total Enquiries Sent</span>
                  <div className="font-semibold text-blue-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> {(data.enquiries !== undefined ? data.enquiries : data.total_enquiries) || 0} Inquiries
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Registration Date</span>
                  <div className="font-medium text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {(data.joined || data.created_at) ? new Date((data.joined || data.created_at)).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Last Profile Update</span>
                  <div className="font-medium text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {data.updated_at ? new Date(data.updated_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
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

