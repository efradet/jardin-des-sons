import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons, findItem} from '../src/school/content.js';
import {checkSpelling, recordSchool, chooseItems, readSchool} from '../src/school/engine.js';
import {readSaved} from '../src/game.js';

const result={id:'school-1',lesson:9,mode:'dictation',completedAt:'2026-10-05T18:00:00.000Z',items:[{id:'papa',skill:'spelling',attempts:1,help:false,paper:false}]};
test('spelling keeps correct letters and catches missing repeated letters and accents',()=>{
  assert.deepEqual(checkSpelling({tiles:['p','o','m','m','e']},['p','o','m','e']),{correct:false,locked:[true,true,true,false,false],firstMismatch:3});
  assert.equal(checkSpelling({tiles:['d','é']},['d','e']).correct,false);
  assert.equal(checkSpelling({tiles:['d','é']},['d','e\u0301']).correct,true);
  assert.equal(checkSpelling({tiles:['d','é']},['d','é','e']).correct,false);
});
test('school sessions preserve old flowers/history and award once even after reload',()=>{
  const old=readSaved('{"flowers":7,"completed":["b"]}');
  const saved=recordSchool(old,result);
  assert.equal(saved.flowers,8);assert.deepEqual(saved.completed,['b']);
  const reloaded=readSaved(JSON.stringify(saved));
  assert.equal(reloaded.school.history[0].items[0].skill,'spelling');
  assert.deepEqual(recordSchool(reloaded,result),reloaded);
  assert.equal(recordSchool(old,{...result,items:[]}).flowers,7);
});
test('invalid school rows never destroy legacy data or invent performance',()=>{
  const saved=readSaved(JSON.stringify({flowers:12,completed:['p'],school:{history:[result,{...result,id:'bad',items:[{...result.items[0],attempts:-1}]}]}}));
  assert.equal(saved.flowers,12);assert.equal(saved.school.history.length,1);
  assert.equal(readSchool({history:[{...result,lesson:1}]}).history.length,0);
  assert.equal(readSchool({history:[{...result,items:[{...result.items[0],id:'unknown'}]}]}).history.length,0);
});
test('review prioritizes a supported item without excluding the other lesson words',()=>{
  const history=[{...result,items:[{id:'pile',skill:'spelling',attempts:2,help:true,paper:false}]}];
  const items=chooseItems(lessons.find(l=>l.id===9),history);
  assert.equal(items[0].id,'pile');assert.equal(new Set(items.map(i=>i.id)).size,items.length);
});
test('all lesson words have authored spelling and only lesson-owned items can earn results',()=>{
  for(const lesson of lessons)for(const item of lesson.words){assert.equal(item.tiles.join(''),item.text);assert.ok(item.hint);assert.ok(findItem(lesson.id,item.id));}
  assert.equal(recordSchool(readSaved(null),{...result,items:[{...result.items[0],id:'jupe'}]}).flowers,0);
});
test('guided models identify silent parts before asking the child to blend',()=>{
  const models=lessons.find(l=>l.id===10).blends;
  assert.deepEqual(models.find(i=>i.text==='pot').silentParts,[2]);
  assert.deepEqual(models.find(i=>i.text==='pomme').silentParts,[3]);
});
test('challenge practice rotates mastered words and preserves its reward after reload',()=>{
  const lesson=lessons.find(l=>l.id===11);
  const first=chooseItems(lesson,[],'challenge');
  assert.equal(first.length,3);
  assert.ok(first.every(w=>w.text.length>=5));
  const session={...result,id:'challenge-1',lesson:11,mode:'challenge',items:first.map(w=>({id:w.id,skill:'spelling',attempts:1,help:false,paper:false}))};
  const saved=readSaved(JSON.stringify(recordSchool(readSaved(null),session)));
  assert.equal(saved.flowers,1);
  assert.equal(saved.school.history[0].mode,'challenge');
  assert.ok(!first.some(w=>w.id===chooseItems(lesson,saved.school.history,'challenge')[0].id));
  assert.equal(recordSchool(saved,session).flowers,1);
});
