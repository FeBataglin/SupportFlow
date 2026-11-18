# SupportFlow

Central interna de apoio ao atendimento de aplicações web TOTVS Datasul em Google Apps Script. Entrega inicial **v1.0.0**, baseada na especificação fornecida. Identidade visual conceitual, sujeita à validação corporativa.

## Escopo

Guias consultados a partir de um diagnóstico oferecem **Voltar ao diagnóstico**. Na base, **Revisar resultados (N)** permite percorrer a lista filtrada com Anterior/Próximo e publicar o guia atual antes de avançar, sempre com confirmação. Veja [Navegação e revisão de guias](docs/Navegacao_Guias.md).

Administradores podem usar **Ver como Atendimento** no cabeçalho para conferir a visão de usuário, com guias publicados e sem ações administrativas. **Voltar à Administração** restaura a visão normal; o perfil real não é alterado. Consulte [Prévia de Atendimento](docs/Previa_Atendimento.md).

Busca com códigos/acentos/plurais e relevância por título; indicador de carregamento nas ações de servidor; página **Sugestões e dificuldades** para melhorias, novos guias e roteiros. Sugestões são persistidas na planilha (autor acompanha as próprias; administração gerencia todas). Consulte [Busca, loading e sugestões](docs/Sugestoes_Busca_Loading.md). Logs e respostas de diagnóstico continuam temporários.

Dashboard com contagens reais e metadados de orientações recentes; navegação responsiva; temas claro/escuro; autenticação e autorização no servidor; administração de usuários e auditoria; estrutura de dados no Sheets.

A Base de conhecimento permite importar, pesquisar, ler, editar e publicar os 35 guias do catálogo, com envio de imagens de exemplo. O Analisador de logs funciona localmente no navegador, sem IA, upload ou histórico. O Diagnóstico assistido oferece 18 entradas por cenário, resultados informados pelo atendimento e resumo para copiar, sem IA ou persistência de respostas. Assistente Gemini e histórico não estão disponíveis. Consulte [Analisador de logs](docs/Analisador_Logs.md) e [Diagnóstico assistido](docs/Diagnostico_Assistido.md).

## Guias de atendimento

### Relatórios no RPW

O cenário **Relatório executado no RPW** diferencia solicitação, processamento, saída e resultado funcional. Logs, quando necessários, são solicitados no servidor RPW que executou o relatório; objetos/PROPATH também são conferidos nesse ambiente. O novo **KB-0035** está em docs/Guias_RPW.md. Após o push, importe o guia restante e revise/publique para disponibilizá-lo ao Atendimento. O catálogo passa a 35 guias e o diagnóstico a 18 cenários (roteiros 1.4).

### Separação entre os servidores

Aplicações web/PASOE e telas Progress usam servidores separados. Diagnósticos e 13 guias foram revisados para conferir objetos, PROPATH, pacotes e registros no servidor correspondente. Para guias já importados, use **Revisar N guia(s)** na base após o push; imagens e status são preservados e conteúdo personalizado não é sobrescrito. Veja [Ambientes separados](docs/Ambientes_Separados.md).

### Simulação, Progress e divergências funcionais

Os KB-0029 a KB-0034 estão em [Guias Progress e funcionais](docs/Guias_Progress_Funcionais.md): simulação reproduzível; telas/programas Progress; resultado incorreto sem mensagem; divergência funcional; registro não gerado/SPED; cálculo divergente. Os roteiros separam execução Desktop/web e regra esperada de falha técnica, sem exigir log para toda diferença funcional.

Após `clasp push`, uma base com os 28 guias anteriores oferecerá **Importar 6 guia(s)**. A importação acrescenta somente os ausentes como **Não publicado**, preservando edições, imagens e remoções. Revise e publique os novos guias para que o Atendimento possa abrir os links dos roteiros. Os roteiros ficam disponíveis sem reexecutar a inicialização. Não há novas imagens nesta atualização.

### Revisão simplificada dos quatro guias novos

Os KB-0025 a KB-0028 possuem revisão **1.1**, com passos curtos e termos explicados em `docs/Guias_Simplificados.md`. Essa terceira fonte substitui suas edições 1.0 no catálogo gerado; o histórico usado na comparação fica em `docs/revisions/KB-0025-a-KB-0028-v1.0.json`. As quatro imagens de exemplo, índice e prompts estão em `docs/assets/guias-novos/`.

Se os textos 1.0 já foram importados, o administrador verá **Simplificar N guia(s)**. A ação exige confirmação, revalida concorrência e atualiza apenas os originais reconhecidos. Imagens e status de publicação são mantidos. Guias removidos, já atualizados ou com mudanças próprias de título, categoria, palavras-chave, revisão ou texto não são sobrescritos; diferenças de espaços e adição de imagens são aceitas. Não há atualização automática ao abrir a página, fazer push ou reimportar. Para textos personalizados, consulte a fonte simplificada e adapte-os no editor.

Depois de atualizar o texto, use **Enviar imagens em lote** para os quatro PNGs identificados por código. As figuras não são enviadas ao Drive pelo clasp.

Depois de sincronizar os arquivos com `clasp push`, recarregue a URL de teste do aplicativo. Entre como administrador em **Base de conhecimento → Importar 28 guias iniciais** para uma base vazia, ou no botão que informa os guias restantes para uma base já preenchida. Também é possível executar `importInitialGuides` no editor com uma conta admin já cadastrada. Não é necessário reexecutar a inicialização nem recolocar `INITIAL_ADMIN_EMAIL`.

A importação adiciona KB-0001 a KB-0028 em cinco categorias, inicialmente **Não publicados** (`draft`). Abra cada guia, clique em **Editar guia**, revise o conteúdo, selecione **Publicado** e salve. Atendimento só consulta publicados; Administração lê e edita os não publicados. Para retirar um guia de circulação, salve novamente como Não publicado.

Os KB-0024 a KB-0028 estão em `docs/Guias_Complementares.md`: aplicação de .war; lentidão/timeout; bloqueios do navegador; correlação de Network e logs; e camadas da aplicação web. Uma base com 24 guias mostrará **Importar 4 guia(s) restante(s)**; com os 23 originais, serão cinco. A ação acrescenta somente os ausentes e preserva edições, publicações, imagens e remoções existentes. O SupportFlow apresenta os roteiros e não executa operações no ambiente do cliente. Os novos guias usam referências oficiais e distinguem evidências de hipóteses; confirmar a arquitetura real antes de encaminhar ou alterar qualquer componente.

Na interface, `draft` aparece como **Não publicado**. Importação e publicação são operações distintas: depois de revisar, use **Publicar N guia(s)** na listagem para liberar de uma vez os não publicados dos resultados atuais, ou **Publicar guia** na leitura. A confirmação apresenta os códigos e títulos envolvidos. Os filtros delimitam a seleção; um guia removido não pode ser publicado. Nenhum guia é publicado automaticamente ao sincronizar código ou enviar imagens.

O botão de importação fica oculto quando todos os códigos iniciais já existem na base, inclusive os removidos. Se faltarem códigos, mostra somente a quantidade restante. Essa verificação usa a base inteira e não muda quando se aplica uma pesquisa ou filtro. O resumo exibe cadastrados, publicados e não publicados.

Pesquise por código, título, categoria, palavras-chave ou conteúdo (por exemplo F12, 500, PROPATH e objeto desatualizado). A pesquisa ignora acentos e exige que todos os termos estejam presentes. Os códigos KB no texto abrem guias relacionados; referências externas abrem outra aba. Um relacionado ainda não publicado permanece inacessível ao Atendimento.

O conteúdo pode ser editado em Markdown, com pré-visualização: títulos, passos numerados, listas, campos em negrito, avisos, links e imagens enviadas pelo editor. HTML arbitrário e imagens externas não são interpretados. Objetivo, quando usar, pré-requisitos, passos, interpretação, evidências, ajuda, atenção, relacionados e referências foram preservados no texto. Palavras-chave, revisão, categoria, título e status possuem campos próprios. Criação de novos guias fora do pacote inicial fica para evolução posterior.

### Remover guias

Para remover vários, marque as caixas ao lado dos artigos e clique em **Remover selecionados**. **Selecionar todos os resultados** marca somente a lista atualmente exibida, respeitando pesquisa e filtros. Uma nova pesquisa limpa a seleção. A confirmação lista códigos e títulos; nenhuma remoção acontece ao apenas marcar as caixas. O limite é 50 por operação, com autorização administrativa, controle de concorrência e auditoria no servidor. O lote é validado antes das gravações, mas uma falha operacional no Sheets ainda pode produzir conclusão parcial; recarregue e confira os removidos antes de repetir.

Na listagem, a ação **Remover selecionados** aparece somente após marcar ao menos um guia; os botões individuais foram retirados. As caixas possuem área de clique ampliada, foco de teclado e destaque no artigo selecionado. Administradores também podem usar **Remover guia** dentro do artigo e confirmar o código/título exibidos. A operação retira o guia da listagem, pesquisa, orientações recentes e contagem de publicados. O conteúdo fica marcado como `deleted` na planilha para manter o registro técnico e impedir que a importação inicial recrie o guia. A remoção não depende da configuração de imagens nem exige nova inicialização.

O registro de auditoria acompanha a solicitação de remoção. Arquivos no Drive, vínculos de imagem e categorias são preservados; novas consultas de imagens de um guia removido são bloqueadas. Links em outros guias não são alterados automaticamente e passam a informar que o destino não está disponível. Uma alteração concorrente exige recarregar e confirmar novamente antes de remover.

### Restaurar guias removidos

Abra **Base de conhecimento → Removidos (N)** como administrador, marque somente os artigos desejados e clique em **Restaurar selecionados**. A recuperação mantém o código, o conteúdo salvo e os vínculos de imagem, sem duplicar registros. Os guias voltam sempre como **Não publicado**, mesmo que estivessem publicados antes da remoção; confira e publique para disponibilizá-los ao Atendimento.

Para os KB-0025 a KB-0028, a opção **Usar a versão simplificada** vem marcada. Ela aplica a revisão 1.1 somente se o conteúdo 1.0 ainda corresponder ao original reconhecido, preservando imagens. Textos personalizados são restaurados como estavam, sem sobrescrita. Desmarque a opção para recuperar exatamente a edição armazenada.

A importação continua ignorando guias removidos de propósito. A restauração é uma operação distinta, autorizada no servidor, com validação de versão, confirmação da seleção e registro de auditoria. Não exige nova inicialização, configuração de Drive nem alteração manual na planilha.

## Imagens nos guias

Após `clasp push`, execute **`setupGuideImages` pelo editor Apps Script** com uma conta administradora já cadastrada e autorize o novo acesso ao Google Drive. Não precisa reexecutar `setupSupportFlow` nem restaurar `INITIAL_ADMIN_EMAIL`. A configuração cria a tabela `GuideImages` se ausente e uma pasta `SupportFlow — Imagens dos guias`, registrando `GUIDE_IMAGES_FOLDER_ID` nas propriedades do script. Reexecução não duplica a pasta. O primeiro upload também prepara o armazenamento se a autorização já estiver concluída.

Em **Base de conhecimento → abrir guia → Editar guia**:

1. Posicione o cursor entre os parágrafos onde deseja inserir a imagem.
2. Em **Adicionar imagem**, escolha um PNG, JPEG ou WebP de até 2 MB e preencha a legenda.
3. Clique em **Enviar e inserir imagem**. O arquivo é gravado no Drive e uma referência é inserida no texto.
4. Use **Pré-visualizar** para conferir; depois clique em **Salvar alterações**. Publicar segue o fluxo normal de revisão.

É possível selecionar várias imagens no editor do mesmo guia. Cada arquivo recebe uma legenda editável, é enviado em sequência e inserido na ordem escolhida. O limite continua sendo 12 imagens referenciadas por guia e 2 MB por arquivo. O envio não salva o artigo nessa modalidade: clique em **Salvar alterações** ao terminar.

Para distribuir as imagens de vários guias de uma vez, descompacte o ZIP e use **Base de conhecimento → Enviar imagens em lote**. Selecione até 50 arquivos; o código no nome, como `KB-0001-console.png`, define o destino. Confira os códigos e as legendas apresentados, depois clique em **Enviar e salvar imagens**. Essa modalidade insere as figuras na seção **Como fazer**, antes dos passos, e salva mantendo o status atual. Imagens já nessa posição mantêm sua ordem, com as novas em seguida. Sem esse título, a inserção ocorre antes do primeiro passo ou das referências; sem essas marcações, ao final do texto. Guias publicados continuam publicados e não publicados continuam não publicados. Arquivos sem um código cadastrado não são enviados. Para escolher uma posição específica entre passos, use o editor individual.

Imagens antigas que ficaram soltas no fim, depois das seções finais de guias com Como fazer, são reorganizadas automaticamente na leitura. O editor abre com essa organização e a persiste ao salvar; não é necessário reenviar as imagens. A organização não executa migração automática na planilha nem modifica imagens inseridas entre os passos.

Os arquivos são processados um de cada vez com progresso por item. Em falha parcial, os concluídos são preservados e **Tentar restantes** repete somente os pendentes da seleção atual. Se o upload já concluiu mas o salvamento falhou, o ID é reutilizado na tentativa seguinte da mesma janela. Fechar/recarregar ou trocar a seleção descarta essa fila local; arquivos ainda não vinculados podem permanecer no Drive. A rotina para de iniciar novos envios quando se navega para outra página, mas uma chamada já iniciada pode concluir. A publicação em lote valida toda a seleção antes de gravar, porém falhas operacionais no Sheets podem causar conclusão parcial; recarregue para conferir o estado antes de tentar novamente.

A janela de envio em lote é única: cliques repetidos não abrem outra nem limpam os arquivos selecionados. Ao concluir todos os envios, ela fecha automaticamente, atualiza a base e exibe uma mensagem de sucesso. Se houver itens com erro, permanece aberta com **Tentar restantes** habilitado. Durante o envio, os controles ficam desabilitados para evitar operações duplicadas.

O exemplo gerado está em `docs/assets/exemplo-console-network.png` e pode ser selecionado nesse envio. Na leitura, clique na imagem para ampliar; feche pelo botão ou pela tecla Escape.

Somente administradores enviam imagens. O aplicativo não cria links públicos: lê o arquivo pelo backend e transmite os bytes ao usuário autorizado. Atendimento precisa ter acesso ao guia publicado e a imagem precisa estar referenciada no texto atual. Imagens de rascunhos permanecem bloqueadas. A pasta e seus arquivos não devem ser compartilhados publicamente nem com atendentes. A implementação usa `DriveApp` e requer o escopo OAuth `https://www.googleapis.com/auth/drive`; os leitores do aplicativo não precisam de acesso direto à pasta na modalidade de execução como responsável pela implantação. Referências: [DriveApp](https://developers.google.com/apps-script/reference/drive/drive-app), [arquivos e blobs](https://developers.google.com/apps-script/reference/drive/file).

Os arquivos são enviados como estão, sem anonimização ou remoção automática de metadados. Revise as capturas antes do envio. O servidor confere limite de bytes, MIME e assinatura do formato; não substitui revisão de conteúdo nem um decodificador completo de imagens. SVG, GIF e imagens por URL externa não são aceitos.

Cada guia aceita até 12 imagens referenciadas e 50 arquivos enviados no total. A referência interna ocupa uma linha própria: `![Legenda](sf-image:identificador)`. Para retirar uma imagem do artigo, remova essa linha e salve. O arquivo permanece no Drive; uploads não salvos ou removidos do texto não são apagados automaticamente. A limpeza de arquivos sem uso é manutenção manual do responsável técnico, conferindo as referências antes de qualquer exclusão. Falhas entre gravação no Drive e registro na planilha podem deixar arquivo sem vínculo; não há transação entre os serviços. A autorização protege novas consultas, sem revogar cópias de imagens já recebidas por usuários autorizados.

Reimportar preserva registros existentes, inclusive edições. Se um código já pertencer a outro artigo, o código é reportado como conflito e não é alterado. Guias editados conservam a origem no metadado privado; não são substituídos mesmo após mudança de título. Gravações concorrentes são rejeitadas quando a data de alteração já mudou. Não há histórico de versões completo: a revisão é um campo editorial e a auditoria registra a operação solicitada.

Fonte adotada: `docs/Guias_Atendimento_Fonte.md`, cópia do Markdown fornecido. O DOCX foi consultado como referência complementar. Instruções editoriais, catálogo e lista global de referências não integram o corpo dos artigos; cada guia conserva suas próprias referências. Orientações gerais ficam em uma seção recolhível na listagem. O conteúdo não foi certificado como política oficial nem suas referências foram revalidadas nesta implementação.

`GuideSeeds.gs` é gerado por `node scripts/build-guides.cjs`, sem dependências, combinando a fonte original com `docs/Guias_Complementares.md`. O documento original de 23 guias é preservado. Alterar uma fonte e regenerar o pacote não atualiza artigos já importados, para proteger edições; atualize-os pela aplicação. Novos códigos aparecem como pendentes de importação. Campos editoriais ficam em JSON versionado dentro de `Articles.content`, sem alterar cabeçalhos ou migrar a planilha existente.

## Arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| Código.js | Entrada web, bootstrap e operações administrativas |
| Auth.gs | Identidade, domínios e perfis |
| DataService.gs | Persistência, inicialização e auditoria |
| Knowledge.gs / GuideSeeds.gs | Consulta, edição, importação e conteúdo inicial dos guias |
| GuideImages.gs | Envio e consulta autorizada de imagens no Drive |
| GuideUpdates.gs | Atualização confirmada das edições originais dos KB-0025 a KB-0028 |
| KnowledgeScripts.html | Lista, leitura e editor dos guias |
| KnowledgeUploads.html | Seleção múltipla e fila de envio de imagens, incluindo distribuição por código KB |
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

O `appsscript.json` local mantém `webapp.executeAs: USER_DEPLOYING` e `webapp.access: DOMAIN`. Assim, `clasp push` preserva a configuração de aplicativo web no código atual. `DOMAIN` refere-se ao domínio Workspace de quem implanta; a aplicação ainda exige os domínios configurados e um cadastro ativo. Após sincronizar, use **Implantar → Testar implantações → engrenagem → Aplicativo da Web** e salve o link `/dev`. Nos próximos pushes, recarregue esse link, sem atualizar a implantação versionada `/exec`. Se a configuração aprovada de identidade mudar pelo editor, atualize também o manifesto local para não substituí-la no próximo push.

No editor, use **Implantar → Testar implantações → Aplicativo da Web** para testes por editores. A URL `/dev` exige acesso de editor; não conceda edição aos atendentes somente para teste. Para contas sem edição, use uma implantação separada de desenvolvimento com audiência corporativa restrita, após definir a configuração de identidade aprovada.

O Apps Script oferece execução como proprietário ou como usuário que acessa. Para planilha privada, a execução como proprietário só é adequada se o domínio Workspace e a implantação disponibilizarem o e-mail do usuário ativo. Teste com duas contas diferentes: cada uma deve visualizar o próprio e-mail. O aplicativo usa exclusivamente `Session.getActiveUser()`, nunca a identidade efetiva do proprietário. E-mail vazio bloqueia o acesso.

Na execução como usuário, avalie as permissões da planilha: escrita administrativa exige acesso direto ao arquivo, o que pode contornar a autorização da aplicação. Esta arquitetura protege a camada da aplicação; editores do script ou planilha são responsáveis técnicos com acesso privilegiado. Não compartilhe a planilha com atendentes em uma implantação como proprietário.

Referências oficiais consultadas:

- [Web apps e identidade de execução](https://developers.google.com/apps-script/guides/web)
- [Session e disponibilidade do e-mail](https://developers.google.com/apps-script/reference/base/session)
- [Quotas do Apps Script](https://developers.google.com/apps-script/guides/services/quotas)

As quotas dependem da conta e podem mudar. Leituras em lote e gravações curtas sob ScriptLock atendem à estrutura inicial. Leituras completas de tabelas devem ser revistas antes de um histórico de grande volume.

## Persistência

Tabelas iniciais: `Users`, `Categories`, `Articles`, `Audit`, `GuideImages`. Em bases existentes, a configuração de imagens adiciona apenas a tabela nova. Estruturas reservadas, sem comportamento implementado: `LogRules`, `DiagnosticFlows`, `DiagnosticHistory`, `AnalysisMetadata`, `Settings`. Artigos e categorias não são preenchidos automaticamente. IDs são UUID (os guias do catálogo usam KB-0001 a KB-0028), datas novas ISO UTC; exibição no fuso São Paulo.

Alterações de usuários usam lock do script e preservam ao menos um admin ativo. Auditoria é gravada antes da alteração como registro da operação solicitada, sem garantia transacional de conclusão. Sheets não oferece transação entre essas duas gravações. Eventos contêm e-mails administrativos: definir acesso e retenção antes de produção. Não existe limpeza automática.

Helpers terminam em `_` e não são expostos via `google.script.run`. A entrada `setupSupportFlow` é pública e exige identidade correspondente a `INITIAL_ADMIN_EMAIL` e domínio permitido, inclusive em chamadas diretas. Remova essa propriedade após configurar. Demais endpoints públicos revalidam permissões em cada chamada; esconder o menu não é a medida de autorização.

Não há integração Gemini nem escopo de requisição externa. O analisador usa regras locais e não grava conteúdo ou metadados das análises. Não armazene logs brutos nem segredos nas tabelas reservadas. Propriedades GEMINI_API_KEY e GEMINI_MODEL configuradas anteriormente não são usadas e podem ser removidas.

## Verificação

Com Node.js 18 ou superior, sem instalar dependências:

```powershell
node --test
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
- Remover guia como admin: conferir confirmação/cancelamento, ausência na base e preservação da remoção após reimportar. Atendimento não deve conseguir remover via chamada direta.
- Autorizar `setupGuideImages`, enviar imagem com legenda, pré-visualizar, salvar e ampliar na leitura.
- Atendimento deve ver imagens dos guias publicados e ser bloqueado após retirada para rascunho; ID de outro guia deve ser rejeitado.
- Verificar imagem removida do Drive, tentativa com arquivo acima de 2 MB e carregamento com falha/repetição.
- Navegar nos módulos restantes e confirmar indicação de recurso planejado.
- Conferir temas claro/escuro, persistência após recarregar, teclado e larguras de 360/768/1440 px.
- Validar menu móvel e tabelas com rolagem horizontal.

Não houve implantação remota nem validação visual em navegador nesta entrega. A ativação depende da configuração corporativa acima.

