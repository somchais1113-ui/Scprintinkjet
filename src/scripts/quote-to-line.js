/* SCWORK V1.5: Pure safe LINE prefill + customer-readable message builders. */
(function (root) {
  'use strict';
  function lineId(id){return typeof id==='string' && /^@[A-Za-z0-9_.-]{2,30}$/.test(id.trim()) ? id.trim():'';}
  function lineUrl(id,text){const value=lineId(id);if(!value)return '';return 'https://line.me/R/oaMessage/'+encodeURIComponent(value)+'/?'+encodeURIComponent(String(text).slice(0,1800));}
  function validArtworkLink(input){
    if(!input||typeof input!=='string')return false;
    if(input.length>1500)return false;
    try{const u=new URL(input);return ['http:','https:'].includes(u.protocol) && !!u.hostname && !u.username && !u.password;}catch{return false;}
  }
  function money(value,lang){return new Intl.NumberFormat(lang==='th'?'th-TH':'en-US',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value);}
  function buildMessage(d,lang){
    const th=lang==='th';const lines=th?['SCWORK | ขอประเมินราคาสติกเกอร์','------------------------'] : ['SCWORK | Sticker quote inquiry','------------------------'];
    const put=(thKey,enKey,value)=>lines.push((th?thKey:enKey)+': '+String(value));
    put('ประเภท','Type',d.category);put('วัสดุ','Material',d.material);
    put('ขนาด','Size',d.width+' × '+d.height+' cm');put('จำนวน','Quantity',d.quantity+' pcs');
    put('การตัด','Cut',d.cut);if(d.addons)put('ตัวเลือกเสริม','Add-ons',d.addons);
    if(d.result){put('ราคาประเมิน (รวม VAT)','Estimated price (incl. VAT)',money(d.result.total,lang)+' THB');if(d.rateVersion)put('Rate Card','Rate Card',d.rateVersion);}
    else put('ราคา','Price',th?'ขอให้เจ้าหน้าที่ประเมิน':'Please evaluate manually');
    put('Artwork','Artwork',d.artwork);
    if(d.artworkUrl)put('ลิงก์ไฟล์','Artwork link',d.artworkUrl);
    lines.push('------------------------');
    lines.push(d.result?.demonstrationOnly ? (th?'DEMO: ราคาเป็นเพียงตัวเลขทดสอบ ไม่ใช่ใบเสนอราคายืนยัน กรุณาตรวจไฟล์/สเปก/ค่าส่งก่อนผลิต':'DEMO reference price, NOT a confirmed sales quote. Please verify artwork, specifications and shipping before production.') : (th?'ราคาประเมินจาก Rate Card ที่ตรวจแล้ว ยังต้องตรวจสเปก Artwork และค่าส่งก่อนยืนยันผลิต':'Estimate from reviewed rate card. Artwork, specifications and shipping must be confirmed before production.'));
    return lines.join('\n');
  }
  const api={lineId,lineUrl,validArtworkLink,buildMessage};root.SCWORK_QUOTE_TO_LINE=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
