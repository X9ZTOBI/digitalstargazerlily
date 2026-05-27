/* =============================================
   FLORES PARA ABI — script.js
   ============================================= */

// -----------------------------------------------
// CONFIGURACIÓN
// LILY_COUNT: cuántos lirios mostrar (máx 11)
// GROW_BASE_DUR: duración base del crecimiento en segundos
// -----------------------------------------------
const LILY_COUNT    = 9;
const GROW_BASE_DUR = 3.4;

// -----------------------------------------------
// DEFINICIÓN DEL RAMO
// left: posición horizontal (% dentro de #bouquet)
// height: altura del tallo en px
// delay: segundos antes de crecer
// scale: tamaño de la flor
// lean: inclinación en grados
// swayDelay: offset del balanceo (segundos)
// -----------------------------------------------
const LILY_DEFS = [
  { left: 50,  height: 370, delay: 0.0, scale: 1.00, lean:   0, swayDelay: 0.0  },
  { left: 38,  height: 325, delay: 0.4, scale: 0.92, lean: -10, swayDelay: 0.3  },
  { left: 62,  height: 325, delay: 0.5, scale: 0.92, lean:  10, swayDelay: 0.5  },
  { left: 27,  height: 278, delay: 0.9, scale: 0.83, lean: -21, swayDelay: 0.8  },
  { left: 73,  height: 278, delay: 1.0, scale: 0.83, lean:  21, swayDelay: 1.1  },
  { left: 17,  height: 230, delay: 1.5, scale: 0.75, lean: -33, swayDelay: 1.4  },
  { left: 83,  height: 230, delay: 1.6, scale: 0.75, lean:  33, swayDelay: 0.7  },
  { left:  8,  height: 185, delay: 2.0, scale: 0.67, lean: -44, swayDelay: 1.9  },
  { left: 92,  height: 185, delay: 2.1, scale: 0.67, lean:  44, swayDelay: 0.2  },
  { left: 44,  height: 290, delay: 0.7, scale: 0.80, lean:  -5, swayDelay: 2.1  },
  { left: 56,  height: 290, delay: 0.8, scale: 0.80, lean:   5, swayDelay: 1.6  },
];

// =============================================
// ESTRELLAS
// =============================================
function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor((W * H) / 1600);
    for (let i = 0; i < count; i++) {
      stars.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 1.5 + 0.2,
        alpha: Math.random() * 0.7 + 0.15,
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      const a = s.alpha * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
}

// =============================================
// SVG DE UN PÉTALO STARGAZER
// Forma realista: base ancha, se estrecha hacia
// la punta, bordes ondulados, reflexed (curvado)
// =============================================
function petalPath(cx, cy, len, wid) {
  // Pétalo apuntando hacia ARRIBA desde (cx, cy)
  // Dibujado como path bezier con bordes curvados
  const hw = wid / 2;
  const tip = cy - len;
  const c1y = cy - len * 0.35;
  const c2y = cy - len * 0.72;
  // lado izquierdo
  const lx1 = cx - hw * 1.1, ly1 = cy - len * 0.15;
  const lx2 = cx - hw * 0.9, ly2 = c2y;
  // lado derecho
  const rx1 = cx + hw * 1.1, ry1 = cy - len * 0.15;
  const rx2 = cx + hw * 0.9, ry2 = c2y;
  // muesca central en la punta (característica del Stargazer)
  const tipL = cx - wid * 0.06;
  const tipR = cx + wid * 0.06;
  const tipDip = tip + len * 0.04;

  return `
    M ${cx} ${cy}
    C ${lx1} ${ly1}, ${lx2} ${ly2}, ${tipL} ${tip}
    Q ${cx} ${tipDip}, ${tipR} ${tip}
    C ${rx2} ${ry2}, ${rx1} ${ry1}, ${cx} ${cy}
    Z
  `;
}

// =============================================
// STARGAZER SVG COMPLETO
// =============================================
function buildStargazerSVG(totalHeight, scale) {
  const sw = 130 * scale;
  const sh = totalHeight;
  const cx = sw / 2;

  // La cabeza de la flor: centro geométrico visible
  const headY = sh * 0.13;
  const cr    = 5.5 * scale;   // radio del estigma central

  // Tallo: va desde bottom center hasta justo debajo del headY
  const stemTopY = headY + cr + 1;
  const stemBotX = cx + 3 * scale;
  const stemMidY = sh * 0.52;

  // Tamaños de pétalos
  const pLen = 46 * scale;   // longitud del pétalo
  const pWid = 22 * scale;   // ancho del pétalo

  // Delays
  const growDur    = GROW_BASE_DUR;
  const petalStart = growDur - 0.8;  // pétalos empiezan a abrirse al final del crecimiento
  const stStart    = petalStart + 1.1;

  // Colores Stargazer reales
  const C = {
    stemStroke:  '#3a5c2a',
    leaf:        '#4a7a35',
    petalBase:   '#d42050',   // rojo-magenta fuerte
    petalMid:    '#e8527a',   // rosa medio
    petalEdge:   '#fce8ee',   // borde casi blanco
    petalStripe: '#f0a0b8',   // franja central clara
    spot:        '#6a0a1a',   // motas oscuras
    stamen:      '#d4a820',   // estambres dorado-verdoso
    stigmaOut:   '#8b1a30',
    stigmaIn:    '#1a0508',
    antherTip:   '#b8341a',   // anteras marrón-rojizo
  };

  // Los 6 pétalos del Stargazer
  // El Stargazer tiene 3 pétalos externos alternando con 3 internos
  // Ángulos de rotación desde el centro
  const petalAngles = [0, 60, 120, 180, 240, 300];

  let defs = `<defs>`;

  // Gradiente para cada pétalo
  petalAngles.forEach((_, i) => {
    defs += `
    <linearGradient id="pg${i}" x1="0.5" y1="1" x2="0.5" y2="0">
      <stop offset="0%"   stop-color="${C.petalBase}"/>
      <stop offset="35%"  stop-color="${C.petalMid}"/>
      <stop offset="78%"  stop-color="${C.petalMid}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${C.petalEdge}"/>
    </linearGradient>`;
    // Franja central más clara (la vena blanca del Stargazer)
    defs += `
    <linearGradient id="stripe${i}" x1="0.5" y1="1" x2="0.5" y2="0">
      <stop offset="0%"   stop-color="${C.petalStripe}" stop-opacity="0.7"/>
      <stop offset="60%"  stop-color="${C.petalStripe}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="white" stop-opacity="0.5"/>
    </linearGradient>`;
  });

  defs += `</defs>`;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 ${sw} ${sh}"
    width="${sw}" height="${sh}"
    overflow="visible">
    ${defs}`;

  // ── TALLO ──
  svg += `
  <path fill="none"
    stroke="${C.stemStroke}" stroke-width="${2.8 * scale}" stroke-linecap="round"
    d="M ${cx} ${sh} C ${stemBotX} ${stemMidY}, ${cx - 2*scale} ${sh*0.33}, ${cx} ${stemTopY}"
  />`;

  // ── HOJAS (2 pares) ──
  const leaves = [
    { bx: cx - 6*scale, by: sh*0.6,  side: -1, yscale: 1.0 },
    { bx: cx + 5*scale, by: sh*0.45, side:  1, yscale: 0.9 },
    { bx: cx - 4*scale, by: sh*0.72, side: -1, yscale: 0.7 },
  ];
  leaves.forEach(l => {
    const lw = 24 * scale * l.yscale;
    const lh = 48 * scale * l.yscale;
    svg += `
    <path fill="${C.leaf}" opacity="0.88"
      d="M ${l.bx} ${l.by}
         C ${l.bx + l.side*lw*0.9} ${l.by - lh*0.3},
           ${l.bx + l.side*lw*0.7} ${l.by - lh*0.75},
           ${l.bx + l.side*lw*0.2} ${l.by - lh}
         C ${l.bx + l.side*lw*0.1} ${l.by - lh*0.7},
           ${l.bx}                 ${l.by - lh*0.4},
           ${l.bx} ${l.by}Z"
    />`;
  });

  // ── PÉTALOS ──
  petalAngles.forEach((angle, i) => {
    const delay      = (petalStart + i * 0.09).toFixed(2);
    const isOuter    = i % 2 === 0;
    const thisPLen   = isOuter ? pLen : pLen * 0.92;
    const thisPWid   = isOuter ? pWid : pWid * 0.88;

    // Path del pétalo apuntando hacia arriba
    const path = petalPath(cx, headY, thisPLen, thisPWid);

    // Franja central del pétalo (vena blanca característica)
    const stripeW = thisPWid * 0.22;
    const stripePath = petalPath(cx, headY, thisPLen * 0.88, stripeW);

    // Grupo con rotación alrededor del centro de la flor
    svg += `
    <g style="
      transform-origin: ${cx}px ${headY}px;
      transform: rotate(${angle}deg);
      opacity: 0;
      animation: petalOpen 1.4s cubic-bezier(0.34,1.1,0.64,1) ${delay}s forwards;
    ">
      <path d="${path}" fill="url(#pg${i})" stroke="${C.petalEdge}" stroke-width="${0.6*scale}" stroke-opacity="0.5"/>
      <path d="${stripePath}" fill="url(#stripe${i})" stroke="none"/>`;

    // Motas oscuras (5-7 puntos irregulares en la mitad inferior del pétalo)
    const spotCount = 5 + Math.floor(Math.abs(Math.sin(i * 1.7)) * 4);
    for (let s = 0; s < spotCount; s++) {
      const t  = 0.15 + (s / spotCount) * 0.55;
      const sy = headY - thisPLen * t;
      const sx = cx + (Math.sin(s * 2.3 + i * 1.1) * thisPWid * 0.28);
      const sr = (1.1 + Math.sin(s * 3.1) * 0.5) * scale;
      svg += `<ellipse cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" rx="${sr.toFixed(1)}" ry="${(sr*0.75).toFixed(1)}" fill="${C.spot}" opacity="0.75"/>`;
    }

    svg += `</g>`;
  });

  // ── ESTAMBRES (6 largos y curvos) ──
  for (let e = 0; e < 6; e++) {
    const baseAngle = e * 60 + 15;
    const rad   = baseAngle * Math.PI / 180;
    const elen  = (20 + Math.sin(e * 1.3) * 4) * scale;
    const curvX = cx + Math.sin(rad) * elen * 0.5;
    const curvY = headY - Math.cos(rad) * elen * 0.3;
    const ex2   = cx + Math.sin(rad) * elen;
    const ey2   = headY - Math.cos(rad) * elen;
    const delay = (stStart + e * 0.07).toFixed(2);

    svg += `
    <g style="opacity:0; animation: stamenFade 0.8s ease ${delay}s forwards;">
      <path fill="none"
        stroke="${C.stamen}" stroke-width="${1.3*scale}" stroke-linecap="round"
        d="M ${cx} ${headY} Q ${curvX.toFixed(1)} ${curvY.toFixed(1)} ${ex2.toFixed(1)} ${ey2.toFixed(1)}"
      />
      <ellipse
        cx="${ex2.toFixed(1)}" cy="${ey2.toFixed(1)}"
        rx="${2.8*scale}" ry="${1.6*scale}"
        transform="rotate(${baseAngle}, ${ex2.toFixed(1)}, ${ey2.toFixed(1)})"
        fill="${C.antherTip}"
      />
    </g>`;
  }

  // ── ESTIGMA CENTRAL (pistilos del centro) ──
  const sDelay = (stStart + 0.1).toFixed(2);
  svg += `
  <circle cx="${cx}" cy="${headY}" r="${cr}" fill="${C.stigmaOut}"
    style="opacity:0; animation: stamenFade 0.5s ease ${sDelay}s forwards;"/>
  <circle cx="${cx}" cy="${headY}" r="${cr*0.5}" fill="${C.stigmaIn}"
    style="opacity:0; animation: stamenFade 0.5s ease ${(parseFloat(sDelay)+0.1).toFixed(2)}s forwards;"/>`;

  svg += `</svg>`;
  return svg;
}

// =============================================
// CREAR EL RAMO
// =============================================
function buildBouquet() {
  const bouquet = document.getElementById('bouquet');
  const defs    = LILY_DEFS.slice(0, LILY_COUNT);

  defs.forEach((def, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'lily';
    // Tiempo del balanceo escalonado entre flores
    const swayDur   = (3.8 + Math.sin(idx * 0.9) * 0.6).toFixed(2);
    wrapper.style.cssText = `
      left: ${def.left}%;
      transform-origin: bottom center;
      --grow-dur:   ${GROW_BASE_DUR}s;
      --grow-delay: ${def.delay}s;
      --lean:       ${def.lean}deg;
      --sway-dur:   ${swayDur}s;
      --sway-delay: ${def.swayDelay}s;
      --sway-amp:   ${(2.5 + Math.abs(def.lean) * 0.06).toFixed(1)}deg;
    `;
    wrapper.innerHTML = buildStargazerSVG(def.height, def.scale);
    bouquet.appendChild(wrapper);
  });
}

// =============================================
// KARAOKE
// =============================================
let currentLyric = -1;

function updateLyrics(currentTime) {
  const lines = document.querySelectorAll('.lyric-line');
  let active  = -1;
  lines.forEach((line, i) => {
    if (currentTime >= parseFloat(line.dataset.time)) active = i;
  });
  if (active !== currentLyric) {
    lines.forEach(l => l.classList.remove('active'));
    if (active >= 0) lines[active].classList.add('active');
    currentLyric = active;
  }
}

// =============================================
// AUDIO
// =============================================
const audio = document.getElementById('audio');

function toggleAudio() {
  if (audio.paused) { audio.play().catch(() => {}); }
  else              { audio.pause(); }
}

audio.addEventListener('play', () => {
  document.getElementById('icon-play').style.display  = 'none';
  document.getElementById('icon-pause').style.display = '';
});
audio.addEventListener('pause', () => {
  document.getElementById('icon-play').style.display  = '';
  document.getElementById('icon-pause').style.display = 'none';
});
audio.addEventListener('timeupdate', () => updateLyrics(audio.currentTime));

// =============================================
// BOTÓN PRINCIPAL
// =============================================
function comenzar() {
  const welcome = document.getElementById('welcome-screen');
  const flowers = document.getElementById('flower-screen');

  welcome.classList.add('fade-out');
  setTimeout(() => { welcome.style.display = 'none'; }, 1500);

  flowers.classList.add('visible');
  document.querySelectorAll('.lily').forEach(l => l.classList.add('bloom'));

  audio.currentTime = 0;
  audio.play().catch(() => {});
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  buildBouquet();
});
