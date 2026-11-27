(function motion(){
'use strict';
const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)');let observer,frame=0;const seen=new WeakSet();
function progress(){frame=0;const threshold=window.innerHeight*.58;document.querySelectorAll('[data-sc-step]').forEach(el=>{const r=el.getBoundingClientRect(),amount=Math.max(0,Math.min(1,(threshold-r.top)/Math.max(r.height,1)));el.style.setProperty('--study-progress',String(reduce?.matches?1:amount));});}
function schedule(){if(!frame)frame=requestAnimationFrame(progress);}
function scan(){if(!reduce?.matches&&'IntersectionObserver' in window){if(!observer)observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('sc-reveal-visible');observer.unobserve(entry.target);}}},{threshold:.06});document.querySelectorAll('[data-sc-reveal]').forEach(el=>{if(seen.has(el))return;seen.add(el);const card=el.closest('.sc-portfolio__grid,.portfolio-gallery,.sc-work-related-grid');if(card){const i=Array.from(card.children).indexOf(el);el.style.setProperty('--study-delay',((Math.max(0,i)%3)*90)+'ms');}const r=el.getBoundingClientRect();if(r.bottom<=0){el.classList.add('sc-reveal-visible');return;}el.classList.add('sc-reveal-ready');observer.observe(el);});}schedule();}
window.SCWORK_REVEAL=scan;window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});window.addEventListener('load',schedule,{once:true});reduce?.addEventListener?.('change',scan);document.addEventListener('DOMContentLoaded',scan);scan();
})();
