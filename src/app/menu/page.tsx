import { MenuGrid } from "@/components/menu/menu-grid";
import { PageShell } from "@/components/shared/page-shell";
import {
  categoryLabels,
  fallbackCategories,
  fallbackProducts,
} from "@/data/fallback-data";

export default function MenuPage() {
  return (
    <PageShell
      title="Menú Digital"
      description="Explora las categorías, encuentra productos y revisa opciones de personalización."
    >
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {fallbackCategories.map((category) => (
          <article
            key={category}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4"
          >
            <h2 className="font-semibold text-amber-300">
              {categoryLabels[category]}
            </h2>
            <p className="mt-1 text-sm text-zinc-300">Filtro base disponible.</p>
          </article>
        ))}
      </section>
      <MenuGrid products={fallbackProducts} />
    </PageShell>
  );
}
