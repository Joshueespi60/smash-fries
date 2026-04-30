import Link from "next/link";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Menú" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/ubicacion", label: "Ubicación" },
  { href: "/carrito", label: "Carrito" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          <span className="text-red-500">Smash</span>{" "}
          <span className="text-amber-300">Fries</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-zinc-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
