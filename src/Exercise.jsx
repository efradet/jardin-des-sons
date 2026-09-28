import React, {useEffect, useRef, useState} from 'react';
import {ArrowRight, Volume2, Lightbulb, Check, Sprout, RotateCcw} from 'lucide-react';
import Modal from './Modal.jsx';
import {createQuestions, initialSession, answerQuestion} from './game.js';
import {canSpeak, speak, silence} from './audio.js';
import {modes} from './content.js';

export default function Exercise({topic, mode, level, onClose, onComplete}) {
  const [questions]=useState(()=>createQuestions(topic.id,mode,level));
  const [index,setIndex]=useState(0);
  const [state,setState]=useState(initialSession);
  const [hint,setHint]=useState(false);
  const [done,setDone]=useState(false);
  const [audioError,setAudioError]=useState(!canSpeak());
  const [heard,setHeard]=useState(false);
  const [rewarded,setRewarded]=useState(false);
  const nextRef=useRef(null);
  const q=questions[index];
  const say=text=>speak(text,()=>setAudioError(true));
  useEffect(()=>()=>silence(),[]);
  useEffect(()=>{if(state.solved) nextRef.current?.focus();},[state.solved]);
  function next() {
    silence();
    if(index===4) {setDone(true); if(!rewarded){setRewarded(true);onComplete(topic.id);} return;}
    setIndex(i=>i+1);setState(s=>({...s,solved:false,choice:null,feedback:''}));setHint(false);setHeard(false);
  }
  const instruction=mode==='observe'?'Retrouve cette lettre.':mode==='listen'?'Écoute et retrouve ce que tu entends.':'Lis, puis écoute les choix. Lequel correspond ?';
  return <Modal title={done?'Une fleur pour toi !':`${modes.find(m=>m.id===mode).name} · ${topic.id}`} onClose={onClose} className="exercise-modal">
    {done ? <div className="celebration"><div className="reward-flower" aria-hidden="true">🌻</div><span className="eyebrow">TA PETITE VICTOIRE</span><h3>Bravo Elisabeth !</h3><p>Tu as terminé tes 5 défis.<br/>Une nouvelle fleur pousse dans ton jardin.</p><button className="primary" autoFocus onClick={onClose}><Sprout size={20}/> Retour au jardin</button></div> : <>
      <div className="exercise-progress"><span>Défi {index+1} sur 5</span><div aria-label={`${index} défis terminés sur 5`} className="progress-dots">{questions.map((_,i)=><span key={i} className={i<index?'complete':i===index?'current':''}>{i<index?<Check size={14}/>:''}</span>)}</div><span>À ton rythme</span></div>
      <h3 className="instruction">{instruction}</h3>
      <div className="prompt-area">
        {mode==='listen' && !audioError ? <button className="listen-button" onClick={()=>{say(q.spoken);setHeard(true);}}><Volume2 size={32}/>{heard?'Écouter encore':'Écouter'}</button> : <div className={`reading-target ${mode==='observe'?'letter-target':''}`}>{q.target}</div>}
        {mode==='observe'&&<small>comme dans <strong>{topic.word}</strong></small>}
        {mode==='read'&&<small>Lis à voix haute, puis choisis le bon son.</small>}
      </div>
      {audioError&&<p className="audio-note" role="status">La voix n’est pas disponible. Un adulte peut lire les propositions avec toi. Pour « J’écoute », il peut cacher le modèle.</p>}
      <div className={`answers ${mode==='read'&&!audioError?'audio-answers':''}`}>
        {q.options.map((option,i)=><div className="answer-wrap" key={option}>
          {mode==='read'&&!audioError&&<button className="option-audio" aria-label={`Écouter le choix ${i+1}`} onClick={()=>say(option)}><Volume2 size={21}/> Son {i+1}</button>}
          <button className={`answer ${state.choice===option?(state.solved?'right':'retry'):''}`} disabled={state.solved || (mode==='listen'&&!heard&&!audioError)} onClick={()=>setState(s=>answerQuestion(s,q,option))} aria-label={mode==='read'&&!audioError?`Choisir le son ${i+1}`:undefined}>{mode==='read'&&!audioError?`Choisir ${i+1}`:option}{state.solved&&state.choice===option&&<Check size={22}/>}</button>
        </div>)}
      </div>
      <div className={`feedback ${state.solved?'success':''}`} role="status" aria-live="polite">{state.feedback || 'Tu peux prendre tout le temps qu’il te faut.'}</div>
      {hint&&<div className="hint">{q.hint}<button className="text-button" onClick={()=>say(mode==='observe'?topic.tip:q.answer)}><Volume2 size={18}/> Écouter l’aide</button></div>}
      <div className="exercise-footer"><button className="text-button" onClick={()=>setHint(v=>!v)} aria-expanded={hint}><Lightbulb size={19}/>{hint?'Masquer l’aide':'Un petit indice'}</button>{state.solved?<button ref={nextRef} className="primary" onClick={next}>{index===4?'Cueillir ma fleur':'Défi suivant'}<ArrowRight size={19}/></button>:<span className="soft-note"><RotateCcw size={15}/> On a le droit d’essayer !</span>}</div>
    </>}
  </Modal>;
}
