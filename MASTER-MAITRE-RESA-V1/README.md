# MASTER MAÎTRE RESA — V1 OWNER

## Doctrine cible — réservation automatique universelle · 09/10/2026

**Le moteur commun de RÉSA doit pouvoir réserver automatiquement pour les professions à rendez-vous compatibles**, en partant des disponibilités réellement ouvertes par le professionnel. Le contrôle serveur doit être atomique : identifier le bon professionnel, vérifier disponibilité/capacité/conflits, enregistrer la réservation ou la demande, retourner un état exact, et gérer annulations/libération. La confirmation peut être automatique uniquement lorsque les conditions métier et le mode choisi par le professionnel le permettent ; sinon elle reste humaine.

**Exclusions du moteur générique** : RESTO (tables, services, capacités), LOC (nuitées/séjours), DRIVER (trajets et disponibilité chauffeur). **Autres cas particuliers : à découvrir et qualifier sur le terrain**, sans inventer une liste définitive. Chaque moteur spécialisé conserve ses règles. DIGIYLYFE : 0 % commission, pas de caisse, paiement et relation directs.

**État réel :** les pages génériques `planning.html` et `gestion.html` constituent déjà un socle de calendrier et de gestion. Elles ne constituent **pas encore** un moteur universel de réservation atomique. Il faut une RPC dédiée, des tests anti-double-réservation/RLS et un BAT de bout en bout avant activation. Voir [REGLE-PLANNING-V2.md](./REGLE-PLANNING-V2.md) et [capabilities-resa-multi.json](./capabilities-resa-multi.json).

## DIGIY TRUST — évaluations héritées de LOC (préparé, non activé)

**La fiche RÉSA doit apporter deux bénéfices : obtenir des rendez-vous et valoriser la qualité réelle des prestations.** Nous réutilisons le **contrat d'éligibilité DIGIY TRUST de LOC**, pas son ancien formulaire libre.

Après prestation effectivement réalisée et vérifiée côté serveur, le client authentifié peut donner **des étoiles rapides, sans commentaire**, en une seule évaluation par prestation. Moyenne des critères métier visible sur la fiche ; **rapport qualité-prix affiché séparément**, non mélangé à la moyenne générale, avec détail par clic.

Pour les avocats, experts-comptables, architectes et autres professionnels : aucun motif de dossier ni donnée sensible dans les notes publiques. Une simple réservation confirmée **ne vaut pas** prestation réalisée ni avis vérifié.

Le contrat opérationnel, les critères, le widget réutilisable, l'aperçu vide honnête et les tests sont dans :

- [CONTRAT-DIGIY-TRUST-RESA-V1.md](./CONTRAT-DIGIY-TRUST-RESA-V1.md)
- [trust/resa-trust-contract-v1.json](./trust/resa-trust-contract-v1.json)
- [trust/resa-trust-public-widget.mjs](./trust/resa-trust-public-widget.mjs)
- [trust/resa-trust-empty-preview.html](./trust/resa-trust-empty-preview.html)

**IMPORTANT : aucun avis RÉSA vérifié n'est encore publié par ce portage.** L'intégration serveur, l'attestation indépendante, l'invitation à usage unique et l'agrégat public doivent passer tests/RLS et BAT avant toute activation. Les données privées LOC et le CORE restent inchangés.

## Statut

**MASTER MAÎTRE RESA — V1 PROPRIÉTAIRE**

RESA est une capacité métier transversale : restaurant, beauté, bien-être, prestation, rendez-vous, service professionnel ou autre activité qui fonctionne par créneaux.

Le Master ne crée pas une nouvelle porte commerciale.

Rail canonique :

**TARIF ADHÉRENT → activation DIGIY PRO → capacité RESA → propriétaire authentifié → espace privé → présence publique autorisée.**

## Page propriétaire — `gestion.html`

V1 reste volontairement légère :

- connexion par email via Supabase Auth ;
- `signInWithOtp` avec `shouldCreateUser:false` ;
- code OTP ou magic link selon le template Auth ;
- le propriétaire ne voit que sa fiche RESA ;
- ouverture / fermeture de créneaux ;
- capacité facultative par créneau ;
- note privée facultative ;
- lecture des demandes de réservation ;
- confirmation ;
- refus ;
- statut terminé / absent ;
- note privée sur la demande ;
- contact direct SMS / WhatsApp.

La règle UX est volontaire :

**pas de gros tableau de bord si le besoin se résout avec une page simple.**

## Ce que le propriétaire ne modifie pas ici

- identité validée ;
- slug ;
- rattachement d’abonnement ;
- statut adhérent ;
- structure et marque DIGIYLYFE ;
- données administratives ;
- catalogue de services dans cette V1.

DIGIY garde le cadre. Le professionnel pilote ses créneaux et ses demandes.

## Backend

Projet Supabase DIGIY CORE.

Tables existantes réutilisées :

- `digiy_resa_profiles` ;
- `digiy_resa_bookings` ;
- `digiy_resa_services` reste inchangée pour cette V1.

Couche propriétaire ajoutée :

- `digiy_resa_profiles.auth_user_id` : liaison technique vers `auth.users.id` ;
- `digiy_resa_slots` : créneaux propres au professionnel.

L’ancien `owner_id` de RESA reste intact : il conserve sa fonction commerciale de rattachement à `digiy_subscriptions`.

## Sécurité

- RLS active ;
- le navigateur utilise uniquement la clé publishable ;
- aucun `service_role` dans le frontend ;
- le propriétaire lit uniquement son profil via `auth_user_id = auth.uid()` ;
- les demandes sont filtrées par le slug rattaché à ce profil ;
- les créneaux sont filtrés par le même rattachement ;
- aucune écriture publique anonyme sur la couche propriétaire.

## Déclinaison

1. copier ce MASTER ;
2. remplacer `[RESA_SLUG]` et `[NOM PROFESSIONNEL]` ;
3. créer ou vérifier l’utilisateur dans Supabase Auth ;
4. créer / vérifier la ligne `digiy_resa_profiles` ;
5. renseigner `digiy_resa_profiles.auth_user_id = auth.uid()` du propriétaire ;
6. vérifier `is_active=true` ;
7. autoriser l’URL `gestion.html` dans les Redirect URLs Supabase Auth ;
8. tester code OTP / magic link ;
9. vérifier qu’un propriétaire ne peut lire ni modifier le RESA d’un autre ;
10. tester mobile.

## Doctrine réservation

**Demande préparée ≠ réservation confirmée.**

Le professionnel confirme lui-même :

- disponibilité ;
- créneau ;
- conditions ;
- montant final.

Contact direct. Paiement direct lorsque applicable. 0 % commission DIGIYLYFE.

---

**DIGIYLYFE · MASTER MAÎTRE RESA V1 OWNER · 19/09/2026**

## Spécialisation RESTO — ne pas confondre les deux MAÎTRES

La capacité RÉSA V1 de ce dossier reste **transversale** pour les rendez-vous et demandes. Elle ne remplace ni les règles de tables/zones/services/no-show du moteur spécialisé `BEAUVILLE/digiy-resto` ni la préparation des plats.

Pour un restaurant, les nouveautés validées V31–V35 sont documentées et portées dans [MASTER-MAITRE-RESTO-V2-SITE/CONTRAT-RESTO-V31-V35.md](../MASTER-MAITRE-RESTO-V2-SITE/CONTRAT-RESTO-V31-V35.md) ; les deux éditeurs locaux sont dans son [ATELIER-V35](../MASTER-MAITRE-RESTO-V2-SITE/ATELIER-V35/index.html). **Aucune migration ou RPC serveur n'est implicite**. Le propriétaire réel doit être vérifié dans sa propre instance.


## Héritage RÉSA MULTI · 09/10/2026

Le moteur propriétaire RÉSA V1 reste un **socle transversal** : il ne remplace pas les expériences spécialisées des restaurateurs, chauffeurs ou salons BEAUTY.

Les acquis des **16 PR fusionnées** du portail `BEAUVILLE/digiy-resa-table-resto` sont désormais transmis par deux références :

- [CONTRAT-RESA-MULTI-20261009.md](./CONTRAT-RESA-MULTI-20261009.md) — règles par métier, identifiants Auth, vérifications RPC/RLS, confirmation humaine, statut de publication et séparation RESTO / LOC / BEAUTY / DRIVER.
- [capabilities-resa-multi.json](./capabilities-resa-multi.json) — registre des capacités avec `source_code_merged`, `production_e2e_verified`, exigences avant activation et preuve PR.

**Statut : portage documentaire uniquement, aucune fonctionnalité activée depuis ce dépôt.**

Particularités importantes : `digiy_resa_profiles.auth_user_id` rattache techniquement le propriétaire Auth, alors que l'ancien `owner_id` conserve un rôle commercial historique ; ne jamais les confondre. La vitrine compte actuellement 3 entrées DRIVER `REAL` et 7 `DEMO` selon le code vérifié, avec un libellé « 6 exemples » restant à corriger.

Aucune URL TEST SALY, clé privée ou configuration de membre réel n'est transférée au MASTER. Un prochain adhérent requiert l'audit serveur, les tests propriétaires A/B, les tests métier et la validation humaine avant publication.

## RÈGLE MAÎTRE · PLANNING DE RENDEZ-VOUS V2 (09/10/2026)

Le calendrier de recherche sur **sept jours** est désormais une capacité transverse du MASTER RÉSA, applicable aux activités sur rendez-vous sans substituer leurs moteurs spécialisés :

- [planning.html](./planning.html) — modèle public des disponibilités **réellement ouvertes**, choix jour/heure, demande directe WhatsApp si le professionnel a publié son numéro ; ne crée jamais une réservation automatique.
- [gestion.html](./gestion.html) — vue propriétaire sur sept jours, nourrie des vrais créneaux existants et conservant leur formulaire de gestion.
- [REGLE-PLANNING-V2.md](./REGLE-PLANNING-V2.md) — doctrine MAÎTRE, différences BEAUTY / RESTO / LOC / DRIVER, contrôle SQL/RLS, dépendances, BAT et refus des créneaux inventés.

**Attention :** le MASTER ne crée aucun profil ni adhésion automatiquement. Au 9 octobre 2026, la RPC publique `digiy_resa_public_week_v1` est installée et ses droits `anon` contrôlés dans `digiy-core`. L'ouverture groupée des semaines du MASTER utilise les insertions PostgREST existantes, protégées par les politiques RLS propriétaires et l'unicité SQL sur `(slug, slot_date, start_time)`. Aucune donnée professionnelle n'est créée par la fusion du MASTER.

### Kit de pose rapide RÉSA — sans nouveaux développements

Le MASTER comprend deux fichiers HTML autonomes (après configuration) :

- `gestion.html` — accès propriétaire, calendrier sept jours, ouverture groupée des jours et heures **librement choisis**, modification/fermeture des créneaux et traitement des demandes ;
- `planning.html` — affichage public de sept jours, heures issues du SQL réel, demande WhatsApp directe si numéro publié. Le choix d'un horaire **ne crée pas automatiquement** de demande ou réservation dans le moteur générique.

Pour installer une instance, recopier ces deux fichiers dans le dossier destiné à **ce professionnel** et renseigner uniquement les paramètres suivants, sans laisser aucun crochet :

| Repère dans les fichiers | Valeur à renseigner |
|---|---|
| `[RESA_SLUG]` (gestion seulement) | Slug réel de la fiche RÉSA autorisée |
| `[NOM PROFESSIONNEL]` (gestion seulement) | Nom du professionnel |
| `[SUPABASE_URL]` (les deux fichiers) | URL du projet Supabase en HTTPS |
| `[SUPABASE_PUBLISHABLE_KEY]` (les deux fichiers) | Clé **publique** Supabase, jamais `service_role` |
| `[PUBLIC_RESA_MULTI_URL]` (planning seulement) | Lien public vérifié vers le portail RÉSA |

**Verrou d'activation préalable** : contrôler le dossier adhérent et `digiy_resa_profiles` (`is_active`, `is_published`, `auth_user_id` du vrai propriétaire, coordonnées publiables), autoriser l'URL exacte du magic-link dans les Redirect URLs, puis vérifier les policies RLS sur profils/créneaux/réservations. Le MASTER générique n'avait pas encore de profil réel dans `digiy-core` au contrôle du 9 octobre : il faut donc créer et autoriser la première fiche professionnelle avant toute démonstration de réservation réelle.

**BAT terrain minimal** : connexion du propriétaire, choix libre d'un lundi/jours/heures/durée, enregistrement groupé, fermeture d'un créneau, rechargement de la semaine publique, vérification des heures bloquées et du contact direct sur téléphone. Ne pas valider une véritable réservation sans contrôle de la RPC de réservation métier et des droits croisés propriétaire A/B.

**Limite d'architecture** : la détection des chevauchements à l'ouverture groupée utilise la liste chargée dans l'interface ; elle n'est pas une transaction SQL de verrouillage entre deux sessions simultanées. L'unicité SQL protège seulement les horaires de début identiques. En cas de besoin métier de réservations atomiques, ajouter et tester une RPC transactionnelle spécifique **avant l'activation client**. Une fiche RÉSA générique n'est pas une caisse.
