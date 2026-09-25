/* Pétillante — contenus éditoriaux (fr).
   Ton : complice, tendre, jamais moqueur envers le corps ou l'âge.
   On rit DE la vie, jamais DE soi. */

window.PETILLANTE = {

  /* ——— La dose du jour ——— */
  doses: [
    "Tu n'as pas perdu tes lunettes. Elles sont en télétravail, sur ta tête.",
    "Tu as survécu à 100 % de tes pires journées. Statistiquement, tu es invincible.",
    "Ton « je vais y réfléchir » vaut désormais un « non ». Et c'est magnifique.",
    "Tu n'es pas en retard. Tu fais une entrée.",
    "Ta charge mentale mérite des congés payés. Pose-les. Même une après-midi.",
    "Personne n'a jamais regretté d'avoir bu son café encore chaud. Essaie, pour voir.",
    "Tu as le droit de laisser un message en « vu ». La Terre continue de tourner, promis.",
    "Les rides, c'est l'historique de tous tes fous rires. Tu as bien navigué.",
    "Aujourd'hui, ton seul objectif : être aussi gentille avec toi qu'avec ta meilleure amie.",
    "Tu n'as pas « rien fait » : tu as fait tourner une maison, trois cerveaux et une machine à 40°.",
    "Une femme qui dit « je m'en occupe » change le monde. Une femme qui dit « occupe-t'en » aussi.",
    "Si la vie te donne des citrons, fais-en une tarte. Et ne la partage pas.",
    "Tu es la preuve vivante qu'on peut chercher ses clés et diriger une vie en même temps.",
    "Tes intuitions ont un taux de réussite qui ferait pâlir un algorithme.",
    "Le canapé t'appelle. Réponds. C'est peut-être important.",
    "Tu n'as jamais été « trop ». Ce sont les autres qui étaient « pas assez ».",
    "Chaque décennie t'a donné un superpouvoir. La prochaine aussi. Prépare la cape.",
    "Tu as appris à dire non sans te justifier ? Non ? Allez, on s'entraîne : « Non. »",
    "Ton rire est un service public. Il devrait être remboursé par la Sécu.",
    "Tu as le droit de changer d'avis, de coupe, de métier et de playlist.",
    "Rappel amical : « Faire une pause », ça compte comme faire quelque chose.",
    "Tu es exactement à l'âge où l'on sait ce qu'on veut. Et surtout ce qu'on ne veut plus.",
    "Le groupe WhatsApp de la famille peut attendre. Toi, non.",
    "Tu n'es pas fatiguée « pour rien ». Tu es fatiguée pour beaucoup. Respect.",
    "Il y a 24 heures dans une journée. Tu as le droit d'en garder une pour toi.",
    "Tes enfants, tes collègues et ton plombier ont de la chance de te connaître. Ton miroir aussi.",
    "Elle croyait qu'elle pouvait, alors elle a fait. Puis elle a fait une sieste.",
    "Ton GPS intérieur recalcule l'itinéraire. C'est normal. Tu arriveras quand même.",
    "Ce que tu appelles « bazar », les artistes l'appellent « processus créatif ».",
    "Tu mérites des fleurs. Pas besoin d'attendre qu'on t'en offre : le fleuriste accepte la carte bleue.",
    "Si personne ne t'applaudit aujourd'hui, fais-le toi-même. Fort. Dans la cuisine.",
    "Tu as déjà fait des choses plus difficiles que ce qui t'attend aujourd'hui.",
    "La confiance en soi, c'est comme le vélo : ça revient dès qu'on remonte dessus.",
    "Tu n'as pas besoin d'être une version améliorée de toi-même. L'originale est collector.",
    "Le « et si ça marchait ? » mérite autant de temps de cerveau que le « et si ça ratait ? ».",
    "Tu es la cheffe d'orchestre. Même quand le triangle joue faux.",
    "Aujourd'hui, choisis tes combats. Et choisis surtout tes fromages.",
    "Tu as le droit de prendre de la place. Au bureau, dans le métro, dans la conversation.",
    "Bonne nouvelle : ton meilleur chapitre n'a pas de date limite.",
    "Tu brilles même en jogging. Surtout en jogging, d'ailleurs.",
    "Les femmes qui rient ensemble vivent plus longtemps. Appelle ta copine. Pour la science.",
    "Tu as cherché tes lunettes avec tes lunettes ? Bienvenue au club très sélect des génies.",
    "Tu n'es pas « encore » en train d'apprendre. Tu es « toujours » en train d'apprendre. Nuance de championne.",
    "Ta to-do list n'est pas un contrat. C'est une suggestion.",
    "Qui a dit qu'il était trop tard ? Personne d'intéressant.",
    "Tu es la personne que tu cherchais à 20 ans pour te donner des conseils.",
    "Tu peux porter du jaune, chanter faux et danser mal. Tout ça en même temps. Personne n'est mort.",
    "Chaque « je ne sais pas faire » est un « je ne sais pas ENCORE faire » en pyjama.",
    "Aujourd'hui, la seule personne à impressionner, c'est toi. Et tu es bon public.",
    "Tu n'as pas raté ta vie. Tu es en plein tournage. Et le budget effets spéciaux arrive."
  ],

  /* ——— Météo intérieure ——— */
  meteo: [
    {
      id: "soleil", label: "Grand soleil", glyph: "sun",
      bulletins: [
        "Ciel dégagé sur tout le territoire de ton humeur. Risque élevé de chanter dans la voiture. Indice UV de charisme : 11.",
        "Anticyclone de bonne humeur installé pour la journée. Des éclats de rire sont attendus en fin d'après-midi.",
        "Rayonnement maximal. Pense à mettre de la crème : tu vas éblouir des gens."
      ],
      conseil: "Profite-en pour dire un compliment sincère à quelqu'un. L'effet est contagieux."
    },
    {
      id: "eclaircies", label: "Éclaircies", glyph: "partly",
      bulletins: [
        "Quelques nuages matinaux, vite dispersés par un café bien serré. Belles éclaircies attendues après le déjeuner.",
        "Temps variable, mais tendance nettement ensoleillée. Un petit rayon est prévu vers 16 h (goûter).",
        "Nébulosité passagère. Rien qu'une bonne playlist ne puisse balayer."
      ],
      conseil: "Une chose agréable, même minuscule, dans l'heure qui vient. Tu choisis laquelle."
    },
    {
      id: "brouillard", label: "Brouillard", glyph: "fog",
      bulletins: [
        "Brouillard givrant sur la zone « Pourquoi je suis entrée dans cette pièce ». Visibilité réduite, mais la route est bonne.",
        "Bancs de brume sur les prénoms, les mots de passe et l'endroit où tu as posé ton téléphone. Levée prévue après un verre d'eau.",
        "Purée de pois cérébrale. Recommandation officielle : ne pas prendre de grandes décisions, en prendre des petites et délicieuses."
      ],
      conseil: "Un grand verre d'eau, dix pas dehors, une seule chose à la fois. Le soleil est juste derrière."
    },
    {
      id: "orage", label: "Orage", glyph: "storm",
      bulletins: [
        "Alerte orange « tout le monde a besoin de toi en même temps ». Des rafales de « Maman ? » sont possibles jusqu'à 21 h.",
        "Front orageux venant du nord (le bureau) rencontrant un front chaud (le dîner). Cumul de tâches important.",
        "Foudre probable sur la personne qui demandera « on mange quoi ce soir ? »."
      ],
      conseil: "Écris tout ce qui encombre ta tête. Barre une chose, délègue-en une, oublie-en une. Ça fait trois de moins."
    },
    {
      id: "canicule", label: "Canicule", glyph: "heat",
      bulletins: [
        "Épisode de chaleur localisé sur ta seule personne. Les éventails sont de sortie. Toi aussi, tu es de sortie : tu es brûlante de talent.",
        "Vague de chaleur imprévue en pleine réunion. Rien de grave : tu es simplement en train de rayonner plus fort que le chauffage.",
        "Températures tropicales à l'intérieur. Bonne nouvelle : les plantes de ton salon t'adorent."
      ],
      conseil: "Eau fraîche, poignets sous le robinet, et fierté intacte. Tu traverses ça comme une reine."
    }
  ],

  /* ——— Mission pétillante (une par jour) ——— */
  missions: [
    "Danser sur une chanson entière dans la cuisine. Les casseroles ne jugent pas.",
    "Envoyer un message à une amie juste pour lui dire pourquoi tu l'aimes.",
    "Boire un café ou un thé assise. Sans téléphone. Comme une héroïne de film.",
    "Te faire un compliment à voix haute devant un miroir. Oui, à voix haute.",
    "Dire « non » à une chose qui ne te fait pas envie. Sans excuse.",
    "Porter ton plus beau vêtement pour aller… nulle part de spécial.",
    "Marcher 10 minutes dehors en regardant les toits des immeubles.",
    "Rire d'une bêtise que tu as faite aujourd'hui, au lieu de la ruminer.",
    "Chanter sous la douche un titre des années 80. Refrain obligatoire.",
    "Écrire trois choses qui se sont bien passées aujourd'hui.",
    "Acheter (ou cueillir) une fleur. Pour toi.",
    "Faire une chose que tu repousses depuis des semaines. Une seule. Cinq minutes.",
    "Appeler quelqu'un plutôt que de lui écrire. Juste pour entendre sa voix.",
    "Te lever, t'étirer comme un chat et soupirer de façon très théâtrale.",
    "Remplacer un « désolée » par un « merci ». Exemple : « Merci de ta patience. »",
    "Manger quelque chose de délicieux, lentement, en le savourant pour de vrai.",
    "Mettre ta chanson préférée et ne rien faire d'autre pendant 3 minutes.",
    "Ranger un seul tiroir. Admirer le résultat pendant une durée déraisonnable.",
    "Offrir un sourire à une personne inconnue. Compter combien te le rendent.",
    "Te coucher 20 minutes plus tôt. Tu as le droit.",
    "Regarder une vieille photo de toi et lui dire : « Tu t'en es drôlement bien sortie. »",
    "Apprendre un mot nouveau et le placer dans une conversation, l'air de rien.",
    "Faire un truc que tu adorais à 10 ans : dessiner, faire la roue, une cabane…",
    "Écrire la liste de tes « victoires invisibles » de la semaine.",
    "Déléguer une tâche. Et résister à l'envie de la refaire derrière.",
    "Prendre une photo de quelque chose de beau et banal. Une tasse. Une ombre.",
    "Passer 5 minutes sans rien faire. Rien. Même pas penser à ce qu'il faut faire.",
    "Dire merci à ton corps pour quelque chose de précis qu'il fait bien.",
    "Planifier un petit plaisir pour la semaine prochaine. L'attente fait partie du plaisir.",
    "Mettre un rouge à lèvres, un chapeau ou des chaussettes rigolotes. Juste pour toi."
  ],

  /* ——— Idées pour le Bocal à fiertés ——— */
  bocalIdees: [
    "J'ai dit non sans me justifier",
    "J'ai bu mon café chaud",
    "J'ai demandé de l'aide",
    "J'ai fini un truc commencé",
    "J'ai pris 10 minutes pour moi",
    "J'ai osé donner mon avis",
    "J'ai ri aux éclats",
    "J'ai été douce avec moi"
  ],

  /* ——— Permis officiels ——— */
  permis: [
    { titre: "Permis de ne pas répondre au groupe WhatsApp familial", article: "pendant 48 heures, émojis compris" },
    { titre: "Permis de faire une sieste sans culpabiliser", article: "durée illimitée, plaid inclus" },
    { titre: "Permis de manger le dessert en premier", article: "valable tous les jours de la semaine" },
    { titre: "Permis de dire non", article: "sans explication, justification ni note de bas de page" },
    { titre: "Permis de ne pas tout savoir", article: "et de répondre « bonne question » avec assurance" },
    { titre: "Permis de rester en pyjama le dimanche", article: "y compris pour ouvrir au livreur" },
    { titre: "Permis de chanter faux très fort", article: "en voiture, en cuisine et sous la douche" },
    { titre: "Permis d'annuler un plan", article: "et d'être secrètement ravie" },
    { titre: "Permis de ne pas cuisiner ce soir", article: "tartines et gratitude autorisées" },
    { titre: "Permis de prendre de la place", article: "en réunion, sur le trottoir et dans la conversation" },
    { titre: "Permis de changer d'avis", article: "autant de fois que nécessaire" },
    { titre: "Permis d'acheter des fleurs pour soi", article: "sans occasion particulière" },
    { titre: "Permis de laisser la vaisselle jusqu'à demain", article: "elle ne partira pas, promis" },
    { titre: "Permis de recommencer à zéro", article: "à n'importe quel âge, n'importe quel lundi" },
    { titre: "Permis de rire à ses propres blagues", article: "surtout si personne d'autre ne rit" },
    { titre: "Permis de ne pas être parfaite", article: "à vie, sans renouvellement nécessaire" },
    { titre: "Permis de lire au lit jusqu'à pas d'heure", article: "« encore un chapitre » compris" },
    { titre: "Permis de porter du jaune moutarde", article: "et d'en être très fière" }
  ],

  /* ——— Bouton d'urgence fou rire ——— */
  fourire: [
    "Tu sais que tu es adulte quand une nouvelle éponge te procure une vraie joie.",
    "Il y a deux types de femmes : celles qui retrouvent leurs clés, et celles qui les ont dans la main en les cherchant.",
    "Mon corps est un temple. Un temple un peu ancien, avec quelques travaux en cours, mais classé monument historique.",
    "J'ai commencé le yoga. Pour l'instant je maîtrise surtout la posture du chat qui regarde les autres faire du yoga.",
    "Si tu cherches ta motivation, elle est sous le canapé, avec la télécommande et une chaussette orpheline.",
    "Mon lit et moi, on a une relation sérieuse. Mon réveil essaie de nous séparer tous les matins.",
    "Je ne parle pas toute seule. Je fais une réunion avec la seule personne compétente de la maison.",
    "J'avais prévu d'être productive. Puis j'ai trouvé un plaid.",
    "La vraie liberté, c'est quitter une soirée à 22 h 30 et être au lit à 22 h 45.",
    "Le plus grand mystère de l'univers : où vont les couvercles des boîtes Tupperware ?",
    "Mes enfants pensent que je sais tout. Je laisse planer le doute. Et Google aussi.",
    "J'ai dit à mon miroir que je l'aimais. Il m'a renvoyé le compliment. Très poli, ce miroir.",
    "Ma plante verte et moi, on a le même objectif : survivre à la semaine avec un peu de lumière.",
    "À ce stade, mon thé refroidit si souvent qu'il mérite une carte de fidélité au micro-ondes.",
    "J'entre dans une pièce. J'oublie pourquoi. Je ressors. Je me souviens. C'est ma séance de sport.",
    "Je ne suis pas têtue. J'ai juste raison plus longtemps que les autres.",
    "Mon superpouvoir : savoir exactement où est le ketchup dans le frigo quand personne d'autre ne le voit.",
    "Mes collègues pensent que je médite. En fait, je choisis mentalement ce que je vais manger ce soir.",
    "« Maman, tu peux… » — non. Le bureau des réclamations est fermé jusqu'à nouvel ordre.",
    "J'ai une mémoire d'éléphant pour les anniversaires des autres, et une mémoire de poisson rouge pour mon mot de passe.",
    "Je fais du sport tous les jours : je cours après le temps.",
    "Ma couleur de cheveux préférée ? Celle que j'aurai la semaine prochaine.",
    "Le lâcher-prise, c'est comme un lacet : on croit que c'est fait, puis on se prend les pieds dedans. Et on rit.",
    "Il existe trois états chez moi : affamée, rassasiée, et « je pourrais manger un petit truc ».",
    "Quand je dis « cinq minutes », je parle en minutes de femme occupée. Compte une heure et demie.",
    "Mon GPS me dit « faites demi-tour dès que possible ». Même lui a compris la vie.",
    "Je n'ai pas de rides. J'ai des plis de rire, soigneusement repassés au fil des années.",
    "Je voulais faire un régime. Puis j'ai vu une boulangerie. Le destin, on ne lutte pas.",
    "Ma liste de courses dit « lait, pain, œufs ». Mon caddie dit « bougie parfumée, plaid, fromage, fleurs ».",
    "J'ai appris à lâcher prise. Ensuite j'ai appris à ramasser ce que j'avais lâché. C'est plus lent."
  ],

  /* ——— Le dico des mots qui manquaient ——— */
  dico: [
    { mot: "Frigonésie", genre: "n.f.", def: "Ouvrir le frigo, oublier pourquoi, le refermer, le rouvrir. Recommencer trois fois." },
    { mot: "Lunettopie", genre: "n.f.", def: "Chercher ses lunettes alors qu'on les porte. Souvent accompagnée d'un fou rire." },
    { mot: "Chargementale", genre: "n.f.", def: "Sensation d'avoir 47 onglets ouverts dans la tête, dont un qui joue de la musique sans qu'on sache lequel." },
    { mot: "Canapéiser", genre: "v. intr.", def: "S'enfoncer lentement dans un canapé jusqu'à ne faire plus qu'un avec lui. Activité de haut niveau." },
    { mot: "Whatsappocalypse", genre: "n.f.", def: "Retrouver 312 messages non lus dans le groupe familial après une réunion d'une heure." },
    { mot: "Motdepassetrophie", genre: "n.f.", def: "Disparition soudaine et totale d'un mot de passe créé il y a exactement quatre minutes." },
    { mot: "Sieste-éclair", genre: "n.f.", def: "Fermer les yeux « deux secondes » et se réveiller avec la marque du coussin et une nouvelle perspective sur la vie." },
    { mot: "Placardisme", genre: "n.m.", def: "Art d'ouvrir tous les placards de la cuisine en espérant qu'un dîner s'y soit formé spontanément." },
    { mot: "Pièceamnésie", genre: "n.f.", def: "Entrer dans une pièce avec une mission précise et en ressortir avec un vague sentiment de mystère." },
    { mot: "Rireculpabilité", genre: "n.f.", def: "Rire à une réunion sérieuse à cause d'une blague qu'on se rappelle soudain. Incontrôlable." },
    { mot: "Plaidothérapie", genre: "n.f.", def: "Soin intensif associant un plaid, une boisson chaude et une série déjà vue six fois." },
    { mot: "Chaussettoir", genre: "n.m.", def: "Dimension parallèle située derrière la machine à laver, où vivent toutes les chaussettes seules." },
    { mot: "Complimentose", genre: "n.f.", def: "Incapacité à recevoir un compliment sans répondre « oh, ce vieux truc ? ». Se soigne par l'entraînement." },
    { mot: "Dimanchite", genre: "n.f.", def: "Légère mélancolie du dimanche soir, soulagée par une tartine et une bonne nuit." },
    { mot: "Fiertitude", genre: "n.f.", def: "Sensation délicieuse d'avoir enfin fait la chose qu'on repoussait. Voir aussi : le Bocal." }
  ],

  /* ——— Petits mots selon l'heure ——— */
  saluts: {
    nuit: ["Coucou", "Douce nuit"],
    matin: ["Bonjour", "Belle journée", "Bien le bonjour"],
    midi: ["Bon appétit", "Bonne pause"],
    aprem: ["Bel après-midi", "Courage"],
    soir: ["Bonsoir", "Belle soirée", "Bravo pour aujourd'hui"]
  }
};
