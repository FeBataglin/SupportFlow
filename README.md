# SupportFlow

Central interna de apoio ao atendimento de aplicações web TOTVS Datasul em Google Apps Script. Entrega inicial **v1.0.0**, baseada na especificação fornecida. Identidade visual conceitual, sujeita à validação corporativa.

## Escopo

Dashboard com contagens reais e metadados de orientações recentes; navegação responsiva; temas claro/escuro; autenticação e autorização no servidor; administração de usuários e auditoria; estrutura de dados no Sheets.

A Base de conhecimento permite importar, pesquisar, ler, editar e publicar os 23 guias iniciais. Analisador de logs, Gemini, diagnóstico assistido, histórico e indicadores futuros continuam como páginas explicativas. Não há upload, chat ou relatórios nesta entrega, nem dados fictícios.

## Guias de atendimento

Depois de sincronizar os arquivos com `clasp push`, recarregue a URL de teste do aplicativo. Entre como administrador em **Base de conhecimento → Importar 23 guias iniciais**. Também é possível executar `importInitialGuides` no editor com uma conta admin já cadastrada. Não é necessário reexecutar a inicialização nem recolocar `INITIAL_ADMIN_EMAIL`.

A importação adiciona KB-0001 a KB-0023 em cinco categorias, todos como **rascunho**. Abra cada guia, clique em **Editar guia**, revise o conteúdo, selecione **Publicado** e salve. Atendimento só consulta publicados; Administração lê e edita os rascunhos. Para retirar um guia de circulação, salve novamente como Rascunho.

Pesquise por código, título, categoria, palavras-chave ou conteúdo (por exemplo F12, 500, PROPATH e objeto desatualizado). A pesquisa ignora acentos e exige que todos os termos estejam presentes. Os códigos KB no texto abrem guias relacionados; referências externas abrem outra aba. Um relacionado ainda não publicado permanece inacessível ao Atendimento.

O conteúdo pode ser editado em Markdown, com pré-visualização: títulos, passos numerados, listas, campos em negrito, avisos e links. HTML e imagens não são interpretados. Objetivo, quando usar, pré-requisitos, passos, interpretação, evidências, ajuda, atenção, relacionados e referências foram preservados no texto. Palavras-chave, revisão, categoria, título e status possuem campos próprios. Capturas autorizadas e criação de novos guias fora do pacote inicial ficam para evolução posterior.

Reimportar preserva registros existentes, inclusive edições. Se um código já pertencer a outro artigo, o código é reportado como conflito e não é alterado. Guias editados conservam a origem no metadado privado; não são substituídos mesmo após mudança de título. Gravações concorrentes são rejeitadas quando a data de alteração já mudou. Não há histórico de versões completo: a revisão é um campo editorial e a auditoria registra a operação solicitada.

Fonte adotada: `docs/Guias_Atendimento_Fonte.md`, cópia do Markdown fornecido. O DOCX foi consultado como referência complementar. Instruções editoriais, catálogo e lista global de referências não integram o corpo dos artigos; cada guia conserva suas próprias referências. Orientações gerais ficam em uma seção recolhível na listagem. O conteúdo não foi certificado como política oficial nem suas referências foram revalidadas nesta implementação.

`GuideSeeds.gs` é gerado por `node scripts/build-guides.cjs`, sem dependências. Alterar a fonte e regenerar o pacote não atualiza artigos já importados, para proteger edições; atualize-os pela aplicação. Campos editoriais ficam em JSON versionado dentro de `Articles.content`, sem alterar cabeçalhos ou migrar a planilha existente.

## Arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| Código.js | Entrada web, bootstrap e operações administrativas |
| Auth.gs | Identidade, domínios e perfis |
| DataService.gs | Persistência, inicialização e auditoria |
| Knowledge.gs / GuideSeeds.gs | Consulta, edição, importação e conteúdo inicial dos guias |
| KnowledgeScripts.html | Lista, leitura e editor dos guias |
| Index.html / Styles.html / Scripts.html | Interface e comportamento do frontend |
| appsscript.json | Runtime V8, fuso e escopos OAuth |
| tests/backend.test.cjs | Testes locais com serviços Google simulados |

## Configuração inicial

1. Utilize um projeto Apps Script de desenvolvimento e a conta corporativa responsável. O `.clasp.json` existente foi preservado e está ignorado no Git.
2. No editor Apps Script, em **Configurações do projeto → Propriedades do script**, configure:

   | Propriedade | Valor |
   | --- | --- |
   | `ALLOWED_DOMAINS` | Domínio corporativo aprovado, sem @; múltiplos separados por vírgula. Subdomínios devem ser incluídos explicitamente. |
   | `INITIAL_ADMIN_EMAIL` | E-mail exato da conta que executará a inicialização. |
   | `SPREADSHEET_ID` | Opcional na primeira execução: ID de uma planilha dedicada. Se ausente, a inicialização cria uma. |

3. Para sincronizar, use CLASP instalado e autenticado: confira o destino em `.clasp.json` e execute `clasp status`, depois `clasp push` para o projeto de desenvolvimento. Nenhum push ou deploy foi executado nesta entrega. `.claspignore` envia somente os arquivos da aplicação.
4. Execute **`setupSupportFlow` pelo editor Apps Script**, no arquivo `DataService.gs`, e autorize os escopos de identidade e planilhas. O executor deve coincidir com `INITIAL_ADMIN_EMAIL` e pertencer a um domínio permitido. Sincronize os arquivos locais antes de procurar a função no editor remoto.
5. A inicialização salva `SPREADSHEET_ID`, cria tabelas ausentes e cadastra o primeiro admin somente quando `Users` está vazia. Reexecutar preserva dados. Cabeçalhos incompatíveis geram erro sem substituição. Uma falha parcial pode ser corrigida e a função repetida.
6. Após inicializar, remova `INITIAL_ADMIN_EMAIL` até precisar de manutenção pelo editor. Cadastre usuários pela Administração; não existe acesso automático para todo o domínio.

Domínio, responsáveis e políticas corporativas são decisões pendentes. Nenhum domínio TOTVS foi presumido no código. Não coloque segredos em arquivos versionados.

## Implantação de desenvolvimento e identidade

No editor, use **Implantar → Testar implantações → Aplicativo da Web** para testes por editores. A URL `/dev` exige acesso de editor; não conceda edição aos atendentes somente para teste. Para contas sem edição, use uma implantação separada de desenvolvimento com audiência corporativa restrita, após definir a configuração de identidade aprovada.

O Apps Script oferece execução como proprietário ou como usuário que acessa. Para planilha privada, a execução como proprietário só é adequada se o domínio Workspace e a implantação disponibilizarem o e-mail do usuário ativo. Teste com duas contas diferentes: cada uma deve visualizar o próprio e-mail. O aplicativo usa exclusivamente `Session.getActiveUser()`, nunca a identidade efetiva do proprietário. E-mail vazio bloqueia o acesso.

Na execução como usuário, avalie as permissões da planilha: escrita administrativa exige acesso direto ao arquivo, o que pode contornar a autorização da aplicação. Esta arquitetura protege a camada da aplicação; editores do script ou planilha são responsáveis técnicos com acesso privilegiado. Não compartilhe a planilha com atendentes em uma implantação como proprietário.

Referências oficiais consultadas:

- [Web apps e identidade de execução](https://developers.google.com/apps-script/guides/web)
- [Session e disponibilidade do e-mail](https://developers.google.com/apps-script/reference/base/session)
- [Quotas do Apps Script](https://developers.google.com/apps-script/guides/services/quotas)

As quotas dependem da conta e podem mudar. Leituras em lote e gravações curtas sob ScriptLock atendem à estrutura inicial. Leituras completas de tabelas devem ser revistas antes de um histórico de grande volume.

## Persistência

Tabelas iniciais: `Users`, `Categories`, `Articles`, `Audit`. Estruturas reservadas, sem comportamento implementado: `LogRules`, `DiagnosticFlows`, `DiagnosticHistory`, `AnalysisMetadata`, `Settings`. Artigos e categorias não são preenchidos automaticamente. IDs são UUID, datas novas ISO UTC; exibição no fuso São Paulo.

Alterações de usuários usam lock do script e preservam ao menos um admin ativo. Auditoria é gravada antes da alteração como registro da operação solicitada, sem garantia transacional de conclusão. Sheets não oferece transação entre essas duas gravações. Eventos contêm e-mails administrativos: definir acesso e retenção antes de produção. Não existe limpeza automática.

Helpers terminam em `_` e não são expostos via `google.script.run`. A entrada `setupSupportFlow` é pública e exige identidade correspondente a `INITIAL_ADMIN_EMAIL` e domínio permitido, inclusive em chamadas diretas. Remova essa propriedade após configurar. Demais endpoints públicos revalidam permissões em cada chamada; esconder o menu não é a medida de autorização.

Não há conexão Gemini nem escopo externo. Serviço aprovado, modelo, sanitização e política de privacidade serão definidos para v1.3. Não armazene logs brutos nem segredos nas tabelas reservadas.

## Verificação

Com Node.js 18 ou superior, sem instalar dependências:

```powershell
node --test tests/backend.test.cjs
```

Os testes simulam os serviços Google e verificam autorização, cadastro, último administrador, inicialização idempotente, cabeçalhos, escape de fórmulas, filtragem de artigos e sintaxe do frontend. Não comprovam OAuth, configuração Workspace, quotas reais ou execução remota.

Checklist manual no ambiente Apps Script:

- Inicializar duas vezes e confirmar preservação dos dados.
- Entrar com administrador e atendimento; conferir e-mails e menus distintos.
- Conta não cadastrada, inativa, domínio não autorizado e identidade vazia: bloquear acesso.
- Atendimento chamando endpoint administrativo diretamente: rejeitar no servidor.
- Alterar perfil, desativar conta e tentar remover o último admin: validar proteção.
- Conferir dashboard vazio, falha de conexão e botão de nova tentativa.
- Importar duas vezes, revisar e publicar um guia; Atendimento deve ver somente publicados.
- Buscar F12/500/PROPATH/objeto desatualizado, abrir relacionados e verificar referências externas.
- Editar e reimportar: preservar alterações; um editor desatualizado deve receber aviso de conflito.
- Navegar nos módulos restantes e confirmar indicação de recurso planejado.
- Conferir temas claro/escuro, persistência após recarregar, teclado e larguras de 360/768/1440 px.
- Validar menu móvel e tabelas com rolagem horizontal.

Não houve implantação remota nem validação visual em navegador nesta entrega. A ativação depende da configuração corporativa acima.

