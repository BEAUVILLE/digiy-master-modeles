# MASTER MAÎTRE DRIVER — V2 SITE PROFESSIONNEL PERSONNEL

## Statut

**MASTER MAÎTRE DRIVER — V2 SITE PRO**

Ce Master fabrique **le site personnel d’un chauffeur professionnel**.

Séparation obligatoire :

- la galerie DIGIY DRIVER sert à **découvrir plusieurs chauffeurs** ;
- ce Master sert à présenter **un seul chauffeur**, son véhicule ou sa flotte, ses services, sa zone et son contact direct.

Le Master n’est pas une centrale de réservation, une application VTC, un logiciel chauffeur ni un système de paiement.

## Architecture

- accueil / identité du chauffeur ;
- prestations ;
- véhicule principal : **VOITURE / MINIBUS / BUS** ;
- places, bagages, confort et équipements ;
- galerie ;
- zones ;
- demande de trajet directe ;
- Départ et Destination choisis dans une liste préinscrite ;
- WhatsApp direct ;
- 8 langues : FR, EN, ES, PT, IT, DE, NL, AR ;
- arabe RTL ;
- PWA légère.

## Zones — preset Sénégal DRIVER CLIENT

Le Master intègre comme preset la logique **exacte du module DRIVER CLIENT validé** :

- ✈️ AÉROPORTS
- 🏖️ SALY & PETITE CÔTE
- 🏙️ MBOUR
- 🏙️ DAKAR & BANLIEUE
- 🇸🇳 AUTRES VILLES

Les champs Départ et Destination sont `readonly` : le client choisit un nom de lieu préinscrit au lieu de l’écrire.

Le preset contient également les coordonnées utilisées par DRIVER CLIENT. Les tarifs de routes déjà présents dans DRIVER CLIENT sont conservés comme données de référence, mais `showRouteEstimate` est désactivé par défaut : le chauffeur confirme toujours son prix final.

Pour une déclinaison France / Europe, remplacer le preset de lieux sans changer l’architecture du site.

## Configuration

Dans `const CFG` :

- `name`
- `activity`
- `city`
- `area`
- `whatsapp`
- `phoneDisplay`
- `cardUrl`
- `heroLead`
- `driverImage`
- `vehicle.category`
- `vehicle.model`
- `vehicle.seats`
- `vehicle.bags`
- `vehicle.comfort`
- `vehicle.image`
- `services`
- `gallery`
- `locationPreset`
- `showRouteEstimate`

## Doctrine

- contact direct avec le chauffeur ;
- paiement direct au chauffeur ;
- 0 % commission DIGIYLYFE ;
- le chauffeur confirme disponibilité, véhicule, itinéraire et prix final ;
- le chauffeur reste responsable de son activité, de ses obligations, de son assurance, de son véhicule et de la course acceptée ;
- DIGIYLYFE publie la présence numérique et ne transporte pas les passagers.

## Taxonomie

Le Master accepte notamment :

- chauffeur privé ;
- voiture avec chauffeur ;
- minibus avec chauffeur ;
- bus avec chauffeur ;
- transfert ;
- transport sur réservation ;
- mise à disposition avec chauffeur.

Ne pas utiliser **TAXI** ni **JAKARTA** dans ce Master.

## PWA

- `manifest.webmanifest`
- `sw.js`
- icônes 192 / 512
- enregistrement du service worker

## Règle atelier

Toujours créer une instance depuis une copie du Master. Ne jamais publier le Master lui-même tel quel.

---

**DIGIYLYFE · MASTER MAÎTRE DRIVER V2 SITE PRO**
