import React,{useRef,useState} from 'react';
import {Lightbulb,RotateCcw,Check} from 'lucide-react';
import {checkSpelling} from './engine.js';
import {instructions} from './content.js';
import useSchoolAudio from './useSchoolAudio.js';
import {Listen,AudioNotice,WordModel} from './ActivityParts.jsx';

export default function DictationActivity({item,paper=false,challenge=false,onDone}){
  const audio=useSchoolAudio();
  const [stage,setStage]=useState(challenge?'write':'study'),[studyHeard,setStudyHeard]=useState(false),[heard,setHeard]=useState(false);
  const [tiles,setTiles]=useState(()=>item.tiles.map(()=>'')),[locked,setLocked]=useState(()=>item.tiles.map(()=>false));
  const [cursor,setCursor]=useState(0),[attempts,setAttempts]=useState(0),[help,setHelp]=useState(false),[showHelp,setShowHelp]=useState(false),[syllableHelp,setSyllableHelp]=useState(false);
  const [feedback,setFeedback]=useState(''),[solved,setSolved]=useState(false),[revealed,setRevealed]=useState(false);
  const completed=useRef(false),answerArea=useRef(null);
  const bank=[...new Set([...item.tiles,...(challenge?[...'aeéàiouylrmfvspdj', 'ch']:['a','i','é','e'])])].sort((a,b)=>a.localeCompare(b,'fr'));
  function place(tile){
    if(!heard||solved||audio.busy||locked[cursor])return;
    const next=[...tiles];next[cursor]=tile;setTiles(next);setFeedback('');
    const nextEmpty=next.findIndex((t,i)=>i>cursor&&!t&&!locked[i]);
    if(nextEmpty>=0)setCursor(nextEmpty);
    else {const first=next.findIndex((t,i)=>!t&&!locked[i]);if(first>=0)setCursor(first);}
  }
  function erase(){if(solved||!heard)return;const next=[...tiles];if(locked[cursor])return;next[cursor]='';setTiles(next);setFeedback('');}
  function verify(){
    if(!heard||solved||audio.busy||tiles.some(t=>!t))return;
    const checked=checkSpelling(item,tiles);setAttempts(n=>n+1);setLocked(checked.locked);
    if(checked.correct){setSolved(true);setShowHelp(false);setFeedback(instructions.success);}
    else{setCursor(checked.firstMismatch);setFeedback(instructions.retry);}
  }
  function done(){if(completed.current)return;completed.current=true;onDone({id:item.id,skill:'spelling',attempts:paper?1:attempts,help:paper||help,paper});}
  function hideModel(){setStage('write');setHeard(false);setTimeout(()=>answerArea.current?.focus(),0);}
  const context=paper?instructions.paper:instructions.dictate;
  if(stage==='study')return <div className="school-activity">
    <span className="school-kicker">LA CABANE DES DICTÉES · JE PRÉPARE</span><h3>Regardons ce mot ensemble</h3>
    <Listen audio={audio} text={instructions.study}>Écouter la consigne</Listen>
    <WordModel item={item}/>
    <Listen audio={audio} text={item.text} onHeard={()=>setStudyHeard(true)}>Écouter le mot</Listen>
    <div className="school-hint"><p>{item.hint}</p><Listen audio={audio} text={item.hint}>Écouter le conseil</Listen></div>
    {(item.silent?.length>0||item.special?.length>0)&&<p className="school-soft-copy">Les lettres soulignées sont à retenir. Les lettres en pointillés ne s’entendent pas ici.</p>}
    <AudioNotice error={audio.error}/>
    <button className="primary school-next" disabled={!studyHeard||audio.busy} onClick={hideModel}>Cacher le mot et essayer</button>
  </div>;
  return <div className="school-activity">
    <span className="school-kicker">LA CABANE DES DICTÉES · {paper?'SUR MON CAHIER':'À TOI'}</span><h3>{paper?'J’écris sur mon cahier':'Écoute, puis écris'}</h3>
    <Listen audio={audio} text={context}>Écouter la consigne</Listen>
    <div className="dictation-audio"><Listen audio={audio} text={item.text} onHeard={()=>setHeard(true)}>{heard?'Réécouter le mot':'Écouter le mot caché'}</Listen></div>
    <AudioNotice error={audio.error}/>
    {paper?<>
      <p>Écris le mot. Un adulte t’aidera à le vérifier.</p>
      {!revealed?<button className="school-secondary" disabled={!heard||audio.busy} onClick={()=>setRevealed(true)}>J’ai écrit : voir le modèle</button>:<><WordModel item={item}/><p>{item.hint}</p><p className="school-soft-copy">Cette activité sera notée « sur cahier, vérifiée ensemble ».</p><button className="primary school-next" onClick={done}>Nous avons vérifié ensemble</button></>}
    </>:<>
      <div ref={answerArea} tabIndex={0} className="spelling-workspace" aria-label="Écrire le mot avec les lettres proposées" onKeyDown={e=>{
        if(e.target!==e.currentTarget)return;
        if(e.key==='Backspace'||e.key==='Delete'){e.preventDefault();erase();}
        else if(e.key==='Enter'){e.preventDefault();verify();}
        else if(bank.includes(e.key.toLowerCase())){e.preventDefault();place(e.key.toLowerCase());}
      }}>
        <div className="spelling-slots" aria-label="Ta réponse">{tiles.map((tile,i)=><button key={i} disabled={solved||locked[i]||!heard} className={`spelling-slot ${locked[i]?'locked':''} ${i===cursor&&!solved?'current':''}`} aria-label={`Case ${i+1}${tile?` : ${tile}`:', vide'}${locked[i]?', correcte':''}`} onClick={()=>setCursor(i)}>{tile||<span aria-hidden="true">·</span>}{locked[i]&&<Check size={15}/>}</button>)}</div>
        <div className="letter-bank" aria-label="Lettres disponibles">{bank.map(tile=><button key={tile} disabled={!heard||solved||audio.busy} onClick={()=>place(tile)}>{tile}</button>)}</div>
      </div>
      <p className="school-soft-copy">Touche une case pour la changer. Chaque lettre peut servir plusieurs fois.</p>
      {!solved&&<div className="school-actions"><button className="school-secondary" disabled={!heard||audio.busy||locked[cursor]} onClick={erase}><RotateCcw size={18}/> Effacer la case</button><button className="primary" disabled={!heard||audio.busy||tiles.some(t=>!t)} onClick={verify}>Vérifier</button></div>}
      <p className="school-feedback" role="status">{feedback}</p>
      {!solved&&<button className="school-help" disabled={!heard||audio.busy} onClick={()=>{setHelp(true);if(challenge&&!syllableHelp)setSyllableHelp(true);else setShowHelp(v=>!v);}}><Lightbulb size={19}/> {showHelp?'Cacher le modèle':challenge&&!syllableHelp?'Un indice':'Voir le modèle'}</button>}
      {challenge&&syllableHelp&&!showHelp&&!solved&&<p className="school-hint">Le mot se construit en {item.parts.length} parties. Écoute encore, puis cherche chaque partie dans l’ordre.</p>}
      {showHelp&&<div className="school-hint"><WordModel item={item}/><p>{item.hint}</p><Listen audio={audio} text={item.hint}>Écouter le conseil</Listen></div>}
      {solved&&<button className="primary school-next" onClick={done}>On continue</button>}
    </>}
  </div>;
}
