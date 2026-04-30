# Inventario del proyecto Smash Fries

## 1. Estructura general del proyecto

Arbol resumido (se omiten `node_modules/`, `.next/` y `.git/`):

```txt
smash-fries/
├─ public/
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ src/
│  ├─ app/
│  │  ├─ admin/
│  │  │  ├─ page.tsx
│  │  │  ├─ pedidos/page.tsx
│  │  │  ├─ productos/page.tsx
│  │  │  ├─ promociones/page.tsx
│  │  │  └─ resenas/page.tsx
│  │  ├─ carrito/page.tsx
│  │  ├─ confirmacion/page.tsx
│  │  ├─ menu/page.tsx
│  │  ├─ nosotros/page.tsx
│  │  ├─ producto/[slug]/page.tsx
│  │  ├─ ubicacion/page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ loading.tsx
│  │  ├─ not-found.tsx
│  │  └─ page.tsx
│  ├─ components/
│  │  ├─ admin/
│  │  ├─ cart/
│  │  ├─ home/
│  │  ├─ layout/
│  │  ├─ menu/
│  │  ├─ shared/
│  │  └─ ui/
│  ├─ data/
│  │  └─ fallback-data.ts
│  ├─ lib/
│  │  ├─ business-hours.ts
│  │  ├─ smash-data.ts
│  │  ├─ supabase.ts
│  │  ├─ utils.ts
│  │  └─ whatsapp.ts
│  ├─ store/
│  │  └─ cart-store.ts
│  └─ types/
│     ├─ database.ts
│     └─ index.ts
├─ .env.local
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
└─ tsconfig.json
```

Carpetas pedidas y estado:

- `app/` (raiz): no existe.
- `pages/`: no existe.
- `components/` (raiz): no existe.
- `lib/` (raiz): no existe.
- `data/` (raiz): no existe.
- `public/`: existe.
- `styles/`: no existe.
- `supabase/`: no existe.
- Estructura equivalente real: `src/app`, `src/components`, `src/lib`, `src/data`, `src/store`.

## 2. Framework y configuracion

- Router: **Next.js App Router** (`src/app` presente con `layout.tsx` y `page.tsx`).
- Lenguaje: **TypeScript** (archivos `.ts/.tsx`, `tsconfig.json` en modo `strict: true`).
- Tailwind CSS: **Si** (Tailwind v4 via `@import "tailwindcss"` en `src/app/globals.css` y dependencia `tailwindcss` en `package.json`).
- `next/image`: **Si** (uso en `src/components/shared/product-visual.tsx`).

Archivos principales de configuracion:

- `package.json`: existe.
- `next.config`: `next.config.ts` existe (actualmente sin config de imagenes remotas).
- `tailwind.config`: **no existe archivo** `tailwind.config.*` (flujo Tailwind v4).
- `tsconfig/jsconfig`: `tsconfig.json` existe.
- `globals.css`: `src/app/globals.css` existe.

## 3. Rutas o paginas existentes

Rutas principales detectadas:

- `/` -> `src/app/page.tsx`
- `/menu` -> `src/app/menu/page.tsx`
- `/producto/[slug]` -> `src/app/producto/[slug]/page.tsx`
- `/carrito` -> `src/app/carrito/page.tsx`
- `/confirmacion` -> `src/app/confirmacion/page.tsx`
- `/nosotros` -> `src/app/nosotros/page.tsx`
- `/ubicacion` -> `src/app/ubicacion/page.tsx`
- `/admin` -> `src/app/admin/page.tsx`
- `/admin/productos` -> `src/app/admin/productos/page.tsx`
- `/admin/promociones` -> `src/app/admin/promociones/page.tsx`
- `/admin/resenas` -> `src/app/admin/resenas/page.tsx`
- `/admin/pedidos` -> `src/app/admin/pedidos/page.tsx`

Rutas/archivos auxiliares:

- `not-found` global -> `src/app/not-found.tsx`
- `loading` global -> `src/app/loading.tsx`

Notas:

- No existe ruta `/checkout` separada; el flujo de checkout vive en `/carrito`.
- No hay `pages/` router activo.

## 4. Componentes importantes

| Componente | Ruta del archivo | Que hace | Usa imagenes | Campos relacionados |
|---|---|---|---|---|
| Header / Navbar | `src/components/layout/site-header.tsx` | Navegacion principal y acceso al carrito | No | N/A |
| Hero | `src/components/home/hero.tsx` | Hero de inicio con CTA | No | N/A |
| ProductCard | `src/components/menu/product-card.tsx` | Tarjeta de producto en listas | Si (via `ProductVisual`) | Pasa `imageUrl={product.image_url}` |
| ProductGrid (equivalente) | `src/components/menu/menu-client.tsx` | Renderiza grilla filtrable de `ProductCard` | Indirecto | Consume `products` y delega imagen a `ProductCard` |
| Menu | `src/components/menu/menu-client.tsx` | Busqueda + filtros por categoria | Indirecto | N/A (delegado) |
| Cart | `src/components/cart/cart-page-client.tsx` | Resumen del carrito + checkout WhatsApp | Si (via `ProductVisual`) | Pasa `imageUrl={item.image_url}` |
| ProductModal | No existe componente modal de producto | No implementado | N/A | N/A |
| Product Detail | `src/components/menu/product-detail-client.tsx` | Detalle de producto y extras | Si (via `ProductVisual`) | Pasa `imageUrl={product.image_url}` |
| Footer | `src/components/layout/site-footer.tsx` | Footer con contacto/redes/horario | No | N/A |
| Location / Map | `src/app/ubicacion/page.tsx` | Muestra info de ubicacion e iframe de mapa | No (usa `iframe`) | `src={settings.map_url}` |
| Visual base de producto | `src/components/shared/product-visual.tsx` | Render de imagen con `next/image` o fallback visual | Si | Props: `imageUrl`, `src` (interno), `alt={name}` |

## 5. Datos de productos

Donde se definen/cargan/transfoman productos:

- `src/data/fallback-data.ts`
  - Define `fallbackProducts` (10 productos), `fallbackCategories`, `fallbackAddons`, `fallbackProductAddons`.
  - Define rutas actuales de imagen en `image_url`.

- `src/lib/smash-data.ts`
  - `getCatalogData()` intenta cargar desde Supabase y hace fallback local.
  - `mapProduct()` transforma fila de Supabase a tipo `Product`.
  - `buildCatalog()` une productos + categorias + addons.
  - Regla importante: si Supabase devuelve productos/categorias vacios, retorna fallback.

- `src/lib/supabase.ts`
  - Determina si Supabase esta configurado mediante variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

- `src/components/admin/admin-products-client.tsx`
  - Alta/edicion demo de productos.
  - Actualmente el formulario crea/actualiza con `image_url: null` localmente y el `upsert` no envia `image_url`.

Validacion actual (consulta de solo lectura):

- Supabase esta configurado por variables de entorno, pero tablas relevantes estan en `0` registros (`categories`, `products`, `addons`, `product_addons`, etc.).
- En este estado, el sitio usa **fallback local** para catalogo.

## 6. Lista actual de productos

Fuente extraida: `src/data/fallback-data.ts`.

| Producto | Categoria | Precio | Descripcion | Slug/ID | Imagen actual | Estado |
|---|---:|---:|---|---|---|---|
| La Clasica Smash | Smash Burgers | 6.50 | Doble carne smash, queso, pepinillos y salsa de la casa. | `la-clasica-smash` / `prod-01` | `/images/products/la-clasica-smash.jpg` | sin imagen valida (archivo no existe en `public`) |
| Bacon Smash | Smash Burgers | 7.20 | Smash burger con tocino y cebolla caramelizada. | `bacon-smash` / `prod-02` | `/images/products/bacon-smash.jpg` | sin imagen valida (archivo no existe en `public`) |
| Double Smash | Smash Burgers | 8.40 | Cuadruple queso, doble carne y sabor intenso. | `double-smash` / `prod-03` | `/images/products/double-smash.jpg` | sin imagen valida (archivo no existe en `public`) |
| La Clafa Smash | Smash Burgers | 7.80 | Receta signature con salsa especial y toque ahumado. | `la-clafa-smash` / `prod-04` | `/images/products/la-clafa-smash.jpg` | sin imagen valida (archivo no existe en `public`) |
| Combo Smash Classic | Combos | 10.90 | La Clasica Smash + papas rusticas + bebida. | `combo-smash-classic` / `prod-05` | `/images/products/combo-smash-classic.jpg` | sin imagen valida (archivo no existe en `public`) |
| Combo Double Smash | Combos | 12.40 | Double Smash + papas con queso y tocino + bebida. | `combo-double-smash` / `prod-06` | `/images/products/combo-double-smash.jpg` | sin imagen valida (archivo no existe en `public`) |
| Papas Fritas Rusticas | Papas | 2.90 | Corte grueso, doradas y sazonadas con paprika. | `papas-fritas-rusticas` / `prod-07` | `/images/products/papas-fritas-rusticas.jpg` | sin imagen valida (archivo no existe en `public`) |
| Papas con Queso y Tocino | Papas | 4.30 | Papas loaded con cheddar fundido y bacon crocante. | `papas-con-queso-y-tocino` / `prod-08` | `/images/products/papas-con-queso-y-tocino.jpg` | sin imagen valida (archivo no existe en `public`) |
| Coca-Cola 500ml | Bebidas | 1.50 | Bebida fria de 500ml. | `coca-cola-500ml` / `prod-09` | `/images/products/coca-cola-500ml.jpg` | sin imagen valida (archivo no existe en `public`) |
| Limonada Smash | Bebidas | 2.00 | Limonada fresca con toque de hierbabuena. | `limonada-smash` / `prod-10` | `/images/products/limonada-smash.jpg` | sin imagen valida (archivo no existe en `public`) |

## 7. Imagenes actuales

Archivos de imagen detectados:

| Archivo | Carpeta | Se usa actualmente | Observacion |
|---|---|---|---|
| `favicon.ico` | `src/app/` | Si | Favicon global del sitio (App Router). |
| `file.svg` | `public/` | No detectado en `src/` | Archivo default, sin referencias en codigo fuente. |
| `globe.svg` | `public/` | No detectado en `src/` | Archivo default, sin referencias en codigo fuente. |
| `next.svg` | `public/` | No detectado en `src/` | Archivo default, sin referencias en codigo fuente. |
| `vercel.svg` | `public/` | No detectado en `src/` | Archivo default, sin referencias en codigo fuente. |
| `window.svg` | `public/` | No detectado en `src/` | Archivo default, sin referencias en codigo fuente. |

Rutas de imagen declaradas pero faltantes:

- No existe `public/images/products/`.
- Existen referencias a `/images/products/*.jpg` en:
  - `src/data/fallback-data.ts` (10 productos + 2 promociones).

Conclusiones de uso:

- Las imagenes de productos declaradas actualmente estan rotas por ausencia de archivos reales.
- Las imagenes SVG default en `public/` parecen no utilizadas por el sitio actual.

## 8. Problemas detectados con imagenes

Causas detectadas de espacios vacios/texto alternativo (ej. "Bacon Smash"):

1. `src` no vacio pero archivo inexistente:
   - `ProductVisual` intenta renderizar `next/image` cuando `imageUrl` existe.
   - Como `image_url` tiene string valido pero el archivo no existe en `public`, el navegador termina mostrando imagen rota/alt.

2. Carpeta esperada inexistente:
   - Se esperan archivos en `/public/images/products/`, pero la carpeta no esta creada.

3. Fallback visual no entra en rutas rotas:
   - El placeholder de `ProductVisual` solo aparece si `imageUrl` es `null/undefined`.
   - En este caso hay string, asi que no entra fallback aunque el archivo falle.

4. Supabase sin datos y fallback obligatorio:
   - Supabase esta configurado, pero con tablas vacias, por lo que `getCatalogData()` usa fallback local.
   - Ese fallback contiene rutas a archivos que no existen.

5. Riesgo adicional si en el futuro usan URLs remotas:
   - `next.config.ts` no define `images.remotePatterns`/`images.domains`.
   - Si `image_url` viene remoto desde Supabase Storage, `next/image` podria bloquearlo.

## 9. Recomendacion de estructura para imagenes

Propuesta (sin cambios todavia):

```txt
public/
└── images/
    ├── hero/
    │   └── hero-smash-fries.webp
    ├── products/
    │   ├── la-clasica-smash.webp
    │   ├── bacon-smash.webp
    │   └── ...
    ├── categories/
    │   ├── smash-burgers.webp
    │   ├── combos.webp
    │   ├── papas.webp
    │   └── bebidas.webp
    ├── promotions/
    │   ├── martes-smash.webp
    │   └── combo-universitario.webp
    └── placeholders/
        ├── product-placeholder.webp
        └── hero-placeholder.webp
```

## 10. Recomendacion de nombres de imagenes

Basado en los productos actuales:

| Producto | Nombre recomendado de imagen | Ruta recomendada |
|---|---|---|
| La Clasica Smash | `la-clasica-smash.webp` | `/images/products/la-clasica-smash.webp` |
| Bacon Smash | `bacon-smash.webp` | `/images/products/bacon-smash.webp` |
| Double Smash | `double-smash.webp` | `/images/products/double-smash.webp` |
| La Clafa Smash | `la-clafa-smash.webp` | `/images/products/la-clafa-smash.webp` |
| Combo Smash Classic | `combo-smash-classic.webp` | `/images/products/combo-smash-classic.webp` |
| Combo Double Smash | `combo-double-smash.webp` | `/images/products/combo-double-smash.webp` |
| Papas Fritas Rusticas | `papas-fritas-rusticas.webp` | `/images/products/papas-fritas-rusticas.webp` |
| Papas con Queso y Tocino | `papas-con-queso-y-tocino.webp` | `/images/products/papas-con-queso-y-tocino.webp` |
| Coca-Cola 500ml | `coca-cola-500ml.webp` | `/images/products/coca-cola-500ml.webp` |
| Limonada Smash | `limonada-smash.webp` | `/images/products/limonada-smash.webp` |

## 11. Archivos que habria que modificar despues

No se modificaron ahora. Estos son los candidatos para la siguiente fase:

- `src/data/fallback-data.ts`
  - Actualizar `image_url` de productos/promociones a rutas finales reales (ej. `.webp`).

- `src/components/shared/product-visual.tsx`
  - Agregar manejo de error de carga (`onError`) para fallback visual cuando la ruta exista pero falle.

- `src/components/admin/admin-products-client.tsx`
  - Agregar campo `image_url` en formulario de crear/editar y enviarlo en `upsert`.

- `next.config.ts`
  - Si se usan imagenes remotas (Supabase Storage/CDN), agregar `images.remotePatterns`.

- `src/components/home/hero.tsx` (opcional)
  - Si se decide hero con foto real, conectar imagen local en vez de solo gradiente.

- `src/app/page.tsx` y/o `src/components/admin/admin-promotions-client.tsx` (opcional)
  - Si se quiere mostrar imagenes en promociones, incorporar render de `image_url`.

## 12. Comandos ejecutados

Comandos de inspeccion utilizados (solo lectura/diagnostico):

- `Get-ChildItem -Force | Select-Object Mode,Name`
- `git status --short`
- `git ls-files`
- `Get-ChildItem -Recurse -Depth 3 src | Select-Object FullName`
- `Get-ChildItem -Recurse -Depth 4 public | Select-Object FullName`
- `Get-Content -Raw` sobre:
  - `package.json`
  - `next.config.ts`
  - `tsconfig.json`
  - `src/app/globals.css`
  - paginas en `src/app/**/page.tsx`
  - componentes clave en `src/components/**`
  - `src/data/fallback-data.ts`
  - `src/lib/smash-data.ts`, `src/lib/supabase.ts`, `src/lib/utils.ts`, `src/lib/whatsapp.ts`
  - `src/types/index.ts`, `src/types/database.ts`
- `Get-ChildItem -Path src -Recurse -File | Select-String ...` (busqueda de `next/image`, `image_url`, `src`)
- `Get-ChildItem -Recurse -File public | Select-Object FullName,Length`
- `Get-ChildItem -Recurse -File src | Where-Object { $_.Extension -in ... }`
- `Get-ChildItem -Recurse -File -Filter 'tailwind.config.*'`
- `Get-ChildItem -Recurse -Directory -Filter supabase`
- `git grep -n "/images/products/"`
- Script Node de solo lectura para verificar conteos de tablas Supabase (resultado: tablas principales en 0)

Nota:
- Se intento `rg --files`, pero en este entorno devolvio acceso denegado. Se uso alternativa segura con `git ls-files` y comandos nativos de PowerShell.

Este archivo es solo inventario. No se modifico codigo funcional.
