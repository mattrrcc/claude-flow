import { ArrowUpRight, Check } from "lucide-react";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-6 transition hover:border-reaper-gold/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-reaper-gold">
            {product.category}
          </span>
          <h3 className="mt-2 font-display text-xl uppercase text-cream">{product.title}</h3>
        </div>
        {product.badge && (
          <span className="rounded-full bg-reaper-red px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream">
            {product.badge}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>

      <ul className="mt-5 space-y-2">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-cream">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-reaper-gold" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
        <span className="font-display text-2xl text-cream">${product.price}</span>
        <a
          href={product.checkoutUrl}
          className="inline-flex items-center gap-2 rounded-full bg-reaper-red px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-cream transition hover:bg-reaper-red/90"
        >
          Get Access <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
