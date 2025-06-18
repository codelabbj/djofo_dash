import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Djofo Dashboard",
  description: "Admin dashboard for Djofo website",
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html suppressHydrationWarning>
      <body className={geist.className}>{children}</body>
    </html>
  );
}