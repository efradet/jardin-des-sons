import {challenges} from './challenges.js';
import {earlyLessons} from './early-lessons.js';
import {laterLessons} from './later-lessons.js';
import {stories} from './stories.js';
const word=(id,text,parts,hint,extra={})=>({id,text,tiles:[...text],parts,hint,...extra});
const blend=(text,parts,hint,extra={})=>({id:`blend-${text}`,text,parts,hint,...extra});
export const lessons=[
  ...earlyLessons,
  {id:9,title:'Le petit pont du p',focus:'p · ap / pa · pr',color:'peach',anchor:'papa',
    intro:'Regarde le p : il descend sous la ligne. Écoute les syllabes, puis assemble les mots.',
    note:'Dans pa, p vient avant a. Dans ap, il vient après. Dans pr, on garde les deux sons.',
    blends:[blend('pa',['p','a'],'Lis de gauche à droite : p, puis a.'),blend('ap',['a','p'],'Ici, a vient avant p. Écoute la différence avec pa.'),blend('pré',['p','r','é'],'Garde le p et le r. Écoute toute la syllabe : pré.')],
    words:[word('papa','papa',['pa','pa'],'Deux fois pa : pa, pa. Puis lis papa.'),word('pile','pile',['pi','le'],'Écoute pile. Le e à la fin ne s’entend pas ici.',{silent:[3]}),word('pull','pull',['pull'],'Dans pull, on écrit deux l. Écoute le mot, puis regarde les deux l.',{special:[2,3]})],
    sentence:{id:'sentence-9',text:'Papa a lavé le pull.',chunks:['Papa','a lavé','le pull.'],question:'Qu’a lavé Papa ?',options:['Le pull','La pile'],answer:'Le pull'}},
  {id:10,title:'Les deux voix du o',focus:'o · pot / pomme',color:'blue',anchor:'pomme',
    intro:'La lettre o peut se prononcer de deux façons. Écoute pot, puis pomme.',
    note:'On écoute o dans le mot entier. Pot et pomme ne montrent pas la même prononciation du o.',
    blends:[blend('pot',['p','o','t'],'Dans pot, le t final ne se prononce pas.',{silentParts:[2]}),blend('pomme',['p','o','mm','e'],'Écoute le o de pomme. Les deux m représentent ici un seul son. Le e final ne s’entend pas.',{silentParts:[3]}),blend('or',['o','r'],'Lis o puis r. Écoute le mot or.')],
    words:[word('pomme','pomme',['po','mme'],'Pomme s’écrit avec deux m et un e final qui ne s’entend pas ici.',{silent:[4],special:[2,3]}),word('or','or',['or'],'Dans or, on entend o puis r.'),word('poche','poche',['po','che'],'Dans poche, ch reste ensemble. Le e final ne s’entend pas ici.',{tiles:['p','o','ch','e'],silent:[3]})],
    sentence:{id:'sentence-10',text:'Léo a vu la pomme.',chunks:['Léo','a vu','la pomme.'],question:'Qu’a vu Léo ?',options:['La pomme','Le pull'],answer:'La pomme'}},
  {id:11,title:'Le dé et le y de Papy',focus:'d · y comme i',color:'lilac',anchor:'dé',
    intro:'Regarde le d : il monte au-dessus de la ligne. Dans Papy, la lettre y se prononce comme i.',
    note:'Le ventre du d est à gauche. Dans les mots de cette leçon, y se lit comme i. Ce n’est pas toujours le cas dans tous les mots.',
    blends:[blend('dé',['d','é'],'Regarde l’accent aigu de é. Écoute dé.'),blend('di',['d','i'],'Le d vient avant i. Écoute di.'),blend('Papy',['Pa','py'],'Dans Papy, les lettres p et y se lisent pi. On apprend à écrire ce mot avec y.')],
    words:[word('dé','dé',['dé'],'Dé s’écrit d puis é, avec un accent aigu.'),word('midi','midi',['mi','di'],'Deux syllabes : mi, di. Garde les deux i.'),word('papy','papy',['pa','py'],'Pour ce mot, on apprend l’écriture papy avec un y. On entend i à la fin.',{special:[3]})],
    sentence:{id:'sentence-11',text:'Papy a vu le dé.',chunks:['Papy','a vu','le dé.'],question:'Qui a vu le dé ?',options:['Papy','Léo'],answer:'Papy'}},
  {id:12,title:'Le joli jardin du j',focus:'j · ju · jo · je',color:'mint',anchor:'jupe',
    intro:'Le j descend sous la ligne et porte un point. Écoute le début de jupe et de joli.',
    note:'Écoute j dans les mots. Assemble chaque syllabe, puis relis le mot entier.',
    blends:[blend('ju',['j','u'],'Écoute ju, comme au début de jupe.'),blend('jo',['j','o'],'Écoute jo, comme au début de joli.'),blend('je',['j','e'],'Écoute je, comme dans je lis.')],
    words:[word('jupe','jupe',['ju','pe'],'Lis jupe. Son e final ne s’entend pas ici.',{silent:[3]}),word('judo','judo',['ju','do'],'Deux syllabes : ju, do.'),word('joli','joli',['jo','li'],'Deux syllabes : jo, li.')],
    sentence:{id:'sentence-12',text:'Julie a mis la jupe.',chunks:['Julie','a mis','la jupe.'],question:'Qu’a mis Julie ?',options:['La jupe','Le pull'],answer:'La jupe'}}
  ,...laterLessons
];
for(const lesson of lessons){lesson.challenge??=challenges[lesson.id];lesson.story=stories[lesson.id];}
export const findItem=(lessonId,itemId)=>{
  const lesson=lessons.find(l=>l.id===lessonId);
  return lesson && [...lesson.blends,...lesson.words,lesson.sentence,...lesson.challenge.words,...lesson.challenge.readings,...lesson.story.questions].find(i=>i.id===itemId);
};
export const instructions={
  model:'Je te montre. Écoute, regarde, puis répète si tu veux.',
  blend:'Touche chaque partie de gauche à droite. Puis écoute et lis le tout avec moi.',
  read:'Lis la phrase à voix haute, à ton rythme. Tu peux écouter une partie pour t’aider.',
  study:'Regarde le mot. Écoute-le et observe les lettres à retenir. Ensuite, nous le cacherons.',
  dictate:'Écoute. Puis touche les lettres dans l’ordre pour écrire. Tu peux écouter encore.',
  paper:'Écoute le mot, puis écris-le sur ton cahier. Quand tu as fini, regarde le modèle avec un adulte.',
  retry:'Une partie est déjà juste. Regarde la case à reprendre. Tu peux écouter encore ou demander de l’aide.',
  success:'Bravo, tu as retrouvé l’écriture du mot !',
};
