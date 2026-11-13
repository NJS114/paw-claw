> Révision de DA : la direction officielle est désormais la fantasy épurée, approuvée après le comparatif. Le bois, les fleurs et les panneaux ornés décrits dans le bilan historique ci-dessous sont remplacés dans ce nouveau lot. Voir DIRECTION_ARTISTIQUE.md. Les inventaires et limites de sortie restent applicables.

# Paw & Claw — audit de préparation mobile

Date : 12 novembre 2026. Cible : Android et iPhone. Direction choisie par l’utilisateur : fantasy chaleureuse, bois, parchemin, couleurs douces.

## Verdict

Le dépôt contient un prototype jouable substantiel, pas encore un jeu prêt pour les boutiques. Ce lot prépare deux projets natifs, sécurise plusieurs parcours et harmonise l’interface. Il ne constitue ni une certification de publication ni une validation visuelle sur téléphone. Les tests automatisés ne remplacent pas une partie réelle, une revue artistique ou une compilation native.

La première cible technique est une aventure solo hors ligne. Un vrai JcJ classé demanderait un serveur autoritaire, des comptes, une gestion des déconnexions et un matchmaking réels ; aucun de ces services n’existe dans le dépôt. Le texte d’interface a été corrigé en conséquence.

## Analyse par domaine

| Domaine | Constat au départ | Travail livré | Encore nécessaire |
| --- | --- | --- | --- |
| Identité visuelle | Accueil illustré, atelier chaleureux, autres écrans bleu nuit ; nombreux styles superposés | Habillage bois/parchemin/sauge commun, commandes sculptées, réglages illustrés, nouvelle icône chat/chien et splashs natifs | Revue visuelle sur chaque format et consolidation des anciens CSS |
| Illustrations | 116 cartes, 58 fichiers individuels présents, 58 absents | Audit réparé et rapport JSON complet ; aucune image de substitution trompeuse ajoutée | 46 héros et 12 utilitaires à illustrer ; contrôler l’identité et le cadrage des 58 fichiers présents |
| Premier lancement | Écran de chargement et deck de départ légal, pas de guide global | Guide en trois étapes, réouverture depuis les réglages | Tutoriel interactif dans l’arène, tests de compréhension auprès de joueurs |
| Combat | 7 lignes, énergie, synergies, fatigue, IA à trois niveaux | Plus de résurrection après fatigue mortelle ; validation main/emplacement ; duel repris sans être effacé ; abandon confirmé sans récompense | Essais de durée/équilibrage, lisibilité des sept lignes au doigt, confirmation de fin de combat sur appareils |
| Rival IA | Présenté comme un joueur classé ; pioche de 24 cartes | Présentation solo honnête ; rival de 20 cartes suivant les limites de copies/espèce | Variété des profils adverses et mesure des taux de victoire |
| Cartes utilitaires | 12 cartes distribuées par boosters mais refusées par les decks et le moteur de combat | Nouveaux boosters limités aux héros jouables ; collections historiques conservées | Implémenter et équilibrer leurs effets avant de les redistribuer |
| Collection | Filtres, illustrations et fiche sans focus modal | Recherche sans accents, tri, compteur, état vide, remise à zéro, focus et Échap | Filtres d’espèce et présentation explicite des cartes hors combat |
| Decks | Plusieurs decks, favoris, restrictions d’espèce et rareté | Conservation du fonctionnement, validation des données chargées | Confirmation de suppression, variété visuelle selon le deck, tests tactiles prolongés |
| Progression | Pièces, gemmes, XP, missions quotidiennes/hebdomadaires, passe | Actualisation des périodes au retour au jeu et à la minute ; données numériques filtrées | Étude du rythme d’acquisition, remise à niveau de la saison et économie long terme |
| Sauvegarde | localStorage uniquement, plusieurs clés, récupération partielle du combat | API commune, miroir natif Preferences sérialisé, hydratation avant React, conservation des données illisibles, message d’échec | Test arrêt forcé à chaque étape d’une action économique ; sauvegarde atomique globale ; export/import ou cloud pour transfert entre appareils |
| Boutique | Achat de boosters avec pièces, vitrine de paiements non branchés | Offres non opérationnelles retirées du parcours, comptoir lié à la réserve | Si monétisation future : produits boutiques, validation des reçus, restauration et règles de confidentialité |
| Audio/haptique | Pas de bande-son ou d’effets audio livrés | Vibrations natives facultatives et réglage fonctionnel | Composition sonore, mixage, réglages séparés et vérification du mode silencieux |
| Langues | Sélecteur anglais sans traduction complète du jeu | Sélecteur trompeur retiré ; version présentée en français, histoires conservées | Internationalisation complète avant annonce d’autres langues |
| Android | Aucune enveloppe native | Projet Capacitor, Java, Gradle, manifest, icônes, splash, retour Android, CI APK debug | SDK et compilation native vérifiés, clé de signature, Play Console, essais appareils |
| iOS | Aucun projet Xcode | Projet Xcode/Swift, paquets plugins, icône, splash, manifeste UserDefaults CA92.1 et CI simulateur | Compilation Xcode vérifiée, signature/provisioning, App Store Connect, TestFlight et essais appareils |
| Confidentialité | Pas de backend ou d’achat effectif | Pas d’ajout d’analytics, publicité ou compte ; manifeste iOS fourni | Politique publique et déclarations boutiques à valider sur l’archive réellement distribuée |
| Publication Sites | Plusieurs aperçus historiques | Site existant identifié, pas d’altération de son audience | Helper `site-workflow.mjs` absent ; aucun nouveau déploiement revendiqué |

## Inventaire artistique vérifié

Source détaillée : `audit/asset-coverage-2026-11-12.json`, régénérable avec `node scripts/audit-asset-coverage.mjs --json` après import des assets.

- 119 images dans le ZIP, 78 entrées dans le catalogue d’interface.
- 104 héros et 12 cartes utilitaires dans le catalogue.
- 58 illustrations individuelles présentes et 58 absentes.
- Cartes absentes par famille : Créatures 15, Nature 10, Nobles 4, Ombres 15, Robots 3, Éléments 11. Magiciens et Guérisseurs : aucun fichier manquant.
- 10 images optionnelles déclarées sont absentes : loading.portal, fx.booster-glow, fx.legendary-burst, battle.victory, battle.defeat, battle.draw, fx.attack, fx.heal, fx.buff, fx.lore. Des animations CSS existent ; ces images ne sont pas automatiquement obligatoires si les effets correspondants sont produits autrement.
- Aucun fichier UI marqué obligatoire n’est absent. Cela ne garantit pas l’absence de toute référence erronée ailleurs : les icônes d’accueil et de réglages manquantes ont été corrigées séparément.
- Certains visuels de personnage du catalogue pointent vers le même duo. Les alias ne sont pas des personnages individuels finalisés.

## Risques de conception à résoudre

1. L’espèce d’une carte utilise encore une heuristique sur son nom lorsque les métadonnées explicites manquent. Compléter `species` pour chaque héros et contrôler la cohérence illustration/règles.
2. Deux histoires donnant un bonus sur un même camp réunissent des cartes d’espèces opposées. Elles ne sont pas atteignables avec les règles de deck actuelles. Réconcilier récit et règles avant de les mettre en avant.
3. Les changements d’horloge système influencent missions et saisons en solo. La sauvegarde locale n’est pas une protection anti-triche et ne convient pas à une économie monétisée autoritaire.
4. La progression est écrite sur plusieurs clés. Le miroir natif conserve les instantanés dans l’ordre, mais une interruption entre deux mises à jour économiques n’est pas une transaction globale. Ne pas promettre une atomicité qui n’existe pas.
5. Les illustrations issues de planches ont des cadrages calculés. Vérifier chaque personnage, les bords et l’absence de texte raster ; un fichier existant n’est pas une validation artistique.
6. La grille de sept lignes est compacte en portrait. Vérifier l’inspection des cartes et les cibles tactiles sur écran de 320 px ; prévoir agrandissement ou focus de ligne si nécessaire.
7. Le passe contient des récompenses de monnaie/boosters. Son texte ne doit pas promettre l’absence de tout avantage de progression.

## Validation de ce lot

Tests automatisés du catalogue, économie, boosters, moteur, adversaires légaux, récupération de duel, validation des données, stockage natif simulé, filtres et interactions clavier. Compilation TypeScript/Vite et synchronisation des deux plateformes effectuées. 73 tests passent dans 22 fichiers. Le résultat des workflows natifs figure séparément dans la description de PR.

La couche native est simulée dans les tests unitaires : un plugin mocké ne prouve pas son comportement sur appareil. Aucun test physique, mesure FPS, mesure batterie ou capture de rendu n’a été effectué. Le contrôle Chrome partagé n’expose pas le tool `cua_repl.js` dans cette session ; aucun serveur ou navigateur de substitution n’a été utilisé. Xcode et le SDK Android ne sont pas installés dans ce conteneur Linux. Les jobs CI natifs sont préparés, leurs résultats doivent être consultés séparément.

## Critère pour dire « jeu fini »

Toutes les cartes distribuées sont jouables et illustrées ; chaque écran est approuvé visuellement ; aucun parcours ne mène à une fonctionnalité factice ; la sauvegarde survit aux interruptions testées ; des parties complètes sont lisibles et stables sur Android et iPhone ; les archives natives sont signées et testées ; les déclarations et éléments boutiques correspondent à la version distribuée. Ces conditions ne sont pas encore toutes réunies.
