document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');

        question.addEventListener('click', () => {
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                answer.style.display = 'block';
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
                setTimeout(() => {
                    answer.style.display = 'none';
                }, 300);
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const parallax = document.querySelector('.parallax');
        let scrollPosition = window.pageYOffset;
        if(parallax){
            parallax.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
    });

    // Animate service cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });

    // Dynamic color change for CTA button
    const ctaButton = document.querySelector('#contact-us');
    let hue = 0;
    setInterval(() => {
        hue = (hue + 1) % 360;
        if(ctaButton){
            ctaButton.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
        }
    }, 100);

    // Typing effect for hero section
    const heroText = "We create tailored, responsive websites that drive engagement and growth.";
    const heroP = document.querySelector('#hero p');
    let i = 0;
    function typeWriter() {
        if (i < heroText.length) {
            if(heroP){
                heroP.innerHTML += heroText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
    }
    typeWriter();

    // Animate numbers in Why Choose Us section
    const whyChooseUs = document.querySelector('#why-choose-us');
    const numbers = whyChooseUs.querySelectorAll('.number');
    let animated = false;

    function animateNumbers() {
        if (animated) return;
        numbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            let count = 0;
            const increment = target / 100;
            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    number.innerText = Math.round(count);
                    setTimeout(updateCount, 10);
                } else {
                    number.innerText = target;
                }
            };
            updateCount();
        });
        animated = true;
    }

    const whyChooseUsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateNumbers();
        }
    }, { threshold: 0.5 });

    if(whyChooseUs){
        whyChooseUsObserver.observe(whyChooseUs);
    }

    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add animation to process steps
    const processSteps = document.querySelectorAll('.step');
    processSteps.forEach((step, index) => {
        step.style.animationDelay = `${index * 0.2}s`;
    });

    // Add tooltip to SEO benefits
    const seoBenefits = document.querySelectorAll('.seo-benefits ul li');
    seoBenefits.forEach(benefit => {
        const tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');
        tooltip.textContent = 'Click for more info';
        benefit.appendChild(tooltip);

        benefit.addEventListener('click', () => {
            const info = benefit.getAttribute('data-info');
            if (info) {
                alert(info);
            }
        });
    });

    // Add scroll reveal animation
    window.addEventListener('scroll', revealOnScroll);

    function revealOnScroll() {
        const elements = document.querySelectorAll('.service-card, #why-choose-us, #cta, .faq-item');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                element.classList.add('reveal');
            }
        });
    }

    // Add a floating chat button
    const chatButton = document.createElement('div');
    chatButton.classList.add('chat-button');
    chatButton.innerHTML = '<i class="fas fa-comments"></i>';
    document.body.appendChild(chatButton);

    chatButton.addEventListener('click', () => {
        alert('Chat functionality would be implemented here!');
    });

    // Add a back to top button
    const backToTopButton = document.createElement('div');
    backToTopButton.classList.add('back-to-top');
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
});