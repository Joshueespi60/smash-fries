const commitments = [
  {
    title: "Calidad",
    description: "Carne seleccionada y procesos consistentes en cada pedido.",
  },
  {
    title: "Frescura",
    description: "Preparacion al momento, pan suave y toppings recien servidos.",
  },
  {
    title: "Rapidez",
    description: "Flujo digital directo para pedir en pocos pasos.",
  },
];

export function CommitmentGrid() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-black text-foreground">Nuestro compromiso</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {commitments.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-border bg-card/90 p-5"
          >
            <h3 className="text-lg font-bold text-accent">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
