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
    const closeModalButton = document.querySelector('.close');
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
    if(textAnimation) {
        typeText();
    }


    // Smooth scrolling for navigation
    window.scrollToSection = function (id) {
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
    window.openCalculator = function() {
        if (modal) {
            modal.style.display = "block";
        }
    }

    window.closeCalculator = function() {
        if (modal) {
            modal.style.display = "none";
        }
    }

    if (closeModalButton && modal) {
        closeModalButton.addEventListener('click', () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // Calculator Function
    window.calculateCost = function() {
        const websiteType = document.getElementById('website-type').value;
        const complexity = document.getElementById('complexity').value;
        const pages = parseInt(document.getElementById('pages').value);
        const features = document.querySelectorAll('input[name="features"]:checked');
        const timeline = parseInt(document.getElementById('timeline').value);

        let cost = 0;

        // Base cost by website type
        switch (websiteType) {
            case 'basic':
                cost += 1000;
                break;
            case 'e-commerce':
                cost += 4000;
                break;

            case 'blog':
                cost += 1500;
                break;
            case 'portfolio':
                cost += 2000;
                break;
            case 'custom':
                cost += 5000;
                break;
        }

        // Adjust cost by complexity
        switch (complexity) {
            case 'intermediate':
                cost *= 1.5;
                break;
            case 'advanced':
                cost *= 2.5;
                break;
        }


        // Add cost for pages
        cost += pages * 40; // $40 per page

        // Add cost for features
        features.forEach(feature => {
            switch (feature.value) {
                case 'seo':
                    cost += 250;
                    break;
                case 'responsive':
                    cost += 350;
                    break;
                case 'cms':
                    cost += 500;
                    break;
                case 'analytics':
                    cost += 150;
                    break;
                case 'e-commerce':
                    cost += 800;
                    break;
                case 'blog':
                    cost += 400;
                    break;
            }
        });

        // Adjust for timeline
        if (timeline < 4) {
            cost *= 1.2; // 20% rush fee for tight deadlines
        }


        document.getElementById('cost-result').innerHTML = `
            <h3>Estimated Cost: $${cost.toFixed(2)}</h3>
            <p><strong>Freelancer vs. Agency Cost Comparison:</strong></p>
            <ul>
                <li><strong>Freelancer:</strong> $${(cost * 0.7).toFixed(2)} - $${(cost * 0.9).toFixed(2)}</li>
                <li><strong>Agency:</strong> $${(cost * 1.2).toFixed(2)} - $${(cost * 1.8).toFixed(2)}</li>
            </ul>
            <p><strong>Cost Breakdown:</strong></p>
            <ul>
                <li><strong>Design:</strong> $${(cost * 0.3).toFixed(2)}</li>
                <li><strong>Development:</strong> $${(cost * 0.5).toFixed(2)}</li>
                <li><strong>Hosting/Maintenance (per month):</strong> $40 - $250</li>
            </ul>
        `;
    }

    // PDF Generation
    document.getElementById('download-pdf')?.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const costResult = document.getElementById('cost-result').innerText;
        doc.text(costResult, 10, 10);
        doc.save('website-cost-estimate.pdf');
    });

    // Shareable Link
    document.getElementById('share-link')?.addEventListener('click', () => {
        const params = new URLSearchParams(new FormData(document.getElementById('calculator-form'))).toString();
        const url = `${window.location.href.split('?')[0]}?${params}`;
        navigator.clipboard.writeText(url).then(() => {
            alert('Shareable link copied to clipboard!');
        });
    });

    // EmailJS Integration
    document.getElementById('calculator-form')?.addEventListener('submit', function(event) {
        event.preventDefault();

        // **IMPORTANT**: Replace with your own EmailJS serviceID, templateID, and publicKey
        const serviceID = 'YOUR_SERVICE_ID';
        const templateID = 'YOUR_TEMPLATE_ID';
        const publicKey = 'YOUR_PUBLIC_KEY';

        emailjs.sendForm(serviceID, templateID, this, publicKey)
            .then(() => {
                alert('Your request has been sent successfully!');
            }, (err) => {
                alert(JSON.stringify(err));
            });
    });



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
                    // **IMPORTANT**: Replace with your own EmailJS public key
                    emailjs.init('m5cA-okHHGdZuWJoh'); 
                })();

                emailjs.sendForm('service_xl3wr8l', 'template_z587bo4', this)
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