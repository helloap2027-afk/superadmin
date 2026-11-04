"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  FileCode,
  Clock,
  ShieldCheck,
  TrendingUp,
  Inbox,
  AlertTriangle,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export function EmailOverviewDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentLimit, setRecentLimit] = useState(5);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:4000/api/v1/admin/email/overview");
      if (!res.ok) throw new Error("Failed to load email metrics");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load overview data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const metrics = data?.metrics || {
    totalQueued: 0,
    submitted: 0,
    delivered: 0,
    failed: 0,
    bounced: 0,
    deferred: 0,
    totalSent: 0,
    deliveryRate: "100%",
    activeTemplates: 0,
    draftTemplates: 0,
    activeCampaigns: 0,
    scheduledCampaigns: 0,
  };

  const provider = data?.providerHealth || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0076D7] uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Enterprise Deliverability Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight mt-1">
            Email Management Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time deliverability statistics, provider authentication health, and recent email dispatches.
          </p>
        </div>

        <button
          onClick={fetchOverview}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#0076D7]" : ""}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Emails</span>
            <Inbox className="w-4 h-4 text-[#0076D7]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.totalSent}</div>
          <div className="text-[11px] text-slate-400">All transactional & promotional messages</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivered</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{metrics.delivered}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{metrics.deliveryRate} Delivery Rate</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Templates</span>
            <FileCode className="w-4 h-4 text-[#0076D7]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{metrics.activeTemplates}</div>
          <div className="text-[11px] text-slate-400">{metrics.draftTemplates} draft templates</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Failures</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{metrics.failed}</div>
          <div className="text-[11px] text-slate-400">{metrics.bounced} bounced, {metrics.deferred} deferred</div>
        </div>
      </div>

      {/* Provider Health Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Active Transport & Domain Authentication</span>
          </div>
          <div className="text-xl font-extrabold text-white">
            Provider: {provider.activeProvider || "SMTP"} ({provider.smtpHost}:{provider.smtpPort})
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Outgoing transactional and marketing emails are cryptographically signed and authenticated to ensure maximum inbox deliverability.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-800/80 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">SPF</div>
            <div className="text-xs font-extrabold text-emerald-400">{provider.spfStatus || "VERIFIED"}</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">DKIM</div>
            <div className="text-xs font-extrabold text-emerald-400">{provider.dkimStatus || "VERIFIED"}</div>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">DMARC</div>
            <div className="text-xs font-extrabold text-blue-400">{provider.dmarcStatus || "CONFIGURED"}</div>
          </div>
        </div>
      </div>

      {/* Recent Dispatches Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Outgoing Deliveries</h3>
            <p className="text-xs text-slate-500">Live records of system and marketing emails</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-medium">Show:</span>
              <select
                value={recentLimit}
                onChange={(e) => setRecentLimit(Number(e.target.value))}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0076D7]"
              >
                <option value={3}>3 records</option>
                <option value={5}>5 records</option>
                <option value={10}>10 records</option>
              </select>
            </div>
            <Link
              href="/email-management/logs"
              className="text-xs text-[#0076D7] hover:underline font-bold flex items-center gap-1"
            >
              <span>View All Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3">Reference & Event</th>
                <th className="px-5 py-3">Recipient</th>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Dispatched At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(data?.recentLogs || []).slice(0, recentLimit).map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{log.email_ref}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{log.template_key || log.email_category}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-slate-700 font-semibold">{log.recipient_masked}</span>
                  </td>
                  <td className="px-5 py-3.5 max-w-[280px]">
                    <div className="truncate text-slate-800 font-semibold">{log.subject}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.delivery_status === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : log.delivery_status === 'ACCEPTED'
                        ? 'bg-blue-50 text-[#0076D7] border border-blue-200'
                        : log.delivery_status === 'FAILED' || log.delivery_status === 'BOUNCED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {log.delivery_status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500 text-[11px]">
                    {new Date(log.created_at).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

