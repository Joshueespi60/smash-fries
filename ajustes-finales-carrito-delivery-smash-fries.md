# Smash Fries — Ajustes finales para carrito y tipo de entrega

## Objetivo

Mejorar la página `/carrito` para que el flujo de pedido se vea más profesional, claro y listo para demo/producción, especialmente el comportamiento entre **Retiro en local** y **Entrega a domicilio**.

Este archivo debe ser leído completamente por Codex antes de modificar el código.

---

## 1) Cambios de texto y correcciones visuales

Corregir textos con tildes y mejorar la claridad del formulario.

### Cambios obligatorios

Cambiar:

- `Envio` → `Envío`
- `Telefono` → `Teléfono`
- `Direccion` → `Dirección`

### Cambios recomendados en tipo de entrega

En el selector de tipo de entrega, cambiar:

- `Delivery` → `Entrega a domicilio`
- `Retiro` → `Retiro en local`

El objetivo es que el usuario entienda claramente qué opción está seleccionando.

---

## 2) Comportamiento esperado para Retiro en local

Cuando el usuario seleccione **Retiro en local**:

1. El costo de envío debe ser `$0.00`.
2. El total final no debe sumar envío.
3. El campo **Dirección** debe ocultarse o mostrarse desactivado.
4. La dirección no debe ser obligatoria.
5. Si se muestra el campo desactivado, debe decir:
   - `No aplica`
6. El mensaje de WhatsApp debe indicar:
   - `Tipo de entrega: Retiro en local`
7. El mensaje de WhatsApp no debe incluir dirección si no aplica.

---

## 3) Comportamiento esperado para Entrega a domicilio

Cuando el usuario seleccione **Entrega a domicilio**:

1. Mostrar el campo **Dirección**.
2. Hacer obligatorio el campo **Dirección**.
3. Sumar el costo de envío al total.
4. Mostrar el costo de envío en el resumen del pedido.
5. El mensaje de WhatsApp debe incluir:
   - tipo de entrega
   - dirección
   - costo de envío
   - total final con envío incluido

### Placeholder recomendado para dirección

Usar este placeholder:

```txt
Ej: Barrio X, calle Y, referencia
```

---

## 4) Validaciones antes de enviar por WhatsApp

Antes de permitir enviar el pedido por WhatsApp, validar los datos obligatorios.

### Datos obligatorios siempre

1. Nombre
2. Teléfono

### Dato obligatorio solo para entrega a domicilio

3. Dirección

### Mensajes de error sugeridos

Si falta el nombre:

```txt
Ingresa tu nombre.
```

Si falta el teléfono:

```txt
Ingresa tu teléfono.
```

Si falta dirección y el tipo de entrega es entrega a domicilio:

```txt
Ingresa tu dirección para la entrega a domicilio.
```

### Comportamiento esperado

1. No abrir WhatsApp si faltan campos obligatorios.
2. Mostrar un mensaje claro cerca del campo o como toast.
3. Resaltar el campo con error.
4. Quitar el error cuando el usuario corrija el dato.

---

## 5) Resumen del pedido

Mejorar el bloque **Resumen del pedido** para que sea más claro.

Debe mostrar:

1. Subtotal
2. Envío
3. Total

### Reglas

- Si el tipo de entrega es **Retiro en local**, envío debe ser `$0.00`.
- Si el tipo de entrega es **Entrega a domicilio**, envío debe mostrar el valor configurado.
- El total debe actualizarse automáticamente al cambiar:
  - cantidades
  - productos
  - extras
  - tipo de entrega

### Visual

1. El total debe tener más protagonismo visual.
2. El color rojo/naranja de marca puede usarse en el total.
3. Mantener alineación limpia entre etiquetas y precios.

---

## 6) Select de tipo de entrega

Revisar el estilo del selector.

### Importante

Actualmente se ve un borde naranja en el select cuando está seleccionado Delivery.

Codex debe revisar:

1. Si el borde naranja aparece solo por `focus`, está bien.
2. Si el borde naranja aparece siempre, cambiarlo por un borde neutral.
3. Usar borde naranja solo en:
   - focus
   - error
   - estado activo intencional

### Estados recomendados

- Normal: borde neutral
- Focus: borde naranja
- Error: borde rojo o naranja fuerte con mensaje claro

---

## 7) Mensaje de WhatsApp

Revisar que el mensaje enviado por WhatsApp tenga un formato claro y ordenado.

Debe incluir:

1. Nombre del cliente
2. Teléfono
3. Tipo de entrega
4. Dirección, solo si aplica
5. Productos
6. Cantidad por producto
7. Extras por producto
8. Observaciones generales
9. Subtotal
10. Envío
11. Total final

### Ejemplo de estructura sugerida

```txt
Hola, quiero hacer un pedido en Smash Fries.

Cliente: Juan Pérez
Teléfono: 0999999999
Tipo de entrega: Entrega a domicilio
Dirección: Barrio X, calle Y, referencia

Pedido:
1x Bacon Smash - $7.20
Extras: Tocino crujiente, Cebolla caramelizada

3x Combo Double Smash - $12.40 c/u
Extras: Tocino crujiente

Observaciones:
Sin cebolla en una hamburguesa.

Subtotal: $64.70
Envío: $1.50
Total: $66.20
```

Si es retiro:

```txt
Tipo de entrega: Retiro en local
```

Y no incluir dirección.

---

## 8) Botones recomendados en carrito

Agregar o revisar estos botones:

### Botón “Seguir comprando”

Debe llevar al menú.

Texto sugerido:

```txt
Seguir comprando
```

Puede ubicarse:

- debajo de la lista de productos
- o cerca del título del carrito

### Botón “Vaciar carrito”

Debe eliminar todos los productos del carrito.

Texto sugerido:

```txt
Vaciar carrito
```

Recomendación:

- pedir confirmación antes de vaciar
- o mostrar toast de confirmación luego de vaciar

---

## 9) Productos repetidos en carrito

Revisar cómo se manejan productos duplicados.

### Reglas

1. Si el mismo producto se agrega con los mismos extras, debe unirse en una sola línea aumentando la cantidad.
2. Si el mismo producto se agrega con extras diferentes, debe mantenerse como línea separada.
3. Si el mismo producto se agrega sin extras y luego con extras, deben ser líneas separadas.
4. El subtotal y total deben calcularse correctamente en todos los casos.

---

## 10) Cantidades y eliminación

Revisar el control de cantidad en cada producto.

### Cantidad

1. El botón `-` no debe permitir bajar de 1.
2. Si la cantidad está en 1, el botón `-` debe estar desactivado o visualmente bloqueado.
3. El botón `+` debe aumentar correctamente la cantidad.
4. El total debe actualizarse al instante.

### Eliminar producto

1. El icono de papelera debe eliminar solo ese producto.
2. El total debe actualizarse al eliminar.
3. Si era el último producto, debe mostrarse el estado de carrito vacío.

---

## 11) Estado de carrito vacío

Si el carrito no tiene productos, mostrar una vista limpia.

### Contenido sugerido

```txt
Tu carrito está vacío
```

Texto secundario:

```txt
Agrega productos del menú para completar tu pedido.
```

Botón:

```txt
Ver menú
```

### Comportamiento

1. No mostrar resumen de pedido vacío innecesario.
2. No mostrar formulario de datos si no hay productos.
3. El botón debe llevar al menú.

---

## 12) Responsive mobile

Revisar la página en mobile.

### Validar

1. Las tarjetas de productos no deben verse apretadas.
2. Las imágenes deben mantener buen tamaño.
3. El resumen debe pasar debajo de los productos.
4. El formulario debe ocupar el ancho disponible.
5. Los botones deben tener tamaño cómodo para tocar.
6. El botón de WhatsApp no debe cortarse.
7. El navbar y el contador del carrito deben seguir funcionando bien.

---

## 13) Mejoras opcionales de UX

Estas mejoras no son obligatorias, pero serían buenas para la demo:

1. Hacer el resumen del pedido `sticky` en desktop.
2. Agregar toast al eliminar producto.
3. Agregar toast al vaciar carrito.
4. Agregar confirmación visual después de enviar por WhatsApp.
5. Preguntar si se desea vaciar el carrito después de enviar el pedido.
6. Agregar una pequeña nota:
   - `El pedido será confirmado por WhatsApp.`

---

## 14) Checklist QA para Codex

Después de aplicar cambios, probar:

- [ ] Carrito con un solo producto.
- [ ] Carrito con varios productos.
- [ ] Producto repetido con mismos extras.
- [ ] Producto repetido con extras diferentes.
- [ ] Aumentar cantidades.
- [ ] Disminuir cantidades.
- [ ] Eliminar producto.
- [ ] Vaciar carrito.
- [ ] Estado de carrito vacío.
- [ ] Retiro en local con envío `$0.00`.
- [ ] Entrega a domicilio con envío sumado.
- [ ] Validación de nombre.
- [ ] Validación de teléfono.
- [ ] Validación de dirección solo en entrega a domicilio.
- [ ] Mensaje de WhatsApp con formato correcto.
- [ ] Vista desktop.
- [ ] Vista mobile.
- [ ] Total actualizado correctamente.

---

## 15) Resultado esperado

Al finalizar, la página `/carrito` debe:

1. Verse más profesional.
2. Tener textos corregidos.
3. Manejar correctamente retiro y entrega a domicilio.
4. Validar datos antes de abrir WhatsApp.
5. Calcular bien subtotal, envío y total.
6. Enviar un mensaje de WhatsApp claro.
7. Tener buen responsive.
8. Mostrar estado correcto cuando el carrito esté vacío.

---

## 16) Instrucción final para Codex

Leer este archivo completo, analizar la implementación actual del carrito y aplicar estos cambios sin romper la funcionalidad existente.

Prioridad máxima:

1. Corregir comportamiento de **Retiro en local** y **Entrega a domicilio**.
2. Corregir textos con tildes.
3. Validar campos antes de enviar por WhatsApp.
4. Mejorar resumen del pedido.
5. Revisar cálculos de subtotal, envío y total.
6. Probar desktop y mobile.

Al terminar, entregar un resumen con:

- archivos modificados,
- cambios realizados,
- pruebas ejecutadas,
- y cualquier detalle pendiente.
