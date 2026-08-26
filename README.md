# DIGIY MASTER MODÈLES

Coffre des **MASTER MAÎTRE opérationnels DIGIYLYFE**.

Ce dépôt contient les moules techniques prêts à être copiés, configurés et adaptés pour un nouveau client ou un nouveau territoire.

## Séparation des coffres

- `BEAUVILLE/digiy-master` = doctrine, règles, méthodes, agents et standards.
- `BEAUVILLE/digiy-master-modeles` = modèles techniques / MASTER MAÎTRE.
- Les dépôts clients et modules publics restent séparés et ne servent jamais de coffre maître.

## MASTER CORE WORLD

- `MASTER-CORE-WORLD-V1/` — socle technique mondial.
- Arbre maître : `CORE MONDIAL → PAYS → TERRITOIRE → ZONE → BESOIN → PROFESSIONNEL → OUVRIR`.
- Le pays est la première couche opérationnelle.
- Un nouveau pays est ajouté par configuration et données, jamais par duplication complète du moteur.
- Les modules métier deviennent des capacités activables derrière les professionnels.

La doctrine complète est conservée dans `BEAUVILLE/digiy-master/MASTER-CORE.md`.

## MASTER PAYS

- `MASTER-PAYS-SENEGAL-V1/` — configuration pays Sénégal héritée du CORE. Petite Côte et Dakar sont actifs ; les extensions futures restent soumises à validation humaine.
- `MASTER-PAYS-FRANCE-V1/` — configuration pays France héritée du CORE. Vallée de la Dordogne et Bordeaux sont actifs ; Arcachon reste planifié.

Doctrine pays : `BEAUVILLE/digiy-master/MASTER-PAYS.md`.

## MASTER TERRITOIRE

- `MASTER-TERRITOIRE-PETITE-COTE-V1/` — territoire saisonnier de référence Sénégal. Zones V1 : AIBD, Ndayane, Popenguine, Somone, Ngaparou, Saly, Mbour.
- `MASTER-TERRITOIRE-BORDEAUX-V1/` — territoire urbain de référence France. V1 : les 8 grands quartiers administratifs de Bordeaux.
- `MASTER-TERRITOIRE-VALLEE-DORDOGNE-V1/` — territoire saisonnier de référence France, avec Sarlat-la-Canéda comme première zone active.

Les besoins et capacités sont hérités du CORE ; aucun moteur ni professionnel réel n'est recopié dans un MASTER territoire.

Doctrine territoire : `BEAUVILLE/digiy-master/MASTER-TERRITOIRE.md`.
Doctrine projection : `BEAUVILLE/digiy-master/DOCTRINE-PROJECTION-TERRITOIRE-V1.md`.
Règle MAÎTRE projection : `DOCTRINE-MAITRE-PROJECTION-TERRITOIRE-V1.md`.

## Règle d'architecture

**1 famille métier = 1 MASTER MAÎTRE universel.**

Le pays n'est pas un nouveau MASTER métier : Sénégal, France ou autre pays compatible sont des configurations du même CORE et des mêmes moules.

**MODULE = PORTE · SUPABASE = AIGUILLEUR · PROFESSIONNEL = SA PROPRE VITRINE · EXEMPLE = PROJECTION TEMPORAIRE · LA VOIX = RECHERCHE.**

## MASTER MAÎTRES présents

- `MASTER-CORE-WORLD-V1/` — configuration mondiale, pays, territoires, besoins, langues et capacités.
- `MASTER-PAYS-SENEGAL-V1/` — configuration pays Sénégal héritée du CORE.
- `MASTER-PAYS-FRANCE-V1/` — configuration pays France héritée du CORE.
- `MASTER-TERRITOIRE-PETITE-COTE-V1/` — configuration territoire Petite Côte.
- `MASTER-TERRITOIRE-VALLEE-DORDOGNE-V1/` — configuration territoire Vallée de la Dordogne.
- `MASTER-TERRITOIRE-BORDEAUX-V1/` — configuration territoire Bordeaux.
- `BUILD/MASTER-MAITRE-BUILD/` — artisans, techniciens, métiers de terrain.
- `EXPLORE/MASTER-MAITRE-EXPLORE/` — lieux, sorties, expériences, activités locales.
- `JOB/MASTER-MAITRE-JOB/` — missions, offres et candidatures directes.
- `LOC/MASTER-MAITRE-LOC/` — hébergements et location directe.
- `MASTER-MAITRE-DRIVER-V1/` — chauffeurs privés, transferts et transport sur réservation.
- `MASTER-MAITRE-MON-COMMERCE-V1/` — commerces locaux et vitrines produits.
- `MASTER-MAITRE-SERVICE-V1/` — prestations, beauté, bien-être et services sur rendez-vous.
- `MASTER-MAITRE-RESTO-V2-SITE/` — site restaurant complet.

## MASTER en construction contrôlée

- `MASTER-MAITRE-CARNET-V1/` — futur moule universel DIGIY CARNET : trace financière terrain, entrées/sorties/net du jour, modes Wave/Orange Money/espèces, Oreille/voix et accès adhérent par magic link. **Ne pas déployer avant validation de la source de vérité Supabase, du bridge d’authentification et de la parité avec le moteur vivant.**

## Standard technique commun

Chaque MASTER opérationnel doit tendre vers :

- `index.html` autonome ;
- `README.md` neutre ;
- `manifest.webmanifest` ;
- `sw.js` ;
- `icon-192.png` ;
- `icon-512.png` ;
- PWA légère ;
- mode atelier / `noindex,nofollow` dans le coffre ;
- configuration centralisée ;
- FR · EN · ES · PT · IT · DE · NL · AR ;
- RTL automatique pour l'arabe ;
- contact direct ;
- paiement direct quand il s'applique ;
- 0 % commission DIGIYLYFE ;
- aucun moteur métier obligatoire ;
- aucune donnée personnelle réelle ou identité client conservée dans le MASTER.

## Discipline

1. Toujours travailler sur une copie pour créer une instance client.
2. Ne jamais utiliser un site client comme coffre maître.
3. Ne jamais conserver nom, téléphone, adresse, photo, QR, CNAME, domaine client, identifiant de production, secret ou moyen de paiement nominatif dans un MASTER.
4. Le MASTER ne devient jamais automatiquement un site en production.
5. Les prix, stocks, disponibilités, horaires, obligations et prestations restent sous la responsabilité du professionnel concerné.
6. DIGIYLYFE publie la présence numérique ; il ne certifie pas administrativement le professionnel et ne prélève pas de commission sur la prestation ou la vente présentée.
7. Toute évolution majeure est testée avant propagation.
8. Avant publication d'une instance : contrôler mobile, boutons, téléphone, WhatsApp, formulaires, langues, RTL, PWA, QR et données opérationnelles.
9. Un nouveau pays ou territoire doit passer le test MASTER CORE : configuration + données, sans copie complète du moteur.
10. Un territoire suivant hérite de la méthode du précédent, jamais de ses données locales par copie aveugle.

---

**DIGIYLYFE — Le CORE est mondial. Le pays organise. Le territoire rapproche.**
