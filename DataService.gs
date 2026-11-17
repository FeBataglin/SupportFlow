var SCHEMA_ = {
  Users: ['id', 'email', 'role', 'active', 'createdAt', 'updatedAt'],
  Categories: ['id', 'name', 'createdAt', 'updatedAt'],
  Articles: ['id', 'title', 'category', 'status', 'content', 'createdAt', 'updatedAt'],
  GuideImages: ['id', 'guideId', 'fileId', 'mimeType', 'size', 'createdBy', 'createdAt'],
  LogRules: ['id', 'name', 'pattern', 'severity', 'explanation', 'articleId', 'active', 'createdAt', 'updatedAt'],
  DiagnosticFlows: ['id', 'title', 'status', 'definitionJson', 'createdAt', 'updatedAt'],
  DiagnosticHistory: ['id', 'userEmail', 'flowId', 'summary', 'createdAt'],
  AnalysisMetadata: ['id', 'userEmail', 'format', 'lineCount', 'summaryJson', 'createdAt'],
  Settings: ['id', 'value', 'updatedAt'],
  Audit: ['id', 'actor', 'action', 'detail', 'createdAt']
};

function database_() {
  var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('SupportFlow ainda não foi configurado. Solicite a inicialização ao administrador.');
  return SpreadsheetApp.openById(id);
}

function sheet_(name) {
  if (!SCHEMA_[name]) throw new Error('Tabela inválida.');
  var sheet = database_().getSheetByName(name);
  if (!sheet) throw new Error('Estrutura de dados incompleta. Execute a inicialização pelo editor.');
  var header = sheet.getRange(1, 1, 1, SCHEMA_[name].length).getValues()[0];
  if (JSON.stringify(header) !== JSON.stringify(SCHEMA_[name])) throw new Error('Estrutura incompatível na tabela ' + name + '. Nenhum dado foi sobrescrito.');
  return sheet;
}

function rows_(name) {
  var sheet = sheet_(name);
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, SCHEMA_[name].length).getValues()
    .filter(function (row) { return row[0] !== ''; })
    .map(function (row) {
      var item = {};
      SCHEMA_[name].forEach(function (key, i) {
        item[key] = row[i] instanceof Date ? row[i].toISOString() : row[i];
      });
      return item;
    });
}

function writeRow_(name, record, rowNumber) {
  var sheet = sheet_(name);
  var values = SCHEMA_[name].map(function (key) {
    var value = record[key] === undefined ? '' : record[key];
    // Evita fórmulas em campos textuais gravados na planilha.
    return typeof value === 'string' && /^[=+@\-]/.test(value) ? "'" + value : value;
  });
  sheet.getRange(rowNumber || sheet.getLastRow() + 1, 1, 1, values.length).setValues([values]);
}

function rowNumberForId_(name, id) {
  var sheet = sheet_(name);
  var ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) return i + 2;
  }
  throw new Error('Registro não encontrado. Recarregue a página.');
}

function audit_(actor, action, detail) {
  writeRow_('Audit', { id: Utilities.getUuid(), actor: actor, action: action,
    detail: detail, createdAt: new Date().toISOString() });
}

/** Entrada de configuração para execução pelo editor; valida identidade no helper. */
function setupSupportFlow() {
  return setupSupportFlow_();
}

/** Implementação privada; exige INITIAL_ADMIN_EMAIL e domínio autorizado. */
function setupSupportFlow_() {
  var properties = PropertiesService.getScriptProperties();
  var email = normalizeEmail_(Session.getActiveUser().getEmail());
  var initialAdmin = normalizeEmail_(properties.getProperty('INITIAL_ADMIN_EMAIL'));
  if (!email || email !== initialAdmin || !validEmail_(email) || !allowedDomain_(email)) {
    throw new Error('Configure ALLOWED_DOMAINS e INITIAL_ADMIN_EMAIL com a conta corporativa que executará a inicialização.');
  }
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var id = properties.getProperty('SPREADSHEET_ID');
    var db = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create('SupportFlow — Dados');
    if (!id) properties.setProperty('SPREADSHEET_ID', db.getId());
    // Valida tabelas existentes antes de acrescentar estrutura. Nunca apaga dados.
    Object.keys(SCHEMA_).forEach(function (name) {
      var existing = db.getSheetByName(name);
      if (existing && existing.getLastRow() > 0) sheet_(name);
    });
    Object.keys(SCHEMA_).forEach(function (name) {
      var sheet = db.getSheetByName(name) || db.insertSheet(name);
      if (!sheet.getLastRow()) {
        sheet.getRange(1, 1, 1, SCHEMA_[name].length).setValues([SCHEMA_[name]]);
        sheet.setFrozenRows(1);
      }
    });
    var users = rows_('Users');
    if (!users.length) {
      var now = new Date().toISOString();
      writeRow_('Users', { id: Utilities.getUuid(), email: email, role: 'admin', active: true, createdAt: now, updatedAt: now });
      audit_(email, 'INITIAL_SETUP', 'Estrutura v1.0.0 inicializada');
    } else if (!users.some(function (u) { return u.email === email && u.role === 'admin' && u.active === true; })) {
      throw new Error('A base já possui usuários. A inicialização não concede novos privilégios.');
    }
    return 'Estrutura pronta. Planilha: ' + db.getId();
  } finally { lock.releaseLock(); }
}
