/* V2.1.19 cinematic hero static regression. */
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const get=p=>readFileSync(new URL(p,root),'utf8');
const html=get('index.html');
const css=get('src/styles/34-cinematic-hero.css');
const js=get('src/scripts/main.js');
const build=get('qa/build-public-v2111.mjs');
const packageInfo=JSON.parse(get('package.json'));
assert(['2.1.19','2.1.20'].includes(packageInfo.version));
assert.match(html,/hero--cinematic/);
assert.match(html,/34-cinematic-hero\.css\?v=2\.1\.(?:19|20)/);
assert.match(html,/main\.js\?v=2\.1\.(?:19|20)/);
for(let i=0;i<4;i++){
 assert.match(html,new RegExp(`data-hero-slide="${i}"`));
 assert.match(html,new RegExp(`data-hero-dot="${i}"`));
}
const photos=['inkjet-print-v218.webp','product-labels-v218.webp','die-cut-stickers-v218.webp','retail-vinyl-v218.webp'];
for(const photo of photos){
 assert(html.includes(`./assets/images/hero/${photo}`),'missing slide '+photo);
 assert(existsSync(new URL('assets/images/hero/'+photo,root)),'asset not found: '+photo);
}
for(const ref of ['scCinematicPrev','scCinematicNext','scCinematicPause','scCinematicCount','scCinematicScroll','scCinematicStory']){
 assert(html.includes(`id="${ref}"`),'missing '+ref);
}
for(const token of ['data-title-th','data-title-en','data-desc-th','data-desc-en','data-label-th','data-label-en','aria-pressed'])assert(html.includes(token),token);
for(const token of ['function initHeroCarousel','function goTo','function setHeroCopy','function commitSlide','function restart','duration=7400','scwork-site-updated','isFocusWithin','reduceMotion','IntersectionObserver','data-hero-dot'])assert(js.includes(token),token);
for(const token of ['hero--cinematic','hero__slide.is-active','opacity 880ms','sc-cinema__copy--leaving','@media(max-width:520px)','@media(max-width:780px)','prefers-reduced-motion:reduce','mask-image: none','background: #ff6900'])assert(css.includes(token),token);
assert(build.includes('34-cinematic-hero')&&build.includes('START_HERE_V2.1.19.md'));
for(const link of ['./smart-quote.html','#services'])assert(html.includes(`href="${link}"`),'must retain '+link);
assert(get('src/scripts/smart-quote.js').includes('function calculate('),'pricing unaffected');
console.log('PASS V2.1.19: four-photo cinematic hero, bilingual stories, controls, responsive effects, static public build and preserved quote CTA.');
