"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RepoCard } from "@/components/repo/repo-card";
import { getRepoConfig } from "@/lib/holyship-client";
import type { RepoSummary } from "@/lib/types";

export default function DashboardPage() {
  const [repos, setRepos] = useState<RepoSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/github/repos");
        const data = await res.json();
        const raw: { id: number; full_name: string; name: string }[] = data.repositories ?? [];

        // Phase 1: show repos immediately (no enrichment)
        const initial: RepoSummary[] = raw.map((r) => ({
          id: r.id,
          full_name: r.full_name,
          name: r.name,
          analyzed: false,
          config: null,
          inFlight: 0,
          shippedToday: 0,
          openGaps: 0,
        }));

        if (!cancelled) {
          setRepos(initial);
          setLoading(false);
        }

        // Phase 2: enrich in background (5 at a time)
        const BATCH = 5;
        for (let i = 0; i < raw.length; i += BATCH) {
          if (cancelled) break;
          const batch = raw.slice(i, i + BATCH);
          const results = await Promise.all(
            batch.map(async (r) => {
              const [owner, repo] = r.full_name.split("/");
              try {
                const configResult = await getRepoConfig(owner, repo);
                return {
                  id: r.id,
                  analyzed: configResult !== null,
                  config: configResult?.config ?? null,
                };
              } catch {
                return { id: r.id, analyzed: false, config: null };
              }
            }),
          );
          if (!cancelled) {
            setRepos((prev) =>
              prev.map((repo) => {
                const enriched = results.find((r) => r.id === repo.id);
                return enriched
                  ? { ...repo, analyzed: enriched.analyzed, config: enriched.config }
                  : repo;
              }),
            );
          }
        }
      } catch {
        // leave repos empty
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Repos</h1>
        <p className="text-muted-foreground">Loading repos...</p>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Repos</h1>
        <div className="rounded-lg border-2 border-dashed border-primary/40 p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">No repos connected</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Install the Holy Ship GitHub App to start shipping issues automatically.
          </p>
          <a
            href="/connect"
            className="inline-block rounded-lg bg-primary px-8 py-3 font-bold text-primary-foreground hover:bg-primary/90 transition-opacity"
          >
            Connect GitHub
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Repos</h1>
        <Link
          href="/connect"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-opacity"
        >
          + Connect Repo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}

        <Link
          href="/connect"
          className="flex items-center justify-center rounded-xl border-2 border-dashed border-border p-8 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
        >
          <span className="text-3xl font-light">+</span>
        </Link>
      </div>
    </div>
  );
}
