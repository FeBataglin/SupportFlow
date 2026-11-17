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
