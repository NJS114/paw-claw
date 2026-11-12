# Direction artistique officielle — fantasy épurée

Décision utilisateur : « C’est beaucoup beaucoup mieux, on part sur ça ! », après la proposition `09-fantasy-epuree.png` du 12 novembre 2026. Cette décision remplace la piste précédente bois/parchemin/fleurs.

## Intention

Le lore donne son identité au jeu : architecture, factions, lumière et liens entre les personnages. L’interface accompagne les cartes sans les concurrencer. La richesse reste dans les illustrations ; les commandes, cadres et compteurs sont sobres.

- Palette : bleu ardoise, pierre claire et ivoire ; laiton et or en accents.
- Cadres fins, quelques angles adoucis, pas de textures de bois ni de végétation décorative dans l’interface.
- Cartes dominantes, deux colonnes dans la collection, caractéristiques essentielles lisibles.
- Accueil composé de calques séparés : cité de pierre, duo de héros, textes et contrôles vivants.
- Un appel principal au jeu, activités secondaires compactes et dock discret.
- Combat compact, sept lignes alignées, portraits d’unités et nombres prioritaires ; les statistiques détaillées des résultats sont repliées.
- Histoires en chapitre illustré lisible, sans défilement horizontal de toute la page.
- Animations courtes et fonctionnelles ; choix d’animations réduites conservé.

Les illustrations de cartes peuvent contenir des fleurs, des ornements ou des éléments propres à leur famille. La restriction concerne l’habillage global de l’interface, pas la réécriture artistique du catalogue.

## Ressources livrées

| Fichier | Usage | Dimensions |
| --- | --- | --- |
| `public/assets/refined/city.webp` | Scène de cité et architecture commune | 863 × 1822 |
| `public/assets/refined/heroes.webp` | Duo chat archimage / chien gardien, alpha préservé | 1100 × 880 |
| `public/assets/refined/lore.webp` | Illustration d’ambiance de deux clans séparés par un pont | 1000 × 1333 |

Les trois images sont produites avec l’outil image intégré à partir de la référence approuvée. Elles ne sont pas des captures aplaties de l’interface. Les originaux PNG restent dans `/workspace/generated_images/` ; les WebP de production sont encodés pour le jeu sans modification de composition.

La scène d’histoire est une illustration d’ambiance des factions, pas un remplacement des illustrations ni de l’identité des cartes citées dans les textes. Les cartes déjà présentes restent inchangées. Les images générées dans d’autres conversations devront être fournies pour leur intégration fidèle.

## Mise en œuvre

- `src/kingdom-ui.css` devient la couche visuelle commune épurée.
- `src/layered-home.css` remplace l’ancien accueil fleuri.
- `src/game-card.css` donne la priorité aux illustrations et aux nombres.
- `src/CozyUi.tsx` conserve son API pour les consommateurs mais utilise des emblèmes vectoriels sans plaques raster.
- Les feuilles `cozy-decks.css` et `cozy-controls.css` ne sont plus chargées.
- L’atelier affiche un aperçu des vraies cartes du deck ; les enseignes boisées et l’illustration pirate générique sont retirées du parcours.
- La boutique utilise une hauteur explicite pour le paquet. La fin d’ouverture expose les douze cartes reçues dans une grille.
- Les récompenses du combat sont visibles immédiatement ; les métriques secondaires restent disponibles dans un volet.

Cette refonte ne change ni les règles, ni les quantités de récompenses, ni les clés de sauvegarde.

## Validation

Conserver les parcours fonctionnels et vérifier le rendu sur les captures CI au format 390 × 844, puis sur appareils Android et iPhone. Une compilation ou un test DOM ne vaut pas validation de fidélité visuelle. Réviser les écarts observés avant d’annoncer une correspondance complète avec la maquette.

Les problèmes de contenu déjà identifiés restent distincts : illustrations de cartes manquantes, audio et équilibrage, sauvegarde cloud absente et finalisation de la publication en boutique.
