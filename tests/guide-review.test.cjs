const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
test('revisão percorre resultados e publicar/próximo confirma apenas o guia atual',async()=>{
  const nodes=new Map(),dialogs=[],calls=[],location={hash:'#knowledge'},window={};let refreshes=0;
  const element=()=>({handlers:{},disabled:false,textContent:'',setAttribute(){},focus(){},addEventListener(name,fn){this.handlers[name]=fn;}});
  const node=id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);};
  const document={getElementById:node,createElement:()=>{
    const dialog=element(),children=new Map();dialog.querySelector=key=>{if(!children.has(key))children.set(key,element());return children.get(key);};
    dialog.showModal=()=>dialog.open=true;dialog.close=()=>{dialog.open=false;};dialog.remove=()=>{};dialogs.push(dialog);return dialog;
  }};
  const content={innerHTML:'',querySelectorAll:()=>[],querySelector:()=>({querySelectorAll:()=>[]}),append(){}};
  const guides=[1,2].map(i=>({id:'KB-000'+i,title:'Guia '+i,status:'draft',markdown:'Texto',category:'Categoria',keywords:'',updatedAt:'v1'}));
  const rpc=async(method,...args)=>{calls.push({method,args});if(method==='listGuides')return {articles:guides.map(g=>({...g})),categories:[],summary:{total:2,published:0,drafts:2},guidelines:'',initialImport:{missing:0}};if(method==='getGuide')return {...guides.find(g=>g.id===args[0])};if(method==='publishGuides'){const selected=args[0].guides;assert.equal(selected.length,1);guides.find(g=>g.id===selected[0].id).status='published';return {published:1};}throw Error(method);};
  vm.runInNewContext(fs.readFileSync('KnowledgeScripts.html','utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,''),{window,document,location});
  const render=id=>window.SupportFlowKnowledge.render({rpc,user:{role:'admin'},content,isCurrent:()=>true,onChange:async()=>refreshes++,id});
  await render('');assert.match(content.innerHTML,/Revisar resultados \(2\)/);node('start-guide-review').handlers.click();assert.equal(location.hash,'#knowledge/KB-0001');
  await render('KB-0001');assert.match(content.innerHTML,/Revisão · 1 de 2/);assert.match(content.innerHTML,/Próximo →/);
  node('publish-next-guide').handlers.click();assert.equal(calls.some(c=>c.method==='publishGuides'),false);
  dialogs.at(-1).querySelector('[data-confirm]').handlers.click && await dialogs.at(-1).querySelector('[data-confirm]').handlers.click();
  assert.equal(calls.filter(c=>c.method==='publishGuides').length,1);assert.equal(guides[1].status,'draft');assert.equal(location.hash,'#knowledge/KB-0002');assert.equal(refreshes,1);
  await render('KB-0002');assert.match(content.innerHTML,/Revisão · 2 de 2/);assert.match(content.innerHTML,/Anterior/);assert.doesNotMatch(content.innerHTML,/id="publish-next-guide"/);
  node('exit-guide-review').handlers.click();assert.equal(location.hash,'#knowledge');await render('KB-0001');assert.doesNotMatch(content.innerHTML,/Revisão ·/);
});
