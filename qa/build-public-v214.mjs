/* Build a deploy-only storefront, without legacy forms, workbench or demo data. */
import {cpSync, mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const dest=resolve(process.argv[2]||join(root,'public-release'));
if(existsSync(dest))throw Error('Choose a new output folder to avoid publishing old files.');
const follow=createRequire(import.meta.url)('../src/scripts/order-followup-core.js');
const statusFiles=[];
for(const entry of readdirSync(join(root,'order-status'),{withFileTypes:true})){
  if(entry.name==='index.html'&&entry.isFile())continue;
  const code=entry.name.slice(0,-5);
  if(!entry.isFile()||!entry.name.endsWith('.json')||!follow.validToken(code))throw Error('Unexpected file in order-status. Only public status JSON files belong here.');
  const raw=readFileSync(join(root,'order-status',entry.name),'utf8');
  if(raw.length>2048)throw Error('Invalid public status size: '+entry.name);
  statusFiles.push([entry.name,follow.status(JSON.parse(raw),code)]);
}
const items=[
  'index.html','article.html','smart-quote.html','product-labels.html','project-quote.html','order-tracking.html','order-status/index.html','.nojekyll','START_HERE_V1.8.1.md','START_HERE_V1.8.2.md','START_HERE_V1.9.md','START_HERE_V2.0.md','START_HERE_V2.1.md','START_HERE_V2.1.1.md','START_HERE_V2.1.2.md','START_HERE_V2.1.3.md','START_HERE_V2.1.4.md',
  'config/public-config.js','config/billing-config.js',
  ...['site-data','client-logos','extra-locales','quote-catalog','pricing-public-data','label-evidence'].map(s=>'data/'+s+'.js'),
  ...['config','content','ui','site-runtime','i18n','main','motion','commerce-enhancements','20-home-enhancements','language-modal','entry-cta','article-page','pricing-engine','label-quote-plan','quote-to-line','smart-quote','product-labels','label-evidence','project-brief','project-quote','order-followup-core','order-tracking','quote-billing','quote-billing-ui'].map(s=>'src/scripts/'+s+'.js'),
  ...['00-tokens','01-reset','02-layout','03-components','04-sections','05-responsive','06-editor-overrides','07-language','09-rfq-banner','10-hero-layout-fix','11-motion','12-article','12-blog-upgrade','13-spacing-system','14-sticker-transformation','15-commerce-enhancements','17-language-modal','18-cta-standard','19-smart-quote','19-social-proof-footer','21-product-labels','22-project-quote','23-order-followup','24-quote-billing','25-quote-cta-type'].map(s=>'src/styles/'+s+'.css'),
  'assets/icons','assets/images'
];
for(const path of items){
  mkdirSync(dirname(join(dest,path)),{recursive:true});
  cpSync(join(root,path),join(dest,path),{recursive:true,filter:src=>!/(?:\/source(?:\/|$)|\/README\.md$|\/(manifest\.js|manifest\.json|(?:SCWORK-ASSET-CONTACT-SHEET|asset-contact-sheet)\.jpg)$)/.test(src)});
}
for(const [name,status] of statusFiles)writeFileSync(join(dest,'order-status',name),JSON.stringify(status)+'\n','utf8');
console.log('Public storefront built at '+dest);
