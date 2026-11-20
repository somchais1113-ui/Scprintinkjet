import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import vm from 'node:vm';
import './validate-v216.mjs';
const url=file=>new URL('../'+file,import.meta.url);
const read=file=>readFileSync(url(file),'utf8');
const html=read('index.html');
assert.match(html,/data\/site-data\.js\?v=2\.1\.[78]/);
assert.equal([...html.matchAll(/materials\/[^"\/]+\.webp\?v=2\.1\.7/g)].length,20);
for(const id of ['paper-white','kraft-paper','pp-white','pp-clear','pvc-white']){
  const path='assets/images/materials/'+id+'-400.webp';
  assert.equal(readFileSync(url(path)).subarray(8,12).toString(),'WEBP');
  assert(html.includes(path+'?v=2.1.7 400w'));
}
const expected={
  services:['product-labels-v217','die-cut-stickers-v217','window-graphics-v217'],
  team:['artwork-review-v217','material-print-v217','finishing-handover-v217']
};
const logo=read('assets/images/source/materials/swatch-mark.svg');
assert.match(logo,/viewBox="0 0 800 800"/);
assert.match(logo,/#0E244A/);
assert.match(logo,/#FF6900/);
const context={window:{}};
vm.runInNewContext(read('data/site-data.js'),context);
const site=context.window.PROCLEANING_SITE;
for(const [group,ids] of Object.entries(expected)){
  const paths=site[group].map(card=>card.image);
  const initial=ids.map(id=>'./assets/images/'+group+'/'+id+'.webp');
  const permitted=group==='team'?[initial,initial.map(path=>path.replace('-v217','-v218'))]:[initial];
  assert(permitted.some(alternative=>JSON.stringify(paths)===JSON.stringify(alternative)));
  for(const path of initial){
    const file=readFileSync(url(path));
    assert.equal(file.subarray(8,12).toString(),'WEBP');
    assert(existsSync(url('assets/images/source/home-photography/'+path.split('/').pop().replace('.webp','.png'))));
  }
}
assert.doesNotMatch(read('smart-quote.html'),/-v217\.webp/);
console.log('PASS V2.1.7: six topic-specific image assets, versioned swatches, shared master symbol and unchanged quote imagery.');
