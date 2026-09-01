# INSTANCE CLIENT — MODÈLE NEUTRE

Ce dossier est un **gabarit de suivi**, pas un dossier client réel.

Il sert à préparer la création d'une instance client à partir d'un MASTER MAÎTRE sans mélanger les données de production avec le coffre des modèles.

## Règle

1. Identifier le produit réellement commandé.
2. Pour une **CARTE**, utiliser `MASTER-CARTE-ADHERENT-V1` comme socle.
3. Pour une **FICHE / SITE**, choisir le MASTER métier adapté.
4. Copier ce gabarit dans le coffre privé des clients abonnés.
5. Renommer la copie avec un identifiant client lisible et stable.
6. Renseigner `DOSSIER.md`.
7. Utiliser `CHECKLIST.md` pendant la fabrication.
8. Compléter `LIVRAISON.md` au moment de la publication.

## Ne jamais mettre ici

- nom réel d'un client ;
- téléphone ou WhatsApp réel ;
- adresse privée ;
- photo client ;
- preuve de paiement ;
- secret, token ou mot de passe ;
- CNAME ou domaine de production client ;
- copie complète d'un site client déjà publié.

## Architecture cible

`digiy-master-modeles` = moules techniques propres.

`digiy-clients-abonnes` = dossiers de suivi privés des clients.

`repo-client-xxx` = code de l'instance publiée.

`nom-client.digiylyfe.com` = interface publique.

Pour une carte adhérent, l’URL publique attribuée devient la porte canonique à conserver afin que le QR physique reste stable dans le temps.

---

**DIGIYLYFE.COM · L’empreinte numérique du professionnel**
