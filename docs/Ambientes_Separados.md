# Servidor web/PASOE e servidor das telas Progress

Separação informada pelo usuário para os ambientes atendidos pelo SupportFlow:

| Investigação | Ambiente a conferir |
| --- | --- |
| Aplicação web | Servidor web/PASOE que atende a URL, sua instância, objetos, PROPATH e logs |
| Telas Progress | Servidor Progress que atende essas telas, sua sessão/serviço, objetos, PROPATH e registros |

Os servidores são separados. Uma busca de objeto, aplicação de pacote, atualização ou arquivo de log de um não valida o outro. Se houver comunicação entre eles, o atendimento precisa identificar a chamada, os destinos e a correlação dos registros.

“Desktop” deixou de ser utilizado como sinônimo de execução exclusivamente no computador do usuário. Os roteiros identificam o servidor Progress das telas e, quando pertinente, também a sessão do usuário. Nenhum host, caminho, ferramenta de coleta ou nome de log é presumido como universal.

## Revisões dos guias

Os KB-0013 a KB-0019, KB-0022, KB-0027 a KB-0031 recebem a revisão 1.2 com identificação explícita do ambiente. Os guias de logs/camadas web continuam com escopo web; o KB-0030 orienta a investigação das telas Progress no servidor separado.

As fontes anteriores são preservadas para comparação. `scripts/guide-architecture.cjs` aplica a revisão editorial ao gerar GuideSeeds.gs. As edições reconhecidas estão em `docs/revisions/Guias-Ambientes-Separados-anteriores.json`; as versões antigas dos quatro guias simplificados continuam no histórico anterior.

Após `clasp push`, abra a base como administrador e use **Revisar N guia(s)** para conferir e confirmar a lista. A ação atualiza somente conteúdo original reconhecido, preservando imagens e status. Não reimporta, republica ou restaura guias removidos. Conteúdo personalizado não é sobrescrito; nesse caso, revise manualmente a identificação do servidor no editor. A reimportação normal não atualiza o texto dos guias já existentes.

Os diagnósticos passam para versão 1.3 e são atualizados pelo push/recarregamento. O resumo identifica o servidor quando o caminho ou a resposta permitem; caso contrário, informa que é necessário confirmá-lo.
