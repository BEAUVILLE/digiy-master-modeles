# MASTER CORE WORLD V1 🌍🦅

Moule technique de référence pour l'architecture mondiale DIGIYLYFE.

## Arbre maître

**CORE MONDIAL → PAYS → TERRITOIRE → ZONE → BESOIN → PROFESSIONNEL → OUVRIR**

Ce dossier ne doit jamais devenir une copie d'un site pays. Il décrit la structure commune que les pays configurent.

## Règles techniques

1. Un seul moteur de rendu territorial.
2. Aucun fork complet du moteur pour lancer un pays.
3. Les pays, territoires, langues et monnaies sont des données de configuration.
4. Les professionnels restent dans la donnée vivante ; ils ne sont pas figés dans le MASTER.
5. Les capacités métier sont séparées de la géographie.
6. L'action territoriale générique est `OUVRIR`.
7. WhatsApp, Appeler et autres actions directes gardent leur nom explicite.
8. Le MASTER reste neutre : aucune identité client, aucun secret, aucune donnée personnelle réelle.

## Configuration V1

- `config/languages.json` — socle multilingue commun.
- `config/countries.json` — pays pilotes et paramètres locaux.
- `config/territories.json` — instantané de compatibilité historique ; ne doit plus être la source runtime prioritaire.
- `config/needs.json` — familles universelles visibles au visiteur.
- `config/capabilities.json` — capacités internes activables derrière un professionnel.
- `config/runtime-contract.json` — contrat de découverte automatique.
- `config/runtime-registry.json` — registre des pays raccordables au runtime.
- `runtime/core-runtime.js` — loader générique pays → territoire → zones → besoins.

## Runtime auto-raccordable V1

Le moteur ne doit plus contenir de listes géographiques écrites à la main.

La découverte suit désormais :

`runtime-registry → MASTER PAYS → MASTER TERRITOIRE → zones actives → besoins CORE`

Le registre indique où se trouvent la configuration pays, la liste des territoires et, lorsqu'il existe, le garde géographique du pays. Le MASTER PAYS pointe ensuite vers le MASTER TERRITOIRE concerné. Le territoire fournit ses zones actives. Les besoins viennent du CORE.

Règles de sécurité du runtime :

- pays présent et activé dans le registre ;
- territoire `active` uniquement ;
- zone `active` uniquement ;
- une zone `planned` n'est jamais publique ;
- une couverture de territoire ne rend jamais automatiquement publique une zone planifiée ;
- toute incohérence de configuration bloque l'expansion au lieu d'inventer une donnée ;
- les professionnels continuent de venir de la donnée vivante via l'adaptateur du territoire.

Le premier raccord automatique est le Sénégal / Petite Côte. La France reste volontairement hors du registre automatique V1 tant qu'un MASTER PAYS FRANCE équivalent n'est pas posé ; le moteur public existant n'est pas modifié par cette étape.

## Règle pays

Le pays est la première couche opérationnelle.

Un pays peut définir :

- monnaie ;
- langue par défaut ;
- langues d'interface ;
- langues locales progressives ;
- format de contact ;
- territoires disponibles ;
- particularités locales.

Mais il ne possède pas son propre moteur.

## Règle territoire

Un territoire contient des zones et utilise les mêmes familles de besoins.

La donnée doit rester relationnelle :

`country_id → territory_id → zone_id → need/category → professional_id`

Supabase peut être la source opérationnelle. Un secours local éventuel ne devient jamais la source maître.

## Validation d'un nouveau pays

Un nouveau pays est conforme si son lancement peut se faire principalement par :

- ajout de sa configuration ;
- ajout de ses territoires et zones ;
- traduction/localisation ;
- connexion de ses données professionnelles ;
- tests téléphone + ordinateur.

Si le lancement exige de dupliquer le moteur, le MASTER CORE doit être corrigé avant expansion.

## Porte suivante

Le runtime V1 est posé dans le MASTER et ne touche pas encore `digiylyfe.com/territoire.html`.

La prochaine porte consiste à remplacer dans le moteur public les constantes géographiques codées en dur par ce loader, sans changer les routes publiques, la logique métier, les professionnels, les liens directs ni les filtres déjà validés.

---

**DIGIYLYFE — Le CORE est mondial. Le terrain reste local.**
