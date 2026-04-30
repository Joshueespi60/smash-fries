# CARRITO_FIX_SOLUTION.md

## Objetivo

Corregir por completo el error de la ruta `/carrito` en local y producción.

El error actual aparece como:

- `The result of getServerSnapshot should be cached to avoid an infinite loop`
- `The result of getSnapshot should be cached to avoid an infinite loop`
- `Maximum update depth exceeded`
- Pantalla negra o página que no carga en `/carrito`

El diagnóstico previo indica que el problema principal está en:

- `src/components/cart/cart-page-client.tsx`
- `src/store/cart-store.ts`

La causa más probable es una combinación de:

1. Uso de `useCartStore((state) => ({ ... }))`, que devuelve un objeto nuevo en cada render.
2. Un `useEffect` que llama `setDeliveryFee(...)`.
3. Un setter `setDeliveryFee` del store que ejecuta `set(...)` aunque el valor no haya cambiado.

Con React 19 + Zustand 5, ese patrón puede provocar el loop de snapshots y terminar en `Maximum update depth exceeded`.

---

## Instrucción principal para Codex

Lee este archivo completo y aplica la corrección del carrito.

Debes corregir el bug sin hacer refactors grandes y sin tocar partes no relacionadas.

Al terminar, crea un archivo llamado:

```txt
CART_FIX_REPORT.md
```

Ese reporte debe explicar qué archivos modificaste, qué cambiaste y qué comandos ejecutaste.

---

## Restricciones obligatorias

No hagas cambios fuera del alcance del carrito.

No modificar:

- Supabase schema.
- Tablas de Supabase.
- `.env.local`.
- Variables de entorno.
- Vercel config.
- Imágenes.
- Estilos globales.
- Configuración de Next.js.
- Versiones de React, Next.js o Zustand.
- `service_role` key.
- Estructura general del proyecto.

No crear tablas nuevas.

No usar tablas llamadas:

- `orders`
- `order_items`
- `order_item_addons`
- `business_hours`

El proyecto usa estas tablas reales:

- `categories`
- `products`
- `addons`
- `product_addons`
- `promotions`
- `reviews`
- `business_settings`
- `demo_orders`

---

## Archivos que debes revisar y probablemente modificar

### 1. Archivo principal

```txt
src/components/cart/cart-page-client.tsx
```

Aquí está el error principal.

Debes revisar especialmente:

- El selector de Zustand.
- El `useEffect` que llama `setDeliveryFee`.
- Cualquier dependencia inestable.
- Cualquier destructuring que venga de un selector que devuelve objeto.

### 2. Store del carrito

```txt
src/store/cart-store.ts
```

Debes revisar especialmente:

- `setDeliveryFee`.
- `computeTotals`.
- `persist`.
- `onRehydrateStorage`.

### 3. Archivos relacionados solo para validar

No deberían requerir cambios salvo que encuentres el mismo patrón problemático:

```txt
src/components/layout/site-header.tsx
src/components/menu/product-card.tsx
src/components/menu/product-detail-client.tsx
src/app/carrito/page.tsx
```

---

## Corrección 1: eliminar selector inestable de Zustand

### Problema

En `src/components/cart/cart-page-client.tsx` existe un patrón similar a este:

```tsx
const {
  items,
  deliveryFee,
  subtotal,
  setDeliveryFee,
} = useCartStore((state) => ({
  items: state.items,
  deliveryFee: state.deliveryFee,
  subtotal: state.subtotal,
  setDeliveryFee: state.setDeliveryFee,
}))
```

Ese selector devuelve un objeto nuevo en cada render.

Con Zustand 5 y React 19, eso puede provocar:

```txt
The result of getServerSnapshot should be cached to avoid an infinite loop
```

Y después:

```txt
Maximum update depth exceeded
```

### Cambio obligatorio

Reemplaza ese selector agrupado por selectores individuales.

Ejemplo recomendado:

```tsx
const items = useCartStore((state) => state.items)
const deliveryFee = useCartStore((state) => state.deliveryFee)
const subtotal = useCartStore((state) => state.subtotal)
const total = useCartStore((state) => state.total)

const incrementItem = useCartStore((state) => state.incrementItem)
const decrementItem = useCartStore((state) => state.decrementItem)
const removeItem = useCartStore((state) => state.removeItem)
const clearCart = useCartStore((state) => state.clearCart)
const setDeliveryFee = useCartStore((state) => state.setDeliveryFee)
```

Adapta los nombres a los métodos reales del store.

Si el archivo usa otros métodos, por ejemplo:

```tsx
updateQuantity
addItem
setQuantity
```

entonces también deben seleccionarse individualmente:

```tsx
const updateQuantity = useCartStore((state) => state.updateQuantity)
```

### Regla obligatoria

Después de la corrección, no debe quedar este patrón en el carrito:

```tsx
useCartStore((state) => ({
```

Ejecuta:

```bash
rg "useCartStore\\(\\(state\\) => \\(\\{" src
```

Resultado esperado:

```txt
No matches
```

Si aparece en otro archivo, corrígelo también con selectores individuales o justifica en `CART_FIX_REPORT.md` por qué no aplica.

---

## Corrección 2: proteger el `useEffect` de `setDeliveryFee`

### Problema

En `src/components/cart/cart-page-client.tsx` hay un `useEffect` parecido a este:

```tsx
useEffect(() => {
  const fee = deliveryType === "delivery" ? defaultDeliveryFee : 0
  setDeliveryFee(fee)
}, [defaultDeliveryFee, deliveryType, setDeliveryFee])
```

Ese efecto llama `setDeliveryFee` aunque el valor sea igual al valor actual del store.

Eso genera renders innecesarios y, combinado con el selector inestable, puede causar el loop.

### Cambio obligatorio

Primero normaliza el valor del delivery fee.

Usa algo como esto dentro del componente:

```tsx
const safeDefaultDeliveryFee = Math.max(0, Number(defaultDeliveryFee) || 0)
```

Luego actualiza el efecto así:

```tsx
useEffect(() => {
  const nextDeliveryFee = deliveryType === "delivery" ? safeDefaultDeliveryFee : 0

  if (deliveryFee !== nextDeliveryFee) {
    setDeliveryFee(nextDeliveryFee)
  }
}, [deliveryFee, deliveryType, safeDefaultDeliveryFee, setDeliveryFee])
```

### Reglas importantes

- `deliveryFee` debe venir de un selector individual del store.
- `setDeliveryFee` debe venir de un selector individual del store.
- No uses un objeto completo del store como dependencia.
- No ignores el warning de dependencias de ESLint.
- No desactives reglas de ESLint.

---

## Corrección 3: hacer idempotente `setDeliveryFee` en el store

### Problema

En `src/store/cart-store.ts`, el método `setDeliveryFee` probablemente hace `set(...)` siempre, incluso si el fee no cambió.

Eso provoca notificaciones y renders innecesarios.

### Cambio obligatorio

Modifica `setDeliveryFee` para que no actualice el store si el valor nuevo es igual al valor actual.

Ejemplo recomendado:

```tsx
setDeliveryFee: (deliveryFee) =>
  set((state) => {
    const safeDeliveryFee = Math.max(0, Number(deliveryFee) || 0)

    if (state.deliveryFee === safeDeliveryFee) {
      return state
    }

    const totals = computeTotals(state.items, safeDeliveryFee)

    return {
      deliveryFee: safeDeliveryFee,
      ...totals,
    }
  }),
```

Adapta este código a la estructura real del store.

Si `computeTotals` devuelve algo como:

```tsx
{
  subtotal,
  total,
}
```

entonces `...totals` está bien.

Si el store actualmente construye los totales con otro formato, respeta ese formato.

### Regla importante

No uses esto para saltar el update:

```tsx
return {}
```

Eso puede seguir creando una actualización innecesaria.

Para no notificar cambios, usa:

```tsx
return state
```

O reestructura el setter de forma equivalente para no llamar a una actualización si el valor no cambió.

---

## Corrección 4: revisar hidratación con `persist`, pero no refactorizar si no es necesario

El reporte menciona que `cart-store.ts` usa:

```tsx
persist
createJSONStorage(() => localStorage)
onRehydrateStorage
```

No refactorices esto a menos que el error continúe después de aplicar las correcciones 1, 2 y 3.

Solo revisa que:

- El store tenga `"use client"` si actualmente lo requiere el proyecto.
- No se lea `localStorage` directamente fuera de `createJSONStorage`.
- No se use el store en Server Components.
- `onRehydrateStorage` no dispare loops de `set` repetidos.

Si detectas que `onRehydrateStorage` muta estado de forma insegura, documenta el hallazgo en `CART_FIX_REPORT.md` antes de cambiarlo.

Prioridad de esta parte: baja.

---

## Corrección 5: revisar `src/app/carrito/page.tsx`

El archivo:

```txt
src/app/carrito/page.tsx
```

parece ser Server Component y solo pasa:

```tsx
<CartPageClient defaultDeliveryFee={settings.delivery_fee} />
```

No debería ser la causa raíz.

No lo modifiques salvo que TypeScript indique que `settings.delivery_fee` puede ser `null`, `undefined` o string.

Si necesitas normalizarlo, hazlo de forma mínima:

```tsx
const defaultDeliveryFee = Math.max(0, Number(settings.delivery_fee) || 0)

<CartPageClient defaultDeliveryFee={defaultDeliveryFee} />
```

Pero no cambies la lógica de Supabase ni `getBusinessSettings` para resolver este bug.

---

## Corrección 6: revisar todos los usos de `useCartStore`

Ejecuta estas búsquedas:

```bash
rg "useCartStore" src
rg "useCartStore\\(\\(state\\) => \\(\\{" src
rg "setDeliveryFee" src
rg "useEffect" src/components/cart src/app/carrito src/store
```

Verifica que:

1. No queden selectores que devuelven objetos nuevos.
2. `setDeliveryFee` no se llame infinitamente.
3. No se use Zustand directamente en un Server Component.
4. No se use `window`, `document` o `localStorage` en Server Components.

---

## Validaciones automáticas obligatorias

Después de aplicar los cambios, ejecuta:

```bash
npm run lint
npm run build
```

Luego ejecuta:

```bash
npm run dev
```

Y prueba manualmente:

```txt
http://localhost:3000/carrito
```

Si existen estos scripts en `package.json`, ejecútalos también:

```bash
npm run typecheck
npm run test
```

Si no existen, no los inventes. Solo indícalo en `CART_FIX_REPORT.md`.

---

## Validaciones manuales obligatorias

Después de correr `npm run dev`, prueba esto:

1. Abrir `/carrito` directamente.
2. Confirmar que ya no aparece `getServerSnapshot`, `getSnapshot` ni `Maximum update depth exceeded`.
3. Ir a `/menu`.
4. Añadir un producto al carrito.
5. Volver a `/carrito`.
6. Aumentar cantidad.
7. Disminuir cantidad.
8. Eliminar producto.
9. Vaciar carrito si existe el botón.
10. Cambiar entre `retiro` y `delivery`.
11. Confirmar que `deliveryFee` cambia correctamente.
12. Confirmar que `subtotal` y `total` se actualizan correctamente.
13. Confirmar que el contador del header sigue funcionando.
14. Probar el flujo de WhatsApp si el botón existe.
15. Confirmar que el sitio compila para producción.

---

## Resultado esperado

Al terminar, `/carrito` debe cargar correctamente en local y producción.

No deben aparecer estos errores:

```txt
The result of getServerSnapshot should be cached to avoid an infinite loop
The result of getSnapshot should be cached to avoid an infinite loop
Maximum update depth exceeded
```

El carrito debe permitir:

- Ver productos agregados.
- Cambiar cantidades.
- Eliminar productos.
- Cambiar método de entrega.
- Recalcular subtotal, delivery fee y total.
- Enviar o preparar pedido por WhatsApp, si esa función ya existe.

---

## Formato obligatorio del reporte final de Codex

Crea un archivo llamado:

```txt
CART_FIX_REPORT.md
```

Debe incluir:

```md
# CART_FIX_REPORT.md

## 1. Resumen

Explica brevemente qué se corrigió.

## 2. Archivos modificados

Lista cada archivo modificado y qué cambio se hizo.

## 3. Cambios técnicos

Explica:

- Cómo se reemplazó el selector inestable.
- Cómo se protegió el `useEffect`.
- Cómo se hizo idempotente `setDeliveryFee`.

## 4. Comandos ejecutados

Incluye resultado de:

- npm run lint
- npm run build
- npm run dev, si aplica

## 5. Pruebas manuales realizadas

Marca lo que probaste.

## 6. Pendientes o advertencias

Indica si quedó algo por revisar.
```

---

## Checklist final para Codex

Antes de terminar, confirma:

- [ ] `/carrito` carga sin pantalla negra.
- [ ] No hay error de `getServerSnapshot`.
- [ ] No hay error de `getSnapshot`.
- [ ] No hay error de `Maximum update depth exceeded`.
- [ ] No queda `useCartStore((state) => ({` en `src/components/cart/cart-page-client.tsx`.
- [ ] `setDeliveryFee` no actualiza si el valor no cambió.
- [ ] `useEffect` compara antes de llamar `setDeliveryFee`.
- [ ] `npm run lint` pasa o el reporte explica claramente cualquier error no relacionado.
- [ ] `npm run build` pasa.
- [ ] No se tocaron Supabase, `.env.local`, Vercel, imágenes ni tablas.

---

## Nota final

Haz la solución mínima y segura.

No cambies arquitectura.
No hagas refactor grande.
No migres Zustand a otra librería.
No bajes versiones de paquetes.
No ocultes errores.

El objetivo único es arreglar el loop del carrito y dejar `/carrito` funcionando correctamente.
