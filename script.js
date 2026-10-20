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
const behind = document.querySelectorAll('.hero__content, .page-hero, .hero__media, .ticker, main, .footer');
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

// Filterable grids (Platform features, Journal articles): category tabs plus an optional search field.
document.querySelectorAll('[data-filter]').forEach(directory => {
  const items = [...directory.querySelectorAll('.directory__grid > [data-category]')];
  const tabs = directory.querySelectorAll('.tab');
  const search = directory.dataset.search ? document.getElementById(directory.dataset.search) : null;
  const count = directory.querySelector('.directory__count');
  const empty = directory.querySelector('.directory__empty');
  const noun = directory.dataset.filter;
  let category = 'all';

  const apply = () => {
    const query = search ? search.value.trim().toLowerCase() : '';
    let shown = 0;
    items.forEach(item => {
      const match = (category === 'all' || item.dataset.category === category)
        && item.textContent.toLowerCase().includes(query);
      item.hidden = !match;
      if (match) shown++;
    });
    count.textContent = `${shown} ${noun}${shown === 1 ? '' : 's'}`;
    if (empty) empty.hidden = shown > 0;
  };

  const setCategory = (value) => {
    category = value;
    tabs.forEach(t => t.setAttribute('aria-pressed', t.dataset.category === value));
    apply();
  };

  tabs.forEach(tab => tab.addEventListener('click', () => setCategory(tab.dataset.category)));
  search?.addEventListener('input', apply);
  directory.querySelector('.directory__reset')?.addEventListener('click', () => { if (search) search.value = ''; setCategory('all'); });
});

// Contact and newsletter forms are front-end only for now: swap in the confirmation after a valid submit.
document.querySelectorAll('form[data-local-form]').forEach(form => form.addEventListener('submit', e => {
  e.preventDefault();
  const done = form.querySelector('.form__success');
  form.querySelector('.form__body').hidden = true;
  done.hidden = false;
  done.focus();
}));

// FAQ accordion: one answer open at a time, sliding open and closed (0.3s ease).
const faqMotion = matchMedia('(prefers-reduced-motion: reduce)');
const faqItems = [...document.querySelectorAll('.faq__item')];
const faqAnims = new Map();

const isShown = item => item.open && !item.classList.contains('is-closing');

const toggleFaq = (item, open) => {
  if (faqMotion.matches) { item.open = open; return; }
  const summary = item.querySelector('summary');
  const from = item.offsetHeight;
  faqAnims.get(item)?.cancel();

  // stay [open] while closing so the answer is visible as it slides shut
  item.open = true;
  item.classList.toggle('is-closing', !open);
  const border = item.offsetHeight - item.clientHeight;
  const to = open ? item.offsetHeight : summary.offsetHeight + border;

  item.style.overflow = 'hidden';
  const anim = item.animate({ height: [`${from}px`, `${to}px`] }, { duration: 300, easing: 'ease' });
  faqAnims.set(item, anim);
  anim.onfinish = () => {
    if (!open) item.open = false;
    item.classList.remove('is-closing');
    item.style.overflow = '';
    faqAnims.delete(item);
  };
};

faqItems.forEach(item => item.querySelector('summary').addEventListener('click', e => {
  e.preventDefault();
  const open = !isShown(item);
  if (open) faqItems.forEach(other => { if (other !== item && isShown(other)) toggleFaq(other, false); });
  toggleFaq(item, open);
}));
