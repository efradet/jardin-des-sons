import fs from 'node:fs';
import crypto from 'node:crypto';
import {lessons,instructions} from '../src/school/content.js';
import {pronunciationText} from '../src/pronunciation.js';
import {tokenizeStory} from '../src/school/audio.js';
const existing=JSON.parse(fs.readFileSync('src/audio-manifest.json','utf8'));
const text=new Set(Object.values(instructions));
for(const lesson of lessons){
  [lesson.intro,lesson.note,lesson.anchor,lesson.sentence.text,lesson.sentence.question,...lesson.sentence.chunks,...lesson.sentence.options].forEach(t=>text.add(t));
  for(const r of lesson.challenge.readings) [r.text,r.question,...r.chunks,...r.options].forEach(t=>text.add(t));
  for(const item of [...lesson.blends,...lesson.words,...lesson.challenge.words]){text.add(item.text);text.add(item.hint);}
  for(const line of [lesson.story.title,...lesson.story.paragraphs])for(const token of tokenizeStory(line))if(token.word)text.add(token.word);
  if(lesson.story.adultIntro)text.add(lesson.story.adultIntro);
  for(const q of lesson.story.questions)[q.question,...q.options].forEach(t=>text.add(t));
}
const overrides={ap:'appe',jo:'Jo',ao:'a, o',oa:'o, a',aa:'a, a',oo:'o, o',aoa:'a, o, a',lala:'la, la',at:'atte',ac:'aque',co:'co',nui:'nuit'};
const entries=[...text].map(key=>({key,spoken:overrides[key]??pronunciationText(key),file:crypto.createHash('sha256').update(key).digest('hex').slice(0,18)+'.mp3'}));
fs.mkdirSync('artifacts',{recursive:true});
fs.writeFileSync('artifacts/school-audio-plan.json',JSON.stringify(entries.filter(e=>!existing[e.key]),null,2));
fs.writeFileSync('src/school/audio-manifest.json',JSON.stringify(Object.fromEntries(entries.map(e=>[e.key,existing[e.key]??'/audio/school/'+e.file])),null,2)+'\n');
console.log(`${entries.length} school clips; ${entries.filter(e=>!existing[e.key]).length} new recordings.`);
