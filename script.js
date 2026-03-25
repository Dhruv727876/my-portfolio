// --- SCATTERING ENGINE ---
// Relying on global THREE from index.html script tag

// --- CORE UTILITIES ---
document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  initLenis();
  initHeroAnimation(); // FIXED: Updated from old function name
  initCustomCursor();
  initMagneticButtons();
  initTechStack();
  initProjectFilters();
  initKineticStack();
  initThreeBackground();
  initLatestScroll();
  initGridTilt();
  initScrollSpy();
  initFooterTime();
  initMobileMenu();
  initHUD(); // ELITE UPDGRADE: Initialize the system readouts
  
  // Refresh ScrollTrigger after a slight delay to ensure layout is captured
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 1000);
});

// 0. ScrollSpy - SENIOR NAV TRACKING
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');

  window.addEventListener('scroll', () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('text-cyber-cyan', 'active-nav');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('text-cyber-cyan', 'active-nav');
      }
    });
  });
}

// 1. Smooth Scrolling (Lenis) - High-Speed Performance
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Sync ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// 2. GSAP Reveal & Interactive Hero
// 2. Elite Hero Animation - Terminal Decryption Entrance
function initHeroAnimation() {
  gsap.registerPlugin(ScrollTrigger);

  const hero = document.getElementById('home'); // FIXED: Updated from 'hero' to 'home'
  const title = document.querySelector('.hero-title');
  const subtitle = document.querySelector('.hero-subtitle');
  const cta = document.querySelector('.hero-cta');
  
  if (!title) return;

  const spans = title.querySelectorAll('span');
  const tl = gsap.timeline();
  tl.set([title, subtitle, cta], { visibility: "visible" });
  
  tl.from(spans, {
    y: 120,
    opacity: 0,
    rotateX: -40, // Adds mechanical depth to the arrival
    duration: 1.5,
    stagger: 0.15,
    ease: "expo.out"
  });

  tl.from(subtitle, {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power3.out"
  }, "-=0.8")
  .from(cta, {
    opacity: 0,
    scale: 0.8,
    duration: 1.2,
    ease: "elastic.out(1, 0.5)"
  }, "-=0.6");

  // MOUSE PARALLAX (Subtle Depth)
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 40;
      const yPos = (clientY / window.innerHeight - 0.5) * 40;

      gsap.to([title, subtitle], {
        x: xPos,
        y: yPos,
        duration: 1.5,
        ease: "power2.out"
      });

      gsap.to('.hero-bg-accent', {
        x: -xPos * 0.5,
        y: -yPos * 0.5,
        duration: 2,
        ease: "power2.out"
      });
    });
  }

  // Section Headers Reveal
  gsap.utils.toArray(".section-header").forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  });

  // Project Cards Staggered Entrance
  gsap.utils.toArray(".project-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
      },
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      delay: i % 3 * 0.1, // Stagger rows
    });
  });
}

// 3. Custom Cursor Logic (Optimized for High-Refresh Displays)
function initCustomCursor() {
  const cursor = document.querySelector(".custom-cursor");
  const follower = document.querySelector(".cursor-follower");
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, ease: "none" });
    gsap.to(follower, { x: mouseX, y: mouseY, duration: 0.4, ease: "power2.out" });
  });

  // Link Hover Effects
  document.querySelectorAll('a, button, .magnetic, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.classList.add('cursor-active');
      gsap.to(cursor, { scale: 0.5, opacity: 0, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      follower.classList.remove('cursor-active');
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
    });
  });
}

// 4. Magnetic Buttons / Elements - Stabilized to prevent bouncing
function initMagneticButtons() {
  const magnets = document.querySelectorAll('.magnetic');
  magnets.forEach((magnet) => {
    magnet.addEventListener('mousemove', function (e) {
      const rect = magnet.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(magnet, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto"
      });
    });

    magnet.addEventListener('mouseleave', function (e) {
      gsap.to(magnet, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)"
      });
    });
  });
}

// // 5.5 Dynamic Project Rendering & Industrial Entrance
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  const latestContainer = document.querySelector('.latest-scroll-container');
  
  if (!grid || !PROJECTS_DATA) return;

  // Render main grid (Clean Assembly Architecture)
  grid.innerHTML = PROJECTS_DATA.map((project, i) => `
    <div class="project-card reveal-card group glass glass-hover rounded-[2rem] overflow-hidden" data-category="${project.category}">
      <div class="aspect-video bg-black relative overflow-hidden">
        <img src="${project.image}" loading="lazy" decoding="async" alt="${project.title}" class="project-image object-cover w-full h-full transition-all duration-700 group-hover:scale-110" />
        <div class="project-overlay absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/60 backdrop-blur-sm">
          <a href="${project.link}" target="_blank" class="btn-premium magnetic">
            Launch Experience
          </a>
        </div>
        <!-- Spotlight Glow for Work Cards (Silicon Reactive) -->
        <div class="card-spotlight absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background: radial-gradient(400px circle at var(--m-x, 50%) var(--m-y, 50%), rgba(0, 243, 255, 0.15), transparent 85%);"></div>
      </div>
      <div class="p-8">
        <h3 class="font-outfit text-xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">
          ${project.title}
        </h3>
        <p class="text-gray-400 text-xs mb-6 font-light leading-relaxed">
          ${project.description}
        </p>
        <div class="flex gap-2">
          ${project.tags.map((tag, i) => `
            <span class="text-[10px] font-cyber tracking-widest border border-white/10 px-3 py-1 rounded-full ${i === 0 ? 'text-cyber-cyan' : 'text-white'}">${tag}</span>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // Use RAF to ensure DOM is ready for calculations
  requestAnimationFrame(() => {
    // ENTRANCE CHOREOGRAPHY: Side-to-Center Assembly (Mechanical Batching)
    ScrollTrigger.batch(".reveal-card", {
      onEnter: batch => gsap.fromTo(batch, 
        { 
          autoAlpha: 0, 
          x: (i) => (i % 2 === 0 ? -150 : 150), 
          y: 50,
          rotateY: (i) => (i % 2 === 0 ? 30 : -30),
          scale: 0.85
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotateY: 0,
          scale: 1,
          stagger: 0.1,
          duration: 1.5,
          ease: "expo.out",
          overwrite: true
        }
      ),
      start: "top 90%",
      once: true // CRITICAL: Makes the animation happen only once for superior stability
    });

    // RE-INITIALIZE INTERACTIVITY: Ensures new cards support tilt/shine
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--m-x', `${x}px`);
        card.style.setProperty('--m-y', `${y}px`);

        const rotateX = (y / rect.height - 0.5) * -10;
        const rotateY = (x / rect.width - 0.5) * 10;

        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.4,
          ease: "power2.out"
        });
      });

      card.addEventListener('mouseleave', () => {
        // RESET EASE CHANGE: expo.out instead of back.out to stop bouncing
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.8,
          ease: "expo.out"
        });
      });
    });

    // Refresh after DOM measurement
    ScrollTrigger.refresh();
  });

  // Render Latest Work (Carousel Expansion)
  if (latestContainer) {
    latestContainer.innerHTML = PROJECTS_DATA.slice(0, 7).map((project, i) => `
      <div class="latest-item" data-index="${i + 1}">
        <div class="latest-image-wrapper group">
          <div class="parallax-target h-full w-full">
            <img src="${project.image}" class="w-full h-full object-cover scale-125" alt="${project.title}">
          </div>
          <div class="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent pointer-events-none"></div>
          <div class="absolute top-8 left-8">
            <span class="text-white/20 font-light text-6xl font-outfit tracking-tighter">0${i + 1}</span>
          </div>
        </div>
        <div class="latest-content-wrapper">
          <div class="flex items-center gap-4 mb-8">
            <div class="h-[1px] w-12 bg-cyber-cyan/30"></div>
            <span class="text-[10px] font-cyber tracking-[5px] text-cyber-cyan uppercase">// PROJECT_ID:00X_${i + 1}</span>
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc opacity-80">${project.special || 'Next-generation digital architecture designed for extreme-scale performance and high-density data visualization.'}</p>
          <div class="flex flex-wrap gap-2 mb-12">
            ${project.tags.map(tag => `
              <span class="text-[9px] font-cyber tracking-widest border border-white/5 bg-white/[0.02] px-4 py-2 rounded-full text-white/50 uppercase">${tag}</span>
            `).join('')}
          </div>
          <div class="flex items-center gap-8">
            <a href="${project.link}" target="_blank" class="magnetic group/btn relative px-10 py-5 bg-white text-black font-black uppercase tracking-[3px] text-[10px] rounded-full hover:bg-cyber-cyan transition-all duration-500 overflow-hidden">
              <span class="relative z-10 transition-colors group-hover/btn:text-white">INITIALIZE_CORE()</span>
              <div class="absolute inset-0 bg-black translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
            </a>
            <div class="text-[8px] font-cyber text-white/20 tracking-widest uppercase hidden md:block">
              Deployment_Verified<br/>Status: _ACTIVE
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// 5. Cybernetic Bento Grid Interactivity - Optimized Performance
function initTechStack() {
  const cards = document.querySelectorAll('.bento-card');

  cards.forEach(card => {
    const glow = card.querySelector('.bento-glow');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Move the glow center to mouse position with faster response
      gsap.to(glow, {
        x: x - rect.width / 2,
        y: y - rect.height / 2,
        duration: 0.2, // Snappier glow
        ease: "power3.out"
      });

      // Optimized tilt effect (lighter range)
      const rotateX = ((y / rect.height) - 0.5) * -6;
      const rotateY = ((x / rect.width) - 0.5) * 6;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    card.addEventListener('mouseleave', () => {
      // Smooth reset
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      });
      gsap.to(glow, {
        x: 0,
        y: 0,
        duration: 0.5
      });
    });
  });
}

// 6. Project Filtering System
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const projectCards = document.querySelectorAll('.project-card');
      if (!projectCards.length) return;

      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filterValue = this.getAttribute('data-filter');

      // 1. Initial Quick Hide
      gsap.to(projectCards, {
        autoAlpha: 0,
        duration: 0.3,
        onComplete: () => {
          // 2. State Toggle
          projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filterValue === 'all' || category === filterValue) {
              card.style.display = 'block';
              card.classList.remove('hidden');
            } else {
              card.style.display = 'none';
              card.classList.add('hidden');
            }
          });

          // 3. Reveal Visible Cards
          const visible = document.querySelectorAll('.project-card:not(.hidden)');
          if (visible.length > 0) {
            gsap.fromTo(visible,
              { autoAlpha: 0, y: 20, scale: 0.95 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.05,
                ease: "power2.out",
                clearProps: "scale,y,autoAlpha"
              }
            );
          }
          
          // CRITICAL: Forces layout re-calculation for ScrollTrigger
          ScrollTrigger.refresh();
          setTimeout(() => ScrollTrigger.refresh(), 100);
        }
      });
    });
  });
}

// 6. Project Slide Reveal - SENIOR ENGINEER SYSTEM (Synchronized Focus)
function initLatestScroll() {
  const section = document.querySelector('#latest-work');
  const slides = gsap.utils.toArray('.latest-item');

  if (!section || slides.length === 0) return;

  const totalSlides = slides.length;

  // Set initial state: All slides off-screen except the first
  gsap.set(slides.slice(1), { xPercent: 100, opacity: 0 });

  // Units for high physical control
  const shield = 1000;
  const slideStep = 1000;
  const totalDistance = shield + (totalSlides - 1) * slideStep;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${totalSlides * 60}%`, // REDUCED DISTANCE: Rapid response for mousewheel users
      pin: true,
      scrub: 0.1, // ELITE HYBRID: 0.1 provides just enough damping to kill jitter on notched mice
      snap: {
        snapTo: (p) => {
          const step = 1 / (totalSlides - 1);
          const index = p / step;
          const decimal = index % 1;
          // HYBRID_BIAS: If at least 30% through, lock forward for ultra-stable mouse interaction
          if (decimal >= 0.3) {
            return Math.ceil(index) * step;
          } else {
            return Math.floor(index) * step;
          }
        },
        duration: { min: 0.2, max: 0.5 }, // ADAPTIVE: Snap faster for tiny clicks, smoother for large spins
        delay: 0,
        ease: "power2.out"
      },
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  // REVEAL SYSTEM: Ensure first slide content is visible by default
  const firstDetails = slides[0].querySelectorAll('.latest-content-wrapper > *');
  gsap.set(firstDetails, { autoAlpha: 1, y: 0 });
  tl.set(firstDetails, { y: 0, autoAlpha: 1 }, 0);

  // BUILD DISCRETE STEPS
  slides.forEach((slide, index) => {
    if (index < totalSlides - 1) {
      const currentSlide = slide;
      const nextSlide = slides[index + 1];
      const nextDetails = nextSlide.querySelectorAll('.latest-content-wrapper > *');
      const currentDetails = currentSlide.querySelectorAll('.latest-content-wrapper > *');
      const nextImg = nextSlide.querySelector('.parallax-target img');
      const currentImg = currentSlide.querySelector('.parallax-target img');

      // 1. Exit current slide
      tl.to(currentSlide, {
        xPercent: -100,
        autoAlpha: 0,
        duration: 2, 
        ease: "expo.inOut"
      }, index * 2) 
      .to(currentDetails, {
        opacity: 0,
        y: -30,
        duration: 1
      }, index * 2);

      // 2. Entrance of next slide
      tl.to(nextSlide, {
        xPercent: 0,
        autoAlpha: 1,
        duration: 2,
        ease: "expo.inOut"
      }, index * 2)
      .fromTo(nextDetails, 
        { autoAlpha: 0, y: 40 }, 
        { autoAlpha: 1, y: 0, stagger: 0.1, duration: 1.2, ease: "power2.out" }, 
        index * 2 + 0.5
      );

      // 3. Image Parallax Hand-off
      if (nextImg) tl.fromTo(nextImg, { x: "15%" }, { x: "0%", duration: 2, ease: "none" }, index * 2);
      if (currentImg) tl.to(currentImg, { x: "-15%", duration: 2, ease: "none" }, index * 2);
    }
  });

  // Smooth 3D Interactivity for THE CURRENT project
  section.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xMove = (clientX / innerWidth) - 0.5;
    const yMove = (clientY / innerHeight) - 0.5;

    slides.forEach(slide => {
      const xPerc = gsap.getProperty(slide, "xPercent");
      if (xPerc > -50 && xPerc < 50) {
        gsap.to(slide.querySelector('.latest-image-wrapper'), {
          rotateY: xMove * 10,
          rotateX: -yMove * 10,
          duration: 0.8,
          ease: "power2.out"
        });

        gsap.to(slide.querySelector('.latest-content-wrapper'), {
          x: xMove * 15,
          y: yMove * 15,
          duration: 1,
          ease: "power2.out"
        });
      }
    });
  });
}

// 9. Footer Polish - DYNAMIC DATA
function initFooterTime() {
  const timeEl = document.getElementById('footer-time');
  if (!timeEl) return;

  function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    timeEl.textContent = `LOCAL_TRANS_TIME:_${timeString}`;
  }

  setInterval(updateTime, 1000);
  updateTime();
}

// 9. Elite System HUD & Connectivity
function initHUD() {
  const cpuLoadEl = document.getElementById('cpu-load');
  const cpuBar = document.getElementById('cpu-bar');
  const scrollSpeedEl = document.getElementById('scroll-speed');
  
  if (!cpuLoadEl || !scrollSpeedEl) return;

  // CPU Fluctuator (Mock Activity)
  setInterval(() => {
    const load = (Math.random() * 25 + 10).toFixed(1); 
    cpuLoadEl.textContent = `${load}%`;
    gsap.to(cpuBar, { width: `${load}%`, duration: 0.8, ease: "power2.out" });
  }, 2000);

  // OPTIMIZED SCROLL VELOCITY: Integrated into GSAP for extreme stability
  ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = Math.abs(self.getVelocity() / 100).toFixed(2);
      scrollSpeedEl.textContent = `VELOCITY: ${velocity} M/S`;
    }
  });

  // GEOMETRIC DIVIDER: Downward Dynamic Growth
  const connector = document.querySelector('.section-connector');
  if (connector) {
    gsap.fromTo(connector, 
      { scaleY: 0, opacity: 0 },
      {
        scaleY: 1,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: connector.parentElement, 
          start: "top 95%",
          end: "bottom 10%",
          scrub: true
        }
      }
    );
  }
}

// 10. Mobile System Menu - FULL SCREEN OVERLAY
function initMobileMenu() {
  const toggle = document.querySelector('#mobile-toggle');
  const menu = document.querySelector('#mobile-menu');
  const links = document.querySelectorAll('#mobile-menu a');

  if (!toggle || !menu) return;

  let isOpen = false;

  const tl = gsap.timeline({ paused: true });
  tl.to(menu, {
    clipPath: "circle(150% at 100% 0%)",
    duration: 0.8,
    ease: "expo.inOut",
    onStart: () => menu.classList.add('open'),
    onReverseComplete: () => menu.classList.remove('open')
  })
    .from(links, {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5
    }, "-=0.4");

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      tl.play();
      toggle.textContent = "CLOSE()";
    } else {
      tl.reverse();
      toggle.textContent = "MENU()";
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      isOpen = false;
      tl.reverse();
      toggle.textContent = "MENU()";
    });
  });
}

// 7. Kinetic Stack - REDESIGN: MECHANICAL EXPLODED VIEW
function initKineticStack() {
  const section = document.querySelector('#services');
  const container = document.querySelector('.specialties-container');
  const cards = gsap.utils.toArray('.kinetic-card');

  if (!section || !container || cards.length === 0) return;

  const total = cards.length;
  const pivot = (total - 1) / 2;

  // INITIAL STATE: Centered tight pile (os-like)
  gsap.set(cards, {
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: (i) => (i - pivot) * 5, // Tight stack fan
    scale: 0.8,
    opacity: 0,
    zIndex: (i) => i
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=1200",
      pin: true,
      scrub: 1.2,
      invalidateOnRefresh: true
    }
  });

  // PHASE 1: Arrival (The Pile appears)
  tl.to(cards, {
    scale: 1,
    opacity: 1,
    stagger: 0.1,
    duration: 1,
    ease: "power2.out"
  })
    // PHASE 2: The Explosion (Mechanically Segregate horizontally)
    .to(cards, {
      x: (i) => (i - pivot) * 380, // High-precision horizontal pillars
      rotateZ: 0, // Cards straighten up for reading
      duration: 2,
      ease: "expo.inOut"
    }, "+=0.2");

  // 3D Interaction Logic & Dynamic Spotlight
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Floating Tilt
      const rotateX = (y / rect.height - 0.5) * -15;
      const rotateY = (x / rect.width - 0.5) * 15;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        y: -30,
        z: 80,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        z: 0,
        scale: 1,
        duration: 0.8,
        ease: "expo.out"
      });
    });
  });
}
// End of Kinetic Stack Redesign

// 8. Neural Network Background (Three.js)
function initThreeBackground() {
  const canvas = document.querySelector('#bg-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2500);
  camera.position.z = 800;

  // Increased density and biased towards edges
  const particlesCount = window.innerWidth < 768 ? 400 : 1500;
  const positions = new Float32Array(particlesCount * 3);

  // Distribute dots favoring screen edges
  for (let i = 0; i < particlesCount; i++) {
    // Edge-biased X distribution
    let x;
    if (Math.random() > 0.25) {
      // 75% chance to be on the far edges
      x = (Math.random() - 0.5 > 0 ? 1 : -1) * (600 + Math.random() * 600);
    } else {
      // 25% chance in the central area
      x = (Math.random() - 0.5) * 1200;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1500;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 4,
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const lineGeometry = new THREE.BufferGeometry();
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  let mouse = new THREE.Vector3(0, 0, -1000);
  let mouseActive = false;

  window.addEventListener('mousemove', (e) => {
    mouseActive = true;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;

    const vector = new THREE.Vector3(x, y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    mouse = camera.position.clone().add(dir.multiplyScalar(distance));
  });

  function animate() {
    requestAnimationFrame(animate);

    const positionsArr = points.geometry.attributes.position.array;
    const linePositions = [];
    const interactionRadius = 280; // Distance from mouse to activate nodes
    const connectDistance = 180; // Max distance between nodes to connect

    if (mouseActive) {
      for (let i = 0; i < particlesCount; i++) {
        const dxMouse = positionsArr[i * 3] - mouse.x;
        const dyMouse = positionsArr[i * 3 + 1] - mouse.y;
        const dzMouse = positionsArr[i * 3 + 2] - mouse.z;
        const mouseDist = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse + dzMouse * dzMouse);

        // If a node is near the mouse, check its neighbors
        if (mouseDist < interactionRadius) {
          for (let j = i + 1; j < particlesCount; j++) {
            const dx = positionsArr[i * 3] - positionsArr[j * 3];
            const dy = positionsArr[i * 3 + 1] - positionsArr[j * 3 + 1];
            const dz = positionsArr[i * 3 + 2] - positionsArr[j * 3 + 2];
            const dotsDist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dotsDist < connectDistance) {
              linePositions.push(positionsArr[i * 3], positionsArr[i * 3 + 1], positionsArr[i * 3 + 2]);
              linePositions.push(positionsArr[j * 3], positionsArr[j * 3 + 1], positionsArr[j * 3 + 2]);
            }
          }
        }
      }
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}



