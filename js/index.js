/* ===== Splash con efecto de escritura ===== */
document.body.classList.add('splash-lock');

window.addEventListener('load', () => {
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

  /* Observer para .reveal (títulos y otros) */
  const revObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(el => revObserver.observe(el));

  /* Sliders de tarjetas */
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

  /* Modal imagen */
  let currentIndex = 0, currentSlider = [];
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => {
      const imgs = card.querySelectorAll("img");
      if (!imgs.length) return;
      currentSlider = Array.from(imgs);
      const active = card.querySelector("img.active") || imgs[0];
      currentIndex = currentSlider.indexOf(active);
      mostrarImagenModal(currentSlider[currentIndex].src);
    });
  });

  window.mostrarImagenModal = (src) => {
    const modal = document.getElementById("modalImagen");
    const img = document.getElementById("imagenModal");
    img.src = src;
    modal.style.display = "flex";
    modal.classList.add("show");
    document.body.classList.add('modal-open');
  };

  window.cerrarModalImagen = () => {
    const modal = document.getElementById("modalImagen");
    const img = document.getElementById("imagenModal");
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
      img.removeAttribute("src");         // evita que aparezca el alt en footer
      document.body.classList.remove('modal-open');
    }, 400);
  };

  window.cambiarImagen = dir => {
    if (!currentSlider.length) return;
    currentIndex = (currentIndex + dir + currentSlider.length) % currentSlider.length;
    document.getElementById("imagenModal").src = currentSlider[currentIndex].src;
  };

  window.addEventListener("click", e => {
    const modal = document.getElementById("modalImagen");
    if (e.target === modal) window.cerrarModalImagen();
  });
  /* ===== Catálogo: filtros + lightbox ===== */
  const grid = document.getElementById('catalogGrid');
  if (grid) {
    const cards = Array.from(grid.querySelectorAll('.cat-card'));
    const input = document.getElementById('catSearch');
    const sel = document.getElementById('catFilter');

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

    // Abrir modal al hacer click en la tarjeta
    let currentIndex = 0;
    function currentImages() {
      // solo las visibles para poder navegar por el filtro aplicado
      return cards.filter(c => !c.classList.contains('hide')).map(c => c.querySelector('img'));
    }
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        const imgs = currentImages();
        currentIndex = imgs.indexOf(card.querySelector('img'));
        if (currentIndex < 0) currentIndex = 0;
        mostrarImagenModal(imgs[currentIndex].src);
        // guarda la lista visible para navegación
        window.__catalogImgs = imgs;
      });
    });

    // Reutiliza la navegación del modal
    const oldCambiar = window.cambiarImagen;
    window.cambiarImagen = dir => {
      if (Array.isArray(window.__catalogImgs) && window.__catalogImgs.length) {
        currentIndex = (currentIndex + dir + window.__catalogImgs.length) % window.__catalogImgs.length;
        document.getElementById('imagenModal').src = window.__catalogImgs[currentIndex].src;
      } else if (typeof oldCambiar === 'function') {
        oldCambiar(dir);
      }
    };

    applyFilters();
  }

});

/* Menú móvil */
function toggleMenu() { document.getElementById("mainMenu").classList.toggle("show"); }

/* (Opcional) Modal extra */
function abrirModal() { const el = document.getElementById("modalInsumos"); if (el) el.style.display = "block"; }
function cerrarModal() { const el = document.getElementById("modalInsumos"); if (el) el.style.display = "none"; }

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

/* Contadores de redes */
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
      const counter = e.target.querySelector('.count');
      animateCount(counter, target);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.35 });
stats.forEach(s => statsObs.observe(s));
