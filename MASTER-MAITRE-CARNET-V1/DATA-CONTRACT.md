# CONTRAT DE DONNÉES — MASTER MAÎTRE CARNET V1

## But

Définir **une seule langue technique** pour DIGIY CARNET avant de porter le moteur historique.

L’interface, l’Oreille, le store, Supabase et les futurs pays doivent parler ce contrat. Les noms historiques `PAY`, `pro`, `om` ne sont que des adaptations de compatibilité.

---

## 1. Mouvement confirmé

Un mouvement financier confirmé suit cette forme logique :

```js
{
  id: "uuid-ou-null-avant-sync",
  client_id: "uuid/idempotence-local",
  member_slug: "slug-instance",
  scope: "activity",
  direction: "in",
  kind: "sale",
  category: "vente",
  channel: "wave",
  amount: 25000,
  currency: "XOF",
  label: "Vente",
  note: "",
  source_module: "CARNET",
  source_id: null,
  origin: "manual",
  occurred_at: "ISO-8601",
  status: "posted",
  meta: {}
}
```

### Champs obligatoires avant confirmation

- `client_id`
- `scope`
- `direction`
- `kind`
- `channel`
- `amount > 0`
- `currency`
- `label`
- `occurred_at`

Le brouillon vocal peut être incomplet. Le mouvement **confirmé** ne l’est pas.

---

## 2. Scope canonique

Visible et canonique :

```txt
activity
personal
```

Compatibilité moteur historique :

```txt
activity -> pro
personal -> perso
```

Ne jamais utiliser `savings` comme scope.

L’épargne est un `kind` ou une fonction métier, pas une troisième poche cachée.

---

## 3. Direction

```txt
in
out
```

Une dette à recevoir n’a **pas** de direction financière tant qu’elle n’est pas encaissée. Elle appartient au modèle `receivable`, séparé des mouvements confirmés.

---

## 4. Kind canonique

```txt
sale        vente / recette commerciale
expense     dépense
refund      remboursement
transfer    transfert
saving      mise en réserve / épargne
withdrawal  retrait
adjustment  correction contrôlée
```

### Règle CA

```txt
CA DU JOUR = somme des mouvements :
scope=activity + direction=in + kind=sale + status=posted + date=jour
```

Aucun `refund`, `transfer`, apport ou autre entrée ne gonfle le CA.

---

## 5. Channel canonique

```txt
wave
orange_money
cash
bank
card
sendwave
other
```

Libellés :

```txt
wave          -> Wave
orange_money  -> Orange Money
cash          -> Espèces / Cash
bank          -> Banque / Virement
card          -> Carte
sendwave      -> Sendwave
other         -> Autre
```

### Adaptateur legacy actuel

La table historique utilise :

```txt
orange_money -> om
card         -> other
sendwave     -> other
```

Tant que le backend historique reste en place, l’adaptateur fait cette traduction. Le contrat canonique, lui, ne change pas.

---

## 6. Origin

Canonique :

```txt
manual
voice
module_sync
offline_sync
system
```

Adaptateur legacy actuel :

```txt
voice        -> manual + meta.input="voice"
offline_sync -> manual + meta.input="offline_sync"
```

On ne modifie pas la contrainte historique avant migration testée.

---

## 7. Statut mouvement

Canonique :

```txt
draft
queued
posted
void
sync_error
```

Seuls les mouvements `posted` entrent dans les totaux financiers.

Le backend historique ne connaît actuellement que `posted|void`. Les autres états restent dans la couche locale / file de synchronisation jusqu’à migration du schéma.

---

## 8. Créance / dette client

Une créance est un objet séparé :

```js
{
  id: "uuid",
  member_slug: "slug-instance",
  client_name: "",
  client_phone: "",
  amount_due: 50000,
  amount_paid: 20000,
  currency: "XOF",
  status: "partial",
  due_date: null,
  note: "",
  created_at: "ISO-8601"
}
```

Statuts :

```txt
open
partial
paid
cancelled
```

### Règle absolue

Créer une créance **ne crée jamais une entrée d’argent**.

Lors d’un règlement réel :

1. enregistrer le paiement de la créance ;
2. créer un vrai mouvement `direction=in` ;
3. lier le mouvement à la créance ;
4. recalculer `amount_paid` et le statut.

---

## 9. Idempotence offline

Chaque mouvement créé sur appareil reçoit un `client_id` unique avant synchronisation.

Le backend doit pouvoir refuser une seconde insertion du même `client_id` pour le même adhérent.

Objectif :

```txt
1 geste terrain = 1 trace durable
```

Même après coupure réseau, fermeture de page ou double appui.

---

## 10. Résumé du jour

Le store expose :

```js
{
  salesRevenue: 0, // CA strict
  income: 0,       // toutes entrées confirmées
  expenses: 0,
  net: 0,
  receivableOpen: 0,
  byChannel: {
    wave: { in: 0, out: 0 },
    orange_money: { in: 0, out: 0 },
    cash: { in: 0, out: 0 }
  }
}
```

### Formules

```txt
income   = somme direction=in, posted
expenses = somme direction=out, posted
net      = income - expenses
CA       = direction=in + kind=sale + posted
```

Les créances ouvertes sont affichées séparément et ne touchent ni `income`, ni `net`, ni `CA` avant paiement.

---

## 11. Validation humaine

Le contrat interdit qu’un texte vocal devienne directement `posted`.

Flux :

```txt
VOIX / CLIC
   ↓
DRAFT
   ↓
APERÇU
   ↓
VALIDATION ADHÉRENT
   ↓
POSTED / QUEUED OFFLINE
```

**La VOIX est au-dessus de l’ACTION. L’humain reste au-dessus de la validation.**
