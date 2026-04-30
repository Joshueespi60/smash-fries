import Link from "next/link";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-[#faf7f2] to-muted p-8 md:p-12">
      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -left-14 bottom-0 size-40 rounded-full bg-accent/20 blur-3xl" />

      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        Smash Fries
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-foreground md:text-6xl">
        Aplastadas al momento, frescas siempre
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-foreground/90 md:text-base">
        Hamburguesas smash-style para una experiencia digital moderna en tu
        exposicion universitaria.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/menu"
          className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          Ver menu
        </Link>
        <Link
          href="/carrito"
          className="rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground transition hover:bg-secondary"
        >
          Pedir ahora
        </Link>
      </div>
    </section>
  );
}
