# Le jardin des sons

Application française React + Vite pour explorer la lecture avec une carte mentale interactive. Toutes les branches sont librement accessibles : p, b, d, q, f, v, e, é, ai, oi, ou, au, eau, g, j, br, dr, gr, cr, fr, pr et tr.

## Lancer

Windows : double-cliquer sur `START-JARDIN.cmd`. Node.js 22.12+ (ou 20.19+) requis.

```sh
npm install
npm run dev
```

Le serveur écoute sur le port **5182**, sur toutes les interfaces. Sur ce PC : http://localhost:5182. Sur le même réseau domestique : http://172.22.22.77:5182 (adresse Wi-Fi actuelle du PC ; elle peut changer). Garder le PC et le serveur allumés. Aucun tunnel ni transfert de port Internet n'est nécessaire.

`npm run build` produit `dist`, et `npm run preview` sert ce résultat sur le même port. Arrêter le serveur de développement avant de lancer l'aperçu. Le lanceur Windows utilise les mêmes paramètres réseau.

## Jouer

- Choisir parmi p, b, d, q, f, v, e, é, ai, oi, ou, au, eau, g, j, br, dr, gr, cr, fr, pr et tr dans la carte.
- Écouter les exemples et découvrir l'indice de forme ou de prononciation.
- **Je repère** : retrouver la lettre affichée parmi des lettres proches.
- **Les mots en images** : lire un mot entier puis choisir son dessin, sans légende visible dans les réponses. Les cartes gardent leur taille après un appui. Ce jeu ne propose aucun bouton d'écoute, même dans l'aide ou après la réponse.
- **La chenille des mots** : écouter un mot entier puis cliquer sur son écriture. Une bonne réponse fait avancer la chenille et manger une feuille ; une erreur lui fait faire une grimace sans avancer. Cinq étapes, ou huit dans le grand défi.
- **J'écoute** : écouter une syllabe/un mot et sélectionner son écriture.
- **Je lis** : lire une syllabe/un mot, écouter les propositions numérotées et choisir le son correspondant.
- **Les mots** (niveau proposé par défaut) : cinq mots par branche et quatre choix. Les réponses d'écoute comprennent des mots proches, comme poisson / poison ou poule / boule.
- **Le grand défi** : huit mots tirés de plusieurs branches, avec six choix. **Je repère** reste un échauffement de cinq lettres.
- Aucun chronomètre ni pénalité ; les erreurs autorisent un nouvel essai. Une fleur par séance terminée. Le bilan distingue les réponses trouvées du premier coup sans indice.
- Les réglages permettent d'agrandir les caractères et d'aérer le texte. Les anciennes préférences de confort et les fleurs sont conservées.

## Audio, données et accompagnement

Le vocabulaire est livré avec **436 enregistrements de vocabulaire**, produits avec la voix française **Denise Neural** (Microsoft), à un débit légèrement ralenti (-12 %). La voix reste identique sur ordinateur et téléphone. Il s'agit de synthèse vocale préenregistrée, pas d'une personne enregistrée. Les formes ambiguës sont corrigées avec des homophones : `vo` → `veau`, `vai` → `vais`, `voi` → `voix`. Les exercices montrent toujours la graphie étudiée.

Les fichiers sont lus directement depuis l'hébergement, sans clé API ni service de synthèse appelé pendant les jeux. En cas d'échec audio, l'application affiche une aide et permet de réessayer ; elle ne remplace pas les sons étudiés par une autre voix. Seul un éventuel texte auxiliaire absent du catalogue peut utiliser `speechSynthesis`. Aucun micro n'est utilisé. L'application n'évalue pas la lecture orale. Vérifier ensemble les sons à la première utilisation : un test logiciel ne certifie pas une prononciation.

Les **95 dessins de mots et la chenille** sont les SVG originaux [OpenMoji](https://openmoji.org/), sous [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), distribués sans modification. Attribution détaillée : `public/illustrations/ATTRIBUTION.md`. Les illustrations pouvant représenter plusieurs bonnes réponses ne sont pas opposées dans un même défi (oiseau / hibou, poisson / requin).

Pour régénérer les ressources (facultatif, réservé au développement) : `python -m pip install edge-tts`, `node scripts/prepare-assets.mjs`, puis `python scripts/generate-assets.py`. Seul le vocabulaire générique est envoyé lors de cette génération. Les fichiers livrés rendent Python inutile pour jouer.

Les fleurs, préférences et les 100 dernières séances terminées sont stockées uniquement dans localStorage de ce navigateur, sans compte enfant. « Mon jardin » affiche les dix dernières séances, leur date et le résultat du premier essai sans aide. Les anciennes fleurs sont conservées. Chaque navigateur, appareil et adresse du site possède sa propre sauvegarde : aucune synchronisation entre le téléphone, le PC, l'adresse locale et le site hébergé. Un navigateur qui bloque ce stockage affiche un message et garde la séance utilisable. Les polices Google Fonts disposent d'un repli Arial ; elles ne reçoivent pas les résultats d'exercice.

La carte mentale organise la découverte : elle n'est pas présentée comme un traitement de la dyslexie. Adapter le rythme avec l'enseignant ou l'orthophoniste. `e` est contextuel, `q` est décodé dans `qu`, et les mots plus complexes peuvent nécessiter l'aide d'un adulte.

## Vérifications

`npm test` vérifie les exercices des branches, les mots/dessins, les six choix du grand défi, les corrections phonétiques, les fichiers audio et SVG, les alternatives ambiguës, les réessais, les indices, le double comptage et les données locales invalides. `npm run build` vérifie la compilation.

Les contenus sont dans `src/content.js`, le moteur dans `src/game.js`, la carte dans `src/App.jsx`, les séances dans `src/Exercise.jsx` et le thème dans `src/styles.css`.

Repères : [BDA](https://cdn.bdadyslexia.org.uk/uploads/documents/Advice/style-guide/BDA-Style-Guide-2023.pdf?v=1680084017), [CSEN / Réseau Canopé](https://www.reseau-canope.fr/fileadmin/user_upload/Projets/conseil_scientifique_education_nationale/MANUELS_CSEN_VDEF.pdf).

La famille **Les consonnes qui grincent** propose br, dr, gr, cr, fr, pr et tr. La chenille utilise deux bruitages originaux sans voix : trois grignotements et un petit son joyeux pour une bonne réponse, un son descendant pour une grimace. Régénération hors ligne : python scripts/generate-effects.py.

Une fleur arc-en-ciel animée et trois courts feux festifs célèbrent les séances. Le jardin affiche une fleur arc-en-ciel dès la première fleur, puis toutes les six fleurs. Le total et les anciennes sauvegardes restent inchangés. Les animations respectent la préférence de mouvement réduit.
