# MASTER MAÎTRE LOC — V3 · ARCHITECTURE SARLAT

Ce MASTER reprend la logique validée de **SARLAT CHEZ BAPTISTE**.

## Architecture

### `index.html` — site public
- vraie vitrine d’hébergement ;
- galerie et informations ;
- calendrier dynamique à partir de la date réelle ;
- lecture publique du suivi Supabase ;
- **Disponible** = aucune ligne pour le jour ;
- `occupied` = Occupé ;
- `closed` = Fermé ;
- dates passées désactivées ;
- demande directe au propriétaire ;
- 0 % commission ;
- paiement direct ;
- 8 langues + RTL arabe ;
- PWA ;
- un seul bouton **Accès propriétaire** discret ;
- ce bouton déclenche directement `signInWithOtp` depuis l’index ;
- l’email envoyé contient le code ou le magic link selon le template Supabase ;
- `emailRedirectTo` pointe vers `gestion.html`.

### `gestion.html` — suivi propriétaire
- page privée séparée ;
- Supabase Auth ;
- `signInWithOtp` avec `shouldCreateUser:false` ;
- email pouvant fournir un **code OTP ou un magic link** ;
- session persistée ;
- le propriétaire ne voit que son site via RLS ;
- sélection d’une date ou d’une période ;
- trois états :
  - 🟢 Disponible → suppression des lignes du calendrier ;
  - 🔴 Occupé → `status='occupied'` ;
  - ⚫ Fermé → `status='closed'` ;
- mise à jour immédiate du calendrier public.

## Tables utilisées
- `digiy_loc_master_sites`
- `digiy_loc_master_units`
- `digiy_loc_master_unit_calendar`

## Déclinaison obligatoire
Dans `index.html` : identité, ville, pays, type, contacts, prix si fourni, photos, équipements et `masterUnitId`.

Dans `gestion.html` : renseigner `SITE_SLUG`.

Dans Supabase :
1. le propriétaire existe dans Auth ;
2. `digiy_loc_master_sites.owner_id` correspond à son `auth.uid()` ;
3. au moins une unité active existe ;
4. le redirect URL de `gestion.html` est autorisé dans Supabase Auth.

## Doctrine
Le calendrier prépare et suit les disponibilités. Le propriétaire confirme la réservation, les conditions et le prix final. DIGIYLYFE ne collecte pas le paiement du séjour et ne prend pas de commission.

## Règle UX publique
- aucun texte technique sur magic link / Supabase / gestion propriétaire dans le parcours client ;
- un seul accès propriétaire discret dans le header public ;
- toute l’explication de gestion reste dans `gestion.html` et la documentation atelier.

Le MASTER reste `noindex,nofollow` et ne doit jamais être publié tel quel.
