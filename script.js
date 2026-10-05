// Scale the fixed-size UI illustrations (459 x 344.25, as in Figma) to fit their panel.
const panels = document.querySelectorAll('.flow__visual--panel');
const fit = () => panels.forEach(p => p.style.setProperty('--s', p.clientWidth ? (p.clientWidth + 2) / 459 : 1));
new ResizeObserver(fit).observe(document.body);
fit();

// Mobile menu: burger morphs to an X, white overlay fades in/out.
const root = document.documentElement;
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.burger');
const menu = document.getElementById('menu');
const behind = document.querySelectorAll('.hero__content, .hero__media, .ticker, main, .footer');
const FADE = 400;
let closeTimer;

const setOpen = (open) => {
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.setAttribute('aria-hidden', !open);
  behind.forEach(el => { el.inert = open; });
};

const openMenu = () => {
  clearTimeout(closeTimer);
  root.style.setProperty('--nav-h', `${nav.offsetHeight}px`);
  root.classList.add('menu-active');
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('menu-open')));
  setOpen(true);
  setTimeout(() => menu.querySelector('a')?.focus({ preventScroll: true }), 150);
};

const closeMenu = (after) => {
  if (!root.classList.contains('menu-active')) return;
  root.classList.remove('menu-open');
  setOpen(false);
  closeTimer = setTimeout(() => {
    root.classList.remove('menu-active');
    after?.();
  }, FADE);
};

toggle.addEventListener('click', () => (root.classList.contains('menu-open') ? closeMenu() : openMenu()));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-open')) { closeMenu(); toggle.focus(); } });
menu.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;
  const hash = link.getAttribute('href');
  if (hash.startsWith('#')) {
    e.preventDefault();
    closeMenu(() => { if (hash.length > 1) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }); });
  }
});
matchMedia('(min-width: 1081px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
