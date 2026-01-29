import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { NextAuthProvider } from "@/components/auth/next-auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { SessionUpdateBanner } from "@/components/session-update-banner";
import ScrollToTop from "@/components/ScrollToTop";
import { FloatingContactButtons } from "@/components/Common/FloatingContactButtons";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TokExpert - TikTok Shop Management Platform",
  description: "Manage your TikTok Shop efficiently with TokExpert",
  metadataBase: new URL('https://tiktokshop.expert'),
  openGraph: {
    title: "TokExpert - TikTok Shop Management Platform",
    description: "Manage your TikTok Shop efficiently with TokExpert",
    url: "https://tiktokshop.expert",
    siteName: "TokExpert",
    images: [
      {
        url: "/images/og-thumb.png",
        width: 1200,
        height: 630,
        alt: "TokExpert - Đừng Chỉ Bán Hàng. Hãy Xây Dựng Đế Chế.",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${geistMono.variable} antialiased`}
      >
          <NextAuthProvider>
            <NotificationProvider>
              <SessionUpdateBanner />
              {children}
              <ScrollToTop />
              <FloatingContactButtons />
            </NotificationProvider>
          </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
