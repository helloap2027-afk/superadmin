"use client";

import React from "react";
import { ShieldCheck, Heart } from "lucide-react";

export function DesktopFooter() {
  return (
    <footer className="bg-[#0B1220] text-slate-400 text-xs py-12 px-3 sm:px-4 lg:px-6 border-t border-slate-800 mt-16">
      <div className="max-w-[1720px] mx-auto space-y-10">
        
        {/* Main 4-column Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & AP Focus */}
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black text-[#0076D7]">HE</span>
              <span className="text-2xl font-black text-[#FF6B35]">LLO</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Andhra Pradesh's premier hyperlocal business discovery & instant enquiry engine.
              Connecting consumers with verified doctors, dining, movers, and doorstep services.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-[#131E32] text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold border border-[#24324D]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>DPDP Act 2023 Compliant</span>
            </div>

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
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: AP Pilot Cities */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Pilot Cities (AP)</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="/explore?city=vijayawada" className="hover:text-white transition">Vijayawada (Nahamar, Benz Circle, One Town)</a></li>
              <li><a href="/explore?city=guntur" className="hover:text-white transition">Guntur (Brodipet, Arundelpet, Lakshmipuram)</a></li>
              <li className="text-slate-500 pt-1">Coming Soon: Visakhapatnam, Tirupati, Kurnool, Rajahmundry</li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="/?category=restaurants" className="hover:text-white transition">🍽️ Restaurants & Dining</a></li>
              <li><a href="/?category=hotels" className="hover:text-white transition">🏨 Hotels & Suites</a></li>
              <li><a href="/?category=beauty-spa" className="hover:text-white transition">💆‍♀️ Beauty Spa & Salons</a></li>
              <li><a href="/?category=wedding-planning" className="hover:text-white transition">💍 Wedding Planning</a></li>
              <li><a href="/?category=hospitals" className="hover:text-white transition">🏥 Hospitals & Emergency</a></li>
              <li><a href="/?category=estate-agent" className="hover:text-white transition">🏢 Estate Agents & Properties</a></li>
              <li><a href="/?category=dentists" className="hover:text-white transition">🦷 Dentists & Dental Clinics</a></li>
            </ul>
          </div>

          {/* Col 4: Platform Portals & Security */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Company & Support</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="/about-us" className="hover:text-white transition font-medium text-slate-300">ℹ️ About Hello-Hi →</a></li>
              <li><a href="/contact-support" className="hover:text-white transition font-medium text-slate-300">📞 Contact & Support →</a></li>
              <li><a href="/faqs" className="hover:text-white transition font-medium text-slate-300">❓ Frequently Asked Questions (FAQ) →</a></li>
              <li><a href="/terms-and-conditions" className="hover:text-white transition font-medium text-slate-300">📜 Terms & Conditions →</a></li>
              <li><a href="/privacy-policy" className="hover:text-white transition font-medium text-slate-300">🛡️ Privacy Policy (DPDP 2023) →</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 HELLO Technologies Pvt. Ltd. (hello-hi.in). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-emerald-400">● 100% Relational SQL Engine Active</span>
            <span>Made with precision for Andhra Pradesh</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

