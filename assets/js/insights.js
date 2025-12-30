async function loadPartial(targetId, url) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const res = await fetch(url, { cache: "no-cache" });
  target.innerHTML = await res.text();
}

function initNav() {
  const toggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("show");
      toggle.setAttribute("aria-expanded", String(isOpen));
      mobileNav.setAttribute("aria-hidden", String(!isOpen));
    });
    mobileNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobileNav.classList.remove("show");
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.setAttribute("aria-hidden", "true");
      });
    });
  }
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

function initYear(){ const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear(); }

(async function boot(){
  await loadPartial("siteLoader", "../partials/loader.html");
  await loadPartial("siteHeader", "../partials/header.html");
  await loadPartial("siteFooter", "../partials/footer.html");
  initNav(); initReveal(); initYear();
})();
