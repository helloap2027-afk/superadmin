"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Server,
  ShieldCheck,
  Send,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Key,
  Globe,
  Lock,
  Zap
} from "lucide-react";

export function GlobalEmailSettingsModule() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [activeProvider, setActiveProvider] = useState("SMTP");
  const [smtpHost, setSmtpHost] = useState("smtp.hello-hi.in");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpEncryption, setSmtpEncryption] = useState("STARTTLS");
  const [smtpUsername, setSmtpUsername] = useState("system@hello-hi.in");
  const [defaultSenderName, setDefaultSenderName] = useState("HELLO — Hyperlocal Discovery");
  const [defaultSenderEmail, setDefaultSenderEmail] = useState("no-reply@hello-hi.in");
  const [replyToEmail, setReplyToEmail] = useState("support@hello-hi.in");
  const [supportEmail, setSupportEmail] = useState("care@hello-hi.in");
  const [supportPhone, setSupportPhone] = useState("+91 98480 22338");
  const [companyLegalName, setCompanyLegalName] = useState("HELLO Hyperlocal Services Pvt Ltd");
  const [companyAddress, setCompanyAddress] = useState("Benz Circle, MG Road, Vijayawada, Andhra Pradesh - 520010");
  const [rateLimit, setRateLimit] = useState(120);

  // Test connection state
  const [testingConn, setTestingConn] = useState(false);
  const [connResult, setConnResult] = useState<any>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/v1/admin/email/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setSettings(d);
        setActiveProvider(d.active_provider || "SMTP");
        setSmtpHost(d.smtp_host || "smtp.hello-hi.in");
        setSmtpPort(d.smtp_port || 587);
        setSmtpEncryption(d.smtp_encryption || "STARTTLS");
        setSmtpUsername(d.smtp_username || "system@hello-hi.in");
        setDefaultSenderName(d.default_sender_name || "HELLO — Hyperlocal Discovery");
        setDefaultSenderEmail(d.default_sender_email || "no-reply@hello-hi.in");
        setReplyToEmail(d.reply_to_email || "support@hello-hi.in");
        setSupportEmail(d.support_email || "care@hello-hi.in");
        setSupportPhone(d.support_phone || "+91 98480 22338");
        setCompanyLegalName(d.company_legal_name || "HELLO Hyperlocal Services Pvt Ltd");
        setCompanyAddress(d.company_address || "Benz Circle, MG Road, Vijayawada, Andhra Pradesh - 520010");
        setRateLimit(d.rate_limit_per_minute || 120);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback(null);
      const res = await fetch("http://localhost:4000/api/v1/admin/email/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeProvider,
          smtpHost,
          smtpPort,
          smtpEncryption,
          smtpUsername,
          defaultSenderName,
          defaultSenderEmail,
          replyToEmail,
          supportEmail,
          supportPhone,
          companyLegalName,
          companyAddress,
          rateLimitPerMinute: rateLimit,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback("Global email infrastructure and sender configuration saved successfully!");
        await fetchSettings();
      }
    } catch (err: any) {
      alert(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTestingConn(true);
      setConnResult(null);
      const res = await fetch("http://localhost:4000/api/v1/admin/email/settings/test-connection", {
        method: "POST",
      });
      const json = await res.json();
      setConnResult(json);
    } catch (err: any) {
      setConnResult({ success: false, message: err.message });
    } finally {
      setTestingConn(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0076D7] uppercase tracking-wider">
            <Server className="w-4 h-4" />
            <span>Infrastructure & Provider Settings</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight mt-1">
            Global Email Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage active SMTP transport, verified sender identities, legal details, and rate limits.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTestConnection}
          disabled={testingConn}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
        >
          {testingConn ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
          <span>Test SMTP Handshake</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {connResult && (
        <div
          className={`p-3.5 border text-xs font-semibold rounded-xl flex items-center gap-2 ${
            connResult.success
              ? "bg-blue-50 border-blue-200 text-blue-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          {connResult.success ? (
            <CheckCircle className="w-4 h-4 text-[#0076D7] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{connResult.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: SMTP & TRANSPORT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#0076D7]" />
              <h3 className="font-extrabold text-slate-900 text-sm">SMTP Transport & Host Configuration</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border">
              Encrypted at Rest
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Active Email Provider</label>
              <select
                value={activeProvider}
                onChange={(e) => setActiveProvider(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
              >
                <option value="SMTP">Standard SMTP (Self-Hosted / Relay)</option>
                <option value="AMAZON_SES">Amazon Simple Email Service (SES)</option>
                <option value="SENDGRID">SendGrid by Twilio</option>
                <option value="MAILGUN">Mailgun by Sinch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Server Host</label>
              <input
                type="text"
                required
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900"
                placeholder="smtp.hello-hi.in"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Port</label>
                <input
                  type="number"
                  required
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Security</label>
                <select
                  value={smtpEncryption}
                  onChange={(e) => setSmtpEncryption(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="STARTTLS">STARTTLS</option>
                  <option value="SSL_TLS">SSL / TLS</option>
                  <option value="NONE">None</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Username</label>
              <input
                type="text"
                required
                value={smtpUsername}
                onChange={(e) => setSmtpUsername(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Password / API Secret</label>
              <div className="relative">
                <input
                  type="password"
                  disabled
                  value="••••••••••••••••"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-500 cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#0076D7]">
                  Stored Securely
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: GLOBAL SENDER & CONTACT IDENTITIES */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-[#0076D7]" />
            <h3 className="font-extrabold text-slate-900 text-sm">Verified Sender & Contact Identities</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sender Display Name</label>
              <input
                type="text"
                required
                value={defaultSenderName}
                onChange={(e) => setDefaultSenderName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Seen by customers in their email inbox preview.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">From Sender Email</label>
              <input
                type="email"
                required
                value={defaultSenderEmail}
                onChange={(e) => setDefaultSenderEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Must match domain SPF/DKIM records.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reply-To Email</label>
              <input
                type="email"
                required
                value={replyToEmail}
                onChange={(e) => setReplyToEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Support Email</label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: LEGAL & COMPANY INFORMATION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-[#0076D7]" />
            <h3 className="font-extrabold text-slate-900 text-sm">Company Legal Information & Compliance</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Legal Entity Name</label>
              <input
                type="text"
                required
                value={companyLegalName}
                onChange={(e) => setCompanyLegalName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Helpline Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Physical Mailing / Registered Office Address</label>
              <input
                type="text"
                required
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Required by CAN-SPAM and international email deliverability laws in email footers.
              </span>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0076D7] hover:bg-[#0062b3] text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50 transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Global Email Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

