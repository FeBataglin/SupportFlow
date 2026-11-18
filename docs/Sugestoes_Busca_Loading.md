# Busca, carregamento e sugestões

## Base de conhecimento

A busca ignora diferenças de acentuação/caixa e pontuação, reconhece códigos como `KB-0013`, `KB 0013`, `KB13` ou `0013` e trata termos comuns no singular/plural. Palavras de ligação não impedem a consulta. Todos os termos relevantes continuam sendo exigidos; não há busca semântica por IA nem correção universal de digitação.

Por padrão, a busca considera somente código, título e palavras-chave, evitando guias que apenas mencionam o assunto no corpo. **Buscar em → Conteúdo completo** amplia explicitamente a consulta para categoria e texto. Os resultados priorizam título e palavras-chave. A pesquisa por código isolado retorna o guia desse código, em vez de guias que apenas o citam. Categoria, status, permissões de publicação e remoções continuam sendo respeitados. Filtros são preservados na memória da aba ao consultar um guia e voltar; **Limpar filtros** reinicia a busca no modo padrão. Requisições antigas não substituem resultados de uma busca mais recente.

## Carregamento

As chamadas ao servidor mostram um indicador animado com a ação em andamento. Operações concorrentes mantêm o indicador até terminar; quando há um modal aberto, o indicador aparece no modal. Falhas também encerram o loading. Leituras de arquivos locais no analisador continuam com seu progresso e cancelamento próprios.

## Sugestões e dificuldades

Nova página no menu e no dashboard. Tipos: melhoria no sistema, necessidade de guia, necessidade de roteiro de diagnóstico e dificuldade no atendimento. O formulário pede título e descrição; programa/assunto e o que ajudaria são opcionais. Não incluir logs, credenciais ou dados de clientes.

Diferentemente dos logs/diagnósticos temporários, sugestões são salvas na aba **Suggestions** da planilha do SupportFlow. Ela é criada automaticamente ao acessar a página/enviar, sem reexecutar a inicialização. Inclui autor, conteúdo enviado, datas, situação e retorno. Cabeçalhos existentes incompatíveis geram erro sem sobrescrita. Textos são protegidos contra fórmulas e escapados na interface.

O Atendimento vê apenas suas sugestões e o retorno. A Administração vê todas e pode registrar situação (Recebida, Em análise, Planejada, Concluída, Encerrada) e retorno ao autor. A autorização é aplicada no servidor. Atualização concorrente é rejeitada para evitar sobrescrever outro andamento. A lista apresenta as 200 sugestões mais recentes visíveis ao usuário e informa o total. Não há notificações, envio a outras ferramentas ou criação automática de guia/diagnóstico.

O envio usa identificador de requisição para não duplicar a mesma submissão ao repetir após falha de comunicação. O formulário só é limpo após confirmação do servidor. Em caso de falha, é preservado para nova tentativa.

Atualize com `clasp push`, recarregue `/dev` e abra **Sugestões e dificuldades**. Nenhum escopo ou configuração de API foi acrescentado.
