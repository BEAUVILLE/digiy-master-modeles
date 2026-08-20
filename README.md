# DIGIY MASTER MODÈLES

Coffre des **MASTER MAÎTRE opérationnels DIGIYLYFE**.

Ce dépôt contient les moules techniques prêts à être copiés, configurés et adaptés pour un nouveau client ou un nouveau territoire.

## Séparation des coffres

- `BEAUVILLE/digiy-master` = doctrine, règles, méthodes, agents et standards.
- `BEAUVILLE/digiy-master-modeles` = modèles techniques / MASTER MAÎTRE.
- Les dépôts clients et modules publics restent séparés et ne servent jamais de coffre maître.

## Règle d'architecture

**1 métier = 1 MASTER MAÎTRE universel.**

Le pays n'est pas un nouveau MASTER : Sénégal, France ou autre pays sont des configurations du même moule.

## Arborescence

```text
LOC/
└── MASTER-MAITRE-LOC/
    ├── README.md
    └── index.html
```

D'autres familles pourront être ajoutées ensuite : BUILD, COMMERCE, DRIVER, RESTO, HOTEL, etc.

## Discipline

1. Ne jamais travailler directement sur un site client pour fabriquer un nouveau modèle.
2. Le MASTER doit rester neutre : aucun nom client définitif, aucun CNAME, aucun domaine de production, aucune donnée personnelle réelle.
3. Toute déclinaison client part d'une copie du MASTER.
4. Le MASTER ne devient jamais automatiquement un site en production.
5. Toute évolution majeure du MASTER est testée avant d'être propagée.

---

DIGIYLYFE — Le moule reste maître, le terrain reste humain.
