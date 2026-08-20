# MASTER MAÎTRE LOC

## Statut

**MASTER MAÎTRE universel DIGIY LOC — V1**

Référence de conception : la version France / Sarlat retenue comme meilleure base fonctionnelle et visuelle.

Ce dossier n'est pas un site client. C'est un **moule de fabrication**.

## Fichiers

- `index.html` : moule exécutable et autonome.
- `README.md` : règles d'utilisation et de protection du MASTER.

## Principe

Un seul MASTER LOC doit pouvoir servir pour :

- Sénégal ;
- France ;
- Europe ;
- autres territoires compatibles.

Le pays, la devise, les contacts, les prix, les photos, les horaires et les moyens de paiement sont des **paramètres**, pas une nouvelle architecture.

## Source maître

La structure est inspirée de la version **SARLAT CHEZ BAPTISTE**, choisie comme référence pour :

- hero fort ;
- informations rapides ;
- galerie ;
- calendrier ;
- demande directe ;
- WhatsApp / email ;
- paiement direct ;
- QR / carte officielle ;
- navigation mobile compacte ;
- 0 % commission DIGIYLYFE.

Aucun contenu personnel de Chez Baptiste n'est conservé dans ce MASTER.

## Configuration

Dans `index.html`, rechercher le bloc :

```js
const CFG = {
```

C'est le centre de configuration du moule.

Les champs principaux sont :

- `name` : nom de l'hébergement ;
- `type` : chambre, appartement, villa, maison, résidence, etc. ;
- `city` et `country` ;
- `tagline` ;
- `pricePerNight` ;
- `currency` ;
- `secondaryPrice` et `secondaryCurrency` si nécessaire ;
- `whatsapp` ;
- `email` ;
- `address` ;
- `paymentLabel` et `paymentDetails` ;
- `maxGuests` ;
- `checkIn` / `checkOut` ;
- `photos` ;
- `blockedDates` / `closedDates`.

## Règles absolues

1. Ne jamais ajouter de `CNAME` dans ce dossier.
2. Ne jamais mettre un domaine client réel comme valeur maître obligatoire.
3. Ne jamais stocker de mot de passe, PIN, clé privée ou secret Supabase.
4. Les clés publiques éventuellement nécessaires doivent être ajoutées uniquement dans une déclinaison contrôlée.
5. Le MASTER doit fonctionner sans backend : le calendrier local et la demande directe restent disponibles.
6. Une intégration Supabase ou autre moteur peut être branchée dans une déclinaison, sans rendre le MASTER dépendant du cloud.
7. Toujours créer une copie avant adaptation client.
8. Le professionnel reste responsable de ses prix, disponibilités, conditions, obligations et confirmations.
9. DIGIYLYFE ne perçoit pas le paiement du séjour et ne confirme pas la réservation à la place de l'hébergeur.

## Déclinaison Sénégal

Adapter principalement : devise FCFA, téléphone +221, Wave/Sendwave ou autre moyen choisi, adresse, textes locaux, prix, horaires et médias.

## Déclinaison France / Europe

Adapter principalement : devise €, téléphone local, IBAN/virement/Sendwave ou moyen choisi, adresse, mentions locales, prix et médias.

## Contrôle avant publication

- téléphone ;
- WhatsApp ;
- email ;
- dates du calendrier ;
- prix ;
- devise ;
- adresse ;
- photos ;
- boutons ;
- formulaire ;
- navigation mobile ;
- texte 0 % commission ;
- aucune donnée du client précédent.

---

**MASTER MAÎTRE LOC — DIGIYLYFE**

Le local prépare. Le cloud renforce. Le professionnel décide.
