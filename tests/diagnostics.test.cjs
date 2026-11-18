const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function fixture(clipboard){
  const window={},navigator={clipboard};
  const context=vm.createContext({window,navigator});
  for(const name of ['DiagnosticFlows','DiagnosticScripts'])vm.runInContext(fs.readFileSync(name+'.html','utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,''),context);
  const nodes=new Map();let selected=null,current=true;
  function node(id){if(!nodes.has(id))nodes.set(id,{value:'',innerHTML:'',textContent:'',dataset:{},attributes:{},setAttribute(name,value){this.attributes[name]=value;},handlers:{},focus(){this.focused=true;},select(){this.selected=true;},addEventListener(type,handler){this.handlers[type]=handler;}});return nodes.get(id);}
  const content={innerHTML:'',querySelector:selector=>selector.includes(':checked')?selected:node(selector.slice(1)),querySelectorAll:selector=>selector==='[data-symptom]'?window.SupportFlowDiagnosticFlows.symptoms.map(s=>{const n=node('symptom-'+s.id);n.dataset.symptom=s.id;return n;}):[]};
  const api=window.SupportFlowDiagnostics,catalog=window.SupportFlowDiagnosticFlows;
  const render=()=>api.render({content,isCurrent:()=>current});render();
  return {api,catalog,node,content,render,select:index=>selected={value:String(index)},leave:()=>current=false,submit:()=>node('diag-form').handlers.submit({preventDefault(){}})};
}
test('dezoito cenários iniciam em nós válidos e todo roteiro tem saída e guias conhecidos',()=>{
  const {catalog}=fixture();assert.equal(catalog.symptoms.length,18);
  const reachable=new Set(),pending=catalog.symptoms.map(s=>s.start);
  while(pending.length){const id=pending.pop();if(reachable.has(id))continue;reachable.add(id);const node=catalog.nodes[id];assert.ok(node,id);assert.ok(node.guides.length);for(const code of node.guides)assert.match(code,/^KB-00(?:0[1-9]|[12]\d|3[0-5])$/);if(node.choices){assert.ok(node.choices.some(c=>c.label==='Não consegui verificar'));node.choices.forEach(c=>pending.push(c.next));}else assert.ok(node.recommendation);}
  assert.equal(reachable.size,Object.keys(catalog.nodes).length);
  for(const id of reachable){const visited=new Set(),queue=[id];let terminal=false;while(queue.length){const next=queue.shift();if(visited.has(next))continue;visited.add(next);const node=catalog.nodes[next];if(!node.choices){terminal=true;break;}queue.push(...node.choices.map(c=>c.next));}assert.ok(terminal,id);}
});
test('decisões conduzem ao próximo teste sem inferir causa raiz',()=>{
  const {api}=fixture(),session=api.create('open',{program:'teste',environment:'homologação'});
  assert.throws(()=>api.choose(session,99),/resultado observado/);assert.equal(session.answers.length,0);
  api.choose(session,1,'HTTP 403 às 14:00 UTC-03');assert.equal(session.current,'access');
  api.choose(session,0);assert.equal(session.current,'permissionEnd');
  const report=api.report(session);assert.match(report,/HTTP 403 às 14:00/);assert.match(report,/Próximos passos/);assert.match(report,/Não confirma a causa raiz/);assert.match(report,/homologação/);
});
test('voltar e mudar resposta descarta o caminho anterior e preserva nota para revisão',()=>{
  const {api}=fixture(),session=api.create('open');api.choose(session,1,'primeiro teste');api.choose(session,0,'comparação');
  api.back(session);assert.equal(session.current,'access');assert.equal(session.draft.note,'comparação');
  api.back(session);assert.equal(session.current,'network');assert.equal(session.draft.choice,'1');assert.equal(session.draft.note,'primeiro teste');
  api.choose(session,2,'404');assert.equal(session.current,'endpoint');assert.equal(session.answers.length,1);assert.doesNotMatch(api.report(session),/primeiro teste|comparação/);
});
test('não verificado resulta em coleta, resumo parcial não marca teste pendente como executado',()=>{
  const {api,catalog}=fixture(),session=api.create('slow');
  assert.match(api.report(session),/Nenhum teste respondido/);assert.match(api.report(session),/Pendente: Observe/);
  api.choose(session,catalog.nodes.timing.choices.length-1);assert.equal(session.current,'collect');assert.match(api.report(session),/Não consegui verificar/);
});
test('interface exige escolha, preserva sessão ao consultar outro módulo e escapa observações',()=>{
  const f=fixture();f.node('diag-program').value='<img src=x>';f.node('symptom-open').handlers.click();
  f.submit();assert.equal(f.node('diag-status').textContent,'Selecione o resultado observado para continuar.');
  f.select(1);f.node('diag-note').value='<script>alert(1)</script>';f.submit();
  assert.match(f.content.innerHTML,/&lt;script&gt;/);assert.doesNotMatch(f.content.innerHTML,/<script>alert/);
  f.render();assert.match(f.content.innerHTML,/Identifique o alcance/);assert.match(f.content.innerHTML,/1 teste\(s\) respondido/);
});
test('novo diagnóstico só descarta após confirmação explícita',()=>{
  const f=fixture();f.node('symptom-slow').handlers.click();f.select(0);f.submit();
  f.node('diag-new').handlers.click();assert.match(f.content.innerHTML,/Descartar as respostas/);
  f.node('diag-keep').handlers.click();assert.match(f.content.innerHTML,/Compare o alcance/);
  f.node('diag-new').handlers.click();f.node('diag-discard').handlers.click();assert.match(f.content.innerHTML,/O que está acontecendo/);
  f.node('symptom-open').handlers.click();assert.match(f.content.innerHTML,/0 teste\(s\) respondido/);
});
test('resumo pode ser copiado e tem seleção manual quando clipboard é bloqueado',async()=>{
  let copied='';const f=fixture({writeText:async text=>{copied=text;}});
  f.node('symptom-access').handlers.click();f.select(0);f.submit();f.node('diag-summary').handlers.click();await f.node('diag-copy').handlers.click();
  assert.match(copied,/Apenas um usuário/);assert.equal(f.node('diag-copy-status').textContent,'Resumo copiado.');
  const g=fixture({writeText:async()=>{throw Error('blocked');}});g.node('symptom-slow').handlers.click();g.node('diag-summary').handlers.click();await g.node('diag-copy').handlers.click();assert.equal(g.node('diag-report').selected,true);assert.match(g.node('diag-copy-status').textContent,/Ctrl\+C/);
});
test('diagnóstico funciona sem endpoints ou armazenamento de respostas',()=>{
  const source=fs.readFileSync('DiagnosticScripts.html','utf8');assert.doesNotMatch(source,/localStorage|sessionStorage|google\.script|\brpc\(|\bfetch\(/);
  assert.match(fs.readFileSync('.claspignore','utf8'),/!DiagnosticScripts\.html/);
});

test('pacote e ambiente conduzem ao PROPATH, objetos e coleta, com evidências exigidas',()=>{
  const {api}=fixture(),session=api.create('update');
  api.choose(session,2,'Pacote do ticket conferido');assert.equal(session.current,'server');
  assert.throws(()=>api.choose(session,0),/Registre a evidência/);assert.equal(session.answers.length,1);
  api.choose(session,0,'html.environmentInf da instância web, release e versão capturados');
  api.choose(session,0,'Pacote, pré-requisitos e componentes confirmados');assert.equal(session.current,'propath');
  api.choose(session,0,'PROPATH e ordem capturados, busca em pasta/programa.r');assert.equal(session.current,'objectsCheck');
  api.choose(session,0,'Objetos comparados ao pacote na instância correta');
  api.choose(session,0,'Sem customização identificada');assert.equal(session.current,'requestLog');
  assert.equal(api.readiness(session).find(c=>c.id==='analysis'),undefined);
});

test('receber log não marca leitura como concluída e impede confirmação sem observação',()=>{
  const {api}=fixture(),session=api.create('logs');api.choose(session,0);
  assert.equal(session.current,'analyzeLog');assert.equal(api.readiness(session).find(c=>c.id==='collection').status,'Registrado');
  assert.equal(api.readiness(session).find(c=>c.id==='analysis').status,'Em andamento');
  assert.throws(()=>api.choose(session,0),/Registre a evidência/);
  api.choose(session,3);assert.equal(session.current,'logNotReviewedEnd');
  assert.equal(api.readiness(session).find(c=>c.id==='analysis').status,'Pendente');
  assert.match(api.report(session),/Análise do log pendente/);
});

test('erro encontrado exige correlação e não cobra verificações fora do caminho',()=>{
  const {api}=fixture(),session=api.create('logs');api.choose(session,0);api.choose(session,0,'ERROR programa.r (565), L120-130, 14:00 UTC-03');
  assert.equal(session.current,'logCorrelation');assert.throws(()=>api.choose(session,0),/Registre a evidência/);
  api.choose(session,0,'Mesma instância, programa, sessão e ação no horário');api.choose(session,2);
  assert.equal(session.current,'supportReview');assert.equal(api.readiness(session).find(c=>c.id==='environment'),undefined);
  api.choose(session,0);assert.equal(session.current,'serverEnd');
  assert.match(api.report(session),/ERROR programa.r \(565\)/);assert.doesNotMatch(api.report(session),/Ambiente, versão e instância: Pendente/);
});

test('ausência de erros exige conferir cobertura, sem produzir diagnóstico de sucesso',()=>{
  const {api}=fixture(),session=api.create('logs');api.choose(session,0);api.choose(session,1,'Li as linhas 100-300 do intervalo do teste, sem erros visíveis');
  assert.equal(session.current,'logCoverage');assert.throws(()=>api.choose(session,0),/Registre a evidência/);
  api.choose(session,0,'Instância e fuso confirmados, leitura manual do intervalo concluída');assert.equal(session.current,'supportReview');
  assert.match(api.report(session),/Não confirma a causa raiz/);assert.equal(api.readiness(session).find(c=>c.id==='correlation').status,'Registrado');
});

test('coleta ausente ou impossibilitada vira pendência e não encaminhamento técnico concluído',()=>{
  const {api}=fixture(),session=api.create('logs',{program:'fiscalDocument.p',environment:'homologação'});
  const request=api.requestText(session);assert.match(request,/fiscalDocument.p/);assert.match(request,/horário exato do ocorrido, com o fuso/);assert.doesNotMatch(request,/PROPATH|hash|pré-requisitos/);
  api.choose(session,2);assert.equal(session.current,'logAwaitEnd');assert.equal(api.readiness(session).find(c=>c.id==='collection').status,'Pendente');
  assert.match(api.report(session),/Pendências\/impedimentos/);assert.doesNotMatch(api.report(session),/Leitura do log documentada: Registrado/);
});

test('atalho do analisador preserva diagnóstico e solicitação ao cliente é copiada por ação explícita',async()=>{
  let copied='';const f=fixture({writeText:async text=>{copied=text;}});
  f.node('diag-program').value='fiscalDocument.p';f.node('symptom-logs').handlers.click();
  assert.match(f.content.innerHTML,/Texto para solicitar ao cliente/);await f.node('diag-copy-request').handlers.click();assert.match(copied,/fiscalDocument.p/);
  f.select(0);f.submit();assert.match(f.content.innerHTML,/Abrir Analisador de logs/);assert.match(f.content.innerHTML,/href="#logs"/);
  f.render();assert.match(f.content.innerHTML,/Analise o log e registre os achados/);assert.match(f.content.innerHTML,/Leitura do log documentada/);
});

test('revisão de resposta descarta confirmações posteriores do checklist',()=>{
  const {api}=fixture(),session=api.create('logs');api.choose(session,0);api.choose(session,0,'Erro revisado no contexto');
  assert.equal(api.readiness(session).find(c=>c.id==='analysis').status,'Registrado');
  api.back(session);api.back(session);api.choose(session,2);
  assert.equal(api.readiness(session).find(c=>c.id==='analysis'),undefined);assert.doesNotMatch(api.report(session),/Erro revisado no contexto/);
});

test('evidência faltante destaca orientação junto ao campo e leva o foco para preenchimento',()=>{
  const f=fixture();f.node('symptom-environment').handlers.click();
  assert.equal(f.node('diag-note-help').hidden,false);
  f.select(0);f.submit();
  assert.equal(f.node('diag-note').focused,true);
  assert.equal(f.node('diag-note').attributes['aria-invalid'],'true');
  assert.match(f.node('diag-note-help').textContent,/preencha este campo/);
  f.node('diag-note').value='Instância e versão conferidas';f.node('diag-note').handlers.input();
  assert.equal(f.node('diag-note').attributes['aria-invalid'],'false');
  assert.equal(f.node('diag-status').textContent,'');
  f.submit();assert.match(f.content.innerHTML,/Valide pacote e componentes/);
});

test('roteiro orienta investigação sem referências a apoio e separa testes no resumo copiado',()=>{
  const {api,catalog}=fixture();
  for(const node of Object.values(catalog.nodes)){
    assert.doesNotMatch(node.title+' '+(node.instruction||node.recommendation),/apoio|manuten[çc][ãa]o/i);
    for(const choice of node.choices||[])assert.doesNotMatch(choice.label,/apoio|manuten[çc][ãa]o/i);
  }
  const session=api.create('logs');api.choose(session,0);api.choose(session,0,'Mensagem e linhas revisadas');
  const report=api.report(session);
  assert.match(report,/Testes e resultados informados:\n\n1\./);
  assert.match(report,/Resultado: Recebi[^\n]+\n\n2\./);
  assert.match(report,/Evidência\/observação: Mensagem e linhas revisadas\n\nPendente:/);
  assert.doesNotMatch(report,/apoio|manuten[çc][ãa]o/i);
  assert.match(report,/Verificações da investigação/);
});

test('análise de log com verificação de objeto não cria pendências de pacote, ambiente ou UPC',()=>{
  const {api}=fixture(),session=api.create('logs');
  api.choose(session,0);api.choose(session,0,'Mensagem e linhas revisadas');
  api.choose(session,0,'Instância e sessão relacionadas ao teste');api.choose(session,0);
  api.choose(session,1,'Objeto e caminho conferidos');api.choose(session,0);
  const checks=api.readiness(session);
  assert.equal(checks.some(c=>['environment','package','custom'].includes(c.id)),false);
  assert.equal(checks.some(c=>c.status==='Pendente'),false);
  assert.equal(checks.find(c=>c.id==='propath').status,'Registrado');
  assert.doesNotMatch(api.report(session),/Customizações e UPCs|Pacote e componentes|Ambiente, versão e instância/);
});

test('simulação incompleta não é tratada como reprodução concluída',()=>{
  const {api}=fixture(),session=api.create('simulation');
  assert.throws(()=>api.choose(session,0),/evidência/);assert.equal(session.answers.length,0);
  api.choose(session,0,'Pré-requisitos e passos 1-4 registrados');api.choose(session,2,'Tentativa não repetiu o resultado');
  assert.equal(session.current,'reproMissing');api.choose(session,1,'Falta parâmetro da execução original');
  assert.equal(session.current,'simulationCollect');assert.match(api.report(session),/não consegui reproduzir/i);
  assert.equal(api.readiness(session).find(c=>c.id==='reproduction').status,'Pendente');
});

test('execução Desktop direciona coleta para sessão/cliente e não exige PASOE',()=>{
  const {api}=fixture(),session=api.create('progress');
  api.choose(session,0);api.choose(session,0,'Passos e parâmetros registrados');api.choose(session,0,'Reproduz sempre às 10:00 UTC-03');api.choose(session,0);
  api.choose(session,1,'Mensagem completa e código (565)');assert.equal(session.current,'executionLog');
  api.choose(session,0);assert.equal(session.current,'desktopLog');
  assert.doesNotMatch(api.requestText(session),/PASOE|AppServer/);assert.match(api.requestText(session),/servidor Progress que atende essa tela/);
  api.choose(session,0,'Registro da sessão e mensagem correlacionados');api.choose(session,0,'Simulação e evidências organizadas');
  assert.equal(session.current,'functionalEnd');assert.equal(session.answers.some(a=>a.node==='requestLog'),false);
});

test('SPED diferencia registro ausente do arquivo e registro não mostrado no validador',()=>{
  const {api}=fixture(),session=api.create('missingRecord');
  for(const note of ['Obrigação, período, leiaute e origem registrados','Referência validada para o cenário','Origem e parâmetros conferidos'])api.choose(session,0,note);
  assert.equal(session.current,'recordFile');api.choose(session,1,'Registro presente no trecho autorizado');
  assert.equal(session.current,'validatorEnd');assert.equal(session.answers.some(a=>a.node==='requestLog'),false);
  const other=api.create('missingRecord');
  for(const note of ['Identificação','Referência','Origem','Ausente no arquivo','Reproduzido','Resultados organizados'])api.choose(other,0,note);
  assert.equal(other.current,'functionalEnd');assert.equal(api.readiness(other).some(c=>c.id==='analysis'),false);
});

test('cálculo exige regra e memória antes da comparação e preserva esperado/observado',()=>{
  const {api}=fixture(),session=api.create('calculation',{expected:'100,00 conforme referência validada',observed:'99,99'});
  api.choose(session,0,'Entradas e diferença registradas');assert.equal(session.current,'calcRule');
  api.choose(session,0,'Regra e referência aplicável registradas');assert.equal(session.current,'calcMemory');
  assert.throws(()=>api.choose(session,0),/evidência/);
  api.choose(session,0,'Memória com entradas, etapas e precisão registrada');api.choose(session,0,'Mesmo cenário reproduzido');api.choose(session,0,'Conclusões possíveis documentadas');
  assert.equal(session.current,'functionalEnd');
  const report=api.report(session);assert.match(report,/Resultado esperado: 100,00/);assert.match(report,/Resultado observado: 99,99/);assert.doesNotMatch(report,/Leitura do log documentada/);
  const pending=api.create('calculation');api.choose(pending,0,'Valores identificados');api.choose(pending,1,'A fórmula esperada ainda não foi confirmada');assert.equal(pending.current,'rulePending');
});

test('contexto separado e novos guias aparecem no roteiro sem perder escape de HTML',()=>{
  const f=fixture();assert.match(f.content.innerHTML,/id="diag-expected"/);assert.match(f.content.innerHTML,/id="diag-observed"/);
  f.node('diag-expected').value='Resultado <esperado>';f.node('diag-observed').value='Resultado diferente';f.node('symptom-calculation').handlers.click();
  assert.match(f.content.innerHTML,/KB-0034/);f.node('diag-summary').handlers.click();
  assert.match(f.content.innerHTML,/Resultado esperado: Resultado &lt;esperado&gt;/);assert.match(f.content.innerHTML,/Resultado observado: Resultado diferente/);
});

test('diagnóstico distingue explicitamente servidor web e servidor das telas Progress',()=>{
  const {api,catalog}=fixture();
  assert.match(catalog.nodes.execution.instruction,/servidor Progress, separado/);
  assert.match(catalog.nodes.desktopLog.instruction,/servidor Progress atende a tela/);
  assert.match(catalog.nodes.requestLog.instruction,/servidor web\/PASOE/);
  const desktop=api.create('progress');api.choose(desktop,0);
  assert.match(api.report(desktop),/Servidor da investigação: Servidor Progress das telas/);
  const web=api.create('logs');api.choose(web,0);assert.match(api.report(web),/Servidor da investigação: Servidor web\/PASOE/);
  assert.doesNotMatch(api.requestText(web),/log do PASOE\/AppServer/);
});

test('título do resumo é separado do roteiro e dos dados por linhas em branco',()=>{
  const {api}=fixture();const text=api.report(api.create('rpw'));
  assert.match(text,/^Diagnóstico assistido — SupportFlow\n\nRoteiro [^\n]+\n\nPrograma/);
});

test('RPW concluído com saída correta não exige log ou verificações de outro servidor',()=>{
  const {api}=fixture(),session=api.create('rpw');
  api.choose(session,0,'Servidor RPW identificado, execução 123, parâmetros e horário');
  api.choose(session,3,'Execução concluída');api.choose(session,0,'Arquivo desta execução conferido');
  assert.equal(session.current,'rpwSuccessEnd');
  assert.equal(api.readiness(session).some(c=>c.id==='rpwLogs'||c.id==='propath'),false);
  assert.match(api.report(session),/Servidor da investigação: Servidor RPW/);
});

test('falha RPW pede log desse servidor e exige leitura com evidência',()=>{
  const {api}=fixture(),session=api.create('rpw',{program:'relatorio.p'});
  api.choose(session,0,'Execução identificada');api.choose(session,2,'Falha apresentada no acompanhamento');
  assert.equal(session.current,'rpwLog');const request=api.requestText(session);
  assert.match(request,/log do servidor RPW/);assert.match(request,/identificador da execução/);assert.doesNotMatch(request,/PASOE|AppServer|servidor Progress/);
  api.choose(session,0);assert.equal(session.current,'rpwAnalyze');assert.throws(()=>api.choose(session,0),/evidência/);
  api.choose(session,0,'L80: objeto indicado no erro, mesma execução e horário');assert.equal(session.current,'rpwObject');
  api.choose(session,1,'Objeto, pacote e caminho conferidos no RPW');assert.equal(session.current,'rpwEvidenceEnd');
  assert.equal(api.readiness(session).find(c=>c.id==='rpwAnalysis').status,'Registrado');
});

test('saída divergente segue análise funcional e coleta RPW não recebida fica pendente',()=>{
  const {api}=fixture(),session=api.create('rpw');
  api.choose(session,0,'Contexto RPW');api.choose(session,3,'Concluído');api.choose(session,1,'Saída vazia');api.choose(session,1,'Parâmetros comparados ao esperado');
  assert.equal(session.current,'functionalRule');assert.equal(api.readiness(session).some(c=>c.id==='rpwLogs'),false);
  const pending=api.create('rpw');api.choose(pending,0,'Contexto RPW');api.choose(pending,2,'Falhou');api.choose(pending,1);
  assert.equal(pending.current,'rpwLogPendingEnd');assert.equal(api.readiness(pending).find(c=>c.id==='rpwLogs').status,'Pendente');
});
