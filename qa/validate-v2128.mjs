import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const read=(f)=>readFileSync(join(root,f),'utf8');
const home=read('index.html'),port=read('portfolio.html'),quote=read('src/scripts/smart-quote.js'),catalog=read('data/quote-catalog.js');
assert.equal([...port.matchAll(/data-portfolio-slide="[0-3]"/g)].length,4,'Portfolio banner must have exactly 4 single-photo slides');
assert.equal([...port.matchAll(/data-cinema-dot="[0-3]"/g)].length,4,'Slider dot count');
assert(port.includes('portfolio-cinema-v2128.js')&&port.includes('39-portfolio-cinema-v2128.css'));
assert(read('src/scripts/portfolio-cinema-v2128.js').includes('7400')&&read('src/styles/39-portfolio-cinema-v2128.css').includes('880ms'));
for(let i=1;i<=4;i++)assert(existsSync(join(root,`assets/images/portfolio/hero/portfolio-hero-0${i}.webp`)));
assert.equal([...home.matchAll(/<a data-quote-label-preserve data-price-mat-th=/g)].length,6,'6 material CTA links');
assert.equal([...home.matchAll(/<article class="sc-material__card" data-material=/g)].length,6,'6 material reference cards');
assert(!home.includes('id="scMaterialsNote"')&&!home.includes('id="scPortfolioNotice"'));
assert.equal([...catalog.matchAll(/\{id:/g)].length,6,'Six quote material options');
assert(catalog.includes("id:'vinyl-banner'")&&catalog.includes("id:'pvc-sqm'"));
assert(!catalog.includes("id:'pp-silver'"));
assert(quote.includes("st.materialId!=='vinyl-banner'"),'No automatic unapproved vinyl price');
assert(quote.includes("params.get('material')"),'Material deep links preselect option');
for(const f of ['index.html','smart-quote.html','standard-pricing.html','pricing-calculator.html','src/scripts/smart-quote.js','src/scripts/entry-cta.js','src/scripts/pricing-calculator.js','src/scripts/product-labels.js']){
  assert(!/ราคาเบื้องต้น|เช็กราคาเบื้องต้น|ดูราคาเบื้องต้น/.test(read(f)),f+' still has preliminary quote label');
}
const fin=read('src/styles/40-scwork-refinement-v2128.css');
assert(fin.includes('.footer--editorial .footer-grid ul{gap:11px}')&&fin.includes('font-weight:400'));
assert(read('src/scripts/20-home-enhancements.js').includes("pause.textContent=''"));
assert(!read('data/pricing-public-data.js').includes('vinyl-banner'),'No unapproved public rate');
console.log('SCWork V2.1.28 QA PASS: 4-slide Portfolio, six matching material links, no unapproved vinyl price, text, layout and release assets.');
