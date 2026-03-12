(function () {
  const docEl = document.documentElement;
  const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
  const sections = Array.from(document.querySelectorAll('[data-section]'));
  const navLinks = Array.from(document.querySelectorAll('.desktop-nav a'));
  const progress = document.querySelector('.scroll-progress');
  const motionToggle = document.getElementById('motion-toggle');
  const motionTrack = motionToggle?.querySelector('.motion-toggle__track');

  const setMotion = (reduced) => {
    docEl.dataset.motion = reduced ? 'reduced' : 'full';
    localStorage.setItem('motion-lite', reduced ? 'true' : 'false');
    if (motionToggle) motionToggle.setAttribute('aria-pressed', String(reduced));
    motionTrack?.classList.toggle('is-active', reduced);
    document.dispatchEvent(new CustomEvent('motion-lite-change'));
  };

  const storedMotion = localStorage.getItem('motion-lite') === 'true';
  setMotion(storedMotion);
  motionToggle?.addEventListener('click', () => setMotion(!(docEl.dataset.motion === 'reduced')));

  // Scroll progress
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${value})`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  // Reveal on view
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });
  revealItems.forEach((el) => revealObserver.observe(el));

  // Active nav highlighting
  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible?.target.id) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { threshold: [0.3, 0.55, 0.8], rootMargin: '-20% 0px -30% 0px' });
  sections.forEach((section) => navObserver.observe(section));

  // Interactive cursor
  const mediaQuery = window.matchMedia('(pointer: fine)');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const dot = document.createElement('div');
  const halo = document.createElement('div');
  dot.className = 'cursor-dot';
  halo.className = 'cursor-halo';
  let enabled = false;

  const updateCursorEnabled = () => {
    enabled = mediaQuery.matches && !prefersReduced.matches && docEl.dataset.motion !== 'reduced';
    if (enabled) {
      if (!dot.isConnected) document.body.append(dot, halo);
    } else {
      dot.remove();
      halo.remove();
    }
  };

  const lerp = (a, b, t) => a + (b - a) * t;
  let dotX = -100, dotY = -100, haloX = -100, haloY = -100;

  const onMove = (event) => {
    if (!enabled) return;
    dotX = lerp(dotX, event.clientX - 4, 0.25);
    dotY = lerp(dotY, event.clientY - 4, 0.25);
    haloX = lerp(haloX, event.clientX - 18, 0.18);
    haloY = lerp(haloY, event.clientY - 18, 0.18);
    dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    halo.style.transform = `translate(${haloX}px, ${haloY}px)`;
    dot.style.opacity = '1';
    halo.style.opacity = '1';
  };

  const onOver = (event) => {
    if (!enabled) return;
    const target = event.target.closest('a, button, [data-cursor="interactive"]');
    const scale = target ? 1.4 : 1;
    const haloScale = target ? 1.7 : 1;
    dot.style.transform += ` scale(${scale})`;
    halo.style.transform += ` scale(${haloScale})`;
  };

  const onLeave = () => {
    dot.style.opacity = '0';
    halo.style.opacity = '0';
  };

  // Attach thumbnails to local project links based on folder name
  const localProjectCards = Array.from(document.querySelectorAll('.project-card--link'));
  localProjectCards.forEach((card) => {
    if (card.querySelector('.project-card__media')) return;
    const name = card.querySelector('h3')?.textContent?.trim();
    if (!name) return;
    const media = document.createElement('div');
    media.className = 'project-card__media';
    const img = document.createElement('img');
    img.src = `./${name}thumbnail.png`;
    img.alt = `${name} thumbnail`;
    img.loading = 'lazy';
    img.onerror = () => media.remove();
    media.appendChild(img);
    card.prepend(media);
  });

  mediaQuery.addEventListener('change', updateCursorEnabled);
  prefersReduced.addEventListener('change', updateCursorEnabled);
  document.addEventListener('motion-lite-change', updateCursorEnabled);
  updateCursorEnabled();

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerover', onOver);
  document.addEventListener('mouseleave', onLeave);
})();
