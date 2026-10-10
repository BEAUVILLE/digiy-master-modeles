'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const file=path.resolve(__dirname,'../gestion.html');
const html=fs.readFileSync(file,'utf8');
test('owner inline scripts remain parseable after DOM-safe rendering patch',()=>{
 for(const [,source] of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
  if(source.trim())assert.doesNotThrow(()=>new vm.Script(source));
 }
});
test('no interpolated client identity, service or owner notes reach itemhead innerHTML',()=>{
 assert.match(html,/function ownerSummary\(/);
 assert.match(html,/name\.textContent=title/);
 assert.match(html,/meta\.textContent=details/);
 assert.match(html,/badge\.textContent=statusText/);
 assert.doesNotMatch(html,/c\.innerHTML='<div class="itemhead"/);
 assert.match(html,/ownerSummary\('👤 '/);
 assert.match(html,/ownerSummary\('🕒 '/);
});
test('markup from customer name, private note and status remains inert text',()=>{
 const start=html.indexOf('function ownerSummary(');
 const end=html.indexOf('function renderSlots()',start);
 assert.ok(start!==-1&&end>start,'extract summary DOM helper');
 const make=tag=>({
  tag,children:[],className:'',textContent:'',
  append(...children){this.children.push(...children);},
  set innerHTML(_){throw Error('ownerSummary attempted HTML parsing')}
 });
 const fakeDocument={
  createElement:tag=>make(tag),
  createDocumentFragment:()=>make('fragment')
 };
 const context={
  document:fakeDocument,
  dangerousName:'<img src=x onerror=alert(1)>',
  dangerousNote:'<script>evil()</script>'
 };
 const fragment=vm.runInNewContext(
  html.slice(start,end)+'\nownerSummary(dangerousName,\'bad" onclick="evil\',\'Présent\',dangerousNote);',
  context
 );
 const head=fragment.children[0],meta=fragment.children[1];
 assert.equal(head.tag,'div');
 assert.equal(head.children[0].textContent,context.dangerousName);
 assert.equal(head.children[1].className,'badge pending');
 assert.equal(head.children[1].textContent,'Présent');
 assert.equal(meta.textContent,context.dangerousNote);
 assert.equal(head.children.length,2);
 assert.equal(fragment.children.length,2);
});
