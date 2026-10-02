const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-links a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded","false");
  });
});

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
reveals.forEach(el => observer.observe(el));

const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".dot")];
const currentSlide = document.getElementById("currentSlide");
const prev = document.getElementById("prevSlide");
const next = document.getElementById("nextSlide");
let active = 0;

function showSlide(index){
  active = (index + slides.length) % slides.length;
  slides.forEach((s,i)=>s.classList.toggle("active",i===active));
  dots.forEach((d,i)=>d.classList.toggle("active",i===active));
  currentSlide.textContent = String(active+1).padStart(2,"0");
}
prev?.addEventListener("click",()=>showSlide(active-1));
next?.addEventListener("click",()=>showSlide(active+1));
dots.forEach((dot,i)=>dot.addEventListener("click",()=>showSlide(i)));

const copyEmail = document.getElementById("copyEmail");
const copyStatus = document.getElementById("copyStatus");
copyEmail?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("chilasclaville@gmail.com");
    copyStatus.textContent = "E-mail kopieret.";
  } catch {
    copyStatus.textContent = "E-mail: chilasclaville@gmail.com";
  }
});

const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

form?.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const business = document.getElementById("business").value.trim();
  const email = document.getElementById("email").value.trim();
  const interest = document.getElementById("interest").value;
  const message = document.getElementById("message").value.trim();

  const subject = encodeURIComponent(`Forespørgsel om hjemmeside${business ? " - " + business : ""}`);
  const body = encodeURIComponent(
`Navn: ${name}
Virksomhed: ${business || "-"}
E-mail: ${email}
Interesse: ${interest}

Besked:
${message}`
  );

  formStatus.textContent = "Din mailapp åbner med beskeden klar.";
  window.location.href = `mailto:chilasclaville@gmail.com?subject=${subject}&body=${body}`;
});