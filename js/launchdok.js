/**
 * LaunchDok Premium — interactions
 * Horizon parallax · particles · scroll reveal · navbar · FAQ · mobile menu
 */
(function () {
  'use strict';

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

  /* ── Horizon mouse parallax ── */
  const horizonWrap = document.getElementById('ld-horizon-wrap');
  const hero = document.getElementById('ld-hero');
  if (horizonWrap && hero) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 24;
      targetY = y * 12;
    });
    hero.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });
    function animateHorizon() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      horizonWrap.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(animateHorizon);
    }
    animateHorizon();
  }

  /* ── Particles ── */
  const particleContainer = document.getElementById('ld-particles');
  if (particleContainer) {
    const count = 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'ld-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = (20 + Math.random() * 40) + '%';
      p.style.animationDuration = (12 + Math.random() * 18) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.width = p.style.height = (2 + Math.random() * 2) + 'px';
      particleContainer.appendChild(p);
    }
  }

  /* ── Scroll reveal ── */
  const reveals = document.querySelectorAll('.ld-reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el, i) => {
      el.style.transitionDelay = (i % 6) * 0.06 + 's';
      observer.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

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
