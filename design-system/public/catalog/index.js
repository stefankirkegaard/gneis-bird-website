import {recipe} from './recipes.js';
import {foundation} from './foundations.js';
import {wire,closeOverlays,openFinder} from './runtime.js';
const guidance={
 'Inputs':[['Use','Choose the simplest field that fits the task. Keep the label visible and explain what the value changes.'],['States','Show a useful disabled reason, retain entered values on error, and connect the error to its field.'],['Keyboard','Native inputs retain Tab, Space, and arrow-key behavior. Searchable lists also support Enter and Escape.']],
 'Navigation':[['Use','Keep the current location or selection visible. Group choices that belong to the same task.'],['States','Provide a clear selected state and a useful empty result. Let the user reset a filter or close a menu.'],['Keyboard','Use Tab to reach the control. Menus and tabs support arrow keys; Enter selects and Escape dismisses.']],
 'Overlays':[['Use','Open a focused view for one task. Name the object being edited and make the primary action specific.'],['States','Keep the content in view while work is pending. Explain errors inside the same view.'],['Keyboard','Opening moves focus inside. Escape closes; closing returns focus to the trigger. The page behind stays still.']],
 'Feedback':[['Use','Explain what changed and whether the user needs to do anything. Place feedback near the relevant task.'],['States','Pair color with text or an icon. Announce completion and errors without unexpectedly moving focus.'],['Keyboard','Keep every retry, dismiss, and undo action reachable. Animation respects reduced-motion preferences.']],
 'Actions':[['Use','Name the action directly and distinguish the main action from supporting options.'],['States','Expose pending, disabled, selected, and completion states where they apply. Prevent repeated submissions.'],['Keyboard','Use Enter or Space to activate a button. Visible focus remains separate from hover and selection.']],
 'Data display':[['Use','Keep related information together and make the most important value easy to scan.'],['States','Show meaningful labels and useful fallbacks. Make long content readable on a small viewport.'],['Keyboard','Supplementary detail is available on focus as well as hover. Any action has an explicit accessible name.']],
 'Layout':[['Use','Align related content and let spacing show how groups belong together.'],['States','Collapse columns for narrow screens. Keep horizontal scrolling inside its own region.'],['Keyboard','Scrollable regions and their controls are reachable without a pointer. Decorative dividers do not enter the tab order.']]
};
export async function createCatalog(main,services){
 const manifest=await fetch(new URL('./catalog.json',import.meta.url)).then(r=>{if(!r.ok)throw new Error('Catalogue unavailable');return r.json();});
 await new Promise((resolve,reject)=>{const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('./catalog.css',import.meta.url);link.onload=resolve;link.onerror=reject;document.head.append(link);});
 const definitions=[...manifest.foundations,...manifest.components.filter(x=>!x.existing)];
 const sections=definitions.map(meta=>{const section=document.createElement('section');section.id=meta.id;section.className='catalog-page';section.hidden=true;main.append(section);return section;});
 return {definitions,sections,manifest,
 activate(slug){closeOverlays();sections.forEach(s=>s.querySelectorAll('video').forEach(v=>v.pause()));const index=definitions.findIndex(p=>p.slug===slug);if(index<0)return;const meta=definitions[index],root=sections[index];if(root.dataset.rendered)return;
  if(meta.group==='Foundations')root.innerHTML=`<div class="cat-foundation-content">${foundation(slug,manifest)}</div>`;
  else root.innerHTML=`<div id="catalog-${slug}-preview"><div class="cat-section-heading"><h2>Example</h2><p>Interactive preview · Sample data</p></div>${recipe(slug)}</div><div id="catalog-${slug}-usage"><div class="cat-section-heading"><h2>Usage & behavior</h2></div><div class="cat-guide-grid">${(guidance[meta.category]||guidance['Data display']).map(([title,copy])=>`<article><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div><p class="cat-reference">Reference: <a href="${meta.source}" target="_blank" rel="noopener">Geist ${meta.title}</a>. Bird examples use our palette, Geist type, and whole-pixel radii.</p></div>`;
  wire(root,services);root.dataset.rendered='true';
 },
 toc(slug){const meta=definitions.find(x=>x.slug===slug);return meta&&meta.group!=='Foundations'?`<p>On this page</p><a href="#catalog-${slug}-preview">Example</a><a href="#catalog-${slug}-usage">Usage & behavior</a>`:'';},
 search(pages,navigate){return openFinder(pages,navigate);}
 };
}
