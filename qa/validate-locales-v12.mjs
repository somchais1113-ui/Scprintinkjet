import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const window={};
const storage=new Map();
const ctx={window,URLSearchParams,location:{search:''},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},console};
for(const file of ['data/site-data.js','data/extra-locales.js','src/scripts/i18n.js'])vm.runInNewContext(read(file),ctx,{filename:file});
const i18n=window.PROCLEANING_I18N;
const expected=['ar','my','zh','ru','nl','es','en','th','fr','vi','de','it','ja','ko'];
assert.deepEqual([...i18n.supported],expected);
for(const code of expected){
 const s=i18n.resolve(window.PROCLEANING_SITE,code);
 assert(s.navigation.home&&s.hero.title&&s.hero.description&&s.labels.readMore&&s.commerce.topBenefit&&s.commerce.processSteps.length===4,`missing public content ${code}`);
 assert.equal(s.services.length,3,`services count ${code}`);assert.equal(s.pricing.length,3,`pricing count ${code}`);
 if(code!=='th'&&code!=='en'){
  assert.notEqual(s.hero.title,window.PROCLEANING_SITE.hero.title,`untranslated hero ${code}`);
  assert.notEqual(s.services[0].title,window.PROCLEANING_SITE.services[0].title,`untranslated service ${code}`);
  assert(window.SCWORK_EXTRA_LOCALES[code].calculator.title&&window.SCWORK_EXTRA_LOCALES[code].rfq.title,`missing essential form packs ${code}`);
 }
 i18n.persist(code);
 assert.equal(i18n.initial(window.PROCLEANING_SITE),code,`persistence ${code}`);
}
assert.equal(window.PROCLEANING_SITE.hero.title,'Stickers That Make Your Brand Stand Out.','base mutated unexpectedly');
const home=read('index.html');assert.match(home,/data-language-launcher/);assert.match(home,/extra-locales\.js/);assert.match(home,/language-modal\.js/);
for(const file of ['article.html','request-quote.html','pricing-calculator.html']){
 const page=read(file);assert.match(page,/data-language-launcher/);assert.match(page,/language-modal\.js/);assert.match(page,/extra-locales\.js/);
}
const menu=read('src/scripts/language-modal.js');for(const code of expected)assert(menu.includes(`'${code}'`),`missing flag entry ${code}`);
console.log('V1.2 multilingual QA PASS: 14 locales, public content, estimator/RFQ packs, persist, asset entry points');
