// Page behaviors are mounted again after client-side navigation.
(() => {
let dispose;
let dismissMenu;
let pipedriveForm;
let pipedriveLoading;
function mountContactForm() {
  const container = document.querySelector('.pipedriveWebForms');
  if (!container) return;
  if (pipedriveForm && pipedriveForm !== container) container.replaceWith(pipedriveForm);
  else pipedriveForm = container;
  if (!pipedriveLoading) {
    pipedriveLoading = new Promise((resolve, reject) => {
      const loader = document.createElement('script');
      loader.src = 'https://webforms.pipedrive.com/f/loader';
      loader.async = true;
      loader.dataset.pipedriveLoader = 'true';
      loader.onload = resolve;
      loader.onerror = reject;
      document.head.append(loader);
    });
  }
  pipedriveLoading.catch(() => {
    const fallback = document.querySelector('.form-embed-fallback');
    if (fallback) fallback.hidden = false;
  });
}
function mount() {
  dispose?.();
  const isDanish = document.documentElement.lang === 'da';
  mountContactForm();
// Scale the fixed-size UI illustrations (459 x 344.25, as in Figma) to fit their panel.
const panels = document.querySelectorAll('.flow__visual--panel');
const fit = () => panels.forEach(p => p.style.setProperty('--s', p.clientWidth ? (p.clientWidth + 2) / 459 : 1));
const panelObserver = new ResizeObserver(fit);
panelObserver.observe(document.body);
fit();

// One field of independently timed squares, with no repeating texture tile.
const mesh = document.querySelector('.get__mesh');
let meshObserver;
if (mesh) {
  let gridSize = '';
  const paintMesh = () => {
    const cols = Math.ceil(mesh.clientWidth / 24);
    const rows = Math.ceil(mesh.clientHeight / 24);
    const size = `${cols}:${rows}`;
    if (size === gridSize) return;
    gridSize = size;
    const squares = document.createDocumentFragment();
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Stable per-cell randomness keeps the layout calm during resizing.
        let seed = Math.imul(row + 1, 374761393) ^ Math.imul(col + 1, 668265263);
        const random = () => {
          seed = (seed + 0x6D2B79F5) | 0;
          let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
          value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
          return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
        };
        if (random() > .56) continue;
        const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        square.setAttribute('class', 'get__square');
        square.setAttribute('x', col * 24 + 9);
        square.setAttribute('y', row * 24 + 9);
        square.setAttribute('width', 6);
        square.setAttribute('height', 6);
        const duration = 3.2 + random() * 3.2;
        square.style.setProperty('--twinkle-duration', `${duration.toFixed(3)}s`);
        square.style.setProperty('--twinkle-delay', `${(-random() * duration).toFixed(3)}s`);
        square.style.setProperty('--square-peak', (.4 + random() * .6).toFixed(3));
        squares.append(square);
      }
    }
    mesh.replaceChildren(squares);
  };
  meshObserver = new ResizeObserver(paintMesh);
  meshObserver.observe(mesh);
  paintMesh();
}

// Mobile menu: burger morphs to an X, white overlay fades in/out.
const root = document.documentElement;
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.burger');
const menu = document.getElementById('menu');
const behind = document.querySelectorAll('.hero__content, .page-hero, .hero__media, .ticker, main, .footer');
const FADE = 400;
let closeTimer;
let focusTimer;
const lifecycle = new AbortController();

// Accessible language disclosures; preserve the current query and anchor.
const languages = [...document.querySelectorAll('.language')];
const closeLanguages = () => languages.forEach(language => {
  language.classList.remove('is-open');
  language.querySelector('button').setAttribute('aria-expanded', 'false');
  language.querySelector('.language__menu').hidden = true;
});
languages.forEach(language => {
  const button = language.querySelector('button');
  const list = language.querySelector('.language__menu');
  const open = () => {
    closeLanguages();
    language.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    list.hidden = false;
  };
  button.addEventListener('click', () => language.classList.contains('is-open') ? closeLanguages() : open());
  language.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeLanguages(); button.focus(); event.stopPropagation(); }
    if (event.key === 'ArrowDown' && event.target === button) {
      event.preventDefault(); open(); list.querySelector('a').focus();
    }
  });
  language.addEventListener('focusout', event => {
    if (!language.contains(event.relatedTarget)) closeLanguages();
  });
  list.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    const url = new URL(link.href);
    url.search = location.search;
    url.hash = location.hash;
    link.href = url.href;
    closeLanguages();
  }));
});
document.addEventListener('click', event => {
  if (!event.target.closest('.language')) closeLanguages();
}, { signal: lifecycle.signal });


const setOpen = (open) => {
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', isDanish ? (open ? 'Luk menu' : 'Åbn menu') : (open ? 'Close menu' : 'Open menu'));
  menu.setAttribute('aria-hidden', !open);
  behind.forEach(el => { el.inert = open; });
};

const openMenu = () => {
  clearTimeout(closeTimer);
  closeLanguages();
  root.style.setProperty('--nav-h', `${nav.offsetHeight}px`);
  root.classList.add('menu-active');
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('menu-open')));
  setOpen(true);
  focusTimer = setTimeout(() => menu.querySelector('a')?.focus({ preventScroll: true }), 150);
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

dismissMenu = () => {
  clearTimeout(closeTimer);
  clearTimeout(focusTimer);
  root.classList.remove('menu-active', 'menu-open');
  setOpen(false);
};

toggle.addEventListener('click', () => (root.classList.contains('menu-open') ? closeMenu() : openMenu()));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-open')) { closeMenu(); toggle.focus(); } }, { signal: lifecycle.signal });
menu.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;
  const hash = link.getAttribute('href');
  if (hash.startsWith('#')) {
    e.preventDefault();
    closeMenu(() => { if (hash.length > 1) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }); });
  }
});
matchMedia('(min-width: 1081px)').addEventListener('change', e => { if (e.matches) closeMenu(); }, { signal: lifecycle.signal });

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
    count.textContent = isDanish
      ? `${shown} ${noun === 'feature' ? (shown === 1 ? 'funktion' : 'funktioner') : (shown === 1 ? 'artikel' : 'artikler')}`
      : `${shown} ${noun}${shown === 1 ? '' : 's'}`;
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

// Pricing controls stay synchronized between the plan cards and sticky table.
const pricing = document.querySelector('[data-pricing]');
if (pricing) {
  const comparisonMedia = matchMedia('(max-width: 760px)');
  const fitComparison = () => {
    pricing.querySelectorAll('.compare-group th').forEach(cell => {
      cell.colSpan = comparisonMedia.matches ? 2 : 4;
    });
  };
  comparisonMedia.addEventListener('change', fitComparison, { signal: lifecycle.signal });
  fitComparison();
  const chooseBilling = period => {
    pricing.querySelectorAll('[data-billing]').forEach(button => {
      button.setAttribute('aria-pressed', button.dataset.billing === period);
    });
    pricing.querySelectorAll('[data-price-month]').forEach(price => {
      price.textContent = period === 'year' ? price.dataset.priceYear : price.dataset.priceMonth;
    });
    pricing.querySelectorAll('[data-billing-year]').forEach(note => {
      note.textContent = period === 'year' ? note.dataset.billingYear : note.dataset.billingMonth;
    });
    pricing.querySelector('[data-billing-status]').textContent = period === 'year'
      ? (isDanish ? 'Årlig betaling valgt. Starter 24 euro og Team 48 euro pr. bruger pr. måned.' : 'Yearly billing selected. Starter 24 euros and Team 48 euros per user per month.')
      : (isDanish ? 'Månedlig betaling valgt. Starter 30 euro og Team 60 euro pr. bruger pr. måned.' : 'Monthly billing selected. Starter 30 euros and Team 60 euros per user per month.');
  };
  pricing.querySelectorAll('[data-billing]').forEach(button => {
    button.addEventListener('click', () => chooseBilling(button.dataset.billing));
  });
  pricing.querySelectorAll('[data-compare]').forEach(button => {
    button.addEventListener('click', () => {
      pricing.querySelector('[data-compare-plan]').dataset.comparePlan = button.dataset.compare;
      pricing.querySelectorAll('[data-compare]').forEach(option => {
        option.setAttribute('aria-pressed', option === button);
      });
    });
  });
}

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

  dispose = () => {
    lifecycle.abort();
    panelObserver.disconnect();
    meshObserver?.disconnect();
    clearTimeout(closeTimer);
    clearTimeout(focusTimer);
    faqAnims.forEach(animation => animation.cancel());
    root.classList.remove('menu-active', 'menu-open');
    root.style.removeProperty('--nav-h');
  };
}
window.BirdPage = { mount, unmount: () => dispose?.(), closeMenu: () => dismissMenu?.() };
mount();
})();
