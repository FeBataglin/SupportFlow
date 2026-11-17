const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

test('links do menu, cards e guias navegam internamente sem abrir outra página',async () => {
  const elements = new Map();
  const windowEvents = {}, documentEvents = {}, visits = [];
  function element(id) {
    if (!elements.has(id)) elements.set(id,{
      innerHTML:'',textContent:'',dataset:{},
      addEventListener(){},setAttribute(){},removeAttribute(){},classList:{toggle(){},remove(){}}
    });
    return elements.get(id);
  }
  const location = {hash:''};
  const document = {
    getElementById:element,querySelectorAll:()=>[],
    documentElement:{dataset:{}},body:{classList:{remove(){},toggle(){}}},
    addEventListener:(name,handler)=>{documentEvents[name]=handler;}
  };
  const run = {
    withSuccessHandler(handler){this.success=handler;return this;},
    withFailureHandler(){return this;},
    getBootstrap(){this.success({user:{email:'support@example.com',role:'support'},version:'1.0.0',dashboard:{publishedArticles:0,categories:0},recentArticles:[]});}
  };
  const context = vm.createContext({
    document,location,google:{script:{run}},localStorage:{getItem:()=> 'light'},
    window:{google:{script:{run}},SupportFlowKnowledge:{render:options=>visits.push(options.id)},
      addEventListener:(name,handler)=>{windowEvents[name]=handler;}},setTimeout
  });
  const source = fs.readFileSync(path.join(__dirname,'../Scripts.html'),'utf8').replace(/^<script>\s*/,'').replace(/<\/script>\s*$/,'');
  vm.runInContext(source,context);
  await new Promise(resolve=>setImmediate(resolve));
  assert.match(element('content').innerHTML,/Visão geral/);
  function click(href,prevented=false) {
    const event = {button:0,defaultPrevented:prevented,
      target:{closest:()=>({getAttribute:()=>href})},
      preventDefault(){this.defaultPrevented=true;}};
    documentEvents.click(event);return event;
  }
  assert.equal(click('#knowledge').defaultPrevented,true);
  assert.equal(location.hash,'#knowledge');
  windowEvents.hashchange();assert.equal(visits.at(-1),'');
  assert.equal(click('#knowledge/KB-0001').defaultPrevented,true);
  windowEvents.hashchange();assert.equal(visits.at(-1),'KB-0001');
  click('#dashboard');windowEvents.hashchange();assert.match(element('content').innerHTML,/Orientações recentes/);
  assert.equal(click('https://example.com').defaultPrevented,false);
  assert.equal(location.hash,'#dashboard');
  click('#knowledge',true);assert.equal(location.hash,'#dashboard');
  location.hash='#knowledge/KB-0002';windowEvents.hashchange();assert.equal(visits.at(-1),'KB-0002');
});
