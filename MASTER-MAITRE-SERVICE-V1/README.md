# MASTER MAÎTRE SERVICE — V2 · GALERIE URL

## Rôle

Modèle universel DIGIYLYFE pour les **professionnels qui vendent principalement une prestation** : beauté, onglerie, coiffure, bien-être, photographie, accompagnement, entretien, service local, activité sur rendez-vous et **services professionnels**.

Le besoin public **Services professionnels** peut notamment orienter vers ce MASTER pour : avocat, architecte, comptable / expert-comptable, géomètre, assureur / courtier en assurance, consultant ou bureau d'études. Cette orientation n'emporte aucune certification, agrément ni validation réglementaire par DIGIYLYFE.

Ce Master reste une **vitrine / présence numérique**. Ce n’est ni une caisse, ni un logiciel métier, ni un moteur de réservation centralisé.

## Doctrine

- contact direct avec le professionnel ;
- rendez-vous préparé directement par WhatsApp ou téléphone ;
- paiement direct au professionnel ;
- 0 % commission DIGIYLYFE ;
- le professionnel reste responsable de son activité, de ses obligations, de ses disponibilités, de ses prix, des produits utilisés, des précautions et de la prestation acceptée ;
- DIGIYLYFE ne certifie pas la conformité administrative, sanitaire ou professionnelle de l’adhérent.

## Galerie autonome — règle validée

SERVICE / BEAUTÉ reprend une logique comparable à LOC : une petite autonomie propriétaire, limitée au besoin réel du métier.

Parcours :
1. le site public reste propre et ne montre aucune mécanique technique ;
2. un bouton **🔐 Propriétaire** discret déclenche l’authentification Supabase ;
3. `signInWithOtp` utilise `shouldCreateUser:false` ;
4. le magic link redirige vers `gestion-photos.html` ;
5. le propriétaire peut ajouter, remplacer, supprimer et réordonner ses photos ;
6. maximum conseillé : **9 photos**.

## Règle absolue : URL uniquement

**Aucune photo ne doit être envoyée dans Supabase Storage.**

Supabase conserve uniquement :
- `image_url` ;
- `caption` ;
- `position` ;
- `is_active` ;
- `site_slug` pour rattacher la ligne au site.

Le formulaire propriétaire contient un champ `type="url"` et **aucun champ `type="file"`**.

## Conseil à l’abonné

Pour ajouter une photo :
1. héberger la photo sur Google Drive ;
2. choisir **« Toute personne disposant du lien »** en lecture ;
3. copier le lien ;
4. le coller dans la gestion galerie ;
5. contrôler l’aperçu ;
6. valider.

Les liens Drive classiques sont convertis en URL d’affichage pour l’aperçu et la galerie.

## Backend attendu

Le Master prévoit :
- `digiy_service_sites` : identité du site et propriétaire autorisé ;
- `digiy_service_gallery` : URL, légende, ordre et état.

Les politiques RLS doivent reprendre la même doctrine de sécurité que LOC :
- lecture publique uniquement des photos actives nécessaires au site public ;
- lecture/écriture propriétaire uniquement lorsque `auth.uid()` correspond au propriétaire du site ;
- `UPDATE` avec `USING` **et** `WITH CHECK` ;
- aucun `service_role` dans le navigateur.

**Ce push ne crée ni ne modifie le schéma Supabase.** Le backend doit être préparé séparément avant d’activer `gallery.enabled:true` dans une instance client.

## Configuration

Dans `index.html`, rechercher `const CFG`.

Paramètres généraux :
- `brand`
- `territory`
- `currency`
- `accent` / `accent2`
- `hubUrl`
- `joinUrl`
- `professionals[]`

Bloc `gallery` :
- `enabled`
- `siteSlug`
- `supabaseUrl`
- `supabaseKey` (publishable uniquement)
- `table`
- `maxPhotos`

Dans `gestion-photos.html`, configurer le même `SITE_SLUG`.

## Langues

Socle public inclus :

**FR · EN · ES · PT · IT · DE · NL · AR**

L’arabe bascule automatiquement l’interface publique en RTL.

## PWA

Le manifest et les icônes existants sont conservés. Le service worker V2 met en cache uniquement le cœur local du site et laisse les photos externes / Google Drive hors cache applicatif, afin que les changements de galerie apparaissent correctement.

## Règle atelier

Toujours fabriquer une nouvelle instance à partir d’une copie du Master.  
Ne jamais publier le Master lui-même tel quel.
