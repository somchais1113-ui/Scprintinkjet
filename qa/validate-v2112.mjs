import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const read=x=>readFileSync(new URL(x,root),'utf8');
const home=read('index.html'),quote=read('smart-quote.html'),css=read('src/styles/31-home-quote-polish.css');
assert.equal((home.match(/class="hero__slide(?: is-active)?" data-hero-slide/g)||[]).length,4,'4 hero slides stay');
assert(!home.includes('scBenefitNotice')&&!home.includes('scBenefitMessage'),'ticker must be removed entirely');
assert.equal((home.match(/data-scb-page>/g)||[]).length,4,'4 benefit links must remain');
for(const f of ['standard-pricing.html','design-services.html','delivery.html','credit-terms.html'])assert(home.includes(f));
assert.match(css,/var\(--container,1170px\)/);
assert.match(css,/\.hero__media/);
assert.match(css,/object-fit:cover/);
assert.match(css,/@media\(max-width:780px\)/);
assert(home.includes('31-home-quote-polish.css'));
for(const [type,img] of [
  ['label','quote-product-labels.webp'],
  ['diecut','quote-diecut-stickers.webp'],
  ['large','quote-large-format.webp']
]) {
 assert.match(quote,new RegExp('data-preset="'+type+'"'));
 assert(quote.includes('assets/images/quote-choices/'+img));
 assert(existsSync(fileURLToPath(new URL('assets/images/quote-choices/'+img,root))));
 const bytes=readFileSync(new URL('assets/images/quote-choices/'+img,root));
 assert(bytes.length>25000&&bytes.subarray(8,12).toString('ascii')==='WEBP','real optimized WebP: '+img);
}
assert(quote.includes('31-home-quote-polish.css'));
assert(quote.includes('src/scripts/quote-billing.js'));
assert(quote.includes('src/scripts/smart-quote.js'));
assert(quote.includes('data/pricing-public-data.js'));
assert(!/(?:office|house|spring)\.webp/.test(quote),'old illegible screenshots removed');
const el=(dataset={},attrs={})=>({dataset,textContent:'',hidden:false,attrs,handlers:{},classList:{toggle(k,value){this[k]=value}},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},addEventListener(e,h){this.handlers[e]=h}});
const ids=['scBenefits','scBenefitList','scBenefitRating','scBenefitScore','scBenefitReviewCount'];
const elements=Object.fromEntries(ids.map(x=>[x,el()]));
const keys=['price','design','shipping','credit'];
const anchors=keys.map(k=>el({}, {href:'./'+({price:'standard-pricing',design:'design-services',shipping:'delivery',credit:'credit-terms'}[k])+'.html?lang=en'}));
const labels=keys.map((k,i)=>({...el({scbLabel:k}),closest:()=>anchors[i]}));
elements.scBenefits.querySelectorAll=()=>labels;
const window=el();
const document={documentElement:{lang:'en'},getElementById:k=>elements[k]};
vm.runInNewContext(read('src/scripts/benefit-strip.js'),{window,document,Number,Intl});
assert.equal(labels[0].textContent,'Standard pricing');
document.documentElement.lang='th';window.handlers['scwork:locale-applied']();
assert.equal(labels[0].textContent,'ราคามาตรฐาน');
assert.equal(labels[1].textContent,'บริการออกแบบ');
assert(anchors.every(a=>a.attrs.href.endsWith('?lang=th')));
console.log('PASS V2.1.12: 4 equal hero slides, no service ticker, 4 multilingual benefit routes, 3 genuine optimized quote images and preserved pricing scripts.');
