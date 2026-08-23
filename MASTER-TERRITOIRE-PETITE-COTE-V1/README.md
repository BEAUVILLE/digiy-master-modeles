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
- `SN-PETITE-COTE-MBOUR` — Mbour

Le `slug` reste humain et peut servir d'adaptateur vers les identifiants de production existants. Le MASTER ne force donc pas une migration immédiate des UUID ou clés déjà utilisées en production.

Les zones sont des repères terrain. Elles n'imposent aucune capacité métier.

## Héritage

Les besoins, langues communes et capacités ne sont pas recopiés ici. Ils sont hérités du CORE et du MASTER PAYS Sénégal.

## Contrat professionnel

Le fichier `config/professional-contract.json` définit le contrat minimal de raccordement d'une présence professionnelle au moteur territoire.

Chaîne minimale :

`country_id → territory_id → zone_id → need_id → professional_id → public_url`

Le moteur affiche ensuite la présence avec l'action générique **OUVRIR**.

Les UUID et identifiants historiques de production peuvent rester en place via `source_zone_id` ou `source_zone_slug`. Le `zone_id` canonique sert d'identifiant commun au CORE.

## Données professionnelles

Aucun professionnel réel ne doit être stocké dans ce MASTER.

La production reste source de vérité. Le MASTER décrit uniquement la forme de raccordement attendue.

Le niveau commercial d'un professionnel — carte, présence, site ou capacités activées — ne modifie pas l'arbre territorial public.

## Discipline

1. Ne jamais copier `territoire.html` pour créer un nouveau territoire.
2. Modifier les données ou la configuration avant de toucher au moteur.
3. Ne publier comme actives que les zones validées terrain.
4. Utiliser les `zone_id` canoniques pour le CORE ; adapter la production existante sans migration brutale.
5. Ne jamais exposer le niveau commercial du professionnel dans l'arbre territorial.
6. L'action générique reste **OUVRIR**.
7. Toute règle universelle remonte au CORE ; toute règle pays remonte au MASTER PAYS Sénégal.

---

**DIGIYLYFE PETITE CÔTE — Le territoire rapproche. Le professionnel garde la relation.**
