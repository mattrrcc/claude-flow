import { siteConfig } from "@/lib/site-config";

const facts = [
  { label: "Founded", value: "2016, out of a 5x5 storage unit" },
  { label: "Built on", value: "Moto culture, traditional tattoo art, the open road" },
  { label: "Funding", value: "Self-funded from day one — no investors, no shortcuts" },
  { label: "Proof point", value: "Survived 2020 when most independent brands didn't" },
];

export default function About() {
  return (
    <section id="about" className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="font-display text-3xl uppercase text-cream sm:text-4xl">Who I Am</h2>
        <div className="mt-8 grid gap-12 sm:grid-cols-2">
          <div className="space-y-4 text-base leading-relaxed text-muted">
            <p>{siteConfig.bio}</p>
            <p>
              I&apos;m not a guru and I&apos;m not selling a dream. I spent years pressing shirts
              after a 9-to-5, sitting with decisions that cost real money, and learning the hard
              way what works and what doesn&apos;t. Rebel Reaper is still here because of that —
              and so is everything I share below.
            </p>
          </div>
          <dl className="space-y-6">
            {facts.map((fact) => (
              <div key={fact.label} className="border-l-2 border-reaper-red pl-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-reaper-gold">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-cream">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
