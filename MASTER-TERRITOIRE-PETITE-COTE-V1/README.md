# 🇸🇳 DIGIYLYFE — MASTER TERRITOIRE PETITE CÔTE V1

**Statut : TERRITOIRE ACTIF DE RÉFÉRENCE — V1**

Ce dossier est la première configuration territoire officielle sous le **MASTER PAYS SÉNÉGAL**.

Il ne contient pas un nouveau moteur. Il configure le moteur commun pour la Petite Côte.

## Références

- CORE mondial : `../MASTER-CORE-WORLD-V1/`
- Pays Sénégal : `../MASTER-PAYS-SENEGAL-V1/`
- Doctrine territoire : `BEAUVILLE/digiy-master/MASTER-TERRITOIRE.md`

## Arbre

**SÉNÉGAL → PETITE CÔTE → ZONE → BESOIN → PROFESSIONNEL → OUVRIR**

## Identité territoire

- `country_id` : `SN`
- `territory_id` : `SN-PETITE-COTE`
- Slug : `petite-cote`
- Statut : `active`
- Route publique de référence : `https://digiylyfe.com/territoire.html?zone=petite-cote`

## Zones V1

Les zones utilisent désormais un identifiant canonique stable et mondialement non ambigu :

- `SN-PETITE-COTE-AIBD` — AIBD
- `SN-PETITE-COTE-NDAYANE` — Ndayane
- `SN-PETITE-COTE-POPENGUINE` — Popenguine
- `SN-PETITE-COTE-SOMONE` — Somone
- `SN-PETITE-COTE-NGAPAROU` — Ngaparou
- `SN-PETITE-COTE-SALY` — Saly — zone pilote de référence
- `SN-PETITE-COTE-MBOUR` — Mbour — pilote couverture inter-zones

Le `slug` reste humain et peut servir d'adaptateur vers les identifiants de production existants. Le MASTER ne force donc pas une migration immédiate des UUID ou clés déjà utilisées en production.

Les zones sont des repères terrain. Elles n'imposent aucune capacité métier.

## Zone de base et couverture

Le professionnel garde un ancrage principal distinct de sa zone de travail réelle :

- `base_zone_id` — une seule zone de base ;
- `service_zone_ids` — zéro à plusieurs zones d'intervention supplémentaires ;
- `service_territory_ids` — zéro à plusieurs territoires entiers couverts.

La zone de base est toujours considérée comme desservie, même sans ligne de couverture explicite.

La couverture effective suit donc :

`base_zone_id + service_zone_ids + zones actives des service_territory_ids validés`

Pour une zone cible, l'éligibilité suit :

`zone cible = zone de base OU zone d'intervention OU zone incluse dans un territoire d'intervention validé`

Un professionnel qui apparaît grâce à sa couverture garde toujours sa véritable zone de base et son véritable territoire d'ancrage. Il n'est jamais artificiellement « relogé » dans la zone affichée. Les résultats sont dédupliqués par `professional_id`.

Exemple : un professionnel peut être basé à **Saly** et intervenir à **Mbour** ou **AIBD** sans changer sa zone de base.

Une couverture extérieure ne réattribue jamais automatiquement le professionnel à un autre territoire. Elle reste une couverture explicite, validée séparément. Tant qu'une destination extérieure n'est pas structurée et validée, elle reste en attente et n'étend pas automatiquement les résultats publics.

Règle technique : `config/coverage-policy.json`.

## Héritage

Les besoins, langues communes et capacités ne sont pas recopiés ici. Ils sont hérités du CORE et du MASTER PAYS Sénégal.

## Contrat professionnel

Le fichier `config/professional-contract.json` définit le contrat minimal de raccordement d'une présence professionnelle au moteur territoire.

Chaîne minimale :

`country_id → territory_id → base_zone_id → need_id → professional_id → public_url`

Le moteur affiche ensuite la présence avec l'action générique **OUVRIR**.

Les UUID et identifiants historiques de production peuvent rester en place via l'adaptateur `config/production-adapter.json`. Le champ historique `zone_id` peut être traduit en `base_zone_id` sans migration brutale de la production.

## Validation pilote Saly

Un contrôle **lecture seule** de la production a été effectué sur Saly le 23 août 2026.

Résultat agrégé :

- 9 présences de type `professional` actives et publiques ;
- 9/9 raccordables au contrat ;
- 9/9 avec un `need_id` résolvable ;
- 9/9 avec une `public_url` ;
- 1 présence sans ligne de couverture explicite, correctement couverte par la règle `base_zone_id = couverture minimale` ;
- 6 présences utilisent déjà un marqueur de couverture Petite Côte ;
- 1 référence de couverture extérieure existe et reste en attente de validation territoriale.

Aucune identité professionnelle réelle n'est conservée dans le MASTER. Le rapport agrégé est stocké dans `validation/saly-pilot-readonly-2026-08-23.json`.

## Validation pilote Mbour

Un deuxième contrôle **lecture seule** a été effectué sur Mbour le 23 août 2026 pour tester la couverture inter-zones.

Résultat agrégé :

- 9 professionnels doivent être éligibles dans la zone cible Mbour ;
- 1 est réellement basé à Mbour ;
- 5 déclarent Mbour comme zone d'intervention explicite ;
- 8 disposent d'une couverture Petite Côte entière ;
- 0 besoin non résolu ;
- 0 URL publique manquante ;
- répartition des besoins : 5 artisans, 1 commerce local, 3 transports ;
- les zones de base restent distinctes : AIBD, Dakar, Mbour et Saly ;
- 1 professionnel basé hors Petite Côte peut apparaître grâce à une couverture Petite Côte explicite, sans être réattribué à Mbour.

Ce test valide la règle d'éligibilité d'une zone cible et confirme la nécessité de dédupliquer les résultats par `professional_id`.

Aucune identité professionnelle réelle n'est conservée dans le MASTER. Le rapport agrégé est stocké dans `validation/mbour-pilot-readonly-2026-08-23.json`.

## Données professionnelles

Aucun professionnel réel ne doit être stocké dans ce MASTER.

La production reste source de vérité. Le MASTER décrit uniquement la forme de raccordement attendue.

Le niveau commercial d'un professionnel — carte, présence, site ou capacités activées — ne modifie pas l'arbre territorial public.

## Discipline

1. Ne jamais copier `territoire.html` pour créer un nouveau territoire.
2. Modifier les données ou la configuration avant de toucher au moteur.
3. Ne publier comme actives que les zones validées terrain.
4. Utiliser les identifiants canoniques pour le CORE ; adapter la production existante sans migration brutale.
5. Ne jamais confondre zone de base et zones d'intervention.
6. Une zone d'intervention ne modifie jamais automatiquement l'ancrage du professionnel.
7. La zone de base constitue toujours la couverture minimale implicite.
8. Une couverture extérieure non validée n'étend pas automatiquement les résultats publics.
9. Une présence peut être éligible dans une zone cible sans y être basée ; son ancrage réel doit rester visible dans les données.
10. Dédupliquer les résultats par `professional_id`.
11. Ne jamais exposer le niveau commercial du professionnel dans l'arbre territorial.
12. L'action générique reste **OUVRIR**.
13. Toute règle universelle remonte au CORE ; toute règle pays remonte au MASTER PAYS Sénégal.

---

**DIGIYLYFE PETITE CÔTE — Le territoire rapproche. Le professionnel garde la relation.**
