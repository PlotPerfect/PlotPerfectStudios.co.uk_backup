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
            menuIcon.src = "assets/Icons/MenuIconOpen.svg"; // Open icon
        } else {
            menuOverlay.classList.remove("show");
            menuIcon.src = "assets/Icons/MenuIconClosed.svg"; // Closed icon
        }
    });

    closeMenuOverlay.addEventListener("click", () => {
        menuOverlay.classList.remove("show");
        menuIcon.src = "assets/Icons/MenuIconClosed.svg"; // Reset icon
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
            menuIcon.src = "assets/Icons/MenuIconClosed.svg";
            menuOpen = false;
    
            setupFAQ(); // <--- Add this too!
        });
    });

    

    // Content text for each panel section
    const panelText = {
        "About Us": `
        <div class="about-hero">
            <h1 class="about-title">Who We Are</h1>
            <p class="about-lead">Plot Perfect Studios Ltd is your creative partner for <span class="about-highlight">3D architectural visualisation</span> and <span class="about-highlight">modern web development</span>. We bring your ideas to life with stunning visuals and digital experiences.</p>
        </div>
        <div class="about-cards">
            <div class="about-card fade-in">
                <h2>3D Architectural Renders</h2>
                <p>We transform your plans, sketches, or CAD drawings into immersive, photo-realistic 3D renders. Our visuals help you secure planning permissions, attract investors, and win project approvals with clarity and impact.</p>
                <ul>
                    <li>Exterior & Interior Renders</li>
                    <li>Street Scenes & Masterplans</li>
                    <li>Animated Walkthroughs</li>
                </ul>
            </div>
            <div class="about-card fade-in" style="animation-delay:0.2s;">
                <h2>Web Development</h2>
                <p>We build fast, responsive, and visually compelling websites for businesses of all sizes. From sleek portfolios to e-commerce platforms, we combine form and function to help you succeed online.</p>
                <ul>
                    <li>Custom Websites & E-Commerce</li>
                    <li>SEO & Mobile-First Design</li>
                    <li>Interactive Features & Booking Systems</li>
                </ul>
            </div>
        </div>
        <div class="about-values fade-in" style="animation-delay:0.4s;">
            <h2>Why Choose Us?</h2>
            <div class="about-values-list">
                <div class="about-value-item">
                    <span class="about-value-icon">🎨</span>
                    <span>Creative, client-focused approach</span>
                </div>
                <div class="about-value-item">
                    <span class="about-value-icon">⚡</span>
                    <span>Fast turnaround & clear communication</span>
                </div>
                <div class="about-value-item">
                    <span class="about-value-icon">💡</span>
                    <span>Modern technology & best practices</span>
                </div>
                <div class="about-value-item">
                    <span class="about-value-icon">🤝</span>
                    <span>Full support from concept to launch</span>
                </div>
            </div>
        </div>
        `,
        "3D Render Portfolio": `
        <div class="render-portfolio-hero fade-in">
            <h1 class="render-portfolio-title">3D Render Portfolio</h1>
            <p class="render-portfolio-lead">A showcase of our 3D visualisation work. Click images to enlarge, or play videos to see our animations in action.</p>
        </div>
        <div class="render-section fade-in" style="animation-delay:0.1s;">
            <h2 class="render-section-title">Images</h2>
            <div class="render-image-grid">
                <div class="render-image-item">
                    <img src="assets/images/Kitchen.png" alt="3D Render - Kitchen" />
                    <div class="render-image-overlay">Kitchen Visual</div>
                </div>
                <div class="render-image-item">
                    <img src="assets/images/LivingRoom.jpg" alt="3D Render - Living Room" />
                    <div class="render-image-overlay">Living Room</div>
                </div>
                <div class="render-image-item">
                    <img src="assets/images/Bathroom.jpg" alt="3D Render - Bathroom" />
                    <div class="render-image-overlay">Bathroom</div>
                </div>
                <div class="render-image-item">
                    <img src="assets/images/Female Proposed 1.png" alt="3D Render - Female Change 1" />
                    <div class="render-image-overlay">Female Change Room</div>
                </div>
                <div class="render-image-item">
                    <img src="assets/images/MaleChange1.png" alt="3D Render - Male Change 1" />
                    <div class="render-image-overlay">Male Change Room</div>
                </div>
                <!-- Add more images as needed -->
            </div>
        </div>
        <div class="render-section fade-in" style="animation-delay:0.2s;">
            <h2 class="render-section-title">Videos</h2>
            <div class="render-video-grid">
                <div class="render-video-item">
                    <div class="render-video-thumb" data-video="assets/Videos/FemaleChange.mp4">
                        <img src="assets/images/Female Proposed 2.png" alt="Female Change Video" />
                        <button class="render-video-play"><span>&#9658;</span></button>
                    </div>
                    <div class="render-video-caption">Female Change Walkthrough</div>
                </div>
                <div class="render-video-item">
                    <div class="render-video-thumb" data-video="assets/Videos/MaleChange.mp4">
                        <img src="assets/images/MaleChange2.png" alt="Male Change Video" />
                        <button class="render-video-play"><span>&#9658;</span></button>
                    </div>
                    <div class="render-video-caption">Male Change Walkthrough</div>
                </div>
                <!-- Add more videos as needed -->
            </div>
        </div>
        <div id="renderVideoModal" class="render-video-modal">
            <div class="render-video-modal-content">
                <button id="closeRenderVideoModal" class="render-video-modal-close">&times;</button>
                <video id="renderModalVideo" controls></video>
            </div>
        </div>
        `,
        "Web Development Portfolio": `
        <h1>Web Development Portfolio</h1>
        <p>Explore our recent projects that showcase our expertise in web development.</p>

        <div class="webdev-grid">
            <div class="project-item">
                <a href="https://corriganandchapman.co.uk" target="_blank">
                    <img src="assets/Icons/C&CC Main Logo Light.svg" alt="Corrigan Logo" class="logo-ccc">
                </a>
                <button class="desc-toggle-btn">Project Description</button>
                <div class="project-desc-dropdown">
                    <p>
                        I designed and developed the official website for <strong>Corrigan & Chapman Construction Ltd</strong>, a leading construction company based in Essex. 
                        The site features a modern, responsive design with a professional and clean layout, aimed at showcasing their extensive range of services, 
                        company framework, and completed projects. Key elements include a full-page intro, smooth navigation overlays, animated sections and downloadable case studies. 
                        The site is hosted on Fasthosts and built to ensure fast loading times, cross-device compatibility, and an engaging user experience.
                    </p>
                </div>
            </div>
            
            <div class="project-item">
                <a href="https://cre8.london" target="_blank">
                    <img src="assets/Icons/Cre8Logo.svg" alt="Cre8 Logo" class="logo-cre8">
                </a>
                <button class="desc-toggle-btn">Project Description</button>
                <div class="project-desc-dropdown">
                    <p>
                        I designed and developed the official website for <strong>CRE8 London</strong>, a signage and display solutions company. 
                        The site features a modern, clean layout with smooth navigation and responsive design for optimal viewing across desktop and mobile devices. 
                        Key features include dynamic dropdown menus, interactive product panels with hover previews, full-page overlays for product details, 
                        QR code integration for instant inquiries, and a rotating image carousel to showcase offerings. 
                        I focused on creating a user-friendly experience while maintaining a professional, futuristic aesthetic aligned with the CRE8 brand.
                    </p>
                </div>
            </div>

            <div class="project-item">
                <a href="https://www.f7coaching.com" target="_blank">
                    <img src="assets/Icons/F7CoachingLogo.svg" alt="F7 Coaching Logo" class="logo-f7">
                </a>
                <button class="desc-toggle-btn">Project Description</button>
                <div class="project-desc-dropdown">
                    <p>
                        This project involved the complete design and development of a responsive, futuristic-style website for <strong>F7 Coaching</strong>, a youth football coaching company. The site features a full-page video intro, a custom floating menu with smooth scrolling navigation, animated overlays, a stylish gallery carousel, and an integrated contact form. 
                        Designed with modern UI/UX principles, it includes dynamic panels for Terms & Conditions, Privacy Policy, and a mobile-first approach to ensure optimal performance across all devices.
                        The website is currently in the final testing phase before going live.
                    </p>
                </div>
            </div>

            <div class="project-item">
                <a href="https://hayleyshoundsadventuredays.com" target="_blank">
                    <img src="assets/Icons/Hayleys Hounds Logo.svg" alt="Hayleys Hounds Adventure Days Logo" class="logo-hayleyshounds">
                </a>
                <button class="desc-toggle-btn">Project Description</button>
                <div class="project-desc-dropdown">
                    <p>
                        This project was created using a simple website builder in my early days of web development, however the client has opted in for a free custom upgrade
                        Logo designed by us.
                    </p>
                </div>
            </div>

            <div class="project-item">
                <a href="" target="_blank">
                    <img src="assets/Icons/Guns&GloryLogoNew.svg" alt="Guns & Glory Logo" class="logo-gunsandglory">
                </a>
                <button class="desc-toggle-btn">Project Description</button>
                <div class="project-desc-dropdown">
                    <p>
                        This is a personal project, still in development, logo design by us (coming soon).
                    </p>
                </div>
            </div>

            <div class="project-item">
                <a href="https://oasisdata.co.uk/" target="_blank">
                    <img src="assets/Icons/OasisLogo3.svg" alt="Oasis Data Logo" class="logo-oasisdata">
                </a>
                <button class="desc-toggle-btn">Project Description</button>
                <div class="project-desc-dropdown">
                    <p>
                        This is a personal project, still in development logo design by us (coming soon).
                    </p>
                </div>
            </div>
        </div>

        `,
        "FAQ": `
        <div class="faq-hero">
            <h1 class="faq-title">Frequently Asked Questions</h1>
            <p class="faq-lead">Find answers to common questions about our 3D rendering and web development services. Click a question to reveal the answer.</p>
        </div>
        <div id="faqSection">
            <div class="faq-item animated-faq">
                <button class="faq-question"><span class="faq-icon">+</span> What is a 3D architectural render?</button>
                <div class="faq-answer">
                    <p>A 3D architectural render is a realistic visual representation of a building or space before it's built. We bring your designs to life with photo-realistic imagery.</p>
                </div>
            </div>
            <div class="faq-item animated-faq" style="animation-delay:0.1s;">
                <button class="faq-question"><span class="faq-icon">+</span> What do I need to provide for a render?</button>
                <div class="faq-answer">
                    <p>You can send architectural drawings, CAD files, sketches, or inspiration images. The more detail, the better the final render!</p>
                </div>
            </div>
            <div class="faq-item animated-faq" style="animation-delay:0.2s;">
                <button class="faq-question"><span class="faq-icon">+</span> Will my website be mobile-friendly?</button>
                <div class="faq-answer">
                    <p>Yes, every site we create is fully responsive, optimized for mobiles, tablets, and desktops to ensure a smooth user experience everywhere.</p>
                </div>
            </div>
            <div class="faq-item animated-faq" style="animation-delay:0.3s;">
                <button class="faq-question"><span class="faq-icon">+</span> Do you offer SEO services?</button>
                <div class="faq-answer">
                    <p>All websites come with essential SEO setup (meta tags, clean structure, speed optimization). We also offer full SEO packages if needed.</p>
                </div>
            </div>
            <div class="faq-item animated-faq" style="animation-delay:0.4s;">
                <button class="faq-question"><span class="faq-icon">+</span> Can you manage my site after launch?</button>
                <div class="faq-answer">
                    <p>Yes, we offer maintenance packages to handle updates, backups, improvements, and security for your peace of mind.</p>
                </div>
            </div>
            <div class="faq-item animated-faq" style="animation-delay:0.5s;">
                <button class="faq-question"><span class="faq-icon">+</span> How long does a 3D render or website take?</button>
                <div class="faq-answer">
                    <p>Typical 3D renders are delivered within 3-7 working days, depending on complexity. Websites usually take 2-4 weeks from concept to launch, but timelines vary by project scope and requirements.</p>
                </div>
            </div>
            <div class="faq-item animated-faq" style="animation-delay:0.6s;">
                <button class="faq-question"><span class="faq-icon">+</span> What file formats do you deliver?</button>
                <div class="faq-answer">
                    <p>We deliver 3D renders as high-resolution JPEG, PNG, or TIFF images. Animations are provided as MP4 or MOV. Websites are delivered as live deployments and/or downloadable source files.</p>
                </div>
            </div>
            <div class="faq-item animated-faq" style="animation-delay:0.7s;">
                <button class="faq-question"><span class="faq-icon">+</span> Can you update or redesign my existing website?</button>
                <div class="faq-answer">
                    <p>Absolutely! We offer website redesigns, updates, and performance improvements for existing sites, including WordPress, Shopify, and custom platforms.</p>
                </div>
            </div>
            <div class="faq-item animated-faq" style="animation-delay:0.8s;">
                <button class="faq-question"><span class="faq-icon">+</span> Do you offer logo or branding design?</button>
                <div class="faq-answer">
                    <p>Yes, we provide logo design, brand identity, and graphic design services to help your business stand out online and in print.</p>
                </div>
            </div>
            <div class="faq-item animated-faq" style="animation-delay:0.9s;">
                <button class="faq-question"><span class="faq-icon">+</span> How do I get a quote or start a project?</button>
                <div class="faq-answer">
                    <p>Simply use our <b>Contact Us</b> panel, email us at <a href="mailto:info@plotperfectstudios.co.uk">info@plotperfectstudios.co.uk</a>, or call 07401 153 663. We'll discuss your needs and provide a tailored quote.</p>
                </div>
            </div>
        </div>
        `,
        "Contact Us": `
        <div class="contact-hero">
            <h1 class="contact-title">Contact Us</h1>
            <p class="contact-lead">Let's bring your ideas to life. Reach out for a quote, project discussion, or just to say hello!</p>
        </div>
        <div class="contact-cards">
            <div class="contact-card fade-in">
                <img src="assets/Icons/emailIcon.svg" alt="Email Icon" class="contact-card-img">
                <h3>Email</h3>
                <a href="mailto:info@plotperfectstudios.co.uk" class="contact-link">info@plotperfectstudios.co.uk</a>
            </div>
            <div class="contact-card fade-in" style="animation-delay:0.15s;">
                <img src="assets/Icons/PhoneIcon.svg" alt="Phone Icon" class="contact-card-img">
                <h3>Telephone</h3>
                <a href="tel:07401153663" class="contact-link">07401 153 663</a>
            </div>
            <div class="contact-card fade-in" style="animation-delay:0.3s;">
                <img src="assets/Icons/InstaIcon.svg" alt="Instagram Icon" class="contact-card-img">
                <h3>Instagram</h3>
                <a href="https://instagram.com/plotperfectstudios" class="contact-link" target="_blank">@plotperfectstudios</a>
            </div>
            <div class="contact-card fade-in" style="animation-delay:0.45s;">
                <img src="assets/Icons/linkedinIcon.svg" alt="LinkedIn Icon" class="contact-card-img">
                <h3>LinkedIn</h3>
                <a href="https://www.linkedin.com/in/adam-chapman-935b27322/" class="contact-link" target="_blank">Plot Perfect Studios</a>
            </div>
        </div>
        <div class="contact-location fade-in" style="animation-delay:0.6s;">
            <h2>Our Location</h2>
            <div class="contact-map-wrapper">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2472.592726148584!2d0.1386953271007332!3d51.703897721858674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d898f4cf7bda71%3A0xd05e52fab259deb8!2sParklands%2C%20Coopersale%2C%20Epping%20CM16%207RQ!5e0!3m2!1sen!2suk"
                    width="100%" height="350" style="border:0; border-radius:12px;" allowfullscreen="" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
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
            // Remove any previous image modals (cleanup)
            document.querySelectorAll('.render-image-modal').forEach(m => m.remove());
            // Remove video modal show state and stop video
            const videoModal = document.getElementById('renderVideoModal');
            const video = document.getElementById('renderModalVideo');
            if (videoModal && video) {
                videoModal.classList.remove('show');
                video.pause();
                video.currentTime = 0;
                video.src = '';
            }
            setupFAQ(); // <--- Add this after loading panel content!
        });
    });
    // Close panel
    if (closeBtn) {
        closeBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent unintended triggers
            panel.classList.remove("show");
            panel.style.display = "none"; // Immediately hide the panel without animation
        });
    }
});

// Setup FAQ toggles (after FAQ content loads)
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(button => {
        button.addEventListener('click', function () {
            const answer = this.parentElement.querySelector('.faq-answer');
            const icon = this.querySelector('.faq-icon');
            const isOpen = answer.classList.contains('open');
            // Close all others
            document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
            document.querySelectorAll('.faq-question.open').forEach(q => q.classList.remove('open'));
            if (!isOpen) {
                answer.classList.add('open');
                this.classList.add('open');
            }
        });
    });
    // Animate FAQ items in sequence
    document.querySelectorAll('.animated-faq').forEach((el, i) => {
        el.style.animationDelay = (i * 0.08 + 0.1) + 's';
    });

    // Project Description dropdowns for portfolio
    const descBtns = document.querySelectorAll('.desc-toggle-btn');
    descBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const dropdown = this.nextElementSibling;
            if (dropdown) {
                dropdown.classList.toggle('open');
            }
        });
    });

    // 3D Render Portfolio: Image modal (enlarge on click)
    document.querySelectorAll('.render-image-item img').forEach(img => {
        img.addEventListener('click', function() {
            const modal = document.createElement('div');
            modal.className = 'render-image-modal';
            modal.innerHTML = `<div class='render-image-modal-content'><button class='render-image-modal-close'>&times;</button><img src='${img.src}' alt='${img.alt}' /></div>`;
            document.body.appendChild(modal);
            modal.classList.add('show');
            modal.querySelector('.render-image-modal-close').onclick = () => modal.remove();
            modal.onclick = e => { if (e.target === modal) modal.remove(); };
        });
    });

    // 3D Render Portfolio: Video modal logic
    document.querySelectorAll('.render-video-play').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const thumb = btn.closest('.render-video-thumb');
            const videoSrc = thumb.getAttribute('data-video');
            const modal = document.getElementById('renderVideoModal');
            const video = document.getElementById('renderModalVideo');
            video.src = videoSrc;
            modal.classList.add('show');
            video.play();
        });
    });
    const closeModal = document.getElementById('closeRenderVideoModal');
    if (closeModal) {
        closeModal.onclick = function() {
            const modal = document.getElementById('renderVideoModal');
            const video = document.getElementById('renderModalVideo');
            modal.classList.remove('show');
            video.pause();
            video.currentTime = 0;
            video.src = '';
        };
    }
    // Also close modal on overlay click
    const videoModal = document.getElementById('renderVideoModal');
    if (videoModal) {
        videoModal.onclick = function(e) {
            if (e.target === videoModal) {
                const video = document.getElementById('renderModalVideo');
                videoModal.classList.remove('show');
                video.pause();
                video.currentTime = 0;
                video.src = '';
            }
        };
    }
}

// Show Development Notice Popup DELETE WHEN DONE
const devNoticePopup = document.getElementById('devNoticePopup');
const devNoticeButton = document.getElementById('devNoticeButton');

if (devNoticePopup && devNoticeButton) {
    // Show popup after short delay
    setTimeout(() => {
        devNoticePopup.classList.add('show');
    }, 1500);

    // Close popup when button clicked
    devNoticeButton.addEventListener('click', () => {
        devNoticePopup.classList.remove('show');
    });
}





