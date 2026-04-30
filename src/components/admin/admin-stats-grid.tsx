type StatCard = {
  label: string;
  value: string | number;
};

type AdminStatsGridProps = {
  stats: StatCard[];
};

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
      {stats.map((item) => (
        <article
          key={item.label}
          className="rounded-2xl border border-border bg-card/90 p-4"
        >
          <p className="text-xs uppercase tracking-wide text-muted-foreground/80">{item.label}</p>
          <p className="mt-2 text-2xl font-black text-foreground">{item.value}</p>
        </article>
      ))}
    </div>
  );
}
