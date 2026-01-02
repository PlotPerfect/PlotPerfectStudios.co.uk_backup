// waitlist.js - Handles the waitlist forms for Host Perfect and Send Perfect

// Initialize EmailJS
emailjs.init("a30FUWz1z6yJ3cxYW");

function setError(field, msg) {
  const wrap = field.closest("label") || field.closest(".form") || field.parentElement;
  const err = wrap ? wrap.querySelector(".err") : null;
  if (err) err.textContent = msg || "";
  field.classList.toggle("input-bad", Boolean(msg));
}

function validateWaitlistForm(form) {
  let ok = true;

  const name = form.elements["from_name"];
  const email = form.elements["from_email"];

  [name, email].forEach(f => setError(f, ""));

  if (!name.value.trim() || name.value.trim().length < 2) { setError(name, "Please enter your name."); ok = false; }
  if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value.trim())) { setError(email, "Please enter a valid email."); ok = false; }

  return ok;
}

function initWaitlistForms() {
  const forms = [
    { id: 'hostPerfectWaitlistForm', service: 'Host Perfect Waitlist', btnText: 'Join waitlist' },
    { id: 'sendPerfectEarlyAccessForm', service: 'Send Perfect Early Access', btnText: 'Request access' }
  ];

  forms.forEach(({ id, service, btnText }) => {
    const form = document.getElementById(id);
    if (!form) return;

    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validateWaitlistForm(form)) return;

      btn.disabled = true;
      btn.textContent = "Sending…";

      const formData = new FormData(form);
      const emailData = {
        from_name: formData.get('from_name'),
        from_email: formData.get('from_email'),
        company: 'Waitlist',
        phone: 'N/A',
        service: service,
        budget: 'N/A',
        timeline: 'N/A',
        message: formData.get('message') || 'No additional message'
      };

      try {
        const response = await emailjs.send('service_mour8pj', 'template_868aht5', emailData);
        // Show success - perhaps replace form with success message
        form.innerHTML = '<p style="color: var(--text); text-align: center; padding: 20px;">✅ Thank you! You\'ve been added to the waitlist. We\'ll notify you when it\'s ready.</p>';
      } catch (error) {
        console.log('❌ FAILED...', error);
        // Show error
        const errorMsg = form.querySelector('.error-msg') || document.createElement('p');
        errorMsg.className = 'error-msg';
        errorMsg.style.color = '#ff6b6b';
        errorMsg.textContent = '❌ Failed to join waitlist. Please try again or email info@plotperfectstudios.co.uk directly.';
        if (!form.querySelector('.error-msg')) {
          form.appendChild(errorMsg);
        }
      } finally {
        btn.disabled = false;
        btn.textContent = btnText;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initWaitlistForms);