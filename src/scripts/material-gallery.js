/* Home sticker material cards. The image links work even without the modal. */
(()=>{
  'use strict';
  const doc=document,root=doc.getElementById('materials');
  if(!root)return;
  const get=id=>doc.getElementById(id);
  const modal=get('scMaterialsPreview'),close=get('scMaterialsClose');
  const previewImage=get('scMaterialsPreviewImage');
  const previewTitle=get('scMaterialsPreviewTitle'),previewDetail=get('scMaterialsPreviewDetail');
  const cards=[...root.querySelectorAll('[data-material]')].map(card=>{
    const title=card.querySelector('.sc-material__name');
    const detail=card.querySelector('.sc-material__detail');
    const link=card.querySelector('.sc-material__zoom');
    return {id:card.dataset.material,title,detail,link,img:link.querySelector('img'),en:[title.textContent,detail.textContent]};
  });
  const content={
    'paper-white':['สติกเกอร์กระดาษ','กระดาษขาวผิวด้าน เหมาะกับฉลากบนกล่อง ถุง และบรรจุภัณฑ์ที่ใช้งานในที่แห้ง','กระดาษขาวผิวด้านที่เผยให้เห็นมุมสติกเกอร์ลอกขึ้น'],
    'kraft-paper':['สติกเกอร์กระดาษคราฟต์','กระดาษสีน้ำตาลธรรมชาติ เห็นเส้นใยบาง ๆ เหมาะกับงานที่อยากได้โทนอบอุ่น','กระดาษคราฟต์สีน้ำตาลธรรมชาติพร้อมรายละเอียดเส้นใย'],
    'pp-white':['สติกเกอร์ PP ขาว','ฟิล์มพีพีขาวทึบ ผิวเรียบ เหมาะกับฉลากที่ต้องการพื้นขาวให้ลายพิมพ์เด่น','ฟิล์มพีพีขาวทึบผิวเรียบและเงาบริเวณมุมที่ลอกขึ้น'],
    'pp-clear':['สติกเกอร์ PP ใส','ฟิล์มพีพีโปร่งใส มองเห็นสีและพื้นผิวของบรรจุภัณฑ์ผ่านบริเวณที่ไม่ได้พิมพ์','ฟิล์มพีพีใสที่มองเห็นลายพื้นผิวด้านล่างผ่านตัวสติกเกอร์'],
    'pvc-white':['สติกเกอร์ PVC','ไวนิลขาวทึบและยืดหยุ่น เหมาะกับงานตกแต่งและพื้นผิวที่สัมผัสความชื้น','ฟิล์มไวนิลขาวทึบพร้อมหยดน้ำบนผิว']
  };
  let active=null;
  const isThai=()=>doc.documentElement.lang.toLowerCase().split('-')[0]==='th';
  function drawPreview(card){
    previewImage.alt=card.img.alt;
    previewTitle.textContent=card.title.textContent;
    previewDetail.textContent=card.detail.textContent;
  }
  function translate(){
    const th=isThai();
    get('scMaterialsEyebrow').textContent=th?'วัสดุสติกเกอร์':'Sticker materials';
    get('materials-title').textContent=th?'ประเภทวัสดุที่มีให้เลือก':'Explore sticker materials';
    get('scMaterialsLead').textContent=th?'เทียบผิววัสดุทั้ง 5 แบบ ตั้งแต่กระดาษสำหรับฉลากทั่วไป ไปจนถึงฟิล์ม PP และ PVC เลือกให้เหมาะกับบรรจุภัณฑ์ พื้นผิวที่ติด และสภาพการใช้งาน':'Compare five surfaces side by side, from everyday paper labels to PP and PVC films. Choose a finish that suits your packaging, surface and conditions of use.';
    get('scMaterialsNote').textContent=th?'ภาพจำลองเพื่อเปรียบเทียบพื้นผิว สีและความเงาอาจต่างจากวัสดุจริง':'Images illustrate surface and finish. The supplied material may vary in colour and sheen.';
    close.setAttribute('aria-label',th?'ปิดภาพขยาย':'Close image preview');
    for(const card of cards){
      const [title,detail,alt]=th&&content[card.id]?content[card.id]:card.en;
      card.title.textContent=title;card.detail.textContent=detail;
      card.img.alt=alt||`${title}, close-up of the peeled corner`;
      card.link.setAttribute('aria-label',th?`ขยายภาพ ${title}`:`Enlarge image: ${title}`);
    }
    if(active)drawPreview(active);
  }
  for(const card of cards){
    card.link.addEventListener('click',event=>{
      if(typeof modal.showModal!=='function'||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      event.preventDefault();
      active=card;
      previewImage.src=card.link.href;
      drawPreview(card);
      if(!modal.open)modal.showModal();
      close.focus();
    });
  }
  close.addEventListener('click',()=>modal.close());
  modal.addEventListener('click',event=>{if(event.target===modal)modal.close();});
  modal.addEventListener('close',()=>{
    active?.link.focus();
    active=null;
  });
  window.addEventListener('scwork-site-updated',translate);
  translate();
})();
