# Instrucciones para Codex: aplicar paleta clara “Fuego Urbano” en Smash Fries

## Objetivo

Corregir la paleta visual del sitio web **Smash Fries**.

Ya se aplicó la paleta **“Fuego Urbano”**, pero quedó en modo oscuro. Eso **no** es lo que se quiere.

El sitio debe usar la paleta de la imagen adjunta en versión clara:

- Fondo principal claro, tipo concreto/beige suave.
- Nada de fondo negro como base del sitio.
- El color negro `#111111` solo debe usarse para texto, iconos o pequeños contrastes.
- El sitio completo debe dejar de verse oscuro.
- Inicio, Menu, Nosotros, Ubicacion, carrito/modal y footer deben quedar en modo claro.

---

## Referencia visual

Usar como referencia la imagen adjunta en el chat de Codex: **Paleta 2 · Fuego Urbano**, versión clara.

La dirección visual debe ser:

- Fondo claro tipo concreto/beige.
- Cards blancas o beige muy claro.
- Texto principal oscuro.
- Botones y acentos en naranja/rojo.
- Bordes suaves.
- Sensación moderna, energética y limpia.

---

## Tokens de color recomendados

### Base clara

```css
--background: #F3EEE7;
--foreground: #1F1F1F;
--card: #FFFFFF;
--card-foreground: #1F1F1F;
--popover: #FFFFFF;
--popover-foreground: #1F1F1F;
--muted: #F1E9DF;
--muted-foreground: #666666;
--border: #D8CCC0;
--input: #D8CCC0;
--ring: #FF6A00;
```

### Paleta principal

```css
--asfalto: #111111;
--naranja-grill: #FF6A00;
--rojo-picante: #D62828;
--blanco-humo: #F5F5F5;
--gris-metal: #3A3A3A;
```

### Uso esperado

- `#F3EEE7` o `#F5EFE6`: fondo del body/main.
- `#FFFFFF` o `#FAF7F2`: cards y superficies.
- `#F1E9DF`: bloques secundarios o fondos suaves.
- `#1F1F1F`: títulos y texto principal.
- `#666666`: texto secundario.
- `#FF6A00`: botón principal, links activos, detalles.
- `#D62828`: badges, alertas y acentos fuertes.
- `#111111`: solo texto, iconos o contraste puntual. **No usarlo como fondo principal.**

---

## Tareas obligatorias

1. Revisar y modificar los archivos donde se definan estilos globales y tokens:
   - `globals.css`
   - `tailwind.config.*`
   - `app/layout.*`
   - componentes compartidos
   - páginas/rutas principales

2. Eliminar o reemplazar cualquier fondo negro/oscuro hardcodeado que afecte el layout principal, hero, secciones o cards.

3. Buscar globalmente estos patrones y corregirlos si están causando fondo oscuro:

```txt
bg-black
bg-neutral-950
bg-zinc-950
bg-slate-950
bg-background
from-background
to-background
from-black
to-black
dark:
#000
#050505
#0B0B0C
#0F0F10
#111111
```

> Nota: `#111111` puede quedarse, pero solo si se usa para texto, iconos o contrastes pequeños. No debe ser fondo de `body`, `main`, `layout`, `hero`, secciones ni cards.

4. Cambiar los tokens globales para que estos elementos sean claros:
   - `background`
   - `card`
   - `muted`
   - `popover`
   - `border`
   - `input`

5. Si existe una clase `dark` en `html`, `body`, `layout`, `ThemeProvider` o configuración de tema, quitarla o cambiarla a modo claro.

6. La barra superior debe quedar clara o blanca translúcida, no negra.

7. El hero debe quedar con fondo claro/beige, acentos naranja/rojo y texto oscuro.

8. Las cards de productos deben quedar claras, con borde suave, fondo blanco/beige y texto oscuro.

9. Las páginas que deben verificarse visualmente son:
   - Inicio
   - Menu
   - Nosotros
   - Ubicacion
   - carrito/modal si existe
   - footer

10. Ejecutar validaciones:

```bash
npm run lint
npm run build
```

Si `npm run lint` no existe, revisar el `package.json` y ejecutar el comando equivalente disponible.

---

## Resultado esperado

Después del cambio, el sitio debe verse como una versión clara de **Fuego Urbano**:

- Fondo principal beige/concreto claro.
- UI limpia y moderna.
- Botones naranja/rojo.
- Cards claras.
- Texto oscuro.
- Sin fondo negro dominante.

---

## Checklist de aceptación

Antes de terminar, confirmar lo siguiente:

- [ ] El body/main ya no tiene fondo negro.
- [ ] El hero ya no tiene fondo negro dominante.
- [ ] Las cards de productos son claras.
- [ ] Navbar no es negra.
- [ ] Footer no es negro dominante.
- [ ] No queda `dark:` forzando modo oscuro.
- [ ] `#111111` no se usa como fondo principal.
- [ ] Se revisaron Inicio, Menu, Nosotros y Ubicacion.
- [ ] Se ejecutó `npm run build` correctamente.
- [ ] Se reportaron los archivos modificados.

---

## Mensaje final que debe entregar Codex

Al terminar, responder con:

1. Archivos modificados.
2. Resumen de cambios visuales.
3. Confirmación de que el sitio quedó en modo claro.
4. Resultado de `npm run lint` y `npm run build`.
5. Confirmación de que no queda ningún fondo negro principal.
