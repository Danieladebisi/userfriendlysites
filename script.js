/**
 * ==========================================================================
 * Table of Contents
 * ==========================================================================
 *
 * 1.  Core DOM Ready Event Listener & Initializers
 * 2.  Dynamic Content Loading (Header/Footer)
 * 3.  UI Enhancements
 * 4.  Interactive Components
 * 5.  Hero Animation (Digital Blueprint)
 * 6.  Website Calculator Wizard Logic (FIXED & POLISHED)
 * 7.  Contact Form Submission
 * 8.  Utility Functions
 *
 * ==========================================================================
 */

// --- 1. Core DOM Ready Event Listener ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Run All Initializers on Page Load ---
    loadHTML('header-placeholder', 'header.html').then(() => {
        // These scripts depend on the header being loaded first
        setupDarkMode();
        setupMobileNav();
    });
    loadHTML('footer-placeholder', 'footer.html');

    // Load shared calculator fragment first (if placeholder present)
    loadHTML('calculator-placeholder', 'calculator.html').then(() => {
        // Wire calculator open/close and calculate button handlers if fragment was loaded
        const calcModal = document.getElementById('calculatorModal');
        if (calcModal) {
            // Close buttons inside fragment
            const closeBtn = document.getElementById('calculator-close') || calcModal.querySelector('.close');
            if (closeBtn) closeBtn.addEventListener('click', () => window.closeCalculator());
            const cancelBtn = document.getElementById('calculator-cancel');
            if (cancelBtn) cancelBtn.addEventListener('click', () => window.closeCalculator());

            // Calculate button
            const calcBtn = document.getElementById('calculator-calc');
            if (calcBtn) calcBtn.addEventListener('click', () => calculateCost());
        }

        // Wire any open-calculator triggers (links/buttons) on the page
        document.querySelectorAll('#openCalculator, #openCalculatorHome').forEach(el => {
            el.addEventListener('click', (ev) => { ev.preventDefault(); window.openCalculator(); });
        });

        // Now initialize the calculator logic (if any wizard steps exist they'll be activated)
        initCalculatorWizard();
    }).catch(err => {
        // If the calculator fragment fails to load, still attempt to initialize (safe guards exist)
        console.warn('Calculator fragment failed to load or is missing:', err);
        initCalculatorWizard();
    });

    // Other initializers
    initUI();
    initInteractiveComponents();
    initBlueprintHeroAnimation();
    setupContactForm();
});


// --- 2. Dynamic Content Loading ---
async function loadHTML(elementId, url) {
    const element = document.getElementById(elementId);
    if (!element) return;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not load ${url}: ${response.statusText}`);
        const data = await response.text();
        element.innerHTML = data;
    } catch (error) {
        console.error(error);
        element.innerHTML = `<p style="color:red; text-align:center;">Failed to load dynamic content.</p>`;
    }
}

// --- Grouped Initializers for cleaner code ---
function initUI() {
    setupScrollToTop();
    setupScrollAnimations();
}

function initInteractiveComponents() {
    setupTestimonialCarousel();
    setupShowMore();
}

/* ==========================================================================
   3. UI Enhancements
   ========================================================================== */
function setupDarkMode() {
    // Use event delegation on the body for dynamically loaded elements
    document.body.addEventListener('click', e => {
        const toggleButton = e.target.closest('#darkModeToggle');
        if (toggleButton) {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            toggleButton.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    });

    // Apply saved or preferred theme on initial load
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (localStorage.getItem('darkMode') === 'true' || (localStorage.getItem('darkMode') === null && prefersDark)) {
        document.body.classList.add('dark-mode');
        setTimeout(() => { // Delay to ensure header is loaded
            const toggleButton = document.getElementById('darkModeToggle');
            if (toggleButton) toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        }, 300);
    }
}


function setupMobileNav() {
     document.body.addEventListener('click', e => {
        const menuToggle = e.target.closest('#menuToggle');
        if (menuToggle) {
            const navLinks = document.getElementById('navLinks');
            if(navLinks) navLinks.classList.toggle('active');
        }
    });
}

function setupScrollToTop() {
    const button = document.getElementById('scrollToTop');
    if (!button) return;
    window.addEventListener('scroll', () => {
        button.style.display = (window.pageYOffset > 300) ? 'block' : 'none';
    });
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-box, .process-step, .portfolio-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

/* ==========================================================================
   4. Interactive Components
   ========================================================================== */
function setupTestimonialCarousel() {
    document.body.addEventListener('click', e => {
        const prevBtn = e.target.closest('#prevBtn');
        const nextBtn = e.target.closest('#nextBtn');
        if (!prevBtn && !nextBtn) return;
        
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        let currentIndex = parseInt(carousel.dataset.currentIndex || '0');
        const testimonials = carousel.querySelectorAll('.testimonial-box');
        const totalTestimonials = testimonials.length;
        if (totalTestimonials === 0) return;

        if (prevBtn) currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
        if (nextBtn) currentIndex = (currentIndex + 1) % totalTestimonials;
        
        carousel.dataset.currentIndex = currentIndex;
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
}

function setupShowMore() {
    const showMoreBtn = document.getElementById('show-more');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            document.querySelectorAll('.portfolio-item.hidden').forEach(item => {
                item.classList.remove('hidden');
            });
            this.style.display = 'none';
        });
    }
}


/* ==========================================================================
   5. Hero Animation (Digital Blueprint)
   ========================================================================== */
function initBlueprintHeroAnimation() {
    const container = document.getElementById('hero-animation-container');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const geometries = [
        new THREE.BoxGeometry(10, 10, 10, 2, 2, 2),
        new THREE.SphereGeometry(6, 16, 16),
        new THREE.PlaneGeometry(15, 15, 4, 4)
    ];

    for (let i = 0; i < 30; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)].clone();
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const shape = new THREE.Mesh(geometry, material);

        shape.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );
        shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        shape.scale.setScalar(Math.random() * 0.5 + 0.5);
        group.add(shape);
    }

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    });

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        group.rotation.y += delta * 0.1;
        
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
}


/* ==========================================================================
   6. Website Calculator Wizard Logic (FIXED & POLISHED)
   ========================================================================== */
function initCalculatorWizard() {
    const modal = document.getElementById('calculatorModal');
    if (!modal) return;
    const steps = modal.querySelectorAll('.calculator-step');
    // If there are no wizard steps on this page, skip the complex wizard initialization.
    // Some pages (like index.html) use a simplified calculator modal instead.
    if (!steps || steps.length === 0) return;
    const prevBtn = modal.querySelector('#prev-step-btn');
    const nextBtn = modal.querySelector('#next-step-btn');
    const costResultContainer = modal.querySelector('#cost-result');
    let currentStep = 1;

    function updateWizardUI() {
        steps.forEach((step, index) => step.classList.toggle('active', index + 1 === currentStep));
        modal.querySelectorAll('.progress-bar-step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index < currentStep - 1) step.classList.add('completed');
            else if (index === currentStep - 1) step.classList.add('active');
        });
        prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
        nextBtn.textContent = currentStep === steps.length - 1 ? 'Calculate Quote' : 'Next Step';
        nextBtn.style.display = currentStep === steps.length ? 'none' : 'inline-block';
        costResultContainer.classList.remove('active');
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep === steps.length - 1) { // If on the step before the quote
            calculateAndDisplayCost();
        }
        if (currentStep < steps.length) {
            currentStep++;
            updateWizardUI();
        }
    });

    prevBtn.addEventListener('click', () => { if (currentStep > 1) { currentStep--; updateWizardUI(); } });
    
    modal.querySelectorAll('.selection-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.nodeName === 'INPUT') return;
            const input = card.querySelector('input');
            if (input.type === 'radio') {
                input.checked = true;
                document.querySelectorAll(`input[name="${input.name}"]`).forEach(radio => {
                    radio.closest('.selection-card').classList.remove('selected');
                });
                card.classList.add('selected');
            } else { // Checkbox
                input.checked = !input.checked;
                card.classList.toggle('selected');
            }
        });
    });

    // Set defaults
    modal.querySelectorAll('input[type="radio"][checked]').forEach(radio => {
        radio.closest('.selection-card').classList.add('selected');
    });

    document.getElementById('send-quote-btn')?.addEventListener('click', () => {
        // ... EmailJS logic for sending the quote ...
    });

    updateWizardUI();
}

function calculateAndDisplayCost() {
    const form = document.getElementById('calculator-form');
    const formData = new FormData(form);
    
    let totalCost = 0;
    const summary = [];

    const typeCosts = { portfolio: 2500, corporate: 4000, 'e-commerce': 7500, custom: 12000 };
    const websiteType = formData.get('website-type');
    if(websiteType) {
        const websiteTypeText = document.querySelector(`input[name="website-type"][value="${websiteType}"]`).closest('.selection-card').querySelector('h4').textContent;
        totalCost += typeCosts[websiteType];
        summary.push({ item: 'Project Type', value: websiteTypeText, cost: typeCosts[websiteType] });
    }
    
    const featureCosts = { blog: 500, 'seo-tools': 400, 'payment-gateways': 700, 'user-logins': 1200 };
    const selectedFeatures = formData.getAll('features');
    if (selectedFeatures.length > 0) {
        let featuresCost = 0;
        let featureNames = selectedFeatures.map(feature => document.querySelector(`input[value="${feature}"]`).closest('.selection-card').querySelector('h4').textContent);
        selectedFeatures.forEach(feature => { featuresCost += featureCosts[feature] || 0; });
        totalCost += featuresCost;
        summary.push({ item: 'Additional Features', value: featureNames.join(', '), cost: featuresCost });
    }

    const designMultipliers = { minimalist: 1, modern: 1.15, creative: 1.3 };
    const designStyle = formData.get('design-style');
    if(designStyle) {
        const designMultiplier = designMultipliers[designStyle];
        const designStyleText = document.querySelector(`input[value="${designStyle}"]`).closest('.selection-card').querySelector('h4').textContent;
        if (designMultiplier > 1) {
            let designCost = totalCost * (designMultiplier - 1);
            totalCost += designCost;
            summary.push({ item: 'Design Style', value: `${designStyleText} (+${((designMultiplier - 1) * 100).toFixed(0)}%)`, cost: designCost });
        } else {
            summary.push({ item: 'Design Style', value: designStyleText, cost: 0 });
        }
    }

    const resultContainer = document.getElementById('cost-result');
    let summaryHtml = summary.map(line => `<li><span class="summary-item">${line.item}:</span><span class="summary-value">${line.value}</span><span class="summary-cost">$${line.cost.toLocaleString()}</span></li>`).join('');

    resultContainer.innerHTML = `
        <h4>Quote Summary</h4>
        <ul id="cost-summary">${summaryHtml}</ul>
        <div class="total-cost-wrapper">
            <p>Estimated Total</p>
            <div class="total-cost">$${totalCost.toLocaleString()}</div>
        </div>
        <p style="font-size: 0.8rem; text-align: center; margin-top: 1rem; color: #6c757d;">This is an estimate. A final quote will be provided after a detailed consultation.</p>
    `;
    resultContainer.classList.add('active');
}

// Backwards-compatible function used by index.html's inline onclick
function calculateCost() {
    // If the wizard is present, delegate to the unified function
    try {
        calculateAndDisplayCost();
    } catch (err) {
        console.error('calculateCost error:', err);
        const form = document.getElementById('calculator-form');
        if (!form) return;
        // Simple fallback: estimate cost based on website-type and checkboxes
        const formData = new FormData(form);
        let total = 0;
        const base = { basic: 1500, ecommerce: 7000, blog: 1800, portfolio: 1200, custom: 10000 };
        const type = formData.get('website-type');
        if (type && base[type]) total += base[type];
        const pages = parseInt(formData.get('pages') || '1', 10);
        total += Math.max(0, pages - 1) * 50;
        const features = formData.getAll('features');
        if (features.includes('seo')) total += 400;
        if (features.includes('responsive')) total += 300;
        if (features.includes('cms')) total += 800;
        if (features.includes('ecommerce')) total += 1500;
        const result = document.getElementById('cost-result');
        if (result) result.innerHTML = `<h4>Estimated Total</h4><div class="total-cost">$${total.toLocaleString()}</div>`;
    }
}

/* ==========================================================================
   7. Contact Form Submission
   ========================================================================== */
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const serviceID = 'YOUR_SERVICE_ID';
        const templateID = 'YOUR_CONTACT_TEMPLATE_ID';
        const publicKey = 'YOUR_PUBLIC_KEY';

        // Basic validation: if EmailJS is not loaded or keys are placeholders, don't attempt to send
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS is not loaded. Contact form submission skipped.');
            alert('Contact form is not configured on this demo. Please configure EmailJS keys to enable sending.');
            return;
        }
        if (serviceID.includes('YOUR_') || templateID.includes('YOUR_') || publicKey.includes('YOUR_')) {
            console.warn('EmailJS keys are placeholders. Update serviceID/templateID/publicKey to enable sending.');
            alert('Contact form is not configured. Please update EmailJS configuration before sending.');
            return;
        }

        emailjs.sendForm(serviceID, templateID, this, publicKey)
            .then(() => { alert('Message sent successfully!'); contactForm.reset(); },
                  (err) => { console.error('EmailJS send error:', err); alert('Failed to send message. Please try again later.'); });
    });
}

/* ==========================================================================
   8. Utility Functions
   ========================================================================== */
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

window.openCalculator = function() {
    const modal = document.getElementById('calculatorModal');
    if (modal) modal.style.display = 'block';
};

window.closeCalculator = function() {
    const modal = document.getElementById('calculatorModal');
    if (modal) modal.style.display = 'none';
};
