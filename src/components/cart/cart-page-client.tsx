"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductVisual } from "@/components/shared/product-visual";
import { saveDemoOrder } from "@/lib/smash-data";
import {
  buildWhatsAppLink,
  buildWhatsAppMessage,
  calculateCartSubtotal,
} from "@/lib/whatsapp";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { DeliveryType } from "@/types";

const LAST_ORDER_KEY = "smash-fries-last-order";
const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  retiro: "Retiro en local",
  delivery: "Entrega a domicilio",
};

type FormErrors = {
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
};

type CartPageClientProps = {
  defaultDeliveryFee: number;
};

export function CartPageClient({ defaultDeliveryFee }: CartPageClientProps) {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const deliveryFee = useCartStore((state) => state.deliveryFee);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const setDeliveryFee = useCartStore((state) => state.setDeliveryFee);
  const safeDefaultDeliveryFee = Math.max(0, Number(defaultDeliveryFee) || 0);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("retiro");
  const [observations, setObservations] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const isDelivery = deliveryType === "delivery";
  const resolvedDeliveryFee = isDelivery ? safeDefaultDeliveryFee : 0;

  useEffect(() => {
    if (deliveryFee !== resolvedDeliveryFee) {
      setDeliveryFee(resolvedDeliveryFee);
    }
  }, [deliveryFee, resolvedDeliveryFee, setDeliveryFee]);

  const finalSubtotal = useMemo(() => calculateCartSubtotal(items), [items]);
  const finalTotal = finalSubtotal + resolvedDeliveryFee;

  const updateError = (field: keyof FormErrors, value?: string) => {
    setErrors((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleClearCart = () => {
    const confirmed = window.confirm("¿Deseas vaciar todo el carrito?");
    if (!confirmed) {
      return;
    }

    clearCart();
    toast.success("Carrito vaciado");
  };

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }

    const nextErrors: FormErrors = {};

    if (!customerName.trim()) {
      nextErrors.customerName = "Ingresa tu nombre.";
    }

    if (!customerPhone.trim()) {
      nextErrors.customerPhone = "Ingresa tu teléfono.";
    }

    if (isDelivery && !deliveryAddress.trim()) {
      nextErrors.deliveryAddress = "Ingresa tu dirección para la entrega a domicilio.";
    }

    setErrors(nextErrors);

    const firstError =
      nextErrors.customerName ??
      nextErrors.customerPhone ??
      nextErrors.deliveryAddress;

    if (firstError) {
      toast.error(firstError);
      return;
    }

    const safeAddress = isDelivery ? deliveryAddress.trim() : "No aplica";

    setSubmitting(true);

    try {
      const message = buildWhatsAppMessage(
        items,
        {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          deliveryAddress: safeAddress,
          deliveryType,
          observations: observations.trim(),
        },
        {
          subtotal: finalSubtotal,
          deliveryFee: resolvedDeliveryFee,
          total: finalTotal,
        }
      );

      const whatsappLink = buildWhatsAppLink(message);
      window.open(whatsappLink, "_blank", "noopener,noreferrer");

      const summaryForStorage = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: safeAddress,
        deliveryType,
        observations: observations.trim(),
        items,
        subtotal: finalSubtotal,
        deliveryFee: resolvedDeliveryFee,
        total: finalTotal,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(summaryForStorage));

      const saveResult = await saveDemoOrder({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        delivery_address: safeAddress,
        order_summary: message,
        total: finalTotal,
      });

      if (saveResult.saved) {
        toast.success("Pedido demo guardado en Supabase");
      } else if (saveResult.source === "supabase") {
        toast.error("No se pudo guardar en Supabase, pero WhatsApp continúa");
      }

      toast.success("Pedido enviado por WhatsApp");
      clearCart();
      router.push("/confirmacion");
    } catch {
      toast.error("Ocurrió un error al enviar el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="Tu carrito está vacío"
        description="Agrega productos del menú para completar tu pedido."
        action={
          <Link
            href="/menu"
            className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Ver menú
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-foreground">Productos del carrito</h2>
          <Link
            href="/menu"
            className="inline-flex rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            Seguir comprando
          </Link>
        </div>

        {items.map((item) => {
          const addonsText = item.addons.map((addon) => addon.name).join(", ");
          return (
            <article
              key={item.line_id}
              className="flex gap-3 rounded-2xl border border-border bg-card/90 p-3"
            >
              <ProductVisual
                name={item.name}
                imageUrl={item.image_url}
                className="h-24 w-24 rounded-xl"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-foreground">{item.name}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(item.line_id);
                      toast.success("Producto quitado del carrito");
                    }}
                    className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-secondary"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.unit_price)}
                  {addonsText ? ` | Extras: ${addonsText}` : ""}
                </p>
                <div className="inline-flex items-center rounded-lg border border-border">
                  <button
                    type="button"
                    disabled={item.quantity <= 1}
                    onClick={() => decreaseQuantity(item.line_id)}
                    className={cn(
                      "p-1.5 text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
                      item.quantity <= 1 && "text-muted-foreground"
                    )}
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-10 text-center text-sm text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.line_id)}
                    className="p-1.5 text-foreground hover:bg-secondary"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        <button
          type="button"
          onClick={handleClearCart}
          className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary"
        >
          Vaciar carrito
        </button>
      </section>

      <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card/90 p-5 lg:sticky lg:top-24">
        <h2 className="text-xl font-black text-foreground">Resumen del pedido</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(finalSubtotal)}</span>
          </p>
          <p className="flex justify-between">
            <span>Envío</span>
            <span>{formatCurrency(resolvedDeliveryFee)}</span>
          </p>
          <p className="flex justify-between text-lg font-black text-accent">
            <span>Total</span>
            <span>{formatCurrency(finalTotal)}</span>
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          El pedido será confirmado por WhatsApp.
        </p>

        <div className="space-y-3 border-t border-border pt-4">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Nombre</span>
            <input
              value={customerName}
              onChange={(event) => {
                setCustomerName(event.target.value);
                updateError("customerName");
              }}
              className={cn(
                "w-full rounded-lg border bg-card px-3 py-2 text-foreground outline-none transition focus:border-primary",
                errors.customerName ? "border-destructive focus:border-destructive" : "border-border"
              )}
            />
            {errors.customerName ? (
              <p className="text-xs text-destructive">{errors.customerName}</p>
            ) : null}
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Teléfono</span>
            <input
              value={customerPhone}
              onChange={(event) => {
                setCustomerPhone(event.target.value);
                updateError("customerPhone");
              }}
              className={cn(
                "w-full rounded-lg border bg-card px-3 py-2 text-foreground outline-none transition focus:border-primary",
                errors.customerPhone ? "border-destructive focus:border-destructive" : "border-border"
              )}
            />
            {errors.customerPhone ? (
              <p className="text-xs text-destructive">{errors.customerPhone}</p>
            ) : null}
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Tipo de entrega</span>
            <select
              value={deliveryType}
              onChange={(event) => {
                const nextType = event.target.value as DeliveryType;
                setDeliveryType(nextType);

                if (nextType === "retiro") {
                  updateError("deliveryAddress");
                }
              }}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-primary"
            >
              <option value="retiro">{DELIVERY_TYPE_LABELS.retiro}</option>
              <option value="delivery">{DELIVERY_TYPE_LABELS.delivery}</option>
            </select>
          </label>

          {isDelivery ? (
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Dirección</span>
              <textarea
                value={deliveryAddress}
                onChange={(event) => {
                  setDeliveryAddress(event.target.value);
                  updateError("deliveryAddress");
                }}
                rows={2}
                required
                placeholder="Ej: Barrio X, calle Y, referencia"
                className={cn(
                  "w-full rounded-lg border bg-card px-3 py-2 text-foreground outline-none transition focus:border-primary",
                  errors.deliveryAddress
                    ? "border-destructive focus:border-destructive"
                    : "border-border"
                )}
              />
              {errors.deliveryAddress ? (
                <p className="text-xs text-destructive">{errors.deliveryAddress}</p>
              ) : null}
            </label>
          ) : (
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Dirección</span>
              <input
                value="No aplica"
                disabled
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-3 py-2 text-muted-foreground outline-none"
              />
            </label>
          )}

          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Observaciones</span>
            <textarea
              value={observations}
              onChange={(event) => setObservations(event.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </label>
        </div>

        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmitOrder}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Enviando..." : "Enviar pedido por WhatsApp"}
        </button>
      </aside>
    </div>
  );
}
