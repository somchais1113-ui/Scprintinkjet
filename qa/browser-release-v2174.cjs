/* Real browser checks of the generated public build. No production writes. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium,webkit}=require('playwright');
const base=new URL(process.argv[2]||'http://127.0.0.1:8000/dist-public/');
const engineName=process.argv[3]||'chromium';
const engine={chromium,webkit}[engineName];
assert(engine,'Unknown engine');
const pages=JSON.parse(fs.readFileSync('qa/public-manifest-v2172.json','utf8')).files.filter(p=>p.endsWith('.html'));
const projects=['vera-leaf','zestora','paw-parade','roast-and-rise','formline','mellow-grain','elitecraft','techmate','ecolabel','citrus'];
const failures=[];
const out='qa-evidence/'+engineName;
fs.mkdirSync(out,{recursive:true});
async function run(){
 const browser=await engine.launch({headless:true});
 try{
  for(const viewport of [{width:1440,height:900},{width:768,height:1024},{width:390,height:844}]){
   const page=await browser.newPage({viewport,reducedMotion:'reduce'});
   let errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).origin===base.origin)errors.push(r.status()+' '+r.url());});
   // Avoid contacting live service endpoints during local storefront regression.
   await page.route('**/*',r=>{const u=new URL(r.request().url());return u.origin===base.origin||['fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname)?r.continue():r.abort();});
   const cases=pages.filter(p=>p!=='portfolio-detail.html').map(p=>[p,p+'?lang=th']).concat(projects.map(id=>['case-'+id,'portfolio-detail.html?work='+id+'&lang=th']));
   for(const [name,path] of cases){
    errors=[];
    try{
     await page.goto(new URL(path,base).href,{waitUntil:'domcontentloaded',timeout:30000});
     await page.locator('#topContactBar').waitFor({state:'visible',timeout:12000});
     await page.locator('#scSupportBar').waitFor({state:'visible',timeout:12000});
     assert.equal(await page.locator('#topContactBar').count(),1);
     assert.equal(await page.locator('#scSupportBar').count(),1);
     await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
     await page.waitForFunction(()=>{const a=document.querySelector('#topContactBar'),b=document.querySelector('#scSupportBar');return a&&b&&Math.abs(a.getBoundingClientRect().top)<3&&Math.abs(b.getBoundingClientRect().bottom-innerHeight)<3;},{},{timeout:4000});
     await page.evaluate(()=>scrollTo(0,0));
     await page.waitForFunction(()=>window.scrollY<3);
     if(name==='index.html'){
      await page.waitForFunction(()=>document.querySelectorAll('#portfolio .sc-portfolio__grid:not(.sc-reflection-layer)>figure[data-work]').length===6);
     }
     if(name==='portfolio.html'){
      await page.waitForFunction(()=>document.querySelectorAll('.portfolio-gallery .sc-concept-cover img.sc-concept-photo').length===10);
      for(const id of ['elitecraft','techmate','ecolabel','citrus']){
       const cover=page.locator(`.portfolio-card__open[href*="work=${id}&"] .sc-concept-cover img.sc-concept-photo`);
       assert.equal(await cover.count(),1,id+' card count');
       await cover.scrollIntoViewIfNeeded();
       await cover.evaluate(img=>img.decode());
       assert(await cover.evaluate((img,id)=>img.currentSrc.endsWith('/'+id+'/hero-v2174.webp')&&img.naturalWidth>=1600&&img.naturalHeight>=900,id),id+' cover must use approved hero');
      }
      for(const cover of await page.locator('.portfolio-gallery .sc-concept-cover img.sc-concept-photo').all()){
       await cover.scrollIntoViewIfNeeded();
       await cover.evaluate(img=>img.decode());
       assert(await cover.evaluate(e=>{const a=e.getBoundingClientRect(),b=e.parentElement.getBoundingClientRect();return e.naturalWidth>0&&getComputedStyle(e).objectFit==='cover'&&Math.abs(a.width-b.width)<3&&Math.abs(a.height-b.height)<3;}),'Cover geometry or image decode');
      }
     }
     if(name==='knowledge.html'){
      await page.waitForFunction(()=>document.querySelectorAll('.knowledge-card').length===15);
      await page.locator('#knowledgeHeroNext').click();
      assert.equal(await page.locator('#knowledgeHeroCounter strong').textContent(),'02');
      await page.locator('#knowledgeHeroPrev').click();
      assert.equal(await page.locator('#knowledgeHeroCounter strong').textContent(),'01');
      await page.locator('[data-kh-dot="4"]').click();
      assert.equal(await page.locator('#knowledgeHeroCounter strong').textContent(),'05');
      await page.locator('#knowledgeSearch').fill('zzzz-no-match');
      assert.equal(await page.locator('.knowledge-card').count(),0);
      await page.locator('#knowledgeSearch').fill('');
      assert.equal(await page.locator('.knowledge-card').count(),15);
     }
     if(name==='about.html'){
      const section=page.locator('#commitment');
      const image=section.locator('.ab-commit-media img');
      await section.scrollIntoViewIfNeeded();
      await image.evaluate(img=>img.decode());
      assert.equal(await section.locator('.ab-split,.ab-photo').count(),0);
      assert(await section.evaluate(e=>{
       const c=e.querySelector('.ab-commit-copy'),h=e.querySelector('h2'),m=e.querySelector('.ab-commit-media'),s=e.getBoundingClientRect(),b=c.getBoundingClientRect();
       return getComputedStyle(e).backgroundColor==='rgb(255, 255, 255)'&&getComputedStyle(c).textAlign==='center'&&getComputedStyle(h).color==='rgb(36, 40, 44)'&&getComputedStyle(m).position==='absolute'&&Math.abs(s.left+s.width/2-b.left-b.width/2)<3&&b.left>=s.left&&b.right<=s.right&&b.bottom<=s.bottom;
      }),'Commitment white centered layout');
      await section.screenshot({path:out+'/'+viewport.width+'-about-commitment.png',animations:'disabled'});
     }
     if(name.startsWith('case-')){
      await page.waitForFunction(()=>document.querySelectorAll('[data-case-node]').length===7);
      assert.equal(await page.locator('.sc-hero-info').count(),3);
      const image=page.locator('.sc-hero-media img');
      if(await image.count())await image.evaluate(img=>img.decode());
      else assert.fail('Missing hero photograph: '+name);
      if(['case-elitecraft','case-techmate','case-ecolabel','case-citrus'].includes(name)){
       assert.equal(await image.count(),1);
       assert.equal(await page.locator('.sc-case-hero68--photo').count(),1);
       assert(await image.evaluate(e=>e.naturalWidth>=1600&&e.naturalHeight>=900&&e.src.endsWith('/hero-v2174.webp')&&getComputedStyle(e).objectFit==='cover'));
      }
      if(name==='case-formline'){
       const progress=()=>page.locator('[data-case-timeline]').evaluate(e=>parseFloat(e.style.getPropertyValue('--case-track-fill'))||0);
       await page.locator('[data-case-node]').last().scrollIntoViewIfNeeded();
       await page.waitForFunction(()=>parseFloat(document.querySelector('[data-case-timeline]').style.getPropertyValue('--case-track-fill'))>0);
       const down=await progress();
       await page.evaluate(()=>scrollTo(0,0));
       await page.waitForFunction(n=>parseFloat(document.querySelector('[data-case-timeline]').style.getPropertyValue('--case-track-fill'))<n,down);
      }
     }
     await page.evaluate(()=>scrollTo(0,0));
     await page.screenshot({path:out+'/'+viewport.width+'-'+name.replace(/[^a-z0-9-]/gi,'_')+'.png',animations:'disabled'});
     assert.deepEqual(errors,[]);
     console.log('PASS',engineName,viewport.width,name);
    }catch(e){failures.push({engineName,width:viewport.width,name,error:String(e).slice(0,1000),errors});console.error('FAIL',viewport.width,name,String(e).slice(0,500));}
   }
   await page.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync(out+'/report.json',JSON.stringify({engineName,failures},null,2));
 assert.equal(failures.length,0,'See browser report');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
