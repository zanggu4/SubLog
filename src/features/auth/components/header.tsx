"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="font-bold text-lg">Subscription Ledger</h1>
        {session && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{session.user.login}</span>
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              로그아웃
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
