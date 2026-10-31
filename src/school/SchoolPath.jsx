import React,{useEffect,useState} from 'react';
import {BookOpen,Pencil,Leaf,Settings2,Volume2,NotebookPen} from 'lucide-react';
import {lessons,findItem} from './content.js';
import {summarizeLesson} from './engine.js';
import SchoolSession from './SchoolSession.jsx';
import useSchoolAudio from './useSchoolAudio.js';
import {Listen,AudioNotice} from './ActivityParts.jsx';
import './school.css';

const preferenceKey='jardin-school-lesson-v1';
function selectedLesson(){try{const id=Number(localStorage.getItem(preferenceKey));return lessons.some(l=>l.id===id)?id:9;}catch{return 9;}}
export default function SchoolPath({progress,onComplete}){
  const [selected,setSelected]=useState(selectedLesson),[parents,setParents]=useState(false),[mode,setMode]=useState(null),[storageError,setStorageError]=useState(false);
  const lesson=lessons.find(l=>l.id===selected),history=progress.school?.history??[];
  const audio=useSchoolAudio();
  const summary=summarizeLesson(selected,history);
  useEffect(()=>{try{localStorage.setItem(preferenceKey,String(selected));}catch{setStorageError(true);}},[selected]);
  return <section className="school-path" aria-labelledby="school-title">
    <div className="school-path-header"><div><span className="school-kicker">LE PETIT CHEMIN DE LECTURE</span><h2 id="school-title">Un petit pas ensemble</h2></div><button className="school-secondary" aria-expanded={parents} onClick={()=>setParents(p=>!p)}><Settings2 size={19}/> Le coin des parents</button></div>
    {parents&&<section className="school-parents" aria-label="Choix de la leçon et suivi"><h3>La leçon de l’école</h3><p>Choisissez la leçon du moment. Les lettres des leçons précédentes sont utilisées pour réviser.</p><div className="school-lesson-picker">{lessons.map(l=><button key={l.id} aria-pressed={selected===l.id} onClick={()=>setSelected(l.id)}><b>Leçon {l.id}</b><span>{l.focus}</span></button>)}</div>
      <h3>Ce que nous avons pratiqué</h3><p>En mode guidé, les dictées sont préparées. En Mission défi, le modèle est caché dès le départ et les indices restent disponibles. Pour les dictées préparées : « sans aide pendant l’essai » ne signifie pas que le mot était inconnu. Les assemblages sont guidés ; la lecture orale n’est pas évaluée automatiquement.</p>
      {summary.length?<ul className="school-summary">{summary.map(r=><li key={`${r.id}-${r.skill}`}><span><b>{findItem(selected,r.id)?.text}</b><small>{r.skill==='spelling'?'Dictée':r.skill==='blending'?'Assemblage guidé':'Compréhension'}</small></span><span className={r.paper?'paper-result':r.help||r.attempts>1?'help-result':'solo-result'}>{r.paper?'Sur cahier · vérifié ensemble':r.help||r.attempts>1?'Avec aide · à revoir':'Sans aide pendant l’essai'}</span></li>)}</ul>:<p>Aucune séance terminée pour cette leçon.</p>}
      <p>Les mots à revoir passent en premier à la prochaine séance. Une fleur récompense la séance, même avec de l’aide. Les séances quittées avant la fin ne sont pas enregistrées.</p>
      <p>Les résultats restent dans ce navigateur. Vous pouvez accompagner la lecture et adapter le rythme avec l’enseignant ou l’orthophoniste.</p>
    </section>}
    <div className={`school-lesson-card ${lesson.color}`}>
      <div className="school-lesson-copy"><span className="school-lesson-number">LEÇON {lesson.id}</span><h3>{lesson.title}</h3><p>{lesson.intro}</p><Listen audio={audio} text={lesson.intro}>Écouter avec moi</Listen><AudioNotice error={audio.error}/></div>
      <div className="school-anchor" aria-hidden="true"><span>{lesson.focus.split(' · ')[0]}</span><p>{lesson.anchor}</p><Leaf size={25}/></div>
    </div>
    <div className="school-start-grid">
      <button className="school-start story-start" disabled={audio.busy} onClick={()=>setMode('story')}><BookOpen size={28}/><span><strong>Ma petite histoire</strong><small>Des mots à écouter au toucher</small><small>2 petites questions pour comprendre</small></span></button>
      <button className="school-start challenge-start" disabled={audio.busy} onClick={()=>setMode('challenge')}><span aria-hidden="true">🌟</span><span><strong>Mission défi</strong><small>2 enquêtes de lecture · 3 dictées cachées</small><small>Des indices si tu en as besoin · une fleur à gagner</small></span></button>
      <button className="school-start" disabled={audio.busy} onClick={()=>setMode('long')}><BookOpen size={28}/><span><strong>La grande promenade</strong><small>3 assemblages · 3 lectures · 6 dictées préparées</small><small>12 étapes, à ton rythme</small></span></button>
      <button className="school-start main-start" disabled={audio.busy} onClick={()=>setMode('lesson')}><BookOpen size={28}/><span><strong>On commence</strong><small>J’assemble · je lis · j’écris</small></span><span className="school-count">7 petits pas</span></button>
      <button className="school-start" disabled={audio.busy} onClick={()=>setMode('dictation')}><Pencil size={26}/><span><strong>Ma petite dictée</strong><small>3 dictées, préparées ensemble</small></span></button>
      <button className="school-start" disabled={audio.busy} onClick={()=>setMode('paper')}><NotebookPen size={26}/><span><strong>Sur mon cahier</strong><small>J’écris avec un adulte</small></span></button>
    </div>
    <div className="school-path-note"><Volume2 size={22}/><p>{lesson.note}</p><Listen audio={audio} text={lesson.note}>Écouter</Listen></div>
    <p className="school-session-note">Quelques minutes ensemble. Tu peux faire une pause quand tu veux.</p>
    {storageError&&<p role="status">Le choix de leçon ne peut pas être conservé dans ce navigateur.</p>}
    {mode&&<SchoolSession lesson={lesson} mode={mode} history={history} onComplete={onComplete} onClose={()=>setMode(null)}/>}
  </section>;
}
