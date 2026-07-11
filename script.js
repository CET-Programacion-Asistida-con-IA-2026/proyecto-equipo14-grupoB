/* ─────────────────────────────────────────
   CVMatch v3 — script.js
───────────────────────────────────────── */

// ── 1. NAVBAR scroll + mobile ──
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});
navToggle.addEventListener('click', () => navMobile.classList.toggle('open'));
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navMobile.classList.remove('open'));
});


// ── 2. SCORE RING + BARRAS animadas ──
function animateWidget() {
  // Anillo
  const ring     = document.getElementById('mainRing');
  const scoreEl  = document.getElementById('mainScore');
  const target   = 76;
  const circum   = 2 * Math.PI * 56; // r=56 → ~352

  let cur = 0;
  const step = target / 70;
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    scoreEl.textContent = Math.round(cur);
    ring.style.strokeDashoffset = circum - (cur / 100) * circum;
    if (cur >= target) clearInterval(t);
  }, 18);

  // Barras
  document.querySelectorAll('.wbar-fill').forEach((bar, i) => {
    setTimeout(() => {
      bar.style.width = bar.style.getPropertyValue('--w');
    }, 200 + i * 150);
  });
}

const widget = document.querySelector('.hero-widget');
if (widget) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateWidget(); obs.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  obs.observe(widget);
}


// ── 3. REVEAL al scroll ──
document.querySelectorAll(
  '.step-card, .feat-card, .tip-card, .portal-card, .stat, .res-main'
).forEach(el => el.classList.add('reveal'));

const revObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), (i % 5) * 80);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));


// ── 4. TABS portales ──
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const id = `tab-${btn.dataset.tab}`;
    document.querySelectorAll('.tab-panel').forEach(p => {
      const show = p.id === id;
      p.classList.toggle('hidden', !show);
      if (show) {
        // re-animar cards del panel
        p.querySelectorAll('.portal-card').forEach((c, i) => {
          c.classList.remove('visible');
          setTimeout(() => c.classList.add('visible'), i * 80);
        });
      }
    });
  });
});


// ── 5. FORMULARIO ──
const form        = document.getElementById('commentForm');
const nombreInput = document.getElementById('nombre');
const comentInput = document.getElementById('comentario');
const errorNombre = document.getElementById('error-nombre');
const errorComent = document.getElementById('error-comentario');
const submitBtn   = document.getElementById('submitBtn');
const btnText     = document.getElementById('btnText');
const btnLoader   = document.getElementById('btnLoader');
const successMsg  = document.getElementById('successMsg');

const showErr  = (inp, el, msg) => { inp.classList.add('error'); el.textContent = msg; };
const clearErr = (inp, el)      => { inp.classList.remove('error'); el.textContent = ''; };

nombreInput.addEventListener('input', () => clearErr(nombreInput, errorNombre));
comentInput.addEventListener('input', () => clearErr(comentInput, errorComent));

form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  const nombre     = nombreInput.value.trim();
  const comentario = comentInput.value.trim();

  if (!nombre)           { showErr(nombreInput, errorNombre, 'Ingresá tu nombre.'); valid = false; }
  else if (nombre.length < 2) { showErr(nombreInput, errorNombre, 'Mínimo 2 caracteres.'); valid = false; }

  if (!comentario)              { showErr(comentInput, errorComent, 'El comentario no puede estar vacío.'); valid = false; }
  else if (comentario.length < 10) { showErr(comentInput, errorComent, 'Escribí al menos 10 caracteres.'); valid = false; }

  if (!valid) return;

  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoader.hidden = false;

  setTimeout(() => {
    submitBtn.hidden = true;
    successMsg.hidden = false;
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.value = ''; el.disabled = true;
    });
  }, 1300);
});


// ── 6. SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 72, behavior: 'smooth' });
  });
});


// ── 7. ESTRELLAS parallax suave ──
document.addEventListener('mousemove', e => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  document.querySelectorAll('.deco-star').forEach((star, i) => {
    const factor = (i + 1) * 8;
    star.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });

  document.querySelectorAll('.aurora-blob').forEach((blob, i) => {
    const factor = (i + 1) * 12;
    blob.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
HEAD
});


// ── 5b. CARRUSEL DE RESEÑAS ──


   

(function () {
  const track  = document.getElementById('reviewsTrack');
  const dots   = document.querySelectorAll('#reviewDots .c-dot');
  const btnPrev = document.getElementById('reviewPrev');
  const btnNext = document.getElementById('reviewNext');
  if (!track) return;

  let current = 0;
  const total = track.children.length;

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - 1));
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(+dot.dataset.idx)));

  // Swipe táctil
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });

  goTo(0);
})();


// ── 6. FAQ ACORDEÓN ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});


/* ─────────────────────────────────────────
   SCRIPT DEL SIMULADOR
───────────────────────────────────────── */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. ESTADO GLOBAL
     Un único objeto que contiene todo lo que persiste entre pasos.
     Nunca se usan variables sueltas en el scope del IIFE para datos
     que atraviesan más de una función.
  ───────────────────────────────────────────────────────────── */
  const S = {
    file:      null,   // objeto File del navegador
    rawText:   '',     // texto plano extraído del documento
    pageCount: 0,      // cantidad de páginas (solo PDF)
    hasPhoto:  false,  // detectado por heurística en el texto
    hasTable:  false,  // detectado por heurística
    hasColumns:false,  // heurística de columnas
    data:      null,   // objeto parseado y luego editado por el usuario
  };

  /* ─────────────────────────────────────────────────────────────
     2. HELPERS DOM
  ───────────────────────────────────────────────────────────── */
  const $   = id  => document.getElementById(id);
  const mk  = tag => document.createElement(tag);

  /** Crea un elemento con clase y HTML interno opcional */
  function el(tag, cls, html) {
    const e = mk(tag);
    if (cls)             e.className   = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /** Formatea bytes a KB / MB legible */
  function fmtSize(b) {
    if (b < 1024)        return b + ' B';
    if (b < 1048576)     return (b / 1024).toFixed(0) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  /* ─────────────────────────────────────────────────────────────
     3. STEPPER — actualiza el indicador de progreso visual
     stepNum: número de paso activo (1 a 4)
     El mapa: subir=1, leer=2, confirmar=3, resultados=4
     El panel de foto no tiene paso propio en el stepper,
     ocurre dentro del paso 2→3.
  ───────────────────────────────────────────────────────────── */
  function setStep(n) {
    for (let i = 1; i <= 4; i++) {
      const s = $('cvx-step-' + i);
      if (!s) continue;
      s.classList.remove('is-active', 'is-done');
      if (i < n)  s.classList.add('is-done');
      if (i === n) s.classList.add('is-active');
    }
  }

  /* ─────────────────────────────────────────────────────────────
     4. NAVEGACIÓN DE PANELES
     panelId: 'cvx-p-upload' | 'cvx-p-loading' |
              'cvx-p-foto'   | 'cvx-p-confirm'  | 'cvx-p-results'
  ───────────────────────────────────────────────────────────── */
  const PANELS = [
    'cvx-p-upload',
    'cvx-p-loading',
    'cvx-p-foto',
    'cvx-p-confirm',
    'cvx-p-results',
  ];

  const PANEL_STEP = {
    'cvx-p-upload':  1,
    'cvx-p-loading': 2,
    'cvx-p-foto':    2,   // mismo paso visual que loading
    'cvx-p-confirm': 3,
    'cvx-p-results': 4,
  };

  function showPanel(id) {
    PANELS.forEach(p => {
      const node = $(p);
      if (node) node.classList.remove('is-active');
    });
    const target = $(id);
    if (target) target.classList.add('is-active');
    setStep(PANEL_STEP[id] || 1);
  }

  /* ─────────────────────────────────────────────────────────────
     5. VALIDACIÓN DE ARCHIVO
     Acepta .pdf y .docx.
     Rechaza imágenes, PDFs escaneados (se detectan después),
     archivos demasiado grandes.
     Devuelve null si es válido, o string de error si no.
  ───────────────────────────────────────────────────────────── */
  const IMG_EXTS  = ['.jpg','.jpeg','.png','.gif','.webp','.bmp','.heic','.heif','.tiff','.tif'];
  const OK_EXTS   = ['.pdf','.docx'];
  const OK_TYPES  = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

  function validateFile(file) {
    if (!file) return 'No se recibió ningún archivo.';
    const ext = '.' + file.name.split('.').pop().toLowerCase();

    // imágenes → mensaje específico
    if (IMG_EXTS.includes(ext)) {
      return 'Las imágenes no pueden procesarse directamente. '
           + 'Convertí tu CV a PDF o DOCX y volvé a intentarlo.';
    }
    // otros formatos no soportados
    if (!OK_EXTS.includes(ext) && !OK_TYPES.includes(file.type)) {
      return 'Formato no compatible. Solo se aceptan archivos PDF (con texto) y DOCX.';
    }
    // tamaño
    if (file.size > MAX_BYTES) {
      return `El archivo pesa ${fmtSize(file.size)}. El límite es 10 MB.`;
    }
    return null;
  }

  /* ─────────────────────────────────────────────────────────────
     6. UI DEL PANEL UPLOAD
  ───────────────────────────────────────────────────────────── */
  function showUploadError(msg) {
    $('cvx-upload-err-txt').textContent = msg;
    $('cvx-upload-err').classList.add('is-visible');
  }
  function clearUploadError() {
    $('cvx-upload-err').classList.remove('is-visible');
  }

  function applyFile(file) {
    const err = validateFile(file);
    if (err) { showUploadError(err); return; }
    clearUploadError();
    S.file = file;

    const ext = file.name.split('.').pop().toLowerCase();
    $('cvx-preview-icon').textContent = ext === 'pdf' ? '📕' : '📝';
    $('cvx-preview-name').textContent = file.name;
    $('cvx-preview-meta').textContent = fmtSize(file.size) + ' · ' + ext.toUpperCase();
    $('cvx-preview').classList.add('is-visible');
    $('cvx-btn-start').classList.add('is-visible');
  }

  function removeFile() {
    S.file = null;
    $('cvx-preview').classList.remove('is-visible');
    $('cvx-btn-start').classList.remove('is-visible');
    $('cvx-file-input').value = '';
    clearUploadError();
  }

  /* ─────────────────────────────────────────────────────────────
     7. DRAG & DROP + INPUT
  ───────────────────────────────────────────────────────────── */
  const dropZone = $('cvx-drop');

  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('is-over');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('is-over');
  });
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('is-over');
    const f = e.dataTransfer.files[0];
    if (f) applyFile(f);
  });

  // click en la zona activa el input, excepto si viene del botón
  dropZone.addEventListener('click', e => {
    const btn = $('cvx-btn-pick');
    if (e.target === btn || btn.contains(e.target)) return;
    $('cvx-file-input').click();
  });
  dropZone.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $('cvx-file-input').click();
    }
  });

  $('cvx-btn-pick').addEventListener('click', e => {
    e.stopPropagation();
    $('cvx-file-input').click();
  });
  $('cvx-file-input').addEventListener('change', () => {
    if ($('cvx-file-input').files[0]) applyFile($('cvx-file-input').files[0]);
  });
  $('cvx-btn-remove').addEventListener('click', removeFile);

  /* ─────────────────────────────────────────────────────────────
     8. LOADER — barra de progreso + mensajes animados
  ───────────────────────────────────────────────────────────── */
  const LOAD_MSGS = [
    'Leyendo el documento…',
    'Extrayendo el texto…',
    'Detectando secciones…',
    'Analizando la estructura…',
    'Preparando la vista previa…',
  ];

  let _loadInterval = null;

  function startLoader() {
    let prog = 0, si = 0;
    $('cvx-load-msg').textContent = LOAD_MSGS[0];
    $('cvx-load-bar').style.width = '0%';

    _loadInterval = setInterval(() => {
      prog = Math.min(prog + Math.random() * 7 + 3, 88);
      $('cvx-load-bar').style.width = prog + '%';

      const ns = Math.min(Math.floor((prog / 88) * LOAD_MSGS.length), LOAD_MSGS.length - 1);
      if (ns !== si) {
        si = ns;
        const msgEl = $('cvx-load-msg');
        msgEl.style.opacity = '0';
        setTimeout(() => {
          msgEl.textContent = LOAD_MSGS[si];
          msgEl.style.opacity = '1';
        }, 180);
      }
    }, 200);
  }

  function finishLoader() {
    clearInterval(_loadInterval);
    $('cvx-load-bar').style.width = '100%';
  }

  /* ─────────────────────────────────────────────────────────────
     9. EXTRACCIÓN DE TEXTO — PDF.js + Mammoth
     Devuelve un objeto { text, pageCount, meta }
     donde meta tiene información de estructura del PDF.

     PUNTO DE CONEXIÓN: para reemplazar por OCR real en el futuro,
     cambiar esta función. El resto del código consume solo `text`.
  ───────────────────────────────────────────────────────────── */
  async function extractText(file) {
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'docx') {
      return await extractDocx(file);
    } else {
      return await extractPdf(file);
    }
  }

  async function extractPdf(file) {
    const ab = await file.arrayBuffer();

    // PDF.js puede no estar disponible si el CDN falló
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    if (!pdfjsLib) {
      throw new Error('PDF.js no está disponible. Verificá tu conexión a internet.');
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(ab) }).promise;

    let fullText    = '';
    let hasRealText = false;
    let totalItems  = 0;
    let columnHint  = false; // detectar columnas por posición X
    let tableHint   = false; // detectar tablas por alineación repetida

    const xPositions = []; // para detectar columnas

    for (let p = 1; p <= pdf.numPages; p++) {
      const page    = await pdf.getPage(p);
      const content = await page.getTextContent({ includeMarkedContent: false });
      const vp      = page.getViewport({ scale: 1 });
      const pageW   = vp.width;

      let pageText = '';
      let lastY    = null;
      let lastX    = null;
      let lineItems = [];

      content.items.forEach(item => {
        if (!item.str) return;
        totalItems++;

        // posición del item
        const tx = item.transform[4];  // x
        const ty = item.transform[5];  // y

        // registrar posición X para detectar columnas
        xPositions.push(Math.round(tx / 10) * 10);

        // detectar posible tabla: muchos items alineados verticalmente
        if (lastX !== null && Math.abs(tx - lastX) < 5 && lineItems.length > 3) {
          tableHint = true;
        }

        // agrupar en líneas por posición Y aproximada
        if (lastY !== null && Math.abs(ty - lastY) > 5) {
          pageText += lineItems.join(' ') + '\n';
          lineItems = [];
        }
        lineItems.push(item.str);
        lastY = ty;
        lastX = tx;

        // si hay texto real (no solo espacios)
        if (item.str.trim().length > 0) hasRealText = true;
      });

      if (lineItems.length) pageText += lineItems.join(' ') + '\n';
      fullText += pageText + '\n';
    }

    // detectar columnas: si hay dos clusters de X muy separados y consistentes
    if (xPositions.length > 20) {
      const leftCluster  = xPositions.filter(x => x < 150).length;
      const rightCluster = xPositions.filter(x => x > 300).length;
      if (leftCluster > 10 && rightCluster > 10) columnHint = true;
    }

    // detectar si es PDF escaneado: pocas páginas con muy poco texto
    if (!hasRealText || (totalItems < 5 && pdf.numPages > 0)) {
      throw new Error(
        'Este PDF parece ser un escaneo o imagen. '
        + 'Los PDFs escaneados no pueden analizarse con esta herramienta. '
        + 'Intentá exportar el CV como PDF desde Word, Canva, Google Docs u otro programa.'
      );
    }

    return {
      text:       fullText.trim(),
      pageCount:  pdf.numPages,
      hasColumns: columnHint,
      hasTable:   tableHint,
    };
  }

  async function extractDocx(file) {
    const ab = await file.arrayBuffer();

    if (!window.mammoth) {
      throw new Error('Mammoth.js no está disponible. Verificá tu conexión a internet.');
    }

    const result = await window.mammoth.extractRawText({ arrayBuffer: ab });

    if (!result.value || result.value.trim().length < 20) {
      throw new Error('No se pudo extraer texto del documento DOCX. Verificá que el archivo no esté dañado.');
    }

    return {
      text:       result.value.trim(),
      pageCount:  0,    // mammoth no da cantidad de páginas
      hasColumns: false,
      hasTable:   false,
    };
  }

  /* ─────────────────────────────────────────────────────────────
     10. PARSEO DEL TEXTO — extrae estructura del CV

     Estrategia:
     A) Detectar secciones por encabezados (regex sobre líneas)
     B) Dentro de cada sección, aplicar parseo específico
     C) Nunca inventar datos: si no se encuentra, queda vacío

     El objeto devuelto es la fuente de verdad para la UI de
     confirmación y para el motor de análisis.
  ───────────────────────────────────────────────────────────── */

  /* ── 10.1 Utilidades de parseo ── */

  /** Extrae el bloque de texto entre un marcador de inicio y uno de fin */
  function extractSection(text, startRe, endRes) {
    const s = text.search(startRe);
    if (s === -1) return '';
    const sub = text.slice(s);
    let end = sub.length;
    for (const re of endRes) {
      const idx = sub.search(re);
      if (idx > 0 && idx < end) end = idx;
    }
    return sub.slice(0, end).trim();
  }

  /** Busca la primera coincidencia de una regex en el texto completo */
  function find(text, re) {
    const m = text.match(re);
    return m ? m[0].trim() : '';
  }

  /** Busca todas las coincidencias */
  function findAll(text, re) {
    return [...text.matchAll(re)].map(m => m[0].trim());
  }

  /* ── 10.2 Detectores de datos personales ── */

  function detectNombre(lines) {
    // Busca las primeras líneas que parezcan nombre propio
    // Criterio: 2-4 palabras, cada una capitalizada, sin números ni símbolos
    for (const line of lines.slice(0, 8)) {
      const t = line.trim();
      if (t.length < 4 || t.length > 60) continue;
      if (/\d/.test(t)) continue;
      if (/[@#%&*()[\]{}|\\/<>]/.test(t)) continue;
      // al menos dos palabras capitalizadas
      const words = t.split(/\s+/);
      if (words.length < 2 || words.length > 5) continue;
      const allCap = words.every(w => /^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ'-]+$/.test(w));
      if (allCap) return t;
    }
    return '';
  }

  function detectEmail(text) {
    // RFC 5321 simplificado
    return find(text, /[\w.+%-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  }

  function detectPhone(text) {
    // Cubre formatos argentinos: +54 11 XXXX-XXXX, (011) XXXX-XXXX, 15-XXXX-XXXX, etc.
    const re = /(?:\+?54[\s.-]?)?(?:\(?0?11\)?[\s.-]?)?(?:15[\s.-]?)?\d{4}[\s.-]?\d{4}/g;
    const all = findAll(text, re).filter(p => p.replace(/\D/g,'').length >= 8);
    return all[0] || '';
  }

  function detectLinkedIn(text) {
    return find(text, /(?:linkedin\.com\/in\/|linkedin\.com\/pub\/)([\w%-]+)/i)
        || find(text, /linkedin\.com\/[\w/-]+/i);
  }

  function detectGitHub(text) {
    return find(text, /github\.com\/([\w-]+)/i);
  }

  function detectPortfolio(text) {
    // excluye dominios de redes sociales conocidas
    const re = /(?:https?:\/\/)?(?:www\.)?(?!(?:linkedin|github|facebook|instagram|twitter|tiktok|youtube|wa\.me))[a-z0-9][\w-]*\.[a-z]{2,6}(\/[\w./?=#&%-]*)*/gi;
    const all = findAll(text, re).filter(u =>
      !/@/.test(u) &&
      !/\.(pdf|docx|jpg|png|gif)$/i.test(u)
    );
    return all[0] || '';
  }

  function detectUbicacion(text) {
    // ciudades y provincias argentinas + países comunes
    const places = [
      'Buenos Aires','CABA','GBA','Córdoba','Rosario','Mendoza','La Plata',
      'Mar del Plata','Tucumán','Salta','Santa Fe','Neuquén','Bariloche',
      'Resistencia','Corrientes','Posadas','Jujuy','San Juan','San Luis',
      'Bahía Blanca','Formosa','Santiago del Estero','Río Gallegos',
      'Ushuaia','Rawson','Santa Rosa','Viedma','Catamarca','La Rioja',
      'San Salvador de Jujuy','Paraná','San Miguel de Tucumán',
      // países
      'Argentina','Uruguay','Chile','Colombia','México','España','Bolivia',
      'Paraguay','Peru','Brasil','Venezuela','Ecuador',
    ];
    const re = new RegExp(
      '(' + places.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')',
      'i'
    );
    return find(text, re);
  }

  function detectInstagram(text) {
    return find(text, /(?:instagram\.com\/|@)([\w.]+)/i);
  }
  function detectFacebook(text) {
    return find(text, /facebook\.com\/([\w.]+)/i);
  }
  function detectTwitter(text) {
    return find(text, /(?:twitter\.com\/x\.com\/|@)([\w]+)/i);
  }
  function detectTikTok(text) {
    return find(text, /tiktok\.com\/@([\w.]+)/i);
  }

  function detectDNI(text) {
    // DNI argentino: 7-8 dígitos con o sin puntos
    const m = text.match(/\b(?:DNI|D\.N\.I\.?)\s*[:\-#N°]?\s*(\d{1,2}\.?\d{3}\.?\d{3}|\d{7,8})\b/i)
           || text.match(/\b(\d{2}\.\d{3}\.\d{3})\b/); // formato XX.XXX.XXX sin label
    return m ? m[0] : '';
  }

  function detectCUIL(text) {
    const m = text.match(/\b(?:CUIL|CUIT|C\.U\.I\.L\.?|C\.U\.I\.T\.?)\s*[:\-#N°]?\s*\d{2}-?\d{8}-?\d\b/i);
    return m ? m[0] : '';
  }

  function detectFechaNac(text) {
    // "Fecha de nacimiento: 12/03/1990" o "Nacido el 12 de marzo de 1990"
    const m = text.match(
      /(?:fecha\s+de\s+nacimiento|nacimiento|nacido\/a?|nacido|nacida)\s*[:\-]?\s*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}|\d{1,2}\s+de\s+\w+\s+de\s+\d{4})/i
    ) || text.match(/\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{4})\b/);
    return m ? m[0] : '';
  }

  function detectEdad(text) {
    const m = text.match(/\b(?:edad\s*[:\-]?\s*)?(\d{1,2})\s+años\b/i)
           || text.match(/\b(?:edad|age)\s*[:\-]\s*(\d{1,2})\b/i);
    return m ? m[0] : '';
  }

  function detectEstadoCivil(text) {
    const m = text.match(
      /\b(?:casad[ao]|solter[ao]|divorciad[ao]|separad[ao]|viud[ao]|en\s+pareja|conviviente|unión\s+(?:libre|convivencial))\b/i
    ) || text.match(/\bEstado\s+civil\s*[:\-]\s*([\w\s]+)/i);
    return m ? m[0] : '';
  }

  function detectDireccion(text) {
    const m = text.match(
      /\b(?:Calle|Av\.|Avenida|Pasaje|Blvd\.?|Boulevard|Pje\.|Diagonal|Ruta)\s+[\w\s\.]+\s*\d+(?:\s*,\s*[\w\s°]+)*/i
    );
    return m ? m[0] : '';
  }

  function detectNacionalidad(text) {
    const m = text.match(/\b(?:Nacionalidad|citizenship)\s*[:\-]\s*([\w\s]+)/i);
    return m ? m[1].trim() : '';
  }

  function detectCodigoPostal(text) {
    const m = text.match(/\b(?:CP|C\.P\.|Código\s+Postal)\s*[:\-]?\s*([A-Z]?\d{4}[A-Z]{0,3})\b/i);
    return m ? m[0] : '';
  }

  /* ── 10.3 Foto — heurística en el texto ── */
  function detectPhoto(text) {
    // Palabras que suelen aparecer cuando un PDF tiene imagen embebida
    // o cuando el CV menciona la foto
    const re = /\b(?:foto|photograph|picture|imagen|photo|portrait)\b/i;
    return re.test(text);
  }

  /* ── 10.4 Secciones del CV ── */

  // Regex de apertura de secciones principales
  const SEC_EXP = /(?:experiencia\s+(?:laboral|profesional|de\s+trabajo)|historial\s+laboral|trayectoria\s+profesional|empleos?\s+anteriores?|trabajos?\s+(?:anteriores?|realizados?))/i;
  const SEC_EDU = /(?:educaci[oó]n|formaci[oó]n\s+(?:acad[eé]mica|profesional)?|estudios?|cursos?\s+y\s+(?:capacitaciones?|formaci[oó]n)|capacitaci[oó]n|certificaciones?)/i;
  const SEC_SKI = /(?:habilidades?|competencias?|aptitudes?|skills?|conocimientos?|destrezas?)/i;
  const SEC_LAN = /(?:idiomas?|languages?|lenguas?)/i;
  const SEC_OBJ = /(?:objetivo\s+(?:profesional|laboral)|perfil\s+(?:profesional|personal)|resumen\s+(?:profesional|personal|ejecutivo)|about\s+me|acerca\s+de\s+m[ií]|presentaci[oó]n)/i;
  const SEC_REF = /(?:referencias?\s+(?:personales?|laborales?|profesionales?)|references?)/i;
  const SEC_LOG = /(?:logros?|achievements?|m[eé]ritos?|reconocimientos?|premios?)/i;
  const SEC_VOL = /(?:voluntariado|voluntariado\s+social|trabajo\s+voluntario|volunteer)/i;
  const SEC_PUB = /(?:publicaciones?|artículos?|investigaci[oó]n|papers?|publications?)/i;

  // Para delimitar el fin de una sección, se usan todos los encabezados
  const ALL_ENDS = [SEC_EXP, SEC_EDU, SEC_SKI, SEC_LAN, SEC_OBJ, SEC_REF, SEC_LOG, SEC_VOL, SEC_PUB];

  /* ── 10.5 Parseo de experiencia laboral ── */
  function parseExperiences(section) {
    if (!section || section.trim().length < 10) return [];
    const items = [];
    const lines = section.split('\n').map(l => l.trim()).filter(Boolean);

    // Quita la primera línea si es el encabezado de la sección
    if (SEC_EXP.test(lines[0])) lines.shift();

    // Estrategia A: busca bloques con años (2015–2023 o 2015 - actualidad)
    const YEAR_RE = /(\d{4})\s*[-–—]\s*(\d{4}|actualidad|presente|hoy|actual|la\s+fecha|current)/i;

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // ¿Esta línea contiene un rango de años?
      if (YEAR_RE.test(line)) {
        const fechas = line.match(YEAR_RE)[0];
        // la línea anterior suele ser empresa o puesto
        const prev   = i > 0 ? lines[i - 1] : '';
        const next   = i < lines.length - 1 ? lines[i + 1] : '';

        // acumular tareas en las siguientes líneas hasta el próximo bloque de año
        const tareas = [];
        let j = i + 1;
        while (j < lines.length && !YEAR_RE.test(lines[j])) {
          if (lines[j].length > 3) tareas.push(lines[j]);
          j++;
        }

        // determinar empresa y puesto
        let empresa = '', puesto = '';
        if (prev && !YEAR_RE.test(prev) && !SEC_EXP.test(prev)) {
          // si hay guión separando empresa de puesto en la misma línea
          if (/[-–—]/.test(prev) && !YEAR_RE.test(prev)) {
            const parts = prev.split(/\s*[-–—]\s*/);
            empresa = parts[0].trim();
            puesto  = parts.slice(1).join(' – ').trim();
          } else {
            empresa = prev;
            puesto  = next && !YEAR_RE.test(next) ? next : '';
          }
        } else if (/[-–—]/.test(line.replace(fechas, ''))) {
          // empresa – puesto – fechas en una sola línea
          const withoutDate = line.replace(YEAR_RE, '').trim();
          const parts = withoutDate.split(/\s*[-–—]\s+/);
          empresa = parts[0] || '';
          puesto  = parts[1] || '';
        }

        items.push({
          empresa: empresa.trim(),
          puesto:  puesto.trim(),
          fechas:  fechas.trim(),
          tareas:  tareas.slice(0, 8).join('\n'),
        });
        i = j;
        continue;
      }

      // Estrategia B: línea con empresa – puesto sin rango de años explícito
      if (/[-–—]/.test(line) && line.length < 100 && !SEC_EDU.test(line)) {
        const parts = line.split(/\s*[-–—]\s*/);
        if (parts.length >= 2 && parts[0].length > 2 && parts[1].length > 2) {
          const tareas = [];
          let j = i + 1;
          while (j < lines.length && !(/[-–—]/.test(lines[j]) && lines[j].length < 100)) {
            if (lines[j].length > 3) tareas.push(lines[j]);
            j++;
          }
          items.push({
            empresa: parts[0].trim(),
            puesto:  parts[1].trim(),
            fechas:  '',
            tareas:  tareas.slice(0, 6).join('\n'),
          });
          i = j;
          continue;
        }
      }

      i++;
    }

    return items.slice(0, 10);
  }

  /* ── 10.6 Parseo de educación ── */
  function parseEducation(section) {
    if (!section || section.trim().length < 5) return [];
    const items  = [];
    const lines  = section.split('\n').map(l => l.trim()).filter(Boolean);
    if (SEC_EDU.test(lines[0])) lines.shift();

    const YEAR_RE2 = /\b(\d{4})\b/;

    for (let i = 0; i < lines.length && items.length < 8; i++) {
      const line = lines[i];
      if (line.length < 4) continue;
      if (SEC_EDU.test(line) || SEC_EXP.test(line)) continue;

      // Detecta título / carrera / curso
      const titulo = line;
      const anio   = (line.match(YEAR_RE2) || [''])[0];

      // La línea siguiente suele ser la institución
      let institucion = '';
      if (i + 1 < lines.length) {
        const next = lines[i + 1];
        if (
          next.length > 3 &&
          !YEAR_RE2.test(next.trim()) &&
          !SEC_EXP.test(next) &&
          !SEC_SKI.test(next)
        ) {
          institucion = next;
          i++; // consumir esa línea
        }
      }

      items.push({ titulo, institucion, anio });
    }

    return items;
  }

  /* ── 10.7 Habilidades ── */
  const HARD_SKILLS_DB = [
    // ofimática
    'excel','word','powerpoint','access','outlook','microsoft office','google docs',
    'google sheets','google slides','libreoffice',
    // diseño
    'photoshop','illustrator','indesign','figma','canva','sketch','after effects',
    'premiere','lightroom','xd','coreldraw','blender','autocad','revit','archicad',
    'solidworks','3ds max','rhino',
    // programación
    'html','css','javascript','typescript','python','java','c++','c#','php',
    'ruby','swift','kotlin','go','rust','r','scala','matlab',
    'react','vue','angular','node.js','django','flask','laravel','spring',
    '.net','asp.net','express','next.js','nuxt','svelte',
    // bases de datos
    'sql','mysql','postgresql','mongodb','sqlite','oracle','redis','firebase',
    'dynamodb','elasticsearch',
    // cloud / devops
    'aws','azure','google cloud','gcp','docker','kubernetes','jenkins','git',
    'github','gitlab','bitbucket','terraform','ansible','linux','bash','shell',
    // data / BI
    'power bi','tableau','data studio','looker','qlik','spss','stata','sas',
    'machine learning','deep learning','tensorflow','pytorch','scikit-learn',
    'pandas','numpy','spark','hadoop','airflow',
    // otros
    'sap','salesforce','hubspot','jira','confluence','trello','notion','slack',
    'asana','monday','zendesk','wordpress','magento','shopify','woocommerce',
    // salud
    'hcpro','mediware','oscaremr','his','ris','pacs',
    // gastronomía / oficios
    'haccp','bpm','autocad','plc','fpga','arduino','raspberry pi',
  ];

  const SOFT_SKILLS_DB = [
    'trabajo en equipo','comunicación','liderazgo','creatividad','adaptabilidad',
    'resolución de problemas','proactividad','responsabilidad','empatía','organización',
    'atención al cliente','gestión de tiempo','orientación a resultados','negociación',
    'planificación','toma de decisiones','trabajo bajo presión','flexibilidad',
    'pensamiento crítico','iniciativa','autonomía','colaboración','persuasión',
    'gestión de equipos','capacidad de aprendizaje','orientación al detalle',
    'escucha activa','tolerancia a la frustración','resiliencia','multitasking',
    'gestión de conflictos','mentoring','coaching',
  ];

  function parseSkills(section, fullText) {
    const sourceText = (section || '') + '\n' + fullText;
    const lower = sourceText.toLowerCase();

    const hard = HARD_SKILLS_DB.filter(s => {
      // usa regex con word boundaries para evitar falsos positivos
      const re = new RegExp('(?<![a-záéíóúüñ])' + escapeRe(s) + '(?![a-záéíóúüñ])', 'i');
      return re.test(lower);
    });

    const soft = SOFT_SKILLS_DB.filter(s => lower.includes(s));

    // también parsea listas (bullets, comas, barras)
    if (section) {
      const listItems = section
        .replace(/[•·▪▸▹◦➢➤►→\-–—]/g, ',')
        .split(/[,\/\n;|]/)
        .map(s => s.trim())
        .filter(s => s.length > 2 && s.length < 50);

      listItems.forEach(item => {
        const lo = item.toLowerCase();
        if (!HARD_SKILLS_DB.some(h => lo.includes(h)) && !SOFT_SKILLS_DB.some(s => lo.includes(s))) {
          // heurística: si parece una habilidad técnica (corta, sin artículo)
          if (item.split(' ').length <= 3 && !/\b(?:el|la|los|las|un|una|de|del|en)\b/i.test(item)) {
            if (!hard.includes(lo) && lo.length > 2) hard.push(item);
          } else {
            if (!soft.includes(lo) && lo.length > 2) soft.push(item);
          }
        }
      });
    }

    return {
      hard: [...new Set(hard)].slice(0, 16),
      soft: [...new Set(soft)].slice(0, 12),
    };
  }

  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* ── 10.8 Herramientas — subconjunto visible de hard skills ── */
  const TOOLS_DB = [
    'excel','word','powerpoint','photoshop','illustrator','figma','canva',
    'autocad','git','github','docker','jira','notion','sap','salesforce',
    'tableau','power bi','visual studio','vscode',
  ];

  function detectTools(hard) {
    return hard.filter(h => TOOLS_DB.some(t => h.toLowerCase().includes(t)));
  }

  /* ── 10.9 Idiomas ── */
  const LANGS_DB = [
    'español','inglés','ingles','portugués','portugues','francés','frances',
    'alemán','aleman','italiano','chino','japonés','japones','árabe','arabe',
    'ruso','coreano','hindi','hebreo',
    // variantes en inglés dentro del CV
    'spanish','english','portuguese','french','german','italian','chinese',
    'japanese','arabic','russian','korean',
  ];
  const LEVELS_DB = [
    'nativo','nativa','fluido','fluida','avanzado','avanzada','intermedio',
    'intermedia','básico','basico','elemental','b1','b2','c1','c2','a1','a2',
    'native','fluent','advanced','intermediate','basic','elementary',
  ];

  function parseIdiomas(section) {
    if (!section) return [];
    const lower = section.toLowerCase();
    const found = [];

    LANGS_DB.forEach(lang => {
      if (!lower.includes(lang)) return;
      // busca el nivel en la misma línea
      const re  = new RegExp(escapeRe(lang) + '[^\\n]{0,40}', 'i');
      const m   = section.match(re);
      const ctx = m ? m[0].toLowerCase() : '';
      const lvl = LEVELS_DB.find(l => ctx.includes(l)) || '';
      const label = lang.charAt(0).toUpperCase() + lang.slice(1) + (lvl ? ' (' + lvl + ')' : '');
      if (!found.some(f => f.toLowerCase().includes(lang))) found.push(label);
    });

    return found;
  }

  /* ── 10.10 Objetivo / perfil profesional ── */
  function parseObjetivo(section) {
    if (!section) return '';
    const lines = section.split('\n').map(l => l.trim()).filter(Boolean);
    if (SEC_OBJ.test(lines[0])) lines.shift();
    return lines.slice(0, 5).join(' ').trim();
  }

  /* ── 10.11 Detección de diseño problemático ── */
  function detectDesignIssues(text, hasColumns, hasTable, pageCount) {
    const issues = [];
    const lower  = text.toLowerCase();

    if (hasColumns)  issues.push('columnas');
    if (hasTable)    issues.push('tablas');
    if (/[█▓▒░■□▪▫◆◇●○]{3,}/.test(text)) issues.push('barras-graficas');
    if (/[★☆✦✧✩✪✫✬✭✮✯✰❤♥♦♣♠♟🌟💼📌✅❌⚡🎯🔹🔸]{2,}/.test(text)) issues.push('iconos-excesivos');
    if (pageCount > 2) issues.push('muchas-paginas');
    if (lower.includes('timeline') || lower.includes('línea de tiempo')) issues.push('timeline');

    return issues;
  }

  /* ── 10.12 Función principal de parseo ── */
  function parseCV(rawText, hasColumns, hasTable, pageCount) {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

    // secciones
    const secExp = extractSection(rawText, SEC_EXP, ALL_ENDS.filter(r => r !== SEC_EXP));
    const secEdu = extractSection(rawText, SEC_EDU, ALL_ENDS.filter(r => r !== SEC_EDU));
    const secSki = extractSection(rawText, SEC_SKI, ALL_ENDS.filter(r => r !== SEC_SKI));
    const secLan = extractSection(rawText, SEC_LAN, ALL_ENDS.filter(r => r !== SEC_LAN));
    const secObj = extractSection(rawText, SEC_OBJ, ALL_ENDS.filter(r => r !== SEC_OBJ));

    const personal = {
      nombre:       detectNombre(lines),
      email:        detectEmail(rawText),
      phone:        detectPhone(rawText),
      ubicacion:    detectUbicacion(rawText),
      linkedin:     detectLinkedIn(rawText),
      github:       detectGitHub(rawText),
      portfolio:    detectPortfolio(rawText),
      instagram:    detectInstagram(rawText),
      facebook:     detectFacebook(rawText),
      twitter:      detectTwitter(rawText),
      tiktok:       detectTikTok(rawText),
      dni:          detectDNI(rawText),
      cuil:         detectCUIL(rawText),
      fechaNac:     detectFechaNac(rawText),
      edad:         detectEdad(rawText),
      estadoCivil:  detectEstadoCivil(rawText),
      direccion:    detectDireccion(rawText),
      nacionalidad: detectNacionalidad(rawText),
      cp:           detectCodigoPostal(rawText),
    };

    const skills     = parseSkills(secSki, rawText);
    const experiences = parseExperiences(secExp);
    const education   = parseEducation(secEdu);
    const idiomas     = parseIdiomas(secLan);
    const tools       = detectTools(skills.hard);
    const objetivo    = parseObjetivo(secObj);
    const designIssues = detectDesignIssues(rawText, hasColumns, hasTable, pageCount);

    return {
      personal,
      experiences,
      education,
      skills,
      idiomas,
      tools,
      objetivo,
      designIssues,
      hasPhoto:  S.hasPhoto,
      pageCount,
    };
  }

  /* ─────────────────────────────────────────────────────────────
     11. PANEL FOTO
     Se muestra SI Y SOLO SI se detectó foto.
     El usuario ve los ejemplos y continúa.
  ───────────────────────────────────────────────────────────── */
  $('cvx-foto-back').addEventListener('click', () => {
    showPanel('cvx-p-upload');
  });
  $('cvx-foto-continue').addEventListener('click', () => {
    buildConfirmPanel(S.data);
    showPanel('cvx-p-confirm');
  });

  /* ─────────────────────────────────────────────────────────────
     12. BOTÓN ANALIZAR — orquesta la extracción
  ───────────────────────────────────────────────────────────── */
  $('cvx-btn-start').addEventListener('click', async () => {
    if (!S.file) return;
    showPanel('cvx-p-loading');
    startLoader();

    try {
      const result = await extractText(S.file);
      finishLoader();
      await new Promise(r => setTimeout(r, 450));

      S.rawText    = result.text;
      S.pageCount  = result.pageCount;
      S.hasColumns = result.hasColumns;
      S.hasTable   = result.hasTable;
      S.hasPhoto   = detectPhoto(result.text);

      // parsear CV
      const parsed = parseCV(result.text, result.hasColumns, result.hasTable, result.pageCount);
      S.data = parsed;

      // ¿hay foto? → panel foto primero
      if (S.hasPhoto) {
        showPanel('cvx-p-foto');
      } else {
        buildConfirmPanel(parsed);
        showPanel('cvx-p-confirm');
      }

    } catch (err) {
      finishLoader();
      showPanel('cvx-p-upload');
      showUploadError(err.message || 'Ocurrió un error al procesar el archivo.');
      console.error('[CVX]', err);
    }
  });

  /* ─────────────────────────────────────────────────────────────
     13. PANEL CONFIRMAR — construcción de la UI de edición
  ───────────────────────────────────────────────────────────── */

  /**
   * Crea una sección editable con cabecera y cuerpo.
   * @param {string} id   — ID del elemento section (ej: 'cvx-sec-personal')
   * @param {string} icon — emoji
   * @param {string} title
   * @returns {HTMLElement}
   */
  function makeSection(id, icon, title) {
    const sec  = el('div', 'cvx-section');
    sec.id = id;

    const head  = el('div', 'cvx-section-head');
    const label = el('span', 'cvx-section-title', icon + ' ' + title);

    const editBtn = el('button', 'cvx-btn-edit-section', '✏ Editar');
    editBtn.type = 'button';
    editBtn.addEventListener('click', () => {
      const isEditing = sec.classList.contains('is-editing');
      if (isEditing) {
        sec.classList.remove('is-editing');
        editBtn.textContent = '✏ Editar';
      } else {
        sec.classList.add('is-editing');
        editBtn.textContent = '✔ Listo';
      }
    });

    head.appendChild(label);
    head.appendChild(editBtn);
    sec.appendChild(head);

    const body = el('div', 'cvx-section-body');
    sec.appendChild(body);

    return sec;
  }

  /**
   * Crea un campo de texto editable con label y advertencia opcional.
   * @param {string} label
   * @param {string} value   — valor detectado
   * @param {function} onChange — callback(newValue)
   * @param {string} [warn]  — texto de advertencia
   * @param {string} [placeholder]
   */
  function makeField(label, value, onChange, warn, placeholder) {
    const wrap  = el('div', 'cvx-field');
    const lbl   = el('label', 'cvx-field-label', label);
    const input = el('input');
    input.className   = 'cvx-field-input';
    input.value       = value || '';
    input.placeholder = placeholder || 'No detectado';
    input.addEventListener('input', () => onChange(input.value));

    wrap.appendChild(lbl);
    wrap.appendChild(input);

    if (warn) {
      const w = el('span', 'cvx-field-warn is-visible', '⚠ ' + warn);
      wrap.appendChild(w);
    }

    return wrap;
  }

  /**
   * Crea un bloque de pills editables (habilidades, idiomas).
   * @param {string[]} arr        — array vivo (se modifica directamente)
   * @param {string}   pillClass  — clase CSS adicional ('soft', 'tool', etc.)
   * @param {string}   addLabel   — texto del botón agregar
   */
  function makePillsEditor(arr, pillClass, addLabel) {
    const wrap = el('div', 'cvx-pills');

    function renderPill(item, idx) {
      const pill = el('span', 'cvx-pill ' + (pillClass || ''), item + ' ');
      const rmBtn = el('button', 'cvx-pill-rm', '✕');
      rmBtn.type = 'button';
      rmBtn.title = 'Eliminar';
      rmBtn.addEventListener('click', () => {
        arr.splice(arr.indexOf(item), 1);
        pill.remove();
      });
      pill.appendChild(rmBtn);
      return pill;
    }

    arr.forEach((item, idx) => wrap.appendChild(renderPill(item, idx)));

    const addBtn = el('button', 'cvx-pill-add', '＋ ' + (addLabel || 'Agregar'));
    addBtn.type = 'button';
    addBtn.addEventListener('click', () => {
      const val = prompt(addLabel || 'Nueva habilidad:');
      if (!val || !val.trim()) return;
      const trimmed = val.trim();
      arr.push(trimmed);
      wrap.insertBefore(renderPill(trimmed, arr.length - 1), addBtn);
    });
    wrap.appendChild(addBtn);

    return wrap;
  }

  /**
   * Crea una tarjeta de ítem (experiencia o educación) con campos editables.
   * @param {object}   item      — el objeto del ítem
   * @param {object[]} parentArr — array padre (para poder eliminar)
   * @param {string[]} fieldDefs — [['label','key','placeholder'], ...]
   * @param {boolean}  hasTextarea — si tiene campo de tareas/descripción
   */
  function makeItemCard(item, parentArr, fieldDefs, hasTextarea) {
    const card   = el('div', 'cvx-item-card');
    const head   = el('div', 'cvx-item-head');
    const fields = el('div', 'cvx-item-fields');

    fieldDefs.forEach(([label, key, ph]) => {
      const f   = el('div', 'cvx-field');
      const lbl = el('label', 'cvx-field-label', label);
      const inp = el('input');
      inp.className   = 'cvx-field-input';
      inp.value       = item[key] || '';
      inp.placeholder = ph || '';
      inp.addEventListener('input', () => { item[key] = inp.value; });
      f.appendChild(lbl);
      f.appendChild(inp);
      fields.appendChild(f);
    });

    if (hasTextarea) {
      const f   = el('div', 'cvx-field');
      const lbl = el('label', 'cvx-field-label', 'Tareas y logros');
      const ta  = el('textarea', 'cvx-field-textarea');
      ta.value       = item.tareas || '';
      ta.placeholder = 'Describí las tareas, responsabilidades y logros…';
      ta.addEventListener('input', () => { item.tareas = ta.value; });
      f.appendChild(lbl);
      f.appendChild(ta);
      fields.appendChild(f);
    }

    const rmBtn = el('button', 'cvx-btn-rm-item', '✕');
    rmBtn.type  = 'button';
    rmBtn.title = 'Eliminar';
    rmBtn.addEventListener('click', () => {
      const idx = parentArr.indexOf(item);
      if (idx > -1) parentArr.splice(idx, 1);
      card.remove();
    });

    head.appendChild(fields);
    head.appendChild(rmBtn);
    card.appendChild(head);
    return card;
  }

  /** Construye el panel 4 completo con los datos de S.data */
  function buildConfirmPanel(data) {
    const body = $('cvx-confirm-body');
    body.innerHTML = '';

    const p = data.personal;

    /* ── DATOS PERSONALES ── */
    const secP = makeSection('cvx-sec-personal', '👤', 'Datos personales');
    const bodyP = secP.querySelector('.cvx-section-body');

    const emailWarn = p.email && isUnprofessionalEmail(p.email)
      ? 'Este correo puede no verse profesional. Considerá usar nombre.apellido@...'
      : '';

    bodyP.appendChild(makeField('Nombre completo', p.nombre,    v => p.nombre    = v));
    bodyP.appendChild(makeField('Correo electrónico', p.email,  v => p.email     = v, emailWarn));
    bodyP.appendChild(makeField('Teléfono / Celular', p.phone,  v => p.phone     = v, '', '+54 11 XXXX-XXXX'));
    bodyP.appendChild(makeField('Ciudad / Provincia', p.ubicacion, v => p.ubicacion = v));
    bodyP.appendChild(makeField('LinkedIn', p.linkedin,         v => p.linkedin  = v));
    bodyP.appendChild(makeField('GitHub',   p.github,           v => p.github    = v));
    bodyP.appendChild(makeField('Portfolio / Web', p.portfolio, v => p.portfolio = v));

    // redes sociales personales detectadas
    const hasPersonalNets = p.instagram || p.facebook || p.twitter || p.tiktok;
    if (hasPersonalNets) {
      const div = el('div');
      div.style.marginTop = '.5rem';
      const lbl = el('p', 'cvx-field-label', '⚠ Redes sociales personales detectadas');
      lbl.style.cssText = 'color:var(--cvx-yellow);margin-bottom:.4rem;';
      div.appendChild(lbl);
      if (p.instagram) div.appendChild(makeField('Instagram', p.instagram, v => p.instagram = v, '¿Es un perfil profesional?'));
      if (p.facebook)  div.appendChild(makeField('Facebook',  p.facebook,  v => p.facebook  = v, 'Generalmente no se incluye en el CV'));
      if (p.twitter)   div.appendChild(makeField('Twitter/X', p.twitter,   v => p.twitter   = v, '¿Es un perfil profesional?'));
      if (p.tiktok)    div.appendChild(makeField('TikTok',    p.tiktok,    v => p.tiktok    = v, 'Generalmente no se incluye en el CV'));
      bodyP.appendChild(div);
    }

    // datos innecesarios detectados
    const unnecessary = [
      [p.dni,         'DNI detectado',           'personal.dni',    'No es necesario incluirlo en el CV'],
      [p.cuil,        'CUIL / CUIT detectado',    'personal.cuil',   'Generalmente no se incluye'],
      [p.fechaNac,    'Fecha de nacimiento',       'personal.fechaNac','Cada vez menos requerida'],
      [p.edad,        'Edad detectada',            'personal.edad',   'Podés eliminarla si preferís'],
      [p.estadoCivil, 'Estado civil',              'personal.estadoCivil','Rara vez aporta valor'],
      [p.direccion,   'Dirección exacta',          'personal.direccion','Con ciudad y provincia es suficiente'],
      [p.cp,          'Código postal',             'personal.cp',     'No es necesario'],
      [p.nacionalidad,'Nacionalidad',              'personal.nacionalidad','Solo si el puesto lo requiere'],
    ].filter(([v]) => v);

    if (unnecessary.length) {
      const div = el('div');
      div.style.marginTop = '.6rem';
      const lbl = el('p', 'cvx-field-label', '⚠ Información que podría no ser necesaria');
      lbl.style.cssText = 'color:var(--cvx-yellow);margin-bottom:.4rem;';
      div.appendChild(lbl);
      unnecessary.forEach(([val, label, , warn]) => {
        div.appendChild(makeField(label, val, () => {}, warn));
      });
      bodyP.appendChild(div);
    }

    body.appendChild(secP);

    /* ── OBJETIVO / PERFIL ── */
    if (data.objetivo) {
      const secO = makeSection('cvx-sec-objetivo', '🎯', 'Perfil / Objetivo profesional');
      const bodyO = secO.querySelector('.cvx-section-body');
      const f   = el('div', 'cvx-field');
      const ta  = el('textarea', 'cvx-field-textarea');
      ta.value       = data.objetivo;
      ta.style.minHeight = '80px';
      ta.placeholder = 'Resumen o perfil profesional…';
      ta.addEventListener('input', () => { data.objetivo = ta.value; });
      f.appendChild(ta);
      bodyO.appendChild(f);
      body.appendChild(secO);
    }

    /* ── EXPERIENCIA ── */
    const secE = makeSection('cvx-sec-exp', '💼', 'Experiencia laboral');
    const bodyE = secE.querySelector('.cvx-section-body');

    if (!data.experiences.length) {
      bodyE.appendChild(el('p', 'cvx-field-label',
        'No se detectó experiencia laboral. Podés agregarla con el botón de abajo.'));
    }

    data.experiences.forEach(exp => {
      bodyE.appendChild(makeItemCard(exp, data.experiences, [
        ['Empresa',                  'empresa', 'Nombre de la empresa'],
        ['Puesto / Cargo',           'puesto',  'Puesto o cargo'],
        ['Fechas (ej: 2021–2024)',   'fechas',  '2021 – 2024'],
      ], true));
    });

    const addExpBtn = el('button', 'cvx-btn-add-item', '＋ Agregar experiencia');
    addExpBtn.type = 'button';
    addExpBtn.addEventListener('click', () => {
      const newExp = { empresa: '', puesto: '', fechas: '', tareas: '' };
      data.experiences.push(newExp);
      const card = makeItemCard(newExp, data.experiences, [
        ['Empresa',                  'empresa', 'Nombre de la empresa'],
        ['Puesto / Cargo',           'puesto',  'Puesto o cargo'],
        ['Fechas (ej: 2021–2024)',   'fechas',  '2021 – 2024'],
      ], true);
      bodyE.insertBefore(card, addExpBtn);
      // activar edición automáticamente
      if (!secE.classList.contains('is-editing')) {
        secE.classList.add('is-editing');
        secE.querySelector('.cvx-btn-edit-section').textContent = '✔ Listo';
      }
    });
    bodyE.appendChild(addExpBtn);
    body.appendChild(secE);

    /* ── EDUCACIÓN ── */
    const secEd = makeSection('cvx-sec-edu', '🎓', 'Formación y estudios');
    const bodyEd = secEd.querySelector('.cvx-section-body');

    if (!data.education.length) {
      bodyEd.appendChild(el('p', 'cvx-field-label',
        'No se detectó formación. Podés agregarla con el botón de abajo.'));
    }

    data.education.forEach(edu => {
      bodyEd.appendChild(makeItemCard(edu, data.education, [
        ['Título / Carrera / Curso', 'titulo',       'Ej: Licenciatura en Marketing'],
        ['Institución',              'institucion',  'Ej: Universidad de Buenos Aires'],
        ['Año de egreso',            'anio',         'Ej: 2020'],
      ], false));
    });

    const addEduBtn = el('button', 'cvx-btn-add-item', '＋ Agregar estudio o curso');
    addEduBtn.type = 'button';
    addEduBtn.addEventListener('click', () => {
      const newEdu = { titulo: '', institucion: '', anio: '' };
      data.education.push(newEdu);
      const card = makeItemCard(newEdu, data.education, [
        ['Título / Carrera / Curso', 'titulo',       ''],
        ['Institución',              'institucion',  ''],
        ['Año de egreso',            'anio',         ''],
      ], false);
      bodyEd.insertBefore(card, addEduBtn);
      if (!secEd.classList.contains('is-editing')) {
        secEd.classList.add('is-editing');
        secEd.querySelector('.cvx-btn-edit-section').textContent = '✔ Listo';
      }
    });
    bodyEd.appendChild(addEduBtn);
    body.appendChild(secEd);

    /* ── HABILIDADES ── */
    const secSk = makeSection('cvx-sec-skills', '⚡', 'Habilidades');
    const bodySk = secSk.querySelector('.cvx-section-body');

    const hLbl = el('p', 'cvx-field-label', 'Habilidades técnicas');
    hLbl.style.marginBottom = '.4rem';
    bodySk.appendChild(hLbl);
    bodySk.appendChild(makePillsEditor(data.skills.hard, '', 'Agregar habilidad técnica'));

    const sLbl = el('p', 'cvx-field-label', 'Habilidades blandas');
    sLbl.style.cssText = 'margin-top:.75rem;margin-bottom:.4rem;';
    bodySk.appendChild(sLbl);
    bodySk.appendChild(makePillsEditor(data.skills.soft, 'soft', 'Agregar habilidad blanda'));

    body.appendChild(secSk);

    /* ── IDIOMAS ── */
    const secLn = makeSection('cvx-sec-idiomas', '🌐', 'Idiomas');
    const bodyLn = secLn.querySelector('.cvx-section-body');
    bodyLn.appendChild(makePillsEditor(data.idiomas, 'tool', 'Agregar idioma'));
    body.appendChild(secLn);
  }

  /* ─────────────────────────────────────────────────────────────
     14. ACCIONES DEL PANEL CONFIRMAR
  ───────────────────────────────────────────────────────────── */
  $('cvx-btn-back-confirm').addEventListener('click', () => {
    // volver a donde corresponde según si hubo foto
    if (S.hasPhoto) {
      showPanel('cvx-p-foto');
    } else {
      showPanel('cvx-p-upload');
    }
  });

  $('cvx-btn-generate').addEventListener('click', () => {
    buildResults(S.data);
    showPanel('cvx-p-results');
  });

  /* ─────────────────────────────────────────────────────────────
     15. MOTOR DE ANÁLISIS — reglas reales, sin inventar
     Calcula el score y genera las recomendaciones basadas
     únicamente en lo que S.data contiene.
  ───────────────────────────────────────────────────────────── */

  function isUnprofessionalEmail(email) {
    if (!email) return false;
    const local = email.split('@')[0].toLowerCase();
    const badWords = [
      'princesa','dragon','gamer','killer','sexy','nena','bebe','gordo',
      'loco','crack','tato','pepe','cheto','wacho','pibe','linda','divina',
      'corazon','amor','chica','chico','nene','gurisa','guriso','bonita',
      'reina','rey','boss','pro','elite','vip','cool','hot','fire',
    ];
    const hasBadWord = badWords.some(w => local.includes(w));
    const hasManyNumbers = (local.match(/\d/g) || []).length >= 4;
    return hasBadWord || hasManyNumbers;
  }

  function buildResults(data) {
    const body = $('cvx-results-body');
    body.innerHTML = '';

    const p    = data.personal;
    const recs = [];
    let score  = 100;

    /* ── REGLAS DE CONTACTO ── */
    if (!p.email) {
      score -= 12;
      recs.push({ type: 'error', cat: 'Contacto',
        title: 'No se detectó un correo electrónico',
        body:  'El correo es el dato de contacto más importante. Asegurate de que esté visible al inicio del CV.' });
    } else if (isUnprofessionalEmail(p.email)) {
      score -= 6;
      recs.push({ type: 'warn', cat: 'Contacto',
        title: 'El correo puede no verse profesional',
        body:  `Se detectó <strong>${p.email}</strong>. Considerá usar una dirección del estilo <em>nombre.apellido@gmail.com</em> para dar mejor imagen.` });
    } else {
      recs.push({ type: 'ok', cat: 'Contacto',
        title: 'Correo electrónico detectado',
        body:  `<strong>${p.email}</strong> — Se ve profesional.` });
    }

    if (!p.phone) {
      score -= 5;
      recs.push({ type: 'warn', cat: 'Contacto',
        title: 'No se detectó teléfono o celular',
        body:  'Muchos reclutadores contactan por WhatsApp o llamada. Agregar un número de contacto facilita el proceso.' });
    }

    if (p.linkedin) {
      recs.push({ type: 'ok', cat: 'Contacto',
        title: 'LinkedIn detectado',
        body:  'Es un punto positivo. Asegurate de que tu perfil esté actualizado y sea coherente con el CV.' });
    } else {
      recs.push({ type: 'info', cat: 'Contacto',
        title: 'No se detectó LinkedIn',
        body:  'No es obligatorio, pero para muchos rubros agrega valor. Si tenés perfil, considerá incluir el link.' });
    }

    if (p.github) {
      recs.push({ type: 'ok', cat: 'Contacto',
        title: 'GitHub detectado',
        body:  'Muy útil para perfiles técnicos. Asegurate de que tenga proyectos o actividad visible.' });
    }

    /* ── REGLAS DE DATOS INNECESARIOS ── */
    if (p.dni) {
      score -= 5;
      recs.push({ type: 'warn', cat: 'Privacidad',
        title: 'DNI incluido en el CV',
        body:  `Se detectó <strong>${p.dni}</strong>. No es necesario incluirlo salvo que la empresa lo solicite expresamente. Quitarlo mejora tu privacidad.` });
    }

    if (p.cuil) {
      score -= 3;
      recs.push({ type: 'warn', cat: 'Privacidad',
        title: 'CUIL / CUIT incluido en el CV',
        body:  'Similar al DNI, este dato generalmente no se incluye en el CV. Podés eliminarlo sin problema.' });
    }

    if (p.direccion) {
      score -= 4;
      recs.push({ type: 'warn', cat: 'Privacidad',
        title: 'Dirección exacta detectada',
        body:  `Se detectó: <em>${p.direccion}</em>. Con ciudad y provincia es más que suficiente. La dirección exacta no agrega valor y expone información innecesaria.` });
    }

    if (p.fechaNac || p.edad) {
      score -= 3;
      recs.push({ type: 'info', cat: 'Datos personales',
        title: 'Fecha de nacimiento o edad detectada',
        body:  'Cada vez más empresas no solicitan esta información. Podés eliminarla para mantener el CV más enfocado.' });
    }

    if (p.estadoCivil) {
      score -= 2;
      recs.push({ type: 'info', cat: 'Datos personales',
        title: 'Estado civil detectado',
        body:  `Se detectó: <em>${p.estadoCivil}</em>. El estado civil rara vez aporta valor al proceso de selección.` });
    }

    /* ── REDES SOCIALES PERSONALES ── */
    if (p.instagram) {
      score -= 2;
      recs.push({ type: 'warn', cat: 'Redes sociales',
        title: 'Se detectó Instagram',
        body:  `Se encontró <strong>${p.instagram}</strong>. Si es un perfil personal, es mejor no incluirlo. Si es profesional (fotógrafo, diseñador, etc.), aclaralo en el CV.` });
    }
    if (p.facebook) {
      score -= 2;
      recs.push({ type: 'warn', cat: 'Redes sociales',
        title: 'Se detectó Facebook',
        body:  'Facebook generalmente no se incluye en el CV a menos que sea una página profesional o de negocio.' });
    }
    if (p.twitter) {
      recs.push({ type: 'info', cat: 'Redes sociales',
        title: 'Se detectó Twitter / X',
        body:  'Si es un perfil profesional activo, puede quedar. Si es personal, es mejor omitirlo.' });
    }
    if (p.tiktok) {
      score -= 2;
      recs.push({ type: 'warn', cat: 'Redes sociales',
        title: 'Se detectó TikTok',
        body:  'Solo incluirlo si tiene contenido directamente relacionado con el rubro en el que buscás trabajo.' });
    }

    /* ── REGLAS DE EXPERIENCIA ── */
    if (!data.experiences.length) {
      score -= 20;
      recs.push({ type: 'error', cat: 'Experiencia',
        title: 'No se detectó experiencia laboral',
        body:  'Si tenés experiencia, revisá que el CV use un formato estándar. Si es tu primer empleo, podés incluir voluntariados, proyectos personales o trabajos informales.' });
    } else {
      const sinFechas = data.experiences.filter(e => !e.fechas);
      if (sinFechas.length) {
        score -= 5;
        recs.push({ type: 'warn', cat: 'Experiencia',
          title: `${sinFechas.length} experiencia${sinFechas.length > 1 ? 's' : ''} sin fechas`,
          body:  'Incluir las fechas de inicio y fin de cada trabajo ayuda al reclutador a entender tu trayectoria.' });
      }

      const sinTareas = data.experiences.filter(e => !e.tareas || e.tareas.trim().length < 15);
      if (sinTareas.length) {
        score -= 8;
        recs.push({ type: 'warn', cat: 'Experiencia',
          title: `${sinTareas.length} experiencia${sinTareas.length > 1 ? 's sin descripción' : ' sin descripción'}`,
          body:  'Describir las tareas y responsabilidades de cada puesto es clave. Si podés agregar logros concretos o resultados medibles, mejor todavía.' });
      } else {
        // ¿hay logros con números?
        const conLogros = data.experiences.filter(e =>
          e.tareas && /\d+\s*%|\d+\s*(?:clientes|ventas|usuarios|proyectos|personas|empleados|productos)/i.test(e.tareas)
        );
        if (conLogros.length) {
          recs.push({ type: 'ok', cat: 'Experiencia',
            title: 'Experiencia con logros cuantificables detectados',
            body:  'Incluir resultados concretos (porcentajes, números, cantidades) es una de las prácticas más efectivas en un CV.' });
        } else {
          recs.push({ type: 'ok', cat: 'Experiencia',
            title: 'Experiencia descripta con tareas',
            body:  'La experiencia tiene descripción. Para fortalecerla aún más, considerá agregar logros concretos: ej. "Aumenté ventas un 20%" o "Gestioné un equipo de 5 personas".' });
        }
      }
    }

    /* ── REGLAS DE EDUCACIÓN ── */
    if (!data.education.length) {
      score -= 10;
      recs.push({ type: 'warn', cat: 'Formación',
        title: 'No se detectó formación académica',
        body:  'Aunque no siempre es obligatorio, incluir tus estudios (aunque sea el secundario) aporta contexto. Podés editarlo en la sección anterior.' });
    } else {
      const cursos = data.education.filter(e =>
        /curso|taller|capacitaci[oó]n|certificad|diplomatura|seminario/i.test(e.titulo)
      );
      if (cursos.length) {
        recs.push({ type: 'ok', cat: 'Formación',
          title: `Se detectaron ${cursos.length} curso${cursos.length > 1 ? 's' : ''} o capacitación`,
          body:  'La formación continua es valorada positivamente por los reclutadores.' });
      }
      recs.push({ type: 'ok', cat: 'Formación',
        title: 'Formación académica detectada',
        body:  'Tu CV incluye información sobre tus estudios. Verificá que los años y las instituciones sean correctos.' });
    }

    /* ── REGLAS DE HABILIDADES ── */
    const totalSkills = data.skills.hard.length + data.skills.soft.length;
    if (totalSkills === 0) {
      score -= 10;
      recs.push({ type: 'error', cat: 'Habilidades',
        title: 'No se detectaron habilidades',
        body:  'Una sección de habilidades ayuda a los sistemas ATS a indexar tu perfil. Incluí tanto técnicas como interpersonales.' });
    } else if (data.skills.hard.length === 0) {
      score -= 5;
      recs.push({ type: 'warn', cat: 'Habilidades',
        title: 'Solo se detectaron habilidades blandas',
        body:  'Complementar con habilidades técnicas (programas, herramientas, idiomas, certificaciones) hace el CV más completo.' });
    } else if (data.skills.soft.length === 0) {
      recs.push({ type: 'warn', cat: 'Habilidades',
        title: 'Solo se detectaron habilidades técnicas',
        body:  'Agregar algunas habilidades interpersonales (trabajo en equipo, comunicación, liderazgo, etc.) equilibra el perfil.' });
    } else if (totalSkills < 5) {
      score -= 3;
      recs.push({ type: 'warn', cat: 'Habilidades',
        title: 'Pocas habilidades detectadas',
        body:  `Se detectaron solo ${totalSkills} habilidades. Ampliar esta sección mejora tanto la lectura humana como la compatibilidad ATS.` });
    } else {
      recs.push({ type: 'ok', cat: 'Habilidades',
        title: `${totalSkills} habilidades detectadas`,
        body:  'El CV tiene una buena variedad de habilidades técnicas e interpersonales.' });
    }

    /* ── REGLAS DE IDIOMAS ── */
    if (data.idiomas.length) {
      recs.push({ type: 'ok', cat: 'Idiomas',
        title: `Idiomas detectados: ${data.idiomas.slice(0, 3).join(', ')}`,
        body:  'Bien. Asegurate de que el nivel de cada idioma esté indicado (básico, intermedio, avanzado, nativo).' });
    }
    // Si no hay idiomas, no penalizar → puede ser un CV de rubro donde no importa

    /* ── REGLAS DE DISEÑO ── */
    if (data.hasPhoto) {
      recs.push({ type: 'info', cat: 'Diseño',
        title: 'Se detectó una foto en el CV',
        body:  'En Argentina es común pero no obligatorio. Los sistemas ATS ignoran las imágenes del documento. Asegurate de que sea una foto profesional (fondo liso, buena iluminación, ropa apropiada).' });
    }

    if (data.designIssues.includes('columnas')) {
      score -= 3;
      recs.push({ type: 'warn', cat: 'Diseño y ATS',
        title: 'Se detectaron columnas o diseño en múltiples columnas',
        body:  'Algunos sistemas ATS leen el texto de izquierda a derecha y pueden mezclar columnas, alterando el orden del contenido. Un diseño de una sola columna es más compatible.' });
    }

    if (data.designIssues.includes('tablas')) {
      score -= 3;
      recs.push({ type: 'warn', cat: 'Diseño y ATS',
        title: 'Se detectaron posibles tablas en el documento',
        body:  'Las tablas pueden ser interpretadas de formas inesperadas por los sistemas ATS. Considerá reemplazarlas por texto simple.' });
    }

    if (data.designIssues.includes('iconos-excesivos')) {
      score -= 2;
      recs.push({ type: 'warn', cat: 'Diseño y ATS',
        title: 'Exceso de íconos o símbolos decorativos',
        body:  'Los íconos decorativos pueden ser ignorados o mal interpretados por los ATS. Usarlos con moderación o eliminarlos mejora la legibilidad automática.' });
    }

    if (data.designIssues.includes('muchas-paginas')) {
      score -= 3;
      recs.push({ type: 'warn', cat: 'Diseño',
        title: `El CV tiene ${data.pageCount} páginas`,
        body:  'Para la mayoría de los puestos, se recomienda que el CV no supere 2 páginas. Revisá si podés sintetizar alguna sección.' });
    }

    if (data.designIssues.includes('barras-graficas')) {
      score -= 2;
      recs.push({ type: 'warn', cat: 'Diseño y ATS',
        title: 'Se detectaron posibles barras gráficas o indicadores visuales',
        body:  'Las barras de nivel para habilidades o idiomas no son interpretadas correctamente por los ATS. Preferí describirlos con palabras (básico, avanzado, etc.).' });
    }

    /* ── OBJETIVO PROFESIONAL ── */
    if (data.objetivo) {
      recs.push({ type: 'ok', cat: 'Estructura',
        title: 'Se detectó un perfil o resumen profesional',
        body:  'Tener un resumen al inicio es una buena práctica: permite al reclutador entender tu perfil en segundos.' });
    } else {
      recs.push({ type: 'info', cat: 'Estructura',
        title: 'No se detectó un perfil o resumen profesional',
        body:  'Agregar 2-3 líneas de presentación al inicio del CV puede captar la atención del reclutador rápidamente.' });
    }

    /* ── CANTIDAD DE PÁGINAS (para PDF) ── */
    if (data.pageCount === 1) {
      recs.push({ type: 'ok', cat: 'Diseño',
        title: 'CV de una página',
        body:  'Para perfiles junior o con poca experiencia, una página es ideal.' });
    }

    // Score final (mínimo 10)
    score = Math.max(10, Math.round(score));

    /* ── RENDER DEL PANEL ── */
    renderResultsUI(body, data, recs, score);
  }

  /* ─────────────────────────────────────────────────────────────
     16. RENDER DE RESULTADOS
  ───────────────────────────────────────────────────────────── */
  function renderResultsUI(body, data, recs, score) {
    const p = data.personal;

    /* ── SCORE RING ── */
    const scoreWrap = el('div', 'cvx-score-wrap');
    scoreWrap.innerHTML = `
      <div class="cvx-ring-container">
        <svg class="cvx-ring-svg" viewBox="0 0 140 140">
          <circle class="cvx-ring-track"    cx="70" cy="70" r="58"/>
          <circle class="cvx-ring-progress" cx="70" cy="70" r="58" id="cvx-ring-prog"/>
        </svg>
        <div class="cvx-ring-center">
          <span class="cvx-ring-num" id="cvx-ring-num">0</span>
          <span class="cvx-ring-lbl">/ 100</span>
        </div>
      </div>
      <p class="cvx-score-caption" id="cvx-score-cap"></p>`;
    body.appendChild(scoreWrap);

    // animar después del render
    setTimeout(() => {
      const ring   = $('cvx-ring-prog');
      const numEl  = $('cvx-ring-num');
      const capEl  = $('cvx-score-cap');
      const circ   = 2 * Math.PI * 58; // ≈ 364
      ring.style.strokeDasharray  = circ;
      ring.style.strokeDashoffset = circ;
      let cur = 0;
      const iv = setInterval(() => {
        cur = Math.min(cur + score / 60, score);
        numEl.textContent = Math.round(cur);
        ring.style.strokeDashoffset = circ - (cur / 100) * circ;
        if (cur >= score) {
          clearInterval(iv);
          numEl.style.color = score >= 75
            ? 'var(--cvx-green)'
            : score >= 50
            ? 'var(--cvx-dusk)'
            : 'var(--cvx-red)';
        }
      }, 20);

      if      (score >= 80) capEl.textContent = 'Tu CV está en muy buen estado. Los ajustes son menores.';
      else if (score >= 65) capEl.textContent = 'Buena base. Hay algunos puntos que podés mejorar para destacarte.';
      else if (score >= 45) capEl.textContent = 'El CV tiene potencial pero necesita ajustes importantes.';
      else                  capEl.textContent = 'Hay varios aspectos para trabajar. Las sugerencias de abajo te guían paso a paso.';
    }, 200);

    /* ── GRID DE CATEGORÍAS ── */
    const catsData = [
      {
        icon: '👤', name: 'Datos de contacto',
        status: (!p.email || !p.phone) ? 'bad'
               : isUnprofessionalEmail(p.email) ? 'warn' : 'ok',
      },
      {
        icon: '💼', name: 'Experiencia',
        status: !data.experiences.length ? 'bad'
               : data.experiences.some(e => !e.tareas || e.tareas.length < 15) ? 'warn' : 'ok',
      },
      {
        icon: '🎓', name: 'Formación',
        status: !data.education.length ? 'bad' : 'ok',
      },
      {
        icon: '⚡', name: 'Habilidades',
        status: (data.skills.hard.length + data.skills.soft.length) === 0 ? 'bad'
               : (!data.skills.hard.length || !data.skills.soft.length) ? 'warn' : 'ok',
      },
      {
        icon: '🌐', name: 'Idiomas',
        status: data.idiomas.length ? 'ok' : 'warn',
      },
      {
        icon: '🔒', name: 'Privacidad',
        status: (p.dni || p.cuil || p.direccion || p.fechaNac || p.estadoCivil) ? 'warn' : 'ok',
      },
      {
        icon: '🖼️', name: 'Foto / Diseño',
        status: (data.designIssues.length > 1) ? 'warn'
               : data.hasPhoto ? 'warn' : 'ok',
      },
      {
        icon: '📡', name: 'Compatibilidad ATS',
        status: score >= 70 ? 'ok' : score >= 50 ? 'warn' : 'bad',
      },
    ];

    const statusLabel = { ok: '✔ Correcto', warn: '⚠ Puede mejorarse', bad: '❌ Requiere atención' };
    const catsWrap = el('div', 'cvx-cats');
    catsData.forEach((c, i) => {
      const card = el('div', 'cvx-cat');
      card.style.animationDelay = (i * 55) + 'ms';
      card.innerHTML = `
        <span class="cvx-cat-icon">${c.icon}</span>
        <div>
          <div class="cvx-cat-name">${c.name}</div>
          <div class="cvx-cat-status ${c.status}">${statusLabel[c.status]}</div>
        </div>`;
      catsWrap.appendChild(card);
    });
    body.appendChild(catsWrap);

    /* ── PALABRAS CLAVE ── */
    buildKeywordsBlock(body, data);

    /* ── RECOMENDACIONES ── */
    const recsTitle = el('p', 'cvx-recs-title', '✦ Análisis detallado y recomendaciones');
    body.appendChild(recsTitle);

    const badgeLabel = { ok: '✔ Bien', warn: '⚠ Atención', error: '❌ Falta', info: 'ℹ Info' };
    recs.forEach((r, i) => {
      const rec = el('div', 'cvx-rec');
      rec.style.animationDelay = (i * 55) + 'ms';
      rec.innerHTML = `
        <div class="cvx-rec-head">
          <span class="cvx-rec-badge ${r.type}">${badgeLabel[r.type]}</span>
          <span class="cvx-rec-title-txt">${r.cat} — ${r.title}</span>
        </div>
        <p class="cvx-rec-body">${r.body}</p>`;
      body.appendChild(rec);
    });

    /* ── RESTART ── */
    const restartRow = el('div', 'cvx-restart-row');
    const restartBtn = el('button', 'cvx-btn-restart', '↩ Analizar otro CV');
    restartBtn.id   = 'cvx-btn-restart';
    restartBtn.type = 'button';
    restartBtn.addEventListener('click', resetAll);
    restartRow.appendChild(restartBtn);
    body.appendChild(restartRow);
  }

  /* ─────────────────────────────────────────────────────────────
     17. KEYWORDS — basadas en el contenido real del CV
  ───────────────────────────────────────────────────────────── */
  function buildKeywordsBlock(body, data) {
    const allText = [
      ...data.experiences.map(e => (e.tareas || '') + ' ' + (e.puesto || '')),
      ...data.education.map(e => e.titulo || ''),
      data.objetivo || '',
      ...data.skills.hard,
      ...data.skills.soft,
    ].join(' ').toLowerCase();

    // Keywords encontradas = lo que ya tiene
    const found = [...new Set([
      ...data.skills.hard,
      ...data.skills.soft,
      ...data.idiomas,
      ...data.tools,
    ])].filter(Boolean).slice(0, 18);

    if (!found.length) return;

    // Sugerencias según perfil detectado heurísticamente
    const isTech      = /(?:develop|programad|software|web|python|javascript|sql|git|cloud|devops|data)/i.test(allText);
    const isAdmin     = /(?:administrat|contab|factur|secretar|recepcion|data\s*entry)/i.test(allText);
    const isDesign    = /(?:diseñad|figma|photoshop|illustrator|canva|ux|ui|branding)/i.test(allText);
    const isSales     = /(?:ventas|comercial|cliente|vender|captaci[oó]n|cartera)/i.test(allText);
    const isGastro    = /(?:cocin|gastronom|restaurant|mozo|barista|chef|panadero)/i.test(allText);
    const isHealth    = /(?:enfermer|médic|salud|hospital|clínica|paciente|farmacia)/i.test(allText);
    const isConstruct = /(?:electricist|plomero|albanil|construcci[oó]n|soldad|mecanic)/i.test(allText);
    const isEdu       = /(?:docente|maestra|profesor|educaci[oó]n|pedagog|enseñanza)/i.test(allText);
    const isLogistic  = /(?:logística|depósito|almacén|stock|inventario|transporte|chofer)/i.test(allText);

    let suggest = [];
    if (isTech)       suggest = ['API','metodologías ágiles','Scrum','testing','CI/CD','documentación','arquitectura','microservicios'];
    else if (isAdmin) suggest = ['gestión administrativa','CRM','Excel avanzado','facturación','coordinación','reportes','soporte operativo'];
    else if (isDesign)suggest = ['identidad visual','UX research','prototipado','design system','handoff','animación','motion'];
    else if (isSales) suggest = ['captación de clientes','CRM','seguimiento','cierre de ventas','negociación','fidelización','KPIs'];
    else if (isGastro)suggest = ['HACCP','BPM','higiene alimentaria','mise en place','servicio al cliente','trabajo en equipo','eficiencia'];
    else if (isHealth)suggest = ['protocolo clínico','historial médico','atención al paciente','trabajo bajo presión','guardia','turno rotativo'];
    else if (isConstruct) suggest = ['planos','seguridad e higiene','EPP','mantenimiento preventivo','herramental','cronograma de obra'];
    else if (isEdu)   suggest = ['planificación curricular','evaluación','adaptación pedagógica','inclusión','TIC en educación','tutoría'];
    else if (isLogistic) suggest = ['cadena de suministro','control de stock','picking','packing','WMS','trazabilidad','entrega'];
    else                suggest = ['comunicación efectiva','trabajo en equipo','resolución de problemas','gestión de tiempo','orientación a resultados'];

    // quitar las que ya están en el CV
    const usedLower = found.map(f => f.toLowerCase());
    suggest = suggest.filter(s => !usedLower.some(u => u.includes(s.toLowerCase()))).slice(0, 7);

    if (!found.length && !suggest.length) return;

    const sec = el('div', 'cvx-kw-block');

    if (found.length) {
      sec.appendChild(el('p', 'cvx-kw-title', '🔑 Palabras clave detectadas'));
      const row = el('div', 'cvx-kw-row');
      found.forEach(k => row.appendChild(el('span', 'cvx-kw found', k)));
      sec.appendChild(row);
    }

    if (suggest.length) {
      sec.appendChild(el('p', 'cvx-kw-title', '💡 Palabras que podrías incorporar'));
      const row2 = el('div', 'cvx-kw-row');
      suggest.forEach(k => row2.appendChild(el('span', 'cvx-kw suggest', k)));
      sec.appendChild(row2);
    }

    body.appendChild(sec);
  }

  /* ─────────────────────────────────────────────────────────────
     18. RESET COMPLETO
  ───────────────────────────────────────────────────────────── */
  function resetAll() {
    S.file       = null;
    S.rawText    = '';
    S.pageCount  = 0;
    S.hasPhoto   = false;
    S.hasColumns = false;
    S.hasTable   = false;
    S.data       = null;

    removeFile();
    $('cvx-load-bar').style.width = '0%';
    $('cvx-confirm-body').innerHTML = '';
    $('cvx-results-body').innerHTML = '';

    showPanel('cvx-p-upload');
  }

  /* ─────────────────────────────────────────────────────────────
     19. INIT — arranque limpio
  ───────────────────────────────────────────────────────────── */
  showPanel('cvx-p-upload');

})();