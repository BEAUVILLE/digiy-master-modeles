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
- `config/countries.json` — registre WORLD des pays actifs et planifiés.
- `config/country-launch-contract.json` — garde d'activation d'un nouveau pays.
- `config/pro-sovereignty-contract.json` — charte de souveraineté du professionnel.
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
- pays désactivé ou planifié jamais public ;
- territoire `active` uniquement ;
- zone `active` uniquement ;
- une zone `planned` n'est jamais publique ;
- une couverture de territoire ne rend jamais automatiquement publique une zone planifiée ;
- une langue d'interface n'active jamais un pays ;
- toute incohérence de configuration bloque l'expansion au lieu d'inventer une donnée ;
- les professionnels continuent de venir de la donnée vivante via l'adaptateur du territoire.

Le Sénégal et la France sont les deux pays actifs du runtime WORLD. L'Espagne, le Portugal, l'Italie, l'Allemagne et les Pays-Bas sont préparés en `planned` avec registre désactivé : aucun de ces pays n'est public avant validation humaine de ses tarifs, paiements, premier territoire et première zone.

## Règle pays

Le pays est la première couche opérationnelle.

Un pays peut définir :

- monnaie ;
- indicatif téléphonique ;
- fuseau horaire ;
- langue par défaut ;
- langues d'interface ;
- langues locales progressives ;
- tarifs ;
- moyens de paiement ;
- territoires disponibles ;
- particularités locales.

Mais il ne possède pas son propre moteur.

## International, multilingue, local

**International par son architecture. Multilingue par son interface. Local par ses territoires.**

Les 8 langues du CORE sont une couche d'interface commune. Elles ne créent pas automatiquement 8 marchés ni 8 pays. Un pays devient public uniquement par validation de sa configuration et activation explicite dans le runtime.

## Souveraineté du professionnel

**DIGIYLYFE ouvre la porte. Le professionnel garde les clés.**

La montée en puissance mondiale du CORE ne doit jamais transformer DIGIYLYFE en système de captivité. La relation commerciale reste directe, les canaux propres du professionnel restent autorisés, son identité peut vivre hors de DIGIYLYFE et les contenus qu'il est en droit de récupérer doivent rester portables dans les limites de la confidentialité, de la sécurité et du droit applicable.

La rétention doit venir de la valeur du service, jamais d'un verrou technique. Le principe CORE reste 0 % commission et aucune future fonction ne doit imposer une intermédiation ou une exclusivité contraire à `config/pro-sovereignty-contract.json` sans révision explicite du MASTER.

## Règle territoire

Un territoire contient des zones et utilise les mêmes familles de besoins.

La donnée doit rester relationnelle :

`country_id → territory_id → zone_id → need/category → professional_id`

Supabase peut être la source opérationnelle. Un secours local éventuel ne devient jamais la source maître.

## Validation d'un nouveau pays

Un nouveau pays est conforme si son lancement peut se faire principalement par :

- ajout de sa configuration ;
- validation de sa monnaie, son indicatif et son fuseau ;
- validation de ses tarifs et moyens de paiement ;
- ajout de son premier territoire et de ses zones ;
- traduction/localisation ;
- connexion de ses données professionnelles ;
- tests téléphone + ordinateur ;
- validation humaine finale.

Si le lancement exige de dupliquer le moteur, le MASTER CORE doit être corrigé avant expansion.

## Activation

Un pays `planned` reste fermé par défaut. Il ne passe en `active` que lorsque les gardes de `config/country-launch-contract.json` sont satisfaites et que `runtime-registry.json` est explicitement activé pour ce pays.

---

**DIGIYLYFE — Le CORE est mondial. Le terrain reste local.**
