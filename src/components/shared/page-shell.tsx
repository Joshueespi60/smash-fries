import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function PageShell({
  title,
  description,
  children,
  className,
}: PageShellProps) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl space-y-6 px-4 py-8", className)}>
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
        {description ? (
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
