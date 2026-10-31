import React,{useState} from 'react';
import {instructions} from './content.js';
import useSchoolAudio from './useSchoolAudio.js';
import {Listen,AudioNotice} from './ActivityParts.jsx';

export default function BlendActivity({item,onDone}){
  const audio=useSchoolAudio();
  const [visited,setVisited]=useState(0),[heard,setHeard]=useState(false);
  return <div className="school-activity">
    <span className="school-kicker">LE PONT DES SONS</span><h3>On assemble ensemble</h3>
    <p>Touche les parties de gauche à droite.</p>
    <Listen audio={audio} text={instructions.blend}>Écouter la consigne</Listen>
    <div className="blend-track" aria-label="Parties à parcourir dans l’ordre">{item.parts.map((part,i)=><React.Fragment key={i}>{i>0&&<span className="blend-join" aria-hidden="true">·</span>}<button className={`blend-tile ${visited>i?'visited':''} ${visited===i?'current':''} ${item.silentParts?.includes(i)?'silent-part':''}`} disabled={i>visited} aria-label={`Partie ${i+1} : ${part}${item.silentParts?.includes(i)?', lettre muette':''}`} onClick={()=>setVisited(n=>Math.max(n,i+1))}>{part}<small>{item.silentParts?.includes(i)?'muet':i+1}</small></button></React.Fragment>)}</div>
    <div className="blend-whole">{item.text}</div>
    <Listen audio={audio} text={item.text} onHeard={()=>setHeard(true)}>Écouter le tout</Listen>
    <p className="school-soft-copy">Écoute, puis essaie de le dire à ton tour.</p>
    <div className="school-hint"><p>{item.hint}</p><Listen audio={audio} text={item.hint}>Écouter le conseil</Listen></div>
    <AudioNotice error={audio.error}/>
    <button className="primary school-next" disabled={!heard||visited<item.parts.length||audio.busy} onClick={()=>onDone({id:item.id,skill:'blending',attempts:1,help:true,paper:false})}>J’ai essayé, on continue</button>
    <p className="school-soft-copy">Tu peux écouter autant de fois que tu veux.</p>
  </div>;
}
