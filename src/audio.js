import clips from './audio-manifest.json';
import {pronunciationText} from './pronunciation.js';
let currentAudio=null;
let sequence=0;
let finishPending=null;
export function caterpillarSound(correct){
  silence();
  if(typeof window==='undefined'||typeof window.Audio!=='function')return;
  const player=new window.Audio(correct?'/audio/chenille-miam.wav':'/audio/chenille-beurk.wav');
  currentAudio=player;player.volume=.65;
  player.onended=()=>{if(currentAudio===player)currentAudio=null;};
  try{Promise.resolve(player.play()).catch(()=>{});}catch{}
}
export const canSpeak=()=>typeof window!=='undefined' && (typeof window.Audio==='function' || 'speechSynthesis' in window);
export function silence(){
  sequence++;
  if(currentAudio){currentAudio.pause();currentAudio.removeAttribute('src');currentAudio.load();currentAudio=null;}
  if(typeof window!=='undefined' && 'speechSynthesis' in window)window.speechSynthesis.cancel();
  finishPending?.(false);finishPending=null;
}
export function speak(text,onError=()=>{}){
  silence();
  const request=sequence;
  if(!canSpeak()){onError();return Promise.resolve(false);}
  return new Promise(resolve=>{
    let timer;
    let settled=false;
    const finish=ok=>{if(settled)return;settled=true;clearTimeout(timer);if(finishPending===finish)finishPending=null;resolve(ok);};
    finishPending=finish;
    const fail=()=>{if(request!==sequence){finish(false);return;}onError();finish(false);};
    timer=setTimeout(fail,12000);
    if(clips[text]){
      const player=new window.Audio(clips[text]);currentAudio=player;player.volume=.9;
      player.onplaying=()=>finish(request===sequence);
      player.onerror=fail;
      player.onended=()=>{if(currentAudio===player)currentAudio=null;};
      try{Promise.resolve(player.play()).catch(fail);}catch{fail();}
      return;
    }
    // Only auxiliary text can use the system voice; teaching vocabulary is recorded.
    if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){fail();return;}
    const utterance=new SpeechSynthesisUtterance(pronunciationText(text));utterance.lang='fr-FR';
    const voices=window.speechSynthesis.getVoices().filter(v=>v.lang.startsWith('fr'));
    utterance.voice=voices.find(v=>/natural|neural|denise|vivienne/i.test(v.name))||voices.find(v=>v.lang==='fr-FR')||voices[0]||null;
    utterance.rate=.9;utterance.onstart=()=>finish(request===sequence);
    utterance.onerror=e=>{if(!['interrupted','canceled'].includes(e.error))fail();else finish(false);};
    try{window.speechSynthesis.speak(utterance);}catch{fail();}
  });
}
