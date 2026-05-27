# 🌸 Flores para Abi

Un regalo digital: lirios animados sobre un cielo nocturno estrellado, con la letra de *Saturno* de Pablo Alborán sincronizada como karaoke.

---

## Estructura del proyecto

```
flores-para-abi/
├── index.html      ← página principal
├── style.css       ← estilos y animaciones
├── script.js       ← lógica (estrellas, lirios, karaoke, audio)
├── saturno.mp3     ← 🔴 AGREGAR MANUALMENTE (ver abajo)
└── README.md
```

---

## Pasos para publicar en GitHub Pages

1. **Creá un repositorio** en GitHub (público).
2. **Subí todos los archivos**, incluyendo `saturno.mp3`.
3. Andá a **Settings → Pages**.
4. En *Source*, elegí `main` / `root` y guardá.
5. En unos segundos tenés tu link: `https://tu-usuario.github.io/nombre-del-repo/`

---

## Agregar la canción

- Conseguí el archivo `saturno.mp3` (Pablo Alborán).
- Renombralo exactamente `saturno.mp3`.
- Ponelo en la misma carpeta que `index.html`.
- Subilo al repositorio junto con los demás archivos.

> Si la canción tiene otro nombre de archivo, abrí `index.html` y buscá la línea:
> ```html
> <source src="saturno.mp3" type="audio/mpeg" />
> ```
> Cambiá `saturno.mp3` por el nombre real de tu archivo.

---

## Personalización

### Cambiar el nombre

Abrí `index.html` y buscá (Ctrl+F) el texto `Abi`.  
Aparece en dos lugares: el subtítulo y el nombre grande. Cambialo por el nombre que quieras.

### Ajustar la letra (tiempos del karaoke)

Los tiempos de cada línea están en `index.html`, en los atributos `data-time` de cada `<div class="lyric-line">`.  
El valor es en **segundos** desde el inicio de la canción.  
Reproducí la canción y anotá en qué segundo empieza cada línea, luego actualizá los valores.

### Cambiar número de lirios

En `script.js`, cambiá la línea:
```js
const LILY_COUNT = 7; // podés poner entre 1 y 7
```

### Cambiar velocidad de crecimiento

En `script.js`:
```js
const GROW_BASE_DUR = 3.2; // segundos — más alto = más lento
```

---

## Compatibilidad

- Funciona en Chrome, Firefox, Safari, Edge (desktop y móvil).
- No requiere instalaciones ni dependencias externas.
- El audio se reproduce automáticamente al hacer click en el botón de bienvenida (gesto del usuario requerido por el navegador).

---

*Hecho con HTML, CSS y JS puro. Sin frameworks, sin videos, sin dependencias.*
