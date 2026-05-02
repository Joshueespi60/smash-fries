# Ajustes funcionales Home — promociones, productos y WhatsApp — Smash Fries

## Instrucción principal para Codex

Lee este documento completo, analiza el proyecto actual y ejecuta todos los cambios indicados.

El objetivo es mejorar la funcionalidad de la página de inicio después del rediseño visual, especialmente en:

- textos que todavía dicen “demo universitaria”,
- promociones clickeables,
- productos destacados clickeables desde imagen,
- combos/promociones que lleven al detalle correcto,
- botón de WhatsApp usando la variable de entorno,
- mensaje de WhatsApp bien redactado,
- y comportamiento responsive en desktop, tablet y celular.

No rompas lo que ya funciona: carrito, menú, detalles, navegación, Supabase/fallback, botones y flujo de pedido.

---

## 1. Eliminar textos que digan “demo universitaria”

### Problema
En la Home todavía aparece texto como:

> Demo universitaria con experiencia completa de menu, carrito y pedido por WhatsApp.

Para la entrega del proyecto, no debe verse como una demo universitaria en la presentación principal.

### Tarea
Buscar en toda la página de inicio y componentes relacionados cualquier texto similar a:

- `Demo universitaria`
- `demo universitaria`
- `Demo académica`
- `demo academica`
- `pedido demo`
- `pedidos demo`
- cualquier frase que haga que el sitio parezca una demo en la UI pública

### Reemplazos sugeridos
Usar textos más profesionales y naturales para el usuario final.

Ejemplos:

- En vez de:
  `Demo universitaria con experiencia completa de menu, carrito y pedido por WhatsApp.`

  Usar algo como:
  `Experiencia completa con menú digital, carrito y pedido rápido por WhatsApp.`

- En vez de:
  `+300 pedidos demo`

  Usar algo como:
  `+300 pedidos preparados`
  o
  `+300 pedidos servidos`

- En vez de:
  `envía tu pedido demo`

  Usar algo como:
  `envía tu pedido en pocos pasos`

- En el footer, si aparece:
  `Demo académica Smash Fries - 2026`

  Cambiar por algo como:
  `Smash Fries - 2026`

### Criterio de aceptación
La interfaz pública no debe mostrar la palabra `demo` ni `universitaria` en textos visibles al usuario, salvo que exista algún comentario interno de código donde no se vea en pantalla.

---

## 2. Hero: promoción destacada clickeable

### Problema
En el hero aparece una promoción destacada visual, por ejemplo:

> Promo destacada  
> Combo Smash + papas + bebida

Actualmente, al hacer clic en la imagen o en la tarjeta de promoción, no lleva al usuario a comprar/ver el detalle de ese combo.

### Objetivo
La tarjeta completa de la promo destacada del hero debe ser clickeable.

### Comportamiento esperado
Al hacer clic en cualquiera de estas zonas:

- imagen de la hamburguesa,
- tarjeta visual de la promo,
- texto `Promo destacada`,
- texto `Combo Smash + papas + bebida`,
- o cualquier área visible de esa tarjeta,

el usuario debe ir al detalle correspondiente del combo/promoción.

### Resultado esperado en detalle
Al entrar al detalle debe mostrarse claramente el producto/promoción correcta:

- Combo Smash + papas + bebida.
- Precio correcto de la promoción.
- Elementos incluidos: hamburguesa smash, papas y bebida.
- Botón para agregar/comprar.
- Flujo normal hacia carrito y/o WhatsApp.

### Importante
No debe llevar a un producto equivocado ni a un detalle genérico sin la promoción.

---

## 3. Crear o conectar correctamente productos/promociones tipo combo

### Problema
Las promociones muestran combos, pero es posible que no existan como producto real o detalle comprable.

### Tarea
Analizar cómo están modelados los productos y promociones actualmente.

Revisar si las promociones vienen de:

- datos locales/fallback,
- Supabase,
- tabla `promotions`,
- productos existentes,
- o componentes hardcodeados.

### Objetivo
Cada promoción activa debe estar asociada a un elemento comprable.

Puede resolverse de una de estas formas, según la estructura actual del proyecto:

#### Opción A — Promoción enlazada a producto existente
Si la promoción corresponde a un producto existente, enlazarla al detalle de ese producto.

#### Opción B — Crear producto tipo combo
Si la promoción es un combo real, crear o definir un producto tipo combo en los datos fallback y/o en la lógica de lectura.

Ejemplo de producto combo:

- Nombre: `Combo Smash + papas + bebida`
- Descripción: `Hamburguesa smash acompañada de papas y bebida.`
- Precio: el precio mostrado en la promoción.
- Categoría: combos/promociones, según exista en el proyecto.
- Disponible: true.
- Imagen: usar una imagen existente adecuada.

#### Opción C — Página o modal de detalle de promoción
Si el proyecto maneja promociones separadas de productos, permitir que la promoción tenga su propio detalle y desde ahí pueda añadirse al carrito.

### Criterio de aceptación
Toda promoción visible debe poder convertirse en pedido real dentro del flujo del sitio.

---

## 4. Promociones activas clickeables

### Problema
En la sección “Promociones activas” aparecen promociones como:

- `Martes Smash` — `Desde $6.50`
- `Combo universitario` — `Desde $9.80`

Pero al hacer clic no necesariamente llevan al usuario a comprar/ver el detalle.

### Objetivo
Cada tarjeta de promoción activa debe ser clickeable y llevar al detalle correcto.

### Comportamiento esperado
Al hacer clic en cualquier parte de una tarjeta de promoción:

- imagen,
- título,
- precio,
- badges,
- fondo de la tarjeta,

debe navegar al detalle de esa promoción/producto/combo.

### Detalle esperado
El detalle debe mostrar:

- nombre de la promoción,
- descripción,
- precio mostrado en la Home,
- productos incluidos, si aplica,
- imagen,
- botón de agregar/comprar,
- y flujo correcto de WhatsApp/carrito.

### Nota importante sobre precios
Si la promoción dice `Desde $6.50`, el detalle debe respetar ese precio base.
Si la promoción dice `Desde $9.80`, el detalle debe respetar ese precio base.

No mostrar precios diferentes sin justificación.

---

## 5. Productos destacados: imagen clickeable hacia detalle

### Problema
Actualmente el usuario puede entrar al detalle usando el botón `Ver detalle`, pero se desea que también pueda hacerlo dando clic en la imagen del producto.

### Tarea
Para cada producto destacado de la Home:

- La Clásica Smash,
- Bacon Smash,
- Double Smash,
- y cualquier otro destacado que se agregue,

hacer que la imagen sea clickeable y lleve al detalle correspondiente del producto.

### Requisitos

- El botón `Ver detalle` debe seguir funcionando.
- El botón `Agregar` debe seguir funcionando.
- Hacer clic en la imagen no debe agregar al carrito accidentalmente.
- Hacer clic en la imagen debe navegar al mismo destino que `Ver detalle`.
- Agregar cursor pointer y hover visual suave sobre la imagen.
- Mantener accesibilidad con `aria-label` o texto alternativo adecuado si corresponde.

### Criterio de aceptación
Clic en imagen de cada producto destacado = abrir detalle del producto correcto.

---

## 6. Promociones dinámicas por día u horario

### Objetivo
Permitir que las promociones mostradas puedan cambiar según el día u horario, sin romper la lógica actual.

### Tarea
Analizar cómo se manejan las promociones y proponer/implementar una lógica simple y mantenible.

### Reglas sugeridas
Implementar una lógica que permita definir promociones con campos como:

- `title`
- `description`
- `price`
- `image`
- `badge`
- `productId` o `promotionId`
- `activeDays`
- `startTime`
- `endTime`
- `isActive`

Ejemplo conceptual:

```ts
{
  title: 'Martes Smash',
  description: '2x1 en La Clásica Smash desde las 18:00.',
  price: 6.50,
  badge: 'Especial',
  activeDays: ['tuesday'],
  startTime: '18:00',
  endTime: '22:30',
  productId: 'classic-smash'
}
```

### Requisitos

- Si ya existe tabla `promotions` en Supabase, priorizar esa estructura si está implementada.
- Si todavía se usa fallback local, dejar la estructura preparada para promociones dinámicas.
- Evitar una lógica demasiado compleja.
- Si no hay promoción específica para el día actual, mostrar promociones generales activas.
- No romper la visual actual.

### Criterio de aceptación
El código debe permitir que mañana se pueda cambiar o activar otra promoción sin tocar toda la Home.

---

## 7. Botón “Ir a WhatsApp” del CTA final

### Problema
El botón `Ir a WhatsApp` debe usar el número configurado en variables de entorno, no un número hardcodeado.

### Variable esperada
Usar:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER
```

### Tarea
Verificar que el botón de WhatsApp del CTA final lea correctamente esa variable.

### Requisitos

- No hardcodear el número en el componente.
- Usar `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER` o la utilidad/config existente del proyecto.
- Si el proyecto ya tiene helper para WhatsApp, reutilizarlo.
- Si la variable no existe, usar un fallback seguro o deshabilitar de forma controlada, sin romper la página.

---

## 8. Mensaje de WhatsApp bien redactado

### Objetivo
Cuando el usuario presione `Ir a WhatsApp`, debe abrir WhatsApp con un mensaje claro, profesional y útil.

### Mensaje sugerido para CTA general
Usar algo similar a:

```txt
Hola, quiero hacer un pedido en Smash Fries. ¿Me puedes ayudar con el menú y las promociones disponibles?
```

### Mensaje sugerido para pedido con producto/combo
Cuando venga desde un producto, combo o promoción, el mensaje debe incluir:

```txt
Hola, quiero hacer un pedido en Smash Fries.

Producto: [nombre del producto o combo]
Cantidad: [cantidad]
Precio: $[precio]

¿Me confirmas disponibilidad y tiempo de entrega/retiro?
```

Si el carrito tiene varios productos, mantener el mensaje estructurado con:

- lista de productos,
- cantidades,
- extras si existen,
- subtotal/total,
- tipo de entrega si existe,
- nombre del cliente si el flujo lo solicita,
- y observaciones si existen.

### Requisitos técnicos

- Codificar el mensaje con `encodeURIComponent`.
- No generar URLs inválidas.
- Formato correcto:

```ts
https://wa.me/${number}?text=${encodedMessage}
```

- Limpiar el número si viene con espacios, `+`, guiones o paréntesis.

---

## 9. Flujo esperado desde una promoción hasta WhatsApp

### Flujo deseado

1. Usuario ve una promoción en Home.
2. Usuario hace clic en la promoción.
3. Se abre detalle correcto de la promoción/combo.
4. Usuario puede agregar/comprar.
5. Se respeta el precio de la promoción.
6. El carrito recibe el producto/combo correcto.
7. Al enviar por WhatsApp, el mensaje incluye el combo/promoción correcto.

### Criterio de aceptación
No debe existir una promoción visible que sea solo decorativa y no se pueda pedir.

---

## 10. Responsive obligatorio

Todos estos cambios deben verse y funcionar bien en:

- desktop,
- tablet,
- celular.

### Revisar especialmente en móvil

- Hero con promo destacada.
- Imagen clickeable de promo.
- Productos destacados.
- Cards de promociones activas.
- Botones de WhatsApp.
- Navegación hacia detalle.
- Que no exista scroll horizontal.
- Que las tarjetas no queden cortadas.
- Que los botones sigan siendo cómodos de tocar.

---

## 11. Accesibilidad y UX

Aplicar buenas prácticas:

- Usar `cursor: pointer` en elementos clickeables.
- Dar feedback visual en hover.
- Dar feedback en focus-visible.
- Usar `aria-label` si una imagen funciona como enlace.
- No usar `div` clickeables sin soporte de teclado si debería ser un enlace.
- Preferir `Link` para navegación interna.
- No anidar links incorrectamente.
- No romper semántica HTML.

---

## 12. Validaciones obligatorias

Antes de terminar, ejecutar o verificar según corresponda:

```bash
npm run lint
npm run build
npm run dev
```

Si algún comando no existe, revisar `package.json` y usar el equivalente real.

---

## 13. Checklist final

Codex debe confirmar que:

- [ ] Ya no aparece `demo universitaria` en la UI pública.
- [ ] Ya no aparece `pedido demo` o `pedidos demo` en la UI pública.
- [ ] La promo destacada del hero es clickeable.
- [ ] La promo destacada lleva al detalle correcto.
- [ ] El combo mostrado puede comprarse/agregarse.
- [ ] Las promociones activas son clickeables.
- [ ] Cada promoción activa lleva a su detalle correcto.
- [ ] Los precios de promociones se respetan.
- [ ] Las imágenes de productos destacados llevan al detalle correcto.
- [ ] Los botones `Ver detalle` siguen funcionando.
- [ ] Los botones `Agregar` siguen funcionando.
- [ ] El carrito sigue funcionando.
- [ ] El botón `Ir a WhatsApp` usa `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- [ ] El mensaje de WhatsApp está bien redactado y codificado.
- [ ] El flujo promoción → detalle → carrito → WhatsApp funciona.
- [ ] Todo funciona en desktop.
- [ ] Todo funciona en tablet.
- [ ] Todo funciona en celular.
- [ ] No hay scroll horizontal.
- [ ] El build termina sin errores.

---

## 14. Entrega esperada de Codex

Al finalizar, entregar un resumen con:

1. Archivos modificados.
2. Textos reemplazados.
3. Cómo se corrigieron las promociones clickeables.
4. Cómo se conectaron las promociones con productos/combos.
5. Cómo quedó el flujo hacia WhatsApp.
6. Validaciones realizadas.
7. Notas importantes o pendientes.

---

## 15. Regla final

No dejar promociones decorativas que no se puedan pedir.

Toda promoción visible debe tener una acción real y clara para que el usuario pueda verla, comprarla y enviarla correctamente por WhatsApp.
