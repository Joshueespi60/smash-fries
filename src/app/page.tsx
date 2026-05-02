import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock3, MessageCircle, Quote, Sparkles, Star, Tag } from "lucide-react";
import { CommitmentGrid } from "@/components/home/commitment-grid";
import { HomeCta } from "@/components/home/home-cta";
import { HomeHero } from "@/components/home/hero";
import { ProductCard } from "@/components/menu/product-card";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import {
  getHomePromotions,
  getPromotionScheduleLabel,
  getPromotionTargetProduct,
} from "@/lib/promotions";
import {
  getBusinessSettings,
  getCatalogData,
  getPromotions,
  getReviews,
} from "@/lib/smash-data";
import { formatCurrency } from "@/lib/utils";
import type { Product, Promotion } from "@/types";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Smash Fries: burgers smash-style, menu digital, promos y pedido por WhatsApp.",
};

type PromotionCard = {
  promotion: Promotion;
  product: Product;
};

export default async function HomePage() {
  const [{ products }, { promotions }, { reviews }, { settings }] = await Promise.all([
    getCatalogData(),
    getPromotions(),
    getReviews(),
    getBusinessSettings(),
  ]);

  const featured = products.filter((item) => item.is_featured).slice(0, 3);
  const topReviews = reviews.filter((item) => item.is_approved).slice(0, 3);
  const featuredBadges = ["Top venta", "Popular", "Nuevo"];

  const promotionCards: PromotionCard[] = getHomePromotions(promotions)
    .map((promotion) => {
      const product = getPromotionTargetProduct(promotion, products);
      if (!product) {
        return null;
      }

      return { promotion, product };
    })
    .filter((item): item is PromotionCard => item !== null)
    .slice(0, 2);

  const heroPromotion =
    promotionCards.find((item) => item.product.slug === "combo-smash-classic") ??
    promotionCards[0] ??
    null;

  return (
    <PageContainer
      title="Smash Fries"
      description="Experiencia completa con menu digital, carrito y pedido rapido por WhatsApp."
    >
      <div className="space-y-12">
        <HomeHero
          featuredPromotion={heroPromotion?.promotion}
          featuredProduct={heroPromotion?.product}
        />

        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Los favoritos del momento
              </p>
              <h2 className="mt-2 text-2xl font-black text-foreground">
                Productos destacados
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Los mas pedidos para arrancar con buen sabor.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="h-10 rounded-xl border-border/80 bg-card/85 px-4 text-sm font-semibold"
            >
              <Link href="/menu">Ver menu completo</Link>
            </Button>
          </div>

          {featured.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {featured.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  badge={featuredBadges[index % featuredBadges.length]}
                />
              ))}
            </div>
          ) : (
            <article className="rounded-2xl border border-border/80 bg-card/90 p-5 text-sm text-muted-foreground">
              No hay productos destacados activos en este momento.
            </article>
          )}
        </section>

        <CommitmentGrid />

        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Ahorra hoy
            </p>
            <h2 className="mt-2 text-2xl font-black text-foreground">
              Promociones activas
            </h2>
          </div>

          {promotionCards.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {promotionCards.map(({ promotion, product }, index) => {
                const normalizedImage = promotion.image_url?.trim() || product.image_url;
                const scheduleLabel = getPromotionScheduleLabel(promotion);
                const label = promotion.badge?.trim() || (index % 2 === 0 ? "Especial" : "Ahorra");
                const detailHref = `/producto/${product.slug}`;
                const displayPrice = promotion.price ?? product.price;

                return (
                  <Link
                    key={promotion.id}
                    href={detailHref}
                    aria-label={`Ver detalle de ${promotion.title}`}
                    className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <article className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-4 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-zinc-900/10 md:p-5">
                      <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-primary/15 blur-2xl" />

                      <div className="relative z-10 grid gap-4 sm:grid-cols-[160px_1fr] sm:items-start">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70 bg-secondary/60">
                          {normalizedImage ? (
                            <Image
                              src={normalizedImage}
                              alt={promotion.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 180px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                              <Tag className="size-6" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
                              <Sparkles className="size-3.5" />
                              {label}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                              <Clock3 className="size-3.5 text-primary" />
                              {scheduleLabel}
                            </span>
                          </div>

                          <h3 className="mt-3 text-xl font-black text-foreground">
                            {promotion.title}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {promotion.description}
                          </p>
                          {displayPrice ? (
                            <p className="mt-3 text-lg font-black text-accent">
                              Desde {formatCurrency(displayPrice)}
                            </p>
                          ) : null}
                          <span className="mt-2 inline-flex text-xs font-semibold uppercase tracking-[0.15em] text-primary transition group-hover:text-primary/80">
                            Ver detalle del combo
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <article className="rounded-2xl border border-border/80 bg-card/90 p-5 text-sm text-muted-foreground">
              No hay promociones activas por ahora.
            </article>
          )}
        </section>

        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Experiencias reales
            </p>
            <h2 className="mt-2 text-2xl font-black text-foreground">Testimonios</h2>
          </div>

          {topReviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {topReviews.map((review) => {
                const roundedRating = Math.max(0, Math.min(5, Math.round(review.rating)));
                const initial = review.customer_name.trim().charAt(0).toUpperCase() || "S";

                return (
                  <article
                    key={review.id}
                    className="group relative rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-zinc-900/10"
                  >
                    <Quote className="absolute right-4 top-4 size-5 text-primary/40" />

                    <header className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-black text-accent">
                        {initial}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {review.customer_name}
                        </p>
                        <p className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <MessageCircle className="size-3.5" />
                          Resena verificada
                        </p>
                      </div>
                    </header>

                    <div className="mt-4 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={`${review.id}-${index}`}
                          className={`size-4 ${
                            index < roundedRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-zinc-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                      &quot;{review.comment}&quot;
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <article className="rounded-2xl border border-border/80 bg-card/90 p-5 text-sm text-muted-foreground">
              Aun no hay resenas aprobadas para mostrar.
            </article>
          )}
        </section>

        <HomeCta whatsappNumber={settings.whatsapp_number} />
      </div>
    </PageContainer>
  );
}
