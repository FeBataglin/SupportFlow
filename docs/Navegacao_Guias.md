# Consulta de guias e revisão sequencial

## Durante um diagnóstico

Ao abrir um guia a partir do diagnóstico, o leitor mostra **Voltar ao diagnóstico** no topo e no fim. O retorno continua disponível se consultar outro guia relacionado. O diagnóstico mantém respostas e a observação/resultado em preenchimento na memória da aba. Se o guia estiver indisponível (removido ou não publicado), a mensagem de erro também oferece retorno direto.

Entrar na base por outro módulo encerra esse contexto de retorno. Recarregar a página descarta o diagnóstico, conforme o funcionamento já existente; a navegação não cria histórico nem armazenamento persistente.

## Revisar antes de publicar

Na base, aplique os filtros desejados (por exemplo, status **Não publicado**) e clique em **Revisar resultados (N)**. O leitor passa a percorrer essa seleção na ordem apresentada, com posição atual, **Anterior**, **Próximo** e **Encerrar revisão**. Filtros da lista continuam preservados na memória da aba.

Cada guia é carregado novamente ao abrir, respeitando as permissões e a versão atual do servidor. A sequência é uma lista temporária de IDs/títulos da seleção inicial; publicar um guia não o remove dessa lista, permitindo voltar e consultar o que acabou de publicar.

Em um guia não publicado que tenha próximo item, **Publicar e ir ao próximo** abre a confirmação existente para apenas o guia atual. Somente depois de confirmar e concluir a publicação, a navegação avança. Cancelar ou falhar mantém o guia atual. **Próximo** sozinho nunca publica nada. Não há publicação automática dos demais itens.

O leitor mantém a barra de ações visível em telas maiores e inicia no topo ao mudar de guia. **Encerrar revisão** volta à lista filtrada. Editar/salvar um guia preserva a sequência de revisão. A prévia de Atendimento não mostra esses controles administrativos.

Atualize com `clasp push` e recarregue `/dev`. Nenhuma configuração ou migração de dados é necessária.
