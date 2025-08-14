// Carousel functionality and image optimization
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const images = document.querySelectorAll('.carousel-img');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentIndex = 0;
    let interval;

    // Resize images client-side for performance
    images.forEach((img, i) => {
        const src = img.getAttribute('data-src');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const tempImg = new window.Image();
        tempImg.crossOrigin = 'anonymous';
        tempImg.onload = function() {
            // Resize to 400x220 (or mobile size)
            canvas.width = 400;
            canvas.height = 220;
            ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
            img.src = canvas.toDataURL('image/jpeg', 0.7); // Compress
        };
        tempImg.src = src;
    });

    function showSlide(index) {
        carousel.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextSlide() {
        let next = (currentIndex + 1) % images.length;
        showSlide(next);
    }

    function startAutoSlide() {
        interval = setInterval(nextSlide, 3500);
    }

    function stopAutoSlide() {
        clearInterval(interval);
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
