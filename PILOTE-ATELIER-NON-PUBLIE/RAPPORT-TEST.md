# PILOTE ATELIER — CARTE TEST FICTIVE (NON PUBLIÉE)

## Source et isolement
- Source : `MASTER-CARTE-ADHERENT-V1/index.html` sur `main`, copié sans modifier le MASTER.
- Branche d'essai : `atelier-pilote-non-publie-20261008` ; ne pas fusionner, ne pas déployer, ne pas attribuer de domaine.
- Instance : `PILOTE-ATELIER-NON-PUBLIE/CARTE-TEST/index.html`.
- Identité, métier et territoire **explicitement fictifs** ; aucun adhérent réel.
- Aucun numéro public, WhatsApp, URL canonique ou QR : les actions correspondantes doivent rester désactivées. Aucun appel réel ne doit être déclenché.

## Résultats de vérification statique
- syntax : OK
- fictional : true
- notPublished : true
- noPhone : true
- noWhatsApp : true
- noCanonical : true
- noQR : true
- callLogic : true
- whatsAppLogic : true
- eightLanguages : true
- rtl : true
- pwa : true
- manifest : true

## Critères non encore validés
- [ ] Rendu réel mobile 9:16, défilement et zones tactiles
- [ ] Tests manuels sur téléphone des états désactivés et de l'interface FR/EN/AR RTL
- [ ] Test PWA/service worker dans un environnement de prévisualisation isolé, sans publication publique
- [ ] Test des vrais contacts, QR et URL uniquement avec un dossier adhérent validé, dans une autre instance
- [ ] Mesure chronométrée du temps de fabrication sur une instance complète

## Décision
**Essai structurel créé et syntaxe vérifiée. Publication interdite.** Les champs absents sont intentionnels : ce pilote ne prouve pas encore un parcours client de bout en bout. La validation humaine et les tests sur appareil restent requis avant industrialisation.

## Révision UX validée — 8 octobre 2026
- Visuel professionnel porté à environ un tiers de la hauteur d'écran (`33vh`, bornes de sécurité mobiles).
- Bloc QR **dans l'interface de la carte pilote** remplacé par un bouton visible « Retour au réseau DIGIYLYFE » vers `https://www.digiylyfe.com/`.
- QR **personnel imprimable du professionnel** reste un support externe à la fiche, non supprimé de la doctrine.
- Traductions du retour réseau en huit langues, dont arabe RTL.
- Test syntaxique JavaScript statique réussi ; pas encore de contrôle visuel réel sur téléphone.
- Le MASTER d'origine reste inchangé ; la branche pilote n'est pas fusionnée ni publiée.
