const entry = (id, family, word, emoji, syllables, words, tip, cue) => ({ id, family, word, emoji, syllables, words, tip, cue });
export const topics = [
  entry('p','letters','papillon','🦋',['pa','pi','po','pu','pé'],['papa','pile','poule','pavé','pipe'], 'Le p descend sous la ligne. Son ventre est à droite.', 'Les lèvres se ferment puis laissent sortir un petit souffle.'),
  entry('b','letters','ballon','🎈',['ba','bi','bo','bu','bé'],['bébé','balle','bulle','bol','boule'], 'Le b monte au-dessus de la ligne. Son ventre est à droite.', 'Les lèvres se ferment. Pose la main sur ta gorge : ça vibre.'),
  entry('d','letters','domino','🎲',['da','di','do','du','dé'],['dodo','dame','date','dé','domino'], 'Le d monte au-dessus de la ligne. Son ventre est à gauche.', 'Le bout de la langue touche juste derrière les dents du haut.'),
  entry('q','letters','quatre','🍀',['qua','qui','que','quou','quoi'],['quatre','qui','quille','quitte','quai'], 'Le q descend sous la ligne. Son ventre est à gauche. Pour lire, on le rencontre souvent avec u : qu.', 'Dans quatre et quille, qu fait le son /k/.'),
  entry('f','sounds','fleur','🌼',['fa','fi','fo','fu','fé'],['fil','fée','folie','foule','fumée'], 'Pour f, les dents du haut touchent doucement la lèvre du bas.', 'Souffle doucement. La gorge ne vibre pas.'),
  entry('v','sounds','vélo','🚲',['va','vi','vo','vu','vé'],['vélo','vie','ville','vase','vue'], 'Pour v, les dents du haut touchent doucement la lèvre du bas.', 'Fais vibrer ta voix, comme un petit moteur. Compare avec f.'),
  entry('e','vowels','renard','🦊',['le','re','de','me','te'],['renard','petit','cheval','repas','retour'], 'Le son de e change selon le mot. Ici, on écoute le début de renard. En fin de mot, e est souvent muet.', 'Écoute le mot entier avec un adulte. Le e ne se lit pas toujours de la même façon.'),
  entry('é','vowels','étoile','⭐',['pé','bé','fé','vé','dé'],['bébé','été','épée','vélo','fée'], 'Le é porte un accent aigu, qui monte vers la droite.', 'Écoute é comme au début de étoile.'),
  entry('ai','vowels','balai','🧹',['pai','bai','fai','vai','lai'],['balai','lait','aile','laine','baie'], 'Deux lettres ensemble. Dans balai et lait, ai fait le son /ɛ/.', 'Écoute ai dans balai. Ailleurs, sa prononciation peut varier.'),
  entry('oi','vowels','poire','🍐',['poi','boi','foi','voi','doi'],['poire','bois','voile','roi','noix'], 'Le o et le i se lisent ensemble : oi, comme dans poire.', 'Écoute le son /wa/ dans poire.'),
  entry('ou','vowels','loup','🐺',['pou','bou','fou','vou','dou'],['loup','poule','boule','roue','fou'], 'Le o et le u se lisent ensemble : ou, comme dans loup.', 'Arrondis les lèvres et écoute ou dans loup.'),
];
export const families = [
  { id:'letters', title:'Les lettres malicieuses', subtitle:'J’observe leur forme', letters:['p','b','d','q'], color:'peach', emoji:'🔎' },
  { id:'sounds', title:'Les sons qui chatouillent', subtitle:'J’écoute et je ressens', letters:['f','v'], color:'lilac', emoji:'🎵' },
  { id:'vowels', title:'Les voyelles magiques', subtitle:'Je découvre leurs sons', letters:['e','é','ai','oi','ou'], color:'blue', emoji:'✨' },
];
export const modes = [
  {id:'caterpillar', name:'La chenille des mots', description:'Écoute, choisis, fais-la avancer !', icon:'bug'},
  {id:'picture', name:'Les mots en images', description:'Lis le mot. Trouve son dessin.', icon:'picture'},
  {id:'observe', name:'Je repère', description:'Les lettres, pour s’échauffer.', icon:'eye'},
  {id:'listen', name:'J’écoute', description:'Écoute, puis choisis.', icon:'ear'},
  {id:'read', name:'Je lis', description:'Lis et retrouve le bon son.', icon:'book'},
];
export const levels = [
  {id:'syllables',name:'Les syllabes',description:'Je commence · pa, bou, fi'},
  {id:'words',name:'Les mots',description:'Je progresse · 4 choix'},
  {id:'challenge',name:'Le grand défi',description:'Je mélange · 6 choix, 8 mots'},
];
