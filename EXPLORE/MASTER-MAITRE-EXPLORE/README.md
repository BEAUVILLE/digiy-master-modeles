# MASTER MAÎTRE EXPLORE

## Statut

**MASTER MAÎTRE universel DIGIY EXPLORE — V2 OWNER**

Référence de conception : la fiche publique visiteur EXPLORE actuellement en production, neutralisée pour devenir un moule réutilisable.

Ce dossier n'est ni un gros cockpit EXPLORE, ni un logiciel métier. Il réunit un **moule public de découverte** et une **page propriétaire légère** destinée à faire vivre disponibilité, horaires, prix indicatif, créneaux et demandes.

## Fichiers

- `index.html` : moule public autonome ;
- `README.md` : règles d'utilisation et de protection ;
- `gestion.html` : espace privé du propriétaire ;
- `manifest.webmanifest` : manifeste PWA neutre ;
- `sw.js` : service worker du MASTER ;
- `icon-192.png` et `icon-512.png` : icônes PWA génériques.

## Principe

Un seul MASTER EXPLORE doit pouvoir servir au Sénégal, en France, en Europe et dans d'autres territoires compatibles.

Le pays, la ville, la zone, le lieu, la catégorie, les horaires, le prix indicatif, les contacts, les photos, les repères et les liens sont des **paramètres**. Ils ne doivent pas créer une nouvelle architecture.

Le parcours maître est :

**Découvrir → comprendre → voir → trouver → contacter directement → partager.**

## Doctrine intégrée

- DIGIYLYFE publie une présence de découverte.
- 0 % de commission DIGIYLYFE sur l'activité présentée.
- Le contact, le paiement éventuel et l'organisation se font directement avec le professionnel ou l'organisateur.
- Le professionnel reste responsable de ses horaires, tarifs, disponibilités, obligations, conditions, sécurité et engagements.
- DIGIYLYFE ne garantit pas l'ouverture, la disponibilité ou l'exécution d'une activité à la place du professionnel.
- La présence DIGIYLYFE ne vaut ni certification ni agrément administratif.

## Configuration

Dans `index.html`, rechercher :

```js
const CFG = {
```

Le bloc `CFG` pilote notamment :

- `masterMode` : mode atelier ;
- `name` : nom du lieu ou de l'activité ;
- `category` : plage, visite, restaurant, sortie, culture, atelier, activité, etc. ;
- `city`, `zone`, `country` ;
- `address` : adresse ou repère utile ;
- `hours` : jours et horaires ;
- `priceLabel` : gratuit, sur demande, prix indicatif, etc. ;
- `shortDescription` et `description` ;
- `kind` : ambiance ou type de découverte ;
- `tags` ;
- `whatsapp` ;
- `phone` ;
- `websiteUrl` ;
- `publicUrl` ;
- `qrImage` ;
- `cover` ;
- `photos` ;
- `showLanguages`.

## Couche propriétaire

`gestion.html` ajoute uniquement les gestes vivants :

- disponibilité : disponible, limitée, indisponible, à confirmer ;
- message court de disponibilité ;
- horaires et prix indicatif ;
- créneaux datés ;
- capacité facultative ;
- demandes reçues ;
- confirmer / refuser / terminer ;
- note privée ;
- contact direct SMS / WhatsApp.

Le propriétaire est lié à `digiy_explore_places.auth_user_id`. Les créneaux utilisent `digiy_explore_slots`, les demandes `digiy_explore_requests`. La RLS empêche un propriétaire de piloter le lieu d’un autre.

Le public `index.html` reste une présence légère ; l’authentification appartient uniquement à `gestion.html`.

## Langues

Le MASTER prévoit le standard DIGIYLYFE à 8 langues :

- FR ;
- EN ;
- ES ;
- PT ;
- IT ;
- DE ;
- NL ;
- AR avec RTL.

Les libellés d'interface sont traduits. Les informations propres au lieu restent celles qui ont été validées ; le MASTER n'invente pas de traduction métier ou commerciale.

## PWA

La PWA est une couche légère de présence :

- installation sur téléphone compatible ;
- cache du cœur du MASTER ;
- repli vers `index.html` lorsque le réseau disparaît ;
- aucune authentification requise pour la page publique ;
- l’espace propriétaire `gestion.html` utilise Supabase Auth et RLS.

Le service worker met uniquement en cache :

- `./` ;
- `./index.html` ;
- `./manifest.webmanifest` ;
- `./icon-192.png` ;
- `./icon-512.png`.

## Règles absolues

1. Ne jamais ajouter de `CNAME` dans ce dossier.
2. Ne jamais conserver un nom, téléphone, adresse, photo, QR ou domaine client réel dans le MASTER.
3. Ne jamais stocker de mot de passe, PIN, clé privée ou secret.
4. Ne jamais rendre la page publique dépendante d’un cockpit privé ; l’authentification et Supabase restent confinés à `gestion.html`.
5. Toujours créer une copie avant adaptation client.
6. Ne jamais inventer tarif, horaire, disponibilité, sécurité, condition d'accès ou prestation.
7. Le QR final doit pointer vers l'URL publique réelle validée du lieu.
8. Les boutons téléphone, WhatsApp, carte et site doivent être testés avant publication.
9. Le MASTER reste en `noindex,nofollow` et en `masterMode:true` jusqu'à validation humaine de la déclinaison.
10. Une évolution majeure du MASTER est testée avant propagation aux instances existantes.

## Déclinaison Sénégal

Adapter principalement : ville/zone, repère local, téléphone +221, FCFA si un tarif est affiché, WhatsApp, photos et textes validés.

## Déclinaison France / Europe

Adapter principalement : ville/zone, adresse ou repère, téléphone local, euro si un tarif est affiché, photos, horaires et mentions utiles.

## Contrôle avant publication

- nom du lieu ;
- catégorie ;
- ville, zone et pays ;
- adresse ou repère ;
- horaires ;
- tarif indicatif ;
- WhatsApp ;
- téléphone ;
- site officiel éventuel ;
- couverture et galerie ;
- QR ;
- carte / itinéraire ;
- partage ;
- 8 langues ;
- arabe RTL ;
- PWA ;
- affichage mobile ;
- doctrine 0 % commission ;
- aucune donnée d'un client précédent ;
- retrait du mode atelier uniquement après validation humaine.

---

**MASTER MAÎTRE EXPLORE V2 OWNER — DIGIYLYFE**

Le local prépare. Le cloud renforce. Le professionnel décide.