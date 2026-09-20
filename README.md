# Paw & Claw

Prototype jouable du jeu de cartes Paw & Claw.

Le plan produit complet — direction artistique minimaliste, écrans, histoire, catalogue de 200 héros, évolution, économie, monétisation et feuille de route — se trouve dans [`docs/GAME_DESIGN_BIBLE.md`](docs/GAME_DESIGN_BIBLE.md).

## Lancer le projet

```bash
npm install
npm run dev
```

Le ZIP `paw-claw-assets-optimized.zip` présent à la racine est extrait automatiquement vers `public/assets/generated` avant `npm run dev` et `npm run build`.

## Écrans disponibles

- Accueil mobile portrait
- Combat 7 emplacements
- Collection avec filtres famille / rareté / recherche
- Booster avec tirage de cartes
- Deck builder
- Combinaisons tactiques propres aux 10 groupes, constructions, Pet Tank Robot et raid Pirate
- Capacités d’entrée progressives par rareté et modulées par le rôle de chaque héros
- Interface mobile recalée sur la palette 2D royale des illustrations
- Profils de compétences et cinq paliers de maîtrise pour chaque héros
- Bibliothèque `assets` affichant tous les visuels générés extraits du ZIP

Les cartes utilisent en priorité leur illustration individuelle lorsqu'elle existe, puis une planche Paw & Claw de leur famille comme visuel de secours.
