// ============================================================
//  CIGATE — contenu éditorial centralisé
//  Cabinet International de Géomatique, Aménagement,
//  Topographie et Environnement — SARL, Lomé (Togo)
//  Domaines issus de l'article 2 des statuts.
// ============================================================

const u = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?fm=jpg&q=74&w=${w}&auto=format&fit=crop`;

export const IMG = {
  // Équipes et professionnels
  heroTeam:   u('1573164574572-cb89e39749b4', 1800),
  collab:     u('1573164574511-73c773193279'),
  briefing:   u('1573164574397-dd250bc8a598'),
  duo:        u('1655720362142-e1be7205382c'),
  screens:    u('1531482615713-2afd69097998'),
  portrait:   u('1748290880596-2a2c80530bc0'),
  conseil:    u('1679117349740-c46c819d0373'),
  formation:  u('1573496130141-209d200cebd8'),

  // Télédétection et imagerie satellite
  satEarth:   u('1446776899648-aa78eefe8ed0'),
  satLandsat: u('1579158949974-bfa5b5f171e1'),
  satDelta:   u('1722083854850-4a24185465ac'),
  satBands:   u('1574169208507-84376144848b'),
  satMap:     u('1578309756213-4ae60733ad6f'),
  satOrbit:   u('1460186136353-977e9d6085a1'),
  satSensor:  u('1708738793054-32b71e3fc822'),
  satTexture: u('1574786199452-c7a5f69fb6e9'),
  satIslands: u('1462331321792-cc44368b8894'),

  // Territoire vu du ciel
  aerialRoads: u('1441644599508-24ae08965c5c'),
  aerialCoast: u('1523443571261-671bddef4ecd'),
  aerialField: u('1576767810583-046a1f7da256'),

  // Terrain et instruments
  station:   u('1654643353084-10e62e05b9bf'),
  tripod:    u('1628158088936-68ccaaa400dc'),
  gnss:      u('1628155858736-bacadae33a88'),
  level:     u('1545186070-de624ed19875'),
};

export const NAV = [
  { to: '/',                  label: 'Accueil' },
  { to: '/qui-sommes-nous',   label: 'Qui sommes-nous' },
  { to: '/notre-expertise',   label: 'Notre expertise' },
  { to: '/contact',           label: 'Contact' },
];

export const MARQUEE = [
  'Géomatique', 'Télédétection', 'Topographie', 'Géodésie', 'Cartographie',
  'Études foncières', 'Analyse de données', 'Solutions SIG', 'Drones & GNSS',
  'Aménagement du territoire', 'Environnement', 'Formation',
];

// ---- Article 2 des statuts : les huit domaines d'activité ----
export const DOMAINES = [
  {
    slug: 'geomatique',
    index: '01',
    short: 'Géomatique & intelligence territoriale',
    title: 'Géomatique, environnement, aménagement et intelligence territoriale',
    image: IMG.satLandsat,
    tag: 'Données géospatiales · Cartographie · Climat',
    intro:
      "Collecte, production, traitement et analyse des données géospatiales et territoriales. Nous produisons la lecture cartographique qui permet de décider en connaissance de cause.",
    points: [
      'Collecte, production et gestion de données géospatiales et territoriales',
      'Cartographie et analyse spatiale du territoire',
      'Études environnementales et climatiques',
      "Études et projets d'aménagement et de développement des territoires",
    ],
  },
  {
    slug: 'topographie',
    index: '02',
    short: 'Topographie & géodésie',
    title: 'Topographie et géodésie',
    image: IMG.station,
    tag: 'Levés · Implantation · Plans',
    intro:
      "La mesure de terrain, socle de tout projet d'aménagement. Levés, positionnement et implantation conduits avec des chaînes d'acquisition calibrées.",
    points: [
      'Levés topographiques et travaux de positionnement',
      "Implantations et suivi d'exécution",
      'Production de plans et de documents cartographiques',
      'Prestations topographiques connexes',
    ],
  },
  {
    slug: 'foncier',
    index: '03',
    short: 'Études foncières & immobilières',
    title: 'Études foncières et immobilières',
    image: IMG.aerialRoads,
    tag: 'Foncier · Immobilier · Occupation des sols',
    intro:
      "Comprendre qui occupe quoi, et sur quelle base. Nos études éclairent la gestion des espaces et sécurisent les décisions immobilières.",
    points: [
      'Études et analyses relatives au foncier et à l\u2019immobilier',
      "Analyse de l'occupation et de la gestion des espaces",
      'Appui à la structuration et à la sécurisation foncière',
      'Prestations relatives à la gestion des territoires',
    ],
  },
  {
    slug: 'donnees',
    index: '04',
    short: 'Analyse & valorisation des données',
    title: 'Analyse, traitement et valorisation des données',
    image: IMG.screens,
    tag: 'Statistiques · Modélisation · Aide à la décision',
    intro:
      "Une donnée qui n'éclaire pas une décision ne sert à rien. Nous transformons vos jeux de données en indicateurs lisibles et en outils actionnables.",
    points: [
      'Études statistiques et analyse de données',
      'Modélisation et visualisation',
      "Production d'outils d'aide à la décision",
      'Tableaux de bord et restitution des résultats',
    ],
  },
  {
    slug: 'numerique',
    index: '05',
    short: 'Solutions numériques',
    title: 'Conception et développement de solutions numériques',
    image: IMG.satMap,
    tag: 'SIG · Applications · Plateformes',
    intro:
      "Nous concevons les outils qui font vivre la donnée dans la durée : systèmes d'information géographique, plateformes et applications métier.",
    points: [
      "Systèmes d'information géographique et bases de données",
      'Applications et plateformes numériques',
      "Outils d'automatisation et tableaux de bord",
      'Solutions innovantes sur mesure',
    ],
  },
  {
    slug: 'formation',
    index: '06',
    short: 'Formation & conseil',
    title: 'Formation, conseil et assistance technique',
    image: IMG.formation,
    tag: 'Transfert de compétences · Accompagnement',
    intro:
      "Nous transmettons les méthodes et les outils, pour que vos équipes restent autonomes une fois la mission terminée.",
    points: [
      'Formation en géomatique, topographie et analyse de données',
      'Conseil en sciences spatiales et outils numériques',
      'Assistance technique et appui opérationnel',
      'Accompagnement méthodologique et scientifique',
    ],
  },
  {
    slug: 'equipements',
    index: '07',
    short: 'Matériels & équipements',
    title: 'Vente, fourniture et distribution de matériels et solutions techniques',
    image: IMG.gnss,
    tag: 'GNSS · Drones · Logiciels',
    intro:
      "Nous fournissons et accompagnons la mise en service des équipements de mesure et d'acquisition de données spatiales.",
    points: [
      'Équipements topographiques, géodésiques et de positionnement',
      "Systèmes GNSS et matériels d'acquisition de données spatiales",
      'Drones, accessoires et équipements associés',
      "Logiciels et solutions technologiques du domaine",
    ],
  },
  {
    slug: 'etudes',
    index: '08',
    short: 'Études & prestations de services',
    title: 'Réalisation d\u2019études et de prestations de services',
    image: IMG.briefing,
    tag: 'Marchés · Appels d\u2019offres · Conventions',
    intro:
      "Nous intervenons pour les administrations publiques, les collectivités, les entreprises et les partenaires nationaux comme internationaux.",
    points: [
      'Administrations publiques et collectivités territoriales',
      'Entreprises, organisations et particuliers',
      'Partenaires nationaux et internationaux',
      "Marchés, consultations, appels d'offres et conventions",
    ],
  },
];

// ---- Méthode de travail ----
export const METHODE = [
  {
    n: '01',
    title: 'Écoute et cadrage',
    text: "Nous qualifions votre besoin, délimitons le périmètre d'étude et définissons ensemble les livrables attendus avant tout engagement.",
  },
  {
    n: '02',
    title: 'Acquisition des données',
    text: "Levés de terrain, campagnes GNSS et drone, imagerie satellite et enquêtes : nous choisissons la méthode adaptée à votre échelle et à votre budget.",
  },
  {
    n: '03',
    title: 'Traitement et structuration',
    text: "Géoréférencement, contrôle qualité et intégration dans des bases de données interopérables, documentées à chaque étape.",
  },
  {
    n: '04',
    title: 'Analyse et modélisation',
    text: "Croisement des couches, modélisation, analyse spatiale et statistique pour transformer la mesure en information exploitable.",
  },
  {
    n: '05',
    title: 'Restitution et transfert',
    text: "Plans, rapports, cartes et outils numériques livrés avec la formation nécessaire à votre autonomie.",
  },
];

// ---- Ce qui nous distingue (pas de bilan chiffré : structure jeune) ----
export const ENGAGEMENTS = [
  {
    n: '01',
    title: 'Des ingénieurs, pas des intermédiaires',
    text: "Notre équipe est composée d'ingénieurs géomaticiens, de statisticiens et d'économistes. Vos interlocuteurs sont ceux qui produisent la donnée, pas des commerciaux qui la revendent.",
  },
  {
    n: '02',
    title: 'Un cabinet neuf, des méthodes éprouvées',
    text: "CIGATE est une structure récente, portée par des profils formés et déjà expérimentés dans leurs disciplines respectives. Nous appliquons dès la première mission les standards du métier.",
  },
  {
    n: '03',
    title: 'Une réponse rapide et un engagement direct',
    text: "Notre taille est un avantage : pas de couches hiérarchiques, des délais courts, et une disponibilité réelle sur toute la durée de la mission.",
  },
  {
    n: '04',
    title: 'Le transfert de compétences comme principe',
    text: "Chaque livrable est documenté et accompagné. Nous préférons rendre nos clients autonomes plutôt qu'entretenir une dépendance technique.",
  },
];

// ---- Clients cibles ----
export const CLIENTS = [
  'Administrations publiques',
  'Collectivités territoriales',
  'Entreprises et industriels',
  'Organisations et ONG',
  'Bureaux d\u2019études partenaires',
  'Particuliers et propriétaires fonciers',
];

// ---- Repères vérifiables (issus des statuts) ----
export const REPERES = [
  { k: 'Forme juridique',  v: 'SARL pluripersonnelle' },
  { k: 'Cadre',            v: 'Droit OHADA — Togo' },
  { k: 'Siège social',     v: 'Lomé, Quartier Adidoadin' },
  { k: 'Champ d\u2019action', v: 'Togo et international' },
];

export const CONTACT = {
  raison: 'CIGATE SARL',
  denomination:
    'Cabinet International de Géomatique, Aménagement, Topographie et Environnement',
  address: 'Quartier Adidoadin, Lomé, Togo',
  phone: '+228 22 55 70 03',
  phoneHref: '+22822557003',
  email: 'contact@cigate.tg',
  hours: 'Lundi – Vendredi · 8h00 – 17h30',
  coord: '6.1319° N · 1.2228° E',
};
