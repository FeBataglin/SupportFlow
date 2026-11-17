# Imagens de exemplo dos guias

18 imagens originais geradas pela ferramenta integrada **imagegen**, em 1536 × 1024, todas abaixo de 2 MB. Código KB no cabeçalho e no nome do arquivo. Identificadas como simulação; não são capturas reais nem documentação oficial de interface.

## Como inserir

1. No SupportFlow, abra o guia indicado pelo código e clique em **Editar guia**.
2. Posicione o cursor depois de **Como fazer**, antes dos passos, ou junto do passo que a figura exemplifica.
3. Em **Adicionar imagem**, selecione o PNG correspondente e use a legenda sugerida abaixo.
4. Clique em **Enviar e inserir imagem**, confira na pré-visualização e salve. Publique após revisar.

Os arquivos estão locais. Não foram enviados ao Drive nem inseridos automaticamente em artigos existentes. As alterações de imagens são feitas pelo aplicativo; `clasp push` não envia estes PNGs.

## Arquivos finais

| Código | Imagem | Legenda sugerida |
| --- | --- | --- |
| KB-0001 | [Abrindo o DevTools](KB-0001-browser-devtools.png) | Abra o DevTools e localize Console e Network. |
| KB-0002 | [Lendo erros no Console](KB-0002-console-erros.png) | Identifique mensagem, pilha e horário do erro. |
| KB-0003 | [Analisando uma requisição](KB-0003-network-requisicao.png) | Localize a requisição e registre método, status e duração. |
| KB-0004 | [Exportando HAR](KB-0004-exportar-har.png) | Exporte o HAR sanitizado e revise antes de compartilhar. |
| KB-0005 | [Testando sem cache](KB-0005-cache-navegador.png) | Compare o comportamento após recarga e teste sem cache. |
| KB-0006 | [Comparando sessões do navegador](KB-0006-janela-anonima.png) | Compare a mesma operação na janela normal e anônima. |
| KB-0007 | [Identificando falhas de carregamento](KB-0007-componentes-v2.png) | Confira arquivos JS/CSS com falha e chamadas pendentes. |
| KB-0008 | [Interpretando status HTTP](KB-0008-status-http.png) | Use o status para escolher a próxima verificação. |
| KB-0009 | [Comparando Payload e Response](KB-0009-payload-response.png) | Compare dados da tela, Payload e Response. |
| KB-0010 | [Investigando autenticação](KB-0010-autenticacao.png) | Correlacione status 401/403 com sessão e permissões. |
| KB-0011 | [Localizando o endpoint](KB-0011-endpoint.png) | Registre endereço, método, status e horário da chamada. |
| KB-0012 | [Postman com Basic Auth](KB-0012-postman-basic-auth-v2.png) | Configure Basic Auth com o login e a senha do ambiente informado na URL. Credenciais da figura são fictícias. |
| KB-0013 | [Selecionando logs do agente](KB-0013-logs-pasoe.png) | Confirme instância e horário antes de coletar o trecho do log. |
| KB-0014 | [Lendo um erro Progress](KB-0014-erro-progress.png) | Registre mensagem, programa, horário e contexto do erro. |
| KB-0015 | [Entendendo a busca no PROPATH](KB-0015-propath.png) | Exemplo conceitual de precedência na busca de um objeto. |
| KB-0016 | [Registrando o ambiente](KB-0016-informacoes-ambiente.png) | Organize os dados de ambiente que acompanham o chamado. |
| KB-0017 | [Comparando versões](KB-0017-versoes-releases.png) | Compare os dados do ambiente com as instruções da correção. |
| KB-0018 | [Identificando objeto desatualizado](KB-0018-objeto-desatualizado.png) | Compare o objeto localizado com o objeto recebido na correção. |

## Guias sem imagem exclusiva

| Código | Orientação |
| --- | --- |
| KB-0019 | Customizações e UPCs: o procedimento depende do ambiente. Reutilize o esquema do KB-0015 se precisar explicar a precedência. Não foi inventada uma tela de cadastro. |
| KB-0020 | Permissões: reutilize KB-0010 para exemplificar 401/403. Grupos e perfis reais variam por ambiente. |
| KB-0021 | Investigação inicial: o roteiro textual é suficiente; KB-0001 e KB-0003 já ilustram a coleta técnica. |
| KB-0022 | Pacotes: reutilize KB-0015, KB-0017 e KB-0018 conforme a correção. Não há tela universal de aplicação de pacote. |
| KB-0023 | Solicitação ao cliente: texto/modelo de mensagem; uma captura não acrescentaria uma etapa de uso. |

Ao reutilizar imagem, mantenha seu código de origem visível e explique a relação na legenda.

## Referências e origem

**Revisão KB-0012:** imagem atualizada conforme orientação do usuário para Basic Auth e URL `http://engjv-devdock01:8183/api/ofp/v1/nomeDoPrograma`. Login e senha devem corresponder ao ambiente da URL; os campos da figura são fictícios. A imagem anterior `KB-0012-postman.png`, com No Auth, foi preservada somente como histórico e não deve ser utilizada. [Prompt atualizado](KB-0012-basic-auth.prompt.md). Se a versão anterior já estiver no guia, remova sua linha de imagem pelo editor e envie a nova; o upload em lote acrescenta figuras e não substitui as anteriores.

- Fonte funcional: os 23 guias fornecidos em `docs/Guias_Atendimento_Fonte.md`.
- [Chrome DevTools — Network](https://developer.chrome.com/docs/devtools/network/reference): referência consultada para controles e termos. Nenhuma captura foi baixada ou redistribuída.
- [TOTVS — Informações auxiliares do ambiente](https://centraldeatendimento.totvs.com/hc/pt-br/articles/1500000191741) e [consulta de programas no PROPATH](https://centraldeatendimento.totvs.com/hc/pt-br/articles/23630962723991): referências oficiais localizadas, mas as capturas não puderam ser recuperadas pela ferramenta de consulta. Não há imagem copiada do TDN ou da Central TOTVS neste pacote.
- Prompts completos: [prompts.json](prompts.json). Correção do filtro All do KB-0007: [prompt da revisão](KB-0007-revisao.prompt.md).
- [manifest.json](manifest.json) lista os 18 arquivos finais. A variante `KB-0007-componentes.png` é anterior à correção do filtro, foi preservada para histórico e não deve ser utilizada. Use `KB-0007-componentes-v2.png`.

## Conferência realizada

Código, legibilidade geral, coerência com os passos e ausência de dados reais foram revisados visualmente. O filtro da figura KB-0007 foi corrigido para **All**, permitindo ilustrar JS/CSS e Fetch juntos. Assinatura PNG, dimensões e tamanho foram conferidos por arquivo. Layouts são esquemáticos: posições, nomes e aparência podem variar conforme versão. Os exemplos de Postman não definem a autenticação de uma API real; use a configuração autorizada para cada serviço.

