# Pétillante

App web (PWA) de bonne humeur pour les femmes de 30 à 70 ans. Aucun build : GitHub Pages la sert à `/petillante/`.

- **Aujourd'hui** : dose du jour, météo intérieure, mission quotidienne (+ série de jours)
- **Bocal à fiertés** : on y dépose ses petites victoires, on le secoue pour en relire une
- **Ministère de l'Indulgence** : permis officiels, tampon, export PNG 1080×1350 à partager
- **Fou rire** : bouton d'urgence + dico des mots qui manquaient

Zéro dépendance, zéro traceur. Données uniquement dans le `localStorage` du navigateur, sous le préfixe `petillante:`.
« Tout effacer » ne supprime que ces clés, jamais celles du Faisceau. Service worker limité à `/petillante/`.

Contenus éditoriaux : `content.js`. Polices auto-hébergées (Fraunces, Outfit, licence SIL OFL 1.1).

© 2026 Coraline Philippot. Tous droits réservés.
