# Auditoría completa de seguridad — Smash Fries

## Objetivo
Revisar todo el proyecto **Smash Fries** antes de presentarlo o subirlo a producción, buscando riesgos de seguridad, malas prácticas, datos expuestos, vulnerabilidades, backdoors, dependencias sospechosas, problemas con Supabase, formularios, carrito, WhatsApp, Google Maps, variables de entorno y configuración de despliegue.

> Importante: ningún sitio web puede garantizarse como “100% imposible de hackear”. El objetivo es dejar el proyecto con buenas prácticas, sin secretos expuestos, sin dependencias sospechosas, sin inyecciones evidentes, sin rutas peligrosas y con una explicación realista para la presentación: **el proyecto aplica medidas de seguridad preventivas y fue auditado para reducir riesgos comunes**.

---

## Instrucciones para Codex

Lee este archivo completo, analiza el proyecto desde la raíz y realiza una auditoría de seguridad integral. No cambies diseño ni funcionalidades visuales si no es necesario. Si encuentras problemas críticos, corrígelos. Si encuentras riesgos que no puedas corregir sin contexto, déjalos documentados en un reporte final.

Al terminar, genera un archivo nuevo en la raíz llamado:

```txt
reporte-seguridad-smash-fries.md
```

Ese reporte debe incluir:

- Archivos revisados.
- Vulnerabilidades encontradas.
- Vulnerabilidades corregidas.
- Riesgos pendientes.
- Recomendaciones para producción.
- Comandos ejecutados.
- Resultado de lint/build si existen.
- Explicación corta para exponer en clase.

---

## 1. Revisión de variables de entorno

Verificar que el proyecto use únicamente variables públicas cuando sea necesario.

Variables esperadas:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_SITE_URL
```

### Validar

- `.env.local` no debe estar subido al repositorio.
- `.env.local` debe estar incluido en `.gitignore`.
- No debe existir ninguna `SUPABASE_SERVICE_ROLE_KEY` en el frontend.
- No debe existir ninguna clave privada dentro de archivos `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.md`, `.env`, `.example` o similares.
- No imprimir variables de entorno en consola.
- No mostrar claves, tokens ni configuración sensible en la interfaz.

### Buscar en todo el proyecto

Buscar palabras como:

```txt
service_role
SERVICE_ROLE
secret
private_key
api_key
password
passwd
token
Bearer
Authorization
supabaseKey
anon_key
```

Si aparece algo sensible, evaluar si es seguro o debe eliminarse.

---

## 2. Revisión de Supabase

El proyecto debe usar estas tablas reales:

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

No usar tablas inexistentes como:

```txt
orders
order_items
order_item_addons
business_hours
```

### Validar consultas

- Las consultas deben hacerse mediante el cliente oficial de Supabase.
- No construir SQL manual concatenando texto del usuario.
- No usar funciones RPC inseguras si existen.
- No usar filtros creados con strings inseguros provenientes del usuario.
- No guardar información sensible de clientes.
- Los pedidos demo deben guardarse solo en `demo_orders`.
- Validar que los datos enviados a `demo_orders` sean mínimos y seguros.

### Recomendación para Supabase

Verificar que en Supabase exista Row Level Security cuando corresponda:

- Tablas públicas de lectura: productos, categorías, promociones, reseñas y configuración pueden tener lectura pública controlada.
- Tabla `demo_orders`: debe permitir inserción pública controlada, pero no lectura pública de todos los pedidos.
- Evitar permisos de actualización o eliminación desde el frontend.

Si el código no puede validar RLS directamente, dejarlo indicado en el reporte como recomendación obligatoria para revisar en Supabase.

---

## 3. Prevención de inyección SQL

Revisar todo el código para confirmar que:

- No existe SQL escrito manualmente con valores del usuario concatenados.
- No se usa `raw SQL` desde el frontend.
- No se crean consultas dinámicas peligrosas.
- No se envían datos sin validar a Supabase.
- No hay campos de formulario que terminen construyendo una consulta insegura.

Si hay formularios o entradas del usuario, validar:

- Nombre.
- Teléfono.
- Dirección.
- Notas del pedido.
- Comentarios.
- Reseñas.
- Cantidades.
- IDs de productos.
- IDs de extras/addons.

Usar validaciones simples y seguras:

- Longitud máxima.
- Tipo de dato correcto.
- No permitir cantidades negativas.
- No permitir precios enviados por el usuario como fuente de verdad.
- Recalcular totales desde productos existentes, no confiar en totales manipulados desde el cliente.

---

## 4. Prevención de XSS e inyección de HTML

Revisar que el proyecto no use de forma insegura:

```txt
dangerouslySetInnerHTML
innerHTML
insertAdjacentHTML
eval
new Function
setTimeout con string
setInterval con string
document.write
```

Si aparece alguno, justificarlo o reemplazarlo.

### Validar textos del usuario

Todo texto ingresado por el usuario debe renderizarse como texto normal, no como HTML.

Revisar especialmente:

- Nombre del cliente.
- Dirección.
- Notas.
- Reseñas.
- Comentarios.
- Mensajes para WhatsApp.

### Sanitización

Si el proyecto permite contenido libre, aplicar limpieza básica:

- Eliminar etiquetas HTML.
- Limitar longitud.
- Eliminar caracteres de control.
- Evitar scripts o atributos tipo `onerror`, `onclick`, etc.

---

## 5. Validación del carrito y pedidos

Revisar que el carrito no sea manipulable de forma peligrosa.

### Validar

- Cantidad mínima: 1.
- Cantidad máxima razonable por producto, por ejemplo 20.
- No permitir cantidades negativas.
- No permitir `NaN`, `Infinity` o valores no numéricos.
- No confiar en precios modificados en el navegador.
- Recalcular subtotales y totales desde el catálogo interno.
- Validar IDs de productos antes de guardar o enviar pedido.
- Validar addons/extras antes de agregarlos.
- No guardar objetos completos manipulados si solo se necesitan IDs, nombres seguros, cantidades y totales recalculados.

---

## 6. Seguridad del mensaje de WhatsApp

Revisar la generación del mensaje de WhatsApp.

### Validar

- Usar `encodeURIComponent` para el mensaje.
- No permitir saltos o caracteres extraños que rompan la URL.
- Limitar longitud del mensaje.
- No incluir datos sensibles innecesarios.
- Validar que `NEXT_PUBLIC_WHATSAPP_NUMBER` solo contenga números, sin espacios raros ni scripts.
- Evitar que el usuario pueda inyectar una URL maliciosa dentro del mensaje generado.

---

## 7. Seguridad de enlaces externos

Revisar todos los enlaces externos:

- WhatsApp.
- Google Maps.
- Instagram.
- Facebook.
- TikTok.
- Cualquier otro enlace externo.

Si usan `target="_blank"`, deben tener:

```tsx
rel="noopener noreferrer"
```

Validar que no existan enlaces con `javascript:` o URLs sospechosas.

---

## 8. Dependencias, plugins y paquetes sospechosos

Revisar:

```txt
package.json
package-lock.json
pnpm-lock.yaml
yarn.lock
```

### Validar

- No hay paquetes desconocidos o innecesarios.
- No hay scripts sospechosos en `package.json`.
- No hay scripts de postinstall peligrosos.
- No hay dependencias que parezcan backdoor.
- No hay librerías abandonadas si se puede evitar.
- No hay paquetes duplicados innecesarios.

Ejecutar, según el gestor usado:

```bash
npm audit
```

O si usa pnpm:

```bash
pnpm audit
```

O si usa yarn:

```bash
yarn audit
```

No romper el proyecto actualizando todo sin criterio. Si hay vulnerabilidades, corregir solo las que sean seguras de actualizar. Documentar las demás.

---

## 9. Revisión de scripts del proyecto

Revisar `package.json` y verificar que scripts como estos sean seguros:

```json
"dev"
"build"
"start"
"lint"
"test"
```

No debe haber scripts que:

- Borren archivos sin razón.
- Descarguen código remoto sospechoso.
- Ejecuten comandos ocultos.
- Envíen datos a servidores externos.
- Usen `curl`, `wget`, `powershell`, `rm -rf`, `eval`, `node -e` de manera sospechosa.

---

## 10. Revisión de archivos públicos

Revisar la carpeta:

```txt
public/
```

### Validar

- No hay archivos `.env`.
- No hay respaldos como `.zip`, `.rar`, `.sql`, `.bak`, `.old`.
- No hay capturas con datos sensibles.
- No hay documentos privados.
- No hay claves o tokens dentro de imágenes, JSON o archivos públicos.
- Las imágenes son normales del proyecto.

---

## 11. Revisión de código visible en inspeccionar

Aclaración importante: en una aplicación web frontend, el navegador siempre podrá ver HTML, CSS, JavaScript compilado, imágenes y datos públicos necesarios para mostrar la página.

No se puede ocultar completamente el código que corre en el cliente. Lo correcto es:

- No poner secretos en el frontend.
- No poner service role keys.
- No poner contraseñas.
- No poner lógica sensible de administración en el cliente.
- Proteger la base de datos con RLS y permisos correctos.
- Validar datos antes de guardarlos.
- Evitar exponer endpoints privados.

En el reporte, explicar esto de forma clara para la presentación.

Texto sugerido para el reporte:

> El código frontend visible en el navegador no contiene claves privadas ni permisos administrativos. La seguridad no depende de ocultar el código, sino de no exponer secretos, validar los datos y limitar permisos en Supabase.

---

## 12. Revisión de rutas y páginas

Revisar todas las rutas principales:

```txt
/
/menu
/nosotros
/ubicacion
```

Y cualquier otra ruta existente.

### Validar

- No hay rutas secretas de administración expuestas.
- No hay páginas de prueba con datos sensibles.
- No hay rutas tipo `/debug`, `/test`, `/admin`, `/api/dev`, `/api/secret` sin protección.
- No hay logs visibles para usuarios.
- No hay errores técnicos mostrados en pantalla.
- No hay stack traces visibles.

---

## 13. Revisión de API routes o server actions

Si el proyecto tiene carpeta `app/api`, `pages/api`, server actions o funciones del servidor:

### Validar

- Validan método HTTP permitido.
- Validan datos de entrada.
- No exponen variables privadas.
- No aceptan URLs arbitrarias para fetch sin validación.
- No permiten SSRF.
- No guardan datos peligrosos.
- No retornan errores internos completos al usuario.
- No tienen CORS abierto innecesario.
- No tienen endpoints de prueba activos.

Si el proyecto no tiene API routes, dejarlo indicado en el reporte.

---

## 14. Revisión de logs y consola

Buscar y revisar:

```txt
console.log
console.warn
console.error
debugger
```

### Validar

- No imprimir datos personales.
- No imprimir pedidos completos si tienen datos de cliente.
- No imprimir variables de entorno.
- No dejar `debugger`.
- Se pueden dejar errores controlados si ayudan al desarrollo, pero no deben exponer información sensible.

En producción, preferir mensajes controlados.

---

## 15. Revisión de TypeScript y tipos

Si el proyecto usa TypeScript:

- Evitar `any` innecesario en partes críticas.
- Tipar productos, carrito, addons, promociones, reseñas y pedidos demo.
- Validar conversiones de número.
- Validar datos que vienen de Supabase antes de usarlos.
- Evitar asumir que todo dato remoto siempre existe.

---

## 16. Revisión de formularios

Si hay formularios para pedidos, reseñas, contacto o cualquier interacción:

### Validar

- Campos requeridos.
- Longitud máxima.
- Mensajes de error amigables.
- Validación de teléfono.
- Validación de dirección si aplica.
- No aceptar HTML.
- No aceptar scripts.
- No permitir spam básico con envíos repetidos si existe lógica para guardar en Supabase.

Si no hay backend real de pedidos, documentar que es una simulación demo.

---

## 17. Cabeceras de seguridad en Next.js

Si el proyecto usa Next.js, revisar si existe `next.config.js` o `next.config.ts`.

Agregar o recomendar headers de seguridad cuando sea posible sin romper el sitio:

```js
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];
```

Si se agrega Content Security Policy, hacerlo con cuidado porque puede romper Google Maps, imágenes externas, Supabase o estilos. Si no se agrega CSP completa, dejar recomendación documentada.

---

## 18. Revisión de imágenes y recursos externos

Revisar configuración de imágenes remotas si existe.

### Validar

- No permitir cualquier dominio remoto si no es necesario.
- Permitir solo dominios confiables.
- Evitar cargar scripts externos innecesarios.
- Evitar recursos de terceros sospechosos.

---

## 19. Revisión de errores y fallback

El sitio debe funcionar de forma segura si Supabase falla.

### Validar

- Si Supabase no responde, usar fallback local sin romper la página.
- No mostrar errores técnicos crudos al usuario.
- No revelar URLs internas, stack traces o configuración.
- Mostrar mensajes amigables.
- No permitir que errores de datos rompan el carrito o el menú.

---

## 20. Revisión de permisos de producción en Vercel

Verificar o recomendar:

- Variables de entorno configuradas en Vercel.
- No subir `.env.local` a GitHub.
- Dominio correcto en `NEXT_PUBLIC_SITE_URL`.
- Build sin errores.
- No dejar logs sensibles en producción.
- No dejar archivos de prueba públicos.

---

## 21. Pruebas mínimas obligatorias

Ejecutar los comandos disponibles según el proyecto:

```bash
npm run lint
npm run build
```

Si usa pnpm:

```bash
pnpm lint
pnpm build
```

Si usa yarn:

```bash
yarn lint
yarn build
```

Además, ejecutar auditoría de dependencias:

```bash
npm audit
```

O equivalente según el gestor.

Si algún comando falla, documentar:

- Qué comando falló.
- Por qué falló.
- Archivo relacionado.
- Qué se corrigió o qué queda pendiente.

---

## 22. Cambios permitidos

Puedes corregir:

- Validaciones inseguras.
- Uso inseguro de `dangerouslySetInnerHTML`.
- Enlaces externos sin `rel`.
- Logs sensibles.
- Variables mal usadas.
- Scripts sospechosos.
- Consultas inseguras.
- Manejo incorrecto de errores.
- Headers de seguridad básicos.
- Validación de carrito y pedidos.
- Sanitización de textos.
- Ortografía visible relacionada con mensajes de seguridad o errores.

No cambies:

- Diseño general si no es necesario.
- Paleta visual.
- Funcionamiento del carrito si ya está bien.
- Flujo de WhatsApp si funciona, salvo para hacerlo más seguro.
- Estructura de datos real de Supabase.

---

## 23. Resultado esperado en el reporte

El archivo `reporte-seguridad-smash-fries.md` debe tener esta estructura:

```md
# Reporte de seguridad — Smash Fries

## Resumen general

## Estado final
- Seguro para demo universitaria: Sí/No
- Listo para producción básica: Sí/No
- Riesgos críticos encontrados: Sí/No

## Archivos revisados

## Problemas encontrados

## Problemas corregidos

## Riesgos pendientes

## Validación de Supabase

## Validación de variables de entorno

## Validación contra inyección SQL

## Validación contra XSS

## Validación de carrito y pedidos

## Validación de WhatsApp y enlaces externos

## Validación de dependencias

## Validación de rutas

## Comandos ejecutados

## Resultado de lint/build/audit

## Recomendaciones para Vercel

## Explicación corta para la exposición
```

---

## 24. Texto sugerido para la exposición

Codex debe incluir una versión mejorada de este texto en el reporte final:

> El sitio Smash Fries fue revisado aplicando medidas básicas de seguridad web. No se exponen claves privadas en el frontend, las variables sensibles se mantienen fuera del repositorio, los datos del usuario se validan antes de ser usados, los enlaces externos se controlan y el carrito recalcula la información importante para evitar manipulación simple desde el navegador. Además, se revisaron dependencias, rutas, archivos públicos y posibles usos inseguros de HTML o scripts. Aunque ningún sitio puede considerarse 100% imposible de atacar, el proyecto sigue buenas prácticas para una demo universitaria y una publicación básica en producción.

---

## 25. Criterios de aceptación

La auditoría se considera completa cuando:

- No hay claves privadas en el frontend.
- `.env.local` está en `.gitignore`.
- No hay `service_role` expuesta.
- No hay SQL manual inseguro.
- No hay HTML inyectado sin control.
- No hay `eval`, `new Function` ni `document.write` innecesarios.
- Los enlaces externos tienen `rel="noopener noreferrer"` si abren nueva pestaña.
- El carrito valida cantidades y productos.
- WhatsApp usa `encodeURIComponent`.
- No hay rutas debug/admin inseguras.
- No hay archivos sensibles en `public/`.
- Las dependencias fueron revisadas.
- Se ejecutó lint/build/audit o se documentó por qué no se pudo.
- Existe el archivo `reporte-seguridad-smash-fries.md` con el resumen completo.
