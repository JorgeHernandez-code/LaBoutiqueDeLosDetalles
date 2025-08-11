/* ===== Splash home (solo si existe #splash) ===== */
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
    setTimeout(() => { splash.classList.add('hide'); document.body.classList.remove('splash-lock'); }, 600);
    return;
  }

  const speed = 45; let i = 0;
  (function type() {
    if (i <= text.length) { line.textContent = text.slice(0, i++); setTimeout(type, speed); }
    else { setTimeout(() => { splash.classList.add('hide'); document.body.classList.remove('splash-lock'); }, 400); }
  })();
});

/* Seguridad adicional al cargar cualquier página */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('modal-open');
  if (!hasSplash) document.body.classList.remove('splash-lock');
});

/* ===== Página ===== */
document.addEventListener('DOMContentLoaded', () => {
  /* Menú activo según sección */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a');
  const setActive = () => {
    let current = '';
    const top = window.scrollY + 120;
    sections.forEach(sec => {
      if (top >= sec.offsetTop && top < sec.offsetTop + sec.offsetHeight) current = sec.id;
    });
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`));
  };
  setActive(); window.addEventListener('scroll', setActive);

  /* Parallax del blur del banner */
  const banner = document.querySelector('.banner');
  window.addEventListener('scroll', () => {
    if (!banner) return;
    const y = window.scrollY * 0.08;
    banner.style.setProperty('--parallax', y + 'px');
  });

  /* Slider del banner */
  let currentBanner = 0;
  const slides = document.querySelectorAll('.slider .slide');
  if (slides.length) {
    setInterval(() => {
      slides[currentBanner].classList.remove('active');
      currentBanner = (currentBanner + 1) % slides.length;
      slides[currentBanner].classList.add('active');
    }, 4000);
  }

  /* Títulos reveal */
  const revObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(el => revObserver.observe(el));

  /* Sliders de tarjetas (rotación automática) */
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

  /* Aparición de product-cards con stagger */
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

  /* Aparición en scroll (data-animate) */
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

  /* ===== Lightbox / Modal imagen ===== */
  let currentIndex = 0, currentSlider = [], keyHandlerAttached = false;

  // Abrir solo para product-cards que NO son .extra-card
  document.querySelectorAll('.product-card:not(.extra-card)').forEach(card => {
    card.addEventListener('click', () => {
      const imgs = card.querySelectorAll('.product-slider img');
      if (!imgs.length) return;
      currentSlider = Array.from(imgs);
      const active = card.querySelector('img.active') || imgs[0];
      currentIndex = currentSlider.indexOf(active);
      mostrarImagenModal(currentSlider[currentIndex].src);

      // Título opcional desde data-title
      const title = card.getAttribute('data-title');
      if (title) document.getElementById('modalImagen').setAttribute('aria-label', title);
    });
  });

  window.mostrarImagenModal = (src) => {
    const modal = document.getElementById('modalImagen');
    const img = document.getElementById('imagenModal');
    img.src = src;
    modal.style.display = 'flex';
    modal.classList.add('show');
    document.body.classList.add('modal-open');

    // Teclado: ← → Esc
    if (!keyHandlerAttached) {
      keyHandlerAttached = true;
      window.addEventListener('keydown', keyHandler);
    }
  };

  function keyHandler(e) {
    const open = document.getElementById('modalImagen').classList.contains('show');
    if (!open) return;
    if (e.key === 'ArrowLeft') cambiarImagen(-1);
    if (e.key === 'ArrowRight') cambiarImagen(1);
    if (e.key === 'Escape') cerrarModalImagen();
  }

  window.cerrarModalImagen = () => {
    const modal = document.getElementById('modalImagen');
    const img = document.getElementById('imagenModal');
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      img.removeAttribute('src');
      document.body.classList.remove('modal-open');
    }, 400);
  };

  window.cambiarImagen = dir => {
  // Si hay imágenes cargadas en el slider actual
  if (Array.isArray(currentSlider) && currentSlider.length) {
    currentIndex = (currentIndex + dir + currentSlider.length) % currentSlider.length;
    document.getElementById('imagenModal').src = currentSlider[currentIndex].src;
    return;
  }

  // Si estamos en el catálogo
  if (Array.isArray(window.__catalogImgs) && window.__catalogImgs.length) {
    catIndex = (catIndex + dir + window.__catalogImgs.length) % window.__catalogImgs.length;
    document.getElementById('imagenModal').src = window.__catalogImgs[catIndex].src;
  }
};

  // Cerrar al hacer clic fuera
  window.addEventListener('click', e => {
    const modal = document.getElementById('modalImagen');
    if (e.target === modal) window.cerrarModalImagen();
  });

  /* ===== Catálogo desde JSON (solo si existe #catalogGrid) ===== */
  const grid = document.getElementById('catalogGrid');
  if (grid) {
    const input = document.getElementById('catSearch');
    const sel = document.getElementById('catFilter');
    let productos = [];
    let cards = [];

    fetch('json/productos.json')
      .then(r => r.json())
      .then(data => {
        productos = data;
        render(data);
        hookClicks();
        applyFilters();
      })
      .catch(err => console.error('Error cargando productos.json', err));

    function render(items) {
      grid.innerHTML = items.map(p => {
        const img = (p.imagenes && p.imagenes[0]) || '';
        const tit = (p.titulo || '').replace(/"/g, '&quot;');
        return `
          <a class="cat-card wm" data-title="${tit}" data-cat="${p.categoria}" data-id="${p.id}">
            <img src="${img}" alt="${tit}" loading="lazy">
            <span class="label">${tit}</span>
          </a>`;
      }).join('');
      cards = Array.from(grid.querySelectorAll('.cat-card'));
    }

    function applyFilters() {
      const q = (input?.value || '').trim().toLowerCase();
      const cat = sel?.value || 'todas';
      cards.forEach(card => {
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const c = card.getAttribute('data-cat');
        const matchText = !q || title.includes(q);
        const matchCat = (cat === 'todas') || c === cat;
        card.classList.toggle('hide', !(matchText && matchCat));
      });
    }
    input?.addEventListener('input', applyFilters);
    sel?.addEventListener('change', applyFilters);

    // Lightbox desde catálogo (mantiene flechas)
    let catIndex = 0;
    function visibles() { return cards.filter(c => !c.classList.contains('hide')); }

    function hookClicks() {
      grid.addEventListener('click', (e) => {
        const card = e.target.closest('.cat-card');
        if (!card) return;
        const id = card.getAttribute('data-id');
        const list = visibles();
        window.__catalogImgs = list.map(c => c.querySelector('img'));
        catIndex = list.indexOf(card);

        const p = productos.find(x => x.id === id);
        if (p && p.imagenes && p.imagenes.length > 1) {
          window.__catalogImgs = p.imagenes.map(src => { const im = new Image(); im.src = src; return im; });
          catIndex = 0;
        }
        mostrarImagenModal(window.__catalogImgs[catIndex].src);
      });
    }

    const oldCambiar = window.cambiarImagen;
    window.cambiarImagen = dir => {
      if (Array.isArray(window.__catalogImgs) && window.__catalogImgs.length) {
        catIndex = (catIndex + dir + window.__catalogImgs.length) % window.__catalogImgs.length;
        document.getElementById('imagenModal').src = window.__catalogImgs[catIndex].src;
      } else if (typeof oldCambiar === 'function') {
        oldCambiar(dir);
      }
    };
  }
});

/* Menú móvil */
function toggleMenu() { document.getElementById('mainMenu').classList.toggle('show'); }
/* (Opcional) Modal extra */
function abrirModal() { const el = document.getElementById('modalInsumos'); if (el) el.style.display = 'block'; }
function cerrarModal() { const el = document.getElementById('modalInsumos'); if (el) el.style.display = 'none'; }
/* Desplazamiento suave con offset del header */
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
/* Contadores */
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