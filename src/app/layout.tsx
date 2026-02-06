import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { SettingsProvider } from "@/lib/settings-context";
import "./globals.css";

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
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
        />
      </head>
      <body
        className={`${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
