# Smash Fries — Ajustes finales para la página de producto

## Objetivo

Revisar y mejorar la página de detalle de producto para corregir el espacio en blanco debajo de la imagen, dejar consistente el diseño entre productos y cerrar los últimos detalles visuales, responsivos y de UX antes de producción/demo.

---

## 1) Problema detectado principal: espacio en blanco debajo de la imagen

En la página de producto se ve un espacio vacío grande debajo de la hamburguesa.  
Esto normalmente pasa porque:

- el contenedor de la imagen tiene una **altura fija** mayor que la imagen real, o
- se está usando una proporción/tamaño que no coincide con el archivo, o
- la imagen está renderizada con `object-contain` dentro de un bloque más alto de lo necesario.

### Qué hacer

Si las imágenes del producto son cuadradas o casi cuadradas, la solución recomendada es:

1. Hacer que el contenedor principal de la imagen use una proporción consistente.
2. Usar una de estas dos estrategias:

#### Opción recomendada A: contenedor cuadrado + `object-cover`
Usar un contenedor visual cuadrado (`aspect-square`) para que se vea limpio y uniforme.

- Ventaja: se elimina el espacio vacío.
- Ventaja: el diseño queda más consistente.
- Consideración: puede recortar un poco la imagen si el encuadre no viene perfecto.

#### Opción recomendada B: contenedor cuadrado + `object-contain` + fondo integrado
Si no quieres recortar nada de la hamburguesa:

- mantener el contenedor cuadrado,
- usar `object-contain`,
- centrar la imagen,
- y aplicar un fondo similar al color del sitio o un fondo muy suave, para que no parezca “espacio muerto”.

### Recomendación práctica

Para esta demo, usar:

- **detalle de producto:** contenedor `aspect-square`
- imagen con:
  - `object-cover` si el recorte se ve bien,
  - o `object-contain` si quieres preservar la imagen completa.

### Importante

Revisar y eliminar cualquier clase o estilo del tipo:

- `min-height` excesivo
- `h-[600px]`, `h-full` mal aplicado
- contenedores internos duplicados
- padding inferior innecesario
- wrappers que reservan más alto del necesario

---

## 2) Implementación sugerida para la imagen de detalle

Codex debe revisar el componente de imagen del detalle del producto y hacer lo siguiente:

### Reglas

1. El bloque de imagen debe tener bordes redondeados y overflow oculto.
2. El contenedor visual debe usar una proporción consistente.
3. La imagen debe ocupar todo el bloque útil.
4. No debe quedar un bloque vacío debajo de la imagen.
5. La imagen debe verse bien tanto en desktop como en mobile.

### Comportamiento esperado

- En desktop:
  - imagen grande, limpia, proporcionada
  - sin espacio en blanco debajo
- En mobile:
  - imagen arriba del contenido
  - ancho completo
  - altura razonable
  - sin generar scroll innecesario

### Guía de implementación

Si están usando Tailwind, revisar algo equivalente a esto:

```tsx
<div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
  <div className="relative aspect-square">
    <Image
      src={product.image}
      alt={product.name}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  </div>
</div>
```

Si se prefiere no recortar:

```tsx
<div className="overflow-hidden rounded-3xl border border-neutral-200 bg-[#f7f2eb]">
  <div className="relative aspect-square">
    <Image
      src={product.image}
      alt={product.name}
      fill
      className="object-contain p-4"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  </div>
</div>
```

### Qué debe evitar Codex

- usar una altura fija grande para la imagen
- usar un contenedor padre más alto que el área real de la imagen
- dejar un `div` vacío debajo de la imagen
- mezclar `aspect-ratio` con `height` fija sin control

---

## 3) Revisión de tarjetas relacionadas

El usuario confirmó que al hacer click en las tarjetas relacionadas sí navega al producto correcto.

### Aun así, mejorar esto:

1. Toda la tarjeta debe ser claramente interactiva.
2. Agregar `hover` suave.
3. Agregar `focus-visible` para accesibilidad.
4. Si no existe, agregar cursor pointer.
5. Hacer que el nombre y el precio se lean mejor.

### Mejoras sugeridas

- `transition-all duration-200`
- `hover:-translate-y-1`
- `hover:shadow-md`
- `focus-visible:outline-none`
- `focus-visible:ring-2`
- `focus-visible:ring-orange-500`

### Opcional

Agregar una etiqueta pequeña arriba o abajo:

- “Ver producto”
- o un icono de flecha

No es obligatorio si toda la tarjeta ya se entiende como clickeable.

---

## 4) Ajustes de UX que todavía conviene hacer

### 4.1 Cantidad

- Desactivar el botón “-” cuando la cantidad sea 1.
- Asegurarse de que no permita bajar a 0 o negativos.

### 4.2 Extras

- Hacer toda la fila del extra clickeable, no solo el checkbox.
- Asegurar buen alineado entre nombre y precio.
- Mantener el precio extra visualmente secundario pero claro.

### 4.3 Total

- El bloque de “Total” está bien, pero revisar:
  - padding interno
  - jerarquía visual
  - que el número final resalte claramente

### 4.4 Botones

Revisar los botones:

- “Agregar al carrito”
- “Volver al menú”

#### Mejoras:
- En mobile, que idealmente se apilen o tengan ancho cómodo.
- En desktop, mantenerlos alineados sin verse apretados.
- Revisar consistencia de altura entre ambos botones.

### 4.5 Confirmación al agregar al carrito

Si aún no existe, agregar un toast o feedback visual:

**Texto sugerido:**
- “Producto agregado al carrito”
- “Se añadió correctamente a tu pedido”

**Acciones sugeridas:**
- “Ver carrito”
- “Seguir comprando”

---

## 5) Ajustes visuales generales recomendados

### 5.1 Espaciado entre bloques
Revisar separación entre:

- nombre del producto
- descripción
- tiempo estimado
- ingredientes
- precio
- cantidad
- extras
- total
- botones

El objetivo es que respire mejor y se vea más ordenado.

### 5.2 Jerarquía tipográfica
Confirmar:

- título del producto con peso fuerte
- precio destacado en color de marca
- metadatos (ingredientes / tiempo) con peso visual menor
- títulos de secciones (“Cantidad”, “Personaliza tu pedido”) claros y consistentes

### 5.3 Consistencia entre productos
Revisar que todas las páginas de producto tengan:

- mismo layout
- misma proporción de imagen
- mismo espaciado
- mismos estilos en extras y total
- mismos botones

---

## 6) Responsive / mobile

Codex debe revisar específicamente mobile.

### Validar que:

1. La imagen principal no se vea exageradamente alta.
2. La columna de información quede debajo de la imagen.
3. Los botones no se corten.
4. El total se vea bien.
5. Los extras sean fáciles de tocar.
6. Las tarjetas relacionadas pasen a 1 columna o layout cómodo.
7. El footer no quede apretado.

### Recomendación

En mobile:
- imagen arriba
- contenido debajo
- botones en columna o con wrap
- tarjetas relacionadas en 1 columna o 2 según ancho real disponible

---

## 7) Sección “También te puede gustar”

La sección ya aporta mucho valor. Solo mejorar:

1. Dar un poco más de espacio arriba.
2. Homogeneizar altura de tarjetas.
3. Mantener nombres y precios legibles.
4. Si hay nombres erróneos, corregirlos.

### Revisar contenido
Verificar si nombres como:
- “La Clafa Smash”

están escritos correctamente o si fue un error de carga.

---

## 8) Footer

Revisar:

1. Que el número de WhatsApp sea el correcto.
2. Que el texto descriptivo sea consistente.
3. Que en mobile se ordene bien en columnas o bloques.

### Texto sugerido opcional
Si se quiere mejorar la frase:

- “Hamburguesas smash frescas, hechas al momento”

---

## 9) Checklist técnico para Codex

Codex debe revisar y corregir:

- [ ] contenedor de imagen del detalle
- [ ] proporción/aspect ratio de la imagen
- [ ] eliminación del espacio blanco inferior
- [ ] responsive mobile
- [ ] botones de cantidad
- [ ] filas de extras clickeables
- [ ] total dinámico correcto
- [ ] feedback al agregar al carrito
- [ ] tarjetas relacionadas con buen hover/focus
- [ ] consistencia visual entre productos
- [ ] revisión de nombres de productos
- [ ] footer y WhatsApp final

---

## 10) Instrucciones directas para implementación

Codex debe hacer estos cambios concretos:

### A. Imagen principal del producto
1. Revisar el componente actual del bloque de imagen.
2. Detectar qué clase/estilo está provocando la altura sobrante.
3. Cambiar el bloque para que use una proporción consistente (`aspect-square` o similar).
4. Eliminar cualquier altura fija innecesaria.
5. Probar con `object-cover`.
6. Si el recorte afecta demasiado la hamburguesa, cambiar a `object-contain` con fondo suave integrado.
7. Confirmar que desaparece el espacio vacío inferior.

### B. Layout general
1. Mantener dos columnas en desktop.
2. En mobile, pasar a una sola columna.
3. Asegurar espaciados consistentes entre secciones.

### C. UX
1. Desactivar decremento en cantidad mínima.
2. Hacer clickeable toda la fila del extra.
3. Agregar toast de confirmación de carrito si aún no existe.

### D. Relacionados
1. Mantener tarjetas clickeables.
2. Mejorar hover/focus.
3. Revisar naming de productos.
4. Confirmar responsive.

### E. QA final
1. Revisar cada página de producto.
2. Validar que el total cambie con cantidad y extras.
3. Validar navegación entre productos relacionados.
4. Validar vista desktop y mobile.
5. Validar que no queden huecos visuales raros en la imagen principal.

---

## 11) Resultado esperado

Al finalizar:

- la imagen principal ya no debe mostrar un bloque vacío debajo,
- la página debe verse más compacta y profesional,
- las tarjetas relacionadas deben sentirse más interactivas,
- la UX del detalle debe ser más clara,
- y el layout debe quedar listo para demo/producción.

---

## 12) Nota final para Codex

Leer este archivo completo, revisar el componente de detalle de producto y aplicar todos los ajustes descritos.  
Prioridad máxima: **resolver el espacio en blanco de la imagen principal** sin romper responsive ni consistencia visual del sitio.
