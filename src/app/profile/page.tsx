"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar, AdminNavbar } from "@/components/navigation";
import { ProfileOverview } from "@/components/profile";

export default function ProfilePage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("hello_admin_session");
      if (!session) {
        router.replace("/login");
      }
    }
  }, [router]);

  return (
    <div className="h-screen max-h-screen w-full flex bg-[#F8FAFC] overflow-hidden">
      <AdminSidebar
        activeTab="Profile"
        onSelectTab={(tab) => {
          if (tab === "Dashboard") router.push("/");
          else if (tab === "CMS") router.push("/cms/terms-and-conditions");
          else if (tab === "Settings") router.push("/settings");
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 h-screen max-h-screen flex flex-col min-w-0 overflow-hidden">
        <AdminNavbar
          onToggleSidebar={() => {
            if (typeof window !== "undefined" && window.innerWidth < 1024) {
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
          onSelectTab={(tab) => {
            if (tab === "Dashboard") router.push("/");
            else if (tab === "Settings") router.push("/settings");
            else if (tab === "Profile") router.push("/profile");
          }}
        />

        <main className="flex-1 h-[calc(100vh-76px)] overflow-y-auto">
          <ProfileOverview onBack={() => router.push("/")} />
        </main>
      </div>
    </div>
  );
}
