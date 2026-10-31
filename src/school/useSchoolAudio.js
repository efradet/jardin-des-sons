import {useEffect,useRef,useState} from 'react';
import manifest from './audio-manifest.json';
import {createSchoolPlayer} from './audio.js';

export default function useSchoolAudio(){
  const player=useRef(null);
  if(!player.current)player.current=createSchoolPlayer(key=>manifest[key]);
  const generation=useRef(0);
  const [busy,setBusy]=useState(false),[error,setError]=useState(false);
  useEffect(()=>()=>{generation.current++;player.current.stop();},[]);
  async function play(key){
    const request=++generation.current;setBusy(true);setError(false);
    const ok=await player.current.play(key);
    if(request!==generation.current)return false;
    setBusy(false);setError(!ok);return ok;
  }
  return {play,busy,error};
}
