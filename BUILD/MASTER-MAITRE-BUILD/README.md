# MASTER MAÎTRE BUILD — V2 SITE PROFESSIONNEL

## Statut

**MASTER MAÎTRE DIGIY BUILD — V2 SITE PRO**

Ce dossier est un **moule de fabrication** destiné à produire le **site professionnel personnel d’un artisan ou technicien**.

La règle est désormais explicite :

- la galerie / vitrine DIGIY BUILD sert à **découvrir plusieurs professionnels** ;
- ce MASTER sert à fabriquer **le site d’un seul professionnel** ;
- une carte ou une fiche peut exister à l’intérieur du parcours, mais elle ne constitue pas à elle seule le site.

## Architecture du site

Le site comprend :

- accueil / hero de l’artisan ;
- identité, métier, ville et zone d’intervention ;
- services ;
- présentation / histoire / méthode ;
- réalisations / galerie ;
- fonctionnement du devis et du chantier ;
- demande de devis directe ;
- WhatsApp / téléphone / QR / carte DIGIYLYFE à configurer ;
- 8 langues : FR, EN, ES, PT, IT, DE, NL, AR ;
- arabe RTL ;
- PWA légère.

## Configuration

Dans `index.html`, modifier uniquement `const CFG`.

Principaux champs :

- `name`
- `trade`
- `city`
- `area`
- `availability`
- `phoneDisplay`
- `whatsapp`
- `cardUrl`
- `heroLead`
- `aboutText`
- `heroImage`
- `aboutImage`
- `qrImage`
- `services`
- `projects`

Les textes métier validés pour un client ne doivent jamais être remplacés automatiquement par le MASTER.

## Doctrine

- DIGIYLYFE publie la présence numérique.
- 0 % de commission DIGIYLYFE sur la prestation.
- Contact direct avec l’artisan.
- Paiement direct.
- L’artisan reste responsable de son activité, de ses obligations, de son diagnostic, de son devis, de ses matériaux, de ses délais, de ses tarifs et de la prestation acceptée.
- DIGIYLYFE ne réalise pas les travaux, ne fixe pas le devis final et ne perçoit pas le paiement de la prestation.
- `Adhérent DIGIYLYFE` ne vaut ni certification ni agrément.

## PWA

- `manifest.webmanifest`
- `sw.js`
- icônes 192 / 512
- enregistrement du service worker dans `index.html`

La PWA est une couche légère de présence, jamais un logiciel métier.

## Règles atelier

1. Toujours créer une copie avant déclinaison client.
2. Ne jamais laisser une donnée réelle d’un autre client.
3. Aucun backend obligatoire.
4. Aucun moteur métier ou cockpit n’est inclus.
5. Aucun push d’une instance client dans le coffre MASTER.
6. Tester mobile, langues, RTL, WhatsApp, QR, images et formulaire avant publication.

---

**DIGIYLYFE · MASTER MAÎTRE BUILD V2 SITE PRO**

Le savoir-faire pour le savoir-être.
