// ============================================================
//  CIGATE — contenu éditorial centralisé
//  Cabinet International de Géomatique, Aménagement,
//  Topographie et Environnement — SARL, Lomé (Togo)
//  Domaines issus de l'article 2 des statuts.
//
//  Les champs traduisibles sont des objets { fr, en } ; utiliser
//  tr(champ, lang) pour résoudre la bonne langue (repli sur le FR).
// ============================================================

const u = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?fm=jpg&q=74&w=${w}&auto=format&fit=crop`;

/** Résout un champ bilingue { fr, en } dans la langue demandée (repli FR). */
export function tr(field, lang) {
  if (field == null) return field;
  return field[lang] || field.fr;
}

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
  satTexture: u('1717824183048-1cf231aab964'),
  satIslands: u('1462331321792-cc44368b8894'),

  // Territoire vu du ciel
  aerialRoads: u('1441644599508-24ae08965c5c'),
  aerialCoast: u('1523443571261-671bddef4ecd'),
  aerialField: u('1720156457517-c5ae8b9915f0'),
  aerialCity:  u('1614103192137-835c33cd0685'),

  // Terrain et instruments
  station:   u('1654643353084-10e62e05b9bf'),
  tripod:    u('1628158088936-68ccaaa400dc'),
  gnss:      u('1628155858736-bacadae33a88'),
  level:     u('1545186070-de624ed19875'),

  // Formations
  trainQgis:     u('1666281466387-0639381c5680'),
  trainArcgis:   u('1542744173-8e7e53415bb0'),
  trainPython:   u('1660616246653-e2c57d1077b9'),
  trainAdvanced: u('1662638600476-d563fffbb072'),
  trainWebgis:   u('1676652822930-f82ccf06b7ef'),
};

export const NAV = [
  { to: '/',                  label: { fr: 'Accueil', en: 'Home' } },
  { to: '/qui-sommes-nous',   label: { fr: 'Qui sommes-nous', en: 'About us' } },
  { to: '/notre-expertise',   label: { fr: 'Notre expertise', en: 'Our expertise' } },
  { to: '/formations',        label: { fr: 'Formations', en: 'Training' } },
  { to: '/actualites',        label: { fr: 'Actualités', en: 'News' } },
  { to: '/contact',           label: { fr: 'Contact', en: 'Contact' } },
];

export const MARQUEE = [
  { fr: 'Géomatique', en: 'Geomatics' },
  { fr: 'Télédétection', en: 'Remote sensing' },
  { fr: 'Topographie', en: 'Topography' },
  { fr: 'Géodésie', en: 'Geodesy' },
  { fr: 'Cartographie', en: 'Cartography' },
  { fr: 'Études foncières', en: 'Land studies' },
  { fr: 'Analyse de données', en: 'Data analysis' },
  { fr: 'Solutions SIG', en: 'GIS solutions' },
  { fr: 'Drones & GNSS', en: 'Drones & GNSS' },
  { fr: 'Aménagement du territoire', en: 'Territorial planning' },
  { fr: 'Environnement', en: 'Environment' },
  { fr: 'Formation', en: 'Training' },
];

// ---- Article 2 des statuts : les huit domaines d'activité ----
export const DOMAINES = [
  {
    slug: 'geomatique',
    index: '01',
    image: IMG.satSensor,
    short: { fr: 'Géomatique & intelligence territoriale', en: 'Geomatics & territorial intelligence' },
    title: {
      fr: 'Géomatique, environnement, aménagement et intelligence territoriale',
      en: 'Geomatics, environment, planning and territorial intelligence',
    },
    tag: { fr: 'Données géospatiales · Cartographie · Climat', en: 'Geospatial data · Mapping · Climate' },
    intro: {
      fr: "Collecte, production, traitement et analyse des données géospatiales et territoriales. Nous produisons la lecture cartographique qui permet de décider en connaissance de cause.",
      en: 'Collection, production, processing and analysis of geospatial and territorial data. We produce the cartographic reading that enables informed decisions.',
    },
    points: {
      fr: [
        'Collecte, production et gestion de données géospatiales et territoriales',
        'Cartographie et analyse spatiale du territoire',
        'Études environnementales et climatiques',
        "Études et projets d'aménagement et de développement des territoires",
      ],
      en: [
        'Collection, production and management of geospatial and territorial data',
        "Mapping and spatial analysis of the territory",
        'Environmental and climate studies',
        "Territorial planning and development studies and projects",
      ],
    },
  },
  {
    slug: 'topographie',
    index: '02',
    image: IMG.station,
    short: { fr: 'Topographie & géodésie', en: 'Topography & geodesy' },
    title: { fr: 'Topographie et géodésie', en: 'Topography and geodesy' },
    tag: { fr: 'Levés · Implantation · Plans', en: 'Surveys · Staking-out · Plans' },
    intro: {
      fr: "La mesure de terrain, socle de tout projet d'aménagement. Levés, positionnement et implantation conduits avec des chaînes d'acquisition calibrées.",
      en: 'Field measurement, the foundation of every development project. Surveys, positioning and staking-out carried out with calibrated acquisition chains.',
    },
    points: {
      fr: [
        'Levés topographiques et travaux de positionnement',
        "Implantations et suivi d'exécution",
        'Production de plans et de documents cartographiques',
        'Prestations topographiques connexes',
      ],
      en: [
        'Topographic surveys and positioning work',
        'Staking-out and construction monitoring',
        'Production of plans and mapping documents',
        'Related topographic services',
      ],
    },
  },
  {
    slug: 'foncier',
    index: '03',
    image: IMG.aerialRoads,
    short: { fr: 'Études foncières & immobilières', en: 'Land & real-estate studies' },
    title: { fr: 'Études foncières et immobilières', en: 'Land and real-estate studies' },
    tag: { fr: 'Foncier · Immobilier · Occupation des sols', en: 'Land · Real estate · Land use' },
    intro: {
      fr: "Comprendre qui occupe quoi, et sur quelle base. Nos études éclairent la gestion des espaces et sécurisent les décisions immobilières.",
      en: 'Understanding who occupies what, and on what basis. Our studies inform land management and secure real-estate decisions.',
    },
    points: {
      fr: [
        'Études et analyses relatives au foncier et à l’immobilier',
        "Analyse de l'occupation et de la gestion des espaces",
        'Appui à la structuration et à la sécurisation foncière',
        'Prestations relatives à la gestion des territoires',
      ],
      en: [
        'Studies and analyses related to land and real estate',
        'Analysis of land use and space management',
        'Support for land structuring and tenure security',
        'Territorial management services',
      ],
    },
  },
  {
    slug: 'donnees',
    index: '04',
    image: IMG.screens,
    short: { fr: 'Analyse & valorisation des données', en: 'Data analysis & valorisation' },
    title: { fr: 'Analyse, traitement et valorisation des données', en: 'Data analysis, processing and valorisation' },
    tag: { fr: 'Statistiques · Modélisation · Aide à la décision', en: 'Statistics · Modelling · Decision support' },
    intro: {
      fr: "Une donnée qui n'éclaire pas une décision ne sert à rien. Nous transformons vos jeux de données en indicateurs lisibles et en outils actionnables.",
      en: "Data that doesn't inform a decision serves no purpose. We turn your datasets into readable indicators and actionable tools.",
    },
    points: {
      fr: [
        'Études statistiques et analyse de données',
        'Modélisation et visualisation',
        "Production d'outils d'aide à la décision",
        'Tableaux de bord et restitution des résultats',
      ],
      en: [
        'Statistical studies and data analysis',
        'Modelling and visualisation',
        'Production of decision-support tools',
        'Dashboards and reporting of results',
      ],
    },
  },
  {
    slug: 'numerique',
    index: '05',
    image: IMG.satMap,
    short: { fr: 'Solutions numériques', en: 'Digital solutions' },
    title: { fr: 'Conception et développement de solutions numériques', en: 'Design and development of digital solutions' },
    tag: { fr: 'SIG · Applications · Plateformes', en: 'GIS · Applications · Platforms' },
    intro: {
      fr: "Nous concevons les outils qui font vivre la donnée dans la durée : systèmes d'information géographique, plateformes et applications métier.",
      en: 'We design the tools that keep data alive over time: geographic information systems, platforms and business applications.',
    },
    points: {
      fr: [
        "Systèmes d'information géographique et bases de données",
        'Applications et plateformes numériques',
        "Outils d'automatisation et tableaux de bord",
        'Solutions innovantes sur mesure',
      ],
      en: [
        'Geographic information systems and databases',
        'Digital applications and platforms',
        'Automation tools and dashboards',
        'Tailor-made innovative solutions',
      ],
    },
  },
  {
    slug: 'formation',
    index: '06',
    image: IMG.formation,
    short: { fr: 'Formation & conseil', en: 'Training & consulting' },
    title: { fr: 'Formation, conseil et assistance technique', en: 'Training, consulting and technical assistance' },
    tag: { fr: 'Transfert de compétences · Accompagnement', en: 'Skills transfer · Support' },
    intro: {
      fr: "Nous transmettons les méthodes et les outils, pour que vos équipes restent autonomes une fois la mission terminée.",
      en: 'We pass on the methods and tools, so your teams remain autonomous once the assignment is complete.',
    },
    points: {
      fr: [
        'Formation en géomatique, topographie et analyse de données',
        'Conseil en sciences spatiales et outils numériques',
        'Assistance technique et appui opérationnel',
        'Accompagnement méthodologique et scientifique',
      ],
      en: [
        'Training in geomatics, topography and data analysis',
        'Consulting in spatial sciences and digital tools',
        'Technical assistance and operational support',
        'Methodological and scientific support',
      ],
    },
  },
  {
    slug: 'equipements',
    index: '07',
    image: IMG.gnss,
    short: { fr: 'Matériels & équipements', en: 'Equipment & materials' },
    title: {
      fr: 'Vente, fourniture et distribution de matériels et solutions techniques',
      en: 'Sale, supply and distribution of equipment and technical solutions',
    },
    tag: { fr: 'GNSS · Drones · Logiciels', en: 'GNSS · Drones · Software' },
    intro: {
      fr: "Nous fournissons et accompagnons la mise en service des équipements de mesure et d'acquisition de données spatiales.",
      en: 'We supply and support the commissioning of measurement and spatial data acquisition equipment.',
    },
    points: {
      fr: [
        'Équipements topographiques, géodésiques et de positionnement',
        "Systèmes GNSS et matériels d'acquisition de données spatiales",
        'Drones, accessoires et équipements associés',
        "Logiciels et solutions technologiques du domaine",
      ],
      en: [
        'Topographic, geodetic and positioning equipment',
        'GNSS systems and spatial data acquisition equipment',
        'Drones, accessories and related equipment',
        'Software and technology solutions for the field',
      ],
    },
  },
  {
    slug: 'etudes',
    index: '08',
    image: IMG.conseil,
    short: { fr: 'Études & prestations de services', en: 'Studies & services' },
    title: { fr: 'Réalisation d’études et de prestations de services', en: 'Studies and service delivery' },
    tag: { fr: 'Marchés · Appels d’offres · Conventions', en: 'Tenders · Contracts · Agreements' },
    intro: {
      fr: "Nous intervenons pour les administrations publiques, les collectivités, les entreprises et les partenaires nationaux comme internationaux.",
      en: 'We work with public administrations, local authorities, businesses, and national and international partners.',
    },
    points: {
      fr: [
        'Administrations publiques et collectivités territoriales',
        'Entreprises, organisations et particuliers',
        'Partenaires nationaux et internationaux',
        "Marchés, consultations, appels d'offres et conventions",
      ],
      en: [
        'Public administrations and local authorities',
        'Businesses, organisations and individuals',
        'National and international partners',
        'Tenders, consultations, calls for proposals and agreements',
      ],
    },
  },
];

// ---- Catalogue des formations ----
export const FORMATIONS = [
  {
    slug: 'qgis-initiation',
    index: '01',
    image: IMG.trainQgis,
    title: { fr: 'Introduction au SIG avec QGIS', en: 'Introduction to GIS with QGIS' },
    intro: {
      fr: "Découvrir les fondamentaux des systèmes d'information géographique avec QGIS, la référence libre et gratuite des SIG.",
      en: 'Discover the fundamentals of geographic information systems with QGIS, the leading free and open-source GIS software.',
    },
    points: {
      fr: [
        "Prise en main de l'interface et des projets QGIS",
        'Import, structuration et symbologie des données géospatiales',
        'Habillage et mise en page cartographique',
        'Premières analyses spatiales',
      ],
      en: [
        'Getting started with the QGIS interface and projects',
        'Importing, structuring and styling geospatial data',
        'Map layout and cartographic design',
        'First spatial analyses',
      ],
    },
  },
  {
    slug: 'arcgis-initiation',
    index: '02',
    image: IMG.trainArcgis,
    title: { fr: 'Introduction au SIG avec ArcGIS', en: 'Introduction to GIS with ArcGIS' },
    intro: {
      fr: 'Maîtriser les bases de la suite ArcGIS (Esri) pour la production, la gestion et l’analyse de données géographiques.',
      en: 'Master the basics of the ArcGIS (Esri) suite for producing, managing and analysing geographic data.',
    },
    points: {
      fr: [
        'Environnement ArcGIS Pro et gestion de projets',
        'Création et gestion de géodatabases',
        'Symbologie, étiquetage et mise en page',
        'Analyses spatiales avec les outils Esri',
      ],
      en: [
        'ArcGIS Pro environment and project management',
        'Creating and managing geodatabases',
        'Symbology, labelling and layout',
        'Spatial analysis with Esri tools',
      ],
    },
  },
  {
    slug: 'python-geospatial',
    index: '03',
    image: IMG.trainPython,
    title: { fr: 'Python Programming pour le géospatial', en: 'Python Programming for Geospatial' },
    intro: {
      fr: 'Automatiser le traitement de données géospatiales et développer des scripts avec Python.',
      en: 'Automate geospatial data processing and develop scripts with Python.',
    },
    points: {
      fr: [
        'Bases de Python appliquées à la géomatique',
        'Manipulation de données vecteur et raster',
        'Automatisation des traitements SIG',
        'Introduction à GeoPandas, Rasterio et ArcPy',
      ],
      en: [
        'Python basics applied to geomatics',
        'Handling vector and raster data',
        'Automating GIS workflows',
        'Introduction to GeoPandas, Rasterio and ArcPy',
      ],
    },
  },
  {
    slug: 'sig-avance',
    index: '04',
    image: IMG.trainAdvanced,
    title: { fr: 'SIG avancé', en: 'Advanced GIS' },
    intro: {
      fr: "Approfondir l'analyse spatiale et la modélisation pour des projets territoriaux exigeants.",
      en: 'Deepen spatial analysis and modelling skills for demanding territorial projects.',
    },
    points: {
      fr: [
        'Analyses spatiales avancées et modélisation',
        'Interopérabilité et bases de données spatiales',
        'Automatisation des chaînes de traitement',
        "Étude de cas appliqués à l'aménagement du territoire",
      ],
      en: [
        'Advanced spatial analysis and modelling',
        'Interoperability and spatial databases',
        'Automating processing pipelines',
        'Case studies applied to territorial planning',
      ],
    },
  },
  {
    slug: 'collecte-mobile',
    index: '05',
    image: IMG.tripod,
    title: { fr: 'Outils numériques de collecte de données SIG', en: 'Digital tools for GIS data collection' },
    intro: {
      fr: 'Se former aux outils de collecte de terrain mobile pour numériser vos enquêtes et relevés géospatiaux.',
      en: 'Learn mobile field-collection tools to digitise your geospatial surveys and records.',
    },
    points: {
      fr: [
        'Conception de formulaires de collecte',
        'Collecte mobile hors-ligne et géolocalisée',
        'Synchronisation et contrôle qualité des données',
        'Intégration des données collectées dans un SIG',
      ],
      en: [
        'Designing data collection forms',
        'Offline, geolocated mobile data collection',
        'Data synchronisation and quality control',
        'Integrating collected data into a GIS',
      ],
    },
  },
  {
    slug: 'webgis',
    index: '06',
    image: IMG.trainWebgis,
    title: { fr: 'WebGIS', en: 'WebGIS' },
    intro: {
      fr: 'Concevoir et publier des cartes interactives et des applications web géospatiales.',
      en: 'Design and publish interactive maps and web geospatial applications.',
    },
    points: {
      fr: [
        'Principes du WebGIS et des services web géospatiaux (WMS/WFS)',
        'Publication de cartes avec QGIS Server / GeoServer',
        'Développement de cartes interactives (Leaflet, MapLibre)',
        'Diffusion et partage de données géospatiales en ligne',
      ],
      en: [
        'WebGIS principles and geospatial web services (WMS/WFS)',
        'Publishing maps with QGIS Server / GeoServer',
        'Building interactive maps (Leaflet, MapLibre)',
        'Publishing and sharing geospatial data online',
      ],
    },
  },
];

// ---- Méthode de travail ----
export const METHODE = [
  {
    n: '01',
    title: { fr: 'Écoute et cadrage', en: 'Listening and scoping' },
    text: {
      fr: "Nous qualifions votre besoin, délimitons le périmètre d'étude et définissons ensemble les livrables attendus avant tout engagement.",
      en: "We qualify your need, define the study's scope and agree together on the expected deliverables before any commitment.",
    },
  },
  {
    n: '02',
    title: { fr: 'Acquisition des données', en: 'Data acquisition' },
    text: {
      fr: "Levés de terrain, campagnes GNSS et drone, imagerie satellite et enquêtes : nous choisissons la méthode adaptée à votre échelle et à votre budget.",
      en: 'Field surveys, GNSS and drone campaigns, satellite imagery and surveys: we choose the method suited to your scale and budget.',
    },
  },
  {
    n: '03',
    title: { fr: 'Traitement et structuration', en: 'Processing and structuring' },
    text: {
      fr: "Géoréférencement, contrôle qualité et intégration dans des bases de données interopérables, documentées à chaque étape.",
      en: 'Georeferencing, quality control and integration into interoperable databases, documented at every step.',
    },
  },
  {
    n: '04',
    title: { fr: 'Analyse et modélisation', en: 'Analysis and modelling' },
    text: {
      fr: "Croisement des couches, modélisation, analyse spatiale et statistique pour transformer la mesure en information exploitable.",
      en: 'Cross-referencing layers, modelling, spatial and statistical analysis to turn measurement into actionable information.',
    },
  },
  {
    n: '05',
    title: { fr: 'Restitution et transfert', en: 'Delivery and transfer' },
    text: {
      fr: "Plans, rapports, cartes et outils numériques livrés avec la formation nécessaire à votre autonomie.",
      en: 'Plans, reports, maps and digital tools delivered along with the training needed for your autonomy.',
    },
  },
];

// ---- Ce qui nous distingue (pas de bilan chiffré : structure jeune) ----
export const ENGAGEMENTS = [
  {
    n: '01',
    title: { fr: 'Des ingénieurs, pas des intermédiaires', en: 'Engineers, not intermediaries' },
    text: {
      fr: "Notre équipe est composée d'ingénieurs géomaticiens, de statisticiens et d'économistes. Vos interlocuteurs sont ceux qui produisent la donnée, pas des commerciaux qui la revendent.",
      en: 'Our team is made up of geomatics engineers, statisticians and economists. Your contacts are the people who produce the data, not sales staff reselling it.',
    },
  },
  {
    n: '02',
    title: { fr: 'Un cabinet neuf, des méthodes éprouvées', en: 'A new firm, proven methods' },
    text: {
      fr: "CIGATE est une structure récente, portée par des profils formés et déjà expérimentés dans leurs disciplines respectives. Nous appliquons dès la première mission les standards du métier.",
      en: 'CIGATE is a recent structure, driven by trained profiles already experienced in their respective disciplines. We apply industry standards from the very first assignment.',
    },
  },
  {
    n: '03',
    title: { fr: 'Une réponse rapide et un engagement direct', en: 'A fast response and direct commitment' },
    text: {
      fr: "Notre taille est un avantage : pas de couches hiérarchiques, des délais courts, et une disponibilité réelle sur toute la durée de la mission.",
      en: 'Our size is an advantage: no hierarchical layers, short turnaround times, and real availability throughout the assignment.',
    },
  },
  {
    n: '04',
    title: { fr: 'Le transfert de compétences comme principe', en: 'Skills transfer as a principle' },
    text: {
      fr: "Chaque livrable est documenté et accompagné. Nous préférons rendre nos clients autonomes plutôt qu'entretenir une dépendance technique.",
      en: 'Every deliverable is documented and accompanied. We prefer to make our clients autonomous rather than maintain technical dependency.',
    },
  },
];

// ---- Clients cibles ----
export const CLIENTS = [
  { fr: 'Administrations publiques', en: 'Public administrations' },
  { fr: 'Collectivités territoriales', en: 'Local authorities' },
  { fr: 'Entreprises et industriels', en: 'Businesses and industrial firms' },
  { fr: 'Organisations et ONG', en: 'Organisations and NGOs' },
  { fr: 'Bureaux d’études partenaires', en: 'Partner consulting firms' },
  { fr: 'Particuliers et propriétaires fonciers', en: 'Individuals and landowners' },
];

// ---- Actualités : catégories (clé stockée en base <-> libellé bilingue) ----
export const NEWS_CATEGORIES = [
  { value: 'cabinet', label: { fr: 'Vie du cabinet', en: 'Company news' } },
  { value: 'projet', label: { fr: 'Projet', en: 'Project' } },
  { value: 'equipement', label: { fr: 'Équipement', en: 'Equipment' } },
  { value: 'formation', label: { fr: 'Formation', en: 'Training' } },
  { value: 'partenariat', label: { fr: 'Partenariat', en: 'Partnership' } },
  { value: 'evenement', label: { fr: 'Événement', en: 'Event' } },
];
export const CATEGORY_LABELS_FR = Object.fromEntries(NEWS_CATEGORIES.map((c) => [c.value, c.label.fr]));
export const CATEGORY_LABELS = Object.fromEntries(NEWS_CATEGORIES.map((c) => [c.value, c.label]));

// ---- Repères vérifiables (issus des statuts) ----
export const REPERES = [
  { k: 'Forme juridique',  v: 'SARL pluripersonnelle' },
  { k: 'Cadre',            v: 'Droit OHADA — Togo' },
  { k: 'Siège social',     v: 'Lomé, Quartier Adidoadin' },
  { k: 'Champ d’action', v: 'Togo et international' },
];

export const CONTACT = {
  raison: 'CIGATE SARL',
  denomination:
    'Cabinet International de Géomatique, Aménagement, Topographie et Environnement',
  address: 'Quartier Adidoadin, Lomé, Togo',
  phone: '+228 22 55 70 03',
  phoneHref: '+22822557003',
  email: 'contact@cigate-int.com',
  hours: { fr: 'Lundi – Vendredi · 8h00 – 17h30', en: 'Monday – Friday · 8:00 AM – 5:30 PM' },
  coord: '6.1319° N · 1.2228° E',
};
