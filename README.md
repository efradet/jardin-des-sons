# Le jardin des sons

Application française React + Vite pour explorer la lecture avec une carte mentale interactive. Toutes les branches sont librement accessibles : p, b, d, q, f, v, e, é, ai, oi et ou.

## Lancer

Windows : double-cliquer sur `START-JARDIN.cmd`. Node.js 22.12+ (ou 20.19+) requis.

```sh
npm install
npm run dev
```

Ouvrir l'adresse locale affichée. `npm run build` produit `dist`, et `npm run preview` sert ce résultat.

## Jouer

- Choisir parmi p, b, d, q, f, v, e, é, ai, oi et ou dans la carte.
- Écouter les exemples et découvrir l'indice de forme ou de prononciation.
- **Je repère** : retrouver la lettre affichée parmi des lettres proches.
- **J'écoute** : écouter une syllabe/un mot et sélectionner son écriture.
- **Je lis** : lire une syllabe/un mot, écouter les propositions numérotées et choisir le son correspondant.
- Cinq défis par séance. Aucun chronomètre ni pénalité ; les erreurs autorisent un nouvel essai. Une fleur par séance terminée.
- Les réglages permettent de choisir syllabes ou mots, agrandir les caractères d'exercice et aérer le texte.

## Audio, données et accompagnement

La synthèse `speechSynthesis` utilise une voix française si elle est installée. Selon le navigateur/système, cette voix peut être locale ou fournie en ligne ; sa qualité sur des syllabes isolées varie. Aucun micro n'est utilisé. En cas d'échec de la synthèse, les textes restent accessibles avec un adulte. L'application n'évalue pas la lecture orale.

Les fleurs et préférences sont stockées uniquement dans localStorage de ce navigateur, sans compte enfant. Un navigateur qui bloque ce stockage affiche un message et garde la séance utilisable. Les polices Google Fonts disposent d'un repli Arial ; elles ne reçoivent pas les résultats d'exercice.

La carte mentale organise la découverte : elle n'est pas présentée comme un traitement de la dyslexie. Adapter le rythme avec l'enseignant ou l'orthophoniste. `e` est contextuel, `q` est décodé dans `qu`, et les mots plus complexes peuvent nécessiter l'aide d'un adulte.

## Vérifications

`npm test` vérifie les 66 combinaisons lettre/mode/niveau, les réponses uniques, les réessais, la prévention du double comptage et les données locales invalides. `npm run build` vérifie la compilation.

Les contenus sont dans `src/content.js`, le moteur dans `src/game.js`, la carte dans `src/App.jsx`, les séances dans `src/Exercise.jsx` et le thème dans `src/styles.css`.

Repères : [BDA](https://cdn.bdadyslexia.org.uk/uploads/documents/Advice/style-guide/BDA-Style-Guide-2023.pdf?v=1680084017), [CSEN / Réseau Canopé](https://www.reseau-canope.fr/fileadmin/user_upload/Projets/conseil_scientifique_education_nationale/MANUELS_CSEN_VDEF.pdf).
