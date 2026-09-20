const links = [...document.querySelectorAll(".site-nav a")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function sectionIdFromHash(id) {
  const el = document.getElementById(id);
  return el?.closest(".page-section")?.id || id;
}

function setActive(id) {
  const navId = sectionIdFromHash(id);
  links.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${navId}`);
  });
  document.body.classList.toggle("is-away", navId !== "home");
  document.body.classList.toggle("is-contacts", navId === "contacts");
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href").slice(1);
    if (id) setActive(id);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(visible.target.id);
  },
  { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
);

sections.forEach((section) => observer.observe(section));
setActive(sectionIdFromHash((location.hash || "#home").slice(1) || "home"));
