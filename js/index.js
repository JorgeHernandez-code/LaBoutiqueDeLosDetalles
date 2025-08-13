'use strict';

/* ===== Splash home ===== */
const hasSplash = !!document.getElementById('splash');
if (hasSplash) document.body.classList.add('splash-lock');

window.addEventListener('load', () => {
  if (!hasSplash) return;
  const splash = document.getElementById('splash');
  const line = document.getElementById('splashLine');

  const phrases = [
    "Regalos que enamoran",
    "Detalles que inspiran",
    "Pequeños detalles, grandes sonrisas"
  ];
  const text = phrases[Math.floor(Math.random() * phrases.length)];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    line.textContent = text;
    setTimeout(() => {
      splash.classList.add('hide');
      document.body.classList.remove('splash-lock');
    }, 600);
    return;
  }

  const speed = 45;
  let i = 0;
  (function type() {
    if (i <= text.length) {
      line.textContent = text.slice(0, i++);
      setTimeout(type, speed);
    } else {
      setTimeout(() => {
        splash.classList.add('hide');
        document.body.classList.remove('splash-lock');
      }, 400);
    }
  })();
});

/* Seguridad base */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('modal-open');
  if (!hasSplash) document.body.classList.remove('splash-lock');
});

/* ===== Página ===== /
document.addEventListener('DOMContentLoaded', () => {
/ Menú activo por sección */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');

function setActive() {
  let current = '';
  const top = window.scrollY + 120;
  sections.forEach(sec => {
    if (top >= sec.offsetTop && top < sec.offsetTop + sec.offsetHeight) current = sec.id;
  });
  navLinks.forEach(a =>
    a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`)
  );
}
setActive();
window.addEventListener('scroll', setActive);

/* Parallax */
const bannerEl = document.querySelector('.banner');
window.addEventListener('scroll', () => {
  if (!bannerEl) return;
  bannerEl.style.setProperty('--parallax', (window.scrollY * 0.08) + 'px');
});

/* Slider del banner + sincronizar fondo difuminado */
let currentBanner = 0;
const slides = document.querySelectorAll('.slider .slide');
function setHeroBgFromActive() {
  if (!slides.length || !bannerEl) return;
  const img = slides[currentBanner].querySelector('img');
  if (img && img.src) bannerEl.style.setProperty('--banner-bg', `url("${img.src}")`);
}
if (slides.length) {
  setHeroBgFromActive();
  setInterval(() => {
    slides[currentBanner].classList.remove('active');
    currentBanner = (currentBanner + 1) % slides.length;
    slides[currentBanner].classList.add('active');
    setHeroBgFromActive();
  }, 6000);
}

/* Reveal de títulos */
const revObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach(el => revObserver.observe(el));

/* Sliders de tarjetas (rotación) */
document.querySelectorAll('.product-slider').forEach(slider => {
  const images = slider.querySelectorAll('img');
  if (!images.length) return;
  let i = 0;
  setInterval(() => {
    images[i].classList.remove('active');
    i = (i + 1) % images.length;
    images[i].classList.add('active');
  }, 3000);
});

/* Aparición de product-cards */
const cards = document.querySelectorAll('.product-card');
const cardsObs = new IntersectionObserver((entries, obs) => {
  entries.forEach((e, idx) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in-view'), idx * 80);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
cards.forEach(c => cardsObs.observe(c));

/* Aparición general (data-animate) */
const animElements = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
animElements.forEach(el => observer.observe(el));

/* Header shrink */
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  header.classList.toggle('shrink', window.scrollY > 50);
});

/* ====== MODAL DE IMÁGENES (Lightbox) ====== */
let grupoActual = [];
let indiceActual = 0;

const modal = document.getElementById('modalImagen');
const imagenModal = document.getElementById('imagenModal');

function mostrarImagen() {
  if (!grupoActual.length) return;
  const img = grupoActual[indiceActual];
  if (!img) return;
  imagenModal.src = img.getAttribute('src');
  imagenModal.alt = img.getAttribute('alt') || 'Producto';
}

function abrirModalDesdeCard(card, index = null) {
  if (!modal || !imagenModal) return;// 1) Tomar el grupo de imágenes de la tarjeta
  const imgsSlider = card.querySelectorAll('.product-slider img');
  const imgUnica = card.querySelector('img.single-img');

  if (imgsSlider.length) {
    grupoActual = Array.from(imgsSlider);
  } else if (imgUnica) {
    grupoActual = [imgUnica];
  } else {
    grupoActual = [];
  }

  // 2) Definir índice inicial
  if (index !== null && index >= 0) {
    indiceActual = index;
  } else {
    const idxActiva = grupoActual.findIndex(i => i.classList.contains('active'));
    indiceActual = idxActiva >= 0 ? idxActiva : 0;
  }

  // 3) Mostrar y abrir
  mostrarImagen();
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('show'));
  document.body.classList.add('modal-open');
}

function cambiarImagen(step) {
  if (!grupoActual.length) return;
  const total = grupoActual.length;
  indiceActual = (indiceActual + step + total) % total;
  mostrarImagen();
}

function cerrarModalImagen() {
  if (!modal) return;
  modal.classList.remove('show');
  setTimeout(() => (modal.style.display = 'none'), 200);
  document.body.classList.remove('modal-open');
}

// Abrir modal al hacer clic en cualquier tarjeta
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', e => {
    const imgs = Array.from(card.querySelectorAll('.product-slider img'));
    const clickedImg = e.target.closest('img'); if (clickedImg && imgs.includes(clickedImg)) {
      abrirModalDesdeCard(card, imgs.indexOf(clickedImg));
    } else {
      abrirModalDesdeCard(card);
    }
  });

  // Accesible por teclado
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  });
});

// También permitir abrir haciendo clic directo en cada imagen del slider
document.querySelectorAll('.product-slider img').forEach((img) => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', e => {
    e.stopPropagation();
    const card = img.closest('.product-card');
    if (!card) return;
    const grupo = Array.from(img.closest('.product-slider').querySelectorAll('img'));
    abrirModalDesdeCard(card, grupo.indexOf(img));
  });
});

// Cerrar al hacer clic fuera de la imagen
if (modal) {
  modal.addEventListener('click', e => {
    const contenido = e.target.closest('.modal-img-content');
    if (!contenido) cerrarModalImagen();
  });
}

// Teclado: ← → y Esc
window.addEventListener('keydown', e => {
  if (!modal || modal.style.display !== 'flex') return;
  if (e.key === 'ArrowLeft') cambiarImagen(-1);
  if (e.key === 'ArrowRight') cambiarImagen(1);
  if (e.key === 'Escape') cerrarModalImagen();
});

// Exponer funciones globales para los botones del HTML
window.cambiarImagen = cambiarImagen;
window.cerrarModalImagen = cerrarModalImagen;

/* ===== Catálogo desde JSON (si existe) ===== */
const grid = document.getElementById('catalogGrid');
if (grid) {
  const input = document.getElementById('catSearch');
  const sel = document.getElementById('catFilter');
  let productos = [];
  let cardsList = [];
  fetch('json/productos.json')
    .then(r => r.json())
    .then(data => { productos = data; render(data); hookClicks(); applyFilters(); })
    .catch(err => console.error('Error cargando productos.json', err));

  function render(items) {
    grid.innerHTML = items.map(p => {
      const img = (p.imagenes && p.imagenes[0]) || '';
      const tit = (p.titulo || '').replace(/"/g, '&quot;');
      return (
        '<a class="cat-card wm" data-title="' + tit + '" data-cat="' + p.categoria + '" data-id="' + p.id + '" tabindex="0">' +
        '<img src="' + img + '" alt="' + tit + '" loading="lazy">' +
        '<span class="label">' + tit + '</span>' +
        '</a>'
      );
    }).join('');
    cardsList = Array.from(grid.querySelectorAll('.cat-card'));
  }

  function visibles() { return cardsList.filter(c => !c.classList.contains('hide')); }

  function applyFilters() {
    const q = (input && input.value || '').trim().toLowerCase();
    const cat = (sel && sel.value) || 'todas';
    cardsList.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const c = card.getAttribute('data-cat');
      const matchText = !q || title.includes(q);
      const matchCat = (cat === 'todas') || c === cat;
      card.classList.toggle('hide', !(matchText && matchCat));
    });
  }
  if (input) input.addEventListener('input', applyFilters);
  if (sel) sel.addEventListener('change', applyFilters);

  function hookClicks() {
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.cat-card'); if (!card) return;
      const id = card.getAttribute('data-id');
      const list = visibles();
      window.__catalogImgs = list.map(c => c.querySelector('img'));
      let catIndex = list.indexOf(card);

      const p = productos.find(x => String(x.id) === String(id));
      if (p && Array.isArray(p.imagenes) && p.imagenes.length > 1) {
        window.__catalogImgs = p.imagenes.map(src => { const im = new Image(); im.src = src; return im; });
        catIndex = 0;
      }
      // Abrir modal usando el set del catálogo
      if (window.__catalogImgs && window.__catalogImgs.length) {
        imagenModal.src = window.__catalogImgs[catIndex].src;
        modal.style.display = 'flex';
        requestAnimationFrame(() => modal.classList.add('show'));
        document.body.classList.add('modal-open');

        // Navegación con flechas en catálogo
        grupoActual = window.__catalogImgs;
        indiceActual = catIndex;
        mostrarImagen();
      }
    });

    grid.addEventListener('keydown', (e) => {
      const card = e.target.closest('.cat-card');
      if (!card) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  } // <-- cierra hookClicks()

} // <-- cierra if (grid)


/* ===== Menú móvil ===== */
function toggleMenu() {
  const el = document.getElementById('mainMenu');
  el.classList.toggle('show');
  const btn = document.querySelector('.menu-toggle');
  if (btn) btn.setAttribute('aria-expanded', el.classList.contains('show') ? 'true' : 'false');
}

/* ===== Desplazamiento con offset (anclas locales) ===== */
const HEADER_OFFSET = 140;
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

/* ===== Contadores ===== */
function animateCount(el, target, duration = 1200) {
  const start = 0; const t0 = performance.now();
  function tick(now) {
    const p = Math.min((now - t0) / duration, 1);
    el.textContent = Math.floor(start + (target - start) * p).toLocaleString('es-CO');
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const stats = document.querySelectorAll('.social-stats .stat');
const statsObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.getAttribute('data-target'), 10) || 0;
      animateCount(e.target.querySelector('.count'), target);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.35 });
stats.forEach(s => statsObs.observe(s));

/* Placeholders (si luego agregas modal de insumos) */
function abrirModal() { }
function cerrarModal() { }

/* ===== Lightbox funciones expuestas ===== */
window.cambiarImagen = window.cambiarImagen || function () { };
window.cerrarModalImagen = window.cerrarModalImagen || function () { };