const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
test('loading acompanha ações concorrentes e é exibido no modal quando aberto',()=>{
  const window={};let dialog=null;
  const node=()=>({children:[],attributes:{},setAttribute(k,v){this.attributes[k]=v;},append(...items){this.children.push(...items);},remove(){this.removed=true;}});
  const body=node(),document={body,createElement:node,querySelectorAll:()=>dialog?[dialog]:[]};
  vm.runInNewContext(fs.readFileSync('Activity.html','utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,''),{window,document});
  const done1=window.SupportFlowActivity.begin('Carregando'),done2=window.SupportFlowActivity.begin('Salvando');
  assert.equal(body.children.length,1);const box=body.children[0];done1();assert.equal(box.removed,undefined);done1();assert.equal(box.removed,undefined);done2();assert.equal(box.removed,true);
  dialog=node();const done3=window.SupportFlowActivity.begin('Enviando');assert.equal(dialog.children.length,1);done3();assert.equal(dialog.children[0].removed,true);
});
