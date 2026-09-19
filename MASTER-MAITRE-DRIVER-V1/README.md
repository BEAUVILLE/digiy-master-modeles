# MASTER MAÎTRE DRIVER — V3 · PROPRIÉTAIRE + PROFIL PUBLIC

## Statut

**MASTER MAÎTRE DRIVER — V3 OWNER**

Ce Master fabrique le site personnel d’un chauffeur professionnel avec deux faces strictement séparées :

- `index.html` : fiche publique / PWA du chauffeur ;
- `gestion.html` : espace propriétaire privé, ouvert par email via Supabase Auth.

La galerie DIGIY DRIVER sert à découvrir plusieurs chauffeurs. Ce Master présente et équipe un seul chauffeur.

## Doctrine d’entrée

Le Master DRIVER n’est pas une porte d’inscription.

Le rail commercial unique reste :

**TARIF ADHÉRENT → activation DIGIY PRO → module DRIVER → création du propriétaire → fiche publique + espace privé.**

Ne jamais recréer un formulaire d’inscription DRIVER dans ce Master.

## Architecture propriétaire

### Fiche publique — `index.html`

- identité du chauffeur ;
- prestations ;
- véhicule principal : VOITURE / MINIBUS / BUS ;
- places, bagages, confort ;
- galerie ;
- zones ;
- demande de trajet directe ;
- WhatsApp direct ;
- 8 langues : FR, EN, ES, PT, IT, DE, NL, AR ;
- arabe RTL ;
- PWA légère ;
- bouton discret **ACCÈS PROPRIÉTAIRE** vers `gestion.html` ;
- bloc **LIVE DRIVER** ;
- lecture publique des informations métier autorisées via l’endpoint DIGIY DRIVER.

La fiche publique ne permet aucune écriture.

### Espace propriétaire — `gestion.html`

- Supabase Auth ;
- `signInWithOtp` avec `shouldCreateUser:false` ;
- email pouvant contenir un code OTP ou un magic link selon le template Auth ;
- session persistée ;
- le chauffeur ne voit que sa ligne via RLS ;
- contrôle du `DRIVER_SLUG` actif ;
- gestion de la disponibilité courante ;
- gestion du secteur / position déclarée ;
- gestion du profil de service ;
- carnet privé des courses.

## Informations que le chauffeur peut piloter

- disponibilité : Disponible / Occupé / Indisponible ;
- secteur actuel déclaré ;
- zones desservies ;
- types de trajets / services ;
- nombre de places ;
- capacité bagages ;
- climatisation ;
- langues parlées ;
- ouverture aux demandes du réseau professionnel ;
- tarifs indicatifs facultatifs.

Aucun GPS permanent. Aucune exclusivité. Le chauffeur peut utiliser d’autres canaux ou plateformes.

## Informations sous contrôle DIGIY

Le propriétaire ne modifie pas depuis `gestion.html` :

- son identité validée ;
- son `slug` ;
- son `owner_id` ;
- son statut actif / adhérent ;
- la structure de la fiche ;
- les éléments de marque DIGIY ;
- les données administratives ou de validation.

**DIGIY valide et publie. Le chauffeur pilote son activité.**

## Pont public

Le script :

`assets/driver-public-profile-v1.js`

lit le slug depuis :

`<meta name="digiy-driver-slug" content="[DRIVER_SLUG]">`

et appelle :

`driver-public-presence`

L’endpoint renvoie uniquement les données destinées à être publiques :

- statut effectif ;
- secteur courant ;
- zones de service ;
- services ;
- places ;
- capacité bagages ;
- climatisation ;
- langues ;
- ouverture réseau professionnel ;
- tarifs indicatifs.

La disponibilité expire automatiquement après 4 heures sans mise à jour et revient à **À confirmer**.

## Backend DIGIY DRIVER

Projet Supabase DIGIY CORE :

- table `digiy_driver_master_members` ;
- table `digiy_driver_master_trips` ;
- RPC `digiy_driver_master_list_trips_v1` ;
- RPC `digiy_driver_master_set_presence_v1` ;
- RPC `digiy_driver_master_set_profile_v1` ;
- RPC privée `digiy_driver_master_public_profile_v1`, appelée par l’Edge Function publique ;
- Edge Function `driver-public-presence`.

Les écritures propriétaire nécessitent une session authentifiée et sont limitées au chauffeur propriétaire. La lecture publique passe par l’Edge Function ; le navigateur public n’obtient aucun droit d’écriture.

## Déclinaison obligatoire

Lors de la création d’un nouveau chauffeur :

1. copier le dossier MASTER ;
2. remplacer `[NOM CHAUFFEUR]`, `[DRIVER_SLUG]`, `[CURRENCY]` et le `CFG` public ;
3. créer ou vérifier l’utilisateur dans Supabase Auth ;
4. rattacher `digiy_driver_master_members.owner_id` à son `auth.uid()` ;
5. vérifier `is_active=true` ;
6. autoriser l’URL `gestion.html` dans les Redirect URLs Supabase Auth ;
7. tester l’email magic link / OTP ;
8. tester que le chauffeur ne peut lire et modifier que sa propre fiche ;
9. tester la remontée des champs publics ;
10. tester la fiche sur mobile et la PWA.

## Règle sécurité

Ne jamais exposer de clé `service_role` dans le navigateur.

Le frontend utilise uniquement une clé Supabase publishable. Les opérations publiques nécessitant un accès privilégié restent derrière l’Edge Function.

## Zones — preset Sénégal DRIVER CLIENT

Le preset conserve la logique DRIVER CLIENT validée :

- ✈️ AÉROPORTS
- 🏖️ SALY & PETITE CÔTE
- 🏙️ MBOUR
- 🏙️ DAKAR & BANLIEUE
- 🇸🇳 AUTRES VILLES

Pour France / Europe / autre pays, remplacer le preset de lieux sans changer l’architecture propriétaire.

## Doctrine métier

- contact direct avec le chauffeur ;
- paiement direct au chauffeur ;
- 0 % commission DIGIYLYFE ;
- le chauffeur confirme disponibilité, véhicule, itinéraire et prix final ;
- le chauffeur reste responsable de son activité, de ses obligations, de son assurance, de son véhicule et de la course acceptée ;
- DIGIYLYFE publie la présence numérique et ne transporte pas les passagers.

## Taxonomie

Le Master accepte notamment :

- chauffeur privé ;
- voiture avec chauffeur ;
- minibus avec chauffeur ;
- bus avec chauffeur ;
- transfert ;
- transport sur réservation ;
- mise à disposition avec chauffeur.

Ne pas utiliser TAXI ni JAKARTA dans ce Master.

## Règle atelier

Toujours créer une instance depuis une copie du Master. Ne jamais publier le Master lui-même tel quel.

---

**DIGIYLYFE · MASTER MAÎTRE DRIVER V3 OWNER · 19/09/2026**
