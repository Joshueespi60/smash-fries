import type { Metadata } from "next";
import { HomeHero } from "@/components/home/hero";
import { CommitmentGrid } from "@/components/home/commitment-grid";
import { HomeCta } from "@/components/home/home-cta";
import { ProductCard } from "@/components/menu/product-card";
import { PageContainer } from "@/components/shared/page-container";
import { getBusinessSettings, getCatalogData, getPromotions, getReviews } from "@/lib/smash-data";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Smash Fries: burgers smash-style, menu digital, promos y pedido por WhatsApp.",
};

export default async function HomePage() {
  const [{ products }, { promotions }, { reviews }, { settings }] = await Promise.all([
    getCatalogData(),
    getPromotions(),
    getReviews(),
    getBusinessSettings(),
  ]);

  const featured = products.filter((item) => item.is_featured).slice(0, 3);
  const activePromotions = promotions.filter((item) => item.is_active).slice(0, 2);
  const topReviews = reviews.filter((item) => item.is_approved).slice(0, 3);

  return (
    <PageContainer
      title="Smash Fries"
      description="Demo universitaria con experiencia completa de menu, carrito y pedido por WhatsApp."
    >
      <div className="space-y-10">
        <HomeHero />

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground">Productos destacados</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <CommitmentGrid />

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground">Promociones activas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activePromotions.map((promotion) => (
              <article
                key={promotion.id}
                className="rounded-2xl border border-border bg-card/90 p-5"
              >
                <h3 className="text-xl font-bold text-foreground">{promotion.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{promotion.description}</p>
                {promotion.price ? (
                  <p className="mt-3 text-lg font-black text-accent">
                    Desde {formatCurrency(promotion.price)}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground">Testimonios</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {topReviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-border bg-card/90 p-5"
              >
                <p className="text-sm text-foreground/90">
                  &quot;{review.comment}&quot;
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  {review.customer_name} - {review.rating}/5
                </p>
              </article>
            ))}
          </div>
        </section>

        <HomeCta whatsappNumber={settings.whatsapp_number} />
      </div>
    </PageContainer>
  );
}
