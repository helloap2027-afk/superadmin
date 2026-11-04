"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar, AdminNavbar } from "@/components/navigation";
import { NormalPushModule } from "@/components/advertisements/NormalPushModule";

export default function NormalPushNotificationsPage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full flex bg-[#F8FAFC] overflow-hidden">
      <AdminSidebar
        activeTab="Advertisement Management"
        onSelectTab={(tab) => {
          if (tab === "Dashboard") router.push("/");
          else if (tab === "Notifications") router.push("/notifications");
          else if (tab === "CMS") router.push("/cms/terms-and-conditions");
          else if (tab === "Payments") router.push("/payments");
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 h-screen max-h-screen flex flex-col min-w-0 overflow-hidden">
        <AdminNavbar
          onToggleSidebar={handleToggleSidebar}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          unreadNotifications={5}
          selectedLocation="Vijayawada"
        />

        <div className="flex-1 h-[calc(100vh-76px)] overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1220] tracking-tight">
                Normal Push Notifications & Templates
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Monitor system logs and configure automated notification templates for key customer and merchant events.
              </p>
            </div>
          </div>

          <NormalPushModule />
        </div>
      </div>
    </div>
  );
}
