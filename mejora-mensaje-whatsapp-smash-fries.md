# Smash Fries — Mejora del formato del mensaje de WhatsApp

## Objetivo

Mejorar el formato del mensaje que se envía por WhatsApp desde el flujo de pedido de Smash Fries.

Actualmente el mensaje funciona y contiene la información principal, pero puede verse más profesional, más ordenado y más fácil de leer para quien recibe el pedido.

Codex debe leer este archivo completo, analizar la implementación actual del envío por WhatsApp y aplicar los cambios sin romper la funcionalidad existente.

---

## 1) Situación actual

El mensaje actual se ve aproximadamente así:

```txt
Hola, quiero hacer un pedido en Smash Fries.

Cliente: Joshue
Teléfono: 1516161
Tipo de entrega: Retiro en local

Pedido:

1. 1x La Clásica Smash - $6.50

2. 1x Bacon Smash - $7.20

Observaciones:
gsdgsgdsgd

Subtotal: $13.70
Envío: $0.00
Total: $13.70
```

Este mensaje está bien y se entiende, pero se puede mejorar agregando:

1. Número de pedido.
2. Mejor separación por producto.
3. Precio unitario y subtotal por producto.
4. Total final más claro como `Total a pagar`.
5. Frase final para confirmar disponibilidad y tiempo estimado.
6. Evitar campos vacíos o innecesarios.

---

## 2) Formato esperado del mensaje de WhatsApp

El mensaje debe quedar con una estructura similar a esta:

```txt
Hola, quiero hacer un pedido en Smash Fries.

Pedido #SF-20260430-2118

Cliente: Joshue
Teléfono: 1516161
Tipo de entrega: Retiro en local

Pedido:
1. 1x La Clásica Smash
   Precio unitario: $6.50
   Subtotal: $6.50

2. 1x Bacon Smash
   Precio unitario: $7.20
   Subtotal: $7.20

Observaciones:
gsdgsgdsgd

Subtotal: $13.70
Envío: $0.00
Total a pagar: $13.70

Por favor confirmar disponibilidad y tiempo estimado.
```

---

## 3) Número de pedido

Agregar el número de pedido al mensaje de WhatsApp.

### Regla

Si la página de confirmación ya genera o muestra un número de pedido, ese mismo número debe incluirse también en el mensaje de WhatsApp.

### Ejemplo

```txt
Pedido #SF-20260430-2118
```

### Reglas adicionales

1. No generar un número diferente para WhatsApp y otro para confirmación.
2. El número debe mantenerse consistente durante todo el flujo.
3. Si no existe un número real de pedido, generar uno simple basado en fecha/hora.
4. Si hay un registro en `demo_orders` y tiene ID, puede usarse ese ID o una versión formateada.
5. No debe romper si no existe pedido guardado en base de datos.

---

## 4) Datos del cliente

El mensaje debe incluir:

```txt
Cliente: Joshue
Teléfono: 1516161
Tipo de entrega: Retiro en local
```

### Reglas

1. Mantener tildes correctas:
   - `Teléfono`
2. Usar nombres claros para el tipo de entrega:
   - `Retiro en local`
   - `Entrega a domicilio`
3. No usar `Delivery` en el mensaje final si ya se decidió usar español formal.
4. No incluir datos vacíos.

---

## 5) Dirección según tipo de entrega

### Si el tipo de entrega es Retiro en local

No incluir dirección.

Correcto:

```txt
Tipo de entrega: Retiro en local
```

Incorrecto:

```txt
Dirección: No aplica
```

Para WhatsApp, es mejor no enviar la línea de dirección cuando no aplica.

### Si el tipo de entrega es Entrega a domicilio

Sí incluir dirección.

Ejemplo:

```txt
Tipo de entrega: Entrega a domicilio
Dirección: Barrio X, calle Y, referencia
```

### Reglas

1. La dirección solo debe aparecer cuando sea entrega a domicilio.
2. Si es entrega a domicilio, la dirección debe ser obligatoria desde el formulario.
3. No enviar `Dirección:` vacía.
4. No enviar `Dirección: No aplica` por WhatsApp.

---

## 6) Formato de productos

Cada producto debe mostrarse separado y con información clara.

### Debe incluir

Por cada producto:

1. Número de línea.
2. Cantidad.
3. Nombre del producto.
4. Extras si existen.
5. Precio unitario.
6. Subtotal de la línea.

### Ejemplo sin extras

```txt
1. 1x La Clásica Smash
   Precio unitario: $6.50
   Subtotal: $6.50
```

### Ejemplo con extras

```txt
2. 1x Bacon Smash
   Extras: Tocino crujiente, Cebolla caramelizada
   Precio unitario: $7.20
   Subtotal: $8.90
```

### Ejemplo con cantidad mayor a 1

```txt
3. 3x Combo Double Smash
   Extras: Tocino crujiente
   Precio unitario: $12.40
   Subtotal: $37.20
```

### Reglas

1. Si un producto no tiene extras, no mostrar la línea `Extras:`.
2. Si tiene extras, mostrarlos separados por coma.
3. El subtotal debe considerar:
   - precio base
   - extras
   - cantidad
4. El precio unitario puede mostrar:
   - solo precio base, o
   - precio base + extras por unidad

### Recomendación

Para evitar confusión, usar:

```txt
Precio unitario: $8.90
Subtotal: $8.90
```

Cuando el producto tiene extras, el precio unitario debería representar el precio final por unidad con extras incluidos.

---

## 7) Observaciones

El mensaje debe incluir observaciones solo si el usuario escribió algo.

### Si hay observaciones

Mostrar:

```txt
Observaciones:
Sin cebolla, por favor.
```

### Si no hay observaciones

No mostrar la sección de observaciones.

### Reglas

1. No enviar `Observaciones:` vacío.
2. Hacer `trim()` del texto para evitar espacios en blanco.
3. Si el campo solo tiene espacios, tratarlo como vacío.

---

## 8) Totales

El mensaje debe mostrar:

```txt
Subtotal: $13.70
Envío: $0.00
Total a pagar: $13.70
```

### Reglas

1. Usar `Envío`, con tilde.
2. Cambiar `Total:` por `Total a pagar:`.
3. El total debe incluir envío si aplica.
4. Si es retiro, envío debe ser `$0.00`.
5. Si es entrega a domicilio, envío debe mostrar el valor configurado.
6. Todos los montos deben mostrarse con dos decimales.

---

## 9) Frase final

Agregar al final del mensaje:

```txt
Por favor confirmar disponibilidad y tiempo estimado.
```

### Objetivo

Esto hace que el mensaje suene más natural para WhatsApp y le pide al negocio confirmar el pedido.

### Ubicación

Debe ir después de los totales, dejando una línea en blanco antes.

---

## 10) Formato esperado para Retiro en local

Ejemplo completo:

```txt
Hola, quiero hacer un pedido en Smash Fries.

Pedido #SF-20260430-2118

Cliente: Joshue
Teléfono: 1516161
Tipo de entrega: Retiro en local

Pedido:
1. 1x La Clásica Smash
   Precio unitario: $6.50
   Subtotal: $6.50

2. 1x Bacon Smash
   Precio unitario: $7.20
   Subtotal: $7.20

Observaciones:
gsdgsgdsgd

Subtotal: $13.70
Envío: $0.00
Total a pagar: $13.70

Por favor confirmar disponibilidad y tiempo estimado.
```

---

## 11) Formato esperado para Entrega a domicilio

Ejemplo completo:

```txt
Hola, quiero hacer un pedido en Smash Fries.

Pedido #SF-20260430-2118

Cliente: Joshue
Teléfono: 1516161
Tipo de entrega: Entrega a domicilio
Dirección: Barrio X, calle Y, referencia

Pedido:
1. 1x La Clásica Smash
   Precio unitario: $6.50
   Subtotal: $6.50

2. 1x Bacon Smash
   Extras: Tocino crujiente, Cebolla caramelizada
   Precio unitario: $8.90
   Subtotal: $8.90

Observaciones:
Sin cebolla en la segunda hamburguesa.

Subtotal: $15.40
Envío: $1.50
Total a pagar: $16.90

Por favor confirmar disponibilidad y tiempo estimado.
```

---

## 12) Codificación del mensaje para WhatsApp

Revisar que el mensaje se codifique correctamente al abrir WhatsApp.

### Reglas técnicas

1. Usar `encodeURIComponent` o equivalente.
2. Mantener saltos de línea correctamente.
3. No duplicar espacios innecesarios.
4. No romper caracteres con tildes:
   - Clásica
   - Teléfono
   - Envío
   - Dirección
5. No usar HTML dentro del mensaje.
6. El mensaje final debe abrirse bien en WhatsApp Web y WhatsApp móvil.

---

## 13) Evitar campos vacíos

No enviar líneas vacías innecesarias ni campos sin datos.

### No enviar

```txt
Dirección:
Extras:
Observaciones:
```

Si esos campos no aplican.

### Sí enviar

Solo cuando tengan valor real.

---

## 14) Consistencia con la pantalla de confirmación

El mensaje de WhatsApp debe coincidir con la información que aparece en `/confirmacion`.

### Deben coincidir

1. Número de pedido.
2. Cliente.
3. Teléfono.
4. Tipo de entrega.
5. Dirección, si aplica.
6. Productos.
7. Extras.
8. Subtotal.
9. Envío.
10. Total.

### Importante

No debe pasar que WhatsApp muestre un total y la pantalla de confirmación muestre otro.

---

## 15) Checklist QA para Codex

Después de aplicar los cambios, probar:

- [ ] Pedido con retiro en local.
- [ ] Pedido con entrega a domicilio.
- [ ] Pedido sin observaciones.
- [ ] Pedido con observaciones.
- [ ] Producto sin extras.
- [ ] Producto con extras.
- [ ] Producto con cantidad mayor a 1.
- [ ] Varios productos.
- [ ] Subtotal correcto.
- [ ] Envío correcto.
- [ ] Total a pagar correcto.
- [ ] Número de pedido incluido.
- [ ] Dirección incluida solo si aplica.
- [ ] No se envían campos vacíos.
- [ ] Saltos de línea correctos en WhatsApp.
- [ ] Tildes visibles correctamente.
- [ ] Mensaje coincide con `/confirmacion`.

---

## 16) Resultado esperado

Al finalizar, el mensaje de WhatsApp debe:

1. Verse más ordenado.
2. Incluir número de pedido.
3. Separar mejor los productos.
4. Mostrar precio unitario y subtotal por producto.
5. Mostrar observaciones solo si existen.
6. Mostrar dirección solo si aplica.
7. Mostrar `Total a pagar`.
8. Terminar con una frase de confirmación.
9. Coincidir con la pantalla `/confirmacion`.
10. Mantener todos los cálculos correctos.

---

## 17) Instrucción final para Codex

Leer este archivo completo, revisar la función o componente que construye el mensaje de WhatsApp y aplicar los cambios indicados.

Prioridad máxima:

1. Mejorar el formato del mensaje.
2. Agregar número de pedido.
3. Evitar campos vacíos.
4. Mostrar dirección solo cuando aplique.
5. Mostrar productos con precio unitario y subtotal.
6. Cambiar `Total` por `Total a pagar`.
7. Asegurar que el mensaje de WhatsApp coincida con `/confirmacion`.

Al terminar, entregar un resumen con:

- archivos modificados,
- cambios realizados,
- pruebas ejecutadas,
- y cualquier detalle pendiente.
