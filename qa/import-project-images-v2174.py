"""Import four approved PNGs into SCWork. Run from repository root."""
from pathlib import Path
from PIL import Image, ImageOps
import json, re, io
root=Path(__file__).resolve().parent.parent
inputs=root/'qa/project-image-input-v2174'
base='assets/images/portfolio/concept-10'
mapping={
 'elitecraft':'ChatGPT Image Nov 28, 2026, 07_54_27 AM-1.png',
 'techmate':'ChatGPT Image Nov 28, 2026, 07_54_30 AM-2.png',
 'ecolabel':'ChatGPT Image Nov 28, 2026, 07_54_33 AM-3.png',
 'citrus':'ChatGPT Image Nov 28, 2026, 07_54_35 AM-4.png',
}
missing=[name for name in mapping.values() if not (inputs/name).is_file()]
if missing: raise SystemExit('Missing approved inputs: '+', '.join(missing))
pending={}
metadata={}
for project,name in mapping.items():
 with Image.open(inputs/name) as source:
  if source.format!='PNG': raise ValueError(name+' is not a PNG')
  source.load()
  image=ImageOps.exif_transpose(source).convert('RGB')
  w,h=image.size
  if w<1600 or h<900 or abs(w/h-16/9)>.04: raise ValueError(f'Unexpected input dimensions {name}: {w}x{h}')
  for kind,im in [('hero',image),('cover',ImageOps.fit(image,(1200,750),method=Image.Resampling.LANCZOS,centering=(1,.5)))]:
   path=f'{base}/{project}/{kind}-v2174.webp'
   buffer=io.BytesIO()
   im.save(buffer,format='WEBP',quality=88 if kind=='hero' else 86,method=6)
   raw=buffer.getvalue()
   with Image.open(io.BytesIO(raw)) as verify: verify.load()
   pending[path]=raw
   pending['public-release/'+path]=raw
   print(project,kind,im.size,len(raw),'bytes')
  metadata[project]={'hero':f'./{base}/{project}/hero-v2174.webp','cover':f'./{base}/{project}/hero-v2174.webp','heroDimensions':[w,h],'cardDimensions':[w,h]}
def put(path,s,mirror=False):
 raw=s.encode('utf-8')
 pending[path]=raw
 if mirror: pending['public-release/'+path]=raw
def read(p): return (root/p).read_text(encoding='utf-8')
def replace_once(s,old,new):
 if s.count(old)!=1: raise ValueError('Unexpected source marker: '+old[:100])
 return s.replace(old,new,1)
p=base+'/deep-case-data-v2167.js'
s=read(p)
s=re.sub(r'// BEGIN APPROVED VISUALS V2174\n.*?// END APPROVED VISUALS V2174\n','',s,flags=re.S)
insert='// BEGIN APPROVED VISUALS V2174\nconst approvedVisualsV2174='+json.dumps(metadata,ensure_ascii=False,separators=(',',':'))+';\nfor(const item of items){const v=approvedVisualsV2174[item.id];if(v){Object.assign(item,v);item.cover=item.image=item.hero;item.cardDimensions=[...item.heroDimensions];item.identityOnly=false;item.assetNotes="ภาพจำลองที่สร้างด้วย AI เพื่อสื่อแนวคิด ไม่ใช่ภาพผลงานลูกค้าจริง โลโก้บนภาพอาจต่างจากเวกเตอร์ต้นแบบ";}}\n// END APPROVED VISUALS V2174\n'
s=replace_once(s,'window.SCWORK_PORTFOLIO_ITEMS=items;',insert+'window.SCWORK_PORTFOLIO_ITEMS=items;')
put(p,s,True)
p='qa/public-manifest-v2172.json'
manifest=json.loads(read(p))
manifest['files']=sorted(set(manifest['files'])|{p for p in pending if p.endswith('.webp') and not p.startswith('public-release/')})
put(p,json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
for page in manifest['files']:
 if not page.endswith('.html'): continue
 s=read(page)
 updated=re.sub(r'deep-case-data-v2167\.js\?v=2\.1\.74(?:-assets1|-cover-sync2)?(?![\w-])','deep-case-data-v2167.js?v=2.1.74-cover-sync2',s)
 if s!=updated: put(page,updated,True)
p='qa/validate-release-v2172.mjs'
s=read(p)
old="assert(projects.find(p=>p.id==='ecolabel').cover.endsWith('cover-study-v2173.svg'));"
new="""for(const id of ['elitecraft','techmate','ecolabel','citrus']){
 const p=projects.find(p=>p.id===id);assert(p&&!p.identityOnly,id);
 assert(p.hero.endsWith('/hero-v2174.webp'),id);
 assert.equal(p.cover,p.hero,id+' cover must use hero source');
 assert.equal(p.image,p.hero,id+' fallback must use hero source');
 assert(p.heroDimensions[0]>=1600&&p.heroDimensions[1]>=900,id);
 assert.equal(p.cardDimensions.join('x'),p.heroDimensions.join('x'));
}"""
if old in s: s=replace_once(s,old,new)
elif new not in s: raise ValueError('Release test marker missing')
put(p,s)
p='qa/browser-release-v2174.cjs'
s=read(p)
old="      if(await image.count())await image.evaluate(img=>img.decode());"
new="""      if(await image.count())await image.evaluate(img=>img.decode());
      if(['case-elitecraft','case-techmate','case-ecolabel','case-citrus'].includes(name)){
       assert.equal(await image.count(),1);
       assert.equal(await page.locator('.sc-case-hero68--photo').count(),1);
       assert(await image.evaluate(e=>e.naturalWidth>=1600&&e.naturalHeight>=900&&e.src.endsWith('/hero-v2174.webp')&&getComputedStyle(e).objectFit==='cover'));
      }"""
# Keep the existing else paired with the original if; insert AFTER the existing else.
old_pair=old+"\n      else assert.equal(name,'case-ecolabel','Unexpected missing hero photograph');"
new_pair=old+"\n      else assert.fail('Missing hero photograph: '+name);"+new[len(old):]
if old_pair in s: s=replace_once(s,old_pair,new_pair)
elif new_pair not in s: raise ValueError('Browser test marker missing')
put(p,s)
p='CHANGELOG.md'
s=read(p)
log='# V2.1.74 — Approved project visuals\n\n- Imported four user-approved AI concept photographs for ELITECRAFT, TECHMATE, ECOLABEL and CITRUS. Native-resolution WebP heroes and 1200×750 cropped WebP covers, no enlargement. Existing logos, editorial hero overlay, slow zoom, scope cards and timelines retained.\n- Images remain design concepts, not confirmed client work. Source and public release synchronized.\n\n'
if not s.startswith(log): put(p,log+s,True)
for path,raw in pending.items():
 target=root/path
 target.parent.mkdir(parents=True,exist_ok=True)
 target.write_bytes(raw)
print('Imported four projects; run release and browser QA before merging.')
