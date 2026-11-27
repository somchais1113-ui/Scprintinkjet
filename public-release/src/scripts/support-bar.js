/* SCWork public help dock. No outbound contact unless it is present in public configuration. */
(()=>{
  'use strict';
  const doc=document;
  const root=doc.documentElement;
  const base=new URL('../../',doc.currentScript.src);
  const local=path=>new URL(path.replace(/^\.\//,''),base).href;
  const mount=()=>{
    if(doc.getElementById('scSupportBar'))return;
    const quotes=doc.querySelector('.q-mobile-bar');
    const flag=root.dataset;
    const ui=tag=>doc.createElement(tag);
    const el=(tag,cls,text)=>{
      const node=ui(tag);
      if(cls)node.className=cls;
      if(text)node.textContent=text;
      return node;
    };
    const bar=el('aside','sc-helpbar');
    bar.id='scSupportBar';
    const inner=el('div','sc-helpbar__inner');
    const bear=el('img','sc-helpbar__bear');
    bear.src=local('assets/images/support/scwork-support-bear.webp');
    bear.alt='';
    bear.width=300;bear.height=274;
    bear.decoding='async';
    const copy=el('div','sc-helpbar__copy');
    const title=el('strong','sc-helpbar__title'), subtitle=el('span','sc-helpbar__subtitle');
    copy.append(title,subtitle);
    const actions=el('div','sc-helpbar__actions');
    const qrLink=el('a','sc-helpbar__qr');
    const qr=el('img');
    qr.width=84;qr.height=84;qr.alt='';
    qr.addEventListener('error',()=>{qrLink.hidden=true;});
    qrLink.append(qr);
    const direct=el('a','sc-helpbar__button');
    const toggle=el('button','sc-helpbar__button');
    toggle.type='button';
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-controls','scSupportChannels');
    const panel=el('div','sc-helpbar__panel');
    panel.id='scSupportChannels';
    panel.hidden=true;
    const panelTitle=el('strong','sc-helpbar__panel-title');
    const list=el('ul','sc-helpbar__list');
    panel.setAttribute('role','region');
    panelTitle.id='scSupportChannelsHeading';
    panel.setAttribute('aria-labelledby',panelTitle.id);
    panel.append(panelTitle,list);
    actions.append(qrLink,direct,toggle,panel);
    inner.append(bear,copy,actions);
    bar.append(inner);

    const isThai=()=>root.lang.toLowerCase().split('-')[0]==='th';
    const words=()=>isThai()?{
      label:'ความช่วยเหลือจาก SCWork',title:'ให้เราช่วยเรื่องงานพิมพ์ไหม?',subtitle:'สอบถามเรื่องสเปก ราคา หรือการสั่งงานกับทีม SCWork',
      contact:'ติดต่อทีม',help:'ดูวิธีติดต่อ',channels:'เลือกช่องทางติดต่อ',line:'แชตทาง LINE',office:'โทรสำนักงาน',mobile:'โทรมือถือ',qr:'สแกนเพื่อแชตทาง LINE'
    }:{
      label:'SCWork support',title:'Need help with your print job?',subtitle:'Ask SCWork about specifications, pricing, or ordering.',
      contact:'Contact us',help:'Get help',channels:'Choose a contact channel',line:'Chat on LINE',office:'Call office',mobile:'Call mobile',qr:'Scan to chat on LINE'
    };
    function first(field,preferPublic=false){
      const site=window.PROCLEANING_SITE?.contact, pub=window.SCWORK_PUBLIC_CONTACT;
      const vals=[pub?.[field],site?.[field]];
      return vals.map(v=>String(v??'').trim()).find(Boolean)||'';
    }
    function safeHttps(raw,hosts){
      try{
        const u=new URL(raw);
        return u.protocol==='https:'&&hosts.includes(u.host)&&!u.username&&!u.password&&u.pathname!=='/'?u.href:'';
      }catch{return '';}
    }
    function phone(raw){
      if(!/^\+?[\d() .-]{7,24}$/.test(raw))return '';
      const plain=raw.replace(/[^+\d]/g,'');
      return /^\+?\d{8,15}$/.test(plain)?'tel:'+plain:'';
    }
    function bindLink(node,href){
      node.href=href;
      if(href.startsWith('https:')&&new URL(href).origin!==location.origin){node.target='_blank';node.rel='noopener noreferrer';}
      else {node.removeAttribute('target');node.removeAttribute('rel');}
    }
    function close(restore=false){
      if(panel.hidden)return;
      panel.hidden=true;
      toggle.setAttribute('aria-expanded','false');
      if(restore)toggle.focus();
    }
    toggle.addEventListener('click',()=>{
      if(!panel.hidden){close();return;}
      panel.hidden=false;
      toggle.setAttribute('aria-expanded','true');
      list.querySelector('a')?.focus();
    });
    doc.addEventListener('click',e=>{if(!bar.contains(e.target))close();});
    doc.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&!panel.hidden){e.preventDefault();close(true);}
    });

    let channelsSignature;
    function render(){
      const t=words();
      const lineId=first('lineId');
      const line=safeHttps(first('lineUrl'),['line.me','lin.ee'])||
        (/^@[a-z0-9_.-]{2,30}$/i.test(lineId)?'https://line.me/R/ti/p/'+encodeURIComponent(lineId):'');
      const possible=[
        [t.line,line],[t.office,phone(first('officePhone'))||phone(first('phone'))],[t.mobile,phone(first('mobilePhone'))],
        ['Facebook',safeHttps(first('facebookUrl',true),['www.facebook.com','facebook.com','fb.com'])],
        ['Messenger',safeHttps(first('messengerUrl',true),['m.me','www.facebook.com','facebook.com'])]
      ];
      const seen=new Set();
      const links=possible.filter(([,url])=>{
        if(!url||seen.has(url))return false;
        seen.add(url);
        return true;
      });
      const signature=JSON.stringify(links);
      if(signature!==channelsSignature){
        close();
        list.replaceChildren(...links.map(([label,url])=>{
          const li=el('li'), a=el('a','sc-helpbar__channel',label);
          bindLink(a,url);li.append(a);return li;
        }));
        channelsSignature=signature;
      }
      bar.setAttribute('aria-label',t.label);
      title.textContent=t.title;subtitle.textContent=t.subtitle;
      panelTitle.textContent=t.channels;toggle.textContent=t.contact;
      direct.hidden=links.length>1;
      toggle.hidden=links.length<2;
      const lang=/^[a-z]{2,3}(?:-[a-z]{2,8})?$/i.test(root.lang)?root.lang:'th';
      const current=new URL(location.href);
      const contact=current.pathname.endsWith('/smart-quote.html')&&current.searchParams.get('mode')==='help'?'#quoteForm':local('smart-quote.html?mode=help&lang='+encodeURIComponent(lang));
      direct.setAttribute('data-quote-label-preserve','');
      bindLink(direct,links[0]?.[1]||contact);
      direct.textContent=links.length?t.contact:t.help;
      if(links.length===1)direct.setAttribute('aria-label',links[0][0]);
      else direct.removeAttribute('aria-label');

      const qrAsset=String(window.SCWORK_PUBLIC_CONTACT?.supportLineQr||'').trim();
      const validQr=line&&/^\.\/assets\/images\/support\/[\w-]+\.(?:png|webp|svg)$/i.test(qrAsset);
      if(validQr){
        bindLink(qrLink,line);qrLink.setAttribute('aria-label',t.qr);
        if(qr.getAttribute('src')!==local(qrAsset)){qrLink.hidden=false;qr.src=local(qrAsset);}
      }else{
        qrLink.hidden=true;
        qr.removeAttribute('src');
      }
    }
    function measure(){
      root.style.setProperty('--sc-support-h',Math.ceil(bar.getBoundingClientRect().height)+'px');
      root.style.setProperty('--sc-quote-dock-h',Math.ceil(quotes?.getBoundingClientRect().height||0)+'px');
    }
    render();
    doc.body.append(bar);
    flag.scSupport='ready';
    measure();
    if(typeof ResizeObserver==='function'){
      const size=new ResizeObserver(measure);
      size.observe(bar);
      if(quotes)size.observe(quotes);
    }
    window.addEventListener('resize',measure,{passive:true});
    window.addEventListener('scwork-site-updated',()=>{render();measure();});
    window.addEventListener('scwork:locale-applied',()=>{render();measure();});
    if(typeof MutationObserver==='function')new MutationObserver(()=>{render();measure();}).observe(root,{attributes:true,attributeFilter:['lang']});
  };
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
