# Assets cartes Paw & Claw

Convention utilisée par le catalogue :

`/public/assets/cards/<famille>/<id>.webp`

Exemples :
- `public/assets/cards/magiciens/mag-001.webp`
- `public/assets/cards/ombres/omb-010.webp`
- `public/assets/cards/nobles/nob-007.webp`

Le fichier `src/data/cards.ts` contient l'identifiant, la famille, la rareté, le type, le coût, ATK/PV, le texte et le nom de la planche source retrouvée dans la bibliothèque Paw & Claw.

Les images manquantes affichent automatiquement un placeholder dans l'application. Dès que les exports PNG/WebP individuels sont déposés ici avec le bon identifiant, ils apparaissent sans autre modification de code.
