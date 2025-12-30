async function loadPartial(targetId, url) {
  const target = document.getElementById(targetId);
  if (!target) return;
  try {
    const res = await fetch(url, { cache: "no-cache" });
    target.innerHTML = await res.text();
  } catch (err) {
    console.warn(`Failed to load ${url}`, err);
  }
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

function initYear(){
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

function setError(field, msg){
  const wrap = field.closest("label") || field.closest(".form") || field.parentElement;
  const err = wrap ? wrap.querySelector(".err") : null;
  if (err) err.textContent = msg || "";
  field.classList.toggle("input-bad", Boolean(msg));
}

function validate(form){
  let ok = true;

  const name = form.elements["name"];
  const email = form.elements["email"];
  const service = form.elements["service"];
  const budget = form.elements["budget"];
  const timeline = form.elements["timeline"];
  const message = form.elements["message"];
  const consent = form.elements["consent"];
  const consentErr = form.querySelector("[data-consent-error]");

  // Reset
  [name,email,service,budget,timeline,message].forEach(f => setError(f,""));
  if (consentErr) consentErr.textContent = "";

  if (!name.value.trim() || name.value.trim().length < 2){ setError(name, "Please enter your name."); ok = false; }
  if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value.trim())){ setError(email, "Please enter a valid email."); ok = false; }
  if (!service.value){ setError(service, "Please select a service."); ok = false; }
  if (!budget.value){ setError(budget, "Please select a budget range."); ok = false; }
  if (!timeline.value){ setError(timeline, "Please select a timeline."); ok = false; }
  if (!message.value.trim() || message.value.trim().length < 10){ setError(message, "Please add a few details (at least 10 characters)."); ok = false; }

  if (!consent.checked){
    if (consentErr) consentErr.textContent = "Please tick the consent box to continue.";
    ok = false;
  }

  return ok;
}

function initForm(){
  const form = document.getElementById("quoteForm");
  const status = document.getElementById("formStatus");
  const btn = document.getElementById("submitBtn");
  if (!form || !status || !btn) return;

  // Initialize EmailJS
  emailjs.init("a30FUWz1z6yJ3cxYW");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validate(form)) return;

    btn.disabled = true;
    btn.textContent = "Sending…";
    status.textContent = "";

    // Prepare email data
    const formData = new FormData(form);
    const emailData = {
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      company: formData.get('company') || 'Not provided',
      phone: formData.get('phone') || 'Not provided',
      service: formData.get('service'),
      budget: formData.get('budget'),
      timeline: formData.get('timeline'),
      message: formData.get('message')
    };

    try {
      // Send email using EmailJS
      console.log('🔍 DEBUG: About to send EmailJS request');
      console.log('🔍 DEBUG: Service ID: service_mour8pj');
      console.log('🔍 DEBUG: Template ID: template_868aht5');
      console.log('🔍 DEBUG: Email data:', emailData);

      const response = await emailjs.send('service_mour8pj', 'template_868aht5', emailData);
      console.log('SUCCESS!', response.status, response.text);
      status.textContent = "✅ Message sent! I'll get back to you within 24 hours.";
      status.style.color = "var(--text)";
      form.reset();
    } catch (error) {
      console.log('❌ FAILED...', error);
      console.log('❌ Error status:', error.status);
      console.log('❌ Error text:', error.text);
      console.log('❌ Full error object:', error);

      // Show more specific error messages
      let errorMessage = "❌ Failed to send message.";
      if (error.text) {
        errorMessage += ` ${error.text}`;
      } else if (error.message) {
        errorMessage += ` ${error.message}`;
      }
      errorMessage += " Please try again or email info@plotperfectstudios.co.uk directly.";

      status.textContent = errorMessage;
      status.style.color = "#ff6b6b";
    } finally {
      btn.disabled = false;
      btn.textContent = "Send Request";
    }
  });
}

(async function boot(){
  await loadPartial("siteHeader", "partials/header.html");
  await loadPartial("siteFooter", "partials/footer.html");
  initNav();
  initReveal();
  initYear();
  initForm();
})();
