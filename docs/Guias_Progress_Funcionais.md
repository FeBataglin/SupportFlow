# SupportFlow — Simulação e investigação funcional

Roteiros gerais de atendimento. Regras fiscais e cálculos específicos devem ser confirmados em materiais validados para o produto, versão e cenário; estes guias não definem legislação ou fórmulas universais.

# Categoria — Processos de atendimento

## KB-0029 — Montando uma simulação reproduzível

**Palavras-chave:** simulação, reprodução, passos, pré-requisitos, dados de teste, Progress, frequência

**Objetivo:** Permitir que outra pessoa repita o mesmo cenário e compare o resultado.

**Quando usar:** O relato está incompleto, ocorre de forma intermitente ou depende de parâmetros e documentos específicos.

### Como fazer

1. Identifique programa, ambiente, versão e execução: Progress Desktop, aplicação web ou processamento no servidor. Registre usuário/perfil sem credenciais.
2. Descreva a ação, o resultado esperado e o observado separadamente. Exemplo fictício: executar uma consulta para um documento autorizado; esperado: listar o item; observado: lista vazia.
3. Relacione os pré-requisitos: cadastros, situação do documento, permissões, período e parâmetros. Use identificadores mínimos, revisados e permitidos para o atendimento.
4. Numere os passos desde a abertura do programa até a falha. Para cada passo, indique tela/aba, opção, filtros e momento de confirmar. Não escreva apenas “executar o programa”.
5. Registre a frequência: sempre, apenas para certos dados, apenas para um usuário ou intermitente. Compare variando um fator por vez.
6. Em ambiente autorizado, repita com os mesmos dados seguros e registre horário com fuso, resultado e mensagem/código, quando houver. Antes de repetir uma gravação ou cálculo definitivo, confira o resultado anterior e o impacto.
7. Se outra pessoa não conseguir reproduzir, compare os pré-requisitos e diferenças dos dois testes. Não altere dados reais para fabricar uma simulação.
8. Registre tentativas sem reprodução como resultado inconclusivo e indique o que falta obter.

**O que registrar:** Programa/versão, ambiente, tipo de execução, pré-requisitos, parâmetros, passos numerados, frequência, esperado, observado e evidências revisadas.

**Atenção:** Não repita gravações ou processamentos definitivos sem conferir o resultado anterior e o impacto. Use somente dados e ambiente autorizados.

**Guias relacionados:** KB-0016, KB-0017, KB-0021, KB-0030, KB-0031

## KB-0032 — Investigando divergências funcionais

**Palavras-chave:** divergência funcional, regra, esperado, observado, evidência, documentação, fiscal

**Objetivo:** Distinguir comportamento esperado, configuração, dados e possível inconsistência funcional.

### Como fazer

1. Escolha um exemplo concreto: documento, item, lançamento ou operação. Identifique o programa e a versão sem coletar dados além dos necessários.
2. Escreva o resultado observado e o resultado esperado com a origem dessa expectativa: documentação validada, orientação do produto ou regra aplicável ao cenário.
3. Confirme se a referência corresponde ao período, versão, operação e parâmetros utilizados. Se houver dúvida sobre a regra, registre a dúvida e valide-a com a área responsável antes de afirmar erro.
4. Identifique as entradas e transformações até o resultado: cadastro, movimento, integração, processamento e apresentação/arquivo. Verifique onde surge a primeira diferença.
5. Monte uma reprodução conforme KB-0029. Compare com um caso equivalente que funciona, alterando um fator por vez e respeitando o ambiente autorizado.
6. Confira parâmetros, situação dos dados, pacote/versão e customizações conforme a evidência; não presuma que todo resultado divergente exige atualizar objetos ou coletar log.
7. Se houve mensagem/falha de execução, investigue o registro correspondente. Sem falha técnica, o exemplo e a regra podem ser mais úteis que um log sem contexto.
8. Registre o que foi confirmado, hipóteses e próximos testes separadamente. Resultado esperado sem referência ainda é uma expectativa a validar.

**O que registrar:** Exemplo rastreável, entradas, parâmetros, referência utilizada, comparação esperado/observado, reprodução e ponto da divergência.

**Atenção:** Este guia organiza a análise; não determina regras fiscais, fórmulas ou enquadramentos legais.

**Guias relacionados:** KB-0029, KB-0031, KB-0033, KB-0034

# Categoria — Ambiente Datasul

## KB-0030 — Investigando erros em telas e programas Progress

**Palavras-chave:** Progress Desktop, ABL, tela, erro, mensagem, execução, simulação, log

**Objetivo:** Investigar uma falha de programa respeitando o contexto real de execução.

### Como fazer

1. Registre programa, versão, ambiente, usuário/perfil e ponto da ação que falha. Confirme se a execução ocorre no cliente Desktop, no servidor ou em aplicação web.
2. Capture a mensagem inteira, código entre parênteses quando houver e sequência de mensagens. Nome do programa e código isolado não substituem o texto completo.
3. Monte a simulação conforme KB-0029. Identifique se a falha acompanha dados específicos, usuário ou ambiente, usando comparações autorizadas.
4. Se a mensagem indicar objeto ausente/antigo, confira busca, PROPATH e objetos na sessão/serviço que realmente executa o programa. Para a aplicação web, use a instância correspondente; uma sessão local não comprova a configuração do servidor.
5. Verifique pacote, compatibilidade e customizações apenas quando relacionados ao cenário. Não substitua objetos, altere PROPATH ou desabilite UPCs por tentativa.
6. Para aplicação web/PASOE, siga KB-0013 e KB-0027. Para Desktop, solicite ao responsável os registros pertinentes à sessão/cliente e à camada envolvida. Não peça automaticamente log PASOE para um programa executado apenas no cliente.
7. Se não houver registro suficiente, peça orientação de coleta ao responsável conforme a versão e o ambiente. Não invente nome/caminho de log universal nem ative rastreamento em produção por conta própria.
8. Leia o registro no intervalo do teste, relacione mensagem, programa e sessão e registre linhas com contexto. Ausência de erro no log não descarta problema. O analisador local é um auxílio e não reconhece todos os formatos Desktop.

**O que registrar:** Simulação, mensagem/código, execução, horário/fuso, alcance, verificações aplicáveis e análise dos registros disponíveis.

**Atenção:** Identifique a camada antes de coletar logs. Não altere parâmetros de rastreamento, PROPATH ou serviços por tentativa.

**Guias relacionados:** KB-0014, KB-0015, KB-0018, KB-0019, KB-0029

# Categoria — Processos de atendimento

## KB-0031 — Investigando resultado incorreto sem mensagem

**Palavras-chave:** sem mensagem, resultado incorreto, não grava, tela, resposta, dados, consulta

**Objetivo:** Localizar se a diferença está na apresentação, no processamento ou nos dados usados.

### Como fazer

1. Escolha um exemplo concreto e monte os passos conforme KB-0029. Descreva a diferença sem assumir falha de gravação apenas pela tela.
2. Confira filtros, período, empresa/estabelecimento, situação do documento e parâmetros relevantes ao programa. Registre os valores que influenciam o resultado.
3. Quando disponível e autorizado, consulte o resultado pelo programa oficial adequado após a operação. Não consulte nem altere banco de dados por conta própria para “corrigir” o teste.
4. Na aplicação web, compare Payload/Response e apresentação conforme KB-0009. HTTP 2xx não comprova sucesso funcional. No Desktop, registre telas, parâmetros e resultado no programa correspondente; Network do navegador pode não se aplicar.
5. Se o dado existe corretamente, mas não aparece como esperado, investigue consulta, filtros e apresentação. Se o resultado processado difere, siga KB-0032 para conferir a regra e as entradas.
6. Verifique a frequência e compare um caso equivalente que funciona, mudando um fator por vez.
7. Se houver falha técnica ou execução interrompida, leia o registro pertinente ao cliente/servidor. Se não houver, documente o resultado funcional mesmo sem log de erro.

**O que registrar:** Passos, filtros, parâmetros, esperado/observado, confirmação do resultado e comparação entre processamento e apresentação.

**Atenção:** Não considere uma gravação malsucedida apenas porque a tela não atualizou. Confira o resultado antes de repetir a operação.

**Guias relacionados:** KB-0009, KB-0029, KB-0030, KB-0032

# Categoria — Processos de atendimento

## KB-0033 — Investigando registro não gerado em arquivo SPED

**Palavras-chave:** SPED, registro ausente, arquivo, obrigação, geração, leiaute, validador, documento

**Objetivo:** Rastrear um registro esperado a partir de um documento/operação e conferir a geração sem presumir defeito.

### Como fazer

1. Identifique obrigação, período, versão do leiaute, programa/versão de geração e código do registro esperado. Não aplique critérios de uma obrigação a outra.
2. Escolha o documento/operação que deveria originar o registro e descreva a referência validada que sustenta a expectativa. Sem regra confirmada, registre a dúvida funcional.
3. Confira origem, situação, datas, empresa/estabelecimento e condições de seleção relevantes ao programa. Não presuma que a existência do documento basta para gerar o registro.
4. Registre parâmetros de geração e mensagens/relatório do processamento. Confira se o arquivo analisado é o da execução correta e se foi gerado completamente.
5. Em cópia autorizada e revisada do arquivo, pesquise o código do registro e os dados pertinentes. Diferencie ausência no arquivo de exibição/validação no validador. Não edite o arquivo original para forçar a presença do registro.
6. Se o registro está no arquivo, investigue leitura/importação/validação com a mensagem correspondente. Se está ausente, rastreie o documento da origem à seleção/processamento e compare com um caso equivalente que gerou.
7. Faça reprodução autorizada com os mesmos parâmetros e registre o primeiro ponto em que o resultado diverge da regra validada. Logs são complementares quando houver falha de execução; não são pré-requisito universal para a análise funcional.
8. Preserve o exemplo mínimo, trecho permitido do arquivo e referência utilizada. Não envie o arquivo fiscal completo quando um trecho autorizado for suficiente.

**O que registrar:** Obrigação, período, leiaute, registro, programa, documento/operação, regra esperada, parâmetros, execução, comparação e trecho autorizado.

**Atenção:** Não há neste guia interpretação fiscal ou determinação de obrigatoriedade de registros. Consulte material oficial/interno validado para a obrigação e o período.

**Guias relacionados:** KB-0029, KB-0032, KB-0034

## KB-0034 — Investigando cálculo divergente

**Palavras-chave:** cálculo, valor incorreto, base, alíquota, arredondamento, memória de cálculo, diferença

**Objetivo:** Comparar a memória de cálculo esperada com o resultado do sistema, identificando a primeira diferença.

### Como fazer

1. Identifique programa/versão, documento/operação, item/campo e momento do cálculo. Diferencie valor apenas exibido, processado e efetivamente gravado.
2. Registre valor calculado, valor esperado e diferença. Informe moeda, unidade, sinal e casas decimais relevantes.
3. Documente a origem da fórmula/regra esperada e confirme que se aplica ao cenário, período e versão. Não use uma fórmula genérica presumida.
4. Monte a memória de cálculo com as entradas relevantes: quantidade, valor, base, alíquota, descontos/acréscimos, parâmetros e sequência de operações, conforme a regra validada. Alguns itens podem não se aplicar.
5. Compare arredondamento, precisão e ordem de cálculo apenas segundo a referência do produto/cenário. Não presuma que diferença de centavos seja necessariamente defeito.
6. Compare cada etapa da memória com o resultado disponível, procurando a primeira divergência. Use os programas oficiais disponíveis; não altere dados diretamente no banco.
7. Reproduza em ambiente autorizado e compare um exemplo equivalente. Se o processo grava/recalcula dados, valide impacto e resultado anterior antes de repetir.
8. Verifique configurações/customizações quando relacionadas à diferença. Se houver falha de execução, consulte o registro pertinente; sem falha técnica, a memória de cálculo continua sendo a evidência principal.

**O que registrar:** Entradas e unidades, regra/referência, memória de cálculo, esperado, observado, diferença e passos reproduzíveis.

**Atenção:** O guia não define fórmulas fiscais ou contábeis. A referência precisa ser validada para a operação analisada.

**Guias relacionados:** KB-0029, KB-0031, KB-0032, KB-0033
