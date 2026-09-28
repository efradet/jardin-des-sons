import test from 'node:test';
import assert from 'node:assert/strict';
import {createQuestions,initialSession,answerQuestion,readSaved,recordSession} from '../src/game.js';
const result={id:'session-1',mode:'caterpillar',level:'words',topic:'p',total:5,firstTry:4,attempts:6,completedAt:'2026-09-28T20:00:00.000Z'};
test('caterpillar uses whole recorded words even at the syllable level',()=>{
  for(const level of ['syllables','words','challenge']){
    const questions=createQuestions('p','caterpillar',level,()=>.4);
    assert.equal(questions.length,level==='challenge'?8:5);
    assert.ok(questions.every(q=>q.answer.length>1 && q.options.includes(q.answer)));
  }
});
test('a wrong answer leaves caterpillar in place and a right answer advances only once',()=>{
  const q=createQuestions('p','caterpillar','words')[0];
  const wrong=answerQuestion(initialSession(),q,q.options.find(w=>w!==q.answer));
  assert.equal(wrong.correct,0);
  const right=answerQuestion(wrong,q,q.answer);
  assert.equal(right.correct,1);assert.equal(right.attempts,2);
  assert.deepEqual(answerQuestion(right,q,q.answer),right);
});
test('legacy flowers survive migration and completed results survive JSON reload',()=>{
  const old=readSaved('{"flowers":7,"completed":["b"]}');
  assert.deepEqual(old.history,[]);
  const updated=recordSession(old,result);
  assert.equal(updated.flowers,8);assert.equal(updated.history[0].firstTry,4);
  assert.deepEqual(readSaved(JSON.stringify(updated)),updated);
  assert.deepEqual(recordSession(updated,result),updated);
});
test('bad historical rows are discarded while valid flowers are preserved',()=>{
  const data=readSaved(JSON.stringify({flowers:9,completed:['p'],history:[result,{...result,id:'bad',firstTry:20},{...result,id:'bad2',completedAt:'not a date'}]}));
  assert.equal(data.flowers,9);assert.equal(data.history.length,1);
  assert.deepEqual(recordSession(data,{...result,id:'new',attempts:-1}),data);
});
