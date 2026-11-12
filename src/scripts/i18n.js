/* ProCleaning v2.2: locale resolution shared by the website and the editor. */
(() => {
  'use strict';
  const supported=['en','th'];
  const copy=value=>JSON.parse(JSON.stringify(value));
  function normalize(raw){
    if(!raw || typeof raw!=='object') return raw;
    const site=copy(raw);
    const defaults=window.PROCLEANING_TRANSLATION_DEFAULTS?.i18n || window.PROCLEANING_SITE?.i18n || {};
    const defaultTh=defaults.th || {};
    site.schemaVersion=2;
    if(!site.i18n||typeof site.i18n!=='object')site.i18n={};
    if(!supported.includes(site.i18n.defaultLanguage))site.i18n.defaultLanguage='en';
    if(!site.i18n.th||typeof site.i18n.th!=='object')site.i18n.th={};
    for(const [section,fields] of Object.entries(defaultTh)){
      if(!Array.isArray(fields)&&fields&&typeof fields==='object'){
        site.i18n.th[section]={...fields,...(site.i18n.th[section]||{})};
      }else if(section==='features'){
        if(!Array.isArray(site.i18n.th.features))site.i18n.th.features=(defaultTh.features||[]).slice();
      }
    }
    for(const key of ['services','pricing','team','testimonials','blogs']){
      if(!Array.isArray(site[key]))site[key]=[];
      for(const item of site[key]){
        if(!item.translations||typeof item.translations!=='object')item.translations={};
        if(!item.translations.th||typeof item.translations.th!=='object')item.translations.th={};
        const defaultItem=window.PROCLEANING_TRANSLATION_DEFAULTS?.[key]?.[site[key].indexOf(item)];
        if(defaultItem && (item.title||item.name)===(defaultItem.title||defaultItem.name))item.translations.th={...(defaultItem.translations?.th||{}),...item.translations.th};
      }
    }
    // Stable IDs preserve article links after reordering in the editor.
    const ids=new Set();
    (site.blogs||[]).forEach((article,index)=>{
      let id=typeof article.id==='string'&&/^[a-z0-9][a-z0-9-]{0,90}$/i.test(article.id)?article.id:`article-${index+1}`;
      if(ids.has(id))id=`article-${index+1}-${ids.size}`;
      article.id=id;ids.add(id);
    });
    return site;
  }
  function mergeLocalized(base,overlay){
    const result={...base};
    for(const [key,val] of Object.entries(overlay||{})){
      if(val===null||val===undefined||val==='')continue; // incomplete translation falls back to EN
      if(Array.isArray(val)){
        result[key]=Array.isArray(base[key])?base[key].map((item,i)=>val[i]||item):val.slice();
      } else if(typeof val==='object' && !Array.isArray(base[key])){
        result[key]=mergeLocalized(base[key]||{},val);
      } else result[key]=val;
    }
    return result;
  }
  function resolve(raw,lang){
    const site=normalize(raw), language=supported.includes(lang)?lang:'en';
    if(language==='en')return site;
    const local=site.i18n?.th||{};
    for(const key of ['brand','navigation','hero','headings','labels','footer','contact'])site[key]=mergeLocalized(site[key]||{},local[key]);
    if(Array.isArray(local.features))site.features=site.features.map((v,i)=>local.features[i]||v);
    for(const key of ['services','pricing','team','testimonials','blogs']){
      site[key]=site[key].map(item=>mergeLocalized(item,item.translations?.th));
    }
    return site;
  }
  const readSaved=()=>{try{return localStorage.getItem('procleaning-language');}catch{return null;}};
  const persist=lang=>{try{localStorage.setItem('procleaning-language',lang);}catch{}};
  function initial(site){
    const fromUrl=new URLSearchParams(location.search).get('lang');
    if(supported.includes(fromUrl))return fromUrl;
    const saved=readSaved();
    if(supported.includes(saved))return saved;
    return supported.includes(site?.i18n?.defaultLanguage)?site.i18n.defaultLanguage:'en';
  }
  window.PROCLEANING_I18N={supported,normalize,resolve,initial,persist};
})();
