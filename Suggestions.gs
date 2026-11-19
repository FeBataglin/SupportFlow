function suggestionsTable_(){
  var db=database_(),table=db.getSheetByName('Suggestions');
  if(!table)table=db.insertSheet('Suggestions');
  if(!table.getLastRow()){table.getRange(1,1,1,SCHEMA_.Suggestions.length).setValues([SCHEMA_.Suggestions]);table.setFrozenRows(1);}
  return sheet_('Suggestions');
}
function listSuggestions(options){
  var user=viewUser_(options);
  // Consultas não disputam o lock de escrita quando a tabela já existe.
  var table=database_().getSheetByName('Suggestions');
  if(!table||!table.getLastRow()){
    var lock=LockService.getScriptLock();lock.waitLock(10000);
    try{suggestionsTable_();}finally{lock.releaseLock();}
  }
  var all=rows_('Suggestions').filter(function(item){return user.role==='admin'||item.author===user.email;});
  return {total:all.length,items:all.sort(function(a,b){return String(b.createdAt).localeCompare(String(a.createdAt));}).slice(0,200)};
}
function createSuggestion(input){
  var user=requireUser_();input=input||{};
  var types=['improvement','guide','diagnostic','difficulty'];
  if(types.indexOf(input.type)<0)throw new Error('Selecione o tipo da sugestão.');
  var record={};
  ['title','program','details','expected'].forEach(function(key){
    var limit=key==='title'?150:key==='program'?200:key==='details'?4000:1500;
    if(typeof input[key]!=='string'||input[key].length>limit)throw new Error('Campo inválido: '+key+'.');
    record[key]=input[key].trim();
  });
  if(!record.title||record.details.length<10)throw new Error('Informe título e descreva a sugestão em pelo menos 10 caracteres.');
  if(typeof input.requestId!=='string'||!/^[a-zA-Z0-9_-]{10,100}$/.test(input.requestId))throw new Error('Identificador inválido. Reabra o formulário.');
  var lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
    requireUser_();suggestionsTable_();
    var existing=rows_('Suggestions').filter(function(item){return item.author===user.email&&item.requestId===input.requestId;})[0];
    if(existing)return {id:existing.id};
    var now=new Date().toISOString();
    record.id=Utilities.getUuid();record.requestId=input.requestId;record.author=user.email;record.type=input.type;
    record.status='new';record.response='';record.createdAt=now;record.updatedAt=now;
    writeRow_('Suggestions',record);return {id:record.id};
  }finally{lock.releaseLock();}
}
function updateSuggestion(input){
  requireUser_('admin');input=input||{};
  if(['new','reviewing','planned','done','closed'].indexOf(input.status)<0||typeof input.response!=='string'||input.response.length>2000)throw new Error('Situação ou retorno inválido.');
  var lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
    var user=requireUser_('admin');suggestionsTable_();
    var record=rows_('Suggestions').filter(function(item){return item.id===input.id;})[0];
    if(!record||record.updatedAt!==input.updatedAt)throw new Error('Sugestão alterada. Atualize a lista antes de salvar.');
    record.status=input.status;record.response=input.response.trim();record.updatedAt=new Date(Math.max(Date.now(),new Date(record.updatedAt).getTime()+1)).toISOString();
    audit_(user.email,'SUGGESTION_UPDATE',record.id+' / '+record.status);
    writeRow_('Suggestions',record,rowNumberForId_('Suggestions',record.id));return {ok:true};
  }finally{lock.releaseLock();}
}
