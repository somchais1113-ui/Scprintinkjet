/* Build a deploy-only storefront, without legacy forms, workbench or demo data. */
import {cpSync, mkdirSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const dest=resolve(process.argv[2]||join(root,'public-release'));
if(existsSync(dest))throw Error('Choose a new output folder to avoid publishing old files.');
const items=[
  'index.html','article.html','smart-quote.html','.nojekyll',
  'config/public-config.js',
  ...['site-data','client-logos','extra-locales','quote-catalog','pricing-public-data'].map(s=>'data/'+s+'.js'),
  ...['config','content','ui','site-runtime','i18n','main','motion','commerce-enhancements','20-home-enhancements','language-modal','entry-cta','article-page','pricing-engine','quote-to-line','smart-quote'].map(s=>'src/scripts/'+s+'.js'),
  ...['00-tokens','01-reset','02-layout','03-components','04-sections','05-responsive','06-editor-overrides','07-language','09-rfq-banner','10-hero-layout-fix','11-motion','12-article','12-blog-upgrade','13-spacing-system','14-sticker-transformation','15-commerce-enhancements','17-language-modal','18-cta-standard','19-smart-quote','19-social-proof-footer'].map(s=>'src/styles/'+s+'.css'),
  'assets/icons','assets/images'
];
for(const path of items){
  mkdirSync(dirname(join(dest,path)),{recursive:true});
  cpSync(join(root,path),join(dest,path),{recursive:true,filter:src=>!/(?:\/source(?:\/|$)|\/README\.md$|\/(manifest\.js|manifest\.json|(?:SCWORK-ASSET-CONTACT-SHEET|asset-contact-sheet)\.jpg)$)/.test(src)});
}
console.log('Public storefront built at '+dest);
