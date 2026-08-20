# CIGATE — site vitrine

**Cabinet International de Géomatique, Aménagement, Topographie et Environnement** — SARL, Lomé (Togo).
Projet **React 18 + Vite + Framer Motion + React Router**, prêt à déployer sur Cloudflare Pages.

## Démarrer en local

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # génère /dist
npm run preview    # prévisualise le build
```

## Déployer sur Cloudflare Pages

**Option A — via Git (recommandé)**

1. Poussez ce dossier sur GitHub ou GitLab.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Réglages : preset `Vite`, build command `npm run build`, output directory `dist`.
4. **Save and Deploy**. Chaque `git push` redéploie automatiquement.

**Option B — Wrangler**

```bash
npm install -g wrangler
npm run build
wrangler pages deploy dist --project-name=cigate
```

Le fichier `public/_redirects` renvoie toutes les routes vers `index.html` pour que la
navigation React Router fonctionne en accès direct (`/notre-expertise`, `/contact`…).

## Structure

```
src/
├── data/content.js         ← TOUT le contenu éditorial (à personnaliser)
├── index.css               ← design system complet
├── components/
│   ├── Motion.jsx          ← bibliothèque d'animations (8 variantes)
│   ├── FeatureRow.jsx      ← ligne image/texte alternée
│   ├── Header.jsx  Footer.jsx  PageHead.jsx  PageShell.jsx
│   ├── Marquee.jsx  Icons.jsx  Logo.jsx  ScrollTop.jsx
└── pages/
    ├── Home.jsx
    ├── QuiSommesNous.jsx    → /qui-sommes-nous
    ├── NotreExpertise.jsx   → /notre-expertise
    ├── Contact.jsx          → /contact
    └── NotFound.jsx
```

## Identité visuelle

Reprise directe du logo :

| Rôle | Couleur |
|---|---|
| Bleu marine (titres, header, footer) | `#17304F` |
| Vert (accent, boutons, liens actifs) | `#2E7D3A` |
| Fond principal | `#FFFFFF` |
| Fond secondaire | `#F5F8F4` |

Typographie : **Sora** (titres) · **Inter** (texte) · **IBM Plex Mono** (données techniques).

Le logo est dans `public/images/logo-cigate.png` et sert aussi de favicon.

## Les animations

Le fichier `src/components/Motion.jsx` expose huit variantes, réparties sur tout le site :

| Variante | Effet |
|---|---|
| `left` / `right` | glissement latéral (lignes image + texte alternées) |
| `up` / `down` | montée / descente en fondu |
| `scale` | zoom léger à l'apparition |
| `wipe` | dévoilement par balayage (`clip-path`) |
| `blur` | arrive net depuis un flou |
| `tilt` | bascule 3D (cartes de domaines) |

S'y ajoutent : `WordsUp` (titres révélés mot par mot), `Parallax` (défilement différentiel
sur les images), `Stagger` (cascade), `ScrollProgress` (barre de progression en haut),
l'accordéon animé de la page Expertise, le bandeau défilant et le hero en composition
séquencée. `prefers-reduced-motion` neutralise l'ensemble.

## Personnalisation

### Contenu

Tout est dans **`src/data/content.js`** : navigation, huit domaines d'activité (repris de
l'article 2 des statuts), méthode, engagements, clients cibles, repères juridiques et
coordonnées. Aucun composant à modifier pour changer un texte.

### Adresse électronique

`contact@cigate.tg` est un **placeholder** — remplacez-le dans `CONTACT.email`
(`src/data/content.js`) par votre adresse réelle.

### Images

Les visuels viennent d'Unsplash (usage commercial libre). Pour vos propres photos :

1. Déposez-les dans `public/images/`.
2. Dans `src/data/content.js`, remplacez la valeur, par exemple :
   ```js
   heroTeam: '/images/notre-equipe.jpg',
   ```

Priorité recommandée dès que vous aurez vos propres visuels : le hero, les quatre premiers
domaines et la page « Qui sommes-nous ».

### Formulaire de contact

Il ouvre par défaut la messagerie du visiteur. Pour un envoi serveur, remplacez le corps de
`submit()` dans `src/pages/Contact.jsx` par un appel à votre endpoint (Cloudflare Worker,
Formspree, Resend…).

## À compléter plus tard

Quand le cabinet aura ses premières missions, deux ajouts naturels :
une page **Réalisations** (même structure que `NotreExpertise.jsx`) et une section
**Équipe** sur « Qui sommes-nous ».
