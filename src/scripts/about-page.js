(() => {
  'use strict';
  const supported=['ar','my','zh','ru','nl','es','en','th','fr','vi','de','it','ja','ko'];
  function saved(){try{return localStorage.getItem('procleaning-language')}catch{return null}}
  const query=new URLSearchParams(location.search).get('lang');
  const isAbout=document.body.classList.contains('sc-about-page');
  function localizeHome(code){document.querySelectorAll('[data-sc-about-link]').forEach(a=>{a.href='./about.html?lang='+encodeURIComponent(supported.includes(code)?code:'en')})}
  if(!isAbout){localizeHome(document.documentElement.lang);window.addEventListener('scwork:locale-applied',e=>localizeHome(e.detail?.code));return}
  const requested=supported.includes(query)?query:supported.includes(saved())?saved():'th';
  const lang=requested==='th'?'th':'en';
  document.documentElement.lang=lang;
  if(lang==='en')document.querySelectorAll('[data-en]').forEach(el=>el.textContent=el.dataset.en);
  document.querySelectorAll('[data-ab-local]').forEach(a=>{const u=new URL(a.getAttribute('href'),location.href);u.searchParams.set('lang',requested);a.href=u.pathname+u.search+u.hash});
  document.querySelector('.ab-language [hreflang="'+lang+'"]')?.setAttribute('aria-current','page');
  const menu=document.querySelector('.ab-menu'),nav=document.getElementById('ab-nav');
  menu.textContent=lang==='th'?'เมนู':'Menu';
  menu.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open))});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false')}});
})();