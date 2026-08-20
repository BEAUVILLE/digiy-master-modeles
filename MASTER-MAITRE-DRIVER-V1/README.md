# MASTER MAÎTRE DRIVER — V1

## Rôle

Modèle universel DIGIYLYFE pour :

- chauffeurs privés ;
- transferts aéroport ;
- transport local sur réservation ;
- minibus / bus avec chauffeur ;
- mise à disposition avec chauffeur.

Le Master est une **présence numérique autonome**. Ce n’est pas une centrale de réservation, une application VTC, un logiciel chauffeur ou un système de paiement.

## Doctrine

- contact direct avec le chauffeur ;
- paiement direct au chauffeur ;
- 0 % commission DIGIYLYFE ;
- le chauffeur confirme lui-même disponibilité, itinéraire et prix final ;
- chaque chauffeur reste responsable de son activité, de ses autorisations, de son assurance, de son véhicule et de la course qu’il accepte ;
- DIGIYLYFE publie la présence numérique et ne transporte pas les passagers.

## Base terrain

Le Master reprend les principes utiles déjà présents dans DIGIY DRIVER : fiche chauffeur, photo, zone, véhicule, confort, services, tarifs indicatifs, WhatsApp direct et préparation d’une demande de course.

Les éléments moteur / Supabase / authentification ont volontairement été retirés.

## Fichiers

- `index.html`
- `manifest.webmanifest`
- `sw.js`
- `icon-192.png`
- `icon-512.png`
- `README.md`

## Configuration

Tout se règle dans `const CFG` dans `index.html`.

Pour chaque chauffeur : identité, activité, zone générale, véhicule, confort, services, téléphone, WhatsApp, carte DIGIYLYFE, photo, QR et tarifs indicatifs optionnels.

## Demande de course

Le formulaire embarqué ne stocke rien et n’envoie rien à DIGIYLYFE. Il prépare simplement un message WhatsApp contenant départ, arrivée, date / heure, nombre de personnes et bagages. Le chauffeur reprend ensuite la main directement.

## Confidentialité terrain

Le Master n’exige aucune géolocalisation GPS précise. Une zone générale suffit pour la vitrine.

## Langues

**FR · EN · ES · PT · IT · DE · NL · AR**

L’arabe active automatiquement le RTL.

## PWA

Le Master inclut manifest, service worker et icônes 192/512.

## Règle atelier

Toujours créer une nouvelle instance depuis une copie du Master. Ne jamais publier le Master lui-même tel quel.
