# ÉTAT DU MASTER MAÎTRE CARNET V1

Date du jalon : 23 août 2026

## Statut

**EN CONSTRUCTION CONTRÔLÉE — NE PAS DÉPLOYER TEL QUEL.**

Aucune migration SQL du dossier `sql/` n’a été exécutée en production pendant ce jalon.

Le moteur vivant `BEAUVILLE/pro-carnet` n’a pas été modifié par le jalon WORLD8 du MASTER.

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
- choix de langue mémorisé ;
- écran Jour branché sur WORLD8 ;
- écran Oreille branché sur WORLD8 avec locale micro par langue ;
- écran Client dû branché sur WORLD8 ;
- runtime WORLD8 des trois écrans inclus dans le cache PWA ;
- parseur Oreille élargi aux 8 langues et aux formats `25 000`, `25,000`, `25.000` et chiffres arabes ;
- faux adhérent neutre préparé dans `tests/faux-adherent.fixture.json` ;
- identité de test : `ATELIER BAOBAB TEST` / `digiy-carnet-test-001` ;
- aucune adresse réelle, aucun utilisateur Supabase réel et aucun magic link envoyé à ce stade.

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

## Contrôle WORLD8 du jalon

Le branchement technique est posé sur Jour / Oreille / Client dû.

Un contrôle automatique du parseur Oreille a passé les 8 cas suivants :

```txt
FR  Gasoil 15 000 espèces
EN  Fuel 25,000 cash
ES  Combustible 15.000 efectivo
PT  Despesa 12 500 cartão
IT  Vendita 25.000 Wave
DE  Treibstoff 15.000 bar
NL  Brandstof 15.000 contant
AR  وقود ٢٥٠٠٠ نقدا
```

La validation visuelle humaine reste obligatoire avant le premier test réel d’authentification : lisibilité mobile, changement de langue entre les trois écrans, persistance, débordements et RTL arabe.

## Ce qui reste interdit avant validation

- exécuter `sql/001_magic_link_bridge.sql` en production ;
- exécuter `sql/002_receivables.sql` en production ;
- remplacer le CARNET vivant ;
- retirer le PIN du moteur historique avant test du magic link ;
- créer ou utiliser un vrai adhérent sans étape de test contrôlée ;
- commercialiser le MASTER ;
- annoncer une lecture automatique de Wave ou Orange Money ;
- considérer la PWA offline comme validée sans test réel de coupure/résynchronisation.

## Prochain jalon

1. validation visuelle humaine WORLD8 sur Jour / Oreille / Client dû ;
2. remplacer uniquement l’adresse `.invalid` du faux adhérent par une boîte de test contrôlée ;
3. créer explicitement l’utilisateur Supabase de test ;
4. attribuer le droit `carnet` ;
5. tester le magic link avec `shouldCreateUser:false` ;
6. poser les SQL dans un environnement contrôlé ;
7. tester 1 geste = 1 trace ;
8. tester Client dû + remboursements ;
9. tester voix et coupure réseau ;
10. seulement ensuite décider si le MASTER devient opérationnel.

---

**DIGIYLYFE — Le terrain parle. CARNET garde la trace. L’humain décide.**