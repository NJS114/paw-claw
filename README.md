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

## Application mobile et publicités

Google AdMob est intégré avec des annonces de test, des vidéos récompensées facultatives et des interstitiels entre les combats. Les projets Android/iOS et les commandes de compilation sont inclus. Voir [la configuration AdMob](docs/admob.md) pour lancer sur téléphone et renseigner les identifiants de ton compte.
