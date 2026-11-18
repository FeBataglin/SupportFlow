# Prévia de Atendimento

Administradores têm o botão **Ver como Atendimento** no cabeçalho. Ele troca a visão da aba, ocultando Administração e ações de edição/importação/publicação/remoção dos guias. A base passa a mostrar somente guias publicados, inclusive na leitura direta e imagens. Sugestões mostram apenas as do próprio autor e sem controles administrativos.

O aviso no topo identifica a prévia. **Voltar à Administração** restaura a visão normal; recarregar a página também volta à visão administrativa. A alternância não modifica o cadastro ou permissões reais e não simula a identidade de outra pessoa. Se enviar uma sugestão na prévia, ela será salva com sua própria conta, como informa o aviso.

Os filtros de leitura da prévia são aplicados no servidor, após autenticação. O sinalizador nunca concede perfil administrativo a um usuário. As permissões reais continuam validadas em cada operação; a prévia não revoga o acesso administrativo da conta nem substitui o teste de permissões com uma conta de Atendimento real.

Nenhum ajuste de planilha ou inicialização é necessário. Atualize com `clasp push`, recarregue `/dev` e use o botão no cabeçalho.
