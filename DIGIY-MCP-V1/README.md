# DIGIY MCP V1 🔌🌍🦅

Passerelle conversationnelle publique et **lecture seule** entre le CORE WORLD DIGIYLYFE et les assistants/agents compatibles MCP.

## Doctrine

**LE MONDE DEMANDE → L’IA COMPREND → DIGIYLYFE LOCALISE → LE PRO PREND LA MAIN**

Le MCP n’est pas un nouveau moteur métier. Il est une prise universelle devant le CORE existant.

Principes obligatoires :

- même CORE WORLD ;
- géographie publique active uniquement ;
- aucune zone ou pays `planned` exposé ;
- aucune donnée privée exposée ;
- aucune écriture V1 ;
- aucune réservation, paiement, modification de dossier ou action propriétaire V1 ;
- relation commerciale directe avec le professionnel ;
- conformité avec `MASTER-CORE-WORLD-V1/config/pro-sovereignty-contract.json`.

## Endpoint V1

Serveur distant :

`https://wesqmwjjtsefyjnluosj.supabase.co/functions/v1/digiy-mcp`

Déploiement courant : Supabase Edge Function `digiy-mcp`, V2, serveur MCP `1.1.0`, `verify_jwt=false` car l’endpoint est strictement public et lecture seule.

Le serveur annonce des outils `readOnlyHint=true` et supporte :

- MCP moderne `2026-07-28` ;
- compatibilité legacy `2025-11-25`, `2025-06-18`, `2025-03-26`.

## Sources autoritaires

Géographie / besoins :

`https://digiylyfe.com/assets/digiy-core-runtime-v1.json`

Découverte publique :

`public.v_digiy_public_discovery_entities`

Cette vue est le **quai public normalisé**. Elle rassemble sans modifier leurs sources d’origine :

1. les adhésions actives et publiées provenant de `public.digiy_adhesion_requests` ;
2. les entités historiques ou modulaires explicitement autorisées dans `public.digiy_public_discovery_bridge`.

Pour les adhésions, les gardes restent strictes :

- `status = valide` ;
- `payment_status = confirme` ;
- `card_status IN (validee, publiee)` ;
- `site_visible = true` ;
- `subscription_status = actif` ;
- `paid_until >= now()` ;
- `public_slug IS NOT NULL` ;
- `final_url IS NOT NULL`.

Pour une entité historique/modulaire, `is_public=true` doit être posé explicitement dans le bridge. Pour `source_kind=loc_master_site`, la vue vérifie en plus que le site source reste `is_active=true` dans `public.digiy_loc_master_sites`.

Le quai normalise :

`source → identité → catégorie/services → pays → territoire → zone → couverture → URL publique → contacts publics éventuels`

## Outils V1

1. `list_countries`
2. `list_territories`
3. `list_zones`
4. `list_needs`
5. `search_professionals`
6. `get_professional`

`search_professionals` respecte la doctrine de couverture :

`base_zone_id + service_zone_ids + service_territory_ids`

et recherche dans le nom, la catégorie et les services publics normalisés.

## Sortie publique

La passerelle peut retourner :

- identité professionnelle/établissement publique ;
- catégorie et services publics ;
- pays, territoire, zone de base et couverture ;
- carte ou porte publique DIGIYLYFE ;
- photo publique lorsqu’une source la fournit explicitement ;
- téléphone / WhatsApp uniquement lorsqu’ils sont explicitement exposés comme publics par la source normalisée.

Aucune donnée d’administration, preuve de paiement, email privé, statut interne ou secret ne doit sortir du MCP public.

## Sécurité V1

- lecture seule ;
- fail closed si le CORE public est indisponible ou invalide ;
- pays / territoire / zone inconnus ou non actifs refusés ;
- contrôles de cohérence géographique avant recherche ;
- aucune confiance accordée à une géographie inventée par le client ;
- bridge explicite pour les sources historiques ;
- garde dynamique `is_active` pour LOC MASTER ;
- limite de résultats ;
- aucune mutation métier depuis le MCP.

## Premier raccord quai : Sarlat

Source historique : `public.digiy_loc_master_sites`

- site : `sarlat-chez-baptiste` ;
- unité : `chambre-privee` ;
- pays : `FR` ;
- territoire : `FR-DORDOGNE` ;
- zone : `FR-DORDOGNE-SARLAT` ;
- catégorie : `accommodation` ;
- services : `location`, `hébergement`, `chambre privée` ;
- porte publique : `https://sarlat-chez-baptiste.digiylyfe.com/`.

Le site source reste la vérité métier. Le bridge ne le remplace pas : il le rend découvrable par le CORE conversationnel.

## Test réseau du 23 août 2026

Test HTTP de bout en bout lancé depuis PostgreSQL `pg_net` vers l’endpoint public Supabase :

- `server/discover` → HTTP 200 ;
- `tools/list` → HTTP 200 ;
- `search_professionals(query="location hébergement", FR / FR-DORDOGNE / FR-DORDOGNE-SARLAT)` → HTTP 200, **1 résultat** ;
- résultat : `SARLAT CHEZ BAPTISTE` ;
- `get_professional(public_slug="sarlat-chez-baptiste")` → HTTP 200 ;
- URL retournée : `https://sarlat-chez-baptiste.digiylyfe.com/` ;
- aucune donnée privée retournée.

## Statut

`PUBLIC_QUAY_V1_PASS`

Le quai public est posé et le premier cas historique Sarlat passe par le MCP sans modifier sa source métier.

## Étape suivante

Raccorder les autres portes historiques **une par une après contrôle humain** : LOC, DRIVER, RESTAURATION, COMMERCE, etc. Aucun import massif automatique et aucune géographie inventée.

Puis préparer le raccord ChatGPT/OpenAI et Gemini/Google sans modifier le CORE.

---

**ChatGPT porte la voix. DIGIYLYFE apporte le terrain. Le professionnel réalise.**
