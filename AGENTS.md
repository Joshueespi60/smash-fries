# Smash Fries - Instrucciones para Codex

Este proyecto es un sitio web de exposición universitaria para Smash Fries, un emprendimiento ficticio/demostrativo de hamburguesas smash-style en Esmeraldas, Ecuador.

## Stack
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase
- Zustand
- shadcn/ui
- Framer Motion
- Lucide React

## Objetivo
Construir un sitio completo de demostración con:
- Landing page
- Menú digital
- Filtros por categoría
- Buscador de productos
- Detalle de producto
- Extras personalizables
- Carrito
- Generación de pedido por WhatsApp
- Pantalla de confirmación
- Sección Nosotros
- Reseñas
- Promociones
- Ubicación y horario
- Estado abierto/cerrado
- Panel admin demo
- Dashboard demo con estadísticas
- Diseño responsive mobile-first

## Estilo visual
Marca tipo hamburguesería moderna:
- Fondo oscuro
- Rojo intenso para CTA
- Amarillo/dorado para precios y acentos
- Tarjetas con bordes redondeados
- Fotos grandes de productos
- Animaciones suaves
- Estética premium pero juvenil

## Reglas de código
- Usar TypeScript estricto.
- Crear componentes reutilizables.
- Separar datos, tipos, helpers y componentes.
- No usar datos quemados en los componentes principales si existe Supabase.
- Permitir fallback local si Supabase no está configurado.
- Evitar código innecesariamente complejo.
- Priorizar que funcione bien para una exposición universitaria.

## Páginas necesarias
- /
- /menu
- /producto/[slug]
- /carrito
- /confirmacion
- /nosotros
- /ubicacion
- /admin
- /admin/productos
- /admin/promociones
- /admin/resenas
- /admin/pedidos

## Importante
El sitio no será para vender realmente. Es una demo académica con 8 a 10 productos, pocos registros y uso temporal.
