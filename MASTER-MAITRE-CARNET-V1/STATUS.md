# ÉTAT DU MASTER MAÎTRE CARNET V1

Date du jalon : 23 août 2026

## Statut

**EN CONSTRUCTION CONTRÔLÉE — NE PAS DÉPLOYER TEL QUEL.**

Aucune migration SQL du dossier `sql/` n’a été exécutée en production pendant ce jalon.

## Posé dans le MASTER

- porte adhérent par magic link Supabase ;
- `shouldCreateUser: false` ;
- contrôle du droit CARNET après session ;
- HUB privé : Jour / Oreille / Client dû ;
- cockpit : CA jour / Entrées / Sorties / Net ;
- modes : Wave / Orange Money / Espèces / Banque / autres configurables ;
- contrat de données canonique CARNET ;
- adaptateur temporaire vers le backend historique PAY ;
- idempotence générale par `client_id/source_id` ;
- file offline séquentielle avec conservation du même identifiant ;
- Oreille MASTER : voix ou texte -> brouillon -> validation humaine -> mouvement ;
- CLIENT DÛ : nom + téléphone facultatif + somme due + échéance facultative ;
- remboursements successifs ;
- DÛ / REMBOURSÉ / RESTE ;
- chaque remboursement confirmé crée obligatoirement une vraie entrée CARNET ;
- double appui remboursement protégé par idempotence ;
- PWA légère ;
- WORLD8 centralisé : FR / EN / ES / PT / IT / DE / NL / AR ;
- arabe RTL ;
- choix de langue mémorisé.

## Doctrine CLIENT DÛ validée

```txt
CLIENT
+ TÉLÉPHONE si connu
+ SOMME DUE
+ DATE / ÉCHÉANCE facultative
        ↓
REMBOURSEMENT 1
REMBOURSEMENT 2
REMBOURSEMENT 3
        ↓
RESTE = 0 -> PAYÉ
```

La dette initiale ne crée aucun encaissement.

Chaque remboursement confirmé :

- augmente les Entrées du jour ;
- augmente le Net du jour ;
- augmente le canal réellement reçu ;
- entre dans le CA encaissé du jour ;
- diminue le reste dû ;
- reste lié au même échéancier client.

## Règle CA du MASTER

Le MASTER suit une logique terrain de **CA encaissé** :

- vente payée immédiatement -> CA au moment de l’encaissement ;
- vente laissée en « client dû » -> pas de CA encaissé au moment de la dette ;
- chaque remboursement réel du client dû -> CA encaissé pour la somme effectivement reçue ce jour-là.

Une somme n’est jamais comptée deux fois.

## Ce qui reste interdit avant validation

- exécuter `sql/001_magic_link_bridge.sql` en production ;
- exécuter `sql/002_receivables.sql` en production ;
- remplacer le CARNET vivant ;
- retirer le PIN du moteur historique avant test du magic link ;
- commercialiser le MASTER ;
- annoncer une lecture automatique de Wave ou Orange Money ;
- considérer la PWA offline comme validée sans test réel de coupure/résynchronisation.

## Prochain jalon

1. finir WORLD8 sur Jour / Oreille / Client dû ;
2. poser tests de parité et sécurité ;
3. créer un faux adhérent de test ;
4. tester magic link ;
5. poser les SQL dans un environnement contrôlé ;
6. tester 1 geste = 1 trace ;
7. tester Client dû + remboursements ;
8. tester voix ;
9. tester coupure réseau ;
10. seulement ensuite décider si le MASTER devient opérationnel.

---

**DIGIYLYFE — Le terrain parle. CARNET garde la trace. L’humain décide.**
