import React from 'react';
import {Volume2} from 'lucide-react';

export function Listen({audio,text,children='Écouter',onHeard}){
  return <button type="button" className="school-listen" disabled={audio.busy} onClick={async()=>{const ok=await audio.play(text);if(ok)onHeard?.();}}><Volume2 size={22}/>{audio.busy?'J’écoute…':children}</button>;
}
export function AudioNotice({error}){
  return error?<p className="school-audio-error" role="alert">Le son n’a pas pu être lu. Appuie à nouveau sur Écouter, ou fais une pause.</p>:null;
}
export function WordModel({item}){
  return <div className="school-word-model" aria-label={item.text}>{item.tiles.map((tile,i)=><span key={i} className={`${item.silent?.includes(i)?'silent-letter':''} ${item.special?.includes(i)?'special-letter':''}`}>{tile}</span>)}</div>;
}
