# RÉPERTOIRE CLIENTS — MODÈLE ALPHABÉTIQUE

Ce gabarit prépare le classement du futur coffre privé `digiy-clients-abonnes`.

## Règle de classement

Chaque client est rangé sous la **première lettre de son nom professionnel / enseigne publique**.

Exemples de structure neutre :

- `A/nom-enseigne__telephone-complet/`
- `B/nom-enseigne__telephone-complet/`
- `C/nom-enseigne__telephone-complet/`

## Identité de référence DIGIYLYFE

Un client est identifié par les trois éléments suivants :

1. **Nom professionnel / enseigne** — repère humain et classement alphabétique.
2. **Téléphone complet** — identité terrain opérationnelle ; ne pas le réduire aux quatre derniers chiffres dans le coffre privé.
3. **ID dossier Supabase (UUID)** — identité technique unique et permanente du dossier.

Le nom du dossier client peut suivre la convention :

`nom-ou-enseigne__telephone-complet/`

L'UUID Supabase est obligatoirement inscrit dans `DOSSIER.md` et sert de référence technique absolue.

Utiliser des minuscules et des tirets pour le nom/enseigne, sans accents ni espaces. Pour le téléphone dans le nom de dossier, utiliser uniquement les chiffres avec indicatif pays, sans `+`, espace ni ponctuation.

Exemple fictif :

`A/atelier-exemple__221770000000/`

## Contenu d'un dossier client

Chaque dossier client reçoit une copie de `INSTANCE-CLIENT-MODELE/` :

- `DOSSIER.md`
- `CHECKLIST.md`
- `LIVRAISON.md`
- éventuellement un lien/référence vers son dépôt d'instance

## Important

- Ce dépôt public contient uniquement le **gabarit** ; aucune donnée réelle d'abonné n'y est inscrite.
- Le futur coffre `digiy-clients-abonnes` est destiné au suivi privé des vrais clients.
- Le classement alphabétique sert au suivi Atelier.
- Le code du site publié reste dans un dépôt client séparé.
- Les preuves de paiement brutes, secrets et mots de passe ne sont jamais stockés ici.
- Le MASTER MAÎTRE n'est jamais copié avec ses données internes dans ce répertoire : seule une instance client contrôlée est fabriquée.

---

**DIGIYLYFE — nom + téléphone complet + UUID Supabase : un client, une identité de dossier.**
