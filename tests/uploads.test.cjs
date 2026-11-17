const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
function uploads(globals={}) {
  const source=fs.readFileSync(path.join(__dirname,'../KnowledgeUploads.html'),'utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,'');
  const context=vm.createContext({window:{},...globals});vm.runInContext(source,context);return context.window.SupportFlowUploads;
}
const file=name=>({name,type:'image/png',size:100});

test('insere imagens em Como fazer antes dos passos, preservando a ordem de envio',()=>{
  const u=uploads(),text='**Objetivo:** Testar\n\n### Como fazer\n\n1. Abrir Network\n\n2. Reproduzir\n\n**Referências:** Documentação';
  const first=u.placeImages(text,'![Primeira](sf-image:img-1)');
  const result=u.placeImages(first,'![Segunda](sf-image:img-2)');
  assert.ok(result.indexOf('### Como fazer')<result.indexOf('sf-image:img-1'));
  assert.ok(result.indexOf('sf-image:img-1')<result.indexOf('sf-image:img-2'));
  assert.ok(result.indexOf('sf-image:img-2')<result.indexOf('1. Abrir Network'));
  assert.ok(result.endsWith('**Referências:** Documentação'));
  assert.equal(u.placeImages(result),result);
});

test('reposiciona imagens antigas após referências sem duplicar nem mover imagens entre passos',()=>{
  const u=uploads();
  const original='### Como fazer\n\n1. Abrir\n\n![Detalhe do passo](sf-image:step)\n\n2. Conferir\n\n### O que o resultado significa\n\nResultado esperado\n\n**Referências:** Link\n\n![Antiga](sf-image:old)\n\n![Outra](sf-image:other)\n';
  const result=u.placeImages(original);
  assert.ok(result.indexOf('sf-image:old')<result.indexOf('1. Abrir'));
  assert.ok(result.indexOf('sf-image:other')<result.indexOf('1. Abrir'));
  assert.ok(result.indexOf('1. Abrir')<result.indexOf('sf-image:step'));
  assert.ok(result.indexOf('sf-image:step')<result.indexOf('2. Conferir'));
  assert.ok(result.endsWith('**Referências:** Link'));
  assert.equal(u.imageCount(result),3);assert.equal(u.placeImages(result),result);
  assert.equal(u.placeImages(result,'![Repetida](sf-image:old)'),result);
});

test('sem Como fazer, posiciona antes dos passos ou referências e preserva conteúdo sem imagens',()=>{
  const u=uploads();
  const text='Objetivo\r\n\r\n1. Testar\r\n\r\n**Referências:** Link';
  assert.equal(u.placeImages(text),text);
  const result=u.placeImages(text,'![Exemplo](sf-image:id)');
  assert.ok(result.indexOf('sf-image:id')<result.indexOf('1. Testar'));
  const refs=u.placeImages('Introdução\n\n**Referências:** Link','![Exemplo](sf-image:id)');
  assert.ok(refs.indexOf('sf-image:id')<refs.indexOf('**Referências:**'));
});

test('a leitura corrige imagens antigas sem gravar nem exigir novo upload',()=>{
  const context=vm.createContext({window:{}});
  for(const file of ['KnowledgeUploads.html','KnowledgeScripts.html']) {
    const source=fs.readFileSync(path.join(__dirname,'..',file),'utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,'');
    vm.runInContext(source,context);
  }
  const html=context.window.SupportFlowKnowledge.markdown('### Como fazer\n\n1. Testar\n\n**Referências:** Link\n\n![Exemplo](sf-image:id)');
  assert.ok(html.indexOf('data-guide-image="id"')<html.indexOf('<ol'));
  assert.ok(html.indexOf('<ol')<html.indexOf('Referências'));
  assert.equal((html.match(/data-guide-image=/g)||[]).length,1);
});

test('identifica códigos nos nomes e valida os arquivos individualmente',()=>{
  const u=uploads();assert.equal(u.fileCode('KB-0001-console.png'),'KB-0001');
  assert.equal(u.fileCode('kb-0018-objeto.png'),'KB-0018');
  assert.equal(u.fileCode('KB-00011.png'),'');assert.equal(u.fileCode('imagem.png'),'');
  assert.throws(()=>u.validateFile({...file('x'),size:2097153}),/2 MB/);
  assert.throws(()=>u.validateFile({...file('x'),type:'image/svg+xml'}),/PNG/);
});

test('envia várias imagens para o editor na ordem e não repete concluídas',async()=>{
  const u=uploads(),entries=[1,2].map(n=>({file:file('exemplo'+n+'.png'),guideId:'KB-0001',caption:'Exemplo '+n}));
  const calls=[],tokens=[];
  const rpc=async(method,input)=>{calls.push({method,input});return {id:'image-'+calls.length};};
  const result=await u.sendQueue({entries,rpc,read:async()=>'AAAA',onSuccess:(entry,token)=>tokens.push(token)});
  assert.equal(result.succeeded,2);assert.equal(result.failed,0);
  assert.match(tokens[0],/Exemplo 1.*image-1/);assert.match(tokens[1],/Exemplo 2.*image-2/);
  await u.sendQueue({entries,rpc,read:async()=>'AAAA'});assert.equal(calls.length,2);
});

test('envio por código anexa em guias diferentes e preserva status e conteúdo existentes',async()=>{
  const u=uploads(),guides={
    'KB-0001':{id:'KB-0001',markdown:'Texto inicial 1',status:'published',updatedAt:'v1'},
    'KB-0002':{id:'KB-0002',markdown:'Texto inicial 2',status:'draft',updatedAt:'v2'}
  };
  let counter=0;
  const entries=Object.keys(guides).map(guideId=>({file:file(guideId+'.png'),guideId,caption:'Exemplo'}));
  const rpc=async(method,input)=>{
    if(method==='getGuide') return {...guides[input]};
    if(method==='uploadGuideImage') return {id:'img-'+ ++counter};
    if(method==='saveGuide') {guides[input.id]={...input};return {ok:true};}
    throw Error(method);
  };
  const result=await u.sendQueue({entries,rpc,attach:true,read:async()=>'AAAA'});
  assert.equal(result.succeeded,2);assert.match(guides['KB-0001'].markdown,/Texto inicial 1.*\n\n!\[Exemplo\]/);
  assert.equal(guides['KB-0001'].status,'published');assert.equal(guides['KB-0002'].status,'draft');
  assert.match(guides['KB-0002'].markdown,/img-2/);
});

test('falha parcial permite repetir salvamento sem enviar novamente a imagem',async()=>{
  const u=uploads(),entries=[{file:file('KB-0001.png'),guideId:'KB-0001',caption:'Exemplo'}];
  let sends=0,saves=0,fail=true;
  const rpc=async(method)=>{
    if(method==='getGuide') return {id:'KB-0001',markdown:'Texto preservado',status:'draft'};
    if(method==='uploadGuideImage') {sends++;return {id:'img-1'};}
    if(method==='saveGuide') {saves++;if(fail) throw Error('Conflito de edição');return {ok:true};}
  };
  const first=await u.sendQueue({entries,rpc,attach:true,read:async()=>'AAAA'});
  assert.equal(first.failed,1);assert.match(entries[0].error,/Conflito/);assert.equal(entries[0].uploadedId,'img-1');
  fail=false;const second=await u.sendQueue({entries,rpc,attach:true,read:async()=>'AAAA'});
  assert.equal(second.succeeded,1);assert.equal(sends,1);assert.equal(saves,2);
});

test('não envia arquivo sem destino nem excede 12 referências; continua após erro individual',async()=>{
  const u=uploads();let sends=0;
  const entries=[{file:file('semcodigo.png'),guideId:'',caption:'Sem código'},
    {file:file('KB-0001.png'),guideId:'KB-0001',caption:'Cheio'},
    {file:file('KB-0002.png'),guideId:'KB-0002',caption:'Válido'}];
  const rpc=async(method,input)=>{
    if(method==='getGuide') return {id:input,markdown:input==='KB-0001' ? Array.from({length:12},(_,i)=>'![Imagem](sf-image:id-'+i+')').join('\n') : 'Texto',status:'draft'};
    if(method==='uploadGuideImage') {sends++;return {id:'img'};}
    if(method==='saveGuide') return {ok:true};
  };
  const result=await u.sendQueue({entries,rpc,attach:true,read:async()=>'AAAA'});
  assert.equal(result.succeeded,1);assert.equal(result.failed,2);assert.equal(sends,1);
  assert.match(entries[0].error,/Código KB/);assert.match(entries[1].error,/12 imagens/);
});

test('interrompe fila quando a página deixa de estar ativa',async()=>{
  const u=uploads();let active=true,calls=0;
  const entries=[1,2].map(n=>({file:file(n+'.png'),guideId:'KB-0001',caption:'Exemplo'}));
  await u.sendQueue({entries,read:async()=>'AAAA',isActive:()=>active,rpc:async()=>{calls++;active=false;return {id:'img'};}});
  assert.equal(calls,1);assert.equal(entries[0].uploadedId,'img');assert.equal(entries[1].uploadedId,undefined);
});

function batchUi() {
  const dialogs=[];
  function node() {
    const children=new Map(),handlers={};
    return {handlers,disabled:false,textContent:'',innerHTML:'',files:[],focusCount:0,
      addEventListener:(name,handler)=>{handlers[name]=handler;},
      querySelector:selector=>{if(!children.has(selector)) children.set(selector,node());return children.get(selector);},
      querySelectorAll:()=>[],setAttribute(){},focus(){this.focusCount++;},
      showModal(){this.open=true;},remove(){this.isConnected=false;},
      close(){this.open=false;this.handlers.close?.();}}
  }
  const document={createElement:()=>{const dialog=node();dialogs.push(dialog);return dialog;}};
  const content={append:dialog=>{dialog.isConnected=true;}};
  class FileReader {readAsDataURL(){this.result='data:image/png;base64,AAAA';this.onload();}}
  return {u:uploads({document,FileReader}),content,dialogs};
}

test('cliques repetidos durante abertura e após selecionar arquivos mantêm um único modal',async()=>{
  const ui=batchUi();let requests=0,resolve;
  const rpc=()=>{requests++;return new Promise(done=>{resolve=done;});};
  const args={rpc,content:ui.content,isCurrent:()=>true,onChange:()=>{}};
  const first=ui.u.openBatch(args),second=ui.u.openBatch(args);
  assert.equal(requests,1);
  resolve({articles:[{id:'KB-0001',title:'Guia Console'}]});await Promise.all([first,second]);
  assert.equal(ui.dialogs.length,1);
  const dialog=ui.dialogs[0],files=dialog.querySelector('[data-files]');
  files.files=[file('KB-0001-console.png')];files.handlers.change();
  assert.equal(dialog.querySelector('[data-send]').disabled,false);
  await ui.u.openBatch(args);
  assert.equal(ui.dialogs.length,1);assert.equal(requests,1);assert.equal(dialog.focusCount,1);
  assert.match(dialog.querySelector('[data-selection]').innerHTML,/KB-0001-console.png/);
  dialog.querySelector('[data-close]').handlers.click();
  const next=ui.u.openBatch(args);assert.equal(requests,2);
  resolve({articles:[]});await next;assert.equal(ui.dialogs.length,2);
});

test('envio completo fecha o modal e comunica sucesso; falha parcial mantém opção de tentar novamente',async()=>{
  for(const failure of [false,true]) {
    const ui=batchUi();let refreshes=0;const messages=[];
    const rpc=async method=>{
      if(method==='listGuides') return {articles:[{id:'KB-0001',title:'Guia Console'}]};
      if(method==='getGuide') return {id:'KB-0001',markdown:'Texto',status:'draft'};
      if(method==='uploadGuideImage') {if(failure) throw Error('Falha ao enviar');return {id:'img-1'};}
      if(method==='saveGuide') return {ok:true};
      throw Error(method);
    };
    await ui.u.openBatch({rpc,content:ui.content,isCurrent:()=>true,onChange:()=>{refreshes++;},onComplete:message=>messages.push(message)});
    const dialog=ui.dialogs[0],files=dialog.querySelector('[data-files]');files.files=[file('KB-0001.png')];files.handlers.change();
    await dialog.querySelector('[data-send]').handlers.click();
    assert.equal(dialog.open,failure);
    assert.equal(dialog.querySelector('[data-close]').disabled,false);
    if(failure) {
      assert.equal(dialog.querySelector('[data-send]').disabled,false);
      assert.equal(dialog.querySelector('[data-send]').textContent,'Tentar restantes');
      assert.equal(messages.length,0);assert.equal(refreshes,0);
    } else {
      assert.equal(dialog.isConnected,false);assert.equal(refreshes,1);assert.match(messages[0],/1 imagem/);
    }
  }
});

test('falha ao carregar guias libera a abertura para uma nova tentativa',async()=>{
  const ui=batchUi();let fail=true;
  const args={content:ui.content,isCurrent:()=>true,onChange:()=>{},rpc:async()=>{if(fail) throw Error('Falha de conexão');return {articles:[]};}};
  await assert.rejects(()=>ui.u.openBatch(args),/Falha de conexão/);
  fail=false;await ui.u.openBatch(args);assert.equal(ui.dialogs.length,1);assert.equal(ui.dialogs[0].open,true);
});
