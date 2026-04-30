import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[70vh] w-full max-w-3xl place-items-center px-4 pt-24 text-center">
      <div className="space-y-4 rounded-3xl border border-border bg-card/90 p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground/80">404</p>
        <h1 className="text-3xl font-black text-foreground">Pagina no encontrada</h1>
        <p className="text-sm text-muted-foreground">
          La ruta que buscas no existe o fue movida dentro de esta demo.
        </p>
        <div className="flex justify-center">
          <Link
            href="/"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
