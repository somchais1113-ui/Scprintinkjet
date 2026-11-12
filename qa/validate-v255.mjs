import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const read = p => fs.readFileSync(p,'utf8');
const html = read('index.html');
const motionCss = read('src/styles/11-motion.css');
const motionJs = read('src/scripts/motion.js');
const main = read('src/scripts/main.js');
const layout = read('src/styles/10-hero-layout-fix.css');
const tests = [
  ['Motion CSS versioned',/11-motion\.css\?v=2\.5\.(?:5|6|7)/.test(html)],
  ['Motion JS versioned',/motion\.js\?v=2\.5\.(?:5|6|7)/.test(html)],
  ['Stable Hero two-row grid',/grid-template-rows:\s*auto auto/.test(layout)],
  ['Hero CTA and dots remain separated',/class="hero__actions"/.test(html)&&/class="hero__carousel-controls"/.test(html)],
  ['Four carousel dot selectors',((html.match(/data-hero-dot="\d"/g)||[]).length===4)],
  ['Carousel arrows remain absent',!/heroPrev|heroNext/.test(html)],
  ['Autoplay respects reduced motion',/reduceMotion\?\.matches/.test(main)],
  ['Autoplay respects hidden tab',/document\.hidden/.test(main)],
  ['Scroll content reveals',/IntersectionObserver/.test(motionJs)],
  ['Dynamic content reveal after language toggles',/MutationObserver/.test(motionJs)],
  ['Browser without IntersectionObserver has visible fallback',/else node\.classList\.add\('is-visible'\)/.test(motionJs)],
  ['Reduced-motion support',/prefers-reduced-motion:reduce/.test(motionCss)],
  ['No extra network dependencies',!/https?:\/\//.test(motionJs)],
  ['Visual animation uses opacity and transforms',/pc-photo-breathe/.test(motionCss)&&/pc-enter-up/.test(motionCss)],
];
for (const [name,ok] of tests) assert.ok(ok,name);
for (const f of ['src/scripts/motion.js','src/scripts/main.js']) execFileSync('node',['--check',f]);
console.log(`PASS v2.5.5: ${tests.length} structural & accessibility checks; files parse`);
