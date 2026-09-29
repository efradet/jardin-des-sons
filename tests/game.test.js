import test from 'node:test';
import assert from 'node:assert/strict';
import { topics } from '../src/content.js';
import { createQuestions, answerQuestion, initialSession, readSaved } from '../src/game.js';

test('all requested graphemes have a five-question session in every mode and level', () => {
  assert.deepEqual(topics.map(t => t.id), ['p','b','d','q','f','v','e','é','ai','oi','ou','au','eau','g','j']);
  for (const topic of topics) for (const mode of ['observe','listen','read']) for (const level of ['syllables','words']) {
    const questions = createQuestions(topic.id, mode, level, () => .4);
    assert.equal(questions.length, 5);
    assert.equal(new Set(questions.map(q => q.id)).size, 5);
    for (const q of questions) {
      assert.ok(q.options.includes(q.answer));
      assert.equal(new Set(q.options).size, q.options.length);
      assert.ok(q.spoken && q.hint);
    }
  }
});
test('wrong answers do not advance and correct answers cannot be scored twice', () => {
  const q = createQuestions('p', 'observe', 'syllables', () => .4)[0];
  const initial = initialSession();
  const wrong = answerQuestion(initial, q, q.options.find(o => o !== q.answer));
  assert.equal(wrong.correct, 0);
  assert.equal(wrong.solved, false);
  const good = answerQuestion(wrong, q, q.answer);
  assert.equal(good.correct, 1);
  assert.equal(good.solved, true);
  assert.deepEqual(answerQuestion(good, q, q.answer), good);
});
test('q decoding uses qu; e is not represented as having one universal sound', () => {
  assert.ok(topics.find(t => t.id === 'q').syllables.every(s => s.startsWith('qu')));
  assert.match(topics.find(t => t.id === 'e').tip, /change|plusieurs|différent/);
});
test('corrupt and ill-shaped local data fall back without breaking the app', () => {
  for (const raw of ['{', 'null', '42', '{"flowers":-2}', '{"flowers":"lots"}']) assert.equal(readSaved(raw).flowers, 0);
  assert.equal(readSaved('{"flowers":3,"completed":["p"]}').flowers, 3);
});
