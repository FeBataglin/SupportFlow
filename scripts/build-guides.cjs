// Converte a fonte fornecida pelo usuário em conteúdo inicial, sem publicar instruções editoriais.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const text = fs.readFileSync(path.join(root, 'docs/Guias_Atendimento_Fonte.md'), 'utf8').replace(/\r\n/g, '\n');
const articles = [];
const supplement = fs.readFileSync(path.join(root, 'docs/Guias_Complementares.md'), 'utf8').replace(/\r\n/g, '\n');
const simplified = fs.readFileSync(path.join(root, 'docs/Guias_Simplificados.md'), 'utf8').replace(/\r\n/g, '\n');
for (const source of [text, supplement, simplified]) {
let category = '', current = null;
for (const line of source.split('\n')) {
  if (/^## Referências técnicas consultadas/.test(line)) { current = null; break; }
  if (line.startsWith('# Categoria — ')) { category = line.slice('# Categoria — '.length); current = null; continue; }
  const match = /^## (KB-\d{4}) — (.+)$/.exec(line);
  if (match) {
    current = {id:match[1],title:match[2],category,lines:[],revision:source === simplified ? '1.1' : '1.0'};
    if(source === simplified) {
      const index=articles.findIndex(a=>a.id===current.id);
      if(index<0 || !/^KB-002[5-8]$/.test(current.id)) throw new Error('Revisão não autorizada: '+current.id);
      articles[index]=current;
    } else articles.push(current);
    continue;
  }
  if (current) current.lines.push(line);
}
}
const seeds = articles.map(a => {
  const markdown = a.lines.join('\n').trim();
  const keywords = /^\*\*Palavras-chave:\*\* (.+)$/m.exec(markdown);
  return {id:a.id,title:a.title,category:a.category,keywords:keywords ? keywords[1] : '',revision:a.revision,
    markdown:markdown.replace(/^\*\*Palavras-chave:\*\* .+\n*/m, '').trim()};
});
const codes = new Set(seeds.map(a => a.id));
if (!seeds.length || codes.size !== seeds.length) throw new Error('O catálogo deve conter códigos únicos.');
for (const a of seeds) {
  if (!a.category || !a.markdown.includes('### Como fazer')) throw new Error('Artigo incompleto: '+a.id);
  for (const code of a.markdown.match(/KB-\d{4}/g) || []) if (!codes.has(code)) throw new Error('Vínculo inválido: '+code);
}
const intro = text.split('## Orientações gerais para o Atendimento\n')[1].split('\n## Catálogo')[0].trim();
const previous = JSON.parse(fs.readFileSync(path.join(root,'docs/revisions/KB-0025-a-KB-0028-v1.0.json'),'utf8'));
fs.writeFileSync(path.join(root,'GuideSeeds.gs'), '// Gerado por node scripts/build-guides.cjs. Fontes e revisões em docs/\n' +
  'function initialGuides_() { return '+ JSON.stringify(seeds,null,2) + '; }\n' +
  'function previousGuideEditions_() { return '+JSON.stringify(previous,null,2)+'; }\n' +
  'function guideGuidelines_() { return '+ JSON.stringify(intro) + '; }\n','utf8');
console.log('Gerados '+seeds.length+' guias em '+new Set(seeds.map(a=>a.category)).size+' categorias.');
