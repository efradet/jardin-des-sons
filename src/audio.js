export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
export function speak(text, onError = () => {}) {
  if(!canSpeak()) {onError(); return;}
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang='fr-FR';
  const voices=window.speechSynthesis.getVoices();
  const voice=voices.find(v=>v.lang==='fr-FR') || voices.find(v=>v.lang.startsWith('fr'));
  if(voice) utterance.voice=voice;
  utterance.rate=.78;
  utterance.onerror=e=>{if(!['interrupted','canceled'].includes(e.error)) onError();};
  window.speechSynthesis.speak(utterance);
}
export function silence() {if(canSpeak()) window.speechSynthesis.cancel();}
