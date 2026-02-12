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