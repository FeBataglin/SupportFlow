# Changelog

## [Unreleased]

### Fixed
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
