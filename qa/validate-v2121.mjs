/* V2.1.21 — targeted regression: four service pages and home benefit navigation. */
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read = p => readFileSync(new URL('../'+p,import.meta.url),'utf8');
assert.equal(JSON.parse(read('package.json')).version,'2.1.21');
const names=['standard-pricing','design-services','delivery','credit-terms'];
const imgs=['pricing','design','delivery','credit'];
const legacy=[
  'ระบุวัสดุ ขนาด และจำนวนที่ต้องการ',
  'เริ่มได้ทั้งจากไอเดียหรือไฟล์เดิม',
  'บอกวันใช้งานและรหัสไปรษณีย์ปลายทาง',
  'หากบริษัทของคุณมีรอบชำระเงิน'
];
for (let i=0;i<4;i++) {
  const h=read(names[i]+'.html');
  assert(h.includes(legacy[i]),'Approved Thai service copy changed in '+names[i]);
  assert(h.includes('30-benefit-pages.css?v=2.1.21'));
  assert(h.includes('benefit-pages.js?v=2.1.21'));
  assert(h.includes(`assets/images/benefits/${imgs[i]}.webp`));
  assert(existsSync(new URL('../assets/images/benefits/'+imgs[i]+'.webp',import.meta.url)));
  assert.equal((h.match(/class="benefit-tabs"/g)||[]).length,1);
  assert.equal((h.match(/data-benefit-local/g)||[]).length,9);
  assert.equal((h.match(/class="benefit-step-num"/g)||[]).length,3);
  assert.equal((h.match(/aria-current="page"/g)||[]).length,3); // locale + breadcrumb + tab
  assert(!h.includes('benefit-emblem') && !h.includes('benefit-related'));
  assert(h.includes('data-en-alt=') && h.includes('loading="eager"'));
  assert(h.includes('smart-quote.html?'), 'Primary CTA destination unexpectedly removed');
}
const home=read('index.html');
const homeStrip=home.slice(home.indexOf('<section class="sc-benefits"'),home.indexOf('</section>',home.indexOf('<section class="sc-benefits"')));
assert(homeStrip.includes('sc-benefits__index'));
assert(!homeStrip.includes('sc-benefits__icon'));
assert(home.includes('29-benefit-strip.css?v=2.1.21'));
assert.match(read('src/styles/29-benefit-strip.css'),/overflow-x:auto/);
assert.match(read('src/styles/30-benefit-pages.css'),/\.benefit-cta\{background:var\(--benefit-orange\);color:#fff\}/);
assert.match(read('src/scripts/benefit-pages.js'),/data-en-alt/);
assert.match(read('src/styles/34-cinematic-hero.css'),/@keyframes sc-cinema-slow-zoom-in/);
assert.match(read('src/styles/18-cta-standard.css'),/--color-cta-ink:#FFFFFF/);
assert(read('qa/build-public-v2111.mjs').includes("'START_HERE_V2.1.21.md'"));
console.log('PASS V2.1.21: editorial service pages, photographs, Thai/English navigation, original CTA links and pricing/cinematic preservation.');
