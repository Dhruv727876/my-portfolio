/* ============================================================
   ROOTHEA — main.js
   Lightweight vanilla JS for interactions & animations
   ============================================================ */

// ── 0. Lenis Smooth Scrolling ─────────────────────────────────
let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// ── 1. Sticky Nav Shadow on Scroll ──────────────────────────
const navHeader = document.getElementById('nav-header');
window.addEventListener('scroll', () => {
    navHeader.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── 2. Mobile Navigation Toggle ─────────────────────────────
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open.toString());
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Close nav on outside click
document.addEventListener('click', (e) => {
    if (!navHeader.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// ── 3. Active Nav Link on Scroll ────────────────────────────
// Uses scroll position rather than IntersectionObserver to guarantee
// the correct nav link is highlighted regardless of page vs nav order.
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
    const scrollY = window.scrollY;
    const navOffset = (navHeader ? navHeader.offsetHeight : 72) + 16;

    // Find the section whose top is at or above the current scroll position
    let currentId = null;
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navOffset;
        if (scrollY >= sectionTop) {
            currentId = section.getAttribute('id');
        }
    });

    // Highlight the matching nav anchor (only — clear all others)
    navAnchors.forEach(a => {
        const href = a.getAttribute('href');
        const matches = href === `#${currentId}`;
        a.classList.toggle('active', matches);
    });
}

// Run on scroll (passive for performance) and on load
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav(); // set correct state on initial load


// ── 4. Scroll Reveal (fade-up elements) ─────────────────────
const fadeUpEls = document.querySelectorAll('.fade-up');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.12 });

fadeUpEls.forEach(el => revealObserver.observe(el));

// ── 5. Scroll to Top Button ──────────────────────────────────
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });



scrollTopBtn.addEventListener('click', () => {
    if (lenis) {
        lenis.scrollTo('top', { duration: 1.5 });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Intercept local anchors for Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement && lenis) {
            e.preventDefault();
            lenis.scrollTo(targetElement, { offset: -80, duration: 1.2 });
        }
    });
});

// ── 7. Booking Form Handler ──────────────────────────────────
function handleBooking(e) {
    e.preventDefault();
    const form = document.getElementById('booking-form');
    const success = document.getElementById('booking-success');

    // Simulate a brief loading state
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Reserving…';
    btn.disabled = true;

    setTimeout(() => {
        form.style.display = 'none';
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
}

// ── 8. Newsletter Form Handler ───────────────────────────────
function handleNewsletter(e) {
    e.preventDefault();
    const input = document.getElementById('newsletter-email');
    const btn = e.target.querySelector('button');
    btn.textContent = '✓';
    btn.style.background = '#3E4D28';
    input.value = '';
    input.placeholder = 'You\'re subscribed. Welcome! 🌿';
    setTimeout(() => {
        btn.textContent = '→';
        btn.style.background = '';
        input.placeholder = 'your@email.com';
    }, 4000);
}

// ── 9. Set minimum booking date to tomorrow ──────────────────
(function setMinDate() {
    const dateInput = document.getElementById('book-date');
    if (!dateInput) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
})();

// ── 10. Smooth Parallax on hero image ───────────────────────
const heroImg = document.querySelector('.hero-img');
if (heroImg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const limit = window.innerHeight;
        if (scrolled < limit) {
            heroImg.style.transform = `translateY(${scrolled * 0.25}px)`;
        }
    }, { passive: true });
}

// ── 11. Gallery image lazy loading enhancement ───────────────
document.querySelectorAll('.gallery-item img, .journal-img-wrap img').forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
});

// ── 12. Stats counter (optional — for Philosophy section) ────
// Could add animated counts if desired — left as hook

// ── 13. Page Preloader ───────────────────────────────────────
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Soft fade-out after a graceful delay
    setTimeout(() => {
        preloader.classList.add('hidden');
        // Clean up DOM after transition finishes
        setTimeout(() => preloader.remove(), 1200);
    }, 1000);
});



// ── 14. Custom Magnetic Cursor ───────────────────────────────
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

// Only initialize if it's a device with a fine pointer (mouse/trackpad)
const isMouseAvailable = window.matchMedia("(any-pointer: fine)").matches;

if (cursorDot && cursorOutline && isMouseAvailable) {
    let cursorVisible = false;
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let outlineX = window.innerWidth / 2, outlineY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        if (!cursorVisible) {
            cursorVisible = true;
            document.body.classList.add('has-custom-cursor');
            outlineX = e.clientX;
            outlineY = e.clientY;
        }
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Exact cursor positioning for dot with fast transform
        cursorDot.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
    });

    // Smooth easing for outline
    function animateCursor() {
        if (cursorVisible) {
            let distX = mouseX - outlineX;
            let distY = mouseY - outlineY;

            outlineX += distX * 0.15;
            outlineY += distY * 0.15;

            cursorOutline.style.transform = `translate3d(calc(${outlineX}px - 50%), calc(${outlineY}px - 50%), 0)`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const interactives = document.querySelectorAll('a, button, input, textarea, select, .gallery-item');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
}

// ── 15. Ritual Cards Hover Peeking ───────────────────────────
document.querySelectorAll('.ritual-card').forEach(card => {
    const bgImg = card.getAttribute('data-bg');
    if (bgImg) {
        card.style.setProperty('--bg-url', `url('${bgImg}')`);
    }
});

// ── 16. Gallery Lightbox ─────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', (e) => {
            lightboxImg.src = e.target.src;
            lightboxImg.alt = e.target.alt;
            lightbox.classList.add('active');
            if (cursorOutline) cursorOutline.classList.remove('hover'); // Reset cursor hover
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => { lightboxImg.src = ''; }, 400); // Clear source after fade out
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// ── 17. Time-of-Day Lighting Mode ────────────────────────────
function setTimeOfDayTheme() {
    const hour = new Date().getHours();
    // Evening theme applies from 5 PM (17:00) to 5 AM (5:00)
    if (hour >= 17 || hour <= 5) {
        document.body.classList.add('theme-evening');
    } else {
        document.body.classList.remove('theme-evening');
    }
}
setTimeOfDayTheme();

const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('theme-evening');
    });
}

// ── 18. Magnetic Buttons (Tactile UI) ────────────────────────
const magneticButtons = document.querySelectorAll('.btn.magnetic');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from center
        const distX = (e.clientX - centerX) * 0.3;
        const distY = (e.clientY - centerY) * 0.3;

        btn.style.transform = `translate(${distX}px, ${distY}px) scale(1.03)`;
        btn.classList.add('hovered');
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0px, 0px) scale(1)`;
        btn.classList.remove('hovered');
    });
});

// ── 19. Parallax Image Masking (Deep Scroll) ─────────────────
const parallaxElements = document.querySelectorAll('.img-parallax');
if (parallaxElements.length > 0) {
    const scrollHandler = () => {
        parallaxElements.forEach(el => {
            const rect = el.parentElement.getBoundingClientRect();
            // Check if element is in viewport
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                // Calculate parallax offset based on scroll position relative to viewport
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                // Map progress from [0, 1] to [-15%, 15%]
                const yOffset = (progress * 30 - 15);
                el.style.transform = `scale(1.15) translateY(${yOffset}%)`;
            }
        });
    };

    if (typeof lenis !== 'undefined' && lenis) {
        lenis.on('scroll', scrollHandler);
    } else {
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }
}

// ── 20. Liquid/Water SVG Distortion ──────────────────────────
const galleryItems = document.querySelectorAll('.gallery-item');
const displacementMap = document.getElementById('displacement-map');

if (displacementMap && galleryItems.length > 0) {
    let scaleObj = { intensity: 0 };
    let requestID;

    // We animate the scale attribute of the SVG displacement map
    function animateDisplacement() {
        displacementMap.setAttribute('scale', scaleObj.intensity);
        if (scaleObj.intensity > 0) {
            requestID = requestAnimationFrame(animateDisplacement);
        }
    }

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            scaleObj.intensity = 35; // Peak distortion
            cancelAnimationFrame(requestID);
            animateDisplacement();

            // Smoothly decrease back to 0
            const decay = setInterval(() => {
                scaleObj.intensity -= 1;
                if (scaleObj.intensity <= 0) {
                    scaleObj.intensity = 0;
                    clearInterval(decay);
                }
            }, 16);
        });
    });
}

// ── 15. Vanilla Tilt ──────────────────────────────────────────
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".ritual-card"), {
        max: 8,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.02
    });
}

// ── 16. Swiper JS Integration ────────────────────────────────
if (typeof Swiper !== 'undefined') {
    const ritualSwiper = new Swiper('.rituals-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        grabCursor: true,
        loop: true,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,   // keep playing after user swipe
            pauseOnMouseEnter: true,       // pause on hover
        },
        keyboard: {
            enabled: true,
        },
        pagination: {
            el: '.ritual-swiper-pagination',
            clickable: true,
            type: 'bullets',
        },
        navigation: {
            nextEl: '.ritual-swiper-next',
            prevEl: '.ritual-swiper-prev',
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 32 },
        }
    });

    // ── Testimonials Swiper ──────────────────────────────────────
    const testiSwiper = new Swiper('.testi-swiper', {
        slidesPerView: 1,
        spaceBetween: 40,
        grabCursor: true,
        centeredSlides: true,
        loop: true,
        speed: 800,
        parallax: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: true,
        },
        pagination: {
            el: '.testi-swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.testi-next',
            prevEl: '.testi-prev',
        },
    });
}

// ── 17. GSAP & SplitType Animations ─────────────────────────
if (typeof gsap !== 'undefined' && typeof SplitType !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Split text into spans for absolute cinematic reveals
    const heroTitle = new SplitType('.hero-title', { types: 'words, chars' });

    gsap.set(heroTitle.chars, { y: 60, opacity: 0 });

    const tl = gsap.timeline();
    tl.to(heroTitle.chars, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.03,
        ease: "power4.out",
        delay: 0.2
    });
}

console.log('🌿 Roothea — Crafted with care. Loaded with intention.');
