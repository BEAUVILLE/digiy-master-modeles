# MASTER MAÎTRE BUILD

## Statut

**MASTER MAÎTRE universel DIGIY BUILD — V1**

Référence de conception : la vitrine publique DIGIY BUILD actuelle, neutralisée pour devenir un moule réutilisable.

Ce dossier n'est pas un site client. C'est un **moule de fabrication** destiné aux artisans, techniciens et métiers de terrain.

## Fichiers

- `index.html` : moule exécutable et autonome.
- `README.md` : règles d'utilisation et de protection du MASTER.

## Principe

Un seul MASTER BUILD doit pouvoir servir au Sénégal, en France, en Europe et dans d'autres territoires compatibles.

Le pays, la ville, la devise, les contacts, les métiers, les adhérents, les photos, les tarifs, les zones d'intervention et les liens sont des **paramètres**. Ils ne doivent pas créer une nouvelle architecture.

## Doctrine intégrée

- DIGIYLYFE publie une présence numérique.
- 0 % de commission DIGIYLYFE sur la prestation.
- Le contact se fait directement avec l'artisan.
- L'artisan reste responsable de son activité, de son diagnostic, de son devis, de ses matériaux, de ses délais, de ses tarifs, de ses obligations et de la prestation qu'il accepte.
- DIGIYLYFE ne réalise pas les travaux, ne fixe pas le devis final et ne perçoit pas le paiement de la prestation.
- La mention `Adhérent DIGIYLYFE` ne vaut ni certification ni agrément administratif.

## Configuration

Dans `index.html`, rechercher :

```js
const CFG = {
```

Le bloc `CFG` pilote notamment :

- `brand` : nom de la famille BUILD ;
- `territory` : zone ou pays affiché ;
- `currency` : devise locale ;
- `joinUrl` : lien d'adhésion ou de contact ;
- `joinLabel` : texte du bouton d'adhésion ;
- `hubUrl` : lien DIGIYLYFE ou retour principal ;
- `showLanguages` : affichage des 8 langues ;
- `professionals` : liste des artisans à afficher.

Chaque entrée de `professionals` accepte notamment :

- `name` ;
- `activity` ;
- `area` ;
- `tags` ;
- `description` ;
- `rule` ;
- `phoneDisplay` ;
- `whatsapp` ;
- `priceLabel` ;
- `cardUrl` ;
- `image` ;
- `qrImage`.

## Langues

Le MASTER prévoit :

- FR ;
- EN ;
- ES ;
- PT ;
- DE ;
- IT ;
- NL ;
- AR avec RTL.

Les données propres à l'artisan restent saisies telles qu'elles ont été validées. La traduction automatique des éléments métier n'est pas imposée par le MASTER.

## Règles absolues

1. Ne jamais ajouter de `CNAME` dans ce dossier.
2. Ne jamais conserver un nom, un téléphone, une adresse, une photo ou un domaine client réel dans le MASTER.
3. Ne jamais stocker de mot de passe, PIN, clé privée ou secret.
4. Toujours créer une copie avant adaptation client.
5. Le MASTER doit rester fonctionnel sans backend.
6. Aucun logiciel métier ou moteur de gestion n'est inclus par défaut.
7. La carte ou la fiche d'un adhérent reste une présence numérique, pas une certification.
8. Les prix, devis, disponibilités et obligations relèvent du professionnel.
9. Toute évolution majeure du MASTER est testée avant propagation.

## Déclinaison Sénégal

Adapter principalement : zones d'intervention, téléphone +221, FCFA si un prix est affiché, moyens de contact et textes locaux utiles.

## Déclinaison France / Europe

Adapter principalement : zones d'intervention, téléphone local, euro si un prix est affiché, mentions locales utiles et moyens de contact.

## Contrôle avant publication

- nom et activité ;
- zone d'intervention ;
- téléphone ;
- WhatsApp ;
- photo ;
- QR ;
- bouton carte ;
- prix ou mention `Sur devis` ;
- langues ;
- affichage mobile ;
- doctrine 0 % commission ;
- aucune donnée du client précédent.

---

**MASTER MAÎTRE BUILD — DIGIYLYFE**

Le savoir-faire pour le savoir-être.