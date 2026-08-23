# PORTAGE — PRO-CARNET → MASTER MAÎTRE CARNET V1

## But

Transformer le moteur vivant `BEAUVILLE/pro-carnet` en moule universel sans recopier les éléments historiques qui doivent disparaître côté utilisateur.

## Références fonctionnelles déjà confirmées

### À conserver

- cockpit mobile ;
- entrées / sorties ;
- net du jour ;
- solde / situation ;
- modes Wave / OM / Cash et modes configurables ;
- mouvements / historique ;
- dette client / à recevoir ;
- preuve / note ;
- saisie rapide ;
- Oreille / voix ;
- validation humaine ;
- sauvegarde / export ;
- séparation activité / privé seulement si cette fonction reste validée pour CARNET final.

### À ne pas propager tel quel

- porte PIN historique ;
- libellés visibles `PRO CARNET`, `PAY`, `Oreille PAY` ;
- identités ou exemples personnels inscrits en dur ;
- clé locale portant un nom personnel ;
- URL, téléphone ou slug réel ;
- double source de vérité locale + Supabase ;
- anciennes routes de session devenues inutiles ;
- raccourcis historiques non nécessaires au CARNET final.

## Inventaire moteur de référence

### `app/index.html`

Référence principale d’interface mobile.

Contient notamment :

- situation du jour ;
- entrées jour ;
- sorties jour ;
- net jour ;
- Wave / OM / Cash ;
- saisie ;
- journal ;
- libellés ;
- contacts ;
- sauvegarde ;
- données locales dans la version actuelle.

### `frais.html`

Référence de saisie rapide locale.

À utiliser comme source d’UX, pas comme deuxième stockage final.

### `mouvements.html`

Référence de lecture des mouvements Supabase via RPC historique.

### `admin.html`

Référence d’insertion / suppression des mouvements via RPC historique.

### `oreille.html`

Page de travail vocal dédiée.

### `assets/js/oreille-metier-core.js`

Socle voix / écoute navigateur / formulation.

### `assets/js/oreille-pay.js`

Logique financière historique : montant, type, mode, lieu, source, client, téléphone, détail, preuve.

Les noms `PAY` peuvent rester dans les fichiers techniques si leur renommage apporte un risque supérieur au bénéfice.

## Nouvelle porte

Le MASTER remplace la logique d’entrée par :

```txt
adhérent → droit CARNET → magic link → session Supabase → app
```

Le magic link doit utiliser :

```js
shouldCreateUser:false
```

Le MASTER ne crée pas un utilisateur inconnu automatiquement.

## Adapter les données

Créer une couche d’adaptation unique entre l’interface et le stockage.

API logique attendue :

```js
CarnetStore.listMovements()
CarnetStore.insertMovement(payload)
CarnetStore.updateMovement(id, payload)
CarnetStore.deleteMovement(id)
CarnetStore.getDailySummary()
CarnetStore.queueOffline(payload)
CarnetStore.syncOffline()
```

L’interface ne doit plus savoir si la donnée vient directement d’un RPC, d’une table ou du cache offline.

## Source de vérité

Décision V1 :

```txt
Supabase = durable
localStorage / IndexedDB = cache + brouillons + file offline
```

Chaque mouvement synchronisé doit porter un identifiant durable et un identifiant client/idempotence pour éviter les doublons.

## CA du jour

Ne pas confondre :

```txt
Entrées jour = toutes les entrées confirmées
CA jour = ventes/recettes commerciales confirmées seulement
Sorties jour = dépenses confirmées
Net jour = entrées jour - sorties jour
```

Le MASTER peut afficher les quatre si la catégorie `vente` est correctement renseignée.

## Commercialisation

La vitrine publique reste un autre dépôt / une autre porte.

Parcours cible :

```txt
VITRINE PUBLIQUE CARNET
        ↓
ADHÉRENT / SOUSCRIPTION
        ↓
DROIT CARNET ACTIF
        ↓
MAGIC LINK
        ↓
INSTANCE CARNET PRIVÉE
```

Tarif Sénégal prévu si lancement : **19 900 FCFA / mois**, tarif unique.

## Ordre de portage

1. figer la doctrine ;
2. créer configuration neutre ;
3. créer garde magic link ;
4. créer `CarnetStore` unique ;
5. porter le cockpit ;
6. porter saisie rapide ;
7. porter Oreille ;
8. porter dettes / preuves ;
9. porter offline + sync ;
10. PWA ;
11. WORLD8 ;
12. test faux adhérent ;
13. comparaison avec moteur vivant ;
14. validation humaine ;
15. seulement ensuite déclarer le MASTER opérationnel.

## Interdiction

Ne jamais faire du dépôt `pro-carnet` un modèle par simple duplication. Le MASTER doit être **plus neutre, plus propre et plus sûr** que l’instance historique.
