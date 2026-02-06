"use client";

import { useState, useEffect } from "react";
import { GitCommit, ExternalLink, Clock, ChevronDown } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

interface CommitEntry {
  sha: string;
  message: string;
  date: string;
  url: string;
}

export function CommitHistory() {
  const { t } = useSettings();
  const [open, setOpen] = useState(false);
  const [commits, setCommits] = useState<CommitEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const handler = () => setRefreshKey((k) => k + 1);
    window.addEventListener("subscriptions-updated", handler);
    return () => window.removeEventListener("subscriptions-updated", handler);
  }, []);

  useEffect(() => {
    if (!open && !hasFetched) return;
    setLoading(true);
    fetch(`/api/commits?page=${page}`)
      .then((res) => res.json())
      .then((data) => setCommits(data))
      .catch(() => setCommits([]))
      .finally(() => {
        setLoading(false);
        setHasFetched(true);
      });
  }, [page, refreshKey, open, hasFetched]);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-background/50 transition-colors"
      >
        <h3 className="font-bold flex items-center gap-2">
          <GitCommit size={20} className="text-primary" />
          {t.history.header}
        </h3>
        <ChevronDown
          size={18}
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          {loading ? (
            <div className="p-8 space-y-3 border-t border-border">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-border/50 rounded animate-pulse" />
              ))}
            </div>
          ) : commits.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm border-t border-border">
              {t.history.empty}
            </div>
          ) : (
            <div className="divide-y divide-border/50 border-t border-border">
              {commits.map((c) => {
                const isFeat = c.message.startsWith("feat");
                const isChore = c.message.startsWith("chore");

                return (
                  <div
                    key={c.sha}
                    className="p-4 hover:bg-background/50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isFeat
                              ? "bg-success"
                              : isChore
                                ? "bg-amber"
                                : "bg-muted"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-mono text-sm mb-1 group-hover:text-primary transition-colors">
                          {c.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <span className="font-mono bg-border/50 px-1.5 py-0.5 rounded">
                            {c.sha.slice(0, 7)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {c.date
                              ? new Date(c.date).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted hover:text-foreground"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-background/50 px-6 py-3 border-t border-border flex justify-between text-xs text-muted">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="disabled:opacity-30 cursor-pointer hover:text-foreground transition-colors"
            >
              {t.history.prev}
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={commits.length < 20}
              className="disabled:opacity-30 cursor-pointer hover:text-foreground transition-colors"
            >
              {t.history.next}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
