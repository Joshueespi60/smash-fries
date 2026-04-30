# CHECKLIST_PRE_PRODUCCION_CODEX.md

## Objetivo

Este archivo sirve como guía maestra para que Codex revise completamente el sitio web antes de subir cambios a producción.

Cada vez que haga una actualización de código, debo pedirle a Codex:

> Lee `CHECKLIST_PRE_PRODUCCION_CODEX.md` y haz una verificación completa del proyecto siguiendo todos los puntos. Revisa el código, detecta errores, riesgos de seguridad, problemas con Supabase, variables de entorno, funcionamiento, rendimiento, diseño responsive y preparación para producción. Al final entrégame un reporte claro con errores críticos, advertencias y mejoras recomendadas. Si puedes corregir problemas seguros sin romper la estructura, propón o aplica los cambios.

---

## Contexto del proyecto

Este sitio web es para una exposición universitaria de un local de hamburguesas llamado **SmashFries**.

No es una tienda real ni un sistema de ventas a gran escala. El objetivo es simular una experiencia funcional y profesional para mostrar productos, promociones, reseñas y pedidos demo.

El proyecto debe funcionar con una cantidad pequeña de datos, aproximadamente:

- 8 a 10 productos.
- Algunas categorías.
- Algunas promociones.
- Algunas reseñas.
- Configuración básica del negocio.
- Pedidos demo para la exposición.

---

## Reglas importantes del proyecto

### 1. Tablas reales de Supabase

Usar únicamente estas tablas porque son las que existen en Supabase:

```txt
categories
products
addons
product_addons
promotions
reviews
business_settings
demo_orders
```

No usar ni crear referencias a estas tablas inexistentes:

```txt
orders
order_items
order_item_addons
business_hours
```

La tabla correcta para simular pedidos es:

```txt
demo_orders
```

Codex debe buscar en todo el proyecto cualquier referencia incorrecta a tablas inexistentes y reportarla.

---

### 2. Variables de entorno permitidas

El proyecto debe usar solo estas variables públicas:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_SITE_URL
```

Reglas:

- `.env.local` debe existir localmente o estar documentado, pero nunca debe subirse a GitHub.
- `.env.local` debe estar incluido en `.gitignore`.
- No usar `service_role`.
- No exponer claves privadas.
- No poner claves directamente en el código.
- No imprimir claves en consola.
- No subir archivos `.env`, `.env.local`, `.env.production`, `.env.development` con valores reales.

Codex debe revisar todo el repositorio para detectar secretos filtrados.

---

### 3. Supabase y fallback

El sitio debe funcionar de dos formas:

#### A. Si Supabase está configurado

Debe leer desde Supabase:

- Categorías desde `categories`.
- Productos desde `products`.
- Complementos desde `addons`.
- Relación producto-complemento desde `product_addons`.
- Promociones desde `promotions`.
- Reseñas desde `reviews`.
- Configuración desde `business_settings`.

Debe guardar pedidos demo en:

```txt
demo_orders
```

#### B. Si Supabase no está configurado

El sitio no debe romperse.

Debe usar datos fallback/mock para que la exposición pueda funcionar aunque Supabase falle o no haya internet.

Codex debe verificar que:

- No haya pantallas en blanco si faltan variables.
- No se rompa el build.
- Los componentes tengan estados de carga y error.
- Existan datos demo/fallback razonables.
- Las funciones manejen errores de Supabase con `try/catch` o manejo equivalente.

---

## Revisión completa que debe hacer Codex

## A. Verificación general del proyecto

Codex debe revisar:

- Estructura del proyecto.
- Rutas.
- Componentes principales.
- Archivos de configuración.
- Dependencias.
- Scripts de `package.json`.
- Imports rotos.
- Archivos duplicados innecesarios.
- Código muerto o sin uso.
- Tipos TypeScript incorrectos.
- Errores de ESLint.
- Errores de build.
- Errores de formato.
- Inconsistencias de nombres.

Comandos sugeridos:

```bash
npm install
npm run lint
npm run build
```

Si existen scripts adicionales, también revisar:

```bash
npm run type-check
npm run test
npm run format:check
```

Si alguno no existe, Codex debe reportarlo sin asumir que es error grave.

---

## B. Revisión de seguridad

Codex debe verificar:

- No hay claves privadas en el código.
- No hay `service_role`.
- No hay tokens reales expuestos.
- No hay contraseñas hardcodeadas.
- No hay datos sensibles en logs.
- No hay `console.log` innecesarios con información sensible.
- `.env.local` está en `.gitignore`.
- Las variables usadas en cliente son únicamente `NEXT_PUBLIC_*`.
- Las operaciones de escritura a Supabase usan solo lo necesario.
- No hay endpoints API inseguros.
- No hay validaciones ausentes en formularios.
- No se confía ciegamente en datos del cliente.
- No se permite inyectar HTML peligroso sin sanitizar.
- No se usa `dangerouslySetInnerHTML` salvo que esté justificado y protegido.

Buscar especialmente:

```txt
service_role
SUPABASE_SERVICE
process.env
.env
console.log
dangerouslySetInnerHTML
eval(
Function(
localStorage
sessionStorage
```

---

## C. Revisión de Supabase

Codex debe revisar que el código:

- Use correctamente el cliente de Supabase.
- No cree clientes duplicados innecesarios.
- No use tablas inexistentes.
- Maneje errores de conexión.
- Maneje respuestas vacías.
- Use fallback si falla Supabase.
- Inserte pedidos demo en `demo_orders`.
- No intente escribir en tablas que no existen.
- No dependa de datos obligatorios que podrían faltar.
- No rompa si las tablas están vacías.

Revisar nombres de columnas usados en el código y compararlos con la estructura esperada. Si Codex no conoce la estructura exacta de columnas, debe reportar qué columnas necesita confirmar.

---

## D. Revisión del flujo de pedidos demo

El pedido demo debe:

- Permitir seleccionar productos.
- Permitir modificar cantidades.
- Permitir seleccionar complementos si existen.
- Calcular subtotal correctamente.
- Calcular total correctamente.
- Validar datos mínimos del cliente.
- Mostrar resumen antes de enviar.
- Guardar en `demo_orders` si Supabase está disponible.
- No romper si Supabase falla.
- Tener opción de enviar o preparar mensaje por WhatsApp si está implementado.
- Usar `NEXT_PUBLIC_WHATSAPP_NUMBER` si aplica.
- Mostrar confirmación clara al usuario.
- No simular pagos reales.
- No pedir datos sensibles innecesarios.

Datos que no deberían pedirse:

- Número de tarjeta.
- Cédula.
- Contraseñas.
- Datos bancarios.
- Información sensible no necesaria para la exposición.

---

## E. Revisión visual y responsive

Codex debe verificar:

- El sitio se ve bien en móvil.
- El sitio se ve bien en tablet.
- El sitio se ve bien en escritorio.
- No hay textos cortados.
- No hay botones invisibles.
- No hay elementos desbordados horizontalmente.
- El menú funciona en móvil.
- Las tarjetas de productos son claras.
- Los botones principales tienen buen contraste.
- La paleta visual corresponde a un local de hamburguesas.
- No depende de fondo negro si ya se decidió usar otro estilo.
- Las imágenes tienen tamaño adecuado.
- Las imágenes no deforman el layout.
- Hay estados hover/focus razonables.
- El carrito o resumen de pedido es fácil de entender.

---

## F. Revisión de accesibilidad básica

Codex debe verificar:

- Botones tienen texto claro.
- Inputs tienen `label` o equivalente accesible.
- Imágenes importantes tienen `alt`.
- La navegación se puede entender.
- Hay contraste suficiente.
- No se usa solo color para comunicar errores.
- Los errores de formulario son visibles.
- El orden de tabulación no está roto.
- No hay botones hechos con `div` sin accesibilidad.

---

## G. Revisión de rendimiento

Codex debe revisar:

- Imágenes optimizadas si se usa Next.js Image.
- No hay dependencias pesadas innecesarias.
- No hay renders infinitos.
- No hay llamadas repetidas innecesarias a Supabase.
- No hay loops costosos.
- No se carga todo de forma excesiva.
- El build de producción no muestra errores.
- Las páginas principales cargan sin bloquearse.
- Los componentes client/server están bien separados si se usa App Router.

---

## H. Revisión SEO y presentación

Codex debe verificar:

- Título del sitio.
- Descripción del sitio.
- Metadata básica.
- Favicon si existe.
- Open Graph si está configurado.
- Textos claros para exposición universitaria.
- Información del negocio visible.
- Promociones claras.
- Reseñas visibles.
- Call to action claro.
- Footer con información básica.
- Enlaces sin romper.

---

## I. Revisión de calidad de código

Codex debe revisar:

- Código organizado.
- Componentes reutilizables.
- Funciones con nombres claros.
- Evitar archivos enormes si se pueden dividir.
- Evitar duplicación innecesaria.
- Tipos TypeScript correctos.
- Manejo correcto de `null` y `undefined`.
- No usar `any` sin necesidad.
- No dejar comentarios basura.
- No dejar código comentado innecesario.
- No dejar pruebas temporales.
- No dejar nombres genéricos como `test`, `demo2`, `finalfinal`.

---

## J. Revisión antes de GitHub

Codex debe verificar:

- `.gitignore` correcto.
- `.env.local` ignorado.
- No hay archivos temporales innecesarios.
- No hay carpetas `node_modules`.
- No hay builds locales subidos.
- No hay archivos con claves.
- `README.md` tiene instrucciones mínimas.
- El proyecto puede instalarse desde cero.
- El proyecto puede compilarse desde cero.

Buscar archivos que no deberían subirse:

```txt
.env
.env.local
.env.production
.env.development
node_modules
.next
dist
build
coverage
.DS_Store
*.log
```

---

## K. Revisión para despliegue en producción

Codex debe verificar:

- El proyecto compila con `npm run build`.
- Las variables necesarias están documentadas.
- El sitio no depende de datos locales.
- El fallback funciona.
- No hay errores en consola importantes.
- No hay imports desde rutas locales rotas.
- No hay rutas 404 internas.
- Las imágenes están disponibles.
- El número de WhatsApp se maneja desde variable de entorno.
- La URL pública usa `NEXT_PUBLIC_SITE_URL`.
- El sitio funciona aunque Supabase esté vacío.
- El sitio funciona aunque Supabase esté temporalmente caído.

---

## L. Checklist rápido obligatorio

Antes de aprobar cambios, Codex debe responder sí/no a esto:

```txt
[ ] npm install funciona
[ ] npm run lint funciona o los errores están reportados
[ ] npm run build funciona
[ ] No hay claves privadas expuestas
[ ] No aparece service_role en el proyecto
[ ] .env.local está en .gitignore
[ ] Solo se usan las tablas reales de Supabase
[ ] demo_orders se usa para pedidos demo
[ ] No se usan orders, order_items, order_item_addons ni business_hours
[ ] Hay fallback si Supabase falla
[ ] El sitio no se rompe sin variables de Supabase
[ ] El flujo de pedido demo funciona
[ ] El cálculo de total funciona
[ ] WhatsApp usa variable de entorno si aplica
[ ] El sitio es responsive
[ ] No hay errores graves de TypeScript
[ ] No hay imports rotos
[ ] No hay rutas rotas importantes
[ ] No hay datos sensibles solicitados innecesariamente
[ ] El proyecto está listo para subir a GitHub
[ ] El proyecto está listo para producción/demo
```

---

## M. Formato de reporte que debe entregar Codex

Codex debe entregar el reporte con esta estructura:

```md
# Reporte de revisión pre-producción

## Resultado general

Estado: APROBADO / APROBADO CON ADVERTENCIAS / NO APROBADO

Resumen breve:
- ...

## Errores críticos

Estos errores deben corregirse antes de producción:

1. ...
2. ...

## Advertencias

No bloquean necesariamente, pero conviene corregir:

1. ...
2. ...

## Seguridad

- Claves expuestas: Sí/No
- service_role detectado: Sí/No
- .env.local ignorado: Sí/No
- Riesgos encontrados:
  - ...

## Supabase

- Tablas correctas: Sí/No
- Tablas inexistentes usadas: Sí/No
- demo_orders usado correctamente: Sí/No
- Fallback funcionando: Sí/No
- Problemas encontrados:
  - ...

## Build y calidad

- npm install: OK/Falla/No probado
- npm run lint: OK/Falla/No existe
- npm run build: OK/Falla/No probado
- TypeScript: OK/Falla/No probado

## Diseño y responsive

- Móvil: OK/Problemas
- Tablet: OK/Problemas
- Escritorio: OK/Problemas

## Accesibilidad

- Labels: OK/Problemas
- Alt en imágenes: OK/Problemas
- Contraste: OK/Problemas
- Navegación: OK/Problemas

## Recomendaciones antes de subir

1. ...
2. ...
3. ...

## Cambios aplicados

Si Codex hizo cambios, listarlos aquí:

1. ...
2. ...

## Archivos modificados

- ...
```

---

## N. Instrucción para Codex si encuentra problemas

Si Codex encuentra problemas:

1. Debe clasificarlos por gravedad:
   - Crítico.
   - Alto.
   - Medio.
   - Bajo.
2. Debe explicar por qué son problema.
3. Debe decir qué archivo está afectado.
4. Debe proponer solución concreta.
5. Si la solución es segura, puede aplicar el cambio.
6. Si la solución puede cambiar mucho el proyecto, debe pedir confirmación antes de modificar.

---

## O. Instrucción para Codex si todo está bien

Si todo está bien, Codex debe responder:

```txt
El proyecto está listo para producción/demo.
No se encontraron errores críticos.
```

Pero aun así debe entregar el reporte completo.

---

## P. Prompts útiles para usar con Codex

### Revisión completa

```txt
Lee CHECKLIST_PRE_PRODUCCION_CODEX.md y revisa todo el proyecto antes de producción. Ejecuta las verificaciones necesarias, revisa seguridad, Supabase, variables de entorno, build, responsive, flujo de pedidos demo y calidad del código. Entrégame el reporte con el formato indicado en el archivo.
```

### Revisión después de cambios pequeños

```txt
Lee CHECKLIST_PRE_PRODUCCION_CODEX.md y revisa si los cambios recientes rompieron algo importante. Enfócate en build, lint, Supabase, seguridad y flujo de pedidos demo.
```

### Revisión solo de seguridad

```txt
Lee CHECKLIST_PRE_PRODUCCION_CODEX.md y haz una auditoría de seguridad del proyecto. Revisa claves, variables de entorno, Supabase, logs, endpoints, formularios y cualquier exposición de datos.
```

### Revisión antes de subir a GitHub

```txt
Lee CHECKLIST_PRE_PRODUCCION_CODEX.md y revisa si el proyecto está seguro para subir a GitHub. Enfócate en .gitignore, claves, archivos temporales, estructura, README y variables de entorno.
```

### Revisión antes de exponer en la universidad

```txt
Lee CHECKLIST_PRE_PRODUCCION_CODEX.md y revisa si el sitio está listo para la exposición universitaria. Enfócate en que no falle, que se vea bien, que el pedido demo funcione, que haya fallback si Supabase falla y que no haya errores visibles.
```

---

## Q. Criterio final de aprobación

Codex solo debe marcar el proyecto como aprobado si:

- Compila correctamente.
- No expone secretos.
- No usa tablas inexistentes.
- Usa `demo_orders` para pedidos demo.
- Tiene fallback.
- No rompe sin Supabase.
- El flujo principal funciona.
- El diseño es presentable.
- No hay errores críticos.
- Está seguro para GitHub.
- Está listo para demostración universitaria.
