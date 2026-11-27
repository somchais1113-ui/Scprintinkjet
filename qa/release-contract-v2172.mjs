/* Public release safety contract. */
export function permitted(p){
 if(typeof p!=="string"||p.includes("\\")||p.split("/").some(x=>!x||x==="."||x==="..")||p.split("/").some(x=>/^\.(?!nojekyll$|gitkeep$)/.test(x)))return false;
 return /^(?:\.nojekyll|CHANGELOG\.md|START_HERE_V[\d.]+\.md|(?:index|about|article|credit-terms|delivery|design-services|order-tracking|portfolio-detail|portfolio|knowledge|product-labels|project-quote|smart-quote|standard-pricing)\.html|order-status\/index\.html|favicon(?:-[0-9]+x[0-9]+)?\.(?:png|ico)|scwork-icon-512\.png|config\/(?:public-config|billing-config)\.js|data\/(?:site-data|client-logos|extra-locales|label-evidence|portfolio-data|pricing-public-data|quote-catalog)\.js|src\/scripts\/[a-z0-9-]+\.js|src\/styles\/[a-z0-9-]+\.css|assets\/(?:icons|images)\/[\w./-]+\.(?:png|jpg|jpeg|webp|svg|ico|gif|avif|woff2?)|assets\/images\/client-logos\/actual\/\.gitkeep|assets\/images\/portfolio\/concept-10\/(?:concept-data|deep-case-data-v2167)\.js)$/i.test(p)&&!/(?:^|\/)(?:admin|private|demo|source|workbench|secrets)(?:\/|[-.])/i.test(p);
}
export function localPath(from,url){
 if(!url||/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url))return null;
 const p=url.split(/[?#]/)[0];if(!p)return null;
 const out=p.startsWith("/")?[]:from.split("/").slice(0,-1);
 for(const part of p.split("/")){if(part===".."){if(!out.length)throw Error("path escape: "+url);out.pop();}else if(part&&part!==".")out.push(part);}
 return out.join("/");
}
export function verifyHtml(path,html,set){
 const ids=[...html.matchAll(/\sid=["']([^"']+)["']/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)throw Error("Duplicate HTML id: "+path);
 for(const m of html.matchAll(/<(script|link|img|source|a)\b[^>]*?\b(src|href)=["']([^"']+)["'][^>]*>/gi)){
  const p=localPath(path,m[3]);if(p&&!set.has(p)&&!set.has(p+"/index.html"))throw Error("Unpublished reference: "+path+" → "+p);
 }
}
