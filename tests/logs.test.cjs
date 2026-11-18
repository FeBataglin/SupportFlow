const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function fixture(){
  const window={};
  vm.runInNewContext(fs.readFileSync('LogScripts.html','utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,''),{window,TextDecoder,setTimeout});
  const nodes=new Map();let current=true;
  const node=id=>{if(!nodes.has(id))nodes.set(id,{value:id==='log-level'?'all':'',hidden:false,innerHTML:'',textContent:'',files:[],handlers:{},addEventListener(name,fn){this.handlers[name]=fn;}});return nodes.get(id);};
  const content={innerHTML:'',querySelector:selector=>node(selector.slice(1))};
  window.SupportFlowLogs.render({content,isCurrent:()=>current,rpc:()=>{throw Error('Logs não devem chamar servidor');}});
  return {api:window.SupportFlowLogs,node,content,leave:()=>current=false};
}

test('exemplos PASOE de propriedades e rastreamento não são tratados como falhas',()=>{
  const {api}=fixture();
  const header='2026-11-13T09:30:00.025-0300 2498614 2498619 1 AS-4 ?:?:? ';
  const lines=[
    'Properties    1100 - Lendo: default/totvs.session.control.exception = TO',
    'Properties    1100 - Lendo: default/totvs.timeout = 25',
    'Properties    1100 - Lendo: default/totvs.timeout.exception = TO',
    'Properties    1100 - Lendo: default/totvs.timeout.message = 2',
    '4GLTRACE    Run getProperty "totvs.timeout.exception" [Main Block - fwk/menu/menuUserData.p @ 701]',
    '4GLTRACE    Run fn-has-row-errors [pi-get-v1 - fisiapi/apiFiscalDocumentItem.p @ 2643]',
    '4GLTRACE    Return from fn-has-row-errors "no" [fisiapi/apiFiscalDocumentItem.p]',
    '4GLTRACE    Run trataErro "ERROR" [programa.p @ 10]',
    'FILEID    Open /trab/erp/fnd/fwk/menu/menuApplicationData.r ID=115',
    'CONN    Database mgcad Options: (12699)'
  ].map(line=>header+line);
  const result=api.analyze(lines.join('\n'));
  assert.equal(result.occurrences,0);assert.equal(result.lineCount,10);
});

test('preserva falhas explícitas e agrupa mensagem PASOE entre sessões diferentes',()=>{
  const {api}=fixture();
  const header='2026-11-13T09:30:00.025-0300 2498614 2498619 1 AS-4 ?:?:? ';
  const other='2026-11-13T09:31:02.000-0300 2498615 2498700 1 AS-7 ?:?:? ';
  const lines=[header+'Properties    ERROR failed to load configuration',
    header+'4GLMessages    ** Unable to find programa.r. (293)',
    other+'4GLMessages    ** Unable to find programa.r. (293)',
    header+'4GLMessages    java.lang.IllegalStateException: dados inválidos',
    header+'4GLMessages    Connection timed out',
    header+'4GLMessages    HTTP 403',
    header+'4GLTRACE    ERROR connection refused',
    header+'4GLMessages    WARN operação incompleta'];
  const result=api.analyze(lines.join('\n'));
  assert.equal(result.occurrences,8);assert.equal(result.groups.length,7);
  const abl=result.groups.find(g=>g.message.includes('(293)'));
  assert.equal(abl.count,2);assert.equal(abl.samples[1].line,3);
  assert.equal(result.groups.find(g=>g.id==='timeout').count,1);
  assert.ok(result.groups.some(g=>g.message.includes('IllegalStateException')));
});

test('nomes de propriedades sem cabeçalho não bastam para inferir timeout ou exceção',()=>{
  const {api}=fixture();
  assert.equal(api.analyze('totvs.timeout = 25\ndefault/totvs.timeout.exception = TO\nhas-errors = no\nerrorCount = 0').occurrences,0);
});
test('classifica padrões, preserva contexto e agrupa repetições sem unir IDs distintos',()=>{
  const {api}=fixture();
  const result=api.analyze('2026-01-01T10:00:00 ERROR pedido 1\n2026-01-01T10:01:00 ERROR pedido 1\nERROR pedido 2\nWARN teste\nHTTP 403\nconnection refused\nrequest timeout\nHTTP 500','pedido');
  assert.equal(result.occurrences,8);assert.equal(result.groups.length,7);
  assert.equal(result.groups[0].count,2);assert.equal(result.groups[0].programMatch,true);
  assert.equal(result.groups[0].samples[1].line,2);assert.equal(result.groups[0].samples[0].context[0].line,1);
  assert.equal(result.groups.find(g=>g.id==='auth').guide,'KB-0010');
  assert.equal(result.groups.find(g=>g.id==='warning').level,'warning');
  assert.equal(result.groups.find(g=>g.id==='connection').programMatch,false);
});
test('não interpreta qualquer número como HTTP e não afirma ausência de problemas',()=>{
  const f=fixture();assert.equal(f.api.analyze('INFO pedido 500\nINFO normal').occurrences,0);
  f.node('log-text').value='INFO normal';f.node('log-analyze').handlers.click();
  assert.match(f.node('log-status').textContent,/não garante/);
  assert.throws(()=>f.api.analyze('x'.repeat(2097153)),/2 MB/);
});
test('renderiza conteúdo como texto escapado e filtros não alteram contagens',()=>{
  const f=fixture();f.node('log-text').value='ERROR <img src=x onerror=alert(1)>\nWARN teste';f.node('log-analyze').handlers.click();
  assert.doesNotMatch(f.node('log-groups').innerHTML,/<img/);assert.match(f.node('log-groups').innerHTML,/&lt;img/);
  assert.doesNotMatch(f.node('log-groups').innerHTML,/<h3>Aviso registrado/);
  f.node('log-warnings').checked=true;f.node('log-warnings').handlers.change();
  assert.match(f.node('log-groups').innerHTML,/<h3>Aviso registrado/);
  assert.match(f.node('log-groups').innerHTML,/L1: ERROR &lt;img/); // contexto original é preservado mesmo com filtro de avisos
  assert.match(f.node('log-summary').textContent,/2 ocorrências/);
  f.node('log-search').value='ausente';f.node('log-search').handlers.input();assert.match(f.node('log-groups').innerHTML,/Nenhuma mensagem/);
  assert.equal(f.node('log-more').hidden,true);
});

test('avisos são opcionais, não exigem reanálise e limpar restaura o padrão',()=>{
  const f=fixture();f.node('log-text').value='WARN operação incompleta';f.node('log-analyze').handlers.click();
  assert.doesNotMatch(f.node('log-groups').innerHTML,/<h3>Aviso registrado/);
  f.node('log-warnings').checked=true;f.node('log-warnings').handlers.change();
  assert.match(f.node('log-groups').innerHTML,/<h3>Aviso registrado/);
  f.node('log-warnings').checked=false;f.node('log-warnings').handlers.change();
  assert.doesNotMatch(f.node('log-groups').innerHTML,/<h3>Aviso registrado/);
  f.node('log-warnings').checked=true;f.node('log-clear').handlers.click();assert.equal(f.node('log-warnings').checked,false);
});
test('limpar descarta resultados e impede leitura pendente de repor o log',async()=>{
  const f=fixture();let finish;
  f.node('log-file').files=[{name:'test.log',size:20,text:()=>new Promise(resolve=>finish=resolve)}];
  const pending=f.node('log-file').handlers.change();
  assert.equal(f.node('log-loading').hidden,false);
  f.node('log-clear').handlers.click();finish('ERROR cliente');await pending;
  assert.equal(f.node('log-loading').hidden,true);
  assert.equal(f.node('log-text').value,'');assert.equal(f.node('log-results').hidden,true);assert.equal(f.node('log-groups').innerHTML,'');
});
test('não altera tela após sair, rejeita arquivo inválido e limita grupos com aviso',async()=>{
  const f=fixture();f.node('log-file').files=[{name:'test.har',size:2}];await f.node('log-file').handlers.change();assert.match(f.node('log-status').textContent,/TXT ou LOG/);
  let finish;f.node('log-file').files=[{name:'test.log',size:20,text:()=>new Promise(resolve=>finish=resolve)}];const pending=f.node('log-file').handlers.change();f.leave();finish('ERROR cliente');await pending;assert.equal(f.node('log-text').value,'');
  const result=f.api.analyze(Array.from({length:2100},(_,i)=>'ERROR pedido '+i).join('\n'));
  assert.equal(result.groups.length,2000);assert.equal(result.omitted,100);assert.equal(result.occurrences,2100);
});
test('menu não exibe módulos descontinuados e manifesto não pede requisições externas',()=>{
  const source=fs.readFileSync('Scripts.html','utf8');assert.doesNotMatch(source,/gemini:|history:|GEMINI_API_KEY/);
  assert.equal(JSON.parse(fs.readFileSync('appsscript.json','utf8')).oauthScopes.some(s=>s.endsWith('/script.external_request')),false);
});

test('arquivo de 31 MB é analisado até o fim em blocos, com progresso e contexto',async()=>{
  const f=fixture(),progress=[];
  const normal='INFO processamento normal\r\n';
  const padding=normal.repeat(Math.ceil(31*1024*1024/normal.length));
  const text='ERROR inicio\r\n'+padding+'ERROR final conexão\r\nfim';
  const file=new Blob([text]);
  assert.ok(file.size>31*1024*1024);
  const result=await f.api.analyzeFile(file,'conexão',{onProgress:value=>progress.push(value)});
  assert.equal(result.occurrences,2);assert.equal(result.programMatches,1);
  assert.equal(result.groups[1].message,'ERROR final conexão');
  assert.equal(result.groups[1].samples[0].context.at(-1).text,'fim');
  assert.equal(result.lineCount,text.split('\n').length);
  assert.equal(progress.at(-1),100);assert.ok(progress.length>100);
});

test('blocos preservam UTF-8, CRLF, numeração e repetição na fronteira',async()=>{
  const f=fixture();
  const text='x'.repeat(256*1024-1)+'é\r\nERROR conexão\r\nERROR conexão\r\nfim\n';
  const result=await f.api.analyzeFile(new Blob([text]));
  const expected=f.api.analyze(text);
  assert.equal(JSON.stringify(result),JSON.stringify(expected));
});

test('arquivo grande fica fora da caixa, limpar cancela e arquivo excessivo informa limite',async()=>{
  const f=fixture();
  const file=Object.assign(new Blob(['INFO normal\n'.repeat(190000),'ERROR fim']),{name:'grande.log'});
  f.node('log-file').files=[file];await f.node('log-file').handlers.change();
  assert.equal(f.node('log-text').value,'');assert.match(f.node('log-status').textContent,/selecionado/);
  assert.equal(f.node('log-text').disabled,true);
  const pending=f.node('log-analyze').handlers.click();
  assert.equal(f.node('log-loading').hidden,false);
  f.node('log-clear').handlers.click();await pending;
  assert.equal(f.node('log-loading').hidden,true);
  assert.equal(f.node('log-results').hidden,true);assert.equal(f.node('log-status').textContent,'');
  assert.equal(f.node('log-analyze').disabled,false);
  f.node('log-file').files=[{name:'gigante.log',size:101*1024*1024}];await f.node('log-file').handlers.change();
  assert.match(f.node('log-status').textContent,/100 MB/);
});

test('bytes inválidos são sinalizados sem interromper; linha excessiva continua bloqueada',async()=>{
  const f=fixture();
  const decoded=await f.api.analyzeFile(new Blob(['ERROR início\n',new Uint8Array([0xff]),'\nERROR fim']));
  assert.equal(decoded.replacementCharacters,1);assert.equal(decoded.occurrences,2);assert.equal(decoded.lineCount,3);
  await assert.rejects(()=>f.api.analyzeFile(new Blob(['x'.repeat(1024*1024+1)])),/linha maior/);
  let active=true,progress=0;
  const output=await f.api.analyzeFile(new Blob(['INFO normal\n'.repeat(50000)]),'',{isCurrent:()=>active,onProgress:()=>{progress++;active=false;}});
  assert.equal(output,null);assert.equal(progress,1);
});

test('falha de leitura de bloco não é apresentada como problema UTF-8',async()=>{
  const f=fixture();
  const file={name:'cliente.log',size:3*1024*1024,slice:()=>({arrayBuffer:async()=>{throw new TypeError('Falha de leitura');}})};
  f.node('log-file').files=[file];await f.node('log-file').handlers.change();await f.node('log-analyze').handlers.click();
  assert.match(f.node('log-status').textContent,/ler um bloco/);
  assert.doesNotMatch(f.node('log-status').textContent,/UTF-8|decodificar/);
  assert.equal(f.node('log-loading').hidden,true);assert.equal(f.node('log-results').hidden,true);
});

test('arquivo com byte ilegível conclui análise e informa substituição na interface',async()=>{
  const f=fixture();
  const file=Object.assign(new Blob(['INFO normal\n'.repeat(190000),new Uint8Array([0xff]),'\nERROR final']),{name:'cliente.log'});
  f.node('log-file').files=[file];await f.node('log-file').handlers.change();await f.node('log-analyze').handlers.click();
  assert.equal(f.node('log-results').hidden,false);
  assert.match(f.node('log-status').textContent,/Análise concluída/);
  assert.match(f.node('log-status').textContent,/1 caractere\(s\) de substituição/);
  assert.match(f.node('log-groups').innerHTML,/ERROR final/);
  assert.equal(f.node('log-loading').hidden,true);
});
