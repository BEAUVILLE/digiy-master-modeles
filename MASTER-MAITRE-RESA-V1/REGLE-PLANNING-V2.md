# RÉSA MULTI — RÈGLE MAÎTRE DU PLANNING V2
**9 octobre 2026 · Règle transversale des activités sur rendez-vous · Référence générique**

## Une expérience comparable à LOC, mais fondée sur l'heure

**Besoin → fiche du professionnel → prestation → 7 jours → créneau effectivement ouvert → contact direct → confirmation humaine.**

Tous les métiers qui fonctionnent par rendez-vous doivent hériter de cette capacité **lorsque leur planning est opérationnel** : beauté, coiffure, soins, bien-être, métiers et services professionnels, consultations, réparations, prestations ponctuelles. Le professionnel choisit ses jours, horaires, durées, restrictions et périodes de fermeture. Le client ne voit jamais de disponibilités générées à partir d'horaires fictifs.

### Frontières métier

- **RÉSA MULTI générique** : planning sur 7 jours, uniquement les créneaux réellement ouverts du propriétaire actif ET publié, exclusion des rendez-vous en attente/confirmés et des chevauchements, sélection, contact direct. **Sélectionner ≠ réserver ≠ confirmer.**
- **BEAUTY** : horaires par prestations, consultation de 7 jours, demande RPC V1 validée côté serveur (prix du catalogue, créneaux non réservés), décision du propriétaire ; ouverture facultative de la semaine au moyen d'une RPC propriétaire. **Aucune ouverture automatique.**
- **RESTO** : réservation de tables, services, zones/capacité, no-show et modes réservables dans son moteur spécialisé ; ne PAS le remplacer par le planning universel.
- **LOC** : nuits/séjours, calendriers et paiements directs selon son moteur spécialisé.
- **DRIVER/transfert** : disponibilité liée au déplacement/destination et à la confirmation du chauffeur ; ne pas présenter un horaire de départ fictif comme un rendez-vous confirmé.
- Autres professions : transposer seulement après validation du modèle métier et des capacités de réservation réellement utilisées.

## Modèles portés dans ce MASTER

- `planning.html` : **modèle universel public** avec sept colonnes/jours responsives, créneaux ouverts et indisponibles, sélection d'une date/heure, demande WhatsApp directe lorsqu'un numéro professionnel publié existe ; aucune collecte de coordonnées du client ni enregistrement de réservation par cette page.
- `gestion.html` : **vue propriétaire privée sur les sept jours à venir**, alimentée exclusivement par `digiy_resa_slots`, avec retour au formulaire d'ouverture/fermeture des créneaux. Aucun compte client simulé, aucun écrasement de réservation.
- Les SQL métiers de référence sont maintenus dans `BEAUVILLE/digiy-resa-table-resto` :
  - `sql/20261009_resa_public_week_v1.sql` : RPC de lecture du planning **avec condition propriétaire publié/actif**, exclusivité des réservations existantes, sans données clients.
  - `sql/20261009_beauty_owner_open_week_v1.sql` : ouverture facultative des jours/heures choisis, vérification `auth.uid()` et `owner_id`, insertion idempotente qui conserve les créneaux déjà bloqués/réservés.

**Avant utilisation du modèle public**, remplacer exactement `[SUPABASE_URL]`, `[SUPABASE_PUBLISHABLE_KEY]` et `[PUBLIC_RESA_MULTI_URL]` avec des valeurs publiques adaptées au déploiement ; ne jamais mettre de clé `service_role` dans le navigateur. Il faut ensuite vérifier l'autorisation REST API des RPC, les politiques/RLS et le routage du slug personnel.

## Interdictions

1. Aucun créneau généré par hypothèse (« restaurant ouvert donc libre à 19h » est faux).
2. Aucun faux professionnel / donnée TEST montrés comme réels.
3. Aucune caisse, aucun encaissement ni commission prélevés par DIGIYLYFE.
4. Aucune demande enregistrée sans RPC métier atomique et autorisation côté serveur.
5. Aucun clonage du slug TEST BEAUTY SALY.
6. Aucun accès propriétaire fondé uniquement sur un slug ou l'affichage d'un bouton.

## Critères de sortie métier et sécurité

1. SQL réellement présent dans `digiy-core`, permissions `anon`/Auth contrôlées, RLS/RPC et isolation A/B éprouvées.
2. Tests dans PostgreSQL éphémère : professionnel non publié invisible, créneau fermé/occupé indisponible, chevauchements, ouverture propriétaire refusée aux tiers, aucun client exposé.
3. Test mobile et ordinateur sur **une vraie fiche activée** avec un vrai propriétaire, sans transformer le test en rendez-vous client.
4. BAT visuel et humain avant fusion/réplication ; accès à la réservation réellement confirmé côté métier.

**Au 9 octobre 2026 : la première livraison porte la référence et le code du planning. Le nombre de profils génériques RÉSA actifs est zéro et TEST BEAUTY n'avait plus aucun créneau futur ; ces conditions restent des absences réelles à corriger par le propriétaire, pas par des données fictives.**
