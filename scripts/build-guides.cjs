// Converte a fonte fornecida pelo usuário em conteúdo inicial, sem publicar instruções editoriais.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const text = fs.readFileSync(path.join(root, 'docs/Guias_Atendimento_Fonte.md'), 'utf8').replace(/\r\n/g, '\n');
const articles = [];
let category = '', current = null;
for (const line of text.split('\n')) {
  if (/^## Referências técnicas consultadas/.test(line)) { current = null; break; }
  if (line.startsWith('# Categoria — ')) { category = line.slice('# Categoria — '.length); current = null; continue; }
  const match = /^## (KB-\d{4}) — (.+)$/.exec(line);
  if (match) { current = {id:match[1],title:match[2],category,lines:[]}; articles.push(current); continue; }
  if (current) current.lines.push(line);
}
const seeds = articles.map(a => {
  const markdown = a.lines.join('\n').trim();
  const keywords = /^\*\*Palavras-chave:\*\* (.+)$/m.exec(markdown);
  return {id:a.id,title:a.title,category:a.category,keywords:keywords ? keywords[1] : '',revision:'1.0',
    markdown:markdown.replace(/^\*\*Palavras-chave:\*\* .+\n*/m, '').trim()};
});
const codes = new Set(seeds.map(a => a.id));
if (seeds.length !== 23 || codes.size !== 23) throw new Error('Esperados 23 códigos únicos.');
for (const a of seeds) {
  if (!a.category || !a.markdown.includes('### Como fazer')) throw new Error('Artigo incompleto: '+a.id);
  for (const code of a.markdown.match(/KB-\d{4}/g) || []) if (!codes.has(code)) throw new Error('Vínculo inválido: '+code);
}
const intro = text.split('## Orientações gerais para o Atendimento\n')[1].split('\n## Catálogo')[0].trim();
fs.writeFileSync(path.join(root,'GuideSeeds.gs'), '// Gerado por node scripts/build-guides.cjs. Fonte: docs/Guias_Atendimento_Fonte.md\n' +
  'function initialGuides_() { return '+ JSON.stringify(seeds,null,2) + '; }\n' +
  'function guideGuidelines_() { return '+ JSON.stringify(intro) + '; }\n','utf8');
console.log('Gerados '+seeds.length+' guias em '+new Set(seeds.map(a=>a.category)).size+' categorias.');
