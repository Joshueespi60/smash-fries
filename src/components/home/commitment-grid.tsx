import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Clock3, Leaf } from "lucide-react";

const commitments: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Calidad",
    description: "Carne seleccionada y procesos consistentes en cada pedido.",
    icon: BadgeCheck,
  },
  {
    title: "Frescura",
    description: "Preparación al momento, pan suave y toppings recién servidos.",
    icon: Leaf,
  },
  {
    title: "Rapidez",
    description: "Flujo digital directo para pedir en pocos pasos.",
    icon: Clock3,
  },
];

export function CommitmentGrid() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-black text-foreground">Nuestro compromiso</h2>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Cuidamos cada detalle para que la experiencia se sienta rica, rápida y
        confiable desde la primera visita.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {commitments.map((item) => (
          <article
            key={item.title}
            className="group rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-amber-900/10"
          >
            <div className="inline-flex rounded-xl bg-secondary/80 p-2.5 text-primary transition-colors group-hover:bg-primary/10">
              <item.icon className="size-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-accent">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
