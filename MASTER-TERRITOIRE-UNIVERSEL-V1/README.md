# 🌍 DIGIYLYFE — MASTER TERRITOIRE UNIVERSEL V1

**Statut : VALIDÉ — MOULE TERRITOIRE UNIVERSEL**

Ce dossier formalise le moule commun extrait des validations terrain et visuelles de :

- Dakar — urbain Sénégal ;
- Bordeaux — urbain France ;
- Sarlat / Vallée de la Dordogne — saisonnier France ;
- Saly / Petite Côte — saisonnier Sénégal.

Il ne contient **aucun client réel, aucun professionnel réel, aucun quartier local imposé et aucune palette locale obligatoire**.

Il ne remplace pas le CORE mondial ni les MASTER PAYS. Il définit la couche universelle qui permet de créer un nouveau territoire sans recopier un territoire existant.

## 1. Arbre universel

**CORE MONDIAL → PAYS → TERRITOIRE → ZONE → BESOIN → PROFESSIONNEL RÉEL → VITRINE → CONTACT DIRECT**

Pour le prospect professionnel :

**TERRITOIRE → PLACE À PRENDRE → DÉMO NEUTRE → ADHÉSION → VALIDATION HUMAINE → VRAIE PRÉSENCE**

## 2. Formule canonique

**MODULE = PORTE**  
**SUPABASE = AIGUILLEUR / SOURCE DE VÉRITÉ**  
**PROFESSIONNEL = SA PROPRE VITRINE**  
**EXEMPLE = PROJECTION TEMPORAIRE**  
**LA VOIX = RECHERCHE TRANSVERSALE**

### Loi maître

**LE VIDE NE S’AFFICHE PAS. IL SE PROJETTE.**

## 3. Ce que le territoire configure

Un nouveau territoire configure seulement :

- `country_id` ;
- `territory_id` et `slug` ;
- type de territoire : urbain, saisonnier ou autre type validé ;
- zones actives / pilotes / planifiées ;
- porte publique locale éventuelle ;
- ordre local des portes ;
- exemples de projection ;
- route de démo ;
- route d’adhésion ;
- identité visuelle locale ;
- textes locaux ;
- langues héritées / activées ;
- paramètres commerciaux autorisés par le MASTER PAYS.

Le territoire **ne recrée pas** les besoins du CORE, le moteur Supabase, les règles de vérité, les états d’adhésion ou les contrats professionnels.

## 4. Priorité au réel

Les résultats de production passent toujours avant les projections.

Lecture cible :

`EXEMPLES → 1 VRAI + EXEMPLES → PLUS DE VRAIS → EXEMPLES SECONDAIRES → TERRITOIRE RÉEL`.

Un exemple :

- n’est jamais compté comme professionnel ;
- ne reçoit jamais un faux téléphone, faux avis, faux propriétaire ou fausse disponibilité ;
- reste marqué `EXEMPLE` / `PAS ENCORE UN ADHÉRENT` ;
- ouvre une démo avant l’adhésion lorsque la démo existe.

## 5. ANNONCES = porte chaude

Quand la capacité `announcements` est active, elle ne doit pas être enterrée sous le pli.

Règle universelle :

**ANNONCES / BESOINS DU MOMENT doit disposer d’un accès chaud visible près du haut de la surface territoriale.**

Selon la surface, cela peut être :

- premier bouton de besoin ;
- CTA dans le HERO ;
- bloc chaud immédiatement sous le HERO ;
- combinaison de ces mécanismes.

Une URL qui contient déjà `need=<besoin>` respecte ce filtre et ne force pas ANNONCES à la place du besoin demandé.

## 6. LA VOIX

LA VOIX n’est jamais une profession ni une adhésion métier.

Parcours :

`REQUÊTE VOCALE → INTENTION → TERRITOIRE / ZONE / BESOIN → PROFESSIONNELS RÉELS → OUVRIR`.

Les exemples LA VOIX montrent des requêtes naturelles. Ils ne créent aucune fiche fictive.

## 7. Identité visuelle locale

Principe :

**MÊME MOTEUR · MÊME ADN DIGIYLYFE · EMPREINTE LOCALE DISTINCTE.**

Une identité territoire peut configurer palette, ambiance, matières, iconographie et textes. Elle ne modifie jamais les règles du CORE.

Les couleurs de Dakar, Bordeaux, Sarlat ou Saly sont des références de validation, jamais des thèmes à recopier automatiquement.

## 8. PWA — invariant de non-régression

La vitrine principale `digiylyfe.com` reste une PWA.

Toute évolution de l’index public doit préserver au minimum :

- le lien vers le `manifest` ;
- les icônes d’application ;
- les métadonnées mobile / Apple nécessaires ;
- l’enregistrement du service worker ;
- la cohérence de cache/version ;
- l’installabilité lorsque le navigateur la supporte.

**Une refonte graphique, un nouveau territoire ou une nouvelle projection ne doit jamais casser le PWA de l’index principal.**

Si une façade territoire est elle-même rendue installable, elle doit réutiliser le contrat PWA commun au lieu de créer une mécanique divergente.

La suppression ou la désactivation volontaire d’un élément PWA exige une validation humaine explicite.

## 9. Prix et adhésion

Le prix public est dérivé du MASTER PAYS / runtime pays. Un territoire ne crée pas sa propre grille commerciale parallèle.

La route d’adhésion transmet au minimum :

`country → territory → local → need → lang`.

Aucune présence n’est publiée automatiquement après paiement : la validation humaine DIGIYLYFE reste obligatoire avant mise en ligne.

## 10. Source de vérité et couverture

Les professionnels réels viennent de la production. Le MASTER n’en stocke aucun.

Le contrat minimal reste :

`country_id → territory_id → base_zone_id → need_id → professional_id → public_url`.

La couverture suit les règles du MASTER TERRITOIRE : zone de base, zones d’intervention, territoires d’intervention validés et déduplication par `professional_id`.

## 11. Discipline de création d’un nouveau territoire

1. Valider le territoire et son type.
2. Valider ses zones avec des sources / connaissance terrain adaptées.
3. Créer sa configuration locale depuis ce MASTER.
4. Construire son identité visuelle propre.
5. Construire ses exemples depuis zéro dans le contexte local.
6. Brancher les vrais professionnels via la production.
7. Brancher démos et adhésion sans cul-de-sac.
8. Vérifier mobile, 8 langues lorsqu’elles sont activées, PWA, service worker et cache.
9. Déployer.
10. Faire la validation humaine et visuelle.
11. Remonter dans le MASTER uniquement les règles réellement universelles découvertes sur le terrain.

## 12. Interdictions

- ne pas copier une ville pour en fabriquer une autre ;
- ne pas stocker de client réel dans le MASTER ;
- ne pas fabriquer une communauté fictive ;
- ne pas créer une fiche professionnelle LA VOIX ;
- ne pas cacher les vrais professionnels derrière les exemples ;
- ne pas hardcoder un prix territoire qui contredit le MASTER PAYS ;
- ne pas modifier le CORE pour une préférence purement locale ;
- ne pas propager une innovation locale partout sans validation humaine ;
- ne pas casser ou retirer le PWA de `digiylyfe.com` lors d’une refonte territoriale ou de l’index.

---

**DIGIYLYFE — Un moteur commun. Une empreinte par territoire. Une vitrine par professionnel.**
