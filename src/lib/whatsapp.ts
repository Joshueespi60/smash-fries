import { clampInteger, clampNumber, sanitizePhoneNumber, sanitizeTextInput } from "@/lib/security";
import type { CartItem, CustomerOrderData, DeliveryType } from "@/types";
import { formatCurrency } from "@/lib/utils";

const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  retiro: "Retiro en local",
  delivery: "Entrega a domicilio",
};

const DEFAULT_WHATSAPP_MESSAGE =
  "Hola, quiero hacer un pedido en Smash Fries. ¿Me puedes ayudar con el menu y las promociones disponibles?";
const MAX_WHATSAPP_MESSAGE_LENGTH = 3200;

type WhatsAppTotals = {
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export function normalizeWhatsAppNumber(value?: string | null): string {
  return sanitizePhoneNumber(value ?? "", {
    minDigits: 8,
    maxDigits: 15,
  });
}

export function resolveWhatsAppNumber(fallbackNumber?: string | null): string {
  const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  const preferredNumber =
    envNumber && envNumber.length > 0 ? envNumber : fallbackNumber ?? "";
  return normalizeWhatsAppNumber(preferredNumber);
}

export function buildGeneralWhatsAppMessage(): string {
  return DEFAULT_WHATSAPP_MESSAGE;
}

export function calculateCartSubtotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => {
    const safeQuantity = clampInteger(item.quantity, 1, 20, 1);
    const safeUnitPrice = clampNumber(item.unit_price, 0, 500, 0);
    const addonsTotal = item.addons.reduce(
      (sum, addon) => sum + clampNumber(addon.price, 0, 100, 0),
      0
    );

    return total + (safeUnitPrice + addonsTotal) * safeQuantity;
  }, 0);
}

export function buildOrderCode(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `SF-${year}${month}${day}-${hour}${minutes}`;
}

export function buildWhatsAppMessage(
  cart: CartItem[],
  customerData: CustomerOrderData,
  totals: WhatsAppTotals,
  orderCode: string
): string {
  const deliveryTypeLabel = DELIVERY_TYPE_LABELS[customerData.deliveryType];
  const safeCustomerName = sanitizeTextInput(customerData.customerName, {
    maxLength: 80,
  });
  const safeCustomerPhone = sanitizePhoneNumber(customerData.customerPhone);
  const safeDeliveryAddress = sanitizeTextInput(customerData.deliveryAddress, {
    maxLength: 180,
  });
  const safeObservations = sanitizeTextInput(customerData.observations, {
    maxLength: 280,
    allowNewLines: true,
  });
  const safeSubtotal = clampNumber(totals.subtotal, 0, 10000, 0);
  const safeDeliveryFee = clampNumber(totals.deliveryFee, 0, 1000, 0);
  const safeTotal = clampNumber(totals.total, 0, 10000, 0);

  const lines: string[] = [
    "Hola, quiero hacer un pedido en Smash Fries.",
    "",
    `Pedido #${orderCode}`,
    "",
    `Cliente: ${safeCustomerName || "No especificado"}`,
    `Telefono: ${safeCustomerPhone || "No especificado"}`,
    `Tipo de entrega: ${deliveryTypeLabel}`,
  ];

  if (customerData.deliveryType === "delivery" && safeDeliveryAddress) {
    lines.push(`Direccion: ${safeDeliveryAddress}`);
  }

  lines.push("", "Pedido:");

  cart.forEach((item, index) => {
    const safeQuantity = clampInteger(item.quantity, 1, 20, 1);
    const safeItemName = sanitizeTextInput(item.name, { maxLength: 90 });
    const safeUnitPrice = clampNumber(item.unit_price, 0, 500, 0);
    const safeAddons = item.addons
      .map((addon) => ({
        name: sanitizeTextInput(addon.name, { maxLength: 60 }),
        price: clampNumber(addon.price, 0, 100, 0),
      }))
      .filter((addon) => addon.name.length > 0);
    const addonsTotal = safeAddons.reduce((sum, addon) => sum + addon.price, 0);
    const unitWithAddons = safeUnitPrice + addonsTotal;
    const lineTotal = unitWithAddons * safeQuantity;
    const addonsText = safeAddons.map((addon) => addon.name).join(", ");

    lines.push(`${index + 1}. ${safeQuantity}x ${safeItemName || "Producto"}`);
    if (addonsText) {
      lines.push(`   Extras: ${addonsText}`);
    }
    lines.push(`   Precio unitario: ${formatCurrency(unitWithAddons)}`);
    lines.push(`   Subtotal: ${formatCurrency(lineTotal)}`);

    if (index < cart.length - 1) {
      lines.push("");
    }
  });

  if (safeObservations) {
    lines.push("", "Observaciones:", safeObservations);
  }

  lines.push("");
  lines.push(`Subtotal: ${formatCurrency(safeSubtotal)}`);
  lines.push(`Envio: ${formatCurrency(safeDeliveryFee)}`);
  lines.push(`Total a pagar: ${formatCurrency(safeTotal)}`);
  lines.push("");
  lines.push("¿Me confirmas disponibilidad y tiempo de entrega o retiro?");

  return sanitizeTextInput(lines.join("\n"), {
    maxLength: MAX_WHATSAPP_MESSAGE_LENGTH,
    allowNewLines: true,
  });
}

export function buildWhatsAppLink(
  message: string,
  fallbackNumber?: string | null
): string | null {
  const phone = resolveWhatsAppNumber(fallbackNumber);
  if (!phone) {
    return null;
  }

  const safeMessage = sanitizeTextInput(message, {
    maxLength: MAX_WHATSAPP_MESSAGE_LENGTH,
    allowNewLines: true,
  });

  return `https://wa.me/${phone}?text=${encodeURIComponent(safeMessage)}`;
}
