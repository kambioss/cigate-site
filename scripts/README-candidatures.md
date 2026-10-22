# Réponses aux candidatures par mail Infomaniak, avec validation manuelle

Une interface web est également disponible dans `/admin/candidatures`, avec sélection
par lot, personnalisation par nom et confirmation avant envoi. Voir le README du projet.
Choisir une seule interface d'envoi pour une même boîte : l'historique SQLite de ce
script n'est pas partagé avec l'historique D1 du site.

Le script `repondre_candidatures.py` examine les messages **non lus** d'un dossier IMAP
dédié aux candidatures et propose un accusé de réception en français à l'adresse `From`.
**Aucun envoi automatique : chaque candidature doit être sélectionnée et validée
manuellement.**
Les messages restent non lus. Une base SQLite locale conserve les UID traités pour
éviter un second envoi. Les messages de listes et les réponses automatiques sont ignorés.

## Préparation

1. Créer une adresse ou un dossier Infomaniak réservé aux candidatures, par exemple
   `recrutement@…` et `Candidatures`. Configurer dans Infomaniak une règle qui déplace
   **uniquement** les candidatures dans ce dossier. Le script suppose que tous les
   courriels qui s'y trouvent sont des candidatures.
2. Copier `candidatures.env.example` vers un fichier privé `candidatures.env` et
   renseigner l'adresse, son mot de passe mail et le nom exact du dossier IMAP.
   Le fichier privé est ignoré par Git. Un mot de passe de messagerie Infomaniak
   est nécessaire ; le mot de passe du compte Manager ne convient pas.
3. Depuis la racine du dépôt, charger les variables et afficher les propositions :

   ```bash
   set -a
   source scripts/candidatures.env
   set +a
   python3 scripts/repondre_candidatures.py
   ```

4. Vérifier le message proposé, puis sélectionner l'UID d'une candidature :

   ```bash
   python3 scripts/repondre_candidatures.py --approve 123
   ```

   Le script affiche à nouveau le destinataire et le texte. L'envoi n'a lieu que si
   vous tapez `oui` à la demande de confirmation. Recommencer séparément pour
   chaque candidature à laquelle vous souhaitez répondre.

Le port SMTP 587 avec STARTTLS est utilisé par défaut ; `--smtp-port 465` active
SMTP avec TLS implicite. IMAP utilise le port 993 avec TLS. Aucun paquet Python
supplémentaire n'est requis.

Le script affiche au maximum 20 nouveaux messages par exécution (`--limit 20`).
Conserver le fichier SQLite (`scripts/.candidatures.sqlite3`) entre les exécutions.
En cas d'erreur SMTP, l'entrée reste `pending` : vérifier les messages envoyés
dans la boîte avant de décider d'un éventuel renvoi. Le dossier et la base SQLite
constituent la protection contre les doubles réponses ; les sauvegarder.

Le texte de réponse est défini dans `make_reply()` et peut être adapté.
