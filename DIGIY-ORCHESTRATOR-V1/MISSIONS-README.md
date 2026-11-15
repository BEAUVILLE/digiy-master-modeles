# DIGIY ORCHESTRATOR V1 — Bureau interne des missions

Le **CORE reste l'autorité**. Ce bureau est un consommateur du snapshot de `orchestrator.py`, pas un deuxième orchestrateur autonome ni un nouvel outil à financer. Il ne requiert que Python 3 (bibliothèque standard).

**Doctrine** : LE CORE VOIT · LES CAPACITÉS FONT · L'IA RELIE · L'HUMAIN GOUVERNE.

## Chaîne d'une mission

1. **CORE** : exécute l'audit préexistant, charge les registres autoritaires, produit le snapshot standard `state / alerts / relations / priorities`.
2. **Éclaireur** : accepte uniquement une mission codifiée, avec des capacités déjà déclarées dans le snapshot CORE.
3. **Contrôleur** : classe les constats en `bloque`, `attention`, `inconnu` et `ok` ; un CORE en échec met obligatoirement `NO_GO`.
4. **Maître** : reçoit un rapport sans secrets, sans identité privée et sans autorisation implicite d'agir.

Les trois rôles ne sont **pas** des modèles IA autonomes : ils matérialisent aujourd'hui notre protocole interne de travail. Chaque mission conserve la responsabilité humaine.

## Exécution interne

Depuis la racine de `digiy-master-modeles` :

```sh
python3 DIGIY-ORCHESTRATOR-V1/orchestrator.py . --output /tmp/digiy-core-snapshot.json
python3 DIGIY-ORCHESTRATOR-V1/mission_board.py \
  --snapshot /tmp/digiy-core-snapshot.json \
  --mission DIGIY-ORCHESTRATOR-V1/mission_exemple.json
python3 -m unittest discover -s DIGIY-ORCHESTRATOR-V1 -p 'test_mission_board.py' -v
```

Le `mission_board.py` ne lance pas de réseau, ne lit pas Supabase, ne déclenche pas de processus ni d'actions. Il lit les deux fichiers locaux transmis et écrit seulement le rapport dans la sortie standard.

## Contrat de sécurité

- Mission : budget supplémentaire **strictement zéro**, `actions_autorisees: []`, `validation_maitre: false`.
- Une capacité absente du CORE est rejetée ; MARKET n'est pas réintroduit.
- Les contrôles sont de simples codes et états : **aucun texte libre**, aucun numéro, aucun mot de passe, aucun détail de faille, aucun chemin d'accès externe.
- Les preuves disponibles dans une mission sont **toujours réputées non vérifiées indépendamment**. Un accord des travailleurs ne vaut jamais approbation.
- `NO_GO` si le CORE est bloqué ou qu'un contrôle est `bloque` ; `A_VERIFIER` pour les inconnues ou alertes ; `A_RELIRE` sinon, sans droit de déployer.
- **Jamais** de paiement, de fusion, de message WhatsApp, de modification propriétaire ni d'écriture SQL par le bureau.

## Domaines pilotes

`LOC`, `RESA` dans la mission d'exemple, et les autres capacités seulement si elles figurent dans le registre CORE. **Le dossier de sécurité LOC actif n'est pas publié ici** : il reste dans les fichiers privés de l'atelier et continue de bloquer tout changement en production.

## Réalités et limites

La suite locale comporte **26 tests Python** et s'exécute sur des snapshots de test construits selon le contrat réel. Le bureau n'a pas encore été exécuté ici sur l'intégralité d'un checkout MASTER authentique : la branche conserve la commande de reproduction et la PR reste brouillon. Les signaux métier ne sont pas récoltés automatiquement. Le bureau ne certifie pas un audit de sécurité.

**Aucune fusion de cette PR sans autorisation nouvelle du fondateur.**
