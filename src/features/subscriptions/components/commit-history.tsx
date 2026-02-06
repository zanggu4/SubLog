"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CommitEntry {
  sha: string;
  message: string;
  date: string;
  url: string;
}

export function CommitHistory() {
  const [commits, setCommits] = useState<CommitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/commits?page=${page}`)
      .then((res) => res.json())
      .then((data) => setCommits(data))
      .catch(() => setCommits([]))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <Card>
      <h3 className="font-semibold mb-4">커밋 히스토리</h3>
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-border/50 rounded animate-pulse" />
          ))}
        </div>
      ) : commits.length === 0 ? (
        <p className="text-sm text-muted">커밋 기록이 없습니다.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {commits.map((c) => (
              <li key={c.sha} className="border-b border-border pb-3 last:border-0">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono hover:text-primary"
                >
                  {c.message}
                </a>
                <p className="text-xs text-muted mt-0.5">
                  {c.sha.slice(0, 7)} &middot;{" "}
                  {c.date ? new Date(c.date).toLocaleDateString("ko-KR") : ""}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              이전
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPage((p) => p + 1)}
              disabled={commits.length < 20}
            >
              다음
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
