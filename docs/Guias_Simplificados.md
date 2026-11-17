# SupportFlow — Versão simplificada dos KB-0025 a KB-0028

Esta fonte substitui apenas os textos correspondentes no catálogo gerado. As versões anteriores ficam em docs/revisions para atualização controlada de bases existentes.

# Categoria — APIs e comunicação

## KB-0025 — Investigando lentidão e timeout

**Palavras-chave:** lentidão, lento, timeout, tempo limite, Timing, Network, Waiting, TTFB, desempenho

**Objetivo:** Mostrar onde olhar quando uma tela demora e o que enviar para a análise.

**Quando usar:** A consulta fica carregando ou aparece uma mensagem de tempo esgotado, também chamada timeout.

**Antes de começar:** Use um teste autorizado. Se a operação salva dados, confirme se a tentativa anterior já gravou antes de repetir.

### Como fazer

1. Abra a tela anterior ao problema e pressione F12. Clique em Network, que mostra as chamadas feitas pela tela. Se não souber localizar a chamada, siga KB-0003 primeiro.

2. Faça uma única tentativa e encontre a chamada que demorou. Anote o nome da rotina, o horário do teste e quanto tempo ela levou.

3. Clique na chamada e depois na aba Timing. Ela divide o tempo em etapas. Não é necessário conhecer todas: tire uma captura que mostre os nomes e os tempos.

4. Observe qual etapa tem a maior barra. Waiting (TTFB) é o tempo até começar a chegar a resposta; Download é o recebimento do conteúdo. Uma barra grande indica onde investigar, mas não diz sozinha qual é a causa.

5. Se continuar Pending, a chamada ainda está pendente. Registre há quanto tempo e o resultado final, se aparecer. Não fique repetindo a operação.

6. Envie a captura e os dados abaixo. Se houver logs do servidor, siga KB-0027 para relacioná-los ao teste.

### Como ler o exemplo da imagem

A chamada consultar levou 5,2 segundos no exemplo fictício. A maior parte, 4,8 segundos, aparece em Waiting. Informe esses valores à equipe técnica; não conclua que o banco ou o programa ficou processando por todo esse tempo.

**O que anexar ao chamado:** Programa, ambiente, ação, horário com fuso, status final e captura do Timing. Exemplo: consulta de teste, 14:30 UTC-03, 5,2 segundos, status 200.

**Quando pedir ajuda:** Se vários usuários ou programas estiverem lentos, acione o responsável pelo ambiente. Se ocorrer só em uma rotina, envie as evidências à equipe da aplicação.

**Atenção:** Depois de timeout, a gravação pode ter ocorrido. Não repita sem conferir. Não aumente limites nem reinicie serviços para tentar resolver por conta própria.

**Guias relacionados:** KB-0003, KB-0008, KB-0013, KB-0027, KB-0028

**Referências:** [Chrome DevTools — Timing](https://developer.chrome.com/docs/devtools/network/reference#timing-explanation).

# Categoria — Navegador e frontend

## KB-0026 — Identificando bloqueios do navegador

**Palavras-chave:** CORS, certificado, Mixed Content, conteúdo misto, TLS, SSL, bloqueio, Failed to fetch

**Objetivo:** Reconhecer a mensagem que o navegador mostrou e reunir os dados para pedir ajuda.

**Quando usar:** A tela não carrega uma informação e aparece erro de comunicação ou de conexão segura.

**Antes de começar:** Confirme que abriu o endereço correto. Este guia é de observação: não é necessário alterar configurações do navegador.

### Como fazer

1. Na tela com problema, pressione F12 e abra Console. Reproduza a falha uma vez e copie ou capture a mensagem completa.

2. Procure os termos da imagem: CORS, Mixed Content ou certificado. São exemplos de problemas diferentes; você não precisa identificar a causa técnica.

3. Abra Network e selecione a chamada que falhou, se houver. Anote o endereço de destino e o status ou motivo mostrado. Use KB-0003 se precisar localizar a chamada.

4. Registre também o endereço da página aberta, o horário do teste e se outras pessoas encontram a mesma falha.

5. Envie a mensagem e os endereços revisados ao responsável pela aplicação ou pelo ambiente. Não compartilhe senhas, tokens ou cookies.

### O que as mensagens querem dizer

- CORS: o navegador não conseguiu liberar para a página o acesso à resposta de outra origem. Registre a mensagem; a equipe verificará as regras e possíveis falhas de conexão.

- Mixed Content: uma página HTTPS tentou carregar um recurso HTTP. A equipe deve conferir os endereços e a publicação.

- Certificado: o navegador não validou a conexão segura. Registre o código do aviso e peça a conferência do certificado.

- Failed to fetch sozinho: é uma mensagem genérica. Inclua também o que aparece em Network.

**O que anexar ao chamado:** Mensagem completa, captura, endereço da página e da chamada sem dados sensíveis, navegador, horário e quantidade de usuários afetados.

**Quando pedir ajuda:** Solicite análise da equipe responsável por publicação, comunicação ou certificados, conforme a organização do cliente. O Atendimento não precisa alterar essas configurações.

**Atenção:** Não ignore avisos de certificado nem instale extensões para liberar CORS. Funcionar no Postman não garante que a mesma chamada seja permitida no navegador.

**Guias relacionados:** KB-0002, KB-0003, KB-0007, KB-0010, KB-0012, KB-0028

**Referências:** [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS), [MDN — falhas de conexão e CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSDidNotSucceed), [MDN — Mixed content](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Mixed_content).

# Categoria — Processos de atendimento

## KB-0027 — Correlacionando Network e logs

**Palavras-chave:** correlação, Network, logs, horário, fuso, UTC, request id, identificador, servidor

**Objetivo:** Ajudar a encontrar no log o registro da mesma ação feita pelo usuário.

**Quando usar:** Você já identificou uma chamada com problema e precisa pedir ou conferir o log do servidor.

**Antes de começar:** Confirme o ambiente e peça ao responsável qual servidor atende essa aplicação. Log é o arquivo em que o servidor registra acontecimentos.

### Como fazer

1. Anote o programa, a ação e o horário antes de fazer um teste autorizado. Inclua o fuso, como UTC-03. Ele indica a referência do relógio.

2. Em Network, registre a chamada que falhou: método, endereço revisado e status. Exemplo fictício: POST /api/exemplo, status 500.

3. Peça ao responsável o log do servidor certo, cobrindo alguns minutos antes e depois do teste. Pergunte em qual fuso os horários do arquivo estão registrados.

4. Compare os horários no mesmo fuso. Na imagem, 14:30 UTC-03 corresponde a 17:30 UTC. Não altere o relógio do computador ou do servidor; apenas considere a diferença na leitura.

5. Se a chamada e o log tiverem um identificador em comum, procure esse mesmo valor. A imagem usa EXEMPLO-001. Esse campo pode não existir; nesse caso, compare horário, programa e ação com ajuda da equipe técnica.

6. Copie as linhas próximas da ocorrência, não apenas uma linha isolada. Informe o que combina com o teste e o que ainda não conseguiu confirmar.

### Como ler o exemplo da imagem

À esquerda está a chamada observada no navegador. À direita está um trecho fictício do log. Os horários usam fusos diferentes, mas indicam o mesmo momento. O identificador igual ajuda a relacionar os registros; não prova sozinho a causa do erro.

**O que anexar ao chamado:** Programa, ação, ambiente, horário e fuso do teste, chamada com status, servidor/instância e trecho revisado do log. Inclua o identificador somente se estiver disponível e autorizado.

**Quando pedir ajuda:** Se não souber qual log pedir ou como comparar os horários, solicite apoio ao responsável pelo ambiente. Não selecione qualquer erro só por ter ocorrido no mesmo minuto.

**Atenção:** Não usar senha, token ou cookie como identificador. Um número interno do navegador não é necessariamente registrado no servidor. Não achar a mensagem não prova que a chamada não chegou.

**Guias relacionados:** KB-0003, KB-0011, KB-0013, KB-0014, KB-0025, KB-0028

**Referências:** [W3C — exemplo de padrão para identificação de chamadas](https://www.w3.org/TR/trace-context/). A existência desse padrão não significa que o ambiente o utilize.

# Categoria — Ambiente Datasul

## KB-0028 — Entendendo as camadas da aplicação web

**Palavras-chave:** camadas, arquitetura, navegador, frontend, backend, Tomcat, PASOE, AppServer, ABL, banco

**Objetivo:** Entender por onde a solicitação pode passar e escolher o próximo teste.

**Quando usar:** Você não sabe se deve começar pelo navegador, pela publicação da aplicação ou pelos logs do servidor.

**Antes de começar:** O desenho é um exemplo de ambiente com PASOE. Peça ao responsável que confirme como o ambiente do cliente está organizado.

### Como fazer

1. Comece pelo navegador: ele mostra a tela e envia as chamadas. Se um botão não responde, abra Console e Network. Consulte KB-0002 e KB-0003.

2. Veja se a chamada foi enviada. Se não apareceu, confira os filtros e as mensagens do Console antes de concluir que o servidor recebeu algo.

3. Se a chamada voltou com erro ou demorou, registre status, resposta e horário. Consulte KB-0008, KB-0009 e KB-0025.

4. Peça os logs ao responsável pelo ambiente. Eles ajudam a conferir o que ocorreu depois que a solicitação chegou ao servidor. Use KB-0013 e KB-0027.

5. Encaminhe os fatos e os testes realizados. Você não precisa definir sozinho qual componente causou o problema.

### Como ler o desenho

- Navegador: mostra a tela. Console e Network são as primeiras ferramentas de observação.

- Tomcat: recebe a chamada web e hospeda aplicações. No exemplo, ele faz parte da instância PASOE.

- ABL: é a linguagem usada por programas Progress. Nessa etapa, os programas executam as regras da operação.

- Banco de dados: guarda as informações. O programa pode consultar ou gravar nele quando necessário.

A resposta volta pelas etapas de atendimento até chegar à tela. A instalação pode ter outros componentes, como proxy e balanceador. Não presuma que todos os ambientes seguem exatamente esse desenho.

### Qual guia seguir agora?

- Tela em branco ou arquivo que não carrega: KB-0007.

- Mensagem de bloqueio no navegador: KB-0026.

- Chamada lenta: KB-0025.

- Erro no log Progress: KB-0014.

- Objeto .r desatualizado: KB-0018.

- Correção de aplicação web .war: KB-0024.

**O que anexar ao chamado:** Programa, ambiente, ação, abrangência, mensagens, chamada identificada e logs disponíveis. Diga também o que ainda não foi possível verificar.

**Quando pedir ajuda:** Acione o responsável pelo ambiente para identificar servidores e serviços. A análise pode exigir participação conjunta de infraestrutura, Framework e Desenvolvimento.

**Atenção:** Status 500 não identifica sozinho o responsável. Tomcat, PASOE e AppServer clássico não são nomes intercambiáveis. Não reinicie serviços ou acesse o banco para testar uma hipótese sem orientação.

**Guias relacionados:** KB-0002, KB-0003, KB-0007, KB-0008, KB-0013, KB-0014, KB-0018, KB-0024, KB-0025, KB-0026, KB-0027

**Referências:** [Progress — arquitetura PAS for OpenEdge](https://docs.progress.com/bundle/pas-for-openedge-introduction-122/page/PAS-for-OpenEdge-architecture.html), [Apache Tomcat — publicação de aplicações web](https://tomcat.apache.org/tomcat-9.0-doc/deployer-howto.html).
