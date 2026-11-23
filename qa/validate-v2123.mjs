import {readFileSync,existsSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const read=file=>readFileSync(join(root,file),'utf8');
const win={};vm.runInNewContext(read('data/site-data.js'),{window:win});
const posts=win.PROCLEANING_SITE.blogs;
assert.equal(posts.length,15);
assert.equal(new Set(posts.map(b=>b.id)).size,15);
const categories=new Set(posts.map(b=>b.category));
assert.deepEqual([...categories].sort(),['applications','durability','materials','production'].sort());
for(const post of posts){
 assert(post.title?.length>10&&post.translations?.th?.title?.length>10,post.id+' missing title');
 assert(post.body.split('## ').length>=6&&post.translations.th.body.split('## ').length>=6,post.id+' missing structured 5 sections');
 assert(post.text?.length>30&&post.translations.th.text?.length>30,post.id+' missing intro');
 assert(existsSync(join(root,post.image)),post.id+' missing image: '+post.image);
 assert(post.image.startsWith('./assets/images/knowledge/'));
}
assert.equal(posts[0].id,'sticker-material-guide');assert.equal(posts[8].id,'artwork-preflight');assert.equal(posts[9].id,'die-cut-versus-kiss-cut');
const home=read('index.html'),article=read('article.html'),hub=read('knowledge.html'),main=read('src/scripts/main.js'),ui=read('src/scripts/ui.js'),articleJs=read('src/scripts/article-page.js');
assert(home.includes('href="./knowledge.html"')&&home.includes('30-knowledge.css'));
assert(ui.includes('blog-card__title-link')&&ui.includes('blog-card__image-link'));
assert(main.includes('blogs.slice(0,3)')&&main.includes('knowledge.html?lang='));
assert(hub.includes('id="knowledgeGrid"')&&hub.includes('id="knowledgeSearch"'));
assert(article.includes('src="./assets/icons/scwork-logo.png"'));
assert(!articleJs.includes("$('articleBrand').replaceChildren"));
assert(articleJs.includes('articleToc')&&articleJs.includes('articleRelatedList'));
assert(existsSync(join(root,'src/styles/30-knowledge.css')));
const manifest=JSON.parse(read('assets/images/manifest.json'));
for(const post of posts){assert(manifest.images.find(img=>'./'+img.path===post.image),post.id+' missing image manager slot');}
console.log('V2.1.23 QA: 15 complete TH/EN articles, 4 categories, cover assets, image manager slots, article links and logo: PASS');
