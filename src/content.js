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
  entry('au','vowels','dauphin','🐬',['pau','tau','sau','fau','chau'],['dauphin','dinosaure','chaussette','aubergine','chaussure'], 'Dans dauphin, au se lit comme le o de vélo. Deux lettres font un seul son.', 'Écoute au dans dauphin. Au et eau peuvent faire le même son.'),
  entry('eau','vowels','bateau','⛵',['peau','beau','veau','seau','deau'],['bateau','cadeau','gâteau','drapeau','oiseau'], 'Dans bateau, eau se lit comme le o de vélo. Trois lettres font un seul son.', 'Écoute eau dans bateau. Le son seul ne permet pas de choisir entre au et eau : on apprend le mot entier.'),
  entry('g','sounds','gâteau','🎂',['ga','go','gui','gou','gai'],['gâteau','gant','guitare','gorille','escargot'], 'Ici, on écoute le g de gâteau. Devant e et i, g change souvent de son, comme dans girafe. Avec gu, il garde le son de guitare.', 'Compare gâteau et girafe. Dans ces jeux, on commence avec le g de gâteau.'),
  entry('j','sounds','journal','📰',['je','jou','ju','jeu','joi'],['journal','jus','bijou','jouet','judo'], 'Le j descend sous la ligne et porte un point. Écoute le début de journal.', 'Fais vibrer doucement ta voix. Écoute j dans journal et dans bijou.'),
  entry('br','clusters','brocoli','🥦',['bra','bri','bro','bru','bré'],['brocoli','brique','brosse','arbre','zèbre'], 'B et r se suivent. Lis les deux consonnes ensemble, puis la voyelle : bra, bri, bro.', 'Écoute br dans brocoli et dans arbre.'),
  entry('dr','clusters','dragon','🐉',['dra','dri','dro','dru','dré'],['dragon','drapeau','dromadaire','cadre','cèdre'], 'D et r se suivent. Garde les deux sons, comme au début de dragon.', 'Écoute dr dans dragon et dans cadre.'),
  entry('gr','clusters','grenouille','🐸',['gra','gri','gro','gru','gré'],['grenouille','grue','grillon','tigre','grappe'], 'G et r se suivent. Assemble les deux consonnes, comme dans grenouille.', 'Écoute gr dans grenouille et dans tigre.'),
  entry('cr','clusters','crabe','🦀',['cra','cri','cro','cru','cré'],['crabe','crocodile','crayon','croissant','écran'], 'C et r se suivent. Ici, c fait le même son que dans cadeau.', 'Écoute cr dans crabe et dans écran.'),
  entry('fr','clusters','fraise','🍓',['fra','fri','fro','fru','fré'],['fraise','frites','fromage','fruit','coffre'], 'F et r se suivent. Souffle pour f, puis enchaîne avec r.', 'Écoute fr dans fraise et dans coffre.'),
  entry('pr','clusters','prise','🔌',['pra','pri','pro','pru','pré'],['prise','imprimante','empreinte','éprouvette','prince'], 'P et r se suivent. Enchaîne les deux consonnes avant la voyelle.', 'Écoute pr dans prise et dans imprimante.'),
  entry('tr','clusters','train','🚂',['tra','tri','tro','tru','tré'],['train','tracteur','trompette','citron','trèfle'], 'T et r se suivent. Assemble les deux consonnes, comme dans train.', 'Écoute tr dans train et dans citron.'),
];
export const families = [
  { id:'letters', title:'Les lettres malicieuses', subtitle:'J’observe leur forme', letters:['p','b','d','q'], color:'peach', emoji:'🔎' },
  { id:'sounds', title:'Les sons qui chatouillent', subtitle:'J’écoute et je ressens', letters:['f','v','g','j'], color:'lilac', emoji:'🎵' },
  { id:'vowels', title:'Les voyelles magiques', subtitle:'Je découvre leurs sons', letters:['e','é','ai','oi','ou','au','eau'], color:'blue', emoji:'✨' },
  { id:'clusters', title:'Les consonnes qui grincent', subtitle:'J’assemble deux consonnes', letters:['br','dr','gr','cr','fr','pr','tr'], color:'mint', emoji:'🦗' },
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
