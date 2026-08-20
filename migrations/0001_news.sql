-- Schéma des actualités + jeu de données initial (repris de l'ancien tableau
-- statique NEWS dans src/data/content.js, traduit en anglais).

CREATE TABLE news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,          -- clé courte : cabinet | projet | equipement | formation | partenariat | evenement
  date TEXT NOT NULL,              -- ISO (YYYY-MM-DD)
  image_key TEXT,                  -- clé KV (media/<id>.<ext>), NULL = image par défaut côté front
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  excerpt_fr TEXT NOT NULL,
  excerpt_en TEXT NOT NULL,
  body_fr TEXT,
  body_en TEXT,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_news_published_date ON news (published, date DESC);

INSERT INTO news (slug, category, date, title_fr, title_en, excerpt_fr, excerpt_en, published) VALUES
('ouverture-cigate-lome', 'cabinet', '2026-02-03',
 'CIGATE ouvre ses portes à Lomé',
 'CIGATE opens its doors in Lomé',
 'Le cabinet démarre son activité depuis le quartier Adidoadin avec une équipe d''ingénieurs géomaticiens, statisticiens et économistes réunis autour des huit domaines d''intervention définis par ses statuts.',
 'The firm begins operations from the Adidoadin district with a team of geomatics engineers, statisticians and economists brought together around the eight areas of activity defined in its statutes.',
 1),

('leve-topographique-amenagement-urbain', 'projet', '2026-03-18',
 'Levé topographique pour un projet d''aménagement urbain',
 'Topographic survey for an urban development project',
 'Notre équipe terrain a conduit une campagne de levés GNSS et d''implantation en appui à un projet de voirie, avec restitution des plans et des documents cartographiques associés.',
 'Our field team carried out a GNSS survey and staking-out campaign in support of a road project, delivering the associated plans and mapping documents.',
 1),

('acquisition-systeme-gnss', 'equipement', '2026-04-09',
 'Acquisition d''un nouveau système GNSS haute précision',
 'New high-precision GNSS system acquired',
 'CIGATE renforce sa chaîne d''acquisition avec un récepteur GNSS multi-fréquences, pour des levés de positionnement plus rapides et une précision accrue sur le terrain.',
 'CIGATE strengthens its data-acquisition chain with a multi-frequency GNSS receiver, enabling faster positioning surveys and greater accuracy in the field.',
 1),

('formation-sig-administration', 'formation', '2026-05-14',
 'Session de formation en cartographie SIG pour une administration partenaire',
 'GIS mapping training session for a partner administration',
 'Un module d''initiation aux systèmes d''information géographique a été dispensé à une équipe technique, dans une logique de transfert de compétences et d''autonomie durable.',
 'An introductory module on geographic information systems was delivered to a technical team, as part of our commitment to skills transfer and lasting autonomy.',
 1),

('convention-bureau-etudes-partenaire', 'partenariat', '2026-06-22',
 'Signature d''une convention avec un bureau d''études partenaire',
 'Agreement signed with a partner consulting firm',
 'Cette collaboration élargit notre capacité d''intervention sur les études foncières et immobilières, au bénéfice des administrations et collectivités territoriales.',
 'This collaboration extends our capacity on land and real-estate studies, for the benefit of public administrations and local authorities.',
 1),

('atelier-regional-geomatique-environnement', 'evenement', '2026-07-30',
 'Participation à un atelier régional sur la géomatique et l''environnement',
 'Participation in a regional workshop on geomatics and the environment',
 'CIGATE a pris part aux échanges régionaux sur l''usage de la donnée spatiale pour l''aménagement du territoire et le suivi environnemental.',
 'CIGATE took part in regional discussions on the use of spatial data for territorial planning and environmental monitoring.',
 1);
