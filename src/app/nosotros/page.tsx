import type { Metadata } from "next";
import { PageContainer } from "@/components/shared/page-container";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Historia, técnica smash y valores de la marca Smash Fries.",
};

const differentials = [
  "Carne aplastada al momento",
  "Ingredientes frescos",
  "Pan de calidad",
  "Salsas propias",
];

export default function NosotrosPage() {
  return (
    <PageContainer
      title="Nosotros"
      description="Smash Fries nace como una hamburguesería moderna, fresca y cercana."
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card/90 p-6">
          <h2 className="text-2xl font-black text-foreground">Historia de Smash Fries</h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Smash Fries representa una marca joven inspirada en la cultura urbana,
            la cocina rápida de calidad y la experiencia digital. Nació para ofrecer
            una propuesta de menú, promociones y pedidos en una web atractiva,
            clara y funcional.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card/90 p-6">
          <h2 className="text-2xl font-black text-foreground">Técnica Smash Burger</h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            La técnica smash consiste en presionar la carne sobre una plancha muy
            caliente para crear una costra crocante y caramelizada. Esto potencia
            el sabor y mantiene el interior jugoso.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-foreground">Diferenciales</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {differentials.map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-border bg-card/90 p-4 text-foreground/90"
              >
                {item}
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-gradient-to-br from-card to-accent/12 p-6">
          <h2 className="text-2xl font-black text-foreground">Marca y confianza</h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            La identidad visual combina base clara tipo concreto, acentos naranja y
            rojo para llamados a la acción y contraste limpio en tipografía. El objetivo es ofrecer
            una imagen premium, juvenil y confiable para cada cliente.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
