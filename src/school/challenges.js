const word=(text,parts,hint)=>({id:`challenge-${text}`,text,tiles:text.match(/ch|./gu),parts,hint});
const reading=(id,chunks,question,options,answer)=>({id:`challenge-read-${id}`,text:chunks.join(' '),chunks,question,options,answer});
export const challenges={
  9:{words:[
    word('prépare',['pré','pa','re'],'Garde le p et le r ensemble au début. Prépare se termine par e.'),
    word('purée',['pu','rée'],'Écoute pu, puis rée. À la fin, écris é puis e.'),
    word('parole',['pa','ro','le'],'Trois parties : pa, ro, le. Le mot se termine par e.'),
    word('proche',['pro','che'],'Garde p et r au début. Écris ch ensemble, puis e.')
  ],readings:[
    reading('9a',['Papa prépare le repas.','Léo lave le pull.'],'Qui lave le pull ?',['Papa','Léo','La pie'],'Léo'),
    reading('9b',['Papa a préparé la purée.','Léo a lavé le pull.'],'Qu’a préparé Papa ?',['Le pull','La pile','La purée'],'La purée')
  ]},
  10:{words:[
    word('pomme',['po','mme'],'Pomme s’écrit avec deux m, puis un e final.'),
    word('poche',['po','che'],'Pour écrire poche, garde ch ensemble et ajoute e à la fin.'),
    word('parasol',['pa','ra','sol'],'Trois parties : pa, ra, sol. On entend le l final.'),
    word('forme',['for','me'],'Écoute for, puis me. Le mot se termine par e.'),
    word('sol',['sol'],'Écris s, o, puis l. On entend le l final.')
  ],readings:[
    reading('10a',['Léo a la pomme.','Papa a le pot.'],'Qui a le pot ?',['Léo','Papa','La pie'],'Papa'),
    reading('10b',['Léo pose la pomme.','Papa lave le pot.'],'Que lave Papa ?',['La pomme','Le pull','Le pot'],'Le pot')
  ]},
  11:{words:[
    word('salade',['sa','la','de'],'Trois parties : sa, la, de. La dernière lettre est e.'),
    word('malade',['ma','la','de'],'Commence par ma. Puis écris la et de.'),
    word('samedi',['sa','me','di'],'Trois parties : sa, me, di. Le mot se termine par i.'),
    word('rapide',['ra','pi','de'],'Écoute ra, pi, de. Garde le p puis le d dans cet ordre.')
  ],readings:[
    reading('11a',['Papy lave la salade.','Léo prépare la purée.'],'Que prépare Léo ?',['La salade','La purée','Le repas de Papy'],'La purée'),
    reading('11b',['Samedi, Papy a vu Léo.','Léo a mal. Papy parle à Léo.'],'Qui a mal ?',['Papy','Papa','Léo'],'Léo')
  ]},
  12:{words:[
    word('jolie',['jo','lie'],'Pour écrire jolie au féminin, ajoute un e après le i.'),
    word('jappe',['ja','ppe'],'Jappe s’écrit avec deux p, puis e. Un petit chien jappe.'),
    word('déjà',['dé','jà'],'Écris é avec un accent aigu et à avec un accent grave.'),
    word('judo',['ju','do'],'Écoute ju, puis do. Distingue bien le j et le d.')
  ],readings:[
    reading('12a',['Julie a mis la jolie jupe.','Papa prépare le jus de pomme.'],'Que prépare Papa ?',['La jolie jupe','Le jus de pomme','La purée'],'Le jus de pomme'),
    reading('12b',['Julie a vu le joli radis.','Papy a vu la jolie pomme.'],'Qui a vu le radis ?',['Papy','Papa','Julie'],'Julie')
  ]}
};
