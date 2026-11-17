const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

async function renderReader(role='admin',failure=false) {
  const nodes=new Map(),dialogs=[],calls=[];
  const location={hash:'#knowledge/KB-0001'};
  let refreshes=0;
  function node() {
    const handlers={};
    return {handlers,disabled:false,textContent:'',innerHTML:'',
      addEventListener:(name,fn)=>{handlers[name]=fn;},focus(){},setAttribute(){}};
  }
  const body={querySelectorAll:()=>[]};
  const content={innerHTML:'',querySelector:()=>body,append:dialog=>{dialogs.push(dialog);}};
  const document={
    getElementById:id=>{if(!nodes.has(id)) nodes.set(id,node());return nodes.get(id);},
    createElement:()=>{
      const dialog=node(),children=new Map();
      dialog.querySelector=selector=>{if(!children.has(selector)) children.set(selector,node());return children.get(selector);};
      dialog.showModal=()=>{dialog.open=true;};
      dialog.remove=()=>{dialog.removed=true;};
      dialog.close=()=>{dialog.open=false;dialog.handlers.close?.();};
      return dialog;
    }
  };
  const article={id:'KB-0001',title:'Guia de teste',category:'Navegador',markdown:'### Como fazer\n\n1. Testar',status:'draft',updatedAt:'2026-11-17T10:00:00Z'};
  const rpc=async(method,...args)=>{
    calls.push({method,args});
    if(method==='getGuide') return article;
    if(method==='deleteGuide') {if(failure) throw new Error('Não foi possível remover.');return {ok:true};}
    throw new Error('Chamada inesperada: '+method);
  };
  const context=vm.createContext({window:{},document,location});
  const source=fs.readFileSync(path.join(__dirname,'../KnowledgeScripts.html'),'utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,'');
  vm.runInContext(source,context);
  await context.window.SupportFlowKnowledge.render({rpc,user:{role},content,isCurrent:()=>true,onChange:async()=>{refreshes++;},id:article.id});
  return {nodes,dialogs,calls,content,location,get refreshes(){return refreshes;}};
}

test('cancelar remoção não chama servidor; confirmar envia guia e versão e volta à base',async()=>{
  const ui=await renderReader();
  assert.match(ui.content.innerHTML,/Remover guia/);
  ui.nodes.get('remove-guide').handlers.click();
  let dialog=ui.dialogs.at(-1);
  assert.equal(dialog.open,true);
  assert.equal(ui.calls.filter(c=>c.method==='deleteGuide').length,0);
  dialog.querySelector('[data-cancel]').handlers.click();
  assert.equal(dialog.removed,true);
  assert.equal(ui.calls.filter(c=>c.method==='deleteGuide').length,0);
  ui.nodes.get('remove-guide').handlers.click();dialog=ui.dialogs.at(-1);
  await dialog.querySelector('[data-confirm]').handlers.click();
  const request=ui.calls.find(c=>c.method==='deleteGuide').args[0];
  assert.equal(request.id,'KB-0001');assert.equal(request.confirmId,'KB-0001');
  assert.equal(request.updatedAt,'2026-11-17T10:00:00Z');
  assert.equal(ui.location.hash,'#knowledge');assert.equal(ui.refreshes,1);assert.equal(dialog.removed,true);
});

test('falha ao remover mantém confirmação aberta e Atendimento não recebe ação de remoção',async()=>{
  const ui=await renderReader('admin',true);ui.nodes.get('remove-guide').handlers.click();
  const dialog=ui.dialogs.at(-1);
  await dialog.querySelector('[data-confirm]').handlers.click();
  assert.equal(dialog.open,true);assert.equal(dialog.querySelector('[data-confirm]').disabled,false);
  assert.match(dialog.querySelector('[data-status]').textContent,/Não foi possível remover/);
  assert.equal(ui.refreshes,0);
  const support=await renderReader('support');assert.doesNotMatch(support.content.innerHTML,/remove-guide/);
});
