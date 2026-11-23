/* SCWork 2.1.18 targeted quotation layout, translations and safe-state regression. */
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const html=read('smart-quote.html');
const css=read('src/styles/33-quotation-ux-refinement.css');
const js=read('src/scripts/smart-quote.js');
const builder=read('qa/build-public-v2111.mjs');
assert.match(html,/33-quotation-ux-refinement\.css\?v=2\.1\.18/);
assert.match(html,/smart-quote\.js\?v=2\.1\.18/);
assert.match(html,/class="q-card q-card--mode"/);
assert.match(html,/class="q-card q-card--artwork"/);
assert.match(html,/class="q-art-options" aria-labelledby="artTitle"/);
for(const id of ['quickTitle','quickDesc','guidedTitle','guidedDesc','helpTitle','helpDesc','artNone','artNoneDesc','artLine','artLineDesc','artLink','artLinkDesc']){
  assert.match(html,new RegExp('id="'+id+'"'),id+' missing from markup');
  assert.match(js,new RegExp('\\b'+id+':'),id+' missing from i18n');
  assert(js.includes("'"+id+"'"),id+' missing from render labels');
}
for(const mode of ['quick','guided','help'])assert.match(html,new RegExp('data-mode="'+mode+'"'));
for(const state of ['none','line','link'])assert.match(html,new RegExp('name="artwork" value="'+state+'"'));
assert.match(js,/all\('input\[name="artwork"\]'\)\.forEach/,'native artwork selection still wired');
assert.match(js,/hide\('artLinkPanel',art\(\)!=='link'\)/,'artwork link conditional still wired');
assert.match(js,/function calculate\(\)/,'calculator still present');
assert.match(js,/renderOptions\(\);calculate\(\)/,'calculator render still present');
for(const snippet of ['.q-card--mode .q-mode__copy','.q-card--mode .q-mode strong','.q-card--artwork .q-art-option__copy','.q-card--artwork .q-art-options input[type="radio"]','@media (max-width: 650px)','background: #FFF8F3','border-color: #FF6900'])assert(css.includes(snippet),snippet);
assert(css.includes('grid-template-columns: repeat(3,minmax(0,1fr))'));
assert(css.includes('flex-direction: column;'),'title-description vertically arranged');
assert(builder.includes("'33-quotation-ux-refinement'"));
assert(builder.includes("'START_HERE_V2.1.18.md'"));
assert(existsSync(new URL('START_HERE_V2.1.18.md',root)));
console.log('PASS V2.1.18 quote entry and artwork UI: markup, TH/EN dictionary, pricing event hooks, responsive CSS and public bundle.');
