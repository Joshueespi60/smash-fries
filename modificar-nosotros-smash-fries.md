# Instrucciones para mejorar la página “Nosotros” de Smash Fries

## Objetivo
Mejorar el apartado `/nosotros` para que se vea más interactivo, más visual, más amigable para el usuario y menos plano. La página actual tiene buena base, pero se siente muy estática y con mucho texto en bloques simples. La idea es mantener el estilo premium/juvenil de Smash Fries, pero agregar secciones visuales, cards con iconos, llamados a la acción y una narrativa más atractiva.

Este archivo debe ser leído por Codex en la raíz del proyecto. Codex debe analizar la estructura actual del proyecto y aplicar los cambios respetando los componentes, estilos, rutas y convenciones existentes.

---

## Reglas generales

1. No romper la navegación actual.
2. Mantener la ruta `/nosotros`.
3. Mantener el branding de Smash Fries.
4. Mantener diseño responsive para móvil, tablet y escritorio.
5. Usar la misma paleta visual del proyecto:
   - Naranja principal para acciones y detalles.
   - Rojo como acento secundario.
   - Fondos claros tipo crema/concreto.
   - Cards blancas o ligeramente cálidas.
6. No crear dependencias innecesarias si el proyecto ya tiene suficientes herramientas.
7. No usar información falsa. El texto debe sonar como una marca universitaria/demo, pero profesional.
8. Cuidar ortografía, tildes y redacción en español.
9. Verificar que no aparezca “demo universitaria” en textos visibles, salvo que ya sea una sección interna o claramente necesaria. La página debe verse presentable para exposición.
10. Mantener consistencia con las demás páginas: Inicio, Menú, Producto, Carrito y Ubicación.

---

## Problema actual

La página actual de “Nosotros” se ve limpia, pero poco llamativa. Tiene secciones con texto como:

- Historia de Smash Fries
- Técnica Smash Burger
- Diferenciales
- Marca y confianza

El problema es que las secciones parecen tarjetas informativas muy básicas. Falta interacción visual, jerarquía, microcopy más atractivo, elementos que guíen al usuario y llamados a la acción.

---

## Cambios principales que debe hacer Codex

### 1. Mejorar el encabezado de la página

Reemplazar el encabezado actual simple por un hero más llamativo para la página “Nosotros”.

Debe incluir:

- Título principal: `Nosotros`
- Subtítulo más emocional, por ejemplo:
  `Somos Smash Fries: hamburguesas aplastadas al momento, papas irresistibles y una experiencia digital pensada para pedir fácil.`
- Un pequeño badge o etiqueta visual, por ejemplo:
  `Hecho para amantes de las smash burgers`
- Un botón o CTA que lleve al menú:
  `Ver menú`
- Otro enlace secundario opcional:
  `Hacer pedido`

El hero debe verse más visual, con buena separación, fondo suave y algún detalle decorativo como degradado, burbujas, íconos o una mini-card flotante.

Ejemplo visual esperado:

- Fondo crema o degradado cálido.
- Título fuerte.
- Texto corto y claro.
- Botón naranja.
- Una card pequeña que diga algo como:
  `Carne aplastada al momento`  
  `Pan suave`  
  `Salsas propias`

---

### 2. Convertir la historia en una sección más narrativa

La sección “Historia de Smash Fries” debe dejar de ser solo un bloque de texto. Convertirla en una sección tipo storytelling.

Puede llamarse:

`Nuestra historia`

Texto recomendado:

`Smash Fries nace con una idea clara: combinar el sabor intenso de una smash burger con una experiencia rápida, moderna y fácil de usar. Queremos que cada visita se sienta cercana, antojable y directa, desde que el usuario explora el menú hasta que arma su pedido.`

Agregar una segunda frase breve:

`No buscamos complicar el proceso: buscamos que pedir algo rico sea simple, visual y rápido.`

Diseño sugerido:

- Card grande con ícono o emoji visual moderado.
- Puede tener una pequeña línea de tiempo con 3 pasos:
  1. `Elegimos ingredientes simples y frescos.`
  2. `Aplastamos la carne al momento para potenciar el sabor.`
  3. `Facilitamos el pedido desde una web clara y funcional.`

---

### 3. Mejorar la sección de técnica smash

La sección “Técnica Smash Burger” debe ser más didáctica e interactiva.

Nuevo título sugerido:

`¿Qué hace especial a una smash burger?`

Texto recomendado:

`La técnica smash consiste en presionar la carne sobre una plancha muy caliente. Esto crea una costra dorada y caramelizada por fuera, mientras conserva jugosidad por dentro. El resultado es una hamburguesa con más textura, más aroma y más sabor.`

Agregar una mini sección visual de 3 pasos:

- `1. Carne fresca sobre la plancha`
- `2. Presión al momento`
- `3. Costra crujiente y sabor intenso`

Cada paso debe ir en una card pequeña con icono, número o elemento visual.

La sección puede tener hover suave en las cards:

- Elevar card ligeramente.
- Cambiar borde a naranja suave.
- Sombra ligera.

---

### 4. Hacer los diferenciales más atractivos

Actualmente los diferenciales son cajas simples. Convertirlos en cards con iconos, título y descripción breve.

Diferenciales sugeridos:

#### Carne aplastada al momento
`Más textura, mejor sellado y sabor intenso en cada mordida.`

#### Ingredientes frescos
`Combinaciones simples, bien pensadas y con productos de calidad.`

#### Pan de calidad
`Suave, resistente y perfecto para sostener todo el sabor.`

#### Salsas propias
`Toques únicos que hacen que cada pedido tenga personalidad.`

#### Pedido fácil
`Una experiencia digital clara para explorar, personalizar y pedir sin complicaciones.`

#### Estilo Smash Fries
`Una marca juvenil, directa y visualmente atractiva.`

Diseño:

- Grid de 2 o 3 columnas en escritorio.
- 1 columna en móvil.
- Cards con iconos o emojis discretos.
- Efecto hover.
- Buen espaciado.

---

### 5. Agregar una sección de experiencia del usuario

Crear una nueva sección para explicar que Smash Fries no solo es comida, sino también una experiencia web pensada para el usuario.

Título sugerido:

`Una experiencia pensada para pedir fácil`

Texto recomendado:

`La web de Smash Fries está diseñada para que el usuario encuentre rápido lo que quiere: ver productos, revisar detalles, añadir al carrito y enviar su pedido de forma clara. Cada pantalla busca ser simple, visual y funcional.`

Agregar 3 puntos visuales:

- `Menú claro y visual`
- `Carrito fácil de entender`
- `Pedido directo por WhatsApp`

Esta sección puede usar una card con fondo degradado suave, borde cálido y CTA hacia `/menu`.

Botón:

`Explorar menú`

---

### 6. Mejorar “Marca y confianza”

La sección actual de “Marca y confianza” tiene buen contenido, pero puede verse mejor.

Nuevo título sugerido:

`Nuestra identidad`

Texto recomendado:

`Smash Fries combina una estética clara, juvenil y moderna con colores cálidos que transmiten energía, apetito y cercanía. El objetivo es que cada usuario sienta confianza desde el primer vistazo y pueda navegar sin esfuerzo.`

Agregar badges visuales:

- `Moderna`
- `Cercana`
- `Rápida`
- `Apetecible`
- `Fácil de usar`

Diseño:

- Card destacada con fondo suave.
- Badges con borde naranja claro o fondo crema.
- Puede tener un pequeño texto final:
  `Una marca pensada para verse bien, sentirse cercana y funcionar de verdad.`

---

### 7. Agregar sección final con llamado a la acción

Al final de la página, antes del footer, agregar un CTA llamativo.

Título sugerido:

`¿Listo para probar Smash Fries?`

Texto:

`Explora nuestro menú, elige tus favoritos y arma tu pedido en pocos pasos.`

Botones:

- Principal: `Ver menú` → `/menu`
- Secundario: `Ir al carrito` → `/carrito`

Diseño:

- Card grande centrada.
- Fondo naranja o degradado cálido.
- Texto claro.
- Botones visibles.
- Debe verse bien en móvil.

---

## Interacciones visuales recomendadas

Aplicar interacciones suaves, sin exagerar:

1. Hover en cards:
   - `transform: translateY(-3px)`
   - sombra ligera
   - borde naranja suave

2. Transiciones:
   - `transition: all 0.2s ease` o equivalente

3. Botones:
   - Hover con naranja más intenso
   - ligera elevación

4. Badges:
   - Diseño tipo píldora
   - Fondo crema/naranja claro

5. Separadores visuales:
   - Usar pequeños encabezados, iconos o líneas decorativas.

Importante: no abusar de animaciones pesadas. La página debe seguir siendo rápida y limpia.

---

## Estructura sugerida para `/nosotros`

La página debería quedar aproximadamente así:

1. Hero de Nosotros
2. Nuestra historia
3. ¿Qué hace especial a una smash burger?
4. Diferenciales de Smash Fries
5. Una experiencia pensada para pedir fácil
6. Nuestra identidad
7. CTA final
8. Footer existente

---

## Textos finales sugeridos para usar

### Hero

**Nosotros**

`Somos Smash Fries: hamburguesas aplastadas al momento, papas irresistibles y una experiencia digital pensada para pedir fácil.`

Badge:

`Hecho para amantes de las smash burgers`

Botones:

`Ver menú`  
`Hacer pedido`

---

### Nuestra historia

`Smash Fries nace con una idea clara: combinar el sabor intenso de una smash burger con una experiencia rápida, moderna y fácil de usar. Queremos que cada visita se sienta cercana, antojable y directa, desde que el usuario explora el menú hasta que arma su pedido.`

`No buscamos complicar el proceso: buscamos que pedir algo rico sea simple, visual y rápido.`

---

### Técnica smash

`La técnica smash consiste en presionar la carne sobre una plancha muy caliente. Esto crea una costra dorada y caramelizada por fuera, mientras conserva jugosidad por dentro. El resultado es una hamburguesa con más textura, más aroma y más sabor.`

Pasos:

1. `Carne fresca sobre la plancha`
2. `Presión al momento`
3. `Costra crujiente y sabor intenso`

---

### Diferenciales

- `Carne aplastada al momento`: `Más textura, mejor sellado y sabor intenso en cada mordida.`
- `Ingredientes frescos`: `Combinaciones simples, bien pensadas y con productos de calidad.`
- `Pan de calidad`: `Suave, resistente y perfecto para sostener todo el sabor.`
- `Salsas propias`: `Toques únicos que hacen que cada pedido tenga personalidad.`
- `Pedido fácil`: `Una experiencia digital clara para explorar, personalizar y pedir sin complicaciones.`
- `Estilo Smash Fries`: `Una marca juvenil, directa y visualmente atractiva.`

---

### Experiencia digital

`La web de Smash Fries está diseñada para que el usuario encuentre rápido lo que quiere: ver productos, revisar detalles, añadir al carrito y enviar su pedido de forma clara. Cada pantalla busca ser simple, visual y funcional.`

Puntos:

- `Menú claro y visual`
- `Carrito fácil de entender`
- `Pedido directo por WhatsApp`

---

### Nuestra identidad

`Smash Fries combina una estética clara, juvenil y moderna con colores cálidos que transmiten energía, apetito y cercanía. El objetivo es que cada usuario sienta confianza desde el primer vistazo y pueda navegar sin esfuerzo.`

Badges:

- `Moderna`
- `Cercana`
- `Rápida`
- `Apetecible`
- `Fácil de usar`

Frase final:

`Una marca pensada para verse bien, sentirse cercana y funcionar de verdad.`

---

### CTA final

**¿Listo para probar Smash Fries?**

`Explora nuestro menú, elige tus favoritos y arma tu pedido en pocos pasos.`

Botones:

- `Ver menú`
- `Ir al carrito`

---

## Detalles técnicos para Codex

Codex debe:

1. Buscar el archivo o componente que renderiza la página `/nosotros`.
2. Revisar si el proyecto usa Next.js App Router o Pages Router.
3. Aplicar los cambios en el archivo correcto, por ejemplo:
   - `app/nosotros/page.tsx`
   - `src/app/nosotros/page.tsx`
   - `pages/nosotros.tsx`
   - o el archivo equivalente que exista en el proyecto.
4. Reutilizar componentes existentes si ya existen:
   - `Button`
   - `Card`
   - `Container`
   - componentes de layout
   - footer/header existentes
5. Si no existen componentes reutilizables, hacerlo directamente en la página manteniendo el estilo actual.
6. Usar `Link` de Next.js para navegar a `/menu` y `/carrito`.
7. No cambiar el header global ni el footer global, salvo que sea estrictamente necesario.
8. No modificar rutas que no sean necesarias.
9. Verificar que el contador del carrito y el botón “Pedir ahora” sigan funcionando.
10. Verificar que el diseño no quede tapado por el header sticky.
11. Verificar mobile responsive.
12. Ejecutar lint/build si el proyecto lo permite.

---

## Recomendaciones de clases/estilos

Si el proyecto usa Tailwind, usar clases similares a estas, adaptándolas al diseño actual:

- Contenedor: `mx-auto max-w-6xl px-4 py-10`
- Hero: `rounded-3xl border bg-gradient-to-br from-orange-50 to-red-50 p-8 shadow-sm`
- Cards: `rounded-2xl border bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md`
- Grid: `grid gap-4 md:grid-cols-2 lg:grid-cols-3`
- Badges: `rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700`
- Botón principal: usar el estilo naranja actual del proyecto

Si el proyecto no usa Tailwind, crear o ajustar CSS respetando la estructura existente.

---

## Criterios de aceptación

La tarea se considera completa si:

1. La página `/nosotros` se ve más moderna, interactiva y amigable.
2. Hay menos sensación de texto plano.
3. Las secciones tienen mejor jerarquía visual.
4. Existen cards con iconos, badges o elementos visuales.
5. Hay al menos un CTA hacia el menú.
6. Hay un CTA final antes del footer.
7. El diseño se adapta correctamente a móvil.
8. No se rompe la navegación.
9. No se rompe el carrito.
10. No se rompe el footer.
11. No hay errores de TypeScript, ESLint o build.
12. Todo el texto está en español correcto, con tildes y buena redacción.

---

## Pruebas que debe hacer Codex

Después de modificar, Codex debe revisar:

1. Abrir `/nosotros` en escritorio.
2. Revisar que el hero se vea bien.
3. Revisar que las cards tengan buen espaciado.
4. Revisar que los botones lleven a las rutas correctas.
5. Revisar en móvil o responsive.
6. Revisar que el header no tape contenido.
7. Revisar que el footer siga correcto.
8. Ejecutar:

```bash
npm run lint
```

Si existe build configurado:

```bash
npm run build
```

Si alguno falla, corregir los errores relacionados con esta modificación.

---

## Mensaje final esperado de Codex

Cuando termine, Codex debe entregar un resumen con:

1. Archivos modificados.
2. Secciones agregadas o rediseñadas.
3. Pruebas realizadas.
4. Errores encontrados y cómo se corrigieron.
5. Confirmación de que `/nosotros` queda responsive y funcional.
