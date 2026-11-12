/* Tiny dependency-free ZIP writer. STORE method, UTF-8 filenames, no compression. */
window.PC_ZIP = (()=>{
 const table=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=c&1?(c>>>1)^0xEDB88320:c>>>1;table[i]=c>>>0;}
 function crc32(bytes){let c=0xFFFFFFFF;for(const b of bytes)c=(c>>>8)^table[(c^b)&255];return (c^0xFFFFFFFF)>>>0;}
 function u16(v,n){v.setUint16(n.i,n.v,true);n.i+=2;}
 function push16(arr,x){arr.push(x&255,(x>>>8)&255);}
 function push32(arr,x){arr.push(x&255,(x>>>8)&255,(x>>>16)&255,(x>>>24)&255);}
 async function create(entries){const enc=new TextEncoder(),parts=[],central=[];let offset=0;const date=new Date();const t=(date.getHours()<<11)|(date.getMinutes()<<5)|(Math.floor(date.getSeconds()/2));const d=((date.getFullYear()-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate();
   for(const entry of entries){const name=entry.path.replace(/\\/g,'/').replace(/^\/+/, '');if(!name||name.includes('..'))throw Error('Unsafe path: '+name);const n=enc.encode(name);const buf=typeof entry.data==='string'?enc.encode(entry.data):new Uint8Array(await entry.data.arrayBuffer());const crc=crc32(buf);const header=[];push32(header,0x04034b50);push16(header,20);push16(header,0x0800);push16(header,0);push16(header,t);push16(header,d);push32(header,crc);push32(header,buf.length);push32(header,buf.length);push16(header,n.length);push16(header,0);parts.push(new Uint8Array(header),n,buf);
    const dir=[];push32(dir,0x02014b50);push16(dir,20);push16(dir,20);push16(dir,0x0800);push16(dir,0);push16(dir,t);push16(dir,d);push32(dir,crc);push32(dir,buf.length);push32(dir,buf.length);push16(dir,n.length);push16(dir,0);push16(dir,0);push16(dir,0);push16(dir,0);push32(dir,0);push32(dir,offset);central.push(new Uint8Array(dir),n);offset+=header.length+n.length+buf.length;
   }
   const cdLength=central.reduce((s,p)=>s+p.length,0),tail=[];push32(tail,0x06054b50);push16(tail,0);push16(tail,0);push16(tail,entries.length);push16(tail,entries.length);push32(tail,cdLength);push32(tail,offset);push16(tail,0);return new Blob([...parts,...central,new Uint8Array(tail)],{type:'application/zip'});
 }
 return {create};
})();
