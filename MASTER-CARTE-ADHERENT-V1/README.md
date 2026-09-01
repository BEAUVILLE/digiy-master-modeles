# MASTER CARTE ADHÉRENT DIGIYLYFE — V1

## Rôle

Ce dossier est le **moule universel de la carte de visite DIGIY de l’adhérent**.

Il correspond au socle minimal validé dans le MASTER CORE et le MAÎTRE TERRITOIRE :

**QR STABLE → CARTE ADHÉRENT / PWA → ACTION DIRECTE → RELATION CLIENT**

La carte n’est ni une fiche enrichie, ni un site individuel, ni une boutique. Elle peut rester durablement la seule présence commandée par l’adhérent.

## Invariants

- URL publique canonique attribuée à l’adhérent et destinée à rester stable ;
- QR généré sur cette URL canonique et conservé lorsque la présence s’enrichit ;
- nom / enseigne au premier plan ;
- métier / activité ;
- zone ;
- services principaux ;
- numéro public visible et lisible ;
- bouton **Appeler** ;
- bouton **WhatsApp** lorsqu’il est utilisé ;
- bouton **Copier le numéro** ;
- bouton **Partager** avec Web Share API lorsque disponible, sinon copie du lien ;
- PWA légère avec ajout volontaire à l’écran d’accueil lorsque le navigateur le permet ;
- aucune installation automatique ;
- signature de maison : **DIGIYLYFE.COM · L’empreinte numérique du professionnel**.

## Configuration

Dans `index.html`, modifier uniquement l’objet `CFG` de l’instance copiée :

- `professionalName`
- `activity`
- `zone`
- `services[]`
- `phoneDisplay`
- `phoneE164`
- `whatsappE164`
- `whatsappMessage`
- `image`
- `canonicalUrl`
- `qrImage`
- `sourceLanguage`
- `accent`

`phoneDisplay` est le numéro montré au client. `phoneE164` et `whatsappE164` sont les versions normalisées servant aux actions techniques.

## Règle du QR stable

Le QR physique doit encoder **exactement l’URL canonique de la carte**.

Une fois le QR imprimé et diffusé :

- ne pas changer l’URL canonique ;
- modifier le contenu derrière cette URL si l’adhérent évolue ;
- si une fiche, un catalogue, une boutique ou un site est ajouté plus tard, la carte reste la porte stable et peut rediriger ou ouvrir la nouvelle capacité sans réimprimer le QR.

`qrImage` doit pointer vers une image QR produite à partir de `canonicalUrl`. Le MASTER ne dépend d’aucun service QR tiers à l’exécution.

## PWA

Le socle contient :

- `manifest.webmanifest` ;
- `sw.js` ;
- icônes SVG neutres remplaçables dans l’instance client ;
- métadonnées mobile / Apple ;
- bouton **Garder cette carte** ;
- gestion de `beforeinstallprompt` sur navigateurs compatibles ;
- instruction iPhone/iPad via Partager → Ajouter à l’écran d’accueil.

Le service worker utilise une stratégie **network-first pour la navigation** afin que le QR stable puisse ouvrir une carte mise à jour sans rester prisonnier d’un ancien HTML mis en cache.

## Langues

Les commandes de la carte comprennent le socle public :

**FR · EN · ES · PT · IT · DE · NL · AR**

L’arabe active automatiquement le RTL. Les données propres au professionnel ne sont jamais traduites automatiquement sans matière validée.

## Fabrication

1. Copier ce dossier dans l’instance client.
2. Renseigner `CFG` avec les données validées.
3. Adapter le manifest à l’enseigne si nécessaire.
4. Poser l’URL canonique définitive.
5. Générer le QR sur cette URL et renseigner `qrImage`.
6. Tester numéro visible, Appeler, WhatsApp, Copier, Partager, QR et PWA.
7. Contrôler mobile et ordinateur.
8. Faire valider humainement avant publication.

Ne jamais publier ce MASTER tel quel et ne jamais y conserver de données réelles d’un client.

---

**DIGIYLYFE.COM · L’empreinte numérique du professionnel**
