import Link from "next/link";
import type { ReactNode } from "react";

type AdminShellProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

const adminLinks = [
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/promociones", label: "Promociones" },
  { href: "/admin/resenas", label: "Reseñas" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export function AdminShell({ title, description, children }: AdminShellProps) {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-sm text-zinc-300">{description}</p>
      </header>
      <nav className="flex flex-wrap gap-2">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <p className="text-sm text-zinc-300">
          Módulo inicial listo para conectar con Supabase y operaciones CRUD
          demo.
        </p>
        {children ? <div className="mt-4">{children}</div> : null}
      </article>
    </section>
  );
}
