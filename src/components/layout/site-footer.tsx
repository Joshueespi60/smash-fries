import Link from "next/link";
import type { BusinessSettings } from "@/types";

type SiteFooterProps = {
  settings: BusinessSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const envWhatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  const rawWhatsappNumber =
    envWhatsappNumber && envWhatsappNumber.length > 0
      ? envWhatsappNumber
      : settings.whatsapp_number;
  const whatsappNumber = rawWhatsappNumber.replace(/\D/g, "");
  const locationText = [settings.address, settings.city].filter(Boolean).join(", ");

  return (
    <footer className="border-t border-border bg-card/90">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-4">
        <section>
          <h3 className="text-lg font-bold text-foreground">Smash Fries</h3>
          <p className="mt-2 text-sm text-muted-foreground/80">{settings.slogan}</p>
        </section>

        <section>
          <h4 className="font-semibold text-foreground">Horario</h4>
          <p className="mt-2 text-sm text-muted-foreground/80">
            {settings.opening_time} - {settings.closing_time}
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-foreground">Contacto</h4>
          <p className="mt-2 text-sm text-muted-foreground/80">{locationText}</p>
          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-sm font-medium text-accent hover:text-accent/90"
            >
              WhatsApp: {rawWhatsappNumber}
            </a>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground/80">WhatsApp no configurado</p>
          )}
        </section>

        <section>
          <h4 className="font-semibold text-foreground">Redes</h4>
          <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground/80">
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
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground/70">
        Demo academica Smash Fries - {new Date().getFullYear()}
      </div>
    </footer>
  );
}
