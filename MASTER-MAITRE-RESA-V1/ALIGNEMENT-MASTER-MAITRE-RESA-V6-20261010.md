# RÉSA UNIVERSEL — alignement MASTER / MAÎTRE / SOURCE V6 et lancement pilote

**10 octobre 2026 — statut : préparation du pilote autorisée ; production NO-GO.**

## Preuve de convergence

La référence source [BEAUVILLE/digiy-resa-table-resto](https://github.com/BEAUVILLE/digiy-resa-table-resto) est au commit `38770f95232be480735790651f4ef3178faac4e6` (PR #30 fusionnée). Les workflows RÉSA V6 et RÉSA/BEAUTY et la publication GitHub Pages ont réussi sur `main`.

Le **MASTER/MAÎTRE** `BEAUVILLE/digiy-master-modeles/MASTER-MAITRE-RESA-V1/` est au minimum à la PR #20 fusionnée (transition propriétaire V5, protégée, puis tests `main` verts). Son registre `capabilities-resa-multi.json` n'avait conservé que les PR #1–16 : cela ne représentait plus les preuves V0–V6 du moteur. La présente révision référence explicitement les PR #1–30 et leurs capacités isolées, tout en préservant les anciennes dates de l'inventaire DRIVER/DEMO.

**Le MASTER et le MAÎTRE sont remis au même niveau de référence et de contrat d'héritage V6, pas à une parité fonctionnelle des systèmes déployés.** Cette distinction est volontaire : `gestion.html` inclut la transition V5 **OFF par défaut**, tandis que `planning.html` reste un agenda en lecture seule. Le formulaire V4 et les candidates SQL sont dans le dépôt RÉSA source, pas activés sur une vraie fiche.

## Niveau par capacité

| Domaine | Source RÉSA | MASTER/MAÎTRE | Production |
|---|---|---|---|
| Contrat de réservation atomique | V0, PR #23, PostgreSQL jetable | Référence héritée | Inactif |
| PAY neutre, statuts propriétaire | V1, PR #25, PG jetable | Conditions de migration documentées | Inactif |
| Prestations et créneaux serveur | V2, PR #26, PG jetable | Planning hérité en lecture seule | Inactif |
| IANA et validation client | V3, PR #27, module/PG isolés | Domaine France non activable | Inactif |
| Flux client `pending` | V4, PR #28, adaptateur staging | Non branché au planning public | Inactif |
| Notes et statuts privés | V5, PR #29, PG isolé | PR MASTER #20 : raccordement préparé, drapeau OFF | Inactif |
| Chaîne client → propriétaire A/B | V6, PR #30, scénario synthétique PG17 | Preuves intégrées au contrat du MAÎTRE | **Pas de vrai E2E Auth** |

Le fait qu'une PR soit fusionnée ne déploie aucune RPC candidate SQL : `digiy-core` n'a toujours pas V0/V2/V5, et aucun profil ni créneau universel actif n'était présent au dernier contrôle. Sept lignes historiques sont préservées, dont **4 explicitement signalées comme tests et 3 non qualifiées**. Ne pas les présenter comme sept clients réels, et ne pas les supprimer sans revue.

## Conditions indispensables à la première fiche pilote Sénégal

1. **Sauvegarde récente restaurée** : archive chiffrée #76 du 9 octobre exportée avec succès, mais aucune preuve de restauration de cette archive au dernier contrôle. La restauration plus ancienne #74 ne la remplace pas. Le test reste local, sur Mac sécurisé et base isolée, sans extraction de secrets.
2. **Environnement Supabase de staging réellement séparé**, sans réactiver arbitrairement un ancien projet inactif ni faire payer un service supplémentaire sans nécessité et accord.
3. **Deux comptes Auth réels A/B en staging**, magic-link, accès privé, tests négatifs de lecture / modification entre professionnels, essais mobile et desktop.
4. **Anciennes fonctions RPC, RLS et PAY** inventoriés jusqu'aux consommateurs publics ; appliquer une migration de droits non destructive et garantir que nouvelles demandes ne peuvent pas suivre l'ancien `UPDATE`.
5. **Premier professionnel réel à Saly**, fiche/BAT autorisés, service, prix, calendrier et horaires réellement décidés ; aucune donnée de démonstration publiée comme réelle.
6. **Circuit public testable et réellement branché**, depuis la fiche vers créneau, saisie demande, état `pending`, validation propriétaire, suivi, annulation ; rapport qualité-prix DIGIY TRUST demeure distinct, non activé automatiquement.
7. **GO de production distinct**, après réussite des points précédents, avec fenêtre de retour arrière. France/Paris reste bloqué tant que les intervalles UTC et changements d'heure sont intégrés.

## Décision et garde-fou automatisé

La présente PR ne modifie ni le CORE ni les anciennes réservations : elle synchronise les références, documente les limitations et ajoute un test CI qui **échoue** si le registre affirme un lancement alors que le `RESA_V5_STAGING_ENABLED` est resté OFF ou que le planning public est encore seulement en lecture.

**GO : alignement documentaire, CI, préparation du staging et du BAT. NO-GO : SQL réel, désactivation des anciens droits, prise de rendez-vous public, PAY automatique, activation France.** Cette frontière protège les professionnels et la confiance DIGIYLYFE.
