"use client";

import React from "react";
import BusinessProfileEditor from "@/components/vendor/BusinessProfileEditor";

export default function ManageBusinessPage() {
  return (
    <BusinessProfileEditor
      pageTitle="Manage Business"
      pageSubtitle="Update your business information, location, services, and verification documents."
      variant="manage-business"
    />
  );
}

