// free-homepage.js - Handles the free homepage request form

// Initialize EmailJS
emailjs.init("a30FUWz1z6yJ3cxYW");

function setError(field, msg) {
  const wrap = field.closest("label") || field.closest(".form") || field.parentElement;
  const err = wrap ? wrap.querySelector(".err") : null;
  if (err) err.textContent = msg || "";
  field.classList.toggle("input-bad", Boolean(msg));
}

function validateFreeForm(form) {
  let ok = true;

  const name = form.elements["name"];
  const email = form.elements["email"];
  const business = form.elements["business"];
  const goals = form.elements["goals"];
  const consent = form.elements["consent"];
  const consentErr = form.querySelector("[data-consent-error]");

  [name, email, business, goals].forEach(f => setError(f, ""));
  if (consentErr) consentErr.textContent = "";

  if (!name.value.trim() || name.value.trim().length < 2) { setError(name, "Please enter your name."); ok = false; }
  if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value.trim())) { setError(email, "Please enter a valid email."); ok = false; }
  if (!business.value.trim()) { setError(business, "Please enter your business type."); ok = false; }
  if (!goals.value.trim() || goals.value.trim().length < 10) { setError(goals, "Please add at least 10 characters about your goals."); ok = false; }

  if (!consent.checked) {
    if (consentErr) consentErr.textContent = "Please tick the consent box to continue.";
    ok = false;
  }

  return ok;
}

function initFreeForm() {
  const form = document.getElementById("freeHomepageForm");
  const status = document.getElementById("freeFormStatus");
  const btn = document.getElementById("submitFreeBtn");
  if (!form || !status || !btn) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateFreeForm(form)) return;

    btn.disabled = true;
    btn.textContent = "Sending…";
    status.textContent = "";

    const formData = new FormData(form);
    const emailData = {
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      business: formData.get('business'),
      website: formData.get('website') || 'Not provided',
      goals: formData.get('goals')
    };

    try {
      const response = await emailjs.send('service_mour8pj', 'template_3c0frgi', emailData);
      status.textContent = "✅ Request sent! We'll review and get back to you within 24 hours.";
      status.style.color = "var(--text)";
      form.reset();
    } catch (error) {
      status.textContent = "❌ Failed to send request. Please try again or email info@plotperfectstudios.co.uk directly.";
      status.style.color = "#ff6b6b";
    } finally {
      btn.disabled = false;
      btn.textContent = "Request Free Homepage";
    }
  });
}

document.addEventListener("DOMContentLoaded", initFreeForm);