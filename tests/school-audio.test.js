import test from 'node:test';
import assert from 'node:assert/strict';
import {createSchoolPlayer,tokenizeStory} from '../src/school/audio.js';
import {readFileSync,statSync} from 'node:fs';
import {lessons,instructions} from '../src/school/content.js';

function harness(){
  const audio=[];
  const player=createSchoolPlayer(key=>key==='missing'?null:'/clip.mp3',()=>{const a={play:()=>Promise.resolve(),pause(){},removeAttribute(){},load(){}};audio.push(a);return a;});
  return {player,audio};
}
test('dictation becomes available only on completed audio, never just playback start',async()=>{
  const {player,audio}=harness();let resolved=false;const pending=player.play('word').then(ok=>{resolved=true;return ok;});
  audio[0].onplaying?.();await Promise.resolve();assert.equal(resolved,false);
  audio[0].onended();assert.equal(await pending,true);
});
test('stop and replacement settle old requests without stale completion',async()=>{
  const {player,audio}=harness();const first=player.play('one');const ended=audio[0].onended;
  const second=player.play('two');assert.equal(await first,false);ended();
  player.stop();assert.equal(await second,false);
});
test('missing and failed clips cannot count as heard dictation',async()=>{
  const {player,audio}=harness();assert.equal(await player.play('missing'),false);
  const pending=player.play('word');audio[0].onerror();assert.equal(await pending,false);
});
test('every school model, instruction and hint has a nonempty bundled recording',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../src/school/audio-manifest.json',import.meta.url)));
  const required=new Set(Object.values(instructions));
  for(const lesson of lessons){
    [lesson.intro,lesson.note,lesson.anchor,lesson.sentence.text,lesson.sentence.question,...lesson.sentence.chunks,...lesson.sentence.options].forEach(t=>required.add(t));
    for(const r of lesson.challenge.readings) [r.text,r.question,...r.chunks,...r.options].forEach(t=>required.add(t));
    for(const item of [...lesson.blends,...lesson.words,...lesson.challenge.words]){required.add(item.text);required.add(item.hint);}
    for(const line of [lesson.story.title,...lesson.story.paragraphs])for(const token of tokenizeStory(line))if(token.word)required.add(token.word);
    if(lesson.story.adultIntro)required.add(lesson.story.adultIntro);
    for(const q of lesson.story.questions)[q.question,...q.options].forEach(t=>required.add(t));
  }
  for(const text of required){assert.ok(manifest[text],text);assert.ok(statSync(new URL('../public'+manifest[text],import.meta.url)).size>1000,text);}
});
