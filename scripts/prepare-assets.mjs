import {mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {topics} from '../src/content.js';
import {pictures} from '../src/pictures.js';
import {pronunciationText} from '../src/pronunciation.js';
const texts=[...new Set([
  ...topics.flatMap(t=>[t.word,t.tip,t.cue,...t.syllables,...t.words]),
  ...Object.keys(pictures),...Object.values(pictures).flatMap(p=>p.near),
  'Écoute le mot, puis regarde bien chaque proposition.',
])];
mkdirSync('artifacts',{recursive:true});
writeFileSync('artifacts/asset-plan.json',JSON.stringify({audio:texts.map(text=>({text,spoken:pronunciationText(text),file:createHash('sha1').update(text).digest('hex').slice(0,16)+'.mp3'})),pictures:[...new Set(Object.values(pictures).map(p=>p.code))]},null,2));
console.log(`${texts.length} clips, ${Object.keys(pictures).length} dessins.`);
