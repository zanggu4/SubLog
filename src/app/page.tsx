"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings-context";
import { Sun, Moon, Globe } from "lucide-react";
import type { Language } from "@/lib/i18n";

export default function Home() {
  const { t, theme, toggleTheme, language, setLanguage } = useSettings();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Top controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
        <div className="flex items-center gap-1 text-muted bg-card px-2 py-1.5 rounded-md text-xs font-mono border border-border">
          <Globe size={14} />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent border-none outline-none appearance-none cursor-pointer uppercase font-bold pr-1"
          >
            <option value="en">EN</option>
            <option value="ko">KO</option>
            <option value="ja">JA</option>
            <option value="zh">ZH</option>
          </select>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md bg-card text-muted hover:text-foreground border border-border transition-colors cursor-pointer"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-2xl text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs text-primary font-mono">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          v1.0.0 Public Beta
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          {t.landing.heroTitle}
        </h1>
        <p className="text-xl text-muted max-w-lg mx-auto leading-relaxed whitespace-pre-line">
          {t.landing.heroSubtitle}
        </p>

        <div className="flex items-center justify-center pt-4">
          <Link
            href="/login"
            className="bg-[#24292F] hover:bg-[#2b3137] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-black/20"
          >
            <svg viewBox="0 0 24 24" width={24} height={24} fill="white">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>{t.landing.loginButton}</span>
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-4 rounded-lg bg-card/60 border border-border">
            <div className="font-mono text-primary text-sm mb-2">
              {t.landing.feature1Title}
            </div>
            <p className="text-muted text-sm">{t.landing.feature1Desc}</p>
          </div>
          <div className="p-4 rounded-lg bg-card/60 border border-border">
            <div className="font-mono text-success text-sm mb-2">
              {t.landing.feature2Title}
            </div>
            <p className="text-muted text-sm">{t.landing.feature2Desc}</p>
          </div>
          <div className="p-4 rounded-lg bg-card/60 border border-border">
            <div className="font-mono text-amber text-sm mb-2">
              {t.landing.feature3Title}
            </div>
            <p className="text-muted text-sm">{t.landing.feature3Desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
