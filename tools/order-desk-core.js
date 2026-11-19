/* Staff-only order desk. Produces separate public status and private reorder artifacts. */
(function(root){
  'use strict';
  const project=root.SCWORK_PROJECT_DESK||(typeof require==='function'?require('./project-desk-core.js'):null);
  const follow=root.SCWORK_ORDER_FOLLOWUP||(typeof require==='function'?require('../src/scripts/order-followup-core.js'):null);
  const brief=root.SCWORK_PROJECT_BRIEF||(typeof require==='function'?require('../src/scripts/project-brief.js'):null);
  const schema='scwork-order-desk-v1';
  const approval=s=>!!(s.desk.project.owner&&project.applicable(s.desk.project,s.desk.approval));
  function fromDesk(data){
    if(data?.schema!==project.schema)throw Error('PROJECT');
    return project.unpack(data);
  }
  function open(data,newToken=follow.token){
    if(data?.schema===project.schema){
      const token=newToken();if(!follow.validToken(token))throw Error('TOKEN');
      return {schema,desk:fromDesk(data),token,lastExport:null,deliveredKey:'',items:null};
    }
    if(data?.schema!==schema||!follow.validToken(data.token))throw Error('ORDER');
    const desk=fromDesk(data.desk),lastExport=data.lastExport?follow.status(data.lastExport,data.token):null;
    if(lastExport&&lastExport.reference!==desk.project.reference)throw Error('REFERENCE');
    const items=data.items==null?null:packItems(data.items,desk);
    const deliveredKey=lastExport?.stage==='delivered'&&typeof data.deliveredKey==='string'&&data.deliveredKey===project.binding(desk.project)?data.deliveredKey:'';
    return {schema,desk,token:data.token,lastExport,deliveredKey,items};
  }
  function merge(state,data){
    const next=fromDesk(data),before=state.desk.project,after=next.project;
    if(before.reference!==after.reference)throw Error('REFERENCE');
    for(const k of ['briefRevision','quoteRevision','proofRevision']){
      if(before[k]!==null&&(after[k]===null||after[k]<before[k]))throw Error('OLDER');
    }
    if(state.desk.brief&&next.brief&&before.briefRevision===after.briefRevision&&JSON.stringify(state.desk.brief.data)!==JSON.stringify(next.brief.data))throw Error('OLDER');
    const previousKey=project.binding(before),newKey=project.binding(after);
    if(state.lastExport?.stage==='delivered'&&previousKey!==newKey)throw Error('DELIVERED_SCOPE');
    return {...state,desk:next,items:previousKey===newKey?state.items:null};
  }
  function recordStatus(state,draft,at=new Date()){
    const lastExport=nextStatus(state,draft,at);
    const deliveredKey=lastExport.stage==='delivered'?
      (state.lastExport?.stage==='delivered'?state.deliveredKey:project.binding(state.desk.project)):'';
    return {...state,lastExport,deliveredKey};
  }
  function nextStatus(state,draft,at=new Date()){
    const current=state.lastExport,stage=draft.stage,onHold=draft.onHold;
    if(!follow.stages.includes(stage))throw Error('STATUS');
    const index=follow.stages.indexOf(stage);
    if(current&&index<follow.stages.indexOf(current.stage))throw Error('BACKWARD');
    if(index>=2&&!approval(state)&&(!onHold||!current||stage!==current.stage))throw Error('APPROVAL');
    if(onHold&&stage==='delivered')throw Error('HOLD');
    if(current&&at.getTime()<Date.parse(current.updatedAt))throw Error('TIME');
    return follow.status({schema:follow.statusSchema,token:state.token,reference:state.desk.project.reference,stage,onHold,target:draft.target,
      updatedAt:at.toISOString(),version:(current?.version||0)+1});
  }
  function packItems(items,desk){
    const normalized=follow.confirmedItems(items);
    if(desk.brief&&normalized.length!==desk.brief.data.items.length)throw Error('ITEMS');
    const names=normalized.map(i=>i.name.trim().toLowerCase());
    if(new Set(names).size!==names.length)throw Error('DUPLICATE');
    return normalized;
  }
  function repeatFile(state,raw,checked){
    if(!checked||!approval(state)||state.lastExport?.stage!=='delivered'||state.lastExport.onHold||
      !state.deliveredKey||state.deliveredKey!==project.binding(state.desk.project))throw Error('REPEAT_NOT_READY');
    const items=packItems(raw,state.desk);
    return follow.repeat({schema:follow.repeatSchema,reference:state.desk.project.reference,proof:state.desk.approval.proof,items});
  }
  function link(base,token,lang='th'){
    if(!follow.validToken(token))throw Error('TOKEN');
    const u=new URL(base);
    if(u.username||u.password||u.search||u.hash||!(u.protocol==='https:'||(u.protocol==='http:'&&['localhost','127.0.0.1'].includes(u.hostname))))throw Error('BASE');
    if(!u.pathname.endsWith('/'))u.pathname+='/';
    const target=new URL('order-tracking.html',u);
    target.searchParams.set('lang',lang==='en'?'en':'th');
    target.hash=token;
    return target.href;
  }
  const api=Object.freeze({schema,approval,open,merge,nextStatus,recordStatus,packItems,repeatFile,link});
  root.SCWORK_ORDER_DESK=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
