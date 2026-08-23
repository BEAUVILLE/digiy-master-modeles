# MASTER MAÎTRE CARNET — V1

## Statut

**SOCLE MAÎTRE EN CONSTRUCTION CONTRÔLÉE — NE PAS DÉPLOYER TEL QUEL.**

Ce dossier prépare le moule universel DIGIYLYFE de **DIGIY CARNET**. Il ne remplace pas le moteur vivant `BEAUVILLE/pro-carnet` tant que la parité fonctionnelle, l’accès magic link et la source de vérité des données ne sont pas validés.

## Rôle

DIGIY CARNET est un logiciel terrain de **trace financière et de mémoire d’activité**.

Il aide l’adhérent à voir simplement :

- entrées du jour ;
- sorties du jour ;
- net du jour ;
- mouvements par mode : Wave, Orange Money, espèces/cash, banque, carte, Sendwave ou autre selon pays ;
- dettes / sommes à recevoir ;
- règlements partiels ou totaux ;
- preuves et notes ;
- historique ;
- saisie rapide ;
- préparation par la voix / Oreille ;
- validation humaine avant rangement définitif.

## Doctrine absolue

DIGIY CARNET :

- n’est pas une banque ;
- n’est pas un wallet custodial ;
- n’encaisse pas l’argent du commerçant ;
- ne confirme jamais seul qu’un paiement a été reçu ;
- ne transforme jamais une dette en cash avant règlement réel ;
- ne vend ni ne revend les données économiques de l’adhérent ;
- garde la trace, éclaire la situation et laisse l’humain décider.

**L’argent reste chez l’adhérent. CARNET garde la mémoire. L’humain valide.**

## Doctrine commerciale

CARNET est un **logiciel optionnel**, séparé de l’adhésion DIGIYLYFE.

- Il n’existe plus d’« Espace Pro » commercial.
- L’utilisateur est un **adhérent**.
- L’adhésion seule ne donne pas automatiquement CARNET.
- Si CARNET est commercialisé : **tarif public unique prévu = 19 900 FCFA / mois** au Sénégal, sans grille Essentiel / Pro / Business.
- Aucun tarif ne doit être activé dans une instance tant que la commercialisation n’a pas été validée humainement.
- La vitrine publique CARNET reste séparée du moteur privé.

## Accès — doctrine cible

Le MASTER CARNET cible :

1. adhérent connu ;
2. droit CARNET actif ;
3. email autorisé ;
4. magic link Supabase ;
5. ouverture du CARNET privé ;
6. aucune donnée sensible dans l’URL.

Pour le magic link :

```js
supabase.auth.signInWithOtp({
  email,
  options: {
    shouldCreateUser: false,
    emailRedirectTo: redirectTo
  }
})
```

Le MASTER neuf ne doit pas introduire de nouveau PIN.

Les noms techniques historiques `PAY`, `digiy_pay_pro_*`, `oreille-pay.js` peuvent rester sous le capot tant qu’ils servent un moteur stable. Ils ne doivent pas dicter le vocabulaire visible.

## Source de vérité — règle maître

Le moteur historique contient des parties locales et des parties Supabase. Le MASTER ne doit pas recopier ce mélange sans décision.

### Cible V1

- **Supabase = source de vérité durable** des mouvements autorisés de l’adhérent.
- **Local = cache / brouillon / secours offline**, jamais deuxième livre de caisse indépendant.
- Une trace locale non synchronisée doit être identifiable comme telle.
- Une trace synchronisée doit recevoir un identifiant durable.
- Aucun doublon ne doit pouvoir être créé lors d’une resynchronisation.

## Calculs terrain

Le MASTER doit distinguer clairement :

- **Entrées jour** = toutes les entrées confirmées du jour ;
- **Sorties jour** = toutes les sorties confirmées du jour ;
- **Net jour** = entrées jour − sorties jour ;
- **CA / ventes jour** = uniquement les mouvements classés comme ventes/recettes commerciales si cette métrique est affichée.

Ne jamais appeler automatiquement « chiffre d’affaires » une somme qui mélange vente, apport, remboursement, avance ou autre entrée non commerciale.

## Modes d’argent

Les modes sont configurables par pays et par instance.

Base Sénégal :

```txt
Wave
Orange Money
Espèces / Cash
Banque / Virement
Carte
Sendwave
Autre
```

CARNET trace le **mode déclaré**. Il ne lit pas automatiquement un compte Wave ou Orange Money et ne prétend pas vérifier un paiement sans preuve / confirmation.

## Oreille / voix

Doctrine :

**La VOIX au-dessus de l’ACTION.**

Exemple :

```txt
« Vente 25 000 Orange Money »
```

CARNET peut préparer :

```txt
type = entrée
catégorie = vente
montant = 25 000
mode = Orange Money
statut = brouillon à confirmer
```

Le pro historique devient l’adhérent côté vocabulaire visible :

**L’Oreille écoute → DIGIY formule → l’adhérent vérifie → l’adhérent valide → CARNET range.**

## Architecture cible du MASTER

```txt
MASTER-MAITRE-CARNET-V1/
├── README.md
├── PORTAGE.md
├── master-config.js
├── index.html              # porte magic link / contrôle droit CARNET
├── app/                    # moteur privé après validation
├── assets/
├── manifest.webmanifest
├── sw.js
├── icon-192.png
└── icon-512.png
```

Le moteur `app/` n’est déclaré prêt que lorsque les tests de parité sont terminés.

## PWA

Le MASTER final doit inclure :

- manifest ;
- service worker ;
- icônes 192/512 ;
- ouverture mobile propre ;
- fonctionnement dégradé/offline contrôlé ;
- aucune confusion entre brouillon offline et donnée synchronisée.

## Langues

Socle WORLD8 :

**FR · EN · ES · PT · IT · DE · NL · AR**

L’arabe active RTL. Les modes monétaires et libellés métier sont des données configurables, pas du texte figé dans le moteur.

## Règle atelier

1. Ne jamais modifier `BEAUVILLE/pro-carnet` pour fabriquer le MASTER.
2. Lire le moteur vivant comme référence.
3. Porter uniquement les fonctions validées.
4. Supprimer du visible `PRO` / `PAY` sans renommer aveuglément les identifiants techniques stables.
5. Remplacer la porte PIN par magic link dans le MASTER, pas dans le moteur vivant avant test.
6. Unifier la source de vérité avant propagation.
7. Tester téléphone, magic link, session, offline, resynchronisation, Wave/OM/cash, voix, dettes, preuves, entrées/sorties/net jour et historique.
8. Aucun déploiement client avant validation humaine.

---

**DIGIYLYFE — Le terrain parle. CARNET garde la trace. L’humain décide.**
