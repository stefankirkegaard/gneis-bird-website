/* Consolidated examples from the signed-in Bird UI and the original Button catalogue. */
const svg = paths => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const icon = {
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  arrow: svg('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
  down: svg('<path d="m6 9 6 6 6-6"/>'),
  search: svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>'),
  qr: svg('<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M7 7h3v3H7zm7 0h3v3h-3zM7 14h3v3H7zm7 0h3v3h-3z"/>'),
  bell: svg('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'),
  spark: svg('<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4"/>'),
  list: svg('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
  columns: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16m6-16v16"/>'),
  chart: svg('<path d="M5 6h10M9 12h10M5 18h6"/>'),
  upload: svg('<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>'),
  download: svg('<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>'),
  more: svg('<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'),
  check: svg('<path d="m5 12 4 4L19 6"/>'),
  trash: svg('<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>'),
  play: svg('<path d="m9 5 11 7-11 7Z"/>'),
  stop: svg('<rect x="6" y="6" width="12" height="12" rx="1"/>'),
  file: svg('<path d="M14 2H5v20h14V7Zm0 0v5h5M8 12h8m-8 4h6"/>'),
  book: svg('<path d="M12 5C8 2 4 3 2 4v15c3-2 7-2 10 0 3-2 7-2 10 0V4c-2-1-6-2-10 1Zm0 0v14"/>'),
  close: svg('<path d="m6 6 12 12M6 18 18 6"/>'),
  minus: svg('<path d="M5 12h14"/>'),
  panel: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>')
};
const button = (label, {variant = 'outline', size = 'default', before = '', after = '', cls = '', attrs = ''} = {}) => `<button type="button" class="ds-btn ds-btn--${variant} ds-btn--${size} ${cls}" ${attrs}>${before}${label}${after}</button>`;
const heading = (title, note) => `<div class="ds-group-heading"><h2>${title}</h2><p>${note}</p></div>`;
const example = (title, description, content, cls = '') => `<article class="ds-button-example ${cls}"><div class="ds-button-stage">${content}</div><div class="ds-button-caption"><h3>${title}</h3><p>${description}</p></div></article>`;
const segment = (name, items, type = 'joined') => `<div class="ds-selection ds-selection--${type}" role="group" aria-label="${name}" data-selection>${items.map(([label, glyph], i) => button(label, {size:'sm', variant:'ghost', before:icon[glyph] || '', attrs:`aria-pressed="${i === 0}" data-select`})).join('')}</div>`;
const dropdown = (id, label, options, cls = '', before = '') => `<div class="ds-button-dropdown">${button(label, {size:'sm',before,after:icon.down,cls,attrs:`aria-haspopup="menu" aria-expanded="false" aria-controls="${id}" data-menu-trigger`})}<div class="ds-button-menu" id="${id}" role="menu" aria-label="${label}" hidden>${options.map(([text,glyph]) => `<button type="button" role="menuitem" tabindex="-1" data-demo="${text}">${icon[glyph] || ''}<span>${text}</span></button>`).join('')}</div></div>`;

export const buttonSections = [['variants','Variants'],['sizes','Sizes'],['states','Icons & states'],['toolbars','Toolbars & menus'],['groups','Grouped controls'],['assistant','Assistant actions'],['cards','Action cards'],['inventory','Platform inventory']];

export function createButtons() {
  const root = document.createElement('section');
  root.id = 'bird-buttons';
  root.className = 'ds-buttons';
  const variants = [
    ['primary','Primary','Default','The existing default. Blueprint for the main action.'],
    ['neutral','Neutral','New issue','The dark filled action used throughout the platform.'],
    ['secondary','Secondary','Secondary','A soft surface for a supporting action.'],
    ['outline','Outline','Outline','Bordered actions for toolbars and secondary tasks.'],
    ['ghost','Ghost','Ghost','Quiet controls within an existing surface.'],
    ['destructive','Destructive','Delete','A red tint for destructive actions.'],
    ['link','Link','See all','Inline navigation and low emphasis actions.']
  ];
  root.innerHTML = `<div id="buttons-variants">
    ${heading('Variants', 'One base. Seven treatments.')}
    <p class="ds-button-intro">The six original variants, plus the neutral filled action found in Bird. Sizes, icon placement, and states are shared across every treatment.</p>
    <div class="ds-button-variant-grid">${variants.map(([variant,title,label,description]) => example(title,description,button(label,{variant,attrs:`data-demo="${title} action"`}),`ds-variant-${variant}`)).join('')}</div>
  </div>
  <div id="buttons-sizes">
    ${heading('Sizes', '24 / 32 / 36 / 40 px')}
    <div class="ds-button-sizes">${[['xs','XS',24,12,4],['sm','Small',32,14,4],['default','Default',36,14,4],['lg','Large',40,14,4]].map(([size,label,height,font,radius]) => `<div class="ds-button-size"><div>${button(label,{variant:'neutral',size,attrs:`data-demo="${label} size"`})}</div><h3>${label}</h3><code>${height} px high</code><span>${font} px type · ${radius} px radius</span></div>`).join('')}</div>
    <div class="ds-button-spec"><span>Icon only</span><div>${['xs','sm','default','lg'].map(size => button('',{variant:'outline',size,cls:'ds-btn--icon',before:icon.plus,attrs:`aria-label="Add, ${size} size" data-demo="Add action"`})).join('')}</div><p>Square hit area matching the button height. Icons are 12 px at XS and 16 px at other sizes.</p></div>
  </div>
  <div id="buttons-states">
    ${heading('Icons & states', 'A consistent response to every interaction.')}
    <div class="ds-button-example-grid">
      ${example('Icon placement','16 px icons, before or after the label.',button('New issue',{variant:'primary',before:icon.plus,attrs:'data-demo="New issue"'})+button('Continue',{after:icon.arrow,attrs:'data-demo="Continue"'}))}
      ${example('Icon only','Use a clear accessible name for every icon action.',button('',{cls:'ds-btn--icon',before:icon.plus,attrs:'aria-label="Add item" data-demo="Add item"'})+button('',{variant:'ghost',cls:'ds-btn--icon',before:icon.more,attrs:'aria-label="More actions" data-demo="More actions"'})+button('',{variant:'destructive',cls:'ds-btn--icon',before:icon.trash,attrs:'aria-label="Delete item" data-demo="Delete item"'}))}
      ${example('Hover & keyboard focus','Previewed here; focus rings also appear when tabbing.',button('Hover',{variant:'primary',cls:'is-hover',attrs:'data-demo="Hover preview"'})+button('Focus',{cls:'is-focus',attrs:'data-demo="Keyboard focus preview"'}))}
      ${example('Pressed / selected','Toggle a persistent state with aria-pressed.',button('Following',{before:icon.check,attrs:'aria-pressed="true" data-toggle-label data-on="Following" data-off="Follow"'}))}
      ${example('Loading','Keep the label and width while work is in progress.',button('Saving…',{variant:'neutral',before:'<span class="ds-btn-spinner" aria-hidden="true"></span>',attrs:'aria-disabled="true" aria-busy="true"'})+button('Try loading',{attrs:'data-loading-demo'}))}
      ${example('Disabled','Unavailable actions keep their shape at 50% opacity.',button('Disabled',{variant:'primary',attrs:'disabled'})+button('Disabled',{attrs:'disabled'}))}
    </div>
  </div>
  <div id="buttons-toolbars">
    ${heading('Toolbars & menus', 'Compact actions for everyday work.')}
    <div class="ds-button-surface">
      <div class="ds-demo-toolbar" aria-label="Example page toolbar">${button('Search… <kbd>⌘ K</kbd>',{size:'sm',before:icon.search,cls:'ds-search-trigger',attrs:'data-search-demo aria-haspopup="dialog"'})}<div class="ds-toolbar-tools">${button('Scan QR',{size:'sm',before:icon.qr,attrs:'data-demo="Scan QR"'})}${button('<span class="ds-notification-dot" aria-hidden="true"></span>',{variant:'ghost',size:'sm',cls:'ds-btn--icon',before:icon.bell,attrs:'aria-label="Notifications, unread items" data-demo="Notifications"'})}${button('',{variant:'ghost',size:'sm',cls:'ds-btn--icon',before:icon.spark,attrs:'aria-label="Open AI assistant" data-demo="Open AI assistant"'})}</div></div>
      <div class="ds-demo-page-actions"><span>Project issues</span><div>${dropdown('ds-views-menu','Views',[['List view','list'],['Kanban view','columns'],['Gantt view','chart']])}${dropdown('ds-more-menu','More',[['Export PDF','download'],['Import files','upload']])}${button('Create issue',{variant:'neutral',size:'sm',before:icon.plus,attrs:'data-demo="Create issue"'})}</div></div>
    </div>
    <div class="ds-button-example-grid ds-button-tool-examples">
      ${example('Import & export','Outline actions support the filled creation button.',button('Import Excel',{before:icon.upload,attrs:'data-demo="Import Excel"'})+button('Export PDF',{before:icon.download,attrs:'data-demo="Export PDF"'})+button('New item',{variant:'neutral',before:icon.plus,attrs:'data-demo="New item"'}))}
      ${example('Zoom controls','Icon actions and a select trigger in one toolbar.',button('',{cls:'ds-btn--icon',before:icon.plus,attrs:'aria-label="Zoom in" data-zoom="1"'})+dropdown('ds-period-menu','Month',[['Week',''],['Month',''],['Quarter','']])+button('',{cls:'ds-btn--icon',before:icon.minus,attrs:'aria-label="Zoom out" data-zoom="-1"'}))}
      ${example('Workspace switcher','A named trigger with a compact selection menu.',dropdown('ds-workspace-menu','Example project',[['Example project','check'],['Another project','file']],'ds-workspace-trigger',icon.panel))}
      ${example('Navigation group','Collapsible sidebar controls keep their own context.',`<div class="ds-nav-demo">${button('Economy',{variant:'ghost',size:'sm',before:icon.file,after:icon.down,attrs:'aria-expanded="false" aria-controls="ds-economy-items" data-disclosure'})}<div id="ds-economy-items" hidden><span>Budget</span><span>Invoicing</span><span>Payment schedule</span></div></div>`)}
    </div>
  </div>
  <div id="buttons-groups">
    ${heading('Grouped controls', 'Selection stays visible.')}
    <div class="ds-button-example-grid">
      ${example('Status filters','Joined outline buttons share one outer border.',segment('Issue status',[['All',''],['Active',''],['Overdue','']]))}
      ${example('View switcher','The same group supports icon and label pairs.',segment('Issue view',[['List','list'],['Kanban','columns'],['Gantt','chart']]))}
      ${example('Contained tabs','A subtle track with a raised active item.',`<div class="ds-tabs-demo" data-tabs><div class="ds-selection ds-selection--soft" role="tablist" aria-label="Payment status">${['All','Open','Paid'].map((name,i)=>`<button type="button" role="tab" id="ds-status-tab-${i}" aria-controls="ds-status-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-tab>${name}</button>`).join('')}</div><div id="ds-status-panel" role="tabpanel" aria-labelledby="ds-status-tab-0" tabindex="0">All payment milestones</div></div>`)}
      ${example('Underline tabs','Page-level navigation used in Issues and Schedule.',`<div class="ds-tabs-demo" data-tabs><div class="ds-selection ds-selection--underline" role="tablist" aria-label="Issue inbox">${['All','My inbox','Sent by me'].map((name,i)=>`<button type="button" role="tab" id="ds-inbox-tab-${i}" aria-controls="ds-inbox-panel" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-tab>${name}</button>`).join('')}</div><div id="ds-inbox-panel" role="tabpanel" aria-labelledby="ds-inbox-tab-0" tabindex="0">All project issues</div></div>`)}
    </div>
  </div>
  <div id="buttons-assistant">
    ${heading('Assistant actions', 'Pills, send controls, and playback.')}
    <div class="ds-button-example-grid">
      ${example('Prompt pills','Rounded outline shortcuts from the dashboard.',button('Create issue',{size:'sm',cls:'ds-btn--pill',before:icon.plus,attrs:'data-demo="Create issue"'})+button('Today’s overview',{size:'sm',cls:'ds-btn--pill',before:icon.spark,attrs:'data-demo="Today’s overview"'})+button('What’s overdue?',{size:'sm',cls:'ds-btn--pill',attrs:'data-demo="What’s overdue?"'}))}
      ${example('Compact suggestions','A smaller pill for the assistant side panel.',button('Give me a status overview',{cls:'ds-btn--suggestion ds-btn--pill',attrs:'data-demo="Status overview prompt"'})+button('Which tasks are open?',{cls:'ds-btn--suggestion ds-btn--pill',attrs:'data-demo="Open tasks prompt"'}))}
      ${example('Send & floating action','Square, circular, and 48 px floating controls.',button('',{variant:'neutral',cls:'ds-btn--icon',before:icon.arrow,attrs:'aria-label="Send message" data-demo="Send message"'})+button('',{variant:'neutral',size:'sm',cls:'ds-btn--icon ds-btn--pill',before:icon.arrow,attrs:'aria-label="Send prompt" data-demo="Send prompt"'})+button('',{variant:'neutral',cls:'ds-btn--floating ds-btn--pill',before:icon.spark,attrs:'aria-label="Open floating assistant" data-demo="Open assistant"'}))}
      ${example('Audio overview','A 48 px action row with trailing metadata.',button('Listen to the overview <span class="ds-audio-duration">0:20</span>',{cls:'ds-btn--audio',before:icon.play,attrs:'aria-pressed="false" data-audio-demo'}))}
    </div>
  </div>
  <div id="buttons-cards">
    ${heading('Action cards', 'Larger surfaces can be actions too.')}
    <div class="ds-button-example-grid">
      ${example('Report card','A full card with a document action.',`<button type="button" class="ds-action-card" data-demo="Project report PDF">${icon.file}<strong>Project report PDF</strong><span>Report ${icon.arrow}</span></button>`)}
      ${example('Metric filter','A selectable summary card from Issues.',`<div class="ds-metric-group" role="group" aria-label="Issue summary" data-selection>${[['12','Active'],['3','Overdue']].map(([value,name],i)=>`<button type="button" class="ds-metric-card" aria-pressed="${i===0}" data-select><strong>${value}</strong><span>${name}</span></button>`).join('')}</div>`)}
      ${example('Guide callout','A quiet destination with a trailing arrow.',`<button type="button" class="ds-guide-action" data-demo="User guide">${icon.book}<span><strong>User guide</strong><span>Get to know Bird</span></span>${icon.arrow}</button>`)}
    </div>
  </div>
  <div id="buttons-inventory">
    ${heading('Platform inventory', 'From the signed-in Bird platform.')}
    <p class="ds-button-intro">Repeated controls are grouped into the patterns above. The original six variants, four sizes, icon placements, and disabled state remain part of this catalogue.</p>
    <div class="ds-button-inventory"><table><thead><tr><th scope="col">Area</th><th scope="col">Controls consolidated</th></tr></thead><tbody>${[
      ['Global shell','Search, QR, notifications, assistant, workspace / account menus, sidebar controls'],
      ['Dashboard','Create issue, prompt pills, circular send, audio overview, report and guide cards'],
      ['Messages & Drawings','New conversation, add drawings, assistant suggestions, send'],
      ['Issues','Create issue, More / Views, inbox tabs, status filters, view switcher, metric cards'],
      ['Schedule','New milestone, reports, tabs, Gantt / Flowline, zoom, period / view selectors'],
      ['3D model','Files trigger, floating assistant'],
      ['Extra work','New change order, report export, status tabs'],
      ['Invoicing & Payment schedule','Generate billing basis, filter selectors, new milestone, status tabs'],
      ['Supplier pricing & Price library','Save, categorize, tabs, supplier selector, Excel / PDF imports, new item'],
      ['User guide','Shared navigation and assistant actions']
    ].map(([area,controls])=>`<tr><th scope="row">${area}</th><td>${controls}</td></tr>`).join('')}</tbody></table></div>
    <p class="ds-button-footnote">Reviewed across the signed-in platform’s main pages. Budget displayed a retry state and Changelog did not load; controls behind unvisited dialogs are outside this pass. All examples here use sample data.</p>
  </div>
  <div class="ds-button-feedback" role="status" aria-live="polite"></div>
  <dialog class="ds-button-search-dialog" aria-labelledby="ds-search-title"><div><h2 id="ds-search-title">Search Bird</h2>${button('',{variant:'ghost',size:'sm',cls:'ds-btn--icon',before:icon.close,attrs:'aria-label="Close search" data-close-search'})}</div><label for="ds-button-search-input">Search example actions</label><input id="ds-button-search-input" type="search" placeholder="Search issues, drawings, reports…" autocomplete="off"><div class="ds-search-results"></div><p>Example search · Escape to close</p></dialog>`;

  const feedback = root.querySelector('.ds-button-feedback');
  let feedbackTimer;
  const announce = text => {
    feedback.textContent = text;
    feedback.classList.add('is-visible');
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => feedback.classList.remove('is-visible'), 2200);
  };
  const closeMenus = () => root.querySelectorAll('[data-menu-trigger]').forEach(trigger => {
    trigger.setAttribute('aria-expanded','false');
    root.querySelector(`#${trigger.getAttribute('aria-controls')}`).hidden = true;
  });
  const searchDialog = root.querySelector('dialog');
  const searchInput = root.querySelector('input');
  const searchResults = root.querySelector('.ds-search-results');
  const searchActions = ['Create issue', 'Add drawings', 'Project report PDF', 'New milestone', 'User guide'];
  const updateSearch = () => {
    const matches = searchActions.filter(label => label.toLowerCase().includes(searchInput.value.toLowerCase()));
    searchResults.replaceChildren(...matches.map(label => {
      const result = document.createElement('button');
      result.type = 'button'; result.textContent = label;
      result.addEventListener('click', () => { searchDialog.close(); announce(`${label} · preview`); });
      return result;
    }));
    if (!matches.length) searchResults.textContent = 'No matching actions.';
  };
  searchInput.addEventListener('input', updateSearch);
  let zoom = 100;
  root.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target || target.disabled || target.getAttribute('aria-disabled') === 'true') return;
    if (target.hasAttribute('data-menu-trigger')) {
      const open = target.getAttribute('aria-expanded') !== 'true';
      closeMenus();
      target.setAttribute('aria-expanded',String(open));
      const menu = root.querySelector(`#${target.getAttribute('aria-controls')}`);
      menu.hidden = !open;
      if (open) menu.querySelector('button').focus();
    } else if (target.hasAttribute('data-select')) {
      target.closest('[data-selection]').querySelectorAll('[data-select]').forEach(item => item.setAttribute('aria-pressed',String(item === target)));
    } else if (target.hasAttribute('data-tab')) {
      const tabs = target.closest('[data-tabs]');
      tabs.querySelectorAll('[data-tab]').forEach(tab => { tab.setAttribute('aria-selected',String(tab===target)); tab.tabIndex=tab===target?0:-1; });
      const panel = tabs.querySelector('[role="tabpanel"]');
      panel.setAttribute('aria-labelledby',target.id);
      panel.textContent = `${target.textContent} ${tabs.querySelector('[role="tablist"]').getAttribute('aria-label') === 'Payment status' ? 'payment milestones' : 'project issues'}`;
    } else if (target.hasAttribute('data-disclosure')) {
      const open = target.getAttribute('aria-expanded') !== 'true';
      target.setAttribute('aria-expanded',String(open));
      root.querySelector(`#${target.getAttribute('aria-controls')}`).hidden=!open;
    } else if (target.hasAttribute('data-toggle-label')) {
      const selected = target.getAttribute('aria-pressed') !== 'true';
      target.setAttribute('aria-pressed',String(selected));
      target.innerHTML = `${selected?icon.check:icon.plus}${target.dataset[selected?'on':'off']}`;
    } else if (target.hasAttribute('data-loading-demo')) {
      const width = target.getBoundingClientRect().width;
      target.style.minWidth=`${width}px`; target.disabled=true; target.setAttribute('aria-busy','true');
      target.innerHTML='<span class="ds-btn-spinner" aria-hidden="true"></span>Saving…';
      setTimeout(() => { target.disabled=false; target.removeAttribute('aria-busy'); target.innerHTML='Try loading'; announce('Saved · preview'); },1600);
    } else if (target.hasAttribute('data-audio-demo')) {
      const playing = target.getAttribute('aria-pressed') !== 'true';
      target.setAttribute('aria-pressed',String(playing));
      target.innerHTML=`${playing?icon.stop:icon.play}${playing?'Stop overview':'Listen to the overview'} <span class="ds-audio-duration">0:20</span>`;
      announce(playing?'Playback control preview':'Playback stopped');
    } else if (target.hasAttribute('data-search-demo')) {
      searchInput.value=''; updateSearch(); searchDialog.showModal(); searchInput.focus();
    } else if (target.hasAttribute('data-close-search')) searchDialog.close();
    else if (target.hasAttribute('data-zoom')) { zoom=Math.max(25,Math.min(200,zoom+Number(target.dataset.zoom)*25)); announce(`Zoom ${zoom}% · preview`); }
    else if (target.dataset.demo) {
      const menu=target.closest('[role="menu"]');
      if(menu) {
        const trigger=root.querySelector(`[aria-controls="${menu.id}"]`);
        if(menu.id!=='ds-more-menu') trigger.innerHTML=`${menu.id==='ds-workspace-menu'?icon.panel:''}${target.textContent.trim()}${icon.down}`;
        closeMenus(); trigger.focus();
      }
      announce(`${target.dataset.demo} · preview`);
    }
  });
  document.addEventListener('click', event => { if(!event.target.closest('.ds-button-dropdown')) closeMenus(); });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && searchDialog.open) { event.preventDefault(); event.stopPropagation(); searchDialog.close(); return; }
    const menu = event.target.closest('[role="menu"]');
    if(menu) {
      const items=[...menu.querySelectorAll('button')]; const index=items.indexOf(document.activeElement);
      if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)) { event.preventDefault(); items[event.key==='Home'?0:event.key==='End'?items.length-1:(index+(event.key==='ArrowDown'?1:-1)+items.length)%items.length].focus(); }
      if(event.key==='Escape') { event.preventDefault(); closeMenus(); root.querySelector(`[aria-controls="${menu.id}"]`).focus(); }
      if(event.key==='Tab') closeMenus();
    }
    const tab=event.target.closest('[data-tab]');
    if(tab && ['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) {
      event.preventDefault(); const items=[...tab.parentElement.querySelectorAll('[data-tab]')]; const index=items.indexOf(tab);
      const next=items[event.key==='Home'?0:event.key==='End'?items.length-1:(index+(event.key==='ArrowRight'?1:-1)+items.length)%items.length]; next.focus();next.click();
    }
    const trigger=event.target.closest('[data-menu-trigger]');
    if(trigger && event.key==='ArrowDown') {event.preventDefault(); if(trigger.getAttribute('aria-expanded')!=='true')trigger.click();else root.querySelector(`#${trigger.getAttribute('aria-controls')}`).querySelector('button').focus();}
  });
  return root;
}
