# DIGIY ORCHESTRATOR V1 🦅🌍

Couche de survol **lecture seule** au-dessus du MASTER CORE existant.

## Doctrine

**LE CORE VOIT · LES CAPACITÉS FONT · L'IA RELIE · L'HUMAIN GOUVERNE**

DIGIY ORCHESTRATOR n'est ni un nouveau module métier, ni un nouveau moteur territorial, ni un rail commercial parallèle.

Il observe les sources autoritaires déjà existantes, contrôle leur cohérence, relie les signaux utiles et produit une vue d'ensemble exploitable par un humain ou un agent.

## Position dans l'architecture

```
MASTER CORE WORLD
  ↓
PAYS → TERRITOIRE → ZONE → BESOIN → PROFESSIONNEL → OUVRIR
  ↓
données vivantes / Supabase / MCP public
  ↓
DIGIY ORCHESTRATOR V1
  ↓
état global · anomalies · relations · priorités · prochaines vérifications
  ↓
validation humaine
```

Les capacités métier restent dans leur maison :

- DRIVER
- LOC
- RESA
- COMMERCE
- BUILD
- JOB
- EXPLORE
- CARNET
- RESTO

L'orchestrateur ne fusionne pas ces capacités. Il les lit et les relie.

## V1 — limites obligatoires

La V1 est strictement **READ ONLY**.

Interdits :

- aucune écriture Supabase ;
- aucun paiement ;
- aucune réservation écrite ;
- aucune modification d'un professionnel ;
- aucune action propriétaire ;
- aucune activation commerciale ;
- aucune modification automatique du MASTER ;
- aucune géographie inventée ;
- aucune donnée privée.

Toute incohérence est signalée, jamais corrigée automatiquement.

## Sources V1

1. `MASTER-CORE-WORLD-V1/config/runtime-registry.json`
2. `MASTER-CORE-WORLD-V1/config/runtime-contract.json`
3. `MASTER-CORE-WORLD-V1/config/capabilities.json`
4. `MASTER-CORE-WORLD-V1/config/needs.json`
5. `MASTER-CORE-WORLD-V1/config/pro-sovereignty-contract.json`
6. `DIGIY-MCP-V1/contracts/tools.json`
7. runtime public DIGIYLYFE lorsqu'il est explicitement fourni à l'outil.

## Sortie attendue

L'orchestrateur produit un snapshot JSON avec quatre blocs :

- `state` — ce qui est actif et lisible ;
- `alerts` — incohérences ou dérives doctrinales ;
- `relations` — liens détectables entre géographie, besoins et capacités ;
- `priorities` — ordre de vérification proposé, sans action automatique.

## Premier garde transversal

La doctrine active dit que **MARKET est hors service** et que **COMMERCE / MON COMMERCE** reprend cette fonction.

L'audit V1 vérifie donc qu'aucun registre de capacités ne réactive MARKET par erreur.

## Usage local

Depuis la racine du dépôt :

```bash
python3 DIGIY-ORCHESTRATOR-V1/orchestrator.py .
```

Pour écrire le snapshot :

```bash
python3 DIGIY-ORCHESTRATOR-V1/orchestrator.py . --output /tmp/digiy-orchestrator-snapshot.json
```

Le script utilise uniquement la bibliothèque standard Python.

## Étape suivante après validation V1

Une fois la lecture globale jugée fiable :

1. ajouter des adaptateurs READ ONLY par capacité ;
2. raccorder le quai public MCP ;
3. produire un état vivant multi-capacités ;
4. garder toutes les mutations derrière validation humaine explicite.

---

**DIGIYLYFE — voir l'ensemble sans confisquer les maisons.**
