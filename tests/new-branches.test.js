import test from 'node:test';
import assert from 'node:assert/strict';
import {topics,families} from '../src/content.js';
import {pictureWords} from '../src/pictures.js';
import {createQuestions} from '../src/game.js';
import {pronunciationText} from '../src/pronunciation.js';

test('au, eau, g and j have five illustrated words and belong to the map',()=>{
  for(const id of ['au','eau','g','j']){
    assert.ok(topics.some(t=>t.id===id));
    assert.ok(families.some(f=>f.letters.includes(id)));
    assert.equal(pictureWords[id].length,5);
    assert.ok(pictureWords[id].every(w=>w.includes(id)));
    for(const mode of ['picture','caterpillar'])assert.equal(createQuestions(id,mode,'words').length,5);
  }
});
test('syllable listening and reading never oppose homophones such as pau and peau',()=>{
  for(const id of ['au','eau'])for(const mode of ['listen','read'])for(let n=0;n<40;n++){
    for(const q of createQuestions(id,mode,'syllables')){
      const sounds=q.options.map(pronunciationText);
      assert.equal(new Set(sounds).size,sounds.length,`${id}: ${q.options}`);
      assert.equal(q.options.length,4);
    }
  }
});
