import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { SettingsProvider } from "@/lib/settings-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sublog.bbiero.dev"),
  title: {
    default: "SubLog - Subscription Tracker Powered by Git",
    template: "%s | SubLog",
  },
  description:
    "Manage your subscriptions like you manage your code. Every change is a commit. No database — just GitHub.",
  openGraph: {
    title: "SubLog - Subscription Tracker Powered by Git",
    description:
      "Manage your subscriptions like you manage your code. Every change is a commit.",
    url: "https://sublog.bbiero.dev",
    siteName: "SubLog",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SubLog - Subscription Tracker Powered by Git",
    description:
      "Manage your subscriptions like you manage your code. Every change is a commit.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://sublog.bbiero.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
