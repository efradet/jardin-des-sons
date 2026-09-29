import React from 'react';

const colors=['#e75f79','#ee9148','#efc64b','#82b857','#40b6a3','#619ee0','#9973cd','#cc77b6'];
export default function RainbowReward({celebrate=true}){
  return <div className={`rainbow-reward ${celebrate?'':'garden-rainbow'}`} role="img" aria-label={celebrate?'Une fleur arc-en-ciel et des feux d’artifice pour fêter ta réussite':'Fleur arc-en-ciel'}>
    {celebrate&&<div className="reward-fireworks" aria-hidden="true">{[0,1,2].map(burst=><div className={`firework burst-${burst}`} key={burst}>{Array.from({length:12},(_,i)=><span key={i} style={{'--angle':`${i*30}deg`,'--spark':colors[i%colors.length],'--delay':`${burst*.65}s`}}><i/></span>)}</div>)}</div>}
    <svg className="rainbow-flower" viewBox="0 0 180 210" aria-hidden="true">
      <path d="M90 105 Q83 155 93 195" fill="none" stroke="#528347" strokeWidth="9" strokeLinecap="round"/>
      <path d="M89 165 Q49 167 45 137 Q74 131 89 165 M90 181 Q127 175 136 145 Q105 143 90 181" fill="#8cbd60" stroke="#528347" strokeWidth="3"/>
      <g className="rainbow-petals">{colors.map((color,i)=><ellipse key={color} cx="90" cy="45" rx="22" ry="34" fill={color} stroke="#fffdf6" strokeWidth="3" transform={`rotate(${i*45} 90 86)`}/>)}</g>
      <circle cx="90" cy="86" r="27" fill="#ffe58b" stroke="#fffdf6" strokeWidth="3"/>
      <circle cx="81" cy="81" r="3" fill="#40533a"/><circle cx="99" cy="81" r="3" fill="#40533a"/>
      <path d="M80 93 Q90 104 100 93" fill="none" stroke="#40533a" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  </div>;
}
