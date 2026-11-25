/* Shared public schemas. Tracking publishes only the allowlisted status fields. */
(function(root){
  'use strict';
  const brief=root.SCWORK_PROJECT_BRIEF||(typeof require==='function'?require('./project-brief.js'):null);
  const statusSchema='scwork-order-status-v1',repeatSchema='scwork-repeat-spec-v1';
  const stages=Object.freeze(['received','artwork','production','quality','ready','delivered']);
  const tokenPattern=/^[0-9a-f]{32}$/;
  const statusKeys=['schema','token','reference','stage','onHold','target','updatedAt','version'];
  const validToken=v=>typeof v==='string'&&tokenPattern.test(v);
  function token(random=globalThis.crypto){
    return Array.from(random.getRandomValues(new Uint8Array(16)),p=>p.toString(16).padStart(2,'0')).join('');
  }
  function onlyKeys(data,keys){
    return !!(data&&typeof data==='object'&&!Array.isArray(data)&&Object.keys(data).length===keys.length&&keys.every(k=>Object.hasOwn(data,k)));
  }
  function validStamp(value){
    if(typeof value!=='string'||!/^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value))return false;
    const ms=Date.parse(value);
    return Number.isFinite(ms)&&new Date(ms).toISOString()===value;
  }
  function status(input,expectedToken){
    if(!onlyKeys(input,statusKeys)||input.schema!==statusSchema||!validToken(input.token)||(expectedToken!==undefined&&input.token!==expectedToken)||
      !brief.validRef(input.reference)||!stages.includes(input.stage)||typeof input.onHold!=='boolean'||(input.stage==='delivered'&&input.onHold)||
      typeof input.target!=='string'||(input.target!==''&&!brief.validDate(input.target))||!validStamp(input.updatedAt)||
      !Number.isSafeInteger(input.version)||input.version<1)throw Error('STATUS');
    return Object.fromEntries(statusKeys.map(k=>[k,input[k]]));
  }
  const origin=brief.repeatOrigin;
  function confirmedItems(items){
    const keyset=['name','qty','width','height','material','note'];
    if(!Array.isArray(items)||items.some(i=>!onlyKeys(i,keyset)))throw Error('SPECS');
    const result=brief.payload({name:'Repeat',items}).items;
    if(result.some(i=>i.width===null||i.height===null||i.material==='undecided'||(i.material==='other'&&!i.note)))throw Error('SPECS');
    return result;
  }
  function repeat(input){
    if(!onlyKeys(input,['schema','reference','proof','items'])||input.schema!==repeatSchema)throw Error('REPEAT');
    return {schema:repeatSchema,...origin(input),items:confirmedItems(input.items)};
  }
  const api=Object.freeze({statusSchema,repeatSchema,stages,validToken,token,status,origin,confirmedItems,repeat});
  root.SCWORK_ORDER_FOLLOWUP=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
