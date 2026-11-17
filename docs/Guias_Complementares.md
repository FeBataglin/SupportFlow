# SupportFlow — Guias complementares

Material elaborado a partir de orientações do usuário e referências técnicas. Importar como Não publicado para revisão antes de disponibilizar ao Atendimento.

# Categoria — Ambiente Datasul

## KB-0024 — Aplicando correções de aplicações web (.war)

**Palavras-chave:** war, webapps, aplicação web, atualização, correção, deploy, Tomcat, PASOE, pacote, reiniciar, cache

**Objetivo:** Orientar o envio e a aplicação de uma correção web pelo responsável pelo ambiente, com backup e validação do resultado.

**Quando usar:** O Desenvolvimento disponibilizou no ticket um arquivo .war para atualizar uma aplicação web específica. Este roteiro é para substituição manual autorizada; se o ambiente usa publicação por T-Cloud, contêiner, pipeline ou ferramenta própria, solicite a aplicação pelo processo correspondente.

**Antes de começar:** Confirmar o nome exato do projeto, arquivo recebido, release compatível, ambiente, instância e serviço que hospeda a aplicação. Combinar janela de manutenção, responsável técnico e retorno ao backup. Preferir homologação antes de produção. Quando a correção se limitar ao .war, enviar esse artefato no ticket; não incluir pastas extraídas ou arquivos de desenvolvimento. Se houver outros componentes obrigatórios, seguir as instruções completas do pacote.

**Diretório de exemplo:** <SERVIDOR>\<INSTANCIA>\webapps. O caminho real deve ser confirmado com o responsável. Para exemplo.war, a pasta expandida costuma se chamar exemplo; a configuração de contexto pode alterar esse comportamento.

### Como fazer

1. No ticket, identificar o arquivo .war, o projeto atualizado, o ambiente de destino e o cenário que deve ser retestado. Confirmar que o pacote recebido corresponde à correção e à versão do cliente.

2. Solicitar ao responsável que confirme qual instância atende a URL utilizada e qual serviço hospeda o projeto. O .war normalmente é publicado no Tomcat; a instância PASOE pode fazer parte da arquitetura. Não tratar o AppServer Progress como substituto automático do serviço que hospeda a aplicação web.

3. Combinar a interrupção com o cliente e pedir ao responsável que pare o serviço confirmado antes de substituir os arquivos. Se a orientação específica do pacote também exigir parada do PASOE ou outro serviço, incluir isso no planejamento e na ordem de retomada.

4. Com o serviço parado, fazer backup do .war atual, da pasta do projeto e das configurações específicas que precisem ser preservadas. Guardar o backup fora de webapps para que ele não seja interpretado como outra aplicação. Confirmar que há um plano de restauração antes de remover qualquer arquivo.

5. Acessar a pasta webapps da instância correta e conferir o nome do projeto. No exemplo, os alvos são somente exemplo.war e a pasta exemplo. Remover esses itens da área de implantação apenas depois do backup, conforme o procedimento autorizado. Não excluir a pasta webapps, outros projetos ou configurações externas ao alvo.

6. Copiar para webapps o .war disponibilizado no ticket, com o nome/contexto confirmado para o projeto. Não manter simultaneamente versões antiga e nova com nomes diferentes nessa pasta. Não copiar uma pasta extraída manualmente por cima da aplicação existente.

7. Pedir ao responsável que inicie novamente o serviço que hospeda a aplicação e, se previsto na orientação específica, os demais serviços envolvidos. Reiniciar somente o AppServer não garante a publicação do .war no Tomcat.

8. Aguardar a implantação e solicitar a conferência dos logs de inicialização/publicação. Se a instância estiver configurada para expandir o .war, conferir a recriação da pasta do projeto; a ausência dessa pasta não indica erro por si só quando a expansão está desabilitada.

9. Abrir a aplicação na URL do ambiente atualizado. Usar uma janela anônima com as credenciais próprias e autorizadas do usuário ou realizar o teste de cache descrito no KB-0005. A janela anônima não substitui a confirmação da versão implantada no servidor.

10. Repetir o cenário original com dados de teste seguros e comparar o resultado esperado com o observado. Confirmar também a abertura de uma rotina relacionada, conforme o alcance da correção.

11. Se a atualização não subir, apresentar erro novo ou o cenário continuar falhando, registrar horário, URL, mensagem e logs do serviço responsável. Acionar a equipe técnica para avaliar a implantação e, se necessário, executar o retorno ao backup pelo procedimento aprovado. Não insistir em substituições ou reinícios sem avaliação.

12. Registrar no ticket o artefato aplicado, instância, serviço reiniciado, data/horário, responsável, testes e confirmação do cliente.

### O que o resultado significa

- A aplicação abriu e o cenário corrigido funcionou: registrar as evidências e confirmar com o cliente antes de concluir.

- A tela parece antiga: verificar instância, URL, conclusão da implantação, demais nós do ambiente e cache; não concluir que o problema é somente o navegador.

- HTTP 404 ou falha ao iniciar: pode haver contexto, nome do projeto, dependência ou publicação incorretos. A mensagem e os logs devem orientar a análise técnica.

- HTTP 500 ou erro funcional persistente: correlacionar Network e logs; substituir o .war não comprova que o cenário foi resolvido.

**O que anexar ao chamado:** Nome e identificação da correção, ambiente/instância, data e fuso da aplicação, serviço envolvido, resultado antes/depois, mensagens e logs revisados. Não anexar credenciais nem o conteúdo de configurações sensíveis.

**Quando pedir ajuda:** Acionar infraestrutura, Framework, Cloud ou responsável pela implantação quando não houver acesso, não for possível identificar a instância, houver múltiplos nós ou a publicação falhar. Encaminhar ao Desenvolvimento quando a implantação estiver confirmada e o cenário funcional continuar divergente.

**Atenção:** A substituição e a parada de serviços são executadas pelo responsável autorizado pelo ambiente. Este guia não determina reinício indiscriminado de AppServer/PASOE, exclusão de todas as aplicações ou limpeza geral de diretórios temporários. Preserve parâmetros específicos do cliente e siga as instruções do pacote. Nenhuma operação no servidor é executada pelo SupportFlow.

**Guias relacionados:** KB-0003, KB-0005, KB-0006, KB-0007, KB-0013, KB-0017, KB-0022

**Referências:** [Apache Tomcat — Web Application Deployment](https://tomcat.apache.org/tomcat-9.0-doc/deployer-howto.html), [TOTVS — Validações antes de aplicar pacote de Liberação Especial do Meu RH, incluindo .war](https://centraldeatendimento.totvs.com/hc/pt-br/articles/360062427093), [TOTVS — Exemplo específico de manutenção de telas HTML fiscais](https://centraldeatendimento.totvs.com/hc/pt-br/articles/40582008511255). Os artigos TOTVS tratam de contextos próprios; seus procedimentos não se tornam obrigatórios para qualquer aplicação web.

### Modelo de orientação ao cliente

Boa tarde,

Segue em anexo o arquivo .war da correção. Solicitamos que o responsável pelo ambiente confirme o projeto, a instância e a compatibilidade do pacote antes da aplicação.

1. Agendar a manutenção e parar o serviço que hospeda a aplicação web, conforme a arquitetura do ambiente e as instruções da correção.

2. Fazer backup do .war atual, da pasta correspondente ao projeto e das configurações específicas, guardando a cópia fora de webapps.

3. Na pasta <SERVIDOR>\<INSTANCIA>\webapps confirmada pelo responsável, remover apenas o .war antigo e a pasta desse projeto, após o backup.

4. Copiar o .war recebido no ticket para essa pasta, com o nome do projeto indicado, e iniciar o serviço responsável pela aplicação. Reinícios adicionais só devem ser realizados quando previstos na orientação técnica.

5. Aguardar a implantação e conferir se houve erro de inicialização/publicação.

6. Abrir o programa no ambiente atualizado em janela anônima ou após o teste de cache, repetir o cenário informado e nos retornar o resultado, com data e horário do teste.

Em caso de falha na publicação, solicitamos que interrompam a validação e acionem o responsável técnico para análise e eventual retorno ao backup, enviando a mensagem e os logs pertinentes por canal autorizado.

Atenciosamente,
Atendimento Datasul.

# Categoria — APIs e comunicação

## KB-0025 — Investigando lentidão e timeout

**Palavras-chave:** lentidão, lento, timeout, tempo limite, timing, waterfall, pending, TTFB, desempenho, performance

**Objetivo:** Identificar em qual parte da comunicação o tempo está sendo consumido e reunir evidências para a análise técnica.

**Quando usar:** A tela demora, uma consulta fica pendente ou a operação termina com mensagem de tempo limite.

**Antes de começar:** Ambiente e usuário autorizados, cenário conhecido e dados seguros para o teste. Antes de repetir uma gravação interrompida, confirmar se ela já foi efetivada.

### Como fazer

1. Registrar programa, operação, ambiente, horário com fuso e abrangência: um usuário, uma rotina ou vários usuários/programas. Perguntar quando começou e se houve mudança recente.

2. Abrir F12 e Network antes do teste. Ativar Preserve log, limpar registros anteriores e reproduzir uma vez. Usar Fetch/XHR para procurar APIs e retirar o filtro se a chamada não aparecer, conforme KB-0003.

3. Anotar método, endereço revisado, status e duração da chamada ligada à ação. Verificar se o tempo percebido corresponde a uma requisição longa ou a várias chamadas em sequência.

4. Selecionar a chamada e abrir Timing. Identificar os nomes exibidos, como Queueing/Stalled, DNS Lookup, Initial connection/SSL, Waiting (TTFB) e Content Download. Fazer uma captura legível das fases e da duração total; a aparência pode variar entre versões.

5. Se a chamada continuar Pending, registrar há quanto tempo está pendente e o horário. Se terminar ou for cancelada, registrar o estado final e a mensagem. Pending sozinho não confirma travamento do servidor.

6. Se houver um caso que funciona e for seguro comparar, repetir somente uma consulta equivalente, no mesmo ambiente e com filtros semelhantes. Anotar as condições de cada teste; volume de dados diferente pode explicar parte da diferença.

7. Solicitar os registros do servidor e correlacionar o período conforme KB-0027. Confirmar com o responsável qual componente informou o timeout e se existe um limite conhecido para aquela operação.

8. Consolidar o tempo total, fase predominante, comparação e logs disponíveis. Encaminhar a evidência para a análise técnica sem atribuir a causa a banco, rede ou programa apenas pela duração.

### O que o resultado significa

- Queueing/Stalled: há espera associada ao agendamento ou à conexão no navegador; não prova demora no código ABL.

- DNS Lookup e Initial connection/SSL: olhar a resolução de nome e o estabelecimento da conexão com a equipe responsável.

- Waiting (TTFB): inclui espera pelo primeiro byte e efeitos da comunicação; não é uma medição isolada do banco ou do processamento ABL.

- Content Download: avaliar transferência e leitura do conteúdo; tamanho da resposta e comportamento do navegador também podem influenciar.

- A chamada terminou, mas a tela continua lenta: registrar o intervalo percebido e verificar Console e demais chamadas; pode existir trabalho na interface ou outra etapa.

- HTTP 504 ou outro timeout: identificar o emissor com a equipe técnica. O processamento no destino pode ter continuado após o cliente deixar de esperar.

### Exemplo de registro

Programa: exemplo de consulta. Ambiente: homologação. Horário: 17/11/2026 às 14:30, UTC-03. Duração total observada: 5,2 segundos. Waiting (TTFB): 4,8 segundos. Status final: 200. Esses valores são fictícios e não confirmam a origem da demora.

**O que anexar ao chamado:** Cenário e filtros revisados, quantidade aproximada de dados, horário/fuso, duração, status final, captura do Timing e comparação com o caso que funciona. Incluir HAR revisado somente se necessário e autorizado.

**Quando pedir ajuda:** Lentidão que afeta vários programas ou usuários deve ser tratada com a equipe responsável pelo incidente. Para ocorrência localizada, enviar Timing e correlação de logs ao responsável pela aplicação, envolvendo infraestrutura quando houver evidência de comunicação ou disponibilidade.

**Atenção:** Não aumentar timeout, reiniciar serviços ou executar repetidamente uma operação para tentar resolver. Não refazer gravações após timeout sem confirmar o resultado da tentativa anterior. Não existe neste guia um tempo máximo universal para qualquer rotina.

**Guias relacionados:** KB-0003, KB-0004, KB-0008, KB-0013, KB-0021, KB-0027, KB-0028

**Referências:** [Chrome DevTools — fases do Timing](https://developer.chrome.com/docs/devtools/network/reference#timing-explanation), [Chrome DevTools — análise de tempos no Performance](https://developer.chrome.com/docs/devtools/performance/reference/).

# Categoria — Navegador e frontend

## KB-0026 — Identificando bloqueios do navegador

**Palavras-chave:** CORS, cross-origin, preflight, OPTIONS, mixed content, conteúdo misto, certificado, TLS, SSL, blocked, Failed to fetch

**Objetivo:** Reconhecer sinais de bloqueio ou falha de comunicação no navegador e coletar os dados necessários para a equipe responsável.

**Quando usar:** A tela não consegue consultar um serviço e Console/Network mostra CORS, Mixed Content, erro de certificado ou falha de conexão.

**Antes de começar:** URL correta do ambiente, acesso autorizado e possibilidade de reproduzir sem alterar dados. Não ultrapassar um aviso de certificado para realizar o teste.

### Como fazer

1. Registrar o endereço da página e o horário com fuso. Abrir Console e Network antes de reproduzir a falha uma única vez.

2. Copiar a mensagem completa do Console, sem credenciais ou dados sigilosos. Não resumir toda ocorrência como CORS: guardar o texto que o navegador realmente apresentou.

3. Em Network, localizar a chamada envolvida, conferir o endereço de destino, status ou motivo da falha e verificar se houve redirecionamento. Se aparecer uma chamada OPTIONS relacionada, registrar também o resultado dela.

4. Comparar protocolo, nome do host e porta entre a página e a API. Uma diferença pode caracterizar origens distintas. Isso ajuda a investigar CORS, mas não determina se a configuração está correta.

5. Se houver mensagem CORS, registrar a origem da página e o destino, além da resposta disponível. A equipe técnica deve conferir quais origens, métodos e cabeçalhos são permitidos. A requisição pode ter chegado ao servidor mesmo quando o navegador não disponibiliza a resposta para a página.

6. Se houver Mixed Content, verificar se uma página HTTPS tentou buscar recurso HTTP. Encaminhar a URL do recurso para correção da publicação ou configuração; não liberar conteúdo inseguro como solução.

7. Se houver aviso de certificado ou erro TLS, registrar o código exibido e o host/porta envolvidos. Solicitar a conferência de validade, nome e cadeia de confiança à equipe responsável. Não prosseguir pelo aviso, instalar certificados desconhecidos ou desativar a validação.

8. Quando permitido, comparar com outro navegador suportado ou sessão anônima no mesmo ambiente. Anotar as diferenças, sem desativar controles corporativos. Se uma API funcionar no Postman, registrar o resultado: isso não valida a política aplicada pelo navegador nem garante que as chamadas usam a mesma autenticação.

9. Consolidar a mensagem, origem, destino e resultado do teste e encaminhar ao responsável pela aplicação/publicação ou infraestrutura conforme a evidência.

### O que o resultado significa

- Erro CORS: o navegador não conseguiu liberar o acesso à resposta entre origens nas condições testadas. É necessário verificar os detalhes; uma mensagem genérica também pode acompanhar falhas de rede ou TLS.

- OPTIONS com falha: pode envolver a verificação prévia da chamada. Nem toda requisição faz preflight, portanto sua ausência não comprova falha.

- Mixed Content: há mistura de recursos seguros e inseguros; o navegador pode bloquear ou atualizar determinadas solicitações automaticamente. Registrar o comportamento observado.

- Erro de certificado: a conexão segura não passou pela verificação do navegador. Não permite concluir que há defeito funcional na rotina.

- Failed to fetch isolado: mensagem insuficiente para definir a causa; consultar o motivo em Network e Console.

**O que anexar ao chamado:** Texto integral do erro, navegador/versão, horário/fuso, origem da página, destino revisado, resultado da chamada e de OPTIONS quando existir, além da abrangência do problema.

**Quando pedir ajuda:** Envolver publicação/Framework para configuração de origens ou endpoints e infraestrutura para DNS, proxy e certificados, conforme a organização do cliente. O Atendimento coleta as evidências; a alteração deve ser avaliada pela equipe responsável.

**Atenção:** Não usar extensões para liberar CORS, desabilitar a segurança do navegador, liberar todas as origens ou ignorar certificados. Não anexar Authorization, cookies ou conteúdo integral de cabeçalhos sem revisão.

**Guias relacionados:** KB-0002, KB-0003, KB-0007, KB-0010, KB-0011, KB-0012, KB-0028

**Referências:** [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS), [MDN — CORS request did not succeed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSDidNotSucceed), [MDN — Mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Mixed_content).

# Categoria — Processos de atendimento

## KB-0027 — Correlacionando Network e logs

**Palavras-chave:** correlação, horário, fuso, UTC, Network, log, request id, correlation id, traceparent, sessão, agente, requisição

**Objetivo:** Relacionar a ação do usuário com os registros do servidor, reduzindo o risco de atribuir ao chamado um erro sem relação com o teste.

**Quando usar:** Já existe uma chamada identificada em Network e é necessário encontrar o registro correspondente nos logs.

**Antes de começar:** Cenário e ambiente confirmados, acesso autorizado às evidências e apoio do responsável para identificar servidor, instância e fuso dos logs. Não alterar relógios ou configuração de rastreamento durante a coleta.

### Como fazer

1. Anotar programa, ambiente, ação realizada e usuário de teste de forma não sensível. Confirmar com o responsável qual instância atende a URL e se há balanceamento ou vários nós.

2. Registrar início e fim do teste com data, hora e fuso do computador utilizado. Pedir a confirmação do fuso e de eventual diferença de relógio do servidor; o horário do navegador e o do log podem não ser diretamente comparáveis.

3. Reproduzir a ocorrência uma única vez quando seguro, mantendo Network aberto. Anotar endpoint revisado, método, status, duração e mensagem relevante da resposta.

4. Verificar se a resposta ou os cabeçalhos permitidos apresentam um identificador de requisição/correlação usado pelo serviço. Registrar seu nome e valor somente quando autorizado e sem tratá-lo como credencial. Cabeçalhos como X-Request-ID e traceparent são possibilidades; não estão garantidos no Datasul ou no ambiente do cliente.

5. Solicitar os logs do serviço e da instância pertinentes para uma janela em torno do teste. Com vários nós, pedir ao responsável que identifique qual atendeu a chamada ou reúna os registros necessários; não pesquisar em um único agente aleatório.

6. Ajustar a leitura para o mesmo fuso e procurar o identificador quando ele estiver registrado dos dois lados. Na ausência dele, combinar intervalo de horário, endpoint/programa, instância, mensagem e contexto de sessão/agente disponíveis.

7. Ler algumas linhas antes e depois da ocorrência. Não misturar mensagens de sessões distintas só por terem horários próximos. Registrar se houve erro, retorno tratado ou ausência de registro no trecho recebido.

8. Montar uma sequência curta ligando a ação à chamada e aos eventos encontrados. Separar correspondências fortes, associações por contexto e pontos ainda não confirmados.

### O que o resultado significa

- O mesmo identificador aparece na chamada e no log correto: há um vínculo forte para investigar a sequência; isso ainda não demonstra qual evento causou a falha.

- Horário próximo e mensagem semelhante, sem identificador: correspondência possível, a confirmar com outros dados.

- Nenhum registro: verificar fuso, instância, intervalo e nível de registro com o responsável. Isso não prova que a chamada não chegou ao servidor.

- Vários erros no mesmo segundo: separar por contexto antes de selecionar o que irá no encaminhamento.

### Exemplo de linha do tempo

Exemplo fictício: o teste foi iniciado em 17/11/2026 às 14:30:00 UTC-03. Em um log confirmado como UTC, procurar a partir de 17:30:00Z, considerando a duração e eventuais diferenças de relógio. A chamada POST para /api/exemplo retornou 500; registrar a mensagem e a instância sem presumir que qualquer erro desse minuto é o correspondente.

**O que anexar ao chamado:** Sequência do teste, horários/fusos, endpoint/método/status, identificador autorizado quando existir, instância/agente e trechos revisados que sustentam a associação, incluindo linhas próximas.

**Quando pedir ajuda:** Solicitar infraestrutura/Framework quando não for possível identificar a instância, interpretar o fuso ou obter os logs corretos. Encaminhar ao Desenvolvimento a sequência correlacionada quando houver relação com o programa investigado.

**Atenção:** O identificador interno exibido por uma ferramenta do navegador não é automaticamente um ID disponível no servidor. Não usar senha, token ou cookie como chave de busca compartilhada. Não habilitar rastreamento adicional nem alterar o nível de log sem a equipe responsável.

**Guias relacionados:** KB-0003, KB-0004, KB-0009, KB-0011, KB-0013, KB-0014, KB-0025, KB-0028

**Referências:** [W3C — Trace Context](https://www.w3.org/TR/trace-context/), [Chrome DevTools — Network](https://developer.chrome.com/docs/devtools/network/reference). O padrão de rastreamento explica uma possibilidade técnica; não significa que esteja implantado no ambiente do cliente.

# Categoria — Ambiente Datasul

## KB-0028 — Entendendo as camadas da aplicação web

**Palavras-chave:** arquitetura, camadas, frontend, backend, navegador, Tomcat, PASOE, AppServer, Progress, ABL, banco, proxy, encaminhamento

**Objetivo:** Entender o papel dos componentes e escolher a próxima evidência ou equipe a envolver durante a investigação.

**Quando usar:** O analista precisa distinguir falha de tela, comunicação, publicação, execução de programa ou acesso a dados, sem assumir uma causa apenas pela mensagem inicial.

**Antes de começar:** Identificar o ambiente e a aplicação. O desenho abaixo é conceitual: componentes podem estar juntos, separados, replicados ou ausentes. Confirmar a arquitetura real com o responsável técnico.

### Visão das camadas

- Navegador/frontend: apresenta a tela, executa JavaScript e envia as chamadas. Console e Network ajudam a observar seu comportamento.

- Comunicação e entrada do ambiente: rede, proxy e balanceador, quando presentes, encaminham a solicitação. A URL visível não identifica necessariamente o servidor final.

- Hospedagem web/Tomcat: recebe HTTP e hospeda aplicações e arquivos web, conforme a publicação. Um .war identifica um artefato de aplicação web, não um objeto ABL compilado .r.

- Serviços e execução ABL: executam a lógica de negócio. No PASOE, o Tomcat integra a própria instância e encaminha trabalho para sessões/agentes ABL; ele não é obrigatoriamente outro servidor anterior ao PASOE. Ambientes com AppServer clássico podem ter uma composição diferente.

- Banco de dados: fornece e recebe os dados utilizados pela lógica do servidor. Nem toda consulta web chega ao banco, e nem todo erro do servidor tem origem nele.

### Como fazer

1. Identificar programa, URL do ambiente e ação. Pedir ao responsável um desenho simples de quais componentes atendem essa aplicação, incluindo nós e serviços compartilhados quando relevantes.

2. Perguntar se a tela chega a abrir e se o problema afeta uma ação ou todo o ambiente. Usar KB-0021 para organizar o cenário.

3. Se um botão não gera chamada, conferir filtros em Network e mensagens do Console. Registrar a ausência de comunicação observada e seguir KB-0002/0003; não concluir defeito de frontend sem verificar o contexto.

4. Se arquivos ou a página não carregam, identificar o recurso e o resultado. Seguir KB-0007 para publicação/carregamento e KB-0026 para bloqueios do navegador.

5. Se uma API retorna erro ou demora, registrar método, endpoint, status, resposta e Timing. Usar KB-0008, KB-0009 e KB-0025 para escolher a coleta seguinte.

6. Se houver ocorrência correspondente no servidor, correlacionar conforme KB-0027. Verificar com a equipe responsável se o evento pertence à publicação web, à execução Java/ABL, à comunicação ou ao acesso a dados.

7. Quando houver suspeita de objeto ABL incorreto, conferir origem/versão com KB-0015 e KB-0018. Quando a correção for web .war, usar KB-0024. Não substituir um tipo de artefato pelo outro nem pressupor o mesmo serviço de implantação.

8. Encaminhar os fatos e o componente a avaliar, descrevendo as hipóteses ainda abertas. A responsabilidade operacional depende da organização e do contrato do cliente, não apenas do nome da camada.

### O que o resultado significa

- Console com erro e nenhuma chamada observada: investigar execução da tela e condições do teste.

- Arquivo web com falha: avaliar acesso ao recurso, publicação e comunicação, sem atribuir automaticamente ao banco ou ao ABL.

- Resposta da API com erro: investigar resposta e registros do caminho atendido; HTTP 500 não identifica sozinho a camada responsável.

- Mensagem ABL ou de banco no log: é evidência técnica a correlacionar, sem dispensar a análise do programa e das condições do ambiente.

- Várias aplicações indisponíveis: ampliar a avaliação para componentes compartilhados e seguir o processo de incidente.

**O que anexar ao chamado:** Programa/URL revisada, desenho conhecido do ambiente, ação, abrangência, chamada afetada, erros de Console e registros correlacionados. Informar explicitamente os componentes ainda não confirmados.

**Quando pedir ajuda:** Acionar o responsável pelo ambiente para mapear instâncias e publicação; envolver a equipe da aplicação quando houver evidências do comportamento funcional. A investigação pode exigir atuação conjunta de infraestrutura, Framework e Desenvolvimento.

**Atenção:** Este mapa não orienta acesso direto ao banco, mudanças de PROPATH ou reinícios para testar hipóteses. Não usar o status HTTP como regra automática de encaminhamento nem afirmar que Tomcat, PASOE e AppServer clássico são serviços intercambiáveis.

**Guias relacionados:** KB-0002, KB-0003, KB-0007, KB-0008, KB-0013, KB-0015, KB-0018, KB-0021, KB-0024, KB-0025, KB-0026, KB-0027

**Referências:** [Progress — PAS for OpenEdge architecture](https://docs.progress.com/bundle/pas-for-openedge-introduction-122/page/PAS-for-OpenEdge-architecture.html), [Apache Tomcat — Web Application Deployment](https://tomcat.apache.org/tomcat-9.0-doc/deployer-howto.html). As referências descrevem componentes; confirmar sua composição na instalação do cliente.
