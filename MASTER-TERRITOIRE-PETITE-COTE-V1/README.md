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

- AIBD
- Ndayane
- Popenguine
- Somone
- Ngaparou
- Saly
- Mbour

Les zones sont des repères terrain. Elles n'imposent aucune capacité métier.

## Héritage

Les besoins, langues communes et capacités ne sont pas recopiés ici. Ils sont hérités du CORE et du MASTER PAYS Sénégal.

## Données professionnelles

Aucun professionnel réel ne doit être stocké dans ce MASTER.

La production doit rattacher chaque présence à `country_id`, `territory_id`, `zone_id`, `need_id` et `professional_id` selon le niveau nécessaire.

## Discipline

1. Ne jamais copier `territoire.html` pour créer un nouveau territoire.
2. Modifier les données ou la configuration avant de toucher au moteur.
3. Ne publier comme actives que les zones validées terrain.
4. Ne jamais exposer le niveau commercial du professionnel dans l'arbre territorial.
5. L'action générique reste **OUVRIR**.
6. Toute règle universelle remonte au CORE ; toute règle pays remonte au MASTER PAYS Sénégal.

---

**DIGIYLYFE PETITE CÔTE — Le territoire rapproche. Le professionnel garde la relation.**
