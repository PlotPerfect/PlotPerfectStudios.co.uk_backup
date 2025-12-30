function isInternalLink(a){
  if (!a || !a.href) return false;
  const url = new URL(a.href, window.location.href);
  return url.origin === window.location.origin;
}

function isHashOnly(a){
  const href = a.getAttribute("href") || "";
  return href.startsWith("#");
}

function showLoader(){
  const loader = document.getElementById("loader");
  if (loader) loader.classList.add("show");
}

function hideLoader(){
  const loader = document.getElementById("loader");
  if (loader) loader.classList.remove("show");
}

// Fade in on load
document.documentElement.classList.add("page-fade");
window.addEventListener("load", () => {
  document.documentElement.classList.add("page-ready");
  setTimeout(hideLoader, 250);
});

// Intercept navigation
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;

  // ignore new tab, downloads, mail/phone, external, and hash-only
  if (a.target === "_blank") return;
  if (a.hasAttribute("download")) return;

  const href = a.getAttribute("href") || "";
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;
  if (isHashOnly(a)) return;
  if (!isInternalLink(a)) return;

  e.preventDefault();
  showLoader();

  // give loader a moment to appear
  setTimeout(() => {
    window.location.href = a.href;
  }, 180);
});
