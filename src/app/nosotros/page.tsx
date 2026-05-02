import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Beef,
  Clock3,
  Flame,
  HandPlatter,
  MessageCircle,
  Sandwich,
  ShoppingCart,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce la historia, técnica smash y experiencia de marca detrás de Smash Fries.",
};

type StoryStep = {
  id: number;
  text: string;
};

type SmashStep = {
  title: string;
  icon: LucideIcon;
};

type Differential = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const storySteps: StoryStep[] = [
  {
    id: 1,
    text: "Elegimos ingredientes simples y frescos.",
  },
  {
    id: 2,
    text: "Aplastamos la carne al momento para potenciar el sabor.",
  },
  {
    id: 3,
    text: "Facilitamos el pedido desde una web clara y funcional.",
  },
];

const smashSteps: SmashStep[] = [
  {
    title: "Carne fresca sobre la plancha",
    icon: Beef,
  },
  {
    title: "Presión al momento",
    icon: HandPlatter,
  },
  {
    title: "Costra crujiente y sabor intenso",
    icon: Flame,
  },
];

const differentials: Differential[] = [
  {
    title: "Carne aplastada al momento",
    description: "Más textura, mejor sellado y sabor intenso en cada mordida.",
    icon: Flame,
  },
  {
    title: "Ingredientes frescos",
    description:
      "Combinaciones simples, bien pensadas y con productos de calidad.",
    icon: Sparkles,
  },
  {
    title: "Pan de calidad",
    description: "Suave, resistente y perfecto para sostener todo el sabor.",
    icon: Sandwich,
  },
  {
    title: "Salsas propias",
    description: "Toques únicos que hacen que cada pedido tenga personalidad.",
    icon: WandSparkles,
  },
  {
    title: "Pedido fácil",
    description:
      "Una experiencia digital clara para explorar, personalizar y pedir sin complicaciones.",
    icon: ShoppingCart,
  },
  {
    title: "Estilo Smash Fries",
    description: "Una marca juvenil, directa y visualmente atractiva.",
    icon: BadgeCheck,
  },
];

const identityBadges = ["Moderna", "Cercana", "Rápida", "Apetecible", "Fácil de usar"];

export default function NosotrosPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 pb-12 pt-24 md:space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-amber-50 via-card to-red-50 p-6 shadow-sm md:p-8">
        <div className="pointer-events-none absolute -left-12 -top-12 size-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-8 size-40 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative grid gap-6 md:grid-cols-[1.25fr_0.9fr] md:items-center">
          <div>
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Hecho para amantes de las smash burgers
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">
              Nosotros
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Somos Smash Fries: hamburguesas aplastadas al momento, papas
              irresistibles y una experiencia digital pensada para pedir fácil.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                asChild
                className="h-10 rounded-xl px-4 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-[3px] hover:shadow-md"
              >
                <Link href="/menu">Ver menú</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-xl border-border/80 bg-card/90 px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-[3px] hover:border-primary/35 hover:shadow-sm"
              >
                <Link href="/carrito">Hacer pedido</Link>
              </Button>
            </div>
          </div>

          <article className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              Lo que nos define
            </p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center gap-2 text-sm text-foreground/90">
                <Flame className="size-4 text-primary" />
                Carne aplastada al momento
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/90">
                <Sandwich className="size-4 text-primary" />
                Pan suave y resistente
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/90">
                <WandSparkles className="size-4 text-primary" />
                Salsas propias con personalidad
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-sm md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Nuestra historia
        </p>
        <h2 className="mt-2 text-2xl font-black text-foreground md:text-3xl">
          Sabor intenso con una experiencia simple
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          Smash Fries nace con una idea clara: combinar el sabor intenso de una
          smash burger con una experiencia rápida, moderna y fácil de usar.
          Queremos que cada visita se sienta cercana, antojable y directa, desde
          que el usuario explora el menú hasta que arma su pedido.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90 md:text-base">
          No buscamos complicar el proceso: buscamos que pedir algo rico sea
          simple, visual y rápido.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {storySteps.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-border/80 bg-secondary/45 p-4 transition-all duration-200 hover:-translate-y-[3px] hover:border-primary/35 hover:shadow-sm"
            >
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/15 text-sm font-black text-primary">
                {item.id}
              </span>
              <p className="mt-3 text-sm text-foreground/90">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-border/80 bg-card/90 p-6 shadow-sm md:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Técnica smash
          </p>
          <h2 className="mt-2 text-2xl font-black text-foreground md:text-3xl">
            ¿Qué hace especial a una smash burger?
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          La técnica smash consiste en presionar la carne sobre una plancha muy
          caliente. Esto crea una costra dorada y caramelizada por fuera, mientras
          conserva jugosidad por dentro. El resultado es una hamburguesa con más
          textura, más aroma y más sabor.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {smashSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-border/80 bg-secondary/40 p-4 transition-all duration-200 hover:-translate-y-[3px] hover:border-primary/35 hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary/15 text-xs font-black text-primary">
                  {index + 1}
                </span>
                <step.icon className="size-4 text-primary" />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground/90">{step.title}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Diferenciales de Smash Fries
          </p>
          <h2 className="mt-2 text-2xl font-black text-foreground md:text-3xl">
            Lo que hace única nuestra propuesta
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {differentials.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm transition-all duration-200 hover:-translate-y-[3px] hover:border-primary/35 hover:shadow-md"
            >
              <div className="inline-flex size-9 items-center justify-center rounded-full bg-primary/12 text-primary">
                <item.icon className="size-4" />
              </div>
              <h3 className="mt-3 text-base font-black text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border/80 bg-gradient-to-r from-amber-50 via-card to-red-50 p-6 shadow-sm md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Experiencia digital
        </p>
        <h2 className="mt-2 text-2xl font-black text-foreground md:text-3xl">
          Una experiencia pensada para pedir fácil
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          La web de Smash Fries está diseñada para que el usuario encuentre rápido
          lo que quiere: ver productos, revisar detalles, añadir al carrito y enviar
          su pedido de forma clara. Cada pantalla busca ser simple, visual y funcional.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-border/80 bg-card/90 p-4">
            <Sparkles className="size-4 text-primary" />
            <p className="mt-2 text-sm font-semibold text-foreground">Menú claro y visual</p>
          </article>
          <article className="rounded-2xl border border-border/80 bg-card/90 p-4">
            <ShoppingCart className="size-4 text-primary" />
            <p className="mt-2 text-sm font-semibold text-foreground">
              Carrito fácil de entender
            </p>
          </article>
          <article className="rounded-2xl border border-border/80 bg-card/90 p-4">
            <MessageCircle className="size-4 text-primary" />
            <p className="mt-2 text-sm font-semibold text-foreground">
              Pedido directo por WhatsApp
            </p>
          </article>
        </div>

        <Button
          asChild
          className="mt-5 h-10 rounded-xl px-4 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-[3px] hover:shadow-md"
        >
          <Link href="/menu">Explorar menú</Link>
        </Button>
      </section>

      <section className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-sm md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Nuestra identidad
        </p>
        <h2 className="mt-2 text-2xl font-black text-foreground md:text-3xl">
          Marca cercana con energía y confianza
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Smash Fries combina una estética clara, juvenil y moderna con colores
          cálidos que transmiten energía, apetito y cercanía. El objetivo es que cada
          usuario sienta confianza desde el primer vistazo y pueda navegar sin esfuerzo.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {identityBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              {badge}
            </span>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-foreground/85 md:text-base">
          Una marca pensada para verse bien, sentirse cercana y funcionar de verdad.
        </p>
      </section>

      <section className="rounded-3xl bg-gradient-to-r from-primary to-accent p-6 text-primary-foreground shadow-sm md:p-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/90">
            Próximo paso
          </p>
          <h2 className="mt-2 text-2xl font-black md:text-4xl">
            ¿Listo para probar Smash Fries?
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/90 md:text-base">
            Explora nuestro menú, elige tus favoritos y arma tu pedido en pocos pasos.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              variant="secondary"
              className="h-10 rounded-xl bg-card px-4 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-[3px] hover:bg-card/90 hover:shadow-md"
            >
              <Link href="/menu">
                Ver menú
                <Clock3 className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-xl border-white/60 bg-transparent px-4 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-[3px] hover:bg-white/10 hover:text-primary-foreground"
            >
              <Link href="/carrito">
                Ir al carrito
                <ShoppingCart className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
