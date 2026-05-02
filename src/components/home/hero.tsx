import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, Flame, Sparkles, Tag, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPromotionScheduleLabel } from "@/lib/promotions";
import { formatCurrency } from "@/lib/utils";
import type { Product, Promotion } from "@/types";

const heroHighlights = [
  {
    label: "Carne smash al momento",
    icon: Flame,
  },
  {
    label: "Pedido rapido",
    icon: Clock3,
  },
  {
    label: "Promos activas",
    icon: BadgeCheck,
  },
  {
    label: "Disponible hoy",
    icon: Zap,
  },
];

type HomeHeroProps = {
  featuredPromotion?: Promotion | null;
  featuredProduct?: Product | null;
};

export function HomeHero({ featuredPromotion, featuredProduct }: HomeHeroProps) {
  const promoTitle = featuredPromotion?.title ?? "Combo Smash + papas + bebida";
  const promoImage = featuredPromotion?.image_url ?? featuredProduct?.image_url ?? null;
  const promoPrice = featuredPromotion?.price ?? featuredProduct?.price ?? null;
  const promoSchedule = featuredPromotion
    ? getPromotionScheduleLabel(featuredPromotion)
    : "Disponible hoy";
  const promoHref = featuredProduct ? `/producto/${featuredProduct.slug}` : "/menu";
  const promoLabel = featuredPromotion?.badge ?? "Especial";

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-card via-[#fff8ef] to-muted px-6 py-8 shadow-lg shadow-amber-900/10 md:px-10 md:py-10">
      <div className="pointer-events-none absolute -left-20 top-0 size-56 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-60 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-10 size-16 rounded-full border border-primary/25" />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <Sparkles className="size-3.5" />
            Sabor que se nota
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-foreground md:text-6xl">
            Aplastadas al momento, frescas siempre
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-foreground/90 md:text-base">
            Hamburguesas smash-style con menu digital, promos activas y pedido
            rapido por WhatsApp en Esmeraldas.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-11 cursor-pointer rounded-xl px-5 text-sm font-bold shadow-sm shadow-primary/30 hover:bg-primary/90"
            >
              <Link href="/menu">
                Ver menu
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 cursor-pointer rounded-xl border-border/80 bg-card/85 px-5 text-sm font-bold hover:bg-card"
            >
              <Link href="/carrito">Pedir ahora</Link>
            </Button>
          </div>

          <ul className="mt-6 grid gap-2 text-sm text-foreground/90 sm:grid-cols-2">
            {heroHighlights.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/75 px-3 py-2"
              >
                <item.icon className="size-4 text-primary" />
                <span className="font-semibold">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10">
          <Link
            href={promoHref}
            aria-label={`Ver detalle de ${promoTitle}`}
            className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <article className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-3 shadow-2xl shadow-zinc-900/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-primary/15">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70 bg-secondary/60">
                {promoImage ? (
                  <Image
                    src={promoImage}
                    alt={promoTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Tag className="size-7" />
                  </div>
                )}
              </div>

              <div className="mt-3 rounded-xl border border-border/70 bg-secondary/55 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  Promo destacada
                </p>
                <p className="mt-1 text-base font-black text-foreground">{promoTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">{promoSchedule}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  {promoLabel}
                </p>
                {promoPrice ? (
                  <p className="mt-2 text-sm font-black text-accent">
                    Desde {formatCurrency(promoPrice)}
                  </p>
                ) : null}
              </div>
            </article>
          </Link>

          <div className="pointer-events-none absolute -left-4 -top-4 rounded-xl border border-primary/20 bg-card/90 px-3 py-2 text-xs font-semibold text-foreground shadow-sm">
            +300 pedidos preparados
          </div>
          <div className="pointer-events-none absolute -bottom-4 right-3 rounded-xl border border-border/70 bg-card/90 px-3 py-2 text-xs font-semibold text-foreground shadow-sm">
            Resena promedio 4.9/5
          </div>
        </div>
      </div>
    </section>
  );
}
