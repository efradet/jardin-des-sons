import React from 'react';
import {modes} from './content.js';
import {Volume2,Leaf} from 'lucide-react';

export default function History({history,storageError}){
  return <section className="session-history" aria-labelledby="history-title"><div className="history-heading"><h3 id="history-title">Mes dernières aventures</h3><span><Leaf size={15}/>{storageError?'Sauvegarde indisponible':'Sauvegardées dans ce navigateur'}</span></div>
    {history.length?<ol>{[...history].reverse().slice(0,10).map(r=><li key={r.id}><span className="history-symbol" aria-hidden="true">{r.mode==='caterpillar'?'🐛':r.mode==='picture'?'🖼️':'🌼'}</span><div><strong>{modes.find(m=>m.id===r.mode)?.name}</strong><span>{r.topic==='mix'?'Toutes les branches':`La branche ${r.topic}`} · {new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(r.completedAt))}</span></div><div className="history-score"><strong>{r.firstTry} / {r.total}</strong><span>sans indice, du premier coup</span></div></li>)}</ol>:<p>Ton prochain jeu terminé apparaîtra ici. Tes fleurs déjà gagnées restent dans le jardin.</p>}
    <p className="storage-explanation"><Volume2 size={15}/> Dans « Les mots en images », on lit sans audio. Dans les jeux d’écoute, écouter est la consigne normale.</p>
    <p className="storage-explanation">Les 100 dernières séances et toutes les fleurs restent sur cet appareil, même après fermeture. Un autre navigateur, une autre adresse du site ou un autre appareil possède son propre jardin.</p>
  </section>;
}
