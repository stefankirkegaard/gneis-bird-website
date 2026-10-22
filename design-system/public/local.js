/* The original React examples keep their own behavior. This shell adds documentation navigation. */
(() => {
  'use strict';
  const icons = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>',
    chevron: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 4 4 4-4 4"/></svg>',
    copy: '<svg class="ds-copy-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="7" y="7" width="9" height="10" rx="1.5"/><path d="M12 7V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3"/></svg>',
    check: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>',
    moon: '<svg class="ds-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20.7 13A9 9 0 0 1 11 3.3 9 9 0 1 0 20.7 13Z"/></svg>',
    sun: '<svg class="ds-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
  };
  const pages = [
    { slug: 'colors', title: 'Colors', group: 'Foundations', id: 'bird-colors', description: 'Bird’s color palette, from our core blues and neutrals to supporting accents. Select a swatch to copy its hex value.' },
    { slug: 'typography', title: 'Typography', group: 'Foundations', id: 'bird-typography', description: 'Geist is Bird’s typeface. Medium (500) for headlines and Light (300) for body copy.' },
    { slug: 'radius', title: 'Radius', group: 'Foundations', id: 'bird-radius', description: 'Compare each radius at its actual size, with an enlarged corner detail to make the differences clear.' },
    { slug: 'buttons', title: 'Buttons', group: 'Components', id: 'buttons', description: 'Actions in every size and state. Use the primary variant for the most important action on a page.' },
    { slug: 'badges', title: 'Badges', group: 'Components', id: 'badges', description: 'Compact labels for priority, progress, and status.' },
    { slug: 'forms', title: 'Form controls', group: 'Components', id: 'forms', description: 'Inputs, selections, and toggles for collecting information.' },
    { slug: 'table', title: 'Table', group: 'Components', id: 'table', description: 'Column-aligned records for scanning and comparing project data.' },
    { slug: 'listing', title: 'Listing', group: 'Components', id: 'listing', description: 'Browsable rows that bring related content together.' },
    { slug: 'empty-states', title: 'Empty states', group: 'Components', id: 'empty-states', description: 'Helpful guidance when content is missing or a search has no matches.' },
    { slug: 'loading-states', title: 'Loading states', group: 'Components', id: 'loading-states', description: 'Show progress with skeletons, spinners, and loading indicators.' },
    { slug: 'thinking-orbs', title: 'Thinking orbs', group: 'Components', id: 'thinking-orbs', description: 'Motion that makes Bird’s AI activity visible, from the first thought to the final answer.' },
    { slug: 'feedback', title: 'Feedback & data', group: 'Components', id: 'feedback', description: 'Alerts, cards, tabs, and supporting elements for project information.' }
  ];
  const pathFor = slug => `/design-system/${slug}`;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const rgb = hex => [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16));
  const ink = hex => {
    const luminance = rgb(hex).map(value => { value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    return (luminance + .05) / .05 > 1.05 / (luminance + .05) ? '#161616' : '#FFFFFF';
  };

  async function initialize() {
    const main = document.querySelector('main');
    const originalHeader = document.querySelector('header');
    const theme = originalHeader.querySelector('button[aria-label="Toggle theme"]');
    const palette = await fetch('/design-system/public/palette.json').then(response => { if (!response.ok) throw new Error('Palette unavailable'); return response.json(); });
    originalHeader.hidden = true;
    originalHeader.inert = true;
    originalHeader.classList.add('ds-original-header');
    main.querySelectorAll(':scope > p, :scope > footer').forEach(node => node.hidden = true);
    const sections = [...main.querySelectorAll(':scope > section')];
    sections.forEach(section => { section.hidden = true; });
    const heading = document.createElement('div');
    heading.className = 'ds-page-heading';
    main.prepend(heading);

    const colors = document.createElement('section');
    colors.id = 'bird-colors';
    colors.className = 'ds-colors';
    colors.innerHTML = palette.map(group => `
      <div class="ds-color-group" id="palette-${group.id}">
        <div class="ds-group-heading"><h2>${group.label}</h2><p>${escapeHTML(group.description)}</p></div>
        ${group.families.map(family => `<div class="ds-color-family"><h3 class="ds-family-title">${escapeHTML(family.name)}</h3>
          <div class="ds-swatch-grid" style="--color-count:${family.colors.length}">${family.colors.map(([name, hex]) => `<button class="ds-swatch" type="button" data-copy="${hex}" aria-label="Copy ${escapeHTML(name)}, ${hex}">
            <span class="ds-swatch-color" style="--swatch:${hex};--swatch-ink:${ink(hex)}"><span class="ds-swatch-name">${escapeHTML(name)}</span>${icons.copy}</span>
            <span class="ds-swatch-meta"><span class="ds-swatch-hex">${hex}</span><span class="ds-swatch-rgb">${rgb(hex).join(' / ')}</span></span>
          </button>`).join('')}</div></div>`).join('')}
      </div>`).join('');
    const semantics = [
      ['primary', 'Primary action', 'Blueprint', 'Skyline'],
      ['foreground', 'Primary text', 'Charcoal', 'Mist'],
      ['muted-foreground', 'Secondary text', 'Graphite', 'Silver'],
      ['muted', 'Subtle surface', 'Mist', 'Neutral surface'],
      ['accent', 'Selected surface', 'Skyline', 'Foundation'],
      ['destructive', 'Errors and destructive actions', 'Brick Red', 'Dusty Rose'],
      ['warning', 'Warnings and attention', 'Marigold', 'Marigold'],
      ['success', 'Success and completion', 'Forest Jade', 'Mint Foam'],
      ['info', 'Informational feedback', 'Sea Blue', 'Skyline'],
      ['ring', 'Keyboard focus', 'Blueprint', 'Blueprint']
    ];
    const semanticSection = document.createElement('div');
    semanticSection.className = 'ds-color-group';
    semanticSection.id = 'palette-semantic';
    semanticSection.innerHTML = `<div class="ds-group-heading"><h2>Semantic tokens</h2><p>Color with a purpose.</p></div>
      <p class="ds-semantic-intro">Use a semantic token when building components. Its role stays the same while its color adapts to the theme.</p>
      <table class="ds-token-table"><thead><tr><th scope="col">Token</th><th scope="col">${document.documentElement.classList.contains('dark') ? 'Dark' : 'Light'} theme</th><th scope="col">Usage</th></tr></thead>
      <tbody>${semantics.map(([token, usage, light, dark]) => `<tr><td><code>--${token}</code></td><td><span class="ds-token-chip" style="--token-color:var(--${token})"></span><span data-light="${light}" data-dark="${dark}">${light}</span></td><td>${usage}</td></tr>`).join('')}</tbody></table>`;
    colors.append(semanticSection);
    main.append(colors);
    const typography = document.createElement('section');
    typography.id = 'bird-typography';
    typography.className = 'ds-typography';
    const typeScale = [
      ['Heading 1', 'Project clarity.', 48, 56, 500, '-.04em'],
      ['Heading 2', 'Every detail, connected.', 32, 40, 500, '-.035em'],
      ['Heading 3', 'One shared perspective.', 24, 32, 500, '-.025em'],
      ['Heading 4', 'Keep everyone aligned.', 20, 28, 500, '-.02em'],
      ['Body large', 'Bring every update together in one place.', 18, 30, 300, '0'],
      ['Body', 'Stay connected to your projects, from first draft to final build.', 16, 26, 300, '0'],
      ['Body small', 'The details that keep work moving.', 14, 22, 300, '0'],
      ['Caption', 'Last updated a moment ago.', 12, 18, 300, '0']
    ];
    typography.innerHTML = `<div class="ds-type-group" id="type-family">
      <div class="ds-group-heading"><h2>Typeface</h2><p>One family. Two core weights.</p></div>
      <div class="ds-type-card">
        <div class="ds-type-family-preview"><p class="ds-type-family-name">Geist</p><p class="ds-type-alphabet">Aa Bb Cc Dd Ee Ff<br>0123456789 Æ Ø Å</p></div>
        <div class="ds-type-weights">
          <div class="ds-type-weight"><div><h3>Headlines</h3><p>Geist Medium</p></div><code>500</code></div>
          <div class="ds-type-weight"><div><h3>Body copy</h3><p>Geist Light</p></div><code>300</code></div>
        </div>
      </div>
    </div>
    <div class="ds-type-group" id="type-scale">
      <div class="ds-group-heading"><h2>Type scale</h2><p>Medium headlines. Light body copy.</p></div>
      <div>${typeScale.map(([label, text, size, line, weight, tracking]) => `<div class="ds-type-row">
        <div class="ds-type-row-heading"><h3>${label}</h3><code>${size} / ${line} px · ${weight === 500 ? 'Medium 500' : 'Light 300'}</code></div>
        <p class="ds-type-sample" data-type-weight="${weight}" style="--sample-size:${size}px;--sample-line:${line}px;--sample-weight:${weight};--sample-tracking:${tracking}">${text}</p>
      </div>`).join('')}</div>
    </div>`;
    main.append(typography);
    const radius = document.createElement('section');
    radius.id = 'bird-radius';
    radius.className = 'ds-radius';
    const radiusScale = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].map(size => {
      const probe = document.createElement('span');
      probe.className = `rounded-${size}`;
      document.body.append(probe);
      const pixels = parseFloat(getComputedStyle(probe).borderTopLeftRadius);
      probe.remove();
      return { size, pixels };
    });
    const formatRadius = value => Number(value.toFixed(2)).toString();
    const baseRadius = radiusScale.find(item => item.size === 'lg').pixels;
    radius.innerHTML = `<div id="radius-scale">
      <div class="ds-group-heading"><h2>Radius scale</h2><p>Base radius: ${formatRadius(baseRadius)} px · 0.45 rem</p></div>
      <div class="ds-radius-grid">${radiusScale.map(({size, pixels}) => {
        const zoom = pixels * 3;
        const tangent = 12 + zoom;
        return `<article class="ds-radius-card" id="radius-${size}">
          <div class="ds-radius-card-heading"><h3><code>rounded-${size}</code></h3><span class="ds-radius-value">${formatRadius(pixels)} px</span></div>
          <div class="ds-radius-stage">
            <div class="ds-radius-example"><div class="ds-radius-shape rounded-${size}" aria-label="${formatRadius(pixels)} pixel corner radius"></div><span>Actual size</span></div>
            <div class="ds-radius-example ds-radius-detail"><svg width="96" height="100" viewBox="0 0 96 100" fill="none" role="img" aria-label="Corner enlarged three times">
              <path class="ds-radius-guide" d="M12 84V12H84"/>
              <path class="ds-radius-measure" d="M12 ${tangent}H${tangent}V12"/>
              <path class="ds-radius-curve" d="M12 84V${tangent}A${zoom} ${zoom} 0 0 1 ${tangent} 12H84"/>
              <circle class="ds-radius-center" cx="${tangent}" cy="${tangent}" r="2"/>
            </svg><span>Corner ×3</span></div>
          </div>
          <div class="ds-radius-card-footer"><span>Corner radius</span><code>${formatRadius(pixels / 16)} rem</code></div>
        </article>`;
      }).join('')}</div>
    </div>`;
    main.append(radius);
    const footer = document.createElement('div');
    footer.className = 'ds-page-footer';
    main.append(footer);

    const topbar = document.createElement('div');
    topbar.className = 'ds-topbar';
    topbar.innerHTML = `<a class="ds-brand" href="/design-system/colors" data-doc-page="colors" aria-label="Bird Design System home"><img src="/design-system/public/favicons/light-mode.svg" alt="" width="26" height="26"><span>Bird</span><span class="ds-brand-divider" aria-hidden="true"></span><span class="ds-brand-label">Design System</span></a>
      <div class="ds-topbar-actions"><button class="ds-icon-button ds-theme" type="button" aria-label="Toggle theme">${icons.moon}${icons.sun}</button><button class="ds-icon-button ds-menu-toggle" type="button" aria-label="Open navigation" aria-controls="ds-navigation" aria-expanded="false">${icons.menu}</button></div>`;
    const sidebar = document.createElement('aside');
    sidebar.className = 'ds-sidebar';
    sidebar.id = 'ds-navigation';
    sidebar.innerHTML = `<nav aria-label="Design system">${['Foundations', 'Components'].map(group => `<div class="ds-nav-group"><p class="ds-nav-label">${group}</p>${pages.filter(page => page.group === group).map(page => `<a class="ds-nav-link" href="${pathFor(page.slug)}" data-doc-page="${page.slug}">${page.title}</a>`).join('')}</div>`).join('')}</nav><p class="ds-sidebar-foot"><span aria-hidden="true"></span>Bird Design System</p>`;
    const backdrop = document.createElement('div');
    backdrop.className = 'ds-menu-backdrop';
    const toc = document.createElement('nav');
    toc.className = 'ds-toc';
    toc.setAttribute('aria-label', 'On this page');
    const toast = document.createElement('div');
    toast.className = 'ds-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.append(topbar, sidebar, backdrop, toc, toast);
    document.body.classList.add('ds-ready');

    const menuToggle = topbar.querySelector('.ds-menu-toggle');
    const mobile = matchMedia('(max-width:700px)');
    const setMenu = open => {
      document.body.classList.toggle('ds-menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      sidebar.inert = mobile.matches && !open;
      main.inert = open;
    };
    menuToggle.addEventListener('click', () => setMenu(!document.body.classList.contains('ds-menu-open')));
    backdrop.addEventListener('click', () => setMenu(false));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && document.body.classList.contains('ds-menu-open')) { setMenu(false); menuToggle.focus(); }
      if (event.key === 'Tab' && document.body.classList.contains('ds-menu-open')) {
        const focusable = [menuToggle, ...sidebar.querySelectorAll('a')];
        const first = focusable[0], last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    mobile.addEventListener('change', () => setMenu(false));
    setMenu(false);

    const syncTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      semanticSection.querySelectorAll('[data-light]').forEach(label => label.textContent = label.dataset[dark ? 'dark' : 'light']);
      semanticSection.querySelector('thead th:nth-child(2)').textContent = dark ? 'Dark theme' : 'Light theme';
    };
    topbar.querySelector('.ds-theme').addEventListener('click', () => theme.click());
    new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    syncTheme();

    let activePage;
    function showPage(slug, {push = false, focus = false, hash = ''} = {}) {
      const page = pages.find(page => page.slug === slug) || pages[0];
      activePage = page;
      [...sections, colors, typography, radius].forEach(section => section.hidden = section.id !== page.id);
      sidebar.querySelectorAll('[data-doc-page]').forEach(link => {
        if (link.dataset.docPage === page.slug) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      heading.innerHTML = `<p class="ds-breadcrumb"><span>${page.group}</span>${icons.chevron}<span>${page.title}</span></p><h1 tabindex="-1">${page.title}</h1><p class="ds-page-description">${page.description}</p>`;
      const index = pages.indexOf(page), next = pages[(index + 1) % pages.length];
      footer.innerHTML = `<span>Bird Design System</span><a class="ds-next-link" href="${pathFor(next.slug)}" data-doc-page="${next.slug}">Next: ${next.title}${icons.arrow}</a>`;
      toc.innerHTML = page.slug === 'colors' ? `<p>On this page</p>${[...palette.map(group => [group.id, group.label]), ['semantic','Semantic tokens']].map(([id,label]) => `<a href="#palette-${id}">${label}</a>`).join('')}` : '';
      if (page.slug === 'typography') toc.innerHTML = '<p>On this page</p><a href="#type-family">Typeface</a><a href="#type-scale">Type scale</a>';
      if (page.slug === 'radius') toc.innerHTML = `<p>On this page</p>${radiusScale.map(({size}) => `<a href="#radius-${size}">rounded-${size}</a>`).join('')}`;
      toc.hidden = !['colors', 'typography', 'radius'].includes(page.slug);
      document.title = `${page.title} — Bird Design System`;
      if (push) history.pushState({birdDoc:page.slug}, '', pathFor(page.slug));
      setMenu(false);
      if (hash) document.getElementById(hash)?.scrollIntoView({behavior:'instant'});
      else scrollTo({top:0, left:0, behavior:'instant'});
      if (focus) heading.querySelector('h1').focus({preventScroll:true});
    }
    const currentRoute = () => {
      const suffix = location.pathname.split('/').filter(Boolean)[1];
      const oldHash = location.hash.slice(1);
      return { slug: suffix || (oldHash === 'tokens' ? 'colors' : pages.find(page => page.id === oldHash || page.slug === oldHash)?.slug) || 'colors', hash: /^(palette-|type-|radius-)/.test(oldHash) ? oldHash : '' };
    };
    document.addEventListener('click', event => {
      const link = event.target.closest('[data-doc-page]');
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showPage(link.dataset.docPage, {push:location.pathname !== pathFor(link.dataset.docPage), focus:true});
    });
    addEventListener('popstate', () => showPage(currentRoute().slug, {hash:currentRoute().hash}));
    const initial = currentRoute();
    showPage(initial.slug, {hash:initial.hash});

    let toastTimer;
    colors.addEventListener('click', async event => {
      const swatch = event.target.closest('[data-copy]');
      if (!swatch) return;
      try {
        await navigator.clipboard.writeText(swatch.dataset.copy);
        toast.innerHTML = `${icons.check}<span>Copied ${swatch.dataset.copy}</span>`;
      } catch {
        toast.textContent = `Hex value: ${swatch.dataset.copy}`;
      }
      clearTimeout(toastTimer);
      toast.classList.add('is-visible');
      toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2000);
    });
  }
  // Wait for hydration so the original React tree is mounted before decorating it.
  let attempts = 0;
  const ready = () => {
    const theme = document.querySelector('header button[aria-label="Toggle theme"]');
    if (theme && Object.keys(theme).some(key => key.startsWith('__reactProps$'))) {
      requestAnimationFrame(() => initialize().catch(error => console.error('Bird docs:', error)));
    } else if (attempts++ < 200) setTimeout(ready, 25);
  };
  ready();
})();
