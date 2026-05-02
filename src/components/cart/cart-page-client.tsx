"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductVisual } from "@/components/shared/product-visual";
import { clampInteger, clampNumber, sanitizePhoneNumber, sanitizeTextInput } from "@/lib/security";
import { saveDemoOrder } from "@/lib/smash-data";
import {
  buildOrderCode,
  buildWhatsAppLink,
  buildWhatsAppMessage,
  calculateCartSubtotal,
} from "@/lib/whatsapp";
import { cn, formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { CartItem, DeliveryType, Product } from "@/types";

const LAST_ORDER_KEY = "smash-fries-last-order";
const MAX_QTY_PER_PRODUCT = 20;

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
  fallbackWhatsappNumber: string;
  catalogProducts: Product[];
};

type ResolvedCartItem = CartItem & {
  unavailable: boolean;
};

export function CartPageClient({
  defaultDeliveryFee,
  fallbackWhatsappNumber,
  catalogProducts,
}: CartPageClientProps) {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const deliveryFee = useCartStore((state) => state.deliveryFee);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const setDeliveryFee = useCartStore((state) => state.setDeliveryFee);
  const safeDefaultDeliveryFee = clampNumber(defaultDeliveryFee, 0, 200, 0);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("retiro");
  const [observations, setObservations] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const isDelivery = deliveryType === "delivery";
  const resolvedDeliveryFee = isDelivery ? safeDefaultDeliveryFee : 0;

  const productsById = useMemo(
    () => new Map(catalogProducts.map((product) => [product.id, product])),
    [catalogProducts]
  );

  const resolved = useMemo(() => {
    const validItems: ResolvedCartItem[] = [];
    let missingProducts = 0;
    let unavailableProducts = 0;

    items.forEach((item) => {
      const product = productsById.get(item.product_id);
      if (!product) {
        missingProducts += 1;
        return;
      }

      const allowedAddons = new Map(
        (product.addons ?? [])
          .filter((addon) => addon.is_available)
          .map((addon) => [
            addon.id,
            {
              id: addon.id,
              name: sanitizeTextInput(addon.name, { maxLength: 80 }) || "Extra",
              price: clampNumber(addon.price, 0, 100, 0),
            },
          ])
      );

      const selectedAddonsMap = new Map<string, { id: string; name: string; price: number }>();

      (item.addons ?? []).forEach((addon) => {
        const safeAddon = allowedAddons.get(addon.id);
        if (!safeAddon) {
          return;
        }
        selectedAddonsMap.set(safeAddon.id, safeAddon);
      });

      const selectedAddons = [...selectedAddonsMap.values()].sort((a, b) =>
        a.id.localeCompare(b.id)
      );

      const unavailable = !product.is_available;
      if (unavailable) {
        unavailableProducts += 1;
      }

      validItems.push({
        line_id: item.line_id,
        product_id: product.id,
        slug: product.slug,
        name: product.name,
        unit_price: clampNumber(product.price, 0, 500, 0),
        image_url: product.image_url,
        quantity: clampInteger(item.quantity, 1, MAX_QTY_PER_PRODUCT, 1),
        addons: selectedAddons,
        unavailable,
      });
    });

    return {
      items: validItems,
      missingProducts,
      unavailableProducts,
    };
  }, [items, productsById]);

  const resolvedItems = resolved.items;
  const orderItems = useMemo(
    () => resolvedItems.filter((item) => !item.unavailable),
    [resolvedItems]
  );

  useEffect(() => {
    if (deliveryFee !== resolvedDeliveryFee) {
      setDeliveryFee(resolvedDeliveryFee);
    }
  }, [deliveryFee, resolvedDeliveryFee, setDeliveryFee]);

  const finalSubtotal = useMemo(() => calculateCartSubtotal(orderItems), [orderItems]);
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
    if (orderItems.length === 0) {
      toast.error("Tu carrito esta vacio");
      return;
    }

    if (resolved.unavailableProducts > 0) {
      toast.error("Hay productos no disponibles en tu carrito. Retiralos para continuar.");
      return;
    }

    if (resolved.missingProducts > 0) {
      toast.error("Se detectaron productos invalidos en el carrito. Limpialo e intenta de nuevo.");
      return;
    }

    const safeCustomerName = sanitizeTextInput(customerName, {
      maxLength: 80,
    });
    const safeCustomerPhone = sanitizePhoneNumber(customerPhone);
    const safeAddress = isDelivery
      ? sanitizeTextInput(deliveryAddress, {
          maxLength: 180,
        })
      : "";
    const safeObservations = sanitizeTextInput(observations, {
      maxLength: 280,
      allowNewLines: true,
    });

    const nextErrors: FormErrors = {};

    if (!safeCustomerName) {
      nextErrors.customerName = "Ingresa tu nombre.";
    }

    if (!safeCustomerPhone) {
      nextErrors.customerPhone = "Ingresa un telefono valido.";
    }

    if (isDelivery && !safeAddress) {
      nextErrors.deliveryAddress = "Ingresa tu direccion para la entrega a domicilio.";
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

    const orderDate = new Date();
    const createdAt = orderDate.toISOString();
    const orderCode = buildOrderCode(orderDate);

    setSubmitting(true);

    try {
      const message = buildWhatsAppMessage(
        orderItems,
        {
          customerName: safeCustomerName,
          customerPhone: safeCustomerPhone,
          deliveryAddress: safeAddress,
          deliveryType,
          observations: safeObservations,
        },
        {
          subtotal: finalSubtotal,
          deliveryFee: resolvedDeliveryFee,
          total: finalTotal,
        },
        orderCode
      );

      const whatsappLink = buildWhatsAppLink(message, fallbackWhatsappNumber);
      if (!whatsappLink) {
        toast.error("No hay numero de WhatsApp configurado.");
        return;
      }

      window.open(whatsappLink, "_blank", "noopener,noreferrer");

      const summaryForStorage = {
        customerName: safeCustomerName,
        customerPhone: safeCustomerPhone,
        deliveryAddress: safeAddress,
        deliveryType,
        observations: safeObservations,
        items: orderItems,
        subtotal: finalSubtotal,
        deliveryFee: resolvedDeliveryFee,
        total: finalTotal,
        createdAt,
        orderCode,
      };

      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(summaryForStorage));

      const saveResult = await saveDemoOrder({
        customer_name: safeCustomerName,
        customer_phone: safeCustomerPhone,
        delivery_address: safeAddress,
        order_summary: message,
        total: finalTotal,
      });

      if (saveResult.saved) {
        toast.success("Pedido guardado en Supabase");
      } else if (saveResult.source === "supabase") {
        toast.error("No se pudo guardar en Supabase, pero WhatsApp continua");
      }

      toast.success("Pedido enviado por WhatsApp");
      clearCart();
      router.push("/confirmacion");
    } catch {
      toast.error("Ocurrio un error al enviar el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderItems.length === 0) {
    return (
      <EmptyState
        title="Tu carrito esta vacio"
        description="Agrega productos del menu para completar tu pedido."
        action={
          <Link
            href="/menu"
            className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Ver menu
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

        {resolved.unavailableProducts > 0 ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Hay productos no disponibles en tu carrito. Eliminelos antes de enviar el pedido.
          </p>
        ) : null}

        {resolved.missingProducts > 0 ? (
          <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Se detectaron productos invalidos en el carrito. Te recomendamos vaciarlo y volver a
            agregar tus productos.
          </p>
        ) : null}

        {resolvedItems.map((item) => {
          const addonsText = item.addons.map((addon) => addon.name).join(", ");
          const disableIncrease = item.quantity >= MAX_QTY_PER_PRODUCT;

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
                  <div>
                    <h3 className="font-bold text-foreground">{item.name}</h3>
                    {item.unavailable ? (
                      <p className="text-xs font-semibold text-destructive">No disponible</p>
                    ) : null}
                  </div>
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
                    disabled={disableIncrease}
                    onClick={() => increaseQuantity(item.line_id)}
                    className="p-1.5 text-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
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
            <span>Envio</span>
            <span>{formatCurrency(resolvedDeliveryFee)}</span>
          </p>
          <p className="flex justify-between text-lg font-black text-accent">
            <span>Total</span>
            <span>{formatCurrency(finalTotal)}</span>
          </p>
        </div>

        <p className="text-xs text-muted-foreground">El pedido sera confirmado por WhatsApp.</p>

        <div className="space-y-3 border-t border-border pt-4">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Nombre</span>
            <input
              value={customerName}
              maxLength={80}
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
            <span className="text-muted-foreground">Telefono</span>
            <input
              value={customerPhone}
              maxLength={20}
              inputMode="tel"
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
                setDeliveryType(nextType === "delivery" ? "delivery" : "retiro");

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
              <span className="text-muted-foreground">Direccion</span>
              <textarea
                value={deliveryAddress}
                maxLength={180}
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
              <span className="text-muted-foreground">Direccion</span>
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
              maxLength={280}
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
