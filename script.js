/**
 * ==========================================================================
 * Table of Contents
 * ==========================================================================
 *
 * 1.  Core DOM Ready Event Listener & Initializers
 * 2.  Dynamic Content Loading (Header/Footer)
 * 3.  UI Enhancements
 * - Dark Mode
 * - Mobile Navigation
 * - Scroll to Top Button
 * - Animate on Scroll (Intersection Observer)
 * 4.  Interactive Components
 * - Testimonial Carousel
 * - "Show More" for Portfolio
 * 5.  Hero Animation (SVG Reveal)
 * 6.  Website Calculator Wizard Logic (Major Overhaul)
 * - Element Caching & State Management
 * - Step Navigation & UI Updates
 * - Input Handling (FIXED)
 * - Cost Calculation Engine & Quote Display (FIXED)
 * - Quote Submission (EmailJS)
 * 7.  Contact Form Submission
 * 8.  Utility Functions
 *
 * ==========================================================================
 */

// --- 1. Core DOM Ready Event Listener ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Run All Initializers on Page Load ---
    loadHTML('header-placeholder', 'header.html').then(() => {
        // These scripts depend on the header being loaded
        setupDarkMode();
        setupMobileNav();
    });
    loadHTML('footer-placeholder', 'footer.html');

    initUI();
    initInteractiveComponents();
    initHeroRevealAnimation();
    initCalculatorWizard();
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
    // We use event delegation on the body because the header is loaded dynamically
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
            if (navLinks) navLinks.classList.toggle('active');
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
    // Use event delegation for dynamically loaded content
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
   5. Hero Animation (SVG Reveal)
   ========================================================================== */
function initHeroRevealAnimation() {
    const heroPath = document.getElementById('hero-path');
    if (!heroPath || typeof gsap === 'undefined') {
        console.warn("GSAP or hero path not found for animation.");
        return;
    }
    // Animate from the initial closed state to the final open state
    gsap.to(heroPath, {
        duration: 2,
        ease: "power3.inOut",
        attr: { d: "M 0,800 C 800,800 800,0 1440,0 V 800 Z" },
        delay: 0.2
    });
}


/* ==========================================================================
   6. Website Calculator Wizard Logic (Major Overhaul)
   ========================================================================== */
function initCalculatorWizard() {
    const modal = document.getElementById('calculatorModal');
    if (!modal) return;

    const steps = modal.querySelectorAll('.calculator-step');
    const prevBtn = modal.querySelector('#prev-step-btn');
    const nextBtn = modal.querySelector('#next-step-btn');
    const progressSteps = modal.querySelectorAll('.progress-bar-step');
    const costResultContainer = modal.querySelector('#cost-result');
    let currentStep = 1;

    function updateWizardUI() {
        steps.forEach((step, index) => step.classList.toggle('active', index + 1 === currentStep));
        
        progressSteps.forEach((step, index) => {
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

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateWizardUI();
        }
    });
    
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
            } else {
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
    const websiteTypeText = document.querySelector(`input[name="website-type"][value="${websiteType}"]`).closest('.selection-card').querySelector('h4').textContent;
    totalCost += typeCosts[websiteType] || 0;
    summary.push({ item: 'Project Type', value: websiteTypeText, cost: typeCosts[websiteType] });
    
    const featureCosts = { blog: 500, 'seo-tools': 400, 'payment-gateways': 700, 'user-logins': 1200 };
    const selectedFeatures = formData.getAll('features');
    if (selectedFeatures.length > 0) {
        let featuresCost = 0;
        let featureNames = [];
        selectedFeatures.forEach(feature => {
            featuresCost += featureCosts[feature] || 0;
            featureNames.push(document.querySelector(`input[value="${feature}"]`).closest('.selection-card').querySelector('h4').textContent);
        });
        totalCost += featuresCost;
        summary.push({ item: 'Additional Features', value: featureNames.join(', '), cost: featuresCost });
    }

    const designMultipliers = { minimalist: 1, modern: 1.15, creative: 1.3 };
    const designStyle = formData.get('design-style');
    const designMultiplier = designMultipliers[designStyle] || 1;
    if (designMultiplier > 1) {
        let designCost = totalCost * (designMultiplier - 1);
        totalCost += designCost;
        const designStyleText = document.querySelector(`input[value="${designStyle}"]`).closest('.selection-card').querySelector('h4').textContent;
        summary.push({ item: `Design Style (${designStyleText})`, value: `+${((designMultiplier - 1) * 100).toFixed(0)}%`, cost: designCost });
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
    `;
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

        emailjs.sendForm(serviceID, templateID, this, publicKey)
            .then(() => {
                alert('Message sent successfully!');
                contactForm.reset();
            }, (err) => {
                alert('Failed to send message. Error: ' + JSON.stringify(err));
            });
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
