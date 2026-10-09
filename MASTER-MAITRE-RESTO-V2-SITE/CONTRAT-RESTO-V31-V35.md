# CONTRAT MASTER / MAÎTRE RESTO — Héritage V31 à V35 (09/10/2026)

## Source et périmètre

**Source de réalisation métier :** `BEAUVILLE/digiy-resto`, notamment :

- [PR #19](https://github.com/BEAUVILLE/digiy-resto/pull/19) — V31 audit des permissions propriétaires, **brouillon non fusionné** ; audit ≠ correctif prod.
- [PR #21](https://github.com/BEAUVILLE/digiy-resto/pull/21) — V32 créneaux dans le passé selon le fuseau, **brouillon non fusionné**.
- [PR #24](https://github.com/BEAUVILLE/digiy-resto/pull/24) — V34 commande à emporter sans caisse, **brouillon non fusionné et activation verrouillée**.
- [PR #26](https://github.com/BEAUVILLE/digiy-resto/pull/26) — CTA « À EMPORTER » des vraies fiches, **fusionnée**, flux réel encore restreint.
- [PR #29](https://github.com/BEAUVILLE/digiy-resto/pull/29) — accès propriétaire depuis les vraies fiches, **fusionnée**.
- [PR #30](https://github.com/BEAUVILLE/digiy-resto/pull/30) — routage Auth par site sans repli vers TEST SALY, **fusionnée**.
- [PR #31](https://github.com/BEAUVILLE/digiy-resto/pull/31) — V35A éditeur hebdomadaire protégé, **fusionnée** (brouillons locaux).
- [PR #32](https://github.com/BEAUVILLE/digiy-resto/pull/32) — plats et salades individuels, **fusionnée** (aperçu local validé).
- [PR #33](https://github.com/BEAUVILLE/digiy-resto/pull/33) — accès direct à chaque éditeur, **fusionnée**.

**Ce coffre est un modèle générique, pas une instance authentifiée ni un site client.** Le site complet `index.html` et les cinq éléments PWA sont préservés.

## Deux capacités indépendantes : jamais des formules obligatoires

1. **Plats du jour** : jusqu'à sept jours de préparation, jours de la semaine, midi/soir, devise, photo vraie facultative et prix réel facultatif. Un plat d'hier ne reste jamais artificiellement « disponible ».
2. **Plats & Salades à la carte** : uniquement deux catégories, `plats` et `salades` ; plats individuels, photos, descriptions, prix réels facultatifs. Pas de menus composés, pas de formules forcées, pas d'écrasement des plats du jour.

Les écrans et fichiers portés *à l'identique fonctionnellement* se trouvent dans `ATELIER-V35/` :

- `index.html` : sélection des deux modes de démonstration, sans connexion ni sauvegarde.
- `plats-du-jour.html`, `plats-du-jour.js`, `weekly-core.js` : logique locale V35 de la semaine, cohérence des jours et fuseaux.
- `plats-salades.html` : l'aperçu interactif **validé par le fondateur** dans RESTO, autonomie locale.

Pour tester, ouvrir `ATELIER-V35/index.html` dans une copie du modèle. Les deux brouillons sont temporaires, séparés, et non publiés. **Il ne s'agit PAS d'une interface propriétaire autorisée** ; aucune sécurité Auth ne peut être inférée de la simple maquette.

## Contrat propriétaire V35 — pour une future instance

Le fonctionnement réel doit rester dans le moteur métier RESTO :

1. Partir d'une **fiche propre au restaurateur**, avec le bon `site`/slug ; jamais de site test par défaut et jamais d'URL MASTER propriétaire rendue publique.
2. Obtenir la session Supabase Auth réelle, appeler `auth.getUser()`, vérifier que la ligne du site appartient à cet utilisateur (`owner_id === user.id`) **avant** de charger les éditeurs dans un espace authentifié. Vérifier le RLS et toutes les RPC côté serveur : le contrôle navigateur seul ne suffit pas.
3. Afficher les **deux accès séparés** : « MES PLATS DU JOUR » et « MES PLATS & SALADES ». Dans `digiy-resto`, `resa-resto/ma-carte.html?site=<slug>&vue=semaine|carte` sélectionne le bon éditeur **après** vérification propriétaire ; ne pas copier sa liste de slugs TEST/clients dans ce modèle universel.
4. Ajouter ensuite seulement, avec revue spécifique, une sauvegarde brouillon serveur liée au `site_id`, au propriétaire, aux permissions RLS, à l'historique de validation ; stockage photos authentifié et isolé.
5. Publier uniquement une **version approuvée** par le restaurateur, avec prix et disponibilités vérifiés. Les brouillons ne deviennent **jamais** publics automatiquement. Toute désactivation ou suppression doit révoquer l'accès public et le cache si applicable.

Pas de `service_role` dans le navigateur ; pas de droits SQL/RPC ajoutés par ce portage ; pas de fausse validation sécurité. Le modèle ne contient aucune identité, numéro de téléphone ou tarif client réel.

## À emporter (séparé de la réservation de table)

- Le restaurant choisit volontairement s'il accepte l'emporter et les produits concernés.
- CTA sur **sa fiche** ; prix, modalités, contact et confirmation **directs**.
- Flux « demande → validation du restaurateur → paiement direct » ; aucune commande automatique, aucune collecte DIGIYLYFE, **aucun logiciel de caisse**, **0 % commission**.
- Les PR RESTO #24 et #26 ont des états différents : l'aperçu CTA n'autorise pas à déclarer la prise de commandes ouverte.

## Compatibilité et invariants

- **Site MASTER complet** : accueil, histoire, galerie, infos, horaires, carte de site statique, QR, contact, PWA et WORLD8 restent en place.
- Le **menu du site statique historique** dans `CFG.menu` n'est pas automatiquement alimenté par les maquettes locales. La future passerelle doit attendre les données publiées et approuvées ; aucun transfert implicite des contenus.
- Le moteur de réservation de table garde ses contraintes métier : service 1/2 facultatif, zones/tables optionnelles, 15 minutes de tolérance, protections no-show, créneaux et fuseau réels. Ne pas les substituer par la gestion générique `MASTER-MAITRE-RESA-V1`.
- La couche `MASTER-MAITRE-RESA-V1` est transversale ; elle reste un contrat général de rendez-vous, **pas** le moteur spécialisé RESTO.
- Conserver la doctrine : relation et paiement directs, aucune caisse, aucune commission, pas de données simulées publiées comme réelles.

## Épreuve obligatoire avant clonage d'une instance

1. Tester localement les deux éditeurs, photos et prix XOF/EUR, mémoire volatile, effacement, refus de fichiers invalides et publication désactivée.
2. Confirmer que le site vitrine `index.html` n'expose **aucun bouton propriétaire non authentifié** et que ses informations restent conformes au dossier du client.
3. Contrôler les liens de fiche, redirections Auth, `owner_id`, RLS, droits RPC, fuite de champs clients, cache PWA et isolation multi-sites.
4. Sur une instance staging : tester réservations et tables sans régression ; tester l'emporter seulement s'il a été explicitement activé.
5. Obtenir la validation humaine sur mobile, puis publier. Pas de fusion automatique dans un autre dépôt.

**Loi d'héritage :** le MASTER transporte les capacités éprouvées ; le MAÎTRE conserve les règles ; chaque instance ne reçoit que les fonctions activées et validées pour son métier.
