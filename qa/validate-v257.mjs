import fs from 'node:fs';
import assert from 'node:assert/strict';
const read = path => fs.readFileSync(path,'utf8');
const html=read('index.html'), article=read('article.html');
const css=read('src/styles/13-spacing-system.css');
const articleCss=read('src/styles/12-article.css');
const manager=read('tools/site-manager.js');
assert.match(html,/13-spacing-system\.css\?v=2\.5\.7/);
assert.match(html,/12-blog-upgrade\.css\?v=2\.5\.7/);
assert.match(html,/10-hero-layout-fix\.css\?v=2\.5\.7/);
assert.match(html,/11-motion\.css\?v=2\.5\.7/);
assert.match(article,/12-article\.css\?v=2\.5\.7/);
assert.match(css,/--section-space/,'Spacing layer should follow Website Manager spacing token');
for (const selector of ['.services','.quote-section','.team-section','.about-section','.pricing-section','.testimonials','.blog-section','.contact-section','.footer','.section-intro']) {
  assert.ok(css.includes(selector),`Missing rhythm control ${selector}`);
}
assert.match(css,/@media \(max-width:780px\)/);
assert.match(css,/@media \(max-width:520px\)/);
assert.match(css,/html\[lang="th"\]/);
assert.match(articleCss,/v2\.5\.7 — article reading rhythm/);
assert.match(manager,/design\.sectionSpacing/);
assert.match(html,/id="heroDots"/);
assert.equal((html.match(/data-hero-dot="\d"/g)||[]).length,4);
assert.match(html,/id="blogMoreButton"/);
assert.match(html,/id="servicesGrid"/);
assert.match(html,/id="pricingGrid"/);
console.log('PASS V2.5.7: 27 stylesheet/HTML/responsive/manager compatibility checks');
