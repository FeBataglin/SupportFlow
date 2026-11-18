# Changelog

## [Unreleased]

### Assets
- Quatro exemplos visuais dos KB-0025 a KB-0028, com dados fictícios, código no arquivo, legendas e prompts. Diagrama PASOE revisado para não sugerir comunicação direta entre banco e navegador.
- KB-0012 revisada para Basic Auth com credenciais fictícias do ambiente da URL fornecida pelo usuário; nova imagem versionada, manifesto, legenda e prompt atualizados.
- Conjunto de 18 imagens didáticas identificadas por KB-0001 a KB-0018, com simulações de navegador, APIs, logs e ambiente; arquivos PNG abaixo de 2 MB, índice, legendas, manifesto e prompts em docs/assets/guias.
- KB-0019 a KB-0023 documentados com sugestões de reutilização ou manutenção do roteiro textual. Nenhuma imagem foi enviada ao Drive automaticamente.
- Primeiro exemplo ilustrativo de Console e Network gerado com dados fictícios e marcações. Arquivo e prompt em docs/assets; ainda não incorporado aos guias.

### Added
- Remoção de múltiplos guias com caixas de seleção, contagem e seleção de todos os resultados visíveis, respeitando pesquisa e filtros.
- Confirmação dos códigos selecionados, validação integral do lote no servidor, auditoria e preservação de imagens e conteúdo para restauração.
- Lista administrativa de guias removidos com seleção e restauração sem duplicidade; recuperação como Não publicado, preservando conteúdo e imagens.
- Opção de restaurar os KB-0025 a KB-0028 já com a revisão simplificada quando reconhecidos como originais, sem sobrescrever edições próprias.
- Testes de restauração, permissões, concorrência, conteúdo personalizado e preservação de imagens.
- Ação administrativa de simplificação dos guias originais já importados, com confirmação, controle de concorrência e preservação de imagens/publicação e edições próprias.
- KB-0025 a KB-0028: investigação de lentidão/timeout, bloqueios de navegador, correlação entre Network e logs e entendimento das camadas web.
- Catálogo ampliado para 28 guias nas cinco categorias existentes; importação incremental testada com bases de 23 e 24 artigos, preservando edições, imagens, publicações e remoções.
- KB-0024: aplicação de correções web .war, com roteiro técnico, backup, escopo por projeto, identificação do serviço responsável, validação e modelo de mensagem ao cliente.
- Fonte complementar preservando o documento original de 23 guias; gerador e importador aceitam o catálogo ampliado e adicionam apenas códigos ausentes, sem sobrescrever dados existentes.
- Seleção de múltiplas imagens no editor, com legendas individuais, progresso e repetição dos itens pendentes sem reenviar concluídos.
- Envio em lote pela listagem, com destino identificado pelo código KB no arquivo e salvamento das imagens em vários guias, preservando o status atual.
- Publicação de vários guias com confirmação, autorização administrativa e validação de versões antes das gravações.
- Remoção de guias por administradores, com confirmação na listagem e na leitura, auditoria e proteção contra alterações concorrentes.
- Guias removidos ficam fora da base e não são recriados ao reimportar; registro técnico, categorias e arquivos no Drive são preservados. Imagens deixam de ser consultáveis pelo aplicativo.
- Testes de cancelamento/confirmação, falha de remoção, permissões, concorrência, reimportação e preservação de imagens.
- Imagens no editor dos guias: envio de PNG/JPEG/WebP até 2 MB, legenda, inserção no texto, pré-visualização e ampliação na leitura.
- Armazenamento no Drive sem criação de links públicos e registro na nova tabela GuideImages, preparada sem sobrescrever a base existente.
- Consulta de imagens autorizada por perfil, publicação e vínculo com o guia; validação de MIME, assinatura, tamanho e referências ao salvar.
- Configuração `setupGuideImages` e escopo OAuth do Drive documentados; testes de envio, referências, acesso e formatos inválidos.
- Base de conhecimento com pesquisa por código, título, categoria, palavras-chave e texto, ignorando acentos.
- Pacote inicial de 23 guias em cinco categorias, importado como rascunho com preservação de edições e reporte de conflitos de código.
- Leitura com listas numeradas, avisos, referências e links internos; orientações gerais em seção recolhível.
- Edição com pré-visualização, revisão e publicação por administrador; rascunhos bloqueados ao Atendimento no servidor.
- Proteção contra edição concorrente e testes de importação, publicação, busca, permissões e renderização segura.
- Fonte Markdown preservada e gerador reproduzível sem dependências. Nenhuma chamada ao Gemini.

### Changed
- Removidos botões individuais de remoção da listagem; ação em lote aparece somente após selecionar guias.
- Caixas de seleção com área de clique ampliada, marcação em ciano, estado parcial, foco de teclado e destaque discreto do artigo selecionado.
- KB-0025 a KB-0028 revisados para 1.1, com passos curtos, termos explicados e exemplos para o Atendimento iniciante. Edições 1.0 preservadas para comparação controlada.
- Status draft apresentado como Não publicado, com resumo de cadastrados/publicados e ações diretas para publicação.
- Removido banner promocional do dashboard e slogan do rodapé.
- Textos dos módulos substituídos por descrições funcionais; títulos, indicadores e estados vazios simplificados.

### Fixed
- Imagens do envio em lote posicionadas em Como fazer, antes dos passos; imagens antigas soltas após as referências são reorganizadas na leitura e no editor, sem novo upload.
- Ordem das imagens preservada em envios consecutivos; referências já presentes não são duplicadas, e imagens entre passos mantêm a posição.
- Impedida abertura duplicada da janela de imagens em lote durante carregamento e após seleção de arquivos, preservando a seleção existente.
- Janela de envio fecha automaticamente quando todos os itens são salvos; falhas parciais mantêm os detalhes e habilitam Tentar restantes.
- Botão de importação oculto quando todos os códigos iniciais já estão cadastrados; importações parciais mostram apenas os faltantes, sem recriar removidos.
- Links internos tratados pelo roteador da aplicação para evitar navegação para uma página vazia no iframe do Apps Script, incluindo cards, menu e guias relacionados.
- Configuração webapp mantida no manifesto local para não ser removida na sincronização: execução como responsável pela implantação e acesso ao domínio Workspace.
- Entrada `setupSupportFlow` sem sufixo para execução no editor, preservando validação de identidade e domínio. Instruções de configuração atualizadas.
- Mensagem de acesso diferencia ALLOWED_DOMAINS ausente de domínio não autorizado e orienta a configuração inicial, sem liberar acesso automaticamente.

## [1.0.0] — 2026-11-17

### Added
- Estrutura Apps Script com identidade SupportFlow, dashboard, navegação responsiva e temas persistidos no navegador.
- Indicadores reais e estados vazios, sem dados demonstrativos.
- Páginas informativas para módulos futuros.
- Gestão de usuários, perfis e acesso ativo; consulta de auditoria administrativa.
- Inicialização idempotente das tabelas sem apagar dados existentes.
- Testes locais com serviços Google simulados e documentação de configuração e implantação.

### Security
- Acesso negado por padrão; identidade Google ativa, domínio exato e cadastro verificados no servidor.
- Operações administrativas restritas a admin; preservação do último administrador ativo.
- Helpers e inicialização privados para chamadas do frontend; escape HTML e proteção contra fórmulas na escrita.
- Sem conexão externa com IA, armazenamento de logs ou segredos no código.

## Analisador local sem IA

- Substituída a integração Gemini por classificação local de TXT/LOG, agrupamento, contexto e filtros.
- Programa opcional destaca menções sem excluir outros indícios. Nenhum log ou resultado é enviado ou persistido.
- Retirados diagnóstico assistido, assistente Gemini e histórico da navegação e dos cards.
- Removidos endpoints Gemini e escopo de requisição externa.
- 67 testes locais aprovados, incluindo classificação, contexto, filtros, escape de HTML e descarte de leitura pendente.

## Logs grandes e botão de paginação

- Arquivos TXT/LOG de até 100 MB, com leitura incremental, progresso e cancelamento. Texto colado mantém limite de 2 MB.
- Arquivos grandes são analisados sem inserir o conteúdo inteiro na caixa de texto.
- Espaçamento do botão Mostrar mais mensagens e regra CSS para respeitar seu estado oculto, inclusive com filtros sem resultados.
- Testes com arquivo sintético de 31 MB, erro no fim, contexto entre blocos, UTF-8, cancelamento e limites.

## Leitura UTF-8 e mensagens de erro

- Removida a atribuição genérica de TypeError à codificação UTF-8.
- Leitura tolerante a bytes inválidos, com aviso de caracteres de substituição sem interromper o restante da análise.
- Falhas ao ler blocos são identificadas separadamente. Arquivos originais não são alterados.

## Redução de falsos positivos nos logs PASOE

- Separação do cabeçalho e da mensagem no formato PASOE observado nos exemplos.
- Leituras de configuração Properties e chamadas normais de 4GLTRACE deixam de gerar erros por palavras no nome da propriedade ou da rotina.
- Timeout e exceções passam a exigir evidência textual de falha, com regressões cobrindo os exemplos recebidos e falhas explícitas que devem continuar aparecendo.
- Agrupamento de mensagens iguais entre sessões e threads, preservando cabeçalhos e numeração no contexto.

## Diagnóstico assistido sem IA

- Seis entradas por sintoma, com perguntas e próximos testes condicionados aos resultados informados.
- Guias de apoio, observações por teste, revisão do caminho e saída para coleta de evidências quando não foi possível verificar.
- Resumo parcial/final para copiar no chamado, com seleção manual quando a área de transferência não estiver disponível.
- Estado somente na memória da aba, preservado ao consultar guias, com descarte confirmado para iniciar novo diagnóstico. Sem histórico no servidor ou armazenamento no navegador.
- Menu e card do diagnóstico disponíveis novamente, sem API ou novos escopos.

## Progress, simulação e resultados funcionais

- 17 entradas de diagnóstico, incluindo telas/programas Progress, simulação reproduzível, resultado sem mensagem, divergência funcional, registro não gerado/SPED e cálculo divergente.
- Identificação da execução Desktop/web, coleta pertinente à sessão/serviço e solicitação específica para Desktop. Logs não são obrigatórios em todo caminho funcional.
- Contexto com esperado e observado separados; etapas de pré-requisitos, frequência, reprodução, referência da regra e comparação rastreável.
- Seis guias novos KB-0029 a KB-0034, importados como não publicados sem sobrescrever conteúdo existente. Regras fiscais e fórmulas específicas precisam de referência validada.

## Servidores separados: web/PASOE e telas Progress

- Roteiros 1.3 com identificação explícita do servidor de cada tipo de execução, incluindo objetos, PROPATH, pacotes e registros independentes.
- Coleta para telas Progress referencia seu servidor e a sessão/serviço, sem presumir execução somente no cliente.
- Treze guias revisados para 1.2. Ação Revisar N guia(s) aplica revisões somente a textos originais reconhecidos, preservando imagens, publicação e edições próprias.
- Resumo identifica o servidor da investigação; sem identificação suficiente, pede confirmação.

## Relatórios RPW

- Título do resumo separado do roteiro/contexto por linhas em branco.
- Novo guia KB-0035 e 18º cenário, com parâmetros, execução/estado, saída, análise funcional e registros do servidor RPW quando pertinentes.
- Solicitação curta de log RPW, leitura com evidência e conferência de objetos/PROPATH no RPW; sem presumir nome ou caminho universal de arquivo.

## Busca, carregamento e sugestões

- Busca por código com variações de formato, normalização de termos comuns e ordenação por relevância. Filtros preservados na aba, botão Limpar filtros e proteção contra respostas antigas.
- Indicador de carregamento nas chamadas de servidor, incluindo modais e operações concorrentes.
- Tela Sugestões e dificuldades, com envio, acompanhamento do autor e atualização de situação/retorno pela Administração. Aba Suggestions criada automaticamente, com autorização e validação no servidor.

## Prévia de Atendimento

- Alternância no cabeçalho para administradores, com aviso e retorno à visão administrativa.
- Leituras filtradas no servidor: guias/imagens publicados e sugestões do próprio autor, sem modificar o cadastro ou permissões reais.

## Diagnóstico: ambiente, pacote e análise antes do apoio

- Onze cenários com conferência de Informações do Ambiente, pacote e componentes, PROPATH da instância web, localização/versão de objetos e customizações/UPCs.
- Etapas distintas para solicitar, receber, conferir escopo, ler o log e correlacionar os achados ao teste.
- Texto de solicitação ao cliente para cópia manual e atalho para o analisador, preservando o diagnóstico na memória da aba.
- Observações de evidência exigidas nas verificações principais; pendências e impedimentos explícitos no quadro de preparação e no resumo. Sem certificação automática ou bloqueio de acionamento em urgências.
