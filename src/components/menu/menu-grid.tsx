import Link from "next/link";
import { categoryLabels } from "@/data/fallback-data";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

type MenuGridProps = {
  products: Product[];
};

export function MenuGrid({ products }: MenuGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60"
        >
          <div className="aspect-[4/3] w-full bg-gradient-to-br from-red-600/20 via-zinc-900 to-amber-500/20" />
          <div className="space-y-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold">{product.name}</h3>
              <span className="rounded-full bg-amber-900/30 px-2 py-1 text-xs text-amber-300">
                {categoryLabels[product.category]}
              </span>
            </div>
            <p className="text-sm text-zinc-300">{product.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-amber-300">
                {formatCurrency(product.price)}
              </p>
              <Link
                href={`/producto/${product.slug}`}
                className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-500"
              >
                Ver detalle
              </Link>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
