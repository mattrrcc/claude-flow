import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(193,39,45,0.12),_transparent_55%)]" />
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-reaper-gold">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Founder since {siteConfig.founded}
          </span>
          <span className="text-border">/</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {siteConfig.location}
          </span>
        </div>

        <h1 className="mt-6 max-w-3xl font-display text-4xl uppercase leading-tight text-cream sm:text-6xl">
          I built a brand from a
          <span className="text-reaper-red"> 5x5 storage unit</span>. Here&apos;s what it took.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{siteConfig.tagline}</p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#resources"
            className="inline-flex items-center gap-2 rounded-full bg-reaper-red px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream transition hover:bg-reaper-red/90"
          >
            Get the Resources <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={siteConfig.shop.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream transition hover:border-cream"
          >
            Shop Rebel Reaper
          </a>
        </div>
      </div>
    </section>
  );
}
