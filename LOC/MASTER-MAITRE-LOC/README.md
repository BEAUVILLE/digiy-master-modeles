# MASTER MAÎTRE LOC — V2

Moule universel DIGIYLYFE pour hébergements et location directe. Aucun nom client, aucun domaine client, aucun téléphone réel, aucun prix réel et aucune date de disponibilité réelle ne sont conservés dans le MASTER.

## Fonctionnement
- hero et présentation du logement ;
- galerie ;
- calendrier **dynamique basé sur la date réelle du jour** ;
- aucune vieille date codée en dur ;
- dates occupées/fermées uniquement via `blockedDates` / `closedDates` ;
- demande directe WhatsApp ou email ;
- paiement direct au propriétaire/hébergeur ;
- 0 % commission DIGIYLYFE ;
- QR de l’instance ;
- PWA légère.

## Langues
FR · EN · ES · PT · IT · DE · NL · AR, avec RTL automatique pour l’arabe.

## Configuration
Renseigner `CFG` : identité, ville/pays, type d’hébergement, description, devise et prix si fournis, capacité, horaires, WhatsApp/email, adresse, moyen de paiement, équipements, photos et disponibilités. Les valeurs de prix sont volontairement neutres dans le coffre.

## Règles
1. `masterMode:true` et `noindex,nofollow` dans le coffre.
2. Ne jamais inventer prix, disponibilité, moyen de paiement ou condition de séjour.
3. Le propriétaire/hébergeur confirme lui-même la réservation.
4. DIGIYLYFE ne perçoit pas le paiement du séjour.
5. Toujours tester dates, boutons, mobile, 8 langues, RTL et PWA avant publication d’une copie.
