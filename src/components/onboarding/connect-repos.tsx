"use client";

import { GithubIcon } from "lucide-react";
import Link from "next/link";

const INSTALL_URL = process.env.NEXT_PUBLIC_GITHUB_APP_URL
  ? `${process.env.NEXT_PUBLIC_GITHUB_APP_URL}/installations/new`
  : "https://github.com/apps/holy-ship/installations/new";

export function ConnectRepos() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Almost there.</h1>
      <p className="text-lg text-muted-foreground max-w-lg mb-2">
        Holy Ship needs access to your repos to ship code for you. Install the GitHub App on your
        org, pick the repos you want automated, and go home.
      </p>
      <p className="text-sm text-muted-foreground/60 mb-10">
        We only need read/write on code and issues. Nothing else.
      </p>

      <a
        href={INSTALL_URL}
        className="inline-flex items-center gap-3 px-8 py-4 bg-signal-orange text-near-black font-semibold text-lg rounded hover:opacity-90 transition-opacity"
      >
        <GithubIcon className="h-6 w-6" />
        Install Holy Ship on GitHub
      </a>

      <p className="mt-6 text-sm text-muted-foreground/50">
        Already installed?{" "}
        <Link href="/dashboard" className="text-signal-orange hover:underline">
          Refresh
        </Link>
      </p>
    </div>
  );
}
