import { topics, modes } from './content.js';
import {pronunciationText} from './pronunciation.js';
import {pictures, pictureWords, ambiguousPictures} from './pictures.js';
export const initialSession = () => ({correct:0, firstTry:0, attempts:0, mistakes:0, hintUsed:false, solved:false, feedback:'', choice:null});
export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for(let i=copy.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
  return copy;
}
export function createQuestions(topicId, mode, level, random = Math.random) {
  const topic = topics.find(t=>t.id===topicId);
  if (!topic || !['observe','listen','read','picture','caterpillar'].includes(mode) || !['syllables','words','challenge'].includes(level)) throw new Error('Exercice inconnu');
  if(mode==='picture' || mode==='caterpillar' || (mode!=='observe' && level!=='syllables')) {
    const allWords=Object.keys(pictures);
    const pool=shuffle(level==='challenge'?allWords:pictureWords[topicId],random).slice(0,level==='challenge'?8:5);
    return pool.map((word,index)=>{
      const near=pictures[word].near.filter(w=>w!==word && (mode!=='picture' || pictures[w]));
      const needed=level==='challenge'?5:3;
      const alternatives=[...new Set([...shuffle(near,random),...shuffle(allWords.filter(w=>w!==word),random)])].filter(w=>mode!=='picture'||!ambiguousPictures(word,w)).slice(0,needed);
      return {id:`${topicId}-${mode}-${level}-${index}`,kind:mode,answer:word,target:word,spoken:word,options:shuffle([word,...alternatives],random),hint:`Écoute le mot, puis regarde bien chaque proposition.`};
    });
  }
  const family = topics.filter(t=>t.family===topic.family && t.id!==topic.id);
  const pool = shuffle(level==='words' ? topic.words : topic.syllables, random);
  return pool.map((value,index)=> {
    const answer = mode==='observe' ? topic.id : value;
    const alternatives = mode==='observe' ? family.map(t=>t.id) : family.flatMap(t=>level==='words'?t.words:t.syllables);
    const sounds=new Set([pronunciationText(answer)]);
    const distractors = shuffle([...new Set(alternatives.filter(v=>v!==answer))], random).filter(v=>{
      if(mode==='observe')return true;
      const sound=pronunciationText(v);if(sounds.has(sound))return false;sounds.add(sound);return true;
    }).slice(0,3);
    return {id:`${topicId}-${mode}-${level}-${index}`, answer, options:shuffle([answer,...distractors],random), spoken:mode==='observe'?`Retrouve ${topic.id}, comme dans ${topic.word}.`:value, hint:mode==='observe'?topic.tip:`Lis doucement : ${value}. Tu peux aussi écouter.`, target:mode==='observe'?topic.id:value};
  });
}
export function answerQuestion(state, question, choice) {
  if(state.solved || !question.options.includes(choice)) return state;
  const solved = choice===question.answer;
  return {...state,choice,solved,attempts:state.attempts+1,correct:state.correct+(solved?1:0),firstTry:state.firstTry+(solved&&!state.mistakes&&!state.hintUsed?1:0),mistakes:state.mistakes+(solved?0:1),feedback:solved?'Bien joué ! Tu l’as trouvé.':'Tu peux essayer encore. Prends ton temps.'};
}
function validResult(r){
  return r && typeof r.id==='string' && r.id.length>0 && r.id.length<=100 && modes.some(m=>m.id===r.mode) && ['syllables','words','challenge'].includes(r.level) && (r.topic==='mix'||topics.some(t=>t.id===r.topic)) && [5,8].includes(r.total) && Number.isInteger(r.firstTry) && r.firstTry>=0 && r.firstTry<=r.total && Number.isSafeInteger(r.attempts) && r.attempts>=r.total && typeof r.completedAt==='string' && Number.isFinite(Date.parse(r.completedAt));
}
const cleanResult=r=>({id:r.id,mode:r.mode,level:r.level,topic:r.topic,total:r.total,firstTry:r.firstTry,attempts:r.attempts,completedAt:r.completedAt});
export function readSaved(raw) {
  const empty={flowers:0, completed:[],history:[]};
  try {
    const data=JSON.parse(raw);
    if(!data || !Number.isSafeInteger(data.flowers) || data.flowers<0) return empty;
    const seen=new Set();
    const history=Array.isArray(data.history)?data.history.filter(r=>{if(!validResult(r)||seen.has(r.id))return false;seen.add(r.id);return true;}).slice(-100).map(cleanResult):[];
    return {flowers:data.flowers,completed:Array.isArray(data.completed)?[...new Set(data.completed.filter(id=>topics.some(t=>t.id===id)))]:[],history};
  } catch {return empty;}
}
export function recordSession(progress,result){
  if(!validResult(result)||progress.history?.some(r=>r.id===result.id))return progress;
  return {flowers:progress.flowers+1,completed:result.topic==='mix'?[...progress.completed]:[...new Set([...progress.completed,result.topic])],history:[...(progress.history||[]),cleanResult(result)].slice(-100)};
}
