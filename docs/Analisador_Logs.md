# Analisador de logs local

Abra **Analisador de logs**, selecione um arquivo TXT/LOG de até 100 MB em UTF-8 ou cole até 2 MB de texto e clique em **Analisar log**. Programa ou endpoint é opcional e destaca menções sem excluir erros de outras linhas.

Arquivos maiores que 2 MB ficam selecionados sem preencher a caixa de texto. Ao analisar, o arquivo é lido em blocos de 256 KB, com progresso percentual e pausas para manter a interface responsiva. **Limpar** cancela a leitura e descarta os resultados. O arquivo inteiro é percorrido. UTF-8 e linhas CRLF são preservados entre blocos. Uma linha individual maior que 1 MB interrompe a análise com mensagem explícita; arquivos inválidos ou acima do limite também são sinalizados. O navegador precisa continuar aberto durante o processamento.

O módulo reconhece padrões de timeout, autenticação/acesso, recurso ausente, conexão, erros/exceções, respostas HTTP de erro e avisos. São indícios baseados no texto; uma classificação pode ser falso positivo e a ausência de ocorrências não garante que não haja problema.

A leitura UTF-8 é tolerante: sequências de bytes inválidas são representadas por `�`, sem interromper o restante da análise. Quando esse caractere aparece no texto, o resultado avisa para conferir o original, pois uma mensagem pode ter sido alterada na leitura. Não há conversão nem alteração do arquivo original. Falhas ao ler blocos são reportadas separadamente, sem presumir que a codificação esteja incorreta.

O cabeçalho PASOE no formato observado (data, processo, thread, nível, agente, localização e categoria) é separado da mensagem. Leituras de propriedades (`Properties`, `Lendo: chave = valor`) e chamadas normais `Run`/`Return from`/`Invoke` em `4GLTRACE` não geram ocorrências. Nomes como `totvs.timeout.exception` ou `fn-has-row-errors` não bastam para inferir falha. São exigidas mensagens de falha, severidade explícita, exceções apresentadas como erro ou respostas HTTP. Outros formatos usam reconhecimento textual mais conservador; isso não é um parser universal de todos os logs Progress.

Mensagens iguais são agrupadas pela categoria e conteúdo, sem o cabeçalho variável de data, sessão e thread. IDs e códigos dentro da mensagem são preservados. Cada grupo informa quantidade e até três exemplos com três linhas anteriores e quatro posteriores, com numeração original. A mensagem e as linhas de contexto muito longas são abreviadas na tela; o texto de entrada permanece completo para arquivos pequenos ou texto colado. Há filtro por erro/aviso, pesquisa e carregamento de mais grupos em lotes de 100. Para limitar o consumo de memória, são detalhados até 2.000 grupos; ocorrências adicionais sem detalhamento são contadas e sinalizadas.

As sugestões e links de guias vêm de regras locais. O acesso ao guia segue as permissões normais da base, portanto guias removidos ou não publicados podem estar indisponíveis. O analisador não executa procedimentos no ambiente do cliente.

Não há chamadas de rede no módulo de logs: leitura, classificação e resultados ficam na memória da página. Não gravamos conteúdo, nomes de arquivo, metadados ou resultados no Sheets, Drive, console, propriedades ou armazenamento do navegador. **Limpar**, sair do módulo ou recarregar descarta a análise. A autenticação geral e a consulta a guias continuam usando o servidor, sem receber conteúdo dos logs.

A integração Gemini foi retirada, assim como o escopo `script.external_request`. Não é necessário configurar API, chave ou projeto Google Cloud. Se foram criadas propriedades `GEMINI_API_KEY` e `GEMINI_MODEL`, podem ser removidas manualmente; não são utilizadas. Diagnóstico assistido, assistente Gemini e histórico não aparecem mais no menu ou nos cards. As tabelas reservadas antigas são preservadas para não alterar a planilha existente.

Atualização: `clasp push` e recarregue o endereço de teste `/dev`. Não é necessário executar novamente a inicialização da base.
