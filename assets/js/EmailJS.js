// EmailJS.js
// Handles sending contact form data and automatic reply using EmailJS
// Make sure to replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', and 'YOUR_PUBLIC_KEY' with your actual EmailJS credentials.

// Load EmailJS SDK
(function() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';
    script.onload = function() {
        emailjs.init('a30FUWz1z6yJ3cxYW'); // Replace with your EmailJS public key
    };
    document.head.appendChild(script);
})();

// Custom notification popup
function showCustomNotification(message, isError = false) {
    // Remove existing notification if present
    var old = document.getElementById('pps-notification-popup');
    if (old) old.remove();

    var popup = document.createElement('div');
    popup.id = 'pps-notification-popup';
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.bottom = '40px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.background = isError ? '#e74c3c' : '#181d23';
    popup.style.color = '#fff';
    popup.style.padding = '18px 32px';
    popup.style.borderRadius = '12px';
    popup.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
    popup.style.fontSize = '1.1rem';
    popup.style.zIndex = '9999';
    popup.style.opacity = '0';
    popup.style.transition = 'opacity 0.3s';
    document.body.appendChild(popup);
    setTimeout(function() { popup.style.opacity = '1'; }, 10);
    setTimeout(function() {
        popup.style.opacity = '0';
        setTimeout(function() { popup.remove(); }, 400);
    }, 4000);
};

// Wait for DOM to load
window.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Check reCAPTCHA v2
        var recaptchaResponse = typeof grecaptcha !== "undefined" ? grecaptcha.getResponse() : "";
        if (!recaptchaResponse) {
            showCustomNotification('Please complete the reCAPTCHA.', true);
            return;
        }
        // Collect form data
        var formData = {
            from_name: form.from_name.value,
            from_email: form.from_email.value,
            subject: form.subject.value,
            message: form.message.value,
            'g-recaptcha-response': recaptchaResponse // Add reCAPTCHA response for EmailJS
        };

        // Send email via EmailJS
        emailjs.send('service_e5pd56i', 'template_07pemxx', formData)
            .then(function(response) {
                showCustomNotification('Thank you for contacting us! We have received your message and will reply soon.');
                form.reset();
                if (typeof grecaptcha !== "undefined") grecaptcha.reset();
            }, function(error) {
                showCustomNotification('Sorry, there was an error sending your message. Please try again later.', true);
            });
    });
});

// Note: Set up your EmailJS template to send an automatic reply to the user's email address.
// In your EmailJS template, use {{email}} as the recipient and include your auto-reply message.
