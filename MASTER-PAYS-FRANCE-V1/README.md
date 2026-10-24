# 🇫🇷 DIGIYLYFE — MASTER PAYS FRANCE V1

**Statut : PAYS PILOTE — V1**

Ce dossier configure la France sous le **MASTER CORE WORLD**. Il ne contient pas un nouveau moteur.

## Arbre

**FRANCE → TERRITOIRE → ZONE → BESOIN → PROFESSIONNEL → OUVRIR**

## Configuration

- `country_id` : `FR`
- Monnaie : EUR / €
- Préfixe téléphone : `+33`
- Fuseau principal : `Europe/Paris`
- Langue principale : français
- Langues interface : FR · EN · ES · PT · IT · DE · NL · AR

## Territoires V1

### Actif

- `FR-DORDOGNE` — **Périgord · Vallée de la Dordogne**
  - zone active : Sarlat
  - MASTER : `../MASTER-TERRITOIRE-VALLEE-DORDOGNE-V1/`

### Préparés sans activation

- Bordeaux
- Arcachon

## Offre métier spéciale — DIGIY DRIVER France

La **référence tarifaire maître France** prévoit un plan spécifique `driver-fr-45` :

- **45 € par mois**, et non 45 € de supplément à une autre formule ;
- **fiche professionnelle du chauffeur, QR et logiciel métier inclus** ;
- **0 € de frais de création de fiche**, **0 € de supplément logiciel** ;
- **0 % de commission** sur les prestations ;
- **aucun pilote gratuit LOC** ou renvoi à un formulaire d'hébergement ;
- l'adhésion DRIVER reste un dossier identifié, contrôlé et validé par un humain avant activation ;
- la fiche de renseignements est **transmise volontairement par le professionnel sur le WhatsApp DIGIY** : l'application prépare le texte, puis le professionnel confirme lui-même l'envoi dans WhatsApp ; aucune transmission automatique.

Le reste de la grille France, notamment la formule professionnelle générique et les sites sur mesure, n'est pas modifié. La formule DRIVER France ne modifie **aucun tarif Sénégal**.

Rail officiel : `TARIFS ADHÉRENTS FRANCE (DRIVER) → FICHE DE RENSEIGNEMENTS DRIVER → MESSAGE WHATSAPP DIGIY (ENVOI VOLONTAIRE) → VÉRIFICATION / BAT → VALIDATION / PAIEMENT → ACTIVATION DIGIY PRO → CARTE QR + FICHE PUBLIQUE + LOGICIEL DRIVER`.

Le MASTER MAÎTRE DRIVER fournit la fiche et l'espace propriétaire ; il ne doit pas créer un deuxième formulaire d'inscription. La **porte d'entrée France** est `/driver-france-renseignements.html` (site public `digiylyfe.com`) reliée depuis `tarifs-adherents-1.html?country=fr&module=driver`. Elle affiche l'offre `driver-fr-45` du MASTER France. Les pièces portrait et véhicule sont jointes **ensuite, dans la même conversation WhatsApp**, à l'initiative du professionnel. Les renseignements restent à contrôler manuellement avant toute publication.

## Discipline

1. Un seul moteur territorial commun.
2. La France est une configuration du CORE, jamais un fork du moteur.
3. Aucun professionnel réel n'est conservé dans le MASTER.
4. La production reste source de vérité.
5. Une zone planifiée n'est jamais publique avant validation explicite.
6. Le bouton territorial générique reste **OUVRIR**.

---

**DIGIYLYFE FRANCE — Le pays organise. Le territoire rapproche.**
