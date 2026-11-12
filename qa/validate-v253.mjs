import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = process.cwd();
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const html = read('index.html');
const css = read('src/styles/04-sections.css');
const responsive = read('src/styles/05-responsive.css');
const js = read('src/scripts/main.js');
assert.match(html,/class="hero__actions"/);
assert.match(html,/class="hero__carousel-controls"/);
assert.match(html,/data-hero-slide="0"/);
assert.equal((html.match(/data-hero-dot="\d"/g)||[]).length,4);
assert.equal((html.match(/class="hero__slide(?: is-active)?"/g)||[]).length,4);
assert.doesNotMatch(html,/id="heroPrev"|id="heroNext"/);
assert.match(css,/\.hero__slide\{[^}]*margin:0;width:100%;height:100%/);
assert.match(css,/\.hero__actions\{[^}]*justify-content:space-between/);
assert.match(css,/\.hero__dot::before\{[^}]*width:7px;height:7px/);
assert.match(responsive,/\.hero__actions \.button\{font-size:12px/);
assert.match(js,/function initHeroCarousel\(/);
assert.match(js,/dots\.forEach\(\(dot,i\)=>dot\.addEventListener/);
for(const file of ['assets/images/hero/hero-scene.webp','assets/images/about/main.webp','assets/images/services/office.webp','assets/images/quote/main.webp']){
  assert.ok(fs.statSync(path.join(root,file)).size>0,file);
}
console.log('PASS v2.5.3: full-bleed 4-photo carousel, CTA-aligned compact dots, no arrows; source assets found');
