"use client";

import { useSession, signOut } from "next-auth/react";
import { useSettings } from "@/lib/settings-context";
import { Terminal, Github, LogOut, Sun, Moon, Globe } from "lucide-react";
import type { Language } from "@/lib/i18n";
import type { CurrencyCode } from "@/lib/currency";

export function Header() {
  const { data: session } = useSession();
  const {
    t,
    theme,
    toggleTheme,
    language,
    setLanguage,
    displayCurrency,
    setDisplayCurrency,
  } = useSettings();

  return (
    <header className="border-b border-border bg-card/70 backdrop-blur-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
            <Terminal size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {t.app.title}
            </h1>
            <p className="text-xs text-muted font-mono hidden sm:block">
              {t.app.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency */}
          <div className="flex items-center text-muted bg-background px-2 py-1.5 rounded-md text-xs font-mono border border-border">
            <select
              value={displayCurrency}
              onChange={(e) =>
                setDisplayCurrency(e.target.value as CurrencyCode)
              }
              className="bg-transparent border-none outline-none appearance-none cursor-pointer font-bold"
            >
              <option value="KRW">₩ KRW</option>
              <option value="USD">$ USD</option>
              <option value="JPY">¥ JPY</option>
              <option value="EUR">€ EUR</option>
            </select>
          </div>

          {/* Language */}
          <div className="flex items-center gap-1 text-muted bg-background px-2 py-1.5 rounded-md text-xs font-mono border border-border">
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

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-muted hover:text-foreground hover:bg-background border border-border transition-colors cursor-pointer"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User */}
          {session && (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted">
                <Github size={16} />
                <span className="font-mono">{session.user.login}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 hover:bg-background rounded-md text-muted hover:text-foreground transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
