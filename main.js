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

// Só existe build de Android. Vira true quando houver iOS, e o botão e o texto
// da seção de download voltam sozinhos.
const IOS_DISPONIVEL = false;

if (IOS_DISPONIVEL) {
  const btnIos = document.getElementById('btnIos');
  const desc = document.getElementById('downloadDesc');
  if (btnIos) btnIos.hidden = false;
  if (desc) desc.textContent = desc.dataset.descIos;
}

// O numero da versao no cartao de download envelhecia a cada release. Le a
// ultima publicada e substitui. Se a chamada falhar, por limite de taxa da API
// ou por rede, o valor que ja esta no HTML fica: nunca some da tela.
const verEl = document.querySelector('.appcard-ver');
if (verEl) {
  fetch('https://api.github.com/repos/BusKa-org/municipal-frontend/releases/latest')
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(({ tag_name }) => {
      const num = String(tag_name || '').replace(/^v/, '').replace(/-beta$/, '');
      if (num) verEl.textContent = `Versão Beta ${num}`;
    })
    .catch(() => {});
}

// Auto-update copyright year
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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
