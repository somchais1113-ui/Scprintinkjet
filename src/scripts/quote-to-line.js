/* Local message formatting. Opening a LINE draft does not send a message. */
(function (root) {
  'use strict';
  function lineId(id){return typeof id==='string' && /^@[A-Za-z0-9_.-]{2,30}$/.test(id.trim()) ? id.trim():'';}
  function lineUrl(id,text=''){
    const value=lineId(id);
    if(!value)return '';
    const base='https://line.me/R/oaMessage/'+encodeURIComponent(value);
    return text ? base+'/?'+encodeURIComponent(String(text).replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,'\uFFFD')) : base;
  }
  function validArtworkLink(input){
    if(typeof input!=='string'||!input||input.length>1500||/\s/.test(input))return false;
    try{const u=new URL(input);return ['http:','https:'].includes(u.protocol)&&!!u.hostname&&!u.username&&!u.password;}catch{return false;}
  }
  const money=(value,lang)=>new Intl.NumberFormat(lang==='th'?'th-TH':'en-US',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
  function buildMessage(d,lang){
    const th=lang==='th',pick=(a,b)=>th?a:b;
    const lines=[d.help?pick('SCWORK | ขอคำแนะนำเรื่องสติกเกอร์','SCWORK | Sticker advice'):pick('SCWORK | ขอประเมินราคาสติกเกอร์','SCWORK | Sticker quote inquiry')];
    const put=(a,b,value)=>{if(value!==undefined&&value!==null&&String(value).trim())lines.push(pick(a,b)+': '+value);};
    if(d.help){
      put('การใช้งาน','Intended use',d.purpose);
      put('รายละเอียด','Details',d.brief);
      if(!d.purpose&&!d.brief)lines.push(pick('ขอคำแนะนำในการเลือกสติกเกอร์','I would like help choosing a sticker.'));
    } else {
      put('ประเภท','Type',d.category);put('วัสดุ','Material',d.material);
      if(d.width>0&&d.height>0)put('ขนาด','Size',d.width+' × '+d.height+pick(' ซม.',' cm'));
      if(d.quantity>0)put('จำนวน','Quantity',d.quantity+pick(' ชิ้น',' pcs'));
      put('การตัด','Cut',d.cut);put('ตัวเลือกเสริม','Add-ons',d.addons);
      if(d.result&&!d.result.demonstrationOnly&&Number.isFinite(d.result.total)){
        put(d.result.vatRate>0?'ราคาประเมิน (รวม VAT)':'ราคาประเมิน',d.result.vatRate>0?'Estimated price (incl. VAT)':'Estimated price',money(d.result.total,lang)+pick(' บาท',' THB'));
        put('ตารางราคา','Rate card',d.rateVersion);
        lines.push(pick('กรุณาตรวจไฟล์ สเปก และค่าส่งก่อนยืนยันราคา','Estimate from reviewed rate card. Please confirm artwork, specifications and shipping.'));
      }else put('ราคา','Price',pick('ขอให้ทีม SCWORK ประเมิน','Please provide a quote'));
    }
    put('ไฟล์งาน','Artwork',d.artwork);
    if(validArtworkLink(d.artworkUrl))put('ลิงก์ไฟล์','Artwork link',d.artworkUrl);
    return lines.join('\n');
  }
  const api={lineId,lineUrl,validArtworkLink,buildMessage};root.SCWORK_QUOTE_TO_LINE=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
