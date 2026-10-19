# Arancini Club · PMS numérique — pack de prompts de développement (v2, vérifiée)

> Version revue le 19/10/2026. Les corrections par rapport à la v1 sont marquées **[v2]** et justifiées, sources à l'appui, dans [`VERIFICATION.md`](./VERIFICATION.md).

**Objectif.** Construire l'application interne (espace franchisé + espace Groupe Dunamis) au niveau d'exigence d'un éditeur HACCP professionnel, sans abonnement tiers. La sécurité est pensée dès la conception pour éviter toute fuite de données (RGPD art. 25 et 32, recommandations CNIL, OWASP ASVS 5.0 niveau 2).

**Mode d'emploi.** Colle les prompts **dans l'ordre**, un par session de Claude Code, dans un **dépôt dédié et privé** (pas dans le dépôt public `lefaisceau`). Chaque prompt se termine par une **définition de fini** : ne passe pas au suivant tant qu'elle n'est pas remplie. Le prototype `prototype/AranciniClub_PMS_Franchise.html` sert de référence fonctionnelle et graphique. Il doit être copié dans le dépôt avant P1.

## Arborescence cible

```
arancini-club-pms/
├── app/                         # Next.js 16 App Router
│   ├── (franchise)/             # espace tablette : modules, rapports
│   ├── (groupe)/                # espace Groupe : réseau, visas, audit, exports
│   ├── api/                     # route handlers (zod en entrée, RLS en base)
│   └── proxy.ts                 # [v2] Next 16 : ex-middleware → CSP nonce, en-têtes
├── lib/
│   ├── regles.ts                # SOURCE UNIQUE des règles métier (couverture 100 %)
│   ├── db/{schema,rls,client}.ts
│   ├── crypto/{champs,blind-index,pin}.ts
│   ├── audit/{chaine,verif}.ts
│   └── offline/{file,sync}.ts
├── db/
│   ├── migrations/              # Drizzle, rôle « migrator » uniquement
│   ├── policies/                # SQL RLS versionné
│   └── tests/                   # tests SQL (pgTAP ou Vitest + testcontainers)
├── jobs/                        # tâches planifiées serveur (retards, purge, intégrité)
├── e2e/                         # Playwright
├── docs/                        # ARCHITECTURE, THREAT_MODEL, RGPD, ASVS, PCA, INCIDENT,
│                                #   REGLES_ESCALADE, RUNBOOK, REGISTRE (généré)
├── prototype/AranciniClub_PMS_Franchise.html
├── infra/{Dockerfile,docker-compose.yml,scaleway/}
└── .github/workflows/ci.yml     # lint, test, audit, semgrep, gitleaks, osv-scanner
```

---

## P0 — Contexte commun (à coller en tête de CHAQUE session)

```
Tu es développeur senior full-stack et responsable sécurité d'une application métier française.
Projet : « Arancini Club PMS », plan de maîtrise sanitaire numérique pour un réseau de food trucks en franchise (franchiseur : Groupe Dunamis SAS). Deux espaces : FRANCHISÉ (relevés HACCP sur tablette, 2 rapports signés par jour) et GROUPE (contrôle réseau, alertes, audit). Référence fonctionnelle : prototype/AranciniClub_PMS_Franchise.html (8 modules, règles métier en tête de script : SEUILS, EQUIPEMENTS, DLC_SECONDAIRES, NETTOYAGE, REQ).

Stack imposée (versions épinglées, vérifie la dernière stable maintenue au démarrage) :
- Next.js 16 (App Router, TypeScript strict ; le middleware s'appelle désormais proxy.ts).
- PostgreSQL 17 ou 18 managé dans l'UE (Scaleway fr-par ou OVHcloud Gravelines). En PG 18, utilise uuidv7() natif. En PG 16/17, génère l'UUID v7 côté application. [v2]
- Drizzle ORM (politiques RLS déclarées avec pgPolicy + SQL versionné).
- Better Auth (passkeys + 2FA TOTP natifs). Auth.js est en maintenance seule depuis sept. 2025 : ne le prends pas pour un nouveau projet. [v2]
- Tailwind 4 ; PWA hors-ligne avec Serwist (fork maintenu de Workbox ; next-pwa est abandonné). [v2]
- Playwright (E2E), Vitest (unitaire).
- Déploiement : conteneur Docker sur Scaleway. Pas de Vercel, pas d'Upstash ni d'autre service US : c'est un CHOIX de souveraineté du Groupe, pas une interdiction légale (voir docs/RGPD.md). [v2]

Charte graphique stricte (aucune autre couleur) : #890c11 fond, #9e100d, #d31c19, #d89500 accent, #fef8e7 textes. Montserrat SemiBold. Logo officiel fourni, jamais redessiné. Titres ≥ 48 px sur tablette, zones tactiles ≥ 48 px, champs 16 px minimum. Ton : tutoiement, phrases courtes.
Règles de contraste (RGAA 4.1 critères 3.2 et 3.3, mesurées) [v2] :
- crème #fef8e7 sur #890c11 = 9,3:1, sur #9e100d = 7,8:1 et sur #d31c19 = 5,0:1 → conforme pour tout texte ;
- ocre #d89500 sur #890c11 = 3,9:1 → seulement texte ≥ 24 px, icônes, bordures ; jamais de texte courant ;
- rouge #d31c19 sur #890c11 = 1,9:1 → jamais de texte NI de composant d'interface seul sur bordeaux ; il sert de FOND (bandeau d'alerte avec texte crème) ;
- l'état « non conforme » ne repose jamais sur la couleur seule (icône + libellé, RGAA 3.1).

Règles non négociables :
1. Aucun secret dans le code ni dans Git (.env.local ignoré, secrets via le gestionnaire de secrets Scaleway, rotation documentée).
2. Validation de toutes les entrées côté serveur avec zod. Jamais de SQL concaténé. En-têtes de sécurité : CSP stricte avec nonce, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
3. Moindre privilège : Row-Level Security PostgreSQL ACTIVÉE ET FORCÉE (FORCE ROW LEVEL SECURITY) sur toutes les tables. Le contexte est posé par set_config('app.user_id', …, true) DANS chaque transaction (jamais au niveau session, à cause du pool de connexions). Un franchisé ne lit que SON truck. Le Groupe lit tout mais n'écrit que des visas et des commentaires.
4. Journal d'audit append-only, chaîné par SHA-256, horodatage serveur UTC. Insertion sérialisée (verrou consultatif) pour éviter que la chaîne ne fourche. Aucune route UPDATE/DELETE sur les relevés et les rapports : une correction est un nouvel enregistrement qui référence l'ancien.
5. RGPD : minimisation (initiales et identifiant interne, jamais le nom complet côté Groupe). Durées de conservation codées : relevés 3 ans (choix interne), traçabilité selon la DLC (voir VERIFICATION.md), logs 6 mois à 1 an (CNIL 2021-122). Export et effacement sur demande, sauf pour les registres HACCP, qui relèvent d'une obligation légale (RGPD art. 17.3.b). Registre des traitements généré depuis le schéma.
6. Aucune dépendance npm non maintenue. `npm audit --audit-level=high` à zéro + osv-scanner avant chaque fin de session. Versions épinglées, lockfile commité.
7. Tout code livré est testé. Tu écris les tests avant de dire « terminé ».
8. Tu expliques en 5 lignes maximum ce que tu as fait, puis tu listes ce qui reste risqué. Tu ne publies rien et tu ne déploies rien sans instruction explicite.
```

---

## P1 — Architecture et menace

```
[P0]
Tâche : poser l'architecture et le modèle de menace avant toute ligne de code.
1. docs/ARCHITECTURE.md : schéma des composants (tablette PWA → API Next.js → PostgreSQL UE ; stockage objets S3 compatible UE pour les photos, chiffré au repos ; sondes connectées en vague 3 via MQTT sur TLS), flux de données, emplacement des secrets, sauvegardes (quotidiennes, chiffrées, 30 jours, test de restauration mensuel), fuseau Europe/Paris (changements d'heure inclus) pour toutes les règles horaires.
2. docs/THREAT_MODEL.md selon STRIDE : acteurs (franchisé, salarié du franchisé, Groupe, DDPP en contrôle, attaquant externe, tablette volée), biens à protéger (relevés, rapports signés, photos, identités), scénarios de fuite et contre-mesures. Cas obligatoires : tablette volée (chiffrement de l'appareil, session courte, effacement à distance), compte compromis (MFA, verrouillage progressif), export massif (quota, journalisation), injection, XSS via photos ou étiquettes, fuite par les logs applicatifs (aucune donnée personnelle dans les logs), fuite de la base (PIN haché avec pepper, champs chiffrés hors base) [v2], fourche de la chaîne d'audit [v2].
3. docs/RGPD.md : finalités ; bases légales (obligation légale art. 6.1.c pour les registres imposés par le règl. CE 852/2004 art. 5 et le 178/2002 art. 18 ; intérêt légitime art. 6.1.f pour le contrôle réseau) ; rôles (le franchisé est responsable de traitement pour ses salariés ; Groupe Dunamis est responsable conjoint du reporting, avec un accord art. 26 à signer) ; durées de conservation ; droits des personnes ; sous-traitants art. 28 (hébergeur UE, stockage objets UE, Brevo) ; information des salariés (C. trav. L1222-4) et consultation du CSE si le franchisé emploie 50 salariés ou plus (C. trav. L2312-38) [v2] ; AIPD art. 35 non requise a priori, à justifier par écrit [v2] ; rappel que le transfert hors UE n'est pas interdit (décision d'adéquation UE-US du 10/07/2023) mais exclu par choix [v2].
4. Initialise le dépôt : Next.js 16 TS strict, ESLint + eslint-plugin-security, Prettier, Husky (lint + test en pre-commit), .env.example sans valeur réelle, Dockerfile multi-stage non-root, docker-compose pour PostgreSQL local, arborescence ci-dessus.
Définition de fini : les 3 documents existent, `npm run lint` et `npm run build` passent, aucun secret dans le dépôt (vérifié avec gitleaks).
```

## P2 — Schéma de données et RLS

```
[P0]
Tâche : schéma PostgreSQL avec Drizzle et Row-Level Security.
Tables (toutes avec id uuid v7, created_at timestamptz côté serveur, created_by) :
- organisations (groupe | franchisé), trucks (organisation_id, nom, siret_chiffré), users (organisation_id, rôle : franchise_owner | franchise_staff | groupe_pilotage | groupe_reseau | groupe_finance | groupe_tech, initiales, email_chiffré, email_index (HMAC-SHA256 avec une clé dédiée, pour la recherche à la connexion) [v2]), equipements (truck_id, type frigo|congel|vitrine, seuils),
- releves (truck_id, module, créneau matin|soir, payload jsonb validé par zod selon le module, conforme bool, action_corrective, photo_key, heure_declaree, heure_serveur, saisi_hors_ligne_a, cle_idempotence uuid UNIQUE [v2], corrige_releve_id, audit_n) — INSERT ONLY,
- rapports (truck_id, jour, créneau, signé_par, signé_à, en_retard, nb_nc, releve_ids[], hash sha256) — INSERT ONLY, contrainte unique (truck_id, jour, créneau),
- visas (rapport_id, par, à, commentaire),
- audit_log (n bigserial, at, actor, truck_id, action, payload jsonb, prev_hash, hash) — INSERT ONLY. Un trigger refuse UPDATE/DELETE/TRUNCATE et calcule hash = sha256(prev_hash || payload canonique RFC 8785), sous pg_advisory_xact_lock pour sérialiser [v2],
- retention_jobs (table, cutoff, exécuté_à).
RLS : ENABLE + FORCE sur toutes les tables. Politiques par rôle via current_setting('app.user_id') et current_setting('app.org_id'), posés par set_config(…, true) dans chaque transaction. franchise_* : SELECT/INSERT limité à son truck. groupe_* : SELECT global, INSERT uniquement sur visas et audit. Aucun rôle n'a UPDATE/DELETE sur releves/rapports/audit_log (REVOKE explicite en plus des politiques). Rôle PostgreSQL applicatif (non propriétaire, sans BYPASSRLS) distinct du rôle de migration.
Chiffrement [v2] : email et siret chiffrés CÔTÉ APPLICATION (AES-256-GCM ou libsodium secretbox, clé en variable d'environnement, versionnée pour la rotation). Pas de pgcrypto avec la clé passée en SQL : elle finirait dans les logs PostgreSQL (log_statement, pg_stat_statements).
Livrables : migrations Drizzle, script de seed (2 trucks fictifs, 4 comptes Groupe nominatifs : Coraline, Laura, Magali, David, sans e-mails réels dans le dépôt), tests SQL qui prouvent qu'un franchisé ne lit pas l'autre truck, qu'un UPDATE sur releves échoue, et que deux insertions concurrentes dans audit_log gardent une chaîne linéaire.
Définition de fini : tests RLS verts, trigger d'immutabilité testé, `drizzle-kit check` sans dérive.
```

## P3 — Authentification et sessions

```
[P0]
Tâche : authentification conforme à la recommandation CNIL sur les mots de passe (délibération 2022-100 du 21/07/2022) et à OWASP ASVS 5.0 chapitres V6 (authentification) et V7 (sessions). [v2 : la numérotation V2/V3 était celle de l'ASVS 4.0.3]
- Better Auth : passkeys (WebAuthn) en premier choix sur tablette. Repli : e-mail + mot de passe d'au moins 12 caractères, vérifié contre Pwned Passwords en k-anonymity (seuls 5 caractères du hash SHA-1 sortent ; sinon, copie locale de la liste) + TOTP obligatoire pour les rôles groupe_* et franchise_owner.
- PIN de signature : 6 chiffres, distinct du mot de passe, stocké en argon2id AVEC un pepper serveur (HMAC) [v2]. Sans pepper, un million de combinaisons se cassent hors ligne si la base fuit. 5 essais, puis verrouillage de 15 min journalisé. Le PIN ne signe que des rapports ; il n'ouvre jamais la session.
- Sessions : cookie __Host-, HttpOnly, Secure, SameSite=Strict ; 12 h sur tablette, re-authentification pour signer ; invalidation côté serveur (table sessions) ; déconnexion à distance par le Groupe (tablette volée).
- Anti-automatisation : rate limiting par IP et par compte dans PostgreSQL (pas d'Upstash, service US) [v2], avec délai progressif.
- Pas de « mot de passe oublié » par lien éternel : lien valable 15 min, à usage unique, journalisé.
- Écran de connexion avec la liste nominative des comptes comme dans le prototype, mais SANS révéler les e-mails.
Tests : Playwright sur la connexion, la MFA, le verrouillage après 5 PIN faux, l'expiration de session et l'impossibilité de signer sans re-auth.
Définition de fini : tests verts, `npm audit` propre, exigences ASVS 5.0 V6 et V7 de niveau 2 cochées dans docs/ASVS.md.
```

## P4 — Modules de relevés (8) et règles métier

```
[P0]
Tâche : implémenter les 8 modules à partir du prototype. Les règles métier vivent dans lib/regles.ts (source unique, testée). Chaque règle porte en commentaire sa source : texte légal ou « choix interne Dunamis ». [v2]
Modules : contrôle à réception, traçabilité (photo d'étiquette), impression d'étiquettes DLC secondaires, enceintes froides (4 équipements, matin et soir), capteurs (interface prête, données en vague 3), température de préparation, plan de nettoyage (checklists ouverture / clôture / hebdo), contrôle des huiles.
Étiquettes [v2] : PDF 62 mm imprimé via l'appli Brother (iPrint&Label) ou, en mode avancé, envoi serveur en mode raster / P-touch Template vers la QL-820NWB. Une PWA ne parle pas directement à l'imprimante.
Règles :
- froid positif 0 à +3 °C (0 à +2 °C pour les produits sensibles) : consigne interne plus stricte que les maxima réglementaires (arrêté du 21/12/2009, annexe I) ;
- congélation ≤ −18 °C (produits surgelés) ;
- huile : composés polaires ≤ 25 % (décret 2008-184 du 26/02/2008, art. 8 ; au-delà, l'huile est réputée impropre à la consommation). Température ≤ 180 °C : bonne pratique DGCCRF, pas exigence du décret [v2] ;
- maintien au chaud ≥ +63 °C (arrêté du 21/12/2009, annexe I) ;
- « seuil + 6 °C = jeter » : règle interne Dunamis ;
- action corrective OBLIGATOIRE en cas de non-conformité (règl. CE 852/2004 art. 5.2 d) ;
- arancini cuits directement du surgelé, jamais décongelés : bloquer cette saisie (règle interne liée au plan HACCP du produit).
Horodatage : l'heure serveur fait foi ; l'heure déclarée est stockée ; drapeau « hors créneau » automatique.
Photos : upload vers le stockage objets UE via URL présignée de 5 min ; type MIME vérifié côté serveur (magic bytes) ; image ré-encodée (supprime l'EXIF, dont la géolocalisation, et neutralise les charges cachées) ; 5 Mo maximum ; nom de fichier aléatoire ; jamais servies en direct (URL présignée en lecture de 2 min).
Hors-ligne [v2] : relevés mis en file dans IndexedDB, chiffrés avec une clé d'appareil non exportable (WebCrypto) enveloppée par la session. Une session expirée hors ligne ne doit PAS rendre illisible un registre légal. Synchronisation à la reconnexion, idempotente (cle_idempotence générée sur la tablette), avec la mention « saisi hors ligne à ». En cas de conflit de créneau, le premier arrivé au serveur gagne et l'autre est conservé comme relevé complémentaire.
Tests : unitaires sur lib/regles.ts (chaque seuil, chaque bord : 3,0 / 3,1 / −18,0 / −17,9 / 25,0 / 25,1 / 63,0 / 62,9) ; E2E sur un relevé non conforme qui impose l'action corrective.
Définition de fini : 8 modules opérationnels sur tablette 10", couverture de lib/regles.ts = 100 %, aucune donnée personnelle dans les photos ni dans les logs.
```

## P5 — Les 2 rapports quotidiens et le contrôle Groupe

```
[P0]
Tâche : rapports signés et espace Groupe Dunamis.
- Rapport MATIN : exige les enceintes froides (4), l'huile et la checklist d'ouverture ; à signer avant 08:00 heure de Paris ; après, il passe « en retard » et déclenche une alerte.
- Rapport SOIR : exige les enceintes (4), l'huile, la préparation, la checklist de clôture et les DLC du jour ; signable à partir de 18:00.
- Signature électronique simple (C. civ. art. 1366-1367 ; règl. eIDAS 910/2014 art. 25) [v2] : re-authentification par PIN → snapshot immuable (ids de relevés + contenu canonique RFC 8785) → hash SHA-256 → entrée d'audit → notification Groupe (e-mail transactionnel via Brevo, sans contenu sensible : juste « rapport reçu » ou « en retard »). Elle est recevable en justice, mais sans présomption de fiabilité, réservée à la signature qualifiée. La chaîne d'audit et l'horodatage serveur portent donc la preuve. Option : horodatage qualifié RFC 3161 du hash quotidien.
- Espace Groupe : vue réseau (état matin/soir par truck, score 7 jours par TRUCK et jamais par personne), visa de rapport, alertes avec escalade codée (08:30 rappel automatique au franchisé ; 10:00 tâche pour le responsable réseau ; 3 NC identiques sur 7 jours → tâche « visite de contrôle »), journal d'audit avec vérification d'intégrité, export CSV/PDF pour la DDPP par truck et par période.
- Tâches planifiées (cron serveur, jamais côté client) : détection des retards à 08:01 et à 23:59 (Europe/Paris), purge de rétention mensuelle, test quotidien d'intégrité de la chaîne d'audit avec alerte en cas de rupture.
- Séparation des pouvoirs : le Groupe ne peut ni modifier ni supprimer un relevé. Il ne voit ni les horaires de travail ni l'identité complète des salariés du franchisé. Raisons : minimisation, et indépendance juridique du franchisé (un contrôle excessif expose à une requalification, C. trav. L7321-2) [v2].
Tests : E2E complet franchisé → signature → visa Groupe ; test que le Groupe ne peut pas faire d'INSERT dans releves ; test d'escalade avec horloge simulée, changements d'heure de mars et d'octobre inclus.
Définition de fini : scénario E2E vert, exports valides, docs/REGLES_ESCALADE.md à jour.
```

## P6 — Durcissement sécurité et conformité

```
[P0]
Tâche : passe de sécurité finale avant la mise en production.
1. CSP stricte (nonce par requête posé dans proxy.ts, pas d'inline, frame-ancestors 'none'), HSTS avec preload, cookies vérifiés, CORS fermé (même origine uniquement).
2. Dépendances : npm audit + osv-scanner (gratuit, sans abonnement) [v2], lockfile commité, Renovate configuré.
3. SAST (Semgrep, règles OWASP) et recherche de secrets (gitleaks) en CI ; la CI bloque le merge en cas d'échec.
4. Logs : structurés, sans donnée personnelle (pseudonymes), conservés de 6 mois à 1 an (CNIL 2021-122), accès restreint ; alerte à partir de 10 échecs d'authentification en 5 min.
5. Sauvegardes chiffrées (age ou KMS Scaleway), test de restauration automatisé, RPO 24 h, RTO 4 h, documentés dans docs/PCA.md.
6. Procédure de violation de données dans docs/INCIDENT.md : notification à la CNIL sous 72 h (RGPD art. 33), information des personnes si risque élevé (art. 34), registre des violations (art. 33.5) avec modèle.
7. Pentest interne : OWASP ZAP baseline contre le staging ; corrige tout ce qui est « High » et « Medium » ; joins le rapport.
8. Revue d'accessibilité RGAA 4.1 de base (contrastes de la charte selon le tableau P0, focus visible, labels). Le rouge #d31c19 ne porte jamais de texte sur le bordeaux.
Définition de fini : ZAP sans High ni Medium, CI verte, docs PCA/INCIDENT/RGPD/ASVS complets, checklist ASVS 5.0 niveau 2 cochée à 100 % ou écarts justifiés.
```

## P7 — PWA, déploiement et exploitation

```
[P0]
Tâche : mise en production maîtrisée.
- PWA : manifest, icône tirée du logo officiel, plein écran sur tablette, Serwist (cache des écrans, file des relevés hors ligne), mise à jour forcée au lancement suivant si la version serveur est plus récente.
- Infra : Docker non-root, Scaleway Paris (ou OVHcloud Gravelines), PostgreSQL managé chiffré au repos, bucket objets UE privé, TLS 1.2 minimum, DNS avec enregistrement CAA.
- Environnements : local, staging (données fictives), production ; promotion par tag Git ; migrations exécutées en CI avec rollback testé.
- Supervision : uptime, erreurs (GlitchTip ou Sentry auto-hébergé dans l'UE, données personnelles masquées), tableau de bord santé (latence, relevés en attente hors ligne par truck).
- docs/RUNBOOK.md : onboarding d'un nouveau truck (organisation, comptes, tablette durcie : MDM Samsung Knox ou Android Enterprise, chiffrement, verrouillage à 2 min, effacement à distance) ; révocation d'un franchisé (désactivation immédiate, conservation légale des relevés) ; export DDPP lors d'un contrôle ; restauration de sauvegarde.
Définition de fini : staging déployé et testé sur une vraie tablette Android 10", runbook relu par Laura, aucun secret hors du gestionnaire de secrets.
```

---

## Matériel par truck (sans abonnement)

| Poste | Référence type | Prix HT indicatif |
|---|---|---|
| Tablette durcie Android 10" | **Samsung Galaxy Tab Active5 Pro** (10,1", IP68) [v2 : la Tab Active5 simple fait 8"] | à chiffrer sur devis (sensiblement plus de 450 €) |
| Imprimante étiquettes | Brother QL-820NWB (Wi-Fi, 62 mm) | 160 € |
| Sondes connectées (vague 3) | sondes filaires à capteur déporté, adaptées à −25 °C (à valider). Les Shelly H&T Gen3 et Inkbird IBS-TH3 sont des capteurs d'ambiance : vérifie leur plage de fonctionnement et leur autonomie en enceinte froide [v2] | 70 € (à confirmer) |
| Support mural tablette | antivol, orientable | 40 € |
| **Total** | | **à recalculer après devis tablette** (comparatif Octopus 4 503 € HT sur 3 ans : joindre le devis source) |

## Normes de référence (vérifiées, voir VERIFICATION.md)
- RGPD art. 5, 6, 17, 25, 26, 28, 32, 33, 34, 35 ; CNIL délibérations 2022-100 (mots de passe) et 2021-122 (journalisation) ; guide de la sécurité des données personnelles CNIL, édition 2024.
- OWASP ASVS 5.0.0 (30/05/2025) niveau 2 ; OWASP Top 10 (dernière édition publiée au démarrage).
- Règl. (CE) 852/2004 art. 5 ; 178/2002 art. 18 ; arrêté du 21 décembre 2009 (annexe I, températures) ; décret 2008-184 du 26 février 2008 art. 8 ; note DGAL/SDRRCC/N2005-8205 (traçabilité).
- C. civ. art. 1366-1367 ; règl. eIDAS 910/2014 (modifié par le règl. 2024/1183) ; C. trav. art. L1222-4, L2312-38, L7321-2.
- Hébergement UE par choix de souveraineté : pas de transfert hors UE (Vercel, Upstash et régions AWS US exclus).
