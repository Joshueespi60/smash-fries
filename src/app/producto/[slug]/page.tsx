import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/shared/page-shell";
import { fallbackProducts } from "@/data/fallback-data";
import { formatCurrency } from "@/lib/utils";

type ProductoPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { slug } = await params;
  const product = fallbackProducts.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <PageShell title={product.name} description={product.description}>
      <section className="grid gap-5 lg:grid-cols-2">
        <article className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60">
          <div className="aspect-[4/3] w-full bg-gradient-to-br from-red-700/20 via-zinc-900 to-amber-500/20" />
          <div className="p-5">
            <p className="text-sm text-zinc-300">{product.description}</p>
            <p className="mt-3 text-xl font-bold text-amber-300">
              {formatCurrency(product.price)}
            </p>
          </div>
        </article>

        <article className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-lg font-semibold">Extras disponibles</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-200">
            {product.extras?.map((extra) => (
              <li key={extra.id} className="flex items-center justify-between">
                <span>{extra.name}</span>
                <span className="text-amber-300">
                  +{formatCurrency(extra.price)}
                </span>
              </li>
            )) ?? <li>Sin extras para este producto.</li>}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/carrito"
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Ir al carrito
            </Link>
            <Link
              href="/menu"
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800"
            >
              Volver al menú
            </Link>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
