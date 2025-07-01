// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
}

// Smooth scrolling for anchor links
const navLinks = document.querySelectorAll('.pps-nav a[href^="#"]');
navLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
        // Close mobile menu after click
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
        }
    });
});

// Ensure both header and hero 'Our Services' buttons scroll to the services section
function scrollToServices(e) {
    e.preventDefault();
    const target = document.getElementById('services');
    if (target) {
        window.scrollTo({
            top: target.offsetTop - 60,
            behavior: 'smooth'
        });
    }
    // Close mobile menu if open
    if (mainNav && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
    }
}

// Attach to header nav and hero button
const headerServices = document.querySelector('.pps-nav a[href="#services"]');
const heroServices = document.querySelector('.hero-btn-primary[href="#services"]');
if (headerServices) headerServices.addEventListener('click', scrollToServices);
if (heroServices) heroServices.addEventListener('click', scrollToServices);

// Portfolio project data
const portfolioProjects = {
    'modern-residential-complex': {
        title: 'New Spin Studio Extension',
        desc: 'A visualization project showcasing the formation and extension of a new spin studio, expanding the existing fitness area.',
        tags: ['3D Rendering', 'Architectural Visualization', 'Commercial'],
        imageLabel: 'Featured Image',
        image: 'assets/images/SpinStudio4.png',
        breadcrumbs: [
            { label: 'Home', href: 'index.html#home' },
            { label: 'Portfolio', href: 'index.html#portfolio' },
            { label: 'New Spin Studio Extension' }
        ],
        overview: `<p>This project involved creating photorealistic 3D renders to illustrate the formation of a new spin studio, extending the current fitness facilities. The design focused on integrating the new space seamlessly with the existing area, optimizing flow and user experience for gym members.</p>`,
        process: `<ul><li>Collaboration with architects and gym management to define requirements</li><li>3D modeling of the extended studio and adjoining spaces</li><li>Material selection and lighting design to match the existing aesthetic</li><li>Rendering and iterative feedback with stakeholders</li></ul>`,
        results: `<p>The visuals effectively communicated the vision for the new extension, supporting planning approval and stakeholder buy-in. The project enabled the client to showcase the enhanced facility to members and investors before construction began.</p>`,
        details: `<ul><li><strong>Client:</strong> Corrigan & Chapman Construction Ltd.</li><li><strong>Location:</strong> London, UK</li><li><strong>Services:</strong> 3D Rendering, Visualization</li><li><strong>Year:</strong> 2025</li></ul>`
    },
    'luxury-hotel-website': {
        title: 'F7 Coaching Website',
        desc: 'A custom website for a kids football coach, featuring a bespoke booking system, Stripe payment integration, and automated email notifications.',
        tags: ['Web Development', 'Booking System', 'Stripe Integration'],
        imageLabel: 'Featured Image',
        image: 'assets/Icons/F7CoachingLogo.svg',
        breadcrumbs: [
            { label: 'Home', href: 'index.html#home' },
            { label: 'Portfolio', href: 'index.html#portfolio' },
            { label: 'F7 Coaching Website' }
        ],
        overview: `<p>We designed and developed a modern website for a children's football coaching business. The site enables parents to view available sessions, book classes online, and manage their bookings with ease. The project focused on providing a seamless user experience for both the coach and parents.</p>`,
        process: `<ul>
            <li>Requirements gathering with the coach to define booking and payment needs</li>
            <li>UI/UX design tailored for parents and mobile devices</li>
            <li>Development of a custom booking system with real-time availability</li>
            <li>Integration of Stripe for secure online payments</li>
            <li>Setup of automated email confirmations and reminders for bookings</li>
            <li>Testing and deployment</li>
        </ul>`,
        results: `<p>The new website streamlined the booking process, reduced administrative workload, and improved communication with parents through automated emails. Online payments increased session attendance and provided a professional experience for clients.</p>`,
        details: `<ul>
            <li><strong>Client:</strong> F7 Coaching</li>
            <li><strong>Location:</strong> UK</li>
            <li><strong>Services:</strong> Web Development, Booking System, Stripe Integration, Email Automation</li>
            <li><strong>Year:</strong> 2025</li>
        </ul>
        <div style="margin-top:10px;">
            <a href="https://f7coaching.com/" target="_blank" rel="noopener" style="color:#007bff;text-decoration:underline;">Visit F7 Coaching Website</a>
        </div>`
    },
    'corporate-office-interior': {
        title: 'Home Kitchen Renovation',
        desc: 'A simple home renovation project for a personal client, focused on redesigning and visualizing the kitchen area.',
        tags: ['3D Visualization', 'Kitchen', 'Home Renovation'],
        imageLabel: 'Featured Image',
        image: 'assets/images/Kitchen.png',
        breadcrumbs: [
            { label: 'Home', href: 'index.html#home' },
            { label: 'Portfolio', href: 'index.html#portfolio' },
            { label: 'Home Kitchen Renovation' }
        ],
        overview: `<p>This project involved a site visit to obtain accurate measurements and understand the client’s requirements for their kitchen renovation. A full 3D build of the new kitchen layout was created to help the client visualize the proposed changes and finishes.</p>`,
        process: `<ul>
            <li>Initial site visit to take measurements and discuss client preferences</li>
            <li>3D modeling of the new kitchen layout and cabinetry</li>
            <li>Material and color selection in collaboration with the client</li>
            <li>Rendering and presentation of the design</li>
        </ul>`,
        results: `<p>The 3D visuals enabled the client to make informed decisions about their kitchen renovation before any work began. More images coming soon.</p>`,
        details: `<ul><li><strong>Client:</strong> Private Homeowner</li><li><strong>Location:</strong> UK</li><li><strong>Services:</strong> 3D Visualization, Home Renovation</li><li><strong>Year:</strong> 2024</li></ul>`
    },
    'ecommerce-seo-campaign': {
        title: 'Cre8 Signs Website Development',
        desc: 'A bespoke website for a sign supplier, designed to showcase their available stock and support future e-commerce functionality.',
        tags: ['Web Development', 'Stock Display', 'E-commerce (Upcoming)'],
        imageLabel: 'Featured Image',
        image: 'assets/Icons/Cre8Logo.svg',
        breadcrumbs: [
            { label: 'Home', href: 'index.html#home' },
            { label: 'Portfolio', href: 'index.html#portfolio' },
            { label: 'Cre8 Signs Website Development' }
        ],
        overview: `<p>We developed a modern website for a leading sign supplier, focusing on presenting their current stock of signage products in an organized and visually appealing way. The initial phase allows customers to browse available items, with detailed product information and imagery. The platform is built to be scalable, with a full online shop planned for phase 2.</p>`,
        process: `<ul>
            <li>Consultation with the client to define requirements for stock display and future e-commerce integration</li>
            <li>Design and development of a responsive website with a user-friendly product catalogue</li>
            <li>Implementation of an easy-to-update stock management system for phase 1</li>
            <li>Planning and technical groundwork for seamless addition of online shopping features in phase 2</li>
        </ul>`,
        results: `<p>The new website provides customers with clear access to the supplier's current stock, improving product visibility and customer enquiries. The client is now positioned to expand into full e-commerce in the next development phase.</p>`,
        details: `<ul>
            <li><strong>Client:</strong> Cre8 Sign Supplies</li>
            <li><strong>Location:</strong> UK</li>
            <li><strong>Services:</strong> Web Development, Stock Display, E-commerce Planning</li>
            <li><strong>Year:</strong> 2025</li>
        </ul>
        <div style="margin-top:10px;">
            <a href="https://cre8.london/" target="_blank" rel="noopener" style="color:#007bff;text-decoration:underline;">Visit Cre8 Sign Supplies Website</a>
        </div>`
        
    },
    'restaurant-web-app': {
        title: 'Changing Village Refresh / Refurbishment',
        desc: 'A comprehensive refurbishment of a changing village area, featuring new wall tiles, floor tiles, cubicles, benching, lighting, and a modern vanity unit.',
        tags: ['Refurbishment', 'Interior Design', 'Changing Village'],
        imageLabel: 'Featured Image',
        image: 'assets/images/maleChange1.png',
        breadcrumbs: [
            { label: 'Home', href: 'index.html#home' },
            { label: 'Portfolio', href: 'index.html#portfolio' },
            { label: 'Changing Village Refresh and Refurbishment' }
        ],
        overview: `<p>This project involved a full refresh of the changing village area to enhance both functionality and aesthetics. The refurbishment included the installation of new wall and floor tiles, modern cubicles, robust benching, upgraded lighting, and a stylish vanity unit to improve the user experience for all visitors.</p>`,
        process: `<ul>
            <li>Assessment of existing changing village layout and user requirements</li>
            <li>Selection and specification of new wall tiles, floor tiles, and finishes</li>
            <li>Design and installation of new cubicles and benching for durability and comfort</li>
            <li>Upgrade of lighting to energy-efficient, modern fixtures</li>
            <li>Installation of a contemporary vanity unit with integrated sinks and mirrors</li>
            <li>Final inspection and handover to client</li>
        </ul>`,
        results: `<p>The refurbished changing village now provides a clean, modern, and welcoming environment. The new materials and fittings offer improved durability, hygiene, and user satisfaction, supporting the facility’s reputation for quality and comfort.</p>`,
        details: `<ul>
            <li><strong>Client:</strong> Corrigan & Chapman Construction Ltd</li>
            <li><strong>Location:</strong> UK</li>
            <li><strong>Scope:</strong> Wall Tiles, Floor Tiles, Cubicles, Benching, Lighting, Vanity Unit</li>
            <li><strong>Year:</strong> 2024</li>
        </ul>`
    },
    
    'urban-park-concept': {
        title: 'Corrigan & Chapman Construction Website Refresh',
        desc: 'A comprehensive web development project for Corrigan & Chapman Construction Ltd, featuring a full website redesign, enhanced SEO, and modern UI/UX improvements.',
        tags: ['Web Development', 'SEO', 'UI/UX Design'],
        imageLabel: 'Featured Image',
        image: 'assets/Icons/C&CC Main Logo Light.svg',
        breadcrumbs: [
            { label: 'Home', href: 'index.html#home' },
            { label: 'Portfolio', href: 'index.html#portfolio' },
            { label: 'Corrigan & Chapman Construction Website Refresh' }
        ],
        overview: `<p>We partnered with Corrigan & Chapman Construction Ltd to deliver a complete overhaul of their online presence. The project included a new, responsive website design, improved site structure, and a focus on user experience to better showcase their construction services and portfolio.</p>`,
        process: `<ul><li>Consultation with the client to define goals and requirements</li><li>UI/UX design for a modern, intuitive interface</li><li>Development of a fully responsive website</li><li>SEO optimization for improved search visibility</li><li>Content updates and portfolio integration</li><li>Testing and launch</li></ul>`,
        results: `<p>The refreshed website improved user engagement, increased organic traffic, and provided Corrigan & Chapman Construction Ltd with a professional digital platform to attract new clients and showcase their work.</p>`,
        details: `<ul><li><strong>Client:</strong> Corrigan & Chapman Construction Ltd</li><li><strong>Location:</strong> Essex, UK</li><li><strong>Services:</strong> Web Development, SEO, UI/UX Design</li><li><strong>Year:</strong> 2025</li></ul>
        <div style="margin-top:10px;">
            <a href="https://corriganandchapman.co.uk/" target="_blank" rel="noopener" style="color:#007bff;text-decoration:underline;">Visit Corrigan & Chapman Construction Ltd Website</a>
        </div>`
    }
};

// Project gallery data for each project
const projectGalleries = {
    'modern-residential-complex': [
        { img: 'assets/images/SpinStudio1.png', label: 'Interior View 1' },
        { img: 'assets/images/SpinStudio2.png', label: 'Interior View 2' },
        { img: 'assets/images/SpinStudio3.png', label: 'Interior View 3' },
        // ...add more images for this project
    ],
    'luxury-hotel-website': [
        { img: 'assets/images/F7CoachingPreview1.svg', label: 'Interactive Menu' },
        { img: 'assets/images/F7CoachingPreview2.svg', label: 'Homepage UI' },
        { img: 'assets/images/F7CoachingPreview3.svg', label: 'Carousel Menu Cards' },
        { img: 'assets/images/F7CoachingPreview4.svg', label: 'About Us Page' },
        // ...add more images for this project
    ],
    'ecommerce-seo-campaign': [
        { img: 'assets/images/Cre8Preview1.svg', label: 'Homepage' }, 
        { img: 'assets/images/Cre8Preview2.svg', label: 'Interactive Menu' },
        { img: 'assets/images/Cre8Preview3.svg', label: 'Contact Us Page' },
    ],
    'restaurant-web-app': [
        { img: 'assets/images/Female Proposed 1.png', label: 'Female Change Interior Render 1' },
        { img: 'assets/images/Female Proposed 2.png', label: 'Female Change Interior Render 2' },
        { img: 'assets/images/Female Proposed 3.png', label: 'Female Change Interior Render 3' },
        { img: 'assets/images/Female Proposed 4.png', label: 'Female Change Interior Render 4' },
        { img: 'assets/images/FmealeChange2DDraft.jpg', label: 'Interior 2D Draft' },
        { img: 'assets/images/MaleChange1.png', label: 'Male Change Interior Render 1' },
        { img: 'assets/images/MaleChange2.png', label: 'Male Change Interior Render 2' },
        { img: 'assets/images/MaleChange3.png', label: 'Male Change Interior Render 3' },
        { img: 'assets/images/ToiletsImage1.png', label: 'Male Toilets Render 1' },
        { img: 'assets/images/ToiletsImage2.png', label: 'Male Toilets Render 2' },
        { img: 'assets/images/ToiletsImage4.png', label: 'Entrance Corridor Render' },
        { img: 'assets/images/ToiletsImage5.png', label: 'Female Toilets Render 1' },
        { img: 'assets/images/ToiletsImage6.png', label: 'Female Toilets Render 2' },
        // ...add more images for this project
    ],
        'urban-park-concept': [
        { img: 'assets/images/C&CPreview1.svg', label: 'Homepage' },
        { img: 'assets/images/C&CPreview2.svg', label: 'Projects Directory' },
        { img: 'assets/images/C&CPreview3.svg', label: 'Services List' },
        { img: 'assets/images/C&CPreview4.svg', label: 'Contact Us' },
        // ...add more images for this project
    ],


    // Add more projects as needed
};

// Project video data for each project
const projectVideos = {
    'modern-residential-complex': [
        { video: 'assets/Videos/SpinStudios.mp4', label: 'Female Changing Room Walkthrough' },
        // ...add more videos for this project
    ],
    'restaurant-web-app': [
        { video: 'assets/Videos/FemaleChange.mp4', label: 'Female Changing Room Walkthrough' },
        { video: 'assets/Videos/MaleChange.mp4', label: 'Male Changing Room Walkthrough' },
        // ...add more videos for this project
    ]
    // Add more projects as needed
};

function getProjectIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('project') || 'modern-residential-complex';
}

function renderPortfolioProject() {
    const projectId = getProjectIdFromUrl();
    const project = portfolioProjects[projectId] || portfolioProjects['modern-residential-complex'];
    // Breadcrumbs
    const breadcrumbs = document.querySelector('.portfolio-breadcrumbs');
    if (breadcrumbs) {
        breadcrumbs.innerHTML = project.breadcrumbs.map(b => b.href ? `<a href="${b.href}">${b.label}</a>` : `<span>${b.label}</span>`).join(' / ');
    }
    // Title
    const title = document.querySelector('.portfolio-detail-title');
    if (title) title.textContent = project.title;
    // Description
    const desc = document.querySelector('.portfolio-detail-desc');
    if (desc) desc.textContent = project.desc;
    // Tags
    const tags = document.querySelector('.portfolio-detail-tags');
    if (tags) {
        tags.innerHTML = project.tags.map((tag, i) => `<span class="portfolio-tag${i === 0 ? ' portfolio-tag-primary' : ''}">${tag}</span>`).join(' ');
    }
    // Image label
    const imgLabel = document.querySelector('.portfolio-detail-image-label');
    if (imgLabel) imgLabel.textContent = project.imageLabel;
    // Featured image
    const imgContainer = document.querySelector('.portfolio-detail-image');
    if (imgContainer && project.image) {
        imgContainer.innerHTML = `<img src="${project.image}" alt="${project.imageLabel}" style="max-width:100%;max-height:180px;display:block;margin:0 auto;">`;
    }
    // Tabbed content
    const tabOverview = document.getElementById('tab-overview');
    const tabProcess = document.getElementById('tab-process');
    const tabResults = document.getElementById('tab-results');
    if (tabOverview) tabOverview.innerHTML = project.overview || '';
    if (tabProcess) tabProcess.innerHTML = project.process || '';
    if (tabResults) tabResults.innerHTML = project.results || '';
    // Sidebar details
    const details = document.getElementById('project-details');
    if (details) details.innerHTML = project.details || '';

    // Render the project gallery
    renderProjectGallery(projectId);
    // Render the project videos
    renderProjectVideos(projectId);
}

// Get project from URL (e.g., ?project=modern-residential)
function getProjectFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('project') || 'modern-residential'; // default
}

function renderProjectGallery(projectKey) {
    const grid = document.getElementById('portfolioGalleryGrid');
    if (!grid) return; // Only run if the gallery exists on this page
    const gallery = projectGalleries[projectKey] || [];
    grid.innerHTML = '';
    gallery.forEach(item => {
        const card = document.createElement('div');
        card.className = 'portfolio-gallery-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.label}" class="portfolio-gallery-img">
            <button class="portfolio-gallery-zoom" data-img="${item.img}" aria-label="Zoom">
                <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="14" fill="#fff" fill-opacity="0.7"/><path d="M19 19l-3.5-3.5M16 12.5A3.5 3.5 0 1 1 9 12.5a3.5 3.5 0 0 1 7 0z" stroke="#444A54" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
            </button>
            <div class="portfolio-gallery-label">${item.label}</div>
        `;
        grid.appendChild(card);
    });
    // Re-attach overlay logic for new buttons
    attachGalleryOverlayEvents();
}

function attachGalleryOverlayEvents() {
    const galleryOverlay = document.getElementById('galleryOverlay');
    const galleryLargeImg = document.getElementById('galleryLargeImg');
    const galleryClose = document.getElementById('galleryClose');
    document.querySelectorAll('.portfolio-gallery-zoom').forEach(btn => {
        btn.addEventListener('click', function() {
            galleryLargeImg.src = this.getAttribute('data-img');
            galleryOverlay.style.display = 'flex';
        });
    });
    galleryClose.addEventListener('click', function() {
        galleryOverlay.style.display = 'none';
        galleryLargeImg.src = '';
    });
    galleryOverlay.addEventListener('click', function(e) {
        if (e.target === galleryOverlay) {
            galleryOverlay.style.display = 'none';
            galleryLargeImg.src = '';
        }
    });
}

function renderProjectVideos(projectKey) {
    const grid = document.getElementById('portfolioVideoGrid');
    if (!grid) return; // Only run if the video gallery exists on this page
    const videos = projectVideos[projectKey] || [];
    grid.innerHTML = '';
    videos.forEach(item => {
        const card = document.createElement('div');
        card.className = 'portfolio-video-card';
        card.innerHTML = `
            <video src="${item.video}" class="portfolio-video-thumb" muted playsinline preload="metadata"></video>
            <button class="portfolio-video-play" data-video="${item.video}" aria-label="Play Video">
                <svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#fff" fill-opacity="0.7"/><polygon points="20,16 34,24 20,32" fill="#444A54"/></svg>
            </button>
            <div class="portfolio-video-label">${item.label}</div>
        `;
        grid.appendChild(card);
    });
    attachVideoOverlayEvents();
}

function attachVideoOverlayEvents() {
    const videoOverlay = document.getElementById('videoOverlay');
    const videoLargePlayer = document.getElementById('videoLargePlayer');
    const videoClose = document.getElementById('videoClose');
    document.querySelectorAll('.portfolio-video-play').forEach(btn => {
        btn.addEventListener('click', function() {
            videoLargePlayer.src = this.getAttribute('data-video');
            videoOverlay.style.display = 'flex';
            videoLargePlayer.play();
        });
    });
    videoClose.addEventListener('click', function() {
        videoOverlay.style.display = 'none';
        videoLargePlayer.pause();
        videoLargePlayer.src = '';
    });
    videoOverlay.addEventListener('click', function(e) {
        if (e.target === videoOverlay) {
            videoOverlay.style.display = 'none';
            videoLargePlayer.pause();
            videoLargePlayer.src = '';
        }
    });
}

// Service overlay logic (event delegation for robustness)
function attachServiceOverlayEvents() {
    const overlay = document.getElementById('serviceOverlay');
    const overlayClose = document.getElementById('serviceOverlayClose');
    // Use event delegation on the services container
    const servicesContainer = document.querySelector('.services-cards');
    if (servicesContainer) {
        servicesContainer.addEventListener('click', function(e) {
            const btn = e.target.closest('.service-learn-more');
            if (btn) {
                e.preventDefault();
                btn.setAttribute('href', 'javascript:void(0);');
                const key = btn.getAttribute('data-service');
                // Hide all service details
                document.querySelectorAll('.service-details').forEach(div => {
                    div.style.display = 'none';
                });
                // Show the overlay regardless
                overlay.style.display = 'flex';
                // Show the correct service detail by ID
                const detailDiv = document.getElementById('service-' + key);
                if (detailDiv) {
                    detailDiv.style.display = 'block';
                } else {
                    console.warn('No service detail found for', key);
                }
                return false;
            }
        }, false);
    }
    overlayClose.addEventListener('click', function() {
        overlay.style.display = 'none';
        // Hide all service details when closing
        document.querySelectorAll('.service-details').forEach(div => {
            div.style.display = 'none';
        });
    });
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.style.display = 'none';
            document.querySelectorAll('.service-details').forEach(div => {
                div.style.display = 'none';
            });
        }
    });
}

function openPrivacyPolicy() {
    window.open('privacyPolicy.html', '_blank');
}

function openTermsAndConditions() {
    window.open('Terms&Conditions.html', '_blank');
}

function openSiteMap() {
    window.open('sitemap.html', '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    renderPortfolioProject();
    // Tab switching logic
    const tabs = document.querySelectorAll('.portfolio-tab');
    const panels = document.querySelectorAll('.portfolio-tab-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            panels.forEach(panel => panel.style.display = 'none');
            const tabName = this.getAttribute('data-tab');
            const activePanel = document.getElementById('tab-' + tabName);
            if (activePanel) activePanel.style.display = '';
        });
    });
    attachServiceOverlayEvents();
});
// Remove any Firebase config or initialization from this file.
// All Firebase config and initialization should be handled in your HTML or a dedicated admin.js file only.
