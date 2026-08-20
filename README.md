# CIGATE — site vitrine

**Cabinet International de Géomatique, Aménagement, Topographie et Environnement** — SARL, Lomé (Togo).
Projet **React 18 + Vite + Framer Motion + React Router**, servi par un **Cloudflare Worker**
(Hono) avec assets statiques, base **D1** pour les actualités et **KV** pour les médias.
Site bilingue **FR / EN** (`/…` et `/en/…`) et panel d'administration sur `/admin`.

## Démarrer en local

```bash
npm install
npm run dev              # http://localhost:5173 — front seul (sans API/D1/KV)
npx wrangler dev         # http://localhost:8787 — front + API + D1/KV émulés en local
```

`npx wrangler dev` construit le client et le Worker puis sert les deux ensemble : c'est la
commande à utiliser pour tester l'admin, les actus dynamiques ou l'upload d'images.

Les secrets locaux (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`) vont dans `.dev.vars`
(gitignored — copier `.dev.vars.example` pour démarrer).

### Base de données locale

```bash
npx wrangler d1 execute cigate --local --file=migrations/0001_news.sql
```

## Déployer sur Cloudflare Workers

Le projet est déjà configuré côté Cloudflare (Worker `cigate-site`, base D1 `cigate`,
namespace KV `cigate_media`) — `wrangler.jsonc` porte les bindings. Reste, une fois
authentifié (`npx wrangler login`) :

```bash
# 1. Migration D1 en production (une seule fois, puis à chaque évolution du schéma)
npx wrangler d1 execute cigate --remote --file=migrations/0001_news.sql

# 2. Secrets du panel admin (une seule fois)
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET   # ex. valeur : openssl rand -hex 32

# 3. Build + déploiement
npm run build
npx wrangler deploy
```

Le déploiement continu (Git → Cloudflare) fonctionne aussi tel quel : build command
`npm run build`, `wrangler deploy` prend le relais pour les assets **et** l'API.

## Structure

```
worker/                    ← backend Cloudflare Worker (Hono)
├── index.js                  point d'entrée, montage des routes
├── routes/auth.js             login/logout/session admin (cookie signé HMAC)
├── routes/news.js             API actualités (publique + CRUD admin)
├── routes/media.js            upload/liste/suppression médias (KV) + service /media/:key
└── lib/{db,session}.js        helpers D1 et signature de session

migrations/0001_news.sql   ← schéma D1 + jeu de données initial (actus FR/EN)

src/
├── data/content.js         ← contenu éditorial statique (bilingue { fr, en })
├── i18n/                    fr.js / en.js (dictionnaires) + I18nProvider (contexte React)
├── index.css               ← design system complet (inclut les styles admin)
├── components/              Header, Footer, Motion, FeatureRow, Marquee, Icons, Logo…
├── admin/                    panel /admin (login, liste/formulaire actus, médiathèque)
└── pages/
    ├── Home.jsx                       → /            ·  /en
    ├── QuiSommesNous.jsx               → /qui-sommes-nous  ·  /en/qui-sommes-nous
    ├── NotreExpertise.jsx              → /notre-expertise  ·  /en/notre-expertise
    ├── Actualites.jsx                  → /actualites       ·  /en/actualites (API D1)
    ├── Contact.jsx                     → /contact          ·  /en/contact
    └── NotFound.jsx
```

## Actualités dynamiques

Les actus vivent en base D1 (table `news`, champs `title_fr`/`title_en`,
`excerpt_fr`/`excerpt_en`, etc.). La page publique consomme `GET /api/news?lang=fr|en`.
Gestion (créer/éditer/publier/dépublier/supprimer + images) via le panel `/admin`.

## Panel d'administration (`/admin`)

Protégé par mot de passe unique (`ADMIN_PASSWORD`, secret Worker) — pas de multi-compte.
- `/admin/news` — liste, création, édition (champs FR **et** EN), publication.
- `/admin/media` — médiathèque : upload d'images (stockées en KV, `cigate_media`),
  copie d'URL, suppression. Chaque image uploadée dans le formulaire d'actu passe par là.

Le panel lui-même reste en français (outil interne) ; seul le site public est bilingue.

## Internationalisation

- `src/i18n/fr.js` et `en.js` portent tout le texte de mise en page (titres, boutons,
  formulaires…), résolu via `t('chemin.de.la.clé')`.
- Les données structurées de `src/data/content.js` (domaines, méthode, engagements,
  clients, catégories d'actus) ont des champs `{ fr, en }`, résolus via `tf(champ)`.
- Les deux sont fournis par `I18nProvider` (`src/i18n/I18nProvider.jsx`), qui déduit la
  langue depuis l'URL (`/en/...` vs le reste) — pas de préférence stockée.
- Pour ajouter une langue : dupliquer `en.js`, ajouter les variantes `{ fr, en, <code> }`
  dans `content.js`, et un préfixe de route dans `ROUTES` (`src/App.jsx`).

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

### Contenu statique

Tout est dans **`src/data/content.js`** : navigation, huit domaines d'activité (repris de
l'article 2 des statuts), méthode, engagements, clients cibles, repères juridiques et
coordonnées — chaque texte est un objet `{ fr, en }`.

### Adresse électronique

`contact@cigate.tg` est un **placeholder** — remplacez-le dans `CONTACT.email`
(`src/data/content.js`) par votre adresse réelle.

### Images

Les visuels par défaut viennent d'Unsplash (usage commercial libre). Pour vos propres
photos :
1. Déposez-les dans `public/images/`, ou uploadez-les via `/admin/media` pour les actus.
2. Dans `src/data/content.js`, remplacez la valeur, par exemple :
   ```js
   heroTeam: '/images/notre-equipe.jpg',
   ```

### Formulaire de contact

Il ouvre par défaut la messagerie du visiteur (`mailto:`). Pour un envoi serveur,
ajoutez une route dans `worker/routes/` et remplacez le corps de `submit()` dans
`src/pages/Contact.jsx` par un appel `fetch()` vers cette route.

## À compléter plus tard

Une page **Réalisations** (même structure que `NotreExpertise.jsx`) et une section
**Équipe** sur « Qui sommes-nous » restent des ajouts naturels une fois les premières
missions du cabinet documentées.
