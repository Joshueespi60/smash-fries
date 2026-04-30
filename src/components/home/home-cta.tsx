import Link from "next/link";

type HomeCtaProps = {
  whatsappNumber: string;
};

export function HomeCta({ whatsappNumber }: HomeCtaProps) {
  const phone = whatsappNumber.replace(/\D/g, "");

  return (
    <section className="rounded-3xl border border-border bg-gradient-to-br from-card via-muted to-accent/10 p-6">
      <h2 className="text-2xl font-black text-foreground">Listo para ordenar tu smash?</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Escribenos por WhatsApp y vive el flujo completo de pedido demo.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`https://wa.me/${phone}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Ir a WhatsApp
        </Link>
        <Link
          href="/menu"
          className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground"
        >
          Explorar menu
        </Link>
      </div>
    </section>
  );
}
