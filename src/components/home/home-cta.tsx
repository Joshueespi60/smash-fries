import Link from "next/link";
import { ArrowRight, MessageCircleMore, ShieldCheck, TimerReset, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildGeneralWhatsAppMessage,
  buildWhatsAppLink,
  resolveWhatsAppNumber,
} from "@/lib/whatsapp";

type HomeCtaProps = {
  whatsappNumber: string;
};

export function HomeCta({ whatsappNumber }: HomeCtaProps) {
  const message = buildGeneralWhatsAppMessage();
  const whatsappLink = buildWhatsAppLink(message, whatsappNumber);
  const resolvedPhone = resolveWhatsAppNumber(whatsappNumber);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-card via-[#fff8ee] to-accent/10 p-6 shadow-lg shadow-amber-900/10 md:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          <MessageCircleMore className="size-3.5" />
          Pedido en minutos
        </div>

        <h2 className="mt-4 text-2xl font-black text-foreground md:text-3xl">
          ¿Listo para ordenar tu smash?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          Escríbenos por WhatsApp y envía tu pedido en pocos pasos, con confirmación
          clara y atención rápida.
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground/90">
            <TimerReset className="size-3.5 text-primary" />
            Respuesta ágil
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground/90">
            <Truck className="size-3.5 text-primary" />
            Delivery o retiro
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground/90">
            <ShieldCheck className="size-3.5 text-primary" />
            Flujo confiable
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {whatsappLink ? (
            <Button
              asChild
              size="lg"
              className="h-11 cursor-pointer rounded-xl px-5 text-sm font-semibold hover:bg-primary/90"
            >
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                aria-label={`Abrir WhatsApp de Smash Fries (${resolvedPhone})`}
              >
                Ir a WhatsApp
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              disabled
              className="h-11 rounded-xl px-5 text-sm font-semibold"
              aria-label="WhatsApp no configurado"
            >
              WhatsApp no configurado
            </Button>
          )}

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 cursor-pointer rounded-xl border-border/80 bg-card/85 px-5 text-sm font-semibold hover:bg-card"
          >
            <Link href="/menu">
              Explorar menú
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
