import React,{useState} from 'react';
import {instructions} from './content.js';
import useSchoolAudio from './useSchoolAudio.js';
import {Listen,AudioNotice} from './ActivityParts.jsx';

export default function ReadingActivity({item,challenge=false,onDone}){
  const audio=useSchoolAudio();
  const [help,setHelp]=useState(false),[attempts,setAttempts]=useState(0),[choice,setChoice]=useState(null);
  const correct=choice===item.answer;
  return <div className="school-activity">
    <span className="school-kicker">LE SENTIER DES PHRASES</span><h3>{challenge?'Lis et mène l’enquête':'Une petite phrase à lire'}</h3>
    <Listen audio={audio} text={instructions.read}>Écouter la consigne</Listen>
    <div className="school-sentence">{item.chunks.map((chunk,index)=><button key={index} disabled={audio.busy} onClick={()=>{setHelp(true);audio.play(chunk);}} aria-label={`Écouter : ${chunk}`}>{chunk}</button>)}</div>
    <p className="school-soft-copy">Si tu bloques, touche un groupe de mots pour l’écouter.</p>
    <Listen audio={audio} text={item.text} onHeard={()=>setHelp(true)}>Écouter la phrase</Listen>
    <div className="school-question"><h4>{item.question}</h4><Listen audio={audio} text={item.question}>Écouter la question</Listen></div>
    <div className="school-reading-options">{item.options.map(option=><div key={option}><button className={`school-answer ${choice===option?(correct?'is-correct':'try-again'):''}`} disabled={correct} onClick={()=>{setAttempts(n=>n+1);setChoice(option);}}>{option}</button><Listen audio={audio} text={option}>Écouter ce choix</Listen></div>)}</div>
    <p className="school-feedback" role="status">{choice?(correct?'Oui ! Tu as compris la phrase.':'Relisons la phrase ensemble. Tu peux réessayer.'):''}</p>
    <AudioNotice error={audio.error}/>
    <button className="primary school-next" disabled={!correct||audio.busy} onClick={()=>onDone({id:item.id,skill:'comprehension',attempts,help,paper:false})}>On continue</button>
  </div>;
}
