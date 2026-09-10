document.addEventListener("DOMContentLoaded", () => {

  const navLinks = document.querySelectorAll(".nav-link-heidy[href^='#']");

  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function setActive(id){
    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${id}`
      );
    });
  }

  // Click inmediato
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href").replace("#","");
      setActive(id);
    });
  });

  // Observer Scroll
  const observer = new IntersectionObserver(
    (entries) => {

      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];

      if(visible?.target?.id){
        setActive(visible.target.id);
      }

    },
    {
      root: null,
      threshold: [0.3, 0.6],
      rootMargin: "-90px 0px -50% 0px"
    }
  );

  sections.forEach(section => observer.observe(section));

});

document.addEventListener("DOMContentLoaded", () => {

  const text = "Heidy Cardenas";
  const speed = 100;
  const delay = 200; 

  const element = document.getElementById("typewriter");

  let index = 0;
  let isDeleting = false;

  function typeEffect() {

    if (!isDeleting) {
      // Escribiendo
      element.textContent = text.substring(0, index + 1);
      index++;

      if (index === text.length) {
        setTimeout(() => {
          isDeleting = false;
        }, delay);
      }

    }

    setTimeout(typeEffect, speed);
  }

  typeEffect();
});


document.addEventListener("DOMContentLoaded", () => {
  // 1) Actualiza automáticamente el contador de imágenes en cada card
  document.querySelectorAll(".project-card2").forEach(card => {
    const images = (card.getAttribute("data-images") || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const countEl = card.querySelector(".project-count");
    if (countEl) countEl.textContent = images.length || 0;
  });

  // 2) Modal binding
  const modalEl = document.getElementById("projectModal");
  if (!modalEl) return;

  const pmTitle = document.getElementById("pmTitle");
  const pmDesc = document.getElementById("pmDesc");
  const pmTech = document.getElementById("pmTech");
  const pmCarouselInner = document.getElementById("pmCarouselInner");
  const pmCounter = document.getElementById("pmCounter");
  const carouselEl = document.getElementById("pmCarousel");

  modalEl.addEventListener("show.bs.modal", (event) => {
    const trigger = event.relatedTarget;
    if (!trigger) return;

    const title = trigger.getAttribute("data-title") || "";
    const desc = trigger.getAttribute("data-desc") || "";
    const tech = (trigger.getAttribute("data-tech") || "")
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    const images = (trigger.getAttribute("data-images") || "")
      .split(",")
      .map(i => i.trim())
      .filter(Boolean);

    pmTitle.textContent = title;
    pmDesc.textContent = desc;
    pmTech.innerHTML = tech.map(t => `<span class="tag">${t}</span>`).join("");

    // Slides
    pmCarouselInner.innerHTML = images.length
      ? images.map((src, idx) => `
          <div class="carousel-item ${idx === 0 ? "active" : ""}">
            <img src="${src}" class="d-block w-100" alt="Imagen ${idx + 1}">
          </div>
        `).join("")
      : `
        <div class="carousel-item active">
          <div class="d-flex align-items-center justify-content-center" style="min-height: 320px;">
            <p class="m-0" style="color:#6B6F85;font-weight:800;">No hay imágenes aún</p>
          </div>
        </div>
      `;

    // Reset carousel a 0
    const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
    carousel.to(0);

    // Counter inicial
    const total = images.length || 1;
    pmCounter.textContent = `Imagen 1 de ${total}`;

    // Re-bind contador al cambiar slide (limpio)
    carouselEl.onSlideCounter = () => {
      const active = carouselEl.querySelector(".carousel-item.active");
      const items = carouselEl.querySelectorAll(".carousel-item");
      const index = Array.from(items).indexOf(active) + 1;
      pmCounter.textContent = `Imagen ${index} de ${items.length}`;
    };

    carouselEl.addEventListener("slid.bs.carousel", carouselEl.onSlideCounter);
  });

  // Limpieza: quitar listener cuando se cierra
  modalEl.addEventListener("hidden.bs.modal", () => {
    if (carouselEl.onSlideCounter) {
      carouselEl.removeEventListener("slid.bs.carousel", carouselEl.onSlideCounter);
      carouselEl.onSlideCounter = null;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".projects-filter .filter-btn");
  const projectCols = document.querySelectorAll("#proyectos .row > [data-category]");

  const applyFilter = (filter) => {
    projectCols.forEach((col) => {
      const match = filter === "all" || col.getAttribute("data-category") === filter;
      col.style.display = match ? "" : "none";
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.getAttribute("data-filter"));
    });
  });

  // Filtro predeterminado al cargar: el que tenga la clase "active" en el HTML
  const defaultBtn = document.querySelector(".projects-filter .filter-btn.active") || filterBtns[0];
  if (defaultBtn) applyFilter(defaultBtn.getAttribute("data-filter"));
});

document.addEventListener("DOMContentLoaded", () => {
  const setCardBg = (card, src) => {
    card.style.backgroundImage = `url("${src}")`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
    card.style.backgroundRepeat = "no-repeat";
  };

  document.querySelectorAll(".project-card2").forEach((card) => {
    const raw = card.getAttribute("data-images") || "";
    const images = raw
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    if (images.length > 0) {
      setCardBg(card, images[0]);
      return;
    }

    // data-cover es opcional (ej. tarjetas de video): si el archivo aún
    // no existe, se deja el fondo por defecto (degradado) en vez de romperse.
    const cover = card.getAttribute("data-cover");
    if (cover) {
      const probe = new Image();
      probe.onload = () => setCardBg(card, cover);
      probe.src = cover;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("photoLightbox");
  if (!lightbox) return;

  const lightboxImg = document.getElementById("photoLightboxImg");
  const closeBtn = document.getElementById("photoLightboxClose");

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".project-photo-card").forEach((card) => {
    card.addEventListener("click", () => {
      openLightbox(card.getAttribute("data-cover"), card.getAttribute("data-title"));
    });
  });

  closeBtn.addEventListener("click", closeLightbox);

  // Clic fuera de la imagen (en el fondo borroso) cierra el preview
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) closeLightbox();
  });
});