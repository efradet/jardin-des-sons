// Homophones force the intended French sound instead of spelling abbreviations
// or treating invented syllables as foreign words. Displayed text never changes.
export const pronunciation = {
  pau:'peau', tau:'taux', sau:'saut', fau:'faux', chau:'chaud',
  peau:'peau', beau:'beau', veau:'veau', seau:'saut', deau:'dos',
  ga:'gars', go:'go', gui:'gui', gou:'goût', gai:'gai',
  je:'je', jou:'joue', ju:'jus', jeu:'jeu', joi:'joie',
  pa:'pas', pi:'pie', po:'pot', pu:'pu', pé:'pé',
  ba:'bas', bi:'bi', bo:'beau', bu:'bu', bé:'bé',
  da:'da', di:'dit', do:'dos', du:'du', dé:'dé',
  qua:'cas', qui:'qui', que:'que', quou:'cou', quoi:'quoi',
  fa:'fa', fi:'fit', fo:'faux', fu:'fut', fé:'fée',
  va:'va', vi:'vie', vo:'veau', vu:'vu', vé:'vé',
  le:'le', re:'re', de:'de', me:'me', te:'te',
  pai:'paix', bai:'baie', fai:'fait', vai:'vais', lai:'lait',
  poi:'pois', boi:'bois', foi:'foi', voi:'voix', doi:'doigt',
  pou:'pou', bou:'boue', fou:'fou', vou:'vous', dou:'doux',
};
export const pronunciationText = text => pronunciation[text] ?? text;
