// Revisão editorial baseada na separação de ambientes informada pelo usuário.
const ids=new Set([13,14,15,16,17,18,19,22,27,28,29,30,31].map(n=>'KB-'+String(n).padStart(4,'0')));
function revise(guide){
  if(!ids.has(guide.id))return guide;
  let markdown=guide.markdown;
  const replacements=[
    ['PASOE/AppServer','PASOE das aplicações web'],
    ['Não peça automaticamente log PASOE para um programa executado apenas no cliente.','Não use log do servidor web/PASOE para validar a execução no servidor Progress das telas.'],
    ['cliente Desktop','ambiente das telas Progress'],
    ['sessão/cliente','servidor Progress das telas e à sessão pertinente'],
    ['Para Desktop, solicite ao responsável os registros pertinentes à sessão/cliente e à camada envolvida.','Para telas Progress, identifique o servidor Progress que atende essas telas e solicite seus registros e os da sessão pertinente. Esse servidor é separado do PASOE das aplicações web.'],
    ['2. Localize o PROPATH do AppServer e registre os diretórios na ordem exibida.','2. Para web, registre o PROPATH da instância PASOE da aplicação. Para telas Progress, registre o PROPATH da sessão/serviço no servidor Progress dessas telas. Os diretórios e sua ordem pertencem a ambientes separados.'],
    ['1. No Datasul do ambiente afetado, abra Informações do Ambiente (html.environmentInf), pela pesquisa/execução de programa conforme acesso.','1. Identifique primeiro o servidor envolvido. Para web, consulte Informações do Ambiente (html.environmentInf) da aplicação e confirme a instância PASOE. Para telas Progress, confira as informações da sessão/serviço do servidor Progress dessas telas com o responsável. Uma consulta ao ambiente web não valida o servidor das telas Progress.'],
    ['4. Registre PROPATH do AppServer quando a falha envolver objetos ou correções.','4. Quando envolver objetos/correções, registre o PROPATH do ambiente identificado: PASOE para web, ou sessão/serviço do servidor Progress para telas Progress. Não use um para validar o outro.'],
    ['6. Peça à infraestrutura as informações que não aparecem: versão OpenEdge, instância PASOE, servidores e histórico de atualizações.','6. Peça à infraestrutura os dados que faltam do servidor identificado: versão OpenEdge, serviço/instância, caminhos e histórico de atualizações. Registre separadamente servidor web/PASOE e servidor das telas Progress.'],
    ['3. Solicite o log do agente correspondente na pasta de logs da instância.','3. Este procedimento de coleta é do servidor web/PASOE. Solicite o log do agente correspondente na pasta de logs da instância.'],
    ['4. Para objetos Progress, valide a busca em Informações do Ambiente e a precedência do PROPATH (KB-0015).','4. Para objetos da aplicação web, valide a busca e o PROPATH do PASOE. Para objetos das telas Progress, valide busca e PROPATH no servidor Progress dessas telas. Aplicar no servidor de um ambiente não atualiza o outro (KB-0015).'],
    ['5. Se a orientação técnica exigir reciclagem de sessões ou reinicialização AppServer/PASOE, peça à equipe responsável que programe e execute, para evitar uso de código antigo em memória.','5. Se a orientação técnica exigir reciclagem/reinicialização, identifique antes qual serviço do ambiente afetado está envolvido e peça execução à equipe responsável. Reiniciar o PASOE web não atualiza as sessões do servidor Progress das telas.']
  ];
  // Substituições específicas antes das genéricas.
  replacements.sort((a,b)=>b[0].length-a[0].length).forEach(([from,to])=>{markdown=markdown.split(from).join(to);});
  const scope=['### Identifique o ambiente',
    '', '- **Aplicações web:** use o servidor web e a instância PASOE que atendem a URL. Confira nesse ambiente os objetos, PROPATH, pacote e logs pertinentes.',
    '- **Telas Progress:** use o servidor Progress que atende essas telas e a sessão/serviço correspondente. Ele é separado do servidor web/PASOE; seus objetos, PROPATH, pacotes e registros devem ser conferidos separadamente.',
    '- Não presuma que a atualização, a busca de um objeto ou o log de um servidor representa o outro. Se houver comunicação entre os ambientes, identifique a chamada e os dois destinos antes de correlacionar registros.',
    '', guide.id==='KB-0013'||guide.id==='KB-0027'||guide.id==='KB-0028'?'Este guia descreve a investigação web/PASOE. Para telas Progress, consulte KB-0030 e identifique os registros do servidor Progress correspondente.':'Aplique os passos abaixo somente ao ambiente identificado; referências ao PASOE não substituem a conferência do servidor das telas Progress.', ''].join('\n');
  return {...guide,revision:'1.2',markdown:scope+'\n'+markdown};
}
module.exports={revise};
