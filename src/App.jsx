import React, {useEffect, useState} from 'react';
import {Sprout, Flower2, Settings2, ArrowRight, Volume2, Heart, Eye, Ear, BookOpen, Sun, Sparkles, Check, ChevronRight, Map, Leaf} from 'lucide-react';
import {topics,families,modes} from './content.js';
import {readSaved} from './game.js';
import {speak,silence} from './audio.js';
import Modal from './Modal.jsx';
import Exercise from './Exercise.jsx';

const icons={eye:Eye,ear:Ear,book:BookOpen};
const storageKey='jardin-des-sons-progress-v1';
function saved(){try{return readSaved(localStorage.getItem(storageKey));}catch{return readSaved(null);}}
function preferences(){try{const p=JSON.parse(localStorage.getItem('jardin-preferences'));return {large:!!p?.large,spaced:!!p?.spaced,level:p?.level==='words'?'words':'syllables'};}catch{return {large:false,spaced:false,level:'syllables'};}}

export default function App(){
  const [selected,setSelected]=useState('p');
  const [progress,setProgress]=useState(saved);
  const [prefs,setPrefs]=useState(preferences);
  const [modal,setModal]=useState(null);
  const [exercise,setExercise]=useState(null);
  const [view,setView]=useState('map');
  const [audioError,setAudioError]=useState(false);
  const [storageError,setStorageError]=useState(false);
  const topic=topics.find(t=>t.id===selected);
  const family=families.find(f=>f.id===topic.family);
  const say=text=>speak(text,()=>setAudioError(true));
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(progress));}catch{setStorageError(true);}},[progress]);
  useEffect(()=>{try{localStorage.setItem('jardin-preferences',JSON.stringify(prefs));}catch{setStorageError(true);}},[prefs]);
  useEffect(()=>()=>silence(),[]);
  useEffect(()=>{
    if(!document.modelContext?.registerTool)return;
    const lifecycle=new AbortController();
    try{Promise.resolve(document.modelContext.registerTool({name:'select_reading_branch',title:'Choisir une branche',description:'Affiche la découverte du groupe de lettres choisi, sans répondre aux exercices.',inputSchema:{type:'object',properties:{grapheme:{type:'string',enum:topics.map(t=>t.id)}},required:['grapheme'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:async input=>{if(!input || !topics.some(t=>t.id===input.grapheme))throw new Error('Branche inconnue');setSelected(input.grapheme);setView('map');await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return {selected:input.grapheme};}},{signal:lifecycle.signal})).catch(()=>{});}catch{}
    return ()=>lifecycle.abort();
  },[]);
  function complete(id){setProgress(p=>({flowers:p.flowers+1,completed:[...new Set([...p.completed,id])]}));}
  function close(){silence();setModal(null);}
  return <div className={`app ${prefs.large?'large-text':''} ${prefs.spaced?'spaced-text':''}`}>
    <a className="skip-link" href="#main">Aller aux jeux</a>
    <header className="header"><a href="#" className="brand" onClick={e=>{e.preventDefault();setView('map');}}><span className="brand-icon"><Sprout size={28}/></span><span>le jardin<span className="brand-bottom">des sons<span className="brand-dot">.</span></span></span></a>
      <nav aria-label="Navigation principale"><button className={view==='map'?'nav-link active':'nav-link'} onClick={()=>setView('map')}><Map size={18}/> Ma carte</button><button className={view==='garden'?'nav-link active':'nav-link'} onClick={()=>setView('garden')}><Flower2 size={18}/> Mon jardin {progress.flowers>0&&<span className="nav-count">{progress.flowers}</span>}</button></nav>
      <div className="header-right"><button className="icon-button settings-toggle" onClick={()=>setModal('settings')} aria-label="Réglages de lecture"><Settings2 size={21}/></button><span className="header-divider"/><span className="avatar">E</span><span className="profile-name">Elisabeth</span></div>
    </header>
    <main id="main">
      <section className="welcome"><div><div className="greeting"><Sun size={17}/> BONJOUR ELISABETH</div><h1>{view==='map'?<>Fais grandir ta lecture<span className="heading-dot">.</span></>:<>Ton jardin grandit<span className="heading-dot">.</span></>}</h1><p>{view==='map'?'Un son, un petit jeu, une nouvelle découverte.':'Chaque fleur raconte une petite victoire.'}</p></div><div className="flower-counter"><span className="counter-icon"><Flower2 size={27}/></span><div><strong>{progress.flowers} {progress.flowers===1?'fleur cueillie':'fleurs cueillies'}</strong><span>Ça commence par une petite graine !</span></div></div></section>
      {view==='map'?<>
        <div className="workspace">
          <section className="map-panel" aria-labelledby="map-title"><div className="panel-heading"><div><span className="eyebrow">À TOI D’EXPLORER</span><h2 id="map-title">Ma carte des sons</h2></div><span className="map-label"><span/> 3 chemins à découvrir</span></div>
            <div className="mind-map">
              <svg className="connections" viewBox="0 0 760 440" preserveAspectRatio="none" aria-hidden="true"><path d="M360 236 C260 236 260 105 174 105" className="peach-line"/><path d="M401 213 C466 213 457 100 555 100" className="lilac-line"/><path d="M407 254 C475 254 451 348 565 348" className="blue-line"/><path d="M337 269 C280 290 276 358 204 358" className="green-line"/></svg>
              <div className="map-center"><span className="center-icon"><Sprout size={39} strokeWidth={1.8}/></span><strong>Mes petits<br/>sons</strong><span>Je découvre, je grandis</span></div>
              {families.map(f=><div className={`branch ${f.id} ${f.color}`} key={f.id}><div className="branch-heading"><span aria-hidden="true">{f.emoji}</span><h3>{f.title}</h3></div><p>{f.subtitle}</p><div className="letter-list">{f.letters.map(letter=><button key={letter} className={`letter-chip ${selected===letter?'selected':''}`} aria-label={`Découvrir ${letter}`} aria-pressed={selected===letter} onClick={()=>setSelected(letter)}>{letter}{progress.completed.includes(letter)&&<Check className="chip-check" size={12}/>}</button>)}</div></div>)}
              <div className="map-note"><span className="note-icon"><Heart size={19}/></span><p>Les petites étapes<br/>font les grands progrès.</p><span className="note-sparkle">✦</span></div>
              <span className="map-decoration deco-1" aria-hidden="true">✧</span><span className="map-decoration deco-2" aria-hidden="true">✦</span>
            </div>
            <div className="map-caption"><span className="step-circle">1</span> Choisis une lettre sur la carte <ChevronRight size={16}/><span className="step-circle">2</span> Découvre-la et joue !</div>
          </section>
          <aside className={`discovery ${family.color}`} aria-labelledby="discovery-title"><div className="discovery-top"><span className="eyebrow">TA DÉCOUVERTE DU MOMENT</span><Sparkles size={19}/></div><div className="discovery-example"><span className="hero-letter" aria-hidden="true">{topic.id}</span><span className="word-picture" aria-hidden="true">{topic.emoji}</span></div><h2 id="discovery-title"><strong>{topic.id}</strong> comme dans <strong>{topic.word}</strong></h2><button className="sound-button" onClick={()=>say(topic.word)}><Volume2 size={19}/> Écouter le mot</button><p className="letter-tip">{topic.tip}</p><div className="syllable-label">On essaie ensemble ?</div><div className="syllables">{topic.syllables.slice(0,3).map(s=><button key={s} onClick={()=>say(s)} aria-label={`Écouter ${s}`}>{s}<Volume2 size={13}/></button>)}</div><button className="primary discovery-cta" onClick={()=>setExercise('observe')}>Jouer avec {topic.id}<ArrowRight size={20}/></button><span className="micro-note">5 petits défis · sans chronomètre</span></aside>
        </div>
        <section className="activities" aria-labelledby="activities-title"><div className="section-heading"><div><span className="eyebrow">CHACUN SON PETIT PAS</span><h2 id="activities-title">Comment veux-tu jouer ?</h2></div><span className="selected-pill">Aujourd’hui, on explore <b>{topic.id}</b></span></div><div className="activity-grid">{modes.map((m,i)=>{const Icon=icons[m.icon];return <button className={`activity-card activity-${i}`} key={m.id} onClick={()=>setExercise(m.id)}><span className="activity-icon"><Icon size={27} strokeWidth={1.7}/></span><span className="activity-copy"><strong>{m.name}</strong><span>{m.description}</span></span><span className="activity-arrow"><ArrowRight size={20}/></span></button>;})}</div></section>
      </>:<section className="garden-panel"><div className="garden-heading"><span className="eyebrow">TES PETITES VICTOIRES</span><h2>{progress.flowers?'Regarde ce que tu as fait pousser !':'La première fleur t’attend.'}</h2><p>Termine cinq défis pour faire pousser une fleur.</p></div><div className="flower-bed">{progress.flowers?Array.from({length:Math.min(progress.flowers,24)},(_,i)=><div className="earned-flower" key={i}><span aria-hidden="true">{['🌻','🌷','🌼','🌸'][i%4]}</span><small>Fleur {i+1}</small></div>):<div className="empty-garden"><Sprout size={70} strokeWidth={1.3}/><span>Une graine, plein de possibilités.</span></div>}</div>{progress.flowers>24&&<p>Et encore {progress.flowers-24} fleurs dans ta collection !</p>}<div className="explored"><span>Lettres explorées</span>{progress.completed.length?progress.completed.map(id=><button onClick={()=>{setSelected(id);setView('map');}} key={id}>{id}<Check size={14}/></button>):<span>Ton aventure commence ici.</span>}</div><button className="primary" onClick={()=>setView('map')}>Explorer les sons<ArrowRight size={19}/></button></section>}
      {audioError&&<p className="notice" role="status">La voix française n’est pas disponible. Vérifie le son et les voix de ton navigateur, ou lis les mots avec un adulte.</p>}
      {storageError&&<p className="notice" role="status">Le navigateur ne permet pas d’enregistrer tes fleurs. Elles restent visibles pendant cette visite.</p>}
      <footer><span><Heart size={16}/> Ici, on apprend à son rythme.</span><button onClick={()=>setModal('parents')}><BookOpen size={16}/> Le coin des parents</button><span className="footer-signature"><Leaf size={16}/> Cultivons le plaisir de lire.</span></footer>
    </main>
    {exercise&&<Exercise key={`${selected}-${exercise}-${prefs.level}`} topic={topic} mode={exercise} level={prefs.level} onClose={()=>setExercise(null)} onComplete={complete}/>}
    {modal==='settings'&&<Modal title="Le confort de lecture" onClose={close}><p className="modal-intro">Choisis ce qui te fait du bien pour lire.</p><label className="setting-row"><span><strong>De plus grandes lettres</strong><small>Pour lire plus confortablement.</small></span><input type="checkbox" checked={prefs.large} onChange={e=>setPrefs(p=>({...p,large:e.target.checked}))}/></label><label className="setting-row"><span><strong>Un texte plus aéré</strong><small>Plus d’espace entre les lettres et les mots.</small></span><input type="checkbox" checked={prefs.spaced} onChange={e=>setPrefs(p=>({...p,spaced:e.target.checked}))}/></label><fieldset className="level-settings"><legend>Qu’allons-nous lire ?</legend><label><input type="radio" name="level" checked={prefs.level==='syllables'} onChange={()=>setPrefs(p=>({...p,level:'syllables'}))}/> Des syllabes <span>pa, bou, fi…</span></label><label><input type="radio" name="level" checked={prefs.level==='words'} onChange={()=>setPrefs(p=>({...p,level:'words'}))}/> Des petits mots <span>poule, vélo…</span></label></fieldset><button className="primary wide" onClick={close}>C’est parti !<ArrowRight size={19}/></button></Modal>}
    {modal==='parents'&&<Modal title="Le coin des parents" onClose={close}><div className="parent-content"><p>Ce jardin propose un entraînement ludique à la lecture. La carte mentale relie les lettres aux syllabes et aux mots.</p><h3>Une petite séance, beaucoup de douceur</h3><ul><li>Choisissez une seule lettre ou un seul groupe de lettres.</li><li>Commencez par « Je repère », puis « J’écoute » et « Je lis ».</li><li>Dans « Je lis », Elisabeth lit le texte puis choisit le son correspondant. Les réponses ne montrent pas le texte quand l’audio fonctionne.</li><li>Écoutez les mots ensemble : la voix de synthèse dépend du navigateur et peut être imparfaite sur les syllabes isolées.</li><li>La fleur récompense une séance terminée, même avec plusieurs essais. Arrêtez si Elisabeth se fatigue.</li></ul><h3>Quelques repères</h3><p>Le e a plusieurs prononciations. Le q est généralement étudié avec u. Les sons de ai peuvent varier selon les mots et les accents. Les mots peuvent contenir des lettres encore inconnues : accompagnez leur lecture.</p><p>Ce support ne remplace pas un accompagnement orthophonique et ne mesure pas le niveau de lecture.</p><p className="privacy-note">Les préférences et les fleurs restent dans ce navigateur. Aucun compte enfant, aucun enregistrement de voix.</p><p>Repères : <a href="https://cdn.bdadyslexia.org.uk/uploads/documents/Advice/style-guide/BDA-Style-Guide-2023.pdf?v=1680084017" target="_blank" rel="noreferrer">British Dyslexia Association</a> · <a href="https://www.reseau-canope.fr/fileadmin/user_upload/Projets/conseil_scientifique_education_nationale/MANUELS_CSEN_VDEF.pdf" target="_blank" rel="noreferrer">CSEN / Réseau Canopé</a>.</p></div></Modal>}
  </div>;
}
