"use client";

import Link from "next/link";

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-near-black/90 backdrop-blur-sm border-b border-off-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span className="font-mono text-xs font-bold text-signal-orange tracking-wider">
            HOLY
          </span>
          <span className="font-mono text-lg font-black text-off-white leading-none -ml-0.5">
            SHIP
          </span>
        </Link>

        <Link
          href="/login"
          className="px-4 py-1.5 bg-signal-orange text-near-black text-sm font-semibold rounded hover:opacity-90 transition-opacity"
        >
          Sign in
        </Link>
      </div>
    </nav>
  );
}
