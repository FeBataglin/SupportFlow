# SupportFlow — Relatórios executados no RPW

# Categoria — Ambiente Datasul

## KB-0035 — Testando relatórios executados no servidor RPW

**Palavras-chave:** RPW, relatório, execução, fila, agendamento, saída, log, servidor, parâmetros

**Objetivo:** Reproduzir e investigar a execução de um relatório no RPW, diferenciando solicitação, processamento e resultado.

**Quando usar:** O relatório é executado no RPW e não inicia, demora, termina com erro, não gera saída ou apresenta conteúdo divergente.

### Como fazer

1. Identifique programa/relatório, ambiente, versão, parâmetros, filtros, período e resultado esperado. Confirme com o responsável qual servidor RPW recebeu e executa a solicitação. Abrir a tela pelo navegador ou Progress não determina o servidor que processa o relatório.
2. Registre o identificador da solicitação/execução, quando disponível, usuário/perfil e data/horário com fuso. Preserve os parâmetros usados e uma simulação numerada, com dados autorizados (KB-0029).
3. Confira o acompanhamento disponível no ambiente e registre o estado observado e eventuais mensagens. Diferencie solicitação não iniciada, processamento em andamento, execução com falha e execução concluída. Os nomes das telas e estados podem variar; não presuma um menu universal.
4. Se ainda não iniciou, confira destino RPW, programação/horário e a situação da solicitação com o responsável. Não envie repetidamente o mesmo processamento nem reinicie o serviço por tentativa.
5. Se está processando, registre há quanto tempo, alcance por outros relatórios e o resultado final, se disponível. Antes de reenviar, confirme se a tentativa anterior terminou ou pode produzir arquivos/efeitos duplicados.
6. Se concluiu, localize a saída dessa execução. Compare identificação/data e o formato/destino esperado. Diferencie ausência de arquivo, dificuldade para obtê-lo e arquivo disponível sem dados ou com conteúdo diferente.
7. Para saída vazia ou divergente, confira filtros, período, empresa/estabelecimento e dados que atendem aos critérios. Compare um exemplo concreto com a regra validada; use KB-0032 ou KB-0034 quando pertinente. Não exija um log de erro apenas porque o resultado funcional diverge.
8. Em falha de execução, demora sem esclarecimento ou necessidade de detalhamento, solicite ao responsável o log no servidor RPW que executou o relatório. Informe programa, execução, horário com fuso e intervalo de alguns minutos antes/depois. Se houver mais de um servidor RPW, confirme qual processou a solicitação. Log do PASOE/web ou do servidor das telas Progress não substitui esse registro.
9. Leia o intervalo e correlacione execução, programa, mensagem/código e contexto. O analisador local ajuda, mas pode não reconhecer todos os formatos; ausência de ocorrências automáticas não substitui a leitura. Não presuma um nome ou caminho universal de log nem altere o nível de coleta por conta própria.
10. Se a mensagem indicar objeto ausente/antigo, valide pacote, localização, versão e PROPATH da sessão/serviço RPW com o responsável. Aplicar um objeto no servidor web ou no servidor das telas Progress não comprova atualização no RPW.
11. Reteste somente de forma autorizada, com os mesmos parâmetros e confirmação do resultado anterior. Registre passos, estado da execução, arquivo/trecho permitido, esperado/observado e o que permanece em aberto.

**O que registrar:** Relatório/versão, servidor RPW, identificação da execução quando disponível, parâmetros, horário/fuso, estado/mensagens, saída analisada e evidências revisadas. Log apenas quando pertinente, sempre do servidor RPW correspondente.

**Atenção:** Não altere fila/agendamento, PROPATH, objetos ou serviços por tentativa. Não reenfileire operações sem avaliar o resultado anterior. Caminhos e nomes de logs devem ser confirmados no ambiente do cliente. Não envie relatório completo com dados sensíveis quando um trecho autorizado for suficiente.

**Guias relacionados:** KB-0029, KB-0032, KB-0034, KB-0014, KB-0018, KB-0022
