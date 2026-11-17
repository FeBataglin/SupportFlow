const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname,'..');

function fixture() {
  const properties = {ALLOWED_DOMAINS:'example.com', INITIAL_ADMIN_EMAIL:'admin@example.com'};
  const tables = {};
  let email = 'admin@example.com', uid = 0, locked = false, creates = 0;
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
    Utilities:{getUuid:() => 'id-'+ ++uid}, Date, console
  });
  for(const file of ['Auth.gs','DataService.gs','Código.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
  return {c:context,properties,tables,setEmail:value => {email=value;},get creates(){return creates;},get locked(){return locked;}};
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
