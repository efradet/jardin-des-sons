// Keep punctuation and spacing outside the word buttons; normalize audio keys only.
export function tokenizeStory(text){
  return text.split(/([\p{L}\p{M}]+(?:[’'-][\p{L}\p{M}]+)*)/gu).filter(Boolean).map(part=>({
    text:part,word:/^[\p{L}\p{M}]/u.test(part)?part.normalize('NFC').replaceAll("'",'’').toLocaleLowerCase('fr'):null,
  }));
}
// Resolve on end, not on start: a failed or cancelled dictation is never scored.
export function createSchoolPlayer(resolveUrl,createAudio=url=>new Audio(url)){
  let active=null;
  function stop(){active?.finish(false);}
  function play(key){
    stop();
    const url=resolveUrl(key);
    if(!url)return Promise.resolve(false);
    return new Promise(resolve=>{
      let player;
      try{player=createAudio(url);}catch{resolve(false);return;}
      let settled=false;
      const timer=setTimeout(()=>finish(false),45000);
      function finish(ok){
        if(settled)return;settled=true;clearTimeout(timer);
        player.onended=null;player.onerror=null;
        if(!ok){player.pause();player.removeAttribute('src');player.load();}
        if(active?.player===player)active=null;
        resolve(ok);
      }
      active={player,finish};player.onended=()=>finish(true);player.onerror=()=>finish(false);
      try{Promise.resolve(player.play()).catch(()=>finish(false));}catch{finish(false);}
    });
  }
  return {play,stop};
}
