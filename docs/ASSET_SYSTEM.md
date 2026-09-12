# Paw & Claw — Asset system

Objectif: chaque écran doit utiliser des assets réutilisables, versionnés et testables afin de garder une identité de jeu mobile cohérente et d'éviter l'effet « site web ».

## Cas où un asset visuel est requis

### Boot / navigation
- Splash de lancement 9:16.
- Fond de chargement / portail.
- Logo principal et emblème patte.
- Icônes de navigation: Accueil, Collection, Combat, Decks, Boutique.
- Icônes secondaires: Missions, Passe, Profil, Paramètres, Messages, Classement, Événements.
- Boutons premium: primaire, secondaire, danger, confirmation, retour.
- Panneaux, cadres, séparateurs, badges et pastilles de notification.

### Lobby
- Fond principal de royaume.
- Duo mascotte Chat + Chien.
- Variantes saisonnières du lobby.
- Bannière d'événement.
- Mission du jour / Pass / Booster gratuit.
- Effets d'ambiance discrets: particules, feuilles, poussière magique, lumières.

### Collection / cartes
- Artwork individuel de chaque carte.
- Frame par rareté: Commune, Rare, Épique, Légendaire, Horreur, spécial premium.
- Icône de chaque famille.
- Icône de coût, ATQ, PV, verrouillage, nouvelle carte, doublon.
- Dos de carte principal + variantes de collection.
- Placeholder d'art manquant.
- Effets foil / holographiques pour les plus hautes raretés.

### Deck builder
- Illustration de deck vide.
- Icônes de courbe de mana / coût.
- Badges de synergie active/inactive.
- Icône Chat / Chien.
- Indicateurs de validation / erreur / copie maximale.
- Cover de deck personnalisable.

### Matchmaking
- Fond de recherche d'adversaire.
- Portrait joueur / rival.
- Halo / cercle de recherche.
- Visuel VS.
- Transition d'entrée dans l'arène.
- État connexion / reconnexion.

### Combat
- Arène 16:9 principale.
- Zones rouge/bleue et emplacements de cartes.
- Pioche joueur / adversaire.
- Dos de cartes adverse.
- Portraits héros et cadres HUD.
- Icônes PV, énergie, Momentum, fatigue, bouclier.
- VFX attaque, soin, armure, bouclier, lore, destruction, fatigue, niveau.
- VFX par famille.
- Marqueur de lane ciblée / sélection / placement valide.
- Effet carte jouée / entrée / mort / sauvegarde Guérisseur.
- Effet fin de tour.
- Effet double KO / égalité.

### Booster
- Pack fermé standard.
- Pack par famille.
- Pack événementiel.
- Dos du pack.
- Ligne de déchirure / lueur d'ouverture.
- Sprite flash / poussière dorée.
- Dos des cartes révélées.
- Halo Commune / Rare / Épique / Légendaire.
- Badge Nouvelle.
- Visuel récapitulatif de fin d'ouverture.

### Progression
- Fond missions.
- Piste Battle Pass.
- Coffres / boosters / pièces / gemmes / récompenses.
- Badge niveau.
- Barre XP.
- Animation level-up.
- Trophées / rangs.

### Boutique
- Vitrines booster.
- Gemmes / pièces.
- Offres limitées.
- Bannière No Ads.
- Pass premium.
- Cosmétiques.
- États achat réussi / erreur / restauration.

### Résultats
- Victoire.
- Défaite.
- Égalité.
- MVP / carte mise en avant.
- Récompenses obtenues.
- Boutons Continuer / Rejouer.

### Histoires / lore
- Background de chaque chapitre.
- Portraits personnages liés.
- Illustration cinématique de scène.
- Cadres de dialogues.
- Icône lien narratif / relation.

### Système / qualité
- Écran offline.
- Reconnexion.
- Maintenance.
- Erreur de chargement asset.
- Placeholder inaccessible / fallback.
- Tutoriel doigt / cible / surbrillance.
- Accessibilité: version contraste élevé si nécessaire.

## Règles de production

- Illustrations: 2D fantasy/cel-shaded, pas 3D plastique, pas rendu photo.
- UI: dark navy + antique gold, contraste élevé, peu de texte incrusté dans les images.
- Tout texte dynamique reste dans le code afin d'être traduisible.
- Ne jamais cuire les valeurs de jeu (PV, ATQ, prix, récompenses) dans une image.
- Assets de fond: WebP, objectif <= 350–500 Ko sur mobile quand possible.
- Icônes/sprites: WebP ou SVG source propriétaire; rendu final net à 24/32/48 px.
- Cibles tactiles: viser au moins 48x48 dp côté Android et tailles confortables côté iOS.
- Respect des safe areas et affichage edge-to-edge.
- Lazy-load des assets non critiques; splash/lobby critiques préchargés.
- `prefers-reduced-motion` doit désactiver les animations décoratives.
- Toujours prévoir fallback et état d'erreur.

## Architecture code

- `src/data/uiAssets.ts`: registre central de tous les assets.
- `src/data/assetTemplates.ts`: briefs réutilisables pour génération.
- `src/GameAsset.tsx`: primitive image avec fallback.
- `src/GameStartup.tsx`: splash / loading.
- `src/game-assets.css`: scènes, animations et intégration mobile.
- `src/data/uiAssets.test.ts`: intégrité du registre et présence des assets obligatoires.
- `src/GameStartup.functional.test.tsx`: test du flux de démarrage.

## Convention de nommage à utiliser pour les prochains fichiers

`ui-<usage>-<variant>.webp`
`bg-<scene>-<variant>.webp`
`char-<species>-<name>-<pose>.webp`
`icon-<family|system>-<name>.webp`
`fx-<effect>-<frame|variant>.webp`
`booster-<family|event>-<front|back>.webp`

Tous les nouveaux assets dédiés doivent d'abord être ajoutés au registre avec `required:false`, puis passer à `required:true` une fois réellement présents dans le ZIP optimisé.
