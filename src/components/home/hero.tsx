import Link from "next/link";

export function HomeHero() {
  return (
    <section className="rounded-3xl border border-red-900/70 bg-gradient-to-br from-red-950/80 via-zinc-900 to-amber-950/50 p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
        Demo universitaria
      </p>
      <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
        Smash burgers crujientes, sabor intenso y experiencia digital simple.
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-zinc-200 md:text-base">
        Proyecto académico de exposición con menú digital, carrito y envío de
        pedido por WhatsApp.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/menu"
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Ver menú
        </Link>
        <Link
          href="/nosotros"
          className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800"
        >
          Conocer más
        </Link>
      </div>
    </section>
  );
}
