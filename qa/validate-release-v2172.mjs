import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {permitted,localPath,verifyHtml} from './release-contract-v2172.mjs';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const read=p=>readFileSync(join(root,p),'utf8');
const manifest=JSON.parse(read('qa/public-manifest-v2172.json')).files;
const published=process.argv[2]?resolve(process.argv[2]):join(root,'public-release');
const set=new Set(manifest);
assert.equal(set.size,manifest.length);
for(const p of ['admin/index.html','data/demo/customers.json','data/pricing-demo-data.js','../private.json','config/private-config.js','assets/.DS_Store'])assert.equal(permitted(p),false,p);
assert.equal(localPath('order-status/index.html','../index.html?lang=th'),'index.html');
let pages=0,scripts=0;
for(const p of manifest){
 assert(permitted(p),p);
 const target=join(published,p);assert(existsSync(target),'Missing published: '+p);
 if(p!=='.nojekyll')assert(readFileSync(join(root,p)).equals(readFileSync(target)),'Source/public mismatch: '+p);
 if(p.endsWith('.html')){verifyHtml(p,read(p),set);pages++;}
 if(p.endsWith('.js')){new vm.Script(read(p),{filename:p});scripts++;}
}
const ctx={window:{}};vm.createContext(ctx);
for(const p of ['data/site-data.js','assets/images/portfolio/concept-10/concept-data.js','assets/images/portfolio/concept-10/deep-case-data-v2167.js'])vm.runInContext(read(p),ctx,{filename:p});
const projects=ctx.window.SCWORK_CONCEPT_PROJECTS,posts=ctx.window.PROCLEANING_SITE.blogs;
assert.equal(projects.length,10);assert.equal(posts.length,15);assert.equal(projects.filter(p=>p.featured).length,6);
assert.equal(new Set(projects.map(p=>p.id)).size,10);
for(const p of projects){assert.equal(p.timeline.length,7);assert(p.timeline.every(s=>s.body.th&&s.body.en));for(const asset of [p.cover,p.hero,p.mockBrand.logo])assert(set.has(localPath('index.html',asset)),'Project asset missing: '+asset);}
const home=read('index.html'),knowledge=read('knowledge.html'),detail=read('portfolio-detail.html');
for(const p of manifest.filter(x=>x.endsWith('.html'))){
 const html=read(p);
 assert.equal((html.match(/id="topContactBar"/g)||[]).length,1,p+' announcement element');
 assert.equal((html.match(/global-topbar-v2174\.js\?v=2\.1\.74/g)||[]).length,1,p+' announcement script');
 assert.equal((html.match(/55-global-topbar-v2174\.css\?v=2\.1\.74/g)||[]).length,1,p+' announcement CSS');
 assert.equal((html.match(/support-bar\.js\?v=2\.1\.73/g)||[]).length,1,p+' support script');
 assert.equal((html.match(/26-support-bar\.css\?v=2\.1\.73/g)||[]).length,1,p+' support CSS');
}
assert(!home.includes('class="section contact-section"'));
assert.equal(projects.find(p=>p.id==='elitecraft').title.th,"ยกระดับภาพลักษณ์สินค้า Home Fragrance");
assert(!projects.find(p=>p.id==='elitecraft').title.en.includes('finishing'));
assert(read('src/styles/55-global-topbar-v2174.css').includes('position:fixed!important'));
assert(home.includes('id="contact" class="footer-consult"'));
assert(read('src/scripts/main.js').includes("if(byId('contactMethods'))"));
for(const id of ['elitecraft','techmate','ecolabel','citrus']){
 const p=projects.find(p=>p.id===id);assert(p&&!p.identityOnly,id);
 assert(p.hero.endsWith('/hero-v2174.webp')&&p.cover.endsWith('/cover-v2174.webp'),id);
 assert(p.heroDimensions[0]>=1600&&p.heroDimensions[1]>=900,id);
 assert.equal(p.cardDimensions.join('x'),'1200x750');
}
assert(read('src/styles/54-full-frame-v2173.css').includes('object-fit:cover!important'));
assert(read('src/scripts/main.js').includes('conceptItems.slice(0,6).map'));
assert.equal((knowledge.match(/data-kh-slide/g)||[]).length,5);assert.equal((knowledge.match(/data-kh-dot=/g)||[]).length,5);
assert(read('src/scripts/knowledge-hub.js').includes('knowledge-card__cover-title'));
assert(home.includes('portfolio-reflection-v2171.js'));assert(detail.indexOf('portfolio-detail-v2169.js')<detail.indexOf('portfolio-timeline-v2165.js'));
const fnCtx={};vm.createContext(fnCtx);
for(const [p,mark] of [['src/scripts/portfolio-reflection-v2171.js','(function reflection()'],['src/scripts/portfolio-timeline-v2165.js','(function timeline()']]){const code=read(p);vm.runInContext(code.slice(0,code.indexOf(mark)),fnCtx);}
assert.equal(JSON.stringify(fnCtx.bottomCards([{x:0,bottom:100},{x:100,bottom:110},{x:0,bottom:220},{x:100,bottom:240}]).map(x=>x.bottom)),'[220,240]');
for(const [threshold,fill] of [[50,0],[150,50],[350,200],[120,20]])assert.equal(fnCtx.calcProgress([100,200,300],threshold).fill,fill);
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name).slice(published.length+1).replaceAll('\\','/')]);}
for(const p of walk(published))assert(set.has(p)||/^order-status\/[a-f0-9]{32}\.json$/.test(p),'Unexpected public file: '+p);
console.log('SCWork release QA PASS: '+manifest.length+' files, '+pages+' pages, '+scripts+' scripts, 10 projects / 70 steps, 15 articles, five slides, reflection and reversible timeline logic.');
