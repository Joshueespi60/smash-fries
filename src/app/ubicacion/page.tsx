import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, MessageCircle, Navigation, Store } from "lucide-react";
import { PageContainer } from "@/components/shared/page-container";
import { getBusinessSettings } from "@/lib/smash-data";
import { getBusinessStatusLabel, isBusinessOpen } from "@/lib/business-hours";
import { resolveWhatsAppNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Ubicación",
  description: "Dirección, horario y estado abierto/cerrado de Smash Fries.",
};

export default async function UbicacionPage() {
  const { source, settings } = await getBusinessSettings();

  const isOpen = isBusinessOpen(settings.opening_time, settings.closing_time);
  const statusLabel = getBusinessStatusLabel(
    settings.opening_time,
    settings.closing_time
  );
  const whatsappNumber = resolveWhatsAppNumber(settings.whatsapp_number);
  const mapsUrl = settings.map_url
    ? settings.map_url
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${settings.address ?? ""}, ${settings.city}`
      )}`;

  return (
    <PageContainer
      title="Ubicación"
      description={`Información de contacto y horario. Fuente actual: ${source}.`}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="space-y-4 rounded-2xl border border-border bg-card/90 p-5">
          <h2 className="text-2xl font-black text-foreground">{settings.business_name}</h2>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4" />
              <span>
                {settings.address}, {settings.city}
              </span>
            </p>

            <p className="flex items-start gap-2">
              <Store className="mt-0.5 size-4" />
              <span>
                Horario: {settings.opening_time} - {settings.closing_time}
              </span>
            </p>

            <p
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                isOpen
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-secondary text-foreground/90"
              }`}
            >
              {statusLabel}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {whatsappNumber ? (
              <Link
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </Link>
            ) : null}
            <Link
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground"
            >
              <Navigation className="size-4" />
              Abrir en Google Maps
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {settings.instagram_url ? (
              <Link href={settings.instagram_url} target="_blank" rel="noreferrer">
                Instagram
              </Link>
            ) : null}
            {settings.facebook_url ? (
              <Link href={settings.facebook_url} target="_blank" rel="noreferrer">
                Facebook
              </Link>
            ) : null}
            {settings.tiktok_url ? (
              <Link href={settings.tiktok_url} target="_blank" rel="noreferrer">
                TikTok
              </Link>
            ) : null}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-card/80">
          {settings.map_url ? (
            <iframe
              title="Mapa Smash Fries"
              src={settings.map_url}
              className="h-[420px] w-full"
              loading="lazy"
            />
          ) : (
            <div className="grid h-[420px] place-items-center bg-gradient-to-br from-card via-muted to-accent/15 p-8 text-center text-muted-foreground">
              Tarjeta visual de ubicación disponible. Configura map_url para ver iframe.
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
