import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
const read=file=>readFileSync(file,'utf8');
const cta=read('src/styles/18-cta-standard.css');
const data=read('data/site-data.js');
const tokens=read('src/styles/00-tokens.css');
const rootHtml=['index.html','pricing-calculator.html','request-quote.html','article.html','tools/index.html','tools/site-manager.html','tools/image-manager.html'];
const pages=[...rootHtml,...readdirSync('tools/business').filter(s=>s.endsWith('.html')).map(s=>`tools/business/${s}`)];
assert.match(cta,/--color-cta:\s*#FF6900/,'Single-source CTA background not exact');
assert.match(cta,/--color-cta-ink:\s*#061B3D/,'CTA contrast text incorrect');
assert.match(data,/"primary":\s*"#FF6900"/,'Exported website default color not updated');
assert.match(tokens,/--color-primary:\s*#FF6900/,'Main theme token not updated');
assert.match(read('src/scripts/site-runtime.js'),/setProperty\('--color-cta'/,'Runtime must track Website Manager primary color');
for(const page of pages){
 const html=read(page);const m=[...html.matchAll(/<link[^>]+href="([^"]*18-cta-standard\.css\?v=1\.4\.1)"/g)];
 assert.equal(m.length,1,`${page} should include the shared CTA stylesheet exactly once`);
 const href=m[0][1].split('?')[0];
 assert.equal(path.normalize(path.join(path.dirname(page),href)),'src/styles/18-cta-standard.css',`${page} has a broken stylesheet path`);
 assert.ok(html.indexOf(m[0][0])<html.indexOf('</head>'),`${page} CTA stylesheet must load in the head`);
}
for(const sel of ['.button--primary','.services .service-card .button','.price-card .button','.v24-rfq-button','.sc-process__cta','.sc-price-link','.blog-more-button','.article-button--primary','.rfq-nav .rfq-primary','.general-submit','.est-primary','.btn-primary','.print-toolbar button','.button--green','.export-actions .primary']){
 assert.ok(cta.includes(sel),`Missing selector ${sel}`);
}
console.log(`PASS V1.4.1 CTA: exact #FF6900, contrast label, ${pages.length} linked HTML pages, all primary action selectors`);
