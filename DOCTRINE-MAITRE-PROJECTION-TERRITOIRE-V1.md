# DIGIYLYFE — DOCTRINE MAÎTRE PROJECTION TERRITOIRE V1

**Statut : VALIDÉE**

Ce fichier traduit en règle opérationnelle la doctrine définie dans `BEAUVILLE/digiy-master/DOCTRINE-PROJECTION-TERRITOIRE-V1.md`.

Il s'applique aux MASTER MAÎTRE métier et aux futurs territoires urbains ou saisonniers.

## 1. Contrat architectural obligatoire

Tout futur moule compatible territoire doit respecter :

**MODULE = PORTE**  
**SUPABASE = AIGUILLEUR / SOURCE DE VÉRITÉ**  
**PROFESSIONNEL = SA PROPRE VITRINE**  
**EXEMPLE = PROJECTION TEMPORAIRE**

Le module ne doit jamais devenir une page unique censée représenter tous les professionnels du métier.

Chaque professionnel réel possède sa propre présence publique et sa propre route ouvrable.

## 2. Mode projection

Un territoire en lancement peut contenir des cartes exemples pour éviter un écran vide et permettre au prospect de se projeter.

### Loi maître

**LE VIDE NE S’AFFICHE PAS. IL SE PROJETTE.**

Une catégorie sans professionnel réel ne doit pas donner l'impression d'un territoire abandonné. Elle peut montrer une projection commerciale neutre, clairement identifiée, qui explique la place disponible sans fabriquer un faux adhérent.

Chaque exemple doit :

- être clairement marqué `EXEMPLE` / `PAS ENCORE UN ADHÉRENT` ;
- être exclu du comptage des professionnels réels ;
- ne contenir aucune identité réelle inventée ;
- ne pas fabriquer de téléphone, d'avis, de stock, de réservation, de disponibilité ou de rareté ;
- ouvrir une vraie démo de projection avant l'adhésion lorsqu'une démo existe ;
- rester secondaire face à un professionnel réel.

## 3. Démo maître

Le MASTER MAÎTRE doit pouvoir produire une démo neutre et paramétrable de sa famille métier.

Structure cible :

`carte exemple → démo neutre → CTA projection → adhésion`

Il est préférable de mutualiser la mécanique de démo et de varier les données de configuration plutôt que de dupliquer intégralement le même code pour chaque exemple.

Pour un lancement de territoire, la référence commerciale validée est :

**3 configurations exemple par module / besoin**, lorsque cela aide réellement à la compréhension du métier.

## 4. Passage au réel

Les vrais professionnels viennent de la donnée de production.

Ils doivent toujours être identifiables séparément des exemples et prendre priorité dans l'interface.

La présence réelle doit rester reliée à :

`country_id → territory_id → base_zone_id → need_id → professional_id → public_url`

Le MASTER ne contient jamais de client réel.

## 5. Destination obligatoire

Un MASTER MAÎTRE ne doit jamais produire un parcours sans sortie utile.

### Prospect professionnel

`TERRITOIRE → EXEMPLE → DÉMO → ADHÉSION`

### Client final

`TERRITOIRE → BESOIN → ZONE → PRO RÉEL → VITRINE → CONTACT DIRECT`

Le contact direct peut être WhatsApp, appel, réservation ou autre action native du métier.

## 6. Exception LA VOIX

**LA VOIX n'est pas un MASTER MAÎTRE métier.**

LA VOIX est une capacité de **recherche vocale transversale**.

Elle ne doit produire aucune fiche de « professionnel LA VOIX ».

Ses exemples servent uniquement à illustrer des intentions de recherche telles que :

- chauffeur ou transfert ;
- restaurant dans une zone ;
- artisan urgent ;
- hébergement ;
- autre besoin humain exprimé naturellement.

Sa sortie cible est :

`VOIX → INTENTION → TERRITOIRE / ZONE / BESOIN → PROS RÉELS → OUVRIR`

Son CTA est **ESSAYER LA RECHERCHE PAR LA VOIX** ou équivalent.

## 7. Identité visuelle territoriale

Le moteur reste commun, mais chaque territoire peut porter une empreinte visuelle locale immédiatement reconnaissable.

Cette identité ne doit jamais modifier les règles fonctionnelles du CORE. Elle agit uniquement sur la présentation : palette, matières visuelles, ambiance, textes de territoire et iconographie locale.

Règle :

**MÊME MOTEUR · MÊME ADN DIGIYLYFE · EMPREINTE LOCALE DISTINCTE.**

Références validées :

- Dakar : énergie urbaine verte ;
- Bordeaux : lie-de-vin · crème · or ;
- Sarlat / Vallée de la Dordogne : pierre blonde · vert forêt · rivière Dordogne · or.

Un futur territoire doit construire sa propre identité à partir de son contexte, sans recopier automatiquement celle d'un territoire précédent.

## 8. Territoires futurs

Un territoire suivant ne doit pas recopier aveuglément les exemples d'un territoire précédent.

Il hérite du moule et des règles, puis reconstruit :

- ses zones ;
- ses exemples ;
- ses cas d'usage ;
- ses textes ;
- ses routes locales ;
- son identité visuelle locale ;
- ses paramètres commerciaux autorisés.

Le laboratoire précédent apporte l'expérience, pas les données locales.

## 9. Règle de propagation

Cette doctrine doit guider les évolutions futures de :

- DRIVER ;
- LOC ;
- BUILD / artisan ;
- RESTO ;
- MON COMMERCE ;
- SERVICE / beauté & bien-être ;
- JOB ;
- annonces / services ;
- autres capacités de présence professionnelle.

Elle ne déclenche aucune modification automatique des MASTER existants sans contrôle humain.

## 10. Formule maître

**LE MODULE OUVRE. SUPABASE AIGUILLE. LE PRO POSSÈDE SA VITRINE. L'EXEMPLE PROJETTE. LA VOIX CHERCHE.**

**LE VIDE NE S’AFFICHE PAS. IL SE PROJETTE.**

---

**DIGIYLYFE — Un moule commun. Des professionnels uniques. Des territoires vivants.**
