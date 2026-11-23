/* V2.1.20 — targeted static regression of owner-approved two visual changes. */
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const pkg=JSON.parse(read('package.json'));
assert.equal(pkg.version,'2.1.20');
const home=read('index.html'),hero=read('src/styles/34-cinematic-hero.css'),main=read('src/scripts/main.js');
assert.match(home,/34-cinematic-hero\.css\?v=2\.1\.20/);
assert.match(home,/src\/scripts\/main\.js\?v=2\.1\.20/);
assert.match(hero,/@keyframes sc-cinema-slow-zoom-in/);
assert.match(hero,/from\s*\{transform:\s*translate3d\(0,0,0\)\s*scale\(1\)/);
assert.match(hero,/to\s*\{transform:\s*translate3d\(0,0,0\)\s*scale\(1\.075\)/);
assert.match(hero,/\.hero__slide:is\(\.is-active,\.is-exiting\) img/);
assert.match(hero,/animation:\s*sc-cinema-slow-zoom-in 9s linear both !important/);
assert.match(hero,/prefers-reduced-motion:no-preference/);
assert.match(hero,/prefers-reduced-motion:reduce/);
assert.match(hero,/animation:none!important/);
assert.match(hero,/\.hero__actions \.button--primary\s*\{[^}]*color:\s*#fff/s);
for(const needle of ['const duration=7400','photoFadeDuration=880','is-exiting','exitTimers','function commitSlide','function goTo','function restart','manualPause','IntersectionObserver','scwork-site-updated']){
  assert(main.includes(needle),'Hero controls/transition missing: '+needle);
}
for(let i=0;i<4;i++)assert(home.includes(`data-hero-slide="${i}"`));
const shared=read('src/styles/18-cta-standard.css');
assert.match(shared,/--color-cta:#FF6900/);
assert.match(shared,/--color-cta-ink:#FFFFFF/);
assert.match(shared,/:is\(:hover,:focus-visible,:active\)/);
assert.match(read('src/styles/00-tokens.css'),/--color-cta-ink:\s*#FFFFFF/);
const checks=[
 ['src/styles/21-product-labels.css',/\.cta,\.secondary\{[^}]*background:var\(--orange\);color:#fff/s],
 ['src/styles/22-project-quote.css',/\.p-primary\{[^}]*color:#fff/s],
 ['src/styles/30-benefit-pages.css',/\.benefit-cta \{background:var\(--benefit-orange\);color:#fff/],
 ['src/styles/19-smart-quote.css',/\.q-cta\{background:#ff6900;color:#fff/],
 ['src/styles/19-smart-quote.css',/\.q-mobile-link\{[^}]*background:#ff6900;color:#fff/s],
 ['src/styles/24-quote-billing.css',/\.qb-print\{[^}]*background:#ff6900;color:#fff/s],
 ['src/styles/26-support-bar.css',/\.sc-helpbar__button \{[^}]*color: #fff;\s*background: #ff6900/s],
 ['src/styles/26-support-bar.css',/\.sc-helpbar__button:hover \{[^}]*color: #fff/s],
 ['tools/pricing-workbench.css',/\.primary\{background:#ff6900;color:#fff/]
];
for(const [p,match] of checks)assert.match(read(p),match,`Missing orange CTA white label on ${p}`);
for(const [page,style] of [
 ['index.html','18-cta-standard.css'],['article.html','18-cta-standard.css'],
 ['product-labels.html','21-product-labels.css'],['project-quote.html','22-project-quote.css'],
 ['smart-quote.html','19-smart-quote.css'],['standard-pricing.html','30-benefit-pages.css'],
 ['design-services.html','30-benefit-pages.css'],['credit-terms.html','30-benefit-pages.css'],
 ['delivery.html','30-benefit-pages.css']]){
 assert(read(page).includes(`${style}?v=2.1.20`),`Cache busting missing: ${page}, ${style}`);
}
assert(read('qa/build-public-v2111.mjs').includes("'START_HERE_V2.1.20.md'"));
assert(existsSync(new URL('../START_HERE_V2.1.20.md',import.meta.url)));
console.log('PASS V2.1.20: four-slide slow zoom-in, smooth exit, reduced-motion, cross-site white-on-orange CTA and release build.');
