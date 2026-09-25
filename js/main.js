const TG_USER = "lanperor";

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

function pickSection() {
  const nearBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
  if (nearBottom) {
    setActive("contacts");
    return;
  }
  const probe = window.scrollY + Math.min(240, window.innerHeight * 0.3);
  let current = sections[0]?.id || "home";
  for (const section of sections) {
    if (section.offsetTop - 88 <= probe) current = section.id;
  }
  setActive(current);
}

window.addEventListener("scroll", pickSection, { passive: true });
window.addEventListener("resize", pickSection);
setActive(sectionIdFromHash((location.hash || "#home").slice(1) || "home"));

const stepDetail = document.getElementById("step-detail");
const stepButtons = [...document.querySelectorAll(".step-btn")];

function renderStep(button) {
  const title = button.querySelector("h3")?.textContent || "";
  const detail = button.dataset.detail || "Сюда позже впишем подробный текст этого шага.";
  stepButtons.forEach((item) => {
    const open = item === button;
    item.classList.toggle("is-open", open);
    item.setAttribute("aria-expanded", String(open));
  });
  if (stepDetail) {
    stepDetail.innerHTML = `
      <p class="eyebrow">Шаг подробнее</p>
      <h3>${title}</h3>
      <p class="muted">${detail}</p>
    `;
  }
}

stepButtons.forEach((button) => {
  button.addEventListener("click", () => renderStep(button));
});

const blogFill = document.getElementById("blog-fill");
const blogItems = [...document.querySelectorAll(".blog-item")];

function renderBlog(item) {
  const title = item.querySelector("h3")?.textContent || "";
  const body =
    item.querySelector(".blog-toggle p")?.dataset.detail ||
    "Подробный текст статьи — позже.";
  blogItems.forEach((entry) => {
    const open = entry === item;
    entry.classList.toggle("is-open", open);
    entry.querySelector(".blog-toggle")?.setAttribute("aria-expanded", String(open));
  });
  if (blogFill) {
    blogFill.innerHTML = `<h3>${title}</h3><p>${body}</p>`;
  }
}

blogItems.forEach((item) => {
  const toggle = item.querySelector(".blog-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", () => renderBlog(item));
});

const themeToggle = document.querySelector(".theme-toggle");
const storedTheme = localStorage.getItem("fahriyos-theme");
if (storedTheme === "dark" || storedTheme === "light") {
  document.documentElement.setAttribute("data-theme", storedTheme);
}

themeToggle?.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("fahriyos-theme", next);
});

const contactForm = document.getElementById("contact-form");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const contact = String(data.get("contact") || "").trim();
  const message = String(data.get("message") || "").trim();
  const select = contactForm.querySelector("select[name='package']");
  const option = select?.selectedOptions[0];
  const packTitle = option?.dataset.title || option?.textContent || "";
  const packPrice = option?.dataset.price || "";
  const packValue = option?.value || "";

  const packText = {
    prep: "Групповые занятия, записи уроков, пробные тесты, материалы.",
    admission: "Подбор вуза, подготовка документов, подача заявки, сопровождение до пригласительного письма.",
    settle: "Жильё, документы, банк и SIM-карта, подача на ВНЖ, страховка.",
    full: "Встреча в аэропорту, совместные визиты, всё из пакетов 2 и 3.",
  }[packValue] || "";

  const lines = [
    "Здравствуйте, FahriYOS!",
    name ? `Меня зовут ${name}.` : "",
    packTitle ? `Интересует пакет: ${packTitle}${packPrice ? ` (${packPrice})` : ""}.` : "Хочу консультацию по поступлению.",
    packText,
    message,
    contact ? `Мой контакт: ${contact}` : "",
  ].filter(Boolean);

  const url = `https://t.me/${TG_USER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank", "noopener");
});
