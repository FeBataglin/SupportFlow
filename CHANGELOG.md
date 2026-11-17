# Changelog

## [Unreleased]

### Assets
- Primeiro exemplo ilustrativo de Console e Network gerado com dados fictícios e marcações. Arquivo e prompt em docs/assets; ainda não incorporado aos guias.

### Added
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
- Removido banner promocional do dashboard e slogan do rodapé.
- Textos dos módulos substituídos por descrições funcionais; títulos, indicadores e estados vazios simplificados.

### Fixed
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
