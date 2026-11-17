const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const CATALOG_SIZE = 28;

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
  for(const file of ['Auth.gs','DataService.gs','GuideSeeds.gs','GuideImages.gs','GuideUpdates.gs','Knowledge.gs','Código.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
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

test('importa o catálogo completo em cinco categorias sem instruções editoriais e é idempotente',() => {
  const f=fixture();f.c.setupSupportFlow();
  assert.equal(f.c.importInitialGuides().imported,CATALOG_SIZE);
  assert.equal(f.c.rows_('Categories').length,5);
  assert.equal(f.c.rows_('Articles').length,CATALOG_SIZE);
  assert.equal(f.c.getBootstrap().dashboard.publishedArticles,0);
  const seeds=f.c.initialGuides_();
  assert.equal(new Set(seeds.map(s=>s.id)).size,CATALOG_SIZE);
  for(const seed of seeds) {
    assert.match(seed.markdown,/### Como fazer/);
    assert.match(seed.markdown,/\*\*Atenção:\*\*/);
    assert.doesNotMatch(seed.markdown,/Instruções para o Codex|## Catálogo|Referências técnicas consultadas/);
    for(const related of seed.markdown.match(/KB-\d{4}/g)||[]) assert.ok(seeds.some(s=>s.id===related),related);
  }
  const again=f.c.importInitialGuides();assert.equal(again.imported,0);assert.equal(again.skipped.length,CATALOG_SIZE);
  assert.equal(f.c.rows_('Categories').length,5);
  assert.equal(f.c.rows_('Articles').length,CATALOG_SIZE);
  assert.equal(f.c.getGuide('KB-0023').markdown.includes('Modelo de mensagem ao cliente'),true);
});

test('pesquisa por código, palavras-chave, categoria, texto e acentos',() => {
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  for(const query of ['F12','500','PROPATH','objeto desatualizado','autenticacao','KB-0021']) {
    assert.ok(f.c.listGuides({query}).articles.length>0,query);
  }
  const apiGuides=f.c.listGuides({category:'APIs e comunicação'}).articles;
  assert.equal(apiGuides.map(a=>a.id).join(','),f.c.initialGuides_().filter(a=>a.category==='APIs e comunicação').map(a=>a.id).join(','));
  assert.ok(apiGuides.every(a=>a.category==='APIs e comunicação'));
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
  const result=f.c.importInitialGuides();assert.equal(result.imported,CATALOG_SIZE-1);
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
  assert.equal(f.c.listGuides({}).articles.length,CATALOG_SIZE-1);
  assert.equal(f.c.listGuides({query:'KB-0001'}).articles.some(a=>a.id==='KB-0001'),false);
  assert.equal(f.c.listGuides({status:'deleted'}).articles.length,0);
  assert.equal(f.c.getBootstrap().dashboard.publishedArticles,0);
  assert.throws(()=>f.c.getGuide('KB-0001'),/não encontrado/);
  assert.throws(()=>f.c.saveGuide(current),/removido/);
  const record=f.c.rows_('Articles').find(a=>a.id==='KB-0001');
  assert.equal(record.status,'deleted');assert.ok(record.content.includes(original.markdown.slice(0,30)));
  assert.equal(f.c.importInitialGuides().imported,0);
  assert.equal(f.c.listGuides({}).articles.length,CATALOG_SIZE-1);
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
  f.setEmail('admin@example.com');assert.equal(f.c.listGuides({}).articles.length,CATALOG_SIZE);
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

test('estado da importação considera toda a base, inclusive removidos, sem depender da pesquisa',()=>{
  const f=fixture();f.c.setupSupportFlow();
  assert.equal(f.c.listGuides({}).initialImport.missing,CATALOG_SIZE);
  f.c.importInitialGuides();
  const guide=f.c.getGuide('KB-0001');f.c.deleteGuide({id:guide.id,confirmId:guide.id,updatedAt:guide.updatedAt});
  const data=f.c.listGuides({query:'sem-resultado-123'});
  assert.equal(data.articles.length,0);assert.equal(data.summary.total,CATALOG_SIZE-1);assert.equal(data.initialImport.missing,0);
  f.c.saveUser({email:'support@example.com',role:'support',active:true});f.setEmail('support@example.com');
  assert.equal(f.c.listGuides({}).initialImport,null);assert.equal(f.c.listGuides({}).summary.total,0);
});

test('publicação em lote exige confirmação e libera somente a seleção',()=>{
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const selected=['KB-0001','KB-0002'].map(id=>f.c.getGuide(id));
  assert.throws(()=>f.c.publishGuides({guides:selected}),/Confirme/);
  assert.equal(f.c.publishGuides({confirm:true,guides:selected}).published,2);
  assert.equal(f.c.getBootstrap().dashboard.publishedArticles,2);
  assert.equal(f.c.getGuide('KB-0003').status,'draft');
  f.c.saveUser({email:'support@example.com',role:'support',active:true});f.setEmail('support@example.com');
  assert.equal(f.c.listGuides({}).articles.length,2);
  assert.throws(()=>f.c.publishGuides({confirm:true,guides:selected}),/administração/);
});

test('publicação em lote valida todas as versões e estados antes de gravar',()=>{
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const first=f.c.getGuide('KB-0001'),second=f.c.getGuide('KB-0002');
  f.c.saveGuide({...second,title:'Nova revisão'});
  assert.throws(()=>f.c.publishGuides({confirm:true,guides:[first,second]}),/alterado/);
  assert.equal(f.c.getGuide(first.id).status,'draft');assert.equal(f.locked,false);
  assert.throws(()=>f.c.publishGuides({confirm:true,guides:[first,first]}),/inválida/);
  f.c.deleteGuide({id:first.id,confirmId:first.id,updatedAt:first.updatedAt});
  assert.throws(()=>f.c.publishGuides({confirm:true,guides:[first]}),/rascunho/);
  assert.equal(f.c.getBootstrap().dashboard.publishedArticles,0);
});

test('catálogo atualizado acrescenta apenas ausentes em bases com 23 ou 24 guias e preserva edições, imagens e remoções',()=>{
  for (const baseline of [23,24]) {
    const f=fixture();f.c.setupSupportFlow();
    const currentCatalog=f.c.initialGuides_;
    const isExisting=a=>Number(a.id.slice(3))<=baseline;
    f.c.initialGuides_=()=>currentCatalog().filter(isExisting);
    assert.equal(f.c.importInitialGuides().imported,baseline);
    const guide=f.c.getGuide('KB-0001');
    f.c.saveGuide({...guide,title:'Conteúdo já revisado pelo usuário',status:'published'});
    const removed=f.c.getGuide('KB-0002');f.c.deleteGuide({id:removed.id,confirmId:removed.id,updatedAt:removed.updatedAt});
    const image=f.c.uploadGuideImage({guideId:'KB-0003',mimeType:'image/png',base64:testPng});
    const illustrated=f.c.getGuide('KB-0003');f.c.saveGuide({...illustrated,markdown:illustrated.markdown+'\n\n![Exemplo](sf-image:'+image.id+')'});
    const before=JSON.stringify(f.c.rows_('Articles').filter(isExisting));
    const imagesBefore=JSON.stringify(f.c.rows_('GuideImages'));
    f.c.initialGuides_=currentCatalog;
    assert.equal(f.c.listGuides({}).initialImport.missing,CATALOG_SIZE-baseline);
    const result=f.c.importInitialGuides();
    assert.equal(result.imported,CATALOG_SIZE-baseline);assert.equal(result.skipped.length,baseline);
    assert.equal(JSON.stringify(f.c.rows_('Articles').filter(isExisting)),before);
    assert.equal(JSON.stringify(f.c.rows_('GuideImages')),imagesBefore);assert.equal(Object.keys(f.driveFiles).length,1);
    for(let n=baseline+1;n<=CATALOG_SIZE;n++) assert.equal(f.c.getGuide('KB-'+String(n).padStart(4,'0')).status,'draft');
    assert.equal(f.c.listGuides({}).initialImport.missing,0);
    assert.equal(f.c.importInitialGuides().imported,0);
  }
});

test('novos guias são encontrados por termos do atendimento e publicam com links válidos',()=>{
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  for(const [id,term] of [['KB-0025','timeout Timing'],['KB-0026','CORS certificado'],['KB-0027','correlação fuso'],['KB-0028','camadas PASOE']]) {
    assert.ok(f.c.listGuides({query:term}).articles.some(a=>a.id===id),id+' / '+term);
  }
  const guides=['KB-0025','KB-0026','KB-0027','KB-0028'].map(id=>f.c.getGuide(id));
  assert.equal(f.c.publishGuides({confirm:true,guides}).published,4);
  f.c.saveUser({email:'support@example.com',role:'support',active:true});f.setEmail('support@example.com');
  assert.equal(f.c.listGuides({}).articles.length,4);
  for(const guide of guides) assert.equal(f.c.getGuide(guide.id).status,'published');
});

function restoreOriginalEditions(f) {
  f.c.importInitialGuides();
  for(const old of f.c.previousGuideEditions_()) {
    const record=f.c.rows_('Articles').find(a=>a.id===old.id);
    record.content=JSON.stringify({format:'supportflow-guide-v1',sourceCode:old.id,keywords:old.keywords,revision:old.revision,markdown:old.markdown});
    f.c.writeRow_('Articles',record,f.c.rowNumberForId_('Articles',old.id));
  }
}

test('simplificação atualiza apenas edições originais, preservando imagem e publicação',()=>{
  const f=fixture();f.c.setupSupportFlow();restoreOriginalEditions(f);
  const image=f.c.uploadGuideImage({guideId:'KB-0025',mimeType:'image/png',base64:testPng});
  const old=f.c.getGuide('KB-0025');
  f.c.saveGuide({...old,status:'published',markdown:old.markdown+'\n\n![Exemplo enviado](sf-image:'+image.id+')'});
  const filesBefore=JSON.stringify(f.c.rows_('GuideImages'));
  const candidates=f.c.listGuides({}).simpleUpdates;
  assert.equal(candidates.length,4);
  assert.throws(()=>f.c.simplifyGuides({guides:candidates}),/Confirme/);
  assert.equal(f.c.simplifyGuides({confirm:true,guides:candidates}).updated,4);
  const updated=f.c.getGuide('KB-0025');
  assert.equal(updated.revision,'1.1');assert.equal(updated.status,'published');
  assert.match(updated.markdown,new RegExp('sf-image:'+image.id));
  assert.ok(updated.markdown.length<old.markdown.length);
  assert.equal(JSON.stringify(f.c.rows_('GuideImages')),filesBefore);
  assert.equal(Object.keys(f.driveFiles).length,1);
  assert.equal(f.c.listGuides({}).simpleUpdates.length,0);
  assert.equal(f.c.getGuide('KB-0026').status,'draft');
  assert.equal(f.locked,false);
});

test('simplificação protege edições próprias, versões concorrentes, remoções e autorização',()=>{
  const f=fixture();f.c.setupSupportFlow();restoreOriginalEditions(f);
  const original=f.c.listGuides({}).simpleUpdates;
  const edited=f.c.getGuide('KB-0026');f.c.saveGuide({...edited,markdown:edited.markdown+'\n\nOrientação própria do usuário.'});
  assert.equal(f.c.listGuides({}).simpleUpdates.length,3);
  assert.throws(()=>f.c.simplifyGuides({confirm:true,guides:original}),/Guia alterado/);
  assert.equal(f.c.getGuide('KB-0025').revision,'1.0');
  const custom=f.c.getGuide('KB-0026');
  assert.throws(()=>f.c.simplifyGuides({confirm:true,guides:[custom]}),/foi editado/);
  assert.match(f.c.getGuide('KB-0026').markdown,/Orientação própria/);
  const removed=f.c.getGuide('KB-0027');f.c.deleteGuide({id:removed.id,confirmId:removed.id,updatedAt:removed.updatedAt});
  assert.equal(f.c.listGuides({}).simpleUpdates.length,2);
  f.c.saveUser({email:'support@example.com',role:'support',active:true});f.setEmail('support@example.com');
  assert.equal(f.c.listGuides({}).simpleUpdates.length,0);
  assert.throws(()=>f.c.simplifyGuides({confirm:true,guides:[original[0]]}),/administração/);
  assert.equal(f.locked,false);
});

test('restaura quatro removidos com texto simplificado, imagens preservadas e sem republicação',()=>{
  const f=fixture();f.c.setupSupportFlow();restoreOriginalEditions(f);
  const image=f.c.uploadGuideImage({guideId:'KB-0025',mimeType:'image/png',base64:testPng});
  const guide=f.c.getGuide('KB-0025');f.c.saveGuide({...guide,status:'published',markdown:guide.markdown+'\n\n![Imagem](sf-image:'+image.id+')'});
  for(const id of ['KB-0025','KB-0026','KB-0027','KB-0028']) {
    const g=f.c.getGuide(id);f.c.deleteGuide({id,confirmId:id,updatedAt:g.updatedAt});
  }
  assert.equal(f.c.listGuides({}).initialImport.missing,0);
  assert.equal(f.c.importInitialGuides().imported,0);
  const removed=f.c.listGuides({}).removedGuides;assert.equal(removed.length,4);
  const result=f.c.restoreGuides({confirm:true,useSimplified:true,guides:removed});
  assert.equal(result.restored,4);assert.equal(result.simplified,4);
  for(const id of ['KB-0025','KB-0026','KB-0027','KB-0028']) {
    const g=f.c.getGuide(id);assert.equal(g.status,'draft');assert.equal(g.revision,'1.1');
  }
  assert.match(f.c.getGuide('KB-0025').markdown,new RegExp('sf-image:'+image.id));
  assert.equal(f.c.getGuideImage('KB-0025',image.id).base64,testPng);
  assert.equal(Object.keys(f.driveFiles).length,1);
  assert.equal(f.c.rows_('Articles').length,CATALOG_SIZE);assert.equal(f.c.listGuides({}).removedGuides.length,0);
  assert.equal(f.c.getBootstrap().dashboard.publishedArticles,0);
  assert.ok(f.c.rows_('Audit').some(a=>a.action==='GUIDES_RESTORE_REQUEST'));
});

test('restauração preserva texto personalizado e permite recuperar somente a seleção',()=>{
  const f=fixture();f.c.setupSupportFlow();restoreOriginalEditions(f);
  const original=f.c.getGuide('KB-0025');f.c.saveGuide({...original,markdown:original.markdown+'\n\nMinha orientação própria.'});
  for(const id of ['KB-0025','KB-0026']) {const g=f.c.getGuide(id);f.c.deleteGuide({id,confirmId:id,updatedAt:g.updatedAt});}
  const selected=f.c.listGuides({}).removedGuides.filter(a=>a.id==='KB-0025');
  const result=f.c.restoreGuides({confirm:true,useSimplified:true,guides:selected});
  assert.equal(result.restored,1);assert.equal(result.simplified,0);
  assert.match(f.c.getGuide('KB-0025').markdown,/Minha orientação própria/);
  assert.equal(f.c.getGuide('KB-0025').revision,'1.0');
  assert.throws(()=>f.c.getGuide('KB-0026'),/não encontrado/);
  const remaining=f.c.listGuides({}).removedGuides;
  f.c.restoreGuides({confirm:true,useSimplified:false,guides:remaining});
  assert.equal(f.c.getGuide('KB-0026').revision,'1.0');
});

test('restauração exige admin, confirmação e versão atual e valida o lote antes de alterar',()=>{
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  for(const id of ['KB-0025','KB-0026']) {const g=f.c.getGuide(id);f.c.deleteGuide({id,confirmId:id,updatedAt:g.updatedAt});}
  const guides=f.c.listGuides({}).removedGuides;
  assert.throws(()=>f.c.restoreGuides({guides,useSimplified:true}),/Confirme/);
  assert.throws(()=>f.c.restoreGuides({confirm:true,useSimplified:true,guides:[guides[0],{...guides[1],updatedAt:'stale'}]}),/Guia alterado/);
  assert.equal(f.c.listGuides({}).removedGuides.length,2);assert.equal(f.locked,false);
  f.c.saveUser({email:'support@example.com',role:'support',active:true});f.setEmail('support@example.com');
  assert.equal(f.c.listGuides({}).removedGuides.length,0);
  assert.throws(()=>f.c.restoreGuides({confirm:true,useSimplified:true,guides}),/administração/);
});

test('remove lote selecionado preservando imagens, demais guias e possibilidade de restauração',()=>{
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const image=f.c.uploadGuideImage({guideId:'KB-0001',mimeType:'image/png',base64:testPng});
  const first=f.c.getGuide('KB-0001');f.c.saveGuide({...first,status:'published',markdown:first.markdown+'\n\n![Exemplo](sf-image:'+image.id+')'});
  const selected=['KB-0001','KB-0002'].map(id=>f.c.getGuide(id));
  assert.equal(f.c.deleteGuides({confirm:true,guides:selected}).removed,2);
  assert.equal(f.c.listGuides({}).removedGuides.length,2);assert.equal(f.c.listGuides({}).articles.length,CATALOG_SIZE-2);
  assert.equal(f.c.getGuide('KB-0003').status,'draft');assert.equal(f.c.getBootstrap().dashboard.publishedArticles,0);
  assert.equal(f.c.importInitialGuides().imported,0);assert.equal(Object.keys(f.driveFiles).length,1);
  assert.throws(()=>f.c.getGuideImage('KB-0001',image.id),/não encontrado/);
  f.c.restoreGuides({confirm:true,useSimplified:false,guides:f.c.listGuides({}).removedGuides});
  assert.equal(f.c.getGuideImage('KB-0001',image.id).base64,testPng);
  assert.equal(f.c.rows_('Articles').length,CATALOG_SIZE);
  assert.ok(f.c.rows_('Audit').some(a=>a.action==='GUIDES_DELETE_REQUEST'));assert.equal(f.locked,false);
});

test('remoção em lote exige confirmação, seleção única e versões atuais antes de gravar',()=>{
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const selected=['KB-0001','KB-0002'].map(id=>f.c.getGuide(id));
  assert.throws(()=>f.c.deleteGuides({guides:selected}),/Confirme/);
  assert.throws(()=>f.c.deleteGuides({confirm:true,guides:[]}),/Confirme/);
  assert.throws(()=>f.c.deleteGuides({confirm:true,guides:Array(51).fill(selected[0])}),/Confirme/);
  assert.throws(()=>f.c.deleteGuides({confirm:true,guides:[selected[0],selected[0]]}),/inválida/);
  f.c.saveGuide({...selected[1],title:'Alterado'});
  assert.throws(()=>f.c.deleteGuides({confirm:true,guides:selected}),/alterado/);
  assert.equal(f.c.getGuide('KB-0001').status,'draft');assert.equal(f.c.listGuides({}).removedGuides.length,0);
  assert.equal(f.locked,false);
  const current=f.c.getGuide('KB-0002');f.c.deleteGuide({id:current.id,confirmId:current.id,updatedAt:current.updatedAt});
  assert.throws(()=>f.c.deleteGuides({confirm:true,guides:selected}),/não está disponível/);
  assert.equal(f.c.getGuide('KB-0001').status,'draft');
});

test('Atendimento não pode remover guias em lote diretamente',()=>{
  const f=fixture();f.c.setupSupportFlow();f.c.importInitialGuides();
  const selected=[f.c.getGuide('KB-0001')];
  f.c.saveUser({email:'support@example.com',role:'support',active:true});f.setEmail('support@example.com');
  assert.throws(()=>f.c.deleteGuides({confirm:true,guides:selected}),/administração/);
  f.setEmail('admin@example.com');assert.equal(f.c.listGuides({}).removedGuides.length,0);
});
