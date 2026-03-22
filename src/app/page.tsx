"use client";

import { FadeIn, Hero, LandingFooter, Nav, Recognition } from "@/components/landing";

export default function Home() {
  return (
    <main className="bg-near-black text-off-white">
      <Nav />
      <Hero />
      <FadeIn>
        <Recognition />
      </FadeIn>
      <LandingFooter />
    </main>
  );
}
