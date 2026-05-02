import Link from "next/link";
import type { ReactNode } from "react";
import { PageContainer } from "@/components/shared/page-container";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/promociones", label: "Promociones" },
  { href: "/admin/resenas", label: "Reseñas" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

type AdminShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminShell({ title, description, children }: AdminShellProps) {
  return (
    <PageContainer title={title} description={description}>
      <nav className="mb-5 flex flex-wrap gap-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-border px-3 py-2 text-sm text-foreground/90 transition hover:bg-secondary"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </PageContainer>
  );
}
