"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NotificationsModule } from "@/components/notifications/NotificationsModule";
import { AdminSidebar, AdminNavbar } from "@/components/navigation";

export default function NotificationsPage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(5);

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
        activeTab="Notifications"
        onSelectTab={(tab) => {
          if (tab === "Dashboard") router.push("/");
          else if (tab === "Payments") router.push("/payments");
          else if (tab === "Subscriptions") router.push("/subscriptions");
          else if (tab === "CMS") router.push("/cms/terms-and-conditions");
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
          unreadNotifications={unreadCount}
          selectedLocation="Hyderabad"
          onSelectTab={(tab) => {
            if (tab === "Dashboard") router.push("/");
            else if (tab === "Payments") router.push("/payments");
            else if (tab === "Subscriptions") router.push("/subscriptions");
          }}
        />

        <div className="flex-1 h-[calc(100vh-76px)] overflow-y-auto">
          <NotificationsModule onUnreadCountChange={setUnreadCount} />
        </div>
      </div>
    </div>
  );
}
