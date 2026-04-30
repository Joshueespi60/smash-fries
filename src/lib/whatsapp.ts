import type { CartItem, CustomerOrderData } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function calculateCartSubtotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => {
    const addonsTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0);
    return total + (item.unit_price + addonsTotal) * item.quantity;
  }, 0);
}

export function buildWhatsAppMessage(
  cart: CartItem[],
  customerData: CustomerOrderData,
  total: number
): string {
  const subtotal = calculateCartSubtotal(cart);
  const shipping = Math.max(total - subtotal, 0);

  const lines: string[] = [
    "Hola Smash Fries, quiero hacer este pedido:",
    "",
    "*Datos del cliente*",
    `Nombre: ${customerData.customerName}`,
    `Telefono: ${customerData.customerPhone}`,
    `Direccion: ${customerData.deliveryAddress || "No aplica"}`,
    `Tipo de entrega: ${customerData.deliveryType}`,
    `Observaciones: ${customerData.observations || "Ninguna"}`,
    "",
    "*Productos*",
  ];

  cart.forEach((item, index) => {
    const addonsText =
      item.addons.length > 0
        ? `\n  Extras: ${item.addons
            .map((addon) => `${addon.name} (${formatCurrency(addon.price)})`)
            .join(", ")}`
        : "";

    lines.push(
      `${index + 1}. ${item.quantity} x ${item.name} - ${formatCurrency(
        item.unit_price
      )}${addonsText}`
    );
  });

  lines.push("");
  lines.push(`Subtotal: ${formatCurrency(subtotal)}`);
  lines.push(`Envio: ${formatCurrency(shipping)}`);
  lines.push(`Total: ${formatCurrency(total)}`);

  return lines.join("\n");
}

export function buildWhatsAppLink(message: string): string {
  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "593999999999";
  const phone = rawPhone.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
