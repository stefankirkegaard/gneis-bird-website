/* Badge names and workflow states collected from Bird's published UI bundles. */
const svg = path => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const icons = {
  check: svg('<path d="m5 12 4 4L19 6"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  file: svg('<path d="M14 2H5v20h14V7Zm0 0v5h5M8 12h8m-8 4h6"/>'),
  cross: svg('<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>'),
  spark: svg('<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>'),
  lock: svg('<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'),
  arrow: svg('<path d="M5 12h14m-5-5 5 5-5 5"/>'),
  wifi: svg('<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-10 4a5 5 0 0 1 6 0M12 20h.01M3 3l18 18"/>')
};
const badge = (label, tone = 'neutral', {icon = '', dot = false, style = 'soft', compact = false, attrs = ''} = {}) => `<span class="ds-badge ds-badge--${style}${compact ? ' ds-badge--compact' : ''}" data-tone="${tone}" data-slot="badge" ${attrs}>${dot ? '<span class="ds-badge-dot" aria-hidden="true"></span>' : icons[icon] || ''}${label}</span>`;
const heading = (title, note) => `<div class="ds-group-heading"><h2>${title}</h2><p>${note}</p></div>`;
const rows = entries => `<div class="ds-badge-rows">${entries.map(([label,tone,meaning,options={}])=>`<div class="ds-badge-row"><div><h3>${label}</h3><p>${meaning}</p></div>${badge(label,tone,options)}</div>`).join('')}</div>`;
export const badgeSections = [['variants','Variants'],['priority','Priority'],['status','Issue status'],['types','Issue types'],['workflows','Commercial workflows'],['utility','Utility badges'],['context','In context'],['colors','Color mapping']];

export function createBadges() {
  const root=document.createElement('section');
  root.id='bird-badges';
  root.className='ds-badges';
  const priority = [
    ['Low','neutral','Routine work','low'],['Medium','blue','Needs attention','medium'],['High','amber','Time sensitive','high'],['Critical','red','Immediate action','critical']
  ];
  const status = [
    ['Open','blue','Ready to be picked up',{dot:true,attrs:'data-status="open"'}],
    ['In progress','amber','Work is underway',{dot:true,attrs:'data-status="in_progress"'}],
    ['In review','violet','Awaiting a review',{dot:true,attrs:'data-status="in_review"'}],
    ['Resolved','green','A solution has been provided',{dot:true,attrs:'data-status="resolved"'}],
    ['Closed','neutral','No further action required',{dot:true,attrs:'data-status="closed"'}],
    ['Completed','green','The work is finished',{dot:true,attrs:'data-status="completed"'}],
    ['Blocked','red','Progress is prevented',{dot:true,attrs:'data-status="blocked"'}],
    ['Rejected','red','The proposed work was declined',{dot:true,attrs:'data-status="rejected"'}]
  ];
  const types = [
    ['Task','blue','task','Skyline / Sea Blue'],['Drawing change','violet','drawing_change','Lavender Mist / Royal Violet'],['Clarification','orange','clarification','Alabaster / Terracotta'],
    ['Risk','red','risk','Dusty Rose / Brick Red'],['Delay impact','sand','delay_impact','Yellow Sand / Umber'],['Decision','amber','decision','Ivory / Espresso'],
    ['Quality issue','indigo','quality_issue','Periwinkle / Deep Indigo'],['Observation','green','observation','Mint Foam / Foundation'],['Safety','rose','safety','Blush Pink / Brick Red']
  ];
  const workflows = [
    ['Change orders','Extra work',[
      ['Draft','neutral',{style:'outline'}],['Sent','amber',{style:'outline'}],['Approved','green',{}],['Approved, not scheduled','green',{style:'outline'}],['Scheduled','green',{}],['Rejected','red',{}]
    ]],
    ['Billing records','Invoicing',[
      ['Draft','neutral',{icon:'file'}],['Pending','amber',{icon:'clock'}],['Approved','green',{icon:'check'}],['Rejected','red',{icon:'cross'}],['Invoiced','blue',{icon:'file'}]
    ]],
    ['Payment milestones','Payment schedule',[
      ['Due soon','neutral',{}],['Overdue','red',{}],['Pending','neutral',{style:'outline'}],['Invoiced','blue',{}],['Paid','green',{}]
    ]],
    ['Approval & locking','Shared record metadata',[
      ['Awaiting approval','amber',{style:'outline'}],['Approved','green',{style:'outline'}],['Rejected','red',{style:'outline'}],['Period closed','neutral',{style:'outline',icon:'lock'}],['Retention release','neutral',{style:'outline'}]
    ]]
  ];
  const utility = [
    ['AI generated','The outlined AI label from change orders.',badge('AI generated','neutral',{icon:'spark',style:'outline'})],
    ['Notifications & counts','Compact counts in the global shell and board headers.',`<div class="ds-badge-count-demo"><span>Notifications</span>${badge('3','red',{compact:true,attrs:'aria-label="3 unread notifications"'})}</div><div class="ds-badge-count-demo"><span>Issues</span>${badge('12','blue',{style:'solid',compact:true})}</div>${badge('99+','neutral',{compact:true})}`],
    ['Offline queue','A pending count alongside the connection state.',`<span class="ds-badge-offline">${icons.wifi}Offline</span>${badge('2 pending','neutral')}`],
    ['Files & references','Outline labels for format, record references, and classification.',badge('PDF','neutral',{style:'outline'})+badge('CO-014','neutral',{style:'outline',attrs:'data-reference'})+badge('A1','neutral',{style:'outline'})],
    ['Template & discipline','Secondary labels for system templates and selected categories.',badge('Bird','neutral')+badge('Ventilation','neutral')+badge('Structural','neutral')],
    ['With an icon','Keep the original resolved treatment as a status badge.',badge('Resolved','green',{icon:'check'})+badge('Pending','amber',{icon:'clock'})]
  ];
  const colorFamilies = [
    ['blue','Blue','Sea Blue','Skyline'],['neutral','Neutral','Graphite','Mist'],['amber','Amber','Espresso','Ivory'],['orange','Orange','Terracotta','Alabaster'],
    ['red','Red','Brick Red','Dusty Rose'],['green','Green','Foundation','Mint Foam'],['violet','Violet','Royal Violet','Lavender Mist'],['indigo','Indigo','Deep Indigo','Periwinkle'],
    ['sand','Sand','Umber','Yellow Sand'],['rose','Rose','Brick Red','Blush Pink']
  ];
  const darkPairs = {blue:['Skyline','Foundation'],neutral:['Silver','Charcoal / Silver tint'],amber:['Ivory','Espresso'],orange:['Alabaster','Umber'],red:['Dusty Rose','Brick Red tint'],green:['Mint Foam','Forest Jade tint'],violet:['Lavender Mist','Royal Violet tint'],indigo:['Periwinkle','Deep Indigo tint'],sand:['Yellow Sand','Umber'],rose:['Blush Pink','Brick Red tint']};
  const variantDarkPairs = ['Skyline / Foundation','Neutral surface / Silver','Brick Red tint / Dusty Rose','Transparent / Silver','Transparent / Silver','Inline navigation'];
  root.innerHTML=`<div id="badges-variants">
    ${heading('Variants','A shared shape for every label.')}
    <p class="ds-badge-intro">Bird’s existing badges, remapped to the new palette. Standard badges are 20 px high with 12 px Medium labels; compact counts are 16 px high with 10 px labels.</p>
    <div class="ds-badge-variant-grid">${[
      ['Default',badge('Default','blue',{style:'solid'}),'Sea Blue / White'],
      ['Secondary',badge('Secondary','neutral'),'Mist / Graphite'],
      ['Destructive',badge('Destructive','red'),'Dusty Rose / Brick Red'],
      ['Outline',badge('Outline','neutral',{style:'outline'}),'Transparent / Graphite'],
      ['Ghost',badge('Ghost','neutral',{style:'ghost'}),'Transparent / Graphite'],
      ['Link',`<a class="ds-badge ds-badge--link" data-tone="blue" data-slot="badge" href="#badges-status">View status ${icons.arrow}</a>`,'Inline navigation']
    ].map(([name,preview,description],index)=>`<article class="ds-badge-variant"><div>${preview}</div><h3>${name}</h3><p data-badge-light="${description}" data-badge-dark="${variantDarkPairs[index]}">${description}</p></article>`).join('')}</div>
  </div>
  <div id="badges-priority">
    ${heading('Priority','Low → critical')}
    <div class="ds-badge-priority-grid">${priority.map(([label,tone,description,value])=>`<article class="ds-badge-priority">${badge(label,tone,{attrs:`data-priority="${value}"`})}<h3>${description}</h3><code>${value}</code></article>`).join('')}</div>
  </div>
  <div id="badges-status">
    ${heading('Issue status','The complete issue lifecycle.')}
    ${rows(status)}
  </div>
  <div id="badges-types">
    ${heading('Issue types','A distinct family for each category.')}
    <p class="ds-badge-intro">The platform’s nine issue types use the category colors defined in the new system. Category and workflow status remain separate labels.</p>
    <div class="ds-badge-type-grid">${types.map(([label,tone,key,pair])=>`<article>${badge(label,tone,{attrs:`data-issue-type="${key}"`})}<code>${key}</code><p data-badge-light="${pair}" data-badge-dark="${[...darkPairs[tone]].reverse().join(' / ')}">${pair}</p></article>`).join('')}</div>
  </div>
  <div id="badges-workflows">
    ${heading('Commercial workflows','Shared meanings across the platform.')}
    <div class="ds-badge-workflow-grid">${workflows.map(([title,context,entries])=>`<article><div class="ds-badge-workflow-heading"><h3>${title}</h3><p>${context}</p></div><div class="ds-badge-workflow-samples">${entries.map(([label,tone,options])=>badge(label,tone,options)).join('')}</div></article>`).join('')}</div>
    <p class="ds-badge-note">Approved, resolved, and paid share green. Pending work uses amber; overdue and rejected use red. Labels and icons keep the meaning explicit.</p>
  </div>
  <div id="badges-utility">
    ${heading('Utility badges','Small labels with a specific purpose.')}
    <div class="ds-badge-utility-grid">${utility.map(([title,description,preview])=>`<article><div class="ds-badge-utility-stage">${preview}</div><div><h3>${title}</h3><p>${description}</p></div></article>`).join('')}</div>
  </div>
  <div id="badges-context">
    ${heading('In context','How the labels sit together.')}
    <div class="ds-badge-context-table"><table><thead><tr><th scope="col">Issue</th><th scope="col">Type</th><th scope="col">Status</th><th scope="col">Priority</th></tr></thead><tbody>${[
      ['Confirm opening dimensions','Clarification','orange','In review','violet','Medium','blue'],
      ['Update ventilation drawing','Drawing change','violet','In progress','amber','High','amber'],
      ['Complete site inspection','Observation','green','Resolved','green','Low','neutral']
    ].map(([title,type,typeTone,state,stateTone,priority,priorityTone])=>`<tr><th scope="row">${title}</th><td>${badge(type,typeTone)}</td><td>${badge(state,stateTone,{dot:true})}</td><td>${badge(priority,priorityTone)}</td></tr>`).join('')}</tbody></table></div>
  </div>
  <div id="badges-colors">
    ${heading('Color mapping','Named Bird colors, shared badge tokens.')}
    <div class="ds-badge-color-grid">${colorFamilies.map(([tone,label,ink,fill])=>`<div class="ds-badge-color-row"><div>${badge(label,tone,{dot:tone==='green'})}</div><div><h3 data-badge-light="${ink} on ${fill}" data-badge-dark="${darkPairs[tone].join(' on ')}">${ink} on ${fill}</h3><code>--badge-${tone}-ink / --badge-${tone}-fill</code></div></div>`).join('')}</div>
    <p class="ds-badge-note">Green pairs Mint Foam with Foundation text and a Forest Jade dot. In dark mode, fills become deeper and labels use the light member of each family.</p>
    <p class="ds-badge-footnote">Collected from Bird’s badge component, issue priority and status components, change-order status, billing records, payment milestones, and global navigation. Sample data only.</p>
  </div>`;
  const syncColorNames = () => root.querySelectorAll('[data-badge-light]').forEach(element => { element.textContent = element.dataset[document.documentElement.classList.contains('dark') ? 'badgeDark' : 'badgeLight']; });
  new MutationObserver(syncColorNames).observe(document.documentElement, {attributes:true,attributeFilter:['class']});
  syncColorNames();
  return root;
}

// Reuse the same palette in the original, still-interactive React examples.
export function applyBadgeColors(container) {
  const labels = {
    low:'neutral', lav:'neutral', medium:'blue', high:'amber', 'høj':'amber', critical:'red', kritisk:'red',
    open:'blue', 'åben':'blue', 'in progress':'amber', 'i gang':'amber', 'in review':'violet', 'til review':'violet',
    resolved:'green', 'løst':'green', completed:'green', closed:'neutral', lukket:'neutral', blocked:'red', blokeret:'red', rejected:'red', afvist:'red',
    approved:'green', paid:'green', invoiced:'blue', pending:'amber', overdue:'red', draft:'neutral'
  };
  const semanticClasses = [['text-info','blue'],['text-warning','amber'],['text-success','green'],['text-destructive','red'],['text-issue-drawing-change','violet']];
  container.querySelectorAll('[data-slot="badge"]:not(.ds-badge)').forEach(element => {
    const semanticTone = semanticClasses.find(([className]) => element.classList.contains(className))?.[1];
    const labelTone = labels[element.textContent.trim().toLocaleLowerCase()];
    const variant = element.dataset.variant || 'default';
    element.dataset.birdBadgeTone = semanticTone || labelTone || (variant === 'destructive' ? 'red' : variant === 'default' ? 'blue' : 'neutral');
    element.dataset.birdBadgeStyle = semanticTone || labelTone ? 'soft' : ({default:'solid',secondary:'soft',destructive:'soft',outline:'outline',ghost:'ghost',link:'link'}[variant] || 'soft');
  });
}
