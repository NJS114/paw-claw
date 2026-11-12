# Direction artistique — fantasy chaleureuse

Décision utilisateur du 12 novembre 2026 : « Fantasy chaleureuse : bois, parchemin, couleurs douces ».

## Intention

Le jeu est un petit royaume vivant que l’on manipule avec le doigt. L’accueil est une scène illustrée avec des héros au premier plan. Les menus sont des objets de cet univers : enseignes en bois, onglets épais, coffres, cartes encadrées et parchemins. La collection est un album, les decks un atelier et la boutique un comptoir.

Les fonds et personnages existants restent des calques séparés. Textes, valeurs et commandes restent vivants et accessibles ; aucune maquette complète ne doit devenir une image cliquable aplatie.

## Grammaire commune

| Élément | Direction |
| --- | --- |
| Bois | Brun noisette #805333, ombres #573823, bord sculpté et petite profondeur |
| Parchemin | Crème #FFF0CF, lumière #FFF7E2, textes brun #553B2A |
| Action principale | Miel #E9B758, éclairage en haut, base brune, pression tactile courte |
| État sélectionné | Sauge #719785, bord #466D60 et texte crème |
| Décor | Bleus poussiéreux, végétation et pierre chaude ; limiter les noirs et l’effet néon |
| Personnages | Expressions lisibles, matières peintes, silhouettes distinctes, même échelle de détail |
| Typographie | Sérif de conte pour titres courts ; caractères arrondis lisibles pour commandes et chiffres |
| Monnaies | Icônes réelles du jeu, valeurs dynamiques, aucune promesse d’achat non disponible |
| Mouvement | Léger flottement, pression et révélation ; réduction effective dans les réglages et via le système |

Le fichier `src/kingdom-ui.css` applique cette direction après les styles hérités. Ce choix permet une révision progressive ; il ne remplace pas la suppression ultérieure des règles obsolètes.

## Composition par écran

- **Accueil :** scène plein écran, duo central, activités sur le côté, quête lisible et dock au pouce. Éviter les slogans de page commerciale et les panneaux statistiques occupant tout le décor.
- **Collection :** album crème, filtres en jetons épais, cartes dominantes, trois colonnes quand elles restent lisibles et deux sur très petit écran. La fiche s’ouvre comme un volet de l’album.
- **Decks :** atelier existant comme référence ; cartes manipulables avec plus/moins, capacité 20 cartes clairement visible. Le visuel de présentation doit ensuite refléter le deck sélectionné, pas toujours le même équipage pirate.
- **Boutique :** paquet en objet central sur son comptoir ; un bouton d’achat clair en pièces du jeu, réserve accessible, pas de vitrine de fonctionnalités absentes.
- **Missions :** fiches de parchemin, tampons de récompense et barre sauge ; distinction terminée/récupérée sans dépendre uniquement de la couleur.
- **Combat :** conserver le plateau illustré et les deux camps, privilégier unités/PV/énergie, réduire le journal secondaire. Vérifier la lisibilité avant d’ajouter des effets.
- **Réglages et guide :** petit panneau sculpté au-dessus du monde ; choix réellement fonctionnels, commandes ≥44 px, focus et fermeture accessibles.
- **Résultats :** panneau de récompense chaleureux. Les images victoire/défaite dédiées et une mise en scène sonore restent à produire.

## Nouvelle icône

Source : `public/assets/branding/paw-claw-icon-source.webp`, image originale conservée dans la session sous `/workspace/generated_images/`. Duo chat mage et chien chevalier, tons sauge/miel/parchemin, sans texte. Création par l’outil image intégré, puis encodage/redimensionnement pour les dimensions natives sans modification de composition. Les fichiers Android/iOS sont générés par `npm run mobile:art`.

L’icône doit encore être observée sous les masques Android et à petite taille sur écran d’accueil. Sa génération ne vaut pas approbation finale de toute la DA.

## Validation visuelle requise

Contrôler accueil, collection vide/filtrée, fiche de carte, atelier complet/invalide, boutique solde faible, booster/reveal, missions/passe, préparation, combat, résultats, guide et réglages :

- iPhone compact 375×667, iPhone avec encoche 393×852, Android étroit 360×800, grand Android 412×915, format étroit 320 px et paysage bas.
- Zéro chevauchement avec encoche, barre système, clavier ou dock ; boutons utilisables sans zoom ; titres de cartes identifiables ; contraste sur parchemin ; aucune icône cassée.
- Animations réduites actives, contrôle au clavier, retour Android et changements d’orientation.

Aucune capture de rendu de ce lot n’est disponible. Les écarts observés à cette revue devront être corrigés avant publication.
