import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HELLO — Discover Local. Connect Instantly.",
  description: "Hyperlocal business discovery and instant enquiry platform in Vijayawada and Guntur, Andhra Pradesh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#F8FAFC]">{children}</body>
    </html>
  );
}

