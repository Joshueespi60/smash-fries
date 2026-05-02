# Instrucciones para Codex: actualizar el README principal de Smash Fries

## Objetivo

Actualizar el archivo `README.md` que está en la raíz del proyecto para que deje de mostrar el texto genérico de Next.js y pase a ser un README profesional, completo y en español para el proyecto **Smash Fries**.

Este README debe explicar claramente de qué trata el sitio web, qué tecnologías usa, cómo se ejecuta localmente, cómo se configura Supabase, cómo funciona el flujo demo de pedidos, qué variables de entorno requiere y qué medidas básicas de seguridad se consideran.

---

## Tarea principal

1. Abrir el archivo `README.md` ubicado en la raíz del proyecto.
2. Reemplazar completamente el contenido actual por el README nuevo que aparece más abajo.
3. No modificar lógica del proyecto, componentes, estilos, base de datos ni variables de entorno.
4. No incluir claves reales, tokens, contraseñas ni datos privados.
5. Verificar que el README quede bien formateado en Markdown.
6. Confirmar al final qué archivo fue modificado.

---

## Contenido nuevo para `README.md`

```md
# Smash Fries

**Smash Fries** es un sitio web desarrollado como proyecto de exposición universitaria para presentar una experiencia digital de restaurante enfocada en productos tipo smash, papas, combos, promociones y pedidos demo.

El proyecto simula el flujo real de un sitio de comida rápida: el usuario puede explorar productos, revisar detalles, agregar productos al carrito, personalizar pedidos, completar información básica y generar un mensaje de pedido por WhatsApp. Además, el sitio puede conectarse con Supabase para leer información dinámica y guardar pedidos de demostración.

> Este proyecto está pensado para fines académicos y de demostración. No está orientado a procesar ventas reales, pagos reales ni pedidos comerciales en producción.

---

## Tabla de contenido

- [Descripción general](#descripción-general)
- [Características principales](#características-principales)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura general del proyecto](#estructura-general-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación local](#instalación-local)
- [Variables de entorno](#variables-de-entorno)
- [Configuración con Supabase](#configuración-con-supabase)
- [Flujo demo de pedidos](#flujo-demo-de-pedidos)
- [Scripts disponibles](#scripts-disponibles)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Seguridad y buenas prácticas](#seguridad-y-buenas-prácticas)
- [Estado del proyecto](#estado-del-proyecto)
- [Autor](#autor)

---

## Descripción general

Smash Fries busca mostrar una propuesta visual moderna, clara y funcional para un negocio de comida rápida. La página está organizada para que el usuario pueda navegar de forma sencilla por las secciones principales, conocer los productos disponibles y simular un pedido.

El proyecto incluye una interfaz responsive, cards de productos, carrito, formulario de pedido, conexión opcional con Supabase y generación de mensaje para WhatsApp.

---

## Características principales

- Página principal con diseño visual atractivo.
- Catálogo de productos organizado por categorías.
- Cards de productos con imagen, descripción y precio.
- Página o vista de detalle del producto.
- Carrito de compras demo.
- Personalización de productos y complementos.
- Cálculo de subtotal y total.
- Formulario con datos básicos del cliente.
- Flujo para generar mensaje de pedido por WhatsApp.
- Integración opcional con Supabase.
- Guardado de pedidos demo en base de datos.
- Diseño responsive para móvil, tablet y escritorio.
- Contenido adaptado para exposición universitaria.

---

## Tecnologías utilizadas

El proyecto fue construido con las siguientes tecnologías:

- **Next.js**: framework principal para la aplicación web.
- **React**: construcción de componentes e interfaz de usuario.
- **TypeScript**: tipado estático para mayor seguridad en el código.
- **Tailwind CSS**: estilos y diseño responsive.
- **Supabase**: base de datos y backend opcional para contenido dinámico.
- **Vercel**: despliegue del sitio web.
- **WhatsApp**: generación del mensaje final del pedido demo.

---

## Estructura general del proyecto

La estructura puede variar según las mejoras realizadas, pero de forma general el proyecto sigue una organización similar a esta:

```txt
smash-fries/
├─ app/
│  ├─ page.tsx
│  ├─ layout.tsx
│  └─ ...
├─ components/
│  └─ ...
├─ lib/
│  └─ ...
├─ public/
│  └─ ...
├─ styles/
│  └─ ...
├─ .env.local
├─ .gitignore
├─ package.json
└─ README.md
```

---

## Requisitos previos

Antes de ejecutar el proyecto, se recomienda tener instalado:

- Node.js en una versión compatible con Next.js.
- npm, pnpm, yarn o bun.
- Git.
- Una cuenta de Supabase, si se desea usar base de datos.
- Una cuenta de Vercel, si se desea desplegar el proyecto.

---

## Instalación local

Clona el repositorio:

```bash
git clone https://github.com/Joshueespi60/smash-fries.git
```

Entra a la carpeta del proyecto:

```bash
cd smash-fries
```

Instala las dependencias:

```bash
npm install
```

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Abre el navegador en:

```txt
http://localhost:3000
```

---

## Variables de entorno

El proyecto utiliza variables de entorno para configurar servicios externos. Estas variables deben colocarse en un archivo llamado `.env.local` en la raíz del proyecto.

Ejemplo de estructura:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
NEXT_PUBLIC_WHATSAPP_NUMBER=tu_numero_de_whatsapp
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Para producción en Vercel, `NEXT_PUBLIC_SITE_URL` debe apuntar al dominio real del sitio, por ejemplo:

```env
NEXT_PUBLIC_SITE_URL=https://smash-fries.vercel.app
```

### Importante

- No subir el archivo `.env.local` a GitHub.
- No exponer claves privadas.
- No usar ni publicar una `service_role key` de Supabase en el frontend.
- Usar únicamente la clave pública anónima cuando sea necesario desde el cliente.

---

## Configuración con Supabase

El proyecto está preparado para trabajar con las siguientes tablas existentes en Supabase:

- `categories`
- `products`
- `addons`
- `product_addons`
- `promotions`
- `reviews`
- `business_settings`
- `demo_orders`

La tabla `demo_orders` se utiliza para guardar pedidos simulados durante la exposición del proyecto.

### Funcionamiento esperado

Si Supabase está configurado correctamente:

- El sitio puede leer productos, categorías, promociones, reseñas y configuración desde Supabase.
- Los pedidos demo pueden guardarse en la tabla `demo_orders`.
- La información mostrada puede administrarse desde la base de datos.

Si Supabase no está configurado:

- El sitio debe seguir funcionando con datos locales o fallback.
- La experiencia demo debe mantenerse disponible para la exposición.

---

## Flujo demo de pedidos

El flujo de pedido está diseñado para simular una compra sin procesar pagos reales.

Flujo general:

1. El usuario navega por el catálogo.
2. Selecciona un producto.
3. Personaliza el producto si aplica.
4. Agrega productos al carrito.
5. Revisa el resumen del pedido.
6. Ingresa datos básicos.
7. El sistema genera un mensaje para WhatsApp.
8. Opcionalmente, el pedido demo se guarda en Supabase.

Este flujo es ideal para mostrar en una exposición universitaria porque permite explicar tanto la parte visual como la lógica funcional del proyecto.

---

## Scripts disponibles

Dependiendo del gestor de paquetes utilizado, los comandos pueden variar. Con npm, los principales scripts son:

```bash
npm run dev
```

Ejecuta el proyecto en modo desarrollo.

```bash
npm run build
```

Genera la versión optimizada para producción.

```bash
npm run start
```

Ejecuta la aplicación compilada en producción.

```bash
npm run lint
```

Revisa posibles problemas de estilo o calidad del código.

---

## Despliegue en Vercel

El proyecto puede desplegarse fácilmente en Vercel.

Pasos generales:

1. Subir el proyecto a GitHub.
2. Crear un nuevo proyecto en Vercel.
3. Seleccionar el repositorio `smash-fries`.
4. Configurar las variables de entorno en Vercel.
5. Ejecutar el despliegue.

Después del despliegue, se recomienda revisar:

- Que las imágenes carguen correctamente.
- Que las variables de entorno estén configuradas.
- Que el carrito funcione bien.
- Que el mensaje de WhatsApp se genere correctamente.
- Que Supabase responda correctamente si está habilitado.

---

## Seguridad y buenas prácticas

Aunque este proyecto es académico, se aplican buenas prácticas para mantenerlo seguro y ordenado:

- Uso de variables de entorno para datos configurables.
- Exclusión de `.env.local` mediante `.gitignore`.
- No exposición de claves privadas en el frontend.
- Validación básica de datos antes de crear pedidos demo.
- Uso de la clave pública anónima de Supabase cuando aplica.
- Evitar guardar información sensible innecesaria.
- Separación de componentes y lógica reutilizable.
- Revisión del proyecto antes de cada despliegue.

### Recomendaciones adicionales

Antes de presentar o subir cambios a producción, se recomienda ejecutar:

```bash
npm run lint
npm run build
```

También se recomienda revisar manualmente:

- Flujo completo del carrito.
- Enlaces internos.
- Ortografía y textos visibles.
- Visualización en móvil.
- Funcionamiento del botón de WhatsApp.
- Variables de entorno en Vercel.

---

## Estado del proyecto

El proyecto se encuentra en desarrollo y mejora continua para fines de exposición universitaria.

Funcionalidades principales esperadas:

- Catálogo visual de productos.
- Carrito demo funcional.
- Integración opcional con Supabase.
- Generación de pedido por WhatsApp.
- Diseño responsive.
- Preparación para despliegue en Vercel.

---

## Autor

Proyecto desarrollado por **Joshue Espino** como parte de una exposición universitaria.

Repositorio:

```txt
https://github.com/Joshueespi60/smash-fries
```

Sitio desplegado:

```txt
https://smash-fries.vercel.app/
```

---

## Nota final

Smash Fries es una demostración académica que busca representar cómo podría funcionar una experiencia digital para un restaurante de comida rápida, combinando diseño, desarrollo frontend, base de datos y flujo de pedidos demo.
```

---

## Verificación final para Codex

Después de actualizar el archivo `README.md`, revisa lo siguiente:

- El README está completamente en español.
- Ya no aparece el texto genérico de Next.js.
- El Markdown se visualiza correctamente en GitHub.
- No se agregaron claves reales ni información sensible.
- No se modificó ningún archivo diferente a `README.md`, salvo que sea estrictamente necesario.
- El contenido describe el proyecto completo y no solo una parte.

---

## Mensaje final esperado de Codex

Cuando termines, responde con un resumen breve indicando:

- Que se actualizó `README.md`.
- Que se reemplazó el contenido genérico de Next.js.
- Que el nuevo README quedó en español y documenta todo el proyecto Smash Fries.
- Si detectaste algún detalle importante adicional.
