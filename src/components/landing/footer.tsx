import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="px-6 md:px-16 lg:px-24 py-16 flex flex-wrap justify-center gap-8 text-off-white/50 text-sm">
      <Link href="/privacy" className="hover:text-signal-orange transition-colors">
        Privacy
      </Link>
      <Link href="/terms" className="hover:text-signal-orange transition-colors">
        Terms
      </Link>
      <a
        href="https://github.com/wopr-network/holyship"
        className="hover:text-signal-orange transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
    </footer>
  );
}
