import test from 'node:test';
import assert from 'node:assert/strict';
import {topics} from '../src/content.js';
import {createQuestions} from '../src/game.js';
import {pictures, pictureWords, ambiguousPictures} from '../src/pictures.js';
import {pronunciationText} from '../src/pronunciation.js';

test('reported ambiguous syllables use explicit French homophones',()=>{
  assert.equal(pronunciationText('vai'),'vais');
  assert.equal(pronunciationText('vo'),'veau');
  assert.equal(pronunciationText('voi'),'voix');
  assert.equal(pronunciationText('vélo'),'vélo');
});
test('every branch offers five illustrated words with four distinct drawings',()=>{
  for(const topic of topics) {
    assert.equal(pictureWords[topic.id].length,5);
    const qs=createQuestions(topic.id,'picture','words',()=>.4);
    assert.equal(qs.length,5);
    assert.equal(new Set(qs.map(q=>q.answer)).size,5);
    for(const q of qs){
      assert.equal(q.kind,'picture');
      assert.equal(q.target,q.answer);
      assert.equal(q.options.length,4);
      assert.equal(new Set(q.options.map(o=>pictures[o].code)).size,4);
      assert.ok(q.options.includes(q.answer));
    }
  }
});
test('challenge sessions mix branches and offer six options',()=>{
  const qs=createQuestions('p','picture','challenge',()=>.4);
  assert.equal(qs.length,8);
  assert.ok(qs.some(q=>!pictureWords.p.includes(q.answer)));
  for(const q of qs) assert.equal(q.options.length,6);
});
test('word listening uses at least one supplied close distractor',()=>{
  for(const q of createQuestions('p','listen','words',()=>.4)) {
    assert.ok(q.options.some(o=>pictures[q.answer].near.includes(o)));
  }
});
test('drawings never reject a valid animal category or another picture of food',()=>{
  for(let seed=1;seed<=60;seed++){
    let state=seed;
    const random=()=>((state=(state*1664525+1013904223)>>>0)/4294967296);
    for(const topic of topics)for(const q of createQuestions(topic.id,'picture','challenge',random)) {
      for(const choice of q.options.filter(o=>o!==q.answer))assert.ok(!ambiguousPictures(q.answer,choice),`${q.answer}/${choice}`);
    }
  }
});
