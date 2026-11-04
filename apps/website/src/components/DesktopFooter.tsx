"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, Smartphone } from "lucide-react";

function PlayStoreIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"
        fill="#EA4335"
      />
      <path
        d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"
        fill="#4285F4"
      />
      <path
        d="M47.1 512c4.4 0 8.9-.9 13.1-3.3l325.2-186.7-60.1-60.1L47.1 512z"
        fill="#34A853"
      />
      <path
        d="M475.2 238.4l-89.9-51.6-67.4 67.4 67.4 67.4 90.2-51.8c18-10.4 18-27.4-.3-41.4z"
        fill="#FBBC04"
      />
    </svg>
  );
}

function AppleLogoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 170 170" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.07-7.66-7.85-11.88-14.34-5.88-8.91-10.45-19.16-13.72-30.76-3.26-11.6-4.9-22.38-4.9-32.33 0-14.12 3.59-25.97 10.77-35.54 7.18-9.56 16.29-14.42 27.33-14.58 4.8 0 10.35 1.34 16.65 4.02 6.3 2.68 10.05 4.08 11.24 4.2 1.45-.24 5.37-1.64 11.76-4.2 6.39-2.57 11.83-3.78 16.33-3.64 12.3.67 22.32 5.35 30.06 14.04-10.73 6.51-16 15.52-15.82 27.03.18 9.07 3.65 16.69 10.4 22.86 6.75 6.17 14.65 9.77 23.7 10.8-2.3 6.83-4.92 13.57-7.86 20.21zM119.22 33.64c0-7.03 2.57-13.7 7.71-20.02 5.14-6.32 11.39-10.38 18.75-12.18.89 6.8-.75 13.3-4.92 19.51-4.17 6.21-10.49 10.43-18.96 12.69-.78-2.61-1.58-6.1-2.58-9.4z" />
    </svg>
  );
}

export function DesktopFooter() {
  return (
    <footer className="bg-[#0B1220] text-slate-400 text-xs py-12 px-3 sm:px-4 lg:px-6 border-t border-slate-800 mt-16">
      <div className="max-w-[1720px] mx-auto space-y-10">
        
        {/* Main 4-column Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Focus & App Downloads (Left side 25% width, no separate card) */}
          <div className="space-y-3.5">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#0076D7]">HE</span>
              <span className="text-2xl font-black text-[#FF6B35]">LLO</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier hyperlocal business discovery &amp; instant enquiry engine across Hyderabad, Vijayawada, and Guntur. Connecting consumers with verified doctors, dining, movers, and doorstep services.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-[#131E32] text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold border border-[#24324D]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DPDP Act 2023 Compliant</span>
            </div>

<<<<<<< HEAD
            {/* Standard App Store & Play Store Download Badges */}
            <div className="pt-2 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Download Mobile App
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Google Play */}
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0B1220] hover:bg-black text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition shadow-xs flex items-center gap-2 select-none group"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
                    <path
                      d="M3.609 1.813A2.083 2.083 0 0 0 3 3.327v17.346c0 .594.225 1.134.609 1.514l.08.074 9.715-9.715v-.228L3.689 1.739l-.08.074z"
                      fill="#00D2FF"
                    />
                    <path
                      d="M16.634 15.539l-3.23-3.23v-.228l3.23-3.23.073.042 3.829 2.176c1.093.621 1.093 1.637 0 2.258l-3.829 2.176-.073.046z"
                      fill="#FFCE00"
                    />
                    <path
                      d="M13.404 12.081l-9.795 9.795c.422.447 1.107.498 1.892.052l11.133-6.326-3.23-3.521z"
                      fill="#FF3333"
                    />
                    <path
                      d="M13.404 11.919l3.23-3.521L5.501 2.072C4.716 1.626 4.031 1.677 3.609 2.124l9.795 9.795z"
                      fill="#00F076"
                    />
                  </svg>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[7px] uppercase tracking-wider text-slate-400 font-semibold">GET IT ON</span>
                    <span className="text-[11px] font-bold text-white group-hover:text-emerald-400 transition">Google Play</span>
                  </div>
                </a>

                {/* App Store */}
                <a
                  href="https://apple.com/app-store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0B1220] hover:bg-black text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition shadow-xs flex items-center gap-2 select-none group"
                >
                  <svg viewBox="0 0 384 512" className="w-4 h-4 shrink-0 fill-current text-white group-hover:text-slate-200 transition">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 66.2 30 148.8c14.7 39.4 39 88.5 76.5 89 33.7.6 44.2-22.3 84.7-22.3s50 22.3 84.7 21.7c37.5-.6 62.8-49.6 77.5-89 10.8-28.7 15.3-43.7 22.8-63.5-62-23.7-61.5-89.5-61.5-89.5zM250.7 94.6c15.2-19.2 25.5-45.7 22.7-72.6-22.5 1-49.6 15.2-65.7 34.4-14.2 16.8-26.7 44-23.4 70.3 25 .8 51.2-12.9 66.4-32.1z" />
                  </svg>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[7px] uppercase tracking-wider text-slate-400 font-semibold">Download on</span>
                    <span className="text-[11px] font-bold text-white group-hover:text-blue-400 transition">App Store</span>
=======
            {/* Official App Downloads on Left Side (25% column, seamlessly integrated without card container) */}
            <div className="pt-2 space-y-2 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Download Official App
              </span>
              <div className="flex flex-wrap gap-2">
                {/* Google Play Store Badge */}
                <a
                  href="http://localhost:3002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-slate-900 text-white px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-all hover:scale-105 flex items-center gap-2 shadow-sm group select-none"
                  title="Download Hello-Hi on Google Play Store"
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <PlayStoreIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[7px] uppercase tracking-wider text-slate-400 font-bold">GET IT ON</span>
                    <span className="text-[11px] font-black text-white group-hover:text-emerald-400 transition-colors">Google Play</span>
                  </div>
                </a>

                {/* Apple App Store Badge */}
                <a
                  href="http://localhost:3002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-slate-900 text-white px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-all hover:scale-105 flex items-center gap-2 shadow-sm group select-none"
                  title="Download Hello-Hi on Apple App Store"
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <AppleLogoIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[7px] uppercase tracking-wider text-slate-400 font-bold">Download on</span>
                    <span className="text-[11px] font-black text-white group-hover:text-sky-300 transition-colors">App Store</span>
>>>>>>> feature/superadmin
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Active Cities */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Active Regional Hubs</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/?city=hyderabad" className="hover:text-white transition">Hyderabad (Hitec City, Madhapur, Jubilee Hills)</Link></li>
              <li><Link href="/?city=vijayawada" className="hover:text-white transition">Vijayawada (Benz Circle, Nahamar, MG Road)</Link></li>
              <li><Link href="/?city=guntur" className="hover:text-white transition">Guntur (Brodipet, Arundelpet, Lakshmipuram)</Link></li>
              <li className="text-slate-500 pt-1">Expansion Soon: Vizag, Tirupati, Kurnool</li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/?category=restaurants" className="hover:text-white transition">🍽️ Restaurants &amp; Dining</Link></li>
              <li><Link href="/?category=hotels" className="hover:text-white transition">🏨 Hotels &amp; Suites</Link></li>
              <li><Link href="/?category=beauty-spa" className="hover:text-white transition">💆‍♀️ Beauty Spa &amp; Salons</Link></li>
              <li><Link href="/?category=wedding-planning" className="hover:text-white transition">💍 Wedding Planning</Link></li>
              <li><Link href="/?category=hospitals" className="hover:text-white transition">🏥 Hospitals &amp; Emergency</Link></li>
              <li><Link href="/?category=dentists" className="hover:text-white transition">🦷 Dentists &amp; Clinics</Link></li>
            </ul>
          </div>

          {/* Col 4: Quick Links & Support */}
          <div className="space-y-2.5">
<<<<<<< HEAD
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Company & Support</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="/about-us" className="hover:text-white transition font-medium text-slate-300">ℹ️ About Hello-Hi →</a></li>
              <li><a href="/contact-support" className="hover:text-white transition font-medium text-slate-300">📞 Contact & Support →</a></li>
              <li><a href="/faqs" className="hover:text-white transition font-medium text-slate-300">❓ Frequently Asked Questions (FAQ) →</a></li>
              <li><a href="/terms-and-conditions" className="hover:text-white transition font-medium text-slate-300">📜 Terms & Conditions →</a></li>
              <li><a href="/privacy-policy" className="hover:text-white transition font-medium text-slate-300">🛡️ Privacy Policy (DPDP 2023) →</a></li>
=======
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Help &amp; Company</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/about" className="hover:text-white transition font-medium text-slate-300">About Hello-Hi →</Link></li>
              <li><Link href="/contact" className="hover:text-white transition font-medium text-slate-300">Contact Support &amp; Hubs →</Link></li>
              <li><Link href="/faq" className="hover:text-white transition font-medium text-slate-300">Frequently Asked Questions →</Link></li>
              <li><Link href="/terms" className="hover:text-white transition font-medium text-slate-300">Terms &amp; Conditions →</Link></li>
              <li><Link href="/notifications" className="hover:text-white transition font-medium text-slate-300">Live Notification Hub →</Link></li>
              <li><a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="hover:text-white transition text-[#FF6B35] font-semibold">Super Admin Console (3001) ↗</a></li>
>>>>>>> feature/superadmin
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 HELLO Technologies Pvt. Ltd. (hello-hi.in). All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
            <Link href="/faq" className="hover:text-white transition">FAQs</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/terms" className="hover:text-white transition">Privacy Policy</Link>
            <span className="text-emerald-400">● Live SQL Engine Active</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
