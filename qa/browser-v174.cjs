/* Optional QA: node qa/browser-v174.cjs PUBLIC_DIR [CHROMIUM_BINARY] [SCREENSHOT_DIR] */
const {chromium}=require('playwright');
const fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(process.argv[2]||'public-release');
const browserArgs={headless:true,args:['--no-sandbox','--disable-dev-shm-usage']};
if(process.argv[3])browserArgs.executablePath=process.argv[3];
const snapshots=process.argv[4];
const origin='http://scwork-qa.test';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp'};
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../data/pricing-demo-data.js'),'utf8'),ctx);
const demo=ctx.window.SCWORK_PRICING_DEMO,cost=require('../src/scripts/rate-card-builder.js');
const rules=cost.defaultRules(demo);
for(const m of demo.categories.find(c=>c.id==='sticker').materials){
  const r=rules[m.id];Object.assign(r,{materialCost:7.5,printCost:8.2,finishingCost:1.5,setupCost:120,supplierFee:35,freightIn:50,overhead:30,marginPct:36,minCharge:550,wastePct:7});
  r.addonCosts=Object.fromEntries((m.addons||[]).map(a=>[a.id,a.type==='flat'?160:1.2]));
}
const rates=cost.buildPublic(demo,rules,{version:'QA-NOT-FOR-SALE'});
(async()=>{
 const browser=await chromium.launch(browserArgs);
 async function scenario(opts,run){
   const ctx=await browser.newContext({viewport:{width:opts.width||390,height:opts.width>1000?960:844},reducedMotion:'reduce',isMobile:opts.width<500,hasTouch:opts.width<500});
   const errors=[],missing=[],external=[],requests=[];
   await ctx.route('**/*',async route=>{
     const u=new URL(route.request().url());requests.push([u.pathname,route.request().method()]);
     if(u.origin!==origin){
       if(u.hostname==='line.me'){external.push(u.href);return route.fulfill({status:200,body:'LINE boundary intercepted; no message sent'});}
       return route.fulfill({status:200,contentType:'text/css',body:''});
     }
     if(u.pathname==='/config/public-config.js'&&opts.contact)return route.fulfill({contentType:mime['.js'],body:'window.SCWORK_PUBLIC_CONTACT='+JSON.stringify(opts.contact)});
     if(u.pathname==='/data/pricing-public-data.js'&&opts.rates)return route.fulfill({contentType:mime['.js'],body:'window.SCWORK_PRICING_PUBLIC='+JSON.stringify(opts.rates)});
     if(u.pathname==='/data/client-logos.js'&&opts.logos)return route.fulfill({contentType:mime['.js'],body:'window.SCWORK_CLIENT_LOGOS='+JSON.stringify(opts.logos)});
     if(u.pathname==='/assets/images/client-logos/qa.svg')return route.fulfill({contentType:mime['.svg'],body:'<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><rect width="40" height="20"/></svg>'});
     if(u.pathname==='/assets/images/client-logos/missing.webp')return route.fulfill({status:404,body:''});
     const file=path.join(root,decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));
     if(!file.startsWith(root+'/')||!fs.existsSync(file)||!fs.statSync(file).isFile()){
       missing.push(u.pathname);return route.fulfill({status:404,body:''});
     }
     return route.fulfill({path:file,contentType:mime[path.extname(file)]||'application/octet-stream'});
   });
   const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(({clipboard})=>{
     window.testClipboard='';
     Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{if(!clipboard)throw Error('Mock permission blocked');window.testClipboard=text;}}});
   },{clipboard:opts.clipboard!==false});
   const go=async s=>{await page.goto(origin+s,{waitUntil:'load'});};
   const fits=async()=>{const actual=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);assert(actual[0]<=actual[1]+1,'Horizontal overflow: '+actual);};
   const save=async name=>{if(snapshots){fs.mkdirSync(snapshots,{recursive:true});await page.screenshot({path:path.join(snapshots,name+'.png'),fullPage:true});}};
   try{await run({page,go,fits,save,external});assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert(requests.every(([,method])=>method==='GET'));}
   finally{await ctx.close();}
 }
 try{
   await scenario({width:1440},async({page,go,fits,save})=>{
     await go('/?lang=th');await fits();
     assert.equal(await page.locator('.header-cta').textContent(),'เช็กราคาเบื้องต้น');
     assert.equal(await page.locator('.header-cta').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 105, 0)');
     assert.equal(await page.locator('#heroCarousel img').count(),4);
     assert.equal(await page.locator('#client-logos').isVisible(),false);
     assert.equal(await page.locator('#scContactAssistant').isVisible(),false);
     assert.equal(await page.locator('a[href*="request-quote.html"],a[href*="pricing-calculator.html"]').count(),0);
     const paths=await page.locator('a[href*="smart-quote.html"]').evaluateAll(els=>els.map(a=>new URL(a.href).pathname));
     assert(paths.length>10&&paths.every(p=>p==='/smart-quote.html'));
     await page.locator('#pc-unified-cta').click();
     assert.equal(await page.locator('#specPanel').isVisible(),false);
     assert.equal(await page.locator('#totalRow').isVisible(),false);
     assert.equal(await page.locator('#lineCta').isVisible(),false);
     await page.locator('#copyCta').click();
     const msg=await page.evaluate(()=>window.testClipboard);
     assert.match(msg,/ขอคำแนะนำ/);assert.doesNotMatch(msg,/500|DEMO|NaN/);
     await go('/article.html?post=sticker-material-guide&lang=en');
     assert.match(await page.locator('#articleQuote').getAttribute('href'),/smart-quote\.html\?lang=en/);
     await go('/smart-quote.html?lang=en');await fits();await save('v174-desktop');
     assert.equal(await page.locator('#totalRow').isVisible(),false);
     assert.equal(await page.locator('input[type=file]').count(),0);
     assert.equal(await page.locator('body').innerText().then(s=>s.includes('DEMO')),false);
   });
   const contact={lineId:'@scwork-qa-only',officePhone:'020000000',lineUrl:'https://lin.ee/example-test',facebookUrl:'https://www.facebook.com/example-test'};
   await scenario({width:390,contact,logos:[{name:'No approval',src:'./assets/images/client-logos/qa.svg',approved:false},{name:'QA Logo',src:'./assets/images/client-logos/qa.svg',approved:true},{name:'Missing',src:'./assets/images/client-logos/missing.webp',approved:true}]},async({page,go,fits,external,save})=>{
     await go('/?lang=th');await fits();
     assert.equal(await page.locator('#topOfficePhone a').getAttribute('href'),'tel:020000000');
     assert(await page.locator('#client-logos').isVisible());
     await page.locator('#client-logos').scrollIntoViewIfNeeded();
     await page.waitForFunction(()=>document.querySelectorAll('.sc-logo-chip').length===2);
     await page.locator('#scContactAssistantToggle').click();
     assert.equal(await page.locator('#scContactAssistantActions a').count(),3);
     await page.locator('.hero .button--primary').click();
     assert.equal(await page.locator('#totalRow').isVisible(),false);
     const href=await page.locator('#mobileAction').getAttribute('href');
     assert.match(href,/^https:\/\/line\.me\/R\/oaMessage\/%40scwork-qa-only\/\?/);
     assert.match(decodeURIComponent(href),/5 × 5 ซม\./);
     const [popup]=await Promise.all([page.waitForEvent('popup'),page.locator('#mobileAction').click()]);
     await popup.waitForLoadState();await popup.close();
     assert(external.some(h=>h.includes('oaMessage')));
     await page.locator('#scLocaleTrigger').click();await page.locator('[data-locale=en]').click();
     assert.equal(await page.locator('[data-size="3x3"]').textContent(),'3 × 3 cm');
     await page.locator('[data-mode=guided]').click();
     await page.locator('#purpose').selectOption('outdoor');
     assert.equal(await page.locator('#material').inputValue(),'pvc-sqm');
     await page.locator('[data-mode=help]').click();await page.locator('#helpBrief').fill('Water resistant labels for a small batch');
     await page.locator('input[name=artwork][value=link]').check();
     await page.locator('#artUrl').fill('https://example.com/design?file=a&view=b');
     const payload=decodeURIComponent(await page.locator('#lineCta').getAttribute('href'));
     assert.match(payload,/Sticker advice/);assert.match(payload,/file=a&view=b/);assert.doesNotMatch(payload,/100 × 100|500 pcs/);
     await fits();await save('v174-mobile');
     await page.locator('#artUrl').fill('javascript:bad');
     assert.equal(await page.locator('#copyCta').isDisabled(),true);
     assert.equal(await page.locator('#lineCta').isVisible(),false);
   });
   await scenario({width:320,contact:{lineUrl:contact.lineUrl},clipboard:false},async({page,go,fits})=>{
     await go('/smart-quote.html?lang=th&mode=help');await fits();
     assert.equal(await page.locator('#lineCta').getAttribute('href'),contact.lineUrl);
     await page.locator('#copyCta').click();
     assert.equal(await page.locator('#manualCopy').isVisible(),true);
     assert.match(await page.locator('#manualCopy').inputValue(),/ขอคำแนะนำ/);
     await go('/smart-quote.html?lang=zh');
     assert(await page.locator('#translationNote').isVisible());
     assert.equal(await page.locator('#quoteForm').getAttribute('lang'),'en');
     await fits();
   });
   await scenario({width:768,contact,rates},async({page,go,fits})=>{
     await go('/smart-quote.html?lang=en');
     assert.equal(await page.locator('#totalRow').isVisible(),true);
     const initial=await page.locator('#sumTotal').textContent();
     await page.locator('[data-qty="3000"]').click();
     assert.notEqual(await page.locator('#sumTotal').textContent(),initial);
     await page.locator('input[name=artwork][value=link]').check();
     await page.locator('#artUrl').fill('https://example.com/'+ 'a'.repeat(1460)+'?x='+'%20'.repeat(5));
     assert.equal(await page.locator('#lineCta').getAttribute('href'),contact.lineUrl);
     await page.locator('#copyCta').click();
     assert((await page.evaluate(()=>window.testClipboard)).endsWith('%20'.repeat(5)));
     await page.locator('[data-preset="diecut"]').click();
     assert.equal(await page.locator('#totalRow').isVisible(),false);
     await page.locator('[data-preset="large"]').click();
     assert.equal(await page.locator('#totalRow').isVisible(),true);
     await fits();
   });
   console.log('PASS browser: 1440/768/390/320px, TH/EN and fallback, homepage and article CTAs, configured/missing contacts, approved logo and missing asset, copy denied, short/long LINE drafts, invalid artwork link, reviewed quote and manual review.');
 } finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
