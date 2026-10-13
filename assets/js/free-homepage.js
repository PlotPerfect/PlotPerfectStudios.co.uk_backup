const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const EMAILJS_PUBLIC_KEY = "a30FUWz1z6yJ3cxYW";
const EMAILJS_SERVICE_ID = "service_mour8pj";
const EMAILJS_TEMPLATE_ID = "template_3c0frgi";
const REQUEST_TIMEOUT_MS = window.__FORM_TIMEOUT_MS__ || 15000;

function setError(field, message) {
  const wrap = field.closest("label") || field.parentElement;
  const error = wrap ? wrap.querySelector(".err") : null;
  if (error) {
    if (!error.id) error.id = `free${field.name}Error`;
    error.textContent = message || "";
    field.setAttribute("aria-describedby", error.id);
  }
  field.setAttribute("aria-invalid", String(Boolean(message)));
  field.classList.toggle("input-bad", Boolean(message));
}

function validateFreeForm(form) {
  const fields = {
    name: form.elements.name,
    email: form.elements.email,
    business: form.elements.business,
    goals: form.elements.goals,
    consent: form.elements.consent,
  };
  const consentError = form.querySelector("[data-consent-error]");
  let firstInvalid = null;

  [fields.name, fields.email, fields.business, fields.goals].forEach((field) => setError(field, ""));
  fields.consent.setAttribute("aria-invalid", "false");
  if (consentError) consentError.textContent = "";

  const invalidate = (field, message) => {
    setError(field, message);
    if (!firstInvalid) firstInvalid = field;
  };

  if (fields.name.value.trim().length < 2) invalidate(fields.name, "Please enter your name.");
  if (!/^\S+@\S+\.\S+$/.test(fields.email.value.trim())) invalidate(fields.email, "Please enter a valid email address.");
  if (!fields.business.value.trim()) invalidate(fields.business, "Please enter your business type.");
  if (fields.goals.value.trim().length < 10) invalidate(fields.goals, "Please add at least 10 characters about your goals.");
  if (!fields.consent.checked) {
    fields.consent.setAttribute("aria-invalid", "true");
    if (consentError) consentError.textContent = "Please confirm that we may contact you about this request.";
    if (!firstInvalid) firstInvalid = fields.consent;
  }

  return { valid: !firstInvalid, firstInvalid };
}

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

function initFreeForm() {
  const form = document.getElementById("freeHomepageForm");
  const status = document.getElementById("freeFormStatus");
  const button = document.getElementById("submitFreeBtn");
  if (!form || !status || !button) return;

  let submitting = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;

    const result = validateFreeForm(form);
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
        business: formData.get("business"),
        website: formData.get("website") || "Not provided",
        goals: formData.get("goals"),
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
      button.textContent = "Request Free Homepage";
    }
  });
}

document.addEventListener("DOMContentLoaded", initFreeForm);
