const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname,'..');

function fixture() {
  const properties = {ALLOWED_DOMAINS:'example.com', INITIAL_ADMIN_EMAIL:'admin@example.com'};
  const tables = {};
  const driveFiles = {}, driveFolders = {};
  let email = 'admin@example.com', uid = 0, locked = false, creates = 0;
  function blob(bytes,mimeType,name) {
    return {getBytes:()=>Array.from(bytes),getContentType:()=>mimeType,getName:()=>name};
  }
  const db = {
    getId: () => 'database',
    getSheetByName: name => tables[name] || null,
    insertSheet(name) {
      const cells = [];
      const sheet = {
        cells, getLastRow: () => cells.length, setFrozenRows: () => {},
        getRange(row,col,count,width) {
          return {
            getValues: () => Array.from({length:count},(_,r) => Array.from({length:width},(_,c) => cells[row+r-1]?.[col+c-1] ?? '')),
            setValues(values) { values.forEach((valuesRow,r) => { cells[row+r-1] ||= []; valuesRow.forEach((v,c) => cells[row+r-1][col+c-1] = v); }); }
          };
        }
      };
      return tables[name] = sheet;
    }
  };
  const context = vm.createContext({
    Session:{getActiveUser:() => ({getEmail:() => email})},
    PropertiesService:{getScriptProperties:() => ({getProperty:key => properties[key] || null, setProperty:(key,value) => {properties[key]=value;}})},
    SpreadsheetApp:{openById:() => db, create:() => {creates++; return db;}},
    LockService:{getScriptLock:() => ({waitLock:() => {assert.equal(locked,false);locked=true;},releaseLock:() => {locked=false;}})},
    Utilities:{getUuid:() => 'id-'+ ++uid,
      base64Decode:text=>Array.from(Buffer.from(text,'base64')),
      base64Encode:bytes=>Buffer.from(bytes).toString('base64'),newBlob:blob},
    DriveApp:{
      createFolder() {
        const id='folder-'+ ++uid;
        const folder={getId:()=>id,createFile(image) {
          const fileId='file-'+ ++uid;
          const file={getId:()=>fileId,getBlob:()=>image,getSize:()=>image.getBytes().length,
            getMimeType:()=>image.getContentType(),isTrashed:()=>false};
          driveFiles[fileId]=file;return file;
        }};
        driveFolders[id]=folder;return folder;
      },
      getFolderById:id=>{if(!driveFolders[id]) throw new Error('Pasta indisponível');return driveFolders[id];},
      getFileById:id=>{if(!driveFiles[id]) throw new Error('Arquivo indisponível');return driveFiles[id];}
    }, Date, console
  });
  for(const file of ['Auth.gs','DataService.gs','GuideSeeds.gs','GuideImages.gs','Knowledge.gs','Código.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
  return {c:context,properties,tables,driveFiles,driveFolders,setEmail:value => {email=value;},get creates(){return creates;},get locked(){return locked;}};
}

test('nega acesso sem configuração, domínio aprovado ou identidade',() => {
  const f=fixture();
  assert.throws(() => f.c.getBootstrap(),/configurado/);
  f.setEmail(''); assert.throws(() => f.c.getBootstrap(),/identificar/);
  f.setEmail('admin@evil-example.com'); assert.throws(() => f.c.getBootstrap(),/restrito/);
  f.setEmail('admin@sub.example.com'); assert.throws(() => f.c.getBootstrap(),/restrito/);
});
test('distingue domínios não configurados de conta não autorizada',() => {
  const f=fixture();
  delete f.properties.ALLOWED_DOMAINS;
  assert.throws(() => f.c.getBootstrap(),/Configuração inicial pendente.*ALLOWED_DOMAINS/);
  f.properties.ALLOWED_DOMAINS=' , ';
  assert.throws(() => f.c.getBootstrap(),/Configuração inicial pendente/);
  f.properties.ALLOWED_DOMAINS='other.com';
  assert.throws(() => f.c.getBootstrap(),/example.com.*não está autorizado/);
});

test('entrada pública de setup exige administrador inicial e perde acesso após remover propriedade',() => {
  const f=fixture(); f.setEmail('other@example.com');
  assert.throws(() => f.c.setupSupportFlow(),/Configure/);
  assert.equal(f.creates,0);
  f.setEmail('admin@example.com'); f.c.setupSupportFlow();
  assert.equal(f.c.getBootstrap().user.role,'admin');
  delete f.properties.INITIAL_ADMIN_EMAIL;
  assert.throws(() => f.c.setupSupportFlow(),/Configure/);
});

test('inicialização privada idempotente preserva dados e cria apenas uma planilha',() => {
  const f=fixture(); f.c.setupSupportFlow_();
  f.c.writeRow_('Categories',{id:'cat',name:'Network'});
  f.c.setupSupportFlow_();
  assert.equal(f.creates,1); assert.equal(f.c.rows_('Users').length,1);
  assert.equal(f.c.rows_('Categories')[0].name,'Network');
  assert.equal(f.c.getBootstrap().user.role,'admin');
  assert.equal(f.c.getBootstrap().dashboard.categories,1);
  assert.equal(f.c.getBootstrap().dashboard.publishedArticles,0);
  assert.equal(f.locked,false);
});
test('setup rejeita executor diferente e cabeçalho incompatível sem sobrescrever',() => {
  const f=fixture(); f.setEmail('other@example.com');
  assert.throws(() => f.c.setupSupportFlow_(),/Configure/); assert.equal(f.creates,0);
  f.setEmail('admin@example.com');f.c.setupSupportFlow_();
  f.tables.Users.cells[0][0]='incompatible';
  assert.throws(() => f.c.setupSupportFlow_(),/incompatível/);
  assert.equal(f.tables.Users.cells[0][0],'incompatible');assert.equal(f.locked,false);
});
test('atendimento não pode ler administração nem alterar usuários',() => {
  const f=fixture();f.c.setupSupportFlow_();
  f.c.saveUser({email:'support@example.com',role:'support',active:true});
  f.setEmail('support@example.com');assert.equal(f.c.getBootstrap().user.role,'support');
  assert.throws(() => f.c.getAdminData(),/administração/);
  assert.throws(() => f.c.saveUser({email:'new@example.com',role:'admin',active:true}),/administração/);
  f.setEmail('unknown@example.com');assert.throws(() => f.c.getBootstrap(),/acesso ativo/);
});
test('valida cadastro, atualiza sem duplicar e bloqueia conta inativa',() => {
  const f=fixture();f.c.setupSupportFlow_();
  assert.throws(() => f.c.saveUser({email:'a@other.com',role:'support',active:true}),/domínio/);
  assert.throws(() => f.c.saveUser({email:'bad@example.com',role:'root',active:true}),/Perfil|perfil/);
  assert.throws(() => f.c.saveUser({email:'bad@example.com',role:'support',active:'true'}),/perfil/i);
  f.c.saveUser({email:' SUPPORT@EXAMPLE.COM ',role:'support',active:true});
  f.c.saveUser({email:'support@example.com',role:'support',active:false});
  assert.equal(f.c.rows_('Users').length,2);assert.equal(f.c.rows_('Audit').length,3);
  f.setEmail('support@example.com');assert.throws(() => f.c.getBootstrap(),/acesso ativo/);
});
test('preserva último admin e libera lock após rejeição',() => {
  const f=fixture();f.c.setupSupportFlow_();
  assert.throws(() => f.c.saveUser({email:'admin@example.com',role:'support',active:true}),/pelo menos/);
  assert.throws(() => f.c.saveUser({email:'admin@example.com',role:'admin',active:false}),/pelo menos/);
  assert.equal(f.locked,false);
  f.c.saveUser({email:'second@example.com',role:'admin',active:true});
  f.c.saveUser({email:'admin@example.com',role:'support',active:true});
  assert.equal(f.c.getBootstrap().user.role,'support');
});

test('atualiza a linha correta mesmo com linhas vazias na planilha',() => {
  const f=fixture();f.c.setupSupportFlow_();
  f.tables.Users.cells.push([]);
  f.c.saveUser({email:'support@example.com',role:'support',active:true});
  f.c.saveUser({email:'support@example.com',role:'support',active:false});
  assert.equal(f.tables.Users.cells[2].length,0);
  assert.equal(f.tables.Users.cells[3][1],'support@example.com');
  assert.equal(f.tables.Users.cells[3][3],false);
  assert.equal(f.c.rows_('Users').length,2);
});
test('bootstrap omite rascunhos, conteúdo dos artigos e usuários',() => {
  const f=fixture();f.c.setupSupportFlow_();
  f.c.writeRow_('Articles',{id:'draft',title:'Privado',status:'draft',content:'segredo'});
  f.c.writeRow_('Articles',{id:'pub',title:'Publicado',status:'published',content:'texto',updatedAt:'2026-11-17T10:00:00Z'});
  const data=f.c.getBootstrap();assert.equal(data.dashboard.publishedArticles,1);
  assert.equal(data.recentArticles.length,1);assert.equal(data.recentArticles[0].title,'Publicado');
  assert.equal(data.recentArticles[0].content,undefined);assert.equal(data.users,undefined);
});
test('protege texto contra fórmulas e valida sintaxe do frontend',() => {
  const f=fixture();f.c.setupSupportFlow_();
  f.c.writeRow_('Categories',{id:'test',name:'=IMPORTDATA("https://example.com")'});
  assert.match(f.tables.Categories.cells[1][1],/^'=/);
  const script=fs.readFileSync(path.join(root,'Scripts.html'),'utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,'');
  new vm.Script(script);
  JSON.parse(fs.readFileSync(path.join(root,'appsscript.json'),'utf8'));
});

test('importa 23 rascunhos em cinco categorias, sem instruções editoriais, e é idempotente',() => {
  const f=fixture();f.c.setupSupportFlow();
  assert.equal(f.c.importInitialGuides().imported,23);
  assert.equal(f.c.rows_('Categories').length,5);
  assert.equal(f.c.rows_('Articles').length,23);
  assert.equal(f.c.getBootstrap().dashboard.publishedArticles,0);
  const seeds=f.c.initialGuides_();
  assert.equal(new Set(seeds.map(s=>s.id)).size,23);
  for(const seed of seeds) {
    assert.match(seed.markdown,/### Como fazer/);
    assert.match(seed.markdown,/\*\*Atenção:\*\*/);
    assert.doesNotMatch(seed.markdown,/Instruções para o Codex|## Catálogo|Referências técnicas consultadas/);
    for(const related of seed.markdown.match(/KB-\d{4}/g)||[]) assert.ok(seeds.some(s=>s.id===related),related);
  }
  const again=f.c.importInitialGuides();assert.equal(again.imported,0);assert.equal(again.skipped.length,23);
  assert.equal(f.c.rows_('Categories').length,5);
  assert.equal(f.c.rows_('Articles').length,23);
  assert.equal(f.c.getGuide('KB-0023').markdown.includes('Modelo de mensagem ao cliente'),true);
});

test('pesquisa por código, palavras-chave, categoria, texto e acentos',() => {
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  for(const query of ['F12','500','PROPATH','objeto desatualizado','autenticacao','KB-0021']) {
    assert.ok(f.c.listGuides({query}).articles.length>0,query);
  }
  assert.equal(f.c.listGuides({category:'APIs e comunicação'}).articles.length,5);
  assert.equal(f.c.listGuides({query:'não-existe-123'}).articles.length,0);
});

test('atendimento não lê rascunhos nem altera/importa; publicação e retirada têm efeito',() => {
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  f.c.saveUser({email:'support@example.com',role:'support',active:true});
  f.setEmail('support@example.com');
  assert.equal(f.c.listGuides({status:'draft'}).articles.length,0);
  assert.equal(f.c.listGuides({}).categories.length,0);
  assert.throws(()=>f.c.getGuide('KB-0001'),/não encontrado/);
  assert.throws(()=>f.c.importInitialGuides(),/administração/);
  assert.throws(()=>f.c.saveGuide({}),/administração/);
  f.setEmail('admin@example.com');
  const input={...f.c.getGuide('KB-0001'),status:'published'};
  f.c.saveGuide(input);
  f.setEmail('support@example.com');
  assert.equal(f.c.getGuide('KB-0001').status,'published');
  assert.equal(f.c.listGuides({}).articles.length,1);
  assert.equal(f.c.getBootstrap().dashboard.publishedArticles,1);
  f.setEmail('admin@example.com');
  f.c.saveGuide({...f.c.getGuide('KB-0001'),status:'draft'});
  f.setEmail('support@example.com');assert.throws(()=>f.c.getGuide('KB-0001'),/não encontrado/);
});

test('edição preservada na reimportação e gravação concorrente rejeitada',() => {
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const before=f.c.getGuide('KB-0001');
  f.c.saveGuide({...before,title:'Título revisado',markdown:'Texto revisado',revision:'1.1'});
  assert.throws(()=>f.c.saveGuide({...before,title:'Edição atrasada'}),/alterado por outra pessoa/);
  assert.equal(f.locked,false);
  const result=f.c.importInitialGuides();assert.equal(result.imported,0);assert.equal(result.conflicts.length,0);
  assert.equal(f.c.getGuide('KB-0001').title,'Título revisado');
  assert.equal(f.c.getGuide('KB-0001').markdown,'Texto revisado');
});

test('conflito de código preserva registro e validação impede conteúdo inválido',() => {
  const f=fixture();f.c.setupSupportFlow();
  f.c.writeRow_('Articles',{id:'KB-0001',title:'Outro artigo',content:'não alterar',status:'published'});
  const result=f.c.importInitialGuides();assert.equal(result.imported,22);
  assert.equal(result.conflicts[0],'KB-0001');assert.equal(f.c.getGuide('KB-0001').markdown,'não alterar');
  const guide=f.c.getGuide('KB-0002');
  assert.throws(()=>f.c.saveGuide({...guide,status:'approved'}),/Status inválido/);
  assert.throws(()=>f.c.saveGuide({...guide,markdown:'a'.repeat(35001)}),/limite/);
  assert.throws(()=>f.c.saveGuide({...guide,title:''}),/Preencha/);
});

test('renderiza passos e links com segurança, sem executar HTML do conteúdo',() => {
  const source=fs.readFileSync(path.join(root,'KnowledgeScripts.html'),'utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,'');
  const context=vm.createContext({window:{}});vm.runInContext(source,context);
  const render=context.window.SupportFlowKnowledge.markdown;
  const html=render('### Como fazer\n\n1. Abra F12\n\n2. Veja KB-0001 e KB-0010/0020\n\n**Atenção:** <img src=x onerror=alert(1)>\n\n[Link](https://example.com) [Ruim](javascript:alert(1))');
  assert.match(html,/<ol start="1"><li>Abra F12<\/li><li>/);
  assert.match(html,/#knowledge\/KB-0020/);assert.match(html,/guide-warning/);
  assert.doesNotMatch(html,/<img|href="javascript:/);
  assert.match(html,/&lt;img/);assert.match(html,/rel="noopener noreferrer"/);
});

const testPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jf1sAAAAASUVORK5CYII=';

test('prepara pasta e tabela de imagens sem exigir nova inicialização nem duplicar pasta',() => {
  const f=fixture();f.c.setupSupportFlow();delete f.tables.GuideImages;
  delete f.properties.INITIAL_ADMIN_EMAIL;
  assert.equal(f.c.setupGuideImages().ok,true);
  assert.ok(f.tables.GuideImages);assert.ok(f.properties.GUIDE_IMAGES_FOLDER_ID);
  f.c.setupGuideImages();assert.equal(Object.keys(f.driveFolders).length,1);
});

test('envia PNG, vincula ao guia e preserva o arquivo após editar e reimportar',() => {
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const {id}=f.c.uploadGuideImage({guideId:'KB-0001',mimeType:'image/png',base64:testPng});
  assert.equal(f.c.rows_('GuideImages').length,1);
  assert.equal(f.c.getGuideImage('KB-0001',id).base64,testPng);
  const guide=f.c.getGuide('KB-0001');
  f.c.saveGuide({...guide,markdown:guide.markdown+'\n\n![Exemplo do Console](sf-image:'+id+')'});
  f.c.importInitialGuides();assert.match(f.c.getGuide('KB-0001').markdown,/sf-image:/);
  assert.equal(Object.keys(f.driveFiles).length,1);
  assert.equal(f.locked,false);
});

test('imagens exigem publicação e vínculo no texto para Atendimento; upload exige admin',() => {
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const {id}=f.c.uploadGuideImage({guideId:'KB-0001',mimeType:'image/png',base64:testPng});
  f.c.saveUser({email:'support@example.com',role:'support',active:true});
  f.setEmail('support@example.com');
  assert.throws(()=>f.c.setupGuideImages(),/administração/);
  assert.throws(()=>f.c.uploadGuideImage({}),/administração/);
  assert.throws(()=>f.c.getGuideImage('KB-0001',id),/não encontrado/);
  f.setEmail('admin@example.com');
  f.c.saveGuide({...f.c.getGuide('KB-0001'),status:'published'});
  f.setEmail('support@example.com');assert.throws(()=>f.c.getGuideImage('KB-0001',id),/não disponível/);
  f.setEmail('admin@example.com');
  const guide=f.c.getGuide('KB-0001');
  f.c.saveGuide({...guide,markdown:guide.markdown+'\n\n![Exemplo](sf-image:'+id+')'});
  f.setEmail('support@example.com');assert.equal(f.c.getGuideImage('KB-0001',id).base64,testPng);
  f.setEmail('admin@example.com');f.c.saveGuide({...f.c.getGuide('KB-0001'),status:'draft'});
  f.setEmail('support@example.com');assert.throws(()=>f.c.getGuideImage('KB-0001',id),/não encontrado/);
});

test('bloqueia vínculo a outro guia, IDs desconhecidos e mais de 12 imagens',() => {
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const {id}=f.c.uploadGuideImage({guideId:'KB-0001',mimeType:'image/png',base64:testPng});
  const guide=f.c.getGuide('KB-0002');
  assert.throws(()=>f.c.saveGuide({...guide,markdown:'![Outro guia](sf-image:'+id+')'}),/outro guia/);
  assert.throws(()=>f.c.getGuideImage('KB-0002',id),/não disponível/);
  assert.throws(()=>f.c.saveGuide({...guide,markdown:'![Desconhecido](sf-image:fake)'}),/não encontrada/);
  assert.throws(()=>f.c.saveGuide({...guide,markdown:Array.from({length:13},(_,i)=>'![Exemplo](sf-image:id-'+i+')').join('\n')}),/12 imagens/);
  assert.equal(f.locked,false);
});

test('rejeita MIME falso, SVG, base64 inválido e tamanho excessivo antes de criar arquivo',() => {
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const send=(mimeType,base64)=>f.c.uploadGuideImage({guideId:'KB-0001',mimeType,base64});
  assert.throws(()=>send('image/jpeg',testPng),/válida/);
  assert.throws(()=>send('image/svg+xml',Buffer.from('<svg onload="alert(1)"></svg>').toString('base64')),/válida/);
  assert.throws(()=>send('image/png','not base64'),/inválida/);
  assert.throws(()=>send('image/png','A'.repeat(2800000)),/2 MB/);
  assert.equal(Object.keys(f.driveFiles).length,0);
});

test('renderiza apenas imagens internas e escapa a legenda',() => {
  const source=fs.readFileSync(path.join(root,'KnowledgeScripts.html'),'utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,'');
  const context=vm.createContext({window:{}});vm.runInContext(source,context);
  const html=context.window.SupportFlowKnowledge.markdown('![<script>alert(1)</script>](sf-image:id-1)\n\n![Externa](https://evil.example/image.png)\n\n![SVG](data:image/svg+xml;test)');
  assert.match(html,/data-guide-image="id-1"/);
  assert.match(html,/&lt;script&gt;/);
  assert.doesNotMatch(html,/<script|<img[^>]+https:|src="data:image\/svg/);
  assert.equal((html.match(/<figure/g)||[]).length,1);
});

test('admin remove guia da listagem, pesquisa e dashboard sem recriá-lo na importação',() => {
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const original=f.c.getGuide('KB-0001');
  f.c.saveGuide({...original,status:'published'});
  const current=f.c.getGuide('KB-0001');
  assert.equal(f.c.getBootstrap().dashboard.publishedArticles,1);
  assert.equal(f.c.deleteGuide({id:current.id,updatedAt:current.updatedAt,confirmId:current.id}).ok,true);
  assert.equal(f.c.listGuides({}).articles.length,22);
  assert.equal(f.c.listGuides({query:'KB-0001'}).articles.some(a=>a.id==='KB-0001'),false);
  assert.equal(f.c.listGuides({status:'deleted'}).articles.length,0);
  assert.equal(f.c.getBootstrap().dashboard.publishedArticles,0);
  assert.throws(()=>f.c.getGuide('KB-0001'),/não encontrado/);
  assert.throws(()=>f.c.saveGuide(current),/removido/);
  const record=f.c.rows_('Articles').find(a=>a.id==='KB-0001');
  assert.equal(record.status,'deleted');assert.ok(record.content.includes(original.markdown.slice(0,30)));
  assert.equal(f.c.importInitialGuides().imported,0);
  assert.equal(f.c.listGuides({}).articles.length,22);
  assert.equal(f.c.getGuide('KB-0002').title,'Identificando erros no Console');
  assert.ok(f.c.rows_('Audit').some(a=>a.action==='GUIDE_DELETE_REQUEST'));
  assert.equal(f.locked,false);
});

test('remoção exige admin, confirmação e versão atual, sem mutação em rejeições',() => {
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const old=f.c.getGuide('KB-0001');
  assert.throws(()=>f.c.deleteGuide({id:old.id,updatedAt:old.updatedAt}),/Confirme/);
  assert.throws(()=>f.c.deleteGuide({id:old.id,updatedAt:old.updatedAt,confirmId:'KB-0002'}),/Confirme/);
  f.c.saveGuide({...old,title:'Título atualizado'});
  assert.throws(()=>f.c.deleteGuide({id:old.id,updatedAt:old.updatedAt,confirmId:old.id}),/alterado por outra pessoa/);
  assert.equal(f.c.getGuide(old.id).title,'Título atualizado');assert.equal(f.locked,false);
  f.c.saveUser({email:'support@example.com',role:'support',active:true});
  f.setEmail('support@example.com');
  assert.throws(()=>f.c.deleteGuide({id:old.id,updatedAt:old.updatedAt,confirmId:old.id}),/administração/);
  f.setEmail('admin@example.com');assert.equal(f.c.listGuides({}).articles.length,23);
});

test('remoção bloqueia imagens e preserva arquivos do Drive',() => {
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const {id}=f.c.uploadGuideImage({guideId:'KB-0001',mimeType:'image/png',base64:testPng});
  const guide=f.c.getGuide('KB-0001');
  f.c.deleteGuide({id:guide.id,updatedAt:guide.updatedAt,confirmId:guide.id});
  assert.throws(()=>f.c.getGuideImage(guide.id,id),/não encontrado/);
  assert.throws(()=>f.c.uploadGuideImage({guideId:guide.id,mimeType:'image/png',base64:testPng}),/não encontrado/);
  assert.equal(Object.keys(f.driveFiles).length,1);
  assert.equal(f.c.rows_('GuideImages').length,1);
  assert.throws(()=>f.c.deleteGuide({id:guide.id,updatedAt:guide.updatedAt,confirmId:guide.id}),/já removido/);
});
