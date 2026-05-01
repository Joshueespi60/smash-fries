# Smash Fries — Ajustes finales para página de confirmación

## Objetivo

Mejorar la página `/confirmacion` para que la confirmación del pedido se vea más profesional, clara y coherente con el resto del sitio.

Actualmente la página funciona y comunica que el pedido fue enviado, pero puede mejorarse visualmente y en estructura para sentirse más como una confirmación real de pedido.

Codex debe leer este archivo completo, analizar la implementación actual y aplicar los cambios sin romper la funcionalidad existente.

---

## 1) Correcciones de texto

### Cambios obligatorios

Cambiar:

- `Confirmacion` → `Confirmación`

Cambiar el texto actual:

```txt
Tu pedido demo fue generado y enviado a WhatsApp correctamente.
```

Por:

```txt
Tu pedido fue generado y enviado por WhatsApp correctamente.
```

También revisar textos similares como:

```txt
Tu mensaje fue preparado para WhatsApp y quedó registrado para esta demo.
```

Puede cambiarse por algo más profesional:

```txt
Tu mensaje fue preparado para WhatsApp y el pedido quedó registrado correctamente.
```

O:

```txt
Te contactaremos por WhatsApp para confirmar tu pedido.
```

---

## 2) Mensaje principal de éxito

Mantener el ícono/check de éxito, pero mejorar el bloque principal.

### Título sugerido

```txt
Pedido enviado correctamente
```

### Subtítulo sugerido

```txt
Te contactaremos por WhatsApp para confirmar tu pedido.
```

### Texto opcional

```txt
Gracias por elegir Smash Fries.
```

El objetivo es que la pantalla no parezca solo una página técnica, sino una confirmación real para el usuario.

---

## 3) Agregar número de pedido

Agregar un número de pedido visible.

### Ejemplo

```txt
Pedido #SF-2026-001
```

O generar uno dinámicamente usando fecha/hora.

### Opciones válidas

Codex puede implementar cualquiera de estas opciones:

1. Usar un ID simple basado en timestamp.
2. Usar un número generado al momento de confirmar.
3. Si ya existe un registro en `demo_orders`, usar el ID del pedido si está disponible.
4. Si no hay ID real, usar un identificador visual simple para la demo.

### Ejemplo dinámico

```txt
Pedido #SF-20260430-2032
```

### Reglas

- El número debe mostrarse cerca del título principal.
- Debe verse como parte de la confirmación.
- No debe romper si no existe pedido guardado.

---

## 4) Mostrar fecha y hora del pedido

Agregar fecha y hora del pedido si está disponible.

### Ejemplo

```txt
Fecha: 30/04/2026
Hora: 20:45
```

O en una sola línea:

```txt
Pedido realizado el 30/04/2026 a las 20:45
```

### Reglas

- Si hay fecha real del pedido, usarla.
- Si no existe, usar la fecha/hora actual del navegador.
- Formatear en estilo simple y legible.

---

## 5) Mejorar estructura del resumen del pedido

Actualmente el resumen aparece como un bloque simple. Mejorarlo separándolo en secciones.

### Secciones recomendadas

1. Datos del cliente
2. Entrega
3. Productos
4. Total

---

## 6) Sección: Datos del cliente

Mostrar:

- Cliente
- Teléfono

### Ejemplo visual

```txt
Datos del cliente
Cliente: Adony
Teléfono: 0985124452
```

### Reglas

- Mantener tildes correctas.
- Si algún dato no existe, mostrar un texto seguro como:
  - `No especificado`

---

## 7) Sección: Entrega

Mostrar:

- Tipo de entrega
- Dirección solo si aplica

### Para retiro en local

```txt
Entrega
Tipo de entrega: Retiro en local
Dirección: No aplica
```

O también puede ocultarse dirección para retiro:

```txt
Entrega
Tipo de entrega: Retiro en local
```

### Para entrega a domicilio

```txt
Entrega
Tipo de entrega: Entrega a domicilio
Dirección: Barrio X, calle Y, referencia
```

### Reglas

- Usar `Retiro en local`, no solo `Retiro`.
- Usar `Entrega a domicilio`, no `Delivery`.
- No mostrar dirección vacía.
- Si es retiro, no obligar a mostrar dirección.

---

## 8) Sección: Productos

Mejorar la lista de productos para que sea más clara.

### Debe mostrar

Por cada producto:

- cantidad
- nombre
- extras, si existen
- precio unitario, si está disponible
- subtotal por línea, si está disponible

### Ejemplo recomendado

```txt
Productos

1x Bacon Smash
Extras: Tocino crujiente, Cebolla caramelizada
Subtotal: $8.90

1x Double Smash
Subtotal: $8.40

3x Combo Double Smash
Extras: Tocino crujiente
Subtotal: $39.60
```

### Reglas

- Si un producto no tiene extras, no mostrar `Extras:` vacío.
- Si no hay precio de línea disponible, al menos mostrar cantidad y nombre.
- Mantener una separación visual clara entre productos.
- Evitar que la lista se vea como texto plano desordenado.

---

## 9) Sección: Totales

Mostrar de forma clara:

- Subtotal
- Envío
- Total

### Ejemplo

```txt
Subtotal: $64.70
Envío: $0.00
Total: $64.70
```

### Reglas

- Corregir `Envio` por `Envío`.
- El total debe tener más peso visual.
- El color principal de marca puede usarse para el total.
- Si es retiro, envío debe ser `$0.00`.
- Si es entrega a domicilio, mostrar el valor de envío sumado.

---

## 10) Mejoras visuales del card principal

El card de confirmación debe mantenerse centrado y limpio.

### Mejoras sugeridas

1. Mantener bordes redondeados.
2. Mantener sombra suave si ya existe.
3. Aumentar ligeramente el espaciado interno.
4. Separar secciones con líneas suaves o cards internos.
5. Usar títulos pequeños para cada sección.
6. Mantener el ícono de éxito grande y visible.
7. Evitar que el resumen se vea como un bloque de texto plano.

### Layout recomendado dentro del card

```txt
[Ícono check]

Pedido enviado correctamente
Pedido #SF-20260430-2032
Te contactaremos por WhatsApp para confirmar tu pedido.

[Resumen del pedido]
- Datos del cliente
- Entrega
- Productos
- Totales

[Botones]
Volver al inicio | Ver menú | Nuevo pedido
```

---

## 11) Botones de acción

Actualmente existen:

- Volver al inicio
- Nuevo pedido

Agregar también:

```txt
Ver menú
```

### Comportamiento

- `Volver al inicio` debe llevar a `/`
- `Ver menú` debe llevar a la sección de menú o página de menú
- `Nuevo pedido` debe llevar al menú o reiniciar el flujo según la lógica actual

### Reglas

- Los botones deben tener estilos consistentes.
- En mobile deben acomodarse bien.
- El botón principal recomendado es:
  - `Nuevo pedido`
  - o `Ver menú`

---

## 12) Carrito después de confirmar

Revisar qué pasa con el carrito después de llegar a `/confirmacion`.

### Comportamiento recomendado

Después de enviar el pedido correctamente:

1. Vaciar el carrito.
2. Mantener los datos del pedido en la página de confirmación.
3. No perder el resumen mostrado aunque el carrito se vacíe.
4. Si el usuario recarga la página, mostrar una pantalla segura.

### Pantalla segura si no hay pedido

Si alguien entra directo a `/confirmacion` sin pedido reciente, mostrar:

```txt
No encontramos un pedido reciente.
```

Y botones:

```txt
Ver menú
Volver al inicio
```

Esto evita una pantalla vacía o datos rotos.

---

## 13) Responsive mobile

Revisar la página `/confirmacion` en mobile.

### Validar

1. El card principal no debe salirse del ancho.
2. El resumen debe leerse bien.
3. Los productos no deben verse apretados.
4. Los botones deben apilarse o adaptarse correctamente.
5. El ícono de éxito debe mantener buen tamaño.
6. El footer, si aparece, debe verse ordenado.

---

## 14) Consistencia con el resto del sitio

La página debe usar el mismo estilo visual del proyecto:

- fondo cálido
- cards blancos
- bordes suaves
- color naranja/rojo de marca
- tipografía y espaciado consistente
- botones con el mismo estilo que el resto del sitio

No crear un diseño completamente diferente.

---

## 15) Accesibilidad básica

Revisar:

1. Botones con texto claro.
2. Buen contraste en textos.
3. Estados `focus-visible` en botones.
4. Estructura semántica con headings correctos.
5. No depender solo del color para comunicar éxito.

---

## 16) Checklist QA para Codex

Después de aplicar los cambios, probar:

- [ ] Entrar a `/confirmacion` después de enviar pedido.
- [ ] Verificar título con tilde: `Confirmación`.
- [ ] Verificar mensaje principal.
- [ ] Verificar número de pedido.
- [ ] Verificar fecha y hora.
- [ ] Verificar datos del cliente.
- [ ] Verificar tipo de entrega retiro.
- [ ] Verificar tipo de entrega a domicilio.
- [ ] Verificar dirección solo cuando aplica.
- [ ] Verificar productos con extras.
- [ ] Verificar productos sin extras.
- [ ] Verificar subtotal, envío y total.
- [ ] Verificar botones:
  - Volver al inicio
  - Ver menú
  - Nuevo pedido
- [ ] Verificar vista desktop.
- [ ] Verificar vista mobile.
- [ ] Verificar qué pasa al recargar la página.
- [ ] Verificar qué pasa si se entra directo a `/confirmacion` sin pedido.

---

## 17) Resultado esperado

Al terminar, la página `/confirmacion` debe:

1. Verse más profesional.
2. Tener textos corregidos.
3. Mostrar una confirmación clara.
4. Mostrar número de pedido.
5. Mostrar fecha y hora.
6. Mostrar resumen ordenado.
7. Separar datos del cliente, entrega, productos y total.
8. Mostrar botones útiles.
9. Ser responsive.
10. Mantener consistencia visual con Smash Fries.

---

## 18) Instrucción final para Codex

Leer este archivo completo, revisar la implementación actual de `/confirmacion` y aplicar los cambios necesarios.

Prioridad máxima:

1. Corregir textos y tildes.
2. Mejorar el mensaje de éxito.
3. Agregar número de pedido.
4. Mejorar estructura del resumen.
5. Agregar botón `Ver menú`.
6. Revisar responsive.
7. Evitar errores si no existe pedido reciente.

Al finalizar, entregar un resumen con:

- archivos modificados,
- cambios realizados,
- pruebas ejecutadas,
- y cualquier detalle pendiente.
