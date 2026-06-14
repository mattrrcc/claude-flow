import { ArrowUpRight, Instagram } from "lucide-react";
import ReaperMark from "./ReaperMark";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer id="connect" className="bg-surface/40">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex items-center gap-3">
          <ReaperMark className="h-8 w-8 text-reaper-red" />
          <span className="font-display text-lg uppercase text-cream">Stay Connected</span>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <a
            href={siteConfig.social.personal.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-2xl border border-border bg-surface p-6 transition hover:border-reaper-gold/50"
          >
            <div>
              <div className="flex items-center gap-2 text-cream">
                <Instagram className="h-5 w-5 text-reaper-gold" />
                <span className="font-display uppercase">{siteConfig.social.personal.label}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{siteConfig.social.personal.description}</p>
            </div>
            <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-muted transition group-hover:text-cream" />
          </a>

          <a
            href={siteConfig.social.brand.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-2xl border border-border bg-surface p-6 transition hover:border-reaper-gold/50"
          >
            <div>
              <div className="flex items-center gap-2 text-cream">
                <Instagram className="h-5 w-5 text-reaper-gold" />
                <span className="font-display uppercase">{siteConfig.social.brand.label}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{siteConfig.social.brand.description}</p>
            </div>
            <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-muted transition group-hover:text-cream" />
          </a>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.brand}. All rights reserved.
          </p>
          <a
            href={siteConfig.shop.url}
            target="_blank"
            rel="noreferrer"
            className="font-semibold uppercase tracking-wide text-reaper-gold transition hover:text-cream"
          >
            {siteConfig.shop.label} &rarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
