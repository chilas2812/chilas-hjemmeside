const navShell = document.querySelector(".nav-shell");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  navShell.classList.toggle("scrolled", window.scrollY > 24);
});

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// Reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Showcase tabs
const tabs = [...document.querySelectorAll(".showcase-tab")];
const slides = [...document.querySelectorAll(".showcase-slide")];
const progressNumber = document.getElementById("progressNumber");
const progressFill = document.getElementById("progressFill");
let activeSlide = 0;
let autoSlide;

function showSlide(index) {
  activeSlide = index;
  tabs.forEach((tab, i) => tab.classList.toggle("active", i === index));
  slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
  progressNumber.textContent = `0${index + 1}`;
  progressFill.style.width = `${((index + 1) / slides.length) * 100}%`;
}

function restartSlider() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => {
    showSlide((activeSlide + 1) % slides.length);
  }, 6500);
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    showSlide(index);
    restartSlider();
  });
});
restartSlider();

// Cursor glow on desktop
const glow = document.getElementById("cursorGlow");
if (window.matchMedia("(pointer:fine)").matches && glow) {
  window.addEventListener("mousemove", e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

// Subtle magnetic movement
document.querySelectorAll(".magnetic").forEach(button => {
  button.addEventListener("mousemove", e => {
    const rect = button.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.08;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.08;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

// Contact form - prepares an email and provides a fallback
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
const toast = document.getElementById("siteToast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

async function copyText(value, successMessage) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(successMessage);
    return true;
  } catch {
    // Fallback for browsers that block navigator.clipboard
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    if (ok) showToast(successMessage);
    return ok;
  }
}

document.querySelectorAll(".copy-contact").forEach(button => {
  button.addEventListener("click", () => {
    copyText(button.dataset.copy, "E-mail kopieret");
  });
});

// On desktop, phone links may have no dialer. The normal tel: link is still kept,
// but we also allow a long/modified click fallback through copy buttons/contact data.
document.querySelectorAll(".js-phone-link").forEach(link => {
  link.addEventListener("contextmenu", () => {
    copyText("51 14 40 46", "Telefonnummer kopieret");
  });
});

form?.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const business = document.getElementById("business").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const subjectText = `Hjemmeside forespørgsel${business ? " - " + business : ""}`;
  const bodyText =
`Hej Chilas,

Jeg vil gerne høre mere om en hjemmeside.

Navn: ${name}
Virksomhed: ${business || "-"}
E-mail: ${email}

Besked:
${message}`;

  const mailto = `mailto:chilasclaville@gmail.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

  status.textContent = "Åbner din mailapp…";
  window.location.href = mailto;

  // Fallback: copy the complete message in case the visitor has no mail app configured.
  setTimeout(async () => {
    const copied = await copyText(
      `Til: chilasclaville@gmail.com\nEmne: ${subjectText}\n\n${bodyText}`,
      "Beskeden er kopieret som backup"
    );
    status.textContent = copied
      ? "Hvis mailappen ikke åbnede, er beskeden kopieret. Send den til chilasclaville@gmail.com."
      : "Hvis mailappen ikke åbnede, skriv direkte til chilasclaville@gmail.com.";
  }, 1200);
});
