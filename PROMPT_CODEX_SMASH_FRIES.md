# Prompt maestro para Codex - Smash Fries

Construye el sitio completo de Smash Fries desde cero usando el proyecto Next.js actual.

## Contexto

Es un sitio web de exposición universitaria, no de venta real. Debe parecer funcional y profesional.

Debe resolver:

- Presencia digital
- Menú digital
- Carrito
- Pedido por WhatsApp
- Reseñas
- Promociones
- Ubicación
- Horario
- Panel admin demo

El objetivo es que el sitio se vea como una plataforma real de hamburguesas estilo smash, pero será usado solo para una exposición universitaria.

## Stack

Usa este stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase
- Zustand
- shadcn/ui
- Framer Motion
- Lucide React
- Sonner para notificaciones

---

## 1. Configuración Supabase

Crear:

```txt
src/lib/supabase.ts
```

Debe:

- Leer `NEXT_PUBLIC_SUPABASE_URL`.
- Leer `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Crear el cliente de Supabase solo si ambas variables existen.
- Si faltan variables, el sitio debe usar fallback data sin romper.
- No usar `service_role key`.
- No exponer credenciales privadas.

Variables esperadas:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 2. Tipos

Crear:

```txt
src/types/index.ts
```

Con estos tipos:

- `Category`
- `Product`
- `Addon`
- `Promotion`
- `Review`
- `BusinessSettings`
- `DemoOrder`
- `CartItem`
- `CartAddon`

Deben estar adaptados a las tablas reales de Supabase.

---

## 3. Datos fallback

Crear:

```txt
src/data/fallback-data.ts
```

Debe incluir:

- 4 categorías
- 10 productos
- 6 extras
- 2 promociones
- 5 reseñas
- configuración del negocio

Usar estos productos:

- La Clásica Smash
- Bacon Smash
- Double Smash
- La Clafa Smash
- Combo Smash Classic
- Combo Double Smash
- Papas Fritas Rústicas
- Papas con Queso y Tocino
- Coca-Cola 500ml
- Limonada Smash

Los datos fallback deben permitir que todo el sitio funcione aunque Supabase no esté configurado.

---

## 4. Helpers

Crear:

```txt
src/lib/whatsapp.ts
src/lib/business-hours.ts
src/lib/utils.ts
```

### `src/lib/whatsapp.ts`

Crear función:

```ts
buildWhatsAppMessage(cart, customerData, total)
```

Debe generar un mensaje claro para WhatsApp con:

- Nombre del cliente
- Teléfono
- Dirección
- Tipo de entrega
- Observaciones
- Productos
- Extras
- Cantidades
- Subtotal
- Envío
- Total

Debe usarse para crear un link `wa.me`.

### `src/lib/business-hours.ts`

Crear función:

```ts
isBusinessOpen(opening_time, closing_time)
```

Debe devolver si el negocio está abierto o cerrado según la hora actual.

Debe manejar horarios simples como:

```txt
17:00 - 22:30
```

### `src/lib/utils.ts`

Debe incluir:

- `cn`
- `formatCurrency`

La moneda debe verse como dólares, por ejemplo:

```txt
$3.50
```

---

## 5. Store del carrito

Crear:

```txt
src/store/cart-store.ts
```

Con Zustand.

Debe tener:

- `items`
- `addItem`
- `removeItem`
- `increaseQuantity`
- `decreaseQuantity`
- `clearCart`
- `subtotal`
- `total`
- `deliveryFee`
- `setDeliveryFee`

Debe soportar:

- Productos con cantidad
- Extras seleccionados
- Total dinámico
- Persistencia local si es conveniente

Todo lo que use localStorage debe estar en componentes/client store seguros para Next.js.

---

## 6. Layout global

Crear layout global con:

- Header fijo responsive
- Logo Smash Fries
- Navegación:
  - Inicio
  - Menú
  - Nosotros
  - Ubicación
- Botón “Pedir ahora”
- Icono carrito con contador
- Menú mobile
- Footer con:
  - Redes
  - Horario
  - Contacto
  - WhatsApp
  - Ubicación

Debe verse moderno, oscuro y profesional.

---

## 7. Página inicio `/`

Debe tener:

- Hero oscuro con título:

```txt
Aplastadas al momento, frescas siempre
```

- Subtítulo de Smash Fries
- Botones:
  - “Ver menú”
  - “Pedir ahora”
- Productos destacados
- Sección “Nuestro compromiso”:
  - Calidad
  - Frescura
  - Rapidez
- Promociones activas
- Testimonios
- CTA final a WhatsApp

---

## 8. Página `/menu`

Debe tener:

- Título:

```txt
Menú Digital
```

- Buscador
- Filtros por categoría
- Grid de productos
- Tarjetas con:
  - Imagen
  - Nombre
  - Descripción
  - Precio
  - Badge disponible/no disponible
- Botones:
  - “Ver detalle”
  - “Agregar al carrito”
- Animaciones suaves

Debe leer productos desde Supabase si está disponible. Si no, usar fallback.

---

## 9. Página `/producto/[slug]`

Debe tener:

- Imagen grande
- Nombre
- Precio
- Descripción
- Ingredientes
- Selector de cantidad
- Extras disponibles con checkbox
- Total dinámico
- Botón agregar al carrito
- Botón volver al menú

Debe funcionar con productos de Supabase o fallback.

---

## 10. Página `/carrito`

Debe tener:

- Lista de productos
- Aumentar/disminuir cantidad
- Quitar producto
- Subtotal
- Envío opcional
- Total

Formulario con:

- Nombre
- Teléfono
- Dirección
- Tipo de entrega:
  - Retiro
  - Delivery
- Observaciones

Botón:

```txt
Enviar pedido por WhatsApp
```

Al hacer clic:

1. Validar campos principales.
2. Generar mensaje con `buildWhatsAppMessage`.
3. Crear enlace `wa.me`.
4. Abrir WhatsApp.
5. Guardar resumen básico en `localStorage`.
6. Si Supabase está configurado, guardar también en `demo_orders`.
7. Redirigir a `/confirmacion`.

Si Supabase falla, no debe romper el flujo; debe continuar con WhatsApp y mostrar toast.

---

## 11. Página `/confirmacion`

Debe mostrar:

- Icono grande de check
- Texto:

```txt
Pedido enviado correctamente
```

- Resumen del pedido si existe en `localStorage`
- Botón volver al inicio
- Botón nuevo pedido

---

## 12. Página `/nosotros`

Debe tener:

- Historia de Smash Fries
- Explicación de la técnica smash burger
- Diferenciales:
  - Carne aplastada al momento
  - Ingredientes frescos
  - Pan de calidad
  - Salsas propias
- Sección de marca y confianza
- Diseño visual profesional

---

## 13. Página `/ubicacion`

Debe tener:

- Dirección
- Horario
- Estado Abierto/Cerrado automático
- Botón WhatsApp
- Botón abrir en Google Maps
- Mapa embebido o tarjeta visual si no hay iframe
- Redes sociales

Debe usar `business_settings` desde Supabase si está disponible, o fallback si no.

---

## 14. Panel Admin Demo

Crear:

```txt
/admin
/admin/productos
/admin/promociones
/admin/resenas
/admin/pedidos
```

No implementar login real obligatorio porque es demo universitario.

### `/admin`

Dashboard con:

- Total productos
- Productos disponibles
- Promociones activas
- Reseñas aprobadas
- Pedidos demo
- Tabla de pedidos demo

### `/admin/productos`

Debe tener:

- Tabla de productos
- Nombre
- Categoría
- Precio
- Disponible
- Destacado
- Botones visuales:
  - Editar
  - Eliminar
- Formulario modal para crear/editar producto en estado local o Supabase si está configurado

### `/admin/promociones`

Debe tener:

- Lista de promociones
- Activar/desactivar de forma visual
- Acciones demo

### `/admin/resenas`

Debe tener:

- Lista de reseñas
- Aprobar/ocultar de forma visual
- Acciones demo

### `/admin/pedidos`

Debe tener:

- Tabla con pedidos demo
- Estado demo
- Total
- Fecha

Debe leer de `demo_orders` si Supabase está configurado.

---

## 15. Diseño

Usar estilo visual tipo marca de hamburguesas modernas.

Colores sugeridos:

- Fondo principal: `#090909` o similar
- Rojo para CTA
- Amarillo/dorado para precios
- Cards oscuras con borde sutil
- Texto blanco/gris claro
- Sombras suaves
- Bordes redondeados

Requisitos:

- Responsive completo
- Mobile-first
- Usar `lucide-react`
- Usar `framer-motion` con animaciones discretas
- Usar `sonner` para notificaciones
- No usar imágenes externas obligatorias
- Usar rutas como:

```txt
/images/products/*.jpg
```

Si no existen imágenes, usar placeholders visuales bonitos con gradientes, iconos o bloques con el nombre del producto.

---

## 16. Calidad inicial

- Ejecutar `npm run lint`.
- Ejecutar `npm run build`.
- Corregir errores.
- Mantener código limpio y modular.

---

## 17. Importante: adaptar a mi base de datos real de Supabase

Usa exactamente estas tablas, porque son las que ya existen en Supabase:

- `categories`
- `products`
- `addons`
- `product_addons`
- `promotions`
- `reviews`
- `business_settings`
- `demo_orders`

No uses tablas llamadas:

- `orders`
- `order_items`
- `order_item_addons`
- `business_hours`

Porque no existen en mi SQL actual.

La tabla `demo_orders` será la tabla usada para simular pedidos de la exposición.

### Esquema real usado

```sql
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  icon text,
  sort_order int default 0,
  created_at timestamp with time zone default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text not null,
  ingredients text,
  price numeric(10,2) not null,
  image_url text,
  is_available boolean default true,
  is_featured boolean default false,
  sort_order int default 0,
  created_at timestamp with time zone default now()
);

create table if not exists addons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10,2) not null default 0,
  icon text,
  is_available boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists product_addons (
  product_id uuid references products(id) on delete cascade,
  addon_id uuid references addons(id) on delete cascade,
  primary key (product_id, addon_id)
);

create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric(10,2),
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  is_approved boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists business_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text default 'Smash Fries',
  slogan text default 'Aplastadas al momento, frescas siempre',
  whatsapp_number text not null,
  address text,
  city text default 'Esmeraldas, Ecuador',
  opening_time time default '17:00',
  closing_time time default '22:30',
  delivery_fee numeric(10,2) default 0,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  map_url text,
  created_at timestamp with time zone default now()
);

create table if not exists demo_orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text,
  delivery_address text,
  order_summary text not null,
  total numeric(10,2) not null,
  status text default 'demo',
  created_at timestamp with time zone default now()
);
```

---

## 18. Variables de entorno

El archivo `.env.local` ya existe o debe crearse en la raíz del proyecto, pero nunca debe subirse a GitHub.

Usar estas variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Verifica que `.env.local` esté ignorado por `.gitignore`.

Debe existir en `.gitignore` algo como:

```gitignore
.env*
```

No crear, no usar y no exponer `service_role key`.

---

## 19. Supabase y fallback

El sitio debe funcionar de dos formas.

### A) Si Supabase está configurado

Debe:

- Leer productos desde `products`.
- Leer categorías desde `categories`.
- Leer extras desde `addons`.
- Leer relación de extras desde `product_addons`.
- Leer promociones desde `promotions`.
- Leer reseñas desde `reviews`.
- Leer configuración desde `business_settings`.
- Guardar pedidos demo en `demo_orders` cuando el usuario envíe pedido por WhatsApp.

### B) Si Supabase no está configurado o falla

Debe:

- Usar `fallback-data.ts`.
- No romper la página.
- Mostrar datos demo normalmente.
- Mostrar toast o manejar el error silenciosamente según convenga.

---

## 20. Seguridad práctica para exposición

Como es un proyecto universitario/demo:

- No implementar login real obligatorio.
- El panel admin puede ser demo.
- Las acciones editar/eliminar pueden modificar estado local o Supabase si está disponible.
- No bloquear el sitio por RLS.
- Manejar errores de Supabase con `try/catch`.
- Mostrar errores o confirmaciones con Sonner.
- No exponer `service_role key`.
- No guardar credenciales reales en archivos que se suban a GitHub.

---

## 21. Compatibilidad Next.js

Evita errores de hidratación.

Todo lo que use lo siguiente debe estar en componentes con `"use client"`:

- `localStorage`
- `window`
- Zustand persist
- WhatsApp
- Navegación del cliente
- Estados interactivos
- Formularios
- Modales
- Carrito
- Admin demo interactivo

Usa App Router correctamente:

```txt
src/app/page.tsx
src/app/menu/page.tsx
src/app/producto/[slug]/page.tsx
src/app/carrito/page.tsx
src/app/confirmacion/page.tsx
src/app/nosotros/page.tsx
src/app/ubicacion/page.tsx
src/app/admin/page.tsx
src/app/admin/productos/page.tsx
src/app/admin/promociones/page.tsx
src/app/admin/resenas/page.tsx
src/app/admin/pedidos/page.tsx
```

Si el proyecto usa estructura sin `src/app`, adaptarse a la estructura existente, pero preferir `src/app`.

---

## 22. Imágenes

No dependas de imágenes externas.

Si no existen imágenes en:

```txt
/public/images/products/
```

usa placeholders visuales bonitos con gradientes, iconos o bloques con el nombre del producto.

---

## 23. SEO y acabado final

Agregar:

- Metadata en layout o páginas principales.
- `title` y `description` de Smash Fries.
- Página `404` o `not-found.tsx` simple.
- Loading states.
- Empty states.
- Validaciones básicas en formularios.
- Mensajes toast al:
  - Agregar al carrito.
  - Quitar producto.
  - Enviar pedido.
  - Guardar pedido demo.
  - Error de Supabase.
  - Acción admin demo.

---

## 24. Revisión final obligatoria

Al terminar:

- Ejecuta `npm run lint`.
- Ejecuta `npm run build`.
- Corrige todos los errores.
- No dejes imports sin usar.
- No dejes variables `any` innecesarias.
- No dejes `console.log` de pruebas.
- No rompas TypeScript.
- Mantén código limpio y modular.
- Al final dame un resumen de archivos creados/modificados y los comandos para probar el proyecto.

---

## 25. GitHub y credenciales

No subir `.env.local` a GitHub.

Antes de terminar, verificar:

```bash
git status
```

Si `.env.local` aparece como archivo a subir, corregirlo.

Verificar que esté ignorado con:

```bash
git check-ignore -v .env.local
```

Si no está ignorado, agregar al `.gitignore`:

```gitignore
.env*
```

---

## 26. Resultado final esperado

Al finalizar, dame:

1. Resumen de archivos creados.
2. Resumen de archivos modificados.
3. Explicación breve de cómo probar el sitio.
4. Comandos para correrlo:

```bash
npm run dev
npm run lint
npm run build
```

5. Indicar si Supabase quedó conectado o si está usando fallback.
6. Indicar si el carrito y WhatsApp funcionan.
7. Indicar si el panel admin demo funciona.

---

## 27. Instrucción final

Implementa todo directamente en el proyecto actual.

No te limites a dar instrucciones. Crea y modifica los archivos necesarios.

Antes de terminar, valida que el proyecto compile correctamente.
