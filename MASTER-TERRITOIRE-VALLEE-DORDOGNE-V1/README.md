# 🇫🇷 DIGIYLYFE — MASTER TERRITOIRE PÉRIGORD · VALLÉE DE LA DORDOGNE V1

**Statut : TERRITOIRE ACTIF PILOTE — V1**

Ce dossier configure le territoire **Périgord · Vallée de la Dordogne** sous le MASTER PAYS FRANCE. Il ne contient pas un nouveau moteur.

## Arbre

**FRANCE → PÉRIGORD · VALLÉE DE LA DORDOGNE → ZONE → BESOIN → PROFESSIONNEL → OUVRIR**

## Identité territoire

- `country_id` : `FR`
- `territory_id` : `FR-DORDOGNE`
- slug : `vallee-dordogne`
- statut : `active`
- route publique : `https://digiylyfe.com/territoire.html?zone=vallee-dordogne`

## Zone V1

- `FR-DORDOGNE-SARLAT` — Sarlat-la-Canéda — `sarlat` — active — zone pilote de référence

Aucune autre zone n'est ajoutée sans validation explicite.

## Identité visuelle V1

Le moteur reste commun. L'empreinte locale est distincte :

- pierre blonde de Sarlat ;
- vert forêt du Périgord Noir ;
- bleu-vert rivière Dordogne ;
- or DIGIYLYFE.

Configuration : `config/visual-identity-v1.json`.

Règle : **MÊME MOTEUR · MÊME ADN DIGIYLYFE · EMPREINTE LOCALE DISTINCTE.**

## Projection commerciale V1

Doctrine appliquée : **LE VIDE NE S’AFFICHE PAS. IL SE PROJETTE.**

- les professionnels réels restent prioritaires ;
- les exemples sont clairement identifiés et ne comptent jamais comme adhérents ;
- 9 besoins CORE × 3 projections = 27 exemples ;
- chaque projection peut ouvrir une démo neutre avant l'adhésion ;
- LA VOIX reste un moteur de recherche transversale, jamais une fiche métier ;
- un vrai professionnel actif passe devant les projections.

Configuration : `config/projection-examples-v1.json`.

Parcours prospect :

**TERRITOIRE → EXEMPLE → DÉMO → ADHÉSION**

Parcours client :

**TERRITOIRE → BESOIN → ZONE → PRO RÉEL → VITRINE → CONTACT DIRECT**

## Validation pilote Sarlat

Un contrôle lecture seule de la production a été effectué le 23 août 2026 :

- 3 professionnels publics actifs basés dans la zone Sarlat ;
- 0 besoin CORE non résolu ;
- 0 URL publique manquante ;
- 1 présence `accommodation` ;
- 2 présences `food`.

Aucune identité professionnelle réelle n'est conservée dans ce MASTER. Le rapport agrégé est stocké dans `validation/sarlat-pilot-readonly-2026-08-23.json`.

## Discipline

1. Ne jamais copier le moteur pour ce territoire.
2. La production reste source de vérité.
3. La zone et le besoin restent des filtres distincts.
4. L'ancrage réel du professionnel n'est jamais modifié par sa couverture.
5. Dédupliquer par `professional_id`.
6. L'action générique reste **OUVRIR**.
7. Les exemples ne deviennent jamais des adhérents sans donnée réelle + validation humaine.
8. L'identité visuelle locale ne modifie jamais le CORE.

---

**DIGIYLYFE PÉRIGORD · VALLÉE DE LA DORDOGNE — Le territoire rapproche.**
