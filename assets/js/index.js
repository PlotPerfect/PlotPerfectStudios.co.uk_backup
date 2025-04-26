document.addEventListener("DOMContentLoaded", function () {
    const header = document.getElementById("mainHeader");
    const footer = document.getElementById("mainFooter");
    const panel = document.getElementById("infoPanel");
    const panelContent = document.getElementById("panelContent");
    const closeBtn = document.getElementById("closePanel");
    const navButtons = document.querySelectorAll(".nav-button");

    const menuToggle = document.getElementById("menuToggle");
    const menuIcon = document.getElementById("menuIcon");
    const menuOverlay = document.getElementById("menuOverlay");
    const closeMenuOverlay = document.getElementById("closeMenuOverlay");
    const overlayButtons = document.querySelectorAll('.overlay-nav-button');

    let menuOpen = false;

    // Fade in header/footer
    setTimeout(() => {
        header.classList.add("show");
        footer.classList.add("show");
    }, 2500);

    // Toggle menu overlay
    menuToggle.addEventListener("click", () => {
        menuOpen = !menuOpen;

        if (menuOpen) {
            menuOverlay.classList.add("show");
            menuIcon.src = "Assets/Icons/MenuIconOpen.svg"; // Open icon
        } else {
            menuOverlay.classList.remove("show");
            menuIcon.src = "Assets/Icons/MenuIconClosed.svg"; // Closed icon
        }
    });

    closeMenuOverlay.addEventListener("click", () => {
        menuOverlay.classList.remove("show");
        menuIcon.src = "Assets/Icons/MenuIconClosed.svg"; // Reset icon
        menuOpen = false;
    });

    overlayButtons.forEach(button => {
        button.addEventListener('click', () => {
            const text = panelText[button.textContent.trim()] || "Content coming soon.";
            panelContent.innerHTML = text;
        
            panel.style.display = "block"; 
            setTimeout(() => {
                panel.classList.add("show");
            }, 50);
        
            menuOverlay.classList.remove('show');
            menuIcon.src = "Assets/Icons/MenuIconClosed.svg";
            menuOpen = false;
    
            setupFAQ(); // <--- Add this too!
        });
    });

    

    // Content text for each panel section
    const panelText = {
        "About Us": `
        <h1>3D Architectural Renders</h1>
        <p>
        At Plot Perfect Studios Ltd, we specialize in high-quality 3D architectural visualizations designed to bring your projects to life before a single brick is laid. Whether you're an architect, property developer, interior designer, or marketing agency, we transform your plans, sketches, or CAD drawings into immersive, photo-realistic 3D renders. Our work helps you showcase your vision clearly to clients, secure planning permissions, attract investors, and win project approvals faster and more effectively.
        </p>
        <p>
        We produce exterior and interior renders, street scenes, masterplans, and even animated walkthroughs to suit any requirement. Every visual is crafted with a focus on realism, lighting, texture, and spatial depth, giving stakeholders a precise look at what the finished project will be. From luxury homes and commercial builds to new housing developments and architectural competitions, our 3D renders help you communicate your ideas with stunning clarity.
        </p>

        <h1>Web Development</h1>
        <p>
        In addition to our rendering services, Plot Perfect Studios Ltd also provides modern, tailored web development solutions for businesses of all sizes. We create websites that are fast, responsive, visually compelling, and purpose-driven — combining form and function to help you achieve your goals online.
        </p>
        <p>
        Whether you need a sleek portfolio site, a powerful e-commerce platform, or a custom-built business website, we design with usability, SEO, and mobile-first performance in mind. Every website we build is structured for user engagement, accessibility, and scalability, with clean code and modern design principles at its core.
        </p>
        <p>
        Our development stack includes HTML, CSS, JavaScript, and popular platforms like WordPress and Shopify. For clients needing something more advanced, we also offer custom-coded solutions, interactive features, contact forms, booking systems, and more — all designed to deliver both functionality and style.
        </p>
        <p>
        With Plot Perfect Studios, you don't just get a website or a visual — you get a full creative partner committed to helping your project succeed.
        </p>
    `,
        "3D Render Portfolio": "Showcase coming soon...",
        "Web Development Portfolio": `
        <h1>Web Development Portfolio</h1>
        <p>Explore our recent projects that showcase our expertise in web development.</p>

            <div class="webdev-grid">
                <div class="project-item">
                    <a href="https://corriganandchapman.co.uk" target="_blank">
                        <img src="assets/icons/C&CC Main Logo Light.svg" alt="Corrigan Logo" class="logo-ccc">
                    </a>
                        <p>
                            I designed and developed the official website for <strong>Corrigan & Chapman Construction Ltd</strong>, a leading construction company based in Essex. 
                            The site features a modern, responsive design with a professional and clean layout, aimed at showcasing their extensive range of services, 
                            company framework, and completed projects. Key elements include a full-page intro, smooth navigation overlays, animated sections and downloadable case studies. 
                            The site is hosted on Fasthosts and built to ensure fast loading times, cross-device compatibility, and an engaging user experience.
                        </p>
                </div>
                
                <div class="project-item">
                    <a href="https://cre8.london" target="_blank">
                        <img src="assets/icons/Cre8Logo.svg" alt="Cre8 Logo" class="logo-cre8">
                    </a>
                        <p>
                            I designed and developed the official website for <strong>CRE8 London</strong>, a signage and display solutions company. 
                            The site features a modern, clean layout with smooth navigation and responsive design for optimal viewing across desktop and mobile devices. 
                            Key features include dynamic dropdown menus, interactive product panels with hover previews, full-page overlays for product details, 
                            QR code integration for instant inquiries, and a rotating image carousel to showcase offerings. 
                            I focused on creating a user-friendly experience while maintaining a professional, futuristic aesthetic aligned with the CRE8 brand.
                        </p>
                </div>

                <div class="project-item">
                    <a href="https://www.f7coaching.co.uk" target="_blank">
                        <img src="assets/icons/F7CoachingLogo.svg" alt="F7 Coaching Logo" class="logo-f7">
                    </a>
                        <p>
                            This project involved the complete design and development of a responsive, futuristic-style website for <strong>F7 Coaching</strong>, a youth football coaching company. The site features a full-page video intro, a custom floating menu with smooth scrolling navigation, animated overlays, a stylish gallery carousel, and an integrated contact form. 
                            Designed with modern UI/UX principles, it includes dynamic panels for Terms & Conditions, Privacy Policy, and a mobile-first approach to ensure optimal performance across all devices.
                            The website is currently in the final testing phase before going live.
                        </p>
                </div>
            </div>

        `,
            "FAQ": `
            <h1>Frequently Asked Questions</h1>

            <div id="faqSection">

                <div class="faq-item">
                    <button class="faq-question"><span class="faq-icon">+</span> What is a 3D architectural render?</button>
                    <div class="faq-answer">
                        <p>A 3D architectural render is a realistic visual representation of a building or space before it's built. We bring your designs to life with photo-realistic imagery.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <button class="faq-question"><span class="faq-icon">+</span>What do I need to provide for a render?</button>
                    <div class="faq-answer">
                        <p>You can send architectural drawings, CAD files, sketches, or inspiration images. The more detail, the better the final render!</p>
                    </div>
                </div>

                <div class="faq-item">
                    <button class="faq-question"><span class="faq-icon">+</span>Will my website be mobile-friendly?</button>
                    <div class="faq-answer">
                        <p>Yes, every site we create is fully responsive, optimized for mobiles, tablets, and desktops to ensure a smooth user experience everywhere.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <button class="faq-question"><span class="faq-icon">+</span>Do you offer SEO services?</button>
                    <div class="faq-answer">
                        <p>All websites come with essential SEO setup (meta tags, clean structure, speed optimization). We also offer full SEO packages if needed.</p>
                    </div>
                </div>

                <div class="faq-item">
                    <button class="faq-question"><span class="faq-icon">+</span>Can you manage my site after launch?</button>
                    <div class="faq-answer">
                        <p>Yes, we offer maintenance packages to handle updates, backups, improvements, and security for your peace of mind.</p>
                    </div>
                </div>

            </div>
            `,

            "Contact Us": `
            <h1>Contact Us</h1>
            <div style="text-align:center; padding:40px 20px;">

            <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:40px; margin-bottom:40px;">
                
                <!-- Email -->
                <div>
                <img src="assets/icons/email-icon.svg" alt="Email Icon" style="width:40px; margin-bottom:10px;">
                <h3>Email</h3>
                <p><a href="mailto:info@plotperfectstudios.co.uk">info@plotperfectstudios.co.uk</a></p>
                </div>

                <!-- Telephone -->
                <div>
                <img src="assets/icons/phone-icon.svg" alt="Phone Icon" style="width:40px; margin-bottom:10px;">
                <h3>Telephone</h3>
                <p><a href="tel:07401 153 663">07401 153 663</a></p>
                </div>

            </div>

            <h2 style="margin-bottom:20px;">Our Location</h2>

            <div style="width:100%; max-width:800px; margin:auto;">
                <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2472.592726148584!2d0.1386953271007332!3d51.703897721858674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d898f4cf7bda71%3A0xd05e52fab259deb8!2sParklands%2C%20Coopersale%2C%20Epping%20CM16%207RQ!5e0!3m2!1sen!2suk"
                width="100%" height="400" style="border:0; border-radius:10px;" allowfullscreen="" loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>

            </div>
            `
    };

    // Open panel with selected content
    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const text = panelText[button.textContent.trim()] || "Content coming soon.";
            panelContent.innerHTML = text;
            panel.style.display = "block";
            setTimeout(() => {
                panel.classList.add("show");
            }, 50);

            setupFAQ(); // <--- Add this after loading panel content!
        });
    });
    // Close panel
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            panel.classList.remove("show");
            setTimeout(() => {
                panel.style.display = "none";
            }, 800);
        });
    }
});

// Setup FAQ toggles (after FAQ content loads)
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const icon = button.querySelector('.faq-icon');

            answer.classList.toggle('open');

            // Toggle + and - icon
            if (answer.classList.contains('open')) {
                icon.textContent = '–';
            } else {
                icon.textContent = '+';
            }

            // Optional: Close others when opening one
            faqQuestions.forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.nextElementSibling.classList.remove('open');
                    const otherIcon = otherButton.querySelector('.faq-icon');
                    if (otherIcon) {
                        otherIcon.textContent = '+';
                    }
                }
            });
        });
    });
}

// Show Development Notice Popup DELETE WHEN DONE
const devNoticePopup = document.getElementById('devNoticePopup');
const devNoticeButton = document.getElementById('devNoticeButton');

// Show popup after short delay
setTimeout(() => {
    devNoticePopup.classList.add('show');
}, 1500);

// Close popup when button clicked
devNoticeButton.addEventListener('click', () => {
    devNoticePopup.classList.remove('show');
});





