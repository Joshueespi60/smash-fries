# Instrucciones para mejorar la página de Ubicación — Smash Fries

## Objetivo
Mejorar la sección `/ubicacion` del proyecto **Smash Fries** para que sea más clara, visual, amigable e interactiva para el usuario. La página actual funciona, pero se ve algo básica y con poca intención visual. Se debe mantener la estética general del sitio: fondo cálido, tarjetas con bordes suaves, acentos naranja/rojo y una experiencia sencilla para exposición universitaria.

---

## 1. Corregir textos y ortografía

Revisar todos los textos visibles de la página `/ubicacion` y corregirlos para que se lean más profesionales.

### Cambios sugeridos

Cambiar el subtítulo actual:

```txt
Información de contacto y horario. Fuente actual: fallback.
```

Por algo más limpio y amigable:

```txt
Visítanos en Esmeraldas o contáctanos para hacer tu pedido.
```

No mostrar al usuario textos técnicos como:

```txt
Fuente actual: fallback
```

Ese tipo de texto puede servir para desarrollo, pero no debe aparecer en la interfaz final.

---

## 2. Mejorar el encabezado de la página

Actualmente solo aparece el título “Ubicación”. Se debe hacer más llamativo.

### Propuesta

Crear un bloque superior tipo hero pequeño para la página de ubicación con:

- Título principal: `Ubicación`
- Subtítulo amigable: `Encuentra Smash Fries y conoce nuestros horarios de atención.`
- Un pequeño texto adicional opcional: `Estamos en Esmeraldas, Ecuador. Te esperamos con hamburguesas aplastadas al momento, frescas y llenas de sabor.`

### Diseño recomendado

- Mantener el ancho máximo del contenido igual al resto del sitio.
- Usar una tarjeta o bloque con fondo degradado suave.
- Añadir un ícono visual de ubicación o mapa si ya se usa alguna librería de íconos como `lucide-react`.
- Evitar que se vea como mucho texto plano.

---

## 3. Mejorar la tarjeta de información del local

La tarjeta izquierda debe verse más útil e interactiva.

### Contenido recomendado

La tarjeta debe incluir:

- Nombre: `Smash Fries`
- Dirección: `Av. del Pacífico y Calle 10, Esmeraldas, Ecuador`
- Horario: `17:00 - 22:30`
- Estado del local:
  - Si está cerrado: `Cerrado ahora · Abre a las 17:00`
  - Si está abierto: `Abierto ahora · Cierra a las 22:30`

### Mejoras visuales

Convertir cada dato en una fila con ícono:

- Pin de ubicación para la dirección.
- Reloj para el horario.
- Mensaje o teléfono para contacto.
- Ícono de mapa para abrir Google Maps.

La tarjeta debe sentirse como una tarjeta de contacto real, no solo como texto.

---

## 4. Añadir botones de acción más claros

Los botones actuales funcionan, pero se pueden mejorar con texto más directo y visual.

### Botones principales

Mantener o crear estos botones:

1. `Pedir por WhatsApp`
2. `Abrir en Google Maps`

### Comportamiento esperado

- El botón de WhatsApp debe abrir el número configurado en las variables de entorno o configuración del sitio.
- El botón de Google Maps debe abrir la ubicación en una pestaña nueva.
- Ambos enlaces deben usar `target="_blank"` y `rel="noopener noreferrer"` si corresponde.

### Mensaje sugerido para WhatsApp

```txt
Hola, Smash Fries. Quiero hacer un pedido o consultar la ubicación del local.
```

---

## 5. Mejorar la sección de redes sociales

Actualmente las redes aparecen como texto simple: `Instagram Facebook TikTok`.

### Cambio solicitado

Convertirlas en botones o chips pequeños con estilo.

Ejemplo:

- `Instagram`
- `Facebook`
- `TikTok`

### Diseño

- Usar formato tipo chip/pill.
- Borde suave.
- Hover visual.
- Si no hay enlaces reales todavía, usar `#` temporalmente, pero preparar el código para reemplazarlos fácilmente.
- Evitar que se vean como texto suelto.

---

## 6. Mejorar el mapa

El mapa está bien ubicado, pero puede integrarse mejor visualmente.

### Cambios visuales

- Mantener el mapa a la derecha en escritorio.
- En móvil, el mapa debe ir debajo de la tarjeta de información.
- Agregar bordes redondeados consistentes con el resto del sitio.
- Agregar sombra suave o borde para que se vea integrado.
- Evitar que el mapa se corte o quede muy bajo.
- Asegurar una altura mínima cómoda:
  - Escritorio: entre `360px` y `430px`.
  - Móvil: entre `300px` y `360px`.

### Importante

No cambiar la ubicación real si ya está configurada correctamente. Solo mejorar presentación, tamaño y contenedor.

---

## 7. Añadir una sección breve de referencia para el usuario

Debajo de la tarjeta y el mapa, añadir una sección pequeña con información útil para el visitante.

### Opción recomendada: “Antes de visitarnos”

Crear 3 tarjetas pequeñas o chips informativos:

1. `Horario de atención`
   - `Atendemos de 17:00 a 22:30.`

2. `Pedidos rápidos`
   - `Puedes escribirnos por WhatsApp para consultar disponibilidad.`

3. `Ubicación fácil`
   - `Abre Google Maps para llegar directamente al punto marcado.`

### Diseño

- Tres tarjetas en fila en escritorio.
- Una debajo de otra en móvil.
- Ícono pequeño en cada tarjeta.
- Texto corto, sin saturar la página.

---

## 8. Mejorar responsive

Revisar que la página se vea bien en:

- Computadora.
- Tablet.
- Celular.

### Comportamiento esperado

En escritorio:

- Información del local a la izquierda.
- Mapa a la derecha.
- Ambos con altura visual equilibrada.

En móvil:

- Título arriba.
- Tarjeta de información.
- Mapa debajo.
- Botones ocupando buen ancho, sin salirse del contenedor.
- Footer sin tapar contenido.

---

## 9. Mantener consistencia con el proyecto

No rediseñar todo el sitio. Solo mejorar `/ubicacion` manteniendo la identidad actual de Smash Fries.

### Mantener

- Colores principales naranja, rojo y tonos crema.
- Bordes redondeados.
- Tipografía limpia y fuerte en títulos.
- Estilo premium, juvenil y claro.
- Navbar, carrito y footer funcionando como están.

---

## 10. Revisar datos del footer relacionados con ubicación

En el footer se muestra contacto y dirección. Revisar que tenga buena ortografía y que coincida con la página `/ubicacion`.

### Recomendaciones

- Dirección: `Av. del Pacífico y Calle 10, Esmeraldas, Ecuador`
- Horario: `17:00 - 22:30`
- WhatsApp: usar el número configurado en el proyecto.
- Redes: Instagram, Facebook y TikTok.

No mostrar datos técnicos ni textos de desarrollo.

---

## 11. Validaciones técnicas

Antes de terminar, revisar:

- Que no se rompa la navegación.
- Que no se rompa el botón del carrito.
- Que no se afecte el menú ni la página de productos.
- Que no aparezcan errores en consola.
- Que los enlaces externos abran correctamente.
- Que el mapa cargue correctamente.
- Que el diseño sea responsive.

Si existen scripts disponibles, ejecutar:

```bash
npm run lint
npm run build
```

Si alguno no existe, indicarlo en el reporte final.

---

## 12. Reporte final que debe entregar Codex

Al terminar, entregar un resumen con:

1. Archivos modificados.
2. Cambios visuales realizados.
3. Correcciones de texto y ortografía.
4. Mejoras responsive aplicadas.
5. Pruebas ejecutadas.
6. Errores encontrados, si existieron.

---

## Resultado esperado

La página `/ubicacion` debe sentirse más profesional, clara y útil. El usuario debe entender rápidamente:

- Dónde está Smash Fries.
- A qué hora atiende.
- Cómo contactarse por WhatsApp.
- Cómo abrir la ubicación en Google Maps.
- Qué redes sociales puede visitar.

La página debe verse más interactiva, menos plana y más coherente con el estilo moderno del proyecto.
