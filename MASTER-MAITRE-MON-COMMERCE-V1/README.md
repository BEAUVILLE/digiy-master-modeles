# MASTER MAÎTRE MON COMMERCE — V2

## Rôle
Moule universel DIGIYLYFE pour les commerces locaux : boutique, épicerie, mode, maison, artisanat commercial et autres vitrines de produits.

MON COMMERCE reste une **vitrine commerciale / présence numérique directe**.  
Ce MASTER ne devient ni une caisse, ni un panier centralisé, ni un logiciel métier, ni un système de paiement DIGIYLYFE.

## Doctrine
- contact direct avec le commerçant ;
- paiement direct au commerçant ;
- 0 % commission DIGIYLYFE ;
- prix, stock, retrait, livraison, paiement et disponibilité restent sous la responsabilité du commerçant ;
- le commerçant peut faire vivre lui-même les informations qui changent souvent ;
- DIGIYLYFE ne certifie pas le commerce et n’encaisse pas la vente.

## Autonomie propriétaire — magic link
Le MASTER comprend maintenant une autonomie légère dans le même esprit que SERVICE / BEAUTÉ :

1. bouton public discret **🔐 Accès propriétaire** ;
2. email propriétaire autorisé ;
3. `signInWithOtp` avec `shouldCreateUser:false` ;
4. redirection vers `gestion-produits.html` ;
5. gestion limitée aux produits.

Le commerçant peut :
- ajouter un produit ;
- modifier son nom ;
- modifier sa description courte ;
- modifier son prix ;
- modifier sa disponibilité ;
- ajouter ou remplacer la photo principale **par URL** ;
- activer / masquer un produit ;
- réordonner ;
- supprimer.

## Limites validées
- jusqu’à **50 produits** ;
- **1 photo principale par produit** ;
- galerie d’ambiance séparée : **9 photos maximum** ;
- aucune photo stockée dans Supabase.

## Règle photo — URL uniquement
**Aucun upload photo dans Supabase Storage.**

Conseil à l’abonné :
1. héberger la photo sur Google Drive ;
2. choisir **« Toute personne disposant du lien »** en lecture ;
3. copier le lien ;
4. le coller dans l’espace propriétaire ;
5. vérifier l’aperçu ;
6. valider.

Les liens Drive classiques sont convertis en URL d’affichage. Supabase conserve seulement l’URL et les métadonnées produit.

## Sortie propriétaire
Un visiteur curieux ne doit jamais rester bloqué :
- bouton `✕` ;
- bouton **Fermer et revenir au commerce** ;
- clic hors de la fenêtre ;
- touche `Échap` ;
- dans `gestion-produits.html` : **Retour au commerce** et **Déconnexion**.

## Backend attendu
Le MASTER prévoit, sans créer le schéma dans ce push :
- `digiy_commerce_sites` : `slug`, `name`, propriétaire autorisé ;
- `digiy_commerce_products` : `site_slug`, `name`, `description`, `price_label`, `stock_label`, `image_url`, `position`, `is_active`.

RLS attendue :
- lecture publique uniquement des produits actifs nécessaires au site public ;
- lecture/écriture propriétaire uniquement sur son commerce ;
- `UPDATE` avec `USING` et `WITH CHECK` ;
- aucun `service_role` dans le navigateur.

## Fichiers
- `index.html`
- `gestion-produits.html`
- `manifest.webmanifest`
- `sw.js`
- `icon-192.png`
- `icon-512.png`
- `README.md`

## Langues
**FR · EN · ES · PT · IT · DE · NL · AR**. L’arabe active automatiquement le RTL.

## PWA
Manifest, service worker et icônes 192/512 inclus. `gestion-produits.html` fait partie du socle PWA du MASTER.

## Règle atelier
1. Toujours partir d’une copie du MASTER.
2. Garder `masterMode:true` et `noindex,nofollow` dans le coffre.
3. Configurer `siteSlug`, URL Supabase et clé publishable dans l’instance.
4. Ne jamais inventer prix, stock, paiement ou livraison.
5. Tester WhatsApp, magic link, retour au commerce, CRUD produits, URLs photos, mobile, 8 langues, RTL et PWA.
6. Ne publier une instance qu’après validation humaine.
