// Parallax effect for hero background
// --- Main DOMContentLoaded Handler ---
document.addEventListener('DOMContentLoaded', function() {
    // Parallax effect for hero background
    document.addEventListener('scroll', function() {
        var hero = document.querySelector('.enhanced-hero');
        if (hero) {
            var scrolled = window.scrollY;
            var parallax = Math.min(scrolled * 0.2, 60);
            if (!hero.classList.contains('parallax')) {
                hero.classList.add('parallax');
            }
            hero.style.setProperty('--parallax', parallax + 'px');
        }
    });

    // Portfolio entrance animation and Show More Projects button
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    function animatePortfolio() {
        portfolioItems.forEach((item, i) => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                item.classList.add('visible');
                item.style.transitionDelay = `${i * 0.12}s`;
            }
        });
    }
    window.addEventListener('scroll', animatePortfolio);
    animatePortfolio();

    // Show More Projects button functionality
    const showMoreBtn = document.getElementById('show-more');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            document.querySelectorAll('.portfolio-item.hidden').forEach(item => {
                item.classList.remove('hidden');
                item.classList.add('visible');
            });
            showMoreBtn.style.display = 'none';
        });
    }

    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
            animatePortfolio();
        });
    });

    // Lightbox preview
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    if (lightboxModal && lightboxImg && lightboxCaption) {
        document.querySelectorAll('.portfolio-item img').forEach(img => {
            img.addEventListener('click', function() {
                lightboxImg.src = img.src;
                const overlay = img.parentElement.querySelector('.portfolio-overlay');
                lightboxCaption.innerHTML = overlay ? overlay.innerHTML : '';
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        const closeBtn = document.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = '';
                lightboxImg.src = '';
            });
        }
        lightboxModal.addEventListener('click', function(e) {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = '';
                lightboxImg.src = '';
            }
        });
    }

    // Animate feature list items on scroll
    const features = document.querySelectorAll('.why-feature');
    function animateFeatures() {
        features.forEach((feature, i) => {
            const rect = feature.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                feature.style.opacity = '1';
                feature.style.transform = 'translateY(0)';
                feature.style.transitionDelay = `${i * 0.2}s`;
            }
        });
    }
    window.addEventListener('scroll', animateFeatures);
    animateFeatures();

    // Carousel functionality and image optimization
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.carousel-card');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentIndex = 0;
    let interval;

    function showSlide(index) {
        if (!carousel || cards.length === 0 || dots.length === 0) return;
        carousel.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
        cards.forEach((card, i) => {
            card.style.opacity = (i === index) ? '1' : '0.6';
            card.style.transform = (i === index)
                ? 'scale(1)'
                : 'scale(0.92)';
            card.style.zIndex = (i === index) ? '2' : '1';
        });
        currentIndex = index;
    }

    function nextSlide() {
        let next = (currentIndex + 1) % cards.length;
        showSlide(next);
    }

    function startAutoSlide() {
        stopAutoSlide(); // Clean up previous interval
        interval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
        if (interval) clearInterval(interval);
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    showSlide(0);
    startAutoSlide();

    // --- Dynamic Content Loading (Header/Footer) ---
    // This ensures the header and footer are loaded into their respective placeholders.
    loadHTML('header-placeholder', 'header.html');
    loadHTML('footer-placeholder', 'footer.html');

    // --- FAQ Accordion Functionality ---
    // Sets up the click listeners to expand and collapse the FAQ items.
    setupFaqAccordion();
});
/**
 * ==========================================================================
 * services.js
 * --------------------------------------------------------------------------
 * This script handles the interactive elements on the services.html page.
 * It is responsible for:
 * 1. Dynamically loading the shared header and footer.
 * 2. Powering the interactive FAQ accordion.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Dynamic Content Loading (Header/Footer) ---
    // This ensures the header and footer are loaded into their respective placeholders.
    loadHTML('header-placeholder', 'header.html');
    loadHTML('footer-placeholder', 'footer.html');

    // --- FAQ Accordion Functionality ---
    // Sets up the click listeners to expand and collapse the FAQ items.
    setupFaqAccordion();

});


/**
 * Asynchronously loads external HTML content into a specified element by its ID.
 * @param {string} elementId - The ID of the element to load the HTML content into.
 * @param {string} url - The URL of the HTML file to fetch.
 */
async function loadHTML(elementId, url) {
    const element = document.getElementById(elementId);
    if (element) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Could not load ${url}: ${response.statusText}`);
            }
            const data = await response.text();
            element.innerHTML = data;
        } catch (error) {
            console.error('Error loading HTML:', error);
            // Display a user-friendly error message in the placeholder
            element.innerHTML = `<p style="color:red; text-align:center;">Failed to load dynamic content.</p>`;
        }
    }
}


/**
 * Sets up the click listeners for the FAQ accordion to allow users to
 * expand and collapse answers.
 */
function setupFaqAccordion() {
    const faqContainer = document.querySelector('.faq-container');

    // Use event delegation on the container for efficiency. This means only one
    // event listener is needed for all FAQ items.
    if (faqContainer) {
        faqContainer.addEventListener('click', (event) => {
            // Find the button that was actually clicked
            const questionButton = event.target.closest('.faq-question');
            
            // If a question button was clicked...
            if (questionButton) {
                const faqItem = questionButton.parentElement;
                const answer = faqItem.querySelector('.faq-answer');
                const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';

                // First, close all other open FAQ items for a cleaner interface
                faqContainer.querySelectorAll('.faq-item').forEach(item => {
                    if (item !== faqItem) { // Don't close the one we are about to open
                        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                        const otherAnswer = item.querySelector('.faq-answer');
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.padding = "0 1.5rem"; // Remove vertical padding
                    }
                });

                // Now, toggle the current item that was clicked
                // *** THIS LINE IS NOW CORRECTED ***
                questionButton.setAttribute('aria-expanded', !isExpanded);
                
                if (!isExpanded) {
                    // Open the answer by setting max-height to its scroll height
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    // Restore vertical padding to create space
                    answer.style.padding = "0 1.5rem 1.5rem 1.5rem"; 
                } else {
                    // Close the answer
                    answer.style.maxHeight = '0';
                    answer.style.padding = "0 1.5rem";
                }
            }
        });
    }
}
