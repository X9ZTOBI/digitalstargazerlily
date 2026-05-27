# 🌸 Flores para Abi

Regalo digital: lirios Stargazer animados sobre un cielo nocturno estrellado, con karaoke sincronizado y estrellas fugaces.

---

## Estructura

```
flores-para-abi/
├── index.html
├── style.css
├── script.js
├── song.mp3        ← agregar manualmente
└── README.md
```

---

## Publicar en GitHub Pages

1. Crear repositorio público en GitHub
2. Subir todos los archivos incluyendo `song.mp3`
3. Settings → Pages → Source: `main / root`
4. Link disponible en: `https://tu-usuario.github.io/nombre-del-repo/`

---

## Agregar la canción

Renombrar el archivo de audio a `song.mp3` y subirlo junto con los demás archivos. Cualquier `.mp3` con ese nombre funciona.

---

## Personalización

### Nombre en la pantalla de bienvenida
En `index.html`, buscar `Abi` — aparece en dos lugares: el subtítulo y el nombre grande.

### Letra y tiempos del karaoke
En `index.html`, cada línea tiene un `data-time` en segundos desde el inicio de la canción:
```html
<div class="lyric-line" data-time="18">Texto de la línea</div>
```
Reproducir la canción, anotar en qué segundo empieza cada verso, y actualizar los valores.

### Número de lirios
En `script.js`, línea 1:
```js
const LILY_COUNT = 9; // entre 1 y 11
```

### Velocidad de crecimiento
En `script.js`, línea 2:
```js
const GROW_BASE_DUR = 3.4; // segundos — más alto = más lento
```

### Velocidad y suavidad del karaoke
En `style.css`, regla `.lyric-line`:
```css
transition: opacity 0.8s ease, transform 0.8s ease;
```
Ajustar `0.8s` a gusto.

### Estrellas fugaces
En `script.js`, dentro de `shootingStar()`:
- Brillo: `0.55` en `rgba(255,255,255,0.55)`
- Longitud: `80 + Math.random() * 120`
- Frecuencia: los valores en `setTimeout` (en milisegundos)

---

## Compatibilidad

Funciona en Chrome, Firefox, Safari y Edge, desktop y móvil. Sin frameworks ni dependencias externas.
