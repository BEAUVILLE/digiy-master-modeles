# 🇸🇳 DIGIYLYFE — MASTER TERRITOIRE SINÉ-SALOUM V1

**Statut : TERRITOIRE PLANIFIÉ — V1**

Ce dossier prépare le territoire **Siné-Saloum** sous le **MASTER PAYS SÉNÉGAL**.

Il ne crée pas un nouveau moteur. Il réserve une configuration territoire propre sous le CORE mondial.

## Références

- CORE mondial : `../MASTER-CORE-WORLD-V1/`
- Pays Sénégal : `../MASTER-PAYS-SENEGAL-V1/`
- Doctrine territoire : `BEAUVILLE/digiy-master/MASTER-TERRITOIRE.md`

## Arbre

**SÉNÉGAL → SINÉ-SALOUM → ZONE → BESOIN → PROFESSIONNEL → OUVRIR**

## Identité territoire

- `country_id` : `SN`
- `territory_id` : `SN-SINE-SALOUM`
- Slug : `sine-saloum`
- Statut : `planned`
- Publication publique : non activée

## État de la production

Au contrôle du 23 août 2026, aucune zone correspondant à Siné-Saloum ni aux localités candidates recherchées n'a été trouvée dans `digiy_zones`.

Le MASTER prépare donc uniquement le territoire. Il n'invente aucune zone active, aucun professionnel et aucun résultat public.

## Règle d'activation

Avant activation :

1. valider les zones terrain qui appartiennent réellement au territoire DIGIYLYFE Siné-Saloum ;
2. créer ou identifier ces zones dans la donnée de production ;
3. leur attribuer des `zone_id` canoniques stables ;
4. vérifier les zones de base et zones d'intervention des professionnels ;
5. exécuter les audits lecture seule ;
6. seulement ensuite passer le territoire ou ses zones de `planned` à `pilot` ou `active`.

## Discipline

- Aucun moteur ne doit être copié depuis Petite Côte.
- Les besoins et capacités restent hérités du CORE.
- Les professionnels réels restent dans Supabase, jamais dans ce MASTER.
- Une couverture d'un autre territoire ne doit pas rendre Siné-Saloum actif par simple déduction.
- L'action publique générique restera **OUVRIR** lorsque le territoire sera validé.

---

**DIGIYLYFE SINÉ-SALOUM — Le territoire se prépare avant de se publier.**
