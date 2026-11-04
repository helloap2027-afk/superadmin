import type { Metadata } from "next";
import "./globals.css";
import { AdminProfileProvider } from "@/context/AdminProfileContext";

export const metadata: Metadata = {
  title: "HELLO SUPER ADMIN — Enterprise Control Console",
  description: "Administrative console for HELLO Hyperlocal platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#F8FAFC]" suppressHydrationWarning>
        <AdminProfileProvider>
          {children}
        </AdminProfileProvider>
      </body>
    </html>
  );
}

