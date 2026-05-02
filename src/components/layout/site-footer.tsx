import Link from "next/link";
import { sanitizeSocialUrl, sanitizeTextInput } from "@/lib/security";
import { resolveWhatsAppNumber } from "@/lib/whatsapp";
import type { BusinessSettings } from "@/types";

type SiteFooterProps = {
  settings: BusinessSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const whatsappNumber = resolveWhatsAppNumber(settings.whatsapp_number);
  const displayWhatsapp =
    sanitizeTextInput(settings.whatsapp_number, {
      maxLength: 20,
      collapseWhitespace: false,
    }) || whatsappNumber;
  const safeAddress =
    sanitizeTextInput(settings.address ?? "", { maxLength: 160 }) || "Av. del Pacifico y Calle 10";
  const safeCity =
    sanitizeTextInput(settings.city ?? "", { maxLength: 80 }) || "Esmeraldas, Ecuador";
  const instagramUrl = sanitizeSocialUrl(settings.instagram_url, "instagram");
  const facebookUrl = sanitizeSocialUrl(settings.facebook_url, "facebook");
  const tiktokUrl = sanitizeSocialUrl(settings.tiktok_url, "tiktok");
  const locationText = [safeAddress, safeCity].filter(Boolean).join(", ");

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
              rel="noopener noreferrer"
              className="mt-2 inline-flex text-sm font-medium text-accent hover:text-accent/90"
            >
              WhatsApp: {displayWhatsapp}
            </a>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground/80">WhatsApp no configurado</p>
          )}
        </section>

        <section>
          <h4 className="font-semibold text-foreground">Redes</h4>
          <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground/80">
            {instagramUrl ? (
              <Link href={instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram
              </Link>
            ) : null}
            {facebookUrl ? (
              <Link href={facebookUrl} target="_blank" rel="noopener noreferrer">
                Facebook
              </Link>
            ) : null}
            {tiktokUrl ? (
              <Link href={tiktokUrl} target="_blank" rel="noopener noreferrer">
                TikTok
              </Link>
            ) : null}
          </div>
        </section>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground/70">
        Smash Fries - {new Date().getFullYear()}
      </div>
    </footer>
  );
}
