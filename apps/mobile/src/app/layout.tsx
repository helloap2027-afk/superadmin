import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

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
      <body>
        <ToastProvider defaultPosition="top-right">
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

