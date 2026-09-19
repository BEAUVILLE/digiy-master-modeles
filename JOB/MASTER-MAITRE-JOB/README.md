# MASTER MAÎTRE JOB — V3 SITE PRO + OWNER

Moule universel DIGIYLYFE pour un **site professionnel de recrutement**.

## Deux configurations
- `structureType: "agency"` : agence / cabinet de recrutement.
- `structureType: "company"` : entreprise qui recrute directement.

## Le site doit présenter
- la structure et sa marque employeur ;
- ses secteurs / métiers ;
- sa méthode de recrutement ;
- les services aux entreprises si mode agence ;
- les offres d'emploi réelles ;
- le parcours candidat ;
- une candidature directe ;
- une porte « Je recrute » si pertinente ;
- une porte « Je cherche un poste » ;
- contact RH direct.

## Règles
- 1 structure = 1 site.
- Ce MASTER n'est pas un annuaire général d'offres.
- Aucun nom, téléphone, email, offre ou entreprise fictive ne doit rester dans une déclinaison publiée.
- Le recruteur reste responsable de l'offre, du contrat, des vérifications et de la décision d'embauche.
- DIGIYLYFE ne promet ni entretien ni emploi.
- Candidat : candidature gratuite.
- `noindex,nofollow` dans le coffre.
- FR · EN · ES · PT · IT · DE · NL · AR.
- PWA légère.


## Couche propriétaire

Le MASTER comprend `gestion.html` pour le recruteur :

- connexion Supabase Auth par email avec `shouldCreateUser:false` ;
- rattachement sécurisé à un `workspace_slug` via `digiy_jobs_owner_workspaces` ;
- création d’une offre ;
- ouverture / fermeture d’une offre ;
- lecture des candidatures du seul workspace ;
- contact direct candidat par SMS / WhatsApp ;
- statuts candidat simples : contacté, retenu, refusé, recruté ;
- note privée recruteur ;
- RLS par workspace.

Le recruteur garde la décision finale, les vérifications, l’entretien et le contrat.

Rail canonique : **TARIF ADHÉRENT → activation DIGIY PRO → JOB → propriétaire authentifié → gestion privée → données publiques autorisées.**
