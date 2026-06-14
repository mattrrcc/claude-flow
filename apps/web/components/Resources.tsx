import { products } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function Resources() {
  return (
    <section id="resources" className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl uppercase text-cream sm:text-4xl">
            Built From The Grind. Shared With You.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Everything below is something I built, used, and still use to run Rebel Reaper. No
            theory, no recycled advice — just what worked.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
