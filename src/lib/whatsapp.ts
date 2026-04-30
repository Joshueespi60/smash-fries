import type { CartItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

const DEFAULT_PHONE = "593999999999";

type BuildOrderMessageInput = {
  items: CartItem[];
  customerName?: string;
};

type BuildWhatsappUrlInput = BuildOrderMessageInput & {
  phoneNumber?: string;
};

function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

export function buildOrderMessage({
  items,
  customerName,
}: BuildOrderMessageInput): string {
  const lines: string[] = ["Hola Smash Fries, quiero hacer este pedido demo:"];

  if (customerName) {
    lines.push(`Cliente: ${customerName}`);
  }

  let total = 0;

  items.forEach((item, index) => {
    const extrasLabel =
      item.selectedExtras.length > 0
        ? ` (Extras: ${item.selectedExtras.map((extra) => extra.name).join(", ")})`
        : "";
    const lineTotal =
      (item.basePrice +
        item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0)) *
      item.quantity;
    total += lineTotal;
    lines.push(
      `${index + 1}. ${item.quantity} x ${item.name}${extrasLabel} - ${formatCurrency(lineTotal)}`
    );
  });

  lines.push(`Total estimado: ${formatCurrency(total)}`);
  lines.push("Gracias.");

  return lines.join("\n");
}

export function buildWhatsAppOrderUrl({
  items,
  customerName,
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? DEFAULT_PHONE,
}: BuildWhatsappUrlInput): string {
  const safePhone = sanitizePhoneNumber(phoneNumber);
  const message = encodeURIComponent(buildOrderMessage({ items, customerName }));
  return `https://wa.me/${safePhone}?text=${message}`;
}
