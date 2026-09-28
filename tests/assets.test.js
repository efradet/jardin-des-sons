import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {topics} from '../src/content.js';
import {pictures} from '../src/pictures.js';
import {createQuestions,initialSession,answerQuestion} from '../src/game.js';
const clips=JSON.parse(readFileSync(new URL('../src/audio-manifest.json',import.meta.url)));
test('all playable sounds have non-empty local recordings',()=>{
  const vocabulary=new Set(topics.flatMap(t=>[t.word,t.tip,...t.syllables,...t.words]));
  for(const t of topics)for(const mode of ['picture','listen','read'])for(const level of ['syllables','words','challenge'])for(const q of createQuestions(t.id,mode,level)){vocabulary.add(q.spoken);q.options.forEach(w=>vocabulary.add(w));}
  for(const word of vocabulary){assert.ok(clips[word],`No recording: ${word}`);assert.ok(statSync(new URL('../public'+clips[word],import.meta.url)).size>1000);}
});
test('all drawings are local SVG files with no scripts or remote resources',()=>{
  for(const pic of Object.values(pictures)){
    const svg=readFileSync(new URL('../public'+pic.src,import.meta.url),'utf8');
    assert.match(svg,/<svg[\s>]/);assert.doesNotMatch(svg,/<script|<foreignObject|(?:href|src)=["']https?:/i);
  }
});
test('first-try feedback distinguishes retries and clues from independent reading',()=>{
  const q=createQuestions('p','picture','words')[0];
  assert.equal(answerQuestion(initialSession(),q,q.answer).firstTry,1);
  const wrong=answerQuestion(initialSession(),q,q.options.find(v=>v!==q.answer));
  assert.equal(answerQuestion(wrong,q,q.answer).firstTry,0);
  assert.equal(answerQuestion({...initialSession(),hintUsed:true},q,q.answer).firstTry,0);
});
