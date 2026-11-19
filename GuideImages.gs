var GUIDE_IMAGE_LIMIT_ = 2 * 1024 * 1024;

function guideImageIds_(markdown) {
  var ids = [], pattern = /^!\[[^\]\r\n]{0,200}\]\(sf-image:([A-Za-z0-9_-]{1,80})\)\s*$/gm, match;
  while ((match = pattern.exec(markdown))) if (ids.indexOf(match[1]) < 0) ids.push(match[1]);
  return ids;
}

function guideImagesTable_() {
  var db = database_();
  var sheet = db.getSheetByName('GuideImages');
  if (!sheet) sheet = db.insertSheet('GuideImages');
  if (!sheet.getLastRow()) {
    sheet.getRange(1, 1, 1, SCHEMA_.GuideImages.length).setValues([SCHEMA_.GuideImages]);
    sheet.setFrozenRows(1);
  }
  return sheet_('GuideImages');
}

function guideImagesFolder_() {
  var properties = PropertiesService.getScriptProperties();
  var id = properties.getProperty('GUIDE_IMAGES_FOLDER_ID');
  if (id) return DriveApp.getFolderById(id);
  var folder = DriveApp.createFolder('SupportFlow — Imagens dos guias');
  properties.setProperty('GUIDE_IMAGES_FOLDER_ID', folder.getId());
  return folder;
}

/** Executar uma vez no editor para autorizar Drive e preparar o armazenamento. */
function setupGuideImages() {
  requireUser_('admin');
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    requireUser_('admin');
    guideImagesTable_();
    guideImagesFolder_();
    return { ok: true };
  } finally { lock.releaseLock(); }
}

function imageBytes_(input) {
  if (!input || typeof input.base64 !== 'string' || input.base64.length > Math.ceil(GUIDE_IMAGE_LIMIT_ / 3) * 4 ||
      input.base64.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(input.base64)) {
    throw new Error('Imagem inválida ou acima de 2 MB.');
  }
  var bytes = Utilities.base64Decode(input.base64);
  if (!bytes.length || bytes.length > GUIDE_IMAGE_LIMIT_) throw new Error('Imagem inválida ou acima de 2 MB.');
  function byte(i) { return bytes[i] & 255; }
  var mime = '';
  if (bytes.length >= 24 && [137,80,78,71,13,10,26,10].every(function (value,i) { return byte(i) === value; }) &&
      byte(12) === 73 && byte(13) === 72 && byte(14) === 68 && byte(15) === 82) mime = 'image/png';
  else if (bytes.length >= 4 && byte(0) === 255 && byte(1) === 216 && byte(2) === 255 &&
      byte(bytes.length - 2) === 255 && byte(bytes.length - 1) === 217) mime = 'image/jpeg';
  else if (bytes.length >= 16 && byte(0) === 82 && byte(1) === 73 && byte(2) === 70 && byte(3) === 70 &&
      byte(8) === 87 && byte(9) === 69 && byte(10) === 66 && byte(11) === 80) mime = 'image/webp';
  if (!mime || input.mimeType !== mime) throw new Error('Envie uma imagem PNG, JPEG ou WebP válida. SVG e outros formatos não são aceitos.');
  return { bytes: bytes, mimeType: mime };
}

function uploadGuideImage(input) {
  requireUser_('admin');
  input = input || {};
  var image = imageBytes_(input);
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var user = requireUser_('admin');
    var guide = getGuide(input.guideId);
    guideImagesTable_();
    if (rows_('GuideImages', true).filter(function (a) { return a.guideId === guide.id; }).length >= 50) {
      throw new Error('Este guia já possui 50 arquivos enviados. Solicite manutenção ao responsável técnico.');
    }
    var id = Utilities.getUuid();
    audit_(user.email, 'GUIDE_IMAGE_UPLOAD_REQUEST', guide.id + ' / ' + id);
    var file = guideImagesFolder_().createFile(Utilities.newBlob(image.bytes, image.mimeType,
      'imagem-' + id + (image.mimeType === 'image/png' ? '.png' : image.mimeType === 'image/jpeg' ? '.jpg' : '.webp')));
    // Sem setSharing: o arquivo permanece na pasta restrita, sem link público.
    writeRow_('GuideImages', { id: id, guideId: guide.id, fileId: file.getId(), mimeType: image.mimeType,
      size: image.bytes.length, createdBy: user.email, createdAt: new Date().toISOString() });
    return { id: id };
  } finally { lock.releaseLock(); }
}

function validateGuideImages_(guideId, markdown) {
  var ids = guideImageIds_(markdown);
  if (ids.length > 12) throw new Error('Use no máximo 12 imagens por guia.');
  if (!ids.length) return;
  var images = database_().getSheetByName('GuideImages') ? rows_('GuideImages', true) : [];
  ids.forEach(function (id) {
    if (!images.some(function (image) { return image.id === id && image.guideId === guideId; })) {
      throw new Error('Imagem não encontrada ou pertencente a outro guia. Use Enviar e inserir imagem.');
    }
  });
}

function getGuideImage(guideId, imageId, options) {
  var user = viewUser_(options);
  var guide = getGuide(guideId, options); // Revalida publicação inclusive para imagens e prévia.
  var images = database_().getSheetByName('GuideImages') ? rows_('GuideImages') : [];
  var image = images.filter(function (item) { return item.id === imageId && item.guideId === guide.id; })[0];
  if (!image || (user.role !== 'admin' && guideImageIds_(guide.markdown).indexOf(imageId) < 0)) {
    throw new Error('Imagem não encontrada ou não disponível neste guia.');
  }
  var file = DriveApp.getFileById(image.fileId);
  if (file.isTrashed() || file.getSize() > GUIDE_IMAGE_LIMIT_ || file.getMimeType() !== image.mimeType) {
    throw new Error('Arquivo de imagem indisponível. Solicite revisão ao administrador.');
  }
  var payload = { mimeType: image.mimeType, base64: Utilities.base64Encode(file.getBlob().getBytes()) };
  imageBytes_(payload);
  return payload;
}
