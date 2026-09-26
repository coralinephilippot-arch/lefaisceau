# Pétillante — publication App Store et Google Play

Identifiant de l'app (les deux stores) : `org.lefaisceau.petillante`
Version : 1.0.0 · Android : minSdk 24, targetSdk 36 · iOS : 15.0 minimum, iPhone uniquement

## Comment c'est construit

- `../petillante/` est la **seule source** de l'app (HTML/CSS/JS). On ne modifie jamais `www/`.
- `petillante-mobile/` l'emballe avec Capacitor 8 : projets natifs `android/` et `ios/`.
- Dans l'app native, le partage passe par le menu système (textes et image du permis), et les vibrations par le moteur haptique de l'iPhone.
- À chaque push, GitHub Actions (`.github/workflows/petillante-mobile.yml`) :
  - compile l'**APK de test** Android, à installer directement sur un téléphone ;
  - compile le **bundle `.aab`** pour Google Play ;
  - vérifie que l'app **iOS compile**.
  Les fichiers se téléchargent dans l'onglet *Actions* du dépôt GitHub, en bas de chaque exécution, rubrique *Artifacts*.

Commandes locales : `npm ci`, puis `npm run sync`, puis `npm run android` (Android Studio) ou `npm run ios` (Xcode, Mac obligatoire).

---

## 1. Avant tout : trois vérifications juridiques

1. **Le nom.** Avant de publier, cherche « Pétillante » dans les bases de marques :
   - INPI : data.inpi.fr ;
   - EUIPO : TMview.
   Classes utiles : 9 (logiciels), 41 (divertissement), 42. Je n'ai **pas** fait cette recherche. Un dépôt INPI, comme pour Le Faisceau, protège la marque (art. L.712-1 CPI).
2. **Qui publie.** Il faut choisir entre un compte personnel (Coraline Philippot) et un compte d'organisation (Vox Feminarum) :
   - Apple : un compte d'organisation exige un numéro D-U-N-S (gratuit, quelques jours d'attente).
   - Google : un **compte personnel** créé après le 13 novembre 2023 doit d'abord faire un **test fermé avec au moins 12 testeurs pendant 14 jours** avant la mise en production. Un compte d'organisation en est dispensé. Source : Aide Play Console, « Exigences de test pour les nouveaux comptes de développeur personnels ».
3. **Statut de « professionnel » dans l'UE.** Apple et Google demandent de déclarer si tu es un professionnel (*trader*) au sens du règlement (UE) 2022/2065 (DSA, art. 30).
   - Si tu te déclares professionnelle, ton adresse et tes coordonnées seront affichées publiquement sur la fiche de l'app.
   - Pour une app gratuite, sans revenu et sans publicité, la déclaration « non professionnel » est généralement possible. Vérifie selon ta situation.

## 2. Comptes à ouvrir (toi seule peux le faire)

| Store | Où | Coût |
|---|---|---|
| Apple | developer.apple.com/programs | 99 USD par an (prix affiché en euros en France) |
| Google | play.google.com/console | 25 USD, une seule fois |

## 3. Google Play, étape par étape

1. **Créer la clé de signature** (une seule fois, à garder précieusement ; sa perte est rattrapable grâce à Play App Signing) :
   ```
   keytool -genkeypair -v -keystore petillante.jks -alias petillante -keyalg RSA -keysize 4096 -validity 10000
   ```
2. **Ajouter 4 secrets** dans GitHub (Settings, puis Secrets and variables, puis Actions) :
   - `PETILLANTE_KEYSTORE_BASE64` : le contenu de `base64 -w0 petillante.jks` ;
   - `PETILLANTE_KEYSTORE_PASSWORD` ;
   - `PETILLANTE_KEY_ALIAS` : `petillante` ;
   - `PETILLANTE_KEY_PASSWORD`.
   Au push suivant, le `.aab` sort **signé**. Le numéro de version augmente tout seul à chaque compilation.
3. **Dans la Play Console** : Créer une application, puis Pétillante, gratuite, catégorie *Style de vie*.
4. **Contenu de l'application** :
   - Sécurité des données : « Aucune donnée collectée ni partagée ».
   - Politique de confidentialité : `https://lefaisceau.org/petillante/confidentialite.html`.
   - Classification du contenu : remplir le questionnaire IARC (contenu attendu : tout public).
   - Public cible : 18 ans et plus.
   - Publicités : non.
5. Envoyer le `.aab` en **test fermé** (ou directement en production pour un compte d'organisation).

## 4. App Store, étape par étape

1. Il faut un **Mac avec Xcode**. Sans Mac, un service cloud comme Codemagic le fait à distance.
2. Lancer `npm ci`, puis `npm run ios`. Xcode s'ouvre.
3. Dans *Signing & Capabilities*, choisir ton équipe Apple.
4. Faire *Product*, puis *Archive*, puis *Distribute App*, puis *App Store Connect*.
5. **Dans App Store Connect** :
   - Nouvelle app, bundle `org.lefaisceau.petillante`.
   - Confidentialité de l'app : « Données non collectées ».
   - URL de confidentialité : celle ci-dessus.
   - Classement : 4+.
   - Catégorie : Style de vie.
6. Soumettre à la vérification.

Point de vigilance Apple : la règle 4.2 (*Minimum Functionality*) refuse les apps qui ne sont « qu'un site web ». Pétillante s'en distingue : elle fonctionne entièrement hors ligne, utilise le partage et le retour haptique natifs, et ne dépend d'aucune page distante. Dans les notes pour la vérification, écris : « Application autonome, 100 % hors ligne, aucune donnée collectée. »

## 5. Fiche store (prête à coller)

**Nom** (30 caractères max) : `Pétillante`

**Sous-titre Apple** (30 max) : `La bonne humeur, format poche`

**Description courte Google** (80 max) :
`Une dose de bonne humeur par jour, un bocal à fiertés et un bouton fou rire.`

**Texte promotionnel Apple** (170 max) :
`Pas de compte, pas de pub, pas de pistage. Juste une dose de bonne humeur par jour, pour toutes celles qui font tourner le monde (et cherchent leurs lunettes).`

**Mots-clés Apple** (100 max) :
`bonne humeur,humour,femme,positif,bien-être,affirmation,motivation,sourire,gratitude,journal,rire`

**Description** (Apple et Google) :

> Pétillante, c'est la petite app qui te fait du bien. Drôle, tendre, jamais moqueuse.
>
> ☀️ LA DOSE DU JOUR
> Une phrase pour sourire, chaque matin. « Tu n'as pas perdu tes lunettes. Elles sont en télétravail, sur ta tête. » Garde tes préférées, partage-les à tes amies.
>
> 🌦 TA MÉTÉO INTÉRIEURE
> Grand soleil, brouillard, orage de charge mentale ou canicule personnelle : un bulletin décalé et un vrai petit conseil.
>
> ✨ LA MISSION PÉTILLANTE
> Un défi minuscule et joyeux par jour. Danser dans la cuisine. Boire son café chaud. Assise.
>
> 🫙 LE BOCAL À FIERTÉS
> Chaque petite victoire devient une bille colorée. Secoue le bocal pour relire tes plus belles fiertés.
>
> 🖋 LE MINISTÈRE DE L'INDULGENCE
> Des permis officiels, tamponnés, à ton nom : Permis de faire la sieste. Permis de dire non. Permis de manger le dessert en premier. À partager sans modération.
>
> 🚨 URGENCE FOU RIRE
> Un gros bouton rouge pour les journées grises, et le dico des mots qui manquaient (Frigonésie : ouvrir le frigo, oublier pourquoi, le refermer…).
>
> 🔒 TES DONNÉES RESTENT CHEZ TOI
> Aucun compte, aucune publicité, aucun traceur. Tout reste sur ton téléphone, même hors connexion.
>
> Textes en grand, mode nuit, pensée pour les femmes de 30 à 70 ans et toutes celles qui ont besoin d'un sourire.

**Captures** : dossier `store/screenshots/`.
- App Store, iPhone 6,9″ : 1320 × 2868, fichiers `ios-6.9-*`.
- Google Play : 1080 × 2160, fichiers `android-*`.

**Icônes et bannière** :
- Apple, icône 1024 : `assets/icon-only.png`.
- Google, icône 512 : `store/google-icon-512.png`.
- Google, bannière : `store/google-feature-graphic-1024x500.png`.
