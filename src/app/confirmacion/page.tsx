import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";

export default function ConfirmacionPage() {
  return (
    <PageShell
      title="Pedido Confirmado"
      description="Tu pedido demo fue preparado para enviarse por WhatsApp."
    >
      <div className="rounded-2xl border border-emerald-800 bg-emerald-950/40 p-5">
        <p className="text-emerald-200">
          Confirmación lista. En un caso real, aquí verías el número de orden y
          el estado inicial del pedido.
        </p>
        <Link
          href="/menu"
          className="mt-4 inline-flex rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Volver al menú
        </Link>
      </div>
    </PageShell>
  );
}
