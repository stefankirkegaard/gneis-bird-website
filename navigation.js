// Real URLs remain usable without JavaScript. Only Bird's local pages are routed.
(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const routes = new Set(['index.html', 'pricing.html', 'platform.html', 'about.html', 'contact.html', 'journal.html', 'article.html']);
  const cache = new Map();
  const positions = new Map();
  let active;
  let renderedURL = new URL(location.href);
  let entry = crypto.randomUUID();
  history.replaceState({ ...history.state, birdEntry: entry }, '', location.href);
  history.scrollRestoration = 'manual';

  const pageKey = url => url.origin + url.pathname + url.search;
  const saveScroll = () => positions.set(entry, { left: scrollX, top: scrollY });
  addEventListener('scroll', () => { if (!active) saveScroll(); }, { passive: true });
  saveScroll();

  function eligible(link) {
    if (!link || link.hasAttribute('download') || link.hasAttribute('data-full-navigation') ||
        (link.target && link.target !== '_self') || link.relList.contains('external')) return null;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return null;
    if (url.pathname !== '/' && !routes.has(url.pathname.slice(1))) return null;
    return url;
  }

  async function loadPage(url) {
    const key = pageKey(url);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.time < 30000) return cached.promise;
    const promise = (async () => {
      const response = await fetch(key, {
        credentials: 'same-origin', headers: { Accept: 'text/html' }, signal: AbortSignal.timeout(8000)
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html') ||
          new URL(response.url).origin !== location.origin) throw new Error('Page unavailable');
      const page = new DOMParser().parseFromString(await response.text(), 'text/html');
      if (!page.querySelector('header.hero') || !page.querySelector('main') || !page.title) throw new Error('Unknown page');
      // A newer release gets a full load so HTML, CSS and behaviors stay in sync.
      for (const selector of ['link[href^="styles.css"]', 'script[src^="script.js"]', 'script[src^="navigation.js"]']) {
        const incoming = page.querySelector(selector);
        const current = document.querySelector(selector);
        if (!incoming || !current || (incoming.getAttribute('href') || incoming.getAttribute('src')) !==
            (current.getAttribute('href') || current.getAttribute('src'))) throw new Error('New site version');
      }
      // Warm the hero artwork before capturing the incoming view.
      const artwork = [...page.querySelectorAll('.hero__media img, .flowmap image')].map(node => {
        const image = new Image();
        image.src = new URL(node.getAttribute('src') || node.getAttribute('href'), url).href;
        return image.decode().catch(() => {});
      });
      if (artwork.length) await Promise.race([Promise.all(artwork), new Promise(resolve => setTimeout(resolve, 750))]);
      return page;
    })();
    cache.set(key, { time: Date.now(), promise });
    if (cache.size > 12) cache.delete(cache.keys().next().value);
    promise.catch(() => { if (cache.get(key)?.promise === promise) cache.delete(key); });
    return promise;
  }

  function syncHead(page) {
    document.title = page.title;
    root.lang = page.documentElement.lang || 'en';
    for (const selector of ['meta[name="description"]', 'meta[name="robots"]', 'link[rel="canonical"]']) {
      document.head.querySelector(selector)?.remove();
      const node = page.head.querySelector(selector);
      if (node) document.head.append(document.importNode(node, true));
    }
  }

  function positionPage(url, position) {
    if (position) { scrollTo({ ...position, behavior: 'instant' }); return; }
    let target;
    try { target = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch {}
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  function focusPage(url) {
    let target;
    try { target = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch {}
    target ||= document.querySelector('h1');
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }

  function swap(page, url, push, position, targetEntry) {
    window.BirdPage.unmount();
    // Clone cached content: revisiting a page must not consume its stored nodes.
    const nodes = [...page.body.children].filter(node => node.tagName !== 'SCRIPT')
      .map(node => document.importNode(node, true));
    [...document.body.children].forEach(node => { if (node.tagName !== 'SCRIPT') node.remove(); });
    document.body.prepend(...nodes);
    syncHead(page);
    if (push) {
      entry = crypto.randomUUID();
      history.pushState({ birdEntry: entry }, '', url.href);
    } else entry = targetEntry;
    renderedURL = new URL(url.href);
    window.BirdPage.mount();
    positionPage(url, position);
    focusPage(url);
    document.dispatchEvent(new CustomEvent('bird:navigation', { detail: { url: url.href } }));
  }

  async function visit(url, { push = true, position, targetEntry } = {}) {
    saveScroll();
    if (active) {
      active.cancelled = true;
      active.transition?.skipTransition();
      active.animation?.cancel();
    }
    const token = { cancelled: false };
    active = token;
    root.setAttribute('aria-busy', 'true');
    try {
      if (pageKey(url) === pageKey(renderedURL)) {
        window.BirdPage.closeMenu();
        if (push && url.href !== location.href) {
          entry = crypto.randomUUID();
          history.pushState({ birdEntry: entry }, '', url.href);
        } else if (!push) entry = targetEntry;
        renderedURL = new URL(url.href);
        positionPage(url, position);
        if (url.hash) focusPage(url);
        return;
      }
      const page = await loadPage(url);
      if (token.cancelled) return;
      const update = () => { if (!token.cancelled) swap(page, url, push, position, targetEntry); };
      if (reducedMotion.matches) update();
      else if (document.startViewTransition) {
        token.transition = document.startViewTransition(update);
        // A hidden tab can skip the animation; the DOM update still runs.
        token.transition.ready.catch(() => {});
        await token.transition.updateCallbackDone;
        await token.transition.finished.catch(() => {});
      } else {
        token.animation = document.body.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: 'ease-in', fill: 'forwards' });
        await token.animation.finished.catch(() => {});
        if (token.cancelled) return;
        update();
        token.animation.cancel();
        token.animation = document.body.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
        await token.animation.finished.catch(() => {});
      }
    } catch {
      if (!token.cancelled) location.assign(url.href);
    } finally {
      if (active === token) {
        active = null;
        root.removeAttribute('aria-busy');
        saveScroll();
      }
    }
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    const url = eligible(link);
    if (!url) return;
    event.preventDefault();
    visit(url);
  });
  function warm(event) {
    if (navigator.connection?.saveData) return;
    const url = eligible(event.target.closest('a[href]'));
    if (url && pageKey(url) !== pageKey(renderedURL)) loadPage(url).catch(() => {});
  }
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('focusin', warm);
  addEventListener('popstate', event => {
    const targetEntry = event.state?.birdEntry || crypto.randomUUID();
    if (!event.state?.birdEntry) history.replaceState({ ...event.state, birdEntry: targetEntry }, '', location.href);
    visit(new URL(location.href), { push: false, position: positions.get(targetEntry), targetEntry });
  });
})();
