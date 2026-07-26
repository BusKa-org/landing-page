'use strict';

const navbar   = document.getElementById('navbar');
const burger   = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
const hero     = document.querySelector('.hero');
const stickyDl = document.getElementById('stickyDl');

// Navbar scroll state
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile nav toggle
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile nav on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// Sticky download CTA — show after hero leaves viewport
if (hero && stickyDl) {
  const obs = new IntersectionObserver(
    ([entry]) => {
      const visible = !entry.isIntersecting;
      stickyDl.classList.toggle('visible', visible);
      stickyDl.setAttribute('aria-hidden', !visible ? 'true' : 'false');
      stickyDl.querySelector('a').setAttribute('tabindex', visible ? '0' : '-1');
    },
    { threshold: 0 }
  );
  obs.observe(hero);
}
