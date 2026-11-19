/** Cache de dados; identidade, permissões, sugestões e auditoria ficam fora dele. */
var CACHED_TABLES_ = ['Articles', 'Categories', 'GuideImages'];
var DATA_CACHE_TTL_ = 120;
var DATA_CACHE_CHUNK_ = 20000; // Até 80 KB em UTF-8, abaixo dos 100 KB por chave.
var DATA_CACHE_MAX_CHUNKS_ = 50;

function tableCacheKey_(name, variant) {
  var properties = PropertiesService.getScriptProperties();
  var databaseId = properties.getProperty('SPREADSHEET_ID');
  if (!databaseId) return null;
  return 'sf:v1:' + databaseId + ':' + name + ':' +
    (properties.getProperty('CACHE_REV_' + name) || '0') + ':' + variant;
}

function cachedTableValue_(name, variant, load, fresh) {
  if (fresh || CACHED_TABLES_.indexOf(name) < 0) return load();
  var key = tableCacheKey_(name, variant), cache;
  if (!key) return load();
  try {
    cache = CacheService.getScriptCache();
    var manifest = JSON.parse(cache.get(key) || 'null');
    if (manifest && typeof manifest.generation === 'string' &&
        Number.isInteger(manifest.chunks) && manifest.chunks > 0 && manifest.chunks <= DATA_CACHE_MAX_CHUNKS_) {
      var keys = [];
      for (var i = 0; i < manifest.chunks; i++) keys.push(key + ':' + manifest.generation + ':' + i);
      var parts = cache.getAll(keys);
      if (keys.every(function (partKey) { return typeof parts[partKey] === 'string'; })) {
        return JSON.parse(keys.map(function (partKey) { return parts[partKey]; }).join(''));
      }
    }
  } catch (_) { /* Cache indisponível/incompleto: consulta a fonte. */ }

  var value = load(); // Erros da fonte são propagados, nunca armazenados no cache.
  if (cache) {
    try {
      var json = JSON.stringify(value), count = 0, offset = 0;
      if (json.length <= DATA_CACHE_CHUNK_ * DATA_CACHE_MAX_CHUNKS_) {
        // Geração exclusiva evita misturar fragmentos de preenchimentos concorrentes.
        var generation = Utilities.getUuid(), entries = {};
        while (offset < json.length) {
          var end = Math.min(offset + DATA_CACHE_CHUNK_, json.length);
          // Não divide pares UTF-16: o transporte UTF-8 precisa preservar emojis.
          var last = json.charCodeAt(end - 1);
          if (end < json.length && last >= 0xD800 && last <= 0xDBFF) end--;
          entries[key + ':' + generation + ':' + count++] = json.slice(offset, end);
          offset = end;
        }
        if (count <= DATA_CACHE_MAX_CHUNKS_) {
          cache.putAll(entries, DATA_CACHE_TTL_);
          cache.put(key, JSON.stringify({ generation: generation, chunks: count }), DATA_CACHE_TTL_);
        }
      }
    } catch (_) { /* Cache é opcional; o resultado da consulta continua disponível. */ }
  }
  return value;
}

function invalidateTableCache_(name) {
  if (CACHED_TABLES_.indexOf(name) < 0) return;
  // A revisão é durável: um leitor concorrente só pode preencher a chave antiga.
  PropertiesService.getScriptProperties().setProperty('CACHE_REV_' + name, Utilities.getUuid());
}
