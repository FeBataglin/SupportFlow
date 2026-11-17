/** Mantém o schema existente: metadados editoriais são versionados em Articles.content. */
function guideData_(article) {
  var data;
  try { data = JSON.parse(article.content); } catch (_) {}
  if (!data || data.format !== 'supportflow-guide-v1') {
    data = { markdown: String(article.content || ''), keywords: '', revision: '', sourceCode: '' };
  }
  return { id: article.id, title: article.title, category: article.category, status: article.status,
    markdown: String(data.markdown || ''), keywords: String(data.keywords || ''), revision: String(data.revision || ''),
    sourceCode: String(data.sourceCode || ''), createdAt: article.createdAt, updatedAt: article.updatedAt };
}

function searchText_(text) {
  return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function listGuides(options) {
  var user = requireUser_();
  options = options || {};
  var terms = searchText_(String(options.query || '').slice(0, 300)).split(/\s+/).filter(Boolean);
  var stored = rows_('Articles');
  var articles = stored.filter(function (a) { return a.status !== 'deleted' && (user.role === 'admin' || a.status === 'published'); }).map(guideData_);
  var summary = { total: articles.length, drafts: articles.filter(function (a) { return a.status === 'draft'; }).length,
    published: articles.filter(function (a) { return a.status === 'published'; }).length };
  var initialImport = null;
  if (user.role === 'admin') {
    var seeds = initialGuides_();
    initialImport = { total: seeds.length, missing: seeds.filter(function (seed) {
      return !stored.some(function (a) { return a.id === seed.id; });
    }).length };
  }
  var categories = articles.map(function (a) { return a.category; }).filter(function (c, i, all) { return c && all.indexOf(c) === i; }).sort();
  articles = articles.filter(function (a) {
    if (options.category && a.category !== options.category) return false;
    if (options.status && a.status !== options.status) return false;
    var haystack = searchText_([a.id, a.title, a.category, a.keywords, a.markdown].join(' '));
    return terms.every(function (term) { return haystack.indexOf(term) >= 0; });
  });
  return { categories: categories, guidelines: guideGuidelines_(), summary: summary, initialImport: initialImport,
    simpleUpdates: user.role === 'admin' ? availableSimpleGuideUpdates_(stored) : [],
    removedGuides: user.role === 'admin' ? stored.filter(function (a) {return a.status === 'deleted';})
      .map(function (a) {return {id:a.id,title:a.title,category:a.category,updatedAt:a.updatedAt};}) : [],
    articles: articles.sort(function (a,b) { return a.id.localeCompare(b.id); }).map(function (a) {
    return { id: a.id, title: a.title, category: a.category, keywords: a.keywords, status: a.status, updatedAt: a.updatedAt };
  }) };
}

/** Publica somente os rascunhos explicitamente confirmados na interface. */
function publishGuides(input) {
  requireUser_('admin');
  if (!input || input.confirm !== true || !Array.isArray(input.guides) || !input.guides.length || input.guides.length > 50) {
    throw new Error('Confirme entre 1 e 50 guias para publicar.');
  }
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var user = requireUser_('admin'), stored = rows_('Articles'), ids = [];
    var selected = input.guides.map(function (item) {
      if (!item || typeof item.id !== 'string' || ids.indexOf(item.id) >= 0) throw new Error('Seleção de guias inválida.');
      ids.push(item.id);
      var article = stored.filter(function (a) { return a.id === item.id; })[0];
      if (!article || article.status !== 'draft') throw new Error('O guia ' + item.id + ' não está mais disponível como rascunho. Recarregue a base.');
      if (article.updatedAt !== item.updatedAt) throw new Error('O guia ' + item.id + ' foi alterado. Recarregue antes de publicar.');
      var guide = guideData_(article);
      if (!guide.title.trim() || !guide.category.trim() || !guide.markdown.trim()) throw new Error('Guia incompleto: ' + item.id);
      validateGuideImages_(article.id, guide.markdown);
      return article;
    });
    // Valida toda a seleção antes da primeira gravação; Sheets não é transacional.
    audit_(user.email, 'GUIDES_PUBLISH_REQUEST', ids.join(', '));
    selected.forEach(function (article) {
      article.status = 'published';
      article.updatedAt = new Date(Math.max(Date.now(), new Date(article.updatedAt).getTime() + 1 || 0)).toISOString();
      writeRow_('Articles', article, rowNumberForId_('Articles', article.id));
    });
    return { published: selected.length };
  } finally { lock.releaseLock(); }
}

function getGuide(id) {
  var user = requireUser_();
  var article = rows_('Articles').filter(function (a) { return a.id === id && a.status !== 'deleted' && (user.role === 'admin' || a.status === 'published'); })[0];
  if (!article) throw new Error('Guia não encontrado ou ainda não publicado.');
  return guideData_(article);
}

function saveGuide(input) {
  requireUser_('admin');
  input = input || {};
  ['id','title','category','markdown','revision','keywords'].forEach(function (key) {
    if (typeof input[key] !== 'string') throw new Error('Campo inválido: ' + key);
  });
  if (!input.title.trim() || !input.category.trim() || !input.markdown.trim()) throw new Error('Preencha título, categoria e conteúdo.');
  if (input.title.length > 250 || input.category.length > 100 || input.keywords.length > 1000 || input.revision.length > 50 || input.markdown.length > 35000) {
    throw new Error('Conteúdo acima do limite: título 250, categoria 100, palavras-chave 1000, revisão 50 e texto 35000 caracteres.');
  }
  if (['draft','published'].indexOf(input.status) < 0) throw new Error('Status inválido.');
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var user = requireUser_('admin');
    var article = rows_('Articles').filter(function (a) { return a.id === input.id; })[0];
    if (!article || article.status === 'deleted') throw new Error('Guia não encontrado ou removido.');
    if (article.updatedAt !== input.updatedAt) throw new Error('Este guia foi alterado por outra pessoa. Recarregue antes de salvar.');
    validateGuideImages_(article.id, input.markdown);
    var previous = guideData_(article);
    var now = new Date(Math.max(Date.now(), new Date(article.updatedAt).getTime() + 1 || 0)).toISOString();
    var content = JSON.stringify({ format: 'supportflow-guide-v1', markdown: input.markdown.trim(),
      keywords: input.keywords.trim(), revision: input.revision.trim(), sourceCode: previous.sourceCode });
    // O limite da célula é 50 mil caracteres; a serialização também precisa caber.
    if (content.length > 45000) throw new Error('Conteúdo serializado muito grande. Reduza o texto.');
    audit_(user.email, 'GUIDE_SAVE_REQUEST', article.id + ' / ' + input.status);
    ensureGuideCategory_(input.category.trim(), now);
    writeRow_('Articles', { id: article.id, title: input.title.trim(), category: input.category.trim(),
      status: input.status, content: content, createdAt: article.createdAt, updatedAt: now }, rowNumberForId_('Articles', article.id));
    return { ok: true, id: article.id };
  } finally { lock.releaseLock(); }
}

function ensureGuideCategory_(name, now) {
  if (!rows_('Categories').some(function (c) { return searchText_(c.name) === searchText_(name); })) {
    writeRow_('Categories', { id: Utilities.getUuid(), name: name, createdAt: now, updatedAt: now });
  }
}

/** Remoção lógica: mantém conteúdo e código para não recriar o guia na importação. */
function deleteGuide(input) {
  requireUser_('admin');
  if (!input || typeof input.id !== 'string' || input.confirmId !== input.id) {
    throw new Error('Confirme o guia que deseja remover.');
  }
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var user = requireUser_('admin');
    var article = rows_('Articles').filter(function (a) { return a.id === input.id; })[0];
    if (!article || article.status === 'deleted') throw new Error('Guia não encontrado ou já removido.');
    if (article.updatedAt !== input.updatedAt) throw new Error('Este guia foi alterado por outra pessoa. Recarregue antes de remover.');
    audit_(user.email, 'GUIDE_DELETE_REQUEST', article.id + ' / ' + article.title);
    article.status = 'deleted';
    article.updatedAt = new Date(Math.max(Date.now(), new Date(article.updatedAt).getTime() + 1 || 0)).toISOString();
    writeRow_('Articles', article, rowNumberForId_('Articles', article.id));
    return { ok: true, id: article.id };
  } finally { lock.releaseLock(); }
}

/** Remoção lógica em lote; a seleção é validada antes das gravações. */
function deleteGuides(input) {
  requireUser_('admin');
  if(!input || input.confirm!==true || !Array.isArray(input.guides) || !input.guides.length || input.guides.length>50) {
    throw new Error('Confirme de 1 a 50 guias para remover.');
  }
  var lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    var user=requireUser_('admin'),stored=rows_('Articles'),ids=[];
    var selected=input.guides.map(function (item) {
      if(!item || typeof item.id!=='string' || ids.indexOf(item.id)>=0) throw new Error('Seleção inválida.');
      ids.push(item.id);
      var article=stored.filter(function (a) {return a.id===item.id;})[0];
      if(!article || article.status==='deleted') throw new Error('Um dos guias não está disponível. Recarregue a base.');
      if(article.updatedAt!==item.updatedAt) throw new Error('O guia '+item.id+' foi alterado. Recarregue antes de remover.');
      return article;
    });
    // Confere todo o lote antes de alterar o primeiro registro.
    audit_(user.email,'GUIDES_DELETE_REQUEST',ids.join(', '));
    selected.forEach(function (article) {
      article.status='deleted';
      article.updatedAt=new Date(Math.max(Date.now(),new Date(article.updatedAt).getTime()+1 || 0)).toISOString();
      writeRow_('Articles',article,rowNumberForId_('Articles',article.id));
    });
    return {removed:selected.length};
  } finally {lock.releaseLock();}
}

/** Restauração explícita; importar continua sem recriar guias removidos. */
function restoreGuides(input) {
  requireUser_('admin');
  if(!input || input.confirm!==true || !Array.isArray(input.guides) || !input.guides.length || input.guides.length>50 ||
      typeof input.useSimplified!=='boolean') throw new Error('Confirme de 1 a 50 guias para restaurar.');
  var lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    var user=requireUser_('admin'),stored=rows_('Articles'),ids=[],simplified=0;
    var changes=input.guides.map(function (item) {
      if(!item || typeof item.id!=='string' || ids.indexOf(item.id)>=0) throw new Error('Seleção inválida.');
      ids.push(item.id);
      var article=stored.filter(function (a) {return a.id===item.id;})[0];
      if(!article || article.status!=='deleted') throw new Error('Guia não está mais removido. Recarregue a base.');
      if(article.updatedAt!==item.updatedAt) throw new Error('Guia alterado. Recarregue antes de restaurar.');
      // A volta é sempre privada ao administrador, sem republicação automática.
      article.status='draft';
      if(input.useSimplified) {
        var candidate=simpleGuideCandidate_(article);
        if(candidate) {article.content=JSON.stringify(candidate);simplified++;}
      }
      return article;
    });
    audit_(user.email,'GUIDES_RESTORE_REQUEST',ids.join(', '));
    changes.forEach(function (article) {
      article.updatedAt=new Date(Math.max(Date.now(),new Date(article.updatedAt).getTime()+1 || 0)).toISOString();
      writeRow_('Articles',article,rowNumberForId_('Articles',article.id));
    });
    return {restored:changes.length,simplified:simplified};
  } finally {lock.releaseLock();}
}

/** Disponível ao administrador no módulo Conhecimento ou pelo editor. */
function importInitialGuides() {
  requireUser_('admin');
  var seeds = initialGuides_();
  var codes = seeds.map(function (a) { return a.id; });
  if (!codes.length || codes.some(function (code,i) { return codes.indexOf(code) !== i || !/^KB-\d{4}$/.test(code); })) {
    throw new Error('Pacote de guias inválido.');
  }
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var user = requireUser_('admin');
    var existing = rows_('Articles');
    var result = { imported: 0, skipped: [], conflicts: [] };
    var now = new Date().toISOString();
    audit_(user.email, 'GUIDES_IMPORT_REQUEST', 'Catálogo: ' + seeds.length + ' guias / revisão 1.0');
    seeds.forEach(function (seed) {
      var matches = existing.filter(function (a) { return a.id === seed.id; });
      if (matches.length) {
        if (matches.length !== 1 || (guideData_(matches[0]).sourceCode !== seed.id && matches[0].title !== seed.title)) result.conflicts.push(seed.id);
        else result.skipped.push(seed.id);
        return;
      }
      ensureGuideCategory_(seed.category, now);
      writeRow_('Articles', { id: seed.id, title: seed.title, category: seed.category, status: 'draft',
        content: JSON.stringify({ format: 'supportflow-guide-v1', sourceCode: seed.id, keywords: seed.keywords,
          revision: seed.revision, markdown: seed.markdown }), createdAt: now, updatedAt: now });
      result.imported++;
    });
    return result;
  } finally { lock.releaseLock(); }
}
