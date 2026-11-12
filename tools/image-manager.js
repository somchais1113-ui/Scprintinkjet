(() => {
  'use strict';
  const data = window.PC_IMAGE_MANIFEST;
  const $ = id => document.getElementById(id);
  const list = $('slotList');
  let selectedIndex = 0, userImage = null, objectUrl = null;
  if (!data || !data.images?.length) { $('status').textContent = 'Cannot load manifest.js'; return; }
  const slots = data.images;
  $('assetCount').textContent = `(${slots.length})`;
  slots.forEach((s, i) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'slot';
    button.innerHTML = `<img src="../${s.path}" alt=""><span><strong></strong><small></small></span>`;
    button.querySelector('strong').textContent = s.slot;
    button.querySelector('small').textContent = `${s.path.split('/').slice(-2).join('/')} · ${s.width}×${s.height}`;
    button.addEventListener('click', () => pickSlot(i));
    list.append(button);
  });
  function pickSlot(i) {
    selectedIndex=i;
    slots.forEach((_,index)=>list.children[index].classList.toggle('selected',index===i));
    const slot=slots[i];
    $('slotTitle').textContent = slot.slot;
    $('slotHelp').textContent = `Recommended output ${slot.width} × ${slot.height} px — ${slot.alt}`;
    $('currentImage').src = `../${slot.path}`;
    $('currentPath').textContent = slot.path;
    $('currentSize').textContent = 'Replace this file with the downloaded image, preserving the name and extension.';
    userImage = null;
    $('imageInput').value = '';
    $('exportButton').disabled = true;
    $('status').textContent = 'กรุณาอัปโหลดรูปภาพใหม่สำหรับตำแหน่งนี้';
    resetSliders();drawCurrent();
  }
  function drawCurrent() {
    const c=$('previewCanvas'),s=slots[selectedIndex];c.width=s.width;c.height=s.height;
    const ctx=c.getContext('2d');ctx.fillStyle='#e6f2e8';ctx.fillRect(0,0,c.width,c.height);
    const img=new Image();
    img.onload=()=>{ if(userImage || slots[selectedIndex]!==s)return;drawCover(ctx,img,s.width,s.height,1,.5,.45); };
    img.src=`../${s.path}`;
  }
  function drawCover(ctx,img,w,h,zoom,focusX,focusY) {
    const scale=Math.max(w/img.naturalWidth,h/img.naturalHeight)*zoom;
    const cw=Math.min(img.naturalWidth,w/scale),ch=Math.min(img.naturalHeight,h/scale);
    const sx=Math.max(0,(img.naturalWidth-cw)*focusX),sy=Math.max(0,(img.naturalHeight-ch)*focusY);
    ctx.clearRect(0,0,w,h);ctx.drawImage(img,sx,sy,cw,ch,0,0,w,h);
  }
  function render() {
    const s=slots[selectedIndex],c=$('previewCanvas');c.width=s.width;c.height=s.height;
    if(!userImage){drawCurrent();return;}
    drawCover(c.getContext('2d'),userImage,c.width,c.height,Number($('zoom').value)/100,Number($('focusX').value)/100,Number($('focusY').value)/100);
  }
  function resetSliders() { $('zoom').value='100';$('focusX').value='50';$('focusY').value='45';updateLabels(); }
  function updateLabels() { $('zoomValue').textContent=$('zoom').value+'%';$('xValue').textContent=$('focusX').value+'%';$('yValue').textContent=$('focusY').value+'%'; }
  function loadPhoto(file) {
    if(!file)return;
    if(!file.type.startsWith('image/')) { $('status').textContent='รูปแบบไฟล์ไม่ถูกต้อง กรุณาเลือกรูปภาพ';return; }
    if(objectUrl)URL.revokeObjectURL(objectUrl);
    objectUrl=URL.createObjectURL(file);
    const img=new Image();
    img.onload=()=>{userImage=img;resetSliders();render();$('exportButton').disabled=false;$('status').textContent=`โหลดรูปแล้ว: ${file.name} · ${img.naturalWidth}×${img.naturalHeight}px`;};
    img.onerror=()=>{$('status').textContent='Browser ไม่สามารถเปิดรูปนี้ได้ ลองใช้ JPG หรือ PNG';};
    img.src=objectUrl;
  }
  $('imageInput').addEventListener('change',e=>loadPhoto(e.target.files?.[0]));
  const drop=$('dropArea');
  for(const name of ['dragenter','dragover'])drop.addEventListener(name,e=>{e.preventDefault();drop.classList.add('drag')});
  for(const name of ['dragleave','drop'])drop.addEventListener(name,e=>{e.preventDefault();drop.classList.remove('drag')});
  drop.addEventListener('drop',e=>loadPhoto(e.dataTransfer?.files?.[0]));
  for(const id of ['zoom','focusX','focusY'])$(id).addEventListener('input',()=>{updateLabels();render();});
  $('resetButton').addEventListener('click',()=>{resetSliders();render()});
  $('exportButton').addEventListener('click',()=>{
    if(!userImage)return;
    render();
    const slot=slots[selectedIndex],filename=slot.path.split('/').pop();
    $('previewCanvas').toBlob(blob=>{
      if(!blob || blob.type!=='image/webp'){$('status').textContent='Browser นี้ไม่รองรับ WebP Export กรุณาใช้ Chrome, Edge, Firefox หรือ Safari รุ่นใหม่';return;}
      const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      $('status').textContent=`ดาวน์โหลด ${filename} แล้ว (${Math.round(blob.size/1024)} KB) — ให้นำไปทับไฟล์ ${slot.path}`;
    },'image/webp',.86);
  });
  window.addEventListener('beforeunload',()=>{if(objectUrl)URL.revokeObjectURL(objectUrl)});
  pickSlot(0);
})();
