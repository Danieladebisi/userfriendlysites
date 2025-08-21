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
            // Email quote button
            const sendQuoteBtn = document.getElementById('send-quote-btn');
            if (sendQuoteBtn) {
                // attach click handler; visibility is managed after calculation
                sendQuoteBtn.addEventListener('click', () => { if (typeof window.sendCalculatorQuote === 'function') window.sendCalculatorQuote(); });
            }
        }

        // Wire any open-calculator triggers (links/buttons) on the page
        document.querySelectorAll('#openCalculator, #openCalculatorHome').forEach(el => {
            el.addEventListener('click', async (ev) => {
                ev.preventDefault();
                // If the fragment hasn't been attached to DOM, make sure it's present
                let calcModal = document.getElementById('calculatorModal');
                if (!calcModal) {
                    // attempt on-demand load (useful if initial fetch failed)
                    try {
                        await loadHTML('calculator-placeholder', 'calculator.html');
                        calcModal = document.getElementById('calculatorModal');
                        // wire new controls
                        const closeBtn = document.getElementById('calculator-close') || calcModal.querySelector('.close');
                        if (closeBtn) closeBtn.addEventListener('click', () => window.closeCalculator());
                        const cancelBtn = document.getElementById('calculator-cancel');
                        if (cancelBtn) cancelBtn.addEventListener('click', () => window.closeCalculator());
                        const calcBtn = document.getElementById('calculator-calc');
                        if (calcBtn) calcBtn.addEventListener('click', () => calculateCost());
                            const sendQuoteBtn = document.getElementById('send-quote-btn');
                            if (sendQuoteBtn) {
                                // attach click handler after on-demand load; visibility is managed after calculation
                                sendQuoteBtn.addEventListener('click', () => { if (typeof window.sendCalculatorQuote === 'function') window.sendCalculatorQuote(); });
                            }
                    } catch (err) {
                        console.error('Failed to load calculator on demand:', err);
                        return;
                    }
                }
                window.openCalculator();
            });
        });

    // wire the calculator form (preferences, listeners)
    wireCalculatorForm();

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
    // localize hero price once DOM is ready
    localizeHeroPrice();
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

    // direct listener removed — button is wired when the fragment is loaded or on-demand

    updateWizardUI();
}

function calculateAndDisplayCost() {
    const form = document.getElementById('calculator-form');
    if (!form) return;
    let estimate = computeEstimate(form);
    estimate = localizeEstimateOutput(estimate);
    const resultContainer = document.getElementById('cost-result');
    const summaryHtml = estimate.summary.map(line => `<li><span class="summary-item">${line.item}:</span><span class="summary-value">${line.value}</span><span class="summary-cost">${line.formattedCost || ''}</span></li>`).join('');
    resultContainer.innerHTML = `
        <h4>Quote Summary</h4>
        <ul id="cost-summary">${summaryHtml}</ul>
        <div class="total-cost-wrapper">
            <p>Estimated Total</p>
            <div class="total-cost">${estimate.formattedTotal}</div>
        </div>
        <p style="font-size: 0.8rem; text-align: center; margin-top: 1rem; color: #6c757d;">This is an estimate. A final quote will be provided after a detailed consultation.</p>
    `;
    resultContainer.classList.add('active');
    // Save preferences after calculating
    saveCalculatorPreferences();
    // Show contact/send buttons
    const sendBtn = document.getElementById('send-quote-btn');
    if (sendBtn) sendBtn.style.display = 'inline-block';
    const contactBtn = document.getElementById('contact-us');
    if (contactBtn) contactBtn.style.display = 'inline-block';
    // populate hidden fields on the contact form (if present)
    try {
        const qsField = document.getElementById('quote_summary');
        const qtField = document.getElementById('quote_total');
        if (qsField) qsField.value = estimate.summary.map(s => `${s.item}: ${s.value} ${s.formattedCost || ''}`).join('\n');
        if (qtField) qtField.value = estimate.formattedTotal;
    } catch (e) { /* ignore */ }
}

// Backwards-compatible function used by index.html's inline onclick
function calculateCost() {
    // Unified calculation with graceful fallback
    try {
        calculateAndDisplayCost();
    } catch (err) {
        console.error('calculateCost error:', err);
        const form = document.getElementById('calculator-form');
        if (!form) return;
        const estimate = computeEstimate(form);
        const result = document.getElementById('cost-result');
        if (result) result.innerHTML = `<h4>Estimated Total</h4><div class="total-cost">$${estimate.total.toLocaleString()}</div>`;
    }
}

/* ==========================================================================
   7. Contact Form Submission
   ========================================================================== */
// Helper: find EmailJS config anywhere on the page (search attributes individually)
function getEmailJsConfig() {
    const serviceEl = document.querySelector('[data-emailjs-service]');
    const templateEl = document.querySelector('[data-emailjs-template]');
    const keyEl = document.querySelector('[data-emailjs-key]');
    const serviceID = serviceEl?.getAttribute('data-emailjs-service') || '';
    const templateID = templateEl?.getAttribute('data-emailjs-template') || '';
    const publicKey = keyEl?.getAttribute('data-emailjs-key') || '';
    return { serviceID: serviceID || EMAILJS_FALLBACK.serviceID, templateID: templateID || EMAILJS_FALLBACK.templateID, publicKey: publicKey || EMAILJS_FALLBACK.publicKey };
}

// Fallback/default EmailJS config (use only if page attributes are missing)
// These values were provided during setup; keep them here as a last-resort fallback.
const EMAILJS_FALLBACK = {
    serviceID: 'service_xl3wr8l',
    templateID: 'template_z587bo4',
    publicKey: 'm5cA-okHHGdZuWJoh'
};

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const serviceID = contactForm.getAttribute('data-emailjs-service') || '';
    const templateID = contactForm.getAttribute('data-emailjs-template') || '';
    const publicKey = contactForm.getAttribute('data-emailjs-key') || '';

    // Lazy-load EmailJS SDK only if keys are provided and not placeholder
    async function ensureEmailJs() {
        if (typeof emailjs !== 'undefined') return true;
        // fallback to page-level config if any field missing
        const cfg = getEmailJsConfig();
        const svc = serviceID || cfg.serviceID;
        const tpl = templateID || cfg.templateID;
        const key = publicKey || cfg.publicKey;
        if (!svc || !tpl || !key) {
            const missing = [];
            if (!svc) missing.push('serviceID');
            if (!tpl) missing.push('templateID');
            if (!key) missing.push('publicKey');
            const msg = `EmailJS not configured. Missing: ${missing.join(', ')}.`;
            console.warn(msg, { svc, tpl, key });
            alert(msg + '\nPlease add data-emailjs-service, data-emailjs-template and data-emailjs-key to your contact form or page.');
            return false;
        }
        if (svc.includes('YOUR_') || tpl.includes('YOUR_') || key.includes('YOUR_')) {
            console.warn('EmailJS config appears to contain placeholder values. Please replace with real values.');
            return false;
        }
        return new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.emailjs.com/sdk/3.2.0/email.min.js';
            s.onload = () => {
                try {
                    emailjs.init(key || publicKey);
                    console.info('EmailJS SDK loaded and initialized.');
                    resolve(true);
                } catch (e) {
                    console.error('EmailJS init failed', e);
                    alert('EmailJS initialization failed. Check that the public key is correct.');
                    resolve(false);
                }
            };
            s.onerror = () => {
                console.error('Failed to load EmailJS SDK from CDN.');
                alert('Failed to load EmailJS SDK. Check network or CDN access.');
                resolve(false);
            };
            document.head.appendChild(s);
        });
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

        const emailAvailable = await ensureEmailJs();
        if (!emailAvailable) {
            alert('Contact form is not configured. Please contact us directly at contact@userfriendlysites.com');
            if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
            return;
        }

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                alert('Message sent successfully!');
                contactForm.reset();
            }, (err) => {
                console.error('EmailJS send error:', err);
                alert('Failed to send message. Please try again later.');
            }).finally(() => {
                if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
            });
    });
}

// --- Email calculator quote integration ---
// Expose a reusable send function so it can be wired after fragment injection.
window.sendCalculatorQuote = async function sendCalculatorQuote() {
    // gather current estimate from DOM or recompute
    const form = document.getElementById('calculator-form');
    if (!form) return alert('Calculator not available.');
    const estimate = computeEstimate(form);
    const estimateLocalized = localizeEstimateOutput({ ...estimate });
    // prepare payload
    const payload = {
        quote_summary: estimateLocalized.summary.map(s => `${s.item}: ${s.value} ${s.formattedCost || ''}`).join('\n'),
        quote_total: estimateLocalized.formattedTotal,
        pages: form.querySelector('#pages')?.value || '',
        website_type: form.querySelector('#website-type')?.value || ''
    };

    // reuse contact form attributes for EmailJS config, but be robust: look for any element with the attributes
    let contactForm = document.getElementById('contactForm');
    if (!contactForm) contactForm = document.querySelector('[data-emailjs-service], [data-emailjs-template], [data-emailjs-key]');
    const pageCfg = getEmailJsConfig();
    const serviceID = (contactForm?.getAttribute('data-emailjs-service') || pageCfg.serviceID || '');
    const templateID = (contactForm?.getAttribute('data-emailjs-template') || pageCfg.templateID || '');
    const publicKey = (contactForm?.getAttribute('data-emailjs-key') || pageCfg.publicKey || '');

    // helper to lazy-load EmailJS if needed (reuse logic from setupContactForm)
    async function ensureEmailJsForCalc() {
        if (typeof emailjs !== 'undefined') return true;
        const missing = [];
        if (!serviceID) missing.push('serviceID');
        if (!templateID) missing.push('templateID');
        if (!publicKey) missing.push('publicKey');
        if (missing.length) {
            const msg = `EmailJS not configured for calculator. Missing: ${missing.join(', ')}.`;
            console.warn(msg, { serviceID, templateID, publicKey });
            alert(msg + '\nPlease ensure EmailJS data attributes exist on the contact form or page.');
            return false;
        }
        if (serviceID.includes('YOUR_') || templateID.includes('YOUR_') || publicKey.includes('YOUR_')) {
            console.warn('EmailJS config appears to contain placeholder values. Please replace with real values.');
            alert('EmailJS appears to be using placeholder values. Please update the data attributes with your real keys.');
            return false;
        }
        return new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.emailjs.com/sdk/3.2.0/email.min.js';
            s.onload = () => {
                try { emailjs.init(publicKey); console.info('EmailJS SDK loaded and initialized for calculator.'); resolve(true); } catch (e) { console.error('EmailJS init failed', e); alert('EmailJS initialization failed. Check public key.'); resolve(false); }
            };
            s.onerror = () => { console.error('Failed to load EmailJS SDK (calculator).'); alert('Failed to load EmailJS SDK. Check network or CDN access.'); resolve(false); };
            document.head.appendChild(s);
        });
    }

    const canSend = await ensureEmailJsForCalc();
    if (!canSend) {
        console.warn('EmailJS SDK not available — attempting REST API fallback');
        // continue to attempt REST API fallback below
    }

    // send via EmailJS using a lightweight template params object
    const btn = document.getElementById('send-quote-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    const templateParams = Object.assign({}, payload);
    // If user has contact fields filled in the contact form, include them
    if (contactForm) {
        const nameInput = contactForm.querySelector('input[name="full_name"]') || contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        templateParams.full_name = nameInput?.value || 'Website visitor';
        templateParams.email = emailInput?.value || '';
    }

    // If contact form exists and SDK is available, copy hidden fields and send via sendForm (includes name/email).
    if (contactForm && canSend) {
        try {
            // populate hidden fields (ensure contact form has inputs)
            const qsField = document.getElementById('quote_summary');
            const qtField = document.getElementById('quote_total');
            if (qsField) qsField.value = payload.quote_summary;
            if (qtField) qtField.value = payload.quote_total;
            // send via sendForm so EmailJS receives all form inputs
            await emailjs.sendForm(serviceID, templateID, contactForm);
            alert('Quote emailed successfully. We will follow up soon.');
        } catch (err) {
            console.error('EmailJS sendForm error (calculator):', err);
            alert('Failed to email quote via contact form.');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Email this Quote'; }
        }
    } else if (canSend) {
        // SDK available but no contact form — send via SDK send
        emailjs.send(serviceID, templateID, templateParams)
            .then(() => {
                alert('Quote emailed successfully. We will follow up soon.');
            }, (err) => {
                console.error('EmailJS send error (calculator):', err);
                alert('Failed to email quote. Please try again or contact us directly.');
            }).finally(() => { if (btn) { btn.disabled = false; btn.textContent = 'Email this Quote'; } });
    } else {
        // SDK not available — fallback to EmailJS REST API
        try {
            const apiUrl = 'https://api.emailjs.com/api/v1.0/email/send';
            const body = {
                service_id: serviceID,
                template_id: templateID,
                user_id: publicKey,
                template_params: templateParams
            };
            const resp = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (resp.ok) {
                alert('Quote emailed successfully (via REST API fallback). We will follow up soon.');
            } else {
                const text = await resp.text();
                console.error('EmailJS REST API error', resp.status, text);
                alert('Failed to send quote via REST API. See console for details.');
            }
        } catch (err) {
            console.error('EmailJS REST API send failed', err);
            alert('Failed to send quote via REST API. See console for details.');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Email this Quote'; }
        }
    }
};
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
    if (!modal) return;
    // remember last focused element to restore on close
    window._lastFocusedElement = document.activeElement;
    modal.style.display = 'block';
    modal.classList.add('show');
    document.body.classList.add('modal-open');
    // focus first focusable element in modal
    setTimeout(() => {
        const focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (focusable.length) focusable[0].focus();
        addFocusTrap(modal);
    }, 50);
};

window.closeCalculator = function() {
    const modal = document.getElementById('calculatorModal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    removeFocusTrap();
    try { window._lastFocusedElement?.focus(); } catch (e) {}
};

// Accessibility: close on Escape and clicking backdrop
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('calculatorModal');
        if (modal && modal.style.display === 'block') window.closeCalculator();
    }
});

document.body.addEventListener('click', (e) => {
    const modal = document.getElementById('calculatorModal');
    if (!modal) return;
    if (modal.style.display === 'block' && e.target === modal) {
        window.closeCalculator();
    }
});

// Show results container after calculate button runs
const originalCalculate = calculateCost;
calculateCost = function() {
    originalCalculate();
    const result = document.getElementById('cost-result');
    if (result) {
        result.classList.add('active');
        // ensure container is visible if we used .cost-result-container
        const container = document.querySelector('.cost-result-container') || result;
        if (container) container.classList.add('active');
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// Focus trap helpers
let _focusTrapHandler = null;
function addFocusTrap(modal) {
    removeFocusTrap();
    _focusTrapHandler = function(e) {
        if (e.key !== 'Tab') return;
        const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    };
    document.addEventListener('keydown', _focusTrapHandler);
}
function removeFocusTrap() {
    if (_focusTrapHandler) document.removeEventListener('keydown', _focusTrapHandler);
    _focusTrapHandler = null;
}

// Preference persistence for calculator
function loadCalculatorPreferences() {
    try {
        const raw = localStorage.getItem('calculatorPrefs');
        if (!raw) return;
        const prefs = JSON.parse(raw);
        const form = document.getElementById('calculator-form');
        if (!form) return;
        if (prefs.websiteType) form.querySelector('#website-type').value = prefs.websiteType;
        if (prefs.pages) form.querySelector('#pages').value = prefs.pages;
        if (prefs.pages) form.querySelector('#pages').nextElementSibling.value = prefs.pages;
        const features = prefs.features || [];
        form.querySelectorAll('input[name="features"]').forEach(input => {
            input.checked = features.includes(input.value);
        });
    } catch (e) { console.warn('Failed to load calculator prefs', e); }
}

function saveCalculatorPreferences() {
    try {
        const form = document.getElementById('calculator-form');
        if (!form) return;
        const prefs = { websiteType: form.querySelector('#website-type')?.value, pages: form.querySelector('#pages')?.value, features: Array.from(form.querySelectorAll('input[name="features"]:checked')).map(i => i.value) };
        localStorage.setItem('calculatorPrefs', JSON.stringify(prefs));
    } catch (e) { console.warn('Failed to save calculator prefs', e); }
}

// Improved pricing algorithm
function computeEstimate(form) {
    const formData = new FormData(form);
    const base = { basic: 1500, ecommerce: 7000, blog: 1800, portfolio: 1200, custom: 10000 };
    const featureCosts = { seo: 500, responsive: 400, cms: 800, ecommerce: 1500 };
    const type = formData.get('website-type') || 'basic';
    let total = base[type] || 1500;
    const pages = parseInt(formData.get('pages') || '1', 10);
    // charge per additional page
    const perPage = 75;
    total += Math.max(0, pages - 1) * perPage;
    const selectedFeatures = formData.getAll('features');
    let featuresCost = 0;
    selectedFeatures.forEach(f => { featuresCost += featureCosts[f] || 0; });
    total += featuresCost;
    // complexity multiplier: more features => small multiplier
    const complexityMultiplier = 1 + Math.min(0.25, (selectedFeatures.length * 0.08));
    total = Math.round(total * complexityMultiplier);
    const summary = [];
    summary.push({ item: 'Base (type)', value: type, cost: base[type] || 0 });
    if (pages > 1) summary.push({ item: 'Pages', value: `${pages} pages`, cost: Math.max(0, pages - 1) * perPage });
    if (selectedFeatures.length) summary.push({ item: 'Features', value: selectedFeatures.join(', '), cost: featuresCost });
    if (complexityMultiplier > 1) summary.push({ item: 'Complexity multiplier', value: `${(complexityMultiplier * 100).toFixed(0)}%`, cost: Math.round((total / complexityMultiplier) * (complexityMultiplier - 1)) });
    return { total, summary };
}

/* ========== Currency localization helpers ========== */
function detectCurrency() {
    const lang = navigator.language || navigator.userLanguage || 'en-US';
    // Map common locales to currency
    if (lang.startsWith('es')) return 'EUR';
    if (lang.startsWith('en-GB') || lang.startsWith('gb')) return 'GBP';
    if (lang.startsWith('fr')) return 'EUR';
    if (lang.startsWith('de')) return 'EUR';
    return 'USD';
}

// Simple static exchange rates (USD base). Replace with live API if needed.
function getExchangeRate(toCurrency) {
    const rates = { 'USD': 1, 'EUR': 0.92, 'GBP': 0.78 };
    return rates[toCurrency] || 1;
}

function formatCurrency(amountUSD, currency) {
    const rate = getExchangeRate(currency);
    const value = amountUSD * rate;
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
}

function localizeHeroPrice() {
    const el = document.getElementById('hero-price');
    if (!el) return;
    const base = parseFloat(el.getAttribute('data-base-price') || '500');
    const currency = detectCurrency();
    const formatted = formatCurrency(base, currency);
    const span = el.querySelector('.currency-value');
    if (span) span.textContent = formatted;
}

// Update calculator display amounts to localized currency when showing estimates
function localizeEstimateOutput(estimate) {
    const currency = detectCurrency();
    // mutate summary values and total to localized representation
    estimate.summary = estimate.summary.map(item => ({ ...item, formattedCost: formatCurrency(item.cost || 0, currency) }));
    estimate.formattedTotal = formatCurrency(estimate.total || 0, currency);
    return estimate;
}

// Hook up preferences and inputs after loading fragment
function wireCalculatorForm() {
    const form = document.getElementById('calculator-form');
    if (!form) return;
    // load saved prefs
    loadCalculatorPreferences();
    // save on changes
    form.querySelectorAll('select, input').forEach(el => {
        el.addEventListener('change', saveCalculatorPreferences);
    });
}

