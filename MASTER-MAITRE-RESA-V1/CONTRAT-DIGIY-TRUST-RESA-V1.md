# DIGIY TRUST → RÉSA UNIVERSEL — HÉRITAGE MAÎTRE V1

**9 octobre 2026 · Source de référence : `BEAUVILLE/digiy-loc`, `docs/DIGIY_TRUST_CONTRAT_V1.md` et `trust/eligibility.mjs`**  
**État : patrimoine fonctionnel et présentation préparés, évaluations RÉSA NON ACTIVÉES.**

## Objectif : une fiche qui transforme la présence en rendez-vous, puis prouve la qualité réelle

La fiche du professionnel affiche les prestations et le planning. **Après une prestation réellement réalisée**, le client éligible peut noter l'expérience en étoiles, **sans commentaire**, par un parcours court. La note publique est lisible **dès la fiche**, le détail apparaît par clic. La relation et le paiement restent directs (0 % commission).

### Critères communs compatibles avec l'héritage LOC

| Critère | Clé | Saisie |
|---|---|---|
| Ponctualité / fiabilité | `punctuality` | Facultative selon la prestation |
| Qualité de la prestation | `quality` | Obligatoire pour une évaluation |
| Accueil / attitude | `welcome` | Facultative |
| Disponibilité | `availability` | Facultative |
| Proximité / accessibilité | `proximity` | Facultative, notamment si à distance |
| Suivi / fidélité | `followup` | Facultative, ne pas inventer de suivi |
| **Rapport qualité-prix** | **`value_for_money`** | **Obligatoire, noté séparément** |

Le contrat LOC utilise déjà `reliability`, `quality`, `welcome` et `value_for_money`. RÉSA conserve leur **sens métier** et étend seulement les critères facultatifs utiles aux rendez-vous. La traduction `reliability → punctuality` doit être gérée par un adaptateur de données validé, jamais en reclassant silencieusement des avis LOC historiques.

**Rapport qualité-prix n'est pas prix le plus bas.** La note exprime la valeur perçue de la prestation fournie par rapport au montant payé, avec une catégorie et une moyenne indépendantes.

### Deux notes publiques, pas une moyenne qui mélange tout

- **Note générale** : moyenne des notes par prestation vérifiée, calculée sur les critères de service applicables **hors `value_for_money`**, avec un poids égal par évaluation. Afficher le nombre d'avis réellement vérifiés.
- **Rapport qualité-prix** : moyenne **distincte** du critère `value_for_money`, visible séparément même si le détail est replié.
- **Détail au clic** : moyennes par axe (ponctualité, qualité, accueil, disponibilité, proximité, suivi), avec nombre réel de notes par critère.
- **Aucune note vérifiée** : afficher « Pas encore d'évaluation vérifiée » ; **ne pas afficher 0/5**, aucune étoile fictive, aucun faux témoignage.
- Critère non renseigné = « Non noté », jamais 0.
- Aucun commentaire, aucune identité, aucun motif juridique, fiscal, médical ou autre donnée sensible dans les agrégats publics.

### Éligibilité serveur héritée de LOC

1. Il existe un événement de prestation `completed`, **attesté par une source de confiance** ; `pending`, `confirmed`, une date passée ou le clic du propriétaire ne suffisent pas.
2. Le client a été identifié et vérifié **indépendamment** du professionnel. Le professionnel ne peut pas noter sa propre activité, saisir l'avis d'un client, ni sélectionner seulement les clients satisfaits.
3. Une attestation de réalisation et d'appartenance client/prestation est produite côté serveur. Une invitation est liée à cette prestation, limitée et à usage unique, avec jeton haché.
4. Le serveur consomme l'invitation et stocke les étoiles en **une seule transaction**, avec unicité par prestation, RLS fermée par défaut et contrôle de rejeu/concurrence.
5. Les agrégats publics sont calculés **uniquement sur les évaluations dont la preuve est validée**. Jamais de SELECT public sur données privées.
6. Une annulation, un rendez-vous manqué, une prestation non réalisée, une simple confirmation ou un paiement déclaré ne créent **jamais** un droit à avis vérifié.

### Adaptations terrain

- **SERVICES PROFESSIONNELS** (avocat, comptable, architecte) : critères de ponctualité, clarté/qualité du service, accueil, disponibilité et suivi. Ne jamais publier une description de dossier ; un rendez-vous peut avoir lieu sans conduire à un mandat.
- **BEAUTY** : ajouter ensuite les critères utiles aux prestations beauté, sans supprimer qualité-prix.
- **Artisans, services, coaching, cours** : chaque métier détermine les axes facultatifs pertinents ; la comparabilité des quatre familles LOC est préservée.
- **RESTO, LOC, DRIVER** restent sur leurs moteurs de réservation spécialisés et leurs propres adaptateurs d'attestation. Ils peuvent partager la doctrine DIGIY TRUST, pas la RPC RÉSA générique.
- Autres cas : validation **terrain**, aucun critère arbitraire imposé.

### Réalité technique et prochaines étapes

Audit en lecture seule du 9 octobre 2026 : `digiy_trust_private.voluntary_feedback` est une table privée LOC, avec RLS, commentaire historique et `stay_verified=false` en contrainte ; **ce n'est pas une table de notes vérifiées RÉSA** et elle ne possède pas le champ séparé `value_for_money`. Les schémas candidats `digiy_trust_reviews` / `digiy_trust_invitations` ne sont pas constatés dans le catalogue public de `digiy-core`. Ne pas migrer/altérer cette table LOC pour RÉSA.

La page de prévisualisation `trust/resa-trust-empty-preview.html` est une **maquette sans données**, prête à servir de base graphique après activation serveur, mais elle ne doit pas afficher une note publique réelle ni proposer d'envoi tant que la preuve client, le stockage sécurisé, la RPC atomique, les droits et le BAT mobile ne sont pas validés.

**Statut NO GO pour activation RÉSA TRUST.** Ce portage n'exécute aucun SQL, ne crée aucun avis et ne modifie pas le CORE, LOC, ni l'existant RESTO.

Voir `trust/resa-trust-contract-v1.json` (contrat exploitable) et `tests/resa-trust-contract.test.cjs` (contrôles automatisés).
