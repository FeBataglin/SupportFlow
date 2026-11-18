const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function fixture(role='support'){
  const nodes=new Map(),calls=[];
  const node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',textContent:'',innerHTML:'',handlers:{},elements:{},querySelectorAll:()=>[],addEventListener(name,fn){this.handlers[name]=fn;},reset(){this.didReset=true;}});return nodes.get(id);};
  const content={innerHTML:'',querySelector:selector=>node(selector.slice(1)),querySelectorAll:()=>[]};
  for(const [key,value]of Object.entries({type:'guide',title:'Preciso de um guia',program:'relatorio.p',details:'Exemplo para definir parâmetros',expected:'Um exemplo visual'}))node('suggestion-form').elements[key]={value};
  const window={crypto:{randomUUID:()=> 'request_uuid_12345'}};
  vm.runInNewContext(fs.readFileSync('SuggestionScripts.html','utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,''),{window});
  let fail=false;
  const rpc=async(method,input)=>{
    calls.push({method,input});if(fail&&method==='createSuggestion')throw Error('Falha de conexão');
    if(method==='createSuggestion')return {id:'saved'};
    return {total:1,items:[{id:'item1',type:'guide',status:'new',title:'<img src=x>',details:'Dúvida\ncom detalhes',program:'relatorio.p',author:'author@example.com',createdAt:'2026-01-01',response:'',expected:''}]};
  };
  return {node,calls,content,fail:()=>fail=true,render:()=>window.SupportFlowSuggestions.render({rpc,user:{role},content,isCurrent:()=>true})};
}
test('usuário envia sugestão, vê confirmação, recarrega lista e conteúdo é escapado',async()=>{
  const f=fixture();await f.render();assert.match(f.content.innerHTML,/Minhas sugestões/);assert.doesNotMatch(f.node('suggestion-list').innerHTML,/<img/);
  assert.match(f.node('suggestion-list').innerHTML,/&lt;img/);
  await f.node('suggestion-form').handlers.submit({preventDefault(){}});
  assert.equal(f.calls.find(c=>c.method==='createSuggestion').input.requestId,'request_uuid_12345');
  assert.equal(f.node('suggestion-form').didReset,true);assert.match(f.node('suggestion-status').textContent,/enviada/);
  assert.equal(f.node('send-suggestion').disabled,false);
});
test('falha preserva formulário e libera envio; administração recebe controles de andamento',async()=>{
  const f=fixture();await f.render();f.fail();await f.node('suggestion-form').handlers.submit({preventDefault(){}});
  assert.equal(f.node('suggestion-form').didReset,undefined);assert.match(f.node('suggestion-status').textContent,/Falha/);assert.equal(f.node('send-suggestion').disabled,false);
  const admin=fixture('admin');await admin.render();assert.match(admin.content.innerHTML,/Sugestões recebidas/);assert.match(admin.node('suggestion-list').innerHTML,/Registrar andamento/);
});
