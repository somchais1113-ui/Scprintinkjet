/* V2.1.71 — reference-style, decorative blurred card echoes. */
function bottomCards(cards){
 const columns=[];
 for(const card of cards){
  let col=columns.find(c=>Math.abs(c.x-card.x)<3);
  if(!col){col={x:card.x,card};columns.push(col);}
  else if(card.bottom>col.card.bottom)col.card=card;
 }
 return columns.sort((a,b)=>a.x-b.x).map(c=>c.card);
}
(function reflection(){
 'use strict';
 const root=document.getElementById('portfolio'),grid=root?.querySelector('.sc-portfolio__grid');
 if(!root||!grid)return;
 const compact=window.matchMedia('(max-width:560px)');
 const layer=document.createElement('div');
 layer.className='sc-portfolio__grid sc-concept-grid sc-reflection-layer';layer.setAttribute('aria-hidden','true');layer.setAttribute('inert','');root.append(layer);
 let frame=0;
 function update(){
  frame=0;
  if(compact.matches){layer.replaceChildren();return;}
  const rr=root.getBoundingClientRect(),gr=grid.getBoundingClientRect();
  if(!rr.width||!gr.width){layer.replaceChildren();return;}
  const cards=[...grid.children].filter(el=>el.matches('figure[data-work]')).map(el=>({el,x:el.offsetLeft,top:el.offsetTop,bottom:el.offsetTop+el.offsetHeight,width:el.offsetWidth})).filter(c=>c.width>0);
  const selected=bottomCards(cards);
  const gap=24,ox=gr.left-rr.left,oy=gr.top-rr.top;
  const clones=selected.map(({el,x,bottom,width})=>{
    const clone=el.cloneNode(true);
    clone.removeAttribute('data-work');clone.removeAttribute('data-sc-reveal');clone.removeAttribute('style');clone.removeAttribute('id');
    clone.classList.remove('sc-reveal-ready','sc-reveal-visible');clone.classList.add('sc-reflection-card');
    clone.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
    clone.querySelectorAll('a,button,input,select,textarea,[tabindex]').forEach(node=>{node.removeAttribute('href');node.setAttribute('tabindex','-1');node.removeAttribute('aria-label');});
    clone.querySelectorAll('img').forEach(img=>{img.alt='';img.loading='eager';img.removeAttribute('fetchpriority');});
    clone.style.setProperty('--reflect-x',`${ox+x}px`);clone.style.setProperty('--reflect-y',`${oy+bottom+gap}px`);clone.style.setProperty('--reflect-width',`${width}px`);
    return clone;
  });
  layer.replaceChildren(...clones);
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(update);}
 const observer=new MutationObserver(schedule);
 observer.observe(grid,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['src','alt','href']});
 if('ResizeObserver'in window){const ro=new ResizeObserver(schedule);ro.observe(grid);ro.observe(root);}
 window.addEventListener('resize',schedule,{passive:true});window.addEventListener('load',schedule,{once:true});grid.addEventListener('load',schedule,true);
 window.addEventListener('scwork:locale-applied',schedule);window.addEventListener('scwork-site-updated',schedule);compact.addEventListener?.('change',schedule);document.fonts?.ready?.then(schedule);schedule();
})();
