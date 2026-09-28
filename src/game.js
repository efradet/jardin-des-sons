import { topics } from './content.js';
export const initialSession = () => ({correct:0, solved:false, feedback:'', choice:null});
export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for(let i=copy.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; }
  return copy;
}
export function createQuestions(topicId, mode, level, random = Math.random) {
  const topic = topics.find(t=>t.id===topicId);
  if (!topic || !['observe','listen','read'].includes(mode) || !['syllables','words'].includes(level)) throw new Error('Exercice inconnu');
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
  return {...state,choice,solved,correct:state.correct+(solved?1:0),feedback:solved?'Bien joué ! Tu l’as trouvé.':'Tu peux essayer encore. Prends ton temps.'};
}
export function readSaved(raw) {
  const empty={flowers:0, completed:[]};
  try {
    const data=JSON.parse(raw);
    if(!data || !Number.isSafeInteger(data.flowers) || data.flowers<0) return empty;
    return {flowers:data.flowers,completed:Array.isArray(data.completed)?[...new Set(data.completed.filter(id=>topics.some(t=>t.id===id)))]:[]};
  } catch {return empty;}
}
