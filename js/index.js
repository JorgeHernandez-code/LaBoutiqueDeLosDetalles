// Slider automático del banner
let currentBanner = 0;
const banners = document.querySelectorAll('.slider .slide');

setInterval(() => {
  banners[currentBanner].classList.remove('active');
  currentBanner = (currentBanner + 1) % banners.length;
  banners[currentBanner].classList.add('active');
}, 8000); // cambia cada 8 segundos

// Sliders automáticos en cada tarjeta de producto
const sliders = document.querySelectorAll('.product-slider');

sliders.forEach(slider => {
  const images = slider.querySelectorAll('img');
  let index = 0;

  setInterval(() => {
    images[index].classList.remove('active');
    index = (index + 1) % images.length;
    images[index].classList.add('active');
  }, 3000); // cambia cada 3 segundos
});

// Animaciones al hacer scroll
const animElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1
});

animElements.forEach(el => observer.observe(el));

function abrirModal() {
  document.getElementById("modalInsumos").style.display = "block";
}

function cerrarModal() {
  document.getElementById("modalInsumos").style.display = "none";
}

window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('shrink');
  } else {
    header.classList.remove('shrink');
  }
});

function toggleMenu() {
  const menu = document.getElementById("mainMenu");
  menu.classList.toggle("show");
}

let currentIndex = 0;
let currentSlider = [];

// Al hacer clic en una imagen del producto
document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("click", () => {
    const images = card.querySelectorAll("img");
    currentSlider = Array.from(images);
    const active = card.querySelector("img.active") || images[0];
    currentIndex = currentSlider.indexOf(active);
    mostrarImagenModal(currentSlider[currentIndex].src);
  });
});

function mostrarImagenModal(src) {
  const modal = document.getElementById("modalImagen");
  document.getElementById("imagenModal").src = src;
  modal.classList.add("show");
  modal.style.display = "flex";
}

function cerrarModalImagen() {
  const modal = document.getElementById("modalImagen");
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 400);
}

function cambiarImagen(direccion) {
  currentIndex = (currentIndex + direccion + currentSlider.length) % currentSlider.length;
  document.getElementById("imagenModal").src = currentSlider[currentIndex].src;
}

// Cierra el modal al hacer clic fuera de la imagen
window.addEventListener("click", function (e) {
  const modal = document.getElementById("modalImagen");
  if (e.target === modal) {
    cerrarModalImagen();
  }
});