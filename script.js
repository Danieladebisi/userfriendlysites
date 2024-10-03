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
}