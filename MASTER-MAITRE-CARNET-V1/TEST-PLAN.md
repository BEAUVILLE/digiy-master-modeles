# PLAN DE TEST — MASTER MAÎTRE CARNET V1

## Principe

Aucun test ci-dessous ne doit toucher le moteur vivant `BEAUVILLE/pro-carnet` sans validation humaine.

Le MASTER n’est déclaré opérationnel qu’après passage des blocs A à H.

---

## A — Magic link / adhérent

- [ ] email adhérent existant -> magic link reçu ;
- [ ] `shouldCreateUser=false` -> un email inconnu ne crée pas de compte ;
- [ ] lien valide -> session ouverte ;
- [ ] adhérent sans droit CARNET -> refus ;
- [ ] adhérent avec droit CARNET -> HUB ouvert ;
- [ ] déconnexion -> accès privé fermé ;
- [ ] aucune donnée sensible dans l’URL.

## B — Cloisonnement des données

Avec deux utilisateurs de test A et B :

- [ ] A ne voit aucun mouvement de B ;
- [ ] A ne voit aucune dette de B ;
- [ ] A ne peut pas rembourser une dette de B ;
- [ ] anon ne lit ni mouvements privés ni échéanciers ;
- [ ] les nouveaux RPC CARNET sont exécutables par `authenticated` uniquement.

## C — 1 geste = 1 trace

Créer un mouvement avec un `client_id/source_id` fixe :

- [ ] premier envoi -> 1 ligne ;
- [ ] deuxième envoi identique -> même ID renvoyé ;
- [ ] double clic rapide -> 1 seule ligne ;
- [ ] reprise après coupure -> 1 seule ligne ;
- [ ] resynchronisation de la file offline -> aucun doublon.

## D — Caisse / CA du jour

Cas de test :

1. vente 25 000 Wave ;
2. dépense 10 000 espèces ;
3. vente 15 000 Orange Money.

Attendu :

```txt
CA jour       = 40 000
Entrées jour  = 40 000
Sorties jour  = 10 000
Net jour      = 30 000
Wave entrée   = 25 000
OM entrée     = 15 000
Cash sortie   = 10 000
```

- [ ] aucun transfert ou apport ne gonfle le CA ;
- [ ] aucun mouvement `void` n’entre dans les totaux.

## E — Client dû

Créer :

```txt
Client : Mamadou
Téléphone : 77 000 00 00
Somme due : 50 000
```

Attendu à la création :

```txt
DÛ        = 50 000
REMBOURSÉ = 0
RESTE     = 50 000
CA        = inchangé
Entrées   = inchangées
```

Puis :

### Remboursement 1

```txt
10 000 Wave
```

Attendu :

```txt
REMBOURSÉ = 10 000
RESTE     = 40 000
Entrées   += 10 000
CA        += 10 000
Wave      += 10 000
```

### Remboursement 2

```txt
15 000 Espèces
```

Attendu :

```txt
REMBOURSÉ = 25 000
RESTE     = 25 000
Entrées   += 15 000
CA        += 15 000
Cash      += 15 000
```

### Remboursement final

```txt
25 000 Orange Money
```

Attendu :

```txt
REMBOURSÉ = 50 000
RESTE     = 0
STATUT    = paid
Entrées   += 25 000
CA        += 25 000
OM        += 25 000
```

- [ ] un remboursement supérieur au reste est refusé ;
- [ ] un double clic remboursement ne crée pas deux entrées ;
- [ ] nom + téléphone restent visibles dans l’échéancier ;
- [ ] dette initiale jamais comptée comme cash.

## F — Oreille

Tester voix et saisie texte :

```txt
Vente 25 000 Wave
Gasoil 15 000 espèces
Vente 30 000 Orange Money
```

Attendu :

- [ ] montant reconnu ;
- [ ] mode reconnu ;
- [ ] entrée/sortie correcte ;
- [ ] motif préparé ;
- [ ] statut reste `draft` avant confirmation ;
- [ ] aucun enregistrement automatique ;
- [ ] après validation humaine -> 1 trace seulement.

## G — Offline / PWA

- [ ] ouvrir le CARNET connecté ;
- [ ] couper le réseau ;
- [ ] ouvrir les pages déjà mises en cache ;
- [ ] préparer une trace ;
- [ ] confirmer -> trace placée en file locale si le serveur est inaccessible ;
- [ ] remettre le réseau ;
- [ ] synchroniser ;
- [ ] trace retirée de la file uniquement après succès ;
- [ ] aucune duplication après recharge de page ;
- [ ] version de cache PWA correcte après mise à jour.

## H — WORLD8

Langues :

```txt
FR EN ES PT IT DE NL AR
```

Pour chaque langue :

- [ ] HUB lisible ;
- [ ] Jour lisible ;
- [ ] Oreille lisible ;
- [ ] Client dû lisible ;
- [ ] choix conservé entre écrans ;
- [ ] aucun débordement mobile ;
- [ ] arabe en RTL ;
- [ ] montants et données ne sont jamais traduits/modifiés par la couche langue.

---

## Validation finale

Le MASTER peut passer de :

```txt
EN CONSTRUCTION CONTRÔLÉE
```

à :

```txt
MASTER MAÎTRE CARNET OPÉRATIONNEL
```

uniquement après :

- tests A à H validés ;
- revue humaine ;
- test sur téléphone réel ;
- test magic link réel ;
- test de coupure réseau réel ;
- contrôle qu’aucun secret ou identifiant client réel n’est présent dans le coffre.
