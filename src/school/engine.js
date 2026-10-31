import {lessons,findItem} from './content.js';

export function checkSpelling(item,tiles){
  const locked=item.tiles.map((letter,i)=>letter===String(tiles[i]??'').normalize('NFC').toLocaleLowerCase('fr'));
  return {correct:tiles.length===item.tiles.length&&locked.every(Boolean),locked,firstMismatch:locked.indexOf(false)};
}
function validResult(r){
  const lesson=lessons.find(l=>l.id===r?.lesson);
  return !!lesson&&typeof r.id==='string'&&r.id.length>0&&r.id.length<=100&&
    ['lesson','dictation','paper','challenge','long','story'].includes(r.mode)&&typeof r.completedAt==='string'&&Number.isFinite(Date.parse(r.completedAt))&&
    Array.isArray(r.items)&&r.items.length>0&&r.items.length<=30&&
    new Set(r.items.map(i=>`${i?.id}:${i?.skill}`)).size===r.items.length&&
    (r.mode!=='story'||(r.items.length===2&&lesson.story.questions.every(q=>r.items.some(i=>i?.id===q.id&&i.skill==='comprehension'&&!i.paper))))&&
    r.items.every(i=>{const item=findItem(r.lesson,i?.id);return item&&
      ['blending','comprehension','spelling'].includes(i.skill)&&
      (i.skill==='spelling'?[...lesson.words,...lesson.challenge.words].some(w=>w.id===i.id):i.skill==='comprehension'?[lesson.sentence,...lesson.challenge.readings,...lesson.story.questions].some(w=>w.id===i.id):lesson.blends.some(b=>b.id===i.id))&&
      Number.isInteger(i.attempts)&&i.attempts>=1&&i.attempts<=1000&&typeof i.help==='boolean'&&typeof i.paper==='boolean'&&
      (!i.paper||(i.skill==='spelling'&&i.help));});
}
const clean=r=>({id:r.id,lesson:r.lesson,mode:r.mode,completedAt:r.completedAt,items:r.items.map(({id,skill,attempts,help,paper})=>({id,skill,attempts,help,paper}))});
export function readSchool(data){
  const seen=new Set();
  const history=Array.isArray(data?.history)?data.history.filter(r=>{if(!validResult(r)||seen.has(r.id))return false;seen.add(r.id);return true;}).slice(-100).map(clean):[];
  // Keep rewarded IDs beyond the bounded detail history to prevent replay rewards.
  const rewarded=Array.isArray(data?.rewarded)?data.rewarded.filter(id=>typeof id==='string'&&id.length>0&&id.length<=100):[];
  return {version:1,history,rewarded:[...new Set([...rewarded,...history.map(r=>r.id)])]};
}
export function recordSchool(progress,result){
  if(!validResult(result))return progress;
  const school=readSchool(progress.school);
  if(school.rewarded.includes(result.id))return progress;
  return {...progress,flowers:progress.flowers+1,school:{version:1,history:[...school.history,clean(result)].slice(-100),rewarded:[...school.rewarded,result.id]}};
}
export function chooseItems(lesson,history=[],mode){
  const last=new Map();
  for(const r of history)if(r.lesson===lesson.id)for(const i of r.items)if(i.skill==='spelling')last.set(i.id,i);
  const rank=item=>{const r=last.get(item.id);return !r?1:r.help||r.attempts>1?0:2;};
  const pool=mode==='long'?[...lesson.words,...lesson.challenge.words]:mode==='challenge'?lesson.challenge.words:lesson.words;
  const ranked=[...pool].sort((a,b)=>rank(a)-rank(b));
  const seen=new Set();
  return ranked.filter(item=>{if(seen.has(item.text))return false;seen.add(item.text);return true;}).slice(0,mode==='long'?6:3);
}
export function buildSteps(lesson,history=[],mode='lesson'){
  if(mode==='story')return lesson.story.questions.map(item=>({kind:'story',item}));
  const words=chooseItems(lesson,history,mode);
  const dictation=item=>({kind:'dictation',item});
  if(mode==='long')return lesson.blends.flatMap((item,i)=>[
    {kind:'blend',item},
    {kind:'read',item:[lesson.sentence,...lesson.challenge.readings][i]},
    ...words.slice(i*2,i*2+2).map(dictation),
  ]);
  if(mode==='challenge')return [{kind:'read',item:lesson.challenge.readings[0]},...words.slice(0,2).map(dictation),{kind:'read',item:lesson.challenge.readings[1]},dictation(words[2])];
  return [...(mode==='lesson'?[...lesson.blends.map(item=>({kind:'blend',item})),{kind:'read',item:lesson.sentence}]:[]),...words.map(dictation)];
}
export function summarizeLesson(lessonId,history=[]){
  const records=new Map();
  for(const session of history)if(session.lesson===lessonId)for(const item of session.items)records.set(`${item.skill}:${item.id}`,item);
  return [...records.values()];
}
