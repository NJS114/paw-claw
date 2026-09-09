# Paw & Claw

Prototype jouable du jeu de cartes Paw & Claw.

## Lancer le projet

```bash
npm install
npm run dev
```

Le ZIP `paw-claw-assets-optimized.zip` présent à la racine est extrait automatiquement vers `public/assets/generated` avant `npm run dev` et `npm run build`.

## Écrans disponibles

- Accueil paysage
- Combat 7 emplacements
- Collection avec filtres famille / rareté / recherche
- Booster avec tirage de cartes
- Deck builder
- Bibliothèque `assets` affichant tous les visuels générés extraits du ZIP

Les cartes utilisent en priorité leur illustration individuelle lorsqu'elle existe, puis une planche Paw & Claw de leur famille comme visuel de secours.
