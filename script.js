// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const scrollToTopButton = document.getElementById('scrollToTop');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('nav a');
const testimonialCarousel = document.querySelector('.testimonial-carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const textAnimation = document.getElementById('text-animation');
const modal = document.getElementById('calculatorModal');
const closeModal = document.querySelector('.close');

// Animated text for hero section
const texts = [
    "We Create Stunning Websites",
    "We Boost Your Online Presence",
    "We Drive Results for Your Business"
];
let textIndex = 0;
let charIndex = 0;

function typeText() {
    if (charIndex < texts[textIndex].length) {
        textAnimation.textContent += texts[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 100);
    } else {
        setTimeout(eraseText, 2000);
    }
}

function eraseText() {
    if (charIndex > 0) {
        textAnimation.textContent = texts[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseText, 50);
    } else {
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeText, 500);
    }
}

// Start the text animation
typeText();

// Smooth scrolling for navigation
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: 'smooth'
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

darkModeToggle.addEventListener('click', toggleDarkMode);

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    toggleDarkMode();
}

// Scroll to Top Button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your form submission logic here
    alert('Thank you for your message. We will get back to you soon!');
    contactForm.reset();
});

// Testimonial Carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-box');

function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.toggle('active', i === index);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
}

nextBtn.addEventListener('click', nextTestimonial);
prevBtn.addEventListener('click', prevTestimonial);

// Initialize the first testimonial
showTestimonial(currentTestimonial);

// Auto-rotate testimonials
setInterval(nextTestimonial, 5000);

// Website Calculator Modal
function openCalculator() {
    modal.style.display = "block";
}

closeModal.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Dynamic content loading example
function loadMoreContent() {
    fetch('content.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('contentSection').innerHTML += data;
        })
        .catch(error => console.error('Error loading content:', error));
}

// Intersection Observer for animations
const animatedElements = document.querySelectorAll('.service-box, .portfolio-item, .testimonial-box');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1 });

animatedElements.forEach(element => {
    observer.observe(element);
});

// calculator 
// Website Calculator Modal
function openCalculator() {
    document.getElementById('calculatorModal').style.display = "block";
}

document.querySelector('.close').onclick = function() {
    document.getElementById('calculatorModal').style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById('calculatorModal')) {
        document.getElementById('calculatorModal').style.display = "none";
    }
}

// Calculator Function
// Website Calculator Modal
function openCalculator() {
    document.getElementById('calculatorModal').style.display = "block";
}

document.querySelector('.close').onclick = function() {
    document.getElementById('calculatorModal').style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById('calculatorModal')) {
        document.getElementById('calculatorModal').style.display = "none";
    }
}

// Calculator Function
function calculateCost() {
    const websiteType = document.getElementById('website-type').value;
    const pages = parseInt(document.getElementById('pages').value);
    const features = document.querySelectorAll('input[name="features"]:checked');
    
    let cost = 0;

    // Base cost based on website type
    switch (websiteType) {
        case 'basic':
            cost += 500;
            break;
        case 'ecommerce':
            cost += 2000;
            break;
        case 'blog':
            cost += 800;
            break;
        case 'portfolio':
            cost += 1000;
            break;
        case 'custom':
            cost += 1500;
            break;
    }

    // Additional cost based on number of pages
    cost += pages * 50;

    // Additional cost based on selected features
    features.forEach(feature => {
        switch (feature.value) {
            case 'seo':
                cost += 300;
                break;
            case 'responsive':
                cost += 400;
                break;
            case 'cms':
                cost += 600;
                break;
            case 'analytics':
                cost += 200;
                break;
            case 'ecommerce':
                cost += 1000;
                break;
            case 'blog':
                cost += 500;
                break;
        }
    });

    // Display the result
    document.getElementById('cost-result').innerText = `Estimated Cost: $${cost}`;
    document.getElementById('contact-us').style.display = "block";
}

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const items = document.querySelectorAll('.carousel a');
    let currentIndex = 0;
    let isTransitioning = false;

    const updateCarousel = () => {
        if (isTransitioning) return;
        isTransitioning = true;

        // Apply fade out effect
        carousel.style.transition = 'opacity 0.8s ease-in-out';
        carousel.style.opacity = 0;

        setTimeout(() => {
            const width = carousel.clientWidth;
            carousel.style.transform = `translateX(-${currentIndex * width}px)`;

            // Fade in after slide transition
            setTimeout(() => {
                carousel.style.opacity = 1;
                isTransitioning = false;
            }, 500);  // Adjust timing to match the fade effect
        }, 500); // Time before the slide changes
    };

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);
});

    document.getElementById('show-more').addEventListener('click', function() {
        const hiddenItems = document.querySelectorAll('.hidden');
        hiddenItems.forEach(item => {
            item.classList.remove('hidden');
        });

        this.style.display = 'none'; // Hide the "Show More" button after clicking
    });

    document.addEventListener('DOMContentLoaded', () => {
        const testimonials = document.querySelectorAll('.testimonial-box');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        let currentIndex = 0;
        let isTransitioning = false;
    
        const updateTestimonials = () => {
            if (isTransitioning) return;
            isTransitioning = true;
    
            testimonials.forEach((testimonial, index) => {
                testimonial.classList.remove('active');
                if (index === currentIndex) {
                    testimonial.classList.add('active');
                }
            });
    
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        };
    
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonials.length - 1;
            updateTestimonials();
        });
    
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
            updateTestimonials();
        });
    
        updateTestimonials();
    });

    document.addEventListener('DOMContentLoaded', () => {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.querySelector('.nav-links');
    
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    });


    // Project Intake JS 
    // Project Intake JS 
    // Project Intake JS 
    // Project Intake JS 
    // Project Intake JS 
    // Project Intake JS 
    // Project Intake JS 
    // Project Intake JS 
    // Project Intake JS 
    // Project Intake JS 
    // Project Intake JS 


    document.addEventListener('DOMContentLoaded', function () {
        // Select all the elements needed for conditional questions
        const designPreferenceYes = document.querySelector('input[name="design-preference"][value="yes"]');
        const designPreferenceNo = document.querySelector('input[name="design-preference"][value="no"]');
        const designDetails = document.getElementById('design-details');
        const contentFunctionalityYes = document.querySelector('input[name="content-functionality"][value="yes"]');
        const contentFunctionalityNo = document.querySelector('input[name="content-functionality"][value="no"]');
        const contentDetails = document.getElementById('content-details');
    
        // Modal elements
        const modal = document.getElementById('success-modal');
        const closeModalButton = document.querySelector('.close-btn');
        const modalMessage = document.getElementById('modal-message');
    
        // Event listeners for toggling conditional questions
        designPreferenceYes.addEventListener('change', function () {
            toggleConditionalQuestion(this, designDetails);
        });
    
        designPreferenceNo.addEventListener('change', function () {
            toggleConditionalQuestion(this, designDetails);
        });
    
        contentFunctionalityYes.addEventListener('change', function () {
            toggleConditionalQuestion(this, contentDetails);
        });
    
        contentFunctionalityNo.addEventListener('change', function () {
            toggleConditionalQuestion(this, contentDetails);
        });
    
        // Toggle the display of additional questions based on user input
        function toggleConditionalQuestion(element, questionContainer) {
            if (element.checked && element.value === 'yes') {
                questionContainer.style.display = 'block';
            } else {
                questionContainer.style.display = 'none';
            }
        }
    
        // Form submission event listener
        const form = document.getElementById('project-intake-form');
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission behavior
            if (validateForm()) {
                showModal('Thank you! Your response has been submitted. We will get back to you within 24 hours.');
            }
        });
    
        // Form validation function to ensure all required fields are filled out correctly
        function validateForm() {
            const requiredFields = form.querySelectorAll('[required]');
            let allFieldsValid = true;
    
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('input-error');
                    allFieldsValid = false;
                } else {
                    field.classList.remove('input-error');
                }
            });
    
            if (!allFieldsValid) {
                showModal('Please fill in all required fields before submitting.');
            }
    
            return allFieldsValid;
        }
    
        // Function to display the success or error modal
        function showModal(message) {
            modalMessage.innerText = message;
            modal.style.display = 'flex';
        }
    
        // Close the modal when clicking on the close button or outside the modal content
        closeModalButton.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });