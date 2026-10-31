import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,findItem} from '../src/school/content.js';
import {buildSteps,recordSchool} from '../src/school/engine.js';
import {readSaved} from '../src/game.js';
import * as audio from '../src/school/audio.js';

test('new lessons support the existing short, long and challenge sessions',()=>{
  for(const id of [13,14,15,16,17]){
    const lesson=lessons.find(l=>l.id===id);
    assert.ok(lesson,`Missing lesson ${id}`);
    assert.equal(buildSteps(lesson,[],'lesson').length,7);
    const long=buildSteps(lesson,[],'long');
    assert.equal(long.length,12);
    assert.equal(new Set(long.map(s=>s.item.id)).size,12);
    assert.equal(new Set(long.filter(s=>s.kind==='dictation').map(s=>s.item.text)).size,6);
    for(const step of long)assert.ok(findItem(id,step.item.id));
    assert.equal(buildSteps(lesson,[],'challenge').length,5);
  }
});

test('each story has two answerable questions and earns one flower only after both',()=>{
  for(const lesson of lessons){
    assert.ok(lesson.story,`Missing story ${lesson.id}`);
    const steps=buildSteps(lesson,[],'story');
    assert.equal(steps.length,2);
    assert.ok(steps.every(s=>s.kind==='story'));
    assert.ok(lesson.story.paragraphs.length>=2);
    for(const {item} of steps){
      assert.ok(item.options.includes(item.answer));
      assert.equal(new Set(item.options).size,item.options.length);
    }
    const result={id:`story-${lesson.id}`,lesson:lesson.id,mode:'story',completedAt:'2026-10-29T11:00:00Z',items:steps.map(({item})=>({id:item.id,skill:'comprehension',attempts:1,help:true,paper:false}))};
    const old=readSaved('{"flowers":5,"completed":["p"]}');
    assert.equal(recordSchool(old,{...result,items:result.items.slice(0,1)}).flowers,5);
    const saved=readSaved(JSON.stringify(recordSchool(old,result)));
    assert.equal(saved.flowers,6);assert.deepEqual(saved.completed,['p']);
    assert.equal(saved.school.history[0].items.length,2);
    assert.ok(saved.school.history[0].items.every(i=>i.help));
    assert.equal(recordSchool(saved,result).flowers,6);
    assert.equal(recordSchool(old,{...result,items:[result.items[0],result.items[0]]}).flowers,5);
  }
});

test('clickable words retain accents, elisions and hyphens without speaking punctuation',()=>{
  assert.equal(typeof audio.tokenizeStory,'function');
  const input="L’élève dit : « Lui-même ! » L'e\u0301le\u0300ve rit.";
  const tokens=audio.tokenizeStory(input);
  assert.equal(tokens.map(t=>t.text).join(''),input);
  assert.deepEqual(tokens.filter(t=>t.word).map(t=>t.word),['l’élève','dit','lui-même','l’élève','rit']);
  assert.ok(tokens.filter(t=>!t.word).every(t=>!/[\p{L}]/u.test(t.text)));
});
