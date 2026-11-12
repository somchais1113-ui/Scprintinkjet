import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { URLSearchParams } from 'node:url';
const root=process.cwd(),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const store=new Map();const ctx={window:{},URLSearchParams,location:{search:''},localStorage:{getItem:(k)=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)}};
vm.runInNewContext(read('data/site-data.js'),ctx);
vm.runInNewContext(read('src/scripts/i18n.js'),ctx);
const origin=ctx.window.PROCLEANING_SITE,api=ctx.window.PROCLEANING_I18N;
if(origin.schemaVersion!==2)throw Error('Expected bilingual schema v2');
if(!['en','th'].includes(origin.i18n.defaultLanguage))throw Error('Invalid default language');
for(const section of ['brand','navigation','hero','headings','labels','footer','contact'])if(!origin.i18n.th[section])throw Error('Missing Thai group '+section);
for(const section of ['services','pricing','team','testimonials','blogs']){
 if(!origin[section].length)throw Error('Missing items '+section);
 for(const item of origin[section])if(!item.translations?.th)throw Error('Missing Thai item in '+section);
}
const en=api.resolve(origin,'en'),th=api.resolve(origin,'th');
if(!en.hero.title.startsWith('Specialized'))throw Error('English master changed');
if(!th.hero.title.includes('บริการทำความสะอาด'))throw Error('Thai hero absent');
if(!th.services[0].title.includes('สำนักงาน'))throw Error('Thai service absent');
if(!th.pricing[0].name.includes('แพ็กเกจ'))throw Error('Thai pricing absent');
if(th.pricing[0].monthly!==en.pricing[0].monthly)throw Error('Pricing not shared');
if(origin.hero.title!==en.hero.title)throw Error('Original mutated during resolve');
if(api.resolve(origin,'xx').hero.title!==en.hero.title)throw Error('Locale fallback failed');
if(api.initial(origin)!=='en')throw Error('Default language lookup failed');
api.persist('th');if(api.initial(origin)!=='th')throw Error('Remembered language lookup failed');
ctx.location.search='?lang=en';if(api.initial(origin)!=='en')throw Error('Explicit URL language not prioritized');
ctx.location.search='?lang=xx';if(api.initial(origin)!=='th')throw Error('Invalid URL override should not win');
const missed=['i18n.js','07-language.css'].map(f=>f==='i18n.js'?'src/scripts/i18n.js':'src/styles/07-language.css');
for(const file of missed)if(!read('index.html').includes(file))throw Error('Unlinked '+file);
for(const file of ['tools/site-manager.html','tools/site-manager.js','src/scripts/main.js','src/scripts/ui.js','src/scripts/site-runtime.js']){
 if(!fs.existsSync(file))throw Error('Missing '+file);
}
if(!read('tools/site-manager.html').includes('data-edit-lang'))throw Error('Missing editor language selector');
console.log('V2.2 PASS: schema, translations, shared amounts, resolver, toggles and files');
