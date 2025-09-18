document.addEventListener('DOMContentLoaded', () => {
    // === Page Navigation and Active State Management ===
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.getElementById('mobileNav');

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        
        // Update active link state
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });

        // Close mobile menu if open
        if (mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }

        // Scroll to the top of the new page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Event listeners for all navigation links
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            showPage(pageId);
        });
    });

    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' || false;
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileNav.classList.toggle('active');
    });

    // === Header Scroll Effect ===
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // === Image Slider Functionality ===
    const sliderContainer = document.getElementById('sliderContainer');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const sliderDots = document.getElementById('sliderDots');
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;

    function updateSlider() {
        const offset = -currentIndex * 100;
        sliderContainer.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
            sliderDots.appendChild(dot);
        });
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
        updateSlider();
    });

    // Auto-advance slider
    setInterval(() => {
        nextBtn.click();
    }, 5000);

    createDots();

    // === Intersection Observer for Animations and Stats Counter ===
    const fadeInElements = document.querySelectorAll('.fade-in');
    const statCounters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Handle Fade-in animation
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }

                // Handle Stats Counter
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => observer.observe(el));
    statCounters.forEach(el => observer.observe(el));

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        let startTimestamp;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = timestamp - startTimestamp;
            const percentage = Math.min(progress / duration, 1);
            let value = Math.floor(percentage * target);

            // Handle non-integer targets and special characters
            if (element.textContent.includes('%')) {
                element.textContent = `${value}%`;
            } else if (element.textContent.includes('+')) {
                element.textContent = `${value}+`;
            } else {
                element.textContent = value;
            }

            if (percentage < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }

    // === Contact Form Validation ===
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const phone = formData.get('phone').trim();
        const message = formData.get('message').trim();
        let isValid = true;

        // Reset errors
        document.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
        document.getElementById('formSuccess').classList.remove('show');

        if (!name) {
            document.querySelector('[data-field="name"]').classList.add('show');
            document.getElementById('name').classList.add('error');
            isValid = false;
        }

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            document.querySelector('[data-field="email"]').classList.add('show');
            document.getElementById('email').classList.add('error');
            isValid = false;
        }

        if (!phone) {
            document.querySelector('[data-field="phone"]').classList.add('show');
            document.getElementById('phone').classList.add('error');
            isValid = false;
        }
        
        if (!message) {
            document.querySelector('[data-field="message"]').classList.add('show');
            document.getElementById('message').classList.add('error');
            isValid = false;
        }

        if (isValid) {
            // In a real application, you would send this data to a server
            // For this example, we'll just show a success message
            console.log('Form data:', { name, email, phone, message });
            document.getElementById('formSuccess').classList.add('show');
            contactForm.reset();
        }
    });
});