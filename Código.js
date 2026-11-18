/** Entrada do web app. Toda operação de dados revalida a identidade. */
function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('SupportFlow | Central de atendimento')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include_(name) {
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function getBootstrap(options) {
  var user = viewUser_(options);
  var articles = rows_('Articles').filter(function (a) { return a.status === 'published'; });
  return {
    version: '1.0.0', user: user,
    dashboard: { publishedArticles: articles.length, categories: rows_('Categories').length },
    recentArticles: articles.sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); })
      .slice(0, 5).map(function (a) { return { id: a.id, title: a.title, category: a.category, updatedAt: a.updatedAt }; })
  };
}

function getAdminData() {
  requireUser_('admin');
  return { users: rows_('Users'), audit: rows_('Audit').slice(-50).reverse(),
    storage: 'Google Sheets', aiEnabled: false, version: '1.0.0' };
}

function saveUser(input) {
  var actor = requireUser_('admin');
  input = input || {};
  var email = normalizeEmail_(input.email);
  if (!validEmail_(email) || !allowedDomain_(email)) throw new Error('Informe um e-mail do domínio autorizado.');
  if (['admin', 'support'].indexOf(input.role) < 0 || typeof input.active !== 'boolean') {
    throw new Error('Perfil ou situação inválidos.');
  }
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    requireUser_('admin');
    var users = rows_('Users');
    var existing = users.filter(function (u) { return u.email === email; })[0];
    if (existing && existing.role === 'admin' && existing.active === true &&
        (input.role !== 'admin' || !input.active) &&
        users.filter(function (u) { return u.role === 'admin' && u.active === true; }).length <= 1) {
      throw new Error('Mantenha pelo menos um administrador ativo.');
    }
    var now = new Date().toISOString();
    var record = { id: existing ? existing.id : Utilities.getUuid(), email: email,
      role: input.role, active: input.active, createdAt: existing ? existing.createdAt : now, updatedAt: now };
    audit_(actor.email, 'USER_SAVE', email + ' / ' + input.role + ' / ' + input.active);
    writeRow_('Users', record, existing ? rowNumberForId_('Users', existing.id) : null);
    return { ok: true };
  } finally { lock.releaseLock(); }
}
