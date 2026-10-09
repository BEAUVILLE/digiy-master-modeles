# MASTER MAÎTRE RESTO — V2 SITE COMPLET

## Correction de doctrine atelier

Ce MASTER n’est **pas une carte de visite**.

C’est un **vrai site web restaurant complet** :

- grand accueil / hero ;
- navigation de site ;
- présentation / histoire / concept ;
- carte et menu par catégories ;
- galerie photos ;
- informations pratiques ;
- emplacement / adresse ;
- bouton **Voir l’itinéraire** généré depuis l’adresse configurée ;
- horaires ;
- services ;
- réservation / demande de table directe ;
- QR du site ;
- footer complet ;
- PWA ;
- 8 langues.

## Base terrain

La grammaire retenue vient d’un site restaurant terrain complet : hero plein écran, histoire et ambiance, carte structurée, galerie photos, horaires, adresse, services et réservation directe.

Aucune donnée client réelle n’est conservée dans le MASTER.

## Emplacement

Le bloc **Nous trouver** affiche l’adresse configurée dans `CFG.address`.

Le bouton **📍 Voir l’itinéraire** construit automatiquement un lien Google Maps à partir de cette adresse. Si l’adresse est encore un placeholder du MASTER, le lien reste neutralisé.

## Configuration

Tout se règle dans `const CFG` dans `index.html` :

- nom ;
- type ;
- ville / région / pays ;
- adresse ;
- téléphone ;
- WhatsApp ;
- hero ;
- histoire ;
- éléments de preuve / ambiance ;
- catégories de menu ;
- plats / prix ;
- galerie ;
- horaires ;
- services ;
- QR.

## Relation commerciale

Le restaurant garde la main :

- contact direct ;
- réservation confirmée directement par le restaurant ;
- paiement direct au restaurant ;
- 0 % commission DIGIYLYFE.

## Ce que le MASTER ne contient pas

- aucun moteur de réservation centralisé ;
- aucune caisse ;
- aucun paiement DIGIYLYFE ;
- aucun Supabase ;
- aucune identité de restaurant réel ;
- aucun téléphone, adresse ou tarif client réel ;
- aucune photo client réelle.

## Langues

FR · EN · ES · PT · IT · DE · NL · AR.  
RTL automatique pour l’arabe.

Le libellé de l’itinéraire est également traduit dans les 8 langues.

## PWA

Fichiers conservés :

- `index.html`
- `manifest.webmanifest`
- `sw.js`
- `icon-192.png`
- `icon-512.png`
- `README.md`

## Règle

Toujours instancier depuis une copie.  
Ne jamais publier le MASTER lui-même tel quel.

## Héritage terrain RESTO V31–V35 · 09/10/2026

Le MASTER RESTO V2 est **toujours le site restaurant complet** (8 langues et PWA). Les améliorations récentes ont désormais un portage explicite, **sans modifier ni publier automatiquement le site vitrine**.

### 🍽️ Atelier double V35 — à utiliser sur une copie

Ouvrir [ATELIER-V35/index.html](./ATELIER-V35/index.html) :

- **📅 Plats du jour** sur sept jours, midi/soir, photos, prix éventuels, fuseaux France/Sénégal ;
- **🥗 Plats & Salades** individuels, carte habituelle indépendante, sans menus composés ni formules imposées ;
- deux boutons séparés, aperçu local non publié, sauvegarde **absente**, aucun contact ni paiement déclenché.

Les deux moteurs de préparation sont portés depuis les sources fusionnées de `BEAUVILLE/digiy-resto`, notamment les PR #31, #32 et #33. La carte Plats & Salades est **la maquette réellement approuvée**. Le portage est une référence d'atelier, **pas encore une installation propriétaire autonome**.

### 🔐 Le contrat du MAÎTRE

Lire impérativement [CONTRAT-RESTO-V31-V35.md](./CONTRAT-RESTO-V31-V35.md) avant toute duplication : vérification Auth et `owner_id`, RLS/RPC serveur, conservation distincte des brouillons et versions publiées, photos isolées, restauration des réservations, séparation RESTO/RÉSA générique, service à emporter volontaire **sans caisse et sans commission**.

La vitrine `index.html` reste inchangée : ses anciens placeholders `CFG.menu` ne sont pas alimentés par l'atelier non authentifié. Aucun `site` TEST SALY, téléphone, prix ou compte réel n'entre dans le MASTER.
