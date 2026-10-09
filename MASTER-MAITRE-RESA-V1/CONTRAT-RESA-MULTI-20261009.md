# DIGIY MASTER & MAÎTRE — Contrat d'héritage RÉSA MULTI
**Révision : 9 octobre 2026 · Référence métier · Aucune activation production impliquée**

## Sources vérifiées
Le portail RÉSA MULTI vit dans [BEAUVILLE/digiy-resa-table-resto](https://github.com/BEAUVILLE/digiy-resa-table-resto). Les PR #1 à #16 de ce dépôt ont été vérifiées comme **fusionnées**. Le code présent sur `main` ne démontre ni le déploiement public ni une conformité sécurité définitive.

Le **MASTER propriétaire transversal** est `MASTER-MAITRE-RESA-V1/`. Il conserve son rail tarif adhérent → DIGIY PRO → capacité RÉSA → propriétaire authentifié → visibilité publique approuvée. Sa liaison Auth utilise `digiy_resa_profiles.auth_user_id`. L'ancien champ `owner_id` a une fonction de rattachement commercial distincte : ne jamais les confondre ni modifier leur sens sans audit SQL.

### Doctrine
**RÉSA MULTI est une porte de découverte et de transmission vers le moteur métier, pas une caisse ni un moteur universel.** Une demande ne vaut pas réservation confirmée. Paiement et contact directs, 0 % commission.

## Éléments métier et limites

| Métier | Preuves fusionnées | Héritage autorisé | Contrôles nécessaires |
|---|---|---|---|
| DRIVER | [#3](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/3) à [#8](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/8) | Rediriger vers la fiche chauffeur publique / profil DRIVER MASTER ; contact direct | Disponibilité et URL publique réelles ; ne jamais exposer la console propriétaire |
| RESTO | [#1](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/1) et [#2](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/2) | Orienter vers le moteur tables `BEAUVILLE/digiy-resto` | Ne pas dupliquer zones, services, tables, no-show ou fuseaux |
| BEAUTY pilote | [#9](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/9), [#10](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/10) | Référence pour la spécialisation BEAUTY, jamais un adhérent fictif | Ne jamais utiliser `test-resa-beauty-saly` comme défaut sur une nouvelle instance |
| BEAUTY gestion | [#11](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/11), [#12](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/12), [#15](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/15) | Prestations/tarifs, créneaux, demandes reçues, confirmation/refus propriétaire | Auth, permission RPC, rattachement et RLS serveur, accès croisés |
| BEAUTY public | [#13](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/13), [#14](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/14) | Prestations → semaine glissante sept jours → créneau disponible → demande | Tests concurrents anti-doublon, date/fuseau et mobile |
| SEO des fiches | [#16](https://github.com/BEAUVILLE/digiy-resa-table-resto/pull/16) | JSON-LD `Service` des seules fiches `REAL` | Exclure `DEMO` et confirmer la véracité des fiches |

Sur `digiy-resa-table-resto/index.html` au 9 octobre, **3 entrées chauffeurs REAL** et **7 objets DEMO** ont été constatés. Un libellé traduit annonce encore « 6 exemples » : corriger séparément ce décalage après vérification, sans inventer de professionnels ou changer artificiellement le nombre de fiches.

### Vigilance sur le gestionnaire propriétaire V1 existant
Un contrôle ciblé du code `MASTER-MAITRE-RESA-V1/gestion.html` montre une session Auth et des requêtes filtrées par `slug`, **sans contrôle explicite `auth_user_id` dans ce JavaScript**. Cela ne prouve pas une vulnérabilité (les règles RLS peuvent faire le contrôle), mais ne permet pas non plus de conclure que l'isolation entre propriétaires est vérifiée. **Obligation avant instanciation :** contrôler les politiques RLS et les droits SQL exécutés réellement pour `digiy_resa_profiles`, `digiy_resa_slots`, `digiy_resa_bookings`, avec sessions owner A/B et accès anonyme. Aucun changement de sécurité prod n'est effectué ici.

## Instructions de clonage et de validation

1. Vérifier d'abord l'identité et le métier réels, l'abonnement et les prestations autorisées.
2. Créer un identifiant de profil/site propre à l'adhérent ; rattacher explicitement `auth_user_id` à la session Auth. Ne pas supposer que `owner_id` vaut partout `auth.uid()`.
3. Auditer les fonctions RPC, RLS, droits `EXECUTE`, requêtes, contrôles de propriétaire, `search_path` et tests négatifs. Une condition JavaScript seule n'est pas une barrière serveur.
4. Tester client/propriétaire A et B, anonymes, lecture croisée, annulation, confirmation/refus, créneau passé, changement de fuseau et double réservation simultanée.
5. Isoler le contact privé et les coordonnées clients des pages publiques et des données structurées.
6. Faire valider et activer chaque fiche par son professionnel ; conserver la **confirmation humaine directe**.
7. Ne publier aucun élément DEMO comme un professionnel réel.

## Frontières canoniques
- RESTO : tables, capacité, services, no-show, restauration ; son MASTER V31–V35 et ses éditeurs de carte ont leur propre contrat.
- LOC : hébergement/location avec ses propres calendriers et règles.
- DRIVER : fiche, trajet et contact direct ; aucune réservation payante ni tarif routier inventé.
- BEAUTY : prestations, tarifs, disponibilités, rendez-vous et confirmation/refus.
- RÉSA MULTI : porte commune multi-métiers avec modèle de présence, sans caisse, sans collecte de paiement et sans commission.
- WORLD8 sur la vitrine selon les traductions effectivement fournies ; ne pas en déduire que chaque cockpit métier est traduit.

## Statut d'activation
Le présent **portage est documentaire et réutilisable** : il n'installe aucun nouveau RPC, aucune migration, aucun script Supabase, aucune instance BEAUTY ni commande client. Les états exacts machine-lisibles figurent dans `capabilities-resa-multi.json`.

**Avant toute généralisation** : audit de sécurité réel, tests mobiles E2E, vérification des URLs DRIVER et RESTO, anti-double-réservation, validation propriétaire et approbation humaine. La fusion de ce contrat n'est **pas** une mise en production de ces fonctionnalités.
