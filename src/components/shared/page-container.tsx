import type { ReactNode } from "react";

type PageContainerProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageContainer({
  title,
  description,
  actions,
  children,
}: PageContainerProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-24">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actions}
      </header>
      {children}
    </div>
  );
}
