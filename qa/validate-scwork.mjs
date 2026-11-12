import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
const root=resolve(dirname(new URL(import.meta.url).pathname),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const ctx={window:{}};
vm.runInNewContext(read('data/site-data.js'),ctx);
const site=ctx.window.PROCLEANING_SITE;
const assert=(condition,msg)=>{if(!condition)throw Error(msg);};
assert(site.brand.prefix==='SC'&&site.brand.name==='Work','Wrong brand');
assert(site.settings.priceMode==='quote','Subscription pricing still enabled');
assert(site.i18n.th.hero.title.includes('สติกเกอร์'),'Thai hero missing');
assert(site.hero.title.includes('Stickers'),'English hero missing');
for(const group of ['services','team','pricing','testimonials','blogs']){
 assert(site[group].length>=3,group+' incomplete');
 for(const item of site[group]){
  assert(item.translations?.th,'Missing TH translation in '+group);
  if(item.image)assert(existsSync(resolve(root,item.image)),'Missing image '+item.image);
 }
}
const html=read('index.html');
assert(html.includes('heroDots')&&html.includes('blogMoreButton'),'Hero/blog UI missing');
assert(!/Office Cleaning|Spring Cleaning|House Cleaning/i.test(html),'Cleaning content visible');
for(const f of ['hero-scene.webp','slide-02-labels.webp','slide-03-cut.webp','slide-04-branding.webp'])assert(existsSync(resolve(root,'assets/images/hero',f)),'Hero image missing '+f);
assert(read('src/scripts/ui.js').includes('price-card--sticker'),'Quote pricing renderer missing');
console.log('SCWork QA PASS: content TH/EN, images, new pricing, services, hero, blog and prior module files');
