"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Phone, Mail, MapPin, Clock } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("http://localhost:4000/api/v1/cms/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          subject: subject.trim() || "General Contact Enquiry",
          message: message.trim()
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to submit message");
      }

      setSuccessMsg(json.data?.message || "Your message has been stored in our database. Our team will contact you shortly!");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to submit message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Left: Quick Direct Contact Info */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-base font-black text-slate-900">Direct Support Channels</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Need immediate assistance with a business listing, verification, or customer dispute? Reach our dedicated Andhra Pradesh support desk.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
              <Phone className="w-4 h-4 text-[#0076D7] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Toll-Free Helpline</span>
                <span className="text-[#0076D7] font-semibold">1800-425-HELLO (43556)</span>
                <span className="text-[10px] text-slate-500 block">Mon-Sat, 8:00 AM - 10:00 PM IST</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Official Support Email</span>
                <span className="text-emerald-700 font-semibold">support@hello-hi.in</span>
                <span className="text-[10px] text-slate-500 block">Average response within 15 mins</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Corporate Office</span>
                <span className="text-slate-600">Level 4, Benz Circle Commercial Hub, MG Road, Vijayawada, AP 520010</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive DB-Backed Message Form */}
        <div className="md:col-span-3 bg-slate-50/70 border border-slate-200 rounded-2xl p-6">
          <h3 className="text-base font-black text-slate-900 mb-1">Send Us a Direct Message</h3>
          <p className="text-xs text-slate-500 mb-5">
            Your inquiry is recorded directly in our SQL database and routed to our team.
          </p>

          {successMsg ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">Message Successfully Saved in Database!</h4>
              <p className="text-xs text-emerald-700">{successMsg}</p>
              <button
                type="button"
                onClick={() => setSuccessMsg(null)}
                className="mt-2 text-xs font-bold text-[#0076D7] underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (WhatsApp)</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98480 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Vendor Listing / Billing / Feedback"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us how we can help you..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#0076D7]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0076D7] hover:bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
              >
                {isSubmitting ? (
                  <span>Saving to Database...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Hello-Hi Support</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
