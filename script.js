// Smooth scrolling for navigation links
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: 'smooth'
    });
}

// Form submission handling
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Thank you for contacting us!');
    // Implement form submission logic here, e.g., sending the data to a server
});

// Dark Mode Toggle
const toggleDarkMode = document.getElementById('darkModeToggle');
toggleDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Dynamic content loading example
function loadMoreContent() {
    fetch('content.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('contentSection').innerHTML += data;
        })
        .catch(error => console.error('Error loading content:', error));
}
// DOM Elements
const contactForm = document.getElementById('contactForm');
const darkModeToggle = document.getElementById('darkModeToggle');
const contentSection = document.getElementById('contentSection');
const loadMoreButton = document.getElementById('loadMoreButton');

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handling
contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    
    // Simulating form submission with fetch API
    fetch('/submit-form', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Thank you for contacting us! We will get back to you soon.');
        this.reset();
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form. Please try again later.');
    });
});

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

darkModeToggle.addEventListener('click', toggleDarkMode);

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Dynamic content loading
let contentPage = 1;

function loadMoreContent() {
    fetch(`content-${contentPage}.html`)
        .then(response => response.text())
        .then(data => {
            contentSection.innerHTML += data;
            contentPage++;
            if (contentPage > 3) { // Assuming we have 3 pages of content
                loadMoreButton.style.display = 'none';
            }
        })
        .catch(error => console.error('Error loading content:', error));
}

loadMoreButton.addEventListener('click', loadMoreContent);

// Lazy loading images
const lazyImages = document.querySelectorAll('img[data-src]');
const lazyLoadOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
}, lazyLoadOptions);

lazyImages.forEach(img => lazyLoadObserver.observe(img));

// Scroll-to-top button
const scrollToTopButton = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});