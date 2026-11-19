/* Check the configured data in this folder without calling LINE or publishing. */
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const req=createRequire(import.meta.url);
const engine=req('../src/scripts/pricing-engine.js'),phase=req('../src/scripts/label-quote-plan.js'),line=req('../src/scripts/quote-to-line.js');
const window={};
const context=vm.createContext({window});
for(const file of ['data/pricing-public-data.js','data/site-data.js','config/public-config.js']){
  vm.runInContext(readFileSync(new URL('../'+file,import.meta.url),'utf8'),context,{filename:file,timeout:1500});
}
const phasePlan=phase.prepare(window.SCWORK_PRICING_PUBLIC,engine);
if(phasePlan){
  console.log('PASS • Approved rate card: '+phasePlan.version);
  for(const q of phasePlan.options)console.log(q.quantity+' labels | '+q.total.toFixed(2)+' THB | '+q.perPiece.toFixed(2)+' THB/label');
  console.log('VAT applied: '+(phasePlan.vatRate*100).toLocaleString('en-US')+'% | shipping excluded');
}else console.log('ACTION • Export an approved white PP rate card that covers all three quantities.');
const site=window.PROCLEANING_SITE?.contact||{},cfg=window.SCWORK_PUBLIC_CONTACT||{};
const value=k=>String(site[k]||cfg[k]||'').trim();
const contact=line.resolveContact(value('lineId'),value('lineUrl'));
if(contact.id)console.log('PASS • LINE draft URL can be formed. Verify the actual shop account on a phone.');
else console.log('ACTION • Set the real LINE OA ID to activate prefill.'+(contact.url?' The current short link supports opening LINE and paste only.':''));
process.exitCode=phasePlan&&contact.id?0:1;
