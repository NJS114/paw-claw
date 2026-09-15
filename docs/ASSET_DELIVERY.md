# Paw & Claw — suivi de livraison des assets

## Contrat de validation

Une déclaration dans `uiAssets.ts` n'est pas une livraison. Chaque élément traverse
les états **identifié → fichier présent → intégré → tests techniques → contrôle
visuel → validation utilisateur**. Le lot suivant ne commence pas avant validation
du Lobby de référence. Ne pas fusionner le lot Lobby tant que son contrôle visuel
et l'accord utilisateur sont en attente. Ne pas changer les règles, l'économie ou
les sauvegardes pour corriger la présentation.

## Audit de départ (2026-09-15)

Source : `main` au commit `04964bd0bca7dcc12bb92076dc36de8d0f212599`.
Lecture des sources ET du ZIP, import local effectué.

| Élément | Constat vérifié | Traitement prévu |
| --- | --- | --- |
| ZIP source | 119 images, dont `accueil-mockup.webp`, `chaton-mage.webp`, `chien-chevalier.webp` | Réutiliser avant toute nouvelle génération |
| Catalogue UI | 67 entrées au départ, 69 avec les deux sprites Lobby ajoutés | Suivre les fichiers réels et leurs consommateurs |
| Décors principaux | Six SVG provisoires | Remplacer progressivement ; conserver les anciens en secours |
| Visuels déclarés absents | 10 fichiers primaires absents du ZIP | Produire et brancher explicitement, sans compter leurs fallbacks comme des livraisons |
| Cartes actives | 116 cartes ; 56 fichiers produits, 60 absents après import | Cartographier chaque carte avant de redécouper |
| Découpe Nature | Source `15_04_34.webp` observée en 6 colonnes × 4 lignes ; script universel 4 × 2 | Corriger avec coordonnées/identifiants vérifiés, pas avec un découpage uniforme aveugle |
| Association famille | `family.elements` pointe vers cette même planche Nature | Corriger le mapping au lot Collection |
| Personnages distincts | Quatre alias `character.*` utilisent le même PNG du duo | Distinguer réutilisation et personnage dédié ; le Lobby a désormais deux IDs propres |
| Résultats / VFX | `battle.victory`, `.defeat`, `.draw` et les `fx.*` non branchés par `BattleArena` | Préserver les effets CSS existants ; intégrer les nouveaux fichiers au bon état de jeu |
| Bouton Jouer | Texte déjà dans le PNG, doublé par un texte HTML superposé | Doublon retiré ; accessible via nom HTML ; bouton sans texte à produire si localisation complète demandée |

Les 10 fichiers primaires absents : `loading.portal`, `fx.booster-glow`,
`fx.legendary-burst`, `battle.victory`, `battle.defeat`, `battle.draw`,
`fx.attack`, `fx.heal`, `fx.buff`, `fx.lore`.

La présence des 56 découpes NE valide ni leur cadrage, ni leur identité, ni leur
contenu. Le script actuel reste inchangé dans ce lot : ne pas compter ces images
comme des illustrations terminées. Armée et Pirates sont proposés dans les filtres
mais n'ont pas de cartes dans le catalogue actif actuel ; ne pas inventer de cartes
ou modifier les règles pour combler ce manque visuel.

## Direction et spécifications retenues

- Références existantes : maquette `accueil-mockup.webp`, mascottes du ZIP et PNG
  utilisateur ; préserver leurs silhouettes et costumes.
- Illustration 2D fantasy, tons chaleureux, interface bleu nuit et or antique.
- Le nouveau fond de place est un **candidat**, plus ouvert que la maquette ; sa
  cohérence doit être approuvée dans le jeu, pas déduite du seul fichier.
- Fond : paysage, zone centrale recadrable en portrait ; WebP opaque, cible <=500 Ko.
- Personnages : fichiers séparés avec alpha, affichés avec `object-fit:contain`.
- Textes et valeurs dynamiques : HTML ; aucune valeur de jeu dans les nouvelles images.
- Actions : navigation existante, focus clavier visible, zones tactiles >=44 px,
  prise en compte des safe areas et de `prefers-reduced-motion`.
- Ne pas imposer une image raster aux effets simples qui sont déjà mieux gérés en CSS.
- Nouveaux fichiers permanents dans `public/assets/`, hors `generated/` : ce dernier
  est reconstruit depuis le ZIP au démarrage. Ne pas y stocker un nouvel original.

## Lot 1 — Lobby de référence

### Révision après retour visuel utilisateur

La capture du premier candidat a été **refusée visuellement** : décor en bande,
héros trop petits, bandes noires, profil erroné, raccourci booster inadapté et
habillage trop proche d'une interface web. Les tests techniques réussis ne
constituaient pas une validation de fidélité artistique.

La révision V3 se base sur la première image jointe par l'utilisateur (cité royale
dorée avec deux héros au premier plan) ; les planches mobiles guident le reflow
portrait. Elle remplace le décor simplifié par un décor dédié, les deux sprites par
des versions régénérées avec alpha et le titre simple par un emblème isolé.
Le registre garde des fallbacks existants. Les nouveaux originaux de production
sont hors du dossier `generated/`, pour survivre à l'import automatique du ZIP.

- `src/MobileLobby.tsx` : composition plein écran, actions en HTML, profil recadré
  sur le véritable chat, compteur de boosters et expérience issus de la sauvegarde.
- `src/mobile-lobby.css` : scène occupant le viewport, héros agrandis, contrôles
  dorés, dispositions portrait/paysage. En portrait court, un défilement vertical
  est autorisé plutôt que de réduire les zones tactiles.
- `src/LobbyIcon.tsx` : symboles vectoriels sémantiques, sans emoji ni faux pictos.
- `src/ProductionShell.tsx` : utilitaires regroupés dans un menu Options clavier.
- Quête : branchement à `daily-play-3` et à ses compteurs réels ; accès à l'écran
  existant de récupération. Aucune fausse promotion, récompense ou fonctionnalité.

Les trois assets de scène ont été inspectés individuellement. La composition du
jeu V3 **n'est pas encore contrôlée dans un navigateur** : le navigateur de la
session précédente bloquait aussi l'endpoint officiel `terminal.local:4173`.
La capture fournie par l'utilisateur est celle de V2, pas une preuve de V3.
La PR reste en brouillon et la version publique n'est pas remplacée.

La table ci-dessous conserve le bilan historique de V2 ; elle ne valide pas V3.

| Élément | Fichier | Intégré | Tests techniques | Contrôle visuel | Accord utilisateur |
| --- | --- | --- | --- | --- | --- |
| Fond candidat V2 | `public/assets/backgrounds/bg-lobby-day-v2.webp`, 1672×941, 190198 octets | Ancien candidat / fallback | Présence, dimensions, budget, fallback | Capture utilisateur reçue | Refusé |
| Chat | `chaton-mage.webp` du ZIP | Oui, `lobby.hero-cat` | Source distincte et référence vérifiées | En attente | En attente |
| Chien | `chien-chevalier.webp` du ZIP | Oui, `lobby.hero-dog` | Source distincte et référence vérifiées | En attente | En attente |
| Actions / profil / ressources | Assets existants et HTML | Oui | Tests DOM des destinations et valeurs | En attente | En attente |
| Mise en page | `src/mobile-lobby.css` | Grille portrait, paysage bas, écran large | Compilation seulement | En attente | En attente |

La fausse promotion « Festival lunaire / récompenses bonus aujourd'hui » est
remplacée par un accès factuel aux missions et au passe existants. Aucun événement
ni système de bonus n'est ajouté ou prétendu livré.

Vérifications locales : 33 tests réussis (19 unitaires, 14 fonctionnels), build
de production réussi. Les tests DOM ne mesurent pas le layout d'un navigateur.
Le navigateur de cette session refuse `http://127.0.0.1:5173` avec
`ERR_BLOCKED_BY_CLIENT` : aucune capture du jeu ni validation multi-écrans n'est
revendiquée. Lot à garder en branche de travail, sans fusion ni publication.

## Matrice de contrôle visuel obligatoire

| Viewport CSS | Vérifications |
| --- | --- |
| 320×568 et 390×844 | Aucun débordement ; personnages visibles ; actions accessibles ; barre du bas sans recouvrement |
| 844×390 | Paysage bas ; actions accessibles par défilement si nécessaire ; aucun chevauchement |
| 768×1024 | Tablette ; cadrage du fond et taille des mascottes |
| 1440×900 | Écran large ; lisibilité et hiérarchie du Lobby |

À chaque taille : chargement réel des images, test tactile/clavier des boutons,
texte long/grandes monnaies, orientation, préférence de mouvement réduit. Tester
le retour d'un écran interne et l'absence de régression de sauvegarde.

## Ordre fixe des lots suivants (non commencés)

1. **Collection / Decks** : identité de chaque illustration, découpes contrôlées,
   personnages complets, cadres et badges de rareté, états vide/verrouillé,
   filtres, édition et sauvegarde. Ne pas promettre le corps complet à partir
   d'une découpe : la reconstruction nécessite une génération séparée.
2. **Boutique / Boosters / Récompenses** : vitrines, packs réutilisables, ouverture,
   révélation, états nouvelle carte/doublon, récompenses réelles.
3. **Matchmaking / Combat** : décors, portraits distincts, main, pioche, plateau,
   HUD, placements, transitions et VFX raccordés aux événements existants.
4. **Victoire / Défaite / Égalité** : trois visuels dédiés, titres et récompenses
   HTML, poursuite/rejeu et sauvegarde de fin de partie.
5. **Événements / VFX / finitions** : habillage uniquement des fonctions présentes ;
   clarifier toute nouvelle fonctionnalité. États chargement, vide, erreur et
   reprise ; compression et performances ; contrôle complet des parcours.

## Commandes reproductibles

Node >=22.13 (pour `stripTypeScriptTypes` dans l'audit).

```sh
npm install
npm run assets:import
npm run assets:audit
npm run assets:audit -- --json
npm run assets:audit -- --lobby
npm run test:all
npm run build
```

`--strict` échoue volontairement tant qu'il reste des fichiers primaires/cartes
absents ; il ne doit pas être présenté comme passant actuellement. Le mode
normal échoue sur les fichiers obligatoires absents et affiche les autres manques.
Ni l'audit ni les tests ne remplacent le contrôle visuel final.

## Provenance du fond candidat

Généré dans la conversation avec le générateur intégré, puis encodé en WebP
(qualité 88) sans recadrage ni ajout graphique. Les anciennes références restent
intactes. Brief original :

> One standalone 16:9 landscape background for Paw & Claw. Cozy whimsical
> cat-and-dog fantasy village square in daylight, warm cream stone, rounded houses
> at the edges, green trees and a distant arena. Simplified 2D cartoon illustration,
> clean shapes, warm colors, no thick outlines, watercolor, 3D or photorealism.
> Broad empty foreground and centre for separately composited heroes and UI;
> central 45% usable for portrait cropping. No characters, lettering, numbers,
> logos, interface, buttons or card frames.
