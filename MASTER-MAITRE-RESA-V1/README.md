# MASTER MAÎTRE RESA — V1 OWNER

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
