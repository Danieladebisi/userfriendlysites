/**
 * ==========================================================================
 * Table of Contents
 * ==========================================================================
 *
 * 1.  Core DOM Ready Event Listener & Initializers
 * 2.  UI Enhancements
 * - Dark Mode
 * - Mobile Navigation
 * - Scroll to Top Button
 * - Animate on Scroll (Intersection Observer)
 * 3.  Interactive Components
 * - Testimonial Carousel
 * - FAQ Accordion
 * - "Show More" for Portfolio
 * - Hero Text Animation
 * 4.  Three.js Hero Animation
 * 5.  Website Calculator Wizard Logic
 * - Element Caching
 * - Step Navigation
 * - Input Handling (Selection Cards)
 * - Cost Calculation Engine
 * - Quote Submission (EmailJS)
 * 6.  Contact Form Submission
 * 7.  Utility Functions
 *
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Run All Initializers on Page Load ---
    setupDarkMode();
    setupMobileNav();
    setupScrollToTop();
    setupScrollAnimations();
    setupTestimonialCarousel();
    setupFaqAccordion();
    setupShowMore();
    setupHeroAnimation();
    initHeroAnimation();
    initCalculatorWizard();
    setupContactForm();
});


/* ==========================================================================
   2. UI Enhancements
   ========================================================================== */

function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (localStorage.getItem('darkMode') === 'true' || (localStorage.getItem('darkMode') === null && prefersDark)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

function setupMobileNav() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

function setupScrollToTop() {
    const scrollToTopButton = document.getElementById('scrollToTop');
    if (!scrollToTopButton) return;

    window.addEventListener('scroll', () => {
        scrollToTopButton.style.display = (window.pageYOffset > 300) ? 'block' : 'none';
    });
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-box, .process-step, .portfolio-item, .blog-post-card');
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
   3. Interactive Components
   ========================================================================== */

function setupTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (!carousel || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const testimonials = document.querySelectorAll('.testimonial-box');
    const totalTestimonials = testimonials.length;

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalTestimonials;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
        updateCarousel();
    });
}

function setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        questionButton.addEventListener('click', () => {
            const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';
            questionButton.setAttribute('aria-expanded', !isExpanded);
            answer.style.maxHeight = !isExpanded ? answer.scrollHeight + 'px' : '0';
        });
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

function setupHeroAnimation() {
    const textEl = document.getElementById('text-animation');
    if (!textEl) return;
    const phrases = ["Stunning Websites", "Business Growth", "Lasting Results"];
    let phraseIndex = 0, charIndex = 0;

    function type() {
        if (charIndex < phrases[phraseIndex].length) {
            textEl.textContent += phrases[phraseIndex].charAt(charIndex++);
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            textEl.textContent = phrases[phraseIndex].substring(0, --charIndex);
            setTimeout(erase, 50);
        } else {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 500);
        }
    }
    type();
}


/* ==========================================================================
   4. Three.js Hero Animation
   ========================================================================== */

function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0xffffff,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const clock = new THREE.Clock();
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        particles.rotation.y = .1 * elapsedTime;
        particles.rotation.x = .05 * elapsedTime;
        if (mouseX > 0) {
            particles.rotation.y += (mouseX - window.innerWidth / 2) * 0.00002;
            particles.rotation.x += (mouseY - window.innerHeight / 2) * 0.00002;
        }
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}


/* ==========================================================================
   5. Website Calculator Wizard Logic
   ========================================================================== */

function initCalculatorWizard() {
    const modal = document.getElementById('calculatorModal');
    if (!modal) return;

    const steps = modal.querySelectorAll('.calculator-step');
    const prevBtn = modal.querySelector('#prev-step-btn');
    const nextBtn = modal.querySelector('#next-step-btn');
    const progressSteps = modal.querySelectorAll('.progress-bar-step');
    const selectionCards = modal.querySelectorAll('.selection-card');
    let currentStep = 1;

    function updateWizard() {
        steps.forEach(step => step.classList.remove('active'));
        steps[currentStep - 1].classList.add('active');

        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });

        prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
        nextBtn.textContent = currentStep === steps.length ? 'Calculate Quote' : 'Next Step';
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length) {
            currentStep++;
            updateWizard();
        } else {
            calculateCost();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateWizard();
        }
    });

    selectionCards.forEach(card => {
        card.addEventListener('click', () => {
            const input = card.querySelector('input');
            if (input.type === 'radio') {
                // Deselect other radio buttons in the same group
                document.querySelectorAll(`input[name="${input.name}"]`).forEach(radio => {
                    radio.closest('.selection-card').classList.remove('selected');
                });
            }
            // Toggle selection for both radio and checkbox
            card.classList.toggle('selected', !input.checked);
            input.checked = !input.checked;
        });
    });

    // Handle quote email submission
    const sendQuoteBtn = document.getElementById('send-quote-btn');
    sendQuoteBtn.addEventListener('click', () => {
        const email = document.getElementById('quote-email').value;
        if (!email) {
            alert('Please enter your email address.');
            return;
        }
        
        // --- IMPORTANT ---
        // Replace with your actual EmailJS Service ID, QUOTE Template ID, and Public Key
        const serviceID = 'YOUR_SERVICE_ID';
        const templateID = 'YOUR_QUOTE_TEMPLATE_ID'; // A separate template for quotes
        const publicKey = 'YOUR_PUBLIC_KEY';
        
        const quoteHTML = document.getElementById('cost-result').innerHTML;

        const emailParams = {
            to_email: email,
            quote_details: quoteHTML,
        };

        emailjs.send(serviceID, templateID, emailParams, publicKey)
            .then(() => {
                alert('Your quote has been sent to ' + email);
            }, (error) => {
                alert('Failed to send quote. Error: ' + JSON.stringify(error));
            });
    });

    updateWizard();
}

function calculateCost() {
    const form = document.getElementById('calculator-form');
    const formData = new FormData(form);
    
    let totalCost = 0;
    const costBreakdown = [];

    // Base Costs
    const typeCosts = { portfolio: 2000, corporate: 3500, 'e-commerce': 6000, custom: 10000 };
    const websiteType = formData.get('website-type');
    totalCost += typeCosts[websiteType] || 0;
    costBreakdown.push({ item: 'Base Website Type', cost: typeCosts[websiteType] });
    
    // Feature Costs
    const featureCosts = { blog: 500, 'seo-tools': 400, 'payment-gateways': 700, 'user-logins': 1200 };
    formData.getAll('features').forEach(feature => {
        totalCost += featureCosts[feature] || 0;
        costBreakdown.push({ item: `Feature: ${feature}`, cost: featureCosts[feature] });
    });

    // Design Style Multiplier
    const designMultipliers = { minimalist: 1, modern: 1.15, creative: 1.3 };
    const designStyle = formData.get('design-style');
    const designMultiplier = designMultipliers[designStyle] || 1;
    totalCost *= designMultiplier;
    costBreakdown.push({ item: `Design Style (${designStyle})`, multiplier: `${(designMultiplier*100-100).toFixed(0)}%` });

    displayCost(totalCost, costBreakdown);
}

function displayCost(totalCost, breakdown) {
    const resultContainer = document.getElementById('cost-result');
    let breakdownHtml = breakdown.map(item => `<li>${item.item}: ${item.cost ? `$${item.cost}` : item.multiplier}</li>`).join('');
    
    resultContainer.innerHTML = `
        <p>Your preliminary estimate is:</p>
        <div class="total-cost">$${totalCost.toFixed(0)}</div>
        <p>This is a ballpark figure. A detailed proposal will be provided after a consultation.</p>
        <!-- <details><summary>View Breakdown</summary><ul>${breakdownHtml}</ul></details> -->
    `;
}


/* ==========================================================================
   6. Contact Form Submission
   ========================================================================== */

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // --- IMPORTANT ---
        const serviceID = 'YOUR_SERVICE_ID';
        const templateID = 'YOUR_CONTACT_TEMPLATE_ID'; // A separate template for contact
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
   7. Utility Functions
   ========================================================================== */
   
// Added as a global function for button onclick attributes
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Added as global functions for the calculator modal
window.openCalculator = function() {
    const modal = document.getElementById('calculatorModal');
    if (modal) modal.style.display = 'block';
};

window.closeCalculator = function() {
    const modal = document.getElementById('calculatorModal');
    if (modal) modal.style.display = 'none';
};
