/**
 * LaunchDok Premium — interactions
 * Ambient canvas · scroll reveal · navbar · FAQ · mobile menu
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js-ready');

  /* ── Navbar scroll ── */
  const nav = document.getElementById('ld-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ── */
  const toggle = document.getElementById('ld-menu-toggle');
  const mobileMenu = document.getElementById('ld-mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll effects — progress · parallax ── */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    const progressBar = document.createElement('div');
    progressBar.className = 'ld-scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);

    const orbs = document.querySelectorAll('.ld-ambient-orb');
    let scrollY = 0;
    let scrollTicking = false;

    function updateScrollEffects() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, scrollY / docHeight) : 0;
      progressBar.style.transform = `scaleX(${progress})`;

      orbs.forEach((orb, i) => {
        const speed = 0.04 + i * 0.025;
        orb.style.transform = `translate3d(0, ${scrollY * speed * -1}px, 0)`;
      });

      scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
      if (!scrollTicking) {
        requestAnimationFrame(updateScrollEffects);
        scrollTicking = true;
      }
    }, { passive: true });
    updateScrollEffects();
  }

  /* ── Ambient canvas — floating network ── */
  const ambientCanvas = document.getElementById('ld-ambient-canvas');
  if (ambientCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = ambientCanvas.getContext('2d');
    let w = 0, h = 0, dots = [], rafId = 0;
    const DOT_COUNT = window.innerWidth < 768 ? 40 : 64;
    const CONNECT_DIST = window.innerWidth < 768 ? 120 : 160;

    function resizeAmbient() {
      w = ambientCanvas.width = window.innerWidth;
      h = ambientCanvas.height = window.innerHeight;
    }

    function initDots() {
      dots = Array.from({ length: DOT_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.2,
      }));
    }

    function drawAmbient() {
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.16;
            ctx.strokeStyle = `rgba(255,106,0,${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      dots.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r + 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,106,0,0.55)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r + 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,106,0,0.08)';
        ctx.fill();
      });
      rafId = requestAnimationFrame(drawAmbient);
    }

    resizeAmbient();
    initDots();
    drawAmbient();
    window.addEventListener('resize', () => {
      resizeAmbient();
      initDots();
    });
  }

  /* ── Scroll reveal — section-by-section rise on scroll ── */
  function initScrollReveal() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.ld-section, .ld-page-hero').forEach((section) => {
      const seen = new Set();
      let order = 0;
      const items = [];

      function addItem(el) {
        if (!el || seen.has(el)) return;
        seen.add(el);
        el.classList.remove('ld-reveal', 'visible', 'is-revealed');
        el.classList.add('ld-scroll-up');
        el.style.setProperty('--reveal-delay', `${order * 0.1}s`);
        order += 1;
        items.push(el);
      }

      section.querySelectorAll('.ld-section-header').forEach((header) => {
        header.classList.remove('ld-reveal', 'visible');
        header.querySelectorAll('.ld-label, .ld-h2, .ld-lead, p').forEach(addItem);
      });

      section.querySelectorAll('.ld-page-hero .ld-container').forEach((block) => {
        block.querySelectorAll('.ld-label, h1, .ld-h2, .ld-lead, p').forEach(addItem);
      });

      section.querySelectorAll(
        '.ld-pain-card, .ld-card, .ld-process-item, .ld-package, .ld-portfolio-card, .ld-portfolio-page-item, .ld-faq-item, .ld-check-list li, .ld-final-cta, .ld-contact-form .ld-field, .ld-why-grid > div, .ld-portfolio-cta, p.ld-reveal, .ld-reveal'
      ).forEach(addItem);

      if (!items.length || reduced) {
        items.forEach((el) => el.classList.add('is-revealed'));
        return;
      }

      const revealSection = () => {
        items.forEach((el) => el.classList.add('is-revealed'));
      };

      if (!('IntersectionObserver' in window)) {
        revealSection();
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealSection();
              observer.disconnect();
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );

      observer.observe(section);
    });
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(initScrollReveal);
  });

  /* ── FAQ accordion ── */
  document.querySelectorAll('.ld-faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.ld-faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.ld-faq-item').forEach((i) => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ── Smooth anchor offset for fixed nav ── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--ld-nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Portfolio filters (Client.html) ── */
  const filterBtns = document.querySelectorAll('.ld-filter-btn');
  const portfolioItems = document.querySelectorAll('.ld-portfolio-page-item');
  if (filterBtns.length && portfolioItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        portfolioItems.forEach((item) => {
          const show = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('is-hidden', !show);
        });
      });
    });
  }
})();
