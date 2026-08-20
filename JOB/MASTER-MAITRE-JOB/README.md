# MASTER MAÎTRE JOB

## Statut

**MASTER MAÎTRE universel DIGIY JOB — V1**

Ce dossier est un **moule de fabrication** pour les vitrines et portes publiques liées aux missions, offres, candidatures et recrutements.

Il n'est pas un cockpit recruteur, pas un logiciel RH et pas un moteur Supabase.

## Fichiers

- `index.html` : moule public autonome.
- `manifest.webmanifest` : installation PWA.
- `sw.js` : cache léger et repli hors connexion.
- `icon-192.png` / `icon-512.png` : icônes PWA.
- `README.md` : règles du MASTER.

## Principe

**1 métier = 1 MASTER MAÎTRE universel.**

Le pays n'est pas un nouveau MASTER. Sénégal, France, Europe et autres territoires compatibles sont des configurations.

## Ce que le MASTER doit permettre

- présenter une ou plusieurs missions / offres ;
- afficher métier, zone, type de contrat ou mission, rémunération si elle est communiquée, horaires et description ;
- proposer une candidature directe ;
- proposer une candidature spontanée ;
- permettre un contact direct avec le recruteur lorsque celui-ci l'autorise ;
- rappeler que le candidat reste libre et que la candidature ne garantit ni entretien ni embauche ;
- rappeler que le recruteur reste responsable de l'offre, des conditions, du contrat, de la rémunération, de la sélection et de l'embauche ;
- fonctionner sans backend obligatoire ;
- fonctionner comme PWA légère ;
- être utilisable en 8 langues : FR, EN, ES, PT, IT, DE, NL, AR.

## Configuration

Dans `index.html`, rechercher :

```js
const CFG = {
```

Le bloc centralise notamment :

- `masterMode` ;
- nom / marque de la structure ;
- pays, ville et zone ;
- WhatsApp et email ;
- texte de présentation ;
- liste des offres ;
- règles de candidature ;
- paramètres de partage.

`masterMode:true` doit rester actif dans le coffre. Les boutons de contact réel restent neutralisés tant qu'une copie n'a pas été configurée et testée.

## Doctrine JOB

1. **Candidat : accès gratuit à la candidature.**
2. DIGIYLYFE met en visibilité et facilite la mise en relation ; il ne promet ni entretien ni embauche.
3. Le recruteur reste responsable de la réalité de l'offre, de ses conditions, de la sélection, du contrat et de la rémunération.
4. Le candidat reste responsable des informations qu'il transmet.
5. Aucune donnée sensible ne doit être publiée inutilement.
6. Aucun mot de passe, PIN, secret, clé privée ou identifiant de production ne doit vivre dans le MASTER.
7. Le MASTER ne doit contenir ni UUID d'offre réel, ni téléphone réel, ni email client réel, ni CNAME, ni domaine client obligatoire.
8. Une intégration cloud peut être ajoutée dans une déclinaison séparée, mais elle ne doit pas devenir une dépendance du MASTER.
9. DIGIYLYFE ne prélève pas de commission sur la rémunération ou l'embauche.

## PWA

Le service worker met en cache uniquement le cœur du MASTER :

- `./`
- `./index.html`
- `./manifest.webmanifest`
- `./icon-192.png`
- `./icon-512.png`

Le cache ne doit jamais contenir de données personnelles de candidat.

## Contrôle avant publication d'une copie

- `masterMode:false` uniquement dans la copie client validée ;
- nom de la structure ;
- pays / ville / zone ;
- offres réellement à jour ;
- rémunération et conditions vérifiées ;
- téléphone / WhatsApp / email ;
- textes légaux et responsabilités ;
- 8 langues ;
- RTL arabe ;
- boutons mobile ;
- manifest ;
- service worker ;
- icônes ;
- aucune donnée du client précédent.

---

**MASTER MAÎTRE JOB — DIGIYLYFE**

Le local prépare. Le cloud renforce. Le professionnel décide.
