# Reporte de seguridad - Smash Fries

## Resumen general
Se realizo una auditoria completa del proyecto (frontend, Supabase client, carrito, WhatsApp, rutas, dependencias y configuracion).  
Se corrigieron riesgos de validacion/sanitizacion, enlaces externos, control de cantidades/precios, cabeceras de seguridad y dependencias vulnerables.

## Estado final
- Seguro para demo universitaria: Si
- Listo para produccion basica: No (faltan controles de acceso y verificaciones en infraestructura)
- Riesgos criticos encontrados: No

## Archivos revisados
- `package.json`, `package-lock.json`, `next.config.ts`, `.gitignore`, `.env.local`
- `public/**`
- `src/app/**` (incluyendo `/admin`, `/carrito`, `/ubicacion`, `/producto/[slug]`)
- `src/components/**` (carrito, layout, menu, home, admin)
- `src/lib/**` (`supabase`, `smash-data`, `whatsapp`, `utils`)
- `src/store/cart-store.ts`
- `src/types/**`
- `auditoria-seguridad-smash-fries.md`

## Problemas encontrados
- Validacion insuficiente de datos de cliente y observaciones en carrito/pedido.
- Carrito persistido podia ser manipulado desde `localStorage` (cantidades, precios, addons) y esos valores llegaban al pedido.
- Enlaces externos provenientes de configuracion (social/mapa) sin sanitizacion estricta de dominio/protocolo.
- `next.config.ts` sin cabeceras de seguridad basicas.
- `target="_blank"` con `rel` incompleto en un CTA.
- `npm audit` reportaba vulnerabilidad moderada en cadena `next -> postcss` (version interna de PostCSS).
- Rutas `/admin*` visibles publicamente (sin autenticacion real).

## Problemas corregidos
- Se creo `src/lib/security.ts` con utilidades reutilizables:
  - Sanitizacion de texto y control chars.
  - Clamps numericos seguros.
  - Validacion de telefono.
  - Sanitizacion de URLs externas/sociales/mapa.
- Se reforzo `src/lib/whatsapp.ts`:
  - Validacion de telefono.
  - Sanitizacion/limites del mensaje.
  - Clamps de precios, cantidades y totales.
  - `encodeURIComponent` mantenido para URL final.
- Se reforzo `src/store/cart-store.ts`:
  - Limites de cantidad por producto (1-20).
  - Clamps de precios/addons.
  - Sanitizacion y normalizacion en rehidratacion (`persist`).
  - Limitacion de lineas maximas de carrito.
- Se reforzo `src/components/cart/cart-page-client.tsx`:
  - Recalculo contra catalogo confiable (`getCatalogData`) en lugar de confiar en precios del estado persistido.
  - Bloqueo de envio si hay productos invalidos/no disponibles.
  - Validacion fuerte de nombre, telefono y direccion.
  - Limites de longitud en inputs y texto libre.
- Se reforzo `src/lib/smash-data.ts`:
  - Sanitizacion de datos recibidos de Supabase (productos, promociones, reseñas, settings, pedidos).
  - Validacion de payload de `saveDemoOrder` antes de insertar.
  - Control de URLs sociales/mapa y telefono.
- Se reforzo `src/components/layout/site-footer.tsx`, `src/app/ubicacion/page.tsx`, `src/components/shared/product-visual.tsx`:
  - Sanitizacion de links externos y URL de mapa.
  - Sanitizacion de URL de imagen.
- Se corrigio `rel` en `src/components/home/home-cta.tsx` a `noopener noreferrer`.
- Se agregaron cabeceras de seguridad y `poweredByHeader: false` en `next.config.ts`.
- Se agrego `robots: noindex, nofollow` en metadata de rutas `/admin*`.
- Se elimino la vulnerabilidad de dependencias agregando override de PostCSS:
  - `package.json` -> `"overrides": { "postcss": "^8.5.12" }`
  - `package-lock.json` actualizado.

## Riesgos pendientes
- No hay autenticacion/autorizacion real para `/admin*` (solo mitigacion de indexacion).  
  Recomendado: proteger con login real (server-side) o middleware con sesion.
- No se puede verificar RLS desde el repositorio local.  
  Debe validarse en Supabase Dashboard:
  - Lectura publica controlada para catalogo/promos/reseñas/settings.
  - `demo_orders`: permitir insert controlado, bloquear lectura publica global.
  - Bloquear update/delete desde anon en tablas sensibles.
- No se implemento CSP estricta para evitar romper integraciones (Maps/imagenes/Supabase).  
  Recomendado: CSP incremental en entorno de staging.
- `.env.local` contiene variables reales de entorno local (no versionadas).  
  Mantener siempre fuera de Git y rotar valores si se comparten accidentalmente.

## Validacion de Supabase
- Cliente oficial usado: `@supabase/supabase-js`.
- Tablas usadas en codigo:
  - `categories`
  - `products`
  - `addons`
  - `product_addons`
  - `promotions`
  - `reviews`
  - `business_settings`
  - `demo_orders`
- No se detecto uso de tablas no esperadas (`orders`, `order_items`, etc).
- No hay SQL raw ni concatenacion SQL manual.

## Validacion de variables de entorno
- Variables esperadas detectadas en uso:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`
  - `NEXT_PUBLIC_SITE_URL`
- `.gitignore` incluye `.env*`.
- `.env.local` NO esta trackeado (`git ls-files .env.local` sin resultados).
- No se encontro `SUPABASE_SERVICE_ROLE_KEY` en frontend.

## Validacion contra inyeccion SQL
- No hay SQL manual ni RPC dinamico inseguro en frontend.
- Queries realizadas con metodos tipados de Supabase.
- Se agrego validacion/sanitizacion de payload en guardado de pedidos demo.
- Se evita confiar en precio/total enviados por estado manipulable del cliente.

## Validacion contra XSS
- No se detecto uso de `dangerouslySetInnerHTML`, `eval`, `new Function`, `document.write`.
- Se agrego sanitizacion de texto para campos de usuario (nombre, direccion, observaciones, resumen).
- Se agrego sanitizacion estricta de URLs externas para evitar esquemas peligrosos (`javascript:` y similares).

## Validacion de carrito y pedidos
- Cantidad minima y maxima aplicadas (1-20).
- Se bloquean valores no numericos/NaN/Infinity via clamps.
- Totales recalculados con precios canonicos del catalogo (no desde datos persistidos manipulables).
- Addons se validan contra addons permitidos del producto.
- `saveDemoOrder` guarda datos minimos saneados y total validado.

## Validacion de WhatsApp y enlaces externos
- Mensaje WhatsApp con `encodeURIComponent`.
- Numero WhatsApp normalizado y validado por longitud de digitos.
- Limite de longitud y sanitizacion del mensaje.
- Enlaces externos con `target="_blank"` y `rel="noopener noreferrer"`.
- Links de redes y mapa sanitizados por dominio/protocolo.

## Validacion de dependencias
- Revisado `package.json` y scripts: sin comandos sospechosos.
- Vulnerabilidad moderada en `postcss` corregida via `overrides`.
- Estado final de auditoria de paquetes: 0 vulnerabilidades.

## Validacion de rutas
- Rutas principales revisadas:
  - `/`
  - `/menu`
  - `/producto/[slug]`
  - `/carrito`
  - `/confirmacion`
  - `/nosotros`
  - `/ubicacion`
  - `/admin*`
- No existen `app/api` ni `pages/api` ni server actions.
- No se detectaron rutas `/debug`, `/test`, `/api/dev`, `/api/secret`.

## Comandos ejecutados
- Exploracion/revision:
  - `Get-ChildItem -Force`
  - `Get-ChildItem -Path src -Recurse -File`
  - `Get-ChildItem -Path public -Recurse -File`
  - multiples `Get-Content` y `Select-String` sobre `src/**`, raiz y archivos de configuracion
  - `git status --short`
  - `git ls-files .env.local`
- Validacion tecnica:
  - `npm run lint`
  - `npm run build`
  - `npm audit --json`
  - `npm ls postcss`
  - `npm view next version`
  - `npm install` (para aplicar override de `postcss`)

## Resultado de lint/build/audit
- `npm run lint`: OK
- `npm run build`: OK (Next.js 16.2.4, compilacion correcta)
- `npm audit --json`: OK (0 vulnerabilidades)

## Recomendaciones para Vercel
- Configurar variables solo en Vercel (no en repo):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_WHATSAPP_NUMBER`
  - `NEXT_PUBLIC_SITE_URL`
- Revisar y aplicar politicas RLS estrictas en Supabase antes de publicar.
- Agregar proteccion real para `/admin*` (auth server-side).
- Evaluar CSP en staging para endurecer front sin romper Google Maps.
- Monitorear logs de errores sin exponer datos sensibles al cliente.

## Explicacion corta para la exposicion
El sitio Smash Fries fue auditado con enfoque en seguridad web practica. Se verifico que no hay claves privadas en el frontend, que las variables de entorno locales no estan versionadas y que el flujo de pedidos valida y sanitiza datos antes de usarlos. Tambien se reforzo el carrito para recalcular precios contra el catalogo real y evitar manipulacion simple desde el navegador, se endurecieron enlaces externos/WhatsApp, se agregaron cabeceras de seguridad en Next.js y se revisaron dependencias hasta dejar `npm audit` en cero. Aunque ningun sistema es 100% imposible de atacar, el proyecto queda bien protegido para una demo universitaria y con base tecnica mas solida para una publicacion controlada.
