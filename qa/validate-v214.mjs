import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
import './validate-v213.mjs';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const css=read('src/styles/19-social-proof-footer.css'),ctaCss=read('src/styles/25-quote-cta-type.css');
assert.match(css,/#how-it-works \{[^}]*--pantone-1505-c: #FF6900;[^}]*isolation: isolate;/);
assert.match(css,/#how-it-works::before \{[^}]*detail\.webp[^}]*opacity: \.15;[^}]*pointer-events: none;/);
assert.match(ctaCss,/clamp\(18px,1\.65vw,23px\)/);
assert.match(ctaCss,/clamp\(17px,1\.4vw,19px\)/);
assert.match(read('product-labels.html'),/25-quote-cta-type\.css\?v=2\.1\.4/);
assert.match(read('article.html'),/class="[^"]*sc-quote-cta" id="articleQuote"/);
assert.match(read('src/scripts/product-labels.js'),/classList.toggle\('sc-quote-cta',priceReady\)/);
assert(existsSync(new URL('../assets/images/client-logos/actual/',import.meta.url)));
for(let i=1;i<=6;i++){
  const file=read('assets/images/client-logos/mockups/logo-mockup-0'+i+'.svg');
  assert.match(file,new RegExp('SAMPLE 0'+i));
}
function link(href,id='',help=false){
  const classes=new Set();
  return {href,id,classes,textContent:'',classList:{toggle(k,v){if(v)classes.add(k);else classes.delete(k)}},
    hasAttribute:k=>k==='data-quote-help'&&help,getAttribute(){return this.href},setAttribute(k,v){this[k]=v}};
}
const links=[link('./smart-quote.html'),link('./smart-quote.html?category=label'),link('./smart-quote.html?mode=help'),link('./smart-quote.html','',true),link('./smart-quote.html?mode=help','footerContactCard')];
const document={documentElement:{lang:'th'},getElementById(){return null},querySelectorAll(){return links},addEventListener(){}};
vm.runInNewContext(read('src/scripts/entry-cta.js'),{document,window:{addEventListener(){}},location:{href:'https://example.test/index.html'},URL});
assert.deepEqual(links.map(a=>a.classes.has('sc-quote-cta')),[true,true,false,false,false]);
assert.equal(links[0].textContent,'เช็กราคาเบื้องต้น');
assert.equal(links[1].href,'./smart-quote.html?category=label&lang=th');
assert.equal(links[2].textContent,'ให้ทีมช่วยแนะนำ');
console.log('PASS V2.1.4: process overlay and orange, 6 SVG mockups, dedicated estimate CTA styles and routes.');
