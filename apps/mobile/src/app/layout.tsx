import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HELLO Mobile App (Dual Mode: Customer & Vendor)",
  description: "Hyperlocal business discovery and enquiry mobile application for Andhra Pradesh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

