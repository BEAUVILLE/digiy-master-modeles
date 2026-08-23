# FAUX ADHÉRENT — DIGIY CARNET TEST 001

## Identité neutre

Le cobaye officiel du MASTER est :

```txt
fixture     : DIGIY-CARNET-TEST-001
slug        : digiy-carnet-test-001
nom visible : ATELIER BAOBAB TEST
pays        : SN
locale      : fr-SN
devise      : XOF
droit prévu : carnet
```

Aucune de ces données ne correspond à une personne ou à un commerce réel.

## Garde actuelle

```txt
Supabase user     : NON CRÉÉ
Magic link envoyé : NON
SQL production    : NON EXÉCUTÉ
PRO CARNET vivant : NON MODIFIÉ
```

L’adresse `carnet-test-001@example.invalid` est volontairement non distribuable. Elle sert uniquement de marqueur tant que le test réel du magic link n’est pas autorisé.

## Jeu terrain prévu

```txt
Vente test     : +25 000 XOF · Wave
Dépense test   : -10 000 XOF · Espèces
Client dû test : 50 000 XOF · CLIENT TEST A
```

Ces valeurs servent à vérifier le cockpit, l’Oreille et Client dû sans injecter de donnée réelle.

## Passage à l’épreuve réelle

Avant le premier magic link réel, remplacer uniquement l’adresse `.invalid` par une boîte de test contrôlée, créer explicitement l’utilisateur de test, lui attribuer le droit `carnet`, puis vérifier `shouldCreateUser:false`.

Ne poser les migrations SQL CARNET qu’après cette préparation et dans l’environnement contrôlé prévu. Ne jamais utiliser le moteur vivant `BEAUVILLE/pro-carnet` comme cobaye.
