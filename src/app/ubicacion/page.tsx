import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Navigation,
  Sparkles,
  Store,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBusinessSettings } from "@/lib/smash-data";
import { isBusinessOpen } from "@/lib/business-hours";
import { resolveWhatsAppNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Ubicación",
  description: "Encuentra Smash Fries y conoce nuestros horarios de atención.",
};

const WHATSAPP_LOCATION_MESSAGE =
  "Hola, Smash Fries. Quiero hacer un pedido o consultar la ubicación del local.";

type SocialItem = {
  label: string;
  href: string | null;
  icon: LucideIcon;
};

export default async function UbicacionPage() {
  const { settings } = await getBusinessSettings();

  const businessName = settings.business_name?.trim() || "Smash Fries";
  const openingTime = settings.opening_time || "17:00";
  const closingTime = settings.closing_time || "22:30";
  const safeAddress = settings.address?.trim() || "Av. del Pacífico y Calle 10";
  const safeCity = settings.city?.trim() || "Esmeraldas, Ecuador";
  const fullAddress = `${safeAddress}, ${safeCity}`;

  const isOpen = isBusinessOpen(openingTime, closingTime);
  const statusLabel = isOpen
    ? `Abierto ahora · Cierra a las ${closingTime}`
    : `Cerrado ahora · Abre a las ${openingTime}`;

  const whatsappNumber = resolveWhatsAppNumber(settings.whatsapp_number);
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_LOCATION_MESSAGE)}`
    : null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const mapEmbedUrl =
    settings.map_url?.trim() ||
    `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  const socialItems: SocialItem[] = [
    {
      label: "Instagram",
      href: settings.instagram_url,
      icon: Tag,
    },
    {
      label: "Facebook",
      href: settings.facebook_url,
      icon: BadgeCheck,
    },
    {
      label: "TikTok",
      href: settings.tiktok_url,
      icon: Sparkles,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 pb-12 pt-24 md:space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-amber-50 via-card to-red-50 p-6 shadow-sm md:p-8">
        <div className="pointer-events-none absolute -left-10 -top-10 size-36 rounded-full bg-primary/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-6 size-36 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <MapPin className="size-3.5" />
            Estamos en Esmeraldas, Ecuador
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">
            Ubicación
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Encuentra Smash Fries y conoce nuestros horarios de atención.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/85 md:text-base">
            Estamos en Esmeraldas, Ecuador. Te esperamos con hamburguesas
            aplastadas al momento, frescas y llenas de sabor.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
        <section className="space-y-5 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm md:p-6">
          <h2 className="text-2xl font-black text-foreground">{businessName}</h2>

          <div className="space-y-3">
            <article className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/45 p-3.5 text-sm">
              <MapPin className="mt-0.5 size-4 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Dirección</p>
                <p className="mt-1 leading-relaxed text-muted-foreground">{fullAddress}</p>
              </div>
            </article>

            <article className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary/45 p-3.5 text-sm">
              <Clock3 className="mt-0.5 size-4 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Horario de atención</p>
                <p className="mt-1 text-muted-foreground">
                  {openingTime} - {closingTime}
                </p>
              </div>
            </article>

            <article
              className={`flex items-start gap-3 rounded-2xl border p-3.5 text-sm ${
                isOpen
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-border/70 bg-secondary/45"
              }`}
            >
              <Store
                className={`mt-0.5 size-4 ${isOpen ? "text-emerald-700" : "text-primary"}`}
              />
              <div>
                <p className={`font-semibold ${isOpen ? "text-emerald-700" : "text-foreground"}`}>
                  Estado del local
                </p>
                <p className={`mt-1 ${isOpen ? "text-emerald-700" : "text-muted-foreground"}`}>
                  {statusLabel}
                </p>
              </div>
            </article>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {whatsappLink ? (
              <Button
                asChild
                className="h-10 rounded-xl px-4 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-[3px] hover:shadow-md"
              >
                <Link
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <MessageCircle className="size-4" />
                  Pedir por WhatsApp
                </Link>
              </Button>
            ) : (
              <p className="rounded-xl border border-border/70 bg-secondary/45 px-3 py-2 text-sm text-muted-foreground">
                WhatsApp no disponible en este momento.
              </p>
            )}

            <Button
              asChild
              variant="outline"
              className="h-10 rounded-xl border-border/80 bg-card px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-[3px] hover:border-primary/35 hover:shadow-sm"
            >
              <Link
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Navigation className="size-4" />
                Abrir en Google Maps
              </Link>
            </Button>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Redes sociales
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {socialItems.map((social) =>
                social.href ? (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-sm font-medium text-foreground/90 transition-all duration-200 hover:-translate-y-[2px] hover:border-primary/35 hover:text-primary"
                  >
                    <social.icon className="size-3.5" />
                    {social.label}
                  </Link>
                ) : (
                  <span
                    key={social.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/45 px-3 py-1.5 text-sm font-medium text-muted-foreground"
                  >
                    <social.icon className="size-3.5" />
                    {social.label}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border/70 bg-secondary/40 px-4 py-3 text-sm font-semibold text-foreground">
            <MapPin className="size-4 text-primary" />
            Punto de referencia en Google Maps
          </div>
          <iframe
            title="Mapa Smash Fries"
            src={mapEmbedUrl}
            className="h-[320px] w-full md:h-[360px] lg:h-[410px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </div>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Antes de visitarnos
          </p>
          <h2 className="mt-2 text-2xl font-black text-foreground md:text-3xl">
            Todo listo para llegar y pedir fácil
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm transition-all duration-200 hover:-translate-y-[3px] hover:border-primary/35 hover:shadow-md">
            <Clock3 className="size-4 text-primary" />
            <h3 className="mt-2 text-base font-black text-foreground">Horario de atención</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Atendemos de {openingTime} a {closingTime}.
            </p>
          </article>

          <article className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm transition-all duration-200 hover:-translate-y-[3px] hover:border-primary/35 hover:shadow-md">
            <MessageCircle className="size-4 text-primary" />
            <h3 className="mt-2 text-base font-black text-foreground">Pedidos rápidos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Puedes escribirnos por WhatsApp para consultar disponibilidad.
            </p>
          </article>

          <article className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm transition-all duration-200 hover:-translate-y-[3px] hover:border-primary/35 hover:shadow-md">
            <CheckCircle2 className="size-4 text-primary" />
            <h3 className="mt-2 text-base font-black text-foreground">Ubicación fácil</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Abre Google Maps para llegar directamente al punto marcado.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
