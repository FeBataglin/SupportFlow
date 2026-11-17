# SupportFlow — Base de conhecimento do Atendimento

**Revisão 1.0 • Proposta para validação interna • 17/11/2026**

23 guias práticos para investigação de aplicações web do TOTVS Datasul. Público: Atendimento com pouco conhecimento técnico. Não é uma política oficial da TOTVS; revisar antes de publicar.

## Instruções para o Codex (não publicar nos artigos)

1. Leia este documento e a especificação existente do SupportFlow. Inspecione o repositório antes de alterar arquivos; reutilize o módulo de conhecimento, o padrão de navegação, o cadastro de categorias, as permissões e o armazenamento existentes. Não recrie a aplicação nem mude o layout geral sem necessidade.

2. Cadastre os 23 artigos como conteúdo de conhecimento editável. Use os códigos KB-0001 a KB-0023 como identificadores de referência; se algum código já estiver ocupado por um artigo diferente, preserve os dados e reporte o conflito. Não sobrescreva conteúdo editado por usuários.

3. Mapeie para o modelo existente: código, categoria, título, palavras-chave, objetivo, quando usar, antes de começar, passos ordenados, interpretação, evidências, quando pedir ajuda, atenção, guias relacionados, referências, revisão e status. Os metadados e instruções desta seção não devem aparecer no corpo dos artigos.

4. Crie uma importação inicial idempotente ou mecanismo equivalente: executar novamente não duplica artigos nem categorias. Inicialize como rascunho/pendente de revisão técnica, conforme os estados existentes. Não publique automaticamente conteúdo não validado.

5. Exiba os artigos com linguagem do Atendimento, títulos claros, passos numerados, caixas de atenção e links internos navegáveis. Mantenha os termos da interface em português e inglês quando constarem no conteúdo. Permita pesquisa por código, título, categoria, palavras-chave e texto quando o modelo atual permitir.

6. Não adicione dados de clientes, credenciais, imagens de ambientes reais ou chamadas ao Gemini nesta entrega. Se houver suporte a imagens no cadastro, permita adicionar capturas autorizadas posteriormente. Preserve o controle de acesso e a auditoria existentes.

7. Valide os 23 códigos únicos, os vínculos entre artigos, pesquisa por F12/500/PROPATH/objeto desatualizado, caracteres acentuados, apresentação em temas claro/escuro e telas menores, edição por perfil autorizado e reexecução sem duplicidade. Atualize o CHANGELOG.md seguindo a versão atual do projeto, sem presumir a próxima versão.

## Orientações gerais para o Atendimento

- O objetivo dos guias é orientar a investigação, não ensinar o Atendimento a administrar servidores ou programar. Siga os procedimentos somente em ambientes e com usuários autorizados. Prefira homologação para testes que possam alterar dados.

- Antes de repetir uma gravação, confirme se ela já foi efetivada. Não reinicie serviços, modifique arquivos, altere permissões ou desabilite customizações sem a equipe responsável e autorização.

- Não anexe senhas, tokens, cookies, dados pessoais, informações fiscais ou outros dados sigilosos sem necessidade, revisão e autorização. Use canais e ferramentas corporativas aprovadas. Não envie arquivos brutos ao Gemini.

- Os nomes de menus, abas, caminhos e fluxos podem variar conforme navegador, release, permissões e ambiente. As possíveis causas são hipóteses até serem confirmadas. Em incidentes de alto impacto, siga o processo interno sem esperar a conclusão de todos os testes.

## Catálogo

- KB-0001 — Inspecionando aplicações com o DevTools (F12) (Navegador e frontend)

- KB-0002 — Identificando erros no Console (Navegador e frontend)

- KB-0003 — Analisando requisições na aba Network (Navegador e frontend)

- KB-0004 — Exportando arquivos HAR (Navegador e frontend)

- KB-0005 — Limpando cache e cookies (Navegador e frontend)

- KB-0006 — Realizando testes em janela anônima (Navegador e frontend)

- KB-0007 — Identificando problemas de carregamento de componentes (Navegador e frontend)

- KB-0008 — Interpretando status HTTP (APIs e comunicação)

- KB-0009 — Analisando Payload e Response (APIs e comunicação)

- KB-0010 — Identificando problemas de autenticação (APIs e comunicação)

- KB-0011 — Identificando endpoints com falha (APIs e comunicação)

- KB-0012 — Testando APIs através do Postman (APIs e comunicação)

- KB-0013 — Coletando logs dos agentes (Progress e PASOE)

- KB-0014 — Identificando erros Progress ABL (Progress e PASOE)

- KB-0015 — Validando o PROPATH (Progress e PASOE)

- KB-0016 — Coletando informações do ambiente (Ambiente Datasul)

- KB-0017 — Validando versões e releases (Ambiente Datasul)

- KB-0018 — Identificando objetos desatualizados (Ambiente Datasul)

- KB-0019 — Verificando customizações e UPCs (Ambiente Datasul)

- KB-0020 — Investigando problemas de permissões (Ambiente Datasul)

- KB-0021 — Conduzindo a investigação inicial (Processos de atendimento)

- KB-0022 — Validando pacotes de correção (Processos de atendimento)

- KB-0023 — Solicitando informações complementares ao cliente (Processos de atendimento)

# Categoria — Navegador e frontend

## KB-0001 — Inspecionando aplicações com o DevTools (F12)

**Palavras-chave:** devtools, f12, ferramentas do desenvolvedor, tela travada

**Objetivo:** Verificar o que acontece por trás da tela, sem alterar o sistema.

**Quando usar:** A tela não abre, um botão não responde ou aparece uma mensagem de erro.

**Antes de começar:** Acesso à aplicação pelo Chrome ou Edge.

### Como fazer

1. Abra a aplicação e deixe-a na tela anterior à falha.

2. Pressione F12 (ou Ctrl + Shift + I). Se não abrir, use o menu do navegador e procure Ferramentas do desenvolvedor.

3. Localize Console (mensagens) e Network/Rede (comunicação com o servidor). Se uma aba não aparecer, procure no menu de abas adicionais.

4. Na aba Network, marque Preserve log (preservar registros) e confirme que a gravação está ativa.

5. Limpe os registros anteriores, reproduza o problema uma única vez e observe as duas abas.

6. Anote o horário do teste e copie os detalhes relevantes, sem dados sigilosos.

### O que o resultado significa

- Erro no Console: siga KB-0002.

- Requisição com falha: siga KB-0003.

- Sem erro aparente: registre o ocorrido e continue a investigação; isso não prova que está tudo correto.

**O que anexar ao chamado:** Tela afetada, horário, ação realizada, mensagens e requisições relevantes.

**Quando pedir ajuda:** Se não conseguir identificar a ocorrência ou se a ferramenta estiver bloqueada pela política da empresa, solicite apoio técnico.

**Atenção:** Não execute comandos no Console nem altere elementos da página; este roteiro é somente de observação.

**Guias relacionados:** KB-0002, KB-0003, KB-0021

**Referências:** [R1 — Chrome DevTools — Network features reference](https://developer.chrome.com/docs/devtools/network/reference), [R2 — Microsoft Edge — Network features reference](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/reference)

## KB-0002 — Identificando erros no Console

**Palavras-chave:** console, javascript, typeerror, referenceerror, chunkloaderror

**Objetivo:** Encontrar mensagens que ajudem a explicar falhas na tela.

**Quando usar:** O botão não funciona, a tela fica em branco ou uma operação é interrompida.

**Antes de começar:** DevTools aberto (KB-0001).

### Como fazer

1. Clique em Console.

2. Se o problema envolver mudança de página, ative Preserve log nas configurações do Console.

3. Limpe as mensagens antigas usando o botão de limpar.

4. Execute apenas a ação que apresenta o problema.

5. Procure mensagens em vermelho; clique na seta para expandir os detalhes.

6. Copie a mensagem completa e os nomes de arquivos/programas exibidos abaixo dela (pilha de execução).

7. Verifique se também apareceu uma falha em Network no mesmo horário.

### O que o resultado significa

- TypeError ou ReferenceError: pode haver uma falha na execução da tela.

- Failed to fetch: pode ser comunicação, rede ou bloqueio; consulte Network.

- ChunkLoadError: pode haver um arquivo da aplicação indisponível; siga KB-0007.

- Mensagens amarelas ou vermelhas anteriores ao teste podem não ter relação com a falha.

**O que anexar ao chamado:** Mensagem integral, pilha de execução, horário e passos para reproduzir.

**Quando pedir ajuda:** Se a mensagem voltar a aparecer ao repetir o cenário de forma segura, encaminhe os detalhes ao Desenvolvimento ou à equipe responsável pela comunicação.

**Atenção:** Não cole scripts sugeridos por terceiros no Console. Não presuma que toda mensagem vermelha é a causa.

**Guias relacionados:** KB-0001, KB-0003, KB-0007

**Referências:** [R1 — Chrome DevTools — Network features reference](https://developer.chrome.com/docs/devtools/network/reference), [R2 — Microsoft Edge — Network features reference](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/reference)

## KB-0003 — Analisando requisições na aba Network

**Palavras-chave:** network, rede, fetch, xhr, requisição, http

**Objetivo:** Descobrir se o navegador conseguiu conversar com o servidor quando a ação foi executada.

**Quando usar:** Falha de consulta, gravação, carregamento ou lentidão.

**Antes de começar:** Chrome/Edge e DevTools aberto.

### Como fazer

1. Abra Network (Rede) antes de reproduzir a falha.

2. Marque Preserve log e verifique se a gravação está ativa.

3. Limpe os registros antigos e selecione Fetch/XHR, que costuma mostrar as comunicações com APIs.

4. Execute uma única vez a ação que apresenta o problema.

5. Observe a coluna Status e as requisições pendentes. Se não aparecer nada, retire o filtro e verifique a lista completa.

6. Clique na requisição relevante. Em Headers/Cabeçalhos, confira endereço, método e status.

7. Veja Payload (dados enviados), Response (resposta) e Timing (tempo).

### O que o resultado significa

- Nenhuma comunicação visível: confira filtros e Console; a falha pode ocorrer antes do envio.

- Status 4xx ou 5xx: consulte KB-0008.

- Status 2xx: confira Response; a operação pode ter sido rejeitada por uma regra de negócio.

- Pending por muito tempo: anote duração e horário; peça avaliação de desempenho se persistir.

**O que anexar ao chamado:** Endereço sem segredos, método, status, duração, resposta anonimizada e horário.

**Quando pedir ajuda:** Se a falha persistir, encaminhe a requisição identificada para a equipe apropriada; não conclua a causa apenas pelo status.

**Atenção:** Não compartilhe cabeçalhos de autenticação, cookies ou dados fiscais sem revisão.

**Guias relacionados:** KB-0001, KB-0008, KB-0009, KB-0011

**Referências:** [R1 — Chrome DevTools — Network features reference](https://developer.chrome.com/docs/devtools/network/reference), [R2 — Microsoft Edge — Network features reference](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/reference)

## KB-0004 — Exportando arquivos HAR

**Palavras-chave:** har, exportar rede, captura, requisições

**Objetivo:** Salvar um arquivo com o histórico de comunicação do navegador.

**Quando usar:** O erro é difícil de reproduzir ou a equipe técnica precisa ver todas as requisições do teste.

**Antes de começar:** Autorização para coletar e compartilhar evidências; canal corporativo aprovado.

### Como fazer

1. Abra a tela anterior à falha e pressione F12.

2. Entre em Network, marque Preserve log e confirme que a gravação está ativa.

3. Limpe os registros e remova filtros para registrar todo o teste.

4. Reproduza o problema e aguarde o retorno da operação.

5. Na barra da aba Network, localize Export HAR (sanitized), Exportar HAR (limpo) ou opção equivalente.

6. Salve o arquivo .har com nome neutro, por exemplo chamado_programa_20261117_1430.har.

7. Revise o conteúdo por ferramenta autorizada, com apoio técnico se necessário, antes de anexar.

### O que o resultado significa

- O HAR permite analisar o que foi enviado, o que retornou e o tempo de cada comunicação.

- Se não houver registros, a captura pode ter sido iniciada tarde ou estar pausada; refaça apenas se seguro.

- A exportação sanitizada reduz alguns segredos, mas não elimina todo dado sensível.

**O que anexar ao chamado:** Arquivo revisado e autorizado, horário, fuso e descrição da ação.

**Quando pedir ajuda:** Se não souber revisar ou anonimizar o arquivo, não envie; peça auxílio à equipe responsável.

**Atenção:** Não habilite exportação com dados sensíveis. Nunca envie HAR bruto ao Gemini ou a ferramentas externas sem aprovação.

**Guias relacionados:** KB-0003, KB-0009, KB-0011

**Referências:** [R1 — Chrome DevTools — Network features reference](https://developer.chrome.com/docs/devtools/network/reference), [R2 — Microsoft Edge — Network features reference](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/reference)

## KB-0005 — Limpando cache e cookies

**Palavras-chave:** cache, cookies, arquivos antigos, atualização

**Objetivo:** Descartar interferências de arquivos antigos e dados de sessão guardados pelo navegador.

**Quando usar:** O comportamento mudou após atualização ou a tela funciona para outros usuários.

**Antes de começar:** Salve o trabalho antes do teste; tenha acesso para entrar novamente.

### Como fazer

1. Anote o comportamento original antes de limpar qualquer coisa.

2. Na tela afetada, pressione Ctrl + Shift + R para recarregar sem reutilizar parte do cache.

3. Teste novamente. Se persistir, abra Network, marque Disable cache e recarregue com DevTools aberto.

4. Faça novo teste; depois desmarque Disable cache.

5. Se necessário, pressione Ctrl + Shift + Delete e selecione apenas imagens e arquivos em cache, no período adequado.

6. Se houver suspeita de sessão, limpe preferencialmente os dados apenas do site afetado nas configurações do navegador, com ciência do cliente.

7. Entre novamente no Datasul e repita o cenário.

### O que o resultado significa

- Funcionou: existe indício de interferência local; informe qual teste resolveu.

- Não funcionou: siga KB-0006 ou KB-0007 e investigue outras causas.

**O que anexar ao chamado:** Resultado antes/depois, navegador e opção de limpeza utilizada.

**Quando pedir ajuda:** Se o erro retornar após cada atualização ou ocorrer com vários usuários, solicite investigação técnica.

**Atenção:** Apagar cookies pode encerrar sessões. Não elimine senhas, histórico ou dados de outros sites sem necessidade. Limpar cache não atualiza objetos no servidor.

**Guias relacionados:** KB-0006, KB-0007, KB-0018

**Referências:** [R1 — Chrome DevTools — Network features reference](https://developer.chrome.com/docs/devtools/network/reference), [R2 — Microsoft Edge — Network features reference](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/reference)

## KB-0006 — Realizando testes em janela anônima

**Palavras-chave:** anônimo, incógnito, inprivate, sessão, extensão

**Objetivo:** Comparar a aplicação com uma sessão de navegador separada da habitual.

**Quando usar:** Suspeita de cache, cookies, extensões ou configuração local.

**Antes de começar:** Endereço do Datasul e credenciais próprias do usuário autorizado.

### Como fazer

1. No Chrome ou Edge, pressione Ctrl + Shift + N.

2. Na nova janela, acesse o mesmo endereço do ambiente afetado.

3. Faça login com o mesmo usuário, sem pedir ou compartilhar credenciais.

4. Use a mesma empresa, estabelecimento, filtros e dados de teste.

5. Repita a operação de forma segura e compare com a janela normal.

6. Feche a janela anônima ao final do teste.

### O que o resultado significa

- Funciona apenas na janela anônima: investigue dados do navegador, extensões e sessão; siga KB-0005.

- Falha nas duas: a causa pode estar em outra camada; siga KB-0003.

- Login não funciona: verifique políticas de cookies e autenticação com a equipe responsável.

**O que anexar ao chamado:** Resultado dos dois testes e diferenças observadas.

**Quando pedir ajuda:** Se houver impacto de políticas corporativas ou o erro persistir, encaminhe ao responsável pelo ambiente ou Desenvolvimento com as evidências.

**Atenção:** Janela anônima não garante ausência de extensões e não torna o usuário invisível para o servidor.

**Guias relacionados:** KB-0005, KB-0010, KB-0021

**Referências:** [R2 — Microsoft Edge — Network features reference](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/reference)

## KB-0007 — Identificando problemas de carregamento de componentes

**Palavras-chave:** tela branca, carregando, chunkloaderror, js, css

**Objetivo:** Localizar arquivos ou chamadas que impedem a tela de abrir completamente.

**Quando usar:** Tela em branco, ícones ausentes, menus incompletos ou carregamento infinito.

**Antes de começar:** DevTools aberto e possibilidade de recarregar a página sem perder trabalho.

### Como fazer

1. Registre a tela e o horário.

2. Abra Network, marque Preserve log e Disable cache, retire filtros e recarregue.

3. Observe arquivos JS (código da tela), CSS (aparência), fontes, documentos e chamadas Fetch/XHR.

4. Clique nos itens com falha e registre URL, status e resposta; veja também itens pendentes.

5. Abra Console e procure mensagens relacionadas, como ChunkLoadError ou Mixed Content.

6. Compare com janela anônima, outro navegador suportado ou usuário autorizado, mantendo o mesmo cenário.

7. Pergunte se houve atualização recente e se outros programas web também falham.

### O que o resultado significa

- JS/CSS com 404: possível arquivo ausente ou implantação incompatível.

- Mixed Content: recurso inseguro em uma página HTTPS; peça avaliação técnica.

- Carregamento infinito: pode haver chamada pendente ou falha no tratamento da resposta.

**O que anexar ao chamado:** Captura da tela, arquivos/chamadas afetados, status, erros do Console e abrangência.

**Quando pedir ajuda:** Se persistir, encaminhe à infraestrutura/Framework para publicação ou comunicação, ou ao Desenvolvimento se o erro estiver concentrado na funcionalidade.

**Atenção:** Não desabilite proteções do navegador nem altere arquivos do servidor.

**Guias relacionados:** KB-0002, KB-0003, KB-0005, KB-0006

**Referências:** [R1 — Chrome DevTools — Network features reference](https://developer.chrome.com/docs/devtools/network/reference), [R2 — Microsoft Edge — Network features reference](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/reference)

# Categoria — APIs e comunicação

## KB-0008 — Interpretando status HTTP

**Palavras-chave:** http, 200, 400, 401, 403, 404, 500, 502, 503, 504, timeout

**Objetivo:** Entender o número retornado pelo servidor e escolher o próximo teste.

**Quando usar:** Uma requisição foi identificada no Network ou Postman.

**Antes de começar:** Endereço da chamada, status e resposta disponíveis.

### Como fazer

1. Abra os detalhes da requisição e confira o status.

2. Leia a lista abaixo para identificar o tipo de ocorrência.

3. Veja Response para entender a mensagem além do número.

4. Confira se o erro acontece na mesma ação e se afeta outros programas.

5. Registre horário, método e resultado; encaminhe conforme as evidências.

### O que o resultado significa

- 200/201/204: comunicação bem-sucedida, mas confira a regra de negócio

- 204 normalmente não tem corpo.

- 304: recurso não modificado, normalmente relacionado ao cache.

- 400/422: solicitação ou conteúdo rejeitado; confira os dados.

- 401/403: autenticação ou acesso; siga KB-0010/0020.

- 404/405: endereço/recurso ou método incorreto ou indisponível; siga KB-0011.

- 409: conflito

- 415: formato não aceito

- 429: excesso de solicitações.

- 500: falha interna

- 502/503/504: problemas possíveis entre servidores, disponibilidade ou tempo limite; solicite análise técnica.

**O que anexar ao chamado:** Status, Response, método, endereço, duração, horário e teste realizado.

**Quando pedir ajuda:** Erros persistentes devem ser avaliados pelo responsável técnico; situações que afetam vários programas exigem avaliação de infraestrutura/Framework conforme processo interno.

**Atenção:** Um número isolado não identifica a causa nem a equipe responsável. Não repita gravações após timeout sem verificar se foram efetivadas.

**Guias relacionados:** KB-0003, KB-0009, KB-0010, KB-0011, KB-0013, KB-0020

**Referências:** [R3 — MDN — Códigos de status de respostas HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status)

## KB-0009 — Analisando Payload e Response

**Palavras-chave:** payload, response, body, json, dados enviados, retorno

**Objetivo:** Comparar as informações enviadas pela tela com a resposta do servidor.

**Quando usar:** O programa não grava, retorna dados incorretos ou apresenta mensagem inesperada.

**Antes de começar:** Requisição identificada na aba Network (KB-0003).

### Como fazer

1. Abra a requisição relacionada à ação.

2. Clique em Payload (dados enviados). Se for consulta, veja também os parâmetros na URL ou em Headers.

3. Compare os valores exibidos com os que foram informados na tela: empresa, estabelecimento, documento, datas e filtros.

4. Clique em Response (resposta) e procure mensagens de erro ou de validação.

5. Compare com um teste que funciona, se autorizado, mantendo o contexto equivalente.

6. Registre diferenças sem editar os dados da requisição.

### O que o resultado significa

- Campo da tela não aparece na chamada: possível problema de envio; confirme se o campo é esperado no contrato.

- Dados enviados corretamente, mas rejeitados: investigue regra de negócio ou dados.

- Resposta correta, tela incorreta: possível tratamento da informação pelo frontend.

- Status 200 com mensagem de falha: comunicação funcionou, mas a operação pode não ter sido concluída.

**O que anexar ao chamado:** Dados de tela, Payload e Response anonimizados, horário e comparação entre os testes.

**Quando pedir ajuda:** Se a divergência persistir ou o contrato esperado não estiver documentado, solicite validação do Desenvolvimento.

**Atenção:** Payload nem sempre existe; não use dados reais em exemplos. Não altere valores nem reenvie a requisição em produção.

**Guias relacionados:** KB-0003, KB-0008, KB-0011, KB-0012

**Referências:** [R1 — Chrome DevTools — Network features reference](https://developer.chrome.com/docs/devtools/network/reference), [R2 — Microsoft Edge — Network features reference](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/reference)

## KB-0010 — Identificando problemas de autenticação

**Palavras-chave:** login, sessão expirada, token, 401, 403, redirecionamento

**Objetivo:** Descobrir se a aplicação reconhece a sessão do usuário.

**Quando usar:** Login falha, a tela retorna ao login ou aparece erro de acesso.

**Antes de começar:** Usuário autorizado; acesso ao navegador e, se possível, a outro programa.

### Como fazer

1. Pergunte se o usuário consegue entrar no Datasul e acessar outras rotinas.

2. Abra Network e reproduza o problema.

3. Procure status 401/403 e redirecionamentos para login.

4. Anote se o erro ocorre após um período de inatividade.

5. Com o trabalho salvo, encerre a sessão normalmente e entre de novo.

6. Teste em janela anônima e, se autorizado, compare com outro usuário utilizando suas próprias credenciais.

7. Se persistir, solicite validação do serviço de autenticação.

### O que o resultado significa

- 401: pode indicar sessão inválida/expirada ou credencial ausente.

- 403: pode indicar restrição de acesso, mesmo que o login funcione; siga KB-0020.

- Se vários usuários não conseguem entrar, pode ser um incidente de serviço.

**O que anexar ao chamado:** Horário, mensagem, status, alcance do problema e resultado do novo login.

**Quando pedir ajuda:** Se o login geral falhar, acione a equipe responsável pela autenticação/Framework; se só uma operação falhar, investigue autorização e regra de negócio.

**Atenção:** Nunca solicite senhas, tokens (chaves de sessão) ou cookies para anexar ao chamado.

**Guias relacionados:** KB-0006, KB-0008, KB-0020

**Referências:** [R1 — Chrome DevTools — Network features reference](https://developer.chrome.com/docs/devtools/network/reference), [R3 — MDN — Códigos de status de respostas HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status)

## KB-0011 — Identificando endpoints com falha

**Palavras-chave:** endpoint, api, url, rota, fetch, xhr

**Objetivo:** Encontrar o endereço da API (serviço que a tela utiliza) ligado à falha.

**Quando usar:** Há várias requisições e não se sabe qual está envolvida no problema.

**Antes de começar:** DevTools aberto; passos de reprodução conhecidos.

### Como fazer

1. Abra Network e marque Preserve log.

2. Limpe os registros e aplique Fetch/XHR.

3. Execute apenas a ação afetada, evitando outras operações ao mesmo tempo.

4. Observe chamadas novas, com erro ou demora, no horário do teste; remova filtros se necessário.

5. Abra Headers e anote Request URL (endereço), Request Method (tipo de operação) e Status Code.

6. Confira Response e Payload; use Initiator, se necessário, para ver o que iniciou a chamada.

7. Registre o identificador de requisição, caso esteja disponível e não seja sensível.

### O que o resultado significa

- Um endereço com erro pode ser a chamada principal ou uma chamada auxiliar; relacione com a ação.

- 404 pode indicar rota ou recurso ausente

- 500 exige inspeção de retorno/logs.

- Se diversas chamadas falham ao mesmo tempo, considere indisponibilidade compartilhada.

**O que anexar ao chamado:** Endereço sem parâmetros sensíveis, método, status, horário, resposta e ação de tela.

**Quando pedir ajuda:** Quando não for possível identificar a chamada principal, envie HAR revisado ou evidências à equipe técnica.

**Atenção:** Não execute URLs desconhecidas diretamente nem compartilhe endereços contendo segredos.

**Guias relacionados:** KB-0003, KB-0004, KB-0008, KB-0009, KB-0013

**Referências:** [R1 — Chrome DevTools — Network features reference](https://developer.chrome.com/docs/devtools/network/reference), [R2 — Microsoft Edge — Network features reference](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/reference)

## KB-0012 — Testando APIs através do Postman

**Palavras-chave:** postman, api, rest, get, post, put, delete

**Objetivo:** Verificar se o serviço responde sem depender da interface do Datasul.

**Quando usar:** A equipe precisa confirmar uma suspeita de comunicação entre tela e servidor.

**Antes de começar:** Ferramenta aprovada, endpoint/documentação, ambiente de homologação e acompanhamento técnico se o analista não conhece APIs.

### Como fazer

1. Confirme com a equipe técnica qual chamada é segura para testar; prefira consulta GET autorizada.

2. Abra o Postman e crie uma requisição HTTP.

3. Informe o endereço aprovado e selecione o método indicado.

4. Preencha Params (filtros) e Headers (informações adicionais) conforme a documentação.

5. Configure Authorization pelo método autorizado, sem salvar ou compartilhar segredos de forma indevida.

6. Preencha Body apenas se exigido e autorizado; revise o ambiente e dados antes de enviar.

7. Clique Send e anote status, duração e resposta.

8. Compare com a chamada do navegador.

### O que o resultado significa

- Funciona no Postman e falha no navegador: verifique diferenças de dados, sessão, origem e comportamento da tela.

- Falha nos dois: pode envolver parâmetros, o serviço ou infraestrutura.

- Não conecta: peça avaliação de rede, DNS, certificados e disponibilidade.

**O que anexar ao chamado:** Método, URL revisada, dados de teste não sensíveis, status e resposta.

**Quando pedir ajuda:** Se o analista não souber autenticar ou montar a chamada, não improvise; solicite apoio ao Desenvolvimento ou responsável pela API.

**Atenção:** Não faça POST/PUT/PATCH/DELETE de produção sem autorização e plano de teste; GET também precisa ser seguro. Não desative validação de certificados. Não sincronize dados de clientes em serviços não aprovados.

**Guias relacionados:** KB-0008, KB-0009, KB-0011

**Referências:** [R4 — Postman — Send a request](https://learning.postman.com/docs/use/send-requests/create-requests/request-basics), [R5 — Postman — Authorization](https://learning.postman.com/docs/use/send-requests/authorization/authorization)

# Categoria — Progress e PASOE

## KB-0013 — Coletando logs dos agentes

**Palavras-chave:** pasoe, appserver, agent, logs, servidor, registro

**Objetivo:** Obter o arquivo que registra acontecimentos no servidor de aplicação durante o teste.

**Quando usar:** A tela retorna erro, não grava, demora ou a requisição aponta falha no servidor.

**Antes de começar:** Acesso ao Datasul; auxílio da equipe responsável pelo servidor ou TOTVS Cloud, conforme contrato.

### Como fazer

1. Identifique o ambiente afetado, programa e data/horário com fuso.

2. Peça ao responsável que identifique a instância PASOE que atende a aplicação.

3. Solicite o log do agente correspondente na pasta de logs da instância. O nome pode variar, por exemplo producao.agent.AAAA-MM-DD.log.

4. Combine uma reprodução segura e anote o horário exato.

5. Peça o arquivo ou trecho autorizado que cubra alguns minutos antes e depois, preservando a sequência.

6. Se o ambiente tem vários servidores/agentes, solicite os registros das instâncias pertinentes.

7. Se não houver detalhe suficiente, encaminhe à equipe de infraestrutura para avaliar nível e tipos de log conforme documentação e cenário.

8. Revise e anexe os arquivos permitidos; use o analisador do SupportFlow quando disponível.

### O que o resultado significa

- Erro no mesmo horário: indica uma ocorrência a correlacionar, não uma causa já comprovada.

- Sem erro: pode ser log incorreto, nível insuficiente ou falha tratada; confirme instância e horário.

**O que anexar ao chamado:** Log revisado, instância, horário e fuso, passos, endpoint/status se houver.

**Quando pedir ajuda:** Se precisar alterar configuração ou localizar arquivos sem acesso, solicite à infraestrutura/Framework/Cloud. Encaminhe ao Desenvolvimento a evidência relacionada ao programa.

**Atenção:** Não altere agentLoggingLevel ou agentLogEntryTypes nem reinicie serviços por conta própria. A equipe responsável avalia impacto, acompanha e restaura os parâmetros. Nível 4 apenas quando orientado para o cenário.

**Guias relacionados:** KB-0003, KB-0011, KB-0014, KB-0021

**Referências:** [R6 — TOTVS — Onde localizar os logs do PASOE](https://centraldeatendimento.totvs.com/hc/pt-br/articles/41842569932951), [R7 — TOTVS — Alterar o nível de log do PASOE](https://centraldeatendimento.totvs.com/hc/pt-br/articles/10403011775255), [R8 — TOTVS — Configuração do log dos agentes AppServer no PASOE](https://centraldeatendimento.totvs.com/hc/pt-br/articles/360057958993), [R9 — TOTVS — Fiscal: html.fiscalDocument não grava campos do item (orientação específica)](https://centraldeatendimento.totvs.com/hc/pt-br/articles/44734730421015)

## KB-0014 — Identificando erros Progress ABL

**Palavras-chave:** progress, abl, erro, código, invalid handle, stack trace

**Objetivo:** Localizar mensagens que ajudem a equipe técnica a investigar os programas executados pelo servidor.

**Quando usar:** Existe log do agente e um horário de falha conhecido.

**Antes de começar:** Arquivo de log autorizado, horário e fuso do teste.

### Como fazer

1. Abra o arquivo no analisador de logs do SupportFlow, se disponível, ou editor local aprovado.

2. Pesquise o horário do problema; considere o fuso do servidor.

3. Procure mensagens como ERROR, Exception, Invalid handle ou textos de erro com números entre parênteses.

4. Registre código, texto completo, nome do programa e linhas próximas.

5. Se houver identificador de sessão/agente, acompanhe mensagens do mesmo contexto.

6. Correlacione a sequência com a operação realizada na tela e a requisição capturada.

7. Pesquise a mensagem na documentação oficial ou base interna.

### O que o resultado significa

- Could not find program: programa pode estar ausente ou em diretório diferente; siga KB-0015.

- Invalid handle: referência de programa/objeto possivelmente inválida; encaminhe detalhes técnicos.

- Database not connected ou lock: possível conexão ou bloqueio; solicite investigação responsável.

- Ausência de erro não significa ausência de problema.

**O que anexar ao chamado:** Trecho contextualizado e revisado, código, programa, horário, instância, teste e log original autorizado.

**Quando pedir ajuda:** Quando houver erro não conhecido ou recorrente, encaminhe à equipe técnica com a sequência completa; não diagnostique pelo texto isolado.

**Atenção:** Não edite o log original; faça cópia para anonimização. Não envie arquivos de clientes a IA externa sem aprovação.

**Guias relacionados:** KB-0013, KB-0015, KB-0018

**Referências:** [R6 — TOTVS — Onde localizar os logs do PASOE](https://centraldeatendimento.totvs.com/hc/pt-br/articles/41842569932951), [R8 — TOTVS — Configuração do log dos agentes AppServer no PASOE](https://centraldeatendimento.totvs.com/hc/pt-br/articles/360057958993)

## KB-0015 — Validando o PROPATH

**Palavras-chave:** propath, diretórios, precedência, buscar, objeto, environmentinf

**Objetivo:** Conferir de onde o servidor procura os programas Progress. A ordem dos locais pode fazer uma versão antiga ser encontrada primeiro.

**Quando usar:** Uma correção não surtiu efeito ou aparece mensagem de programa não encontrado.

**Antes de começar:** Caminho relativo dos objetos a verificar, informado pela equipe técnica.

### Como fazer

1. No Datasul do ambiente afetado, abra Informações do Ambiente (html.environmentInf), pela pesquisa/execução de programa conforme acesso.

2. Localize o PROPATH do AppServer e registre os diretórios na ordem exibida.

3. Na área de busca de arquivos/programas, informe o caminho relativo indicado, por exemplo pasta/programa.r (fictício).

4. Anote o local retornado, data e tamanho, se exibidos.

5. Compare o local encontrado com o diretório onde a correção foi aplicada.

6. Solicite ao responsável a verificação de cópias do mesmo objeto em diretórios anteriores e em demais instâncias.

7. Caso exista diferença, encaminhe a evidência e peça revisão da aplicação do pacote.

### O que o resultado significa

- Objeto não localizado: pode estar ausente ou fora dos caminhos acessíveis.

- Local diferente do pacote: pode existir cópia com maior precedência.

- Local correto: ainda é necessário avaliar versão, dependências e sessões que já carregaram código.

**O que anexar ao chamado:** Captura do PROPATH, busca de cada objeto, caminho do pacote e instância consultada.

**Quando pedir ajuda:** Se houver divergência, peça ao responsável pelo ambiente análise da precedência e aplicação em diretório adequado segundo as orientações do pacote. Se necessário, valide reciclagem de sessões com a equipe técnica.

**Atenção:** Não mova objetos nem modifique o PROPATH sozinho. A busca não prova qual código já estava carregado em memória.

**Guias relacionados:** KB-0016, KB-0018, KB-0022

**Referências:** [R10 — TOTVS — Informações auxiliares no programa Informações do Ambiente](https://centraldeatendimento.totvs.com/hc/pt-br/articles/1500000191741), [R11 — TOTVS — Ordem dos diretórios no PROPATH](https://centraldeatendimento.totvs.com/hc/pt-br/articles/360004981571), [R12 — TOTVS — Atualização do produto Datasul](https://centraldeatendimento.totvs.com/hc/pt-br/articles/43757145898263)

# Categoria — Ambiente Datasul

## KB-0016 — Coletando informações do ambiente

**Palavras-chave:** environmentinf, informações do ambiente, versão, instância

**Objetivo:** Registrar onde ocorre o problema e quais versões estão em uso.

**Quando usar:** No início da investigação ou quando o Desenvolvimento solicitar dados técnicos.

**Antes de começar:** Acesso autorizado ao ambiente e programa Informações do Ambiente.

### Como fazer

1. Confirme se o endereço é de produção (uso real) ou homologação (testes).

2. Acesse o Datasul e procure Informações do Ambiente (html.environmentInf).

3. Capture as informações de versão e os dados disponíveis do ambiente.

4. Registre PROPATH do AppServer quando a falha envolver objetos ou correções.

5. Se solicitado, use a opção de busca de arquivos com o caminho relativo indicado.

6. Peça à infraestrutura as informações que não aparecem: versão OpenEdge, instância PASOE, servidores e histórico de atualizações.

7. Registre navegador, versão e data da última atualização conhecida.

8. Anexe capturas revisadas ao chamado.

### O que o resultado significa

- Ambiente ou versão diverge do esperado: confirme onde o teste/pacote foi aplicado.

- Informações incompletas: registre o que falta e quem pode fornecer; não preencha por suposição.

**O que anexar ao chamado:** Versões/release/patch, ambiente, instância quando conhecida, navegador, PROPATH quando relevante e data da coleta.

**Quando pedir ajuda:** Se não houver acesso ao programa ou se os dados divergirem, peça apoio ao responsável pelo ambiente.

**Atenção:** Informações exibidas variam por release e perfil. Oculte hostnames internos e outros dados sensíveis quando não forem necessários.

**Guias relacionados:** KB-0015, KB-0017, KB-0018, KB-0021

**Referências:** [R10 — TOTVS — Informações auxiliares no programa Informações do Ambiente](https://centraldeatendimento.totvs.com/hc/pt-br/articles/1500000191741)

## KB-0017 — Validando versões e releases

**Palavras-chave:** release, patch, versão, atualização, compatibilidade

**Objetivo:** Verificar se o ambiente tem a atualização que contém a correção esperada.

**Quando usar:** O erro já possui uma correção conhecida ou começou após uma atualização.

**Antes de começar:** Informações do Ambiente e referência oficial da correção/pacote.

### Como fazer

1. Colete release e patch do ambiente (KB-0016).

2. Localize o comunicado da correção, artigo oficial ou pacote enviado pelo Desenvolvimento.

3. Identifique a versão em que a correção foi disponibilizada e as dependências indicadas.

4. Compare com o ambiente afetado, sem assumir que pacotes de outro release são compatíveis.

5. Pergunte ao responsável a data e o resultado da atualização, inclusive em todos os servidores envolvidos.

6. Se o ambiente informar a versão adequada, valide os objetos específicos quando orientado.

7. Registre a comparação e a orientação oficial de atualização.

### O que o resultado significa

- Correção ainda não instalada: oriente atualização compatível conforme política.

- Versão aparentemente adequada: pode haver atualização parcial, objeto antigo ou outro cenário.

- Versão não identificada: solicite dados antes de indicar pacote.

**O que anexar ao chamado:** Release/patch, referência da correção, data/histórico de aplicação e resultado.

**Quando pedir ajuda:** Se a compatibilidade não estiver documentada, consulte a equipe de release ou Desenvolvimento antes de recomendar a aplicação.

**Atenção:** Não indicar instalação de pacote de outro release ou atualização diretamente em produção sem planejamento.

**Guias relacionados:** KB-0016, KB-0018, KB-0022

**Referências:** [R10 — TOTVS — Informações auxiliares no programa Informações do Ambiente](https://centraldeatendimento.totvs.com/hc/pt-br/articles/1500000191741), [R12 — TOTVS — Atualização do produto Datasul](https://centraldeatendimento.totvs.com/hc/pt-br/articles/43757145898263)

## KB-0018 — Identificando objetos desatualizados

**Palavras-chave:** objeto, .r, r-code, hash, arquivo antigo, correção

**Objetivo:** Conferir se os arquivos de programa encontrados no ambiente correspondem aos arquivos da correção.

**Quando usar:** Uma correção aplicada não resolveu, ou funciona em alguns acessos e em outros não.

**Antes de começar:** Lista de objetos esperados e pacote oficial, fornecidos pela equipe técnica.

### Como fazer

1. Peça a relação exata dos arquivos envolvidos na correção.

2. Em Informações do Ambiente, busque cada caminho relativo indicado.

3. Anote caminho, data e tamanho retornados.

4. Compare com o pacote recebido. Solicite, quando possível, comparação de hash (identificador do conteúdo do arquivo) pelo responsável.

5. Verifique se há cópias em outros pontos do PROPATH ou instâncias.

6. Se os arquivos forem os esperados em disco, peça avaliação sobre código carregado nas sessões e dependências.

7. Após regularização autorizada, repita o teste no mesmo cenário.

### O que o resultado significa

- Arquivo ausente ou diferente: provável inconsistência a confirmar no pacote/ambiente.

- Arquivo correto em disco: não elimina sessões antigas ou outras dependências.

- Comportamento intermitente: verificar diferenças entre servidores ou agentes.

**O que anexar ao chamado:** Lista de objetos, localização, data/tamanho, hash se disponível, pacote e servidores comparados.

**Quando pedir ajuda:** Se o objeto não corresponder ou o problema continuar após validação, peça ação do responsável pelo ambiente ou Desenvolvimento.

**Atenção:** Não copie, apague ou substitua objetos por conta própria. Data de modificação sozinha não comprova versão.

**Guias relacionados:** KB-0015, KB-0017, KB-0022

**Referências:** [R10 — TOTVS — Informações auxiliares no programa Informações do Ambiente](https://centraldeatendimento.totvs.com/hc/pt-br/articles/1500000191741), [R11 — TOTVS — Ordem dos diretórios no PROPATH](https://centraldeatendimento.totvs.com/hc/pt-br/articles/360004981571), [R12 — TOTVS — Atualização do produto Datasul](https://centraldeatendimento.totvs.com/hc/pt-br/articles/43757145898263)

## KB-0019 — Verificando customizações e UPCs

**Palavras-chave:** customização, upc, específico, programa personalizado

**Objetivo:** Investigar se uma adaptação feita para o cliente influencia a rotina padrão.

**Quando usar:** O erro ocorre apenas em um cliente, após alteração específica ou em um processo customizado.

**Antes de começar:** Identificação da rotina e apoio de quem administra/desenvolve as customizações.

### Como fazer

1. Pergunte se há adaptações, integrações ou programas específicos relacionados à rotina.

2. Confirme se existe UPC (chamada de um programa personalizado durante a execução padrão).

3. Registre quais são os programas envolvidos e quando foram alterados.

4. Solicite ao responsável a verificação dos cadastros e caminhos de customização, inclusive no PROPATH.

5. Se viável, peça teste controlado em homologação com e sem a customização, com autorização e plano de retorno.

6. Compare o mesmo cenário, dados e versão; registre as diferenças.

7. Relacione mensagens do log com programas específicos quando aparecerem.

### O que o resultado significa

- Só falha com a customização: indício de interferência; encaminhe ao responsável pela adaptação.

- Falha nos dois testes: continue investigando o padrão e o ambiente.

- Não foi possível comparar: registre como hipótese não descartada.

**O que anexar ao chamado:** Nome do programa, customização/UPC envolvida, data de alteração e resultado dos testes.

**Quando pedir ajuda:** Acione o responsável pelas customizações quando houver indício. Ao envolver Desenvolvimento, descreva o que foi ou não possível isolar.

**Atenção:** Nunca desabilite UPCs em produção, pois podem executar regras indispensáveis. Não altere cadastros sem autorização.

**Guias relacionados:** KB-0014, KB-0015, KB-0021

**Referências:** [R11 — TOTVS — Ordem dos diretórios no PROPATH](https://centraldeatendimento.totvs.com/hc/pt-br/articles/360004981571), [R13 — TOTVS — Exemplo de utilização de UPCs em Manufatura](https://centraldeatendimento.totvs.com/hc/pt-br/articles/11937435497111)

## KB-0020 — Investigando problemas de permissões

**Palavras-chave:** permissão, acesso negado, grupo, perfil, 403, botão desabilitado

**Objetivo:** Verificar se o usuário ou serviço tem autorização para realizar a operação.

**Quando usar:** Um usuário não vê o programa, não consegue gravar ou recebe acesso negado.

**Antes de começar:** Usuário afetado, outro perfil autorizado se disponível, apoio do administrador.

### Como fazer

1. Confirme se o programa abre para o usuário afetado.

2. Pergunte se o problema ocorre para todos ou somente alguns usuários.

3. Registre empresa, estabelecimento e operação em que falha.

4. Compare com outro usuário autorizado, usando credenciais próprias e o mesmo cenário.

5. Peça ao administrador a conferência dos grupos, perfis e permissões da rotina e dos dados.

6. Verifique status e mensagem em Network se houver falha de comunicação.

7. Se houver erro ao acessar arquivos no servidor, solicite à infraestrutura verificação do usuário de serviço.

### O que o resultado significa

- Somente um perfil falha: investigar permissões ou parametrização do usuário.

- 403: possível restrição de acesso; não prova a causa.

- Botão desabilitado sem erro: pode ser regra de negócio, estado da tela ou permissão.

**O que anexar ao chamado:** Perfil/grupo pertinente sem credenciais, contexto, mensagem, status e comparação.

**Quando pedir ajuda:** Encaminhe ao administrador de acessos quando houver evidência de autorização; ao Desenvolvimento se a regra funcional divergir do esperado.

**Atenção:** Não conceder acesso administrativo como atalho. Não usar conta de outra pessoa nem testar além das permissões autorizadas.

**Guias relacionados:** KB-0008, KB-0010, KB-0021

**Referências:** [R3 — MDN — Códigos de status de respostas HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status)

# Categoria — Processos de atendimento

## KB-0021 — Conduzindo a investigação inicial

**Palavras-chave:** triagem, atendimento, cenário, reprodução, chamado, impacto

**Objetivo:** Entender o problema, medir o impacto e coletar evidências antes de encaminhar o chamado.

**Quando usar:** Todo novo atendimento relacionado a uma aplicação web.

**Antes de começar:** Descrição inicial do cliente e acesso autorizado para realizar testes.

### Como fazer

1. Identifique programa, módulo, ambiente e objetivo do cliente.

2. Pergunte qual ação foi executada, qual resultado era esperado e o que ocorreu de fato.

3. Registre desde quando acontece, frequência, usuários afetados, impacto e mudanças recentes.

4. Solicite passos numerados e evidências legíveis; confirme horário e fuso.

5. Verifique se há trabalho em andamento, risco de duplicidade ou impacto em produção antes de reproduzir.

6. Se for seguro, repita o cenário em homologação ou ambiente autorizado; compare com um caso que funciona.

7. Siga os guias conforme o sintoma: Console/Network para falha de tela, logs para erro de servidor, ambiente para correções.

8. Consolide fatos, hipóteses, testes executados e próximo passo.

### O que o resultado significa

- Problema isolado: concentre-se no usuário, dados ou programa.

- Vários programas ou usuários indisponíveis: siga o processo interno de incidentes e acione responsáveis sem atrasar por toda a coleta.

- Não reproduzido: documente condições e solicite evidências adicionais.

**O que anexar ao chamado:** Programa, ambiente, esperado x ocorrido, passos, impacto, data, testes e anexos revisados.

**Quando pedir ajuda:** Encaminhe quando houver indício de defeito, necessidade de acesso técnico ou investigação fora da competência do Atendimento, sem afirmar causa não confirmada.

**Atenção:** Priorize segurança, privacidade e continuidade do cliente. Evite testes que possam gravar ou excluir dados reais.

**Guias relacionados:** KB-0001, KB-0003, KB-0013, KB-0016, KB-0023

## KB-0022 — Validando pacotes de correção

**Palavras-chave:** pacote, patch, correção, propath, reiniciar, pasoe

**Objetivo:** Confirmar se a correção foi aplicada adequadamente e se resolveu o cenário relatado.

**Quando usar:** O Desenvolvimento enviou um pacote ou orientou atualização.

**Antes de começar:** Pacote oficial, instruções de aplicação, lista de objetos e responsável autorizado pelo ambiente.

### Como fazer

1. Confirme release/patch, ambiente e compatibilidade indicada no pacote.

2. Solicite ao responsável aplicação em homologação quando possível, com backup/retorno e janela conforme procedimento interno.

3. Peça confirmação de data, horário, diretórios e servidores atualizados.

4. Para objetos Progress, valide a busca em Informações do Ambiente e a precedência do PROPATH (KB-0015).

5. Se a orientação técnica exigir reciclagem de sessões ou reinicialização AppServer/PASOE, peça à equipe responsável que programe e execute, para evitar uso de código antigo em memória.

6. Se houver atualização web, siga orientação de recarga/cache quando aplicável.

7. Repita o mesmo cenário que falhava, com os mesmos dados de teste seguros; registre esperado e observado.

8. Confirme o resultado com o cliente antes de considerar resolvido.

### O que o resultado significa

- Funcionou: registre evidência e confirmação.

- Objeto ainda vem de outro diretório: peça revisão da aplicação e precedência.

- Correção validada, mas falha permanece: colete novos logs/Network e devolva ao Desenvolvimento.

- Falha nova após pacote: acione responsável e avalie plano de retorno previsto.

**O que anexar ao chamado:** Identificação do pacote, release, aplicação, confirmação de busca dos objetos, reinício se exigido, resultado antes/depois.

**Quando pedir ajuda:** Quando houver incompatibilidade, erro de aplicação, falha persistente ou impacto novo, acione a equipe responsável sem improvisar alterações.

**Atenção:** Não reinicie produção, substitua arquivos ou altere PROPATH sem autorização. A necessidade de reinício depende da correção e do ambiente.

**Guias relacionados:** KB-0015, KB-0017, KB-0018, KB-0021

**Referências:** [R10 — TOTVS — Informações auxiliares no programa Informações do Ambiente](https://centraldeatendimento.totvs.com/hc/pt-br/articles/1500000191741), [R11 — TOTVS — Ordem dos diretórios no PROPATH](https://centraldeatendimento.totvs.com/hc/pt-br/articles/360004981571), [R12 — TOTVS — Atualização do produto Datasul](https://centraldeatendimento.totvs.com/hc/pt-br/articles/43757145898263)

## KB-0023 — Solicitando informações complementares ao cliente

**Palavras-chave:** mensagem, cliente, evidências, solicitação, meet

**Objetivo:** Pedir somente as informações necessárias para avançar na investigação, com linguagem clara.

**Quando usar:** O relato está incompleto, não foi possível reproduzir ou uma hipótese precisa ser validada.

**Antes de começar:** Leitura do chamado e identificação do que ainda falta.

### Como fazer

1. Revise informações e anexos já enviados para evitar pedir novamente.

2. Defina quais dúvidas bloqueiam a análise e solicite apenas itens relevantes.

3. Explique o motivo de cada solicitação, usando palavras simples.

4. Peça passos de reprodução, resultado esperado e ocorrido, data/hora com fuso, usuários afetados e ambiente, conforme necessidade.

5. Se precisar de Network, HAR ou logs, envie o guia correspondente e explique como compartilhar os arquivos com segurança.

6. Quando a coleta for difícil, proponha reunião técnica pelo Google Meet ou canal aprovado, com o responsável pelo ambiente se necessário.

7. Registre o retorno do cliente e dê continuidade aos próximos testes.

### O que o resultado significa

- Dados completos: siga a investigação e informe o próximo passo.

- Material incompleto ou inseguro: solicite apenas o complemento ou uma versão revisada.

- Problema de alto impacto: siga o fluxo de incidentes sem depender de uma coleta longa.

**O que anexar ao chamado:** Solicitação enviada, resposta, evidências recebidas e itens pendentes.

**Quando pedir ajuda:** Quando houver dificuldade de acesso ou coleta, combine apoio técnico; em indisponibilidade crítica, acione o fluxo de incidentes.

**Atenção:** Nunca solicite senhas, tokens ou dados fiscais integrais sem necessidade e autorização. Não prometa prazo de solução não confirmado.

**Guias relacionados:** KB-0004, KB-0013, KB-0016, KB-0021

### Modelo de mensagem ao cliente (adaptar ao que falta)

Boa tarde,

Para darmos continuidade à análise, poderiam nos informar o programa acessado, o passo a passo até a ocorrência, o resultado esperado e o comportamento apresentado? Se possível, pedimos também o horário do teste e uma captura da mensagem exibida.

Caso tenham dificuldades para coletar essas informações, podemos alinhar uma reunião técnica para acompanhar o cenário.

Atenciosamente,
Desenvolvimento Fiscal Datasul TOTVS.

## Referências técnicas consultadas

- R1 — [Chrome DevTools — Network features reference](https://developer.chrome.com/docs/devtools/network/reference)

- R2 — [Microsoft Edge — Network features reference](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/network/reference)

- R3 — [MDN — Códigos de status de respostas HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status)

- R4 — [Postman — Send a request](https://learning.postman.com/docs/use/send-requests/create-requests/request-basics)

- R5 — [Postman — Authorization](https://learning.postman.com/docs/use/send-requests/authorization/authorization)

- R6 — [TOTVS — Onde localizar os logs do PASOE](https://centraldeatendimento.totvs.com/hc/pt-br/articles/41842569932951)

- R7 — [TOTVS — Alterar o nível de log do PASOE](https://centraldeatendimento.totvs.com/hc/pt-br/articles/10403011775255)

- R8 — [TOTVS — Configuração do log dos agentes AppServer no PASOE](https://centraldeatendimento.totvs.com/hc/pt-br/articles/360057958993)

- R9 — [TOTVS — Fiscal: html.fiscalDocument não grava campos do item (orientação específica)](https://centraldeatendimento.totvs.com/hc/pt-br/articles/44734730421015)

- R10 — [TOTVS — Informações auxiliares no programa Informações do Ambiente](https://centraldeatendimento.totvs.com/hc/pt-br/articles/1500000191741)

- R11 — [TOTVS — Ordem dos diretórios no PROPATH](https://centraldeatendimento.totvs.com/hc/pt-br/articles/360004981571)

- R12 — [TOTVS — Atualização do produto Datasul](https://centraldeatendimento.totvs.com/hc/pt-br/articles/43757145898263)

- R13 — [TOTVS — Exemplo de utilização de UPCs em Manufatura](https://centraldeatendimento.totvs.com/hc/pt-br/articles/11937435497111)
