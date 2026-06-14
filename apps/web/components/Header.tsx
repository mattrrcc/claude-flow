import Link from "next/link";
import ReaperMark from "./ReaperMark";
import { siteConfig } from "@/lib/site-config";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="#top" className="flex items-center gap-3">
          <ReaperMark className="h-9 w-9 text-reaper-red" />
          <span className="font-display text-lg uppercase tracking-wide text-cream">
            Matt <span className="text-muted">/ Rebel Reaper</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm uppercase tracking-wide text-muted sm:flex">
          <Link href="#about" className="transition hover:text-cream">
            About
          </Link>
          <Link href="#resources" className="transition hover:text-cream">
            Resources
          </Link>
          <Link href="#connect" className="transition hover:text-cream">
            Connect
          </Link>
        </nav>
        <a
          href={siteConfig.social.personal.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-reaper-gold px-4 py-2 text-xs font-semibold uppercase tracking-wide text-reaper-gold transition hover:bg-reaper-gold hover:text-ink"
        >
          Follow
        </a>
      </div>
    </header>
  );
}
