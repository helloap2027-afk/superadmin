"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar, AdminNavbar } from "@/components/navigation";

export interface AdminLayoutProps {
  activeTab?: string;
  children: React.ReactNode;
  unreadNotifications?: number;
}

export function AdminLayout({
  activeTab = "Dashboard",
  children,
  unreadNotifications = 5,
}: AdminLayoutProps) {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen max-h-screen w-full flex bg-[#F8FAFC] overflow-hidden">
      {/* 1. Global Navigation Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === "Dashboard") router.push("/");
          else if (tab === "Notifications") router.push("/notifications");
          else if (tab === "Payments") router.push("/payments");
          else if (tab === "Subscriptions") router.push("/subscriptions");
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Top Header & Content Area */}
      <div className="flex-1 h-screen max-h-screen flex flex-col min-w-0 overflow-hidden">
        <AdminNavbar
          onToggleSidebar={() => {
            if (typeof window !== "undefined" && window.innerWidth < 1024) {
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
          unreadNotifications={unreadNotifications}
          selectedLocation="Hyderabad"
        />

        <main className="flex-1 h-[calc(100vh-76px)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

