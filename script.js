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