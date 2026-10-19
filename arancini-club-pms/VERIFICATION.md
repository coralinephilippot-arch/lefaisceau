# Vérification du pack v1 → v2

Revue juridique et technique du 19/10/2026. Légende : ✅ confirmé · ⚠️ corrigé · 🔎 à confirmer sur le texte officiel (Légifrance / BO Agri) avant mise en production.

## 1. Points juridiques

| # | Affirmation v1 | Statut | Constat et source |
|---|---|---|---|
| J1 | Huile : composés polaires ≤ 25 % (décret 2008-184 art. 8) | ✅ | L'art. 8 répute impropres les huiles dont la teneur dépasse **25 % de composés polaires ou 14 % de polymères de triglycérides**. Source : [DREETS Occitanie, fiche huiles de friture](https://occitanie.dreets.gouv.fr/sites/occitanie.dreets.gouv.fr/IMG/pdf/huilefriture.pdf). Méthode officielle : arrêté du 20/01/2009 modifié le 04/01/2010. |
| J2 | Huile ≤ 180 °C « décret 2008-184 art. 8 » | ⚠️ | Le 180 °C **ne figure pas** dans le décret : c'est une bonne pratique (DGCCRF, fiches professionnelles). Sources : [DREETS](https://occitanie.dreets.gouv.fr/sites/occitanie.dreets.gouv.fr/IMG/pdf/huilefriture.pdf), [L'Hôtellerie-Restauration](https://m.lhotellerie-restauration.fr/PublishedFiles/Inline/hygiene/huiles-friture.pdf). Le 180 °C/25 g d'un arrêté royal de 1988 relève du droit **belge**. → La règle reste dans l'appli, étiquetée « bonne pratique ». |
| J3 | Maintien au chaud ≥ 63 °C (arrêté 21/12/2009) | ✅ 🔎 | +63 °C en liaison chaude, températures en annexe I. Sources : [agriculture.gouv.fr](https://agriculture.gouv.fr/telecharger/119391), [DDPP Calvados](https://www.calvados.gouv.fr/index.php/contenu/telechargement/18316/140968/file/temperature_de_conservation_et_service_des_aliments.pdf), [DDPP Rhône, restauration ambulante 2021](https://www.rhone.gouv.fr/contenu/telechargement/44908/249142/file/Note%20Reglmt%20Restauration%20ambulante%20Mars2021.pdf). Numéro d'annexe à confirmer sur Légifrance. |
| J4 | Froid positif 0 à 3 °C, congélation ≤ −18 °C | ✅ 🔎 | −18 °C : surgelés (annexe I). Le 0 à 3 °C est une **consigne interne** plus stricte que les maxima de l'annexe, qui varient selon la denrée. Elle est requalifiée comme telle. [Annexe I, DDPP Saône-et-Loire](https://saone-et-loire.gouv.fr/contenu/telechargement/11240/135247/file/AnnexeIAM211209TEMPERATURES.pdf). |
| J5 | « Seuil + 6 °C = jeter » | ⚠️ | Pas de base réglementaire identifiée : il s'agit d'une **règle interne Dunamis** à formaliser dans le PMS. |
| J6 | Action corrective obligatoire (852/2004 art. 5) | ✅ | Art. 5.2 d) : actions correctives quand un CCP n'est pas maîtrisé ; art. 5.2 g) : documents et registres. |
| J7 | Traçabilité 6 mois minimum (note DGAL N2005-8205) | ✅ 🔎 | La note existe : [BO Agri](https://info.agriculture.gouv.fr/boagri/instruction-N2005-8205/telechargement). Pratique admise pour les produits frais : **DLC + 6 mois** ([L'Hôtellerie-Restauration](https://www.lhotellerie-restauration.fr/sos-experts/tracabilite)), à ne pas confondre avec « 6 mois » tout court. Pour les autres produits, la durée est plus longue (5 ans selon le guide européen sur l'art. 18 du 178/2002). Le passage exact de la note reste à relire (site inaccessible pendant la revue). |
| J8 | Relevés conservés 3 ans | ⚠️ | Aucune durée légale n'impose 3 ans : c'est un **choix interne**, à justifier dans le registre RGPD (preuve en cas de contrôle ou de litige). |
| J9 | CNIL 2022-100 (mots de passe), 2021-122 (journalisation) | ✅ | Délibérations du 21/07/2022 et du 14/10/2021. La seconde recommande de conserver les journaux **6 mois à 1 an**. |
| J10 | C. trav. L1222-4 | ✅ | Information préalable du salarié sur tout dispositif qui le concerne. ⚠️ **Ajout** : L2312-38, consultation du CSE sur les moyens de contrôle de l'activité (franchisés de 50 salariés ou plus). |
| J11 | C. civ. 1366-1367 (preuve électronique) | ✅ ⚠️ | Exact, mais le PIN produit une **signature électronique simple** : elle est recevable, sans présomption de fiabilité (réservée à la signature qualifiée eIDAS, décret 2017-1416). La valeur probante repose sur la chaîne d'audit. Précision ajoutée en P5. |
| J12 | Responsabilité conjointe Groupe/franchisé (art. 26) | ✅ | Cohérent : le Groupe détermine les finalités du reporting réseau. Accord art. 26 à signer, avec mise à disposition de ses grandes lignes aux personnes concernées. |
| J13 | Effacement sur demande | ⚠️ | Il ne s'applique pas aux registres HACCP, conservés au titre d'une obligation légale (RGPD art. 17.3.b). Exception précisée en P0. |
| J14 | « Hébergement UE obligatoire » | ⚠️ | Aucun texte ne l'impose pour ces données : la décision d'adéquation UE–États-Unis (Data Privacy Framework) du 10/07/2023 autorise ces transferts. Requalifié en **choix de souveraineté**. Conséquence de cohérence : **Upstash** (prévu en P3) est retiré. |
| J15 | Indépendance du franchisé | ⚠️ ajout | Si le Groupe contrôle trop finement les salariés et les horaires, il s'expose à une requalification (gérant de succursale, C. trav. L7321-2). La minimisation de P5 protège aussi le Groupe sur ce terrain. |

## 2. Points techniques

| # | v1 | Statut | Correction v2 |
|---|---|---|---|
| T1 | Auth.js | ⚠️ | Auth.js est maintenu par l'équipe Better Auth depuis le 22/09/2025, qui recommande Better Auth pour les nouveaux projets ([annonce](https://www.better-auth.com/blog/authjs-joins-better-auth), [discussion GitHub](https://github.com/nextauthjs/next-auth/discussions/13252)). Better Auth gère passkeys et TOTP de façon native, ce qui respecte la règle 6. |
| T2 | OWASP ASVS 4.0, V2.x/V3.x | ⚠️ | L'ASVS **5.0.0** est sorti le 30/05/2025 et a été renuméroté : V6 Authentification, V7 Sessions ([OWASP Cheat Sheet index ASVS](https://cheatsheetseries.owasp.org/IndexASVS.html), [SoftwareMill](https://softwaremill.com/whats-new-in-asvs-5-0/)). |
| T3 | Workbox | ⚠️ | Utiliser Serwist (fork maintenu), next-pwa étant abandonné. |
| T4 | uuid v7 en PG 16 | ⚠️ | uuidv7() n'est natif qu'à partir de PostgreSQL 18 : choisir PG 18 ou générer l'UUID côté application. |
| T5 | pgcrypto, clé en variable d'environnement | ⚠️ | La clé transite en SQL et peut finir dans les logs PG. → Chiffrement applicatif + **blind index HMAC**, sans lequel on ne peut pas retrouver un utilisateur par e-mail. |
| T6 | PIN argon2id | ⚠️ | 10⁶ combinaisons se cassent hors ligne → ajout d'un pepper serveur. |
| T7 | Chaîne d'audit par trigger | ⚠️ | Deux transactions concurrentes peuvent lire le même prev_hash → verrou consultatif + test de concurrence. |
| T8 | RLS via current_setting | ⚠️ | FORCE RLS + set_config(…, true) **par transaction** (pool de connexions), rôle applicatif sans BYPASSRLS. |
| T9 | IndexedDB chiffrée par clé de session | ⚠️ | Risque de perte d'un registre légal si la session expire hors ligne → clé d'appareil enveloppée + idempotence. |
| T10 | Brother QL « ESC/P ou PDF » | ⚠️ | La QL-820NWB accepte Raster, ESC/P et P-touch Template ([références Brother](https://support.brother.com/g/s/es/dev/en/command/reference/index.html), [P-touch Template QL-820](https://download.brother.com/welcome/docp100307/cv_ql820_eng_ptemp_102.pdf)), mais une PWA ne peut pas lui parler directement → PDF + iPrint&Label, ou envoi depuis le serveur. |
| T11 | Socket.dev / Snyk | ⚠️ | Contradiction avec « sans abonnement » → osv-scanner (gratuit). |
| T12 | Next.js middleware | ⚠️ | En Next 16, le fichier s'appelle `proxy.ts` (CSP nonce). |

## 3. Charte et accessibilité (contrastes calculés selon la formule WCAG 2.x, reprise par le RGAA 4.1)

| Texte / fond | #890c11 | #9e100d | #d31c19 |
|---|---|---|---|
| crème #fef8e7 | **9,32** ✅ | **7,81** ✅ | **5,01** ✅ |
| ocre #d89500 | 3,87 (≥ 24 px seulement) | 3,24 (≥ 24 px seulement) | 2,08 ❌ |
| rouge #d31c19 | 1,86 ❌ (même pour un composant) | 1,56 ❌ | — |

Seuils : 4,5:1 pour le texte courant, 3:1 pour le grand texte et les composants d'interface (RGAA 3.2 et 3.3).

## 4. Matériel

| v1 | Statut | Constat |
|---|---|---|
| « Galaxy Tab Active5 » pour une tablette 10" | ⚠️ | La Tab Active5 a un écran de **8"** ([GSMArena](https://m.gsmarena.com/samsung_galaxy_tab_active5-12785.php), [Best Buy](https://www.bestbuy.com/site/6577890.p)). Le modèle 10,1" est la **Tab Active5 Pro** (taille à confirmer sur la fiche Samsung). Le prix de 450 € HT est donc à refaire sur devis. |
| Sondes Shelly / Inkbird | 🔎 | Ce sont des capteurs d'ambiance : vérifie la plage de fonctionnement (−18 °C) et l'autonomie des piles en enceinte froide avant de commander. |
| Octopus 4 503 € HT / 3 ans | 🔎 | Chiffre non sourcé : joindre le devis. |
