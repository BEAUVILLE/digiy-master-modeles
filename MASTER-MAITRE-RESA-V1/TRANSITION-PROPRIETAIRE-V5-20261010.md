# RÉSA UNIVERSEL — MASTER propriétaire, transition V5 gardée

**10 octobre 2026 — préparation, AUCUNE ACTIVATION PRODUCTION.**

## État et objectif

La PR [RÉSA #29](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/29) a fusionné les fonctions de test V5 dans **`sql/candidates/` uniquement** : le CORE n'a **pas** de `digiy_resa_universal_owner_manage_v2` utilisable par les navigateurs. Les profils RÉSA universels actifs et leurs créneaux étaient toujours à zéro au dernier audit. Sept demandes anciennes restent dans la base.

Le MASTER `gestion.html` continue d'utiliser un `UPDATE` direct pour les réservations historiques. Le remplacer globalement casserait les anciens consommateurs et la sauvegarde des notes privées.

## Contrat de bascule proposé dans `gestion.html`

- `RESA_V5_STAGING_ENABLED=false` : **verrouillé par défaut**, défini uniquement dans le code. Aucun `?test`, localStorage ou URL ne l'active.
- Lorsque `false` : le SELECT propriétaire historique reste inchangé. Il ne référence **pas** `client_request_id` (colonne absente du CORE actuel). Les actions historiques restent inchangées.
- En **staging explicitement configuré**, après migrations et tests A/B : le SELECT inclut `client_request_id`, permettant de distinguer les nouvelles demandes V0 (`client_request_id` UUID) des anciennes (`NULL`).
- Pour les seules nouvelles réservations : appel obligatoire à `digiy_resa_universal_owner_manage_v2` avec statut OU note, jamais les deux. Les statuts interdits sont filtrés. Une note non enregistrée doit être sauvegardée avant décision.
- Si RPC indisponible/refusée, si retour incorrect ou si session B non autorisée : **aucune mise à jour locale et surtout aucun repli vers le direct UPDATE**.
- Les anciennes réservations restent accessibles par le chemin existant tant qu'une RPC de compatibilité/migration historique n'est pas validée. **Ne pas retirer le droit `UPDATE` en production à ce stade.**
- La réponse serveur est nécessaire avant de changer l'affichage de l'état. `confirmed` ne constate aucun paiement. `done` ne constitue pas une preuve indépendante DIGIY TRUST.
- Les noms et notes sont déjà affichés comme texte inerte grâce à la PR MASTER #19 ; cette protection est conservée.

## Portes de recette avant activation de ce mode

1. Relever et revoir les permissions, triggers et anciens consommateurs de `digiy_resa_bookings` (dont ancien `reserver.html`).
2. Déployer **d'abord** le schéma, les RPC serveur et les protections PAY en staging isolé avec un rollback non destructif ; la candidate actuelle refuse toute autre base que la DB PostgreSQL jetable de tests.
3. Réaliser un **vrai test navigateur propriétaire A puis B**, avec deux sessions distinctes : lecture, refus d'accès croisé, note privée, confirmation, annulation, capacité libérée, PAY neutre, erreurs réseau et téléphone.
4. Vérifier qu'aucune nouvelle réservation V0 ne peut emprunter l'ancien `UPDATE` dans le déploiement ciblé. Il faut un contrôle serveur des droits, pas seulement une condition JS.
5. Restaurer une sauvegarde validée, prouver le retour arrière et conserver les 7 réservations historiques ; fermer l'incident de sauvegarde `BEAUVILLE/admin-digiy#9` uniquement après preuve.
6. Faire approuver la fiche/BAT d'un professionnel réel et obtenir le GO de production explicite.

## Limite honnête

Les tests du présent MASTER utilisent un transport **simulé côté navigateur**, pas deux véritables comptes en staging. Ils vérifient le branchement et l'absence de repli dangereux ; les tests PostgreSQL V5 A/B des candidats isolés restent dans `BEAUVILLE/digiy-resa-table-resto`. Cette PR **ne rend pas RÉSA UNIVERSEL opérationnel** et ne modifie aucune réservation.

**Doctrine : 0 % commission ; rendez-vous n'est pas encaissement ; relation directe ; aucune donnée fictive sur DIGIY CORE ; RESTO/LOC/DRIVER gardent leur moteur spécialisé.**
