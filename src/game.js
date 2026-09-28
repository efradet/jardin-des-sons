import { topics } from './content.js';
import {pictures, pictureWords, ambiguousPictures} from './pictures.js';
export const initialSession = () => ({correct:0, firstTry:0, mistakes:0, hintUsed:false, solved:false, feedback:'', choice:null});
export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for(let i=copy.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
  return copy;
}
export function createQuestions(topicId, mode, level, random = Math.random) {
  const topic = topics.find(t=>t.id===topicId);
  if (!topic || !['observe','listen','read','picture'].includes(mode) || !['syllables','words','challenge'].includes(level)) throw new Error('Exercice inconnu');
  if(mode==='picture' || (mode!=='observe' && level!=='syllables')) {
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
    const distractors = shuffle([...new Set(alternatives.filter(v=>v!==answer))], random).slice(0,3);
    return {id:`${topicId}-${mode}-${level}-${index}`, answer, options:shuffle([answer,...distractors],random), spoken:mode==='observe'?`Retrouve ${topic.id}, comme dans ${topic.word}.`:value, hint:mode==='observe'?topic.tip:`Lis doucement : ${value}. Tu peux aussi écouter.`, target:mode==='observe'?topic.id:value};
  });
}
export function answerQuestion(state, question, choice) {
  if(state.solved || !question.options.includes(choice)) return state;
  const solved = choice===question.answer;
  return {...state,choice,solved,correct:state.correct+(solved?1:0),firstTry:state.firstTry+(solved&&!state.mistakes&&!state.hintUsed?1:0),mistakes:state.mistakes+(solved?0:1),feedback:solved?'Bien joué ! Tu l’as trouvé.':'Tu peux essayer encore. Prends ton temps.'};
}
export function readSaved(raw) {
  const empty={flowers:0, completed:[]};
  try {
    const data=JSON.parse(raw);
    if(!data || !Number.isSafeInteger(data.flowers) || data.flowers<0) return empty;
    return {flowers:data.flowers,completed:Array.isArray(data.completed)?[...new Set(data.completed.filter(id=>topics.some(t=>t.id===id)))]:[]};
  } catch {return empty;}
}
