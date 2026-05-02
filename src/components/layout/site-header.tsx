"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const navigation = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Menú" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/ubicacion", label: "Ubicación" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = useCartStore((state) => state.items);
  const cartCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-card/92 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-black tracking-tight">
          <span className="text-primary">Smash</span>{" "}
          <span className="text-accent">Fries</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm text-foreground/90 transition hover:bg-secondary",
                pathname === item.href && "bg-secondary text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/carrito"
            className="relative rounded-lg border border-border p-2 text-foreground transition hover:bg-secondary"
            aria-label="Ir al carrito"
          >
            <ShoppingCart className="size-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">
                {cartCount}
              </span>
            ) : null}
          </Link>

          <Link
            href="/carrito"
            className="hidden rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 md:inline-flex"
          >
            Pedir ahora
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-lg border border-border p-2 text-foreground transition hover:bg-secondary md:hidden"
            aria-label="Abrir menú"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="space-y-1 border-t border-border bg-card px-4 py-3 md:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm text-foreground/90 transition hover:bg-secondary",
                pathname === item.href && "bg-secondary text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/carrito"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
          >
            Pedir ahora
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
