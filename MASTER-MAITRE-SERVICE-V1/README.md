# MASTER MAÎTRE SERVICE — V1

## Rôle

Modèle universel DIGIYLYFE pour les **professionnels qui vendent principalement une prestation** :
beauté, onglerie, coiffure, bien-être, photographie, accompagnement, entretien, service local ou activité sur rendez-vous.

Ce Master est une **vitrine / présence numérique**. Ce n’est ni une caisse, ni un logiciel métier, ni un moteur de réservation centralisé.

## Doctrine

- contact direct avec le professionnel ;
- rendez-vous préparé directement par WhatsApp ou téléphone ;
- paiement direct au professionnel ;
- 0 % commission DIGIYLYFE ;
- le professionnel reste responsable de son activité, de ses obligations, de ses disponibilités, de ses prix, des produits utilisés, des précautions et de la prestation acceptée ;
- DIGIYLYFE ne certifie pas la conformité administrative, sanitaire ou professionnelle de l’adhérent.

## Base de conception

Le modèle reprend des **principes éprouvés sur des vitrines de services terrain** : présence mobile-first, prestations, médias, produits éventuellement associés, WhatsApp direct et relation client gardée par le professionnel. Aucune identité, aucun numéro, aucun prix ni contenu personnel d’un client de référence n’est conservé dans le MASTER.

## Fichiers

- `index.html` — interface universelle et configuration centralisée ;
- `manifest.webmanifest` — PWA ;
- `sw.js` — service worker ;
- `icon-192.png` et `icon-512.png` — icônes PWA génériques.

## Configuration

Tout se règle dans `const CFG` dans `index.html` :

- `brand`
- `territory`
- `currency`
- `accent` / `accent2`
- `hubUrl`
- `joinUrl`
- `professionals[]`

Pour chaque professionnel :

- identité / activité / zone ;
- services ;
- description ;
- téléphone / WhatsApp ;
- lien carte DIGIYLYFE ;
- photo ;
- QR ;
- tarifs indicatifs optionnels ;
- médias optionnels.

## Langues

Socle inclus :

**FR · EN · ES · PT · IT · DE · NL · AR**

L’arabe bascule automatiquement l’interface en RTL.

## PWA

Le Master inclut le manifest, le service worker et les icônes 192/512.  
Lorsqu’une nouvelle instance est fabriquée, changer au minimum le nom, les couleurs, les données du professionnel et la clé de cache du service worker.

## Règle atelier

Toujours fabriquer une nouvelle instance à partir d’une copie du Master.  
Ne jamais publier le Master lui-même tel quel.
