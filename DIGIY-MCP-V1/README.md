# DIGIY MCP V1 🔌🌍🦅

Passerelle conversationnelle publique et **lecture seule** entre le CORE WORLD DIGIYLYFE et les assistants/agents compatibles MCP.

## Doctrine

**LE MONDE DEMANDE → L’IA COMPREND → DIGIYLYFE LOCALISE → LE PRO PREND LA MAIN**

Le MCP n’est pas un nouveau moteur métier. Il est une prise universelle devant le CORE existant.

Principes obligatoires :

- même CORE WORLD ;
- géographie publique active uniquement ;
- aucune zone ou pays `planned` exposé ;
- aucun professionnel privé, expiré, non payé ou non validé ;
- aucune écriture V1 ;
- aucune réservation, paiement, modification de dossier ou action propriétaire V1 ;
- relation commerciale directe avec le professionnel ;
- conformité avec `MASTER-CORE-WORLD-V1/config/pro-sovereignty-contract.json`.

## Endpoint V1

Serveur distant :

`https://wesqmwjjtsefyjnluosj.supabase.co/functions/v1/digiy-mcp`

Déploiement : Supabase Edge Function `digiy-mcp`, V1, `verify_jwt=false` car l’endpoint n’expose que des données déjà qualifiées comme publiques.

Le serveur annonce des outils `readOnlyHint=true` et supporte :

- MCP moderne `2026-07-28` ;
- compatibilité legacy `2025-11-25`, `2025-06-18`, `2025-03-26`.

## Sources autoritaires

Géographie / besoins :

`https://digiylyfe.com/assets/digiy-core-runtime-v1.json`

Professionnels publics : `public.digiy_adhesion_requests`, filtrés strictement sur :

- `status = valide` ;
- `payment_status = confirme` ;
- `card_status IN (validee, publiee)` ;
- `site_visible = true` ;
- `subscription_status = actif` ;
- `paid_until >= now()` ;
- `public_slug IS NOT NULL` ;
- `final_url IS NOT NULL`.

## Outils V1

1. `list_countries`
2. `list_territories`
3. `list_zones`
4. `list_needs`
5. `search_professionals`
6. `get_professional`

`search_professionals` respecte la doctrine de couverture :

`base_zone_id + service_zone_ids + service_territory_ids`

et filtre la recherche métier/service sur les champs publics du professionnel.

## Sortie professionnelle

La passerelle peut retourner :

- identité professionnelle publique ;
- métier et services publics ;
- pays, territoire, zone de base et couverture ;
- carte publique DIGIYLYFE ;
- photo publique ;
- téléphone / WhatsApp uniquement lorsqu’ils font déjà partie de la fiche publique.

Aucune donnée d’administration, preuve de paiement, email privé, statut interne ou secret ne doit sortir du MCP public.

## Sécurité V1

- lecture seule ;
- fail closed si le CORE public est indisponible ou invalide ;
- pays / territoire / zone inconnus ou non actifs refusés ;
- contrôles de cohérence géographique avant recherche ;
- aucune confiance accordée à une géographie inventée par le client ;
- limite de résultats ;
- aucune mutation de production.

## Statut

`DEPLOYED_PENDING_EXTERNAL_CLIENT_TEST`

Le déploiement Supabase est actif et le code déployé a été relu depuis Supabase. Un test réseau MCP de bout en bout avec un client externe reste obligatoire avant soumission à un annuaire/app store ou ouverture commerciale de la passerelle.

## Étape suivante

Tester depuis un vrai client MCP distant :

1. `server/discover` ;
2. `tools/list` ;
3. `list_countries` ;
4. `list_zones` sur `SN-PETITE-COTE` ;
5. `search_professionals` sur une zone active ;
6. `get_professional` sur un slug public réel.

Après PASS : préparer l’intégration ChatGPT/OpenAI puis Gemini/Google sans modifier le CORE.

---

**ChatGPT porte la voix. DIGIYLYFE apporte le terrain. Le professionnel réalise.**
