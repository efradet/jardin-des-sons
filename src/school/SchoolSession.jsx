import React,{useEffect,useRef,useState} from 'react';
import Modal from '../Modal.jsx';
import RainbowReward from '../RainbowReward.jsx';
import BlendActivity from './BlendActivity.jsx';
import ReadingActivity from './ReadingActivity.jsx';
import DictationActivity from './DictationActivity.jsx';
import StoryActivity from './StoryActivity.jsx';
import {buildSteps} from './engine.js';

export default function SchoolSession({lesson,mode,history,onComplete,onClose}){
  const challenge=mode==='challenge';
  const [steps]=useState(()=>buildSteps(lesson,history,mode));
  const [id]=useState(()=>`school-${globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random()}`}`);
  const [index,setIndex]=useState(0),[records,setRecords]=useState([]),[done,setDone]=useState(false);
  const [storyHelp,setStoryHelp]=useState(false);
  const lock=useRef(false),heading=useRef(null);
  useEffect(()=>{lock.current=false;heading.current?.focus();heading.current?.closest('dialog')?.scrollTo(0,0);},[index,done]);
  function next(record){
    if(lock.current)return;lock.current=true;
    const items=[...records,record];setRecords(items);
    if(index===steps.length-1){onComplete({id,lesson:lesson.id,mode,completedAt:new Date().toISOString(),items});setDone(true);}
    else setIndex(i=>i+1);
  }
  const step=steps[index];
  return <Modal title={`Leçon ${lesson.id} · ${lesson.focus}`} onClose={onClose} className="school-modal">
    {done?<div className="school-finish"><RainbowReward/><h3 ref={heading} tabIndex={-1}>{challenge?'Mission accomplie ! Une fleur pour ton jardin.':'Une fleur pour tes efforts !'}</h3><p>Tu as pris le temps d’apprendre.<br/>Tu peux être fière de toi.</p><button className="primary" onClick={onClose}>Retour à mon chemin</button></div>:<>
      <div className="school-progress"><span ref={heading} tabIndex={-1}>{challenge?'Défi':'Petit pas'} {index+1} sur {steps.length}</span><span>À ton rythme</span><progress value={index} max={steps.length} aria-label="Avancement de la séance"/></div>
      {step.kind==='story'?<StoryActivity key={index} story={lesson.story} item={step.item} questionIndex={index} help={storyHelp} onHelp={()=>setStoryHelp(true)} onDone={next}/>:step.kind==='blend'?<BlendActivity key={index} item={step.item} onDone={next}/>:step.kind==='read'?<ReadingActivity challenge={challenge} key={index} item={step.item} onDone={next}/>:<DictationActivity challenge={challenge} key={index} item={step.item} paper={mode==='paper'} onDone={next}/>}
      <button className="school-pause" onClick={onClose}>Faire une pause</button>
    </>}
  </Modal>;
}
