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

## Préparation mobile Android / iPhone

La version en préparation utilise React + Capacitor. `npm ci`, `npm test`, puis `npm run mobile:sync` préparent les deux projets natifs. Ouvrir avec `npm run mobile:android` ou `npm run mobile:ios` sur un poste disposant des outils de la plateforme.

- [Audit complet et blocages restants](docs/AUDIT_MOBILE.md)
- [Direction artistique chaleureuse](docs/DIRECTION_ARTISTIQUE.md)
- [Builds, essais et sortie Android/iOS](docs/SORTIE_ANDROID_IOS.md)

Cette préparation n’est pas une version boutique finalisée. L’audit d’illustrations identifie encore 58 fichiers manquants ; `npm run release:check` les signale. Les comptes, signatures, tests sur appareils et éléments boutiques restent nécessaires.
