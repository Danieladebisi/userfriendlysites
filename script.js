// script.js

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const darkModeToggle = document.getElementById('darkModeToggle');
    const scrollToTopButton = document.getElementById('scrollToTop');
    const projectIntakeForm = document.getElementById('project-intake-form');
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
            if (textAnimation) {
                textAnimation.textContent += texts[textIndex].charAt(charIndex);
                charIndex++;
                setTimeout(typeText, 100);
            }
        } else {
            setTimeout(eraseText, 2000);
        }
    }

    function eraseText() {
        if (charIndex > 0) {
            if (textAnimation) {
                textAnimation.textContent = texts[textIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(eraseText, 50);
            }
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

    // Testimonial Carousel
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-box');
    const carouselInterval = 5000;
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
        }, 500);
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

        cost += pages * 50;

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
            this.style.display = 'none';
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
    // Select conditional question elements
    const designPreferenceYes = document.querySelector('input[name="design-preference"][value="yes"]');
    const designPreferenceNo = document.querySelector('input[name="design-preference"][value="no"]');
    const designDetails = document.getElementById('design-details');
    const contentFunctionalityYes = document.querySelector('input[name="content-functionality"][value="yes"]');
    const contentFunctionalityNo = document.querySelector('input[name="content-functionality"][value="no"]');
    const contentDetails = document.getElementById('content-details');

    // Select modal elements
    const modal = document.getElementById('success-modal');
    const closeModalButton = document.querySelector('.close-btn');
    const modalMessage = document.getElementById('modal-message');

    // Event listeners for conditional questions
    if (designPreferenceYes) {
        designPreferenceYes.addEventListener('change', function () {
            toggleConditionalQuestion(this, designDetails);
        });
    }
    if (designPreferenceNo) {
        designPreferenceNo.addEventListener('change', function () {
            toggleConditionalQuestion(this, designDetails);
        });
    }

    if (contentFunctionalityYes) {
        contentFunctionalityYes.addEventListener('change', function () {
            toggleConditionalQuestion(this, contentDetails);
        });
    }
    if (contentFunctionalityNo) {
        contentFunctionalityNo.addEventListener('change', function () {
            toggleConditionalQuestion(this, contentDetails);
        });
    }

    // Toggle conditional questions
    function toggleConditionalQuestion(element, questionContainer) {
        if (element.checked && element.value === 'yes') {
            questionContainer.style.display = 'block';
        } else {
            questionContainer.style.display = 'none';
        }
    }

    // Form submission event listener
    const form = document.getElementById('project-intake-form');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            if (validateForm()) {
                // EmailJS Integration
                (function () {
                    emailjs.init('m5cA-okHHGdZuWJoh'); // Use your Public Key here
                })();

                // Log form data
                console.log("Form Data:", {
                    full_name: document.getElementById('full-name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    project_type: document.getElementById('project-type').value,
                    project_goals: document.getElementById('project-goals').value,
                    design_preference: document.querySelector('input[name="design-preference"]:checked') ? document.querySelector('input[name="design-preference"]:checked').value : '',
                    design_details: document.getElementById('design-details').value,
                    similar_projects: document.getElementById('similar-projects').value,
                    content_functionality: document.querySelector('input[name="content-functionality"]:checked') ? document.querySelector('input[name="content-functionality"]:checked').value : '',
                    content_details: document.getElementById('content-details').value,
                    project_description: document.getElementById('project-description').value,
                    budget: document.getElementById('budget').value,
                    timeline: document.getElementById('timeline').value,
                    communication_method: document.querySelector('input[name="communication-method"]:checked') ? document.querySelector('input[name="communication-method"]:checked').value : '',
                    additional_notes: document.getElementById('additional-notes').value,
                    additional_info: document.getElementById('additional-info').value,
                });

                emailjs.send('service_xl3wr8l', 'template_z587bo4', { // Use your Service ID and Template ID here
                    full_name: document.getElementById('full-name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    project_type: document.getElementById('project-type').value,
                    project_goals: document.getElementById('project-goals').value,
                    design_preference: document.querySelector('input[name="design-preference"]:checked') ? document.querySelector('input[name="design-preference"]:checked').value : '',
                    design_details: document.getElementById('design-details').value,
                    similar_projects: document.getElementById('similar-projects').value,
                    content_functionality: document.querySelector('input[name="content-functionality"]:checked') ? document.querySelector('input[name="content-functionality"]:checked').value : '',
                    content_details: document.getElementById('content-details').value,
                    project_description: document.getElementById('project-description').value,
                    budget: document.getElementById('budget').value,
                    timeline: document.getElementById('timeline').value,
                    communication_method: document.querySelector('input[name="communication-method"]:checked') ? document.querySelector('input[name="communication-method"]:checked').value : '',
                    additional_notes: document.getElementById('additional-notes').value,
                    additional_info: document.getElementById('additional-info').value,
                })
                    .then(function (response) {
                        console.log('SUCCESS!', response.status, response.text);
                        showModal('Your response has been successfully submitted. We will contact you via email within 24 hours.');
                        form.reset();
                    }, function (error) {
                        console.error('FAILED...', error);
                        showModal('Oops! Something went wrong. Please try again.');
                    });
            }
        });
    }

    // Validate the form
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

    // Show the modal
    function showModal(message) {
        if (modal && modalMessage) {
            modalMessage.innerText = message;
            modal.style.display = 'flex';
        }
    }

    // Close the modal
    if (closeModalButton) {
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