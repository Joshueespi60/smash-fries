import { HomeHero } from "@/components/home/hero";
import { PageShell } from "@/components/shared/page-shell";
import { fallbackPromotions, fallbackReviews } from "@/data/fallback-data";

export default function HomePage() {
  return (
    <PageShell
      title="Smash Fries"
      description="Hamburguesas smash-style para una experiencia demo rápida, visual y deliciosa."
    >
      <HomeHero />
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-lg font-semibold">Promociones activas</h2>
          <p className="mt-2 text-sm text-zinc-300">
            {fallbackPromotions.length} promociones disponibles para mostrar en
            la exposición.
          </p>
        </article>
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-lg font-semibold">Reseñas demo</h2>
          <p className="mt-2 text-sm text-zinc-300">
            {fallbackReviews.length} reseñas iniciales para reforzar confianza
            visual en la landing.
          </p>
        </article>
      </section>
    </PageShell>
  );
}
