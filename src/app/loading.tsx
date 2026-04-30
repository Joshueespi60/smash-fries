export default function Loading() {
  return (
    <div className="mx-auto grid min-h-[60vh] w-full max-w-6xl place-items-center px-4 pt-24">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/90 p-6 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground/80">Cargando</p>
        <h2 className="mt-3 text-2xl font-black text-foreground">Preparando Smash Fries...</h2>
      </div>
    </div>
  );
}
