# Diagnóstico assistido

Módulo local, sem IA, para conduzir uma investigação por resultados observados. Disponível para os usuários autenticados do SupportFlow no menu e no card **Diagnóstico assistido**.

## Uso

1. Informe opcionalmente programa/endpoint, ambiente, ação/passos e os campos separados de resultado esperado e observado. Não registre senhas, tokens ou dados pessoais.
2. Escolha um dos 17 cenários. Além dos 11 iniciais (acesso web, tela, login, requisição, lentidão, atualização, ambiente, objetos, comparação, customização e logs), há entradas para tela/programa Progress, simulação, resultado incorreto sem mensagem, divergência funcional, registro não gerado/SPED e cálculo divergente.
3. Leia o teste sugerido, consulte os guias relacionados e escolha o resultado observado. As verificações principais de ambiente, pacote, PROPATH, objetos, customizações e análise/correlação do log exigem observação de evidência. Sem evidência suficiente, escolha **Não consegui verificar** ou a pendência correspondente; a opção não confirma que o teste foi feito.
4. Avance conforme o resultado. **Voltar** permite revisar a última resposta. Ao mudar uma resposta, o caminho anterior é descartado; é necessário responder novamente os testes seguintes.
5. O final apresenta os próximos passos da investigação. **Gerar resumo do atendimento** gera texto com contexto, testes respondidos, observações e próximos passos. Os testes são separados por linhas em branco, inclusive no texto copiado. **Ver resumo parcial** também está disponível durante a investigação e identifica o teste pendente. Sugestões não são registradas como procedimentos executados.
6. Use **Copiar resumo**. Se o navegador bloquear a área de transferência, o texto é selecionado para cópia manual. **Novo diagnóstico** pede confirmação antes de descartar as respostas.

## Verificações da investigação

Os caminhos de erro no servidor e correção persistente agora passam por Informações do Ambiente, pacote/componentes, PROPATH da instância da aplicação web, busca/comparação de objetos, customizações e coleta/leitura dos logs. A comparação de ambientes também direciona essas verificações. A sequência depende das evidências: uma divergência clara pode direcionar primeiro a correção da coleta/aplicação com o responsável.

A orientação interna de coleta inclui instância/agente, intervalo, horário com fuso, programa/ação e chamada relacionada. **Texto para solicitar ao cliente** oferece uma mensagem curta, com dois pedidos separados por linhas em branco: log da aplicação no intervalo do problema e data/horário com fuso. Programa e ambiente aparecem somente se já informados; uma captura da mensagem é opcional. As conferências de PROPATH, pacote e versões continuam no roteiro interno e não são incluídas automaticamente nessa solicitação. O sistema apenas copia o texto, sem enviar nada ao cliente. Arquivo recebido e arquivo analisado são etapas diferentes. Log errado/incompleto gera solicitação de complementação; log não recebido ou não lido permanece pendente.

Na etapa de análise, **Abrir Analisador de logs** permite consultar a ferramenta e retornar pelo menu sem perder o diagnóstico. Não há transferência automática de arquivos/resultados: o atendimento deve conferir o intervalo e registrar os achados revisados. Erro encontrado exige correlação com o teste. Ausência de erro exige revisão do escopo e leitura manual; ela não produz diagnóstico de sucesso.

O quadro **Verificações da investigação** e o resumo mostram apenas etapas percorridas no caminho atual. A etapa atual sem resposta aparece como **Em andamento**; **Pendente** é reservado a dificuldades ou verificações não realizadas explicitamente registradas. Etapas não visitadas não aparecem e não viram pendências, inclusive ambiente, pacote ou UPC quando o diagnóstico não passou por esses assuntos. Voltar e mudar uma resposta remove também as verificações do caminho descartado. Os textos incentivam observar, interpretar e documentar os resultados, sem direcionar a abertura de solicitações. O sistema não valida os arquivos/ambiente nem certifica que o atendimento está completo.

## Estado e privacidade

As respostas ficam na memória desta aba. Consultar um guia e retornar pelo menu preserva o roteiro em andamento, inclusive a escolha e observação do teste atual. Recarregar/fechar a página ou confirmar **Novo diagnóstico** descarta os dados. Não há gravação no Sheets, Drive, histórico, console, propriedades, localStorage ou sessionStorage. A cópia para a área de transferência só ocorre por ação do usuário.

O módulo não envia contexto, respostas ou observações ao servidor. A consulta aos guias usa a autenticação e permissões normais da base. Guias removidos ou não publicados podem estar indisponíveis. Os roteiros novos usam KB-0029 a KB-0034; importe e revise/publique esses seis guias para que os links estejam disponíveis ao Atendimento. A navegação do roteiro independe dessa importação. Não é necessário criar tabelas ou reexecutar a inicialização.

## Conteúdo e limitações

### Separação dos ambientes

Aplicações web usam o servidor web/PASOE; telas Progress usam outro servidor Progress. O roteiro de telas identifica esse servidor e sua sessão/serviço, sem presumir execução apenas no computador do usuário. PROPATH, objetos, pacotes e logs de um servidor não comprovam a situação do outro. O resumo registra a origem da investigação quando identificada. Consulte docs/Ambientes_Separados.md para aplicar as revisões aos guias já importados.

Os roteiros seguem os assuntos dos guias existentes, com foco em Network/Console, autenticação, endpoints, resposta funcional, logs, Timing, bloqueios do navegador e validação de publicação. As instruções não executam procedimentos no cliente. Há cuidados específicos para não repetir gravações após timeout, não desabilitar a segurança do navegador e não reaplicar WAR/reiniciar serviços por tentativa.

Não há identificação automática de erro nem confirmação de causa raiz no diagnóstico. Os próximos passos dependem das respostas fornecidas pelo atendimento. Os roteiros são definidos em DiagnosticFlows.html (versão 1.2); atualizar um guia na base não modifica automaticamente as decisões do roteiro. DiagnosticScripts.html controla a navegação e o resumo. As tabelas reservadas DiagnosticFlows/DiagnosticHistory não são utilizadas por esta implementação.

## Progress e investigação funcional

Os novos caminhos exigem registro dos pré-requisitos/passos, frequência e tentativas de reprodução. Não conseguir reproduzir mantém as condições faltantes explícitas. O contexto separa esperado de observado e o resumo conserva essas informações, notas e caminhos percorridos.

O tipo de execução é identificado antes da coleta técnica. Desktop segue para registros da sessão/cliente, com solicitação curta específica; web/PASOE pode usar a coleta já existente. Não se presume nome/caminho universal nem alteração de rastreamento. O analisador local auxilia a leitura, mas não reconhece todos os formatos Desktop. Nenhum arquivo é transferido automaticamente ao diagnóstico.

Registro não gerado/SPED: o roteiro pede obrigação, período, leiaute, registro, origem e referência validada; confere seleção/parâmetros e distingue ausência no arquivo de não apresentação pelo validador. Cálculo divergente: pede entradas, unidades, referência da fórmula, memória de cálculo, arredondamento aplicável, primeira diferença e reprodução. Não são fornecidas regras fiscais/fórmulas universais nem se conclui defeito por diferença de valor.

Logs complementam a investigação quando houver falha técnica ou necessidade de detalhar a execução. O caminho funcional pode ser concluído com exemplo rastreável, regra validada e comparação documentada, sem criar uma pendência de log por padrão. Pacote, PROPATH e customizações continuam sendo verificados conforme a evidência, e não como exigência automática de todo cenário funcional.

## Atualizar e verificar

### Relatórios executados no RPW

Há um 18º cenário para relatório RPW, também acessível pela identificação do tipo de execução. Registra relatório/parâmetros, servidor RPW, execução/horário, estado e saída. Relatório ainda não iniciado direciona a conferir destino/programação; saída vazia/divergente direciona a parâmetros/dados e investigação funcional. Logs não são obrigatórios para saída correta ou toda divergência funcional.

Quando há falha ou necessidade de detalhar a execução, a mensagem curta ao cliente pede o log do servidor RPW que processou o relatório e identificador quando disponível. A leitura exige observação de evidência e a verificação de objetos/PROPATH é feita no RPW, sem substituir por dados do servidor web ou das telas Progress. KB-0035 deve ser importado e revisado/publicado para os links estarem disponíveis ao Atendimento. O roteiro é versão 1.4.

O título do resumo, a versão do roteiro e o contexto são separados por linhas em branco, inclusive no texto copiado.

Execute `clasp push` e recarregue `/dev`. Nenhuma API, credencial ou novo escopo é necessário. Os testes locais cobrem destinos dos fluxos, guias, retorno/alteração de caminho, opção sem evidência, validação da seleção, escape de texto, descarte confirmado, preservação da sessão e cópia/fallback. A validação real no iframe Apps Script deve ser feita pelo endereço de teste.
