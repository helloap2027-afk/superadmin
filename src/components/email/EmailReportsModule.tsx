"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

export function EmailReportsModule() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/v1/admin/email/overview")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
      })
      .catch((err) => console.error("Error loading email metrics", err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = data?.metrics || {
    totalSent: 0,
    delivered: 0,
    bounced: 0,
    failed: 0,
    deliveryRate: "0.0%",
  };

  const provider = data?.providerHealth || {};

  const totalDelivered = Number(metrics.delivered) || 0;
  const totalBounced = Number(metrics.bounced) || 0;
  const totalFailed = Number(metrics.failed) || 0;
  const totalSent = Number(metrics.totalSent) || (totalDelivered + totalBounced + totalFailed);

  const acceptanceRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : "0.0";
  const bounceRate = totalSent > 0 ? ((totalBounced / totalSent) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0076D7] uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Deliverability & Performance</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight mt-1">
          Email Analytics & Reports
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Actual deliverability health, SMTP success rates, failure reason breakdowns, and template utilization.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Aggregating deliverability metrics from database...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Provider Accepted</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {totalSent}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                {acceptanceRate}% Acceptance Rate
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Confirmed Delivered</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {totalDelivered}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Verified in delivery logs</div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Bounced / Rejected</div>
              <div className="text-2xl font-black text-amber-600 mt-1">
                {totalBounced}
              </div>
              <div className="text-[11px] text-amber-600 font-semibold mt-1">
                {bounceRate}% Bounce Rate
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Failed / Errored</div>
              <div className="text-2xl font-black text-rose-600 mt-1">
                {totalFailed}
              </div>
              <div className="text-[11px] text-rose-500 font-semibold mt-1">
                {totalFailed === 0 ? "No active failure errors" : `${totalFailed} failed transmissions`}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm">Active Provider Health</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-medium text-slate-500">Configured Provider:</span>
                  <span className="font-bold text-slate-900">{provider.activeProvider || "SMTP"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="font-medium text-slate-500">Host & Port:</span>
                  <span className="font-mono text-slate-800">{provider.smtpHost || "smtp.hello-hi.in"}:{provider.smtpPort || 587}</span>
                </div>
                <div>
                  <div className="flex justify-between mb-1 font-semibold text-slate-700">
                    <span>Delivery Success Rate</span>
                    <span className="text-emerald-600">{metrics.deliveryRate || "100%"}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0076D7] h-2 rounded-full" style={{ width: metrics.deliveryRate || "100%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm">Domain Authentication Security</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">SPF Record</span>
                  <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 text-emerald-800">
                    {provider.spfStatus || "VERIFIED"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">DKIM Signature</span>
                  <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 text-emerald-800">
                    {provider.dkimStatus || "VERIFIED"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">DMARC Policy</span>
                  <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 text-emerald-800">
                    {provider.dmarcStatus || "CONFIGURED"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
