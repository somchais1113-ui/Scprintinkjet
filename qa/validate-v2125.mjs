import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const html=readFileSync(join(root,'index.html'),'utf8');
const main=readFileSync(join(root,'src/scripts/main.js'),'utf8');
const [start,end]=[html.indexOf('<section class="sc-portfolio"'),html.indexOf('</section>',html.indexOf('<section class="sc-portfolio"'))];
const portfolio=html.slice(start,end);
for(const f of ['portfolio-label-quality-process.webp','portfolio-diecut-production-process.webp','portfolio-installation-process.webp']){
 assert(existsSync(join(root,'assets/images/portfolio',f)),f+' is missing');
 assert(portfolio.includes('./assets/images/portfolio/'+f),f+' not referenced in homepage');
}
assert(/ภาพจำลองขั้นตอนการทำงานและบุคลากร/.test(portfolio),'homepage disclosure absent');
assert(main.includes('AI-generated scenes of workers and processes'),'EN disclosure absent');
assert(!portfolio.includes('quote-choices/'),'homepage still references old images');
for(const f of ['quote-product-labels.webp','quote-diecut-stickers.webp','quote-large-format.webp'])assert(existsSync(join(root,'assets/images/quote-choices',f)),'source quote image removed '+f);
assert(portfolio.match(/<figure>/g).length===3,'card count changed');
console.log('SCWORK V2.1.25 portfolio image QA PASS');
