function calcProgress(centers,threshold){const first=centers[0],last=centers[centers.length-1],height=Math.max(0,last-first),fill=Math.min(height,Math.max(0,threshold-first));return {height,fill,active:centers.map(y=>threshold>=y)};}
(function timeline(){
'use strict';
const root=document.querySelector('[data-case-timeline]');if(!root)return;
const nodes=[...root.querySelectorAll('[data-case-node]')],track=root.querySelector('.sc-case-track');if(!nodes.length||!track)return;
let frame=0;
function update(){frame=0;const bounds=root.getBoundingClientRect(),centers=nodes.map(node=>{const r=node.getBoundingClientRect();return r.top+r.height/2;});const first=nodes[0].getBoundingClientRect(),v=calcProgress(centers,innerHeight*.58);root.style.setProperty('--case-track-top',(centers[0]-bounds.top)+'px');root.style.setProperty('--case-track-left',(first.left+first.width/2-bounds.left)+'px');root.style.setProperty('--case-track-height',v.height+'px');root.style.setProperty('--case-track-fill',v.fill+'px');nodes.forEach((node,i)=>node.classList.toggle('is-active',v.active[i]));}
function schedule(){if(!frame)frame=requestAnimationFrame(update);}
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});window.addEventListener('load',schedule,{once:true});root.querySelectorAll('img').forEach(im=>im.addEventListener('load',schedule,{once:true}));if('ResizeObserver'in window)new ResizeObserver(schedule).observe(root);document.fonts?.ready?.then(schedule);update();
})();
