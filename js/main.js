document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    const navOverlay = document.querySelector('.nav__overlay');
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');
    const progressBar = document.querySelector('.progress-bar');
    const faqItems = document.querySelectorAll('.faq details');

    const updateActiveLink = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${sectionId}`);
                });
            }
        });
    };

    const updateHeaderBackground = () => {
        if (window.scrollY > 40) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };

    const updateProgressBar = () => {
        if (!progressBar) return;

        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
    };

    const toggleMobileMenu = () => {
        const isActive = navToggle.classList.contains('nav__toggle--active');

        navToggle.classList.toggle('nav__toggle--active');
        navList.classList.toggle('nav__list--active');
        navOverlay.classList.toggle('nav__overlay--active');
        document.body.style.overflow = isActive ? '' : 'hidden';
        navToggle.setAttribute('aria-expanded', String(!isActive));
    };

    const closeMobileMenu = () => {
        navToggle.classList.remove('nav__toggle--active');
        navList.classList.remove('nav__list--active');
        navOverlay.classList.remove('nav__overlay--active');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
    };

    const smoothScroll = event => {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offset = header.offsetHeight + 8;
            const position = targetSection.offsetTop - offset;

            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });
        }

        if (navToggle.classList.contains('nav__toggle--active')) {
            closeMobileMenu();
        }
    };

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

    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-controls', 'nav-menu');
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navToggle.classList.contains('nav__toggle--active')) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && navToggle.classList.contains('nav__toggle--active')) {
            closeMobileMenu();
        }
    });

    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.removeAttribute('open');
                    }
                });
            }
        });
    });

    updateActiveLink();
    updateHeaderBackground();
    updateProgressBar();

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section--visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
});
