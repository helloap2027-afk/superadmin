"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/shared";
import { MasterDataModule } from "@/components/shared/MasterDataModule";

export default function CategoriesAdminPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <AdminLayout
      currentSection="Categories"
      isSidebarCollapsed={isSidebarCollapsed}
      onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      isMobileSidebarOpen={isMobileSidebarOpen}
      onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
    >
      <MasterDataModule initialTab="categories" />
    </AdminLayout>
  );
}

