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
  robots: {
    index: true,
    follow: true,
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3548718549123736"
          crossOrigin="anonymous"
        />
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
