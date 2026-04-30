# Implementar imágenes locales de productos — Smash Fries

## Objetivo

Implementar correctamente las imágenes locales de productos que ya fueron colocadas en:

```txt
public/images/products/
```

En esta fase **solo vamos a trabajar las imágenes de productos**.

No implementar todavía imágenes del hero, promociones, categorías ni Supabase Storage.

---

## Contexto actual

El proyecto ya tiene productos en el fallback local, pero las rutas actuales apuntan a imágenes `.jpg` que no existen.

Ejemplo actual probable:

```ts
image_url: "/images/products/bacon-smash.jpg"
```

Ahora las imágenes reales están en `public/images/products/` y tienen formato `.webp`.

En Next.js, los archivos dentro de `public` se usan sin escribir `public` en la ruta.

Correcto:

```txt
/images/products/bacon-smash.webp
```

Incorrecto:

```txt
public/images/products/bacon-smash.webp
./images/products/bacon-smash.webp
../images/products/bacon-smash.webp
```

---

## Archivos de productos existentes

Verifica que existan estos archivos:

```txt
public/images/products/la-clasica-smash.webp
public/images/products/bacon-smash.webp
public/images/products/double-smash.webp
public/images/products/la-clafa-smash.webp
public/images/products/combo-smash-classic.webp
public/images/products/combo-double-smash.webp
public/images/products/papas-fritas-rusticas.webp
public/images/products/papas-con-queso-y-tocino.webp
public/images/products/coca-cola-500ml.webp
public/images/products/limonada-smash.webp
```

Si falta alguno, no inventes otro nombre. Reporta cuál falta.

---

## Rutas exactas que debe usar cada producto

| Producto | Ruta correcta |
|---|---|
| La Clasica Smash | `/images/products/la-clasica-smash.webp` |
| Bacon Smash | `/images/products/bacon-smash.webp` |
| Double Smash | `/images/products/double-smash.webp` |
| La Clafa Smash | `/images/products/la-clafa-smash.webp` |
| Combo Smash Classic | `/images/products/combo-smash-classic.webp` |
| Combo Double Smash | `/images/products/combo-double-smash.webp` |
| Papas Fritas Rusticas | `/images/products/papas-fritas-rusticas.webp` |
| Papas con Queso y Tocino | `/images/products/papas-con-queso-y-tocino.webp` |
| Coca-Cola 500ml | `/images/products/coca-cola-500ml.webp` |
| Limonada Smash | `/images/products/limonada-smash.webp` |

---

## Tareas obligatorias

### 1. Revisar datos de productos

Revisa:

```txt
src/data/fallback-data.ts
```

Cambia las rutas de `image_url` de productos para que usen las rutas `.webp` correctas.

Ejemplo:

```ts
image_url: "/images/products/bacon-smash.webp"
```

No dejes rutas `.jpg` para productos si el archivo real es `.webp`.

---

### 2. No tocar el hero todavía

No cambies en esta fase:

```txt
src/components/home/hero.tsx
```

A menos que sea estrictamente necesario para no romper el build.

Las imágenes del hero se harán después.

---

### 3. Revisar componente visual de producto

Revisa:

```txt
src/components/shared/product-visual.tsx
```

El problema actual es que, cuando la ruta de imagen existe como texto pero el archivo no carga, se muestra el texto alternativo dentro de la card y queda un espacio vacío.

Necesito que `ProductVisual` quede más robusto:

- Debe seguir usando `next/image` si ya lo usa.
- Debe recibir `imageUrl` o equivalente como hasta ahora.
- Debe usar `object-cover`.
- Debe mantener altura consistente.
- Debe tener bordes redondeados donde corresponda.
- Si `imageUrl` es `null`, `undefined`, string vacío o la imagen falla, debe mostrar un fallback visual bonito.
- El fallback visual puede ser un bloque con gradiente suave, icono o texto pequeño tipo “Imagen no disponible”.
- No dependas obligatoriamente de un archivo placeholder si no existe.
- No debe verse el `alt` suelto como “Bacon Smash”, “Double Smash”, etc.
- No debe dejar un hueco gigante vacío.

Importante: si agregas estado de error con `useState`, convierte el componente en client component si todavía no lo es usando:

```tsx
"use client";
```

Solo hazlo si es necesario.

---

### 4. Revisar componentes que usan imágenes

Revisa que estos componentes sigan usando correctamente `ProductVisual`:

```txt
src/components/menu/product-card.tsx
src/components/cart/cart-page-client.tsx
src/components/menu/product-detail-client.tsx
```

No dupliques lógica de imagen en cada componente. La lógica de fallback debe vivir preferiblemente en `ProductVisual`.

---

### 5. Ajustes visuales de tarjetas

En las tarjetas de producto, asegúrate de que la imagen:

- Aparezca arriba.
- Tenga altura consistente.
- Use `object-cover`.
- No deforme la imagen.
- No tape el texto.
- No deje espacios vacíos grandes.
- No muestre el texto alternativo como si fuera contenido visible.
- Mantenga la estética clara actual del sitio.

No cambies la paleta de colores actual.

---

### 6. No usar Supabase Storage todavía

No uses Supabase Storage para imágenes en esta fase.

No agregues `remotePatterns` en `next.config.ts` a menos que ya haya una necesidad real.

Las imágenes deben salir desde:

```txt
public/images/products/
```

Con rutas públicas:

```txt
/images/products/nombre.webp
```

---

### 7. No cambiar lógica de negocio

No cambies:

- Carrito.
- Precios.
- Categorías.
- Addons.
- Pedido por WhatsApp.
- Supabase.
- Paleta de colores.
- Layout general.

Solo corrige la carga y visualización de imágenes de productos.

---

## Verificación obligatoria

Después de los cambios, verifica:

### Productos en inicio

En `/`, las cards de productos destacados deben mostrar imagen real.

### Menú

En `/menu`, todos los productos deben mostrar imagen real:

- La Clasica Smash
- Bacon Smash
- Double Smash
- La Clafa Smash
- Combo Smash Classic
- Combo Double Smash
- Papas Fritas Rusticas
- Papas con Queso y Tocino
- Coca-Cola 500ml
- Limonada Smash

### Detalle de producto

En `/producto/[slug]`, la imagen del producto debe mostrarse correctamente.

### Carrito

Si el carrito muestra productos con imagen, debe usar la misma imagen local.

---

## Búsqueda de rutas incorrectas

Haz una búsqueda global y corrige cualquier ruta incorrecta relacionada con productos:

```txt
/images/products/*.jpg
public/images/products
./images/products
../images/products
```

No deben quedar rutas `.jpg` para los productos si los archivos disponibles son `.webp`.

---

## Comandos finales

Ejecuta:

```bash
npm run lint
npm run build
```

Si alguno falla, corrige el error sin cambiar el alcance de esta tarea.

---

## Respuesta final esperada

Cuando termines, responde con:

1. Archivos modificados.
2. Confirmación de que `src/data/fallback-data.ts` usa rutas `.webp`.
3. Confirmación de que `ProductVisual` maneja error de carga.
4. Confirmación de que ya no deberían aparecer textos alternativos como “Bacon Smash” en lugar de imágenes.
5. Resultado de `npm run lint`.
6. Resultado de `npm run build`.

---

## Nota importante

Este archivo se enfoca solo en imágenes de productos.

Las imágenes del hero y promociones se implementarán después.
