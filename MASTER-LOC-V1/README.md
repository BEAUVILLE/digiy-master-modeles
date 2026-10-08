# MOULE DIGIY LOC — extraction contrôlée

**Référence métier :** [Chez Baptiste — fiche en production](https://part-chez-baptiste.digiylyfe.com/), dépôt source `BEAUVILLE/part-chez-baptiste`, fichier `index.html` (consulté le 8 octobre 2026).

## Statut
Prototype MASTER générique **NON PUBLIÉ**, séparé de Chez Baptiste. Aucune modification au dépôt source ni à la fiche en production. Le prototype est volontairement bloqué tant qu'une configuration réelle n'est pas fournie.

## Structure reprise
- Présentation du logement, photo zoomable, zone, capacité, règles, vidéo
- Calendrier connecté au moteur LOC : `digiy_loc_master_unit_calendar` et `digiy_loc_master_unit_prices`
- Demande directe WhatsApp, téléphone, estimation indicative, paiement direct, 0 % commission
- Retour au réseau DIGIYLYFE et accès propriétaire indépendant

## Configuration obligatoire par propriétaire
`name`, `zone`, `description`, `image`, `tags`, `rules`, `priceNight`, `priceWeek`, `priceMonth`, `maxGuests`, `phoneE164`, `whatsappDigits`, `ownerAccessUrl`, `videoUrl`, `paymentText`, `supabaseUrl`, `supabaseAnonKey` (clé publique uniquement), **`unitId` propre au logement**.

Ne jamais copier l'identifiant d'unité de Chez Baptiste, ses coordonnées, ses médias ou son accès propriétaire. Ne jamais inclure de clé service_role ni de secret.

## Protections
- Sans configuration Supabase complète, **aucune disponibilité affichée comme libre** et WhatsApp de réservation désactivé.
- Échec réseau : le calendrier reste bloqué (pas de faux créneaux).
- Les états `occupied` et `closed` empêchent une demande sur ces dates.
- La demande n'effectue aucune réservation ni aucun paiement.
- La production nécessitera une validation de l'authentification propriétaire, des RLS et des politiques d'accès des tables, plus un essai sur téléphone.

## Ce qui reste avant qualification production
1. Comparaison visuelle sur mobile avec Chez Baptiste, notamment toutes les fonctions de sa fiche complète.
2. Tests d'intégration sur **une unité de test distincte**, y compris jours occupés/fermés, tarifs variables, passage de mois, timezone, erreurs réseau.
3. Validation du parcours propriétaire, des huit langues, de la PWA et des médias, actuellement **non repris intégralement** dans ce prototype.
4. Aucun déploiement ni duplication client avant ces validations.

Ce fichier est une base technique sûre, **pas encore un clone fonctionnel complet de Chez Baptiste**.