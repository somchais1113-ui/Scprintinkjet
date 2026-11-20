import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import vm from 'node:vm';
import './validate-v217.mjs';
const url=f=>new URL('../'+f,import.meta.url);
const read=f=>readFileSync(url(f),'utf8');
const home=read('index.html'),css=read('src/styles/28-hero-footer.css');
const heroes=['inkjet-print','product-labels','die-cut-stickers','retail-vinyl'];
const team=['artwork-review','material-print','finishing-handover'];
assert.equal([...home.matchAll(/data-hero-dot="[0-3]"/g)].length,4);
assert.deepEqual([...home.matchAll(/<img src="\.\/assets\/images\/hero\/([^"]+)-v218\.webp"/g)].map(m=>m[1]),heroes);
assert.match(home,/28-hero-footer\.css\?v=2\.1\.8/);
assert.match(home,/footer-utility\.js\?v=2\.1\.8/);
assert.match(home,/class="sc-footer-utility"[\s\S]*?class="container footer-bottom"/);
assert.equal([...home.matchAll(/data-footer-payment="[^"]+" hidden/g)].length,3);
assert.match(home,/id="scFooterDbd" hidden/);
assert.match(css,/inset: 0 0 0 var\(--sc-hero-photo-start\);/);
assert.match(css,/section\.hero::before \{ content: none;/);
assert.match(css,/inset: auto 0 0;\s*height: 224px;/);
assert.match(css,/prefers-reduced-motion:reduce[\s\S]*?\.hero__slide:not\(\.is-active\)/);
assert.doesNotMatch(css.split('.sc-footer-utility')[0],/font-size|font-family|font-weight|\.hero__content\s*\{/);
const data={window:{}};
vm.runInNewContext(read('data/site-data.js'),data);
assert.equal(JSON.stringify(data.window.PROCLEANING_SITE.team.map(x=>x.image)),JSON.stringify(team.map(t=>'./assets/images/team/'+t+'-v218.webp')));
for(const [group,names] of [['hero',heroes],['team',team]]){
  for(const name of names){
    const file=readFileSync(url('assets/images/'+group+'/'+name+'-v218.webp'));
    assert.equal(file.subarray(8,12).toString(),'WEBP');
    assert(existsSync(url('assets/images/source/'+(group==='hero'?'hero-v218':'home-photography/v218')+'/'+name+'-v218.png')));
  }
}
const el=(dataset={})=>({dataset,hidden:true,events:new Map(),attrs:new Map(),
  addEventListener(key,fn){this.events.set(key,fn);},setAttribute(key,value){this.attrs.set(key,value);},
  getAttribute(key){return this[key]??this.attrs.get(key);},removeAttribute(key){delete this[key];this.attrs.delete(key);}});
const elements=Object.fromEntries(['scFooterShortcuts','scFooterPayments','scFooterDbd','scFooterDbdMark'].map(id=>[id,el()]));
const chips=['mastercard','visa','bank-transfer'].map(x=>el({footerPayment:x}));
const words=['estimate','steps','paymentHelp','contact','transfer'].map(x=>el({footerCopy:x}));
const base={querySelectorAll(s){return s==='[data-footer-payment]'?chips:words;}};
const window=el(),document={documentElement:{lang:'th'},querySelector:()=>base,getElementById:id=>elements[id]};
vm.runInNewContext(read('config/public-config.js'),{window});
vm.runInNewContext(read('src/scripts/footer-utility.js'),{document,window,URL});
assert.equal(words[0].textContent,'เช็กราคา');
assert(chips.every(x=>x.hidden));
assert(elements.scFooterPayments.hidden&&elements.scFooterDbd.hidden);
window.SCWORK_PUBLIC_FOOTER={paymentMethods:['visa'],dbdCertificateUrl:'https://dbd.go.th.example.test/certificate',dbdBadgeAsset:'./assets/icons/payments/dbd.svg'};
window.events.get('scwork-site-updated')();
assert.equal(elements.scFooterPayments.hidden,false);
assert.deepEqual(chips.map(x=>x.hidden),[true,false,true]);
assert.equal(elements.scFooterDbd.hidden,true);
window.SCWORK_PUBLIC_FOOTER={paymentMethods:['bank-transfer'],dbdCertificateUrl:'https://www.dbd.go.th/certificate',dbdBadgeAsset:'./assets/icons/payments/dbd.svg'};
document.documentElement.lang='en';
window.events.get('scwork:locale-applied')();
assert.equal(words[0].textContent,'Price estimate');
assert.equal(elements.scFooterDbd.hidden,false);
assert.equal(elements.scFooterDbd.href,'https://www.dbd.go.th/certificate');
elements.scFooterDbdMark.events.get('error')();
assert.equal(elements.scFooterDbd.hidden,true);
console.log('PASS V2.1.8: four separate hero assets, three workflow photographs, protected text styles and footer settings.');
