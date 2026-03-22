"use client";

import { FadeIn, Hero, Recognition } from "@/components/landing";

export default function Home() {
  return (
    <main className="bg-near-black text-off-white">
      <Hero />
      <FadeIn>
        <Recognition />
      </FadeIn>
    </main>
  );
}
