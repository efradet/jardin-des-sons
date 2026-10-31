// Original stories: earlier graphemes are reused, later ones are not introduced.
// The first two lessons use adult scene-setting and tiny child-readable dialogues.
const story=(id,title,paragraphs,questions,adultIntro='')=>({
  id:`story-${id}`,title,paragraphs,adultIntro,
  questions:questions.map(([question,options,answer],i)=>({id:`story-${id}-q${i+1}`,text:`${title} · ${question}`,question,options,answer})),
});
export const stories={
  1:story(1,'Les deux marionnettes', ['A : « A ! »','O : « O ! »','A : « O ? »','O : « A ! »'],[
    ['Quelle marionnette parle en premier ?',['A','O'],'A'],
    ['Quelle marionnette dit « A ! » à la fin ?',['A','O'],'O'],
  ],'Lecture partagée : un adulte présente deux marionnettes, A et O. Elles disent leur nom, puis échangent leurs sons pour jouer. L’enfant lit seulement les voyelles du petit dialogue. Les questions peuvent être écoutées.'),
  2:story(2,'Lola est là', ['Léo : « Lola ! »','Lola : « Léo ! »','Léa : « Lola ! »','Lola : « Léa ! »'],[
    ['Qui appelle Lola en premier ?',['Léo','Léa'],'Léo'],
    ['Qui Lola appelle-t-elle à la fin ?',['Léo','Léa'],'Léa'],
  ],'Lecture partagée : Lola joue à se cacher. Léo puis Léa appellent Lola. Elle leur répond. L’adulte raconte la scène ; l’enfant lit les prénoms du dialogue. Les questions peuvent être écoutées.'),
  3:story(3,'Le vélo de Lola', ['Lola a le vélo.','Léo lave le vélo.','Lola va à vélo.','Léo a lavé le vélo !'],[
    ['Qui lave le vélo ?',['Lola','Léo'],'Léo'],
    ['Qui va à vélo ?',['Lola','Léo'],'Lola'],
  ]),
  4:story(4,'La visite de Milo', ['Milo a vu Mamie.','Mamie a vu Léo.','Léo a le vélo.','Milo va à vélo.'],[
    ['Qui Milo a-t-il vu ?',['Lola','Mamie'],'Mamie'],
    ['Qui va à vélo à la fin ?',['Milo','Mamie'],'Milo'],
  ]),
  5:story(5,'La fée et le vélo', ['Léa a vu la fée.','La fée a le vélo.','La fée lave le vélo.','Léa va à vélo.'],[
    ['Qui lave le vélo ?',['La fée','Léa'],'La fée'],
    ['Qui va à vélo à la fin ?',['La fée','Léa'],'Léa'],
  ]),
  6:story(6,'Le vélo sali', ['Léa a sali le vélo.','Léo lave le vélo.','Mamie salue Léo.','Léa salue Mamie.'],[
    ['Qui a sali le vélo ?',['Léo','Léa','Mamie'],'Léa'],
    ['Qui lave le vélo ?',['Mamie','Léa','Léo'],'Léo'],
  ]),
  7:story(7,'Le chat de Milo', ['Milo a vu le chat.','Le chat a sali le vélo.','Milo a chassé le chat.','Léa lave le vélo.','Le chat file.'],[
    ['Qui a sali le vélo ?',['Le chat','Milo','Léa'],'Le chat'],
    ['Qui lave le vélo ?',['Milo','Léa','Le chat'],'Léa'],
  ]),
  8:story(8,'Le chat arrive', ['Marie a vu le rat.','Le rat va sur le mur.','Le chat arrive.','Le rat file.','Marie rit.'],[
    ['Où va le rat ?',['Sur le lit','Sur le mur','Sur le vélo'],'Sur le mur'],
    ['Qui arrive avant la fuite du rat ?',['Le chat','Léo','La vache'],'Le chat'],
  ]),
  9:story(9,'Le pull de Papa', ['Papa a le pull.','Le chat arrive.','Le chat a sali le pull.','Léo lave le pull.','Papa prépare la purée.'],[
    ['Qui a sali le pull ?',['Papa','Léo','Le chat'],'Le chat'],
    ['Que prépare Papa ?',['La purée','Le salami','La pomme'],'La purée'],
  ]),
  10:story(10,'La pomme de Léo', ['Léo a la pomme.','Papa a le pot.','Léo pose la pomme près du pot.','Le chat arrive.','Papa lave la pomme.'],[
    ['Où Léo pose-t-il la pomme ?',['Près du pot','Sur le lit','Sur le mur'],'Près du pot'],
    ['Qui lave la pomme ?',['Léo','Le chat','Papa'],'Papa'],
  ]),
  11:story(11,'Le repas de Papy', ['Samedi, Papy a vu Léo.','Léo lave la salade.','Papy prépare la purée.','Le chat arrive.','Papy pose le repas.'],[
    ['Que lave Léo ?',['La salade','Le pull','Le pot'],'La salade'],
    ['Qui prépare la purée ?',['Léo','Le chat','Papy'],'Papy'],
  ]),
  12:story(12,'La jolie jupe', ['Julie a mis la jolie jupe.','Elle va près de Papy.','Papy prépare le jus de pomme.','Julie pose le verre.','Le chat arrive près de Julie.'],[
    ['Qu’a mis Julie ?',['Le pull','La jolie jupe','Le pyjama'],'La jolie jupe'],
    ['Que prépare Papy ?',['La purée','Le jus de pomme','La salade'],'Le jus de pomme'],
  ]),
  13:story(13,'Le nid de la pie', ['Noémie a vu la pie près du nid.','René arrive. Il a une nappe.','Il pose la nappe sur le sol.','La pie ne va pas sur la nappe.','Elle vole vers le nid.','Noémie rit.'],[
    ['Qui apporte la nappe ?',['Noémie','René','La pie'],'René'],
    ['Où va la pie ?',['Vers le nid','Vers la nappe','Vers la niche'],'Vers le nid'],
  ]),
  14:story(14,'La pêche de Papy', ['Papy va à la pêche près de la rivière.','Léo arrive. Il a une pêche.','Il pèle la pêche.','Papy a vu une loche.','La loche file.','Léo rit. Papy rêve de la loche.'],[
    ['Que pèle Léo ?',['Une pomme','Une pêche','Une fève'],'Une pêche'],
    ['Quel animal file ?',['La pie','Le chat','La loche'],'La loche'],
  ]),
  15:story(15,'La tarte de Léa', ['Léa apporte la tarte à la tomate.','Léo pose la tarte près de Papy.','La chatte arrive sur le tapis.','Elle a une patte sale.','Léo lave la patte.','Puis la chatte va sur le tapis.'],[
    ['À quoi est la tarte ?',['À la pomme','À la tomate','À la pêche'],'À la tomate'],
    ['Que lave Léo ?',['La patte','La tarte','Le tapis'],'La patte'],
  ]),
  16:story(16,'Un fil et une pelote', ['Léo a un fil et une pelote.','Léa a une jupe et un pull.','Un chat arrive et tire le fil.','La pelote va sur le tapis.','Léo ramasse la pelote.','Le chat dort et rêve.'],[
    ['Qui tire le fil ?',['Léa','Léo','Le chat'],'Le chat'],
    ['Qui ramasse la pelote ?',['Léo','Le chat','Léa'],'Léo'],
  ]),
  17:story(17,'Le sac près du lac', ['Luc arrive près du lac avec un sac.','Il pose le sac sur la rive.','Un canard arrive et picore près du sac.','Léa arrive avec une carte.','Elle parle à Luc.','Luc ramasse le sac et le canard va sur le lac.'],[
    ['Où Luc pose-t-il le sac ?',['Sur la rive','Sur le canard','Sur le lac'],'Sur la rive'],
    ['Qui apporte une carte ?',['Luc','Léa','Papy'],'Léa'],
  ]),
};
