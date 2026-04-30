import { PageShell } from "@/components/shared/page-shell";

export default function NosotrosPage() {
  return (
    <PageShell
      title="Nosotros"
      description="Smash Fries es un concepto demo enfocado en experiencia digital, rapidez y sabor."
    >
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-lg font-semibold">Misión</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Diseñar una experiencia de pedido moderna para una exposición
            universitaria en Esmeraldas, Ecuador.
          </p>
        </article>
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-lg font-semibold">Propuesta</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Menú corto, visual fuerte y flujo de compra sencillo con salida por
            WhatsApp como canal final.
          </p>
        </article>
      </section>
    </PageShell>
  );
}
