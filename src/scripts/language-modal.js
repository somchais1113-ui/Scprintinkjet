/* SCWork v1.2 · accessible 14-language picker shared by storefront, quote form, article and estimator */
(() => {
 'use strict';
 const left = [
   ['ar','🇸🇦','العربية'],['zh','🇨🇳','简体中文'],['nl','🇳🇱','Nederlands'],
   ['en','🇬🇧','English'],['fr','🇫🇷','Français'],['de','🇩🇪','Deutsch'],
   ['it','🇮🇹','Italiano'],['ja','🇯🇵','日本語'],['ko','🇰🇷','한국어']
 ];
 const right = [
   ['my','🇲🇲','မြန်မာ'],['ru','🇷🇺','Русский'],['es','🇪🇸','Español'],
   ['th','🇹🇭','ไทย'],['vi','🇻🇳','Tiếng Việt']
 ];
 const langs=[...left,...right];
 const all=langs.map(x=>x[0]);
 window.SCWORK_LANGUAGES=all;
 const host=document.querySelector('[data-language-launcher]');
 if(!host)return;
 let lang=document.documentElement.lang||'th';
 const t=(value)=>String(value||'');
 const trigger=document.createElement('button');
 trigger.type='button';trigger.className='sc-language-trigger';trigger.id='scLocaleTrigger';
 trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-expanded','false');
 trigger.setAttribute('aria-controls','scLanguageModal');
 host.replaceChildren(trigger);
 const backdrop=document.createElement('div');backdrop.className='sc-language-backdrop';backdrop.hidden=true;
 backdrop.innerHTML=`<div class="sc-language-dialog" id="scLanguageModal" role="dialog" aria-modal="true" aria-labelledby="scLanguageHeading" tabindex="-1">
   <div class="sc-language-dialog__header"><div><p class="sc-language-kicker">SCWORK / LANGUAGE</p><h2 id="scLanguageHeading">Select your language <span lang="th">· เลือกภาษา</span></h2></div><button class="sc-language-close" type="button" aria-label="Close language selector">×</button></div>
   <div class="sc-language-columns">
     <div class="sc-language-column" data-lang-column="left"></div>
     <div class="sc-language-column" data-lang-column="right"></div>
   </div>
   <p class="sc-language-footnote">14 website languages · 14 ภาษาสำหรับหน้าเว็บไซต์ <span>Technical forms may retain English terms. / แบบฟอร์มเทคนิคบางจุดยังใช้ภาษาอังกฤษ</span></p>
 </div>`;
 document.body.appendChild(backdrop);
 const modal=backdrop.querySelector('.sc-language-dialog');
 const buttonMarkup=([code,flag,label])=>{
   const b=document.createElement('button');b.type='button';b.className='sc-language-option';b.dataset.locale=code;
   b.lang=code;b.setAttribute('aria-pressed','false');
   const flagSpan=document.createElement('span');flagSpan.className='sc-language-flag';flagSpan.textContent=flag;flagSpan.setAttribute('aria-hidden','true');
   const langSpan=document.createElement('span');langSpan.className='sc-language-name';langSpan.textContent=label;
   const marker=document.createElement('span');marker.className='sc-language-selected';marker.textContent='✓';marker.setAttribute('aria-hidden','true');
   b.append(flagSpan,langSpan,marker);
   b.addEventListener('click',()=>choose(code));
   return b;
 };
 left.forEach(x=>backdrop.querySelector('[data-lang-column="left"]').appendChild(buttonMarkup(x)));
 right.forEach(x=>backdrop.querySelector('[data-lang-column="right"]').appendChild(buttonMarkup(x)));
 let prior=null;
 function current(){
   const active=document.documentElement.lang;
   if(all.includes(active))return active;
   try{const saved=localStorage.getItem('procleaning-language');if(all.includes(saved))return saved;}catch{}
   return 'th';
 }
 function update(){
   lang=current();const record=langs.find(item=>item[0]===lang)||['th','🇹🇭','ไทย'];
   trigger.replaceChildren();
   const icon=document.createElement('span');icon.textContent='◉';icon.className='sc-language-globe';icon.setAttribute('aria-hidden','true');
   const flag=document.createElement('span');flag.textContent=record[1];flag.setAttribute('aria-hidden','true');
   const name=document.createElement('strong');name.textContent=lang.toUpperCase();
   const arrow=document.createElement('span');arrow.textContent='⌄';arrow.setAttribute('aria-hidden','true');
   trigger.append(icon,flag,name,arrow);
   trigger.setAttribute('aria-label',`Choose website language, current ${record[2]}`);
   backdrop.querySelectorAll('.sc-language-option').forEach(b=>{
     const selected=b.dataset.locale===lang;b.setAttribute('aria-pressed',String(selected));b.classList.toggle('is-selected',selected);
   });
 }
 function open(){prior=document.activeElement;backdrop.hidden=false;document.body.classList.add('sc-language-open');trigger.setAttribute('aria-expanded','true');update();
   const active=backdrop.querySelector('.sc-language-option.is-selected')||backdrop.querySelector('.sc-language-option');active?.focus();}
 function close(){backdrop.hidden=true;document.body.classList.remove('sc-language-open');trigger.setAttribute('aria-expanded','false');(prior||trigger).focus();}
 function choose(code){if(!all.includes(code))return;close();try{localStorage.setItem('procleaning-language',code);}catch{}
   document.documentElement.lang=code;
   window.dispatchEvent(new CustomEvent('scwork:locale-change',{detail:{code}}));update();}
 trigger.addEventListener('click',()=>backdrop.hidden?open():close());
 backdrop.querySelector('.sc-language-close').addEventListener('click',close);
 backdrop.addEventListener('mousedown',e=>{if(e.target===backdrop)close();});
 document.addEventListener('keydown',e=>{
   if(backdrop.hidden)return;
   if(e.key==='Escape'){e.preventDefault();close();return;}
   if(e.key!=='Tab')return;
   const focusable=[...backdrop.querySelectorAll('button:not([disabled])')];
   const first=focusable[0],last=focusable.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 });
 window.addEventListener('scwork:locale-applied',update);
 const obs=new MutationObserver(update);obs.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 update();
})();
