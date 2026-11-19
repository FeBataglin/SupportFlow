function guideTextWithoutImages_(text) {
  return String(text).replace(/^\s*!\[[^\]\r\n]{0,200}\]\(sf-image:[A-Za-z0-9_-]{1,80}\)\s*$/gm,'').replace(/\s+/g,' ').trim();
}

function simpleGuideCandidate_(article) {
  var current=guideData_(article);
  var old=previousGuideEditions_().concat(previousArchitectureEditions_()).filter(function (a) {return a.id===article.id && a.revision===current.revision;})[0];
  var next=initialGuides_().filter(function (a) {return a.id===article.id;})[0];
  if(!old || !next || article.status==='deleted') return null;
  if(current.revision!==old.revision || current.sourceCode!==old.id) return null;
  if(['title','category','keywords'].some(function (key) {return current[key]!==old[key];}) ||
    guideTextWithoutImages_(current.markdown)!==guideTextWithoutImages_(old.markdown)) return null;
  var images=current.markdown.match(/^\s*!\[[^\]\r\n]{0,200}\]\(sf-image:[A-Za-z0-9_-]{1,80}\)\s*$/gm) || [];
  var markdown=next.markdown;
  if(images.length) markdown=markdown.replace('### Como fazer','### Como fazer\n\n'+images.map(function (line) {return line.trim();}).join('\n\n'));
  return {format:'supportflow-guide-v1',sourceCode:current.sourceCode,keywords:next.keywords,revision:next.revision,markdown:markdown};
}

function availableSimpleGuideUpdates_(articles) {
  return articles.filter(function (a) {return simpleGuideCandidate_(a);})
    .map(function (a) {return {id:a.id,title:a.title,updatedAt:a.updatedAt};});
}

function simplifyGuides(input) {
  requireUser_('admin');
  if(!input || input.confirm!==true || !Array.isArray(input.guides) || !input.guides.length || input.guides.length>50) {
    throw new Error('Confirme os guias que deseja simplificar.');
  }
  var lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    var user=requireUser_('admin'),articles=rows_('Articles',true),ids=[];
    var changes=input.guides.map(function (item) {
      if(!item || ids.indexOf(item.id)>=0) throw new Error('Seleção inválida.');
      ids.push(item.id);
      var article=articles.filter(function (a) {return a.id===item.id;})[0];
      if(!article || article.updatedAt!==item.updatedAt) throw new Error('Guia alterado. Recarregue a base antes de atualizar.');
      var candidate=simpleGuideCandidate_(article);
      if(!candidate) throw new Error('O guia '+item.id+' foi editado ou já atualizado. Seu conteúdo foi preservado.');
      validateGuideImages_(article.id,candidate.markdown);
      var content=JSON.stringify(candidate);
      if(content.length>45000) throw new Error('Texto atualizado excede o limite do guia.');
      return {article:article,content:content};
    });
    audit_(user.email,'GUIDES_SIMPLIFY_REQUEST',ids.join(', '));
    changes.forEach(function (change) {
      change.article.content=change.content;
      change.article.updatedAt=new Date(Math.max(Date.now(),new Date(change.article.updatedAt).getTime()+1 || 0)).toISOString();
      writeRow_('Articles',change.article,rowNumberForId_('Articles',change.article.id));
    });
    return {updated:changes.length};
  } finally {lock.releaseLock();}
}
