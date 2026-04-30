import { PageShell } from "@/components/shared/page-shell";
import { fallbackBusinessHours } from "@/data/fallback-data";
import { getBusinessStatus } from "@/lib/business-hours";

export default function UbicacionPage() {
  const status = getBusinessStatus(fallbackBusinessHours);

  return (
    <PageShell
      title="Ubicación y Horario"
      description="Encuentra a Smash Fries en Esmeraldas y revisa el estado de atención."
    >
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-lg font-semibold">Dirección demo</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Av. del Pacífico y Calle 10, Esmeraldas, Ecuador.
          </p>
        </article>
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-lg font-semibold">Estado del local</h2>
          <p
            className={`mt-2 text-sm font-semibold ${
              status.isOpen ? "text-emerald-300" : "text-amber-300"
            }`}
          >
            {status.label}
          </p>
        </article>
      </section>
    </PageShell>
  );
}
