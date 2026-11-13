import assert from 'node:assert/strict';
import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {join} from 'node:path';
const read=p=>readFileSync(p,'utf8');
const walk=dir=>readdirSync(dir).flatMap(name=>{const p=join(dir,name);return statSync(p).isDirectory()?walk(p):[p]});
let passed=0;
const check=(v,msg)=>{assert.ok(v,msg);passed++};
const home=read('index.html'),contact=read('src/scripts/commerce-enhancements.js'),theme=read('src/styles/00-tokens.css'),data=read('data/site-data.js'),manager=read('tools/site-manager.js');
check(home.includes('id="topOfficePhone"') && home.includes('id="topMobilePhone"') && home.includes('id="topLine"'),'Top strip has office/mobile/LINE slots');
check(!home.includes('id="topPriceLink"')&&!home.includes('id="topInquiryLink"'),'Top strip no longer duplicates quote/price CTA');
check(home.includes('sc-topbar__benefits'),'Benefits remain left of contact strip');
check(/\.site-header \.brand__logo/.test(read('src/styles/15-commerce-enhancements.css')),'Header logo alignment defined');
check(!home.includes('brand__copy'),'No secondary header/footer tagline beside official logo');
check(existsSync('assets/icons/scwork-logo.png')&&existsSync('assets/brand/SCWORK-logo-source-original.png'),'Logo and editable source retained');
check(theme.includes('#FC6201')&&theme.includes('#012A62')&&theme.includes('#FF6900'),'Palette from supplied logo plus owner-approved CTA shade');
check(/officePhone.*mobilePhone.*lineId/s.test(data),'Shared contact fields exist in content');
check(manager.includes('Top Contact Bar & Contact Details'),'Website Manager exposes contact fields');
check(contact.includes('scwork-site-updated')&&contact.includes('tel:')&&contact.includes('line.me'),'Contact strip updates and makes real links');
check(read('config/public-config.js').includes('officePhone')&&read('config/public-config.js').includes('mobilePhone'),'Public config can supply safe fallback');
check(!home.includes('02-444-3897')&&!home.includes('095-837-9946')&&!home.includes('@pimd'),'No borrowed third-party contact details');
check(read('package.json').includes('"version": "1.4.1"'),'Package v1.4.1 correct');
check(read('src/styles/16-pricing-calculator.css').includes('.est-brand__logo'),'Calculator logo styled');
check(read('src/styles/08-rfq.css').includes('.rfq-brand-logo'),'RFQ logo styled');
check(read('src/styles/17-language-modal.css').includes('.sc-language-dialog'),'14-language modal retained');
// Greenness audit across runtime UI code, excluding image source assets.
let green=[];
for (const p of [...walk('src/styles'), ...walk('tools'), ...walk('src/scripts')]){
  if(!/\.(css|js|html)$/.test(p))continue;
  const source=read(p);
  for(const m of source.matchAll(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/g)){
    if(p==='tools/site-manager.js' && ['#36b864','#2eb767','#23ad65'].includes(m[0].toLowerCase()))continue; // legacy-draft migration signatures
    const c=m[0].slice(1,7),r=parseInt(c.slice(0,2),16)/255,g=parseInt(c.slice(2,4),16)/255,b=parseInt(c.slice(4,6),16)/255;
    const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;
    const hue=((max===min?0:max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4)*60+360)%360;
    if(hue>=65 && hue<=173 && d>.045 && g>r*1.01 && g>b*1.005)green.push(`${p}: ${m[0]}`);
  }
}
check(green.length===0,`Legacy green/mint hex values remain: ${green.slice(0,8).join(', ')}`);
console.log(`SCWORK V1.4 QA PASS: ${passed} structure, brand, contacts, palette, configuration checks`);
