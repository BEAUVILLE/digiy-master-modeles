# DIGIY MASTER MODÈLES

Coffre des **MASTER MAÎTRE opérationnels DIGIYLYFE**.

Ce dépôt contient les moules techniques prêts à être copiés, configurés et adaptés pour un nouveau client ou un nouveau territoire.

## Séparation des coffres

- `BEAUVILLE/digiy-master` = doctrine, règles, méthodes, agents et standards.
- `BEAUVILLE/digiy-master-modeles` = modèles techniques / MASTER MAÎTRE.
- Les dépôts clients et modules publics restent séparés et ne servent jamais de coffre maître.

## Règle d'architecture

**1 famille métier = 1 MASTER MAÎTRE universel.**

Le pays n'est pas un nouveau MASTER : Sénégal, France, Europe ou autre territoire compatible sont des configurations du même moule.

## MASTER MAÎTRES présents

- `BUILD/MASTER-MAITRE-BUILD/` — artisans, techniciens, métiers de terrain.
- `EXPLORE/MASTER-MAITRE-EXPLORE/` — lieux, sorties, expériences, activités locales.
- `JOB/MASTER-MAITRE-JOB/` — missions, offres et candidatures directes.
- `LOC/MASTER-MAITRE-LOC/` — hébergements et location directe.
- `MASTER-MAITRE-DRIVER-V1/` — chauffeurs privés, transferts et transport sur réservation.
- `MASTER-MAITRE-MON-COMMERCE-V1/` — commerces locaux et vitrines produits.
- `MASTER-MAITRE-SERVICE-V1/` — prestations, beauté, bien-être et services sur rendez-vous.
- `MASTER-MAITRE-RESTO-V2-SITE/` — site restaurant complet.

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

---

**DIGIYLYFE — Le moule reste maître, le terrain reste humain.**
