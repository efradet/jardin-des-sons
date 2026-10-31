import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,findItem} from '../src/school/content.js';
import * as engine from '../src/school/engine.js';
import {readSaved} from '../src/game.js';

test('every lesson 1–17 supports a complete long session that survives reload and rewards once',()=>{
  assert.deepEqual(lessons.map(l=>l.id),[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]);
  for(const lesson of lessons){
    const steps=engine.buildSteps(lesson,[],'long');
    assert.equal(steps.length,12);
    assert.equal(steps.filter(s=>s.kind==='read').length,3);
    assert.equal(steps.filter(s=>s.kind==='dictation').length,6);
    assert.equal(new Set(steps.map(s=>s.item.id)).size,12);
    for(const {item} of steps)assert.ok(findItem(lesson.id,item.id));
    const result={id:`long-${lesson.id}`,lesson:lesson.id,mode:'long',completedAt:'2026-10-19T10:00:00Z',items:steps.map(({kind,item})=>({id:item.id,skill:{blend:'blending',read:'comprehension',dictation:'spelling'}[kind],attempts:1,help:kind==='blend',paper:false}))};
    const saved=readSaved(JSON.stringify(engine.recordSchool(readSaved('{"flowers":5}'),result)));
    assert.equal(saved.flowers,6);
    assert.equal(saved.school.history[0].items.length,12);
    assert.equal(engine.recordSchool(saved,result).flowers,6);
    assert.equal(engine.buildSteps(lesson,[],'lesson').length,7);
    assert.equal(engine.buildSteps(lesson,[],'challenge').length,5);
  }
});

test('long practice prioritizes difficulties without repeating the same dictated word',()=>{
  assert.equal(typeof engine.buildSteps,'function');
  const lesson=lessons.find(l=>l.id===10);
  const history=[{lesson:10,items:[{id:'challenge-forme',skill:'spelling',help:true,attempts:2}]}];
  const words=engine.buildSteps(lesson,history,'long').filter(s=>s.kind==='dictation').map(s=>s.item);
  assert.equal(words[0].text,'forme');
  assert.equal(new Set(words.map(w=>w.text)).size,6);
});
