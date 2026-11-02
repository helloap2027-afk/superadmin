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
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Platform Hubs</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="hover:text-white transition text-[#FF6B35] font-semibold">Super Admin Console (3001) →</a></li>
              <li><a href="http://localhost:3002" target="_blank" rel="noopener noreferrer" className="hover:text-white transition text-[#0076D7] font-semibold">Mobile App Simulator (3002) →</a></li>
              <li><a href="http://localhost:4000/api/v1/health" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Live API Health Engine →</a></li>
              <li><a href="http://localhost:4000/api/docs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Swagger API Contracts →</a></li>
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

