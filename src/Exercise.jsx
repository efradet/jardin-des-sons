import React,{useEffect,useRef,useState} from 'react';
import {ArrowRight,Volume2,Lightbulb,Check,Sprout,RotateCcw} from 'lucide-react';
import Modal from './Modal.jsx';
import {createQuestions,initialSession,answerQuestion} from './game.js';
import {canSpeak,speak,silence} from './audio.js';
import {modes} from './content.js';
import {pictures} from './pictures.js';
import Caterpillar from './Caterpillar.jsx';

export default function Exercise({topic,mode,level,onClose,onComplete}){
  const [questions]=useState(()=>createQuestions(topic.id,mode,level));
  const [index,setIndex]=useState(0);
  const [state,setState]=useState(()=>({...initialSession(),hintUsed:!canSpeak()&&['listen','read','caterpillar'].includes(mode)}));
  const [hint,setHint]=useState(false);
  const [done,setDone]=useState(false);
  const [audioError,setAudioError]=useState(!canSpeak());
  const [heard,setHeard]=useState(false);
  const [loading,setLoading]=useState(false);
  const rewarded=useRef(false);
  const [sessionId]=useState(()=>`session-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`);
  const nextRef=useRef(null);
  const instructionRef=useRef(null);
  const q=questions[index];
  const pictureMode=mode==='picture';
  const caterpillarMode=mode==='caterpillar';
  const listeningMode=mode==='listen'||caterpillarMode;
  const total=questions.length;
  const say=text=>speak(text,()=>{setAudioError(true);setState(s=>({...s,hintUsed:true}));});
  useEffect(()=>()=>silence(),[]);
  useEffect(()=>{if(state.solved)nextRef.current?.focus();},[state.solved]);
  useEffect(()=>{if(index>0)instructionRef.current?.focus();},[index]);
  function next(){
    silence();
    if(index===total-1){setDone(true);if(!rewarded.current){rewarded.current=true;onComplete({id:sessionId,topic:level==='challenge'&&mode!=='observe'?'mix':topic.id,mode,level,total,firstTry:state.firstTry,attempts:state.attempts,completedAt:new Date().toISOString()});}return;}
    setIndex(i=>i+1);setState(s=>({...s,solved:false,choice:null,feedback:'',mistakes:0,hintUsed:audioError&&['listen','read','caterpillar'].includes(mode)}));
    setHint(false);setHeard(false);setLoading(false);
  }
  async function listen(){setLoading(true);const started=await say(q.spoken);setLoading(false);if(started)setHeard(true);}
  function help(){setHint(v=>!v);if(!state.solved)setState(s=>({...s,hintUsed:true}));}
  function hearPicture(){if(!state.solved)setState(s=>({...s,hintUsed:true}));return say(q.spoken);}
  const instruction=caterpillarMode?'Écoute le mot. Choisis-le pour avancer !':pictureMode?'Lis ou écoute le mot. Quel dessin lui correspond ?':mode==='observe'?'Retrouve cette lettre.':listeningMode?'Écoute et retrouve ce que tu entends.':'Lis, puis écoute les choix. Lequel correspond ?';
  const selectionLabel=level==='challenge'&&mode!=='observe'?'toutes les branches':topic.id;
  return <Modal title={done?'Une fleur pour toi !':`${modes.find(m=>m.id===mode).name} · ${selectionLabel}`} onClose={onClose} className={`exercise-modal ${pictureMode?'picture-modal':''} ${caterpillarMode?'caterpillar-modal':''}`}>
    {done?<div className="celebration"><div className="reward-flower" aria-hidden="true">🌻</div><span className="eyebrow">TA PETITE VICTOIRE</span><h3>Bravo Elisabeth !</h3><p>Tu as terminé tes {total} défis.<br/>Une nouvelle fleur pousse dans ton jardin.</p><div className="session-result"><strong>{state.firstTry} / {total}</strong><span>trouvés du premier coup, sans indice</span></div><p className="result-kind">Chaque essai t’aide à apprendre.</p><button className="primary" autoFocus onClick={onClose}><Sprout size={20}/> Retour au jardin</button></div>:<>
      <div className="exercise-progress"><span>Défi {index+1} sur {total}</span><div aria-label={`${index} défis terminés sur ${total}`} className="progress-dots">{questions.map((_,i)=><span key={i} className={i<index?'complete':i===index?'current':''}>{i<index?<Check size={14}/>:''}</span>)}</div><span>À ton rythme</span></div>
      <h3 ref={instructionRef} tabIndex={-1} className="instruction">{instruction}</h3>
      {caterpillarMode&&<Caterpillar steps={total} eaten={state.correct} wrong={state.choice!==null&&!state.solved} solved={state.solved}/>}
      <div className="prompt-area">
        {listeningMode&&!audioError?<button className="listen-button" disabled={loading} onClick={listen}><Volume2 size={32}/>{loading?'Préparation…':heard?'Écouter encore':'Écouter'}</button>:<div className={`reading-target ${mode==='observe'?'letter-target':''}`}>{q.target}</div>}
        {mode==='observe'&&<small>comme dans <strong>{topic.word}</strong></small>}
        {mode==='read'&&<small>Lis à voix haute, puis choisis le bon son.</small>}
        {pictureMode&&<button className="sound-button picture-listen" onClick={hearPicture}><Volume2 size={20}/> Écouter le mot</button>}
      </div>
      {audioError&&<p className="audio-note" role="status">L’enregistrement n’a pas pu être lu. Vérifie le son ou la connexion, ou lis avec un adulte.<button className="text-button" onClick={()=>setAudioError(false)}>Réessayer l’audio</button></p>}
      <div className={`answers ${pictureMode?'picture-answers':''} ${q.options.length===6?'six-choices':''} ${mode==='read'&&!audioError?'audio-answers':''}`}>
        {q.options.map((option,i)=><div className="answer-wrap" key={option}>
          {mode==='read'&&!audioError&&<button className="option-audio" aria-label={`Écouter le choix ${i+1}`} onClick={()=>say(option)}><Volume2 size={21}/> Son {i+1}</button>}
          <button className={`answer ${pictureMode?'picture-answer':''} ${state.choice===option?(state.solved?'right':'retry'):''}`} disabled={state.solved||(listeningMode&&!heard&&!audioError)} onClick={()=>setState(s=>answerQuestion(s,q,option))} aria-label={pictureMode?`Dessin ${i+1} : ${option}`:mode==='read'&&!audioError?`Choisir le son ${i+1}`:undefined}>
            {pictureMode?<><img src={pictures[option].src} alt="" draggable={false}/><span className="picture-number">{i+1}</span></>:mode==='read'&&!audioError?`Choisir ${i+1}`:option}
            {state.solved&&state.choice===option&&<Check size={22}/>}
          </button>
        </div>)}
      </div>
      <div className={`feedback ${state.solved?'success':''}`} role="status" aria-live="polite">{state.feedback||'Tu peux prendre tout le temps qu’il te faut.'}</div>
      {state.solved&&mode!=='observe'&&<button className="sound-button answer-replay" onClick={()=>say(q.answer)}><Volume2 size={19}/> Écouter « {q.answer} »</button>}
      {hint&&<div className="hint">{pictureMode?'Tu peux écouter le mot pour t’aider.':q.hint}<button className="text-button" onClick={()=>say(mode==='observe'?topic.tip:q.answer)}><Volume2 size={18}/> Écouter l’aide</button></div>}
      <div className="exercise-footer"><button className="text-button" onClick={help} aria-expanded={hint}><Lightbulb size={19}/>{hint?'Masquer l’aide':'Un petit indice'}</button>{state.solved?<button ref={nextRef} className="primary" onClick={next}>{index===total-1?'Cueillir ma fleur':'Défi suivant'}<ArrowRight size={19}/></button>:<span className="soft-note"><RotateCcw size={15}/> On a le droit d’essayer !</span>}</div>
      {(pictureMode||caterpillarMode)&&<p className="illustration-credit">Dessins : <a href="https://openmoji.org/" target="_blank" rel="noreferrer">OpenMoji</a> · CC BY-SA 4.0</p>}
    </>}
  </Modal>;
}
