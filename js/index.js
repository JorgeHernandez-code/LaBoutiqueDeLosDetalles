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
    sections.forEach(sec => {
      const top = window.scrollY + 120;
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

  /* Aparición en scroll */
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

  window.mostrarImagenModal = src => {
    const modal = document.getElementById("modalImagen");
    document.getElementById("imagenModal").src = src;
    modal.classList.add("show"); modal.style.display = "flex";
  };
  window.cerrarModalImagen = () => {
    const modal = document.getElementById("modalImagen");
    modal.classList.remove("show"); setTimeout(() => modal.style.display = "none", 400);
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
});

/* Menú móvil */
function toggleMenu() {
  document.getElementById("mainMenu").classList.toggle("show");
}

/* (Opcional) Modal extra */
function abrirModal() { const el = document.getElementById("modalInsumos"); if (el) el.style.display = "block"; }
function cerrarModal() { const el = document.getElementById("modalInsumos"); if (el) el.style.display = "none"; }

// Desplazamiento suave con offset del header
const HEADER_OFFSET = 140; // ajusta a la altura real del header

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
