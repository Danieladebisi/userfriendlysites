// script.js

document.addEventListener('DOMContentLoaded', function () {
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
    const showMoreBtn = document.getElementById('show-more');
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Hero Text Animation
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

    // Start the hero text animation
    typeText();

    // Smooth scrolling for navigation
    function scrollToSection(id) {
        const targetElement = document.getElementById(id);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            // Close mobile menu after clicking a link
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
            }
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
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here (e.g., sending data to a server)
            alert('Thank you for your message. We will get back to you soon!');
            contactForm.reset();
        });
    }

    // Testimonial Carousel
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-box');
    const carouselInterval = 5000; // Time between testimonial transitions (ms)
    let carouselTimeout;
    let isCarouselTransitioning = false;

    function showTestimonial(index) {
        if (isCarouselTransitioning) return;
        isCarouselTransitioning = true;

        testimonials.forEach((testimonial) => {
            testimonial.classList.remove('active');
        });

        testimonials[index].classList.add('active');

        setTimeout(() => {
            isCarouselTransitioning = false;
        }, 500); // Adjust to match CSS transition
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
        resetCarouselTimer();
    }

    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
        resetCarouselTimer();
    }

    function startCarousel() {
        carouselTimeout = setTimeout(nextTestimonial, carouselInterval);
    }

    function resetCarouselTimer() {
        clearTimeout(carouselTimeout);
        startCarousel();
    }

    if (prevBtn && nextBtn && testimonialCarousel) {
        prevBtn.addEventListener('click', () => {
            prevTestimonial();
        });

        nextBtn.addEventListener('click', () => {
            nextTestimonial();
        });

        // Initialize the first testimonial and start the carousel
        showTestimonial(currentTestimonial);
        startCarousel();
    }

    // Website Calculator Modal
    function openCalculator() {
        if (modal) {
            modal.style.display = "block";
        }
    }

    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

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

    // Show More Functionality
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function () {
            const hiddenItems = document.querySelectorAll('.hidden');
            hiddenItems.forEach(item => {
                item.classList.remove('hidden');
            });
            this.style.display = 'none'; // Hide the "Show More" button after clicking
        });
    }

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }

    // Intersection Observer for Animations
    const animatedElements = document.querySelectorAll('.service-box, .portfolio-item, .testimonial-box');
    if (animatedElements) {
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
    }
});

    // Project Intake Form Logic
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
        if(designPreferenceYes){
            designPreferenceYes.addEventListener('change', function () {
                toggleConditionalQuestion(this, designDetails);
            });
        }
        if(designPreferenceNo){
            designPreferenceNo.addEventListener('change', function () {
                toggleConditionalQuestion(this, designDetails);
            });
        }
    
        if(contentFunctionalityYes){
            contentFunctionalityYes.addEventListener('change', function () {
                toggleConditionalQuestion(this, contentDetails);
            });
        }
        if(contentFunctionalityNo){
            contentFunctionalityNo.addEventListener('change', function () {
                toggleConditionalQuestion(this, contentDetails);
            });
        }
    
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
        if(form){
            form.addEventListener('submit', function (event) {
                event.preventDefault(); // Prevent default form submission behavior
                if (validateForm()) {
                    showModal('Your response has been successfully submitted. We will contact you via email within 24 hours.');
                }
            });
        }
    
        // Form validation function to ensure all required fields are filled out correctly
        function validateForm() {
            const requiredFields = form.querySelectorAll('[required]');
            let allFieldsValid = true;
    
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    allFieldsValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
    
            if (!allFieldsValid) {
                alert('Please fill out all required fields.');
            }
    
            return allFieldsValid;
        }
    
        // Function to display the success or error modal
        function showModal(message) {
            if(modal && modalMessage){
                modalMessage.innerText = message;
                modal.style.display = 'flex';
            }
        }
    
        // Close the modal when clicking on the close button or outside the modal content
        if(closeModalButton){
            closeModalButton.addEventListener('click', function () {
                modal.style.display = 'none';
            });
        }
    
        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });