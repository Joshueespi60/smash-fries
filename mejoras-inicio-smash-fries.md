# Mejoras de la página de inicio (Home) — Smash Fries

## Instrucción para Codex
Lee este archivo completo, analiza la implementación actual de la página de inicio de **Smash Fries** y **ejecuta los cambios directamente en el proyecto**.

Tu objetivo es **mejorar visualmente la Home**, hacerla más atractiva, más confiable para el usuario, más clara en su navegación y más sólida en UX/UI, **sin romper funcionalidades existentes** como navegación, carrito, menú, enlaces y flujo de pedido.

---

# 1) Objetivo general

La página de inicio actual funciona, pero visualmente se siente **demasiado simple y muy basada en bloques de texto**. Se debe transformar en una Home más:

- atractiva,
- moderna,
- confiable,
- visual,
- interactiva,
- y mejor orientada a conversión.

La idea es que la persona que entra al sitio sienta rápidamente:

- que el negocio se ve serio,
- que el menú se ve apetitoso,
- que hay promociones llamativas,
- que otras personas confían en la marca,
- y que pedir es fácil.

---

# 2) Problemas detectados actualmente

## 2.1 Hero / inicio
- El hero principal está limpio, pero se siente **vacío** y con poco impacto visual.
- Falta un recurso gráfico que lo haga más atractivo.
- El botón **“Ver menú”** a veces no responde bien en toda su superficie clickeable.

## 2.2 Productos destacados
- Se ve aceptable, pero puede ganar más vida con mejores microinteracciones.
- El bloque general no conecta visualmente con otras secciones.

## 2.3 Nuestro compromiso
- Actualmente son solo tarjetas con texto.
- Se ven demasiado simples.
- Falta iconografía o elementos visuales que comuniquen mejor cada valor.

## 2.4 Promociones activas
- Actualmente son solo bloques con texto.
- No llaman suficientemente la atención.
- Se pueden convertir en tarjetas más dinámicas con hover, resaltado o mini banners.

## 2.5 Testimonios
- Son demasiado básicos.
- Les falta mayor sensación de “reseña real”.
- Falta identidad visual como estrellas, avatar, comillas decorativas, badge de validación o una mejor jerarquía visual.

## 2.6 CTA final
- Funciona, pero puede verse más fuerte y más convincente.
- Le falta más personalidad visual.

---

# 3) Lineamientos generales de rediseño

Mantener la identidad visual actual de Smash Fries:

- estilo limpio,
- moderno,
- tonos claros,
- acentos naranjas,
- sensación cálida y apetitosa.

Pero mejorar:

- composición,
- uso de espacios,
- jerarquía visual,
- uso de iconos,
- hover states,
- sombras sutiles,
- bordes,
- fondos suaves,
- y pequeños elementos gráficos decorativos.

**No convertir la Home en algo recargado.**
Debe seguir viéndose elegante, pero ya no tan plana.

---

# 4) Tareas específicas a implementar

## 4.1 Mejorar el Hero principal

### Objetivo
Hacer que el primer pantallazo de la Home sea más atractivo y transmita mejor el valor del negocio.

### Cambios a implementar
1. Mantener el texto principal actual o una versión mejorada de copy, pero mejorar la composición del bloque.
2. Añadir un recurso visual en el hero. Puede ser una de estas opciones, según lo que mejor encaje con el proyecto:
   - una imagen destacada de hamburguesa,
   - un collage visual sutil,
   - una tarjeta flotante con promoción,
   - pequeños “feature chips” o badges como:
     - `Carne smash al momento`
     - `Pedido rápido`
     - `Promos activas`
     - `Disponible hoy`
3. Incluir detalles visuales que hagan el hero menos vacío, por ejemplo:
   - badge superior pequeño,
   - tarjetas flotantes,
   - mini indicadores,
   - elementos decorativos suaves,
   - una pequeña promo destacada.
4. Mejorar visualmente los CTA del hero.

### Importante — botón “Ver menú”
Corregir el comportamiento del botón para que:
- **toda el área del botón sea clickeable**, no solo una parte del texto,
- tenga buen hover,
- tenga cursor correcto,
- tenga focus visible,
- y navegue correctamente al menú o a la sección correspondiente.

### Revisión técnica esperada
Verificar si el problema actual se debe a:
- estructura incorrecta del `<Link>`,
- botón anidado incorrectamente,
- padding sin ocupar el área real,
- z-index,
- overlay invisible,
- contenedor interceptando el click,
- o estilos CSS que impiden el click completo.

Solucionar eso de forma definitiva.

---

## 4.2 Mejorar “Productos destacados”

### Objetivo
Que esta sección luzca más viva, atractiva y mejor conectada con la propuesta del sitio.

### Cambios a implementar
1. Mantener las cards de producto, pero mejorar detalles visuales como:
   - hover suave,
   - ligera elevación al pasar el mouse,
   - sombra mejorada,
   - transición elegante,
   - feedback visual del botón “Agregar”.
2. Agregar una pequeña línea o subtítulo sobre la sección, por ejemplo algo como:
   - “Los favoritos del momento”
   - “Los más pedidos”
   - “Recomendados para empezar”
3. Si es viable, agregar pequeños badges visuales a ciertos productos, por ejemplo:
   - `Popular`
   - `Top venta`
   - `Nuevo`
4. Confirmar que las imágenes estén bien proporcionadas, consistentes y no se corten mal.

---

## 4.3 Mejorar “Nuestro compromiso”

### Objetivo
Evitar que sean solo tarjetas de texto. Hacer que cada valor tenga más presencia visual.

### Cambios a implementar
1. Añadir un **icono** a cada card, acorde al concepto:
   - Calidad → icono representativo,
   - Frescura → icono representativo,
   - Rapidez → icono representativo.
2. Mejorar la jerarquía visual:
   - icono arriba,
   - título claro,
   - breve descripción,
   - mejor espaciado.
3. Aplicar un diseño más atractivo con:
   - fondo sutil,
   - borde delicado,
   - hover suave,
   - mejor equilibrio visual.
4. Hacer que esta sección transmita más confianza y profesionalismo.

### Nota
Usar iconos ligeros y consistentes con el sistema visual del proyecto (por ejemplo la librería ya usada en el proyecto si existe).

---

## 4.4 Mejorar “Promociones activas”

### Objetivo
Convertir esta sección en un punto de atracción real.

### Cambios a implementar
1. Rediseñar las promociones para que no sean solo cajas con texto.
2. Añadir uno o varios de estos recursos:
   - badges,
   - etiquetas destacadas,
   - mini iconos,
   - pequeñas ilustraciones,
   - indicadores como `Hoy`, `Disponible`, `Especial`, `Ahorra`, etc.
3. Añadir **hover llamativo pero elegante**, para que al pasar el mouse la tarjeta se sienta interactiva.
4. Si encaja bien, se puede usar alguna de estas ideas:
   - tarjetas tipo flyer,
   - mini banners promocionales,
   - promoción destacada con fondo diferente,
   - o un carrusel/slider suave **solo si no complica demasiado la UX**.
5. Mantener buena legibilidad y no saturar.

### Preferencia UX
Si se usan hover effects, que sean:
- suaves,
- rápidos,
- consistentes,
- y sin movimientos bruscos.

---

## 4.5 Mejorar “Testimonios” / reseñas

### Objetivo
Hacer que los testimonios realmente generen confianza.

### Cambios a implementar
1. Rediseñar cada testimonio con apariencia más cercana a una reseña real.
2. Incluir elementos como:
   - estrellas (por ejemplo 5/5 visual),
   - avatar o círculo con inicial,
   - nombre más visible,
   - cita con comillas decorativas,
   - mejor jerarquía del contenido.
3. Mejorar visualmente la estructura interna:
   - encabezado de reseña,
   - cuerpo del comentario,
   - autor y calificación.
4. Hacer que la sección tenga más personalidad.
5. Se puede añadir una pequeña frase introductoria arriba, por ejemplo:
   - “Lo que opinan nuestros clientes”
   - “Experiencias reales”
   - “Reseñas que hablan por sí solas”

### Importante
No sobrecargar. La meta es que se vean más creíbles y pulidas.

---

## 4.6 Mejorar CTA final (“Listo para ordenar tu smash?”)

### Objetivo
Cerrar la Home con una llamada a la acción más fuerte.

### Cambios a implementar
1. Hacer que el bloque final sea más llamativo visualmente.
2. Añadir apoyo visual sutil, por ejemplo:
   - un icono,
   - una mini ilustración,
   - un fondo decorativo tenue,
   - chips de beneficios,
   - una frase corta adicional.
3. Mejorar la composición del bloque para que destaque claramente al final del recorrido.
4. Mantener dos acciones claras:
   - Ir a WhatsApp
   - Explorar menú
5. Confirmar que ambos botones tengan:
   - área clickeable completa,
   - hover,
   - focus,
   - y navegación correcta.

---

# 5) Requisitos de UX/UI

## 5.1 Interactividad
Añadir microinteracciones elegantes en:
- botones,
- cards,
- promociones,
- testimonios,
- y bloques destacados.

## 5.2 Consistencia visual
Mantener consistencia en:
- radios de borde,
- sombras,
- espaciados,
- colores,
- tipografía,
- pesos visuales.

## 5.3 Accesibilidad
Verificar y ajustar:
- contraste suficiente,
- focus visible en botones y links,
- áreas clickeables cómodas,
- semántica correcta,
- uso correcto de links y botones.

## 5.4 Responsive
Comprobar que la nueva Home quede bien en:
- desktop,
- tablet,
- móvil.

Especialmente revisar:
- hero,
- cards de promociones,
- testimonios,
- CTA final,
- alineación de botones,
- espaciado vertical.

---

# 6) Requisitos técnicos

## 6.1 No romper funcionalidades existentes
Conservar funcionando correctamente:
- navegación del header,
- carrito,
- agregar productos,
- links internos,
- botón de WhatsApp,
- secciones actuales.

## 6.2 Revisar componentes reutilizables
Si el proyecto ya tiene componentes reutilizables, aprovecharlos.
Si conviene, refactorizar la Home en bloques más claros, por ejemplo:
- `HeroSection`
- `FeaturedProductsSection`
- `CommitmentSection`
- `PromotionsSection`
- `TestimonialsSection`
- `FinalCTASection`

## 6.3 Mantener buen código
Aplicar cambios con buenas prácticas:
- código limpio,
- componentes claros,
- estilos organizados,
- props bien definidos,
- sin lógica duplicada innecesaria.

---

# 7) Criterios de aceptación

Se considerará completado cuando:

1. La Home se vea claramente **más atractiva y menos simple**.
2. El hero tenga más impacto visual.
3. El botón **“Ver menú”** funcione bien en toda su superficie clickeable.
4. “Nuestro compromiso” tenga elementos visuales, no solo texto.
5. “Promociones activas” se vea más llamativa y más promocional.
6. “Testimonios” se vea más confiable, vibrante y creíble.
7. El CTA final se vea más fuerte y mejor presentado.
8. Toda la página mantenga coherencia visual.
9. Todo siga funcionando correctamente en responsive.
10. No se rompa ninguna funcionalidad existente.

---

# 8) Entrega esperada de Codex

Codex debe hacer lo siguiente:

1. Analizar la implementación actual de la Home.
2. Aplicar las mejoras visuales y funcionales descritas.
3. Corregir el problema del botón “Ver menú”.
4. Mejorar todas las secciones indicadas.
5. Verificar responsive y accesibilidad básica.
6. Entregar un resumen final con:
   - qué archivos modificó,
   - qué mejoras aplicó,
   - qué bug corrigió,
   - y cualquier nota importante.

---

# 9) Prioridad de implementación

Orden sugerido:

1. Corregir botón “Ver menú”.
2. Mejorar hero.
3. Mejorar promociones.
4. Mejorar testimonios.
5. Mejorar “Nuestro compromiso”.
6. Mejorar CTA final.
7. Ajustes finos de responsive, hover y consistencia.

---

# 10) Nota final

No hacer cambios al azar. Antes de implementar, **analiza la estructura actual de la página de inicio y mejora lo necesario con criterio de diseño, UX y consistencia visual**.

La Home debe quedar con una apariencia más profesional, más atractiva y más convincente para el usuario final.
