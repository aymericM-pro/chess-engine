import type { AnalysisEntry } from '@/shared/types/chess'

export const ANALYSIS: AnalysisEntry[] = [
  {
    phase: 'opening',
    san: '—',
    who: 'Position initiale',
    text: "La <strong>Scotch Game</strong> s'ouvre par 1.e4 e5 — deux pions au centre face à face. Les Blancs visent un avantage spatial rapide avec d4 dès le coup 3.",
    tags: [
      ['opening', 'Ouverture'],
      ['strategy', 'Centre'],
    ],
  },
  {
    phase: 'opening',
    san: 'e4',
    who: 'Blancs jouent',
    text: "Le coup le plus populaire. Le pion occupe le centre, ouvre les diagonales pour le fou et la dame. Les Blancs signalent une intention <strong>ouverte et agressive</strong>.",
    tags: [
      ['opening', 'Ouverture'],
      ['strategy', 'Centre'],
    ],
  },
  {
    phase: 'opening',
    san: 'e5',
    who: 'Noirs répondent',
    text: "Réponse symétrique classique. Les Noirs contestent le centre immédiatement. La partie entre dans les ouvertures ouvertes — terrain de luttes théoriques profondes.",
    tags: [
      ['opening', 'Ouverture'],
      ['strategy', 'Centre'],
    ],
  },
  {
    phase: 'opening',
    san: 'Nf3',
    who: 'Blancs jouent',
    text: "Développement naturel du cavalier vers sa meilleure case. Cf3 attaque e5 et prépare d4. Coup actif, flexible, sans aucune faiblesse créée.",
    tags: [
      ['opening', 'Développement'],
      ['strategy', 'Mobilité'],
    ],
  },
  {
    phase: 'opening',
    san: 'd6',
    who: 'Noirs répondent',
    text: "Les Noirs défendent e5 passivement avec d6 — c'est la <strong>Défense Philidor</strong>. Le pion d6 solidifie la structure mais bloque temporairement le fou c8.",
    tags: [
      ['opening', 'Philidor'],
      ['defense', 'Défense'],
    ],
  },
  {
    phase: 'opening',
    san: 'd4',
    who: 'Blancs jouent',
    text: "Le coup caractéristique de la <strong>Scotch Game</strong> ! Pression directe au centre sans détour. Cela crée une tension immédiate et ouvre la diagonale du fou c1.",
    tags: [
      ['opening', 'Scotch Game'],
      ['attack', 'Tension centrale'],
    ],
  },
  {
    phase: 'opening',
    san: 'Nc6',
    who: 'Noirs répondent',
    text: "Développement naturel — le cavalier défend e5 et développe simultanément. Les Noirs menacent de récupérer sur d4 après dxe5.",
    tags: [
      ['opening', 'Développement'],
      ['defense', 'Défense e5'],
    ],
  },
  {
    phase: 'opening',
    san: 'dxe5',
    who: 'Blancs jouent',
    text: "Échange central — les Blancs ouvrent la colonne d et lancent les complications tactiques. Les Noirs doivent récupérer ce pion.",
    tags: [
      ['opening', 'Échange'],
      ['tactic', 'Ouverture de lignes'],
    ],
  },
  {
    phase: 'opening',
    san: 'Nxe5',
    who: 'Noirs répondent',
    text: "Le cavalier Nc6 capture en e5 — centrale forte. Il peut être attaqué par Nf3xe5 mais offre d'excellentes perspectives actives.",
    tags: [
      ['strategy', 'Pièce active'],
      ['defense', 'Récupération'],
    ],
  },
  {
    phase: 'opening',
    san: 'Nxe5',
    who: 'Blancs jouent',
    text: "Capture forcée — les Blancs éliminent le puissant cavalier central. Les Noirs vont récupérer avec dxe5 et garder un centre solide.",
    tags: [
      ['tactic', 'Capture'],
      ['strategy', 'Échange'],
    ],
  },
  {
    phase: 'middle',
    san: 'dxe5',
    who: 'Noirs répondent',
    text: "Récupération avec le pion d. Position ouverte, pions e5 symétriques. La partie sort de l'ouverture avec une structure équilibrée mais des tensions tactiques.",
    tags: [
      ['strategy', 'Structure'],
      ['opening', "Fin d'ouverture"],
    ],
  },
  {
    phase: 'middle',
    san: 'Bb5+',
    who: 'Blancs jouent',
    text: "<strong>Échec avec le fou !</strong> Les Blancs perturbent le développement adverse et empêchent le roque noir. Une case active pour le fou qui épingle indirectement.",
    tags: [
      ['attack', 'Échec'],
      ['tactic', 'Épingle'],
      ['attack', 'Pression'],
    ],
  },
  {
    phase: 'middle',
    san: 'Bd7',
    who: 'Noirs répondent',
    text: "Blocage de l'échec avec le fou — seule réponse raisonnable. Le Bd7 n'est pas idéal, mobilité réduite, mais c'était nécessaire pour calmer la pression.",
    tags: [
      ['defense', 'Blocage'],
      ['strategy', 'Développement forcé'],
    ],
  },
  {
    phase: 'middle',
    san: 'a4',
    who: 'Blancs jouent',
    text: "Coup de flanc surprenant au lieu de développer. Les Blancs gagnent de l'espace sur l'aile dame et maintiennent le Bb5 en place. Cependant ce coup est lent et offre des chances aux Noirs.",
    tags: [
      ['strategy', 'Espace'],
      ['strategy', 'Tempo'],
    ],
  },
  {
    phase: 'middle',
    san: 'Qh4',
    who: 'Noirs répondent',
    text: "La dame noire surgit en h4 ! Elle vise g2 et crée des menaces immédiates sur l'aile roi. Coup <strong>dynamique et agressif</strong> — la dame peut devenir exposée mais génère un contre-jeu réel.",
    tags: [
      ['attack', 'Dame active'],
      ['tactic', 'Menace g2'],
    ],
  },
  {
    phase: 'middle',
    san: 'Qd5',
    who: 'Blancs jouent',
    text: "La dame blanche s'installe en d5 — <strong>case centrale fantastique</strong> ! Elle attaque e5 et crée des menaces multiples. Les deux dames sont actives, la position devient très tactique.",
    tags: [
      ['attack', 'Dame centrale'],
      ['tactic', 'Double attaque'],
    ],
  },
  {
    phase: 'middle',
    san: 'Qg4',
    who: 'Noirs répondent',
    text: "Dame noire en g4 — menace directe sur g2. Les Noirs tentent de créer du contre-jeu sur l'aile roi. Position très complexe, pièces actives des deux côtés.",
    tags: [
      ['attack', 'Menace g2'],
      ['tactic', 'Pression aile roi'],
    ],
  },
  {
    phase: 'middle',
    san: 'Qxb7',
    who: 'Blancs jouent',
    text: "Les Blancs capturent b7 — début de la <strong>course aux pions</strong> ! La dame s'éloigne du centre mais engrange du matériel. Position explosive : qui va s'arrêter le premier ?",
    tags: [
      ['tactic', 'Gain pion'],
      ['attack', 'Dame dévastatrice'],
    ],
  },
  {
    phase: 'middle',
    san: 'Qxg2',
    who: 'Noirs répondent',
    text: "Réplique immédiate — la dame noire capture g2 et attaque la tour h1 ! Les deux dames pillent des pions dans les camps adverses. Course folle au matériel.",
    tags: [
      ['tactic', 'Capture'],
      ['attack', 'Attaque tour'],
    ],
  },
  {
    phase: 'middle',
    san: 'Qxa8+',
    who: 'Blancs jouent',
    text: "<strong>Capture majeure avec échec !</strong> La dame emporte la tour a8. Bilan : pions b7 + tour a8. Le roi noir doit bouger — il perd définitivement le droit au roque.",
    tags: [
      ['tactic', 'Capture tour'],
      ['attack', 'Échec'],
      ['tactic', 'Gain matériel'],
    ],
  },
  {
    phase: 'middle',
    san: 'Ke7',
    who: 'Noirs répondent',
    text: "Le roi fuit en e7 — roque impossible désormais. Le <strong>roi au centre en plein milieu de jeu</strong> est extrêmement risqué. Les Noirs ont un contre-jeu avec leur dame en g2.",
    tags: [
      ['defense', 'Fuite'],
      ['blunder', 'Roi exposé'],
    ],
  },
  {
    phase: 'middle',
    san: 'Rg1',
    who: 'Blancs jouent',
    text: "Excellent coup de tour — Rg1 attaque directement la dame noire en g2 ! Les Blancs développent une pièce tout en gagnant un tempo crucial.",
    tags: [
      ['tactic', 'Attaque dame'],
      ['strategy', 'Développement'],
      ['attack', 'Tempo'],
    ],
  },
  {
    phase: 'middle',
    san: 'Qxg1+',
    who: 'Noirs répondent',
    text: "La dame noire capture la tour avec échec — échange défavorable (tour contre dame) mais presque forcé. L'échec oblige le roi blanc à bouger.",
    tags: [
      ['tactic', 'Capture forcée'],
      ['defense', 'Échange défavorable'],
    ],
  },
  {
    phase: 'end',
    san: 'Kd2',
    who: 'Blancs jouent',
    text: "Le roi blanc marche en d2 — il va devenir un <strong>roi guerrier</strong> ! Avantage matériel : dame contre tour. Les Blancs jouent avec confiance malgré le roi exposé.",
    tags: [
      ['strategy', 'Roi actif'],
      ['tactic', 'Sortie du roi'],
    ],
  },
  {
    phase: 'end',
    san: 'Qxf2+',
    who: 'Noirs répondent',
    text: "La dame noire continue de manger des pions avec échec — Qxf2+. Les Noirs tentent de compenser leur désavantage positionnel par du gain matériel.",
    tags: [
      ['attack', 'Échec'],
      ['tactic', 'Gain pion'],
    ],
  },
  {
    phase: 'end',
    san: 'Kc3',
    who: 'Blancs jouent',
    text: "Le roi avance courageusement en c3 — loin des attaques adverses. Les Blancs ont dame et fous contre dame et cavaliers : avantage matériel décisif.",
    tags: [
      ['strategy', 'Roi guerrier'],
      ['strategy', 'Avantage matériel'],
    ],
  },
  {
    phase: 'end',
    san: 'Qg2',
    who: 'Noirs répondent',
    text: "La dame recule en g2, cherchant de nouvelles menaces. Les Noirs manquent de ressources décisives — la dame seule ne peut pas contrer toutes les pièces blanches.",
    tags: [
      ['defense', 'Réorganisation'],
      ['strategy', 'Manque de ressources'],
    ],
  },
  {
    phase: 'end',
    san: 'Qxa7',
    who: 'Blancs jouent',
    text: "La dame blanche engrange encore un pion en a7. Elle a capturé tour a8, pions b7, a7 — <strong>dévastation totale de l'aile dame</strong>. L'avantage matériel est énorme.",
    tags: [
      ['tactic', 'Gain pion'],
      ['attack', 'Dame dominante'],
    ],
  },
  {
    phase: 'end',
    san: 'Nf6',
    who: 'Noirs répondent',
    text: "Le cavalier entre en jeu en f6 — menace d'aller en e4 et presser le roi blanc. C'est la dernière tentative réelle de résistance des Noirs.",
    tags: [
      ['defense', 'Développement actif'],
      ['tactic', 'Cavalier actif'],
    ],
  },
  {
    phase: 'end',
    san: 'Qxc7',
    who: 'Blancs jouent',
    text: "La dame capture c7 ! Bilan total : tour a8, pions b7, a7, c7. <strong>Quatre captures en six coups</strong>. L'avantage matériel est écrasant — la partie touche à sa fin.",
    tags: [
      ['attack', 'Dame dominante'],
      ['tactic', 'Gain matériel'],
    ],
  },
  {
    phase: 'end',
    san: 'Nxe4+',
    who: 'Noirs répondent',
    text: "Cavalier en e4 avec échec — tentative désespérée mais active ! Les Noirs créent des complications autour du roi blanc. Bel esprit de combat même dans une position perdante.",
    tags: [
      ['attack', 'Échec cavalier'],
      ['tactic', 'Contre-jeu'],
    ],
  },
  {
    phase: 'end',
    san: 'Kb3',
    who: 'Blancs jouent',
    text: "Le roi se retire en b3, hors de portée. Le voyage du roi est remarquable — de e1 à b3 en traversant d2, c3. Un vrai <strong>roi guerrier</strong>.",
    tags: [
      ['strategy', 'Roi sécurisé'],
      ['tactic', 'Évitement'],
    ],
  },
  {
    phase: 'end',
    san: 'Qxc2+',
    who: 'Noirs répondent',
    text: "Dernier coup actif — échec en c2. Cela va forcer un échange de dames qui simplifie vers une fin de partie techniquement gagnée pour les Blancs.",
    tags: [
      ['attack', 'Échec'],
      ['tactic', 'Forçage échange'],
    ],
  },
  {
    phase: 'end',
    san: 'Kxc2',
    who: 'Blancs jouent',
    text: "Le roi capture la dame ! <strong>Échange de dames</strong> — les Blancs s'en vont avec un fou de plus. La fin de partie est gagnée techniquement : fous contre cavaliers noirs.",
    tags: [
      ['tactic', 'Échange dames'],
      ['strategy', 'Fin gagnée'],
    ],
  },
  {
    phase: 'end',
    san: 'Nd6',
    who: 'Noirs répondent',
    text: "Cavalier en d6 — tentative de blocage et résistance. Mais avec un fou supplémentaire et une position active, les Blancs vont conclure rapidement.",
    tags: [
      ['defense', 'Résistance'],
      ['strategy', 'Cavalier défensif'],
    ],
  },
  {
    phase: 'end',
    san: 'Bxd7',
    who: 'Blancs gagnent — 1-0',
    text: "<strong>Coup final !</strong> Le fou capture en d7 et les Noirs abandonnent. Bilan matériel : tour et quatre pions de plus pour les Blancs. Une partie spectaculaire dominée par des courses de dames en tous sens.",
    tags: [
      ['attack', 'Coup final'],
      ['tactic', 'Abandon'],
    ],
  },
]
