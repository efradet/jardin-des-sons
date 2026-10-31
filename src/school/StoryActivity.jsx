import React,{useRef,useState} from 'react';
import {tokenizeStory} from './audio.js';
import useSchoolAudio from './useSchoolAudio.js';
import {Listen} from './ActivityParts.jsx';

export default function StoryActivity({story,item,questionIndex,help,onHelp,onDone}){
  const audio=useSchoolAudio();
  const [active,setActive]=useState(null),[choice,setChoice]=useState(null),[attempts,setAttempts]=useState(0);
  const request=useRef(0),completed=useRef(false);
  const correct=choice===item.answer;
  async function hearWord(word,id){
    const current=++request.current;onHelp();setActive(id);
    await audio.play(word);
    if(current===request.current)setActive(null);
  }
  function words(text,prefix){
    return tokenizeStory(text).map((token,i)=>token.word?<button type="button" key={i}
      className={`story-word ${active===`${prefix}-${i}`?'is-reading':''}`}
      aria-label={`Écouter le mot ${token.text}`}
      onClick={()=>hearWord(token.word,`${prefix}-${i}`)}>{token.text}</button>:<React.Fragment key={i}>{token.text}</React.Fragment>);
  }
  function done(){
    if(!correct||audio.busy||completed.current)return;
    completed.current=true;
    onDone({id:item.id,skill:'comprehension',attempts,help:help||!!story.adultIntro,paper:false});
  }
  return <div className="school-activity story-activity">
    <span className="school-kicker">MA PETITE HISTOIRE</span>
    <h3 className="story-title">{words(story.title,'title')}</h3>
    <p className="school-soft-copy">Lis à ton rythme. Touche un mot pour l’écouter. Tu peux le réécouter autant de fois que tu veux.</p>
    {story.adultIntro&&<aside className="story-shared"><strong>À lire avec un adulte</strong><p>{story.adultIntro}</p><Listen audio={audio} text={story.adultIntro} onHeard={onHelp}>Écouter la mise en scène</Listen></aside>}
    <div className="story-text" aria-label="Texte de l’histoire">{story.paragraphs.map((paragraph,i)=><p key={i}>{words(paragraph,`p${i}`)}</p>)}</div>
    {audio.error&&<p role="alert" className="school-audio-error">Le son n’a pas pu être lu. Touche de nouveau le mot ou le bouton d’écoute pour réessayer.</p>}
    <section className="story-question" aria-labelledby={`story-question-${questionIndex}`}>
      <span className="school-kicker">PETITE QUESTION {questionIndex+1} SUR 2</span>
      <h4 id={`story-question-${questionIndex}`}>{item.question}</h4>
      <Listen audio={audio} text={item.question}>Écouter la question</Listen>
      <div className="school-reading-options">{item.options.map(option=><div key={option}>
        <button type="button" className={`school-answer ${choice===option?(correct?'is-correct':'try-again'):''}`} disabled={correct}
          onClick={()=>{setChoice(option);setAttempts(n=>n+1);}}>{option}</button>
        <Listen audio={audio} text={option}>Écouter ce choix</Listen>
      </div>)}</div>
      <p className="school-feedback" role="status">{choice?(correct?'Oui, tu as compris !':'Regarde encore l’histoire. Tu peux réessayer.'):''}</p>
      <button type="button" className="primary school-next" disabled={!correct||audio.busy} onClick={done}>{questionIndex===0?'La deuxième question':'Terminer mon histoire'}</button>
    </section>
  </div>;
}
