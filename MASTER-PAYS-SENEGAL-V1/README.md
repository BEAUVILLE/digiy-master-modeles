# 🇸🇳 DIGIYLYFE — MASTER PAYS SÉNÉGAL V1

**Statut : PREMIER PAYS DE RÉFÉRENCE — V1**

Ce dossier est la première configuration pays officielle construite sous le **MASTER CORE WORLD**.

Il ne contient pas un nouveau moteur. Il configure le moteur commun pour le Sénégal.

## Référence supérieure

**CORE MONDIAL → PAYS → TERRITOIRE → ZONE → BESOIN → PROFESSIONNEL → OUVRIR**

Doctrine : `BEAUVILLE/digiy-master/MASTER-PAYS.md`

Socle technique : `../MASTER-CORE-WORLD-V1/`

## Configuration Sénégal

- `country_id` : `SN`
- Pays : Sénégal
- Monnaie : XOF / FCFA
- Préfixe téléphone : `+221`
- Fuseau principal : `Africa/Dakar`
- Langue principale : français
- Langues interface actuelles : FR · EN · ES · PT · IT · DE · NL · AR
- Wolof : ajout progressif
- Pulaar : futur
- Sérère : futur

## Territoires

### Actif

- **Petite Côte**
  - AIBD
  - Ndayane
  - Popenguine
  - Somone
  - Ngaparou
  - Saly
  - Mbour

### Préparés sans activation

- Dakar
- Thiès
- Saint-Louis

Un territoire planifié ne doit pas être présenté comme actif tant que ses données terrain ne sont pas prêtes.

## Règle d'usage

Le visiteur Sénégal doit rester dans une lecture locale claire :

**SÉNÉGAL → TERRITOIRE → ZONE → BESOIN → PROFESSIONNEL → OUVRIR**

Les contenus France ou d'un autre pays ne doivent jamais se mélanger aux résultats Sénégal sauf demande explicite de changement de pays.

## Capacités

Les capacités métier sont héritées du CORE mondial : DRIVER, LOC, RESA, MARKET, BUILD, JOB, EXPLORE, CARNET et futures briques.

Elles ne sont pas recopiées dans ce MASTER PAYS.

## Langues locales

Une langue locale est ajoutée seulement lorsque son niveau de traduction est suffisamment contrôlé pour le terrain.

Le Wolof est déclaré **progressif** : l'architecture peut l'accueillir immédiatement, mais aucune traduction approximative ne doit être présentée comme officielle.

## Discipline

1. Ne jamais copier `territoire.html` pour créer une version Sénégal.
2. Ajouter ou modifier d'abord les données pays / territoires.
3. Toute règle universelle remonte dans le MASTER CORE.
4. Toute règle propre au Sénégal reste isolée dans la configuration Sénégal.
5. Les professionnels réels restent dans la donnée de production, jamais dans le MASTER.
6. Le bouton territorial générique reste **OUVRIR**.
7. Toute activation d'un nouveau territoire doit être validée terrain avant publication.

---

**DIGIYLYFE SÉNÉGAL — Le pays organise. Le territoire rapproche. Le professionnel garde la relation.**
