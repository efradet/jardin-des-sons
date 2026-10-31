# Plan d'implémentation

Objectif : livrer le jardin des sons jouable en React et Vite.
Référence : design.md. Exécution dans un nouveau dossier indépendant, sans modifier les projets existants.

1. Créer src/content.js et src/game.js : banque pédagogique, génération de cinq questions distinctes, correction et progression. Tests node:test sur contenu et transitions avant implémentation.
2. Créer App.jsx, Exercise.jsx et styles.css : carte accessible, découverte, séances, réglages et jardin de récompenses. Audio par speechSynthesis, repli explicite. localStorage tolérant aux données invalides.
3. Construire et tester en navigateur desktop/mobile : erreurs, réessais, réussite, retour carte, dialogues, réglages et rechargement. Livrer README et lanceur Windows.

Points de revue : aucune mauvaise réponse récompensée, choix non ambigus, q accompagné de u pour le décodage, audio absent sans blocage, aucune perte de lisibilité à petit écran.
