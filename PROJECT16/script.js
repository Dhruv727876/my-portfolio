/* ============================================
   PearlCrest Dental Studio — Main JS v2
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    /* ─── Preloader ────────────────────────────── */
    const preloader = document.getElementById('preloader');
    const loadingBar = document.getElementById('preloaderProgress');
    document.body.classList.add('is-loading');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 95) progress = 95;
        if (loadingBar) loadingBar.style.width = progress + '%';
    }, 200);

    window.addEventListener('load', () => {
        clearInterval(interval);
        if (loadingBar) loadingBar.style.width = '100%';

        setTimeout(() => {
            if (preloader) preloader.classList.add('fade-out');
            document.body.classList.remove('is-loading');
        }, 500);
    });


    /* ─── Lenis Smooth Scroll ────────────────────── */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Allow anchor links to work with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -80 });
            }
        });
    });

    /* ─── Navbar Scroll ──────────────────────────── */
    const navbar = document.querySelector('.navbar');
    const stickyBar = document.querySelector('.sticky-cta-bar');
    const floatingCta = document.querySelector('.floating-cta');
    const backToTop = document.querySelector('.back-to-top');
    const heroSection = document.getElementById('home');

    function onScroll() {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 40);

        // Hide CTAs when reaching the booking section
        const heroBottom = heroSection ? (heroSection.offsetTop + heroSection.offsetHeight) : 600;
        const bookingSection = document.getElementById('booking');
        let isBookingVisible = false;

        if (bookingSection) {
            const rect = bookingSection.getBoundingClientRect();
            // hide as soon as the booking section appears in the viewport
            if (rect.top <= window.innerHeight) {
                isBookingVisible = true;
            }
        }

        // Desktop sticky CTA — show after hero, hide at booking
        if (stickyBar) {
            const shouldBeVisible = (y > heroBottom) && !isBookingVisible;
            stickyBar.classList.toggle('visible', shouldBeVisible);
        }

        // Mobile floating CTA — hide at booking
        if (floatingCta) {
            if (isBookingVisible) {
                floatingCta.style.opacity = '0';
                floatingCta.style.pointerEvents = 'none';
            } else {
                floatingCta.style.opacity = '1';
                floatingCta.style.pointerEvents = 'auto';
            }
        }

        // Back to top
        if (backToTop) {
            backToTop.classList.toggle('visible', y > 600);
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ─── Mobile Navigation ──────────────────────── */
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileNav = document.querySelector('.nav-mobile');
    const mobileLinks = mobileNav.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('active');
        mobileNav.classList.toggle('open');
        mobileNav.setAttribute('aria-hidden', !isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (isOpen) lenis.stop(); else lenis.start();
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('open');
            mobileNav.setAttribute('aria-hidden', 'true');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            lenis.start();
        });
    });

    /* ─── Active Nav Link ────────────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));

    /* ─── Scroll Reveal ──────────────────────────── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-text').forEach(el => revealObserver.observe(el));

    /* ─── Counter Animation (fixed timing) ───────── */
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const suffix = el.getAttribute('data-suffix') || '';
                // Immediately set to 0 then animate
                el.textContent = '0' + suffix;
                const duration = 1400;
                const start = performance.now();

                const animate = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(target * eased);
                    el.textContent = current.toLocaleString('en-IN') + suffix;
                    if (progress < 1) requestAnimationFrame(animate);
                };
                // Small delay so the element is visible before counting
                setTimeout(() => requestAnimationFrame(animate), 200);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.8 });

    counters.forEach(c => counterObserver.observe(c));

    /* ─── FAQ Accordion ──────────────────────────── */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-answer').style.maxHeight = '0';
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ─── Before/After Slider (Enhanced) ───────────── */
    document.querySelectorAll('.ba-slider').forEach(slider => {
        const beforeWrap = slider.querySelector('.ba-before-wrap');
        const handle = slider.querySelector('.ba-handle');
        const hint = slider.querySelector('.ba-hint');
        const header = slider.querySelector('.ba-header');
        let isDragging = false;
        let hasInteracted = false;

        const updatePosition = (x) => {
            const rect = slider.getBoundingClientRect();
            let pos = ((x - rect.left) / rect.width) * 100;
            pos = Math.max(2, Math.min(98, pos));
            beforeWrap.style.width = pos + '%';
            handle.style.left = pos + '%';
            // Move the header split point to match the slider position
            if (header) {
                const beforeLabel = header.querySelector('.before-label');
                const afterLabel = header.querySelector('.after-label');
                if (beforeLabel && afterLabel) {
                    beforeLabel.style.flex = `0 0 ${pos}%`;
                    afterLabel.style.flex = `0 0 ${100 - pos}%`;
                }
            }
            // Hide hint after first interaction
            if (!hasInteracted && hint) {
                hasInteracted = true;
                hint.classList.add('hidden');
            }
        };

        // Mouse events
        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            slider.classList.remove('animate-intro');
            updatePosition(e.clientX);
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) { e.preventDefault(); updatePosition(e.clientX); }
        });
        document.addEventListener('mouseup', () => { isDragging = false; });

        // Touch events
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            slider.classList.remove('animate-intro');
            updatePosition(e.touches[0].clientX);
        }, { passive: true });
        slider.addEventListener('touchmove', (e) => {
            if (isDragging) updatePosition(e.touches[0].clientX);
        }, { passive: true });
        slider.addEventListener('touchend', () => { isDragging = false; });

        // Intro wiggle animation when slider scrolls into view
        const sliderObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasInteracted) {
                    setTimeout(() => {
                        slider.classList.add('animate-intro');
                        // Animate the before-wrap width along with the handle
                        const keyframeDuration = 2000;
                        const keyframes = [
                            { pct: 0, val: 50 },
                            { pct: 0.15, val: 35 },
                            { pct: 0.35, val: 65 },
                            { pct: 0.5, val: 50 },
                            { pct: 1, val: 50 },
                        ];
                        const start = performance.now();
                        const animateWiggle = (now) => {
                            const elapsed = now - start;
                            const t = Math.min(elapsed / keyframeDuration, 1);
                            // Interpolate between keyframes
                            let pos = 50;
                            for (let i = 0; i < keyframes.length - 1; i++) {
                                if (t >= keyframes[i].pct && t <= keyframes[i + 1].pct) {
                                    const segT = (t - keyframes[i].pct) / (keyframes[i + 1].pct - keyframes[i].pct);
                                    pos = keyframes[i].val + (keyframes[i + 1].val - keyframes[i].val) * segT;
                                    break;
                                }
                            }
                            beforeWrap.style.width = pos + '%';
                            if (header) {
                                const bl = header.querySelector('.before-label');
                                const al = header.querySelector('.after-label');
                                if (bl) bl.style.flex = `0 0 ${pos}%`;
                                if (al) al.style.flex = `0 0 ${100 - pos}%`;
                            }
                            if (t < 1 && !hasInteracted) requestAnimationFrame(animateWiggle);
                        };
                        requestAnimationFrame(animateWiggle);
                    }, 400);
                    sliderObserver.unobserve(slider);
                }
            });
        }, { threshold: 0.4 });
        sliderObserver.observe(slider);
    });

    /* ─── Gallery Lightbox ───────────────────────── */
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbCaption = document.getElementById('lightboxCaption');
    const galleryImages = document.querySelectorAll('.gallery-item');
    let currentLbIndex = 0;
    const lbSources = [];

    galleryImages.forEach((item, i) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay-text span');
        lbSources.push({ src: img.src, caption: caption ? caption.textContent : '' });

        item.addEventListener('click', () => {
            currentLbIndex = i;
            openLightbox(i);
        });
    });

    function openLightbox(index) {
        lbImg.src = lbSources[index].src;
        lbCaption.textContent = lbSources[index].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lenis.stop();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lenis.start();
    }

    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => {
        currentLbIndex = (currentLbIndex - 1 + lbSources.length) % lbSources.length;
        openLightbox(currentLbIndex);
    });
    document.getElementById('lightboxNext').addEventListener('click', () => {
        currentLbIndex = (currentLbIndex + 1) % lbSources.length;
        openLightbox(currentLbIndex);
    });

    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') { currentLbIndex = (currentLbIndex - 1 + lbSources.length) % lbSources.length; openLightbox(currentLbIndex); }
        if (e.key === 'ArrowRight') { currentLbIndex = (currentLbIndex + 1) % lbSources.length; openLightbox(currentLbIndex); }
    });

    /* ─── Appointment Form ───────────────────────── */
    const form = document.getElementById('appointmentForm');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const required = form.querySelectorAll('[required]');
            let valid = true;
            required.forEach(field => {
                if (!field.value.trim() || !field.checkValidity()) {
                    field.style.borderColor = '#ef4444';
                    valid = false;
                } else {
                    field.style.borderColor = '';
                }
            });

            if (valid) {
                form.style.display = 'none';
                formSuccess.classList.add('show');
                setTimeout(() => { form.reset(); form.style.display = ''; formSuccess.classList.remove('show'); }, 5000);
            }
        });
    }

    /* ─── Phone input masking ────────────────────── */
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 10) val = val.slice(0, 10);
            e.target.value = val;
        });
    }

    /* ─── Back to Top ────────────────────────────── */
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            lenis.scrollTo(0);
        });
    }

    /* ─── Parallax Effect ────────────────────────── */
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length > 0 && window.matchMedia('(min-width: 768px)').matches) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
                const rect = el.getBoundingClientRect();
                const center = rect.top + rect.height / 2;
                const offset = (center - window.innerHeight / 2) * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        }, { passive: true });
    }

    /* ─── Image Skeleton Loader ──────────────────── */
    document.querySelectorAll('.img-skeleton img').forEach(img => {
        if (img.complete) {
            img.closest('.img-skeleton').classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.closest('.img-skeleton').classList.add('loaded');
            });
        }
    });

    /* ─── Lazy load fallback ─────────────────────── */
    if (!('loading' in HTMLImageElement.prototype)) {
        const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
        const imgObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) { imgObs.unobserve(entry.target); } });
        });
        lazyImgs.forEach(img => imgObs.observe(img));
    }

    /* ─── Team Card Mobile Interaction ───────────── */
    let touchTimeout;
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                const isActive = card.classList.contains('touch-active');
                teamCards.forEach(c => c.classList.remove('touch-active'));
                clearTimeout(touchTimeout);

                if (!isActive) {
                    card.classList.add('touch-active');
                    touchTimeout = setTimeout(() => {
                        card.classList.remove('touch-active');
                    }, 4000); // Fades away after 4 seconds
                }
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.team-card')) {
            teamCards.forEach(c => c.classList.remove('touch-active'));
        }
    });

    /* ─── Testimonials Swiper Init ───────────────── */
    if (document.querySelector('.testimonials-slider')) {
        new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 32,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 32,
                }
            }
        });
    }
});
