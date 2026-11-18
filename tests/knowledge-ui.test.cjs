const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

async function renderReader(role='admin',failure=false,returnTo='') {
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
    if(method==='publishGuides') {if(failure) throw new Error('Guia alterado. Recarregue.');return {published:1};}
    throw new Error('Chamada inesperada: '+method);
  };
  const context=vm.createContext({window:{},document,location});
  const source=fs.readFileSync(path.join(__dirname,'../KnowledgeScripts.html'),'utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,'');
  vm.runInContext(source,context);
  await context.window.SupportFlowKnowledge.render({rpc,user:{role},content,isCurrent:()=>true,onChange:async()=>{refreshes++;},id:article.id,returnTo});
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

test('guia consultado pelo diagnóstico oferece retorno direto no topo e no fim',async()=>{
  const ui=await renderReader('support',false,'diagnostics');
  assert.equal((ui.content.innerHTML.match(/Voltar ao diagnóstico/g)||[]).length,2);
  assert.match(ui.content.innerHTML,/href="#diagnostics"/);
  assert.doesNotMatch((await renderReader('support')).content.innerHTML,/Voltar ao diagnóstico/);
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

test('publicar guia requer confirmação e envia a versão exibida',async()=>{
  const ui=await renderReader();
  assert.match(ui.content.innerHTML,/Não publicado/);assert.doesNotMatch(ui.content.innerHTML,/Rascunho/);
  ui.nodes.get('publish-guide').handlers.click();
  const dialog=ui.dialogs.at(-1);
  assert.equal(ui.calls.some(c=>c.method==='publishGuides'),false);
  await dialog.querySelector('[data-confirm]').handlers.click();
  const request=ui.calls.find(c=>c.method==='publishGuides').args[0];
  assert.equal(request.confirm,true);assert.equal(request.guides[0].id,'KB-0001');
  assert.equal(ui.refreshes,1);
});

async function renderList({role='admin',missing=0,drafts=23,published=0,simpleUpdates=[],removedGuides=[]}={}) {
  const nodes=new Map();
  const node=()=>({addEventListener(){},querySelectorAll:()=>[]});
  const document={getElementById:id=>{if(!nodes.has(id)) nodes.set(id,node());return nodes.get(id);}};
  const content={innerHTML:'',querySelectorAll:()=>[]};
  const articles=Array.from({length:drafts+published},(_,i)=>({id:'KB-'+String(i+1).padStart(4,'0'),title:'Guia '+i,category:'Navegador',status:i<drafts ? 'draft' : 'published'}));
  const context=vm.createContext({window:{},document});
  const source=fs.readFileSync(path.join(__dirname,'../KnowledgeScripts.html'),'utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,'');
  vm.runInContext(source,context);
  await context.window.SupportFlowKnowledge.render({user:{role},content,isCurrent:()=>true,
    rpc:async()=>({summary:{total:articles.length,drafts,published},initialImport:role==='admin' ? {missing,total:23} : null,articles,categories:[],guidelines:'',simpleUpdates,removedGuides})});
  return content.innerHTML;
}

test('busca mantém filtros na aba e permite limpar sem sair da base',async()=>{
  const nodes=new Map(),calls=[];
  const node=id=>{if(!nodes.has(id))nodes.set(id,{handlers:{},elements:{query:{value:''},category:{value:''}},button:{},querySelector(){return this.button;},addEventListener(name,fn){this.handlers[name]=fn;}});return nodes.get(id);};
  const document={getElementById:node},window={},content={innerHTML:'',querySelectorAll:()=>[]};
  const rpc=async(method,query)=>{calls.push({...query});return {articles:[],categories:[],summary:{},guidelines:''};};
  vm.runInNewContext(fs.readFileSync('KnowledgeScripts.html','utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,''),{window,document});
  const options={user:{role:'support'},content,isCurrent:()=>true,rpc};
  await window.SupportFlowKnowledge.render(options);
  node('guide-search').elements.query.value='RPW';await node('guide-search').handlers.submit({preventDefault(){}});
  assert.equal(calls.at(-1).query,'RPW');await window.SupportFlowKnowledge.render(options);assert.equal(calls.at(-1).query,'RPW');
  await node('clear-guide-search').handlers.click();assert.equal(calls.at(-1).query,'');assert.equal(calls.at(-1).category,'');
});

test('oculta importar após cadastro completo e mostra publicação e envio em lote',async()=>{
  const html=await renderList();
  assert.doesNotMatch(html,/id="import-guides"/);
  assert.match(html,/Publicar 23 guia/);assert.match(html,/Enviar imagens em lote/);
  assert.doesNotMatch(html,/Rascunho/);
  const published=await renderList({drafts:0,published:23});
  assert.doesNotMatch(published,/id="publish-guides"|id="import-guides"/);
});

test('importação aparece somente quando há códigos faltando e ações admin não aparecem para atendimento',async()=>{
  assert.match(await renderList({missing:23,drafts:0}),/Importar 23 guias iniciais/);
  assert.match(await renderList({missing:2,drafts:21}),/Importar 2 guia\(s\) restante/);
  assert.doesNotMatch(await renderList({role:'support',drafts:0,published:23}),/id="publish-guides"|id="import-guides"|id="batch-images"/);
});

test('oferece simplificação somente quando há versões antigas elegíveis e perfil admin',async()=>{
  const simpleUpdates=[{id:'KB-0025',title:'Guia'}];
  assert.match(await renderList({simpleUpdates}),/Revisar 1 guia/);
  assert.doesNotMatch(await renderList(),/id="simplify-guides"/);
  assert.doesNotMatch(await renderList({role:'support',simpleUpdates}),/id="simplify-guides"/);
});

test('ação Removidos aparece para admin mesmo quando não há guias ativos, sem pedir reimportação',async()=>{
  const removedGuides=[{id:'KB-0025',title:'Removido'}];
  const html=await renderList({drafts:0,removedGuides});
  assert.match(html,/Removidos \(1\)/);assert.doesNotMatch(html,/id="import-guides"/);
  assert.doesNotMatch(await renderList({role:'support',removedGuides}),/id="removed-guides"/);
});

test('seleção múltipla usa apenas resultados visíveis e exige confirmação antes de remover',async()=>{
  const nodes=new Map(),dialogs=[],calls=[];
  function node() {const handlers={};return {handlers,checked:false,disabled:false,textContent:'',dataset:{},addEventListener:(name,fn)=>{handlers[name]=fn;},setAttribute(){},focus(){}};}
  const articles=[{id:'KB-0025',title:'Timing',updatedAt:'v1',status:'draft'},{id:'KB-0027',title:'Logs',updatedAt:'v2',status:'published'}];
  const boxes=articles.map((a,i)=>{const n=node();n.dataset.selectGuide=String(i);return n;});
  const content={innerHTML:'',querySelectorAll:selector=>selector==='[data-select-guide]' ? boxes : [],append:dialog=>dialogs.push(dialog)};
  const document={getElementById:id=>{if(!nodes.has(id)) nodes.set(id,node());return nodes.get(id);},createElement:()=>{
    const dialog=node(),children=new Map();dialog.querySelector=selector=>{if(!children.has(selector)) children.set(selector,node());return children.get(selector);};
    dialog.showModal=()=>{};dialog.close=()=>dialog.handlers.close?.();dialog.remove=()=>{};return dialog;
  }};
  let refreshed=0;
  const rpc=async(method,input)=>{
    calls.push({method,input});
    if(method==='listGuides') return {articles,summary:{total:28,published:1,drafts:27},categories:[],guidelines:'',initialImport:{total:28,missing:0}};
    if(method==='deleteGuides') return {removed:input.guides.length};
    throw Error(method);
  };
  const context=vm.createContext({window:{},document,location:{hash:'#knowledge'}});
  const source=fs.readFileSync(path.join(__dirname,'../KnowledgeScripts.html'),'utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,'');vm.runInContext(source,context);
  await context.window.SupportFlowKnowledge.render({rpc,user:{role:'admin'},content,isCurrent:()=>true,onChange:async()=>{refreshed++;}});
  const all=nodes.get('select-all-guides'),remove=nodes.get('remove-selected-guides');
  remove.handlers.click();assert.equal(dialogs.length,0);
  boxes[0].checked=true;boxes[0].handlers.change();assert.equal(remove.disabled,false);assert.equal(all.indeterminate,true);
  all.checked=true;all.handlers.change();assert.ok(boxes.every(box=>box.checked));
  assert.equal(nodes.get('guide-selection-count').textContent,'2 selecionado(s)');
  remove.handlers.click();assert.equal(dialogs.length,1);
  let dialog=dialogs.at(-1);assert.match(dialog.innerHTML,/KB-0025/);assert.match(dialog.innerHTML,/KB-0027/);assert.doesNotMatch(dialog.innerHTML,/KB-0026/);
  dialog.querySelector('[data-cancel]').handlers.click();assert.equal(calls.filter(c=>c.method==='deleteGuides').length,0);
  remove.handlers.click();dialog=dialogs.at(-1);await dialog.querySelector('[data-confirm]').handlers.click();
  const request=calls.find(c=>c.method==='deleteGuides').input;
  assert.equal(request.confirm,true);assert.equal(request.guides.map(a=>a.id).join(','),'KB-0025,KB-0027');assert.equal(refreshed,1);
  assert.doesNotMatch(await renderList({role:'support',drafts:0,published:2}),/data-select-guide|remove-selected-guides|select-all-guides/);
});
