async function loadPartial(targetId, url) {
  const target = document.getElementById(targetId);
  if (!target) return;
  try {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    target.innerHTML = await response.text();
  } catch (error) {
    console.warn(`Failed to load ${url}`, error);
  }
}

function initNav() {
  const toggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (!toggle || !mobileNav) return;
  toggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("show");
    toggle.setAttribute("aria-expanded", String(isOpen));
    mobileNav.setAttribute("aria-hidden", String(!isOpen));
  });
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("show");
      toggle.setAttribute("aria-expanded", "false");
      mobileNav.setAttribute("aria-hidden", "true");
    });
  });
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("in"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in");
    });
  }, { threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
}

function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

function setError(field, message) {
  const wrap = field.closest("label") || field.parentElement;
  const error = wrap ? wrap.querySelector(".err") : null;
  if (error) {
    if (!error.id) error.id = `${field.name}Error`;
    error.textContent = message || "";
    field.setAttribute("aria-describedby", error.id);
  }
  field.setAttribute("aria-invalid", String(Boolean(message)));
  field.classList.toggle("input-bad", Boolean(message));
}

function validate(form) {
  const fields = {
    name: form.elements.name,
    email: form.elements.email,
    service: form.elements.service,
    budget: form.elements.budget,
    timeline: form.elements.timeline,
    message: form.elements.message,
    consent: form.elements.consent,
  };
  const consentError = form.querySelector("[data-consent-error]");
  let firstInvalid = null;

  Object.values(fields).filter((field) => field !== fields.consent).forEach((field) => setError(field, ""));
  fields.consent.setAttribute("aria-invalid", "false");
  if (consentError) consentError.textContent = "";

  const invalidate = (field, message) => {
    setError(field, message);
    if (!firstInvalid) firstInvalid = field;
  };

  if (fields.name.value.trim().length < 2) invalidate(fields.name, "Please enter your name.");
  if (!/^\S+@\S+\.\S+$/.test(fields.email.value.trim())) invalidate(fields.email, "Please enter a valid email address.");
  if (!fields.service.value) invalidate(fields.service, "Please select a service.");
  if (!fields.budget.value) invalidate(fields.budget, "Please select a budget range.");
  if (!fields.timeline.value) invalidate(fields.timeline, "Please select a timeline.");
  if (fields.message.value.trim().length < 10) invalidate(fields.message, "Please add at least 10 characters about your project.");
  if (!fields.consent.checked) {
    fields.consent.setAttribute("aria-invalid", "true");
    if (consentError) consentError.textContent = "Please confirm that we may contact you about this enquiry.";
    if (!firstInvalid) firstInvalid = fields.consent;
  }

  return { valid: !firstInvalid, firstInvalid };
}

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const EMAILJS_PUBLIC_KEY = "a30FUWz1z6yJ3cxYW";
const EMAILJS_SERVICE_ID = "service_mour8pj";
const EMAILJS_TEMPLATE_ID = "template_868aht5";
const REQUEST_TIMEOUT_MS = window.__FORM_TIMEOUT_MS__ || 15000;

async function sendEmail(templateParams, signal) {
  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    }),
  });
  if (!response.ok) throw new Error(`Email service returned HTTP ${response.status}`);
}

function initForm() {
  const form = document.getElementById("quoteForm");
  const status = document.getElementById("formStatus");
  const button = document.getElementById("submitBtn");
  if (!form || !status || !button) return;

  let submitting = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;

    const result = validate(form);
    if (!result.valid) {
      status.textContent = "Please check the highlighted fields.";
      status.dataset.state = "error";
      result.firstInvalid.focus();
      return;
    }

    submitting = true;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.textContent = "Sending…";
    status.textContent = "Sending your request securely…";
    status.dataset.state = "pending";

    const formData = new FormData(form);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      await sendEmail({
        from_name: formData.get("name"),
        from_email: formData.get("email"),
        company: formData.get("company") || "Not provided",
        phone: formData.get("phone") || "Not provided",
        service: formData.get("service"),
        budget: formData.get("budget"),
        timeline: formData.get("timeline"),
        message: formData.get("message"),
      }, controller.signal);
      status.textContent = "Request sent. We’ll review it and reply with the next steps.";
      status.dataset.state = "success";
      form.reset();
    } catch (error) {
      status.textContent = error.name === "AbortError"
        ? "The request timed out and was not confirmed. Your details are still here—please check your connection and try again."
        : "We couldn’t confirm delivery. Your details are still here, so you can try again shortly.";
      status.dataset.state = "error";
    } finally {
      window.clearTimeout(timeout);
      submitting = false;
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.textContent = "Send Request";
    }
  });
}

(async function boot() {
  await loadPartial("siteHeader", "partials/header.html");
  await loadPartial("siteFooter", "partials/footer.html");
  initNav();
  initReveal();
  initYear();
  initForm();
})();
