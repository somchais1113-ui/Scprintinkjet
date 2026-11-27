/* Optional browser regression. See START_HERE_V2.1.72.md. */
const assert=require('node:assert/strict');
const {chromium,webkit}=require('playwright');
const base=new URL(process.argv[2]||'http://127.0.0.1:8000/public-release/');
const url=p=>new URL(p,base.href.endsWith('/')?base.href:base.href+'/').href;
(async()=>{
 for(const [name,engine] of [['Chromium',chromium],['WebKit',webkit]]){
  const browser=await engine.launch({headless:true});
  try{
   for(const viewport of [{width:1440,height:900},{width:768,height:1024},{width:390,height:844}]){
    const page=await browser.newPage({viewport,reducedMotion:'reduce'}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).origin===base.origin)errors.push(r.status()+' '+r.url());});
    await page.goto(url('index.html?lang=th'));await page.waitForSelector('#portfolio figure[data-work]');
    assert.equal(await page.locator('#portfolio .sc-portfolio__grid:not(.sc-reflection-layer)>figure[data-work]').count(),6);
    if(viewport.width>560){await page.waitForSelector('.sc-reflection-layer .sc-reflection-card',{state:'attached'});assert.equal(await page.locator('.sc-reflection-card').count(),viewport.width>850?3:2);assert.equal(await page.locator('.sc-reflection-card a[href]').count(),0);}
    else assert.equal(await page.locator('.sc-reflection-card').count(),0);
    await page.waitForSelector('#scSupportBar',{state:'visible'});
    await page.waitForSelector('#topContactBar',{state:'visible'});
    await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
    const topRect=await page.locator('#topContactBar').boundingBox();
    assert(topRect&&Math.abs(topRect.y)<2,'Announcement should remain pinned');
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.goto(url('portfolio.html?lang=th&category=all'));
    await page.waitForSelector('.portfolio-gallery .sc-concept-cover img.sc-concept-photo');
    const covers=page.locator('.portfolio-gallery .sc-concept-cover img.sc-concept-photo');
    assert.equal(await covers.count(),10);
    for(const cover of await covers.all()){
      const fills=await cover.evaluate(e=>{const a=e.getBoundingClientRect(),b=e.parentElement.getBoundingClientRect();return getComputedStyle(e).objectFit==='cover'&&Math.abs(a.width-b.width)<2&&Math.abs(a.height-b.height)<2;});
      assert(fills,'Cover should fill its frame');
    }
    await page.waitForSelector('#scSupportBar',{state:'visible'});
    await page.goto(url('knowledge.html?lang=th'));await page.waitForSelector('.knowledge-card');
    await page.waitForSelector('#scSupportBar',{state:'visible'});
    assert.equal(await page.locator('.knowledge-card').count(),15);
    await page.locator('#knowledgeHeroNext').click();assert.equal(await page.locator('#knowledgeHeroCounter strong').textContent(),'02');
    await page.locator('#knowledgeHeroPrev').click();assert.equal(await page.locator('#knowledgeHeroCounter strong').textContent(),'01');
    await page.locator('[data-kh-dot="4"]').click();assert.equal(await page.locator('#knowledgeHeroCounter strong').textContent(),'05');
    if(viewport.width>850){await page.locator('.knowledge-card__image').first().hover();assert.equal(await page.locator('.knowledge-card__cover-title').first().evaluate(e=>getComputedStyle(e).opacity),'1');}
    await page.locator('#knowledgeSearch').fill('zzzz-no-match');assert.equal(await page.locator('.knowledge-card').count(),0);
    await page.locator('#knowledgeSearch').fill('');assert.equal(await page.locator('.knowledge-card').count(),15);
    await page.goto(url('portfolio-detail.html?work=formline&lang=th'));await page.waitForSelector('[data-case-node]');
    await page.waitForSelector('#scSupportBar',{state:'visible'});
    assert.equal(await page.locator('[data-case-node]').count(),7);assert.equal(await page.locator('.sc-hero-info').count(),3);
    const progress=()=>page.locator('[data-case-timeline]').evaluate(e=>parseFloat(e.style.getPropertyValue('--case-track-fill'))||0);
    await page.locator('[data-case-node]').last().scrollIntoViewIfNeeded();await page.waitForTimeout(150);const down=await progress();
    await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(150);assert(down>await progress(),'Timeline should reverse on scroll up');
    assert.deepEqual(errors,[],name+' '+viewport.width);await page.close();
    console.log(name+' '+viewport.width+' PASS');
   }
  }finally{await browser.close();}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
