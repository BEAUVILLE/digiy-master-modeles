# AUDIT MOTEUR HISTORIQUE — AVANT PORTAGE CARNET

Date de contrôle : 23 août 2026.

## Conclusion

Le moteur `BEAUVILLE/pro-carnet` est une bonne référence fonctionnelle, mais **il ne doit pas être copié brut comme MASTER**.

Plusieurs générations techniques coexistent :

- interface principale locale ;
- pages Supabase par RPC ;
- ancien PIN ;
- vocabulaire PAY / PRO ;
- contraintes SQL qui ne correspondent pas toujours aux valeurs acceptées par les RPC.

Le MASTER sert précisément à absorber ces écarts.

## 1. Deux mémoires concurrentes

### Local

`app/index.html` et `frais.html` utilisent une base locale / `localStorage` pour les mouvements.

### Supabase

`mouvements.html` et `admin.html` utilisent :

```txt
digiy_pay_pro_list_movements
digiy_pay_pro_insert_movement
digiy_pay_pro_delete_movement
digiy_pay_pro_summary
```

### Décision MASTER

```txt
Supabase = source durable
Local = cache / brouillon / file offline
```

Aucune instance MASTER ne doit maintenir deux livres de caisse indépendants.

## 2. Accès historique

Le contrôle actuel `digiy_pay_pro_check_access` fonctionne avec :

```txt
slug + téléphone + droit PAY
```

Les nouveaux accès DIGIYLYFE sont orientés magic link.

### Décision MASTER

```txt
auth.uid() -> digiy_profiles -> droit CARNET -> moteur
```

Le téléphone n’est plus demandé au navigateur comme clé d’accès.

Le fichier `sql/001_magic_link_bridge.sql` prépare cette transition sans casser les RPC historiques.

## 3. Fonctions historiques privilégiées

Les fonctions PAY historiques sont `SECURITY DEFINER` et possèdent actuellement des droits d’exécution larges, y compris `anon`.

Cela correspond à l’ancienne porte PIN / téléphone mais ne doit **pas** être la doctrine du MASTER magic link.

### Décision MASTER

Les nouveaux RPC CARNET :

- vérifient `auth.uid()` ;
- refusent l’utilisateur non authentifié ;
- ne sont exécutables que par `authenticated` ;
- gardent les RPC PAY historiques derrière eux pendant la transition.

Ne pas révoquer brutalement les anciens RPC en production tant que le moteur vivant les utilise encore.

## 4. Incohérence Orange Money

Le RPC historique d’insertion accepte / produit :

```txt
orange_money
```

La contrainte actuelle de `digiy_pay_movements.channel` accepte :

```txt
wave
om
cash
bank
other
```

Donc `orange_money` et `om` ne sont pas harmonisés.

### Décision MASTER

Utiliser un identifiant canonique unique.

Recommandation MASTER :

```txt
orange_money
```

avec adaptation vers `om` uniquement si l’ancien backend l’exige pendant la transition.

Ne pas modifier la contrainte de production avant test de migration.

## 5. Incohérences `kind`

Le RPC historique traite certains types différemment de la contrainte SQL.

La table accepte notamment :

```txt
sale
expense
withdrawal
saving
refund
transfer
adjustment
```

Le RPC historique normalise vers une liste plus courte et peut produire `other`, qui n’est pas accepté par la contrainte actuelle.

### Décision MASTER

Définir un vocabulaire canonique commun à l’interface, au store et à la base avant portage.

## 6. Incohérences `scope`

Le RPC historique peut manipuler :

```txt
pro
perso
personal
savings
```

La table actuelle accepte :

```txt
pro
perso
```

### Décision MASTER

Côté visible :

```txt
activité
perso
```

Côté technique legacy :

```txt
pro
perso
```

L’épargne doit être un `kind` ou une fonction métier claire, pas un faux `scope` si la table ne le supporte pas.

## 7. Dettes clients

Aucune table / RPC Supabase dédié aux dettes clients n’a été retrouvé lors du contrôle.

Le moteur historique contient la doctrine et des éléments locaux, mais le backend principal `digiy_pay_movements` ne représente pas proprement une créance non encaissée.

### Décision MASTER

Ne jamais enregistrer une dette client comme une entrée `posted`.

Avant MASTER opérationnel, choisir l’un des deux modèles :

1. table dédiée `carnet_receivables` ; ou
2. extension contrôlée du modèle mouvements avec un état `receivable/pending` réellement supporté par les contraintes et les calculs.

La solution doit préserver la règle :

**Dette à recevoir ≠ argent encaissé.**

## 8. CA du jour

Le moteur historique calcule déjà :

```txt
entrées jour
sorties jour
net jour
```

Mais le MASTER doit distinguer :

```txt
CA jour = kind sale uniquement
Entrées jour = toutes les entrées confirmées
```

Un remboursement, un apport ou un transfert entrant ne doit pas gonfler le CA.

## 9. Données observées

Au moment de l’audit, les mouvements présents utilisent principalement :

```txt
kind : sale / expense
scope : pro
channel : wave / cash / other
```

Cela permet de nettoyer le modèle avant d’introduire Orange Money, dettes, offline sync et nouveaux usages à grande échelle.

## 10. Ordre recommandé

1. magic link + bridge authentifié ;
2. dictionnaire canonique `channel/kind/scope` ;
3. store unique Supabase ;
4. CA jour correct ;
5. dette client ;
6. offline/cache ;
7. Oreille ;
8. PWA ;
9. WORLD8 ;
10. test faux adhérent ;
11. seulement ensuite MASTER opérationnel.

---

**Règle : ne pas réparer le moteur vivant au hasard. Le MASTER devient la version propre ; la migration du vivant se fait seulement après preuve.**
