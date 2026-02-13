/**
 * Main JavaScript - Navigation, ScrollSpy & Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // Elements
    // ============================================
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    const navOverlay = document.querySelector('.nav__overlay');
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');
    const progressBar = document.querySelector('.progress-bar');

    // ============================================
    // ScrollSpy - Active Section Detection
    // ============================================
    function updateActiveLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('nav__link--active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('nav__link--active');
                    }
                });
            }
        });
    }

    // ============================================
    // Header Background on Scroll
    // ============================================
    function updateHeaderBackground() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    // ============================================
    // Scroll Progress Bar
    // ============================================
    function updateProgressBar() {
        if (!progressBar) return;
        
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = `${scrollPercent}%`;
    }

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    function toggleMobileMenu() {
        const isActive = navToggle.classList.contains('nav__toggle--active');
        
        navToggle.classList.toggle('nav__toggle--active');
        navList.classList.toggle('nav__list--active');
        navOverlay.classList.toggle('nav__overlay--active');
        header.classList.toggle('header--menu-open', !isActive);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? '' : 'hidden';
        
        // Update aria attributes for accessibility
        navToggle.setAttribute('aria-expanded', !isActive);
    }

    function closeMobileMenu() {
        navToggle.classList.remove('nav__toggle--active');
        navList.classList.remove('nav__list--active');
        navOverlay.classList.remove('nav__overlay--active');
        header.classList.remove('header--menu-open');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
    }

    // ============================================
    // Smooth Scroll to Section
    // ============================================
    function smoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const offsetTop = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navToggle.classList.contains('nav__toggle--active')) {
                closeMobileMenu();
            }
        }
    }

    // ============================================
    // Event Listeners
    // ============================================
    
    // Scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveLink();
                updateHeaderBackground();
                updateProgressBar();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-controls', 'nav-menu');
    }

    // Overlay click to close
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileMenu);
    }

    // Navigation links click
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navToggle.classList.contains('nav__toggle--active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on window resize (if resizing to desktop)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && navToggle.classList.contains('nav__toggle--active')) {
                closeMobileMenu();
            }
        }, 250);
    });

    // Initialize
    updateActiveLink();
    updateHeaderBackground();
    updateProgressBar();

    // ============================================
    // Intersection Observer for Section Animations
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section--visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ============================================
    // Magnetic Hover Effect for Navigation Links
    // ============================================
    if (window.matchMedia('(pointer: fine)').matches) {
        navLinks.forEach(link => {
            link.addEventListener('mousemove', (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                link.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-2px)`;
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
            });
        });
    }

    // ============================================
    // Logo Magnetic Effect
    // ============================================
    const logo = document.querySelector('.logo');
    if (logo && window.matchMedia('(pointer: fine)').matches) {
        logo.addEventListener('mousemove', (e) => {
            const rect = logo.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            logo.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = '';
        });
    }
});
