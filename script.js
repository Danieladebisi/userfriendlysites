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
    setupHeaderHeightSizing();
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
                        const closeBtn = document.getElementById('calculator-close') || (calcModal && calcModal.querySelector('.close'));
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
    initHeroInteractions();
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
    setupStickyHeader();
    setupActiveNav();
    setupCounters();
    setupFAQ();
    setupFloatingCTA();
    setupGlobalCTADelegation();
}

function initInteractiveComponents() {
    setupTestimonialCarousel();
    setupShowMore();
    initWhyChooseInteractions();
    setupPortfolioFilters();
    setupPortfolioLightbox();
}

/* Why Choose Us: parallax on scroll + tilt on hover (motion-safe) */
function initWhyChooseInteractions() {
    const tiles = Array.from(document.querySelectorAll('.img-tile'));
    if (!tiles.length) return;

    const supportsReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Parallax on scroll: translate image slightly based on data-depth and intersection
    const parallaxObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const el = entry.target;
            const depth = parseFloat(el.getAttribute('data-depth') || '12');
            const img = el.querySelector('img');
            if (!img) return;
            if (!entry.isIntersecting) return;
            // compute a small translateY based on viewport position
            const rect = el.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
            const maxOffset = Math.min(40, depth);
            const y = - (distanceFromCenter / viewportCenter) * (maxOffset * 0.35);
            if (!supportsReducedMotion) img.style.transform = `translateY(${y}px) scale(1.04)`;
        });
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

    tiles.forEach(tile => {
        parallaxObserver.observe(tile);

        // keyboard focus: add a subtle focus outline and enable tilt via arrow keys
        tile.addEventListener('focus', () => {
            tile.classList.add('focus-visible');
            // on focus we nudge the inner image for affordance
            const img = tile.querySelector('img'); if (img && !supportsReducedMotion) img.style.transform = 'translateY(-6px) scale(1.03)';
        });
        tile.addEventListener('blur', () => {
            tile.classList.remove('focus-visible');
            const img = tile.querySelector('img'); if (img) img.style.transform = '';
        });

        // pointer-based tilt effect
        if (!supportsReducedMotion && window.PointerEvent) {
            tile.setAttribute('data-tilt', 'true');
            tile.addEventListener('pointermove', e => {
                const rect = tile.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width; // 0..1
                const py = (e.clientY - rect.top) / rect.height; // 0..1
                const tiltX = (py - 0.5) * 6; // rotateX
                const tiltY = (px - 0.5) * -8; // rotateY
                tile.style.setProperty('--tilt-x', tiltX + 'deg');
                tile.style.setProperty('--tilt-y', tiltY + 'deg');
                tile.classList.add('tilt-active');
                // subtle parallax of inner image based on data-depth
                const depth = parseFloat(tile.getAttribute('data-depth') || '12');
                const img = tile.querySelector('img');
                if (img) img.style.transform = `translate(${(px - 0.5) * depth * 0.4}px, ${(py - 0.5) * depth * 0.28}px) scale(1.05)`;
            });
            tile.addEventListener('pointerleave', () => {
                tile.classList.remove('tilt-active');
                tile.style.setProperty('--tilt-x', '0deg');
                tile.style.setProperty('--tilt-y', '0deg');
                const img = tile.querySelector('img'); if (img) img.style.transform = '';
            });
        }
    });
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
            if (navLinks) {
                const isActive = navLinks.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', String(isActive));
            }
        }
        // Close mobile menu after selecting a nav link (UX)
        const navLink = e.target.closest('header .nav-links a');
        if (navLink) {
            const nav = document.getElementById('navLinks');
            const toggle = document.getElementById('menuToggle');
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                toggle?.setAttribute('aria-expanded', 'false');
            }
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
    const wrapper = document.querySelector('.testimonial-carousel-wrapper');
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        let currentIndex = 0;
        let intervalId = null;
        const autoplay = () => {
            const items = carousel.querySelectorAll('.testimonial-box');
            if (!items.length) return;
            currentIndex = (currentIndex + 1) % items.length;
            carousel.dataset.currentIndex = currentIndex;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        };
        intervalId = setInterval(autoplay, 5000);
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => intervalId && clearInterval(intervalId));
            wrapper.addEventListener('mouseleave', () => intervalId = setInterval(autoplay, 5000));
        }
    }
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

// Sticky header: add class on scroll
function setupStickyHeader() {
    const onScroll = () => {
        if (window.scrollY > 10) document.body.classList.add('scrolled');
        else document.body.classList.remove('scrolled');
        // header height may change due to shrink-on-scroll; update CSS var
        try { updateHeaderHeightVar(); } catch(_) {}
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// Keep a CSS variable --header-height in sync with actual header size
function setupHeaderHeightSizing() {
    // set once now, then observe changes
    updateHeaderHeightVar();
    const header = document.querySelector('header');
    if (!('ResizeObserver' in window) || !header) {
        // fallback: update on resize
        window.addEventListener('resize', () => { try { updateHeaderHeightVar(); } catch(_) {} }, { passive: true });
        return;
    }
    try {
        const ro = new ResizeObserver(() => updateHeaderHeightVar());
        ro.observe(header);
    } catch(_) {
        window.addEventListener('resize', () => { try { updateHeaderHeightVar(); } catch(_) {} }, { passive: true });
    }
}

function updateHeaderHeightVar() {
    const header = document.querySelector('header');
    const h = header ? Math.ceil(header.getBoundingClientRect().height) : 74;
    document.documentElement.style.setProperty('--header-height', h + 'px');
}

// Active nav link highlighting based on section in view
function setupActiveNav() {
    const links = Array.from(document.querySelectorAll('header .nav-links a[href*="#"]'));
    if (!links.length) return;
    const getHash = (href) => {
        try {
            const u = new URL(href, window.location.href);
            return u.hash || '';
        } catch (_) {
            return href.startsWith('#') ? href : '';
        }
    };
    const sections = links.map(a => document.querySelector(getHash(a.getAttribute('href')))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = '#' + entry.target.id;
            const link = links.find(a => getHash(a.getAttribute('href')) === id);
            if (!link) return;
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
    sections.forEach(s => observer.observe(s));
}

// Metric counters animation
function setupCounters() {
    const counters = document.querySelectorAll('.metric-value[data-count]');
    if (!counters.length) return;
    const animate = (el) => {
        const target = parseInt(el.getAttribute('data-count') || '0', 10);
        const duration = 1200;
        const start = performance.now();
        const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
            el.textContent = Math.round(target * eased).toLocaleString();
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
}

// FAQ accordion
function setupFAQ() {
    document.body.addEventListener('click', (e) => {
        // Index/homepage FAQ pattern: button.faq-q + panel#id.faq-a
        const btn = e.target.closest('.faq-q');
        if (btn) {
            const panel = document.getElementById(btn.getAttribute('aria-controls'));
            if (!panel) return;
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            if (expanded) panel.setAttribute('hidden', ''); else panel.removeAttribute('hidden');
            return;
        }

        // Services page FAQ pattern: .faq-item > .faq-question + .faq-answer (animated height)
        const q2 = e.target.closest('.faq-question');
        if (!q2) return;
        const faqItem = q2.closest('.faq-item');
        if (!faqItem) return;
        const container = faqItem.parentElement?.classList.contains('faq-container') ? faqItem.parentElement : faqItem.parentElement?.closest('.faq-container');
        const answer = faqItem.querySelector('.faq-answer');
        const isExpanded = q2.getAttribute('aria-expanded') === 'true';
        // Close other items for cleanliness
        if (container) {
            container.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    const qb = item.querySelector('.faq-question');
                    const ans = item.querySelector('.faq-answer');
                    if (qb) qb.setAttribute('aria-expanded', 'false');
                    if (ans) { ans.style.maxHeight = '0'; ans.style.padding = '0 1.5rem'; }
                }
            });
        }
        // Toggle current
        q2.setAttribute('aria-expanded', String(!isExpanded));
        if (answer) {
            if (!isExpanded) { answer.style.maxHeight = answer.scrollHeight + 'px'; answer.style.padding = '0 1.5rem 1.5rem 1.5rem'; }
            else { answer.style.maxHeight = '0'; answer.style.padding = '0 1.5rem'; }
        }
    });
}

// Floating CTA wiring
function setupFloatingCTA() {
    const cta = document.getElementById('floating-cta');
    if (!cta) return;
    cta.addEventListener('click', (e) => {
        e.preventDefault();
        const trigger = document.getElementById('openCalculatorHome');
        if (trigger) trigger.click(); else window.openCalculator?.();
    });
}

// Centralized CTA routing: unify multiple pathways to single destinations
function setupGlobalCTADelegation() {
    // Helper to ensure calculator fragment is present and wired before opening
    async function ensureCalculatorLoaded() {
        let calcModal = document.getElementById('calculatorModal');
        if (calcModal) return true;
        try {
            await loadHTML('calculator-placeholder', 'calculator.html');
            calcModal = document.getElementById('calculatorModal');
            if (!calcModal) return false;
            // Wire core controls (mirror initial load wiring)
            const closeBtn = document.getElementById('calculator-close') || (calcModal && calcModal.querySelector('.close'));
            if (closeBtn) closeBtn.addEventListener('click', () => window.closeCalculator());
            const cancelBtn = document.getElementById('calculator-cancel');
            if (cancelBtn) cancelBtn.addEventListener('click', () => window.closeCalculator());
            const calcBtn = document.getElementById('calculator-calc');
            if (calcBtn) calcBtn.addEventListener('click', () => calculateCost());
            const sendQuoteBtn = document.getElementById('send-quote-btn');
            if (sendQuoteBtn) {
                sendQuoteBtn.addEventListener('click', () => { if (typeof window.sendCalculatorQuote === 'function') window.sendCalculatorQuote(); });
            }
            // Initialize wizard and form if not already
            try { wireCalculatorForm(); initCalculatorWizard(); } catch(_) {}
            return true;
        } catch (err) {
            console.error('Failed to load calculator on demand:', err);
            return false;
        }
    }

    document.body.addEventListener('click', async (e) => {
        const el = e.target.closest('[data-cta]');
        if (!el) return;
        const action = (el.getAttribute('data-cta') || '').toLowerCase();
        if (!action) return;
        switch (action) {
            case 'quote': {
                // Let legacy handlers handle legacy triggers to avoid double-binding
                if (el.matches('#openCalculator, #openCalculatorHome')) return;
                e.preventDefault();
                e.stopPropagation();
                const ready = await ensureCalculatorLoaded();
                if (ready) window.openCalculator?.();
                break;
            }
            case 'contact': {
                const target = document.getElementById('contact');
                if (target) {
                    e.preventDefault();
                    e.stopPropagation();
                    try { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(_) {}
                } else {
                    // Fallback to homepage contact anchor
                    const href = el.getAttribute('href') || '';
                    if (!/index\.html#contact/i.test(href)) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = 'index.html#contact';
                    }
                }
                break;
            }
            case 'portfolio': {
                const target = document.getElementById('portfolio');
                if (target) {
                    e.preventDefault();
                    e.stopPropagation();
                    try { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(_) {}
                } else {
                    const href = el.getAttribute('href') || '';
                    if (!/index\.html#portfolio/i.test(href)) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = 'index.html#portfolio';
                    }
                }
                break;
            }
            case 'case-study': {
                // Allow default navigation/behavior
                break;
            }
            default: {
                // no-op for unknown actions
            }
        }
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

// Portfolio category filters (client-side)
function setupPortfolioFilters() {
    const container = document.querySelector('#portfolio');
    if (!container) return;
    const chips = Array.from(container.querySelectorAll('.portfolio-filters .filter-chip'));
    const items = Array.from(container.querySelectorAll('.portfolio-grid .portfolio-item'));
    if (!chips.length || !items.length) return;
    const applyFilter = (cat) => {
        items.forEach(it => {
            const c = (it.getAttribute('data-cat') || '').toLowerCase();
            const show = cat === 'all' || c.split(',').map(s => s.trim()).includes(cat);
            if (!show) {
                it.classList.add('filter-hiding');
                setTimeout(() => { it.classList.add('filtered-out'); it.classList.remove('filter-hiding','filter-show','filter-show-active'); }, 180);
            } else {
                it.classList.remove('filtered-out');
                it.classList.add('filter-show');
                requestAnimationFrame(() => requestAnimationFrame(() => it.classList.add('filter-show-active')));
                setTimeout(() => it.classList.remove('filter-show','filter-show-active'), 350);
            }
        });
    };
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cat = (chip.getAttribute('data-filter') || 'all').toLowerCase();
            chips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
            chip.classList.add('active'); chip.setAttribute('aria-pressed', 'true');
            applyFilter(cat);
        });
    });
    // init
    applyFilter('all');

    // Pointer spotlight effect on cards
    items.forEach(item => {
        item.addEventListener('pointermove', e => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            item.style.setProperty('--mx', x + '%');
            item.style.setProperty('--my', y + '%');
        });
    });
}

// Portfolio Quick View Lightbox
function setupPortfolioLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (!modal) return;
    const titleEl = modal.querySelector('#lightbox-title');
    const imgEl = modal.querySelector('#lightbox-img');
    const viewBtn = modal.querySelector('#lightbox-view');
    const closeBtn = modal.querySelector('.lightbox-close');
    let lastFocus = null;

    function open(data) {
        lastFocus = document.activeElement;
        titleEl.textContent = data.title || 'Project';
        imgEl.src = data.img || '';
        imgEl.alt = (data.title || 'Project') + ' preview';
        viewBtn.href = data.url || '#';
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        // focus close for a11y
        requestAnimationFrame(() => closeBtn?.focus());
        addLBFocusTrap();
    }
    function close() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        removeLBFocusTrap();
        try { lastFocus && lastFocus.focus(); } catch(_){}
    }
    closeBtn?.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });

    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-view');
        if (!btn) return;
        e.preventDefault();
        open({ title: btn.dataset.qvTitle, img: btn.dataset.qvImg, url: btn.dataset.qvUrl });
    });

    // Minimal focus trap for lightbox
    let trapHandler = null;
    function addLBFocusTrap() {
        removeLBFocusTrap();
        trapHandler = function(e) {
            if (e.key !== 'Tab') return;
            const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
            else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
        };
        document.addEventListener('keydown', trapHandler);
    }
    function removeLBFocusTrap() { if (trapHandler) document.removeEventListener('keydown', trapHandler); trapHandler = null; }
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

/* Lightweight hero interactions: pointer parallax for gallery and floating orbs */
function initHeroInteractions() {
    const gallery = document.getElementById('hero-gallery');
    const ornaments = document.querySelectorAll('.hero-ornaments .orb');
    if (!gallery && ornaments.length === 0) return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced && gallery) {
        // pointer movement on gallery to toggle tilt class and update transforms
        gallery.addEventListener('pointermove', (e) => {
            const rect = gallery.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width; // 0..1
            const py = (e.clientY - rect.top) / rect.height; // 0..1
            gallery.classList.add('tilt-active');
            // small rotation based on pointer
            const rotY = (px - 0.5) * 8; // degrees
            const rotX = (py - 0.5) * -6;
            gallery.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
        gallery.addEventListener('pointerleave', () => {
            gallery.classList.remove('tilt-active');
            gallery.style.transform = '';
        });
    }

    // gentle float for orbs — CSS prefers to handle but add slight JS variance for natural motion
    if (!prefersReduced && ornaments.length) {
        ornaments.forEach((orb, i) => {
            const base = 12 + i * 6;
            let t = 0;
            function floatTick() {
                t += 0.016 * (0.6 + i * 0.1);
                const y = Math.sin(t) * (base * 0.2);
                orb.style.transform = `translateY(${y}px)`;
                requestAnimationFrame(floatTick);
            }
            requestAnimationFrame(floatTick);
        });
    }
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

        // Update progress fill width (0% at start, 100% on last step)
        const fill = modal.querySelector('.progress-bar-line .progress-fill');
        if (fill) {
            const percent = Math.max(0, Math.min(100, ((currentStep - 1) / (steps.length - 1)) * 100));
            fill.style.width = percent + '%';
        }
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
    const summaryHtml = estimate.summary.map(line => {
        const costText = line.cost ? `<span class="summary-cost">${line.formattedCost || ''}</span>` : '';
        return `<li class="summary-row"><div class="summary-left"><strong>${line.item}</strong><div class="summary-sub">${line.value || ''}</div></div><div class="summary-right">${costText}</div></li>`;
    }).join('');
    const monthlyHtml = (document.getElementById('show-monthly')?.checked && estimate.monthly) ? `<div class="monthly-wrapper"><p>Estimated monthly (12 months)</p><div class="monthly-amount">${formatCurrency(estimate.monthly, detectCurrency())}</div></div>` : '';
    const maintenanceHtml = estimate.maintenanceMonthly ? `<div class="maintenance-note">Maintenance: <strong>$${estimate.maintenanceMonthly}/mo</strong> (billed separately)</div>` : '';

    resultContainer.innerHTML = `
        <h4>Quote Summary</h4>
        <ul id="cost-summary">${summaryHtml}</ul>
        <div class="total-cost-wrapper">
            <p>Estimated Total</p>
            <div class="total-cost animated-total" data-amount="${estimate.total}">${estimate.formattedTotal}</div>
        </div>
        ${monthlyHtml}
        ${maintenanceHtml}
        <p style="font-size: 0.8rem; text-align: center; margin-top: 1rem; color: #6c757d;">This is an estimate. A final quote will be provided after a detailed consultation.</p>
    `;
    resultContainer.classList.add('active');
    // animate the total value for better visual feedback
    try {
        const totEl = resultContainer.querySelector('.animated-total');
        if (totEl) animateCurrency(totEl, parseFloat(totEl.getAttribute('data-amount') || '0'), detectCurrency());
    } catch (e) { /* ignore animation errors */ }
    // Update mini total badge (if present)
    try {
        const rbTotal = document.getElementById('rb-total');
        if (rbTotal && estimate.formattedTotal) rbTotal.textContent = `Total: ${estimate.formattedTotal}`;
    } catch(_) {}
    // Save preferences after calculating
    saveCalculatorPreferences();
    // Show contact/send buttons
        const sendBtn = document.getElementById('send-quote-btn');
        if (sendBtn) { sendBtn.disabled = false; sendBtn.removeAttribute('aria-disabled'); sendBtn.style.display = 'inline-flex'; }
        const contactBtn = document.getElementById('contact-us');
        if (contactBtn) { contactBtn.disabled = false; contactBtn.style.display = 'inline-flex'; }
    // populate hidden fields on the contact form (if present)
    try {
        const qsField = document.getElementById('quote_summary');
        const qtField = document.getElementById('quote_total');
        if (qsField) qsField.value = estimate.summary.map(s => `${s.item}: ${s.value} ${s.formattedCost || ''}`).join('\n');
        if (qtField) qtField.value = estimate.formattedTotal;
    } catch (e) { /* ignore */ }

    // Reveal and prep ROI section after we have an estimate
    try {
        const roiSection = document.getElementById('roi-section');
        if (roiSection) {
            roiSection.hidden = false;
            // update currency prefix to localized symbol
            const prefix = roiSection.querySelector('.currency-prefix');
            if (prefix) {
                // Map currency codes to common symbols; fallback to code
                const c = detectCurrency();
                const sym = c === 'USD' ? '$' : c === 'EUR' ? '€' : c === 'GBP' ? '£' : c;
                prefix.textContent = sym;
            }
            // Store latest total for ROI computations
            roiSection.dataset.totalUsd = String(estimate.total || 0);
            // If user already typed a value, auto-compute a suggestion
            const inEl = document.getElementById('roi-customer-value');
            if (inEl && inEl.value) {
                computeAndRenderRoi();
            } else {
                const out = document.getElementById('roi-output');
                if (out) out.textContent = '';
            }
        }
    } catch(_) { /* non-blocking */ }
}

// Backwards-compatible function used by index.html's inline onclick
function calculateCost() {
    // Unified calculation with graceful fallback
    try {
        calculateAndDisplayCost();
        // Ensure the results panel is shown and scrolled into view for better UX
        const result = document.getElementById('cost-result');
        if (result) {
            result.classList.add('active');
            const container = document.querySelector('.cost-result-container') || result;
            if (container) container.classList.add('active');
            try { result.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { /* ignore */ }
        }
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
    const serviceID = serviceEl?.getAttribute('data-emailjs-service') || '';
    const templateID = templateEl?.getAttribute('data-emailjs-template') || '';
    // publicKey may be provided via a small inline script which sets window.EMAILJS_PUBLIC_KEY
    const publicKey = (window.EMAILJS_PUBLIC_KEY || '').toString();
    return { serviceID, templateID, publicKey };
}

// Note: EmailJS credentials should not be stored in the repo. Provide them via data attributes on the
// contact form or configure a server-side send endpoint. This script will read attributes at runtime.

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const serviceID = contactForm.getAttribute('data-emailjs-service') || '';
    const templateID = contactForm.getAttribute('data-emailjs-template') || '';
    // publicKey should not be stored in DOM attributes in the repo.
    const publicKey = '';

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
            console.warn(msg, { svc, tpl });
            console.warn(msg + ' Please add data-emailjs-service and data-emailjs-template to your contact form or page, and initialize EmailJS with your public key in an inline header script.');
            return false;
        }
        if (svc.includes('YOUR_') || tpl.includes('YOUR_')) {
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
                        console.warn('EmailJS initialization failed. Check that the public key is correct.');
                    resolve(false);
                }
            };
            s.onerror = () => {
                console.error('Failed to load EmailJS SDK from CDN.');
                console.error('Failed to load EmailJS SDK. Check network or CDN access.');
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
            console.warn('Contact form is not configured. Please contact us directly at contact@userfriendlysites.com');
            if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
            return;
        }

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                console.info('Message sent successfully');
                contactForm.reset();
            }, (err) => {
                console.error('EmailJS send error:', err);
                console.error('Failed to send message. Please try again later.');
            }).finally(() => {
                if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
            });
    });
}

// --- Email calculator quote integration ---
// Expose a reusable send function so it can be wired after fragment injection.
// Helper to toggle send button loading state and spinner
function setSendBtnLoading(isLoading) {
    const btn = document.getElementById('send-quote-btn');
    if (!btn) return;
    if (isLoading) {
        btn.classList.add('loading');
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');
        // add spinner if missing
        if (!btn.querySelector('.spinner')) {
            const s = document.createElement('span');
            s.className = 'spinner';
            btn.prepend(s);
        }
    } else {
        btn.classList.remove('loading');
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        const s = btn.querySelector('.spinner');
        if (s) s.remove();
    }
}

window.sendCalculatorQuote = async function sendCalculatorQuote() {
    // gather current estimate from DOM or recompute
    const form = document.getElementById('calculator-form');
    if (!form) { console.warn('Calculator not available.'); return; }
    const estimate = computeEstimate(form);
    const estimateLocalized = localizeEstimateOutput({ ...estimate });
    // prepare payload
    const payload = {
        quote_summary: estimateLocalized.summary.map(s => `${s.item}: ${s.value} ${s.formattedCost || ''}`).join('\n'),
        quote_total: estimateLocalized.formattedTotal,
        pages: form.querySelector('#pages')?.value || '',
        website_type: form.querySelector('#website-type')?.value || ''
    };

    // small UI handle: reference the send button element once so branches can re-enable it reliably
    const btn = document.getElementById('send-quote-btn');

    // reuse contact form attributes for EmailJS config, but be robust: look for any element with the attributes
    let contactForm = document.getElementById('contactForm');
    if (!contactForm) contactForm = document.querySelector('[data-emailjs-service], [data-emailjs-template]');
    const pageCfg = getEmailJsConfig();
    const serviceID = (contactForm?.getAttribute('data-emailjs-service') || pageCfg.serviceID || '');
    const templateID = (contactForm?.getAttribute('data-emailjs-template') || pageCfg.templateID || '');
    const publicKey = pageCfg.publicKey || '';

    // helper to lazy-load EmailJS if needed (reuse logic from setupContactForm)
    async function ensureEmailJsForCalc() {
        if (typeof emailjs !== 'undefined') return true;
        const missing = [];
        if (!serviceID) missing.push('serviceID');
        if (!templateID) missing.push('templateID');
        // publicKey may be missing; if so we'll still attempt REST fallback which requires a public key
        if (missing.length) {
            const msg = `EmailJS not configured for calculator. Missing: ${missing.join(', ')}.`;
            console.warn(msg, { serviceID, templateID, publicKey });
            console.warn(msg + ' Please ensure EmailJS data attributes exist on the contact form or page.');
            return false;
        }
        if (serviceID.includes('YOUR_') || templateID.includes('YOUR_')) {
            console.warn('EmailJS config appears to contain placeholder values. Please replace with real values.');
            console.warn('EmailJS appears to be using placeholder values. Please update the data attributes with your real keys.');
            return false;
        }
        return new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.emailjs.com/sdk/3.2.0/email.min.js';
            s.onload = () => {
                try { emailjs.init(publicKey); console.info('EmailJS SDK loaded and initialized for calculator.'); resolve(true); } catch (e) { console.error('EmailJS init failed', e); console.warn('EmailJS initialization failed. Check public key.'); resolve(false); }
            };
            s.onerror = () => { console.error('Failed to load EmailJS SDK (calculator).'); console.error('Failed to load EmailJS SDK. Check network or CDN access.'); resolve(false); };
            document.head.appendChild(s);
        });
    }

    const canSend = await ensureEmailJsForCalc();
    if (!canSend) {
        console.warn('EmailJS SDK not available — attempting REST API fallback');
        // continue to attempt REST API fallback below
    }

    // send via EmailJS using a lightweight template params object
    // show loading spinner and disable
    setSendBtnLoading(true);
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
            console.info('Quote emailed successfully. We will follow up soon.');
            } catch (err) {
            console.error('EmailJS sendForm error (calculator):', err);
            console.error('Failed to email quote via contact form.');
        } finally {
            setSendBtnLoading(false);
        }
    } else if (canSend) {
        // SDK available but no contact form — send via SDK send
        emailjs.send(serviceID, templateID, templateParams)
            .then(() => {
                console.info('Quote emailed successfully.');
            }, (err) => {
                console.error('EmailJS send error (calculator):', err);
                console.error('Failed to email quote. Please try again or contact us directly.');
            }).finally(() => { if (btn) { btn.disabled = false; btn.textContent = 'Email this Quote'; } });
    } else {
        // SDK not available — fallback to EmailJS REST API
        try {
            const apiUrl = 'https://api.emailjs.com/api/v1.0/email/send';
            const effectiveKey = publicKey || (window.EMAILJS_PUBLIC_KEY || '');
            if (!effectiveKey) {
                console.warn('Cannot send via REST fallback: public key is missing. Please initialize window.EMAILJS_PUBLIC_KEY or provide the public key in the page.');
                if (btn) { btn.disabled = false; btn.textContent = 'Email this Quote'; }
                return;
            }
            const body = {
                service_id: serviceID,
                template_id: templateID,
                user_id: effectiveKey,
                template_params: templateParams
            };
            const resp = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (resp.ok) {
                console.info('Quote emailed successfully (via REST API fallback).');
            } else {
                const text = await resp.text();
                console.error('EmailJS REST API error', resp.status, text);
                console.error('Failed to send quote via REST API. See console for details.');
            }
            } catch (err) {
            console.error('EmailJS REST API send failed', err);
            console.error('Failed to send quote via REST API. See console for details.');
        } finally {
            setSendBtnLoading(false);
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

// (Removed duplicate calculateCost override - single implementation above handles showing results)

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
    // Global pricing adjustment: 40% off (multiply by 0.6)
    const PRICE_FACTOR = 0.60;
    // Baselines
    const baseUSD = { basic: 1200, portfolio: 1200, blog: 2500, ecommerce: 7000, custom: 12000 };
    // Price all features present in the UI
    const featureCostsUSD = {
        seo: 500,
        responsive: 400,
        cms: 800,
        ecommerce: 1500,
        analytics: 300,
        performance: 600,
        accessibility: 400,
        multilanguage: 700
    };

    const type = (formData.get('website-type') || 'basic').toString();
    const pages = parseInt(formData.get('pages') || '1', 10);
    const perPageUSD = 75; // cost per additional page beyond the first
    const selectedFeatures = formData.getAll('features');

    // Apply price factor to base, per-page, and features
    const baseCost = Math.round(((baseUSD[type] || 1500) * PRICE_FACTOR));
    const pagesCost = Math.max(0, pages - 1) * Math.round(perPageUSD * PRICE_FACTOR);
    const featuresCost = selectedFeatures.reduce((sum, f) => sum + Math.round(((featureCostsUSD[f] || 0) * PRICE_FACTOR)), 0);
    const subtotal = baseCost + pagesCost + featuresCost;

    // Timeline surcharge
    const timeline = (formData.get('timeline') || 'standard').toString();
    const timelineMultiplier = timeline === 'express' ? 1.2 : timeline === 'rush' ? 1.5 : 1;
    const timelineCost = Math.round(subtotal * (timelineMultiplier - 1));
    const preComplexTotal = subtotal + timelineCost;

    // Complexity surcharge based on number of features selected
    const complexityMultiplier = 1 + Math.min(0.25, selectedFeatures.length * 0.08);
    const complexityCost = Math.round(preComplexTotal * (complexityMultiplier - 1));
    const preDiscountTotal = preComplexTotal + complexityCost;

    // Discount
    const code = (formData.get('discount_code') || '').toString().trim().toUpperCase();
    const discounts = { 'SAVE10': 0.10, 'WELCOME15': 0.15 };
    const discountRate = discounts[code] || 0;
    const discountAmount = Math.round(preDiscountTotal * discountRate);
    const finalTotal = Math.max(0, Math.round(preDiscountTotal - discountAmount));

    // Maintenance monthly (not part of finalTotal)
    const maintenance = (formData.get('maintenance') || 'none').toString();
    const maintenanceMonthly = maintenance === 'basic' ? 30 : maintenance === 'pro' ? 120 : 0;

    // Monthly option uses the final total after all adjustments
    const monthly = Math.round((finalTotal / 12) + maintenanceMonthly);

    const summary = [];
    summary.push({ item: 'Base (type)', value: type, cost: baseCost });
    if (pagesCost > 0) summary.push({ item: 'Pages', value: `${pages} pages`, cost: pagesCost });
    if (selectedFeatures.length) summary.push({ item: 'Features', value: selectedFeatures.join(', '), cost: featuresCost });
    if (timelineMultiplier > 1) summary.push({ item: 'Timeline', value: timeline, cost: timelineCost });
    if (complexityMultiplier > 1) summary.push({ item: 'Complexity', value: `${Math.round((complexityMultiplier - 1) * 100)}%`, cost: complexityCost });
    if (discountAmount > 0) summary.push({ item: 'Discount', value: `${Math.round(discountRate * 100)}%`, cost: -discountAmount });
    if (maintenanceMonthly > 0) summary.push({ item: 'Maintenance (monthly)', value: `$${maintenanceMonthly}/mo`, cost: 0 });

    return { total: finalTotal, summary, monthly, maintenanceMonthly, discountAmount };
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

// Small animated counter for the total amount (improves perceived polish)
function animateCurrency(element, amountUSD, currency) {
    const duration = 700; // ms
    const start = performance.now();
    const startVal = 0;
    function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; // easeInOutQuad-ish
        const current = Math.round(startVal + (amountUSD - startVal) * eased);
        element.textContent = formatCurrency(current, currency);
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
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

    // Live update toggle, reset, and debounced re-calc
    const liveToggle = document.getElementById('calc-live');
    const resetBtn = document.getElementById('calculator-reset');
    const calc = () => { try { calculateAndDisplayCost(); updateResultBadges(); } catch(_){} };
    let t = null;
    const debouncedCalc = () => { if (liveToggle && !liveToggle.checked) return; clearTimeout(t); t = setTimeout(calc, 150); };
    // watch form inputs for immediate feedback
    form.querySelectorAll('select, input').forEach(el => {
        el.addEventListener('input', debouncedCalc);
        el.addEventListener('change', debouncedCalc);
    });
    // reset clears inputs and local storage
    resetBtn?.addEventListener('click', () => {
        try { localStorage.removeItem('calculatorPrefs'); } catch(_){}
        form.reset();
        // ensure range output reflects default
        const pages = form.querySelector('#pages');
        if (pages) pages.nextElementSibling.value = pages.value;
        calc();
    });

    // wire discount apply button
    const applyBtn = document.getElementById('apply-discount');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            // re-run calculation and show feedback
            try { calculateAndDisplayCost();
                const code = (document.getElementById('discount-code')?.value || '').trim();
                if (!code) console.warn('No discount code entered.');
                else console.info('Discount code applied (if valid).');
            } catch (e) { console.warn(e); }
        });
    }

    // toggle monthly display re-calculation
    const monthlyCheckbox = document.getElementById('show-monthly');
    if (monthlyCheckbox) monthlyCheckbox.addEventListener('change', () => calculateAndDisplayCost());

    // ROI handlers
    const roiBtn = document.getElementById('roi-calc');
    if (roiBtn) roiBtn.addEventListener('click', computeAndRenderRoi);
    const roiInput = document.getElementById('roi-customer-value');
    if (roiInput) roiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); computeAndRenderRoi(); } });

    // Initial badges render
    updateResultBadges();
    // Make badges clickable to jump to steps
    const badgeToStep = new Map([
        ['rb-type', '#step-type'],
        ['rb-pages', '#step-pages'],
        ['rb-features', '#step-features'],
        ['rb-maint', '#step-options'],
        ['rb-discount', '#step-options'],
        ['rb-total', '#step-quote']
    ]);
    document.querySelectorAll('.result-badges .rb-chip').forEach(chip => {
        const sel = badgeToStep.get(chip.id);
        if (!sel) return;
        chip.style.cursor = 'pointer';
        chip.addEventListener('click', () => {
            const section = document.querySelector(sel);
            if (!section) return;
            try { section.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(_) {}
            // If wizard is present, set the active step to the target
            const modal = document.getElementById('calculatorModal');
            if (!modal) return;
            const steps = Array.from(modal.querySelectorAll('.calculator-step'));
            const idx = steps.findIndex(s => s.matches(sel));
            const nextBtn = modal.querySelector('#next-step-btn');
            const prevBtn = modal.querySelector('#prev-step-btn');
            if (idx >= 0 && nextBtn && prevBtn) {
                // emulate wizard update by toggling classes
                steps.forEach((step, i) => step.classList.toggle('active', i === idx));
                modal.querySelectorAll('.progress-bar-step').forEach((p, i) => {
                    p.classList.remove('active','completed');
                    if (i < idx) p.classList.add('completed'); else if (i === idx) p.classList.add('active');
                });
                prevBtn.style.display = idx === 0 ? 'none' : 'inline-block';
                nextBtn.textContent = idx === (steps.length - 2) ? 'Calculate Quote' : 'Next Step';
                nextBtn.style.display = idx === (steps.length - 1) ? 'none' : 'inline-block';
                // also update progress fill width
                const fill = modal.querySelector('.progress-bar-line .progress-fill');
                if (fill && steps.length > 1) {
                    const percent = Math.max(0, Math.min(100, (idx / (steps.length - 1)) * 100));
                    fill.style.width = percent + '%';
                }
            }
        });
    });

    // Tab chip navigation
    document.querySelectorAll('.calc-tabs .tab-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSel = btn.getAttribute('data-target');
            const el = targetSel ? document.querySelector(targetSel) : null;
            if (!el) return;
            try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(_) {}
        });
    });

    // Bottom bar buttons
    document.getElementById('calculator-close-bottom')?.addEventListener('click', () => window.closeCalculator());
    document.getElementById('calculator-calc-bottom')?.addEventListener('click', () => calculateAndDisplayCost());
    // Removed duplicate bottom Email button; no sync needed
}

// Compute break-even customers needed for ROI based on last estimate and user input
function computeAndRenderRoi() {
    const roiSection = document.getElementById('roi-section');
    const out = document.getElementById('roi-output');
    const input = document.getElementById('roi-customer-value');
    if (!roiSection || !out || !input) return;
    const totalUsd = parseFloat(roiSection.dataset.totalUsd || '0');
    const valuePerCustomer = parseFloat(input.value || '0');
    if (!totalUsd || !valuePerCustomer || valuePerCustomer <= 0) {
        out.classList.add('error');
        out.innerHTML = 'Enter a valid average customer value to see ROI.';
        return;
    }
    out.classList.remove('error');
    const currency = detectCurrency();
    // Convert USD total into localized number for display text only
    const totalLocalized = formatCurrency(totalUsd, currency);
    // Compute customers needed (ceil)
    const customersNeeded = Math.ceil(totalUsd / valuePerCustomer);

    // If monthly view is active, show monthly break-even too
    const monthly = document.getElementById('show-monthly')?.checked;
    let monthlyLine = '';
    if (monthly) {
        const perMonth = Math.ceil(customersNeeded / 12);
        monthlyLine = `<p class="muted">Roughly ${perMonth.toLocaleString()} new customers per month over 12 months.</p>`;
    }

    out.innerHTML = `
        <p>You’d need about <strong>${customersNeeded.toLocaleString()}</strong> new customer${customersNeeded === 1 ? '' : 's'} to break even on <strong>${totalLocalized}</strong>.</p>
        ${monthlyLine}
    `;
}

// Small summary badges reflecting key selections
function updateResultBadges() {
    const form = document.getElementById('calculator-form');
    if (!form) return;
    const typeSel = form.querySelector('#website-type');
    const pages = form.querySelector('#pages');
    const feats = Array.from(form.querySelectorAll('input[name="features"]:checked')).map(i=>i.value);
    const maint = form.querySelector('input[name="maintenance"]:checked');
    const code = (form.querySelector('#discount-code')?.value || '').trim();
    const typeTxt = typeSel ? typeSel.options[typeSel.selectedIndex]?.textContent || typeSel.value : '—';
    const maintTxt = maint ? maint.value : 'none';
    const rbType = document.getElementById('rb-type');
    const rbPages = document.getElementById('rb-pages');
    const rbFeats = document.getElementById('rb-features');
    const rbMaint = document.getElementById('rb-maint');
    const rbDisc = document.getElementById('rb-discount');
    const rbTotal = document.getElementById('rb-total');
    if (rbType) rbType.textContent = `Type: ${typeTxt}`;
    if (rbPages) rbPages.textContent = `Pages: ${pages?.value || '—'}`;
    if (rbFeats) rbFeats.textContent = `Features: ${feats.length}`;
    if (rbMaint) rbMaint.textContent = `Maint.: ${maintTxt === 'pro' ? 'Managed' : maintTxt === 'basic' ? 'Basic' : 'None'}`;
    if (rbDisc) rbDisc.hidden = code.length === 0;
    // When possible, compute a quick total to show in the badge without affecting main result
    try {
        const est = computeEstimate(form);
        const loc = localizeEstimateOutput({ ...est });
        if (rbTotal) rbTotal.textContent = `Total: ${loc.formattedTotal}`;
    } catch(_) {}
}

