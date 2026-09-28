import React from 'react';
import {Leaf,Flower2,Check} from 'lucide-react';

export default function Caterpillar({steps,eaten,wrong,solved}){
  const message=wrong?'Oups ! La chenille fait une grimace et reste ici. Essaie encore.':solved?'Miam ! Une feuille mangée, un pas de plus !':'Écoute le mot pour aider la chenille à avancer.';
  return <section className={`caterpillar-garden ${wrong?'is-wrong':''} ${solved?'is-eating':''}`} aria-label="Le chemin de la chenille">
    <div className="caterpillar-heading"><span><Flower2 size={19}/> Le petit festin</span><strong>{eaten} / {steps} feuilles</strong></div>
    <div className="caterpillar-track" role="img" aria-label={`La chenille a avancé de ${eaten} pas sur ${steps}. ${wrong?'Elle fait une grimace et reste sur place.':''}`}>
      <div className="caterpillar-path"/>
      {Array.from({length:steps},(_,i)=><span key={i} className={`snack ${i<eaten?'eaten':''}`} style={{left:`${(i+1)/steps*100}%`}} aria-hidden="true">{i<eaten?<Check size={20}/>:<Leaf size={27}/>}<Flower2 size={16} className="snack-flower"/></span>)}
      <div className="caterpillar" style={{left:`${eaten/steps*100}%`}} aria-hidden="true"><img src="/illustrations/1F41B.svg" alt="" draggable={false}/><span className="caterpillar-face">{wrong?'😖':solved?'😋':'🙂'}</span></div>
    </div>
    <p className="caterpillar-message" aria-live="polite">{message}</p>
  </section>;
}
