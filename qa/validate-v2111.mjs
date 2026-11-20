import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import './validate-v2110.mjs';

const root = new URL('../', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const topics = {
  price: ['standard-pricing.html','ราคามาตรฐาน','Standard pricing'],
  design: ['design-services.html','บริการออกแบบ','Design services'],
  shipping: ['delivery.html','จัดส่งรวดเร็วและตรงเวลา','Fast, on-time delivery'],
  credit: ['credit-terms.html','มีการชำระแบบเครดิตเทอม','Credit terms available'],
};
const home = read('index.html');
const linked = [...home.matchAll(/<a class="sc-benefits__badge sc-benefits__badge--([a-z]+)" href="(\.\/[a-z-]+\.html\?lang=en)" data-scb-page>/g)];
assert.equal(linked.length,4);
assert.equal(new Set(linked.map(m=>m[2])).size,4);
const support = read('qa/build-public-v2111.mjs');
const markup = Object.fromEntries(Object.values(topics).map(([file,th,en]) => {
  const page = read(file);
  assert(page.includes('<html lang="th">'));
  assert(page.includes(`<title data-en="${en} | SCWork">${th} | SCWork</title>`));
  assert.equal([...page.matchAll(/<h1\b/g)].length,1);
  assert.equal([...page.matchAll(/<span class="benefit-step-num"/g)].length,3);
  assert.match(page,/<a class="benefit-cta" href="\.\/smart-quote\.html\?/);
  assert(page.includes('./index.html?lang=th#scBenefits'));
  assert(page.includes('src/styles/30-benefit-pages.css'));
  assert(page.includes('src/scripts/benefit-pages.js'));
  assert(support.includes(`'${file}'`));
  assert.doesNotMatch(page,/target="_blank"|\b(?:48 ชั่วโมง|จัดส่งฟรี)\b/);
  for (const m of page.matchAll(/(?:href|src)="(\.\/[^"]*)"/g)) {
    const parsed = new URL(m[1].replaceAll('&amp;', '&'), root);
    assert(existsSync(fileURLToPath(parsed)), m[1]);
    if (parsed.hash) assert(read(parsed.pathname.slice(root.pathname.length)).includes(`id="${parsed.hash.slice(1)}"`), m[1]);
  }
  return [file,page];
}));

const el = (dataset={},attrs={}) => ({
  dataset, attrs, textContent:'', events:{}, hidden:false,
  classList:{toggle(){}},
  setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];},
  addEventListener(k,v){this.events[k]=v;},removeAttribute(k){delete this.attrs[k];}
});
const ids = ['scBenefits','scBenefitList','scBenefitRating','scBenefitPrev','scBenefitNext','scBenefitMessage','scBenefitNotice','scBenefitControls','scBenefitToggle','scBenefitPosition','scBenefitEyebrow','scBenefitSize0','scBenefitSize1','scBenefitSize2'];
const nodes = Object.fromEntries(ids.map(id=>[id,el()]));
const cards = linked.map(([,key,href])=>{
  assert.equal(href,'./'+topics[key][0]+'?lang=en');
  const anchor=el({},{href});
  return { ...el({scbLabel:key}), closest:s=>s==='a[data-scb-page]'?anchor:null };
});
nodes.scBenefits.querySelectorAll=()=>cards;
const document={documentElement:{lang:'en'},addEventListener(){},getElementById:id=>nodes[id]};
const window=el();
vm.runInNewContext(read('src/scripts/benefit-strip.js'),{document,window});
for(const lang of ['en','th','ja','th']){
  document.documentElement.lang=lang;
  window.events['scwork:locale-applied']();
  for(const card of cards){
    const [path,th,en]=topics[card.dataset.scbLabel];
    assert.equal(card.textContent,lang==='th'?th:en);
    assert.equal(card.closest('a[data-scb-page]').attrs.href,'./'+path+'?lang='+(lang==='th'?'th':'en'));
  }
}

for(const [file,page] of Object.entries(markup)){
  const txt=el({en:page.match(/<h1 data-en="([^"]+)"/)[1]});
  const meta=el({enContent:page.match(/data-en-content="([^"]+)"/)[1]});
  const crumb=el({enLabel:'Breadcrumb'});
  const th=el({},{'aria-current':'page'}),en=el();
  const anchors=[...page.matchAll(/href="(\.\/[^"]+)" data-benefit-local/g)].map(m=>el({},{href:m[1].replaceAll('&amp;','&')}));
  assert(anchors.length>=8);
  const detailDoc={
    documentElement:{lang:'th'},
    querySelector:s=>s.includes('hreflang="th"')?th:en,
    querySelectorAll:s=>({'[data-en]':[txt],'[data-en-content]':[meta],'[data-en-label]':[crumb],'[data-benefit-local]':anchors})[s]
  };
  const localize=search=>vm.runInNewContext(read('src/scripts/benefit-pages.js'),{document:detailDoc,location:{search},URLSearchParams});
  localize('?lang=th');
  assert.equal(detailDoc.documentElement.lang,'th');
  localize('?lang=en');
  assert.equal(detailDoc.documentElement.lang,'en');
  assert.equal(txt.textContent,txt.dataset.en,file);
  assert.equal(meta.attrs.content,meta.dataset.enContent,file);
  assert.equal(crumb.attrs['aria-label'],'Breadcrumb',file);
  assert.equal(th.attrs['aria-current'],undefined,file);
  assert.equal(en.attrs['aria-current'],'page',file);
  for(const a of anchors) assert.equal(new URL(a.attrs.href,root).searchParams.get('lang'),'en',a.attrs.href);
  assert(anchors.some(a=>a.attrs.href.endsWith('?lang=en#scBenefits')));
}
console.log('PASS V2.1.11: four independent routes, TH/EN switch, valid assets, CTAs, cross-links and return anchors.');
